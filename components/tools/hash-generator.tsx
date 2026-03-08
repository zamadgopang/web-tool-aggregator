"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, CheckCircle, AlertCircle } from "lucide-react"

type HashAlgorithm = "sha1" | "sha256" | "sha384" | "sha512"

const algorithmMap: Record<HashAlgorithm, string> = {
  sha1: "SHA-1",
  sha256: "SHA-256",
  sha384: "SHA-384",
  sha512: "SHA-512",
}

async function hashString(str: string, algorithm: HashAlgorithm): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  const hashBuffer = await crypto.subtle.digest(algorithmMap[algorithm], data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export function HashGenerator() {
  const [input, setInput] = useState("")
  const [hashes, setHashes] = useState<Partial<Record<HashAlgorithm, string>>>({})
  const [copied, setCopied] = useState<HashAlgorithm | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!input.trim()) return

    setIsGenerating(true)
    const algorithms: HashAlgorithm[] = ["sha1", "sha256", "sha384", "sha512"]
    const newHashes: Partial<Record<HashAlgorithm, string>> = {}

    for (const algo of algorithms) {
      newHashes[algo] = await hashString(input, algo)
    }

    setHashes(newHashes)
    setIsGenerating(false)
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
          <CardDescription>Generate cryptographic hashes using the Web Crypto API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input */}
          <div className="space-y-2">
            <Label htmlFor="hash-input">Input Text</Label>
            <Textarea
              id="hash-input"
              placeholder="Enter text to hash..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-32"
            />
          </div>

          {/* Generate Button */}
          <Button onClick={handleGenerate} className="w-full" disabled={!input.trim() || isGenerating}>
            {isGenerating ? "Generating..." : "Generate Hashes"}
          </Button>

          {/* Hash Results */}
          {Object.entries(hashes).length > 0 && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">Results</Label>
              {(Object.keys(algorithmMap) as HashAlgorithm[]).map((algo) => (
                <div key={algo} className="space-y-1.5 p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium uppercase">{algo}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(algo)}
                      aria-label={`Copy ${algo} hash`}
                    >
                      {copied === algo ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
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

          {/* Info */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              All hashes are generated using the browser&apos;s native Web Crypto API. MD5 has been removed as it is cryptographically broken. Use SHA-256 or SHA-512 for security-sensitive applications.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
