import { nav, site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border py-10">
      <div className="container-px flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center h-7 w-7 rounded-md bg-brand text-white text-xs">P</span>
          <span className="font-display font-semibold text-fg">{site.brand}</span>
          <span className="hidden sm:inline">— {site.location}</span>
        </div>
        <nav className="flex flex-wrap items-center gap-5">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="hover:text-fg transition">
              {n.label}
            </a>
          ))}
        </nav>
        <div>© {year} {site.brand}</div>
      </div>
    </footer>
  );
}
