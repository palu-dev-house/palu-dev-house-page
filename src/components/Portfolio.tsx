import { ArrowUpRight } from "lucide-react";
import { portfolio } from "@/lib/site";
import { SectionHead } from "./Services";

export function Portfolio() {
  return (
    <section id="portofolio" className="py-20 sm:py-28">
      <div className="container-px">
        <SectionHead
          eyebrow="Portofolio"
          title="Beberapa pekerjaan yang pernah kami kerjakan."
          desc="Produk live yang sedang dipakai — landing page, SaaS, hingga aplikasi internal."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolio.map((p) => {
            const host = p.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
            return (
              <a
                key={p.title}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col rounded-2xl border border-border bg-bg p-6 hover:border-fg/30 hover:shadow-sm transition"
              >
                <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-brand/10 via-brand-soft to-accent/10 grid place-items-center text-brand/60 font-display text-lg">
                  {p.tag}
                </div>
                <div className="mt-5 flex items-center justify-between text-xs text-muted">
                  <span>{p.type}</span>
                  <span className="rounded-full bg-bg border border-border px-2 py-0.5">{p.tag}</span>
                </div>
                <h3 className="mt-2 flex items-center gap-1.5 font-display text-lg font-semibold">
                  {p.title}
                  <ArrowUpRight
                    size={16}
                    className="text-muted group-hover:text-brand group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition"
                  />
                </h3>
                <p className="mt-1.5 text-sm text-muted leading-relaxed">{p.desc}</p>
                <div className="mt-4 text-xs text-muted/80 truncate">{host}</div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
