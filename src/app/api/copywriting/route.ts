import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { triggerRevalidation } from '@/lib/isr-trigger';
import { getCachedResponse } from '@/lib/server-cache';

interface CopywritingEntry {
  id: string;
  section: string;
  key: string;
  value: string;
  type: 'text' | 'json' | 'array';
  order_index: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Helper functions
function parseValue(value: string, type: string): any {
  if (type === 'json' || type === 'array') {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}

function stringifyValue(value: any, type: string): string {
  if (type === 'json' || type === 'array') {
    return JSON.stringify(value);
  }
  return String(value);
}

function groupBySection(entries: CopywritingEntry[]): Record<string, Record<string, any>> {
  const grouped: Record<string, Record<string, any>> = {};
  
  entries.forEach(entry => {
    if (!grouped[entry.section]) {
      grouped[entry.section] = {};
    }
    
    grouped[entry.section][entry.key] = parseValue(entry.value, entry.type);
  });
  
  return grouped;
}

// GET - Get all copywriting data or specific section
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    const admin = searchParams.get('admin');
    const db = await getDatabase();

    let query = admin === 'true' 
      ? 'SELECT * FROM copywriting ORDER BY section, order_index'
      : 'SELECT * FROM copywriting WHERE isActive = 1 ORDER BY section, order_index';
    const params: any[] = [];

    if (section) {
      query = admin === 'true'
        ? 'SELECT * FROM copywriting WHERE section = ? ORDER BY order_index'
        : 'SELECT * FROM copywriting WHERE section = ? AND isActive = 1 ORDER BY order_index';
      params.push(section);
    }

    const entries = await db.all(query, params);

    if (admin === 'true') {
      // Return all entries for admin interface
      const grouped: Record<string, CopywritingEntry[]> = {};
      entries.forEach((entry: CopywritingEntry) => {
        if (!grouped[entry.section]) {
          grouped[entry.section] = [];
        }
        grouped[entry.section].push(entry);
      });

      const response = NextResponse.json({
        success: true,
        data: grouped
      });

      // Add caching for admin requests (shorter cache time)
      return getCachedResponse(request, JSON.stringify(response.body), 'private, max-age=60');
    }

    if (section) {
      // Return specific section data
      const sectionData: Record<string, any> = {};
      entries.forEach((entry: CopywritingEntry) => {
        sectionData[entry.key] = parseValue(entry.value, entry.type);
      });

      const response = NextResponse.json({ section, data: sectionData });
      
      // Add caching for section requests
      return getCachedResponse(request, JSON.stringify(response.body), 'public, max-age=1800, stale-while-revalidate=3600');
    }

    // Return all copywriting data grouped by section
    const grouped = groupBySection(entries);

    // Format to match the original copywriting.json structure
    const formatted = {
      landingPage: {
        hero: grouped.hero || {},
        story: grouped.story || {},
        about: {
          title: grouped.about?.title || '',
          subtitle: grouped.about?.subtitle || '',
          origin: {
            title: grouped.about?.origin_title || '',
            content: grouped.about?.origin_content || ''
          },
          background: {
            title: grouped.about?.background_title || '',
            content: grouped.about?.background_content || ''
          },
          mission: {
            title: grouped.about?.mission_title || '',
            content: grouped.about?.mission_content || ''
          }
        },
        philosophy: {
          title: grouped.philosophy?.title || '',
          subtitle: grouped.philosophy?.subtitle || '',
          items: grouped.philosophy?.items || []
        },
        focus: {
          title: grouped.focus?.title || '',
          subtitle: grouped.focus?.subtitle || '',
          items: grouped.focus?.items || []
        },
        founders: {
          title: grouped.founders?.title || '',
          subtitle: grouped.founders?.subtitle || '',
          items: grouped.founders?.items || []
        },
        projects: {
          title: grouped.projects?.title || '',
          subtitle: grouped.projects?.subtitle || '',
          viewAll: grouped.projects?.viewAll || ''
        },
        articles: {
          title: grouped.articles?.title || '',
          subtitle: grouped.articles?.subtitle || '',
          viewAll: grouped.articles?.viewAll || '',
          medium: grouped.articles?.medium || []
        },
        contact: {
          title: grouped.contact?.title || '',
          subtitle: grouped.contact?.subtitle || '',
          email: grouped.contact?.email || '',
          phone: grouped.contact?.phone || '',
          location: grouped.contact?.location || ''
        },
        footer: {
          brand: {
            name: grouped.footer?.brand_name || '',
            description: grouped.footer?.brand_description || ''
          },
          social: {
            github: grouped.footer?.social_github || '',
            linkedin: grouped.footer?.social_linkedin || '',
            twitter: grouped.footer?.social_twitter || ''
          },
          quickLinks: {
            title: grouped.footer?.quicklinks_title || '',
            links: [
              { label: "Tentang Kami", href: "/#about", icon: "Users" },
              { label: "Proyek", href: "/#projects", icon: "Briefcase" },
              { label: "Artikel", href: "/articles", icon: "Globe" },
              { label: "Admin", href: "/admin", icon: "Settings" },
            ]
          },
          contact: { title: grouped.footer?.contact_title || '' },
          copyright: grouped.footer?.copyright || ''
        },
        navigation: {
          brand: {
            name: grouped.navigation?.brand_name || '',
            tagline: grouped.navigation?.brand_tagline || ''
          },
          links: grouped.navigation?.links || []
        }
      },
      meta: {
        version: 1,
        lastUpdated: new Date().toISOString(),
        updatedBy: 'system'
      }
    };

    const response = NextResponse.json(formatted);
    
    // Add caching for full data requests (longer cache time)
    return getCachedResponse(request, JSON.stringify(response.body), 'public, max-age=3600, stale-while-revalidate=7200');
  } catch (error) {
    console.error('Error fetching copywriting:', error);
    return NextResponse.json(
      { error: 'Failed to fetch copywriting' },
      { status: 500 }
    );
  }
}

