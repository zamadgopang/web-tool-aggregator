"use client"

import { ToolCard } from "@/components/tool-card"
import { Image, FileText, FileType, Film, Code, Zap, Type, Shield, Hash, QrCode, Palette, Calculator } from "lucide-react"

const tools = [
  // Image Tools
  {
    id: "image-converter",
    title: "Image Converter",
    description: "Convert images to any format (JPG, PNG, WebP, HEIC, BMP) with compression options.",
    icon: <Image className="h-6 w-6" />,
    tag: "Premium" as const,
    category: "image",
  },
  {
    id: "svg-to-png",
    title: "SVG to PNG",
    description: "Render vector graphics into standard images with custom resolution.",
    icon: <Code className="h-6 w-6" />,
    tag: "Client-side" as const,
    category: "image",
  },
  
  // PDF Tools
  {
    id: "merge-pdfs",
    title: "Merge PDFs",
    description: "Combine multiple PDF documents securely without uploading.",
    icon: <FileText className="h-6 w-6" />,
    tag: "Client-side" as const,
    category: "pdf",
  },
  {
    id: "compress-pdf",
    title: "Compress PDF",
    description: "Reduce file size instantly while maintaining quality.",
    icon: <FileText className="h-6 w-6" />,
    tag: "Hot" as const,
    category: "pdf",
  },
  
  // Document Tools
  {
    id: "docx-to-pdf",
    title: "DOCX to PDF",
    description: "Convert Word documents with perfect formatting.",
    icon: <FileType className="h-6 w-6" />,
    tag: "Client-side" as const,
    category: "document",
  },
  {
    id: "csv-to-excel",
    title: "CSV to Excel",
    description: "Instantly parse and convert spreadsheet data.",
    icon: <FileType className="h-6 w-6" />,
    tag: "Client-side" as const,
    category: "document",
  },
  {
    id: "json-formatter",
    title: "JSON Formatter",
    description: "Format, validate, and minify JSON with syntax highlighting.",
    icon: <Code className="h-6 w-6" />,
    tag: "Popular" as const,
    category: "developer",
  },
  
  // Media Tools
  {
    id: "video-to-gif",
    title: "Video to GIF",
    description: "Convert video files to animated GIFs with quality control.",
    icon: <Film className="h-6 w-6" />,
    tag: "New" as const,
    category: "media",
  },
  
  // Text & Utility Tools
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
    description: "Generate MD5, SHA1, SHA256, and more hashes instantly.",
    icon: <Hash className="h-6 w-6" />,
    tag: "Popular" as const,
    category: "utility",
  },
  {
    id: "qr-code-generator",
    title: "QR Code Generator",
    description: "Create QR codes from text, URLs, or contact info.",
    icon: <QrCode className="h-6 w-6" />,
    tag: "New" as const,
    category: "utility",
  },
  {
    id: "color-converter",
    title: "Color Converter",
    description: "Convert colors between HEX, RGB, HSL, HSV formats.",
    icon: <Palette className="h-6 w-6" />,
    tag: "Popular" as const,
    category: "utility",
  },
  {
    id: "unit-converter",
    title: "Unit Converter",
    description: "Convert length, weight, temperature, and more units.",
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
