import { NextRequest, NextResponse } from "next/server"

// Allow up to 60 seconds for this serverless function (Vercel hobby = 60s max)
export const maxDuration = 60

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, strategy } = body

    if (!url || typeof url !== "string" || !isValidUrl(url.trim())) {
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
        const errorText = await response.text().catch(() => "")
        return NextResponse.json({
          performance: null,
          seo: null,
          accessibility: null,
          strategy: deviceStrategy,
          isQuotaError: response.status === 429,
          error: `PageSpeed API returned HTTP ${response.status}. ${errorText.slice(0, 200)}`,
        })
      }

      const data = await response.json()

      // Check for API-level errors
      if (data.error) {
        return NextResponse.json({
          performance: null,
          seo: null,
          accessibility: null,
          strategy: deviceStrategy,
          error: `PageSpeed API error: ${data.error.message || JSON.stringify(data.error)}`,
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
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json({
        performance: null,
        seo: null,
        accessibility: null,
        error: "PageSpeed API request timed out. Try again or check the URL.",
      })
    }

    return NextResponse.json({
      performance: null,
      seo: null,
      accessibility: null,
      error: error instanceof Error ? `Server error: ${error.message}` : "Failed to fetch Lighthouse scores.",
    })
  }
}

// Also support GET for simple testing
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")
  if (!url) {
    return NextResponse.json({ error: "Provide ?url= parameter" }, { status: 400 })
  }

  // Reuse POST logic
  const fakeRequest = new Request(request.url, {
    method: "POST",
    body: JSON.stringify({ url }),
    headers: { "Content-Type": "application/json" },
  })

  return POST(fakeRequest as NextRequest)
}
