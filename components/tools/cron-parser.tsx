"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

interface CronField {
  name: string
  min: number
  max: number
  labels?: string[]
}

const CRON_FIELDS: CronField[] = [
  { name: "Minute", min: 0, max: 59 },
  { name: "Hour", min: 0, max: 23 },
  { name: "Day of Month", min: 1, max: 31 },
  { name: "Month", min: 1, max: 12, labels: ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] },
  { name: "Day of Week", min: 0, max: 6, labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] },
]

function describeCronField(field: string, meta: CronField): string {
  if (field === "*") return `every ${meta.name.toLowerCase()}`
  if (field.includes("/")) {
    const [, step] = field.split("/")
    return `every ${step} ${meta.name.toLowerCase()}(s)`
  }
  if (field.includes(",")) {
    const parts = field.split(",").map((p) => formatFieldValue(p.trim(), meta))
    return `at ${meta.name.toLowerCase()} ${parts.join(", ")}`
  }
  if (field.includes("-")) {
    const [start, end] = field.split("-")
    return `${meta.name.toLowerCase()} ${formatFieldValue(start, meta)} through ${formatFieldValue(end, meta)}`
  }
  return `at ${meta.name.toLowerCase()} ${formatFieldValue(field, meta)}`
}

function formatFieldValue(val: string, meta: CronField): string {
  const num = parseInt(val, 10)
  if (meta.labels && !isNaN(num) && meta.labels[num]) {
    return meta.labels[num]
  }
  return val
}

function describeCron(expression: string): string {
  const parts = expression.trim().split(/\s+/)
  if (parts.length !== 5) return "Invalid cron expression (expected 5 fields)"

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts

  // Common patterns
  if (expression === "* * * * *") return "Every minute"
  if (minute !== "*" && hour === "*" && dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
    return `Every hour at minute ${minute}`
  }
  if (minute !== "*" && hour !== "*" && dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
    return `Every day at ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`
  }
  if (minute !== "*" && hour !== "*" && dayOfMonth === "*" && month === "*" && dayOfWeek !== "*") {
    const daysStr = dayOfWeek.split(",").map((d) => formatFieldValue(d, CRON_FIELDS[4])).join(", ")
    return `At ${hour.padStart(2, "0")}:${minute.padStart(2, "0")} on ${daysStr}`
  }

  const descriptions = parts.map((part, i) => describeCronField(part, CRON_FIELDS[i]))
  return descriptions.filter((d) => !d.startsWith("every")).join(", ") || descriptions.join(", ")
}

function getNextRuns(expression: string, count: number): Date[] {
  const parts = expression.trim().split(/\s+/)
  if (parts.length !== 5) return []

  const runs: Date[] = []
  const now = new Date()
  const candidate = new Date(now)
  candidate.setSeconds(0, 0)
  candidate.setMinutes(candidate.getMinutes() + 1)

  const maxIterations = 525600 // 1 year of minutes
  let iterations = 0

  while (runs.length < count && iterations < maxIterations) {
    if (matchesCron(candidate, parts)) {
      runs.push(new Date(candidate))
    }
    candidate.setMinutes(candidate.getMinutes() + 1)
    iterations++
  }

  return runs
}

function matchesCron(date: Date, parts: string[]): boolean {
  const values = [
    date.getMinutes(),
    date.getHours(),
    date.getDate(),
    date.getMonth() + 1,
    date.getDay(),
  ]

  return parts.every((part, i) => matchesField(values[i], part, CRON_FIELDS[i]))
}

function matchesField(value: number, field: string, meta: CronField): boolean {
  if (field === "*") return true

  return field.split(",").some((segment) => {
    if (segment.includes("/")) {
      const [range, stepStr] = segment.split("/")
      const step = parseInt(stepStr, 10)
      const start = range === "*" ? meta.min : parseInt(range, 10)
      if (isNaN(step) || isNaN(start)) return false
      return value >= start && (value - start) % step === 0
    }
    if (segment.includes("-")) {
      const [startStr, endStr] = segment.split("-")
      const start = parseInt(startStr, 10)
      const end = parseInt(endStr, 10)
      return value >= start && value <= end
    }
    return value === parseInt(segment, 10)
  })
}

