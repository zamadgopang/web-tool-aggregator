"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import type { OutputLine } from "@/components/python-compiler/output-panel"

const PYODIDE_VERSION = "0.26.4"
const PYODIDE_CDNS = [
  `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full`,
  `https://pyodide-cdn2.iodide.io/v${PYODIDE_VERSION}/full`,
]
const LOAD_TIMEOUT_MS = 180_000 // 3 minutes max

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>
  setStdout: (options: { batched: (text: string) => void }) => void
  setStderr: (options: { batched: (text: string) => void }) => void
  setStdin: (options: { stdin: () => string }) => void
  globals: {
    set: (key: string, value: unknown) => void
  }
}

declare global {
  interface Window {
    loadPyodide: (config?: { indexURL?: string }) => Promise<PyodideInterface>
    __pyodideInstance?: PyodideInterface
    __pyodideLoading?: Promise<PyodideInterface>
  }
}

export interface InputHistoryEntry {
  prompt: string
  value: string
}

function cleanupPyodideScript() {
  const existing = document.getElementById("pyodide-script")
  if (existing) existing.remove()
  delete (window as unknown as Record<string, unknown>).loadPyodide
}

// Inject preconnect / prefetch hints so the browser starts DNS + TLS early
function injectPreloadHints() {
  if (typeof document === "undefined") return
  if (document.getElementById("pyodide-preconnect")) return

  const preconnect = document.createElement("link")
  preconnect.id = "pyodide-preconnect"
  preconnect.rel = "preconnect"
  preconnect.href = "https://cdn.jsdelivr.net"
  preconnect.crossOrigin = "anonymous"
  document.head.appendChild(preconnect)

  const prefetch = document.createElement("link")
  prefetch.rel = "prefetch"
  prefetch.href = `${PYODIDE_CDNS[0]}/pyodide.js`
  prefetch.as = "script"
  document.head.appendChild(prefetch)
}

// ---------------------------------------------------------------------------
// Global singleton — survives component re-mounts and route navigations so
// Pyodide is only downloaded once per browser session.
// ---------------------------------------------------------------------------
function loadPyodideGlobal(
  onProgress: (p: number) => void,
): Promise<PyodideInterface> {
  // Already initialised from a previous mount
  if (window.__pyodideInstance) {
    onProgress(100)
    return Promise.resolve(window.__pyodideInstance)
  }

  // Another hook instance already kicked off the download — piggyback
  if (window.__pyodideLoading) {
    let fake = 30
    const iv = setInterval(() => {
      fake = Math.min(90, fake + (90 - fake) * 0.05)
      onProgress(Math.round(fake))
    }, 400)
    return window.__pyodideLoading
      .then((py) => { clearInterval(iv); onProgress(100); return py })
      .catch((e) => { clearInterval(iv); throw e })
  }

  // Fresh load with CDN fallback
  window.__pyodideLoading = (async () => {
    let lastError: Error | null = null

    for (const cdnUrl of PYODIDE_CDNS) {
      try {
        cleanupPyodideScript()
        onProgress(10)

        const script = document.createElement("script")
        script.id = "pyodide-script"
        script.src = `${cdnUrl}/pyodide.js`
        script.async = true
        script.crossOrigin = "anonymous"
        document.head.appendChild(script)

        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve()
          script.onerror = () => {
            script.remove()
            reject(new Error(`Failed to load Pyodide script from ${cdnUrl}`))
          }
        })

        onProgress(30)

        let fake = 30
        const iv = setInterval(() => {
          fake = Math.min(85, fake + (85 - fake) * 0.04)
          onProgress(Math.round(fake))
        }, 500)

        try {
          const pyodide = await window.loadPyodide({ indexURL: cdnUrl })
          clearInterval(iv)
          window.__pyodideInstance = pyodide
          onProgress(100)
          return pyodide
        } catch (initErr) {
          clearInterval(iv)
          cleanupPyodideScript()
          throw initErr
        }
      } catch (cdnErr) {
        lastError = cdnErr instanceof Error ? cdnErr : new Error(String(cdnErr))
        console.warn(`Pyodide CDN failed (${cdnUrl}):`, lastError.message)
      }
    }

    window.__pyodideLoading = undefined
    throw lastError ?? new Error("All CDN sources failed. Check your internet connection.")
  })()

  return window.__pyodideLoading
}

