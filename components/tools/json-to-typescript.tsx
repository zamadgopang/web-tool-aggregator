"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Copy, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export function JsonToTypescript() {
  const [jsonInput, setJsonInput] = useState("")
  const [tsOutput, setTsOutput] = useState("")
  const [rootName, setRootName] = useState("Root")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const inferType = (value: unknown, name: string, interfaces: Map<string, string>, depth: number): string => {
    if (value === null || value === undefined) return "null"
    if (typeof value === "string") return "string"
    if (typeof value === "number") return Number.isInteger(value) ? "number" : "number"
    if (typeof value === "boolean") return "boolean"

    if (Array.isArray(value)) {
      if (value.length === 0) return "unknown[]"
      const types = new Set<string>()
      for (const item of value) {
        types.add(inferType(item, name + "Item", interfaces, depth + 1))
      }
      const uniqueTypes = Array.from(types)
      if (uniqueTypes.length === 1) return `${uniqueTypes[0]}[]`
      return `(${uniqueTypes.join(" | ")})[]`
    }

    if (typeof value === "object") {
      const interfaceName = capitalize(name)
      const properties: string[] = []

      for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
        const propType = inferType(val, key, interfaces, depth + 1)
        const safeName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`
        properties.push(`  ${safeName}: ${propType};`)
      }

      const interfaceStr = `export interface ${interfaceName} {\n${properties.join("\n")}\n}`
      interfaces.set(interfaceName, interfaceStr)
      return interfaceName
    }

    return "unknown"
  }

  const capitalize = (s: string): string => {
    return s
      .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
      .replace(/^./, (c) => c.toUpperCase())
      .replace(/[^a-zA-Z0-9]/g, "")
  }

  const convert = () => {
    setError(null)
    setTsOutput("")

    if (!jsonInput.trim()) {
      setError("Please enter JSON to convert")
      return
    }

    try {
      const parsed = JSON.parse(jsonInput)
      const interfaces = new Map<string, string>()

      if (Array.isArray(parsed)) {
        if (parsed.length > 0 && typeof parsed[0] === "object" && parsed[0] !== null) {
          inferType(parsed[0], rootName, interfaces, 0)
          const ifaceStrings = Array.from(interfaces.values()).reverse()
          setTsOutput(ifaceStrings.join("\n\n") + `\n\nexport type ${capitalize(rootName)}List = ${capitalize(rootName)}[];`)
        } else {
          const itemType = parsed.length > 0 ? typeof parsed[0] : "unknown"
          setTsOutput(`export type ${capitalize(rootName)} = ${itemType}[];`)
        }
      } else {
        inferType(parsed, rootName, interfaces, 0)
        const ifaceStrings = Array.from(interfaces.values()).reverse()
        setTsOutput(ifaceStrings.join("\n\n"))
      }
    } catch {
      setError("Invalid JSON input. Please check your JSON syntax.")
    }
  }

  const sampleJson = JSON.stringify({
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    is_active: true,
    address: {
      street: "123 Main St",
      city: "Springfield",
      zip_code: "62701",
    },
    roles: ["admin", "editor"],
    scores: [95, 87, 92],
  }, null, 2)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(tsOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>JSON → TypeScript Interface Generator</CardTitle>
          <CardDescription>Paste JSON and get TypeScript interfaces with nested types and arrays.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4 items-end">
            <div className="space-y-2 flex-1">
              <Label htmlFor="root-name">Root Interface Name</Label>
              <input
                id="root-name"
                className="flex h-9 w-full max-w-xs rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={rootName}
                onChange={(e) => setRootName(e.target.value || "Root")}
                placeholder="Root"
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => setJsonInput(sampleJson)}>
              Load Example
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>JSON Input</Label>
              <Textarea
                placeholder='{"key": "value"}'
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows={16}
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>TypeScript Output</Label>
                {tsOutput && (
                  <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                    {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                )}
              </div>
              <Textarea
                value={tsOutput}
                readOnly
                rows={16}
                className="font-mono text-sm bg-muted"
                placeholder="TypeScript interfaces will appear here..."
              />
            </div>
          </div>

          <Button onClick={convert}>Convert to TypeScript</Button>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
