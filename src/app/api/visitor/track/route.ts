import { NextRequest, NextResponse } from 'next/server';

// Visitor tracking storage (in production, use database)
const visitorStore = new Map<string, {
  id: string;
  timestamp: number;
  ip: string;
  userAgent: string;
  referer?: string;
  page: string;
  session: string;
  country?: string;
  city?: string;
  device?: string;
  browser?: string;
  os?: string;
  isNewVisitor: boolean;
  visitCount: number;
  lastVisit?: number;
  duration?: number;
}>();

// Generate unique visitor ID
function generateVisitorId(): string {
  return `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Parse user agent string
function parseUserAgent(userAgent: string) {
  const ua = userAgent.toLowerCase();
  
  // Browser detection
  let browser = 'Unknown';
  if (ua.includes('chrome')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari')) browser = 'Safari';
  else if (ua.includes('edge')) browser = 'Edge';
  else if (ua.includes('opera')) browser = 'Opera';
  
  // OS detection
  let os = 'Unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('ios')) os = 'iOS';
  
  // Device detection
  let device = 'Desktop';
  if (ua.includes('mobile')) device = 'Mobile';
  else if (ua.includes('tablet')) device = 'Tablet';
  
  return { browser, os, device };
}

// Get client IP from request
function getClientIP(request: NextRequest): string {
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
  
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
         request.headers.get('x-real-ip') || 
         '127.0.0.1';
}

// Get geolocation data (in production, use real geolocation service)
async function getGeoLocation(ip: string): Promise<{ country?: string; city?: string }> {
  try {
    // Using ipapi.co for geolocation (you can replace with other services)
    const response = await fetch(`http://ipapi.co/json/${ip}`);
    const data = await response.json();
    
    return {
      country: data.country_code,
      city: data.city
    };
  } catch (error) {
    console.warn('Failed to get geolocation:', error);
    return {};
  }
}

// Get visitor session
function getVisitorSession(request: NextRequest): string {
  // Check for existing session cookie
  const sessionCookie = request.cookies.get('visitor_session');
  if (sessionCookie) {
    return sessionCookie.value;
  }
  
  // Generate new session
  const sessionId = generateVisitorId();
  return sessionId;
}

// Track visitor
export async function POST(request: NextRequest) {
  try {
    // Security: Only allow POST requests
    if (request.method !== 'POST') {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

    // Get visitor information
    const ip = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer');
    const page = referer ? new URL(referer).pathname : '/';
    const session = getVisitorSession(request);
    const now = Date.now();
    
    // Parse user agent
    const { browser, os, device } = parseUserAgent(userAgent);
    
    // Get geolocation
    const geoLocation = await getGeoLocation(ip);
    
    // Check if visitor exists
    let visitorData = visitorStore.get(session);
    let isNewVisitor = true;
    let visitCount = 1;
    let lastVisit = now;
    let duration = 0;
    
    if (visitorData) {
      // Existing visitor
      isNewVisitor = false;
      visitCount = visitorData.visitCount + 1;
      lastVisit = visitorData.timestamp;
      duration = now - visitorData.timestamp;
      
      // Update existing visitor data
      visitorData = {
        ...visitorData,
        visitCount,
        lastVisit: now,
        duration,
        userAgent,
        referer: referer || undefined,
        page: page || '/'
      };
    } else {
      // New visitor
      visitorData = {
        id: generateVisitorId(),
        timestamp: now,
        ip,
        userAgent,
        referer: referer || undefined,
        page: page || '/',
        session,
        country: geoLocation.country,
        city: geoLocation.city,
        browser,
        os,
        device,
        isNewVisitor: true,
        visitCount: 1,
        lastVisit: now
      };
    }
    
    // Store visitor data
    visitorStore.set(session, visitorData);
    
    // Set session cookie
    const response = NextResponse.json({
      success: true,
      visitor: {
        id: visitorData.id,
        isNewVisitor,
        visitCount: visitorData.visitCount,
        country: visitorData.country,
        city: visitorData.city,
        browser: visitorData.browser,
        os: visitorData.os,
        device: visitorData.device,
        page: visitorData.page,
        referer: visitorData.referer,
        session: visitorData.session
      }
    });
    
    // Set session cookie (expires in 24 hours)
    response.cookies.set('visitor_session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24 hours
    });
    
    // Log visitor tracking
    console.log(`📍 Visitor tracked: ${visitorData.id} | ${visitorData.browser} on ${visitorData.os} | ${visitorData.device} | ${visitorData.country || 'Unknown'} | Page: ${visitorData.page}`);
    
    return response;
    
  } catch (error) {
    console.error('Visitor tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track visitor' },
      { status: 500 }
    );
  }
}

