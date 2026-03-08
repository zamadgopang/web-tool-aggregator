"use client"

import React, { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Upload, Download, X, Image as ImageIcon, AlertCircle } from "lucide-react"

type ImageFormat = "jpg" | "png" | "webp" | "bmp" | "gif"

interface ImageFile {
  file: File
  preview: string
}

export function ImageConverter() {
  const [uploadedImage, setUploadedImage] = useState<ImageFile | null>(null)
  const [targetFormat, setTargetFormat] = useState<ImageFormat>("png")
  const [quality, setQuality] = useState(85)
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const supportedFormats: { format: ImageFormat; label: string; mimeType: string }[] = [
    { format: "jpg", label: "JPEG", mimeType: "image/jpeg" },
    { format: "png", label: "PNG", mimeType: "image/png" },
    { format: "webp", label: "WebP", mimeType: "image/webp" },
    { format: "bmp", label: "BMP", mimeType: "image/bmp" },
    { format: "gif", label: "GIF", mimeType: "image/gif" },
  ]

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError("File size must be less than 50MB")
      return
    }

    setError(null)
    const reader = new FileReader()
    reader.onload = (event) => {
      const preview = event.target?.result as string
      setUploadedImage({ file, preview })
      setSuccessMessage(null)
    }
    reader.readAsDataURL(file)
  }

  const handleConvert = async () => {
    if (!uploadedImage) return

    setIsConverting(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const img = new Image()
      img.onload = async () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) {
          setError("Failed to get canvas context")
          setIsConverting(false)
          return
        }

        // Set canvas size to match image
        canvas.width = img.width
        canvas.height = img.height

        // Draw image on canvas
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)

        try {
          // Convert to blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                setError("Failed to convert image")
                setIsConverting(false)
                return
              }

              // Create download link
              const url = URL.createObjectURL(blob)
              const link = document.createElement("a")
              link.href = url
              const originalName = uploadedImage.file.name.split(".")[0]
              link.download = `${originalName}.${targetFormat}`
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              URL.revokeObjectURL(url)

              const originalSize = (uploadedImage.file.size / 1024).toFixed(2)
              const newSize = (blob.size / 1024).toFixed(2)
              const compression = (((uploadedImage.file.size - blob.size) / uploadedImage.file.size) * 100).toFixed(1)
              
              setSuccessMessage(
                `Converted successfully! Original: ${originalSize}KB → New: ${newSize}KB (${compression}% reduction)`
              )
              setIsConverting(false)
            },
            `image/${targetFormat}`,
            quality / 100
          )
        } catch (err) {
          setError("Failed to convert image. Please try a different format.")
          setIsConverting(false)
        }
      }

      img.onerror = () => {
        setError("Failed to load image. The file may be corrupted.")
        setIsConverting(false)
      }

      img.src = uploadedImage.preview
    } catch (err) {
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
              !uploadedImage 
                ? "border-muted-foreground/25 hover:border-muted-foreground/50 bg-muted/25 hover:bg-muted/50"
                : "border-green-500/50 bg-green-50/10"
            )}
            onClick={() => fileInputRef.current?.click()}
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

            {/* Quality Slider */}
            {(targetFormat === "jpg" || targetFormat === "webp") && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Quality: {quality}%</label>
                  <span className="text-xs text-muted-foreground">Higher = Better Quality</span>
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

            {/* Compression Info */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Compression Benefits</AlertTitle>
              <AlertDescription>
                Adjusting quality helps reduce file size while maintaining visual quality. PNG is lossless, JPG/WebP support lossy compression.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
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
      {uploadedImage && (
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
      )}

      {/* Hidden Canvas for conversion */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
