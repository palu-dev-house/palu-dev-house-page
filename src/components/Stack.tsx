import { stack } from "@/lib/site";

export function Stack() {
  return (
    <section className="py-16 border-y border-border bg-brand-soft/30">
      <div className="container-px">
        <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-muted">
          Stack & tools yang kami pakai sehari-hari
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-border bg-bg px-4 py-1.5 text-sm font-medium text-fg/80"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
