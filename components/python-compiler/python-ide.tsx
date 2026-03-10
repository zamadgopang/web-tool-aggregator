"use client"

import { useState, useCallback, useEffect } from "react"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { CodeEditor } from "./code-editor"
import { OutputPanel } from "./output-panel"
import { FileTabs, type FileTab } from "./file-tabs"
import { Toolbar } from "./toolbar"
import { StatusBar } from "./status-bar"
import { ExamplesPanel } from "./examples-panel"
import { usePythonRunner } from "@/hooks/use-python-runner"
import { useToast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

const DEFAULT_CODE = `# Welcome to ZamPy - Python Online Compiler
# Write your Python code here and press Run (or Ctrl+Enter)

# Example 1: Simple greeting with user input
name = input("What is your name? ")
print(f"Hello, {name}! Welcome to ZamPy.")

# Example 2: Interactive calculator
print("\\n--- Simple Calculator ---")
num1 = input("Enter first number: ")
num2 = input("Enter second number: ")

try:
    result = float(num1) + float(num2)
    print(f"{num1} + {num2} = {result}")
except ValueError:
    print("Please enter valid numbers!")

# Example 3: Number guessing hint
print("\\n--- Quick Math ---")
age = input("Enter your birth year: ")
try:
    current_year = 2024
    age_calc = current_year - int(age)
    print(f"You are approximately {age_calc} years old!")
except ValueError:
    print("Please enter a valid year!")

print("\nThanks for using ZamPy!")
`

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export function PythonIDE() {
  const isMobile = useIsMobile()
  const { toast } = useToast()
  const {
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
  } = usePythonRunner()
  
  const [files, setFiles] = useState<FileTab[]>([
    { id: "main", name: "main.py", content: DEFAULT_CODE, isModified: false }
  ])
  const [activeFileId, setActiveFileId] = useState("main")
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })
  const [showExamples, setShowExamples] = useState(false)
  
  const activeFile = files.find(f => f.id === activeFileId)
  const currentCode = activeFile?.content || ""
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault()
        if (isReady && !isRunning) {
          runCode(currentCode)
        }
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        handleSave()
      }
    }
    
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isReady, isRunning, currentCode, runCode])
  
  const updateFileContent = useCallback((content: string) => {
    setFiles(prev => prev.map(f =>
      f.id === activeFileId
        ? { ...f, content, isModified: content !== DEFAULT_CODE }
        : f
    ))
  }, [activeFileId])
  
  const handleNewFile = useCallback(() => {
    const id = generateId()
    const newFile: FileTab = {
      id,
      name: `script_${files.length + 1}.py`,
      content: "# New Python script\n\n",
      isModified: false
    }
    setFiles(prev => [...prev, newFile])
    setActiveFileId(id)
  }, [files.length])
  
  const handleCloseFile = useCallback((id: string) => {
    if (files.length <= 1) return
    
    setFiles(prev => prev.filter(f => f.id !== id))
    if (activeFileId === id) {
      const remaining = files.filter(f => f.id !== id)
      setActiveFileId(remaining[0]?.id || "")
    }
  }, [files, activeFileId])
  
  const handleRenameFile = useCallback((id: string, name: string) => {
    setFiles(prev => prev.map(f =>
      f.id === id ? { ...f, name } : f
    ))
  }, [])
  
  const handleRun = useCallback(() => {
    if (isReady && !isRunning) {
      runCode(currentCode)
    }
  }, [isReady, isRunning, currentCode, runCode])
  
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentCode)
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
      })
    } catch {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }, [currentCode, toast])
  
  const handleDownload = useCallback(() => {
    const blob = new Blob([currentCode], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = activeFile?.name || "script.py"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: "Downloaded!",
      description: `${activeFile?.name || "script.py"} has been downloaded`,
    })
  }, [currentCode, activeFile, toast])
  
  const handleShare = useCallback(async () => {
    const shareUrl = new URL(window.location.href)
    shareUrl.searchParams.set("code", btoa(encodeURIComponent(currentCode)))
    
    try {
      await navigator.clipboard.writeText(shareUrl.toString())
      toast({
        title: "Share link copied!",
        description: "Link with your code has been copied to clipboard",
      })
    } catch {
      toast({
        title: "Share",
        description: "Unable to copy share link",
        variant: "destructive",
      })
    }
  }, [currentCode, toast])
  
  const handleReset = useCallback(() => {
    setFiles([
      { id: "main", name: "main.py", content: DEFAULT_CODE, isModified: false }
    ])
    setActiveFileId("main")
    clearOutput()
    toast({
      title: "Reset",
      description: "Editor reset to default state",
    })
  }, [clearOutput, toast])
  
  const handleSave = useCallback(() => {
    setFiles(prev => prev.map(f =>
      f.id === activeFileId ? { ...f, isModified: false } : f
    ))
    toast({
      title: "Saved",
      description: "Your changes have been saved locally",
    })
  }, [activeFileId, toast])
  
  const handleSelectExample = useCallback((code: string) => {
    updateFileContent(code)
    clearOutput()
    toast({
      title: "Example loaded",
      description: "Code example has been loaded into the editor",
    })
  }, [updateFileContent, clearOutput, toast])
  
  return (
    <div className="h-[calc(100vh-120px)] min-h-80 md:min-h-125 flex flex-col bg-background rounded-lg border border-border overflow-hidden">
      <Toolbar
        onRun={handleRun}
        onStop={stopExecution}
        onClear={clearOutput}
        onCopy={handleCopy}
        onDownload={handleDownload}
        onShare={handleShare}
        onReset={handleReset}
        onToggleExamples={() => setShowExamples(prev => !prev)}
        isRunning={isRunning}
        isPyodideReady={isReady}
        showExamples={showExamples}
      />
      
      {/* Examples Sheet for Mobile */}
      {isMobile && (
        <Sheet open={showExamples} onOpenChange={setShowExamples}>
          <SheetContent side="bottom" className="h-[70vh] rounded-t-xl">
            <SheetHeader>
              <SheetTitle>Code Examples</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto mt-4">
              <ExamplesPanel onSelectExample={(code) => {
                handleSelectExample(code)
                setShowExamples(false)
              }} />
            </div>
          </SheetContent>
        </Sheet>
      )}
      
      <div className="flex-1 overflow-hidden flex">
        {/* Examples Sidebar - Desktop only */}
        {!isMobile && showExamples && (
          <div className="w-72 border-r border-border p-2 shrink-0">
            <ExamplesPanel onSelectExample={handleSelectExample} />
          </div>
        )}
        
        <ResizablePanelGroup
          direction={isMobile ? "vertical" : "horizontal"}
          className="h-full flex-1"
        >
          {/* Code Editor Panel */}
          <ResizablePanel defaultSize={isMobile ? 55 : 55} minSize={25}>
            <div className="h-full flex flex-col">
              <FileTabs
                files={files}
                activeFileId={activeFileId}
                onSelectFile={setActiveFileId}
                onCloseFile={handleCloseFile}
                onNewFile={handleNewFile}
                onRenameFile={handleRenameFile}
              />
              <div className="flex-1 p-1 md:p-2 overflow-hidden">
                <CodeEditor
                  value={currentCode}
                  onChange={updateFileContent}
                />
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle className="bg-border" />
          
          {/* Output Panel */}
          <ResizablePanel defaultSize={isMobile ? 45 : 45} minSize={20}>
            <div className="h-full p-1 md:p-2">
              <OutputPanel
                output={output}
                isRunning={isRunning}
                executionTime={executionTime}
                isWaitingForInput={isWaitingForInput}
                inputPrompt={inputPrompt}
                inputHistory={inputHistory}
                onSubmitInput={submitInput}
                loadError={loadError}
                onRetry={retryLoad}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      
      <StatusBar
        isPyodideReady={isReady}
        loadingProgress={loadingProgress}
        cursorPosition={cursorPosition}
        fileSize={new Blob([currentCode]).size}
        loadError={loadError}
        onRetry={retryLoad}
      />
    </div>
  )
}
