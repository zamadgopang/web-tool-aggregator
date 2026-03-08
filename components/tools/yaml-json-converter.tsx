"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Copy, CheckCircle, AlertCircle, ArrowRightLeft } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

// Minimal YAML parser/stringifier (client-side, no deps)
const yamlToJson = (yaml: string): unknown => {
  const lines = yaml.split("\n")
  return parseYamlLines(lines, 0, 0).value
}

interface ParseResult {
  value: unknown
  endIndex: number
}

function getIndent(line: string): number {
  const match = line.match(/^(\s*)/)
  return match ? match[1].length : 0
}

function parseYamlLines(lines: string[], startIndex: number, baseIndent: number): ParseResult {
  const result: Record<string, unknown> = {}
  let i = startIndex

  while (i < lines.length) {
    const line = lines[i]

    // Skip empty lines and comments
    if (line.trim() === "" || line.trim().startsWith("#")) {
      i++
      continue
    }

    const indent = getIndent(line)
    if (indent < baseIndent) break

    const trimmed = line.trim()

    // Array item
    if (trimmed.startsWith("- ")) {
      const arr: unknown[] = []
      while (i < lines.length) {
        const arrLine = lines[i]
        if (arrLine.trim() === "" || arrLine.trim().startsWith("#")) { i++; continue }
        const arrIndent = getIndent(arrLine)
        if (arrIndent < baseIndent) break
        if (!arrLine.trim().startsWith("- ")) break
        const itemValue = arrLine.trim().slice(2).trim()
        // Check if it's a nested object starting on next line
        if (itemValue.includes(": ")) {
          // Inline key: value in array item
          const subObj: Record<string, unknown> = {}
          const colonIdx = itemValue.indexOf(": ")
          subObj[itemValue.slice(0, colonIdx)] = parseYamlValue(itemValue.slice(colonIdx + 2))
          // Check for continuation at deeper indent
          const nextLineIndent = i + 1 < lines.length ? getIndent(lines[i + 1]) : 0
          if (i + 1 < lines.length && nextLineIndent > arrIndent + 2 && !lines[i + 1].trim().startsWith("-")) {
            const nested = parseYamlLines(lines, i + 1, nextLineIndent)
            Object.assign(subObj, nested.value as Record<string, unknown>)
            i = nested.endIndex
          } else {
            i++
          }
          arr.push(subObj)
        } else if (itemValue === "") {
          // Nested structure under array
          const nextLineIndent = i + 1 < lines.length ? getIndent(lines[i + 1]) : 0
          if (i + 1 < lines.length && nextLineIndent > arrIndent) {
            const nested = parseYamlLines(lines, i + 1, nextLineIndent)
            arr.push(nested.value)
            i = nested.endIndex
          } else {
            arr.push(null)
            i++
          }
        } else {
          arr.push(parseYamlValue(itemValue))
          i++
        }
      }
      return { value: arr, endIndex: i }
    }

    // Key: value pair
    const colonIdx = trimmed.indexOf(":")
    if (colonIdx === -1) { i++; continue }

    const key = trimmed.slice(0, colonIdx).trim()
    const rawValue = trimmed.slice(colonIdx + 1).trim()

    if (rawValue === "" || rawValue === "|" || rawValue === ">") {
      // Nested object or block scalar
      const nextLineIndent = i + 1 < lines.length ? getIndent(lines[i + 1]) : 0
      if (i + 1 < lines.length && nextLineIndent > indent) {
        if (lines[i + 1].trim().startsWith("- ")) {
          const nested = parseYamlLines(lines, i + 1, nextLineIndent)
          result[key] = nested.value
          i = nested.endIndex
        } else if (rawValue === "|" || rawValue === ">") {
          // Block scalar
          let blockText = ""
          i++
          while (i < lines.length && (getIndent(lines[i]) >= nextLineIndent || lines[i].trim() === "")) {
            blockText += (blockText ? (rawValue === "|" ? "\n" : " ") : "") + lines[i].trim()
            i++
          }
          result[key] = blockText
        } else {
          const nested = parseYamlLines(lines, i + 1, nextLineIndent)
          result[key] = nested.value
          i = nested.endIndex
        }
      } else {
        result[key] = null
        i++
      }
    } else if (rawValue.startsWith("[") && rawValue.endsWith("]")) {
      // Inline array
      const inner = rawValue.slice(1, -1)
      result[key] = inner.split(",").map((s) => parseYamlValue(s.trim()))
      i++
    } else if (rawValue.startsWith("{") && rawValue.endsWith("}")) {
      // Inline object
      const inner = rawValue.slice(1, -1)
      const obj: Record<string, unknown> = {}
      inner.split(",").forEach((pair) => {
        const ci = pair.indexOf(":")
        if (ci !== -1) {
          obj[pair.slice(0, ci).trim()] = parseYamlValue(pair.slice(ci + 1).trim())
        }
      })
      result[key] = obj
      i++
    } else {
      result[key] = parseYamlValue(rawValue)
      i++
    }
  }

  return { value: result, endIndex: i }
}

