"use client"

import { ToolCard } from "@/components/tool-card"
import { Image, FileText, FileType, Film, Code, Zap, Type, Shield, Hash, QrCode, Palette, Calculator, FileCode, TextIcon, Link, Regex, AlignLeft, KeyRound, Clock, Fingerprint, Braces, FileJson, Timer, Paintbrush, Database, Code2, Crop, Globe, Square, Terminal, Ratio, Droplets, Star, ArrowRight, BarChart3, Activity, Play } from "lucide-react"
import NextLink from "next/link"

const tools = [
  // Popular / Featured Tools (ordered: Python Compiler first, then Image Converter, Markdown Preview, etc.)
  {
    id: "python-compiler",
    title: "Python Compiler",
    description: "Write and run Python code directly in your browser — powered by WebAssembly. Full Python 3.11 with stdlib.",
    icon: <Code2 className="h-6 w-6" />,
    tag: "Hot" as const,
    category: "developer",
    popular: true,
  },
  {
    id: "image-converter",
    title: "Image Converter",
    description: "Convert images to any format (JPG, PNG, WebP, BMP, GIF) with compression and resize options.",
    icon: <Image className="h-6 w-6" />,
    tag: "Premium" as const,
    category: "image",
    popular: true,
  },
  {
    id: "markdown-preview",
    title: "Markdown Preview",
    description: "Write markdown with live preview, split view, and HTML export.",
    icon: <FileCode className="h-6 w-6" />,
    tag: "Hot" as const,
    category: "developer",
    popular: true,
  },
  {
    id: "image-cropper-resizer",
    title: "Image Cropper & Resizer",
    description: "Resize, rotate, and flip images with live preview and preset sizes.",
    icon: <Crop className="h-6 w-6" />,
    tag: "Popular" as const,
    category: "image",
    popular: true,
  },
  {
    id: "doc-to-pdf-converter",
    title: "DOCX to PDF Converter",
    description: "Convert DOCX files to PDF with Word formatting, tables, colors, and images preserved.",
    icon: <FileText className="h-6 w-6" />,
    tag: "Hot" as const,
    category: "utility",
    popular: true,
  },
  {
    id: "qr-code-generator",
    title: "QR Code Generator",
    description: "Create QR codes from text, URLs, or contact info.",
    icon: <QrCode className="h-6 w-6" />,
    tag: "Popular" as const,
    category: "utility",
    popular: true,
  },
  {
    id: "json-formatter",
    title: "JSON Formatter",
    description: "Format, validate, and minify JSON with syntax highlighting.",
    icon: <Code className="h-6 w-6" />,
    tag: "Popular" as const,
    category: "developer",
    popular: true,
  },
  {
    id: "pdf-to-doc-converter",
    title: "PDF to DOC Converter",
    description: "Convert PDF files to Word documents (.docx) with layout preservation.",
    icon: <FileText className="h-6 w-6" />,
    tag: "Hot" as const,
    category: "utility",
    popular: true,
  },
  {
    id: "color-converter",
    title: "Color Converter",
    description: "Convert colors between HEX, RGB, HSL formats.",
    icon: <Palette className="h-6 w-6" />,
    tag: "Popular" as const,
    category: "utility",
    popular: true,
  },
  {
    id: "password-generator",
    title: "Password Generator",
    description: "Generate secure, random passwords with custom options.",
    icon: <Shield className="h-6 w-6" />,
    tag: "Secure" as const,
    category: "utility",
    popular: true,
  },
  {
    id: "hash-generator",
    title: "Hash Generator",
    description: "Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes.",
    icon: <Hash className="h-6 w-6" />,
    tag: "Popular" as const,
    category: "utility",
    popular: true,
  },
  {
    id: "unit-converter",
    title: "Unit Converter",
    description: "Convert length, weight, temperature, volume, and speed units.",
    icon: <Calculator className="h-6 w-6" />,
    tag: "Popular" as const,
    category: "utility",
    popular: true,
  },

  // Developer Tools
  {
    id: "regex-tester",
    title: "Regex Tester",
    description: "Test and debug regular expressions with real-time highlighting.",
    icon: <Regex className="h-6 w-6" />,
    tag: "New" as const,
    category: "developer",
  },
  {
    id: "jwt-decoder",
    title: "JWT Decoder",
    description: "Decode and inspect JSON Web Tokens — view header, payload, and expiry.",
    icon: <KeyRound className="h-6 w-6" />,
    tag: "Popular" as const,
    category: "developer",
  },
  {
    id: "json-to-typescript",
    title: "JSON → TypeScript",
    description: "Generate TypeScript interfaces from JSON with nested types and arrays.",
    icon: <Braces className="h-6 w-6" />,
    tag: "Popular" as const,
    category: "developer",
  },
  {
    id: "yaml-json-converter",
    title: "YAML ↔ JSON Converter",
    description: "Convert between YAML and JSON formats bidirectionally.",
    icon: <FileJson className="h-6 w-6" />,
    tag: "New" as const,
    category: "developer",
  },
  {
    id: "cron-parser",
    title: "Cron Expression Parser",
    description: "Parse cron expressions into human-readable schedules with next run times.",
    icon: <Timer className="h-6 w-6" />,
    tag: "New" as const,
    category: "developer",
  },
  {
    id: "sql-formatter",
    title: "SQL Formatter",
    description: "Format, minify, and beautify SQL queries with keyword uppercasing.",
    icon: <Database className="h-6 w-6" />,
    tag: "New" as const,
    category: "developer",
  },
  {
    id: "html-entity-encoder",
    title: "HTML Entity Encoder",
    description: "Encode and decode HTML entities with a built-in reference table.",
    icon: <Code2 className="h-6 w-6" />,
    tag: "Client-side" as const,
    category: "developer",
  },
  {
    id: "meta-tag-generator",
    title: "Meta Tag Generator",
    description: "Generate SEO meta tags, Open Graph, and Twitter Card markup with preview.",
    icon: <Globe className="h-6 w-6" />,
    tag: "Popular" as const,
    category: "developer",
  },
  {
    id: "chmod-calculator",
    title: "Chmod Calculator",
    description: "Calculate Unix file permissions in numeric and symbolic notation.",
    icon: <Terminal className="h-6 w-6" />,
    tag: "New" as const,
    category: "developer",
  },

  // Text Tools
  {
    id: "text-minifier",
    title: "Text Minifier",
    description: "Compress HTML, CSS, and JavaScript code instantly.",
    icon: <Zap className="h-6 w-6" />,
    tag: "Popular" as const,
    category: "text",
  },
  {
    id: "base64-converter",
    title: "Base64 Converter",
    description: "Encode and decode Base64 strings and files.",
    icon: <Shield className="h-6 w-6" />,
    tag: "Client-side" as const,
    category: "text",
  },
  {
    id: "url-encoder-decoder",
    title: "URL Encoder/Decoder",
    description: "Encode or decode URLs and URI components.",
    icon: <Link className="h-6 w-6" />,
    tag: "New" as const,
    category: "text",
  },
  {
    id: "text-diff-checker",
    title: "Text Diff Checker",
    description: "Compare two texts and highlight differences line by line.",
    icon: <AlignLeft className="h-6 w-6" />,
    tag: "New" as const,
    category: "text",
  },
  {
    id: "lorem-ipsum-generator",
    title: "Lorem Ipsum Generator",
    description: "Generate placeholder text for designs and layouts.",
    icon: <TextIcon className="h-6 w-6" />,
    tag: "Client-side" as const,
    category: "text",
  },

  // Utility Tools
  {
    id: "timestamp-converter",
    title: "Timestamp Converter",
    description: "Convert between Unix timestamps and human-readable dates with timezone support.",
    icon: <Clock className="h-6 w-6" />,
    tag: "Popular" as const,
    category: "utility",
  },
  {
    id: "uuid-generator",
    title: "UUID / ID Generator",
    description: "Generate cryptographically secure UUIDs, NanoIDs, and ULID-like identifiers.",
    icon: <Fingerprint className="h-6 w-6" />,
    tag: "Secure" as const,
    category: "utility",
  },
  {
    id: "css-gradient-generator",
    title: "CSS Gradient Generator",
    description: "Create linear, radial, and conic CSS gradients with live preview.",
    icon: <Paintbrush className="h-6 w-6" />,
    tag: "New" as const,
    category: "utility",
  },
  {
    id: "css-box-shadow-generator",
    title: "CSS Box Shadow Generator",
    description: "Create multi-layer box shadows with live preview and presets.",
    icon: <Square className="h-6 w-6" />,
    tag: "New" as const,
    category: "utility",
  },
  {
    id: "aspect-ratio-calculator",
    title: "Aspect Ratio Calculator",
    description: "Calculate dimensions and ratios for video, photos, and responsive design.",
    icon: <Ratio className="h-6 w-6" />,
    tag: "New" as const,
    category: "utility",
  },
  {
    id: "color-palette-generator",
    title: "Color Palette Generator",
    description: "Generate harmonious color palettes and export as CSS or Tailwind config.",
    icon: <Droplets className="h-6 w-6" />,
    tag: "Popular" as const,
    category: "utility",
  },
  {
    id: "seo-performance-auditor",
    title: "SEO & Performance Auditor",
    description: "Audit any website's SEO, performance, and accessibility with Google Lighthouse scores and on-page analysis.",
    icon: <Globe className="h-6 w-6" />,
    tag: "Hot" as const,
    category: "developer",
    popular: true,
  },
]

