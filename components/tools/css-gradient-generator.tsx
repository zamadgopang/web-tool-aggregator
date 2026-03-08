"use client"

import React, { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Copy, CheckCircle, Plus, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ColorStop {
  color: string
  position: number
}

type GradientType = "linear" | "radial" | "conic"

export function CSSGradientGenerator() {
  const [type, setType] = useState<GradientType>("linear")
  const [angle, setAngle] = useState(135)
  const [stops, setStops] = useState<ColorStop[]>([
    { color: "#667eea", position: 0 },
    { color: "#764ba2", position: 100 },
  ])
  const [copied, setCopied] = useState(false)

  const addStop = () => {
    const lastPos = stops[stops.length - 1]?.position ?? 50
    setStops([...stops, { color: "#000000", position: Math.min(lastPos + 10, 100) }])
  }

  const removeStop = (index: number) => {
    if (stops.length <= 2) return
    setStops(stops.filter((_, i) => i !== index))
  }

  const updateStop = (index: number, field: keyof ColorStop, value: string | number) => {
    const newStops = [...stops]
    newStops[index] = { ...newStops[index], [field]: value }
    setStops(newStops)
  }

  const generateCSS = useCallback((): string => {
    const stopsStr = stops
      .sort((a, b) => a.position - b.position)
      .map((s) => `${s.color} ${s.position}%`)
      .join(", ")

    switch (type) {
      case "linear":
        return `linear-gradient(${angle}deg, ${stopsStr})`
      case "radial":
        return `radial-gradient(circle, ${stopsStr})`
      case "conic":
        return `conic-gradient(from ${angle}deg, ${stopsStr})`
    }
  }, [type, angle, stops])

  const css = generateCSS()
  const fullCSS = `background: ${css};`

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(fullCSS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>CSS Gradient Generator</CardTitle>
          <CardDescription>Create beautiful CSS gradients with live preview. Supports linear, radial, and conic gradients.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preview */}
          <div
            className="w-full h-48 rounded-lg border shadow-inner"
            style={{ background: css }}
          />

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Gradient Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as GradientType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear</SelectItem>
                  <SelectItem value="radial">Radial</SelectItem>
                  <SelectItem value="conic">Conic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(type === "linear" || type === "conic") && (
              <div className="space-y-2">
                <Label>Angle: {angle}°</Label>
                <Slider
                  value={[angle]}
                  onValueChange={([v]) => setAngle(v)}
                  min={0}
                  max={360}
                  step={1}
                />
              </div>
            )}
          </div>

          {/* Quick Angle Buttons */}
          {type === "linear" && (
            <div className="flex flex-wrap gap-2">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                <Button
                  key={a}
                  variant={angle === a ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAngle(a)}
                >
                  {a}°
                </Button>
              ))}
            </div>
          )}

          {/* Color Stops */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Color Stops</Label>
              <Button variant="outline" size="sm" onClick={addStop}>
                <Plus className="h-4 w-4 mr-1" />
                Add Stop
              </Button>
            </div>

            {stops.map((stop, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => updateStop(idx, "color", e.target.value)}
                  className="h-10 w-12 cursor-pointer rounded border"
                />
                <Input
                  value={stop.color}
                  onChange={(e) => updateStop(idx, "color", e.target.value)}
                  className="font-mono w-28"
                />
                <div className="flex-1 flex items-center gap-2">
                  <Slider
                    value={[stop.position]}
                    onValueChange={([v]) => updateStop(idx, "position", v)}
                    min={0}
                    max={100}
                    step={1}
                  />
                  <span className="text-sm font-mono w-10 text-right">{stop.position}%</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStop(idx)}
                  disabled={stops.length <= 2}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
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
            <pre className="bg-muted p-4 rounded-lg text-sm font-mono overflow-auto break-all">
              {fullCSS}
            </pre>
          </div>

          {/* Preset Gradients */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Presets</Label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { stops: [{ color: "#ff6b6b", position: 0 }, { color: "#feca57", position: 100 }] },
                { stops: [{ color: "#a29bfe", position: 0 }, { color: "#6c5ce7", position: 100 }] },
                { stops: [{ color: "#00b894", position: 0 }, { color: "#00cec9", position: 100 }] },
                { stops: [{ color: "#fd79a8", position: 0 }, { color: "#e84393", position: 100 }] },
                { stops: [{ color: "#0984e3", position: 0 }, { color: "#74b9ff", position: 100 }] },
                { stops: [{ color: "#fdcb6e", position: 0 }, { color: "#e17055", position: 50 }, { color: "#d63031", position: 100 }] },
              ].map((preset, idx) => {
                const presetCSS = `linear-gradient(135deg, ${preset.stops.map((s) => `${s.color} ${s.position}%`).join(", ")})`
                return (
                  <button
                    key={idx}
                    className="h-12 rounded-lg border cursor-pointer hover:ring-2 ring-ring transition-all"
                    style={{ background: presetCSS }}
                    onClick={() => { setStops(preset.stops); setType("linear"); setAngle(135) }}
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
