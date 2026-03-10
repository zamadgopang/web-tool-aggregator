"use client"

import { Play, Square, Download, Share2, Copy, Trash2, Settings, RotateCcw, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { KeyboardShortcuts } from "./keyboard-shortcuts"

interface ToolbarProps {
  onRun: () => void
  onStop: () => void
  onClear: () => void
  onCopy: () => void
  onDownload: () => void
  onShare: () => void
  onReset: () => void
  onToggleExamples: () => void
  isRunning: boolean
  isPyodideReady: boolean
  showExamples: boolean
}

export function Toolbar({
  onRun,
  onStop,
  onClear,
  onCopy,
  onDownload,
  onShare,
  onReset,
  onToggleExamples,
  isRunning,
  isPyodideReady,
  showExamples,
}: ToolbarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border">
      {/* Left side - Logo and title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">Py</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">PyRun</span>
            <span className="text-xs text-muted-foreground">Online Python Compiler</span>
          </div>
        </div>
      </div>
      
      {/* Center - Run controls */}
      <div className="flex items-center gap-2">
        {!isRunning ? (
          <Button
            onClick={onRun}
            disabled={!isPyodideReady}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Play className="w-4 h-4" />
            <span className="hidden sm:inline">{isPyodideReady ? "Run" : "Loading..."}</span>
          </Button>
        ) : (
          <Button onClick={onStop} variant="destructive" className="gap-2">
            <Square className="w-4 h-4" />
            <span className="hidden sm:inline">Stop</span>
          </Button>
        )}
        
        <Button
          variant="outline"
          onClick={onClear}
          className="gap-2"
          title="Clear output"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Clear</span>
        </Button>
      </div>
      
      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant={showExamples ? "secondary" : "ghost"}
          size="sm"
          onClick={onToggleExamples}
          title="Code examples"
          className="gap-2"
        >
          <Lightbulb className="w-4 h-4" />
          <span className="hidden sm:inline">Examples</span>
        </Button>
        
        <div className="h-5 w-px bg-border hidden sm:block" />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onCopy}
          title="Copy code"
        >
          <Copy className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onDownload}
          title="Download code"
        >
          <Download className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onShare}
          title="Share code"
        >
          <Share2 className="w-4 h-4" />
        </Button>
        
        <KeyboardShortcuts />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to default
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <span className="text-muted-foreground">Theme settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <span className="text-muted-foreground">Editor settings</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
