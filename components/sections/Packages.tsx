import { Container } from '../layout/Container';
import { MotionSection } from '../ui/MotionSection';
import { PackageCard } from '../ui/PackageCard';
import { landingPackage } from '@/lib/packages';
import { whatsappLink } from '@/lib/contact';

export function Packages() {
  return (
    <MotionSection id="paket" className="py-section-sm md:py-section">
      <Container>
        {/* Split heading rather than a centred stack — the section above and
            below both centre, and three sections in a row of the same rhythm is
            what made the page read as a template. */}
        <div className="grid gap-4 md:grid-cols-12 md:items-end md:gap-8">
          <h2 className="font-display text-3xl md:col-span-6 md:text-4xl font-semibold tracking-tight text-ink">
            Isi Paket Landing Page
          </h2>
          <p className="text-ink-muted md:col-span-5 md:col-start-8">
            Tiga tingkat kelengkapan. Lihat yang paling mirip kebutuhanmu, lalu chat — estimasinya
            kami hitung sesuai halaman, konten, dan target yang kamu mau.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:mt-12 md:grid-cols-3">
          {landingPackage.tiers.map((tier, i) => (
            <PackageCard key={tier.id} tier={tier} index={i} />
          ))}
        </div>

        {/* The package fine print is genuinely fine print — domain, hosting,
            what "build sekali bayar" covers. Below the cards it informs without
            standing between the heading and the packages. */}
        <div className="mt-10 rounded-lg border border-line bg-surface-muted p-5 md:mt-12 md:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
            <div className="flex gap-3">
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink-subtle"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <p className="max-w-prose text-[13px] leading-relaxed text-ink-muted">
                {landingPackage.subtitle}
              </p>
            </div>
            <a
              href={whatsappLink(
                'Halo Palu Dev House, saya mau tanya estimasi untuk landing page bisnis saya.',
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-md text-sm font-semibold text-brand transition-colors hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted dark:hover:text-brand-300"
            >
              Tanya estimasi via WhatsApp &rarr;
            </a>
          </div>
        </div>
      </Container>
    </MotionSection>
  );
}
