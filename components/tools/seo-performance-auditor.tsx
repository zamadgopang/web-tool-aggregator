"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Globe,
  Search,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ImageIcon,
  FileText,
  Tag,
  Heading1,
  Link2,
  Monitor,
  Type,
  Loader2,
  Shield,
  Share2,
  Code2,
  Clock,
  ExternalLink,
  Languages,
  BarChart3,
  Zap,
  Lock,
  Smartphone,
  MonitorSmartphone,
  Activity,
  RefreshCw,
} from "lucide-react"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts"

// ─── Types ────────────────────────────────────────────────────────────

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

interface LighthouseScores {
  performance: number | null
  seo: number | null
  accessibility: number | null
  error?: string
  metrics?: {
    fcp?: number | null
    lcp?: number | null
    tbt?: number | null
    cls?: number | null
    si?: number | null
    tti?: number | null
  }
}

interface AuditResult {
  url: string
  htmlData: HtmlData
}

// ─── Helpers ──────────────────────────────────────────────────────────

function getScoreColor(score: number | null): string {
  if (score === null) return "text-muted-foreground"
  if (score >= 90) return "text-emerald-500"
  if (score >= 50) return "text-amber-500"
  return "text-red-500"
}

function getScoreRingColor(score: number | null): string {
  if (score === null) return "stroke-muted"
  if (score >= 90) return "stroke-emerald-500"
  if (score >= 50) return "stroke-amber-500"
  return "stroke-red-500"
}

function getScoreBg(score: number | null): string {
  if (score === null) return "bg-muted/20"
  if (score >= 90) return "bg-emerald-500/10"
  if (score >= 50) return "bg-amber-500/10"
  return "bg-red-500/10"
}

function getScoreLabel(score: number | null): string {
  if (score === null) return "N/A"
  if (score >= 90) return "Good"
  if (score >= 50) return "Needs Work"
  return "Poor"
}

function computeOverallGrade(html: HtmlData, lh: LighthouseScores | null): { grade: string; color: string; score: number } {
  let points = 0
  let total = 0

  // Title (10 pts)
  total += 10
  if (html.title && html.titleLength >= 30 && html.titleLength <= 60) points += 10
  else if (html.title) points += 5

  // Meta description (10 pts)
  total += 10
  if (html.metaDescription && html.metaDescriptionLength >= 70 && html.metaDescriptionLength <= 160) points += 10
  else if (html.metaDescription) points += 5

  // H1 (5 pts)
  total += 5
  if (html.firstH1 && html.headings.h1 === 1) points += 5
  else if (html.firstH1) points += 3

  // Images alt (10 pts)
  total += 10
  if (html.totalImages === 0) points += 10
  else points += Math.round(((html.totalImages - html.imagesMissingAlt) / html.totalImages) * 10)

  // Viewport (5 pts)
  total += 5
  if (html.hasViewport) points += 5

  // Canonical (5 pts)
  total += 5
  if (html.canonicalUrl) points += 5

  // OG tags (5 pts)
  total += 5
  if (html.hasOpenGraph) points += 5

  // Twitter card (5 pts)
  total += 5
  if (html.hasTwitterCard) points += 5

  // Structured data (5 pts)
  total += 5
  if (html.hasStructuredData) points += 5

  // Security headers (10 pts)
  total += 10
  const sh = html.securityHeaders
  const secCount = [sh.hasHSTS, sh.hasCSP, sh.hasXFrame, sh.hasXContentType].filter(Boolean).length
  points += Math.round((secCount / 4) * 10)

  // Lighthouse scores if available (30 pts)
  if (lh && (lh.performance !== null || lh.seo !== null || lh.accessibility !== null)) {
    total += 30
    const lhScores = [lh.performance, lh.seo, lh.accessibility].filter((s): s is number => s !== null)
    if (lhScores.length > 0) {
      const avg = lhScores.reduce((a, b) => a + b, 0) / lhScores.length
      points += Math.round((avg / 100) * 30)
    }
  }

  const pct = Math.round((points / total) * 100)

  let grade: string
  let color: string
  if (pct >= 95) { grade = "A+"; color = "text-emerald-500" }
  else if (pct >= 90) { grade = "A"; color = "text-emerald-500" }
  else if (pct >= 80) { grade = "B"; color = "text-emerald-400" }
  else if (pct >= 70) { grade = "C"; color = "text-amber-500" }
  else if (pct >= 60) { grade = "D"; color = "text-orange-500" }
  else { grade = "F"; color = "text-red-500" }

  return { grade, color, score: pct }
}

// ─── Fallback Scoring (when Lighthouse API is unavailable) ────────────

