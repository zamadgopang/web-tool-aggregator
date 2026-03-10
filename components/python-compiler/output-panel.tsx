"use client"

import { useRef, useEffect } from "react"
import { Terminal, AlertCircle, CheckCircle2, Clock, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { InputTerminal } from "./input-terminal"
import type { InputHistoryEntry } from "@/hooks/use-python-runner"

export interface OutputLine {
  type: "output" | "error" | "system" | "input"
  content: string
  timestamp?: number
}

interface OutputPanelProps {
  output: OutputLine[]
  isRunning: boolean
  executionTime?: number
  isWaitingForInput?: boolean
  inputPrompt?: string
  inputHistory?: InputHistoryEntry[]
  onSubmitInput?: (value: string) => void
}

export function OutputPanel({ 
  output, 
  isRunning, 
  executionTime,
  isWaitingForInput = false,
  inputPrompt = "",
  inputHistory = [],
  onSubmitInput,
}: OutputPanelProps) {
  const outputRef = useRef<HTMLDivElement>(null)
  
  // Auto-scroll to bottom when new output appears
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output, isWaitingForInput])
  
  return (
    <div className="h-full flex flex-col bg-card rounded-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/50">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Output</span>
          {isWaitingForInput && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary border border-primary/30">
              Awaiting Input
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isRunning && !isWaitingForInput && (
            <div className="flex items-center gap-1.5 text-xs text-amber-400">
              <Clock className="w-3.5 h-3.5 animate-pulse" />
              <span>Running...</span>
            </div>
          )}
          {!isRunning && executionTime !== undefined && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              <span>Completed in {executionTime}ms</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Output content */}
      <div 
        ref={outputRef}
        className="flex-1 overflow-auto p-4 font-mono text-sm"
      >
        {output.length === 0 && !isWaitingForInput ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
            <Terminal className="w-8 h-8 opacity-50" />
            <p className="text-sm">Output will appear here</p>
            <p className="text-xs opacity-70">Press Run or Ctrl+Enter to execute</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {output.map((line, index) => (
              <div
                key={index}
                className={cn(
                  "leading-relaxed whitespace-pre-wrap break-all",
                  line.type === "error" && "text-destructive flex items-start gap-2",
                  line.type === "system" && "text-muted-foreground italic",
                  line.type === "output" && "text-foreground",
                  line.type === "input" && "text-primary flex items-center gap-2"
                )}
              >
                {line.type === "error" && (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                {line.type === "input" && (
                  <ChevronRight className="w-4 h-4 shrink-0 text-primary" />
                )}
                <span>{line.content}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Input terminal - always visible when running or waiting for input */}
      {onSubmitInput && (
        <InputTerminal
          isWaitingForInput={isWaitingForInput}
          inputPrompt={inputPrompt}
          onSubmitInput={onSubmitInput}
          inputHistory={inputHistory}
        />
      )}
    </div>
  )
}
