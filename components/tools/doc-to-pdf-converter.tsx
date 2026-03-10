"use client"

import React, { useState, useRef } from "react"
import DOMPurify from "dompurify"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Upload, Download, FileText, AlertCircle, Loader2, Eye } from "lucide-react"

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    mammoth: any
    html2canvas: any
    jspdf: any
  }
}

function loadScript(id: string, srcs: string | string[]): Promise<void> {
  const urls = Array.isArray(srcs) ? srcs : [srcs]
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(id)
    if (existing) {
      if (!(existing as HTMLScriptElement).dataset.loaded) {
        existing.remove()
      } else {
        resolve()
        return
      }
    }
    let attempt = 0
    function tryLoad() {
      if (attempt >= urls.length) {
        reject(new Error(`Failed to load ${id}`))
        return
      }
      const s = document.createElement("script")
      s.id = id
      s.src = urls[attempt]
      s.crossOrigin = "anonymous"
      s.onload = () => { s.dataset.loaded = "true"; resolve() }
      s.onerror = () => { s.remove(); attempt++; tryLoad() }
      document.head.appendChild(s)
    }
    tryLoad()
  })
}

async function loadDependencies(onProgress: (msg: string) => void): Promise<void> {
  onProgress("Loading document parser...")
  await loadScript("mammoth-js", [
    "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js",
    "https://unpkg.com/mammoth@1.8.0/mammoth.browser.min.js",
  ])
  if (!window.mammoth) throw new Error("Failed to initialize document parser")
  onProgress("Loading PDF renderer...")
  await loadScript("html2canvas-js", [
    "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
    "https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js",
  ])
  if (!window.html2canvas) throw new Error("Failed to initialize PDF renderer")
  await loadScript("jspdf-js", [
    "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
    "https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js",
  ])
  if (!window.jspdf) throw new Error("Failed to initialize PDF generator")
}

async function convertDocxToHtml(arrayBuffer: ArrayBuffer): Promise<{ html: string; messages: string[] }> {
  const result = await window.mammoth.convertToHtml(
    { arrayBuffer },
    {
      styleMap: [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "p[style-name='Heading 4'] => h4:fresh",
        "p[style-name='Title'] => h1.doc-title:fresh",
        "p[style-name='Subtitle'] => h2.doc-subtitle:fresh",
        "p[style-name='List Paragraph'] => li:fresh",
        "r[style-name='Strong'] => strong",
        "r[style-name='Emphasis'] => em",
        "p[style-name='Quote'] => blockquote > p:fresh",
        "p[style-name='Intense Quote'] => blockquote > p:fresh",
        "p[style-name='No Spacing'] => p.no-spacing:fresh",
      ],
      convertImage: window.mammoth.images.imgElement(function (image: any) {
        return image.read("base64").then(function (imageBuffer: string) {
          return {
            src: `data:${image.contentType};base64,${imageBuffer}`,
            style: "max-width:100%;height:auto;",
          }
        })
      }),
    }
  )
  return { html: result.value, messages: result.messages.map((m: any) => m.message) }
}

