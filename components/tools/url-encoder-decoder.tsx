"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Copy, CheckCircle, RefreshCw } from "lucide-react"

type ConversionMode = "encode" | "decode"

export function URLEncoderDecoder() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<ConversionMode>("encode")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [encodeType, setEncodeType] = useState<"component" | "full">("component")

  const handleConvert = () => {
    if (!input.trim()) {
      setError("Please enter some text")
      return
    }

    try {
      setError(null)
      if (mode === "encode") {
        const result =
          encodeType === "component"
            ? encodeURIComponent(input)
            : encodeURI(input)
        setOutput(result)
      } else {
        const result =
          encodeType === "component"
            ? decodeURIComponent(input)
            : decodeURI(input)
        setOutput(result)
      }
    } catch {
      setError(`Failed to ${mode}. The input may contain invalid characters.`)
      setOutput("")
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSwap = () => {
    setInput(output)
    setOutput("")
    setMode(mode === "encode" ? "decode" : "encode")
    setError(null)
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>URL Encoder / Decoder</CardTitle>
          <CardDescription>Encode or decode URL components and full URLs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Selection */}
          <div className="space-y-3">
            <Label>Mode</Label>
            <div className="flex gap-2">
              {(["encode", "decode"] as const).map((m) => (
                <Button
                  key={m}
                  variant={mode === m ? "default" : "outline"}
                  onClick={() => {
                    setMode(m)
                    setError(null)
                    setOutput("")
                  }}
                  className="flex-1 capitalize"
                >
                  {m === "encode" ? "Encode URL" : "Decode URL"}
                </Button>
              ))}
            </div>
          </div>

          {/* Encode Type */}
          <div className="space-y-2">
            <Label>Encoding Type</Label>
            <div className="flex gap-2">
              <Button
                variant={encodeType === "component" ? "default" : "outline"}
                size="sm"
                onClick={() => setEncodeType("component")}
              >
                Component (recommended)
              </Button>
              <Button
                variant={encodeType === "full" ? "default" : "outline"}
                size="sm"
                onClick={() => setEncodeType("full")}
              >
                Full URI
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {encodeType === "component"
                ? "encodeURIComponent — Encodes special chars including :, /, ?, &, =, #"
                : "encodeURI — Preserves URL structure chars like :, /, ?, &, =, #"}
            </p>
          </div>

          {/* Input */}
          <div className="space-y-2">
            <Label htmlFor="url-input">
              {mode === "encode" ? "Text to Encode" : "Encoded URL to Decode"}
            </Label>
            <Textarea
              id="url-input"
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                setOutput("")
                setError(null)
              }}
              placeholder={
                mode === "encode"
                  ? "Hello World! こんにちは #test&value=1"
                  : "Hello%20World%21%20%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF"
              }
              className="min-h-24 font-mono text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleConvert} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              {mode === "encode" ? "Encode" : "Decode"}
            </Button>
            {output && (
              <Button variant="outline" onClick={handleSwap} title="Swap input/output and toggle mode">
                ↔ Swap
              </Button>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Output */}
          {output && (
            <div className="space-y-2">
              <Label>Result</Label>
              <Textarea
                value={output}
                readOnly
                className="min-h-24 font-mono text-sm bg-muted"
              />
              <Button onClick={handleCopy} variant="outline" className="w-full">
                {copied ? (
                  <><CheckCircle className="h-4 w-4 mr-2" /> Copied!</>
                ) : (
                  <><Copy className="h-4 w-4 mr-2" /> Copy Result</>
                )}
              </Button>
            </div>
          )}

          {/* Reference */}
          <div className="p-3 bg-muted rounded-lg text-xs">
            <strong>Common Encodings:</strong>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-1 font-mono text-muted-foreground">
              <div>Space → %20</div>
              <div>! → %21</div>
              <div># → %23</div>
              <div>& → %26</div>
              <div>= → %3D</div>
              <div>? → %3F</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
