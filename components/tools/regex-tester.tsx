"use client"

import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Copy, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function RegexTester() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b")
  const [flags, setFlags] = useState("gi")
  const [testString, setTestString] = useState(
    "Contact us at hello@example.com or support@company.org for more info.\nYou can also reach admin@test.co."
  )
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const results = useMemo(() => {
    if (!pattern) return { matches: [], highlighted: testString, matchCount: 0 }
    
    try {
      const regex = new RegExp(pattern, flags)
      const matches: { match: string; index: number; groups?: Record<string, string> }[] = []
      
      if (flags.includes("g")) {
        let m: RegExpExecArray | null
        const re = new RegExp(pattern, flags)
        while ((m = re.exec(testString)) !== null) {
          matches.push({
            match: m[0],
            index: m.index,
            groups: m.groups ? { ...m.groups } : undefined,
          })
          if (m[0].length === 0) re.lastIndex++
        }
      } else {
        const m = regex.exec(testString)
        if (m) {
          matches.push({
            match: m[0],
            index: m.index,
            groups: m.groups ? { ...m.groups } : undefined,
          })
        }
      }

      // Build highlighted text
      let highlighted = ""
      let lastIndex = 0
      const sortedMatches = [...matches].sort((a, b) => a.index - b.index)
      
      for (const m of sortedMatches) {
        const before = testString.slice(lastIndex, m.index)
        highlighted += escapeHtml(before)
        highlighted += `<mark class="bg-yellow-300 dark:bg-yellow-600 text-foreground rounded px-0.5">${escapeHtml(m.match)}</mark>`
        lastIndex = m.index + m.match.length
      }
      highlighted += escapeHtml(testString.slice(lastIndex))

      setError(null)
      return { matches, highlighted, matchCount: matches.length }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Invalid regex"
      setError(msg)
      return { matches: [], highlighted: escapeHtml(testString), matchCount: 0 }
    }
  }, [pattern, flags, testString])

  const handleCopy = () => {
    navigator.clipboard.writeText(`/${pattern}/${flags}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Regex Tester</CardTitle>
          <CardDescription>Test and debug regular expressions with real-time matching</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pattern Input */}
          <div className="space-y-2">
            <Label htmlFor="regex-pattern">Regular Expression</Label>
            <div className="flex gap-2">
              <div className="flex items-center flex-1 border rounded-lg overflow-hidden bg-background">
                <span className="px-3 text-muted-foreground font-mono text-lg">/</span>
                <Input
                  id="regex-pattern"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="Enter regex pattern..."
                  className="border-0 font-mono focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <span className="px-1 text-muted-foreground font-mono text-lg">/</span>
                <Input
                  value={flags}
                  onChange={(e) => setFlags(e.target.value)}
                  placeholder="flags"
                  className="border-0 w-16 font-mono focus-visible:ring-0 focus-visible:ring-offset-0"
                  aria-label="Regex flags"
                />
              </div>
              <Button variant="outline" onClick={handleCopy}>
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Flags Quick Toggle */}
          <div className="flex flex-wrap gap-2">
            {[
              { flag: "g", label: "Global", desc: "Match all occurrences" },
              { flag: "i", label: "Case Insensitive", desc: "Ignore case" },
              { flag: "m", label: "Multiline", desc: "^ and $ match line boundaries" },
              { flag: "s", label: "Dotall", desc: ". matches newlines" },
            ].map((f) => (
              <Button
                key={f.flag}
                variant={flags.includes(f.flag) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setFlags((prev) =>
                    prev.includes(f.flag)
                      ? prev.replace(f.flag, "")
                      : prev + f.flag
                  )
                }}
                title={f.desc}
              >
                {f.flag} - {f.label}
              </Button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Test String */}
          <div className="space-y-2">
            <Label htmlFor="test-string">Test String</Label>
            <Textarea
              id="test-string"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter text to test against..."
              className="min-h-32 font-mono text-sm"
            />
          </div>

          {/* Highlighted Result */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Match Results</Label>
              <span className="text-sm font-medium">
                {results.matchCount} match{results.matchCount !== 1 ? "es" : ""} found
              </span>
            </div>
            <div
              className="min-h-24 p-3 border rounded-lg bg-muted/50 font-mono text-sm whitespace-pre-wrap break-all"
              dangerouslySetInnerHTML={{ __html: results.highlighted }}
            />
          </div>

          {/* Match Details */}
          {results.matches.length > 0 && (
            <div className="space-y-2">
              <Label>Match Details</Label>
              <div className="max-h-60 overflow-auto space-y-1">
                {results.matches.map((match, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 bg-muted rounded-lg text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground font-mono w-8">#{i + 1}</span>
                      <code className="font-mono text-foreground bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
                        {match.match}
                      </code>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Index: {match.index}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Common Patterns Reference */}
          <div className="p-3 bg-muted rounded-lg text-sm">
            <strong className="text-xs">Common Patterns:</strong>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-muted-foreground font-mono">
              <div><code>\\d+</code> — Digits</div>
              <div><code>\\w+</code> — Word chars</div>
              <div><code>[a-zA-Z]+</code> — Letters</div>
              <div><code>\\b\\w+@\\w+\\.\\w+\\b</code> — Email</div>
              <div><code>^https?://</code> — URL start</div>
              <div><code>\\d{"{3}-\\d{3}-\\d{4}"}</code> — Phone</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
