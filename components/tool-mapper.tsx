"use client"

import { ImageConverter } from "@/components/tools/image-converter"
import { Base64Converter } from "@/components/tools/base64-converter"
import { PasswordGenerator } from "@/components/tools/password-generator"
import { HashGenerator } from "@/components/tools/hash-generator"
import { ColorConverter } from "@/components/tools/color-converter"
import { JSONFormatter } from "@/components/tools/json-formatter"
import { QRCodeGenerator } from "@/components/tools/qr-code-generator"
import { UnitConverter } from "@/components/tools/unit-converter"
import { TextMinifier } from "@/components/tools/text-minifier"
import { SVGToPNG } from "@/components/tools/svg-to-png"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface ToolMapperProps {
  toolId: string | null
  onBack: () => void
}

const toolComponents: Record<string, React.ComponentType> = {
  "image-converter": ImageConverter,
  "base64-converter": Base64Converter,
  "password-generator": PasswordGenerator,
  "hash-generator": HashGenerator,
  "color-converter": ColorConverter,
  "json-formatter": JSONFormatter,
  "qr-code-generator": QRCodeGenerator,
  "unit-converter": UnitConverter,
  "text-minifier": TextMinifier,
  "svg-to-png": SVGToPNG,
  // Placeholder tools - can be implemented later
  "merge-pdfs": () => <PlaceholderTool toolName="Merge PDFs" />,
  "compress-pdf": () => <PlaceholderTool toolName="Compress PDF" />,
  "docx-to-pdf": () => <PlaceholderTool toolName="DOCX to PDF" />,
  "csv-to-excel": () => <PlaceholderTool toolName="CSV to Excel" />,
  "video-to-gif": () => <PlaceholderTool toolName="Video to GIF" />,
}

function PlaceholderTool({ toolName }: { toolName: string }) {
  return (
    <div className="w-full max-w-2xl mx-auto p-4 text-center">
      <div className="rounded-xl border-2 border-dashed border-muted-foreground/25 p-12">
        <h2 className="text-2xl font-bold mb-2">{toolName}</h2>
        <p className="text-muted-foreground mb-6">This tool is coming soon. We're working hard to implement it!</p>
        <p className="text-sm text-muted-foreground">Check back later for this feature.</p>
      </div>
    </div>
  )
}

export function ToolMapper({ toolId, onBack }: ToolMapperProps) {
  if (!toolId) return null

  const Component = toolComponents[toolId]

  if (!Component) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <Button onClick={onBack} variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="rounded-xl border-2 border-dashed border-destructive/25 p-12 text-center">
          <h2 className="text-xl font-bold text-destructive mb-2">Tool Not Found</h2>
          <p className="text-muted-foreground">The requested tool could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full pt-4">
      <Button onClick={onBack} variant="ghost" className="mb-6 sticky top-20">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Tools
      </Button>
      <Component />
    </div>
  )
}

function PlaceholderTool({ toolName }: { toolName: string }) {
  return (
    <div className="w-full max-w-2xl mx-auto p-4 text-center">
      <div className="rounded-xl border-2 border-dashed border-muted-foreground/25 p-12">
        <h2 className="text-2xl font-bold mb-2">{toolName}</h2>
        <p className="text-muted-foreground mb-6">This tool is coming soon. We're working hard to implement it!</p>
        <p className="text-sm text-muted-foreground">Check back later for this feature.</p>
      </div>
    </div>
  )
}

export function ToolMapper({ toolId, onBack }: ToolMapperProps) {
  if (!toolId) return null

  const Component = toolComponents[toolId]

  if (!Component) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <Button onClick={onBack} variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="rounded-xl border-2 border-dashed border-destructive/25 p-12 text-center">
          <h2 className="text-xl font-bold text-destructive mb-2">Tool Not Found</h2>
          <p className="text-muted-foreground">The requested tool could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full pt-4">
      <Button onClick={onBack} variant="ghost" className="mb-6 sticky top-20">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Tools
      </Button>
      <Component />
    </div>
  )
}
