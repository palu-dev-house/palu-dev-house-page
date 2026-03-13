import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    // Validate filename to prevent directory traversal
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json(
        { error: 'Invalid filename' },
        { status: 400 }
      );
    }

    const backupsDir = path.join(process.cwd(), 'data', 'backups');
    const filePath = path.join(backupsDir, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Backup file not found' },
        { status: 404 }
      );
    }

    // Check if file is actually a backup file
    if (!filename.endsWith('.json') || !filename.startsWith('palu-dev-house-backup-')) {
      return NextResponse.json(
        { error: 'Invalid backup file' },
        { status: 400 }
      );
    }

    // Read file
    const fileBuffer = fs.readFileSync(filePath);
    const stats = fs.statSync(filePath);
    
    // Return file as download
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': stats.size.toString(),
        'Cache-Control': 'no-cache'
      }
    });
    
  } catch (error) {
    console.error('Error downloading backup:', error);
    return NextResponse.json(
      { error: 'Failed to download backup' },
      { status: 500 }
    );
  }
}
