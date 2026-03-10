"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import QRCode from "qrcode"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Download, Copy, CheckCircle } from "lucide-react"

export function QRCodeGenerator() {
  const [inputValue, setInputValue] = useState("https://example.com")
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const [size, setSize] = useState(300)
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M")
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateQR = useCallback(async () => {
    if (!inputValue.trim()) {
      setDataUrl(null)
      return
    }
    try {
      const url = await QRCode.toDataURL(inputValue, {
        width: size,
        margin: 2,
        errorCorrectionLevel: errorLevel,
        color: { dark: "#000000", light: "#ffffff" },
      })
      setDataUrl(url)
    } catch {
      setDataUrl(null)
    }
  }, [inputValue, size, errorLevel])

  useEffect(() => {
    generateQR()
  }, [generateQR])

  const handleDownload = () => {
    if (!dataUrl) return
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = `qr-code-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(inputValue)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>QR Code Generator</CardTitle>
          <CardDescription>Create QR codes from text, URLs, or contact info</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input */}
          <div className="space-y-2">
            <Label htmlFor="qr-input">Content</Label>
            <div className="flex gap-2">
              <Input
                id="qr-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter text, URL, or contact info..."
              />
              <Button variant="outline" onClick={handleCopy}>
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* QR Code Preview */}
          {dataUrl && (
            <div className="flex flex-col items-center gap-4 p-6 bg-muted rounded-lg">
              <img
                src={dataUrl}
                alt="QR Code"
                style={{
                  width: `${Math.min(size, 300)}px`,
                  height: `${Math.min(size, 300)}px`,
                }}
              />
              <Button onClick={handleDownload} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download QR Code
              </Button>
            </div>
          )}

          {/* Settings */}
          <div className="space-y-4">
            {/* Size Slider */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="size-slider">Size</Label>
                <span className="text-sm font-medium">{size}x{size}px</span>
              </div>
              <Slider
                value={[size]}
                onValueChange={(value) => setSize(value[0])}
                min={100}
                max={500}
                step={50}
                className="w-full"
                aria-label="QR code size"
              />
            </div>

            {/* Error Correction Level */}
            <div className="space-y-2">
              <Label>Error Correction</Label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: "L", label: "Low (7%)", desc: "7% recovery" },
                  { value: "M", label: "Medium (15%)", desc: "15% recovery" },
                  { value: "Q", label: "High (25%)", desc: "25% recovery" },
                  { value: "H", label: "Very High (30%)", desc: "30% recovery" },
                ].map((level) => (
                  <Button
                    key={level.value}
                    variant={errorLevel === level.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setErrorLevel(level.value)}
                    className="text-xs h-auto py-2 flex flex-col"
                  >
                    <span className="font-medium">{level.value}</span>
                    <span className="text-xs opacity-70">{level.desc}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-sm text-blue-900 dark:text-blue-200">
              <strong>Tip:</strong> Select higher error correction if the QR code will be partially obscured or printed on surfaces that might get damaged.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
