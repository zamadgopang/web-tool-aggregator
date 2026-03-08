"use client"

import React, { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, Download, X, Image as ImageIcon, AlertCircle, Maximize2 } from "lucide-react"

type ImageFormat = "jpg" | "png" | "webp" | "bmp" | "gif"

interface ImageFile {
  file: File
  preview: string
  width?: number
  height?: number
}

const supportedFormats: { format: ImageFormat; label: string; mimeType: string; supportsQuality: boolean }[] = [
  { format: "jpg", label: "JPEG", mimeType: "image/jpeg", supportsQuality: true },
  { format: "png", label: "PNG", mimeType: "image/png", supportsQuality: false },
  { format: "webp", label: "WebP", mimeType: "image/webp", supportsQuality: true },
  { format: "bmp", label: "BMP", mimeType: "image/bmp", supportsQuality: false },
  { format: "gif", label: "GIF", mimeType: "image/gif", supportsQuality: false },
]

export function ImageConverter() {
  const [uploadedImage, setUploadedImage] = useState<ImageFile | null>(null)
  const [targetFormat, setTargetFormat] = useState<ImageFormat>("png")
  const [quality, setQuality] = useState(85)
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [enableResize, setEnableResize] = useState(false)
  const [resizeWidth, setResizeWidth] = useState("")
  const [resizeHeight, setResizeHeight] = useState("")
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const currentFormatInfo = supportedFormats.find((f) => f.format === targetFormat)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      setError("File size must be less than 50MB")
      return
    }

    setError(null)
    const reader = new FileReader()
    reader.onload = (event) => {
      const preview = event.target?.result as string
      const img = new Image()
      img.onload = () => {
        setUploadedImage({ file, preview, width: img.width, height: img.height })
        setResizeWidth(String(img.width))
        setResizeHeight(String(img.height))
        setSuccessMessage(null)
      }
      img.src = preview
    }
    reader.readAsDataURL(file)
  }

  const handleResizeWidthChange = (w: string) => {
    setResizeWidth(w)
    if (maintainAspectRatio && uploadedImage?.width && uploadedImage?.height) {
      const ratio = uploadedImage.height / uploadedImage.width
      setResizeHeight(String(Math.round(Number(w) * ratio)))
    }
  }

  const handleResizeHeightChange = (h: string) => {
    setResizeHeight(h)
    if (maintainAspectRatio && uploadedImage?.width && uploadedImage?.height) {
      const ratio = uploadedImage.width / uploadedImage.height
      setResizeWidth(String(Math.round(Number(h) * ratio)))
    }
  }

  const handleConvert = async () => {
    if (!uploadedImage) return

    setIsConverting(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) {
          setError("Failed to get canvas context")
          setIsConverting(false)
          return
        }

        let outW = img.width
        let outH = img.height

        if (enableResize) {
          outW = parseInt(resizeWidth) || img.width
          outH = parseInt(resizeHeight) || img.height
        }

        canvas.width = outW
        canvas.height = outH

        // White background for formats that don't support transparency
        if (targetFormat === "jpg" || targetFormat === "bmp") {
          ctx.fillStyle = "#ffffff"
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }

        ctx.drawImage(img, 0, 0, outW, outH)

        try {
          const mimeType = targetFormat === "jpg" ? "image/jpeg" : `image/${targetFormat}`
          const qualityValue = currentFormatInfo?.supportsQuality ? quality / 100 : undefined

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                setError("Failed to convert image")
                setIsConverting(false)
                return
              }

              const url = URL.createObjectURL(blob)
              const link = document.createElement("a")
              link.href = url
              const originalName = uploadedImage.file.name.replace(/\.[^.]+$/, "")
              link.download = `${originalName}.${targetFormat}`
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              URL.revokeObjectURL(url)

              const originalSize = (uploadedImage.file.size / 1024).toFixed(2)
              const newSize = (blob.size / 1024).toFixed(2)
              const reduction = (((uploadedImage.file.size - blob.size) / uploadedImage.file.size) * 100).toFixed(1)

              setSuccessMessage(
                `Converted successfully! Original: ${originalSize}KB → New: ${newSize}KB (${Number(reduction) > 0 ? reduction + "% smaller" : Math.abs(Number(reduction)).toFixed(1) + "% larger"})`
              )
              setIsConverting(false)
            },
            mimeType,
            qualityValue
          )
        } catch {
          setError("Failed to convert image. Please try a different format.")
          setIsConverting(false)
        }
      }

      img.onerror = () => {
        setError("Failed to load image. The file may be corrupted.")
        setIsConverting(false)
      }

      img.src = uploadedImage.preview
    } catch {
      setError("An error occurred during conversion")
      setIsConverting(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
          <CardDescription>Select an image file to convert</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={cn(
              "relative border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              !uploadedImage 
                ? "border-muted-foreground/25 hover:border-muted-foreground/50 bg-muted/25 hover:bg-muted/50"
                : "border-green-500/50 bg-green-50/10"
            )}
            role="button"
            tabIndex={0}
            aria-label="Upload image file"
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
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Upload image file"
            />
            
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">PNG, JPG, WebP, BMP, GIF (Max 50MB)</p>
              </div>
            </div>
          </div>

          {uploadedImage && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-medium">{uploadedImage.file.name}</p>
                    <p className="text-xs text-muted-foreground">{(uploadedImage.file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setUploadedImage(null)
                    setError(null)
                    setSuccessMessage(null)
                    if (fileInputRef.current) fileInputRef.current.value = ""
                  }}
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                <img
                  src={uploadedImage.preview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conversion Settings */}
      {uploadedImage && (
        <Card>
          <CardHeader>
            <CardTitle>Conversion Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Format Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Target Format</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {supportedFormats.map(({ format, label }) => (
                  <Button
                    key={format}
                    variant={targetFormat === format ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTargetFormat(format)}
                    className="w-full"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quality Slider - Only for formats that support it */}
            {currentFormatInfo?.supportsQuality && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Quality: {quality}%</label>
                  <span className="text-xs text-muted-foreground">
                    {quality > 80 ? "High quality" : quality > 50 ? "Balanced" : "Smaller file"}
                  </span>
                </div>
                <Slider
                  value={[quality]}
                  onValueChange={(value) => setQuality(value[0])}
                  min={1}
                  max={100}
                  step={1}
                  className="w-full"
                  aria-label="Image quality"
                />
              </div>
            )}

            {/* Resize Options */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enable-resize"
                  checked={enableResize}
                  onCheckedChange={(checked) => setEnableResize(checked as boolean)}
                />
                <Label htmlFor="enable-resize" className="cursor-pointer flex items-center gap-2">
                  <Maximize2 className="h-4 w-4" />
                  Resize Image
                </Label>
              </div>

              {enableResize && (
                <div className="space-y-3 pl-6 border-l-2 border-muted">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="resize-w" className="text-xs">Width (px)</Label>
                      <Input
                        id="resize-w"
                        type="number"
                        min="1"
                        max="10000"
                        value={resizeWidth}
                        onChange={(e) => handleResizeWidthChange(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="resize-h" className="text-xs">Height (px)</Label>
                      <Input
                        id="resize-h"
                        type="number"
                        min="1"
                        max="10000"
                        value={resizeHeight}
                        onChange={(e) => handleResizeHeightChange(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="aspect-ratio"
                      checked={maintainAspectRatio}
                      onCheckedChange={(checked) => setMaintainAspectRatio(checked as boolean)}
                    />
                    <Label htmlFor="aspect-ratio" className="text-xs cursor-pointer">
                      Maintain aspect ratio
                    </Label>
                  </div>
                </div>
              )}
            </div>

            {/* Image Info */}
            {uploadedImage.width && uploadedImage.height && (
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="p-2 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Original</p>
                  <p className="font-mono text-xs font-semibold">{uploadedImage.width}x{uploadedImage.height}</p>
                </div>
                <div className="p-2 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">File Size</p>
                  <p className="font-mono text-xs font-semibold">{(uploadedImage.file.size / 1024).toFixed(1)}KB</p>
                </div>
                <div className="p-2 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Output</p>
                  <p className="font-mono text-xs font-semibold">
                    {enableResize ? `${resizeWidth}x${resizeHeight}` : `${uploadedImage.width}x${uploadedImage.height}`}
                  </p>
                </div>
              </div>
            )}

            {/* Error Messages */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Success Messages */}
            {successMessage && (
              <Alert className="bg-green-500/10 border-green-500/30">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-900 dark:text-green-400">Success</AlertTitle>
                <AlertDescription className="text-green-800 dark:text-green-300">{successMessage}</AlertDescription>
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
                  Convert to {targetFormat.toUpperCase()}
                </>
              )}
            </Button>

            {/* Compression Info */}
            <div className="text-xs text-muted-foreground p-3 bg-muted rounded-lg">
              <strong>Format Guide:</strong> <strong>JPEG</strong> &amp; <strong>WebP</strong>: Lossy compression with quality control. <strong>PNG</strong>: Lossless, best for graphics. <strong>BMP</strong>: Uncompressed. <strong>GIF</strong>: Limited to 256 colors.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hidden Canvas for conversion */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
