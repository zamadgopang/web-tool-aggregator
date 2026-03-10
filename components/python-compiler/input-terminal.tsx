"use client"

import { useState, useRef, useEffect, KeyboardEvent } from "react"
import { Terminal, CornerDownLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface InputTerminalProps {
  isWaitingForInput: boolean
  inputPrompt: string
  onSubmitInput: (value: string) => void
  inputHistory: Array<{ prompt: string; value: string }>
}

export function InputTerminal({
  isWaitingForInput,
  inputPrompt,
  onSubmitInput,
  inputHistory,
}: InputTerminalProps) {
  const [inputValue, setInputValue] = useState("")
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Focus input when waiting for input
  useEffect(() => {
    if (isWaitingForInput && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isWaitingForInput])
  
  const handleSubmit = () => {
    if (inputValue.trim() !== "" || isWaitingForInput) {
      onSubmitInput(inputValue)
      setInputValue("")
      setHistoryIndex(-1)
    }
  }
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSubmit()
    }
    
    // Navigate input history with up/down arrows
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (inputHistory.length > 0 && historyIndex < inputHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setInputValue(inputHistory[inputHistory.length - 1 - newIndex].value)
      }
    }
    
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInputValue(inputHistory[inputHistory.length - 1 - newIndex].value)
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInputValue("")
      }
    }
  }
  
  return (
    <div className="border-t border-border bg-secondary/30">
      {/* Input history display */}
      {inputHistory.length > 0 && (
        <div className="px-4 py-2 space-y-1 border-b border-border/50 max-h-24 overflow-y-auto">
          {inputHistory.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm font-mono">
              <span className="text-muted-foreground">{entry.prompt}</span>
              <span className="text-primary">{entry.value}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Input field */}
      <div className={cn(
        "flex items-center gap-2 px-4 py-2",
        isWaitingForInput && "bg-primary/5 animate-pulse"
      )}>
        <div className="flex items-center gap-2 text-muted-foreground">
          {isWaitingForInput ? (
            <ChevronRight className="w-4 h-4 text-primary animate-bounce" />
          ) : (
            <Terminal className="w-4 h-4" />
          )}
        </div>
        
        {isWaitingForInput && inputPrompt && (
          <span className="text-sm text-foreground font-mono whitespace-pre">
            {inputPrompt}
          </span>
        )}
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!isWaitingForInput}
          placeholder={isWaitingForInput ? "Type input and press Enter..." : "Waiting for input() call..."}
          className={cn(
            "flex-1 bg-transparent text-sm font-mono outline-none placeholder:text-muted-foreground/50",
            isWaitingForInput ? "text-foreground" : "text-muted-foreground"
          )}
          aria-label="Program input"
        />
        
        <Button
          size="sm"
          variant={isWaitingForInput ? "default" : "ghost"}
          onClick={handleSubmit}
          disabled={!isWaitingForInput}
          className="gap-1.5 h-7 px-2"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-xs">Enter</span>
        </Button>
      </div>
      
      {isWaitingForInput && (
        <div className="px-4 pb-2">
          <p className="text-xs text-muted-foreground">
            Program is waiting for input. Type your response and press Enter.
          </p>
        </div>
      )}
    </div>
  )
}
