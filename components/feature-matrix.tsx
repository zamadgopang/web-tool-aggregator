interface FeatureMatrixProps {
  toolName: string
  rows: string[][]
}

export function FeatureMatrix({ toolName, rows }: FeatureMatrixProps) {
  if (!rows || rows.length === 0) return null

  return (
    <section aria-label={`${toolName} features`}>
      <h2 className="text-lg font-semibold text-foreground mb-4">Feature Overview</h2>
      <div className="overflow-x-auto rounded-2xl border border-black/[0.08] dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/[0.08] dark:border-white/10">
              <th className="px-4 py-3 text-left font-semibold text-foreground">Feature</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Details</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={
                  i < rows.length - 1
                    ? "border-b border-black/[0.06] dark:border-white/[0.06]"
                    : ""
                }
              >
                <td className="px-4 py-3 font-medium text-foreground">{row[0]}</td>
                <td className="px-4 py-3 text-muted-foreground">{row[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
