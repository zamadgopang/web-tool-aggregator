"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Play,
  Square,
  Trash2,
  Download,
  Upload,
  Copy,
  Check,
  Loader2,
  Terminal,
  Code2,
  Cpu,
  Zap,
  Clock,
  FileText,
  RotateCcw,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  ChevronDown,
  Package,
  BookOpen,
} from "lucide-react"

// ─── Constants ────────────────────────────────────────────────────────

const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js"

const CODE_EXAMPLES: Record<string, { label: string; code: string }> = {
  hello: {
    label: "Hello World",
    code: `# 👋 Hello World — Your first Python program
print("Hello, World!")
print("Welcome to the Online Python Compiler!")
print(f"Built with ❤️ by zamdev — runs entirely in your browser 🚀")
`,
  },
  fibonacci: {
    label: "Fibonacci Sequence",
    code: `# 📐 Fibonacci Sequence Generator
def fibonacci(n):
    """Generate first n Fibonacci numbers."""
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    return fib[:n]

n = 15
sequence = fibonacci(n)
print(f"First {n} Fibonacci numbers:")
print(sequence)
print(f"\\nThe {n}th Fibonacci number is: {sequence[-1]}")
`,
  },
  sorting: {
    label: "Sorting Algorithms",
    code: `# 🔄 Sorting Algorithm Comparison
import time

def bubble_sort(arr):
    arr = arr.copy()
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

import random
data = [random.randint(1, 1000) for _ in range(500)]

start = time.time()
bubble_sort(data)
bubble_time = time.time() - start

start = time.time()
quick_sort(data)
quick_time = time.time() - start

print("📊 Sorting Algorithm Comparison (500 elements)")
print(f"{'─' * 40}")
print(f"Bubble Sort: {bubble_time:.4f}s")
print(f"Quick Sort:  {quick_time:.4f}s")
print(f"Quick Sort is {bubble_time/quick_time:.1f}x faster!")
`,
  },
  classes: {
    label: "Classes & OOP",
    code: `# 🏗️ Object-Oriented Programming
from dataclasses import dataclass
from typing import List

@dataclass
class Student:
    name: str
    grades: List[int]

    @property
    def average(self) -> float:
        return sum(self.grades) / len(self.grades) if self.grades else 0

    @property
    def letter_grade(self) -> str:
        avg = self.average
        if avg >= 90: return "A"
        elif avg >= 80: return "B"
        elif avg >= 70: return "C"
        elif avg >= 60: return "D"
        else: return "F"

    def __str__(self):
        return f"{self.name}: {self.average:.1f}% ({self.letter_grade})"

class Classroom:
    def __init__(self, name: str):
        self.name = name
        self.students: List[Student] = []

    def add_student(self, student: Student):
        self.students.append(student)

    def top_performer(self) -> Student:
        return max(self.students, key=lambda s: s.average)

    def class_average(self) -> float:
        return sum(s.average for s in self.students) / len(self.students)

# Create classroom
cs101 = Classroom("CS 101")
cs101.add_student(Student("Alice", [95, 88, 92, 97]))
cs101.add_student(Student("Bob", [78, 85, 72, 80]))
cs101.add_student(Student("Charlie", [92, 95, 98, 94]))
cs101.add_student(Student("Diana", [65, 70, 75, 68]))

print(f"📚 {cs101.name} — Grade Report")
print(f"{'═' * 35}")
for student in cs101.students:
    print(f"  {student}")
print(f"{'═' * 35}")
print(f"  Class Average: {cs101.class_average():.1f}%")
print(f"  🏆 Top Performer: {cs101.top_performer().name}")
`,
  },
  math: {
    label: "Math & Statistics",
    code: `# 📈 Math & Statistics
import math
import statistics
import random

# Generate random dataset
random.seed(42)
data = [random.gauss(100, 15) for _ in range(1000)]

print("📊 Statistical Analysis of 1000 Samples")
print(f"{'─' * 42}")
print(f"  Mean:               {statistics.mean(data):.2f}")
print(f"  Median:             {statistics.median(data):.2f}")
print(f"  Std Deviation:      {statistics.stdev(data):.2f}")
print(f"  Variance:           {statistics.variance(data):.2f}")
print(f"  Min:                {min(data):.2f}")
print(f"  Max:                {max(data):.2f}")
print(f"  Range:              {max(data) - min(data):.2f}")

# Distribution
buckets = {}
for v in data:
    bucket = int(v // 10) * 10
    buckets[bucket] = buckets.get(bucket, 0) + 1

print(f"\\n📊 Distribution Histogram:")
for k in sorted(buckets.keys()):
    bar = "█" * (buckets[k] // 5)
    print(f"  {k:3d}-{k+9:3d} | {bar} ({buckets[k]})")

# Fun math
print(f"\\n🔢 Fun Math Facts:")
print(f"  π = {math.pi:.10f}")
print(f"  e = {math.e:.10f}")
print(f"  Golden ratio φ = {(1 + math.sqrt(5)) / 2:.10f}")
print(f"  20! = {math.factorial(20):,}")
`,
  },
  games: {
    label: "Text Game",
    code: `# 🎮 Mini Text Adventure (Automated Demo)
import random

class Character:
    def __init__(self, name, hp, attack):
        self.name = name
        self.hp = hp
        self.max_hp = hp
        self.attack = attack

    def is_alive(self):
        return self.hp > 0

    def take_damage(self, dmg):
        self.hp = max(0, self.hp - dmg)

    def health_bar(self):
        filled = int((self.hp / self.max_hp) * 20)
        bar = "█" * filled + "░" * (20 - filled)
        return f"[{bar}] {self.hp}/{self.max_hp}"

def battle(hero, monster):
    print(f"\\n⚔️  {hero.name} vs {monster.name}!")
    print(f"{'─' * 40}")
    round_num = 0
    while hero.is_alive() and monster.is_alive():
        round_num += 1
        # Hero attacks
        dmg = random.randint(hero.attack - 3, hero.attack + 5)
        monster.take_damage(dmg)
        print(f"  Round {round_num}: {hero.name} deals {dmg} damage!")
        print(f"    {monster.name}: {monster.health_bar()}")
        if not monster.is_alive():
            print(f"\\n  🎉 {hero.name} wins!")
            return True
        # Monster attacks
        dmg = random.randint(monster.attack - 2, monster.attack + 3)
        hero.take_damage(dmg)
        print(f"    {monster.name} strikes back for {dmg}!")
        print(f"    {hero.name}: {hero.health_bar()}")
    print(f"\\n  💀 {hero.name} was defeated...")
    return False

random.seed(42)
hero = Character("🧙 Wizard", 100, 18)
monsters = [
    Character("🐺 Wolf", 30, 8),
    Character("👹 Goblin", 50, 12),
    Character("🐉 Dragon", 80, 20),
]

print("═" * 40)
print("    ⚔️  DUNGEON CRAWLER ⚔️")
print("═" * 40)

for monster in monsters:
    if not hero.is_alive():
        break
    battle(hero, monster)
    if hero.is_alive():
        heal = random.randint(10, 25)
        hero.hp = min(hero.max_hp, hero.hp + heal)
        print(f"  💊 {hero.name} heals for {heal}HP → {hero.health_bar()}")

if hero.is_alive():
    print(f"\\n🏆 {hero.name} conquered the dungeon!")
else:
    print(f"\\n💀 Game Over")
`,
  },
  comprehensions: {
    label: "List Comprehensions",
    code: `# 🧩 Python Comprehensions & Generators
import math

# List comprehensions
squares = [x**2 for x in range(1, 11)]
print(f"Squares: {squares}")

evens = [x for x in range(1, 21) if x % 2 == 0]
print(f"Evens:   {evens}")

# Dictionary comprehension
ascii_map = {chr(i): i for i in range(65, 91)}
print(f"\\nASCII Map A-Z:")
for char, code in ascii_map.items():
    print(f"  {char} → {code}", end="  ")
    if (code - 64) % 9 == 0:
        print()

# Set comprehension
primes = {x for x in range(2, 50) if all(x % d != 0 for d in range(2, int(math.sqrt(x))+1))}
print(f"\\n\\nPrimes under 50: {sorted(primes)}")

# Generator expression
total = sum(x**2 for x in range(1, 101))
print(f"\\nSum of squares 1-100: {total}")

# Nested comprehension — multiplication table
print(f"\\n📋 Multiplication Table (1-5):")
table = [[f"{i*j:4d}" for j in range(1, 6)] for i in range(1, 6)]
for row in table:
    print("  " + " ".join(row))
`,
  },
}

