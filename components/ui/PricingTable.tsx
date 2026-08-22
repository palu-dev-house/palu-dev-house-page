import { motion } from 'framer-motion';
import { ButtonLink } from './Button';
import type { PricingTier } from '@/lib/pricing';
import { WHATSAPP_NUMBER } from '@/lib/contact';


/**
 * Rupiah figures are long — "Mulai Rp 15.000.000" is nineteen characters and
 * will not survive a 226px column at 28px type. Splitting the qualifier and the
 * currency symbol off the numerals lets the number itself stay big and on one
 * line, and reads faster: the eye lands on the digits, not on "Mulai Rp".
 * No copy is changed — every word is still rendered, just at its own weight.
 */
function parsePrice(value: string) {
  const qualifier = /^(Mulai)\s+(.+)$/.exec(value);
  const rest = qualifier ? qualifier[2] : value;
  const currency = /^(Rp)\s*(.+)$/.exec(rest);
  return {
    qualifier: qualifier ? qualifier[1] : null,
    currency: currency ? currency[1] : null,
    amount: currency ? currency[2] : rest,
  };
}

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

interface PricingTableProps {
  tier: PricingTier;
  index: number;
}

export function PricingTable({ tier, index }: PricingTableProps) {
  const msg = encodeURIComponent(`Halo Palu Dev House, saya tertarik dengan paket ${tier.name}.`);
  const popular = Boolean(tier.popular);
  const { qualifier, currency, amount } = parsePrice(tier.price);

  // "Semua fitur Starter" is an inheritance statement, not a feature. Pulling it
  // out of the tick list makes the ladder between tiers legible at a glance and
  // keeps the list below it to things this tier actually adds.
  const inherited = tier.features[0]?.startsWith('Semua fitur') ? tier.features[0] : null;
  const features = inherited ? tier.features.slice(1) : tier.features;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      // min-w-0 keeps a long price from forcing the grid column wider than its track.
      className={`min-w-0 h-full ${popular ? 'lg:-mt-4' : ''}`}
    >
      <div
        className={
          'relative flex h-full flex-col overflow-hidden rounded-lg bg-surface p-6 transition-shadow duration-200 ' +
          (popular
            ? 'border-2 border-accent-500 shadow-xl'
            : 'border border-line shadow-sm hover:shadow-lg')
        }
      >
        {/* The one accent moment on the page: the tier we want chosen. */}
        {popular && <div className="absolute inset-x-0 top-0 h-1 bg-accent-500" aria-hidden="true" />}

        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold tracking-tight text-ink">{tier.name}</h3>
          {popular && (
            // Not <Badge variant="accent">: the token colours are raw CSS vars,
            // so Tailwind's `/15` alpha modifier compiles to transparent and the
            // pill loses its fill. Solid amber is what we want here anyway.
            <span className="inline-flex flex-shrink-0 items-center rounded-full bg-accent-500 px-3 py-1 text-xs font-semibold text-brand-950">
              Populer
            </span>
          )}
        </div>

        <div className="mt-5">
          {qualifier && (
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
              {qualifier}
            </div>
          )}
          <div className="flex items-baseline gap-1.5 whitespace-nowrap font-display font-semibold tracking-tight text-ink">
            {currency && <span className="text-base text-ink-muted">{currency}</span>}
            <span className="text-[28px] leading-none tabular-nums lg:text-2xl xl:text-[28px]">
              {amount}
            </span>
          </div>
          {tier.monthly && <div className="mt-2 text-sm text-ink-muted">+ {tier.monthly}</div>}
        </div>

        {inherited && (
          <p className="mt-5 flex items-center gap-2 rounded-md bg-surface-muted px-3 py-2 text-[13px] font-semibold text-ink">
            <span
              className={`text-base leading-none ${popular ? 'text-accent-600' : 'text-brand'}`}
              aria-hidden="true"
            >
              +
            </span>
            {inherited}
          </p>
        )}

        <ul className={`space-y-2.5 flex-1 ${inherited ? 'mt-4' : 'mt-6'}`}>
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-ink-muted">
              <span
                className={
                  'mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full ' +
                  (popular
                    ? 'bg-accent-500 text-brand-950'
                    : 'bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-300')
                }
                aria-hidden="true"
              >
                <CheckIcon className="h-2.5 w-2.5" />
              </span>
              <span className="min-w-0 break-words">{f}</span>
            </li>
          ))}
        </ul>

        <ButtonLink
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`}
          target="_blank"
          rel="noopener noreferrer"
          variant={popular ? 'accent' : 'secondary'}
          className="mt-7 w-full"
        >
          {tier.ctaLabel}
        </ButtonLink>
      </div>
    </motion.div>
  );
}
