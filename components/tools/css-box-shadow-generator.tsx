"use client"

import React, { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Copy, CheckCircle, Plus, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface Shadow {
  x: number
  y: number
  blur: number
  spread: number
  color: string
  opacity: number
  inset: boolean
}

const DEFAULT_SHADOW: Shadow = {
  x: 4,
  y: 4,
  blur: 10,
  spread: 0,
  color: "#000000",
  opacity: 25,
  inset: false,
}

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${(opacity / 100).toFixed(2)})`
}

export function CSSBoxShadowGenerator() {
  const [shadows, setShadows] = useState<Shadow[]>([{ ...DEFAULT_SHADOW }])
  const [bgColor, setBgColor] = useState("#ffffff")
  const [boxColor, setBoxColor] = useState("#ffffff")
  const [borderRadius, setBorderRadius] = useState(8)
  const [copied, setCopied] = useState(false)

  const addShadow = () => {
    setShadows([...shadows, { ...DEFAULT_SHADOW, x: 0, y: 8, blur: 24, opacity: 15 }])
  }

  const removeShadow = (index: number) => {
    if (shadows.length <= 1) return
    setShadows(shadows.filter((_, i) => i !== index))
  }

  const updateShadow = (index: number, field: keyof Shadow, value: number | string | boolean) => {
    const newShadows = [...shadows]
    newShadows[index] = { ...newShadows[index], [field]: value }
    setShadows(newShadows)
  }

  const generateCSS = useCallback((): string => {
    return shadows
      .map((s) => {
        const rgba = hexToRgba(s.color, s.opacity)
        return `${s.inset ? "inset " : ""}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${rgba}`
      })
      .join(",\n    ")
  }, [shadows])

  const css = generateCSS()
  const fullCSS = `box-shadow: ${css};`

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(fullCSS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const presets = [
    { name: "Subtle", shadows: [{ x: 0, y: 1, blur: 3, spread: 0, color: "#000000", opacity: 10, inset: false }] },
    { name: "Medium", shadows: [{ x: 0, y: 4, blur: 6, spread: -1, color: "#000000", opacity: 10, inset: false }, { x: 0, y: 2, blur: 4, spread: -2, color: "#000000", opacity: 10, inset: false }] },
    { name: "Large", shadows: [{ x: 0, y: 10, blur: 15, spread: -3, color: "#000000", opacity: 10, inset: false }, { x: 0, y: 4, blur: 6, spread: -4, color: "#000000", opacity: 10, inset: false }] },
    { name: "Elevated", shadows: [{ x: 0, y: 20, blur: 25, spread: -5, color: "#000000", opacity: 10, inset: false }, { x: 0, y: 8, blur: 10, spread: -6, color: "#000000", opacity: 10, inset: false }] },
    { name: "Inset", shadows: [{ x: 0, y: 2, blur: 4, spread: 0, color: "#000000", opacity: 15, inset: true }] },
    { name: "Glow", shadows: [{ x: 0, y: 0, blur: 20, spread: 2, color: "#3b82f6", opacity: 50, inset: false }] },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>CSS Box Shadow Generator</CardTitle>
          <CardDescription>Create beautiful box shadows with multiple layers and live preview.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preview */}
          <div
            className="flex items-center justify-center p-12 rounded-lg"
            style={{ backgroundColor: bgColor }}
          >
            <div
              className="w-48 h-48 flex items-center justify-center text-sm text-muted-foreground"
              style={{
                backgroundColor: boxColor,
                borderRadius: `${borderRadius}px`,
                boxShadow: css,
              }}
            >
              Preview
            </div>
          </div>

          {/* Background & Box Settings */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Background</Label>
              <div className="flex gap-1">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-9 w-10 cursor-pointer rounded border" />
                <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="font-mono text-xs" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Box Color</Label>
              <div className="flex gap-1">
                <input type="color" value={boxColor} onChange={(e) => setBoxColor(e.target.value)} className="h-9 w-10 cursor-pointer rounded border" />
                <Input value={boxColor} onChange={(e) => setBoxColor(e.target.value)} className="font-mono text-xs" />
              </div>
            </div>
            <div className="space-y-2 col-span-2">
              <Label className="text-xs">Border Radius: {borderRadius}px</Label>
              <Slider value={[borderRadius]} onValueChange={([v]) => setBorderRadius(v)} min={0} max={100} step={1} />
            </div>
          </div>

          {/* Presets */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Presets</Label>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <Button key={preset.name} variant="outline" size="sm" onClick={() => setShadows(preset.shadows)}>
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Shadow Layers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Shadow Layers</Label>
              <Button variant="outline" size="sm" onClick={addShadow}>
                <Plus className="h-4 w-4 mr-1" />
                Add Layer
              </Button>
            </div>

            {shadows.map((shadow, idx) => (
              <div key={idx} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Layer {idx + 1}</Label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={shadow.inset}
                        onCheckedChange={(checked) => updateShadow(idx, "inset", !!checked)}
                      />
                      <Label className="text-xs">Inset</Label>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeShadow(idx)} disabled={shadows.length <= 1}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">X: {shadow.x}px</Label>
                    <Slider value={[shadow.x]} onValueChange={([v]) => updateShadow(idx, "x", v)} min={-50} max={50} step={1} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Y: {shadow.y}px</Label>
                    <Slider value={[shadow.y]} onValueChange={([v]) => updateShadow(idx, "y", v)} min={-50} max={50} step={1} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Blur: {shadow.blur}px</Label>
                    <Slider value={[shadow.blur]} onValueChange={([v]) => updateShadow(idx, "blur", v)} min={0} max={100} step={1} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Spread: {shadow.spread}px</Label>
                    <Slider value={[shadow.spread]} onValueChange={([v]) => updateShadow(idx, "spread", v)} min={-50} max={50} step={1} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Color</Label>
                    <div className="flex gap-1">
                      <input type="color" value={shadow.color} onChange={(e) => updateShadow(idx, "color", e.target.value)} className="h-8 w-10 cursor-pointer rounded border" />
                      <Input value={shadow.color} onChange={(e) => updateShadow(idx, "color", e.target.value)} className="font-mono text-xs h-8" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Opacity: {shadow.opacity}%</Label>
                    <Slider value={[shadow.opacity]} onValueChange={([v]) => updateShadow(idx, "opacity", v)} min={0} max={100} step={1} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CSS Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>CSS Output</Label>
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <pre className="bg-muted p-4 rounded-lg text-sm font-mono overflow-auto break-all whitespace-pre-wrap">
              {fullCSS}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
