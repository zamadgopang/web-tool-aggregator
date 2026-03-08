"use client"

import { useState, useCallback, useRef } from "react"
import { Upload, X, Download, Image as ImageIcon, FileImage, ChevronDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const OUTPUT_FORMATS = [
  { value: "jpg", label: "JPG", description: "Best for photos" },
  { value: "png", label: "PNG", description: "Lossless with transparency" },
  { value: "webp", label: "WebP", description: "Modern, smaller size" },
  { value: "gif", label: "GIF", description: "Animated images" },
  { value: "bmp", label: "BMP", description: "Uncompressed bitmap" },
  { value: "ico", label: "ICO", description: "Icon format" },
]

const ACCEPTED_TYPES = "image/jpeg,image/jpg,image/png,image/webp,image/gif,image/bmp,image/heic,image/svg+xml,image/tiff,image/x-icon"

interface ConvertedImage {
  name: string
  url: string
  size: number
  format: string
}

export function ImageConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [outputFormat, setOutputFormat] = useState("jpg")
  const [quality, setQuality] = useState([85])
  const [isDragging, setIsDragging] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [convertedImage, setConvertedImage] = useState<ConvertedImage | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) return
    
    setFile(selectedFile)
    setConvertedImage(null)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFile(droppedFile)
    }
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFile(selectedFile)
    }
  }, [handleFile])

  const clearFile = useCallback(() => {
    setFile(null)
    setPreview(null)
    setConvertedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  const convertImage = useCallback(async () => {
    if (!file || !preview) return

    setIsConverting(true)

    try {
      const img = new window.Image()
      img.crossOrigin = "anonymous"
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = reject
        img.src = preview
      })

      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("Could not get canvas context")
      
      // Fill with white background for formats that don't support transparency
      if (outputFormat === "jpg" || outputFormat === "bmp") {
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      
      ctx.drawImage(img, 0, 0)

      const mimeType = outputFormat === "jpg" ? "image/jpeg" : `image/${outputFormat}`
      const qualityValue = quality[0] / 100

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b)
            else reject(new Error("Failed to create blob"))
          },
          mimeType,
          qualityValue
        )
      })

      const url = URL.createObjectURL(blob)
      const originalName = file.name.split(".").slice(0, -1).join(".")
      
      setConvertedImage({
        name: `${originalName}.${outputFormat}`,
        url,
        size: blob.size,
        format: outputFormat.toUpperCase(),
      })
    } catch (error) {
      console.error("Conversion failed:", error)
    } finally {
      setIsConverting(false)
    }
  }, [file, preview, outputFormat, quality])

  const downloadImage = useCallback(() => {
    if (!convertedImage) return
    
    const a = document.createElement("a")
    a.href = convertedImage.url
    a.download = convertedImage.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }, [convertedImage])

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Card className="overflow-hidden border-border">
      <CardContent className="p-0">
        {/* Upload area */}
        {!file ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex min-h-[320px] cursor-pointer flex-col items-center justify-center gap-4 border-2 border-dashed transition-all duration-200",
              isDragging
                ? "border-accent bg-accent/5"
                : "border-border bg-secondary/30 hover:border-muted-foreground/40 hover:bg-secondary/50"
            )}
          >
            <div className={cn(
              "flex h-16 w-16 items-center justify-center rounded-2xl transition-colors",
              isDragging ? "bg-accent/10 text-accent" : "bg-secondary text-muted-foreground"
            )}>
              <Upload className="h-8 w-8" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-foreground">
                {isDragging ? "Drop your image here" : "Drop image here or click to upload"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Supports JPG, PNG, WebP, GIF, BMP, HEIC, SVG, TIFF, ICO
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES}
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-6 p-6">
            {/* Image preview with remove button */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-xl border border-border bg-secondary/30">
                <div className="flex items-center justify-center p-4">
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-[280px] w-auto rounded-lg object-contain"
                    />
                  )}
                </div>
                <div className="flex items-center justify-between border-t border-border bg-background/50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <FileImage className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground truncate max-w-[200px] sm:max-w-[300px]">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearFile}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Conversion controls */}
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Output format */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-foreground">
                  Output Format
                </label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger className="w-full h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OUTPUT_FORMATS.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{format.label}</span>
                          <span className="text-muted-foreground text-xs">
                            {format.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quality slider */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">
                    Quality
                  </label>
                  <span className="text-sm font-mono text-muted-foreground">
                    {quality[0]}%
                  </span>
                </div>
                <div className="flex h-11 items-center">
                  <Slider
                    value={quality}
                    onValueChange={setQuality}
                    min={10}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {quality[0] >= 80 ? "High quality, larger file" : quality[0] >= 50 ? "Balanced quality and size" : "Smaller file, lower quality"}
                </p>
              </div>
            </div>

            {/* Convert button */}
            <Button
              onClick={convertImage}
              disabled={isConverting}
              size="lg"
              className="w-full"
            >
              {isConverting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Converting...
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4" />
                  Convert to {outputFormat.toUpperCase()}
                </>
              )}
            </Button>

            {/* Download result */}
            {convertedImage && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                      <FileImage className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {convertedImage.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(convertedImage.size)} • {convertedImage.format}
                      </p>
                    </div>
                  </div>
                  <Button onClick={downloadImage} variant="default" size="sm">
                    <Download className="h-4 w-4" />
                    Download
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
