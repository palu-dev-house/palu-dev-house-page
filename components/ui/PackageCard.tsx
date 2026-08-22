import { motion } from 'framer-motion';
import { ButtonLink } from './Button';
import type { PackageTier } from '@/lib/packages';
import { whatsappLink } from '@/lib/contact';

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

interface PackageCardProps {
  tier: PackageTier;
  index: number;
}

/**
 * A "what you get" card. The slot the price used to occupy is now the tier's
 * one-line summary — the card still opens with a reason to keep reading, and
 * the eye still lands somewhere before the tick list starts.
 */
export function PackageCard({ tier, index }: PackageCardProps) {
  const href = whatsappLink(
    `Halo Palu Dev House, saya tertarik dengan paket ${tier.name}. Boleh minta estimasi?`,
  );
  const popular = Boolean(tier.popular);

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

        <p className="mt-3 text-sm leading-relaxed text-ink-muted">{tier.summary}</p>

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
          href={href}
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
