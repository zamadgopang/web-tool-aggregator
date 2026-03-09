"use client"

import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Upload, Download, FileText, AlertCircle, Loader2 } from "lucide-react"

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    mammoth: any
  }
}

function loadMammoth(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.mammoth) { resolve(); return }
    const s = document.createElement("script")
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js"
    s.onload = () => window.mammoth ? resolve() : reject(new Error("Failed to load mammoth.js"))
    s.onerror = () => reject(new Error("Failed to load mammoth.js"))
    document.head.appendChild(s)
  })
}

function htmlToPdfBlob(html: string, fileName: string): Promise<Blob> {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe")
    iframe.style.position = "fixed"
    iframe.style.left = "-9999px"
    iframe.style.width = "794px" // A4 width at 96dpi
    iframe.style.height = "1123px"
    document.body.appendChild(iframe)

    const doc = iframe.contentDocument!
    doc.open()
    doc.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @page { size: A4; margin: 20mm; }
  * { box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 11pt;
    line-height: 1.6;
    color: #222;
    margin: 0;
    padding: 20mm;
  }
  h1 { font-size: 22pt; margin: 0 0 12pt; color: #111; }
  h2 { font-size: 17pt; margin: 16pt 0 8pt; color: #222; }
  h3 { font-size: 13pt; margin: 12pt 0 6pt; color: #333; }
  p { margin: 0 0 8pt; }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 10pt 0;
    page-break-inside: auto;
  }
  th, td {
    border: 1px solid #999;
    padding: 6pt 8pt;
    text-align: left;
    font-size: 10pt;
  }
  th { background: #f0f0f0; font-weight: bold; }
  tr { page-break-inside: avoid; }
  ul, ol { margin: 4pt 0 8pt 20pt; padding: 0; }
  li { margin: 2pt 0; }
  img { max-width: 100%; height: auto; }
  strong, b { font-weight: bold; }
  em, i { font-style: italic; }
  u { text-decoration: underline; }
  blockquote {
    border-left: 3pt solid #ccc;
    margin: 8pt 0;
    padding: 4pt 12pt;
    color: #555;
  }
  @media print {
    body { padding: 0; }
  }
</style>
</head>
<body>${html}</body>
</html>`)
    doc.close()

    // Wait for images to load, then print to PDF
    const images = doc.querySelectorAll("img")
    const imagePromises = Array.from(images).map(
      (img) => new Promise<void>((res) => {
        if (img.complete) { res(); return }
        img.onload = () => res()
        img.onerror = () => res()
      })
    )

    Promise.all(imagePromises).then(() => {
      setTimeout(() => {
        // Use print to generate PDF
        const printWindow = iframe.contentWindow!
        
        // Canvas-based PDF approach: render to canvas then create PDF
        // Since we can't directly create a PDF binary in-browser without a library,
        // we'll use the print dialog which produces the best quality PDF
        printWindow.focus()
        printWindow.print()

        // Clean up after a delay
        setTimeout(() => {
          document.body.removeChild(iframe)
        }, 1000)

        // Return the HTML as a blob for the alternative download option
        resolve(new Blob([doc.documentElement.outerHTML], { type: "text/html" }))
      }, 500)
    })
  })
}

async function convertDocxToHtml(arrayBuffer: ArrayBuffer): Promise<{ html: string; messages: string[] }> {
  await loadMammoth()
  const result = await window.mammoth.convertToHtml(
    { arrayBuffer },
    {
      styleMap: [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "p[style-name='Title'] => h1:fresh",
        "p[style-name='Subtitle'] => h2:fresh",
        "b => strong",
        "i => em",
        "u => u",
        "strike => s",
      ],
      convertImage: window.mammoth.images.imgElement(function (image: any) {
        return image.read("base64").then(function (imageBuffer: string) {
          return { src: `data:${image.contentType};base64,${imageBuffer}` }
        })
      }),
    }
  )
  return { html: result.value, messages: result.messages.map((m: any) => m.message) }
}

export function DocToPdfConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [htmlResult, setHtmlResult] = useState<string | null>(null)
  const [warnings, setWarnings] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const acceptedTypes = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ]

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    if (!acceptedTypes.includes(selected.type) && !selected.name.match(/\.(docx?|DOCX?)$/)) {
      setError("Please select a DOC or DOCX file")
      return
    }
    if (selected.size > 100 * 1024 * 1024) {
      setError("File size must be less than 100MB")
      return
    }
    setFile(selected)
    setError(null)
    setHtmlResult(null)
    setWarnings([])
  }

  const handleConvert = async () => {
    if (!file) return
    setIsConverting(true)
    setError(null)
    setProgress("Loading document parser...")

    try {
      const arrayBuffer = await file.arrayBuffer()
      setProgress("Converting document...")
      const { html, messages } = await convertDocxToHtml(arrayBuffer)
      setHtmlResult(html)
      setWarnings(messages.slice(0, 5))
      setProgress("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to convert document")
    } finally {
      setIsConverting(false)
      setProgress("")
    }
  }

  const handlePrintPdf = () => {
    if (!htmlResult) return
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      setError("Please allow popups to generate PDF")
      return
    }
    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${file?.name || "Document"}</title>
<style>
  @page { size: A4; margin: 20mm; }
  * { box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 11pt;
    line-height: 1.6;
    color: #222;
    max-width: 210mm;
    margin: 0 auto;
    padding: 20mm;
  }
  h1 { font-size: 22pt; margin: 0 0 12pt; color: #111; }
  h2 { font-size: 17pt; margin: 16pt 0 8pt; color: #222; }
  h3 { font-size: 13pt; margin: 12pt 0 6pt; color: #333; }
  p { margin: 0 0 8pt; }
  table { width: 100%; border-collapse: collapse; margin: 10pt 0; }
  th, td { border: 1px solid #999; padding: 6pt 8pt; text-align: left; font-size: 10pt; }
  th { background: #f0f0f0; font-weight: bold; }
  ul, ol { margin: 4pt 0 8pt 20pt; padding: 0; }
  li { margin: 2pt 0; }
  img { max-width: 100%; height: auto; }
  blockquote { border-left: 3pt solid #ccc; margin: 8pt 0; padding: 4pt 12pt; color: #555; }
</style>
</head>
<body>${htmlResult}</body>
</html>`)
    printWindow.document.close()
    setTimeout(() => {
      printWindow.focus()
      printWindow.print()
    }, 500)
  }

  const handleDownloadHtml = () => {
    if (!htmlResult) return
    const fullHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${file?.name || "Document"}</title>
<style>
body{font-family:'Segoe UI',sans-serif;font-size:11pt;line-height:1.6;color:#222;max-width:800px;margin:0 auto;padding:40px;}
h1{font-size:22pt;margin:0 0 12pt;}h2{font-size:17pt;margin:16pt 0 8pt;}h3{font-size:13pt;margin:12pt 0 6pt;}
p{margin:0 0 8pt;}table{width:100%;border-collapse:collapse;margin:10pt 0;}th,td{border:1px solid #999;padding:6pt 8pt;}
th{background:#f0f0f0;font-weight:bold;}ul,ol{margin:4pt 0 8pt 20pt;}img{max-width:100%;}
blockquote{border-left:3pt solid #ccc;margin:8pt 0;padding:4pt 12pt;color:#555;}
</style></head>
<body>${htmlResult}</body></html>`
    const blob = new Blob([fullHtml], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = (file?.name || "document").replace(/\.(docx?|DOCX?)$/, "") + ".html"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files[0]
    if (dropped && (acceptedTypes.includes(dropped.type) || dropped.name.match(/\.(docx?|DOCX?)$/))) {
      setFile(dropped)
      setError(null)
      setHtmlResult(null)
      setWarnings([])
    } else {
      setError("Please drop a DOC or DOCX file")
    }
  }

  const handleReset = () => {
    setFile(null)
    setHtmlResult(null)
    setError(null)
    setProgress("")
    setWarnings([])
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          DOC / DOCX to PDF Converter
        </CardTitle>
        <CardDescription>
          Convert Word documents to PDF with formatting, tables, and images preserved — 100% in your browser.
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

            {!htmlResult ? (
              <Button onClick={handleConvert} disabled={isConverting} className="w-full">
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
                {warnings.length > 0 && (
                  <Alert>
                    <AlertTitle>Conversion Notes</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc pl-4 text-xs mt-1 space-y-0.5">
                        {warnings.map((w, i) => <li key={i}>{w}</li>)}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  <Button onClick={handlePrintPdf} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Save as PDF
                  </Button>
                  <Button variant="outline" onClick={handleDownloadHtml}>
                    Download HTML
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    New File
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Click &quot;Save as PDF&quot; → select &quot;Save as PDF&quot; as the destination in the print dialog
                </p>

                {/* Live preview */}
                <div className="rounded-lg border overflow-hidden">
                  <div className="bg-muted px-4 py-2 text-sm font-medium border-b">Preview</div>
                  <div
                    ref={previewRef}
                    className="p-6 bg-white text-black max-h-[600px] overflow-auto prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: htmlResult }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
