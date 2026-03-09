"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
} from "lucide-react"

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

interface AuditResult {
  url: string
  htmlData: HtmlData
}

interface LighthouseScores {
  performance: number | null
  seo: number | null
  accessibility: number | null
}

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
  if (score === null) return "bg-muted/30"
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

function ScoreCircle({
  score,
  label,
}: {
  score: number | null
  label: string
}) {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset =
    score !== null
      ? circumference - (score / 100) * circumference
      : circumference

  return (
    <div
      className={`flex flex-col items-center gap-2 p-4 rounded-xl ${getScoreBg(score)}`}
    >
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="8"
            className="stroke-muted/40"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`${getScoreRingColor(score)} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score !== null ? score : "—"}
          </span>
        </div>
      </div>
      <span className="text-sm font-semibold">{label}</span>
      <span
        className={`text-xs font-medium ${getScoreColor(score)}`}
      >
        {getScoreLabel(score)}
      </span>
    </div>
  )
}

type CheckStatus = "good" | "warning" | "error" | "info"

interface CheckItem {
  icon: React.ReactNode
  label: string
  detail: string
  status: CheckStatus
}

function StatusIcon({ status }: { status: CheckStatus }) {
  switch (status) {
    case "good":
      return <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
    case "error":
      return <XCircle className="h-4 w-4 text-red-500 shrink-0" />
    default:
      return <CheckCircle className="h-4 w-4 text-blue-500 shrink-0" />
  }
}

function buildChecks(data: HtmlData): CheckItem[] {
  const checks: CheckItem[] = []

  // Title
  if (!data.title) {
    checks.push({
      icon: <FileText className="h-4 w-4 shrink-0" />,
      label: "Title Tag",
      detail: "Missing! Add a <title> tag for SEO.",
      status: "error",
    })
  } else if (data.titleLength < 30) {
    checks.push({
      icon: <FileText className="h-4 w-4 shrink-0" />,
      label: "Title Tag",
      detail: `Too short (${data.titleLength} chars). Aim for 50-60 characters.`,
      status: "warning",
    })
  } else if (data.titleLength > 60) {
    checks.push({
      icon: <FileText className="h-4 w-4 shrink-0" />,
      label: "Title Tag",
      detail: `Too long (${data.titleLength} chars). May be truncated in search results.`,
      status: "warning",
    })
  } else {
    checks.push({
      icon: <FileText className="h-4 w-4 shrink-0" />,
      label: "Title Tag",
      detail: `Good length (${data.titleLength} chars): "${data.title}"`,
      status: "good",
    })
  }

  // Meta description
  if (!data.metaDescription) {
    checks.push({
      icon: <Tag className="h-4 w-4 shrink-0" />,
      label: "Meta Description",
      detail: "Missing! Add a meta description for better CTR in search results.",
      status: "error",
    })
  } else if (data.metaDescriptionLength < 70) {
    checks.push({
      icon: <Tag className="h-4 w-4 shrink-0" />,
      label: "Meta Description",
      detail: `Too short (${data.metaDescriptionLength} chars). Aim for 150-160 characters.`,
      status: "warning",
    })
  } else if (data.metaDescriptionLength > 160) {
    checks.push({
      icon: <Tag className="h-4 w-4 shrink-0" />,
      label: "Meta Description",
      detail: `Too long (${data.metaDescriptionLength} chars). May be truncated.`,
      status: "warning",
    })
  } else {
    checks.push({
      icon: <Tag className="h-4 w-4 shrink-0" />,
      label: "Meta Description",
      detail: `Good length (${data.metaDescriptionLength} chars).`,
      status: "good",
    })
  }

  // H1
  if (!data.firstH1) {
    checks.push({
      icon: <Heading1 className="h-4 w-4 shrink-0" />,
      label: "H1 Heading",
      detail: "No <h1> found. Every page should have one primary heading.",
      status: "error",
    })
  } else if (data.headings.h1 > 1) {
    checks.push({
      icon: <Heading1 className="h-4 w-4 shrink-0" />,
      label: "H1 Heading",
      detail: `Multiple H1 tags found (${data.headings.h1}). Use only one per page.`,
      status: "warning",
    })
  } else {
    checks.push({
      icon: <Heading1 className="h-4 w-4 shrink-0" />,
      label: "H1 Heading",
      detail: `Found: "${data.firstH1}"`,
      status: "good",
    })
  }

  // Images
  if (data.totalImages === 0) {
    checks.push({
      icon: <ImageIcon className="h-4 w-4 shrink-0" />,
      label: "Images",
      detail: "No images detected on the page.",
      status: "info",
    })
  } else if (data.imagesMissingAlt > 0) {
    checks.push({
      icon: <ImageIcon className="h-4 w-4 shrink-0" />,
      label: "Image Alt Text",
      detail: `${data.imagesMissingAlt} of ${data.totalImages} images missing alt text.`,
      status: data.imagesMissingAlt > data.totalImages / 2 ? "error" : "warning",
    })
  } else {
    checks.push({
      icon: <ImageIcon className="h-4 w-4 shrink-0" />,
      label: "Image Alt Text",
      detail: `All ${data.totalImages} images have alt attributes.`,
      status: "good",
    })
  }

  // Viewport
  checks.push({
    icon: <Monitor className="h-4 w-4 shrink-0" />,
    label: "Viewport Meta",
    detail: data.hasViewport
      ? "Viewport meta tag is present."
      : "Missing viewport meta tag — page may not be mobile-friendly.",
    status: data.hasViewport ? "good" : "error",
  })

  // Charset
  checks.push({
    icon: <Type className="h-4 w-4 shrink-0" />,
    label: "Character Encoding",
    detail: data.hasCharset
      ? "Character encoding is declared."
      : "No charset declaration found.",
    status: data.hasCharset ? "good" : "warning",
  })

  // Canonical
  checks.push({
    icon: <Link2 className="h-4 w-4 shrink-0" />,
    label: "Canonical URL",
    detail: data.canonicalUrl
      ? `Set to: ${data.canonicalUrl}`
      : "No canonical URL found. Consider adding one to avoid duplicate content.",
    status: data.canonicalUrl ? "good" : "warning",
  })

  // Heading structure
  checks.push({
    icon: <Heading1 className="h-4 w-4 shrink-0" />,
    label: "Heading Structure",
    detail: `H1: ${data.headings.h1} | H2: ${data.headings.h2} | H3: ${data.headings.h3}`,
    status: data.headings.h1 >= 1 && data.headings.h2 >= 1 ? "good" : "warning",
  })

  return checks
}

export function SeoPerformanceAuditor() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AuditResult | null>(null)
  const [lighthouse, setLighthouse] = useState<LighthouseScores | null>(null)
  const [lighthouseLoading, setLighthouseLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLighthouseScores = async (targetUrl: string) => {
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
        performance: categories?.performance?.score != null
          ? Math.round(categories.performance.score * 100)
          : null,
        seo: categories?.seo?.score != null
          ? Math.round(categories.seo.score * 100)
          : null,
        accessibility: categories?.accessibility?.score != null
          ? Math.round(categories.accessibility.score * 100)
          : null,
      })
    } catch {
      setLighthouse({ performance: null, seo: null, accessibility: null })
    } finally {
      setLighthouseLoading(false)
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

    try {
      const response = await fetch("/api/seo-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to audit the website.")
        return
      }

      setResult(data)

      // Fetch Lighthouse scores from the client (avoids Vercel function timeout)
      fetchLighthouseScores(targetUrl)
    } catch {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleAudit()
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Website SEO & Performance Auditor
          </CardTitle>
          <CardDescription>
            Enter a URL to analyze its SEO health, performance, and
            accessibility using on-page analysis and Google Lighthouse.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* URL Input */}
          <div className="flex gap-2">
            <Input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              className="flex-1"
            />
            <Button onClick={handleAudit} disabled={loading || !url.trim()}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              {loading ? "Scanning..." : "Audit"}
            </Button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-muted animate-spin border-t-primary" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-lg">
                  Scanning website architecture...
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Analyzing HTML structure and fetching Lighthouse scores. This
                  may take up to 30 seconds.
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 flex items-start gap-3">
              <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-destructive">Audit Failed</p>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <div className="space-y-6">
              {/* Audited URL */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" />
                <span className="font-mono truncate">{result.url}</span>
              </div>

              {/* Lighthouse Scores */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Lighthouse Scores</CardTitle>
                  <CardDescription>
                    Powered by Google PageSpeed Insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {lighthouseLoading && (
                    <div className="flex flex-col items-center justify-center py-8 gap-3">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">
                        Fetching Lighthouse scores... This can take up to 60 seconds.
                      </p>
                    </div>
                  )}
                  {!lighthouseLoading && lighthouse && (
                    <>
                      <div className="grid grid-cols-3 gap-4">
                        <ScoreCircle
                          score={lighthouse.performance}
                          label="Performance"
                        />
                        <ScoreCircle
                          score={lighthouse.seo}
                          label="SEO"
                        />
                        <ScoreCircle
                          score={lighthouse.accessibility}
                          label="Accessibility"
                        />
                      </div>
                      {lighthouse.performance === null &&
                        lighthouse.seo === null &&
                        lighthouse.accessibility === null && (
                          <p className="text-xs text-muted-foreground mt-3 text-center">
                            Lighthouse scores unavailable. The Google API may be rate-limited or the site may block crawlers.
                          </p>
                        )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* On-Page SEO Checks */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    On-Page SEO Analysis
                  </CardTitle>
                  <CardDescription>
                    HTML structure and meta tag analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {buildChecks(result.htmlData).map((check, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                      >
                        <StatusIcon status={check.status} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium flex items-center gap-2">
                            {check.icon}
                            {check.label}
                          </p>
                          <p className="text-sm text-muted-foreground mt-0.5 break-words">
                            {check.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
