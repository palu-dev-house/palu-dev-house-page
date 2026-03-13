import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const JWT_SECRET = process.env.JWT_SECRET || "palu-dev-house-jwt-secret";
const CACHE_TOKEN = process.env.NEXT_PUBLIC_CACHE_TOKEN || "";

const CV_COOKIE = "cv";

// These routes are always public — no auth required
const PUBLIC_ROUTES = [
  "/api/admin/auth/login", // login endpoint must be public
  "/api/auth/jwt",
  "/api/copywriting",
  "/api/assets/images",
  "/api/revalidate",
  "/docs/api",
  "/tools/api-tester",
];

// These routes require a valid auth-token cookie
const PROTECTED_ROUTES = [
  "/api/admin",
];

// Paths that never get a cache-bust redirect
const SKIP_CACHE_BUST = [
  "/api/",
  "/_next/",
  "/favicon",
  "/icons/",
  "/images/",
  "/fonts/",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.json",
  "/cache-buster.json",
  "/visitor-tracker.js",
  "/docs/",
  "/admin/",
];

// ---------------------------------------------------------------------------
// Proxy
// ---------------------------------------------------------------------------

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // ── 1. Public routes — always allow ───────────────────────────────────────
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // ── 2. Protected routes — require valid auth-token cookie ─────────────────
  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    try {
      jwt.verify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
  }

  // ── 3. Cache-busting redirect — page visits only, once per token ──────────
  const skipCacheBust =
    !CACHE_TOKEN ||
    SKIP_CACHE_BUST.some((prefix) => pathname.startsWith(prefix));

  if (!skipCacheBust) {
    const urlToken    = searchParams.get("_cb");
    const cookieToken = request.cookies.get(CV_COOKIE)?.value;

    if (urlToken === CACHE_TOKEN || cookieToken === CACHE_TOKEN) {
      // Stamp cookie if arrived via URL but cookie not yet set
      if (urlToken === CACHE_TOKEN && cookieToken !== CACHE_TOKEN) {
        const res = NextResponse.next();
        res.cookies.set(CV_COOKIE, CACHE_TOKEN, {
          path: "/", maxAge: 60 * 60 * 24, httpOnly: false, sameSite: "lax",
        });
        return res;
      }
      return NextResponse.next();
    }

    // First visit or stale token — redirect with ?_cb=<token>
    const url = request.nextUrl.clone();
    url.searchParams.set("_cb", CACHE_TOKEN);
    const res = NextResponse.redirect(url, { status: 302 });
    res.cookies.set(CV_COOKIE, CACHE_TOKEN, {
      path: "/", maxAge: 60 * 60 * 24, httpOnly: false, sameSite: "lax",
    });
    return res;
  }

  return NextResponse.next();
}

// ---------------------------------------------------------------------------
// Matcher
// ---------------------------------------------------------------------------

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
