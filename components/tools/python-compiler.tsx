"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  Trash2,
  Download,
  Upload,
  Copy,
  Check,
  Loader2,
  Terminal,
  Code2,
  Zap,
  Clock,
  RotateCcw,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  BookOpen,
  Keyboard,
  RefreshCw,
  AlertCircle,
  GripHorizontal,
  X,
  PanelBottom,
} from "lucide-react"

// ─── Constants ────────────────────────────────────────────────────────

const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js"
const PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/"

const CODE_EXAMPLES: Record<string, { label: string; code: string }> = {
  input_demo: {
    label: "User Input Demo",
    code: `# 🎤 User Input Demo — Try entering inputs!
# Switch to the INPUT tab in the terminal panel below
# Enter one value per line before running

name = input("What is your name? ")
age = input("How old are you? ")
color = input("What is your favorite color? ")

print(f"\\nHello, {name}! 👋")
print(f"You are {age} years old.")
print(f"Your favorite color is {color}.")
print(f"\\nIn 10 years, you'll be {int(age) + 10} years old! 🎂")
`,
  },
  calculator: {
    label: "Input Calculator",
    code: `# 🧮 Simple Calculator with Input
print("=== Simple Calculator ===")
print("Operations: +, -, *, /")

a = float(input("Enter first number: "))
op = input("Enter operation (+, -, *, /): ")
b = float(input("Enter second number: "))

if op == "+":
    result = a + b
elif op == "-":
    result = a - b
elif op == "*":
    result = a * b
elif op == "/":
    result = a / b if b != 0 else "Error: Division by zero"
else:
    result = "Invalid operation"

print(f"\\n{a} {op} {b} = {result}")
`,
  },
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
  type: "stdout" | "stderr" | "system" | "input-echo" | "input-prompt"
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
  setStdin: (options: { stdin: () => string }) => void
  loadPackagesFromImports: (code: string) => Promise<void>
}

declare global {
  interface Window {
    loadPyodide?: (options?: Record<string, string>) => Promise<PyodideInterface>
  }
}

// ─── Main Component ──────────────────────────────────────────────────

