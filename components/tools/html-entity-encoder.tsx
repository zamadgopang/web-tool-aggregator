"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Copy, CheckCircle, ArrowRightLeft } from "lucide-react"

// Named HTML entities map
const NAMED_ENTITIES: Record<string, string> = {
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  "©": "&copy;", "®": "&reg;", "™": "&trade;", "€": "&euro;", "£": "&pound;",
  "¥": "&yen;", "¢": "&cent;", "§": "&sect;", "¶": "&para;", "•": "&bull;",
  "†": "&dagger;", "‡": "&Dagger;", "…": "&hellip;", "—": "&mdash;", "–": "&ndash;",
  " ": "&nbsp;", "¡": "&iexcl;", "¿": "&iquest;", "«": "&laquo;", "»": "&raquo;",
  "°": "&deg;", "±": "&plusmn;", "×": "&times;", "÷": "&divide;",
  "α": "&alpha;", "β": "&beta;", "γ": "&gamma;", "δ": "&delta;",
  "π": "&pi;", "σ": "&sigma;", "μ": "&mu;", "λ": "&lambda;",
  "∞": "&infin;", "∑": "&sum;", "√": "&radic;", "≠": "&ne;",
  "≤": "&le;", "≥": "&ge;", "≈": "&asymp;",
  "←": "&larr;", "→": "&rarr;", "↑": "&uarr;", "↓": "&darr;",
  "♠": "&spades;", "♣": "&clubs;", "♥": "&hearts;", "♦": "&diams;",
}

// Reverse map for decoding
const REVERSE_ENTITIES: Record<string, string> = {}
for (const [char, entity] of Object.entries(NAMED_ENTITIES)) {
  REVERSE_ENTITIES[entity] = char
}

function encodeHTML(text: string, useNamedEntities: boolean): string {
  if (useNamedEntities) {
    let result = ""
    for (const char of text) {
      if (NAMED_ENTITIES[char]) {
        result += NAMED_ENTITIES[char]
      } else {
        const code = char.charCodeAt(0)
        if (code > 127) {
          result += `&#${code};`
        } else {
          result += char
        }
      }
    }
    return result
  }

  // Numeric encoding
  let result = ""
  for (const char of text) {
    const code = char.charCodeAt(0)
    if (code > 127 || char === "&" || char === "<" || char === ">" || char === '"' || char === "'") {
      result += `&#${code};`
    } else {
      result += char
    }
  }
  return result
}

function decodeHTML(text: string): string {
  let result = text

  // Decode named entities
  for (const [entity, char] of Object.entries(REVERSE_ENTITIES)) {
    result = result.split(entity).join(char)
  }

  // Decode numeric entities (decimal)
  result = result.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))

  // Decode hex entities
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)))

  return result
}

export function HTMLEntityEncoder() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [useNamed, setUseNamed] = useState(true)
  const [copied, setCopied] = useState(false)

  const convert = () => {
    if (!input.trim()) return
    if (mode === "encode") {
      setOutput(encodeHTML(input, useNamed))
    } else {
      setOutput(decodeHTML(input))
    }
  }

  const swap = () => {
    setMode(mode === "encode" ? "decode" : "encode")
    setInput(output)
    setOutput("")
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Common entities reference
  const commonEntities = [
    { char: "&", entity: "&amp;", name: "Ampersand" },
    { char: "<", entity: "&lt;", name: "Less than" },
    { char: ">", entity: "&gt;", name: "Greater than" },
    { char: '"', entity: "&quot;", name: "Double quote" },
    { char: "'", entity: "&#39;", name: "Single quote" },
    { char: " ", entity: "&nbsp;", name: "Non-breaking space" },
    { char: "©", entity: "&copy;", name: "Copyright" },
    { char: "®", entity: "&reg;", name: "Registered" },
    { char: "™", entity: "&trade;", name: "Trademark" },
    { char: "€", entity: "&euro;", name: "Euro" },
    { char: "→", entity: "&rarr;", name: "Right arrow" },
    { char: "•", entity: "&bull;", name: "Bullet" },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>HTML Entity Encoder/Decoder</CardTitle>
          <CardDescription>Encode special characters to HTML entities or decode entities back to characters.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2 items-center">
            <Button onClick={convert}>{mode === "encode" ? "Encode" : "Decode"}</Button>
            <Button variant="outline" onClick={swap}>
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              Swap ({mode === "encode" ? "Switch to Decode" : "Switch to Encode"})
            </Button>
            {mode === "encode" && (
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={useNamed}
                  onChange={(e) => setUseNamed(e.target.checked)}
                  className="rounded"
                />
                Use named entities
              </label>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{mode === "encode" ? "Text Input" : "HTML Entities Input"}</Label>
              <Textarea
                placeholder={mode === "encode"
                  ? 'Type text with special characters: <div class="test">&copy;</div>'
                  : "Paste HTML entities: &lt;div class=&quot;test&quot;&gt;&amp;copy;&lt;/div&gt;"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={10}
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{mode === "encode" ? "HTML Entities Output" : "Decoded Text Output"}</Label>
                {output && (
                  <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                    {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                )}
              </div>
              <Textarea
                value={output}
                readOnly
                rows={10}
                className="font-mono text-sm bg-muted"
                placeholder="Output will appear here..."
              />
            </div>
          </div>

          {/* Reference Table */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Common HTML Entities Reference</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {commonEntities.map((e) => (
                <button
                  key={e.entity}
                  className="flex items-center gap-2 p-2 rounded border text-sm hover:bg-accent transition-colors cursor-pointer text-left"
                  onClick={() => {
                    if (mode === "encode") {
                      setInput((prev) => prev + e.char)
                    } else {
                      setInput((prev) => prev + e.entity)
                    }
                  }}
                >
                  <span className="text-lg w-6 text-center">{e.char === " " ? "⎵" : e.char}</span>
                  <span className="font-mono text-xs text-muted-foreground">{e.entity}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
