import Link from 'next/link';
import { Container } from '../layout/Container';
import { MotionSection } from '../ui/MotionSection';
import { PricingTable } from '../ui/PricingTable';
import { landingPackage } from '@/lib/pricing';

export function Pricing() {
  return (
    <MotionSection id="harga" className="py-section-sm md:py-section">
      <Container>
        <div className="max-w-prose mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">Harga Landing Page</h2>
          <p className="mt-4 text-ink-muted">
            Transparan, ga ada biaya tersembunyi. Pilih paket sesuai kebutuhan bisnismu.
          </p>
        </div>

        <div className="mt-12">
          <div className="max-w-prose mx-auto text-center">
            <p className="text-sm text-ink-muted">{landingPackage.subtitle}</p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {landingPackage.tiers.map((tier, i) => (
              <PricingTable key={tier.id} tier={tier} index={i} />
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/harga" className="text-sm font-medium text-brand hover:underline">
            Lihat add-ons & detail pembayaran →
          </Link>
        </div>
      </Container>
    </MotionSection>
  );
}
