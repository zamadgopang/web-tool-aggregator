"use client"

import { Plus, X, FileCode2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface FileTab {
  id: string
  name: string
  content: string
  isModified: boolean
}

interface FileTabsProps {
  files: FileTab[]
  activeFileId: string
  onSelectFile: (id: string) => void
  onCloseFile: (id: string) => void
  onNewFile: () => void
  onRenameFile: (id: string, name: string) => void
}

export function FileTabs({
  files,
  activeFileId,
  onSelectFile,
  onCloseFile,
  onNewFile,
}: FileTabsProps) {
  return (
    <div className="flex items-center gap-1 bg-secondary/30 border-b border-border px-2 py-1 overflow-x-auto">
      {files.map((file) => (
        <div
          key={file.id}
          onClick={() => onSelectFile(file.id)}
          className={cn(
            "group flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer transition-colors text-sm",
            file.id === activeFileId
              ? "bg-card text-foreground border border-border"
              : "text-muted-foreground hover:text-foreground hover:bg-card/50"
          )}
        >
          <FileCode2 className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate max-w-30">{file.name}</span>
          {file.isModified && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
          )}
          {files.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onCloseFile(file.id)
              }}
              className="opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity p-0.5 rounded"
              aria-label={`Close ${file.name}`}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      ))}
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onNewFile}
        className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
        aria-label="New file"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  )
}
