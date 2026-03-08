"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AgencyCTA() {
  return (
    <section className="border-t border-border bg-gradient-to-b from-background to-secondary/30 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Need something custom? Let&apos;s build it.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          ZamDev builds fast, modern web apps, tools, and SaaS products.
          If you need a tailored solution, let&apos;s talk.
        </p>
        <Button asChild size="lg" className="mt-6 gap-2">
          <a href="https://zamdev.me" target="_blank" rel="noopener noreferrer">
            Work with ZamDev
            <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </section>
  )
}
