# Developer Guide - Adding New Tools

This guide explains how to create and integrate new tools into the ToolKit application.

## Tool Architecture

Every tool in ToolKit follows a consistent pattern:

1. **Tool Component** - Located in `components/tools/`
2. **Registration** - Added to tool list in `tool-grid.tsx`
3. **Mapping** - Connected in `tool-mapper.tsx`
4. **Navigation** - Indexed in `command-search.tsx`

## Step-by-Step: Adding a New Tool

### Step 1: Create the Tool Component

Create a new file in `components/tools/` following this template:

```tsx
// components/tools/your-tool.tsx
"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export function YourToolName() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleProcess = () => {
    try {
      setError(null)
      // Your tool logic here
      setOutput(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Tool Title</CardTitle>
          <CardDescription>Description of what the tool does</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input controls */}
          {/* Process button */}
          {/* Output display */}
          
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

### Step 2: Add Tool Definition

Edit `components/tool-grid.tsx` and add your tool to the `tools` array:

```tsx
{
  id: "your-tool-id",                    // Unique identifier (kebab-case)
  title: "Your Tool Name",               // Display name
  description: "What this tool does.",   // Short description
  icon: <YourIcon className="h-6 w-6" />, // Lucide icon
  tag: "New" as const,                   // "New" | "Hot" | "Popular" | etc
  category: "utility",                   // Category for filtering
}
```

### Step 3: Register in Tool Mapper

Edit `components/tool-mapper.tsx`:

```tsx
import { YourToolName } from "@/components/tools/your-tool"

const toolComponents: Record<string, React.ComponentType> = {
  // ... existing tools
  "your-tool-id": YourToolName,
}
```

### Step 4: Add to Search

Edit `components/command-search.tsx`:

```tsx
const toolMap: Record<string, string> = {
  // ... existing tools
  "Your Tool Name": "your-tool-id",
}

const tools = [
  // ... existing tools
  { title: "Your Tool Name", category: "Category", icon: YourIcon },
]
```

### Step 5: Update Category Filter (if needed)

If you're using a new category, edit `components/category-filter.tsx`:

```tsx
const categories = [
  // ... existing categories
  { id: "your-category", label: "Category Name", icon: YourIcon },
]
```

## Best Practices

### 1. **Accessibility**
```tsx
// Always include aria-labels
<input
  aria-label="Input field description"
  placeholder="User guidance"
/>

// Use semantic HTML
<label htmlFor="input-id">Label text</label>
<input id="input-id" />
```

### 2. **Error Handling**
```tsx
const handleProcess = async () => {
  try {
    setError(null)
    setIsProcessing(true)
    
    // Validate input
    if (!input.trim()) {
      setError("Please provide input")
      return
    }
    
    // Process with error boundaries
    const result = await processData(input)
    setOutput(result)
  } catch (err) {
    setError(err instanceof Error ? err.message : "Unknown error")
  } finally {
    setIsProcessing(false)
  }
}
```

### 3. **Mobile Responsiveness**
```tsx
// Use responsive layouts
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
  {/* Single column on mobile, two columns on desktop */}
</div>

// Test on mobile sizes: 320px, 640px, 768px, 1024px
```

### 4. **UI Consistency**
- Use components from `@/components/ui/`
- Follow existing color schemes
- Use Lucide icons (never custom SVGs)
- Maintain spacing with Tailwind utilities
- Use semantic CSS classes

### 5. **Performance**
```tsx
// Debounce heavy operations
import { useCallback, useState } from "react"

const handleChange = useCallback(
  debounce((value: string) => {
    // Heavy computation
  }, 300),
  []
)

// Lazy load large content
const content = useLazyLoad(largeData)

// Optimize re-renders
const MemoizedComponent = React.memo(YourComponent)
```

### 6. **Type Safety**
```tsx
// Always type your props and state
interface ToolProps {
  initialValue?: string
  onComplete?: (result: string) => void
}

export function YourTool({ initialValue = "", onComplete }: ToolProps) {
  const [value, setValue] = useState<string>(initialValue)
  // ...
}
```

## Tool Categories

Use these existing categories for consistency:

- `image` - Image processing and conversion
- `pdf` - PDF manipulation 
- `document` - Document conversion
- `developer` - Developer tools
- `media` - Media files (video, audio)
- `text` - Text processing
- `utility` - General utilities
- `security` - Security and encryption

## Tag Options

- `"New"` - Recently added tools
- `"Hot"` - Popular tools
- `"Popular"` - Frequently used
- `"Premium"` - Advanced features
- `"Client-side"` - 100% client-side processing
- `"Secure"` - Security-focused

## Common Patterns

### File Upload Tool
```tsx
const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  if (file.size > LIMIT) {
    setError("File too large")
    return
  }

  const reader = new FileReader()
  reader.onload = (event) => {
    const content = event.target?.result
    // Process file
  }
  reader.readAsText(file) // or readAsDataURL, readAsArrayBuffer
}
```

### Download File
```tsx
const handleDownload = (content: string, filename: string) => {
  const blob = new Blob([content], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
```

### Copy to Clipboard
```tsx
const handleCopy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  } catch (err) {
    setError("Failed to copy")
  }
}
```

## Testing Checklist

- [ ] Component renders without errors
- [ ] All inputs are validated
- [ ] Error messages are helpful
- [ ] Works on mobile (320px width)
- [ ] Works on desktop (1024px+ width)
- [ ] Keyboard navigation works
- [ ] ARIA labels are present
- [ ] Copy/download features work
- [ ] Theme (dark/light) works
- [ ] Performance is acceptable
- [ ] No console errors/warnings

## Deployment

After adding a new tool:

1. Test locally: `pnpm dev`
2. Build: `pnpm build`
3. Check for errors: `pnpm lint`
4. Deploy: Push to main branch

## Examples

See existing tools for reference:
- Simple tool: `components/tools/password-generator.tsx`
- File processing: `components/tools/image-converter.tsx`
- Complex tool: `components/tools/json-formatter.tsx`

## Support

For questions or issues, refer to the main README or open a GitHub issue.
