"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Copy, CheckCircle, RefreshCw, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type IdType = "uuid-v4" | "nanoid" | "ulid-like"

export function UUIDGenerator() {
  const [idType, setIdType] = useState<IdType>("uuid-v4")
  const [count, setCount] = useState(5)
  const [ids, setIds] = useState<string[]>([])
  const [copied, setCopied] = useState<string | null>(null)

  const generateUUIDv4 = (): string => {
    const bytes = new Uint8Array(16)
    crypto.getRandomValues(bytes)
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
  }

  const generateNanoId = (size = 21): string => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-"
    const bytes = new Uint8Array(size)
    crypto.getRandomValues(bytes)
    return Array.from(bytes, (b) => alphabet[b & 63]).join("")
  }

  const generateULIDLike = (): string => {
    const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"
    const now = Date.now()
    let timeStr = ""
    let t = now
    for (let i = 0; i < 10; i++) {
      timeStr = ENCODING[t % 32] + timeStr
      t = Math.floor(t / 32)
    }
    const bytes = new Uint8Array(10)
    crypto.getRandomValues(bytes)
    let randomStr = ""
    for (let i = 0; i < 16; i++) {
      const idx = i < 10 ? bytes[i] % 32 : bytes[i - 10] % 32
      randomStr += ENCODING[idx]
    }
    return timeStr + randomStr
  }

  const generate = () => {
    const generators: Record<IdType, () => string> = {
      "uuid-v4": generateUUIDv4,
      "nanoid": generateNanoId,
      "ulid-like": generateULIDLike,
    }
    const gen = generators[idType]
    const safeCount = Math.min(Math.max(1, count), 100)
    setIds(Array.from({ length: safeCount }, () => gen()))
  }

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const copyAll = async () => {
    await navigator.clipboard.writeText(ids.join("\n"))
    setCopied("all")
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>UUID / ID Generator</CardTitle>
          <CardDescription>Generate cryptographically secure UUIDs (v4), NanoIDs, and ULID-like identifiers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <Label>ID Type</Label>
              <Select value={idType} onValueChange={(v) => setIdType(v as IdType)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uuid-v4">UUID v4</SelectItem>
                  <SelectItem value="nanoid">NanoID (21 chars)</SelectItem>
                  <SelectItem value="ulid-like">ULID-like</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Count</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                className="w-24"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={generate}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate
            </Button>
            {ids.length > 0 && (
              <>
                <Button variant="outline" onClick={copyAll}>
                  {copied === "all" ? <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
                  Copy All
                </Button>
                <Button variant="outline" onClick={() => setIds([])}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </>
            )}
          </div>

          {ids.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">{ids.length} IDs generated</Label>
              <div className="bg-muted rounded-lg divide-y divide-border max-h-96 overflow-auto">
                {ids.map((id, idx) => (
                  <div key={idx} className="flex items-center justify-between px-4 py-2 hover:bg-accent/50">
                    <span className="font-mono text-sm select-all">{id}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(id, String(idx))}
                    >
                      {copied === String(idx) ? <CheckCircle className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
