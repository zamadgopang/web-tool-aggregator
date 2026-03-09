"use client"

import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Upload, Download, FileText, AlertCircle, Loader2, ImageIcon, Type } from "lucide-react"

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    pdfjsLib: any
  }
}

type ConvertMode = "image" | "text"

// ─── PDF.js loader ──────────────────────────────────────────────────────────
function loadPdfJs(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) { resolve(); return }
    const s = document.createElement("script")
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
    s.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"
        resolve()
      } else { reject(new Error("Failed to load PDF.js")) }
    }
    s.onerror = () => reject(new Error("Failed to load PDF.js"))
    document.head.appendChild(s)
  })
}

// ─── Render PDF pages to high-res PNG blobs ─────────────────────────────────
interface RenderedPage { pngData: Uint8Array; widthPx: number; heightPx: number }

async function renderPagesToImages(
  arrayBuffer: ArrayBuffer,
  scale: number,
  onProgress: (current: number, total: number) => void,
): Promise<RenderedPage[]> {
  await loadPdfJs()
  const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const pages: RenderedPage[] = []
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")!

  for (let i = 1; i <= pdf.numPages; i++) {
    onProgress(i, pdf.numPages)
    const page = await pdf.getPage(i)
    const viewport = page.getViewport({ scale })
    canvas.width = viewport.width
    canvas.height = viewport.height
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    await page.render({ canvasContext: ctx, viewport }).promise

    const blob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/png"))
    const pngData = new Uint8Array(await blob.arrayBuffer())
    pages.push({ pngData, widthPx: canvas.width, heightPx: canvas.height })
  }
  return pages
}

// ─── Extract structured text with font info ─────────────────────────────────
interface TextSpan { text: string; fontSize: number; fontName: string; x: number; y: number; bold: boolean; italic: boolean }
interface TextPage { spans: TextSpan[]; width: number; height: number }

async function extractStructuredText(
  arrayBuffer: ArrayBuffer,
  onProgress: (current: number, total: number) => void,
): Promise<TextPage[]> {
  await loadPdfJs()
  const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const pages: TextPage[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    onProgress(i, pdf.numPages)
    const page = await pdf.getPage(i)
    const viewport = page.getViewport({ scale: 1 })
    const content = await page.getTextContent()
    const spans: TextSpan[] = []

    for (const item of content.items as any[]) {
      if (!item.str) continue
      const tx = item.transform
      const fontSize = Math.abs(tx[3]) || Math.abs(tx[0]) || 12
      const fontName: string = item.fontName || ""
      const bold = /bold/i.test(fontName)
      const italic = /italic|oblique/i.test(fontName)
      spans.push({ text: item.str, fontSize, fontName, x: tx[4], y: tx[5], bold, italic })
    }
    pages.push({ spans, width: viewport.width, height: viewport.height })
  }
  return pages
}

// ─── Build DOCX from rendered images (preserves ALL formatting) ────────────
function generateDocxFromImages(pages: RenderedPage[]): Blob {
  const EMU_PER_PX = 9525
  const MAX_WIDTH_EMU = 5943600 // ~6.2 inches (A4 with margins)

  const imageRels: string[] = []
  const imageParts: string[] = []

  const bodyParagraphs = pages.map((pg, idx) => {
    const rId = `rIdImg${idx + 1}`
    imageRels.push(
      `<Relationship Id="${rId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/page${idx + 1}.png"/>`
    )
    imageParts.push(`word/media/page${idx + 1}.png`)

    // Scale to fit page width
    let wEmu = pg.widthPx * EMU_PER_PX
    let hEmu = pg.heightPx * EMU_PER_PX
    if (wEmu > MAX_WIDTH_EMU) {
      const ratio = MAX_WIDTH_EMU / wEmu
      wEmu = MAX_WIDTH_EMU
      hEmu = Math.round(hEmu * ratio)
    }

    const pageBreak = idx < pages.length - 1
      ? `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`
      : ""

    return `<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:drawing>
<wp:inline distT="0" distB="0" distL="0" distR="0" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing">
  <wp:extent cx="${wEmu}" cy="${hEmu}"/>
  <wp:docPr id="${idx + 1}" name="Page ${idx + 1}"/>
  <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
    <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
      <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
        <pic:nvPicPr><pic:cNvPr id="${idx + 1}" name="page${idx + 1}.png"/><pic:cNvPicPr/></pic:nvPicPr>
        <pic:blipFill><a:blip r:embed="${rId}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>
        <pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${wEmu}" cy="${hEmu}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>
      </pic:pic>
    </a:graphicData>
  </a:graphic>
</wp:inline>
</w:drawing></w:r></w:p>${pageBreak}`
  }).join("")

  const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<w:body>${bodyParagraphs}
<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr>
</w:body></w:document>`

  const wordRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
${imageRels.join("\n")}
</Relationships>`

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="png" ContentType="image/png"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`

  const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`

  const encoder = new TextEncoder()
  const files: { name: string; data: Uint8Array }[] = [
    { name: "[Content_Types].xml", data: encoder.encode(contentTypes) },
    { name: "_rels/.rels", data: encoder.encode(rootRels) },
    { name: "word/document.xml", data: encoder.encode(docXml) },
    { name: "word/_rels/document.xml.rels", data: encoder.encode(wordRels) },
    ...pages.map((pg, idx) => ({ name: `word/media/page${idx + 1}.png`, data: pg.pngData })),
  ]

  return buildZip(files)
}