const PRESETS = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Every day at midnight", value: "0 0 * * *" },
  { label: "Every day at noon", value: "0 12 * * *" },
  { label: "Every Monday at 9 AM", value: "0 9 * * 1" },
  { label: "Every weekday at 8 AM", value: "0 8 * * 1-5" },
  { label: "Every 15 minutes", value: "*/15 * * * *" },
  { label: "First of every month", value: "0 0 1 * *" },
  { label: "Every Sunday at 2 AM", value: "0 2 * * 0" },
]

export function CronParser() {
  const [expression, setExpression] = useState("0 9 * * 1-5")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const validate = (expr: string): boolean => {
    const parts = expr.trim().split(/\s+/)
    if (parts.length !== 5) return false
    return parts.every((part, i) => {
      return part.split(",").every((segment) => {
        const stepMatch = segment.match(/^(\*|\d+(-\d+)?)\/(\d+)$/)
        if (stepMatch) return true
        const rangeMatch = segment.match(/^(\d+)-(\d+)$/)
        if (rangeMatch) {
          const start = parseInt(rangeMatch[1], 10)
          const end = parseInt(rangeMatch[2], 10)
          return start >= CRON_FIELDS[i].min && end <= CRON_FIELDS[i].max && start <= end
        }
        if (segment === "*") return true
        const num = parseInt(segment, 10)
        return !isNaN(num) && num >= CRON_FIELDS[i].min && num <= CRON_FIELDS[i].max
      })
    })
  }

  const isValid = validate(expression)
  const description = isValid ? describeCron(expression) : null
  const nextRuns = isValid ? getNextRuns(expression, 10) : []

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(expression)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Cron Expression Parser</CardTitle>
          <CardDescription>Parse cron expressions into human-readable schedules and see the next run times.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cron-input">Cron Expression</Label>
            <div className="flex gap-2">
              <Input
                id="cron-input"
                value={expression}
                onChange={(e) => { setExpression(e.target.value); setError(null) }}
                placeholder="* * * * *"
                className="font-mono text-lg"
              />
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex gap-2 text-xs text-muted-foreground font-mono">
              <span className="flex-1 text-center">Minute</span>
              <span className="flex-1 text-center">Hour</span>
              <span className="flex-1 text-center">Day (M)</span>
              <span className="flex-1 text-center">Month</span>
              <span className="flex-1 text-center">Day (W)</span>
            </div>
          </div>

          {/* Presets */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Quick Presets</Label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <Button
                  key={preset.value}
                  variant={expression === preset.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setExpression(preset.value)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Description */}
          {isValid && description && (
            <div className="bg-muted p-4 rounded-lg">
              <Label className="text-sm text-muted-foreground">Schedule Description</Label>
              <p className="text-lg font-semibold mt-1">{description}</p>
            </div>
          )}

          {!isValid && expression.trim() && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Invalid Expression</AlertTitle>
              <AlertDescription>Please enter a valid cron expression with 5 space-separated fields.</AlertDescription>
            </Alert>
          )}

          {/* Next Runs */}
          {nextRuns.length > 0 && (
            <div className="space-y-2">
              <Label className="text-base font-semibold">Next 10 Scheduled Runs</Label>
              <div className="bg-muted rounded-lg divide-y divide-border">
                {nextRuns.map((date, idx) => (
                  <div key={idx} className="flex items-center justify-between px-4 py-2 font-mono text-sm">
                    <span className="text-muted-foreground w-6">{idx + 1}.</span>
                    <span className="flex-1">{date.toLocaleString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })}</span>
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
