"use client"

import { ToolCard } from "@/components/tool-card"
import { Image, FileText, FileType, Film, Code, Zap, Type, Shield, Hash, QrCode, Palette, Calculator, FileCode, TextIcon, Link, Regex, AlignLeft } from "lucide-react"

const tools = [
  // Image Tools
  {
    id: "image-converter",
    title: "Image Converter",
    description: "Convert images to any format (JPG, PNG, WebP, BMP, GIF) with compression and resize options.",
    icon: <Image className="h-6 w-6" />,
    tag: "Premium" as const,
    category: "image",
  },
  
  // Developer Tools
  {
    id: "json-formatter",
    title: "JSON Formatter",
    description: "Format, validate, and minify JSON with syntax highlighting.",
    icon: <Code className="h-6 w-6" />,
    tag: "Popular" as const,
    category: "developer",
  },
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
    id: "password-generator",
    title: "Password Generator",
    description: "Generate secure, random passwords with custom options.",
    icon: <Shield className="h-6 w-6" />,
    tag: "Secure" as const,
    category: "utility",
  },
  {
    id: "hash-generator",
    title: "Hash Generator",
    description: "Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes.",
    icon: <Hash className="h-6 w-6" />,
    tag: "Popular" as const,
    category: "utility",
  },
  {
    id: "qr-code-generator",
    title: "QR Code Generator",
    description: "Create QR codes from text, URLs, or contact info.",
    icon: <QrCode className="h-6 w-6" />,
    tag: "Popular" as const,
    category: "utility",
  },
  {
    id: "color-converter",
    title: "Color Converter",
    description: "Convert colors between HEX, RGB, HSL formats.",
    icon: <Palette className="h-6 w-6" />,
    tag: "Popular" as const,
    category: "utility",
  },
  {
    id: "unit-converter",
    title: "Unit Converter",
    description: "Convert length, weight, temperature, volume, and speed units.",
    icon: <Calculator className="h-6 w-6" />,
    tag: "Popular" as const,
    category: "utility",
  },
]

interface ToolGridProps {
  activeCategory: string
  onToolClick?: (toolId: string) => void
}

export function ToolGrid({ activeCategory, onToolClick }: ToolGridProps) {
  const filteredTools =
    activeCategory === "all"
      ? tools
      : tools.filter((tool) => tool.category === activeCategory)

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
