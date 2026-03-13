import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface CacheEntry {
  content: string;
  etag: string;
  lastModified: string;
  cacheControl: string;
}

// In-memory cache store (in production, you'd use Redis or similar)
const cacheStore = new Map<string, CacheEntry>();

// Generate cache key from URL and headers
function generateCacheKey(request: NextRequest): string {
  const url = new URL(request.url);
  const cacheKey = `${url.pathname}${url.search}`;
  return crypto.createHash('md5').update(cacheKey).digest('hex');
}

// Generate ETag for content
function generateETag(content: string): string {
  return crypto.createHash('md5').update(content).digest('hex');
}

// Check if client cache is still valid
function checkCacheValidity(request: NextRequest, currentETag: string): boolean {
  const ifNoneMatch = request.headers.get('if-none-match');
  const ifModifiedSince = request.headers.get('if-modified-since');
  
  return ifNoneMatch === currentETag;
}

// Get cached response or create new one
export function getCachedResponse(
  request: NextRequest, 
  content: string, 
  cacheControl: string = 'public, max-age=3600, stale-while-revalidate=7200'
): NextResponse {
  const cacheKey = generateCacheKey(request);
  const etag = generateETag(content);
  const lastModified = new Date().toUTCString();

  // Check if client cache is still valid
  if (checkCacheValidity(request, etag)) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        'ETag': etag,
        'Last-Modified': lastModified,
        'Cache-Control': cacheControl,
        'Vary': 'Accept-Encoding'
      }
    });
  }

  // Store in cache
  cacheStore.set(cacheKey, {
    content,
    etag,
    lastModified,
    cacheControl
  });

  // Return fresh response with cache headers
  return new NextResponse(content, {
    headers: {
      'ETag': etag,
      'Last-Modified': lastModified,
      'Cache-Control': cacheControl,
      'Vary': 'Accept-Encoding'
    }
  });
}

// Cache busting utilities
export function generateCacheBuster(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function addCacheBusterToUrl(url: string, buster?: string): string {
  const cacheBuster = buster || generateCacheBuster();
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_cb=${cacheBuster}`;
}

// Clear cache for specific pattern
export function clearCache(pattern?: string): void {
  if (pattern) {
    for (const [key] of cacheStore.entries()) {
      if (key.includes(pattern)) {
        cacheStore.delete(key);
      }
    }
  } else {
    cacheStore.clear();
  }
}

// Get cache statistics
export function getCacheStats(): {
  totalEntries: number;
  totalSize: number;
  entries: Array<{ key: string; size: number; lastModified: string }>;
} {
  const entries = Array.from(cacheStore.entries()).map(([key, entry]) => ({
    key,
    size: entry.content.length,
    lastModified: entry.lastModified
  }));

  return {
    totalEntries: cacheStore.size,
    totalSize: entries.reduce((sum, entry) => sum + entry.size, 0),
    entries
  };
}
