import type { ArticleSection } from '@/lib/articles';

interface ArticleBodyProps {
  intro: string;
  sections: ArticleSection[];
}

export function ArticleBody({ intro, sections }: ArticleBodyProps) {
  return (
    <article className="prose-custom">
      <p className="lead text-lg text-ink-muted leading-relaxed">{intro}</p>

      {sections.map((section, i) => (
        <section key={i} className="mt-10">
          {section.heading && (
            <h2 className="text-2xl md:text-3xl font-semibold text-ink tracking-tight">
              {section.heading}
            </h2>
          )}
          {section.paragraphs?.map((p, j) => (
            <p key={j} className="mt-4 text-ink-muted leading-relaxed">
              {p}
            </p>
          ))}
          {section.bullets && (
            <ul className="mt-4 space-y-2">
              {section.bullets.map((b, j) => (
                <li key={j} className="flex items-start gap-3 text-ink-muted leading-relaxed">
                  <svg
                    className="h-5 w-5 mt-0.5 text-brand flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
          {section.callout && (
            <aside className="mt-6 rounded-xl border border-line bg-surface-muted p-5">
              <div className="text-sm font-semibold text-brand uppercase tracking-wide">
                {section.callout.title}
              </div>
              <div className="mt-2 text-ink leading-relaxed">{section.callout.body}</div>
            </aside>
          )}
        </section>
      ))}
    </article>
  );
}
