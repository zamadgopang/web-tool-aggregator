export interface ToolMeta {
  id: string
  title: string
  description: string
  tag: "Client-side" | "Hot" | "New" | "Premium" | "Popular" | "Secure"
  category: "developer" | "image" | "text" | "utility"
  popular?: boolean
  iconName: string
}

export const tools: ToolMeta[] = [
  // Top Featured Tools
  {
    id: "python-compiler",
    title: "Python Compiler",
    description: "Write and run Python code directly in your browser — powered by WebAssembly. Full Python 3.11 with stdlib, Monaco editor, and instant execution.",
    tag: "Hot",
    category: "developer",
    popular: true,
    iconName: "Code2",
  },
  {
    id: "image-converter",
    title: "Image Converter",
    description: "Convert images to any format (JPG, PNG, WebP, BMP, GIF) with compression and resize options.",
    tag: "Premium",
    category: "image",
    popular: true,
    iconName: "Image",
  },
  {
    id: "markdown-preview",
    title: "Markdown Preview",
    description: "Write markdown with live preview, split view, and HTML export.",
    tag: "Hot",
    category: "developer",
    popular: true,
    iconName: "FileCode",
  },
  {
    id: "image-cropper-resizer",
    title: "Image Cropper & Resizer",
    description: "Resize, rotate, and flip images with live preview and preset sizes.",
    tag: "Popular",
    category: "image",
    popular: true,
    iconName: "Crop",
  },
  {
    id: "doc-to-pdf-converter",
    title: "DOCX to PDF Converter",
    description: "Convert DOCX files to PDF with Word formatting, tables, colors, and images preserved.",
    tag: "Hot",
    category: "utility",
    popular: true,
    iconName: "FileText",
  },
  {
    id: "qr-code-generator",
    title: "QR Code Generator",
    description: "Create QR codes from text, URLs, or contact info.",
    tag: "Popular",
    category: "utility",
    popular: true,
    iconName: "QrCode",
  },
  {
    id: "json-formatter",
    title: "JSON Formatter",
    description: "Format, validate, and minify JSON with syntax highlighting.",
    tag: "Popular",
    category: "developer",
    popular: true,
    iconName: "Code",
  },
  {
    id: "pdf-to-doc-converter",
    title: "PDF to DOC Converter",
    description: "Convert PDF files to Word documents (.docx) entirely in your browser.",
    tag: "Hot",
    category: "utility",
    popular: true,
    iconName: "FileText",
  },
  {
    id: "color-converter",
    title: "Color Converter",
    description: "Convert colors between HEX, RGB, HSL formats.",
    tag: "Popular",
    category: "utility",
    popular: true,
    iconName: "Palette",
  },
  {
    id: "password-generator",
    title: "Password Generator",
    description: "Generate secure, random passwords with custom options.",
    tag: "Secure",
    category: "utility",
    popular: true,
    iconName: "Shield",
  },
  {
    id: "hash-generator",
    title: "Hash Generator",
    description: "Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes.",
    tag: "Popular",
    category: "utility",
    popular: true,
    iconName: "Hash",
  },
  {
    id: "unit-converter",
    title: "Unit Converter",
    description: "Convert length, weight, temperature, volume, and speed units.",
    tag: "Popular",
    category: "utility",
    popular: true,
    iconName: "Calculator",
  },

  // Developer Tools
  {
    id: "regex-tester",
    title: "Regex Tester",
    description: "Test and debug regular expressions with real-time highlighting.",
    tag: "New",
    category: "developer",
    iconName: "Regex",
  },
  {
    id: "jwt-decoder",
    title: "JWT Decoder",
    description: "Decode and inspect JSON Web Tokens — view header, payload, and expiry.",
    tag: "Popular",
    category: "developer",
    iconName: "KeyRound",
  },
  {
    id: "json-to-typescript",
    title: "JSON → TypeScript",
    description: "Generate TypeScript interfaces from JSON with nested types and arrays.",
    tag: "Popular",
    category: "developer",
    iconName: "Braces",
  },
  {
    id: "yaml-json-converter",
    title: "YAML ↔ JSON Converter",
    description: "Convert between YAML and JSON formats bidirectionally.",
    tag: "New",
    category: "developer",
    iconName: "FileJson",
  },
  {
    id: "cron-parser",
    title: "Cron Expression Parser",
    description: "Parse cron expressions into human-readable schedules with next run times.",
    tag: "New",
    category: "developer",
    iconName: "Timer",
  },
  {
    id: "sql-formatter",
    title: "SQL Formatter",
    description: "Format, minify, and beautify SQL queries with keyword uppercasing.",
    tag: "New",
    category: "developer",
    iconName: "Database",
  },
  {
    id: "html-entity-encoder",
    title: "HTML Entity Encoder",
    description: "Encode and decode HTML entities with a built-in reference table.",
    tag: "Client-side",
    category: "developer",
    iconName: "Code2",
  },
  {
    id: "meta-tag-generator",
    title: "Meta Tag Generator",
    description: "Generate SEO meta tags, Open Graph, and Twitter Card markup with preview.",
    tag: "Popular",
    category: "developer",
    iconName: "Globe",
  },
  {
    id: "chmod-calculator",
    title: "Chmod Calculator",
    description: "Calculate Unix file permissions in numeric and symbolic notation.",
    tag: "New",
    category: "developer",
    iconName: "Terminal",
  },

  // Text Tools
  {
    id: "text-minifier",
    title: "Text Minifier",
    description: "Compress HTML, CSS, and JavaScript code instantly.",
    tag: "Popular",
    category: "text",
    iconName: "Zap",
  },
  {
    id: "base64-converter",
    title: "Base64 Converter",
    description: "Encode and decode Base64 strings and files.",
    tag: "Client-side",
    category: "text",
    iconName: "Shield",
  },
  {
    id: "url-encoder-decoder",
    title: "URL Encoder/Decoder",
    description: "Encode or decode URLs and URI components.",
    tag: "New",
    category: "text",
    iconName: "Link",
  },
  {
    id: "text-diff-checker",
    title: "Text Diff Checker",
    description: "Compare two texts and highlight differences line by line.",
    tag: "New",
    category: "text",
    iconName: "AlignLeft",
  },
  {
    id: "lorem-ipsum-generator",
    title: "Lorem Ipsum Generator",
    description: "Generate placeholder text for designs and layouts.",
    tag: "Client-side",
    category: "text",
    iconName: "TextIcon",
  },

  // Utility Tools
  {
    id: "timestamp-converter",
    title: "Timestamp Converter",
    description: "Convert between Unix timestamps and human-readable dates with timezone support.",
    tag: "Popular",
    category: "utility",
    iconName: "Clock",
  },
  {
    id: "uuid-generator",
    title: "UUID / ID Generator",
    description: "Generate cryptographically secure UUIDs, NanoIDs, and ULID-like identifiers.",
    tag: "Secure",
    category: "utility",
    iconName: "Fingerprint",
  },
  {
    id: "css-gradient-generator",
    title: "CSS Gradient Generator",
    description: "Create linear, radial, and conic CSS gradients with live preview.",
    tag: "New",
    category: "utility",
    iconName: "Paintbrush",
  },
  {
    id: "css-box-shadow-generator",
    title: "CSS Box Shadow Generator",
    description: "Create multi-layer box shadows with live preview and presets.",
    tag: "New",
    category: "utility",
    iconName: "Square",
  },
  {
    id: "aspect-ratio-calculator",
    title: "Aspect Ratio Calculator",
    description: "Calculate dimensions and ratios for video, photos, and responsive design.",
    tag: "New",
    category: "utility",
    iconName: "Ratio",
  },
  {
    id: "color-palette-generator",
    title: "Color Palette Generator",
    description: "Generate harmonious color palettes and export as CSS or Tailwind config.",
    tag: "Popular",
    category: "utility",
    iconName: "Droplets",
  },
  {
    id: "svg-to-png",
    title: "SVG to PNG Converter",
    description: "Convert SVG files to high-quality PNG images with custom dimensions.",
    tag: "New",
    category: "image",
    iconName: "Image",
  },
  {
    id: "seo-performance-auditor",
    title: "SEO & Performance Auditor",
    description: "Audit any website's SEO, performance, and accessibility with Google Lighthouse scores, Core Web Vitals, and detailed on-page HTML analysis.",
    tag: "Hot",
    category: "developer",
    popular: true,
    iconName: "Globe",
  },
]

export function getToolById(id: string): ToolMeta | undefined {
  return tools.find((t) => t.id === id)
}

export function getToolsByCategory(category: string): ToolMeta[] {
  if (category === "all") return tools
  return tools.filter((t) => t.category === category)
}

export const siteConfig = {
  url: "https://tools.zamdev.me",
  name: "Tools by ZamDev",
  description:
    "30+ free, lightning-fast browser tools for developers and designers. Convert images, format JSON, generate passwords, QR codes, and more — all running 100% client-side with zero server delays. Your files never leave your device.",
}
