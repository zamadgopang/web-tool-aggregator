import { NextRequest, NextResponse } from "next/server"
import * as cheerio from "cheerio"

interface CheerioData {
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

async function fetchHtmlData(url: string): Promise<CheerioData> {
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
    const $ = cheerio.load(html)

    const title = $("title").first().text().trim() || null
    const metaDescription =
      $('meta[name="description"]').attr("content")?.trim() || null
    const firstH1 = $("h1").first().text().trim() || null

    const allImages = $("img")
    const totalImages = allImages.length
    let imagesMissingAlt = 0
    allImages.each((_, el) => {
      const alt = $(el).attr("alt")
      if (alt === undefined || alt.trim() === "") {
        imagesMissingAlt++
      }
    })

    const hasViewport = $('meta[name="viewport"]').length > 0
    const hasCharset =
      $('meta[charset]').length > 0 ||
      $('meta[http-equiv="Content-Type"]').length > 0
    const canonicalUrl = $('link[rel="canonical"]').attr("href") || null

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
      headings: {
        h1: $("h1").length,
        h2: $("h2").length,
        h3: $("h3").length,
      },
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
