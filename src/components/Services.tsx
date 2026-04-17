import { Check } from "lucide-react";
import { services } from "@/lib/site";

export function Services() {
  return (
    <section id="layanan" className="py-20 sm:py-28">
      <div className="container-px">
        <SectionHead
          eyebrow="Layanan"
          title="Tiga jenis pekerjaan, satu tim yang ahli."
          desc="Apa pun tahap bisnis Anda — kami siap mengeksekusi dari nol hingga skala produksi."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {services.map((s) => (
            <article
              key={s.title}
              className="group flex flex-col rounded-2xl border border-border bg-bg p-7 hover:border-fg/30 hover:shadow-sm transition"
            >
              <span className="inline-flex w-fit rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
                {s.badge}
              </span>
              <h3 className="mt-5 font-display text-2xl font-semibold">{s.title}</h3>
              <p className="mt-3 text-sm text-muted leading-relaxed">{s.desc}</p>
              <ul className="mt-6 space-y-2.5 border-t border-border pt-5">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm">
                    <Check size={16} className="mt-0.5 shrink-0 text-brand" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="max-w-2xl">
      <div className="text-xs font-medium uppercase tracking-[0.18em] text-brand">{eyebrow}</div>
      <h2 className="mt-3 text-3xl sm:text-4xl font-bold leading-tight text-balance">{title}</h2>
      {desc && <p className="mt-4 text-muted text-balance">{desc}</p>}
    </div>
  );
}
