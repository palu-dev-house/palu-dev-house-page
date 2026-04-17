import { ArrowRight } from "lucide-react";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section id="top" className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute top-40 right-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container-px text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-bg/60 px-4 py-1.5 text-xs text-muted backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Tersedia untuk proyek baru — Q2 2026
        </div>

        <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl sm:text-6xl font-bold leading-[1.05]">
          Software house untuk membangun{" "}
          <span className="text-brand">produk digital</span> bisnis Anda.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-balance text-base sm:text-lg text-muted">
          {site.description}
        </p>

        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-sm font-medium text-bg hover:bg-brand transition"
          >
            Mulai Konsultasi Gratis
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition" />
          </a>
          <a
            href="#layanan"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-bg px-6 py-3 text-sm font-medium hover:border-fg/40 transition"
          >
            Lihat Layanan
          </a>
        </div>

        <dl className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-border pt-8 text-left sm:text-center">
          <Stat label="Proyek selesai" value="20+" />
          <Stat label="Tim engineer" value="6" />
          <Stat label="Tahun berpengalaman" value="5+" />
        </dl>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted">{label}</dt>
      <dd className="mt-1 font-display text-2xl sm:text-3xl font-semibold">{value}</dd>
    </div>
  );
}