const DEFAULT_CODE_KEY = "hello"

// ─── Types ────────────────────────────────────────────────────────────

interface OutputLine {
  text: string
  type: "stdout" | "stderr" | "system" | "input"
  timestamp: number
}

interface ExecutionStats {
  executionTime: number
  linesOfCode: number
  outputLines: number
}

// ─── Pyodide Type ─────────────────────────────────────────────────────

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>
  setStdout: (options: { batched: (text: string) => void }) => void
  setStderr: (options: { batched: (text: string) => void }) => void
  loadPackagesFromImports: (code: string) => Promise<void>
}

declare global {
  interface Window {
    loadPyodide?: (options?: Record<string, string>) => Promise<PyodideInterface>
  }
}

// ─── Main Component ──────────────────────────────────────────────────

export function PythonCompiler() {
  const [code, setCode] = useState(CODE_EXAMPLES[DEFAULT_CODE_KEY].code)
  const [output, setOutput] = useState<OutputLine[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [pyodideStatus, setPyodideStatus] = useState<"loading" | "ready" | "error">("loading")
  const [loadProgress, setLoadProgress] = useState(0)
  const [copied, setCopied] = useState(false)
  const [editorTheme, setEditorTheme] = useState<"vs-dark" | "light">("vs-dark")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [stats, setStats] = useState<ExecutionStats | null>(null)
  const [fontSize, setFontSize] = useState(14)

  const pyodideRef = useRef<PyodideInterface | null>(null)
  const editorRef = useRef<unknown>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const MonacoEditorRef = useRef<React.ComponentType<Record<string, unknown>> | null>(null)
  const [editorLoaded, setEditorLoaded] = useState(false)

  // ─── Load Monaco Editor dynamically ────────────────────────────────

  useEffect(() => {
    let cancelled = false
    import("@monaco-editor/react").then((mod) => {
      if (!cancelled) {
        MonacoEditorRef.current = mod.default
        setEditorLoaded(true)
      }
    })
    return () => { cancelled = true }
  }, [])

  // ─── Load Pyodide ──────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false

    async function loadPyodide() {
      try {
        setLoadProgress(10)

        // Load script
        if (!document.querySelector(`script[src="${PYODIDE_CDN}"]`)) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script")
            script.src = PYODIDE_CDN
            script.onload = () => resolve()
            script.onerror = () => reject(new Error("Failed to load Pyodide script"))
            document.head.appendChild(script)
          })
        }

        if (cancelled) return
        setLoadProgress(40)

        // Initialize Pyodide
        if (window.loadPyodide) {
          const pyodide = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
          })
          if (cancelled) return
          setLoadProgress(90)

          pyodideRef.current = pyodide
          setLoadProgress(100)
          setPyodideStatus("ready")
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Pyodide load error:", err)
          setPyodideStatus("error")
        }
      }
    }

    loadPyodide()
    return () => { cancelled = true }
  }, [])

  // ─── Auto-scroll output ────────────────────────────────────────────

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  // ─── Progress simulation ──────────────────────────────────────────

  useEffect(() => {
    if (pyodideStatus !== "loading" || loadProgress >= 90) return
    const interval = setInterval(() => {
      setLoadProgress((p) => Math.min(p + 2, 85))
    }, 300)
    return () => clearInterval(interval)
  }, [pyodideStatus, loadProgress])

  // ─── Run Code ──────────────────────────────────────────────────────

  const runCode = useCallback(async () => {
    if (!pyodideRef.current || isRunning) return

    const pyodide = pyodideRef.current
    const currentCode = typeof (editorRef.current as { getValue?: () => string })?.getValue === "function"
      ? (editorRef.current as { getValue: () => string }).getValue()
      : code

    setIsRunning(true)
    setOutput([])
    setStats(null)

    const startTime = performance.now()
    const lines: OutputLine[] = []

    lines.push({
      text: `▶ Running Python...`,
      type: "system",
      timestamp: Date.now(),
    })
    setOutput([...lines])

    // Redirect stdout/stderr
    pyodide.setStdout({
      batched: (text: string) => {
        lines.push({ text, type: "stdout", timestamp: Date.now() })
        setOutput([...lines])
      },
    })
    pyodide.setStderr({
      batched: (text: string) => {
        lines.push({ text, type: "stderr", timestamp: Date.now() })
        setOutput([...lines])
      },
    })

    try {
      // Auto-install packages from imports
      await pyodide.loadPackagesFromImports(currentCode)
      await pyodide.runPythonAsync(currentCode)
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err)
      lines.push({ text: errMsg, type: "stderr", timestamp: Date.now() })
      setOutput([...lines])
    }

    const executionTime = performance.now() - startTime
    const linesOfCode = currentCode.split("\n").filter((l: string) => l.trim() && !l.trim().startsWith("#")).length
    const outputLines = lines.filter((l) => l.type !== "system").length

    lines.push({
      text: `\n✓ Finished in ${executionTime.toFixed(0)}ms`,
      type: "system",
      timestamp: Date.now(),
    })
    setOutput([...lines])
    setStats({ executionTime, linesOfCode, outputLines })
    setIsRunning(false)
  }, [code, isRunning])

  // ─── Keyboard shortcut ─────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault()
        runCode()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [runCode])

  // ─── Actions ───────────────────────────────────────────────────────

  const clearOutput = () => {
    setOutput([])
    setStats(null)
  }

  const copyOutput = async () => {
    const text = output.map((l) => l.text).join("\n")
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadCode = () => {
    const currentCode = typeof (editorRef.current as { getValue?: () => string })?.getValue === "function"
      ? (editorRef.current as { getValue: () => string }).getValue()
      : code
    const blob = new Blob([currentCode], { type: "text/x-python" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "script.py"
    a.click()
    URL.revokeObjectURL(url)
  }

  const uploadCode = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".py,.pyw,.txt"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        const text = ev.target?.result
        if (typeof text === "string") {
          setCode(text)
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const loadExample = (key: string) => {
    if (CODE_EXAMPLES[key]) {
      setCode(CODE_EXAMPLES[key].code)
      setOutput([])
      setStats(null)
    }
  }

  const resetCode = () => {
    setCode(CODE_EXAMPLES[DEFAULT_CODE_KEY].code)
    setOutput([])
    setStats(null)
  }

  // ─── Render ────────────────────────────────────────────────────────

  const MonacoEditor = MonacoEditorRef.current

  return (
    <div className={`w-full mx-auto ${isFullscreen ? "fixed inset-0 z-50 bg-background p-2 sm:p-4" : "max-w-[1400px] px-3 py-4 sm:p-4"}`}>
      <Card className="overflow-hidden border-2 border-border/50 shadow-xl">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-emerald-500/5 via-green-500/10 to-teal-500/5 border-b px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 ring-1 ring-emerald-500/20" aria-hidden="true">
                  <Code2 className="h-6 w-6 text-emerald-500" />
                </div>
                {pyodideStatus === "ready" && (
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-background" />
                )}
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2 flex-wrap">
                  Python Compiler
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]">
                    by zamdev
                  </Badge>
                </CardTitle>
                <CardDescription className="mt-0.5">
                  Write and run Python code directly in your browser — built by zamdev
                </CardDescription>
              </div>
            </div>

            {/* Status + Fullscreen */}
            <div className="flex items-center gap-2">
              {pyodideStatus === "loading" && (
                <Badge variant="outline" className="gap-1.5 text-xs animate-pulse">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading Engine...
                </Badge>
              )}
              {pyodideStatus === "ready" && (
                <Badge variant="outline" className="gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                  <Zap className="h-3 w-3" />
                  Ready
                </Badge>
              )}
              {pyodideStatus === "error" && (
                <Badge variant="destructive" className="gap-1.5 text-xs">
                  Engine Failed
                </Badge>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                    >
                      {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Loading Progress Bar */}
          {pyodideStatus === "loading" && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5 animate-pulse" />
                  Initializing zamdev Python Engine...
                </span>
                <span className="font-mono text-emerald-500">{loadProgress}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 ease-out"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                First load downloads ~15MB of the Python runtime. Subsequent runs will be instant.
              </p>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 sm:px-4 border-b bg-muted/30">
            {/* Run Button */}
            <Button
              onClick={runCode}
              disabled={pyodideStatus !== "ready" || isRunning}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 font-medium"
              size="sm"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  Run Code
                </>
              )}
            </Button>

            <div className="h-5 w-px bg-border hidden sm:block" />

            {/* Examples Dropdown */}
            <Select onValueChange={loadExample}>
              <SelectTrigger className="w-[160px] h-8 text-xs">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" />
                  <SelectValue placeholder="Examples" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CODE_EXAMPLES).map(([key, ex]) => (
                  <SelectItem key={key} value={key} className="text-xs">
                    {ex.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="h-5 w-px bg-border hidden sm:block" />

            {/* Action Buttons */}
            <TooltipProvider>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={uploadCode}>
                      <Upload className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Upload .py file</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={downloadCode}>
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Download script.py</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={resetCode}>
                      <RotateCcw className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reset to default</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Font size */}
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground">Font:</span>
              <Select value={String(fontSize)} onValueChange={(v) => setFontSize(Number(v))}>
                <SelectTrigger className="w-[65px] h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[12, 13, 14, 15, 16, 18, 20].map((s) => (
                    <SelectItem key={s} value={String(s)} className="text-xs">{s}px</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Theme Toggle */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setEditorTheme(editorTheme === "vs-dark" ? "light" : "vs-dark")}
                  >
                    {editorTheme === "vs-dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle editor theme</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Keyboard Shortcut Hint */}
            <div className="hidden md:flex items-center gap-1 text-[11px] text-muted-foreground">
              <kbd className="px-1.5 py-0.5 rounded border bg-muted text-[10px] font-mono">Ctrl</kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 rounded border bg-muted text-[10px] font-mono">Enter</kbd>
              <span className="ml-1">to run</span>
            </div>
          </div>

          {/* Editor + Output Split */}
          <div className={`grid ${isFullscreen ? "grid-rows-[1fr_1fr] lg:grid-cols-[1fr_1fr] lg:grid-rows-1" : "grid-rows-[1fr] lg:grid-cols-[1fr_1fr]"}`} style={{ minHeight: isFullscreen ? "calc(100vh - 200px)" : "500px" }}>
            {/* Code Editor Panel */}
            <div className="relative border-b lg:border-b-0 lg:border-r flex flex-col">
              {/* Editor Header */}
              <div className="flex items-center justify-between px-3 py-1.5 border-b bg-muted/20">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5" aria-hidden="true">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                  </div>
                  <span className="text-xs text-muted-foreground font-mono flex items-center gap-1.5">
                    <FileText className="h-3 w-3" />
                    script.py
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">
                  Python 3.11 · zamdev
                </span>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1 min-h-[250px]">
                {editorLoaded && MonacoEditor ? (
                  <MonacoEditor
                    height="100%"
                    defaultLanguage="python"
                    value={code}
                    onChange={(value: unknown) => setCode(typeof value === "string" ? value : "")}
                    theme={editorTheme}
                    onMount={(editor: unknown) => { editorRef.current = editor }}
                    options={{
                      fontSize,
                      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
                      fontLigatures: true,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      padding: { top: 12, bottom: 12 },
                      lineHeight: 1.6,
                      renderLineHighlight: "all" as const,
                      smoothScrolling: true,
                      cursorBlinking: "smooth" as const,
                      cursorSmoothCaretAnimation: "on" as const,
                      bracketPairColorization: { enabled: true },
                      autoClosingBrackets: "always" as const,
                      autoClosingQuotes: "always" as const,
                      suggest: {
                        showKeywords: true,
                        showSnippets: true,
                      },
                      wordWrap: "on" as const,
                      tabSize: 4,
                      insertSpaces: true,
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <p className="text-sm">Loading editor...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Output Panel */}
            <div className="flex flex-col bg-[#0d1117] dark:bg-[#0d1117] min-h-[250px]">
              {/* Output Header */}
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800 bg-[#161b22]">
                <div className="flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-xs text-zinc-400 font-mono">Output</span>
                  {output.length > 0 && (
                    <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 text-[10px] h-4 px-1.5 border-zinc-700">
                      {output.filter((l) => l.type !== "system").length} lines
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                          onClick={copyOutput}
                          disabled={output.length === 0}
                        >
                          {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copy output</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                          onClick={clearOutput}
                          disabled={output.length === 0}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Clear output</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Output Content */}
              <div
                ref={outputRef}
                className="flex-1 overflow-auto p-3 sm:p-4 font-mono text-sm leading-relaxed"
                style={{ fontSize: Math.max(fontSize - 1, 12) }}
              >
                {output.length === 0 && !isRunning && (
                  <div className="flex flex-col items-center justify-center h-full text-zinc-600 gap-3">
                    <div className="relative">
                      <Terminal className="h-10 w-10 text-zinc-700" />
                      <Play className="h-4 w-4 text-emerald-500/60 absolute -bottom-1 -right-1" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-zinc-500">Click <strong className="text-zinc-400">Run Code</strong> or press <kbd className="px-1 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-400">Ctrl+Enter</kbd></p>
                      <p className="text-xs text-zinc-600 mt-1">Output will appear here</p>
                    </div>
                  </div>
                )}

                {output.map((line, i) => (
                  <div key={i} className="whitespace-pre-wrap break-words">
                    {line.type === "stderr" ? (
                      <span className="text-red-400">{line.text}</span>
                    ) : line.type === "system" ? (
                      <span className="text-zinc-500 italic">{line.text}</span>
                    ) : (
                      <span className="text-emerald-300">{line.text}</span>
                    )}
                  </div>
                ))}

                {isRunning && (
                  <div className="flex items-center gap-2 mt-1">
                    <Loader2 className="h-3 w-3 animate-spin text-emerald-400" />
                    <span className="text-zinc-500 text-xs">Executing...</span>
                  </div>
                )}
              </div>

              {/* Stats Bar */}
              {stats && (
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 px-3 py-2 border-t border-zinc-800 bg-[#161b22] text-[11px] text-zinc-500 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-emerald-500/60" />
                    {stats.executionTime.toFixed(0)}ms
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Code2 className="h-3 w-3 text-blue-500/60" />
                    {stats.linesOfCode} lines
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Terminal className="h-3 w-3 text-amber-500/60" />
                    {stats.outputLines} output
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Feature Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 px-4 py-3 border-t bg-muted/20 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-emerald-500" />
              100% Client-Side
            </span>
            <span className="flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5 text-blue-500" />
              Python 3.11 + stdlib
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              Built by zamdev
            </span>
            <span className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-purple-500" />
              Upload & Download .py
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
