"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { sanitizeHtml } from "@/lib/sanitize"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  readOnly?: boolean
}

// Syntax highlighting tokens for Python
const pythonKeywords = [
  "and", "as", "assert", "async", "await", "break", "class", "continue",
  "def", "del", "elif", "else", "except", "finally", "for", "from",
  "global", "if", "import", "in", "is", "lambda", "nonlocal", "not",
  "or", "pass", "raise", "return", "try", "while", "with", "yield",
  "True", "False", "None"
]

const pythonBuiltins = [
  "print", "len", "range", "str", "int", "float", "list", "dict", "set",
  "tuple", "bool", "type", "input", "open", "file", "abs", "all", "any",
  "bin", "chr", "dir", "divmod", "enumerate", "eval", "exec", "filter",
  "format", "getattr", "globals", "hasattr", "hash", "help", "hex", "id",
  "isinstance", "issubclass", "iter", "locals", "map", "max", "min", "next",
  "object", "oct", "ord", "pow", "repr", "reversed", "round", "setattr",
  "slice", "sorted", "staticmethod", "sum", "super", "vars", "zip"
]

function highlightPython(code: string): string {
  const lines = code.split("\n")
  
  return lines.map(line => {
    let result = ""
    let i = 0
    
    while (i < line.length) {
      // Check for comments
      if (line[i] === "#") {
        result += `<span class="text-muted-foreground/70 italic">${escapeHtml(line.slice(i))}</span>`
        break
      }
      
      // Check for strings (single or double quotes)
      if (line[i] === '"' || line[i] === "'") {
        const quote = line[i]
        let end = i + 1
        while (end < line.length && line[end] !== quote) {
          if (line[end] === "\\") end++
          end++
        }
        end++
        result += `<span class="text-amber-400">${escapeHtml(line.slice(i, end))}</span>`
        i = end
        continue
      }
      
      // Check for numbers
      if (/\d/.test(line[i])) {
        let end = i
        while (end < line.length && /[\d.]/.test(line[end])) end++
        result += `<span class="text-orange-400">${escapeHtml(line.slice(i, end))}</span>`
        i = end
        continue
      }
      
      // Check for words (keywords, builtins, identifiers)
      if (/[a-zA-Z_]/.test(line[i])) {
        let end = i
        while (end < line.length && /[a-zA-Z0-9_]/.test(line[end])) end++
        const word = line.slice(i, end)
        
        if (pythonKeywords.includes(word)) {
          result += `<span class="text-pink-400 font-medium">${escapeHtml(word)}</span>`
        } else if (pythonBuiltins.includes(word)) {
          result += `<span class="text-cyan-400">${escapeHtml(word)}</span>`
        } else if (line[end] === "(") {
          result += `<span class="text-blue-400">${escapeHtml(word)}</span>`
        } else {
          result += escapeHtml(word)
        }
        i = end
        continue
      }
      
      // Check for operators and punctuation
      if (/[+\-*/%=<>!&|^~]/.test(line[i])) {
        result += `<span class="text-pink-400">${escapeHtml(line[i])}</span>`
        i++
        continue
      }
      
      if (/[()[\]{}:,.]/.test(line[i])) {
        result += `<span class="text-foreground/80">${escapeHtml(line[i])}</span>`
        i++
        continue
      }
      
      result += escapeHtml(line[i])
      i++
    }
    
    return result || "&nbsp;"
  }).join("\n")
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export function CodeEditor({ value, onChange, readOnly = false }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)
  const [lineCount, setLineCount] = useState(1)
  
  const syncScroll = useCallback(() => {
    if (textareaRef.current && highlightRef.current && lineNumbersRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }, [])
  
  useEffect(() => {
    const lines = value.split("\n").length
    setLineCount(lines)
  }, [value])
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = value.substring(0, start) + "    " + value.substring(end)
      onChange(newValue)
      
      // Set cursor position after the tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4
      }, 0)
    }
  }, [value, onChange])
  
  return (
    <div className="relative h-full w-full flex bg-(--editor-bg) rounded-md overflow-hidden font-mono text-sm">
      {/* Line numbers */}
      <div
        ref={lineNumbersRef}
        className="shrink-0 bg-(--editor-gutter) text-(--line-number) select-none overflow-hidden py-3 pr-4 pl-3 text-right border-r border-border"
        style={{ minWidth: "3rem" }}
      >
        {Array.from({ length: Math.max(lineCount, 20) }, (_, i) => (
          <div key={i + 1} className="leading-6 h-6">
            {i + 1}
          </div>
        ))}
      </div>
      
      {/* Editor area */}
      <div className="relative flex-1 overflow-hidden">
        {/* Highlighted code (visual layer) */}
        <div
          ref={highlightRef}
          className="absolute inset-0 p-3 overflow-auto pointer-events-none whitespace-pre leading-6"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(highlightPython(value), { ALLOWED_TAGS: ['span'], ALLOWED_ATTR: ['class'] }) }}
        />
        
        {/* Textarea (input layer) */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={syncScroll}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          className="absolute inset-0 w-full h-full p-3 bg-transparent text-transparent caret-foreground resize-none outline-none whitespace-pre leading-6 overflow-auto"
          style={{ 
            caretColor: "var(--foreground)",
            tabSize: 4 
          }}
          placeholder="# Start writing Python code..."
        />
      </div>
    </div>
  )
}
