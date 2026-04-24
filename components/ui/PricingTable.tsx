import { motion } from 'framer-motion';
import { Card } from './Card';
import { ButtonLink } from './Button';
import { Badge } from './Badge';
import type { PricingTier } from '@/lib/pricing';

const WHATSAPP_NUMBER = '628000000000';

interface PricingTableProps {
  tier: PricingTier;
  index: number;
}

export function PricingTable({ tier, index }: PricingTableProps) {
  const msg = encodeURIComponent(`Halo Palu Dev House, saya tertarik dengan paket ${tier.name}.`);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Card className={`h-full flex flex-col ${tier.popular ? 'ring-2 ring-brand' : ''}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-ink">{tier.name}</h3>
          {tier.popular && <Badge>Populer</Badge>}
        </div>
        <div className="mt-4">
          <div className="text-2xl font-semibold text-ink">{tier.price}</div>
          {tier.monthly && <div className="text-sm text-ink-muted mt-1">+ {tier.monthly}</div>}
        </div>
        <ul className="mt-6 space-y-2 flex-1">
          {tier.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-ink-muted">
              <svg className="h-4 w-4 mt-0.5 text-brand flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <ButtonLink
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`}
          target="_blank"
          rel="noopener noreferrer"
          variant={tier.popular ? 'primary' : 'secondary'}
          className="mt-8"
        >
          {tier.ctaLabel}
        </ButtonLink>
      </Card>
    </motion.div>
  );
}
