import { NextRequest, NextResponse } from "next/server"
import { checkRateLimit } from "@/lib/rate-limit"

export const maxDuration = 30

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
  headings: { h1: number; h2: number; h3: number; h4: number; h5: number; h6: number }
  wordCount: number
  internalLinks: number
  externalLinks: number
  totalLinks: number
  hasOpenGraph: boolean
  ogTags: Record<string, string>
  hasTwitterCard: boolean
  twitterTags: Record<string, string>
  hasStructuredData: boolean
  structuredDataTypes: string[]
  language: string | null
  robotsMeta: string | null
  responseTimeMs: number
  contentLength: number
  securityHeaders: {
    hasHSTS: boolean
    hasCSP: boolean
    hasXFrame: boolean
    hasXContentType: boolean
  }
}

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

    // Block bare IPs that resolve to private ranges (basic numeric check)
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

function extractAllMatches(html: string, regex: RegExp): string[] {
  const results: string[] = []
  let match
  while ((match = regex.exec(html)) !== null) {
    results.push(match[1])
  }
  return results
}

async function fetchHtmlData(url: string): Promise<HtmlData> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)
  const startTime = Date.now()

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SEOAuditor/1.0; +https://tools.zamdev.me)",
        Accept: "text/html",
      },
      redirect: "error",
    })

    const responseTimeMs = Date.now() - startTime

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    // Verify content type is HTML
    const contentType = response.headers.get("content-type") || ""
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      throw new Error("Response is not an HTML document")
    }

    // Security headers
    const securityHeaders = {
      hasHSTS: !!response.headers.get("strict-transport-security"),
      hasCSP: !!response.headers.get("content-security-policy"),
      hasXFrame: !!response.headers.get("x-frame-options"),
      hasXContentType: !!response.headers.get("x-content-type-options"),
    }

    const html = await response.text()

    // Limit response size to prevent memory exhaustion (max 5MB)
    if (html.length > 5 * 1024 * 1024) {
      throw new Error("Page content too large to audit")
    }

    const contentLength = html.length

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
    const headings = {
      h1: countMatches(html, /<h1[\s>]/gi),
      h2: countMatches(html, /<h2[\s>]/gi),
      h3: countMatches(html, /<h3[\s>]/gi),
      h4: countMatches(html, /<h4[\s>]/gi),
      h5: countMatches(html, /<h5[\s>]/gi),
      h6: countMatches(html, /<h6[\s>]/gi),
    }

    // Word count (strip all tags, count words in body)
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    const bodyText = bodyMatch ? stripTags(bodyMatch[1]) : stripTags(html)
    const wordCount = bodyText.split(/\s+/).filter((w) => w.length > 0).length

    // Links
    const parsedUrl = new URL(url)
    const linkHrefs = extractAllMatches(html, /<a[^>]+href=["']([^"'#]*?)["']/gi)
    let internalLinks = 0
    let externalLinks = 0
    for (const href of linkHrefs) {
      if (!href || href.startsWith("javascript") || href.startsWith("mailto")) continue
      try {
        const linkUrl = new URL(href, url)
        if (linkUrl.hostname === parsedUrl.hostname) {
          internalLinks++
        } else {
          externalLinks++
        }
      } catch {
        internalLinks++ // relative links are internal
      }
    }

    // Open Graph tags
    const ogTags: Record<string, string> = {}
    const ogMatches = html.matchAll(/<meta[^>]+property=["'](og:[^"']*)["'][^>]+content=["']([^"']*)["']/gi)
    for (const m of ogMatches) {
      ogTags[m[1]] = m[2]
    }
    // Also check reverse attribute order
    const ogMatches2 = html.matchAll(/<meta[^>]+content=["']([^"']*)["'][^>]+property=["'](og:[^"']*)["']/gi)
    for (const m of ogMatches2) {
      ogTags[m[2]] = m[1]
    }

    // Twitter Card tags
    const twitterTags: Record<string, string> = {}
    const twMatches = html.matchAll(/<meta[^>]+(?:name|property)=["'](twitter:[^"']*)["'][^>]+content=["']([^"']*)["']/gi)
    for (const m of twMatches) {
      twitterTags[m[1]] = m[2]
    }

    // Structured data (JSON-LD)
    const jsonLdBlocks = extractAllMatches(html, /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)
    const structuredDataTypes: string[] = []
    for (const block of jsonLdBlocks) {
      try {
        const parsed = JSON.parse(block)
        if (parsed["@type"]) structuredDataTypes.push(parsed["@type"])
        if (Array.isArray(parsed["@graph"])) {
          for (const item of parsed["@graph"]) {
            if (item["@type"]) structuredDataTypes.push(item["@type"])
          }
        }
      } catch {
        // skip invalid JSON-LD
      }
    }

    // Language
    const language = extractFirst(html, /<html[^>]+lang=["']([^"']*)["']/i)

    // Robots meta
    const robotsMeta =
      extractFirst(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i) ??
      extractFirst(html, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']robots["']/i)

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
      headings,
      wordCount,
      internalLinks,
      externalLinks,
      totalLinks: internalLinks + externalLinks,
      hasOpenGraph: Object.keys(ogTags).length > 0,
      ogTags,
      hasTwitterCard: Object.keys(twitterTags).length > 0,
      twitterTags,
      hasStructuredData: structuredDataTypes.length > 0,
      structuredDataTypes,
      language,
      robotsMeta,
      responseTimeMs,
      contentLength,
      securityHeaders,
    }
  } finally {
    clearTimeout(timeout)
  }
}

export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request)
  if (rateLimited) return rateLimited

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

    if (trimmedUrl.length > 2048) {
      return NextResponse.json(
        { error: "URL is too long. Maximum 2048 characters." },
        { status: 400 }
      )
    }

    if (!isValidUrl(trimmedUrl)) {
      return NextResponse.json(
        { error: "Invalid URL. Please provide a full URL starting with http:// or https://." },
        { status: 400 }
      )
    }

    const htmlData = await fetchHtmlData(trimmedUrl)

    return NextResponse.json({
      url: trimmedUrl,
      htmlData,
    })
  } catch (error) {
    console.error("SEO Audit Error:", error)
    return NextResponse.json({ error: "Failed to audit website. Please check the URL and try again." }, { status: 500 })
  }
}