const sectionMeta: Record<string, { label: string; icon: React.ReactNode; description: string }> = {
  popular: {
    label: "Most Popular",
    icon: <Star className="h-5 w-5" />,
    description: "Our most-used tools loved by developers and designers",
  },
  developer: {
    label: "Developer Tools",
    icon: <Code className="h-5 w-5" />,
    description: "JSON, regex, code formatting, and more",
  },
  text: {
    label: "Text Tools",
    icon: <Zap className="h-5 w-5" />,
    description: "Encode, decode, diff, and transform text",
  },
  image: {
    label: "Image Tools",
    icon: <Image className="h-5 w-5" />,
    description: "Convert, crop, and resize images",
  },
  utility: {
    label: "Utilities",
    icon: <Calculator className="h-5 w-5" />,
    description: "Colors, passwords, timestamps, and more",
  },
}

// ─── Featured Tool Banners ────────────────────────────────────────────

function FeaturedToolBanner() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Python Compiler — Primary Featured */}
      <NextLink
        href="/tools/python-compiler"
        className="group block w-full rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-teal-500/10 to-green-500/5 p-5 sm:p-6 transition-all duration-300 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Try the Online Python Compiler — main featured tool"
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors" aria-hidden="true">
              <Code2 className="h-6 w-6" />
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                New
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-emerald-500 transition-all" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Python Compiler</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Write and run Python 3.11 directly in your browser — powered by WebAssembly. Full stdlib, Monaco editor, 7 examples included.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><Play className="h-3 w-3 text-emerald-500" />Instant Run</span>
            <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-amber-500" />WebAssembly</span>
            <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-blue-500" />Client-Side</span>
          </div>
        </div>
      </NextLink>

      {/* SEO Auditor — Secondary Featured */}
      <NextLink
        href="/tools/seo-performance-auditor"
        className="group block w-full rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-5 sm:p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Try the SEO & Performance Auditor tool"
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors" aria-hidden="true">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                Featured
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">SEO & Performance Auditor</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Lighthouse scores, Core Web Vitals, security headers, social tags analysis, and detailed SEO recommendations.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><Activity className="h-3 w-3 text-emerald-500" />Lighthouse</span>
            <span className="flex items-center gap-1"><Globe className="h-3 w-3 text-amber-500" />SEO Analysis</span>
            <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-blue-500" />Security</span>
          </div>
        </div>
      </NextLink>
    </div>
  )
}

