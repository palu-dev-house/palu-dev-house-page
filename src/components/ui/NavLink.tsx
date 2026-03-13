'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';

type LinkProps = ComponentProps<typeof Link>;

const CACHE_TOKEN = process.env.NEXT_PUBLIC_CACHE_TOKEN || 'dev';

/**
 * Append ?_cb=<token> to an internal href string.
 *
 * Rules:
 *  - External URLs (http/https/mailto/tel/protocol-relative) → untouched
 *  - Pure hash anchors (#section) → untouched  (same-page scroll)
 *  - /api/* and /_next/* paths → untouched
 *  - Already contains _cb= → untouched (avoid double-appending)
 *  - Everything else → token appended before any hash fragment
 */
function withCacheToken(href: string): string {
  if (!href) return href;

  // Skip external / protocol-relative / special schemes
  if (
    href.startsWith('http') ||
    href.startsWith('//') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  ) {
    return href;
  }

  // Skip pure hash anchors — same-page scroll, no navigation occurs
  if (href.startsWith('#')) return href;

  // Skip internal Next.js / API paths
  if (href.startsWith('/api/') || href.startsWith('/_next/')) return href;

  // Skip if token already present
  if (href.includes('_cb=')) return href;

  // Separate any trailing hash fragment so it stays at the very end
  const hashIdx = href.indexOf('#');
  const base = hashIdx >= 0 ? href.slice(0, hashIdx) : href;
  const hash = hashIdx >= 0 ? href.slice(hashIdx) : '';

  const sep = base.includes('?') ? '&' : '?';
  return `${base}${sep}_cb=${CACHE_TOKEN}${hash}`;
}

/**
 * Drop-in replacement for Next.js <Link> that automatically appends
 * the cache-busting token (?_cb=TOKEN) to every internal page navigation.
 *
 * Usage — identical to <Link>:
 *
 *   <NavLink href="/projects">Projects</NavLink>
 *   <NavLink href={{ pathname: '/projects', query: { id: 1 } }}>…</NavLink>
 *
 * The token is sourced from process.env.NEXT_PUBLIC_CACHE_TOKEN which is
 * written to .env.local by the prebuild script before `next build` runs.
 */
export function NavLink({ href, children, ...props }: LinkProps) {
  let resolvedHref: LinkProps['href'];

  if (typeof href === 'string') {
    resolvedHref = withCacheToken(href);
  } else if (typeof href === 'object' && href !== null && 'pathname' in href) {
    // Next.js UrlObject — merge _cb into the query object
    resolvedHref = {
      ...href,
      query: {
        ...(href.query as Record<string, string> | undefined),
        _cb: CACHE_TOKEN,
      },
    };
  } else {
    resolvedHref = href;
  }

  return (
    <Link href={resolvedHref} {...props}>
      {children}
    </Link>
  );
}
