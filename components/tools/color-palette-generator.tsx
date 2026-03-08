"use client"

import React, { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, CheckCircle, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type HarmonyType = "complementary" | "analogous" | "triadic" | "split-complementary" | "tetradic" | "monochromatic"

interface HSL {
  h: number
  s: number
  l: number
}

function hexToHSL(hex: string): HSL {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2

  if (max === min) return { h: 0, s: 0, l: l * 100 }

  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6

  return { h: h * 360, s: s * 100, l: l * 100 }
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360
  s = Math.max(0, Math.min(100, s)) / 100
  l = Math.max(0, Math.min(100, l)) / 100

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2

  let r = 0, g = 0, b = 0
  if (h < 60) { r = c; g = x }
  else if (h < 120) { r = x; g = c }
  else if (h < 180) { g = c; b = x }
  else if (h < 240) { g = x; b = c }
  else if (h < 300) { r = x; b = c }
  else { r = c; b = x }

  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, "0")
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function hexToRGB(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${r}, ${g}, ${b})`
}

function generateHarmony(baseHex: string, harmonyType: HarmonyType): string[] {
  const hsl = hexToHSL(baseHex)

  switch (harmonyType) {
    case "complementary":
      return [baseHex, hslToHex(hsl.h + 180, hsl.s, hsl.l)]

    case "analogous":
      return [
        hslToHex(hsl.h - 30, hsl.s, hsl.l),
        baseHex,
        hslToHex(hsl.h + 30, hsl.s, hsl.l),
        hslToHex(hsl.h + 60, hsl.s, hsl.l),
        hslToHex(hsl.h - 60, hsl.s, hsl.l),
      ]

    case "triadic":
      return [baseHex, hslToHex(hsl.h + 120, hsl.s, hsl.l), hslToHex(hsl.h + 240, hsl.s, hsl.l)]

    case "split-complementary":
      return [baseHex, hslToHex(hsl.h + 150, hsl.s, hsl.l), hslToHex(hsl.h + 210, hsl.s, hsl.l)]

    case "tetradic":
      return [baseHex, hslToHex(hsl.h + 90, hsl.s, hsl.l), hslToHex(hsl.h + 180, hsl.s, hsl.l), hslToHex(hsl.h + 270, hsl.s, hsl.l)]

    case "monochromatic":
      return [
        hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 30)),
        hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 15)),
        baseHex,
        hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + 15)),
        hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + 30)),
      ]
  }
}

function generateShades(hex: string, count: number): string[] {
  const hsl = hexToHSL(hex)
  const shades: string[] = []
  for (let i = 0; i < count; i++) {
    const lightness = 95 - (i / (count - 1)) * 85 // 95 → 10
    shades.push(hslToHex(hsl.h, hsl.s, lightness))
  }
  return shades
}

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? "#000000" : "#ffffff"
}

export function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState("#3b82f6")
  const [harmonyType, setHarmonyType] = useState<HarmonyType>("analogous")
  const [copied, setCopied] = useState<string | null>(null)

  const palette = generateHarmony(baseColor, harmonyType)
  const shades = generateShades(baseColor, 10)

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const exportAsCSS = (): string => {
    const lines = [":root {"]
    palette.forEach((color, i) => {
      lines.push(`  --color-${i + 1}: ${color};`)
    })
    lines.push("")
    shades.forEach((shade, i) => {
      const level = (i + 1) * 100
      lines.push(`  --color-${level}: ${shade};`)
    })
    lines.push("}")
    return lines.join("\n")
  }

  const exportAsTailwind = (): string => {
    const obj: Record<string, string> = {}
    shades.forEach((shade, i) => {
      const level = (i + 1) * 100 < 1000 ? (i + 1) * 100 : 950
      obj[String(level)] = shade
    })
    return `"primary": ${JSON.stringify(obj, null, 2)}`
  }

  const randomColor = () => {
    const hex = Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")
    setBaseColor(`#${hex}`)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Color Palette Generator</CardTitle>
          <CardDescription>Generate harmonious color palettes from a base color. Export as CSS variables or Tailwind config.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Base Color & Controls */}
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <Label>Base Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="h-10 w-14 cursor-pointer rounded border"
                />
                <Input
                  value={baseColor}
                  onChange={(e) => {
                    if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) setBaseColor(e.target.value)
                  }}
                  className="font-mono w-28"
                  maxLength={7}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Harmony Type</Label>
              <Select value={harmonyType} onValueChange={(v) => setHarmonyType(v as HarmonyType)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="complementary">Complementary</SelectItem>
                  <SelectItem value="analogous">Analogous</SelectItem>
                  <SelectItem value="triadic">Triadic</SelectItem>
                  <SelectItem value="split-complementary">Split Complementary</SelectItem>
                  <SelectItem value="tetradic">Tetradic (Square)</SelectItem>
                  <SelectItem value="monochromatic">Monochromatic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={randomColor}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Random
            </Button>
          </div>

          {/* Harmony Palette */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Harmony Palette</Label>
            <div className="flex rounded-lg overflow-hidden border h-24">
              {palette.map((color, idx) => (
                <button
                  key={idx}
                  className="flex-1 flex items-end justify-center pb-2 cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: color, color: getContrastColor(color) }}
                  onClick={() => copyToClipboard(color, `pal-${idx}`)}
                  title={`Click to copy ${color}`}
                >
                  <span className="text-xs font-mono font-bold opacity-80">
                    {copied === `pal-${idx}` ? "Copied!" : color}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Shade Scale */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Shade Scale</Label>
            <div className="flex rounded-lg overflow-hidden border">
              {shades.map((shade, idx) => (
                <button
                  key={idx}
                  className="flex-1 h-16 flex flex-col items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: shade, color: getContrastColor(shade) }}
                  onClick={() => copyToClipboard(shade, `shade-${idx}`)}
                  title={`Click to copy ${shade}`}
                >
                  <span className="text-[10px] font-mono font-bold opacity-70">{(idx + 1) * 100}</span>
                  <span className="text-[9px] font-mono opacity-60">
                    {copied === `shade-${idx}` ? "✓" : shade}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {palette.map((color, idx) => {
              const hsl = hexToHSL(color)
              return (
                <div key={idx} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-10 h-10 rounded-lg border" style={{ backgroundColor: color }} />
                  <div className="flex-1 text-sm space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold">{color.toUpperCase()}</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyToClipboard(color, `detail-${idx}`)}>
                        {copied === `detail-${idx}` ? <CheckCircle className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">{hexToRGB(color)}</p>
                    <p className="text-xs text-muted-foreground font-mono">hsl({Math.round(hsl.h)}, {Math.round(hsl.s)}%, {Math.round(hsl.l)}%)</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Export */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">CSS Variables</Label>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(exportAsCSS(), "css")}>
                  {copied === "css" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <pre className="bg-muted p-3 rounded-lg text-xs font-mono overflow-auto max-h-48">
                {exportAsCSS()}
              </pre>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Tailwind Config</Label>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(exportAsTailwind(), "tailwind")}>
                  {copied === "tailwind" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <pre className="bg-muted p-3 rounded-lg text-xs font-mono overflow-auto max-h-48">
                {exportAsTailwind()}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
