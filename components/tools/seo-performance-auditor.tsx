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
    <div className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-500 ${getScoreBg(score)}`}>
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" strokeWidth="8" className="stroke-muted/30" />
          <circle
            cx="50" cy="50" r={radius} fill="none" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={animatedOffset}
            className={`${getScoreRingColor(score)} transition-all duration-[1500ms] ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score !== null ? <AnimatedNumber value={score} /> : "—"}
          </span>
        </div>
      </div>
      <span className="text-sm font-semibold">{label}</span>
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
    <div className="rounded-xl border bg-card p-4 flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold tracking-tight">
        {typeof value === "number" ? <AnimatedNumber value={value} /> : value}
      </p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  )
}

// ─── Check List Section ───────────────────────────────────────────────

function CheckList({ checks }: { checks: CheckItem[] }) {
  return (
    <div className="space-y-2">
      {checks.map((check, i) => (
        <div
          key={i}
          className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-300 ${statusBg(check.status)}`}
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <StatusIcon status={check.status} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium flex items-center gap-2">
              {check.icon}
              {check.label}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5 break-words">{check.detail}</p>
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
  const [error, setError] = useState<string | null>(null)
  const [scanPhase, setScanPhase] = useState(0)

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

  const fetchLighthouseScores = useCallback(async (targetUrl: string) => {
    setLighthouseLoading(true)
    setLighthouse(null)
    try {
      const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&category=performance&category=seo&category=accessibility`
      const response = await fetch(apiUrl)
      if (!response.ok) {
        setLighthouse({ performance: null, seo: null, accessibility: null })
        return
      }
      const data = await response.json()
      const categories = data?.lighthouseResult?.categories
      setLighthouse({
        performance: categories?.performance?.score != null ? Math.round(categories.performance.score * 100) : null,
        seo: categories?.seo?.score != null ? Math.round(categories.seo.score * 100) : null,
        accessibility: categories?.accessibility?.score != null ? Math.round(categories.accessibility.score * 100) : null,
      })
    } catch {
      setLighthouse({ performance: null, seo: null, accessibility: null })
    } finally {
      setLighthouseLoading(false)
    }
  }, [])

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

    try {
      const response = await fetch("/api/seo-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      })
      const data = await response.json()
      if (!response.ok) { setError(data.error || "Failed to audit the website."); return }
      setResult(data)
      fetchLighthouseScores(targetUrl)
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
    <div className="w-full max-w-5xl mx-auto p-4">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                Website SEO & Performance Auditor
              </CardTitle>
              <CardDescription className="mt-2">
                Comprehensive analysis of SEO health, performance, security, social tags, and accessibility.
              </CardDescription>
            </div>
            {overallGrade && !loading && (
              <div className="text-center animate-in zoom-in duration-500">
                <div className={`text-5xl font-black ${overallGrade.color}`}>{overallGrade.grade}</div>
                <p className="text-xs text-muted-foreground mt-1">Overall Score: {overallGrade.score}%</p>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* URL Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                className="pl-9"
              />
            </div>
            <Button onClick={handleAudit} disabled={loading || !url.trim()} size="lg">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
              {loading ? "Scanning..." : "Run Audit"}
            </Button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-6 animate-in fade-in duration-300">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-muted animate-spin border-t-primary" />
                <div className="absolute inset-2 w-16 h-16 rounded-full border-4 border-muted animate-spin border-b-primary/50" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
              </div>
              <div className="text-center space-y-2">
                <p className="font-semibold text-lg">Scanning website architecture...</p>
                <p className="text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-1 duration-300" key={scanPhase}>
                  {scanMessages[scanPhase]}
                </p>
              </div>
              <div className="flex gap-1">
                {scanMessages.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i <= scanPhase ? "bg-primary scale-100" : "bg-muted scale-75"}`} />
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard icon={<FileText className="h-4 w-4" />} label="Word Count" value={result.htmlData.wordCount} />
                <StatCard icon={<Link2 className="h-4 w-4" />} label="Total Links" value={result.htmlData.totalLinks} sub={`${result.htmlData.internalLinks} internal · ${result.htmlData.externalLinks} external`} />
                <StatCard icon={<ImageIcon className="h-4 w-4" />} label="Images" value={result.htmlData.totalImages} sub={result.htmlData.imagesMissingAlt > 0 ? `${result.htmlData.imagesMissingAlt} missing alt` : "All have alt text"} />
                <StatCard icon={<Zap className="h-4 w-4" />} label="Page Size" value={`${Math.round(result.htmlData.contentLength / 1024)}KB`} sub="HTML document size" />
              </div>

              {/* Lighthouse Scores */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        Lighthouse Scores
                      </CardTitle>
                      <CardDescription>Google PageSpeed Insights</CardDescription>
                    </div>
                    {lighthouseLoading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                  </div>
                </CardHeader>
                <CardContent>
                  {lighthouseLoading && (
                    <div className="flex flex-col items-center justify-center py-10 gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full border-[3px] border-muted animate-spin border-t-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Fetching Lighthouse scores...</p>
                        <p className="text-xs text-muted-foreground mt-1">This can take up to 60 seconds</p>
                      </div>
                    </div>
                  )}
                  {!lighthouseLoading && lighthouse && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
                      <div className="grid grid-cols-3 gap-3">
                        <ScoreCircle score={lighthouse.performance} label="Performance" />
                        <ScoreCircle score={lighthouse.seo} label="SEO" />
                        <ScoreCircle score={lighthouse.accessibility} label="Accessibility" />
                      </div>
                      {/* Radar Chart */}
                      <div className="flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={220}>
                          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                            <PolarGrid stroke="hsl(var(--muted))" />
                            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                            <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                      {lighthouse.performance === null && lighthouse.seo === null && lighthouse.accessibility === null && (
                        <p className="text-xs text-muted-foreground text-center col-span-full">
                          Lighthouse scores unavailable. The API may be rate-limited.
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tabbed Details */}
              <Tabs defaultValue="seo" className="w-full">
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="seo" className="gap-1.5"><Search className="h-3.5 w-3.5" />SEO</TabsTrigger>
                  <TabsTrigger value="social" className="gap-1.5"><Share2 className="h-3.5 w-3.5" />Social</TabsTrigger>
                  <TabsTrigger value="technical" className="gap-1.5"><Shield className="h-3.5 w-3.5" />Technical</TabsTrigger>
                  <TabsTrigger value="structure" className="gap-1.5"><BarChart3 className="h-3.5 w-3.5" />Structure</TabsTrigger>
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
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {([
                          ["HSTS", result.htmlData.securityHeaders.hasHSTS],
                          ["CSP", result.htmlData.securityHeaders.hasCSP],
                          ["X-Frame", result.htmlData.securityHeaders.hasXFrame],
                          ["X-Content-Type", result.htmlData.securityHeaders.hasXContentType],
                        ] as [string, boolean][]).map(([name, present]) => (
                          <div key={name} className={`rounded-lg p-3 text-center transition-all ${present ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-red-500/5 border border-red-500/20"}`}>
                            {present ? <CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /> : <XCircle className="h-5 w-5 text-red-400 mx-auto" />}
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
