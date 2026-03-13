import { NextRequest, NextResponse } from "next/server";

/**
 * Cache busting token — embedded at build time via the prebuild script.
 * The script writes NEXT_PUBLIC_CACHE_TOKEN=<token> to .env.local before
 * `next build` runs, so the value is baked into both the server and
 * client bundles automatically.
 */
const CACHE_TOKEN = process.env.NEXT_PUBLIC_CACHE_TOKEN || "dev";

// ---------------------------------------------------------------------------
// Routes that must NEVER receive a ?_cb redirect (crawlers rely on these)
// ---------------------------------------------------------------------------
const SEO_ROUTES = new Set([
  "/sitemap.xml",
  "/robots.txt",
  "/rss.xml",
  "/feed.xml",
  "/manifest.json",
]);

// Prefixes that should always be skipped
const SKIP_PREFIXES = [
  "/api/",
  "/_next/",
  "/static/",
  "/favicon",
  "/icons/",
  "/images/",
];

function shouldSkip(pathname: string): boolean {
  if (SEO_ROUTES.has(pathname)) return true;
  return SKIP_PREFIXES.some((p) => pathname.startsWith(p));
}

// ---------------------------------------------------------------------------
// Core helpers (usable on both server and client)
// ---------------------------------------------------------------------------

/**
 * Append `?_cb=<token>` to a URL string.
 * - Safe to call on relative paths  ("/projects", "/projects#section")
 * - Safe to call on absolute URLs   ("https://…")
 * - No-op when `_cb` is already present
 */
export function appendCacheToken(href: string, token = CACHE_TOKEN): string {
  if (!href) return href;

  // External / protocol-relative / mailto / tel — leave untouched
  if (
    href.startsWith("http") ||
    href.startsWith("//") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return href;
  }

  // Pure hash anchor → same-page scroll, no token needed
  if (href.startsWith("#")) return href;

  // Skip API and Next.js internal paths
  if (href.startsWith("/api/") || href.startsWith("/_next/")) return href;

  // Already has the token
  if (href.includes("_cb=")) return href;

  // Separate the hash fragment so it stays at the end
  const hashIdx = href.indexOf("#");
  const base = hashIdx >= 0 ? href.slice(0, hashIdx) : href;
  const hash = hashIdx >= 0 ? href.slice(hashIdx) : "";

  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}_cb=${token}${hash}`;
}

/** Alias kept for backward compatibility with server-cache.ts callers */
export function addCacheBusterToUrl(url: string, buster?: string): string {
  return appendCacheToken(url, buster);
}

export function getCacheBusterVersion(): string {
  return CACHE_TOKEN;
}

// ---------------------------------------------------------------------------
// Middleware helper (server-only)
// ---------------------------------------------------------------------------

/**
 * Returns a redirect `NextResponse` that adds `?_cb=<token>` when the
 * incoming page request doesn't already carry it.
 *
 * Returns `null` when no redirect is needed so the caller can fall through.
 */
export function cacheBustingMiddleware(
  request: NextRequest,
): NextResponse | null {
  const { pathname, searchParams } = request.nextUrl;

  // Never redirect SEO/static/API paths
  if (shouldSkip(pathname)) return null;

  // Token already present — pass through
  if (searchParams.has("_cb")) return null;

  // Redirect with token appended
  const url = request.nextUrl.clone();
  url.searchParams.set("_cb", CACHE_TOKEN);
  return NextResponse.redirect(url);
}
