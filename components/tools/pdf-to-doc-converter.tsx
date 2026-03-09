"use client"

import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Upload, Download, FileText, AlertCircle, Loader2 } from "lucide-react"

declare global {
  interface Window {
    pdfjsLib: {
      getDocument: (src: { data: ArrayBuffer }) => {
        promise: Promise<{
          numPages: number
          getPage: (num: number) => Promise<{
            getTextContent: () => Promise<{
              items: Array<{ str: string; transform: number[]; hasEOL?: boolean }>
            }>
          }>
        }>
      }
      GlobalWorkerOptions: { workerSrc: string }
    }
  }
}

interface ExtractedPage {
  pageNumber: number
  lines: string[]
}

function loadPdfJs(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) {
      resolve()
      return
    }
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs"
    script.type = "module"
    script.onload = () => {
      // pdf.js loaded via module won't attach to window easily, use legacy build
      script.remove()
      const legacyScript = document.createElement("script")
      legacyScript.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
      legacyScript.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"
          resolve()
        } else {
          reject(new Error("Failed to load PDF.js"))
        }
      }
      legacyScript.onerror = () => reject(new Error("Failed to load PDF.js"))
      document.head.appendChild(legacyScript)
    }
    script.onerror = () => {
      script.remove()
      // Try legacy build directly
      const legacyScript = document.createElement("script")
      legacyScript.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
      legacyScript.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"
          resolve()
        } else {
          reject(new Error("Failed to load PDF.js"))
        }
      }
      legacyScript.onerror = () => reject(new Error("Failed to load PDF.js"))
      document.head.appendChild(legacyScript)
    }
    document.head.appendChild(script)
  })
}

async function extractTextFromPdf(arrayBuffer: ArrayBuffer): Promise<ExtractedPage[]> {
  await loadPdfJs()
  const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const pages: ExtractedPage[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const lines: string[] = []
    let currentLine = ""

    for (const item of content.items) {
      currentLine += item.str
      if (item.hasEOL) {
        lines.push(currentLine)
        currentLine = ""
      }
    }
    if (currentLine) lines.push(currentLine)
    pages.push({ pageNumber: i, lines })
  }

  return pages
}

