import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const backupsDir = path.join(process.cwd(), 'data', 'backups');
    
    // Check if backups directory exists
    if (!fs.existsSync(backupsDir)) {
      return NextResponse.json({
        success: true,
        backups: [],
        message: 'No backups directory found'
      });
    }
    
    // Read all backup files
    const files = fs.readdirSync(backupsDir);
    
    // Filter and sort backup files
    const backupFiles = files
      .filter(file => file.endsWith('.json') && file.startsWith('palu-dev-house-backup-'))
      .map(file => {
        const filePath = path.join(backupsDir, file);
        const stats = fs.statSync(filePath);
        
        // Extract timestamp from filename
        const timestampMatch = file.match(/palu-dev-house-backup-(.+)\.json/);
        const timestamp = timestampMatch ? timestampMatch[1] : null;
        
        return {
          filename: file,
          size: stats.size,
          createdAt: stats.birthtime.toISOString(),
          modifiedAt: stats.mtime.toISOString(),
          timestamp,
          downloadUrl: `/api/admin/database/backup/download/${file}`
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return NextResponse.json({
      success: true,
      backups: backupFiles,
      total: backupFiles.length
    });
    
  } catch (error) {
    console.error('Error listing backups:', error);
    return NextResponse.json(
      { error: 'Failed to list backups' },
      { status: 500 }
    );
  }
}
