"use client"

import { type ToolMeta } from "@/lib/tools-data"
import * as LucideIcons from "lucide-react"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface ToolSeoContentProps {
    tool: ToolMeta
}

function ToolIcon({ iconName, className }: { iconName: string; className?: string }) {
    const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[iconName]
    if (!Icon) return null
    return <Icon className={className} />
}

function FaqAccordionItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false)

    return (
        <div className="border border-black/[0.08] dark:border-white/10 rounded-xl overflow-hidden bg-white/40 dark:bg-black/40 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
            <button
                className="flex w-full items-center justify-between gap-3 sm:gap-4 px-3 sm:px-5 py-3 sm:py-4 text-left text-sm sm:text-base font-medium text-foreground hover:bg-white/30 dark:hover:bg-white/[0.04] transition-colors"
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
                <div className="px-3 sm:px-5 pb-3 sm:pb-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {answer}
                </div>
            )}
        </div>
    )
}

export function ToolSeoContent({ tool }: ToolSeoContentProps) {
    const faqItems = tool.faqItems || []
    const keywords = tool.keywords || []
    const seoContent = tool.seoContent

    return (
        <section className="mt-8 sm:mt-12 mb-12 sm:mb-16 max-w-4xl mx-auto px-3 sm:px-4 space-y-8 sm:space-y-12" aria-label={`About ${tool.title}`}>
            {/* Tool illustration with icon */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-white/40 dark:bg-black/40 backdrop-blur-2xl backdrop-saturate-150 border border-black/[0.08] dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
                <div className="flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/10">
                    <ToolIcon iconName={tool.iconName} className="h-6 w-6 sm:h-8 sm:w-8 text-foreground" />
                </div>
                <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                        About {tool.title}
                    </h2>
                    <p className="mt-1 text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {seoContent?.longDescription || `${tool.description} This tool runs entirely in your browser — no data is uploaded to any server, ensuring complete privacy and instant results.`}
                    </p>
                </div>
            </div>

            {/* How It Works */}
            {seoContent?.howItWorks && seoContent.howItWorks.length > 0 && (
                <section aria-label="How it works">
                    <h2 className="text-lg font-semibold text-foreground mb-4">How It Works</h2>
                    <ol className="space-y-2 sm:space-y-3">
                        {seoContent.howItWorks.map((step, index) => (
                            <li key={index} className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-white/60 dark:bg-white/10 backdrop-blur-md border border-black/[0.06] dark:border-white/20 shadow-sm">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 text-xs font-semibold text-foreground">
                                    {index + 1}
                                </span>
                                <span className="text-sm text-muted-foreground leading-relaxed">{step}</span>
                            </li>
                        ))}
                    </ol>
                </section>
            )}


            {/* Key Features */}
            <section aria-label="Key features">
                <h2 className="text-lg font-semibold text-foreground mb-4">Key Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-white/60 dark:bg-white/10 backdrop-blur-md border border-black/[0.06] dark:border-white/20 shadow-sm">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10">
                            <LucideIcons.Zap className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="font-medium text-foreground text-sm">Lightning Fast</p>
                            <p className="text-xs text-muted-foreground">Processes instantly with zero server delays</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-white/60 dark:bg-white/10 backdrop-blur-md border border-black/[0.06] dark:border-white/20 shadow-sm">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10">
                            <LucideIcons.Shield className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="font-medium text-foreground text-sm">100% Private</p>
                            <p className="text-xs text-muted-foreground">Your data never leaves your device</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-white/60 dark:bg-white/10 backdrop-blur-md border border-black/[0.06] dark:border-white/20 shadow-sm">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10">
                            <LucideIcons.Globe className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="font-medium text-foreground text-sm">No Sign-up Required</p>
                            <p className="text-xs text-muted-foreground">Use this tool instantly — completely free</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-white/60 dark:bg-white/10 backdrop-blur-md border border-black/[0.06] dark:border-white/20 shadow-sm">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10">
                            <LucideIcons.Monitor className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="font-medium text-foreground text-sm">Works Everywhere</p>
                            <p className="text-xs text-muted-foreground">Compatible with all modern browsers and devices</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            {seoContent?.useCases && seoContent.useCases.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">Common Use Cases</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                        {seoContent.useCases.map((useCase, index) => (
                            <div key={index} className="flex items-start gap-2 p-2 sm:p-3 rounded-lg">
                                <LucideIcons.CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-foreground/60" aria-hidden="true" />
                                <span className="text-sm text-muted-foreground leading-relaxed">{useCase}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* FAQ Section */}
            {faqItems.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-2">
                        {faqItems.map((faq, index) => (
                            <FaqAccordionItem key={index} question={faq.q} answer={faq.a} />
                        ))}
                    </div>
                </div>
            )}

            {/* SEO Keywords as tags */}
            {keywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-md border border-black/[0.06] dark:border-white/20 shadow-sm px-3 py-1 text-xs text-muted-foreground"
                        >
                            {keyword}
                        </span>
                    ))}
                </div>
            )}
        </section>
    )
}
