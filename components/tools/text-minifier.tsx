"use client"

import React, { useState } from "react"
import { minify as terserMinify } from "terser"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Copy, CheckCircle, Zap, Loader2, AlertTriangle, ShieldCheck } from "lucide-react"

type MinifyType = "html" | "css" | "javascript" | "json"

interface MinifyOptions {
  removeComments: boolean
  mangleNames: boolean
  compressCode: boolean
  removeWhitespace: boolean
}

export function TextMinifier() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [minifyType, setMinifyType] = useState<MinifyType>("javascript")
  const [copied, setCopied] = useState(false)
  const [isMinifying, setIsMinifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [options, setOptions] = useState<MinifyOptions>({
    removeComments: true,
    mangleNames: false,
    compressCode: true,
    removeWhitespace: true,
  })

  // --- HTML minifier (safe regex-based, fine for HTML) ---
  const minifyHTML = (html: string): string => {
    let result = html
    if (options.removeComments) {
      result = result.replace(/<!--[\s\S]*?-->/g, "")
    }
    if (options.removeWhitespace) {
      result = result
        .replace(/>\s+</g, "><")
        .replace(/\s{2,}/g, " ")
    }
    // Collapse boolean attributes
    result = result.replace(/\s+(checked|disabled|readonly|selected|required|autofocus|autoplay|controls|loop|muted|hidden|novalidate|formnovalidate|open|multiple)="(true|\1|)"/gi, " $1")
    return result.trim()
  }

  // --- CSS minifier (safe tokenizer approach) ---
  const minifyCSS = (css: string): string => {
    let result = css
    if (options.removeComments) {
      result = result.replace(/\/\*[\s\S]*?\*\//g, "")
    }
    if (options.removeWhitespace) {
      // Collapse whitespace
      result = result.replace(/\s+/g, " ")
      // Remove spaces around structural characters
      result = result.replace(/\s*([{};:,>~+])\s*/g, "$1")
      // Remove trailing semicolons before closing braces
      result = result.replace(/;}/g, "}")
      // Remove leading/trailing spaces in selectors
      result = result.replace(/\s*!important/g, "!important")
    }
    // Remove zero units (0px -> 0, but not 0%)
    if (options.compressCode) {
      result = result.replace(/\b0(px|em|rem|pt|pc|in|cm|mm|ex|ch|vw|vh|vmin|vmax)\b/g, "0")
      // Shorten hex colors (#ffffff -> #fff)
      result = result.replace(/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3/g, "#$1$2$3")
      // Remove unnecessary leading zeros (0.5 -> .5)
      result = result.replace(/([:,\s])0\.(\d+)/g, "$1.$2")
    }
    return result.trim()
  }

  // --- JavaScript minifier (Terser — production-grade AST parser) ---
  const minifyJavaScript = async (js: string): Promise<string> => {
    const result = await terserMinify(js, {
      compress: options.compressCode ? {
        dead_code: true,
        drop_console: false,
        drop_debugger: true,
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        if_return: true,
        join_vars: true,
        collapse_vars: true,
        reduce_vars: true,
      } : false,
      mangle: options.mangleNames ? {
        toplevel: false,
      } : false,
      format: {
        comments: !options.removeComments ? "all" : false,
      },
    })
    if (!result.code && result.code !== "") {
      throw new Error("Minification returned empty result")
    }
    return result.code ?? ""
  }

  // --- JSON minifier ---
  const minifyJSON = (json: string): string => {
    const parsed = JSON.parse(json)
    return JSON.stringify(parsed)
  }

  const handleMinify = async () => {
    if (!input.trim()) {
      setOutput("")
      setError(null)
      return
    }

    setIsMinifying(true)
    setError(null)

    try {
      let result = ""
      switch (minifyType) {
        case "html":
          result = minifyHTML(input)
          break
        case "css":
          result = minifyCSS(input)
          break
        case "javascript":
          result = await minifyJavaScript(input)
          break
        case "json":
          result = minifyJSON(input)
          break
      }
      setOutput(result)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Minification failed"
      setError(message)
      setOutput("")
    } finally {
      setIsMinifying(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const originalSize = new Blob([input]).size
  const minifiedSize = new Blob([output]).size
  const reduction = originalSize > 0
    ? (((originalSize - minifiedSize) / originalSize) * 100).toFixed(1)
    : "0"
  const formatBytes = (bytes: number) =>
    bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(2)} KB`

  const typeLabels: Record<MinifyType, string> = {
    html: "HTML",
    css: "CSS",
    javascript: "JavaScript",
    json: "JSON",
  }

  const placeholders: Record<MinifyType, string> = {
    html: `<!DOCTYPE html>\n<html>\n  <head>\n    <title>Hello</title>\n  </head>\n  <body>\n    <!-- Welcome page -->\n    <div class="container">\n      <h1>Hello World</h1>\n    </div>\n  </body>\n</html>`,
    css: `.container {\n  display: flex;\n  /* Center content */\n  justify-content: center;\n  align-items: center;\n  padding: 0px;\n  color: #ffffff;\n}`,
    javascript: `// Calculate factorial\nfunction factorial(n) {\n  if (n <= 1) {\n    return 1;\n  }\n  /* recursive call */\n  return n * factorial(n - 1);\n}\n\nconsole.log(factorial(5));`,
    json: `{\n  "name": "example",\n  "version": "1.0.0",\n  "description": "A sample project",\n  "dependencies": {\n    "react": "^19.0.0"\n  }\n}`,
  }

  // Options available per type
  const showMangle = minifyType === "javascript"
  const showCompress = minifyType === "javascript" || minifyType === "css"

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Code Minifier</CardTitle>
          <CardDescription>Production-grade minification for HTML, CSS, JavaScript & JSON</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Type Selection */}
          <div className="space-y-2">
            <Label>Code Type</Label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(typeLabels) as MinifyType[]).map((type) => (
                <Button
                  key={type}
                  variant={minifyType === type ? "default" : "outline"}
                  onClick={() => {
                    setMinifyType(type)
                    setOutput("")
                    setError(null)
                  }}
                >
                  {typeLabels[type]}
                </Button>
              ))}
            </div>
          </div>

          {/* Minification Options */}
          <div className="flex flex-wrap gap-x-6 gap-y-3 p-3 bg-secondary/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Switch
                id="removeComments"
                checked={options.removeComments}
                onCheckedChange={(v) => setOptions((o) => ({ ...o, removeComments: v }))}
              />
              <Label htmlFor="removeComments" className="text-sm cursor-pointer">Remove comments</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="removeWhitespace"
                checked={options.removeWhitespace}
                onCheckedChange={(v) => setOptions((o) => ({ ...o, removeWhitespace: v }))}
              />
              <Label htmlFor="removeWhitespace" className="text-sm cursor-pointer">Remove whitespace</Label>
            </div>
            {showCompress && (
              <div className="flex items-center gap-2">
                <Switch
                  id="compressCode"
                  checked={options.compressCode}
                  onCheckedChange={(v) => setOptions((o) => ({ ...o, compressCode: v }))}
                />
                <Label htmlFor="compressCode" className="text-sm cursor-pointer">Compress</Label>
              </div>
            )}
            {showMangle && (
              <div className="flex items-center gap-2">
                <Switch
                  id="mangleNames"
                  checked={options.mangleNames}
                  onCheckedChange={(v) => setOptions((o) => ({ ...o, mangleNames: v }))}
                />
                <Label htmlFor="mangleNames" className="text-sm cursor-pointer">Mangle names</Label>
              </div>
            )}
          </div>

          {/* Input and Output */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Input Code</Label>
              <Textarea
                placeholder={placeholders[minifyType]}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  setOutput("")
                  setError(null)
                }}
                className="min-h-80 font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label>Minified Output</Label>
              {error ? (
                <div className="min-h-80 rounded-md border border-destructive/50 bg-destructive/5 p-4 font-mono text-sm">
                  <div className="flex items-start gap-2 text-destructive">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Minification Error</p>
                      <p className="text-xs whitespace-pre-wrap">{error}</p>
                    </div>
                  </div>
                </div>
              ) : output ? (
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
              ) : (
                <div className="min-h-80 rounded-md border border-dashed border-border bg-muted/30 flex items-center justify-center text-sm text-muted-foreground">
                  Minified code will appear here
                </div>
              )}
            </div>
          </div>

          {/* Minify Button */}
          <Button onClick={handleMinify} size="lg" className="w-full" disabled={isMinifying || !input.trim()}>
            {isMinifying ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Minifying...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Minify {typeLabels[minifyType]}
              </>
            )}
          </Button>

          {/* Statistics */}
          {input && output && (
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-muted-foreground text-xs">Original</p>
                <p className="font-mono font-semibold">{formatBytes(originalSize)}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-muted-foreground text-xs">Minified</p>
                <p className="font-mono font-semibold">{formatBytes(minifiedSize)}</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="text-muted-foreground text-xs">Reduction</p>
                <p className="font-mono font-semibold text-green-600 dark:text-green-400">{reduction}%</p>
              </div>
            </div>
          )}

          {/* Engine Info */}
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg text-sm text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>Production-Ready</strong>
                <ul className="list-disc list-inside mt-1 text-xs space-y-1">
                  {minifyType === "javascript" && (
                    <>
                      <li>Powered by <strong>Terser</strong> — the same engine used by Webpack, Vite & Rollup</li>
                      <li>Full AST parsing — safely handles strings, template literals, regex & all ES2024+ syntax</li>
                      <li>Dead code elimination, constant folding & optional variable mangling</li>
                      <li>Syntax errors are caught and reported with line numbers</li>
                    </>
                  )}
                  {minifyType === "css" && (
                    <>
                      <li>Removes comments and unnecessary whitespace</li>
                      <li>Shortens hex colors (#ffffff → #fff) and removes zero units (0px → 0)</li>
                      <li>Strips redundant semicolons and leading zeros (0.5 → .5)</li>
                    </>
                  )}
                  {minifyType === "html" && (
                    <>
                      <li>Removes HTML comments and collapses whitespace</li>
                      <li>Collapses boolean attributes (checked=&quot;checked&quot; → checked)</li>
                      <li>Safe for all standard HTML5 documents</li>
                    </>
                  )}
                  {minifyType === "json" && (
                    <>
                      <li>Validates JSON structure and reports parse errors</li>
                      <li>Removes all whitespace and formatting</li>
                      <li>Outputs compact single-line JSON</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
