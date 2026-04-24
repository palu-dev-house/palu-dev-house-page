import Link from 'next/link';
import { Container } from '../layout/Container';
import { MotionSection } from '../ui/MotionSection';
import { PricingTable } from '../ui/PricingTable';
import { allPackages } from '@/lib/pricing';

export function Pricing() {
  return (
    <MotionSection id="harga" className="py-section-sm md:py-section">
      <Container>
        <div className="max-w-prose mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">Harga</h2>
          <p className="mt-4 text-ink-muted">
            Transparan, ga ada biaya tersembunyi. Pilih paket sesuai kebutuhan bisnismu.
          </p>
        </div>

        {allPackages.map((pkg) => (
          <div key={pkg.category} className="mt-16">
            <div className="max-w-prose mx-auto text-center">
              <h3 className="text-2xl font-semibold text-ink">{pkg.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{pkg.subtitle}</p>
            </div>
            <div className={`mt-8 grid gap-6 ${pkg.tiers.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'}`}>
              {pkg.tiers.map((tier, i) => (
                <PricingTable key={tier.id} tier={tier} index={i} />
              ))}
            </div>
          </div>
        ))}

        <div className="mt-12 text-center">
          <Link href="/harga" className="text-sm font-medium text-brand hover:underline">
            Lihat add-ons & detail pembayaran →
          </Link>
        </div>
      </Container>
    </MotionSection>
  );
}
