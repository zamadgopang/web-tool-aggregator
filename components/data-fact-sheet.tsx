interface DataFactSheetProps {
  toolName: string
  toolFunction: string
}

export function DataFactSheet({ toolName, toolFunction }: DataFactSheetProps) {
  return (
    <aside
      className="rounded-2xl bg-white/40 dark:bg-black/40 backdrop-blur-2xl backdrop-saturate-150 border border-black/[0.08] dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-5 sm:p-6"
      aria-label={`${toolName} fact sheet`}
    >
      <h2 className="text-lg font-semibold text-foreground mb-4">Tool Fact Sheet</h2>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        <dt className="font-medium text-foreground">Tool Name</dt>
        <dd className="text-muted-foreground">{toolName}</dd>

        <dt className="font-medium text-foreground">Function</dt>
        <dd className="text-muted-foreground">{toolFunction}</dd>

        <dt className="font-medium text-foreground">Processing Mode</dt>
        <dd className="text-muted-foreground">Client-side only (browser)</dd>

        <dt className="font-medium text-foreground">Cost</dt>
        <dd className="text-muted-foreground">Free — no sign-up required</dd>

        <dt className="font-medium text-foreground">Privacy Level</dt>
        <dd className="text-muted-foreground">Maximum — files never leave your device</dd>

        <dt className="font-medium text-foreground">Browser Support</dt>
        <dd className="text-muted-foreground">Chrome, Firefox, Safari, Edge (all modern browsers)</dd>

        <dt className="font-medium text-foreground">Mobile Support</dt>
        <dd className="text-muted-foreground">Yes — responsive design for all screen sizes</dd>

        <dt className="font-medium text-foreground">Data Storage</dt>
        <dd className="text-muted-foreground">None — no cookies, no tracking, no server storage</dd>
      </dl>
    </aside>
  )
}
