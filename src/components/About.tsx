import { founders } from "@/lib/site";
import { SectionHead } from "./Services";

export function About() {
  return (
    <section id="tentang" className="py-20 sm:py-28">
      <div className="container-px grid gap-14 lg:grid-cols-2 lg:gap-20 items-center">
        <div>
          <SectionHead
            eyebrow="Tentang Kami"
            title="Tim engineering yang fokus pada produk yang dipakai."
          />
          <div className="mt-6 space-y-4 text-muted leading-relaxed">
            <p>
              Palu Dev House adalah software house yang berbasis di Palu dan Medan. Kami
              dibangun oleh engineer dan founder yang sebelumnya membangun produk untuk
              perusahaan teknologi berskala nasional.
            </p>
            <p>
              Kami percaya kode yang baik adalah kode yang dipakai. Itu sebabnya kami
              bekerja erat dengan founder dan tim internal Anda — bukan sekadar
              menyerahkan dokumen, tapi memastikan produk benar-benar berjalan di
              tangan pengguna.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {founders.map((f) => (
            <div
              key={f.name}
              className="rounded-2xl border border-border bg-bg p-5"
            >
              <div className="aspect-square overflow-hidden rounded-xl bg-brand-soft">
                <img
                  src={f.img}
                  alt={f.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-4">
                <div className="font-display font-semibold">{f.name}</div>
                <div className="text-xs text-muted">{f.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
