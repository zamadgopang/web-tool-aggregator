"use client"

import React, { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { Upload, Download, X, Image as ImageIcon, AlertCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export function SVGToPNG() {
  const [svgContent, setSvgContent] = useState("")
  const [scale, setScale] = useState(1)
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [transparentBg, setTransparentBg] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.includes("svg") && !file.name.endsWith(".svg")) {
      setError("Please select a valid SVG file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setSvgContent(content)
      setError(null)
      generatePreview(content)
    }
    reader.onerror = () => {
      setError("Failed to read file")
    }
    reader.readAsText(file)
  }

  const generatePreview = (svg: string) => {
    try {
      const blob = new Blob([svg], { type: "image/svg+xml" })
      const url = URL.createObjectURL(blob)
      setPreview(url)
    } catch (err) {
      setError("Failed to generate preview")
    }
  }

  const handleConvert = async () => {
    if (!svgContent) {
      setError("Please upload an SVG file first")
      return
    }

    setIsConverting(true)
    setError(null)

    try {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        setError("Failed to get canvas context")
        setIsConverting(false)
        return
      }

      const blob = new Blob([svgContent], { type: "image/svg+xml" })
      const url = URL.createObjectURL(blob)

      const img = new Image()
      img.onload = () => {
        const width = Math.ceil(img.width * scale)
        const height = Math.ceil(img.height * scale)

        canvas.width = width
        canvas.height = height

        // Set background
        if (transparentBg) {
          ctx.clearRect(0, 0, width, height)
        } else {
          ctx.fillStyle = backgroundColor
          ctx.fillRect(0, 0, width, height)
        }

        // Draw scaled image
        ctx.scale(scale, scale)
        ctx.drawImage(img, 0, 0)

        // Download
        canvas.toBlob((pngBlob) => {
          if (!pngBlob) {
            setError("Failed to convert SVG")
            setIsConverting(false)
            return
          }

          const downloadUrl = URL.createObjectURL(pngBlob)
          const link = document.createElement("a")
          link.href = downloadUrl
          link.download = `converted-${Date.now()}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(downloadUrl)
          URL.revokeObjectURL(url)

          setIsConverting(false)
        })
      }

      img.onerror = () => {
        setError("Failed to load SVG")
        URL.revokeObjectURL(url)
        setIsConverting(false)
      }

      img.src = url
    } catch (err) {
      setError("Conversion failed. The SVG format may not be supported.")
      setIsConverting(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>SVG to PNG Converter</CardTitle>
          <CardDescription>Convert vector SVG images to raster PNG with custom scaling</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={cn(
              "relative border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              !svgContent
                ? "border-muted-foreground/25 hover:border-muted-foreground/50 bg-muted/25 hover:bg-muted/50"
                : "border-green-500/50 bg-green-50/10"
            )}
            role="button"
            tabIndex={0}
            aria-label="Upload SVG file"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                fileInputRef.current?.click()
              }
            }}
            onDragOver={(e) => {
              e.preventDefault()
              e.currentTarget.classList.add("border-primary")
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              e.currentTarget.classList.remove("border-primary")
            }}
            onDrop={(e) => {
              e.preventDefault()
              e.currentTarget.classList.remove("border-primary")
              const file = e.dataTransfer.files[0]
              if (file) {
                fileInputRef.current!.files = e.dataTransfer.files
                handleFileSelect({ target: { files: e.dataTransfer.files } } as any)
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg,image/svg+xml"
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Upload SVG file"
            />

            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">SVG files only (Max 5MB)</p>
              </div>
            </div>
          </div>

          {svgContent && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">SVG Uploaded</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSvgContent("")
                    setPreview(null)
                    setError(null)
                    if (fileInputRef.current) fileInputRef.current.value = ""
                  }}
                  aria-label="Remove SVG"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {preview && (
                <div className="relative w-full bg-muted rounded-lg overflow-hidden p-4 flex items-center justify-center min-h-48">
                  <img
                    src={preview}
                    alt="SVG Preview"
                    className="max-w-full max-h-48 object-contain"
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conversion Options */}
      {svgContent && (
        <Card>
          <CardHeader>
            <CardTitle>Conversion Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Scale */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="scale-slider">Scale: {scale.toFixed(2)}x</Label>
                <span className="text-xs text-muted-foreground">Adjust resolution</span>
              </div>
              <Slider
                id="scale-slider"
                value={[scale]}
                onValueChange={(value) => setScale(value[0])}
                min={0.5}
                max={4}
                step={0.25}
                className="w-full"
                aria-label="SVG scale multiplier"
              />
              <div className="text-xs text-muted-foreground">
                Current scale: {Math.round(scale * 100)}% of original size
              </div>
            </div>

            {/* Background Options */}
            <div className="space-y-3">
              <Label>Background</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="transparent"
                    checked={transparentBg}
                    onCheckedChange={(checked) => setTransparentBg(checked as boolean)}
                  />
                  <Label htmlFor="transparent" className="font-normal cursor-pointer">
                    Transparent Background
                  </Label>
                </div>

                {!transparentBg && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                      aria-label="Background color picker"
                    />
                    <Input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="flex-1 font-mono text-sm"
                      placeholder="#ffffff"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Convert Button */}
            <Button
              onClick={handleConvert}
              disabled={isConverting}
              size="lg"
              className="w-full"
            >
              {isConverting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-background border-t-foreground rounded-full" />
                  Converting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Convert to PNG
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
