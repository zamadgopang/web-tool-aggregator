"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Copy, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

type JsonAction = "format" | "minify" | "validate"

export function JSONFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
      setError(null)
      setIsValid(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON")
      setIsValid(false)
      setOutput("")
    }
  }

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError(null)
      setIsValid(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON")
      setIsValid(false)
      setOutput("")
    }
  }

  const handleValidate = () => {
    try {
      JSON.parse(input)
      setError(null)
      setIsValid(true)
      setOutput("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON")
      setIsValid(false)
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
    setIsValid(null)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>JSON Formatter & Validator</CardTitle>
          <CardDescription>Format, minify, and validate JSON instantly</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleFormat} variant="default">
              Format
            </Button>
            <Button onClick={handleMinify} variant="outline">
              Minify
            </Button>
            <Button onClick={handleValidate} variant="outline">
              Validate
            </Button>
            <Button onClick={handleClear} variant="ghost" className="ml-auto">
              Clear
            </Button>
          </div>

          {/* Validation Status */}
          {isValid !== null && (
            <Alert variant={isValid ? "default" : "destructive"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{isValid ? "Valid JSON" : "Invalid JSON"}</AlertTitle>
              {!isValid && <AlertDescription>{error}</AlertDescription>}
            </Alert>
          )}

          {/* Input Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Input JSON</Label>
              <Textarea
                placeholder='{"key": "value"}'
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  setOutput("")
                  setError(null)
                  setIsValid(null)
                }}
                className="min-h-96 font-mono text-sm"
              />
            </div>

            {/* Output Area */}
            {output && (
              <div className="space-y-2">
                <Label>Output JSON</Label>
                <div className="space-y-2">
                  <Textarea
                    value={output}
                    readOnly
                    className="min-h-96 font-mono text-sm bg-muted"
                  />
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="w-full"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Output
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Statistics */}
          {input && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-muted-foreground">Input Size</p>
                <p className="font-mono font-semibold">{(input.length / 1024).toFixed(2)} KB</p>
              </div>
              {output && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-muted-foreground">Output Size</p>
                  <p className="font-mono font-semibold">{(output.length / 1024).toFixed(2)} KB</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
