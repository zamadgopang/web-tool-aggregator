export function Hero() {
  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-foreground/[0.02] rounded-full blur-3xl" />
      </div>
      <div className="flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground mb-6">
          <span className="h-2 w-2 rounded-full bg-foreground animate-pulse" />
          30+ free tools &mdash; no sign-up required
        </div>
        <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Free, Lightning-Fast
          <br />
          Browser Tools
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
          Powerful utilities that run instantly in your browser. No uploads, no waiting, no server delays. Your files never leave your device.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-2 text-sm font-medium text-foreground">
            <span className="h-2 w-2 rounded-full bg-foreground" />
            100% Client-side
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-2 text-sm font-medium text-foreground">
            <span className="h-2 w-2 rounded-full bg-foreground" />
            Privacy First
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-2 text-sm font-medium text-foreground">
            <span className="h-2 w-2 rounded-full bg-foreground" />
            Zero Latency
          </div>
        </div>
      </div>
    </section>
  )
}
