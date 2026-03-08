"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, CheckCircle, ArrowRightLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const timezones = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Kolkata",
  "Asia/Dubai",
  "Australia/Sydney",
  "Pacific/Auckland",
]

export function TimestampConverter() {
  const [unixTimestamp, setUnixTimestamp] = useState("")
  const [humanDate, setHumanDate] = useState("")
  const [timezone, setTimezone] = useState("UTC")
  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000))
  const [copied, setCopied] = useState<string | null>(null)
  const [convertedFromUnix, setConvertedFromUnix] = useState<string | null>(null)
  const [convertedToUnix, setConvertedToUnix] = useState<number | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const unixToHuman = () => {
    const ts = parseInt(unixTimestamp, 10)
    if (isNaN(ts)) return

    // Handle both seconds and milliseconds
    const msTimestamp = ts > 9999999999 ? ts : ts * 1000
    const date = new Date(msTimestamp)

    if (isNaN(date.getTime())) return

    const formatted = date.toLocaleString("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZoneName: "short",
    })
    setConvertedFromUnix(formatted)
  }

  const humanToUnix = () => {
    if (!humanDate) return
    const date = new Date(humanDate)
    if (isNaN(date.getTime())) return
    setConvertedToUnix(Math.floor(date.getTime() / 1000))
  }

  const getRelativeTime = (ts: number): string => {
    const now = Date.now() / 1000
    const diff = now - ts
    const absDiff = Math.abs(diff)
    const suffix = diff > 0 ? "ago" : "from now"

    if (absDiff < 60) return `${Math.floor(absDiff)} seconds ${suffix}`
    if (absDiff < 3600) return `${Math.floor(absDiff / 60)} minutes ${suffix}`
    if (absDiff < 86400) return `${Math.floor(absDiff / 3600)} hours ${suffix}`
    if (absDiff < 2592000) return `${Math.floor(absDiff / 86400)} days ${suffix}`
    if (absDiff < 31536000) return `${Math.floor(absDiff / 2592000)} months ${suffix}`
    return `${Math.floor(absDiff / 31536000)} years ${suffix}`
  }

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const currentISO = new Date(currentTimestamp * 1000).toISOString()

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Unix Timestamp Converter</CardTitle>
          <CardDescription>Convert between Unix timestamps and human-readable dates with timezone support.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Time */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <Label className="text-sm text-muted-foreground">Current Unix Timestamp</Label>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-mono font-bold">{currentTimestamp}</span>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(String(currentTimestamp), "current")}>
                {copied === "current" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground font-mono">{currentISO}</p>
          </div>

          {/* Timezone Selector */}
          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Unix to Human */}
          <div className="space-y-3 p-4 border rounded-lg">
            <Label className="text-base font-semibold">Unix Timestamp → Human Date</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="e.g. 1700000000"
                value={unixTimestamp}
                onChange={(e) => setUnixTimestamp(e.target.value)}
                className="font-mono"
              />
              <Button onClick={unixToHuman}>
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Convert
              </Button>
            </div>
            {unixTimestamp && !isNaN(parseInt(unixTimestamp)) && (
              <p className="text-sm text-muted-foreground">
                {getRelativeTime(parseInt(unixTimestamp) > 9999999999 ? parseInt(unixTimestamp) / 1000 : parseInt(unixTimestamp))}
              </p>
            )}
            {convertedFromUnix && (
              <div className="flex items-center gap-2 bg-muted p-3 rounded-lg">
                <span className="font-mono text-sm flex-1">{convertedFromUnix}</span>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(convertedFromUnix, "fromUnix")}>
                  {copied === "fromUnix" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            )}
          </div>

          {/* Human to Unix */}
          <div className="space-y-3 p-4 border rounded-lg">
            <Label className="text-base font-semibold">Human Date → Unix Timestamp</Label>
            <div className="flex gap-2">
              <Input
                type="datetime-local"
                value={humanDate}
                onChange={(e) => setHumanDate(e.target.value)}
                className="font-mono"
              />
              <Button onClick={humanToUnix}>
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Convert
              </Button>
            </div>
            {convertedToUnix !== null && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 bg-muted p-3 rounded-lg">
                  <span className="font-mono text-sm flex-1">Seconds: {convertedToUnix}</span>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(String(convertedToUnix), "toUnixS")}>
                    {copied === "toUnixS" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex items-center gap-2 bg-muted p-3 rounded-lg">
                  <span className="font-mono text-sm flex-1">Milliseconds: {convertedToUnix * 1000}</span>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(String(convertedToUnix * 1000), "toUnixMs")}>
                    {copied === "toUnixMs" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex items-center gap-2 bg-muted p-3 rounded-lg">
                  <span className="font-mono text-sm flex-1">ISO 8601: {new Date(convertedToUnix * 1000).toISOString()}</span>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(new Date(convertedToUnix * 1000).toISOString(), "toISO")}>
                    {copied === "toISO" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
