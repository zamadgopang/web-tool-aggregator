import Link from "next/link"
import { pseoVariants, type PseoVariant } from "@/lib/pseo-data"
import { getToolById } from "@/lib/tools-data"

interface RelatedUtilitiesProps {
  relatedSlugs: string[]
}

export function RelatedUtilities({ relatedSlugs }: RelatedUtilitiesProps) {
  if (!relatedSlugs || relatedSlugs.length === 0) return null

  const related = relatedSlugs
    .map((slug) => pseoVariants.find((v) => v.slug === slug))
    .filter(Boolean) as PseoVariant[]

  if (related.length === 0) return null

  return (
    <aside aria-label="Related tools" className="mt-8">
      <h2 className="text-lg font-semibold text-foreground mb-4">Related Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {related.map((variant) => {
          const baseTool = getToolById(variant.toolId)
          return (
            <Link
              key={variant.slug}
              href={`/${variant.slug}`}
              className="group flex flex-col gap-1 rounded-xl p-4 bg-white/60 dark:bg-white/10 backdrop-blur-md border border-black/[0.06] dark:border-white/20 shadow-sm hover:shadow-md transition-all duration-200 hover:border-black/15 dark:hover:border-white/30"
            >
              <span className="text-sm font-medium text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {variant.keyword}
              </span>
              {baseTool && (
                <span className="text-xs text-muted-foreground">
                  {baseTool.title}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
