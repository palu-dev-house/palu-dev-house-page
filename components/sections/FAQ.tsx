import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../layout/Container';
import { MotionSection } from '../ui/MotionSection';
import { faqItems } from '@/lib/faq';

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <MotionSection id="faq" className="py-section-sm md:py-section bg-surface-muted">
      <Container>
        <div className="max-w-prose mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">
              Pertanyaan yang Sering Ditanya
            </h2>
          </div>
          <div className="mt-12 divide-y divide-line border-t border-b border-line">
            {faqItems.map((item, i) => {
              const open = openIdx === i;
              return (
                <div key={item.question} className="py-4">
                  <button
                    onClick={() => setOpenIdx(open ? null : i)}
                    className="w-full flex items-start justify-between gap-4 text-left"
                    aria-expanded={open}
                  >
                    <span className="font-medium text-ink">{item.question}</span>
                    <span className={`text-brand transition-transform flex-shrink-0 ${open ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-3 text-sm text-ink-muted leading-relaxed">{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </MotionSection>
  );
}