// POST - Update copywriting data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDatabase();

    // Begin transaction
    await db.run('BEGIN TRANSACTION');

    try {
      // Update each copywriting entry
      for (const [section, sectionData] of Object.entries(body.landingPage || {})) {
        if (typeof sectionData === 'object' && sectionData !== null) {
          await updateSection(db, section, sectionData);
        }
      }

      // Update footer and navigation sections
      if (body.landingPage?.footer) {
        await updateSection(db, 'footer', body.landingPage.footer);
      }
      if (body.landingPage?.navigation) {
        await updateSection(db, 'navigation', body.landingPage.navigation);
      }

      // Update meta information
      const meta = body.meta || {};
      await db.run(`
        UPDATE copywriting SET updatedAt = ? 
        WHERE section IN ('hero', 'story', 'about', 'philosophy', 'focus', 'founders', 'projects', 'articles', 'contact', 'footer', 'navigation')
      `, [new Date().toISOString()]);

      await db.run('COMMIT');

      // Trigger ISR revalidation for all pages
      await triggerRevalidation({
        invalidateAll: true,
        message: 'Copywriting updated successfully'
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Copywriting updated successfully'
      });
    } catch (error) {
      await db.run('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error updating copywriting:', error);
    return NextResponse.json(
      { error: 'Failed to update copywriting' },
      { status: 500 }
    );
  }
}

// PUT - Update single copywriting entry
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDatabase();

    if (body.id) {
      // Update existing entry
      const updates: any = {
        updatedAt: new Date().toISOString()
      };

      // Only update provided fields
      if (body.section !== undefined) updates.section = body.section;
      if (body.key !== undefined) updates.key = body.key;
      if (body.value !== undefined) updates.value = body.value;
      if (body.type !== undefined) updates.type = body.type;
      if (body.order_index !== undefined) updates.order_index = body.order_index;
      if (body.isActive !== undefined) updates.isActive = body.isActive ? 1 : 0;

      // Build dynamic UPDATE query
      const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);
      values.push(body.id);

      const result = await db.run(`
        UPDATE copywriting SET ${setClause} WHERE id = ?
      `, values);

      if (result.changes === 0) {
        return NextResponse.json(
          { error: 'Failed to update copywriting entry' },
          { status: 500 }
        );
      }

      // Trigger ISR revalidation
      await triggerRevalidation({
        invalidateAll: true,
        message: 'Copywriting entry updated successfully'
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Copywriting entry updated successfully'
      });
    } else {
      // Create new entry
      const newEntry = {
        id: `copy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        section: body.section || '',
        key: body.key || '',
        value: body.value || '',
        type: body.type || 'text',
        order_index: body.order_index || 0,
        isActive: body.isActive !== undefined ? body.isActive : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await db.run(`
        INSERT INTO copywriting (id, section, key, value, type, order_index, isActive, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        newEntry.id, newEntry.section, newEntry.key, newEntry.value, 
        newEntry.type, newEntry.order_index, newEntry.isActive ? 1 : 0,
        newEntry.createdAt, newEntry.updatedAt
      ]);

      // Trigger ISR revalidation
      await triggerRevalidation({
        invalidateAll: true,
        message: 'Copywriting entry created successfully'
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Copywriting entry created successfully'
      });
    }
  } catch (error) {
    console.error('Error updating copywriting:', error);
    return NextResponse.json(
      { error: 'Failed to update copywriting' },
      { status: 500 }
    );
  }
}

// DELETE - Delete copywriting entry
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDatabase();

    if (!body.id) {
      return NextResponse.json(
        { error: 'Entry ID is required' },
        { status: 400 }
      );
    }

    const result = await db.run('DELETE FROM copywriting WHERE id = ?', [body.id]);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Copywriting entry not found' },
        { status: 404 }
      );
    }

    // Trigger ISR revalidation
    await triggerRevalidation({
      invalidateAll: true,
      message: 'Copywriting entry deleted successfully'
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Copywriting entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting copywriting:', error);
    return NextResponse.json(
      { error: 'Failed to delete copywriting' },
      { status: 500 }
    );
  }
}

// Helper function to update a section
async function updateSection(db: any, section: string, data: any) {
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Nested object (like about.origin, about.background, etc.)
      await updateNestedObject(db, section, key, value);
    } else {
      // Simple value
      await updateSingleValue(db, section, key, value);
    }
  }
}

// Helper function to update nested objects
async function updateNestedObject(db: any, section: string, parentKey: string, data: any) {
  for (const [key, value] of Object.entries(data)) {
    const fullKey = `${parentKey}_${key}`;
    await updateSingleValue(db, section, fullKey, value);
  }
}

// Helper function to update a single value
async function updateSingleValue(db: any, section: string, key: string, value: any) {
  const type = Array.isArray(value) || typeof value === 'object' ? 'json' : 'text';
  const stringValue = stringifyValue(value, type);
  
  await db.run(`
    INSERT OR REPLACE INTO copywriting (id, section, key, value, type, order_index, isActive, createdAt, updatedAt)
    VALUES (
      COALESCE((SELECT id FROM copywriting WHERE section = ? AND key = ?), ?),
      ?, ?, ?, ?, 1, 1,
      COALESCE((SELECT createdAt FROM copywriting WHERE section = ? AND key = ?), ?),
      ?
    )
  `, [
    section, key, `${section}_${key}`,
    section, key, stringValue, type,
    section, key, new Date().toISOString(),
    new Date().toISOString()
  ]);
}
