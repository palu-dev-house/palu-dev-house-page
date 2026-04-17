import { ArrowRight, Mail, MapPin, MessageCircle } from "lucide-react";
import { site } from "@/lib/site";

export function Contact() {
  return (
    <section id="kontak" className="py-20 sm:py-28">
      <div className="container-px">
        <div className="rounded-3xl bg-fg text-bg p-10 sm:p-16 text-center relative overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-brand/30 blur-3xl" />

          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl sm:text-5xl font-bold leading-tight text-balance">
              Punya ide produk? Mari kita bicarakan.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-bg/70">
              Konsultasi awal gratis. Kami akan bantu menentukan ruang lingkup,
              estimasi waktu, dan biaya yang masuk akal untuk Anda.
            </p>

            <a
              href={site.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-bg hover:bg-brand/90 transition"
            >
              Chat via WhatsApp
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition" />
            </a>

            <div className="mt-10 grid gap-4 sm:grid-cols-3 text-sm text-bg/80">
              <ContactItem icon={<MessageCircle size={16} />} label={site.whatsappLabel} />
              <ContactItem icon={<Mail size={16} />} label={site.email} />
              <ContactItem icon={<MapPin size={16} />} label={site.location} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="grid place-items-center h-7 w-7 rounded-full bg-bg/10">{icon}</span>
      {label}
    </div>
  );
}
