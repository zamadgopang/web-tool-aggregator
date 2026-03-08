"use client"

import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Copy, CheckCircle } from "lucide-react"

interface DiffLine {
  type: "same" | "added" | "removed"
  text: string
  lineNumber: { left?: number; right?: number }
}

function computeDiff(text1: string, text2: string): DiffLine[] {
  const lines1 = text1.split("\n")
  const lines2 = text2.split("\n")

  // Longest Common Subsequence (LCS) dynamic programming
  const m = lines1.length
  const n = lines2.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (lines1[i - 1] === lines2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  // Backtrack to produce diff
  const result: DiffLine[] = []
  let i = m
  let j = n

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && lines1[i - 1] === lines2[j - 1]) {
      result.unshift({
        type: "same",
        text: lines1[i - 1],
        lineNumber: { left: i, right: j },
      })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({
        type: "added",
        text: lines2[j - 1],
        lineNumber: { right: j },
      })
      j--
    } else if (i > 0) {
      result.unshift({
        type: "removed",
        text: lines1[i - 1],
        lineNumber: { left: i },
      })
      i--
    }
  }

  return result
}

export function TextDiffChecker() {
  const [text1, setText1] = useState("")
  const [text2, setText2] = useState("")
  const [copied, setCopied] = useState(false)

  const diff = useMemo(() => {
    if (!text1 && !text2) return []
    return computeDiff(text1, text2)
  }, [text1, text2])

  const stats = useMemo(() => {
    const added = diff.filter((d) => d.type === "added").length
    const removed = diff.filter((d) => d.type === "removed").length
    const same = diff.filter((d) => d.type === "same").length
    return { added, removed, same, total: diff.length }
  }, [diff])

  const handleCopy = () => {
    const diffText = diff
      .map((d) => {
        const prefix = d.type === "added" ? "+ " : d.type === "removed" ? "- " : "  "
        return prefix + d.text
      })
      .join("\n")
    navigator.clipboard.writeText(diffText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSwap = () => {
    const temp = text1
    setText1(text2)
    setText2(temp)
  }

  const handleClear = () => {
    setText1("")
    setText2("")
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Text Diff Checker</CardTitle>
          <CardDescription>Compare two texts and see the differences line by line</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Areas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="diff-original">Original Text</Label>
                <span className="text-xs text-muted-foreground">
                  {text1.split("\n").length} lines
                </span>
              </div>
              <Textarea
                id="diff-original"
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                placeholder="Paste original text here..."
                className="min-h-48 font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="diff-modified">Modified Text</Label>
                <span className="text-xs text-muted-foreground">
                  {text2.split("\n").length} lines
                </span>
              </div>
              <Textarea
                id="diff-modified"
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                placeholder="Paste modified text here..."
                className="min-h-48 font-mono text-sm"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSwap}>
              ↔ Swap
            </Button>
            <Button variant="outline" size="sm" onClick={handleClear}>
              Clear All
            </Button>
            {diff.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleCopy} className="ml-auto">
                {copied ? (
                  <><CheckCircle className="h-4 w-4 mr-1" /> Copied</>
                ) : (
                  <><Copy className="h-4 w-4 mr-1" /> Copy Diff</>
                )}
              </Button>
            )}
          </div>

          {/* Stats */}
          {diff.length > 0 && (
            <div className="grid grid-cols-4 gap-2 text-sm">
              <div className="p-2 bg-muted rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Total Lines</p>
                <p className="font-mono font-semibold">{stats.total}</p>
              </div>
              <div className="p-2 bg-muted rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Unchanged</p>
                <p className="font-mono font-semibold">{stats.same}</p>
              </div>
              <div className="p-2 bg-green-50 dark:bg-green-950 rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Added</p>
                <p className="font-mono font-semibold text-green-600 dark:text-green-400">+{stats.added}</p>
              </div>
              <div className="p-2 bg-red-50 dark:bg-red-950 rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Removed</p>
                <p className="font-mono font-semibold text-red-600 dark:text-red-400">-{stats.removed}</p>
              </div>
            </div>
          )}

          {/* Diff Output */}
          {diff.length > 0 && (
            <div className="space-y-2">
              <Label>Diff Result</Label>
              <div className="border rounded-lg overflow-hidden max-h-[500px] overflow-auto">
                {diff.map((line, idx) => (
                  <div
                    key={idx}
                    className={`flex items-stretch font-mono text-sm border-b last:border-b-0 ${
                      line.type === "added"
                        ? "bg-green-50 dark:bg-green-950/50 text-green-800 dark:text-green-300"
                        : line.type === "removed"
                        ? "bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-300"
                        : "bg-background text-foreground"
                    }`}
                  >
                    {/* Line numbers */}
                    <span className="w-10 shrink-0 text-right pr-2 py-1 text-xs text-muted-foreground border-r select-none">
                      {line.lineNumber.left ?? ""}
                    </span>
                    <span className="w-10 shrink-0 text-right pr-2 py-1 text-xs text-muted-foreground border-r select-none">
                      {line.lineNumber.right ?? ""}
                    </span>
                    {/* Indicator */}
                    <span className="w-6 shrink-0 text-center py-1 border-r font-bold select-none">
                      {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                    </span>
                    {/* Content */}
                    <span className="flex-1 py-1 px-2 whitespace-pre-wrap break-all">
                      {line.text || " "}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {text1 === "" && text2 === "" && (
            <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              <p className="font-medium">Paste text in both fields to see differences</p>
              <p className="text-sm mt-1">Uses LCS algorithm for accurate line-by-line comparison</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
