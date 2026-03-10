"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Copy, CheckCircle, AlertCircle, ShieldCheck, ShieldAlert } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface DecodedJWT {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
}

export function JWTDecoder() {
  const [input, setInput] = useState("")
  const [decoded, setDecoded] = useState<DecodedJWT | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copiedSection, setCopiedSection] = useState<string | null>(null)

  const base64UrlDecode = (str: string): string => {
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/")
    const pad = base64.length % 4
    if (pad) {
      base64 += "=".repeat(4 - pad)
    }
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    )
  }

  const decodeJWT = () => {
    setError(null)
    setDecoded(null)

    const token = input.trim()
    if (!token) {
      setError("Please enter a JWT token")
      return
    }

    const parts = token.split(".")
    if (parts.length !== 3) {
      setError("Invalid JWT format. A JWT must have 3 parts separated by dots (header.payload.signature)")
      return
    }

    try {
      const header = JSON.parse(base64UrlDecode(parts[0]))
      const payload = JSON.parse(base64UrlDecode(parts[1]))
      const signature = parts[2]

      setDecoded({ header, payload, signature })
    } catch {
      setError("Failed to decode JWT. The token appears to be malformed.")
    }
  }

  const isExpired = (): boolean | null => {
    if (!decoded?.payload?.exp) return null
    return Date.now() / 1000 > (decoded.payload.exp as number)
  }

  const formatTimestamp = (ts: number): string => {
    return new Date(ts * 1000).toLocaleString()
  }

  const getTimeUntilExpiry = (): string | null => {
    if (!decoded?.payload?.exp) return null
    const diff = (decoded.payload.exp as number) - Date.now() / 1000
    if (diff <= 0) return "Expired"
    const hours = Math.floor(diff / 3600)
    const minutes = Math.floor((diff % 3600) / 60)
    const seconds = Math.floor(diff % 60)
    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days}d ${hours % 24}h ${minutes}m`
    }
    return `${hours}h ${minutes}m ${seconds}s`
  }

  const copyToClipboard = async (text: string, section: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  const expired = isExpired()
  const timeUntil = getTimeUntilExpiry()

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>JWT Decoder</CardTitle>
          <CardDescription>Decode and inspect JSON Web Tokens — view header, payload, expiry, and claims.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="jwt-input">JWT Token</Label>
            <Textarea
              id="jwt-input"
              placeholder="Paste your JWT token here (eyJhbGciOiJIUzI1NiIs...)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={4}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={decodeJWT}>Decode Token</Button>
            <Button variant="outline" onClick={() => { setInput(""); setDecoded(null); setError(null) }}>Clear</Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {decoded && (
            <div className="space-y-4">
              {/* Expiry Status */}
              {expired !== null && (
                <Alert variant={expired ? "destructive" : "default"}>
                  {expired ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                  <AlertTitle>{expired ? "Token Expired" : "Token Valid"}</AlertTitle>
                  <AlertDescription>
                    {expired
                      ? `This token expired on ${formatTimestamp(decoded.payload.exp as number)}`
                      : `Expires in ${timeUntil} (${formatTimestamp(decoded.payload.exp as number)})`}
                  </AlertDescription>
                </Alert>
              )}

              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Header</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(JSON.stringify(decoded.header, null, 2), "header")}
                  >
                    {copiedSection === "header" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <pre className="bg-muted p-4 rounded-lg text-sm font-mono overflow-auto max-h-48">
                  {JSON.stringify(decoded.header, null, 2)}
                </pre>
                <div className="flex gap-2 flex-wrap">
                  {decoded.header.alg ? <Badge variant="secondary">Algorithm: {String(decoded.header.alg)}</Badge> : null}
                  {decoded.header.typ ? <Badge variant="secondary">Type: {String(decoded.header.typ)}</Badge> : null}
                </div>
              </div>

              {/* Payload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Payload</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(JSON.stringify(decoded.payload, null, 2), "payload")}
                  >
                    {copiedSection === "payload" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <pre className="bg-muted p-4 rounded-lg text-sm font-mono overflow-auto max-h-64">
                  {JSON.stringify(decoded.payload, null, 2)}
                </pre>
                <div className="flex gap-2 flex-wrap">
                  {decoded.payload.iss ? <Badge variant="outline">Issuer: {String(decoded.payload.iss)}</Badge> : null}
                  {decoded.payload.sub ? <Badge variant="outline">Subject: {String(decoded.payload.sub)}</Badge> : null}
                  {decoded.payload.aud ? <Badge variant="outline">Audience: {String(decoded.payload.aud)}</Badge> : null}
                  {decoded.payload.iat ? <Badge variant="outline">Issued: {formatTimestamp(decoded.payload.iat as number)}</Badge> : null}
                  {decoded.payload.exp ? <Badge variant="outline">Expires: {formatTimestamp(decoded.payload.exp as number)}</Badge> : null}
                </div>
              </div>

              {/* Signature */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Signature</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(decoded.signature, "signature")}
                  >
                    {copiedSection === "signature" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <pre className="bg-muted p-4 rounded-lg text-sm font-mono overflow-auto break-all">
                  {decoded.signature}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
