export function Hero() {
  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      {/* Background gradient decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-br from-blue-500/10 via-violet-500/10 to-pink-500/10 rounded-full blur-3xl" />
      </div>
      <div className="flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground mb-6">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          30+ free tools &mdash; no sign-up required
        </div>
        <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          <span className="text-foreground">Free, Lightning-Fast</span>
          <br />
          <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 dark:from-blue-400 dark:via-violet-400 dark:to-pink-400 bg-clip-text text-transparent">Browser Tools</span>
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
          Powerful utilities that run instantly in your browser. No uploads, no waiting, no server delays. Your files never leave your device.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            100% Client-side
          </div>
          <div className="flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            Privacy First
          </div>
          <div className="flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-4 py-2 text-sm font-medium text-orange-600 dark:text-orange-400">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Zero Latency
          </div>
        </div>
      </div>
    </section>
  )
}
