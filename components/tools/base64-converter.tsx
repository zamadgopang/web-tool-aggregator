"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Copy, RefreshCw, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type ConversionMode = "encode" | "decode"

export function Base64Converter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<ConversionMode>("encode")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleConvert = () => {
    try {
      setError(null)
      if (!input.trim()) {
        setError("Please enter some text")
        return
      }

      if (mode === "encode") {
        const encoded = btoa(unescape(encodeURIComponent(input)))
        setOutput(encoded)
      } else {
        const decoded = decodeURIComponent(escape(atob(input)))
        setOutput(decoded)
      }
    } catch (err) {
      setError(`Failed to ${mode}. The input format may be invalid.`)
      setOutput("")
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setInput("")
    setOutput("")
    setError(null)
    setCopied(false)
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Base64 Encoder/Decoder</CardTitle>
          <CardDescription>Encode text to Base64 or decode from Base64</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Selection */}
          <div className="space-y-3">
            <Label>Conversion Mode</Label>
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
                  className="flex-1"
                >
                  {m === "encode" ? "Encode to Base64" : "Decode from Base64"}
                </Button>
              ))}
            </div>
          </div>

          {/* Input Textarea */}
          <div className="space-y-2">
            <Label>Input</Label>
            <Textarea
              placeholder={
                mode === "encode"
                  ? "Enter text to encode..."
                  : "Enter Base64 to decode..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-32 font-mono text-sm"
            />
          </div>

          {/* Converting Buttons */}
          <div className="flex gap-2">
            <Button onClick={handleConvert} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              {mode === "encode" ? "Encode" : "Decode"}
            </Button>
            {output && (
              <Button variant="outline" size="lg" onClick={handleClear}>
                Clear
              </Button>
            )}
          </div>

          {/* Error Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Output Textarea */}
          {output && (
            <div className="space-y-2">
              <Label>Output</Label>
              <Textarea
                value={output}
                readOnly
                className="min-h-32 font-mono text-sm"
              />
              <Button
                onClick={handleCopy}
                variant="outline"
                className="w-full"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Output
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
