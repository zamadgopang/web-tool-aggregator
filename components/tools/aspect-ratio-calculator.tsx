"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, CheckCircle, Lock, Unlock, ArrowRightLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const COMMON_RATIOS = [
  { label: "16:9", w: 16, h: 9, desc: "Widescreen" },
  { label: "4:3", w: 4, h: 3, desc: "Standard" },
  { label: "1:1", w: 1, h: 1, desc: "Square" },
  { label: "21:9", w: 21, h: 9, desc: "Ultra-wide" },
  { label: "3:2", w: 3, h: 2, desc: "DSLR Photo" },
  { label: "9:16", w: 9, h: 16, desc: "Vertical Video" },
  { label: "2:3", w: 2, h: 3, desc: "Portrait Photo" },
  { label: "5:4", w: 5, h: 4, desc: "Large Format" },
  { label: "32:9", w: 32, h: 9, desc: "Super Ultra-wide" },
]

const COMMON_RESOLUTIONS = [
  { label: "720p HD", w: 1280, h: 720 },
  { label: "1080p Full HD", w: 1920, h: 1080 },
  { label: "1440p QHD", w: 2560, h: 1440 },
  { label: "4K UHD", w: 3840, h: 2160 },
  { label: "8K UHD", w: 7680, h: 4320 },
  { label: "Instagram Post", w: 1080, h: 1080 },
  { label: "Instagram Story", w: 1080, h: 1920 },
  { label: "Twitter Post", w: 1200, h: 675 },
  { label: "Facebook Cover", w: 820, h: 312 },
  { label: "YouTube Thumbnail", w: 1280, h: 720 },
  { label: "OG Image", w: 1200, h: 630 },
  { label: "A4 @ 300dpi", w: 2480, h: 3508 },
]

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a))
  b = Math.abs(Math.round(b))
  while (b) {
    const t = b
    b = a % b
    a = t
  }
  return a
}

function simplifyRatio(w: number, h: number): string {
  if (!w || !h) return "—"
  const d = gcd(w, h)
  return `${w / d}:${h / d}`
}

export function AspectRatioCalculator() {
  const [width, setWidth] = useState(1920)
  const [height, setHeight] = useState(1080)
  const [selectedRatio, setSelectedRatio] = useState<string | null>(null)
  const [lockField, setLockField] = useState<"width" | "height">("height")
  const [copied, setCopied] = useState<string | null>(null)

  const ratio = simplifyRatio(width, height)
  const decimal = height ? (width / height).toFixed(4) : "—"

  const applyRatio = (rw: number, rh: number) => {
    setSelectedRatio(`${rw}:${rh}`)
    if (lockField === "height") {
      // Keep width, adjust height
      setHeight(Math.round(width / (rw / rh)))
    } else {
      // Keep height, adjust width
      setWidth(Math.round(height * (rw / rh)))
    }
  }

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth)
    if (selectedRatio) {
      const [rw, rh] = selectedRatio.split(":").map(Number)
      setHeight(Math.round(newWidth / (rw / rh)))
    }
  }

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight)
    if (selectedRatio) {
      const [rw, rh] = selectedRatio.split(":").map(Number)
      setWidth(Math.round(newHeight * (rw / rh)))
    }
  }

  const swapDimensions = () => {
    const temp = width
    setWidth(height)
    setHeight(temp)
  }

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  // Calculate pixel count
  const totalPixels = width * height
  const megapixels = (totalPixels / 1_000_000).toFixed(2)

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Aspect Ratio Calculator</CardTitle>
          <CardDescription>Calculate dimensions, convert between ratios, and find matching resolutions for video, photos, and design.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dimensions Input */}
          <div className="grid grid-cols-5 gap-2 items-end">
            <div className="col-span-2 space-y-2">
              <Label>Width (px)</Label>
              <Input
                type="number"
                value={width}
                onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                min={1}
              />
            </div>
            <div className="flex justify-center pb-2">
              <Button variant="outline" size="icon" onClick={swapDimensions}>
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Height (px)</Label>
              <Input
                type="number"
                value={height}
                onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                min={1}
              />
            </div>
          </div>

          {/* Lock Field Selection */}
          {selectedRatio && (
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">When ratio changes, keep:</span>
              <Button
                variant={lockField === "height" ? "default" : "outline"}
                size="sm"
                onClick={() => setLockField("height")}
              >
                <Lock className="h-3 w-3 mr-1" />
                Width
              </Button>
              <Button
                variant={lockField === "width" ? "default" : "outline"}
                size="sm"
                onClick={() => setLockField("width")}
              >
                <Lock className="h-3 w-3 mr-1" />
                Height
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedRatio(null)}>
                <Unlock className="h-3 w-3 mr-1" />
                Unlock
              </Button>
            </div>
          )}

          {/* Results */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-muted p-3 rounded-lg text-center">
              <Label className="text-xs text-muted-foreground">Aspect Ratio</Label>
              <div className="flex items-center justify-center gap-1">
                <p className="font-mono font-bold text-lg">{ratio}</p>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyToClipboard(ratio, "ratio")}>
                  {copied === "ratio" ? <CheckCircle className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </div>
            <div className="bg-muted p-3 rounded-lg text-center">
              <Label className="text-xs text-muted-foreground">Decimal</Label>
              <p className="font-mono font-bold text-lg">{decimal}</p>
            </div>
            <div className="bg-muted p-3 rounded-lg text-center">
              <Label className="text-xs text-muted-foreground">Resolution</Label>
              <div className="flex items-center justify-center gap-1">
                <p className="font-mono font-bold text-lg">{width}×{height}</p>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyToClipboard(`${width}x${height}`, "res")}>
                  {copied === "res" ? <CheckCircle className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </div>
            <div className="bg-muted p-3 rounded-lg text-center">
              <Label className="text-xs text-muted-foreground">Megapixels</Label>
              <p className="font-mono font-bold text-lg">{megapixels} MP</p>
            </div>
          </div>

          {/* Visual Preview */}
          <div className="flex justify-center">
            <div
              className="border-2 border-dashed border-primary/50 flex items-center justify-center text-xs text-muted-foreground"
              style={{
                width: `${Math.min(300, width / Math.max(width, height) * 300)}px`,
                height: `${Math.min(300, height / Math.max(width, height) * 300)}px`,
                borderRadius: "4px",
              }}
            >
              {width} × {height}
            </div>
          </div>

          {/* Common Ratios */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Common Aspect Ratios</Label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {COMMON_RATIOS.map((r) => (
                <button
                  key={r.label}
                  className={`p-3 rounded-lg border text-center hover:bg-accent transition-colors cursor-pointer ${
                    selectedRatio === `${r.w}:${r.h}` ? "border-primary bg-accent" : ""
                  }`}
                  onClick={() => applyRatio(r.w, r.h)}
                >
                  <p className="font-mono font-bold">{r.label}</p>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Common Resolutions */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Common Resolutions</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {COMMON_RESOLUTIONS.map((r) => (
                <button
                  key={r.label}
                  className={`p-2 rounded-lg border text-left hover:bg-accent transition-colors cursor-pointer text-sm ${
                    width === r.w && height === r.h ? "border-primary bg-accent" : ""
                  }`}
                  onClick={() => { setWidth(r.w); setHeight(r.h); setSelectedRatio(null) }}
                >
                  <p className="font-medium">{r.label}</p>
                  <p className="text-xs text-muted-foreground font-mono">{r.w}×{r.h}</p>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
