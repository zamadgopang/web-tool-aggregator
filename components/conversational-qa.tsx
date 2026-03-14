interface ConversationalQAProps {
  faq: { q: string; a: string }[]
}

export function ConversationalQA({ faq }: ConversationalQAProps) {
  if (!faq || faq.length === 0) return null

  return (
    <section aria-label="Frequently asked questions">
      <h2 className="text-lg font-semibold text-foreground mb-6">
        Frequently Asked Questions
      </h2>
      <div className="space-y-6">
        {faq.map((item, i) => (
          <div key={i}>
            <h3 className="text-base font-medium text-foreground mb-2">{item.q}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