export function PythonCompiler() {
  // ─── State ─────────────────────────────────────────────────────────
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
  const [stdinInput, setStdinInput] = useState("")
  const [retryCount, setRetryCount] = useState(0)

  // Panel state
  const [activePanel, setActivePanel] = useState<"terminal" | "input">("terminal")
  const [panelHeight, setPanelHeight] = useState(220)
  const [isPanelOpen, setIsPanelOpen] = useState(true)

  // Refs
  const pyodideRef = useRef<PyodideInterface | null>(null)
  const editorRef = useRef<unknown>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isResizing = useRef(false)
  const MonacoEditorRef = useRef<React.ComponentType<Record<string, unknown>> | null>(null)
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const [editorLoaded, setEditorLoaded] = useState(false)
  const [editorHeight, setEditorHeight] = useState(300)

  // ─── Theme ─────────────────────────────────────────────────────────
  const isDark = editorTheme === "vs-dark"

  // ─── Measure editor container for pixel-exact Monaco height ────────

  useEffect(() => {
    const el = editorContainerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = Math.floor(entry.contentRect.height)
        if (h > 0) setEditorHeight(h)
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

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

    async function initPyodide() {
      try {
        setPyodideStatus("loading")
        setLoadProgress(10)

        const existingScript = document.querySelector(`script[src="${PYODIDE_CDN}"]`)
        if (existingScript) existingScript.remove()

        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script")
          script.src = PYODIDE_CDN
          script.crossOrigin = "anonymous"
          script.onload = () => resolve()
          script.onerror = (e) => reject(new Error(`Failed to load Pyodide script from CDN: ${e}`))
          document.head.appendChild(script)
        })

        if (cancelled) return
        setLoadProgress(40)

        const loadPyodideFn = window.loadPyodide
        if (!loadPyodideFn) {
          throw new Error("window.loadPyodide is undefined after script loaded.")
        }

        setLoadProgress(50)

        const pyodide = await loadPyodideFn({
          indexURL: PYODIDE_INDEX_URL,
        })

        if (cancelled) return
        setLoadProgress(90)
        pyodideRef.current = pyodide
        setLoadProgress(100)
        setPyodideStatus("ready")
      } catch (err) {
        if (!cancelled) {
          console.error("Pyodide load error:", err)
          setPyodideStatus("error")
        }
      }
    }

    initPyodide()
    return () => { cancelled = true }
  }, [retryCount])

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

  // ─── Resize panel (mouse + touch) ─────────────────────────────────

  const handleResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    isResizing.current = true
    document.body.style.cursor = "row-resize"
    document.body.style.userSelect = "none"
  }, [])

  useEffect(() => {
    const getY = (e: MouseEvent | TouchEvent): number => {
      if ("touches" in e) return e.touches[0]?.clientY ?? 0
      return e.clientY
    }
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isResizing.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const statusBarH = 26
      const y = getY(e)
      const newHeight = rect.bottom - statusBarH - y
      setPanelHeight(Math.max(120, Math.min(newHeight, rect.height - 220)))
    }
    const handleEnd = () => {
      if (isResizing.current) {
        isResizing.current = false
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
      }
    }
    document.addEventListener("mousemove", handleMove)
    document.addEventListener("mouseup", handleEnd)
    document.addEventListener("touchmove", handleMove, { passive: false })
    document.addEventListener("touchend", handleEnd)
    return () => {
      document.removeEventListener("mousemove", handleMove)
      document.removeEventListener("mouseup", handleEnd)
      document.removeEventListener("touchmove", handleMove)
      document.removeEventListener("touchend", handleEnd)
    }
  }, [])

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
    setIsPanelOpen(true)
    setActivePanel("terminal")

    const startTime = performance.now()
    const lines: OutputLine[] = []

    lines.push({
      text: `\x1b[90m$ python script.py\x1b[0m`,
      type: "system",
      timestamp: Date.now(),
    })
    setOutput([...lines])

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

    const inputLines = stdinInput.trim() ? stdinInput.split("\n") : []
    let inputIndex = 0

    pyodide.setStdin({
      stdin: () => {
        if (inputIndex < inputLines.length) {
          const line = inputLines[inputIndex]
          inputIndex++
          lines.push({ text: `${line}`, type: "input-echo", timestamp: Date.now() })
          setOutput([...lines])
          return line
        }
        lines.push({
          text: "\u26a0 No input available — switch to the INPUT tab to add values, then re-run.",
          type: "input-prompt",
          timestamp: Date.now(),
        })
        setOutput([...lines])
        return "\n"
      },
    })

    try {
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
      text: `\n\u2713 Finished in ${executionTime.toFixed(0)}ms`,
      type: "system",
      timestamp: Date.now(),
    })
    setOutput([...lines])
    setStats({ executionTime, linesOfCode, outputLines })
    setIsRunning(false)
  }, [code, isRunning, stdinInput])

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

  const clearOutput = () => { setOutput([]); setStats(null) }

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
        if (typeof text === "string") setCode(text)
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

  const inputCount = stdinInput.trim() ? stdinInput.trim().split("\n").length : 0

  return (
    <div className={`w-full mx-auto ${isFullscreen ? "fixed inset-0 z-50" : "max-w-[1400px] px-2 py-3 sm:px-3 sm:py-4 md:px-4"}`}>
      <div
        ref={containerRef}
        className={`flex flex-col overflow-hidden shadow-2xl ${
          isFullscreen ? "rounded-none" : "rounded-xl"
        } ${
          isDark
            ? "bg-[#1e1e1e] ring-1 ring-[#3c3c3c]"
            : "bg-[#ffffff] ring-1 ring-[#d4d4d4]"
        }`}
        style={{
          height: isFullscreen ? "100vh" : "calc(100vh - 80px)",
          minHeight: "500px",
          maxHeight: isFullscreen ? undefined : "900px",
        }}
        role="region"
        aria-label="Python IDE"
      >

        {/* ───────── Title Bar ───────── */}
        <div
          className={`flex items-center justify-between px-3 py-[6px] select-none shrink-0 ${
            isDark
              ? "bg-[#323233] text-[#cccccc] border-b border-[#252526]"
              : "bg-[#dddddd] text-[#333333] border-b border-[#c8c8c8]"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex gap-[6px]" aria-hidden="true">
              <div className="w-[12px] h-[12px] rounded-full bg-[#ff5f57] hover:bg-[#ff5f57]/80 transition-colors" />
              <div className="w-[12px] h-[12px] rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 transition-colors" />
              <div className="w-[12px] h-[12px] rounded-full bg-[#28c840] hover:bg-[#28c840]/80 transition-colors" />
            </div>
            <span className="text-[11px] font-medium tracking-wide">
              script.py — Python Compiler
            </span>
            <span className={`text-[10px] ${isDark ? "text-[#666]" : "text-[#999]"}`}>
              by zamdev
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Engine Status (compact) */}
            {pyodideStatus === "loading" && (
              <div className={`flex items-center gap-1 text-[10px] ${isDark ? "text-[#888]" : "text-[#666]"}`}>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span className="hidden sm:inline">Loading engine ({loadProgress}%)</span>
              </div>
            )}
            {pyodideStatus === "ready" && (
              <div className="flex items-center gap-1 text-[10px] text-[#28c840]">
                <Zap className="h-3 w-3" />
                <span className="hidden sm:inline">Ready</span>
              </div>
            )}
            {pyodideStatus === "error" && (
              <button
                className="flex items-center gap-1 text-[10px] text-[#f14c4c] hover:text-[#ff6b6b] transition-colors"
                onClick={() => { setPyodideStatus("loading"); setLoadProgress(0); setRetryCount(c => c + 1) }}
              >
                <RefreshCw className="h-3 w-3" />
                <span>Retry</span>
              </button>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`p-1 rounded transition-colors ${
                      isDark ? "hover:bg-[#505050]" : "hover:bg-[#c8c8c8]"
                    }`}
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  >
                    {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* ───────── Loading Progress Bar ───────── */}
        {pyodideStatus === "loading" && (
          <div className={`h-[3px] shrink-0 ${isDark ? "bg-[#252526]" : "bg-[#e0e0e0]"}`}>
            <div
              className="h-full bg-[#007acc] transition-all duration-500 ease-out"
              style={{ width: `${loadProgress}%` }}
              role="progressbar"
              aria-valuenow={loadProgress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        )}

        {/* ───────── Toolbar ───────── */}
        <div
          className={`flex flex-wrap items-center gap-1 px-2 py-[5px] shrink-0 border-b ${
            isDark
              ? "bg-[#252526] border-[#1e1e1e] text-[#cccccc]"
              : "bg-[#f3f3f3] border-[#e0e0e0] text-[#333333]"
          }`}
          role="toolbar"
          aria-label="Editor toolbar"
        >
          {/* Run */}
          <Button
            onClick={runCode}
            disabled={pyodideStatus !== "ready" || isRunning}
            className="gap-1.5 bg-[#28a745] hover:bg-[#22863a] text-white h-[28px] text-[11px] px-3 font-medium shadow-sm border-0"
            size="sm"
            aria-label={isRunning ? "Code is running" : "Run Python code (Ctrl+Enter)"}
          >
            {isRunning ? (
              <><Loader2 className="h-3 w-3 animate-spin" />Running</>
            ) : (
              <><Play className="h-3 w-3" />Run</>
            )}
          </Button>

          <div className={`h-4 w-px mx-0.5 ${isDark ? "bg-[#3c3c3c]" : "bg-[#d0d0d0]"}`} />

          {/* Examples */}
          <Select onValueChange={loadExample}>
            <SelectTrigger
              className={`w-[130px] sm:w-[150px] h-[28px] text-[11px] border ${
                isDark
                  ? "bg-[#3c3c3c] border-[#3c3c3c] text-[#cccccc] hover:bg-[#454545]"
                  : "bg-white border-[#d0d0d0] text-[#333] hover:bg-[#f0f0f0]"
              }`}
              aria-label="Load code example"
            >
              <BookOpen className="h-3 w-3 mr-1 shrink-0" />
              <SelectValue placeholder="Examples" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CODE_EXAMPLES).map(([key, ex]) => (
                <SelectItem key={key} value={key} className="text-[11px]">{ex.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className={`h-4 w-px mx-0.5 ${isDark ? "bg-[#3c3c3c]" : "bg-[#d0d0d0]"}`} />

          {/* File Actions */}
          <TooltipProvider delayDuration={300}>
            <div className="flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={uploadCode} className={`p-[5px] rounded transition-colors ${isDark ? "hover:bg-[#3c3c3c]" : "hover:bg-[#e0e0e0]"}`} aria-label="Upload .py file">
                    <Upload className="h-[14px] w-[14px]" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Upload .py</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={downloadCode} className={`p-[5px] rounded transition-colors ${isDark ? "hover:bg-[#3c3c3c]" : "hover:bg-[#e0e0e0]"}`} aria-label="Download .py file">
                    <Download className="h-[14px] w-[14px]" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Download .py</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={resetCode} className={`p-[5px] rounded transition-colors ${isDark ? "hover:bg-[#3c3c3c]" : "hover:bg-[#e0e0e0]"}`} aria-label="Reset to default code">
                    <RotateCcw className="h-[14px] w-[14px]" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Reset</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          <div className="flex-1" />

          {/* Font Size */}
          <div className="hidden sm:flex items-center gap-1">
            <span className={`text-[10px] ${isDark ? "text-[#888]" : "text-[#999]"}`}>Font:</span>
            <Select value={String(fontSize)} onValueChange={(v) => setFontSize(Number(v))}>
              <SelectTrigger
                className={`w-[52px] h-[24px] text-[10px] border ${
                  isDark
                    ? "bg-[#3c3c3c] border-[#3c3c3c] text-[#ccc]"
                    : "bg-white border-[#d0d0d0] text-[#333]"
                }`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[12, 13, 14, 15, 16, 18, 20].map((s) => (
                  <SelectItem key={s} value={String(s)} className="text-[11px]">{s}px</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Theme */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={`p-[5px] rounded transition-colors ${isDark ? "hover:bg-[#3c3c3c]" : "hover:bg-[#e0e0e0]"}`}
                  onClick={() => setEditorTheme(isDark ? "light" : "vs-dark")}
                  aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
                >
                  {isDark ? <Sun className="h-[14px] w-[14px]" /> : <Moon className="h-[14px] w-[14px]" />}
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Toggle Theme</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Shortcut Hint */}
          <div className={`hidden md:flex items-center gap-[3px] text-[10px] ml-1 ${isDark ? "text-[#666]" : "text-[#aaa]"}`}>
            <kbd className={`px-[4px] py-[1px] rounded text-[9px] font-mono border ${isDark ? "border-[#555] bg-[#333]" : "border-[#ccc] bg-[#eee]"}`}>Ctrl</kbd>
            <span>+</span>
            <kbd className={`px-[4px] py-[1px] rounded text-[9px] font-mono border ${isDark ? "border-[#555] bg-[#333]" : "border-[#ccc] bg-[#eee]"}`}>Enter</kbd>
          </div>
        </div>

        {/* ───────── Main Content ───────── */}
        <div className="flex-1 flex flex-col min-h-0">

          {/* ─── Editor Tab Bar ─── */}
          <div
            className={`flex items-center shrink-0 ${
              isDark
                ? "bg-[#252526] border-b border-[#1e1e1e]"
                : "bg-[#ececec] border-b border-[#d4d4d4]"
            }`}
          >
            {/* Active tab */}
            <div
              className={`flex items-center gap-1.5 px-3 py-[5px] text-[11px] border-t-[2px] border-t-transparent ${
                isDark
                  ? "bg-[#1e1e1e] text-[#ffffff] border-r border-r-[#252526]"
                  : "bg-[#ffffff] text-[#333333] border-r border-r-[#e0e0e0]"
              }`}
              style={{ borderTopColor: "#007acc" }}
            >
              <Code2 className="h-3 w-3 text-[#519aba] shrink-0" />
              <span className="font-medium">script.py</span>
            </div>
            <div className="flex-1" />
            <span className={`text-[10px] pr-3 ${isDark ? "text-[#555]" : "text-[#aaa]"}`}>
              Python 3.11 &middot; Pyodide
            </span>
          </div>

          {/* ─── Monaco Editor ─── */}
          <div
            ref={editorContainerRef}
            className={`flex-1 min-h-0 overflow-hidden ${isDark ? "bg-[#1e1e1e]" : "bg-white"}`}
            role="region"
            aria-label="Python code editor"
          >
            {editorLoaded && MonacoEditor ? (
              <MonacoEditor
                height={editorHeight}
                defaultLanguage="python"
                value={code}
                onChange={(value: unknown) => setCode(typeof value === "string" ? value : "")}
                theme={editorTheme}
                onMount={(editor: unknown) => { editorRef.current = editor }}
                options={{
                  fontSize,
                  fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', Consolas, monospace",
                  fontLigatures: true,
                  minimap: { enabled: typeof window !== "undefined" && window.innerWidth > 1024 },
                  scrollBeyondLastLine: false,
                  lineHeight: 22,
                  renderLineHighlight: "all" as const,
                  smoothScrolling: true,
                  cursorBlinking: "smooth" as const,
                  cursorSmoothCaretAnimation: "on" as const,
                  bracketPairColorization: { enabled: true },
                  autoClosingBrackets: "always" as const,
                  autoClosingQuotes: "always" as const,
                  automaticLayout: true,
                  suggest: { showKeywords: true, showSnippets: true },
                  wordWrap: "on" as const,
                  tabSize: 4,
                  insertSpaces: true,
                  lineNumbers: typeof window !== "undefined" && window.innerWidth < 640 ? "off" as const : "on" as const,
                  folding: typeof window !== "undefined" && window.innerWidth >= 640,
                  glyphMargin: false,
                  lineDecorationsWidth: typeof window !== "undefined" && window.innerWidth < 640 ? 0 : 10,
                  renderWhitespace: "selection" as const,
                  guides: {
                    indentation: true,
                    bracketPairs: true,
                  },
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full" role="status">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className={`h-5 w-5 animate-spin ${isDark ? "text-[#555]" : "text-[#ccc]"}`} />
                  <p className={`text-[11px] ${isDark ? "text-[#555]" : "text-[#aaa]"}`}>Loading editor...</p>
                </div>
              </div>
            )}
          </div>

          {/* ─── Resize Handle ─── */}
          {isPanelOpen && (
            <div
              className={`h-[4px] shrink-0 cursor-row-resize group relative transition-colors ${
                isDark
                  ? "bg-[#252526] hover:bg-[#007acc]"
                  : "bg-[#e0e0e0] hover:bg-[#007acc]"
              }`}
              onMouseDown={handleResizeStart}
              onTouchStart={handleResizeStart}
              role="separator"
              aria-orientation="horizontal"
              aria-label="Resize terminal panel"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp") { e.preventDefault(); setPanelHeight(h => Math.min(h + 20, 600)) }
                if (e.key === "ArrowDown") { e.preventDefault(); setPanelHeight(h => Math.max(h - 20, 120)) }
              }}
            >
              <div className="absolute inset-x-0 -top-1 -bottom-1" /> {/* larger hit target */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripHorizontal className="h-3 w-3 text-white" />
              </div>
            </div>
          )}

          {/* ─── Terminal Panel ─── */}
          {isPanelOpen && (
            <div
              className={`flex flex-col shrink-0 ${isDark ? "bg-[#1e1e1e]" : "bg-[#f8f8f8]"}`}
              style={{ height: panelHeight }}
            >
              {/* Panel Tab Bar */}
              <div
                className={`flex items-center justify-between shrink-0 border-t ${
                  isDark
                    ? "bg-[#252526] border-[#1e1e1e]"
                    : "bg-[#f3f3f3] border-[#e0e0e0]"
                }`}
              >
                <div className="flex">
                  <button
                    className={`px-3 py-[4px] text-[11px] uppercase tracking-[0.5px] font-medium border-b-[2px] transition-colors ${
                      activePanel === "terminal"
                        ? `${isDark ? "text-[#e0e0e0]" : "text-[#333]"} border-b-[#007acc]`
                        : `${isDark ? "text-[#888] hover:text-[#bbb]" : "text-[#888] hover:text-[#555]"} border-b-transparent`
                    }`}
                    onClick={() => setActivePanel("terminal")}
                    aria-selected={activePanel === "terminal"}
                    role="tab"
                  >
                    <span className="flex items-center gap-1.5">
                      <Terminal className="h-3 w-3" />
                      Terminal
                      {output.length > 0 && (
                        <span className={`text-[9px] px-[5px] py-[1px] rounded-full font-normal ${isDark ? "bg-[#3c3c3c] text-[#aaa]" : "bg-[#ddd] text-[#666]"}`}>
                          {output.filter(l => l.type !== "system").length}
                        </span>
                      )}
                    </span>
                  </button>
                  <button
                    className={`px-3 py-[4px] text-[11px] uppercase tracking-[0.5px] font-medium border-b-[2px] transition-colors ${
                      activePanel === "input"
                        ? `${isDark ? "text-[#e0e0e0]" : "text-[#333]"} border-b-[#007acc]`
                        : `${isDark ? "text-[#888] hover:text-[#bbb]" : "text-[#888] hover:text-[#555]"} border-b-transparent`
                    }`}
                    onClick={() => setActivePanel("input")}
                    aria-selected={activePanel === "input"}
                    role="tab"
                  >
                    <span className="flex items-center gap-1.5">
                      <Keyboard className="h-3 w-3" />
                      Input
                      {inputCount > 0 && (
                        <span className="text-[9px] px-[5px] py-[1px] rounded-full bg-[#007acc] text-white font-normal">
                          {inputCount}
                        </span>
                      )}
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-0 pr-1">
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={`p-[4px] rounded transition-colors ${isDark ? "hover:bg-[#3c3c3c] text-[#888]" : "hover:bg-[#ddd] text-[#999]"}`}
                          onClick={copyOutput}
                          disabled={output.length === 0}
                          aria-label="Copy output"
                        >
                          {copied ? <Check className="h-3 w-3 text-[#28c840]" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">Copy Output</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={`p-[4px] rounded transition-colors ${isDark ? "hover:bg-[#3c3c3c] text-[#888]" : "hover:bg-[#ddd] text-[#999]"}`}
                          onClick={clearOutput}
                          disabled={output.length === 0}
                          aria-label="Clear terminal"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">Clear</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={`p-[4px] rounded transition-colors ${isDark ? "hover:bg-[#3c3c3c] text-[#888]" : "hover:bg-[#ddd] text-[#999]"}`}
                          onClick={() => setIsPanelOpen(false)}
                          aria-label="Close panel"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">Close Panel</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Panel Content */}
              <div className="flex-1 min-h-0 relative">
                {activePanel === "terminal" ? (
                  <div
                    ref={outputRef}
                    className={`absolute inset-0 overflow-auto px-3 py-2 font-mono leading-[1.65] ${
                      isDark ? "bg-[#1e1e1e]" : "bg-[#f8f8f8]"
                    }`}
                    style={{ fontSize: Math.max(fontSize - 2, 11) }}
                    role="log"
                    aria-live="polite"
                    aria-label="Program output"
                    tabIndex={0}
                  >
                    {output.length === 0 && !isRunning ? (
                      <div className="flex items-center h-full justify-center">
                        <div className={`text-center ${isDark ? "text-[#444]" : "text-[#bbb]"}`}>
                          <Terminal className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-[12px]">
                            Press <strong className={isDark ? "text-[#666]" : "text-[#999]"}>Run</strong> or{" "}
                            <kbd className={`px-1 py-0.5 rounded text-[10px] font-mono border ${isDark ? "border-[#444] bg-[#2a2a2a]" : "border-[#ddd] bg-[#eee]"}`}>Ctrl+Enter</kbd>
                            {" "}to execute
                          </p>
                          <p className="text-[10px] mt-1 opacity-60">Output will appear here</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {output.map((line, i) => (
                          <div key={i} className="whitespace-pre-wrap break-words min-h-[1.65em]">
                            {line.type === "stderr" ? (
                              <span className="text-[#f14c4c]">{line.text}</span>
                            ) : line.type === "system" ? (
                              <span className={isDark ? "text-[#555] italic" : "text-[#aaa] italic"}>{line.text}</span>
                            ) : line.type === "input-echo" ? (
                              <span className="text-[#3dc9b0]">
                                <span className={isDark ? "text-[#555]" : "text-[#aaa]"}>{"›"} </span>
                                {line.text}
                              </span>
                            ) : line.type === "input-prompt" ? (
                              <span className="text-[#cca700]">{line.text}</span>
                            ) : (
                              <span className={isDark ? "text-[#d4d4d4]" : "text-[#1e1e1e]"}>{line.text}</span>
                            )}
                          </div>
                        ))}
                        {isRunning && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-block w-[6px] h-[14px] bg-[#007acc] animate-pulse" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div className={`absolute inset-0 overflow-auto p-3 flex flex-col gap-2.5 ${isDark ? "bg-[#1e1e1e]" : "bg-[#f8f8f8]"}`}>
                    <div className={`flex items-start gap-2 text-[11px] ${isDark ? "text-[#888]" : "text-[#666]"}`}>
                      <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-[1px] text-[#007acc]" />
                      <div>
                        <p>
                          Pre-fill values for <code className={`px-1 py-[1px] rounded text-[10px] ${isDark ? "bg-[#007acc]/15 text-[#3dc9b0]" : "bg-[#007acc]/10 text-[#007acc]"}`}>input()</code> calls.
                          One value per line, consumed in order when the program runs.
                        </p>
                        {inputCount > 0 && (
                          <p className="mt-1 text-[#28c840]">
                            {inputCount} input{inputCount > 1 ? "s" : ""} ready
                          </p>
                        )}
                      </div>
                    </div>
                    <textarea
                      value={stdinInput}
                      onChange={(e) => setStdinInput(e.target.value)}
                      placeholder={"Alice\n25\nBlue"}
                      className={`flex-1 w-full px-3 py-2 rounded font-mono text-[12px] leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-[#007acc] transition-colors ${
                        isDark
                          ? "bg-[#0d1117] text-[#d4d4d4] placeholder:text-[#333] border border-[#30363d]"
                          : "bg-white text-[#333] placeholder:text-[#ccc] border border-[#d0d0d0]"
                      }`}
                      spellCheck={false}
                      aria-label="Standard input values"
                    />
                  </div>
                )}
              </div>

              {/* Stats Bar */}
              {stats && activePanel === "terminal" && (
                <div
                  className={`flex items-center gap-4 px-3 py-[3px] shrink-0 border-t text-[10px] font-mono ${
                    isDark
                      ? "border-[#252526] text-[#555] bg-[#1e1e1e]"
                      : "border-[#e0e0e0] text-[#aaa] bg-[#f8f8f8]"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Clock className="h-[10px] w-[10px]" />
                    {stats.executionTime.toFixed(0)}ms
                  </span>
                  <span className="flex items-center gap-1">
                    <Code2 className="h-[10px] w-[10px]" />
                    {stats.linesOfCode} lines
                  </span>
                  <span className="flex items-center gap-1">
                    <Terminal className="h-[10px] w-[10px]" />
                    {stats.outputLines} output
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ───────── Status Bar ───────── */}
        <div
          className={`flex items-center justify-between px-3 py-[3px] shrink-0 text-[11px] text-white select-none ${
            pyodideStatus === "error"
              ? "bg-[#cc6633]"
              : isRunning
                ? "bg-[#89632a]"
                : "bg-[#007acc]"
          }`}
        >
          <div className="flex items-center gap-3">
            {pyodideStatus === "ready" && !isRunning && (
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Ready
              </span>
            )}
            {pyodideStatus === "ready" && isRunning && (
              <span className="flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Running...
              </span>
            )}
            {pyodideStatus === "loading" && (
              <span className="flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading Engine...
              </span>
            )}
            {pyodideStatus === "error" && (
              <span className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Engine Error
              </span>
            )}
            {!isPanelOpen && (
              <button
                className="flex items-center gap-1 hover:opacity-80 transition-opacity ml-1"
                onClick={() => setIsPanelOpen(true)}
                aria-label="Show terminal panel"
              >
                <PanelBottom className="h-3 w-3" />
                <span className="hidden sm:inline">Terminal</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">100% Client-Side</span>
            <span>Python 3.11</span>
            <span className="hidden sm:inline">UTF-8</span>
            <span className="hidden md:inline">Pyodide WASM</span>
          </div>
        </div>
      </div>
    </div>
  )
}
