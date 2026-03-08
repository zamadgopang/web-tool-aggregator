"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Upload, Download, RotateCw, FlipHorizontal, FlipVertical, X, AlertCircle, Image as ImageIcon } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ImageCropperResizer() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 })
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [lockAspectRatio, setLockAspectRatio] = useState(true)
  const [rotation, setRotation] = useState(0)
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)
  const [quality, setQuality] = useState(90)
  const [outputFormat, setOutputFormat] = useState("image/png")
  const [error, setError] = useState<string | null>(null)
  const [outputSize, setOutputSize] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    setError(null)
    const reader = new FileReader()
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string
      const img = new window.Image()
      img.onload = () => {
        setOriginalSize({ width: img.width, height: img.height })
        setWidth(img.width)
        setHeight(img.height)
        setImageSrc(dataUrl)
        setRotation(0)
        setFlipH(false)
        setFlipV(false)
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }

  const aspectRatio = originalSize.width / (originalSize.height || 1)

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth)
    if (lockAspectRatio) {
      setHeight(Math.round(newWidth / aspectRatio))
    }
  }

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight)
    if (lockAspectRatio) {
      setWidth(Math.round(newHeight * aspectRatio))
    }
  }

  const renderPreview = useCallback(() => {
    if (!imageSrc || !previewCanvasRef.current) return

    const canvas = previewCanvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new window.Image()
    img.onload = () => {
      const isRotated90 = rotation === 90 || rotation === 270
      const drawW = isRotated90 ? height : width
      const drawH = isRotated90 ? width : height

      canvas.width = drawW || 1
      canvas.height = drawH || 1
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1)
      ctx.drawImage(img, -(width || 1) / 2, -(height || 1) / 2, width || 1, height || 1)
      ctx.restore()
    }
    img.src = imageSrc
  }, [imageSrc, width, height, rotation, flipH, flipV])

  useEffect(() => {
    renderPreview()
  }, [renderPreview])

  const handleExport = () => {
    if (!imageSrc || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new window.Image()
    img.onload = () => {
      const isRotated90 = rotation === 90 || rotation === 270
      const drawW = isRotated90 ? height : width
      const drawH = isRotated90 ? width : height

      canvas.width = drawW
      canvas.height = drawH
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1)
      ctx.drawImage(img, -width / 2, -height / 2, width, height)
      ctx.restore()

      const dataUrl = canvas.toDataURL(outputFormat, quality / 100)
      setOutputSize(Math.round((dataUrl.length * 3) / 4))

      const link = document.createElement("a")
      link.download = `resized-image.${outputFormat.split("/")[1]}`
      link.href = dataUrl
      link.click()
    }
    img.src = imageSrc
  }

  const commonSizes = [
    { label: "HD", w: 1280, h: 720 },
    { label: "Full HD", w: 1920, h: 1080 },
    { label: "4K", w: 3840, h: 2160 },
    { label: "Instagram", w: 1080, h: 1080 },
    { label: "Twitter", w: 1200, h: 675 },
    { label: "Favicon", w: 32, h: 32 },
    { label: "Icon", w: 512, h: 512 },
    { label: "Thumbnail", w: 150, h: 150 },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Image Cropper & Resizer</CardTitle>
          <CardDescription>Resize, rotate, and flip images with live preview. Export in PNG, JPEG, or WebP.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload */}
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Upload image file"
            />
            {imageSrc ? (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <ImageIcon className="h-5 w-5" />
                <span>Original: {originalSize.width} × {originalSize.height} — Click to change</span>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">Click or drop an image to get started</p>
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {imageSrc && (
            <>
              {/* Preview */}
              <div className="flex justify-center">
                <canvas
                  ref={previewCanvasRef}
                  className="max-w-full max-h-64 border rounded-lg"
                  style={{ objectFit: "contain" }}
                />
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <Label>Width (px)</Label>
                  <Input
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                    min={1}
                    max={10000}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Height (px)</Label>
                  <Input
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                    min={1}
                    max={10000}
                  />
                </div>
                <div className="flex items-center gap-2 pb-2">
                  <Checkbox
                    id="lock-aspect-ratio"
                    checked={lockAspectRatio}
                    onCheckedChange={(checked) => setLockAspectRatio(checked as boolean)}
                  />
                  <Label htmlFor="lock-aspect-ratio" className="text-sm font-normal cursor-pointer">
                    Lock aspect ratio
                  </Label>
                </div>
              </div>

              {/* Preset Sizes */}
              <div className="flex flex-wrap gap-2">
                {commonSizes.map((size) => (
                  <Button
                    key={size.label}
                    variant="outline"
                    size="sm"
                    onClick={() => { setWidth(size.w); setHeight(size.h); setLockAspectRatio(false) }}
                  >
                    {size.label} ({size.w}×{size.h})
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setWidth(originalSize.width); setHeight(originalSize.height) }}
                >
                  Original
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { handleWidthChange(Math.round(width / 2)) }}
                >
                  50%
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { handleWidthChange(width * 2) }}
                >
                  200%
                </Button>
              </div>

              {/* Transform Controls */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setRotation((rotation + 90) % 360)}>
                  <RotateCw className="h-4 w-4 mr-2" />
                  Rotate 90°
                </Button>
                <Button variant={flipH ? "default" : "outline"} onClick={() => setFlipH(!flipH)}>
                  <FlipHorizontal className="h-4 w-4 mr-2" />
                  Flip H
                </Button>
                <Button variant={flipV ? "default" : "outline"} onClick={() => setFlipV(!flipV)}>
                  <FlipVertical className="h-4 w-4 mr-2" />
                  Flip V
                </Button>
                <Button
                  variant="outline"
                  onClick={() => { setRotation(0); setFlipH(false); setFlipV(false) }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reset Transform
                </Button>
              </div>

              {/* Quality & Format */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Output Format</Label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image/png">PNG</SelectItem>
                      <SelectItem value="image/jpeg">JPEG</SelectItem>
                      <SelectItem value="image/webp">WebP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {outputFormat !== "image/png" && (
                  <div className="space-y-2">
                    <Label>Quality: {quality}%</Label>
                    <Slider
                      value={[quality]}
                      onValueChange={([v]) => setQuality(v)}
                      min={10}
                      max={100}
                      step={5}
                    />
                  </div>
                )}
              </div>

              {/* Export */}
              <Button onClick={handleExport} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export ({width} × {height})
              </Button>

              {outputSize && (
                <p className="text-sm text-muted-foreground text-center">
                  Estimated file size: {(outputSize / 1024).toFixed(1)} KB
                </p>
              )}
            </>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
    </div>
  )
}
