"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Copy, CheckCircle, Zap } from "lucide-react"

type MinifyType = "html" | "css" | "javascript"

export function TextMinifier() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [minifyType, setMinifyType] = useState<MinifyType>("html")
  const [copied, setCopied] = useState(false)

  const minifyHTML = (html: string): string => {
    return html
      .replace(/<!--[\s\S]*?-->/g, "") // Remove comments
      .replace(/>\s+</g, "><") // Remove whitespace between tags
      .replace(/\s+/g, " ") // Collapse multiple spaces
      .trim()
  }

  const minifyCSS = (css: string): string => {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
      .replace(/\s+/g, " ") // Collapse whitespace
      .replace(/\s*([{};:,])\s*/g, "$1") // Remove spaces around special chars
      .replace(/;}/, "}") // Last semicolon is optional
      .trim()
  }

  const minifyJavaScript = (js: string): string => {
    return js
      .replace(/\/\*[\s\S]*?\*\//g, "") // Remove block comments
      .replace(/\/\/.*$/gm, "") // Remove line comments
      .replace(/\s+/g, " ") // Collapse whitespace
      .replace(/\s*([{}[\]();:,=+\-*/<>!&|?])\s*/g, "$1") // Remove spaces around operators
      .trim()
  }

  const handleMinify = () => {
    if (!input.trim()) {
      setOutput("")
      return
    }

    let result = ""
    switch (minifyType) {
      case "html":
        result = minifyHTML(input)
        break
      case "css":
        result = minifyCSS(input)
        break
      case "javascript":
        result = minifyJavaScript(input)
        break
    }
    setOutput(result)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const originalSize = (input.length / 1024).toFixed(2)
  const minifiedSize = (output.length / 1024).toFixed(2)
  const reduction = input.length > 0 
    ? (((input.length - output.length) / input.length) * 100).toFixed(1)
    : "0"

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Text Minifier</CardTitle>
          <CardDescription>Compress HTML, CSS, and JavaScript code instantly</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Type Selection */}
          <div className="space-y-2">
            <Label>Code Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["html", "css", "javascript"] as const).map((type) => (
                <Button
                  key={type}
                  variant={minifyType === type ? "default" : "outline"}
                  onClick={() => setMinifyType(type)}
                  className="capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Input and Output */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Input Code</Label>
              <Textarea
                placeholder={
                  minifyType === "html"
                    ? "<div class='container'>Hello World</div>"
                    : minifyType === "css"
                    ? ".container { font-size: 16px; }"
                    : "const greeting = () => console.log('Hello');"
                }
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  setOutput("")
                }}
                className="min-h-80 font-mono text-sm"
              />
            </div>

            {output && (
              <div className="space-y-2">
                <Label>Minified Code</Label>
                <div className="space-y-2">
                  <Textarea
                    value={output}
                    readOnly
                    className="min-h-80 font-mono text-sm bg-muted"
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

          {/* Minify Button */}
          <Button onClick={handleMinify} size="lg" className="w-full">
            <Zap className="h-4 w-4 mr-2" />
            Minify Code
          </Button>

          {/* Statistics */}
          {input && output && (
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-muted-foreground text-xs">Original</p>
                <p className="font-mono font-semibold">{originalSize} KB</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-muted-foreground text-xs">Minified</p>
                <p className="font-mono font-semibold">{minifiedSize} KB</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="text-muted-foreground text-xs">Reduction</p>
                <p className="font-mono font-semibold text-green-600 dark:text-green-400">{reduction}%</p>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-sm text-blue-900 dark:text-blue-200">
            <strong>Tips:</strong>
            <ul className="list-disc list-inside mt-1 text-xs space-y-1">
              {minifyType === "html" && (
                <>
                  <li>Removes HTML comments</li>
                  <li>Removes unnecessary whitespace</li>
                </>
              )}
              {minifyType === "css" && (
                <>
                  <li>Removes CSS comments</li>
                  <li>Compacts selectors and rules</li>
                </>
              )}
              {minifyType === "javascript" && (
                <>
                  <li>Removes all comments</li>
                  <li>⚠️ Regex-based — may break complex code with strings containing operators</li>
                  <li>For production, use dedicated tools like Terser or UglifyJS</li>
                </>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
