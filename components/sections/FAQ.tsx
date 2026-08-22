import { useState } from 'react';
import { Container } from '../layout/Container';
import { MotionSection } from '../ui/MotionSection';
import { faqItems } from '@/lib/faq';

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <MotionSection id="faq" className="py-section-sm md:py-section bg-surface-muted">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          {/* Heading rides alongside the list instead of sitting on top of it,
              and stays put while twelve answers scroll past. */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-ink">
                Pertanyaan yang Sering Ditanya
              </h2>
              <div className="mt-6 hidden h-px w-16 bg-brand-400 lg:block" aria-hidden="true" />
            </div>
          </div>

          <div className="lg:col-span-8">
            <ul className="divide-y divide-line border-y border-line">
              {faqItems.map((item, i) => {
                const open = openIdx === i;
                return (
                  <li key={item.question}>
                    <h3>
                      <button
                        type="button"
                        id={`faq-trigger-${i}`}
                        aria-expanded={open}
                        aria-controls={`faq-panel-${i}`}
                        onClick={() => setOpenIdx(open ? null : i)}
                        className="group flex w-full items-start justify-between gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-4 focus-visible:ring-offset-surface-muted"
                      >
                        <span
                          className={`text-[15px] font-semibold leading-relaxed transition-colors md:text-base ${
                            open ? 'text-ink' : 'text-ink group-hover:text-brand'
                          }`}
                        >
                          {item.question}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border text-lg leading-none transition-transform duration-200 ${
                            open
                              ? 'rotate-45 border-brand bg-brand text-white'
                              : 'border-line-strong text-ink-muted group-hover:border-brand-400 group-hover:text-brand'
                          }`}
                        >
                          +
                        </span>
                      </button>
                    </h3>
                    {/* 0fr → 1fr collapses without measuring, so nothing has to
                        animate a pixel height frame by frame. */}
                    <div
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${i}`}
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div
                        className={`overflow-hidden transition-[opacity,visibility] duration-200 ${
                          open ? 'visible opacity-100' : 'invisible opacity-0'
                        }`}
                      >
                        <p className="max-w-prose pb-6 pr-10 text-sm leading-relaxed text-ink-muted">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </MotionSection>
  );
}