function parseYamlValue(val: string): unknown {
  if (val === "null" || val === "~") return null
  if (val === "true") return true
  if (val === "false") return false
  if (/^-?\d+$/.test(val)) return parseInt(val, 10)
  if (/^-?\d+\.\d+$/.test(val)) return parseFloat(val)
  // Strip quotes
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    return val.slice(1, -1)
  }
  return val
}

// JSON to YAML stringifier
function jsonToYaml(value: unknown, indent = 0): string {
  const prefix = "  ".repeat(indent)

  if (value === null || value === undefined) return "null"
  if (typeof value === "boolean") return String(value)
  if (typeof value === "number") return String(value)
  if (typeof value === "string") {
    if (value.includes("\n") || value.includes(": ") || value.includes("#") || value === "") {
      return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")}"`
    }
    if (/^(true|false|null|~|\d+|\d+\.\d+)$/.test(value)) return `"${value}"`
    return value
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]"
    return value
      .map((item) => {
        if (typeof item === "object" && item !== null && !Array.isArray(item)) {
          const objStr = jsonToYaml(item, indent + 1)
          const firstLine = objStr.split("\n")[0]
          const rest = objStr.split("\n").slice(1).join("\n")
          return `${prefix}- ${firstLine}${rest ? "\n" + rest : ""}`
        }
        return `${prefix}- ${jsonToYaml(item, indent + 1)}`
      })
      .join("\n")
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
    if (entries.length === 0) return "{}"
    return entries
      .map(([k, v]) => {
        if (typeof v === "object" && v !== null) {
          return `${prefix}${k}:\n${jsonToYaml(v, indent + 1)}`
        }
        return `${prefix}${k}: ${jsonToYaml(v, indent + 1)}`
      })
      .join("\n")
  }

  return String(value)
}

export function YamlJsonConverter() {
  const [leftContent, setLeftContent] = useState("")
  const [rightContent, setRightContent] = useState("")
  const [mode, setMode] = useState<"yaml-to-json" | "json-to-yaml">("yaml-to-json")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const convert = () => {
    setError(null)
    setRightContent("")

    if (!leftContent.trim()) {
      setError("Please enter content to convert")
      return
    }

    try {
      if (mode === "yaml-to-json") {
        const parsed = yamlToJson(leftContent)
        setRightContent(JSON.stringify(parsed, null, 2))
      } else {
        const parsed = JSON.parse(leftContent)
        setRightContent(jsonToYaml(parsed))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed. Please check your input syntax.")
    }
  }

  const swap = () => {
    setMode(mode === "yaml-to-json" ? "json-to-yaml" : "yaml-to-json")
    setLeftContent(rightContent)
    setRightContent("")
    setError(null)
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(rightContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>YAML ↔ JSON Converter</CardTitle>
          <CardDescription>Convert between YAML and JSON formats. Client-side, no data leaves your browser.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2 items-center">
            <Button onClick={convert}>Convert</Button>
            <Button variant="outline" onClick={swap}>
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              Swap Direction
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{mode === "yaml-to-json" ? "YAML Input" : "JSON Input"}</Label>
              <Textarea
                placeholder={mode === "yaml-to-json" ? "name: John\nage: 30\nroles:\n  - admin\n  - editor" : '{"name": "John", "age": 30}'}
                value={leftContent}
                onChange={(e) => setLeftContent(e.target.value)}
                rows={18}
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{mode === "yaml-to-json" ? "JSON Output" : "YAML Output"}</Label>
                {rightContent && (
                  <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                    {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                )}
              </div>
              <Textarea
                value={rightContent}
                readOnly
                rows={18}
                className="font-mono text-sm bg-muted"
                placeholder="Output will appear here..."
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Conversion Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
