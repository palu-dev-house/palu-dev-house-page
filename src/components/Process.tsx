import { process } from "@/lib/site";
import { SectionHead } from "./Services";

export function Process() {
  return (
    <section id="proses" className="py-20 sm:py-28 bg-fg text-bg">
      <div className="container-px">
        <div className="text-bg">
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-brand">Proses</div>
          <h2 className="mt-3 max-w-2xl text-3xl sm:text-4xl font-bold leading-tight text-balance">
            Cara kami bekerja — transparan, bertahap, terukur.
          </h2>
        </div>

        <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((p) => (
            <li key={p.step} className="bg-fg p-7">
              <div className="font-display text-5xl font-bold text-brand/80">{p.step}</div>
              <h3 className="mt-4 font-display text-xl font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-bg/70 leading-relaxed">{p.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
