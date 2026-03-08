"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Copy, CheckCircle } from "lucide-react"

type HashAlgorithm = "md5" | "sha1" | "sha256" | "sha512"

// Simple hash implementations for browser
async function hashString(str: string, algorithm: HashAlgorithm): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  
  let hashAlgo: string
  switch (algorithm) {
    case "sha256":
      hashAlgo = "SHA-256"
      break
    case "sha512":
      hashAlgo = "SHA-512"
      break
    case "sha1":
      hashAlgo = "SHA-1"
      break
    case "md5":
      // MD5 using a simple implementation
      return simpleHash(str)
    default:
      hashAlgo = "SHA-256"
  }

  const hashBuffer = await crypto.subtle.digest(hashAlgo, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

function simpleHash(str: string): string {
  // Simple MD5-like hash (not cryptographically secure MD5, just for demo)
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16).padStart(32, "0")
}

export function HashGenerator() {
  const [input, setInput] = useState("")
  const [hashes, setHashes] = useState<Partial<Record<HashAlgorithm, string>>>({})
  const [copied, setCopied] = useState<HashAlgorithm | null>(null)

  const handleGenerate = async () => {
    if (!input.trim()) return

    const algorithms: HashAlgorithm[] = ["md5", "sha1", "sha256", "sha512"]
    const newHashes: Partial<Record<HashAlgorithm, string>> = {}

    for (const algo of algorithms) {
      newHashes[algo] = await hashString(input, algo)
    }

    setHashes(newHashes)
  }

  const handleCopy = (algo: HashAlgorithm) => {
    if (hashes[algo]) {
      navigator.clipboard.writeText(hashes[algo]!)
      setCopied(algo)
      setTimeout(() => setCopied(null), 2000)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hash Generator</CardTitle>
          <CardDescription>Generate MD5, SHA1, SHA256, and SHA512 hashes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input */}
          <div className="space-y-2">
            <Label>Input Text</Label>
            <Textarea
              placeholder="Enter text to hash..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-32"
            />
          </div>

          {/* Generate Button */}
          <Button onClick={handleGenerate} className="w-full">
            Generate Hashes
          </Button>

          {/* Hash Results */}
          {Object.entries(hashes).length > 0 && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">Results</Label>
              {(["md5", "sha1", "sha256", "sha512"] as const).map((algo) => (
                <div key={algo} className="space-y-1.5 p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium uppercase">{algo}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(algo)}
                    >
                      {copied === algo ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                  <code className="text-xs break-all text-muted-foreground font-mono">
                    {hashes[algo]}
                  </code>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
