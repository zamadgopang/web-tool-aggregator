"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, CheckCircle } from "lucide-react"

interface RGBColor {
  r: number
  g: number
  b: number
}

interface HSLColor {
  h: number
  s: number
  l: number
}

function hexToRgb(hex: string): RGBColor | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")
}

function rgbToHsl(r: number, g: number, b: number): HSLColor {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0,
    s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

export function ColorConverter() {
  const [hex, setHex] = useState("#FF6B6B")
  const [rgb, setRgb] = useState<RGBColor>({ r: 255, g: 107, b: 107 })
  const [hsl, setHsl] = useState<HSLColor>({ h: 0, s: 100, l: 71 })
  const [copied, setCopied] = useState<string | null>(null)

  const handleHexChange = (value: string) => {
    setHex(value)
    if (value.match(/^#[0-9A-F]{6}$/i)) {
      const rgbColor = hexToRgb(value)
      if (rgbColor) {
        setRgb(rgbColor)
        const hslColor = rgbToHsl(rgbColor.r, rgbColor.g, rgbColor.b)
        setHsl(hslColor)
      }
    }
  }

  const handleRgbChange = (key: "r" | "g" | "b", value: number) => {
    const newRgb = { ...rgb, [key]: Math.max(0, Math.min(255, value)) }
    setRgb(newRgb)
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
    const hslColor = rgbToHsl(newRgb.r, newRgb.g, newRgb.b)
    setHsl(hslColor)
  }

  const handleCopy = (value: string, type: string) => {
    navigator.clipboard.writeText(value)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
  const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Color Converter</CardTitle>
          <CardDescription>Convert colors between HEX, RGB, and HSL formats</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Color Preview */}
          <div className="space-y-2">
            <Label>Color Preview</Label>
            <div
              className="w-full h-32 rounded-lg border-2 border-muted transition-colors"
              style={{ backgroundColor: hex }}
            />
          </div>

          {/* HEX Input */}
          <div className="space-y-2">
            <Label htmlFor="hex-input">HEX</Label>
            <div className="flex gap-2">
              <Input
                id="hex-input"
                type="text"
                value={hex}
                onChange={(e) => handleHexChange(e.target.value)}
                placeholder="#RRGGBB"
                className="font-mono"
              />
              <Button
                variant="outline"
                onClick={() => handleCopy(hex, "hex")}
              >
                {copied === "hex" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* RGB Inputs */}
          <div className="space-y-2">
            <Label>RGB</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["r", "g", "b"] as const).map((key) => (
                <div key={key}>
                  <label className="text-xs text-muted-foreground uppercase font-medium block mb-1">
                    {key === "r" ? "Red" : key === "g" ? "Green" : "Blue"}
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={rgb[key]}
                    onChange={(e) => handleRgbChange(key, parseInt(e.target.value) || 0)}
                  />
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleCopy(rgbString, "rgb")}
            >
              {copied === "rgb" ? <CheckCircle className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {rgbString}
            </Button>
          </div>

          {/* HSL Display */}
          <div className="space-y-2">
            <Label>HSL</Label>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleCopy(hslString, "hsl")}
            >
              {copied === "hsl" ? <CheckCircle className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {hslString}
            </Button>
          </div>

          {/* Color Swatches */}
          <div className="space-y-2">
            <Label>Suggested Variations</Label>
            <div className="grid grid-cols-5 gap-2">
              {[20, 40, 60, 80, 100].map((lightness) => {
                const varColor = `hsl(${hsl.h}, ${hsl.s}%, ${lightness}%)`
                return (
                  <div
                    key={lightness}
                    className="h-12 rounded-lg border-2 border-muted cursor-pointer hover:ring-2 hover:ring-offset-2 ring-primary transition-all"
                    style={{ backgroundColor: varColor }}
                    onClick={() => handleCopy(varColor, `hsl-${lightness}`)}
                    title={varColor}
                  />
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
