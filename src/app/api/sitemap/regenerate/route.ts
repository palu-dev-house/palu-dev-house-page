import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { revalidatePath, revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, paths = [] } = body;

    // Verify secret
    const expectedSecret = process.env.REVALIDATE_SECRET || 'palu-dev-house-secret';
    if (secret !== expectedSecret) {
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Revalidate sitemap and robots.txt
    revalidatePath('/sitemap.xml', 'page');
    revalidatePath('/robots.txt', 'page');
    revalidateTag('sitemap', 'page');

    // Revalidate additional paths if provided
    if (Array.isArray(paths) && paths.length > 0) {
      for (const path of paths) {
        revalidatePath(path, 'page');
      }
    }

    // Revalidate main pages
    const mainPaths = ['/', '/projects', '/articles', '/founders'];
    for (const path of mainPaths) {
      revalidatePath(path, 'page');
    }

    return NextResponse.json({
      message: 'Sitemap dan robots.txt berhasil diperbarui',
      revalidated: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { message: 'Gagal memperbarui sitemap', error: String(error) },
      { status: 500 }
    );
  }
}
