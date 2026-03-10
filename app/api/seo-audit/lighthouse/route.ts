import { NextRequest, NextResponse } from "next/server"

// Allow up to 60 seconds for this serverless function (Vercel hobby = 60s max)
export const maxDuration = 60

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str)
    if (url.protocol !== "http:" && url.protocol !== "https:") return false

    const hostname = url.hostname.toLowerCase()

    // Block private/internal IP ranges and special hostnames
    const blockedPatterns = [
      /^localhost$/i,
      /^127\./,
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[01])\./,
      /^192\.168\./,
      /^169\.254\./,
      /^0\./,
      /^255\./,
      /^\[::1\]$/,
      /^\[fc00:/i,
      /^\[fd/i,
      /^\[fe80:/i,
      /^::1$/,
      /\.local$/i,
      /\.internal$/i,
      /\.localhost$/i,
    ]

    if (blockedPatterns.some(pattern => pattern.test(hostname))) return false

    const ipv4Match = hostname.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/)
    if (ipv4Match) {
      const [, a, b] = ipv4Match.map(Number)
      if (a === 0 || a === 10 || a === 127 || a === 255) return false
      if (a === 172 && b >= 16 && b <= 31) return false
      if (a === 192 && b === 168) return false
      if (a === 169 && b === 254) return false
    }

    return true
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, strategy } = body

    if (!url || typeof url !== "string" || url.trim().length > 2048 || !isValidUrl(url.trim())) {
      return NextResponse.json(
        { error: "A valid URL is required." },
        { status: 400 }
      )
    }

    const targetUrl = url.trim()
    const deviceStrategy = strategy === "desktop" ? "desktop" : "mobile"
    const apiKey = process.env.PAGESPEED_API_KEY
    const keyParam = apiKey ? `&key=${apiKey}` : ""
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&strategy=${deviceStrategy}&category=performance&category=seo&category=accessibility${keyParam}`

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 55000)

    try {
      const response = await fetch(apiUrl, {
        signal: controller.signal,
        headers: {
          "Accept": "application/json",
        },
      })

      if (!response.ok) {
        console.error(`PageSpeed API HTTP ${response.status}`)
        return NextResponse.json({
          performance: null,
          seo: null,
          accessibility: null,
          strategy: deviceStrategy,
          isQuotaError: response.status === 429,
          error: response.status === 429
            ? "Rate limit exceeded. Please try again later."
            : "PageSpeed API request failed. Please try again.",
        })
      }

      const data = await response.json()

      // Check for API-level errors
      if (data.error) {
        console.error("PageSpeed API error:", data.error)
        return NextResponse.json({
          performance: null,
          seo: null,
          accessibility: null,
          strategy: deviceStrategy,
          error: "PageSpeed API encountered an error. Please check the URL and try again.",
        })
      }

      const categories = data?.lighthouseResult?.categories

      // Extract key audit details for richer UI
      const audits = data?.lighthouseResult?.audits || {}
      const metrics: Record<string, number | null> = {}

      // Core Web Vitals
      if (audits["first-contentful-paint"]?.numericValue != null) {
        metrics.fcp = Math.round(audits["first-contentful-paint"].numericValue)
      }
      if (audits["largest-contentful-paint"]?.numericValue != null) {
        metrics.lcp = Math.round(audits["largest-contentful-paint"].numericValue)
      }
      if (audits["total-blocking-time"]?.numericValue != null) {
        metrics.tbt = Math.round(audits["total-blocking-time"].numericValue)
      }
      if (audits["cumulative-layout-shift"]?.numericValue != null) {
        metrics.cls = Math.round(audits["cumulative-layout-shift"].numericValue * 1000) / 1000
      }
      if (audits["speed-index"]?.numericValue != null) {
        metrics.si = Math.round(audits["speed-index"].numericValue)
      }
      if (audits["interactive"]?.numericValue != null) {
        metrics.tti = Math.round(audits["interactive"].numericValue)
      }

      return NextResponse.json({
        performance:
          categories?.performance?.score != null
            ? Math.round(categories.performance.score * 100)
            : null,
        seo:
          categories?.seo?.score != null
            ? Math.round(categories.seo.score * 100)
            : null,
        accessibility:
          categories?.accessibility?.score != null
            ? Math.round(categories.accessibility.score * 100)
            : null,
        strategy: deviceStrategy,
        metrics,
      })
    } finally {
      clearTimeout(timeout)
    }
  } catch (error) {
    console.error("Lighthouse API Error:", error)
    return NextResponse.json({
      performance: null,
      seo: null,
      accessibility: null,
      error: error instanceof Error && error.name === "AbortError"
        ? "PageSpeed API request timed out. Try again or check the URL."
        : "Failed to fetch Lighthouse scores. Please try again.",
    })
  }
}
