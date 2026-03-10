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
    <div className="flex items-center justify-between px-2 sm:px-4 py-2 bg-card border-b border-border gap-1">
      {/* Left side - Logo and title */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs sm:text-sm">Py</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">ZamPy</span>
            <span className="text-xs text-muted-foreground hidden sm:block">Online Python Compiler</span>
          </div>
        </div>
      </div>
      
      {/* Center - Run controls */}
      <div className="flex items-center gap-1 sm:gap-2">
        {!isRunning ? (
          <Button
            onClick={onRun}
            disabled={!isPyodideReady}
            size="sm"
            className="gap-1.5 sm:gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Play className="w-4 h-4" />
            <span className="hidden sm:inline">{isPyodideReady ? "Run" : "Loading..."}</span>
          </Button>
        ) : (
          <Button onClick={onStop} variant="destructive" size="sm" className="gap-1.5 sm:gap-2">
            <Square className="w-4 h-4" />
            <span className="hidden sm:inline">Stop</span>
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          className="gap-1.5 sm:gap-2"
          title="Clear output"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Clear</span>
        </Button>
      </div>
      
      {/* Right side - Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        <Button
          variant={showExamples ? "secondary" : "ghost"}
          size="sm"
          onClick={onToggleExamples}
          title="Code examples"
          className="gap-1.5 sm:gap-2"
        >
          <Lightbulb className="w-4 h-4" />
          <span className="hidden sm:inline">Examples</span>
        </Button>
        
        <div className="h-5 w-px bg-border hidden sm:block" />
        
        {/* Desktop: show individual buttons */}
        <div className="hidden sm:flex items-center gap-1">
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
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
              <Settings className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {/* Mobile-only: show actions in menu */}
            <DropdownMenuItem onClick={onCopy} className="sm:hidden">
              <Copy className="w-4 h-4 mr-2" />
              Copy code
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDownload} className="sm:hidden">
              <Download className="w-4 h-4 mr-2" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onShare} className="sm:hidden">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuSeparator className="sm:hidden" />
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
