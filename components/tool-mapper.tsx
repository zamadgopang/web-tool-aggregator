"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

const toolComponents: Record<string, React.ComponentType> = {
  "image-converter": dynamic(() => import("@/components/tools/image-converter").then((m) => m.ImageConverter)),
  "base64-converter": dynamic(() => import("@/components/tools/base64-converter").then((m) => m.Base64Converter)),
  "password-generator": dynamic(() => import("@/components/tools/password-generator").then((m) => m.PasswordGenerator)),
  "hash-generator": dynamic(() => import("@/components/tools/hash-generator").then((m) => m.HashGenerator)),
  "color-converter": dynamic(() => import("@/components/tools/color-converter").then((m) => m.ColorConverter)),
  "json-formatter": dynamic(() => import("@/components/tools/json-formatter").then((m) => m.JSONFormatter)),
  "qr-code-generator": dynamic(() => import("@/components/tools/qr-code-generator").then((m) => m.QRCodeGenerator)),
  "unit-converter": dynamic(() => import("@/components/tools/unit-converter").then((m) => m.UnitConverter)),
  "text-minifier": dynamic(() => import("@/components/tools/text-minifier").then((m) => m.TextMinifier)),
  "svg-to-png": dynamic(() => import("@/components/tools/svg-to-png").then((m) => m.SVGToPNG)),
  "markdown-preview": dynamic(() => import("@/components/tools/markdown-preview").then((m) => m.MarkdownPreview)),
  "regex-tester": dynamic(() => import("@/components/tools/regex-tester").then((m) => m.RegexTester)),
  "url-encoder-decoder": dynamic(() => import("@/components/tools/url-encoder-decoder").then((m) => m.URLEncoderDecoder)),
  "lorem-ipsum-generator": dynamic(() => import("@/components/tools/lorem-ipsum-generator").then((m) => m.LoremIpsumGenerator)),
  "text-diff-checker": dynamic(() => import("@/components/tools/text-diff-checker").then((m) => m.TextDiffChecker)),
  "jwt-decoder": dynamic(() => import("@/components/tools/jwt-decoder").then((m) => m.JWTDecoder)),
  "timestamp-converter": dynamic(() => import("@/components/tools/timestamp-converter").then((m) => m.TimestampConverter)),
  "uuid-generator": dynamic(() => import("@/components/tools/uuid-generator").then((m) => m.UUIDGenerator)),
  "json-to-typescript": dynamic(() => import("@/components/tools/json-to-typescript").then((m) => m.JsonToTypescript)),
  "yaml-json-converter": dynamic(() => import("@/components/tools/yaml-json-converter").then((m) => m.YamlJsonConverter)),
  "cron-parser": dynamic(() => import("@/components/tools/cron-parser").then((m) => m.CronParser)),
  "css-gradient-generator": dynamic(() => import("@/components/tools/css-gradient-generator").then((m) => m.CSSGradientGenerator)),
  "sql-formatter": dynamic(() => import("@/components/tools/sql-formatter").then((m) => m.SQLFormatter)),
  "html-entity-encoder": dynamic(() => import("@/components/tools/html-entity-encoder").then((m) => m.HTMLEntityEncoder)),
  "image-cropper-resizer": dynamic(() => import("@/components/tools/image-cropper-resizer").then((m) => m.ImageCropperResizer)),
  "meta-tag-generator": dynamic(() => import("@/components/tools/meta-tag-generator").then((m) => m.MetaTagGenerator)),
  "css-box-shadow-generator": dynamic(() => import("@/components/tools/css-box-shadow-generator").then((m) => m.CSSBoxShadowGenerator)),
  "chmod-calculator": dynamic(() => import("@/components/tools/chmod-calculator").then((m) => m.ChmodCalculator)),
  "aspect-ratio-calculator": dynamic(() => import("@/components/tools/aspect-ratio-calculator").then((m) => m.AspectRatioCalculator)),
  "color-palette-generator": dynamic(() => import("@/components/tools/color-palette-generator").then((m) => m.ColorPaletteGenerator)),
  "pdf-to-doc-converter": dynamic(() => import("@/components/tools/pdf-to-doc-converter").then((m) => m.PdfToDocConverter)),
  "doc-to-pdf-converter": dynamic(() => import("@/components/tools/doc-to-pdf-converter").then((m) => m.DocToPdfConverter)),
  "seo-performance-auditor": dynamic(() => import("@/components/tools/seo-performance-auditor").then((m) => m.SeoPerformanceAuditor)),
  "python-compiler": dynamic(() => import("@/components/tools/python-compiler").then((m) => m.PythonCompiler)),
}

interface ToolMapperProps {
  toolId: string | null
}

export function ToolMapper({ toolId }: ToolMapperProps) {
  if (!toolId) return null

  const Component = toolComponents[toolId]

  if (!Component) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
            Back
          </Link>
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
      <Button asChild variant="ghost" className="mb-6" aria-label="Back to all tools">
        <Link href="/">
          <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
          Back to Tools
        </Link>
      </Button>
      <Component />
    </div>
  )
}