// Get visitor analytics
export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get('visitor_session');
    
    if (!session) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 404 }
      );
    }
    
    const visitorData = visitorStore.get(session.value);
    
    if (!visitorData) {
      return NextResponse.json(
        { error: 'Visitor data not found' },
        { status: 404 }
      );
    }
    
    // Get all visitors data
    const allVisitors = Array.from(visitorStore.values());
    
    // Calculate analytics
    const totalVisitors = allVisitors.length;
    const uniqueVisitors = allVisitors.filter(v => v.isNewVisitor).length;
    const returningVisitors = totalVisitors - uniqueVisitors;
    
    // Recent visitors (last 24 hours)
    const recentVisitors = allVisitors.filter(v => 
      Date.now() - v.timestamp < 24 * 60 * 60 * 1000
    );
    
    // Popular pages
    const pageCounts = allVisitors.reduce((acc, v) => {
      acc[v.page] = (acc[v.page] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const popularPages = Object.entries(pageCounts)
      .sort(([, a]: [string, number], [, b]: [string, number]) => b - a)
      .slice(0, 10)
      .map(([page, count]) => ({ page, count }));
    
    // Browser stats
    const browserStats = allVisitors.reduce((acc, v) => {
      const browser = v.browser || 'Unknown';
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const popularBrowsers = Object.entries(browserStats)
      .sort(([, a]: [string, number], [, b]: [string, number]) => b - a)
      .slice(0, 5)
      .map(([browser, count]) => ({ browser, count }));
    
    // OS stats
    const osStats = allVisitors.reduce((acc, v) => {
      const os = v.os || 'Unknown';
      acc[os] = (acc[os] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const popularOS = Object.entries(osStats)
      .sort(([, a]: [string, number], [, b]: [string, number]) => b - a)
      .slice(0, 5)
      .map(([os, count]) => ({ os, count }));
    
    // Device stats
    const deviceStats = allVisitors.reduce((acc, v) => {
      const device = v.device || 'Unknown';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const popularDevices = Object.entries(deviceStats)
      .sort(([, a]: [string, number], [, b]: [string, number]) => b - a)
      .slice(0, 5)
      .map(([device, count]) => ({ device, count }));
    
    // Country stats
    const countryStats = allVisitors.reduce((acc, v) => {
      if (v.country) {
        acc[v.country] = (acc[v.country] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    const popularCountries = Object.entries(countryStats)
      .sort(([, a]: [string, number], [, b]: [string, number]) => b - a)
      .slice(0, 10)
      .map(([country, count]) => ({ country, count }));
    
    return NextResponse.json({
      analytics: {
        summary: {
          totalVisitors,
          uniqueVisitors,
          returningVisitors,
          recentVisitors: recentVisitors.length
        },
        popularPages,
        popularBrowsers,
        popularOS,
        popularDevices,
        popularCountries
      },
      currentVisitor: visitorData,
      allVisitors: allVisitors.map(v => ({
        id: v.id,
        timestamp: v.timestamp,
        visitCount: v.visitCount,
        isNewVisitor: v.isNewVisitor,
        country: v.country,
        city: v.city,
        browser: v.browser,
        os: v.os,
        device: v.device,
        page: v.page,
        referer: v.referer,
        session: v.session
      }))
    });
    
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to get analytics' },
      { status: 500 }
    );
  }
}
