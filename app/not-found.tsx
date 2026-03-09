import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-8 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-foreground text-background text-4xl font-extrabold">
            Z
          </div>
        </div>

        <h1 className="text-7xl font-extrabold tracking-tight text-foreground">
          404
        </h1>
        <p className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </p>
        <p className="mt-2 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          aria-label="Go back to ZamDev Tools homepage"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back to Tools
        </Link>

        <p className="mt-12 text-xs text-muted-foreground">
          Tools by ZamDev &mdash; tools.zamdev.me
        </p>
      </div>
    </div>
  )
}