// ─── Tool Grid ────────────────────────────────────────────────────────

interface ToolGridProps {
  activeCategory: string
}

export function ToolGrid({ activeCategory }: ToolGridProps) {
  if (activeCategory !== "all") {
    const filteredTools = tools.filter((tool) => tool.category === activeCategory)
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTools.map((tool) => (
          <ToolCard
            key={tool.id}
            id={tool.id}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            tag={tool.tag}
            category={tool.category}
          />
        ))}
      </div>
    )
  }

  // "all" view — show in sections
  const popularTools = tools.filter((t) => t.popular)
  const sections = [
    { key: "popular", tools: popularTools },
    { key: "developer", tools: tools.filter((t) => t.category === "developer" && !t.popular) },
    { key: "text", tools: tools.filter((t) => t.category === "text") },
    { key: "utility", tools: tools.filter((t) => t.category === "utility" && !t.popular) },
  ]

  return (
    <div className="space-y-12">
      {/* Featured Tool Banner */}
      <FeaturedToolBanner />

      {sections.map((section) => {
        const meta = sectionMeta[section.key]
        if (!meta || section.tools.length === 0) return null
        return (
          <div key={section.key}>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background" aria-hidden="true">
                {meta.icon}
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">{meta.label}</h2>
                <p className="text-sm text-muted-foreground">{meta.description}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {section.tools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  id={tool.id}
                  title={tool.title}
                  description={tool.description}
                  icon={tool.icon}
                  tag={tool.tag}
                  category={tool.category}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
