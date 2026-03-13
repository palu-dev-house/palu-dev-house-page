'use client';

import { useState, useEffect, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  etag: string;
  timestamp: number;
  expiresAt?: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum cache size
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize: number;
  private defaultTTL: number;

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize || 100;
    this.defaultTTL = options.ttl || 5 * 60 * 1000; // 5 minutes default
  }

  set<T>(key: string, data: T, etag: string, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      etag,
      timestamp: Date.now(),
      expiresAt: ttl ? Date.now() + ttl : Date.now() + this.defaultTTL
    };

    this.cache.set(key, entry);
    this.cleanup();
  }

  get<T>(key: string, expectedEtag?: string): { data: T; hit: boolean; etag: string } | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    // Check ETag match
    if (expectedEtag && entry.etag !== expectedEtag) {
      return null;
    }

    return {
      data: entry.data,
      hit: true,
      etag: entry.etag
    };
  }

  has(key: string, expectedEtag?: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) return false;
    
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    if (expectedEtag && entry.etag !== expectedEtag) {
      return false;
    }

    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Remove expired entries and maintain max size
  private cleanup(): void {
    const now = Date.now();
    
    // Remove expired entries
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt && now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }

    // Remove oldest entries if over max size
    if (this.cache.size > this.maxSize) {
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toDelete = entries.slice(0, this.cache.size - this.maxSize);
      toDelete.forEach(([key]) => this.cache.delete(key));
    }
  }
}

// Global cache instance
const globalCache = new MemoryCache({
  maxSize: 200,
  ttl: 10 * 60 * 1000 // 10 minutes
});

interface UseCachedDataOptions<T> {
  key: string;
  fetcher: () => Promise<{ data: T; etag: string }>;
  ttl?: number;
  staleWhileRevalidate?: boolean;
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
}

interface UseCachedDataResult<T> {
  data: T | null;
  etag: string | null;
  isLoading: boolean;
  error: Error | null;
  revalidate: () => Promise<void>;
  isValidating: boolean;
  hitRate: number;
}

export function useCachedData<T>({
  key,
  fetcher,
  ttl,
  staleWhileRevalidate = true,
  revalidateOnFocus = false,
  revalidateOnReconnect = true
}: UseCachedDataOptions<T>): UseCachedDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [etag, setEtag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [hitRate, setHitRate] = useState(0);
  
  const requestCountRef = useRef(0);
  const hitCountRef = useRef(0);

  const revalidate = async () => {
    setIsValidating(true);
    setError(null);

    try {
      const result = await fetcher();
      globalCache.set(key, result.data, result.etag, ttl);
      setData(result.data);
      setEtag(result.etag);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsValidating(false);
    }
  };

  const loadData = async () => {
    requestCountRef.current++;
    setIsLoading(true);
    setError(null);

    try {
      // Try cache first
      const cached = globalCache.get<T>(key, etag || undefined);
      
      if (cached) {
        hitCountRef.current++;
        setData(cached.data);
        setEtag(cached.etag);
        setIsLoading(false);
        setHitRate(hitCountRef.current / requestCountRef.current);
        return;
      }

      // Cache miss - fetch fresh data
      await revalidate();
      setHitRate(hitCountRef.current / requestCountRef.current);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setIsLoading(false);
    }
  };

  // Focus revalidation
  useEffect(() => {
    if (!revalidateOnFocus) return;

    const handleFocus = () => {
      if (document.visibilityState === 'visible') {
        revalidate();
      }
    };

    document.addEventListener('visibilitychange', handleFocus);
    return () => document.removeEventListener('visibilitychange', handleFocus);
  }, [revalidateOnFocus, key]);

  // Reconnect revalidation
  useEffect(() => {
    if (!revalidateOnReconnect) return;

    const handleReconnect = () => {
      revalidate();
    };

    window.addEventListener('online', handleReconnect);
    return () => window.removeEventListener('online', handleReconnect);
  }, [revalidateOnReconnect, key]);

  // Initial load
  useEffect(() => {
    loadData();
  }, [key]);

  return {
    data,
    etag,
    isLoading,
    error,
    revalidate,
    isValidating,
    hitRate
  };
}

// Hook for ISR-specific caching
export function useISRData<T>(
  key: string,
  fetcher: () => Promise<{ data: T; etag: string }>
) {
  return useCachedData<T>({
    key: `isr:${key}`,
    fetcher,
    ttl: 15 * 60 * 1000, // 15 minutes for ISR
    staleWhileRevalidate: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true
  });
}

// Export cache instance for manual operations
export { globalCache };
export { MemoryCache };