function computeFallbackScores(html: HtmlData): LighthouseScores {
  // Estimate Performance (0-100)
  let perf = 0
  // Response time scoring (35 pts)
  if (html.responseTimeMs < 500) perf += 35
  else if (html.responseTimeMs < 1000) perf += 28
  else if (html.responseTimeMs < 2000) perf += 20
  else if (html.responseTimeMs < 3000) perf += 12
  else perf += 5
  // Page size scoring (35 pts)
  const sizeKB = html.contentLength / 1024
  if (sizeKB < 100) perf += 35
  else if (sizeKB < 300) perf += 28
  else if (sizeKB < 500) perf += 22
  else if (sizeKB < 1000) perf += 15
  else perf += 5
  // Image count penalty (15 pts)
  if (html.totalImages === 0) perf += 15
  else if (html.totalImages <= 5) perf += 12
  else if (html.totalImages <= 15) perf += 8
  else if (html.totalImages <= 30) perf += 4
  else perf += 1
  // External resources penalty (15 pts)
  if (html.externalLinks <= 5) perf += 15
  else if (html.externalLinks <= 15) perf += 10
  else if (html.externalLinks <= 30) perf += 5
  else perf += 2

  // Estimate SEO (0-100)
  let seo = 0
  // Title (15 pts)
  if (html.title && html.titleLength >= 30 && html.titleLength <= 60) seo += 15
  else if (html.title) seo += 8
  // Meta description (15 pts)
  if (html.metaDescription && html.metaDescriptionLength >= 70 && html.metaDescriptionLength <= 160) seo += 15
  else if (html.metaDescription) seo += 8
  // H1 (10 pts)
  if (html.firstH1 && html.headings.h1 === 1) seo += 10
  else if (html.firstH1) seo += 5
  // Canonical URL (10 pts)
  if (html.canonicalUrl) seo += 10
  // Language (5 pts)
  if (html.language) seo += 5
  // Viewport (10 pts)
  if (html.hasViewport) seo += 10
  // Images alt text (10 pts)
  if (html.totalImages === 0) seo += 10
  else seo += Math.round(((html.totalImages - html.imagesMissingAlt) / html.totalImages) * 10)
  // Structured data (10 pts)
  if (html.hasStructuredData) seo += 10
  // Robots meta (5 pts)
  if (html.robotsMeta === null || !html.robotsMeta.includes("noindex")) seo += 5
  // Word count - having enough content (10 pts)
  if (html.wordCount >= 300) seo += 10
  else if (html.wordCount >= 100) seo += 5

  // Estimate Accessibility (0-100)
  let a11y = 0
  // Charset (10 pts)
  if (html.hasCharset) a11y += 10
  // Viewport (15 pts)
  if (html.hasViewport) a11y += 15
  // Language attribute (15 pts)
  if (html.language) a11y += 15
  // Title (10 pts)
  if (html.title) a11y += 10
  // Images alt text (25 pts)
  if (html.totalImages === 0) a11y += 25
  else a11y += Math.round(((html.totalImages - html.imagesMissingAlt) / html.totalImages) * 25)
  // Heading hierarchy (15 pts)
  if (html.headings.h1 >= 1 && html.headings.h2 >= 1) a11y += 15
  else if (html.headings.h1 >= 1) a11y += 8
  // Structured data (10 pts)
  if (html.hasStructuredData) a11y += 10

  return {
    performance: Math.min(perf, 100),
    seo: Math.min(seo, 100),
    accessibility: Math.min(a11y, 100),
  }
}

// ─── Animated Counter ─────────────────────────────────────────────────

