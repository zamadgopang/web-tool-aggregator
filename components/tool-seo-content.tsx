"use client"

import { type ToolMeta } from "@/lib/tools-data"
import * as LucideIcons from "lucide-react"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface ToolSeoContentProps {
    tool: ToolMeta
}

function ToolIcon({ iconName, className }: { iconName: string; className?: string }) {
    const Icon = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[iconName]
    if (!Icon) return null
    return <Icon className={className} />
}

function FaqAccordionItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false)

    return (
        <div className="border border-border rounded-lg overflow-hidden">
            <button
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium text-foreground hover:bg-muted/50 transition-colors"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
            >
                <span>{question}</span>
                <ChevronDown
                    className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    aria-hidden="true"
                />
            </button>
            {open && (
                <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                    {answer}
                </div>
            )}
        </div>
    )
}

export function ToolSeoContent({ tool }: ToolSeoContentProps) {
    return (
        <section className="mt-12 mb-16 max-w-4xl mx-auto px-4 space-y-12" aria-label={`About ${tool.title}`}>
            {/* Tool illustration with icon */}
            <div className="flex items-center gap-6 p-6 rounded-xl bg-muted/30 border border-border">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-foreground/5">
                    <ToolIcon iconName={tool.iconName} className="h-8 w-8 text-foreground" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-foreground">
                        About {tool.title}
                    </h2>
                    <p className="mt-1 text-muted-foreground leading-relaxed">
                        {tool.description} This tool runs entirely in your browser — no data is uploaded to any server, ensuring complete privacy and instant results.
                    </p>
                </div>
            </div>

            {/* Key Features */}
            <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Key Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/20 border border-border">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground/10">
                            <LucideIcons.Zap className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="font-medium text-foreground text-sm">Lightning Fast</p>
                            <p className="text-xs text-muted-foreground">Processes instantly with zero server delays</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/20 border border-border">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground/10">
                            <LucideIcons.Shield className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="font-medium text-foreground text-sm">100% Private</p>
                            <p className="text-xs text-muted-foreground">Your data never leaves your device</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/20 border border-border">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground/10">
                            <LucideIcons.Globe className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="font-medium text-foreground text-sm">No Sign-up Required</p>
                            <p className="text-xs text-muted-foreground">Use this tool instantly — completely free</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/20 border border-border">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground/10">
                            <LucideIcons.Monitor className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="font-medium text-foreground text-sm">Works Everywhere</p>
                            <p className="text-xs text-muted-foreground">Compatible with all modern browsers and devices</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            {tool.faqItems.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-2">
                        {tool.faqItems.map((faq, index) => (
                            <FaqAccordionItem key={index} question={faq.q} answer={faq.a} />
                        ))}
                    </div>
                </div>
            )}

            {/* SEO Keywords as tags (hidden visually but available to crawlers) */}
            {tool.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {tool.keywords.map((keyword, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center rounded-full bg-muted/50 px-3 py-1 text-xs text-muted-foreground"
                        >
                            {keyword}
                        </span>
                    ))}
                </div>
            )}
        </section>
    )
}
