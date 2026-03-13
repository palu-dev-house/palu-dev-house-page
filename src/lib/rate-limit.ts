import { NextRequest, NextResponse } from 'next/server';

// Rate limiting storage (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per window
  message: 'Too many requests from this IP'
};

// Get client IP from request
function getClientIP(request: NextRequest): string {
  // Try various headers for real IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback to request IP (may be proxy)
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
         request.headers.get('x-real-ip') || 
         '127.0.0.1';
}

// Rate limiting middleware
export function rateLimit(request: NextRequest): { 
  success: boolean; 
  remaining?: number; 
  resetTime?: number;
  error?: string;
} {
  const clientIP = getClientIP(request);
  const now = Date.now();
  
  // Get or create rate limit entry
  let rateData = rateLimitStore.get(clientIP);
  
  if (!rateData) {
    rateData = {
      count: 0,
      resetTime: now + RATE_LIMIT.windowMs
    };
    rateLimitStore.set(clientIP, rateData);
  }
  
  // Check if window has expired
  if (now > rateData.resetTime) {
    rateData.count = 0;
    rateData.resetTime = now + RATE_LIMIT.windowMs;
  }
  
  // Increment request count
  rateData.count++;
  rateLimitStore.set(clientIP, rateData);
  
  // Check if rate limit exceeded
  if (rateData.count > RATE_LIMIT.maxRequests) {
    return {
      success: false,
      error: RATE_LIMIT.message,
      remaining: 0,
      resetTime: rateData.resetTime
    };
  }
  
  return {
    success: true,
    remaining: RATE_LIMIT.maxRequests - rateData.count,
    resetTime: rateData.resetTime
  };
}

// Clean up old entries periodically (in production, use a proper cache)
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 5 * 60 * 1000); // Clean every 5 minutes
