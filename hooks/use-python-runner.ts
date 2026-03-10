"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import type { OutputLine } from "@/components/python-compiler/output-panel"

const PYODIDE_VERSION = "0.27.4"
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full`
const LOAD_TIMEOUT_MS = 120_000 // 2 minutes max

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
  }
}

export interface InputHistoryEntry {
  prompt: string
  value: string
}

export function usePythonRunner() {
  const [isReady, setIsReady] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [isWaitingForInput, setIsWaitingForInput] = useState(false)
  const [inputPrompt, setInputPrompt] = useState("")
  const [output, setOutput] = useState<OutputLine[]>([])
  const [executionTime, setExecutionTime] = useState<number | undefined>()
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [inputHistory, setInputHistory] = useState<InputHistoryEntry[]>([])
  
  const pyodideRef = useRef<PyodideInterface | null>(null)
  const abortRef = useRef(false)
  const inputResolveRef = useRef<((value: string) => void) | null>(null)
  const outputLinesRef = useRef<OutputLine[]>([])
  
  // Load Pyodide on mount
  useEffect(() => {
    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    
    const loadPyodide = async () => {
      try {
        setLoadingProgress(5)
        
        // Set up a timeout for the entire loading process
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(
            () => reject(new Error("Loading timed out. Please refresh the page to try again.")),
            LOAD_TIMEOUT_MS
          )
        })
        
        const doLoad = async () => {
          // Load Pyodide script
          if (!document.getElementById("pyodide-script")) {
            setLoadingProgress(10)
            const script = document.createElement("script")
            script.id = "pyodide-script"
            script.src = `${PYODIDE_CDN}/pyodide.js`
            script.async = true
            script.crossOrigin = "anonymous"
            document.head.appendChild(script)
            
            await new Promise<void>((resolve, reject) => {
              script.onload = () => resolve()
              script.onerror = () => {
                script.remove()
                reject(new Error("Failed to load Pyodide script from CDN. Check your internet connection."))
              }
            })
          }
          
          if (cancelled) return
          setLoadingProgress(30)
          
          // Simulate progress while WASM downloads (the real bottleneck)
          let fakeProgress = 30
          const progressInterval = setInterval(() => {
            if (cancelled) { clearInterval(progressInterval); return }
            // Gradually increase from 30 to 85 during WASM download
            fakeProgress = Math.min(85, fakeProgress + (85 - fakeProgress) * 0.04)
            setLoadingProgress(Math.round(fakeProgress))
          }, 500)
          
          try {
            // Initialize Pyodide with explicit indexURL
            const pyodide = await window.loadPyodide({
              indexURL: PYODIDE_CDN,
            })
            
            clearInterval(progressInterval)
            
            if (cancelled) return
            
            pyodideRef.current = pyodide
            setLoadingProgress(100)
            setIsReady(true)
            
            setOutput([{
              type: "system",
              content: "Python environment ready. You can now run your code."
            }])
          } catch (initError) {
            clearInterval(progressInterval)
            throw initError
          }
        }
        
        // Race: loading vs timeout
        await Promise.race([doLoad(), timeoutPromise])
        
      } catch (error) {
        if (cancelled) return
        console.error("Failed to load Pyodide:", error)
        const message = error instanceof Error ? error.message : "Unknown error"
        setLoadingProgress(0)
        setOutput([{
          type: "error",
          content: `Failed to load Python environment: ${message}\n\nPlease refresh the page to try again. If the issue persists, check your internet connection or try a different browser.`
        }])
      } finally {
        if (timeoutId) clearTimeout(timeoutId)
      }
    }
    
    loadPyodide()
    
    return () => {
      cancelled = true
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])
  
  // Submit input value
  const submitInput = useCallback((value: string) => {
    if (inputResolveRef.current) {
      // Add to history
      setInputHistory(prev => [...prev, { prompt: inputPrompt, value }])
      
      // Add input to output display
      const inputLine: OutputLine = { 
        type: "input", 
        content: `${inputPrompt}${value}` 
      }
      outputLinesRef.current.push(inputLine)
      setOutput([...outputLinesRef.current])
      
      // Resolve the input promise
      inputResolveRef.current(value)
      inputResolveRef.current = null
      setIsWaitingForInput(false)
      setInputPrompt("")
    }
  }, [inputPrompt])
  
  // Run code with input handling
  const runCodeWithInput = useCallback(async (code: string, startTime: number) => {
    if (!pyodideRef.current) return
    
    // Count input calls and collect them upfront
    const inputMatches = code.match(/input\s*\([^)]*\)/g) || []
    const inputPrompts: string[] = []
    
    // Extract prompts from input calls
    for (const match of inputMatches) {
      const promptMatch = match.match(/input\s*\(\s*["'](.*)["']\s*\)/)
      if (promptMatch) {
        inputPrompts.push(promptMatch[1])
      } else {
        inputPrompts.push("")
      }
    }
    
    if (inputPrompts.length > 0) {
      // Collect inputs one at a time
      const collectedInputs: string[] = []
      
      for (let i = 0; i < inputPrompts.length; i++) {
        if (abortRef.current) return
        
        const prompt = inputPrompts[i]
        setInputPrompt(prompt)
        setIsWaitingForInput(true)
        
        // Wait for user input
        const inputValue = await new Promise<string>((resolve) => {
          inputResolveRef.current = resolve
        })
        
        collectedInputs.push(inputValue)
      }
      
      // Now run the code with pre-collected inputs
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
      setOutput([{
        type: "system",
        content: "Code executed successfully with no output."
      }])
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
      // Set up stdout
      pyodideRef.current.setStdout({
        batched: (text: string) => {
          if (abortRef.current) return
          const line: OutputLine = { type: "output", content: text }
          outputLinesRef.current.push(line)
          setOutput([...outputLinesRef.current])
        }
      })
      
      // Set up stderr
      pyodideRef.current.setStderr({
        batched: (text: string) => {
          if (abortRef.current) return
          const line: OutputLine = { type: "error", content: text }
          outputLinesRef.current.push(line)
          setOutput([...outputLinesRef.current])
        }
      })
      
      // Check if code uses input()
      const usesInput = /\binput\s*\(/.test(code)
      
      if (usesInput) {
        await runCodeWithInput(code, startTime)
      } else {
        await pyodideRef.current.runPythonAsync(code)
        
        const endTime = performance.now()
        setExecutionTime(Math.round(endTime - startTime))
        
        if (outputLinesRef.current.length === 0) {
          setOutput([{
            type: "system",
            content: "Code executed successfully with no output."
          }])
        }
      }
    } catch (error) {
      if (!abortRef.current) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        setOutput([...outputLinesRef.current, {
          type: "error",
          content: errorMessage
        }])
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
    setOutput(prev => [...prev, {
      type: "system",
      content: "Execution stopped by user."
    }])
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
    inputHistory,
    runCode,
    stopExecution,
    clearOutput,
    submitInput,
  }
}
