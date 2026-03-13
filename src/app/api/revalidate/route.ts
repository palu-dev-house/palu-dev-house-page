import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Security: Check request method
    if (request.method !== 'POST') {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

    // Security: Apply rate limiting
    const rateLimitResult = rateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: rateLimitResult.error,
          message: 'Rate limit exceeded',
          retryAfter: rateLimitResult.resetTime 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.resetTime ? new Date(rateLimitResult.resetTime).toUTCString() : '',
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime ? new Date(rateLimitResult.resetTime).toUTCString() : ''
          }
        }
      );
    }

    // Security: Validate content type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Extract revalidation options
    const { paths, tags, invalidateAll } = body;
    
    // Security: Validate required fields
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Security: Verify secret
    const expectedSecret = process.env.REVALIDATE_SECRET || 'palu-dev-house-secret';
    if (!body.secret || typeof body.secret !== 'string') {
      return NextResponse.json(
        { error: 'Secret is required' },
        { status: 400 }
      );
    }

    if (body.secret !== expectedSecret) {
      console.warn('Invalid revalidation attempt from:', request.headers.get('x-forwarded-for') || 'unknown');
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Revalidate specific paths
    if (paths && Array.isArray(paths)) {
      paths.forEach((path: string) => {
        revalidatePath(path, 'page');
        console.log(`✅ Revalidated path: ${path}`);
      });
    }

    // Revalidate specific tags
    if (tags && Array.isArray(tags)) {
      tags.forEach((tag: string) => {
        revalidateTag(tag, 'page');
        console.log(`✅ Revalidated tag: ${tag}`);
      });
    }

    // Revalidate all common pages if requested
    if (invalidateAll) {
      const commonPaths = [
        '/',
        '/projects',
        '/articles',
        '/founders'
      ];
      
      const commonTags = [
        'projects',
        'articles',
        'assets',
        'pages'
      ];

      commonPaths.forEach((path: string) => {
        revalidatePath(path, 'page');
        console.log(`✅ Revalidated path: ${path}`);
      });

      commonTags.forEach((tag: string) => {
        revalidateTag(tag, 'page');
        console.log(`✅ Revalidated tag: ${tag}`);
      });
    }

    // Invalidate client cache for assets
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/assets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'invalidate',
          key: invalidateAll ? 'all' : 'assets'
        })
      });
      console.log('✅ Invalidated client cache');
    } catch (error) {
      console.warn('⚠️ Failed to invalidate client cache:', error);
    }

    return NextResponse.json({
      success: true,
      message: 'ISR revalidation completed successfully',
      revalidated: {
        paths: paths || [],
        tags: tags || [],
        invalidateAll: invalidateAll || false
      },
      timestamp: new Date().toISOString(),
      note: 'Since using static export, a rebuild may be required to see changes.'
    });

  } catch (error) {
    console.error('❌ ISR revalidation failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process revalidation request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check ISR status
export async function GET() {
  try {
    const status = {
      isr: 'active',
      lastRevalidation: null,
      cacheStatus: 'ready',
      supportedPaths: [
        '/',
        '/projects',
        '/projects/[slug]',
        '/articles',
        '/articles/[slug]',
        '/founders'
      ],
      supportedTags: [
        'projects',
        'articles',
        'assets',
        'pages'
      ],
      note: 'Static export detected - rebuild required for changes to take effect.'
    };

    return NextResponse.json(status);

  } catch (error) {
    console.error('❌ Failed to get ISR status:', error);
    return NextResponse.json({
      error: 'Failed to get ISR status'
    }, { status: 500 });
  }
}