function AnimatedNumber({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    const startTime = performance.now()

    function animate(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      start = Math.round(eased * end)
      setDisplay(start)
      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [value, duration])

  return <>{display}</>
}

// ─── Score Circle ─────────────────────────────────────────────────────

function ScoreCircle({ score, label }: { score: number | null; label: string }) {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const [animatedOffset, setAnimatedOffset] = useState(circumference)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedOffset(
        score !== null ? circumference - (score / 100) * circumference : circumference
      )
    }, 100)
    return () => clearTimeout(timer)
  }, [score, circumference])

  return (
    <div
      className={`flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-4 rounded-xl transition-all duration-500 ${getScoreBg(score)}`}
      role="meter"
      aria-valuenow={score ?? undefined}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${label}: ${score !== null ? `${score} out of 100` : "unavailable"}`}
    >
      <div className="relative w-16 h-16 sm:w-24 sm:h-24">
        <svg className="w-16 h-16 sm:w-24 sm:h-24 -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r={radius} fill="none" strokeWidth="8" className="stroke-muted/30" />
          <circle
            cx="50" cy="50" r={radius} fill="none" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={animatedOffset}
            className={`${getScoreRingColor(score)} transition-all duration-[1500ms] ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg sm:text-2xl font-bold ${getScoreColor(score)}`}>
            {score !== null ? <AnimatedNumber value={score} /> : "—"}
          </span>
        </div>
      </div>
      <span className="text-xs sm:text-sm font-semibold text-center">{label}</span>
      <Badge variant={score !== null && score >= 90 ? "default" : score !== null && score >= 50 ? "secondary" : "destructive"} className="text-[10px]">
        {getScoreLabel(score)}
      </Badge>
    </div>
  )
}

// ─── Status & Checks ─────────────────────────────────────────────────

type CheckStatus = "good" | "warning" | "error" | "info"

interface CheckItem {
  icon: React.ReactNode
  label: string
  detail: string
  status: CheckStatus
}

function StatusIcon({ status }: { status: CheckStatus }) {
  switch (status) {
    case "good": return <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
    case "warning": return <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
    case "error": return <XCircle className="h-4 w-4 text-red-500 shrink-0" />
    default: return <CheckCircle className="h-4 w-4 text-blue-500 shrink-0" />
  }
}

function statusBg(status: CheckStatus) {
  switch (status) {
    case "good": return "bg-emerald-500/5 hover:bg-emerald-500/10"
    case "warning": return "bg-amber-500/5 hover:bg-amber-500/10"
    case "error": return "bg-red-500/5 hover:bg-red-500/10"
    default: return "bg-blue-500/5 hover:bg-blue-500/10"
  }
}

function buildSeoChecks(data: HtmlData): CheckItem[] {
  const checks: CheckItem[] = []

  if (!data.title) {
    checks.push({ icon: <FileText className="h-4 w-4 shrink-0" />, label: "Title Tag", detail: "Missing! Add a <title> tag for SEO.", status: "error" })
  } else if (data.titleLength < 30) {
    checks.push({ icon: <FileText className="h-4 w-4 shrink-0" />, label: "Title Tag", detail: `Too short (${data.titleLength} chars). Aim for 50–60 characters.`, status: "warning" })
  } else if (data.titleLength > 60) {
    checks.push({ icon: <FileText className="h-4 w-4 shrink-0" />, label: "Title Tag", detail: `Too long (${data.titleLength} chars). May be truncated in search results.`, status: "warning" })
  } else {
    checks.push({ icon: <FileText className="h-4 w-4 shrink-0" />, label: "Title Tag", detail: `Good length (${data.titleLength} chars): "${data.title}"`, status: "good" })
  }

  if (!data.metaDescription) {
    checks.push({ icon: <Tag className="h-4 w-4 shrink-0" />, label: "Meta Description", detail: "Missing! Add a meta description for better CTR.", status: "error" })
  } else if (data.metaDescriptionLength < 70) {
    checks.push({ icon: <Tag className="h-4 w-4 shrink-0" />, label: "Meta Description", detail: `Too short (${data.metaDescriptionLength} chars). Aim for 150–160.`, status: "warning" })
  } else if (data.metaDescriptionLength > 160) {
    checks.push({ icon: <Tag className="h-4 w-4 shrink-0" />, label: "Meta Description", detail: `Too long (${data.metaDescriptionLength} chars). May be truncated.`, status: "warning" })
  } else {
    checks.push({ icon: <Tag className="h-4 w-4 shrink-0" />, label: "Meta Description", detail: `Good length (${data.metaDescriptionLength} chars).`, status: "good" })
  }

  if (!data.firstH1) {
    checks.push({ icon: <Heading1 className="h-4 w-4 shrink-0" />, label: "H1 Heading", detail: "No <h1> found. Every page should have one primary heading.", status: "error" })
  } else if (data.headings.h1 > 1) {
    checks.push({ icon: <Heading1 className="h-4 w-4 shrink-0" />, label: "H1 Heading", detail: `Multiple H1 tags found (${data.headings.h1}). Use only one.`, status: "warning" })
  } else {
    checks.push({ icon: <Heading1 className="h-4 w-4 shrink-0" />, label: "H1 Heading", detail: `Found: "${data.firstH1}"`, status: "good" })
  }

  if (data.totalImages === 0) {
    checks.push({ icon: <ImageIcon className="h-4 w-4 shrink-0" />, label: "Images", detail: "No images detected on the page.", status: "info" })
  } else if (data.imagesMissingAlt > 0) {
    checks.push({
      icon: <ImageIcon className="h-4 w-4 shrink-0" />, label: "Image Alt Text",
      detail: `${data.imagesMissingAlt} of ${data.totalImages} images missing alt text.`,
      status: data.imagesMissingAlt > data.totalImages / 2 ? "error" : "warning",
    })
  } else {
    checks.push({ icon: <ImageIcon className="h-4 w-4 shrink-0" />, label: "Image Alt Text", detail: `All ${data.totalImages} images have alt attributes.`, status: "good" })
  }

  checks.push({
    icon: <Link2 className="h-4 w-4 shrink-0" />, label: "Canonical URL",
    detail: data.canonicalUrl ? `Set to: ${data.canonicalUrl}` : "No canonical URL. Add one to avoid duplicate content.",
    status: data.canonicalUrl ? "good" : "warning",
  })

  checks.push({
    icon: <Languages className="h-4 w-4 shrink-0" />, label: "Language Attribute",
    detail: data.language ? `Language set to "${data.language}".` : "No lang attribute on <html>. Add it for accessibility.",
    status: data.language ? "good" : "warning",
  })

  checks.push({
    icon: <Code2 className="h-4 w-4 shrink-0" />, label: "Robots Meta",
    detail: data.robotsMeta ? `Robots: ${data.robotsMeta}` : "No robots meta tag (defaults to index, follow).",
    status: "info",
  })

  return checks
}

function buildSocialChecks(data: HtmlData): CheckItem[] {
  const checks: CheckItem[] = []

  checks.push({
    icon: <Share2 className="h-4 w-4 shrink-0" />, label: "Open Graph Tags",
    detail: data.hasOpenGraph
      ? `Found: ${Object.keys(data.ogTags).join(", ")}`
      : "No Open Graph tags. Social shares will lack rich previews.",
    status: data.hasOpenGraph ? "good" : "error",
  })

  checks.push({
    icon: <Share2 className="h-4 w-4 shrink-0" />, label: "Twitter Card",
    detail: data.hasTwitterCard
      ? `Found: ${Object.keys(data.twitterTags).join(", ")}`
      : "No Twitter Card tags. Tweets linking to this page won't show rich cards.",
    status: data.hasTwitterCard ? "good" : "warning",
  })

  checks.push({
    icon: <Code2 className="h-4 w-4 shrink-0" />, label: "Structured Data (JSON-LD)",
    detail: data.hasStructuredData
      ? `Found types: ${data.structuredDataTypes.join(", ")}`
      : "No JSON-LD structured data. Add schema markup for rich snippets.",
    status: data.hasStructuredData ? "good" : "warning",
  })

  return checks
}

function buildTechnicalChecks(data: HtmlData): CheckItem[] {
  const checks: CheckItem[] = []

  checks.push({
    icon: <Monitor className="h-4 w-4 shrink-0" />, label: "Viewport Meta",
    detail: data.hasViewport ? "Present — page is mobile-friendly." : "Missing! Page may not render well on mobile.",
    status: data.hasViewport ? "good" : "error",
  })

  checks.push({
    icon: <Type className="h-4 w-4 shrink-0" />, label: "Character Encoding",
    detail: data.hasCharset ? "Character encoding declared." : "No charset declaration found.",
    status: data.hasCharset ? "good" : "warning",
  })

  checks.push({
    icon: <Clock className="h-4 w-4 shrink-0" />, label: "Response Time",
    detail: `Server responded in ${data.responseTimeMs}ms.`,
    status: data.responseTimeMs < 500 ? "good" : data.responseTimeMs < 2000 ? "warning" : "error",
  })

  const sh = data.securityHeaders
  checks.push({
    icon: <Lock className="h-4 w-4 shrink-0" />, label: "HSTS Header",
    detail: sh.hasHSTS ? "Strict-Transport-Security header present." : "Missing HSTS header. Enable HTTPS enforcement.",
    status: sh.hasHSTS ? "good" : "warning",
  })
  checks.push({
    icon: <Shield className="h-4 w-4 shrink-0" />, label: "Content Security Policy",
    detail: sh.hasCSP ? "CSP header present." : "No CSP header. Consider adding one for XSS protection.",
    status: sh.hasCSP ? "good" : "warning",
  })
  checks.push({
    icon: <Shield className="h-4 w-4 shrink-0" />, label: "X-Frame-Options",
    detail: sh.hasXFrame ? "X-Frame-Options present (clickjacking protection)." : "Missing X-Frame-Options header.",
    status: sh.hasXFrame ? "good" : "warning",
  })
  checks.push({
    icon: <Shield className="h-4 w-4 shrink-0" />, label: "X-Content-Type-Options",
    detail: sh.hasXContentType ? "X-Content-Type-Options: nosniff is set." : "Missing X-Content-Type-Options header.",
    status: sh.hasXContentType ? "good" : "warning",
  })

  return checks
}

// ─── Stat Card ────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border bg-card p-3 sm:p-4 flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-2 duration-500" role="group" aria-label={`${label}: ${value}${sub ? `, ${sub}` : ""}`}>
      <div className="flex items-center gap-2 text-muted-foreground">
        <span aria-hidden="true">{icon}</span>
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-xl sm:text-2xl font-bold tracking-tight">
        {typeof value === "number" ? <AnimatedNumber value={value} /> : value}
      </p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  )
}

// ─── Check List Section ───────────────────────────────────────────────

function CheckList({ checks }: { checks: CheckItem[] }) {
  return (
    <div className="space-y-2" role="list" aria-label="Audit checks">
      {checks.map((check, i) => (
        <div
          key={i}
          className={`flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg transition-all duration-300 ${statusBg(check.status)}`}
          style={{ animationDelay: `${i * 60}ms` }}
          role="listitem"
        >
          <StatusIcon status={check.status} />
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
              <span aria-hidden="true">{check.icon}</span>
              {check.label}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 break-words">{check.detail}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Length Indicator Bar ─────────────────────────────────────────────

function LengthBar({ value, min, ideal, max, label }: { value: number; min: number; ideal: number; max: number; label: string }) {
  const pct = Math.min((value / (max * 1.2)) * 100, 100)
  const isGood = value >= min && value <= max
  const color = isGood ? "bg-emerald-500" : value < min ? "bg-amber-500" : "bg-red-500"

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-medium">{value} chars</span>
      </div>
      <div className="relative h-2 rounded-full bg-muted/40 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`} style={{ width: `${pct}%` }} />
        {/* Ideal zone markers */}
        <div className="absolute top-0 h-full border-l border-dashed border-emerald-500/50" style={{ left: `${(min / (max * 1.2)) * 100}%` }} />
        <div className="absolute top-0 h-full border-l border-dashed border-emerald-500/50" style={{ left: `${(max / (max * 1.2)) * 100}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>0</span>
        <span className="text-emerald-500">{min}–{ideal} ideal</span>
        <span>{max}+</span>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────

export function SeoPerformanceAuditor() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AuditResult | null>(null)
  const [lighthouse, setLighthouse] = useState<LighthouseScores | null>(null)
  const [lighthouseLoading, setLighthouseLoading] = useState(false)
  const [lighthouseError, setLighthouseError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [scanPhase, setScanPhase] = useState(0)
  const [strategy, setStrategy] = useState<"mobile" | "desktop">("mobile")
  const [isEstimated, setIsEstimated] = useState(false)

  const scanMessages = [
    "Connecting to server...",
    "Downloading HTML document...",
    "Analyzing meta tags & headings...",
    "Scanning images & links...",
    "Checking security headers...",
    "Detecting structured data...",
    "Finalizing report...",
  ]

  useEffect(() => {
    if (!loading) { setScanPhase(0); return }
    const interval = setInterval(() => {
      setScanPhase((p) => (p < scanMessages.length - 1 ? p + 1 : p))
    }, 1500)
    return () => clearInterval(interval)
  }, [loading, scanMessages.length])

  const fetchLighthouseScores = useCallback(async (targetUrl: string, deviceStrategy: string) => {
    setLighthouseLoading(true)
    setLighthouse(null)
    setLighthouseError(null)
    setIsEstimated(false)
    try {
      const response = await fetch("/api/seo-audit/lighthouse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl, strategy: deviceStrategy }),
      })
      const data = await response.json()
      if (data.error && data.performance === null && data.seo === null && data.accessibility === null) {
        // API failed — use fallback scoring from HTML data if available
        if (result?.htmlData) {
          const fallback = computeFallbackScores(result.htmlData)
          setLighthouse(fallback)
          setIsEstimated(true)
          setLighthouseError(data.isQuotaError
            ? "Google PageSpeed API quota exceeded. Showing estimated scores based on HTML analysis."
            : "Lighthouse unavailable. Showing estimated scores based on HTML analysis."
          )
        } else {
          setLighthouseError(data.error)
          setLighthouse({ performance: null, seo: null, accessibility: null })
        }
      } else {
        setLighthouse({
          performance: data.performance ?? null,
          seo: data.seo ?? null,
          accessibility: data.accessibility ?? null,
          metrics: data.metrics ?? undefined,
        })
      }
    } catch (err) {
      // Network error — use fallback scoring if HTML data available
      if (result?.htmlData) {
        const fallback = computeFallbackScores(result.htmlData)
        setLighthouse(fallback)
        setIsEstimated(true)
        setLighthouseError("Network error. Showing estimated scores based on HTML analysis.")
      } else {
        setLighthouseError(err instanceof Error ? err.message : "Network error fetching Lighthouse scores.")
        setLighthouse({ performance: null, seo: null, accessibility: null })
      }
    } finally {
      setLighthouseLoading(false)
    }
  }, [result])

  const handleRetryLighthouse = () => {
    if (result?.url) {
      fetchLighthouseScores(result.url, strategy)
    }
  }

  const handleAudit = async () => {
    let targetUrl = url.trim()
    if (!targetUrl) return
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`
      setUrl(targetUrl)
    }

    setLoading(true)
    setResult(null)
    setLighthouse(null)
    setError(null)
    setIsEstimated(false)

    try {
      const response = await fetch("/api/seo-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      })
      const data = await response.json()
      if (!response.ok) { setError(data.error || "Failed to audit the website."); return }
      setResult(data)
      fetchLighthouseScores(targetUrl, strategy)
    } catch {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) handleAudit()
  }

  const overallGrade = result ? computeOverallGrade(result.htmlData, lighthouse) : null

  // Chart data
  const radarData = lighthouse ? [
    { metric: "Performance", score: lighthouse.performance ?? 0 },
    { metric: "SEO", score: lighthouse.seo ?? 0 },
    { metric: "Accessibility", score: lighthouse.accessibility ?? 0 },
  ] : []

  const headingData = result ? [
    { name: "H1", count: result.htmlData.headings.h1, fill: "#10b981" },
    { name: "H2", count: result.htmlData.headings.h2, fill: "#3b82f6" },
    { name: "H3", count: result.htmlData.headings.h3, fill: "#8b5cf6" },
    { name: "H4", count: result.htmlData.headings.h4, fill: "#f59e0b" },
    { name: "H5", count: result.htmlData.headings.h5, fill: "#ec4899" },
    { name: "H6", count: result.htmlData.headings.h6, fill: "#6b7280" },
  ].filter((h) => h.count > 0) : []

  return (
    <div className="w-full max-w-5xl mx-auto px-3 py-4 sm:p-4">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <div className="p-2 rounded-lg bg-primary/10" aria-hidden="true">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                Website SEO & Performance Auditor
              </CardTitle>
              <CardDescription className="mt-2">
                Comprehensive analysis of SEO health, performance, security, social tags, and accessibility.
              </CardDescription>
            </div>
            {overallGrade && !loading && (
              <div className="text-center animate-in zoom-in duration-500" role="status" aria-label={`Overall grade: ${overallGrade.grade}, score: ${overallGrade.score}%`}>
                <div className={`text-4xl sm:text-5xl font-black ${overallGrade.color}`}>{overallGrade.grade}</div>
                <p className="text-xs text-muted-foreground mt-1">Overall Score: {overallGrade.score}%</p>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          {/* URL Input */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Input
                placeholder="example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                className="pl-9"
                aria-label="Website URL to audit"
                type="url"
                autoComplete="url"
              />
            </div>
            <Button onClick={handleAudit} disabled={loading || !url.trim()} size="lg" className="w-full sm:w-auto">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" /> : <Search className="h-4 w-4 mr-2" aria-hidden="true" />}
              {loading ? "Scanning..." : "Run Audit"}
            </Button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-10 sm:py-16 gap-4 sm:gap-6 animate-in fade-in duration-300" role="status" aria-label="Scanning website">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-muted animate-spin border-t-primary" />
                <div className="absolute inset-2 w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-muted animate-spin border-b-primary/50" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
              </div>
              <div className="text-center space-y-2">
                <p className="font-semibold text-base sm:text-lg">Scanning website architecture...</p>
                <p className="text-xs sm:text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-1 duration-300" key={scanPhase}>
                  {scanMessages[scanPhase]}
                </p>
              </div>
              <div className="flex gap-1" aria-hidden="true">
                {scanMessages.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i <= scanPhase ? "bg-primary scale-100" : "bg-muted scale-75"}`} />
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 sm:p-5 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300" role="alert">
              <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-destructive">Audit Failed</p>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* URL badge */}
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="gap-1.5 px-3 py-1">
                  <Globe className="h-3 w-3" />
                  {result.url}
                  <ExternalLink className="h-3 w-3 ml-1 opacity-50" />
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Clock className="h-3 w-3" />
                  {result.htmlData.responseTimeMs}ms
                </Badge>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard icon={<FileText className="h-4 w-4" />} label="Word Count" value={result.htmlData.wordCount} />
                <StatCard icon={<Link2 className="h-4 w-4" />} label="Total Links" value={result.htmlData.totalLinks} sub={`${result.htmlData.internalLinks} internal · ${result.htmlData.externalLinks} external`} />
                <StatCard icon={<ImageIcon className="h-4 w-4" />} label="Images" value={result.htmlData.totalImages} sub={result.htmlData.imagesMissingAlt > 0 ? `${result.htmlData.imagesMissingAlt} missing alt` : "All have alt text"} />
                <StatCard icon={<Zap className="h-4 w-4" />} label="Page Size" value={`${Math.round(result.htmlData.contentLength / 1024)}KB`} sub="HTML document size" />
              </div>

              {/* Lighthouse Scores */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        {isEstimated ? "Estimated Scores" : "Lighthouse Scores"}
                        {isEstimated && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30">
                            Estimated
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{isEstimated ? "Based on HTML analysis" : "Google PageSpeed Insights"}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Strategy Toggle */}
                      <div className="flex items-center rounded-lg border bg-muted/30 p-0.5" role="radiogroup" aria-label="Analysis device type">
                        <button
                          onClick={() => { setStrategy("mobile"); if (result) fetchLighthouseScores(result.url, "mobile") }}
                          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${strategy === "mobile" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                          role="radio"
                          aria-checked={strategy === "mobile"}
                          disabled={lighthouseLoading}
                        >
                          <Smartphone className="h-3.5 w-3.5" />
                          Mobile
                        </button>
                        <button
                          onClick={() => { setStrategy("desktop"); if (result) fetchLighthouseScores(result.url, "desktop") }}
                          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${strategy === "desktop" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                          role="radio"
                          aria-checked={strategy === "desktop"}
                          disabled={lighthouseLoading}
                        >
                          <MonitorSmartphone className="h-3.5 w-3.5" />
                          Desktop
                        </button>
                      </div>
                      {lighthouseLoading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {lighthouseLoading && (
                    <div className="flex flex-col items-center justify-center py-8 sm:py-10 gap-4" role="status" aria-label="Loading Lighthouse scores">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full border-[3px] border-muted animate-spin border-t-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Fetching Lighthouse scores ({strategy})...</p>
                        <p className="text-xs text-muted-foreground mt-1">This can take 30-60 seconds</p>
                      </div>
                    </div>
                  )}
                  {!lighthouseLoading && lighthouse && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                      <div className="grid grid-cols-3 gap-2 sm:gap-3" role="group" aria-label="Lighthouse scores">
                        <ScoreCircle score={lighthouse.performance} label="Performance" />
                        <ScoreCircle score={lighthouse.seo} label="SEO" />
                        <ScoreCircle score={lighthouse.accessibility} label="Accessibility" />
                      </div>

                      {/* Estimated scores info banner */}
                      {isEstimated && lighthouseError && (
                        <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-3">
                          <div className="flex items-start gap-2">
                            <Activity className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <p className="font-medium text-blue-600 dark:text-blue-400">Scores estimated from HTML analysis</p>
                              <p className="text-muted-foreground mt-1">{lighthouseError}</p>
                            </div>
                          </div>
                          <div className="mt-2 flex justify-end">
                            <Button variant="outline" size="sm" onClick={handleRetryLighthouse} className="gap-2 h-7 text-xs">
                              <RefreshCw className="h-3 w-3" />
                              Retry Lighthouse
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Core Web Vitals */}
                      {lighthouse.metrics && Object.keys(lighthouse.metrics).length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Activity className="h-4 w-4 text-primary" />
                            Core Web Vitals
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {lighthouse.metrics.fcp != null && (
                              <div className="rounded-lg border p-3 space-y-1">
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">FCP</p>
                                <p className={`text-lg font-bold ${lighthouse.metrics.fcp < 1800 ? "text-emerald-500" : lighthouse.metrics.fcp < 3000 ? "text-amber-500" : "text-red-500"}`}>
                                  {(lighthouse.metrics.fcp / 1000).toFixed(1)}s
                                </p>
                                <p className="text-[10px] text-muted-foreground">First Contentful Paint</p>
                              </div>
                            )}
                            {lighthouse.metrics.lcp != null && (
                              <div className="rounded-lg border p-3 space-y-1">
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">LCP</p>
                                <p className={`text-lg font-bold ${lighthouse.metrics.lcp < 2500 ? "text-emerald-500" : lighthouse.metrics.lcp < 4000 ? "text-amber-500" : "text-red-500"}`}>
                                  {(lighthouse.metrics.lcp / 1000).toFixed(1)}s
                                </p>
                                <p className="text-[10px] text-muted-foreground">Largest Contentful Paint</p>
                              </div>
                            )}
                            {lighthouse.metrics.tbt != null && (
                              <div className="rounded-lg border p-3 space-y-1">
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">TBT</p>
                                <p className={`text-lg font-bold ${lighthouse.metrics.tbt < 200 ? "text-emerald-500" : lighthouse.metrics.tbt < 600 ? "text-amber-500" : "text-red-500"}`}>
                                  {lighthouse.metrics.tbt}ms
                                </p>
                                <p className="text-[10px] text-muted-foreground">Total Blocking Time</p>
                              </div>
                            )}
                            {lighthouse.metrics.cls != null && (
                              <div className="rounded-lg border p-3 space-y-1">
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">CLS</p>
                                <p className={`text-lg font-bold ${lighthouse.metrics.cls < 0.1 ? "text-emerald-500" : lighthouse.metrics.cls < 0.25 ? "text-amber-500" : "text-red-500"}`}>
                                  {lighthouse.metrics.cls.toFixed(3)}
                                </p>
                                <p className="text-[10px] text-muted-foreground">Cumulative Layout Shift</p>
                              </div>
                            )}
                            {lighthouse.metrics.si != null && (
                              <div className="rounded-lg border p-3 space-y-1">
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">SI</p>
                                <p className={`text-lg font-bold ${lighthouse.metrics.si < 3400 ? "text-emerald-500" : lighthouse.metrics.si < 5800 ? "text-amber-500" : "text-red-500"}`}>
                                  {(lighthouse.metrics.si / 1000).toFixed(1)}s
                                </p>
                                <p className="text-[10px] text-muted-foreground">Speed Index</p>
                              </div>
                            )}
                            {lighthouse.metrics.tti != null && (
                              <div className="rounded-lg border p-3 space-y-1">
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">TTI</p>
                                <p className={`text-lg font-bold ${lighthouse.metrics.tti < 3800 ? "text-emerald-500" : lighthouse.metrics.tti < 7300 ? "text-amber-500" : "text-red-500"}`}>
                                  {(lighthouse.metrics.tti / 1000).toFixed(1)}s
                                </p>
                                <p className="text-[10px] text-muted-foreground">Time to Interactive</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Radar Chart - hidden on very small screens */}
                      {(lighthouse.performance !== null || lighthouse.seo !== null || lighthouse.accessibility !== null) && (
                        <div className="hidden sm:flex items-center justify-center" aria-label="Lighthouse scores radar chart">
                          <ResponsiveContainer width="100%" height={220}>
                            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                              <PolarGrid stroke="hsl(var(--muted))" />
                              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                              <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      )}

                      {/* Error + Retry for Lighthouse */}
                      {lighthouse.performance === null && lighthouse.seo === null && lighthouse.accessibility === null && (
                        <div className="flex flex-col items-center gap-3 py-2" role="alert">
                          {lighthouseError ? (
                            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 w-full">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                <div className="text-xs">
                                  <p className="font-medium text-amber-600 dark:text-amber-400">Lighthouse scores could not be loaded</p>
                                  <p className="text-muted-foreground mt-1">{lighthouseError}</p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground text-center">
                              Lighthouse scores unavailable.
                            </p>
                          )}
                          <Button variant="outline" size="sm" onClick={handleRetryLighthouse} className="gap-2">
                            <RefreshCw className="h-3.5 w-3.5" />
                            Retry Lighthouse
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tabbed Details */}
              <Tabs defaultValue="seo" className="w-full">
                <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 h-auto">
                  <TabsTrigger value="seo" className="gap-1.5 text-xs sm:text-sm py-2"><Search className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /><span className="truncate">SEO</span></TabsTrigger>
                  <TabsTrigger value="social" className="gap-1.5 text-xs sm:text-sm py-2"><Share2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /><span className="truncate">Social</span></TabsTrigger>
                  <TabsTrigger value="technical" className="gap-1.5 text-xs sm:text-sm py-2"><Shield className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /><span className="truncate">Technical</span></TabsTrigger>
                  <TabsTrigger value="structure" className="gap-1.5 text-xs sm:text-sm py-2"><BarChart3 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /><span className="truncate">Structure</span></TabsTrigger>
                </TabsList>

                {/* SEO Tab */}
                <TabsContent value="seo" className="mt-4 space-y-4">
                  {/* Length bars */}
                  {result.htmlData.title && (
                    <Card>
                      <CardContent className="pt-4 space-y-4">
                        <LengthBar value={result.htmlData.titleLength} min={30} ideal={55} max={60} label="Title Length" />
                        {result.htmlData.metaDescription && (
                          <LengthBar value={result.htmlData.metaDescriptionLength} min={70} ideal={155} max={160} label="Description Length" />
                        )}
                      </CardContent>
                    </Card>
                  )}
                  <CheckList checks={buildSeoChecks(result.htmlData)} />
                </TabsContent>

                {/* Social Tab */}
                <TabsContent value="social" className="mt-4 space-y-4">
                  <CheckList checks={buildSocialChecks(result.htmlData)} />
                  {/* OG Preview */}
                  {result.htmlData.hasOpenGraph && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Open Graph Preview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">{new URL(result.url).hostname}</p>
                          <p className="font-semibold text-sm line-clamp-2">{result.htmlData.ogTags["og:title"] || result.htmlData.title || "No title"}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{result.htmlData.ogTags["og:description"] || result.htmlData.metaDescription || "No description"}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Technical Tab */}
                <TabsContent value="technical" className="mt-4 space-y-4">
                  {/* Security score visual */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        Security Headers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3" role="group" aria-label="Security headers status">
                        {([
                          ["HSTS", result.htmlData.securityHeaders.hasHSTS],
                          ["CSP", result.htmlData.securityHeaders.hasCSP],
                          ["X-Frame", result.htmlData.securityHeaders.hasXFrame],
                          ["X-Content-Type", result.htmlData.securityHeaders.hasXContentType],
                        ] as [string, boolean][]).map(([name, present]) => (
                          <div key={name} className={`rounded-lg p-3 text-center transition-all ${present ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-red-500/5 border border-red-500/20"}`} role="status" aria-label={`${name}: ${present ? "present" : "missing"}`}>
                            {present ? <CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" aria-hidden="true" /> : <XCircle className="h-5 w-5 text-red-400 mx-auto" aria-hidden="true" />}
                            <p className="text-xs font-medium mt-1.5">{name}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <CheckList checks={buildTechnicalChecks(result.htmlData)} />
                </TabsContent>

                {/* Structure Tab */}
                <TabsContent value="structure" className="mt-4 space-y-4">
                  {/* Heading Distribution Chart */}
                  {headingData.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Heading1 className="h-4 w-4 text-primary" />
                          Heading Distribution
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={headingData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--background))" }} />
                            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                              {headingData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  )}

                  {/* Link Breakdown */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Link2 className="h-4 w-4 text-primary" />
                        Link Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Internal Links</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 rounded-full bg-blue-500" style={{ width: Math.max(result.htmlData.internalLinks * 3, 8) }} />
                          <span className="text-sm font-bold">{result.htmlData.internalLinks}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">External Links</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 rounded-full bg-purple-500" style={{ width: Math.max(result.htmlData.externalLinks * 3, 8) }} />
                          <span className="text-sm font-bold">{result.htmlData.externalLinks}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Heading hierarchy */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Heading Hierarchy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1.5">
                        {(["h1", "h2", "h3", "h4", "h5", "h6"] as const).map((tag) => {
                          const count = result.htmlData.headings[tag]
                          if (count === 0) return null
                          const indent = { h1: 0, h2: 1, h3: 2, h4: 3, h5: 4, h6: 5 }[tag]
                          return (
                            <div key={tag} className="flex items-center gap-2" style={{ paddingLeft: indent * 16 }}>
                              <Badge variant={tag === "h1" ? "default" : "secondary"} className="font-mono text-[10px] w-8 justify-center">
                                {tag.toUpperCase()}
                              </Badge>
                              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                                <div className="h-full rounded-full bg-primary/60 transition-all duration-1000" style={{ width: `${Math.min(count * 10, 100)}%` }} />
                              </div>
                              <span className="text-xs font-mono text-muted-foreground w-6 text-right">{count}</span>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