export function usePythonRunner() {
  const [isReady, setIsReady] = useState(() =>
    typeof window !== "undefined" && !!window.__pyodideInstance,
  )
  const [isRunning, setIsRunning] = useState(false)
  const [isWaitingForInput, setIsWaitingForInput] = useState(false)
  const [inputPrompt, setInputPrompt] = useState("")
  const [output, setOutput] = useState<OutputLine[]>(() =>
    typeof window !== "undefined" && window.__pyodideInstance
      ? [{ type: "system", content: "Python environment ready. You can now run your code." }]
      : [],
  )
  const [executionTime, setExecutionTime] = useState<number | undefined>()
  const [loadingProgress, setLoadingProgress] = useState(() =>
    typeof window !== "undefined" && window.__pyodideInstance ? 100 : 0,
  )
  const [inputHistory, setInputHistory] = useState<InputHistoryEntry[]>([])
  const [loadError, setLoadError] = useState(false)

  const pyodideRef = useRef<PyodideInterface | null>(
    typeof window !== "undefined" ? (window.__pyodideInstance ?? null) : null,
  )
  const abortRef = useRef(false)
  const inputResolveRef = useRef<((value: string) => void) | null>(null)
  const outputLinesRef = useRef<OutputLine[]>([])
  const loadingRef = useRef(false)

  // Core loader — used by both initial mount and retry
  const startLoad = useCallback(async () => {
    if (pyodideRef.current || loadingRef.current) return
    loadingRef.current = true

    let timeoutId: ReturnType<typeof setTimeout> | undefined

    try {
      setLoadError(false)
      setLoadingProgress(5)
      setOutput([])

      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(
          () => reject(new Error("Loading timed out. This can happen on slow connections. Please try again.")),
          LOAD_TIMEOUT_MS,
        )
      })

      const pyodide = await Promise.race([
        loadPyodideGlobal((p) => setLoadingProgress(p)),
        timeoutPromise,
      ])

      pyodideRef.current = pyodide
      setLoadingProgress(100)
      setIsReady(true)
      setOutput([{ type: "system", content: "Python environment ready. You can now run your code." }])
    } catch (error) {
      console.error("Failed to load Pyodide:", error)
      const message = error instanceof Error ? error.message : "Unknown error"
      setLoadingProgress(0)
      setLoadError(true)
      cleanupPyodideScript()
      setOutput([{
        type: "error",
        content: `Failed to load Python environment: ${message}\n\nClick "Retry" below or refresh the page to try again.`,
      }])
    } finally {
      if (timeoutId) clearTimeout(timeoutId)
      loadingRef.current = false
    }
  }, [])

  // Deferred loading: inject preload hints immediately, then wait until
  // the browser is idle before starting the heavy Pyodide download.
  useEffect(() => {
    if (pyodideRef.current) return // global singleton already ready

    injectPreloadHints()

    if (typeof requestIdleCallback === "function") {
      const id = requestIdleCallback(() => startLoad(), { timeout: 2000 })
      return () => cancelIdleCallback(id)
    }
    // Fallback: short delay so the first paint completes
    const timer = setTimeout(startLoad, 150)
    return () => clearTimeout(timer)
  }, [startLoad])

  const retryLoad = useCallback(() => {
    if (loadingRef.current || pyodideRef.current) return
    // Reset the global promise so a fresh attempt is made
    window.__pyodideLoading = undefined
    setLoadError(false)
    setIsReady(false)
    startLoad()
  }, [startLoad])

  // Submit input value
  const submitInput = useCallback((value: string) => {
    if (inputResolveRef.current) {
      setInputHistory(prev => [...prev, { prompt: inputPrompt, value }])

      const inputLine: OutputLine = { type: "input", content: `${inputPrompt}${value}` }
      outputLinesRef.current.push(inputLine)
      setOutput([...outputLinesRef.current])

      inputResolveRef.current(value)
      inputResolveRef.current = null
      setIsWaitingForInput(false)
      setInputPrompt("")
    }
  }, [inputPrompt])

  // Run code with input handling
  const runCodeWithInput = useCallback(async (code: string, startTime: number) => {
    if (!pyodideRef.current) return

    const inputMatches = code.match(/input\s*\([^)]*\)/g) || []
    const inputPrompts: string[] = []

    for (const match of inputMatches) {
      const promptMatch = match.match(/input\s*\(\s*["'](.*)["']\s*\)/)
      inputPrompts.push(promptMatch ? promptMatch[1] : "")
    }

    if (inputPrompts.length > 0) {
      const collectedInputs: string[] = []

      for (let i = 0; i < inputPrompts.length; i++) {
        if (abortRef.current) return

        setInputPrompt(inputPrompts[i])
        setIsWaitingForInput(true)

        const inputValue = await new Promise<string>((resolve) => {
          inputResolveRef.current = resolve
        })

        collectedInputs.push(inputValue)
      }

      const inputCode = `
_collected_inputs = ${JSON.stringify(collectedInputs)}
_input_idx = 0

def input(prompt=""):
    global _input_idx
    if prompt:
        print(prompt, end="")
    if _input_idx < len(_collected_inputs):
        result = _collected_inputs[_input_idx]
        _input_idx += 1
        print(result)
        return result
    return ""

${code}
`
      await pyodideRef.current.runPythonAsync(inputCode)
    }

    const endTime = performance.now()
    setExecutionTime(Math.round(endTime - startTime))

    if (outputLinesRef.current.length === 0) {
      setOutput([{ type: "system", content: "Code executed successfully with no output." }])
    }
  }, [])

  const runCode = useCallback(async (code: string) => {
    if (!pyodideRef.current || isRunning) return

    setIsRunning(true)
    setOutput([])
    setExecutionTime(undefined)
    setInputHistory([])
    abortRef.current = false
    outputLinesRef.current = []

    const startTime = performance.now()

    try {
      pyodideRef.current.setStdout({
        batched: (text: string) => {
          if (abortRef.current) return
          const line: OutputLine = { type: "output", content: text }
          outputLinesRef.current.push(line)
          setOutput([...outputLinesRef.current])
        }
      })

      pyodideRef.current.setStderr({
        batched: (text: string) => {
          if (abortRef.current) return
          const line: OutputLine = { type: "error", content: text }
          outputLinesRef.current.push(line)
          setOutput([...outputLinesRef.current])
        }
      })

      const usesInput = /\binput\s*\(/.test(code)

      if (usesInput) {
        await runCodeWithInput(code, startTime)
      } else {
        await pyodideRef.current.runPythonAsync(code)

        const endTime = performance.now()
        setExecutionTime(Math.round(endTime - startTime))

        if (outputLinesRef.current.length === 0) {
          setOutput([{ type: "system", content: "Code executed successfully with no output." }])
        }
      }
    } catch (error) {
      if (!abortRef.current) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        setOutput([...outputLinesRef.current, { type: "error", content: errorMessage }])
      }
    } finally {
      setIsRunning(false)
      setIsWaitingForInput(false)
    }
  }, [isRunning, runCodeWithInput])

  const stopExecution = useCallback(() => {
    abortRef.current = true
    setIsRunning(false)
    setIsWaitingForInput(false)
    inputResolveRef.current = null
    setOutput(prev => [...prev, { type: "system", content: "Execution stopped by user." }])
  }, [])

  const clearOutput = useCallback(() => {
    setOutput([])
    setExecutionTime(undefined)
    setInputHistory([])
  }, [])

  return {
    isReady,
    isRunning,
    isWaitingForInput,
    inputPrompt,
    output,
    executionTime,
    loadingProgress,
    loadError,
    inputHistory,
    runCode,
    stopExecution,
    clearOutput,
    submitInput,
    retryLoad,
  }
}
