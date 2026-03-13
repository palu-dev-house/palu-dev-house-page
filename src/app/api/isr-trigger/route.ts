import { NextRequest, NextResponse } from 'next/server';
import { triggerRevalidation } from '@/lib/isr-trigger';

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
