import Image from 'next/image';
import { motion } from 'framer-motion';
import { Container } from '../layout/Container';
import { MotionSection } from '../ui/MotionSection';
import { portfolioItems } from '@/lib/portfolio';

/**
 * This is the proof section — the one place a prospect can look at real work
 * rather than read a claim about it, so the work is the hero and the chrome
 * stays out of the way.
 *
 * The old layout was six identical thirds, which flattened the flagship build
 * to the same weight as a one-page company profile. Instead: a mosaic on a
 * 6-column grid where the first entry (see lib/portfolio.ts — order is
 * deliberate) takes two thirds of the width and the full height of the two
 * cards stacked beside it, and the remainder run half-width.
 *
 * Tailwind can only see class names it can read as literals, so the spans are
 * looked up rather than built from the index.
 */
const spans = [
  // Feature: full bleed of the grid on tablet, 4/6 and two rows tall on desktop.
  'sm:col-span-2 lg:col-span-4 lg:row-span-2',
  'lg:col-span-2',
  'lg:col-span-2',
  'lg:col-span-3',
  'lg:col-span-3',
];

// Kept in step with `spans` so the browser fetches a sensibly sized source at
// each breakpoint. Sources are 1280x800 (16:10), matching the frame ratio.
const imageSizes = [
  '(min-width: 1024px) 62vw, (min-width: 640px) 92vw, 92vw',
  '(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw',
  '(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw',
  '(min-width: 1024px) 46vw, (min-width: 640px) 46vw, 92vw',
  '(min-width: 1024px) 46vw, (min-width: 640px) 46vw, 92vw',
];

const FALLBACK_SPAN = 'lg:col-span-3';
const FALLBACK_SIZES = '(min-width: 1024px) 46vw, (min-width: 640px) 46vw, 92vw';

export function Portfolio() {
  return (
    <MotionSection id="portfolio" className="py-section-sm md:py-section bg-surface-muted">
      <Container>
        {/* Offset header — the page has enough centred headings above this one. */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-ink">
            Karya yang Sudah Live
          </h2>
          <p className="text-ink-muted md:max-w-xs md:text-right">
            Produk yang sudah kami build dan running di lapangan.
          </p>
        </div>

        <div className="mt-10 md:mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {portfolioItems.map((item, i) => {
            const isFeature = i === 0;
            return (
              <motion.a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                // Transform only — the border and shadow move on a CSS
                // transition, not on the animation frame.
                whileHover={{ y: -6 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.35, delay: Math.min(i, 3) * 0.05 }}
                className={
                  'group relative flex h-full min-w-0 flex-col overflow-hidden rounded-xl border ' +
                  'border-line bg-surface transition-[border-color,box-shadow] duration-200 ' +
                  'hover:border-brand-400 hover:shadow-lg focus-visible:outline-none ' +
                  'focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 ' +
                  'focus-visible:ring-offset-surface-muted ' +
                  (spans[i] ?? FALLBACK_SPAN)
                }
              >
                {/* aspect-[16/10] is the natural ratio of the sources and acts as
                    the minimum; flex-1 lets the frame absorb the extra height
                    when the card is stretched by a taller neighbour. */}
                <div className="relative flex-1 aspect-[16/10] overflow-hidden bg-surface-sunken">
                  <Image
                    src={item.image}
                    alt={`Preview ${item.name}`}
                    fill
                    sizes={imageSizes[i] ?? FALLBACK_SIZES}
                    className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-brand-950/0 transition-colors duration-300 group-hover:bg-brand-950/10"
                  />
                </div>

                <div className="flex shrink-0 flex-col border-t border-line p-5 sm:p-6">
                  {/* Category leads the block so the section can be scanned for
                      "something like mine" without reading every project name. */}
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                      {item.category}
                    </span>
                  </div>
                  <h3
                    className={
                      'mt-2 font-display font-semibold text-ink ' +
                      (isFeature ? 'text-xl sm:text-2xl' : 'text-base')
                    }
                  >
                    {item.name}
                  </h3>
                  <span
                    className={
                      'mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand ' +
                      (isFeature ? 'sm:mt-4 sm:text-sm' : '')
                    }
                  >
                    Buka live site
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </Container>
    </MotionSection>
  );
}
