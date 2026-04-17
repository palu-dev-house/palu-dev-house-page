import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { nav, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all",
        scrolled ? "bg-bg/80 backdrop-blur border-b border-border" : "bg-transparent"
      )}
    >
      <div className="container-px flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="grid place-items-center h-8 w-8 rounded-lg bg-brand text-white text-sm">P</span>
          {site.brand}
        </a>

        <nav className="hidden md:flex items-center gap-7 text-sm text-muted">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="hover:text-fg transition">
              {n.label}
            </a>
          ))}
        </nav>

        <a
          href={site.whatsapp}
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline-flex items-center rounded-full bg-fg px-4 py-2 text-sm font-medium text-bg hover:bg-brand transition"
        >
          Konsultasi Gratis
        </a>

        <button
          aria-label="Menu"
          className="md:hidden p-2"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-bg">
          <div className="container-px py-4 flex flex-col gap-3">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="py-1 text-sm text-muted hover:text-fg"
              >
                {n.label}
              </a>
            ))}
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-fg px-4 py-2 text-sm font-medium text-bg"
            >
              Konsultasi Gratis
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
