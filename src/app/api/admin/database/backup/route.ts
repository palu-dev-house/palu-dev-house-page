import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const db = await getDatabase();
    
    // Export all tables
    const articles = await db.all('SELECT * FROM articles ORDER BY createdAt DESC');
    const projects = await db.all('SELECT * FROM projects ORDER BY createdAt DESC');
    const copywriting = await db.all('SELECT * FROM copywriting ORDER BY section, order_index');
    
    const backup = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      tables: {
        articles,
        projects,
        copywriting
      },
      metadata: {
        totalArticles: articles.length,
        totalProjects: projects.length,
        totalCopywriting: copywriting.length,
        exportedBy: 'admin-api'
      }
    };

    // Create backup filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `palu-dev-house-backup-${timestamp}.json`;
    
    // Save backup to data/backups directory
    const backupsDir = path.join(process.cwd(), 'data', 'backups');
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }
    
    const backupPath = path.join(backupsDir, filename);
    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
    
    console.log(`📦 Backup created: ${filename}`);
    
    return NextResponse.json({
      success: true,
      message: 'Database backup created successfully',
      filename,
      backup,
      downloadUrl: `/api/admin/database/backup/download/${filename}`
    });
    
  } catch (error) {
    console.error('Error creating backup:', error);
    return NextResponse.json(
      { error: 'Failed to create backup' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { backup, overwrite } = body;
    
    if (!backup) {
      return NextResponse.json(
        { error: 'Backup data is required' },
        { status: 400 }
      );
    }

    // Validate backup structure
    if (!backup.tables || !backup.tables.articles || !backup.tables.projects || !backup.tables.copywriting) {
      return NextResponse.json(
        { error: 'Invalid backup structure' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    
    // Begin transaction for restore
    await db.run('BEGIN TRANSACTION');
    
    try {
      if (overwrite) {
        // Clear existing data
        console.log('🗑️ Clearing existing data...');
        await db.run('DELETE FROM articles');
        await db.run('DELETE FROM projects');
        await db.run('DELETE FROM copywriting');
      }
      
      // Restore articles
      console.log('📝 Restoring articles...');
      for (const article of backup.tables.articles) {
        await db.run(`
          INSERT INTO articles (
            id, title, excerpt, content, author, publishedAt, readTime, url,
            tags, featured, status, image, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          article.id, article.title, article.excerpt, article.content,
          article.author, article.publishedAt, article.readTime, article.url,
          article.tags, article.featured, article.status, article.image,
          article.createdAt, article.updatedAt
        ]);
      }
      
      // Restore projects
      console.log('📁 Restoring projects...');
      for (const project of backup.tables.projects) {
        await db.run(`
          INSERT INTO projects (
            id, title, description, type, featured, technologies, images, status,
            slug, demoUrl, githubUrl, client, completedAt, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          project.id, project.title, project.description, project.type,
          project.featured, project.technologies, project.images, project.status,
          project.slug, project.demoUrl, project.githubUrl, project.client,
          project.completedAt, project.createdAt, project.updatedAt
        ]);
      }
      
      // Restore copywriting
      console.log('✏️ Restoring copywriting...');
      for (const copy of backup.tables.copywriting) {
        await db.run(`
          INSERT INTO copywriting (
            id, section, key, value, type, order_index, isActive, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          copy.id, copy.section, copy.key, copy.value, copy.type,
          copy.order_index, copy.isActive, copy.createdAt, copy.updatedAt
        ]);
      }
      
      await db.run('COMMIT');
      
      console.log('✅ Database restored successfully');
      
      // Trigger ISR revalidation after restore
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          secret: process.env.REVALIDATE_SECRET || 'palu-dev-house-secret',
          paths: [
            '/',
            '/about',
            '/founders', 
            '/projects',
            '/contact',
            '/articles'
          ],
          invalidateAll: true
        }),
      });
      
      return NextResponse.json({
        success: true,
        message: 'Database restored successfully',
        restored: {
          articles: backup.tables.articles.length,
          projects: backup.tables.projects.length,
          copywriting: backup.tables.copywriting.length
        }
      });
      
    } catch (error) {
      await db.run('ROLLBACK');
      throw error;
    }
    
  } catch (error) {
    console.error('Error restoring backup:', error);
    return NextResponse.json(
      { error: 'Failed to restore backup' },
      { status: 500 }
    );
  }
}