// ─── Build DOCX from structured text (editable, with formatting) ────────────
function generateDocxFromText(pages: TextPage[]): Blob {
  // Determine font size thresholds
  const allSizes = pages.flatMap(p => p.spans.map(s => s.fontSize))
  const medianSize = allSizes.length > 0
    ? allSizes.sort((a, b) => a - b)[Math.floor(allSizes.length / 2)]
    : 12

  const bodyContent = pages.map((page, pageIdx) => {
    // Group spans into lines by Y coordinate (within tolerance)
    const sortedSpans = [...page.spans].sort((a, b) => {
      const yDiff = b.y - a.y // top to bottom (PDF y is bottom-up)
      if (Math.abs(yDiff) < 3) return a.x - b.x // same line, left to right
      return yDiff
    })

    const lines: TextSpan[][] = []
    let currentLine: TextSpan[] = []
    let lastY = sortedSpans[0]?.y ?? 0

    for (const span of sortedSpans) {
      if (currentLine.length > 0 && Math.abs(span.y - lastY) > 3) {
        lines.push(currentLine)
        currentLine = []
      }
      currentLine.push(span)
      lastY = span.y
    }
    if (currentLine.length > 0) lines.push(currentLine)

    // Detect table-like patterns: multiple columns of text at similar Y positions
    const pageParagraphs = lines.map((line) => {
      // Sort spans left-to-right within the line
      const sorted = [...line].sort((a, b) => a.x - b.x)

      // Check for large horizontal gaps (potential table columns)
      const gaps: number[] = []
      for (let i = 1; i < sorted.length; i++) {
        const prevEnd = sorted[i - 1].x + sorted[i - 1].text.length * sorted[i - 1].fontSize * 0.5
        gaps.push(sorted[i].x - prevEnd)
      }
      const avgGap = gaps.length > 0 ? gaps.reduce((a, b) => a + b, 0) / gaps.length : 0
      const isTabular = sorted.length >= 2 && avgGap > medianSize * 2

      // Build runs with formatting
      const runs = sorted.map((span) => {
        const escaped = span.text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")

        const fontSize = span.fontSize
        const isHeading = fontSize > medianSize * 1.3
        const isLarge = fontSize > medianSize * 1.1

        let rPr = ""
        const rPrParts: string[] = []
        if (span.bold || isHeading) rPrParts.push("<w:b/>")
        if (span.italic) rPrParts.push("<w:i/>")
        // Font size in half-points
        const halfPts = Math.round(fontSize * 2)
        if (halfPts !== 24) rPrParts.push(`<w:sz w:val="${halfPts}"/><w:szCs w:val="${halfPts}"/>`)
        if (rPrParts.length > 0) rPr = `<w:rPr>${rPrParts.join("")}</w:rPr>`

        // Add tab separator for tabular data
        const separator = isTabular ? `<w:r><w:tab/></w:r>` : ""

        return `${separator}<w:r>${rPr}<w:t xml:space="preserve">${escaped}</w:t></w:r>`
      })

      // Paragraph properties for headings
      const firstSpan = sorted[0]
      let pPr = ""
      if (firstSpan) {
        if (firstSpan.fontSize > medianSize * 1.6) {
          pPr = `<w:pPr><w:pStyle w:val="Heading1"/><w:spacing w:after="120"/></w:pPr>`
        } else if (firstSpan.fontSize > medianSize * 1.3) {
          pPr = `<w:pPr><w:pStyle w:val="Heading2"/><w:spacing w:after="80"/></w:pPr>`
        } else if (isTabular) {
          // Tabular: add tab stops
          const tabStops = sorted.slice(1).map((s, i) =>
            `<w:tab w:val="left" w:pos="${Math.round(s.x * 15)}"/>`
          ).join("")
          pPr = `<w:pPr><w:tabs>${tabStops}</w:tabs></w:pPr>`
        }
      }

      return `<w:p>${pPr}${runs.join("")}</w:p>`
    })

    const pageBreak = pageIdx < pages.length - 1
      ? `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`
      : ""
    return pageParagraphs.join("") + pageBreak
  }).join("")

  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:pPr><w:spacing w:before="240" w:after="120"/></w:pPr><w:rPr><w:b/><w:sz w:val="48"/><w:szCs w:val="48"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:pPr><w:spacing w:before="200" w:after="80"/></w:pPr><w:rPr><w:b/><w:sz w:val="36"/><w:szCs w:val="36"/></w:rPr></w:style>
</w:styles>`

  const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>${bodyContent}
<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr>
</w:body></w:document>`

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`

  const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`

  const wordRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`

  const encoder = new TextEncoder()
  const files: { name: string; data: Uint8Array }[] = [
    { name: "[Content_Types].xml", data: encoder.encode(contentTypes) },
    { name: "_rels/.rels", data: encoder.encode(rootRels) },
    { name: "word/document.xml", data: encoder.encode(docXml) },
    { name: "word/styles.xml", data: encoder.encode(styles) },
    { name: "word/_rels/document.xml.rels", data: encoder.encode(wordRels) },
  ]

  return buildZip(files)
}

// ─── ZIP builder ────────────────────────────────────────────────────────────
function buildZip(files: { name: string; data: Uint8Array }[]): Blob {
  const parts: Uint8Array[] = []
  const centralDir: Uint8Array[] = []
  let offset = 0

  for (const file of files) {
    const nameBytes = new TextEncoder().encode(file.name)
    const crc = crc32(file.data)

    const localHeader = new Uint8Array(30 + nameBytes.length)
    const lhView = new DataView(localHeader.buffer)
    lhView.setUint32(0, 0x04034b50, true)
    lhView.setUint16(4, 20, true)
    lhView.setUint16(6, 0, true)
    lhView.setUint16(8, 0, true)
    lhView.setUint16(10, 0, true)
    lhView.setUint16(12, 0, true)
    lhView.setUint32(14, crc, true)
    lhView.setUint32(18, file.data.length, true)
    lhView.setUint32(22, file.data.length, true)
    lhView.setUint16(26, nameBytes.length, true)
    lhView.setUint16(28, 0, true)
    localHeader.set(nameBytes, 30)

    parts.push(localHeader)
    parts.push(file.data)

    const cdEntry = new Uint8Array(46 + nameBytes.length)
    const cdView = new DataView(cdEntry.buffer)
    cdView.setUint32(0, 0x02014b50, true)
    cdView.setUint16(4, 20, true)
    cdView.setUint16(6, 20, true)
    cdView.setUint16(8, 0, true)
    cdView.setUint16(10, 0, true)
    cdView.setUint16(12, 0, true)
    cdView.setUint16(14, 0, true)
    cdView.setUint32(16, crc, true)
    cdView.setUint32(20, file.data.length, true)
    cdView.setUint32(24, file.data.length, true)
    cdView.setUint16(28, nameBytes.length, true)
    cdView.setUint16(30, 0, true)
    cdView.setUint16(32, 0, true)
    cdView.setUint16(34, 0, true)
    cdView.setUint16(36, 0, true)
    cdView.setUint32(38, 0, true)
    cdView.setUint32(42, offset, true)
    cdEntry.set(nameBytes, 46)

    centralDir.push(cdEntry)
    offset += localHeader.length + file.data.length
  }

  const cdOffset = offset
  let cdSize = 0
  for (const entry of centralDir) { parts.push(entry); cdSize += entry.length }

  const eocd = new Uint8Array(22)
  const eocdView = new DataView(eocd.buffer)
  eocdView.setUint32(0, 0x06054b50, true)
  eocdView.setUint16(4, 0, true)
  eocdView.setUint16(6, 0, true)
  eocdView.setUint16(8, files.length, true)
  eocdView.setUint16(10, files.length, true)
  eocdView.setUint32(12, cdSize, true)
  eocdView.setUint32(16, cdOffset, true)
  eocdView.setUint16(20, 0, true)
  parts.push(eocd)

  return new Blob(parts, { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" })
}

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff
  const table = getCrc32Table()
  for (let i = 0; i < data.length; i++) crc = (crc >>> 8) ^ table[(crc ^ data[i]) & 0xff]
  return (crc ^ 0xffffffff) >>> 0
}

let crcTable: Uint32Array | null = null
function getCrc32Table(): Uint32Array {
  if (crcTable) return crcTable
  crcTable = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    crcTable[n] = c
  }
  return crcTable
}

// ─── Component ──────────────────────────────────────────────────────────────
export function PdfToDocConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [mode, setMode] = useState<ConvertMode>("image")
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ blob: Blob; name: string; pages: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    if (selected.type !== "application/pdf") { setError("Please select a valid PDF file"); return }
    if (selected.size > 100 * 1024 * 1024) { setError("File size must be less than 100MB"); return }
    setFile(selected)
    setError(null)
    setResult(null)
  }

  const handleConvert = async () => {
    if (!file) return
    setIsConverting(true)
    setError(null)
    setProgress("Loading PDF.js...")

    try {
      const arrayBuffer = await file.arrayBuffer()
      const baseName = file.name.replace(/\.pdf$/i, "")
      let blob: Blob
      let pageCount: number

      if (mode === "image") {
        const pages = await renderPagesToImages(arrayBuffer, 2, (cur, total) => {
          setProgress(`Rendering page ${cur} of ${total}...`)
        })
        pageCount = pages.length
        setProgress("Building DOCX...")
        blob = generateDocxFromImages(pages)
      } else {
        const pages = await extractStructuredText(arrayBuffer, (cur, total) => {
          setProgress(`Extracting page ${cur} of ${total}...`)
        })
        pageCount = pages.length
        setProgress("Building DOCX...")
        blob = generateDocxFromText(pages)
      }

      setResult({ blob, name: `${baseName}.docx`, pages: pageCount })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to convert PDF")
    } finally {
      setIsConverting(false)
      setProgress("")
    }
  }

  const handleDownload = () => {
    if (!result) return
    const url = URL.createObjectURL(result.blob)
    const a = document.createElement("a")
    a.href = url
    a.download = result.name
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files[0]
    if (dropped?.type === "application/pdf") { setFile(dropped); setError(null); setResult(null) }
    else { setError("Please drop a valid PDF file") }
  }

  const handleReset = () => {
    setFile(null); setResult(null); setError(null); setProgress("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          PDF to DOC Converter
        </CardTitle>
        <CardDescription>
          Convert PDF files to Word documents (.docx) with layout preservation — runs 100% in your browser.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Mode selector */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Conversion Mode</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode("image")}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-sm transition-colors ${
                mode === "image"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <ImageIcon className="h-6 w-6" />
              <span className="font-medium">Preserve Layout</span>
              <span className="text-xs text-muted-foreground text-center">
                Keeps tables, fonts & formatting exactly as in PDF
              </span>
            </button>
            <button
              onClick={() => setMode("text")}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-sm transition-colors ${
                mode === "text"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <Type className="h-6 w-6" />
              <span className="font-medium">Editable Text</span>
              <span className="text-xs text-muted-foreground text-center">
                Extracts text with headings, bold & structure
              </span>
            </button>
          </div>
        </div>

        {!file ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-12 text-center cursor-pointer transition-colors hover:border-primary/50 hover:bg-muted/50"
          >
            <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-1">Drop a PDF here or click to browse</p>
            <p className="text-sm text-muted-foreground">Max file size: 100MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-red-500" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleReset}>Remove</Button>
            </div>

            {!result ? (
              <div className="space-y-3">
                <Button onClick={handleConvert} disabled={isConverting} className="w-full">
                  {isConverting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {progress || "Converting..."}
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Convert to DOCX
                    </>
                  )}
                </Button>
                {mode === "image" && (
                  <p className="text-xs text-muted-foreground text-center">
                    Each page is rendered as a high-quality image to preserve exact layout
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <Alert>
                  <AlertTitle>Conversion Complete</AlertTitle>
                  <AlertDescription>
                    {mode === "image"
                      ? `Rendered ${result.pages} page${result.pages !== 1 ? "s" : ""} with full layout preservation.`
                      : `Extracted formatted text from ${result.pages} page${result.pages !== 1 ? "s" : ""}.`}
                  </AlertDescription>
                </Alert>
                <div className="flex gap-2">
                  <Button onClick={handleDownload} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download {result.name}
                  </Button>
                  <Button variant="outline" onClick={handleReset}>Convert Another</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
