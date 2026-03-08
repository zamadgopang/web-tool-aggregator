"use client"

import { ToolCard } from "@/components/tool-card"
import { Image, FileText, FileType, Film, Code, Zap, Type, Shield, Hash, QrCode, Palette, Calculator, FileCode, TextIcon, Link, Regex, AlignLeft, KeyRound, Clock, Fingerprint, Braces, FileJson, Timer, Paintbrush, Database, Code2, Crop, Globe, Square, Terminal, Ratio, Droplets, Star } from "lucide-react"

const tools = [
  // Popular / Featured Tools
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
    id: "image-converter",
    title: "Image Converter",
    description: "Convert images to any format (JPG, PNG, WebP, BMP, GIF) with compression and resize options.",
    icon: <Image className="h-6 w-6" />,
    tag: "Premium" as const,
    category: "image",
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
    id: "qr-code-generator",
    title: "QR Code Generator",
    description: "Create QR codes from text, URLs, or contact info.",
    icon: <QrCode className="h-6 w-6" />,
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
  {
    id: "image-cropper-resizer",
    title: "Image Cropper & Resizer",
    description: "Resize, rotate, and flip images with live preview and preset sizes.",
    icon: <Crop className="h-6 w-6" />,
    tag: "Popular" as const,
    category: "image",
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
    id: "markdown-preview",
    title: "Markdown Preview",
    description: "Write markdown with live preview, split view, and HTML export.",
    icon: <FileCode className="h-6 w-6" />,
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

interface ToolGridProps {
  activeCategory: string
  onToolClick?: (toolId: string) => void
}

export function ToolGrid({ activeCategory, onToolClick }: ToolGridProps) {
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
            onClick={onToolClick}
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
      {sections.map((section) => {
        const meta = sectionMeta[section.key]
        if (!meta || section.tools.length === 0) return null
        return (
          <div key={section.key}>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background">
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
                  onClick={onToolClick}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
