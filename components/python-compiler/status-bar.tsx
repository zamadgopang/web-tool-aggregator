"use client"

import { Circle, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatusBarProps {
  isPyodideReady: boolean
  loadingProgress: number
  cursorPosition: { line: number; column: number }
  fileSize: number
}

export function StatusBar({
  isPyodideReady,
  loadingProgress,
  cursorPosition,
  fileSize,
}: StatusBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-1.5 bg-secondary/50 border-t border-border text-xs text-muted-foreground">
      {/* Left side - Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          {isPyodideReady ? (
            <>
              <CheckCircle2 className="w-3 h-3 text-primary" />
              <span>Python Ready</span>
            </>
          ) : (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Loading Python ({loadingProgress}%)</span>
            </>
          )}
        </div>
        
        <div className="hidden sm:flex items-center gap-1.5">
          <Circle className={cn(
            "w-2 h-2",
            isPyodideReady ? "fill-primary text-primary" : "fill-amber-400 text-amber-400"
          )} />
          <span>Pyodide v0.24.1</span>
        </div>
      </div>
      
      {/* Right side - Editor info */}
      <div className="flex items-center gap-4">
        <span className="hidden sm:inline">
          Ln {cursorPosition.line}, Col {cursorPosition.column}
        </span>
        <span className="hidden md:inline">{formatBytes(fileSize)}</span>
        <span>Python</span>
        <span className="hidden sm:inline">UTF-8</span>
      </div>
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
