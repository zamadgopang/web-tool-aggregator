import { NextRequest, NextResponse } from "next/server"

// Simple in-memory rate limiter for API routes
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const MAX_API_REQUESTS = 30 // 30 requests per hour per IP

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown"
  return ip
}

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(key)

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  entry.count++
  return entry.count > MAX_API_REQUESTS
}

// Periodically clean up expired entries to prevent memory leaks
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}, 5 * 60 * 1000) // Clean every 5 minutes

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rate limiting for API routes
  if (pathname.startsWith("/api/")) {
    const key = getRateLimitKey(request)

    if (isRateLimited(key)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": "3600" } }
      )
    }

    // Block non-POST methods on API routes (prevent CSRF via GET)
    if (request.method !== "POST" && request.method !== "OPTIONS") {
      return NextResponse.json(
        { error: "Method not allowed." },
        { status: 405 }
      )
    }

    // Validate Content-Type for POST requests
    if (request.method === "POST") {
      const contentType = request.headers.get("content-type")
      if (!contentType?.includes("application/json")) {
        return NextResponse.json(
          { error: "Content-Type must be application/json." },
          { status: 415 }
        )
      }
    }
  }

  const response = NextResponse.next()

  // Security headers applied to all responses
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "0") // Modern approach: disable legacy XSS auditor, rely on CSP
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()")
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin")
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin")
  response.headers.set("Cross-Origin-Embedder-Policy", "credentialless")

  // Strict Transport Security (preload-ready)
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")

  // Content Security Policy - tightened
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://unpkg.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob:",
    "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://unpkg.com",
    "frame-ancestors 'none'",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ")

  response.headers.set("Content-Security-Policy", csp)

  return response
}

export const config = {
  matcher: [
    // Apply to all routes except static files and _next
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|manifest.json|robots.txt|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|ico|webp|woff|woff2)).*)",
  ],
}
