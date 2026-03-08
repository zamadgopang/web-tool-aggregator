import { Image, FileText, FileType, Film, Code } from "lucide-react"

export type ToolCategory = "image" | "pdf" | "document" | "media" | "developer"
export type ToolTag = "Client-side" | "Hot" | "New"

export interface Tool {
  id: string
  slug: string
  title: string
  description: string
  longDescription: string
  icon: typeof Image
  tag: ToolTag
  category: ToolCategory
  inputFormats?: string[]
  outputFormats?: string[]
}

export const tools: Tool[] = [
  {
    id: "image-converter",
    slug: "image-converter",
    title: "Image Converter",
    description: "Convert any image format instantly in your browser.",
    longDescription: "Convert between popular image formats like JPG, PNG, WebP, GIF, BMP, and HEIC. All processing happens locally in your browser for maximum privacy and speed.",
    icon: Image,
    tag: "Client-side",
    category: "image",
    inputFormats: ["jpg", "jpeg", "png", "webp", "gif", "bmp", "heic", "svg", "tiff", "ico"],
    outputFormats: ["jpg", "png", "webp", "gif", "bmp", "ico"],
  },
  {
    id: "heic-to-jpg",
    slug: "heic-to-jpg",
    title: "HEIC to JPG",
    description: "Convert iPhone photos instantly in your browser.",
    longDescription: "Convert HEIC photos from your iPhone or iPad to universal JPG format. No upload required - everything is processed locally.",
    icon: Image,
    tag: "Client-side",
    category: "image",
    inputFormats: ["heic"],
    outputFormats: ["jpg"],
  },
  {
    id: "webp-to-png",
    slug: "webp-to-png",
    title: "WebP to PNG",
    description: "Fast, client-side image format conversion.",
    longDescription: "Convert WebP images to PNG format for better compatibility. Processing happens entirely in your browser.",
    icon: Image,
    tag: "Hot",
    category: "image",
    inputFormats: ["webp"],
    outputFormats: ["png"],
  },
  {
    id: "merge-pdfs",
    slug: "merge-pdfs",
    title: "Merge PDFs",
    description: "Combine multiple PDF documents securely without uploading.",
    longDescription: "Merge multiple PDF files into a single document. Drag and drop to reorder pages. All processing is done locally.",
    icon: FileText,
    tag: "Client-side",
    category: "pdf",
  },
  {
    id: "compress-pdf",
    slug: "compress-pdf",
    title: "Compress PDF",
    description: "Reduce file size instantly using WASM.",
    longDescription: "Compress PDF files to reduce their size while maintaining quality. Uses WebAssembly for fast local processing.",
    icon: FileText,
    tag: "New",
    category: "pdf",
  },
  {
    id: "docx-to-pdf",
    slug: "docx-to-pdf",
    title: "DOCX to PDF",
    description: "Convert Word documents with perfect formatting.",
    longDescription: "Convert Microsoft Word documents to PDF format while preserving all formatting, fonts, and layouts.",
    icon: FileType,
    tag: "Client-side",
    category: "document",
  },
  {
    id: "csv-to-excel",
    slug: "csv-to-excel",
    title: "CSV to Excel",
    description: "Instantly parse and convert spreadsheet data.",
    longDescription: "Convert CSV files to Excel format with proper column formatting and data types preserved.",
    icon: FileType,
    tag: "Hot",
    category: "document",
  },
  {
    id: "video-to-gif",
    slug: "video-to-gif",
    title: "Video to GIF",
    description: "Local FFmpeg processing right in your browser.",
    longDescription: "Convert video clips to animated GIFs using FFmpeg WASM. Adjust frame rate, size, and quality settings.",
    icon: Film,
    tag: "New",
    category: "media",
  },
  {
    id: "svg-to-png",
    slug: "svg-to-png",
    title: "SVG to PNG",
    description: "Render vector graphics into standard images.",
    longDescription: "Convert SVG vector graphics to PNG raster images at any resolution. Perfect for exporting icons and illustrations.",
    icon: Code,
    tag: "Client-side",
    category: "developer",
  },
]

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug)
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter((tool) => tool.category === category)
}
