import { NextRequest, NextResponse } from "next/server"

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
    const { url } = body

    if (!url || typeof url !== "string" || !isValidUrl(url.trim())) {
      return NextResponse.json(
        { error: "A valid URL is required." },
        { status: 400 }
      )
    }

    const targetUrl = url.trim()
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&category=performance&category=seo&category=accessibility`

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 90000)

    try {
      const response = await fetch(apiUrl, { signal: controller.signal })

      if (!response.ok) {
        return NextResponse.json({
          performance: null,
          seo: null,
          accessibility: null,
          error: `PageSpeed API returned ${response.status}`,
        })
      }

      const data = await response.json()
      const categories = data?.lighthouseResult?.categories

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
        error: "PageSpeed API request timed out after 90 seconds.",
      })
    }

    return NextResponse.json({
      performance: null,
      seo: null,
      accessibility: null,
      error: "Failed to fetch Lighthouse scores.",
    })
  }
}
