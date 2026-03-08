"use client"

import { Image, FileText, FileType, Film, Code, type LucideProps } from "lucide-react"
import type { ToolIconName } from "@/lib/tools"

const iconMap: Record<ToolIconName, React.ComponentType<LucideProps>> = {
  "image": Image,
  "file-text": FileText,
  "file-type": FileType,
  "film": Film,
  "code": Code,
}

interface ToolIconProps extends LucideProps {
  name: ToolIconName
}

export function ToolIcon({ name, ...props }: ToolIconProps) {
  const Icon = iconMap[name]
  return <Icon {...props} />
}