function generateDocx(pages: ExtractedPage[], fileName: string): Blob {
  const escapedContent = pages
    .map((page) => {
      const pageLines = page.lines
        .map((line) => {
          const escaped = line
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
          return `<w:p><w:r><w:t xml:space="preserve">${escaped}</w:t></w:r></w:p>`
        })
        .join("")
      return pageLines
    })
    .join('<w:p><w:r><w:br w:type="page"/></w:r></w:p>')

  const docContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>${escapedContent}</w:body>
</w:document>`

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`

  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`

  // Build a ZIP file manually (minimal implementation)
  const encoder = new TextEncoder()
  const files: { name: string; data: Uint8Array }[] = [
    { name: "[Content_Types].xml", data: encoder.encode(contentTypes) },
    { name: "_rels/.rels", data: encoder.encode(rels) },
    { name: "word/document.xml", data: encoder.encode(docContent) },
  ]

  return buildZip(files)
}

function buildZip(files: { name: string; data: Uint8Array }[]): Blob {
  const parts: Uint8Array[] = []
  const centralDir: Uint8Array[] = []
  let offset = 0

  for (const file of files) {
    const nameBytes = new TextEncoder().encode(file.name)
    const crc = crc32(file.data)

    // Local file header
    const localHeader = new Uint8Array(30 + nameBytes.length)
    const lhView = new DataView(localHeader.buffer)
    lhView.setUint32(0, 0x04034b50, true) // signature
    lhView.setUint16(4, 20, true) // version needed
    lhView.setUint16(6, 0, true) // flags
    lhView.setUint16(8, 0, true) // compression (store)
    lhView.setUint16(10, 0, true) // mod time
    lhView.setUint16(12, 0, true) // mod date
    lhView.setUint32(14, crc, true) // crc32
    lhView.setUint32(18, file.data.length, true) // compressed size
    lhView.setUint32(22, file.data.length, true) // uncompressed size
    lhView.setUint16(26, nameBytes.length, true) // name length
    lhView.setUint16(28, 0, true) // extra length
    localHeader.set(nameBytes, 30)

    parts.push(localHeader)
    parts.push(file.data)

    // Central directory entry
    const cdEntry = new Uint8Array(46 + nameBytes.length)
    const cdView = new DataView(cdEntry.buffer)
    cdView.setUint32(0, 0x02014b50, true) // signature
    cdView.setUint16(4, 20, true) // version made by
    cdView.setUint16(6, 20, true) // version needed
    cdView.setUint16(8, 0, true) // flags
    cdView.setUint16(10, 0, true) // compression
    cdView.setUint16(12, 0, true) // mod time
    cdView.setUint16(14, 0, true) // mod date
    cdView.setUint32(16, crc, true) // crc32
    cdView.setUint32(20, file.data.length, true) // compressed size
    cdView.setUint32(24, file.data.length, true) // uncompressed size
    cdView.setUint16(28, nameBytes.length, true) // name length
    cdView.setUint16(30, 0, true) // extra length
    cdView.setUint16(32, 0, true) // comment length
    cdView.setUint16(34, 0, true) // disk number
    cdView.setUint16(36, 0, true) // internal attrs
    cdView.setUint32(38, 0, true) // external attrs
    cdView.setUint32(42, offset, true) // local header offset
    cdEntry.set(nameBytes, 46)

    centralDir.push(cdEntry)
    offset += localHeader.length + file.data.length
  }

  const cdOffset = offset
  let cdSize = 0
  for (const entry of centralDir) {
    parts.push(entry)
    cdSize += entry.length
  }

  // End of central directory
  const eocd = new Uint8Array(22)
  const eocdView = new DataView(eocd.buffer)
  eocdView.setUint32(0, 0x06054b50, true) // signature
  eocdView.setUint16(4, 0, true) // disk number
  eocdView.setUint16(6, 0, true) // cd disk
  eocdView.setUint16(8, files.length, true) // entries on disk
  eocdView.setUint16(10, files.length, true) // total entries
  eocdView.setUint32(12, cdSize, true) // cd size
  eocdView.setUint32(16, cdOffset, true) // cd offset
  eocdView.setUint16(20, 0, true) // comment length
  parts.push(eocd)

  return new Blob(parts, {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  })
}

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff
  const table = getCrc32Table()
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ data[i]) & 0xff]
  }
  return (crc ^ 0xffffffff) >>> 0
}

let crcTable: Uint32Array | null = null
function getCrc32Table(): Uint32Array {
  if (crcTable) return crcTable
  crcTable = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    crcTable[n] = c
  }
  return crcTable
}

export function PdfToDocConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ blob: Blob; name: string; pages: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    if (selected.type !== "application/pdf") {
      setError("Please select a valid PDF file")
      return
    }

    if (selected.size > 100 * 1024 * 1024) {
      setError("File size must be less than 100MB")
      return
    }

    setFile(selected)
    setError(null)
    setResult(null)
  }

  const handleConvert = async () => {
    if (!file) return

    setIsConverting(true)
    setError(null)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pages = await extractTextFromPdf(arrayBuffer)
      const baseName = file.name.replace(/\.pdf$/i, "")
      const blob = generateDocx(pages, baseName)

      setResult({ blob, name: `${baseName}.docx`, pages: pages.length })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to convert PDF")
    } finally {
      setIsConverting(false)
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
    if (dropped?.type === "application/pdf") {
      setFile(dropped)
      setError(null)
      setResult(null)
    } else {
      setError("Please drop a valid PDF file")
    }
  }

  const handleReset = () => {
    setFile(null)
    setResult(null)
    setError(null)
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
          Convert PDF files to Word documents (.docx) — runs entirely in your browser.
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
              <Button variant="ghost" size="sm" onClick={handleReset}>
                Remove
              </Button>
            </div>

            {!result ? (
              <Button onClick={handleConvert} disabled={isConverting} className="w-full">
                {isConverting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Convert to DOCX
                  </>
                )}
              </Button>
            ) : (
              <div className="space-y-3">
                <Alert>
                  <AlertTitle>Conversion Complete</AlertTitle>
                  <AlertDescription>
                    Extracted text from {result.pages} page{result.pages !== 1 ? "s" : ""}.
                  </AlertDescription>
                </Alert>
                <div className="flex gap-2">
                  <Button onClick={handleDownload} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download {result.name}
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    Convert Another
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
