export default function ToolLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-24 animate-pulse rounded bg-muted" />
            <div className="h-6 w-12 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-9 w-9 animate-pulse rounded bg-muted" />
        </div>
      </div>

      {/* Tool skeleton */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <div className="h-10 w-32 animate-pulse rounded bg-muted mb-6" />
        <div className="space-y-4">
          <div className="h-8 w-64 animate-pulse rounded bg-muted" />
          <div className="h-4 w-96 animate-pulse rounded bg-muted" />
          <div className="h-[400px] w-full animate-pulse rounded-xl bg-muted mt-6" />
        </div>
      </div>
    </div>
  )
}
