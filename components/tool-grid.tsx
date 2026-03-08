"use client"

import { ToolCard } from "@/components/tool-card"
import { Image, FileText, FileType, Film, Code } from "lucide-react"

const tools = [
  {
    id: "heic-to-jpg",
    title: "HEIC to JPG",
    description: "Convert iPhone photos instantly in your browser.",
    icon: <Image className="h-6 w-6" />,
    tag: "Client-side" as const,
    category: "image",
  },
  {
    id: "webp-to-png",
    title: "WebP to PNG",
    description: "Fast, client-side image format conversion.",
    icon: <Image className="h-6 w-6" />,
    tag: "Hot" as const,
    category: "image",
  },
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
    description: "Reduce file size instantly using WASM.",
    icon: <FileText className="h-6 w-6" />,
    tag: "New" as const,
    category: "pdf",
  },
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
    tag: "Hot" as const,
    category: "document",
  },
  {
    id: "video-to-gif",
    title: "Video to GIF",
    description: "Local FFmpeg processing right in your browser.",
    icon: <Film className="h-6 w-6" />,
    tag: "New" as const,
    category: "media",
  },
  {
    id: "svg-to-png",
    title: "SVG to PNG",
    description: "Render vector graphics into standard images.",
    icon: <Code className="h-6 w-6" />,
    tag: "Client-side" as const,
    category: "developer",
  },
]

interface ToolGridProps {
  activeCategory: string
}

export function ToolGrid({ activeCategory }: ToolGridProps) {
  const filteredTools =
    activeCategory === "all"
      ? tools
      : tools.filter((tool) => tool.category === activeCategory)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredTools.map((tool) => (
        <ToolCard
          key={tool.id}
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