const DOC_STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body, .doc-render {
    font-family: 'Calibri', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.5;
    color: #1a1a1a;
    background: #fff;
    width: 794px;
    padding: 56px 72px;
  }
  h1 { font-size: 24pt; font-weight: 700; color: #1a1a1a; margin: 0 0 12pt; line-height: 1.2; }
  h1.doc-title { font-size: 28pt; color: #2b579a; margin: 0 0 4pt; }
  h2 { font-size: 18pt; font-weight: 600; color: #2b579a; margin: 20pt 0 8pt; line-height: 1.3; }
  h2.doc-subtitle { font-size: 15pt; color: #595959; margin: 0 0 16pt; font-weight: 400; }
  h3 { font-size: 14pt; font-weight: 600; color: #1a1a1a; margin: 16pt 0 6pt; line-height: 1.3; }
  h4 { font-size: 12pt; font-weight: 600; color: #2b579a; margin: 12pt 0 4pt; font-style: italic; }
  p { margin: 0 0 8pt; line-height: 1.5; }
  p.no-spacing { margin: 0; }
  strong, b { font-weight: 700; }
  em, i { font-style: italic; }
  u { text-decoration: underline; }
  s, strike { text-decoration: line-through; }
  sup { vertical-align: super; font-size: 0.75em; }
  sub { vertical-align: sub; font-size: 0.75em; }
  a { color: #2b579a; text-decoration: underline; }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12pt 0;
    font-size: 10pt;
  }
  th, td {
    border: 1px solid #a6a6a6;
    padding: 6pt 10pt;
    text-align: left;
    vertical-align: top;
    line-height: 1.4;
  }
  th {
    background: #d9e2f3;
    font-weight: 700;
    color: #1a1a1a;
  }
  tr:nth-child(even) td { background: #f2f2f2; }
  ul, ol { margin: 4pt 0 8pt 0; padding-left: 24pt; }
  li { margin: 3pt 0; line-height: 1.5; }
  li > ul, li > ol { margin: 2pt 0 2pt 0; }
  blockquote {
    border-left: 4pt solid #2b579a;
    margin: 12pt 0;
    padding: 8pt 16pt;
    color: #404040;
    background: #f8f9fa;
    font-style: italic;
  }
  blockquote p { margin: 0; }
  img { max-width: 100%; height: auto; margin: 8pt 0; }
  hr { border: none; border-top: 1pt solid #d0d0d0; margin: 16pt 0; }
`

async function generatePdf(
  html: string,
  fileName: string,
  onProgress: (msg: string) => void,
): Promise<Blob> {
  // Use an iframe to isolate from the page's CSS (avoids html2canvas errors with lab() colors)
  const iframe = document.createElement("iframe")
  iframe.style.position = "fixed"
  iframe.style.left = "-9999px"
  iframe.style.top = "0"
  iframe.style.width = "794px"
  iframe.style.height = "1200px"
  iframe.style.border = "none"
  iframe.style.zIndex = "-1"
  document.body.appendChild(iframe)

  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
    if (!iframeDoc) throw new Error("Failed to create rendering context")

    iframeDoc.open()
    const sanitizedHtml = DOMPurify.sanitize(html, { ADD_TAGS: ['style'], ADD_ATTR: ['style', 'class'] })
    iframeDoc.write(`<!DOCTYPE html><html><head><style>${DOC_STYLES}</style></head><body><div class="doc-render">${sanitizedHtml}</div></body></html>`)
    iframeDoc.close()

    const contentEl = iframeDoc.querySelector(".doc-render") as HTMLElement
    if (!contentEl) throw new Error("Failed to render document content")

    // Wait for images
    const images = contentEl.querySelectorAll("img")
    await Promise.all(
      Array.from(images).map(
        (img) =>
          new Promise<void>((res) => {
            if (img.complete) { res(); return }
            img.onload = () => res()
            img.onerror = () => res()
          })
      )
    )

    // Small delay for layout
    await new Promise((r) => setTimeout(r, 300))

    onProgress("Rendering document...")

    const A4_W = 794  // px at 96dpi
    const A4_H = 1123 // px at 96dpi
    const SCALE = 2   // high resolution

    // Resize iframe to fit content
    const totalHeight = contentEl.scrollHeight
    iframe.style.height = `${totalHeight + 200}px`

    // Wait for resize
    await new Promise((r) => setTimeout(r, 100))

    // Calculate number of pages
    const contentPageH = A4_H - 112 // subtract top+bottom padding
    const pageCount = Math.max(1, Math.ceil(totalHeight / contentPageH))

    const { jsPDF } = window.jspdf
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [A4_W, A4_H], hotfixes: ["px_scaling"] })

    for (let page = 0; page < pageCount; page++) {
      onProgress(`Rendering page ${page + 1} of ${pageCount}...`)

      if (page > 0) pdf.addPage()

      // Render content to canvas using the iframe's html2canvas reference
      const canvas = await window.html2canvas(contentEl, {
        scale: SCALE,
        width: A4_W,
        windowWidth: A4_W,
        y: page * contentPageH,
        height: Math.min(contentPageH, totalHeight - page * contentPageH),
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      })

      const imgData = canvas.toDataURL("image/jpeg", 0.95)
      const imgH = (canvas.height / SCALE)
      pdf.addImage(imgData, "JPEG", 0, 56, A4_W, imgH) // 56px = top padding
    }

    onProgress("Finalizing PDF...")
    return pdf.output("blob")
  } finally {
    document.body.removeChild(iframe)
  }
}

export function DocToPdfConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
  const [previewHtml, setPreviewHtml] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const acceptedTypes = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ]

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    if (!acceptedTypes.includes(selected.type) && !selected.name.match(/\.(docx?|DOCX?)$/)) {
      setError("Please select a DOC or DOCX file"); return
    }
    if (selected.size > 100 * 1024 * 1024) {
      setError("File size must be less than 100MB"); return
    }
    setFile(selected)
    setError(null)
    setPdfBlob(null)
    setPreviewHtml(null)
    setShowPreview(false)
  }

  const handleConvert = async () => {
    if (!file) return
    setIsConverting(true)
    setError(null)
    setPdfBlob(null)
    setPreviewHtml(null)

    try {
      await loadDependencies(setProgress)

      setProgress("Parsing document...")
      const arrayBuffer = await file.arrayBuffer()
      const { html } = await convertDocxToHtml(arrayBuffer)
      setPreviewHtml(html)

      const blob = await generatePdf(html, file.name, setProgress)
      setPdfBlob(blob)
      setProgress("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to convert document")
    } finally {
      setIsConverting(false)
      setProgress("")
    }
  }

  const handleDownload = () => {
    if (!pdfBlob || !file) return
    const url = URL.createObjectURL(pdfBlob)
    const a = document.createElement("a")
    a.href = url
    a.download = file.name.replace(/\.(docx?|DOCX?)$/, "") + ".pdf"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files[0]
    if (dropped && (acceptedTypes.includes(dropped.type) || dropped.name.match(/\.(docx?|DOCX?)$/))) {
      setFile(dropped); setError(null); setPdfBlob(null); setPreviewHtml(null); setShowPreview(false)
    } else { setError("Please drop a DOC or DOCX file") }
  }

  const handleReset = () => {
    setFile(null); setPdfBlob(null); setPreviewHtml(null); setError(null); setProgress(""); setShowPreview(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const pdfSizeMB = pdfBlob ? (pdfBlob.size / 1024 / 1024).toFixed(2) : null

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          DOC / DOCX to PDF Converter
        </CardTitle>
        <CardDescription>
          Convert Word documents to high-quality PDF with formatting, tables, images, and styles preserved — runs 100% in your browser.
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
            <p className="text-lg font-medium mb-1">Drop a DOC/DOCX file here or click to browse</p>
            <p className="text-sm text-muted-foreground">Supports .doc and .docx files up to 100MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleReset}>Remove</Button>
            </div>

            {!pdfBlob ? (
              <Button onClick={handleConvert} disabled={isConverting} className="w-full" size="lg">
                {isConverting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {progress || "Converting..."}
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Convert to PDF
                  </>
                )}
              </Button>
            ) : (
              <div className="space-y-4">
                <Alert>
                  <AlertTitle>PDF Ready!</AlertTitle>
                  <AlertDescription>
                    Your PDF has been generated ({pdfSizeMB} MB) with all formatting preserved.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-2">
                  <Button onClick={handleDownload} className="flex-1" size="lg">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {showPreview ? "Hide" : "Preview"}
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    New File
                  </Button>
                </div>

                {showPreview && previewHtml && (
                  <div className="rounded-lg border overflow-hidden">
                    <div className="bg-muted px-4 py-2 text-sm font-medium border-b flex items-center justify-between">
                      <span>Document Preview</span>
                      <span className="text-xs text-muted-foreground">{pdfSizeMB} MB</span>
                    </div>
                    <div className="overflow-auto max-h-[700px] bg-white">
                      <div
                        className="mx-auto"
                        style={{ width: 794, padding: "56px 72px", fontFamily: "Calibri, 'Segoe UI', sans-serif", fontSize: "11pt", lineHeight: 1.5, color: "#1a1a1a" }}
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(previewHtml, { ADD_TAGS: ['style'], ADD_ATTR: ['style'] }) }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
