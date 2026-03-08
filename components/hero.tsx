export function Hero() {
  return (
    <section className="py-16 sm:py-24">
      <div className="flex flex-col items-center text-center">
        <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Free, Lightning-Fast Browser Tools
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
          Powerful utilities that run instantly in your browser. No uploads, no waiting, no server delays. Your files never leave your device.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            100% Client-side
          </div>
          <div className="flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            Privacy First
          </div>
          <div className="flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-600 dark:text-orange-400">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Zero Latency
          </div>
        </div>
      </div>
    </section>
  )
}
