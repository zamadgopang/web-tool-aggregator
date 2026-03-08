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
import { MarkdownPreview } from "@/components/tools/markdown-preview"
import { RegexTester } from "@/components/tools/regex-tester"
import { URLEncoderDecoder } from "@/components/tools/url-encoder-decoder"
import { LoremIpsumGenerator } from "@/components/tools/lorem-ipsum-generator"
import { TextDiffChecker } from "@/components/tools/text-diff-checker"
import { JWTDecoder } from "@/components/tools/jwt-decoder"
import { TimestampConverter } from "@/components/tools/timestamp-converter"
import { UUIDGenerator } from "@/components/tools/uuid-generator"
import { JsonToTypescript } from "@/components/tools/json-to-typescript"
import { YamlJsonConverter } from "@/components/tools/yaml-json-converter"
import { CronParser } from "@/components/tools/cron-parser"
import { CSSGradientGenerator } from "@/components/tools/css-gradient-generator"
import { SQLFormatter } from "@/components/tools/sql-formatter"
import { HTMLEntityEncoder } from "@/components/tools/html-entity-encoder"
import { ImageCropperResizer } from "@/components/tools/image-cropper-resizer"
import { MetaTagGenerator } from "@/components/tools/meta-tag-generator"
import { CSSBoxShadowGenerator } from "@/components/tools/css-box-shadow-generator"
import { ChmodCalculator } from "@/components/tools/chmod-calculator"
import { AspectRatioCalculator } from "@/components/tools/aspect-ratio-calculator"
import { ColorPaletteGenerator } from "@/components/tools/color-palette-generator"
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
  "markdown-preview": MarkdownPreview,
  "regex-tester": RegexTester,
  "url-encoder-decoder": URLEncoderDecoder,
  "lorem-ipsum-generator": LoremIpsumGenerator,
  "text-diff-checker": TextDiffChecker,
  "jwt-decoder": JWTDecoder,
  "timestamp-converter": TimestampConverter,
  "uuid-generator": UUIDGenerator,
  "json-to-typescript": JsonToTypescript,
  "yaml-json-converter": YamlJsonConverter,
  "cron-parser": CronParser,
  "css-gradient-generator": CSSGradientGenerator,
  "sql-formatter": SQLFormatter,
  "html-entity-encoder": HTMLEntityEncoder,
  "image-cropper-resizer": ImageCropperResizer,
  "meta-tag-generator": MetaTagGenerator,
  "css-box-shadow-generator": CSSBoxShadowGenerator,
  "chmod-calculator": ChmodCalculator,
  "aspect-ratio-calculator": AspectRatioCalculator,
  "color-palette-generator": ColorPaletteGenerator,
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
      <Button onClick={onBack} variant="ghost" className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Tools
      </Button>
      <Component />
    </div>
  )
}
