import { NextRequest, NextResponse } from "next/server"

interface HtmlData {
  title: string | null
  titleLength: number
  metaDescription: string | null
  metaDescriptionLength: number
  firstH1: string | null
  totalImages: number
  imagesMissingAlt: number
  hasViewport: boolean
  hasCharset: boolean
  canonicalUrl: string | null
  headings: { h1: number; h2: number; h3: number }
}

interface LighthouseScores {
  performance: number | null
  seo: number | null
  accessibility: number | null
}

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

function extractFirst(html: string, regex: RegExp): string | null {
  const match = html.match(regex)
  return match ? match[1].trim() : null
}

function stripTags(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim()
}

function countMatches(html: string, regex: RegExp): number {
  const matches = html.match(regex)
  return matches ? matches.length : 0
}

async function fetchHtmlData(url: string): Promise<HtmlData> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SEOAuditor/1.0; +https://tools.zamdev.me)",
        Accept: "text/html",
      },
      redirect: "follow",
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()

    // Title
    const titleRaw = extractFirst(html, /<title[^>]*>([\s\S]*?)<\/title>/i)
    const title = titleRaw ? stripTags(titleRaw) : null

    // Meta description
    const metaDescription =
      extractFirst(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ??
      extractFirst(html, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i)

    // First H1
    const h1Raw = extractFirst(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i)
    const firstH1 = h1Raw ? stripTags(h1Raw) : null

    // Images
    const imgTags = html.match(/<img[^>]*>/gi) || []
    const totalImages = imgTags.length
    let imagesMissingAlt = 0
    for (const img of imgTags) {
      const hasAlt = /\salt=["']([^"']+)["']/i.test(img)
      if (!hasAlt) imagesMissingAlt++
    }

    // Viewport
    const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html)

    // Charset
    const hasCharset =
      /<meta[^>]+charset[=]/i.test(html) ||
      /<meta[^>]+http-equiv=["']Content-Type["']/i.test(html)

    // Canonical
    const canonicalUrl =
      extractFirst(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i) ??
      extractFirst(html, /<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i)

    // Heading counts
    const h1Count = countMatches(html, /<h1[\s>]/gi)
    const h2Count = countMatches(html, /<h2[\s>]/gi)
    const h3Count = countMatches(html, /<h3[\s>]/gi)

    return {
      title,
      titleLength: title?.length ?? 0,
      metaDescription,
      metaDescriptionLength: metaDescription?.length ?? 0,
      firstH1,
      totalImages,
      imagesMissingAlt,
      hasViewport,
      hasCharset,
      canonicalUrl,
      headings: { h1: h1Count, h2: h2Count, h3: h3Count },
    }
  } finally {
    clearTimeout(timeout)
  }
}

async function fetchLighthouseScores(
  url: string
): Promise<LighthouseScores> {
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=performance&category=seo&category=accessibility`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 60000)

  try {
    const response = await fetch(apiUrl, { signal: controller.signal })

    if (!response.ok) {
      return { performance: null, seo: null, accessibility: null }
    }

    const data = await response.json()
    const categories = data?.lighthouseResult?.categories

    return {
      performance: categories?.performance?.score != null
        ? Math.round(categories.performance.score * 100)
        : null,
      seo: categories?.seo?.score != null
        ? Math.round(categories.seo.score * 100)
        : null,
      accessibility: categories?.accessibility?.score != null
        ? Math.round(categories.accessibility.score * 100)
        : null,
    }
  } catch {
    return { performance: null, seo: null, accessibility: null }
  } finally {
    clearTimeout(timeout)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "A valid URL is required." },
        { status: 400 }
      )
    }

    const trimmedUrl = url.trim()

    if (!isValidUrl(trimmedUrl)) {
      return NextResponse.json(
        { error: "Invalid URL. Please provide a full URL starting with http:// or https://." },
        { status: 400 }
      )
    }

    const [htmlData, lighthouse] = await Promise.all([
      fetchHtmlData(trimmedUrl),
      fetchLighthouseScores(trimmedUrl),
    ])

    return NextResponse.json({
      url: trimmedUrl,
      htmlData,
      lighthouse,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
