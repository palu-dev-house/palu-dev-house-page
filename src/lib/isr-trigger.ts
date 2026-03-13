import { NextRequest, NextResponse } from 'next/server';

interface RevalidateOptions {
  secret?: string;
  paths?: string[];
  invalidateAll?: boolean;
  message?: string;
}

// Trigger ISR revalidation
export async function triggerRevalidation(options: RevalidateOptions = {}) {
  const {
    secret = process.env.REVALIDATE_SECRET || 'palu-dev-house-secret',
    paths = ['/'],
    invalidateAll = false,
    message = 'Content updated successfully'
  } = options;

  try {
    const revalidateUrl = new URL('/api/revalidate', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
    
    const response = await fetch(revalidateUrl.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret,
        paths,
        invalidateAll
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to trigger revalidation');
    }

    const result = await response.json();
    
    return {
      success: true,
      message: message || 'ISR revalidation triggered successfully',
      revalidated: result.revalidated,
      invalidated: result.invalidated
    };
  } catch (error) {
    console.error('ISR revalidation error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      error: error
    };
  }
}

// API endpoint for manual ISR trigger
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await triggerRevalidation(body);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { error: result.message, details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Manual ISR trigger error:', error);
    return NextResponse.json(
      { error: 'Failed to trigger ISR revalidation' },
      { status: 500 }
    );
  }
}
