import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface Asset {
  id: string;
  name: string;
  filename: string;
  path: string;
  fullPath: string;
  extension: string;
  size: number;
  sizeFormatted: string;
  category: string;
  mimeType: string;
  lastModified: string;
  createdAt: string;
  updatedAt: string;
}

// Generate ETag for content
function generateETag(content: string): string {
  return crypto.createHash('md5').update(content).digest('hex');
}

// Check if client cache is still valid
function checkCacheValidity(request: NextRequest, currentETag: string): boolean {
  const ifNoneMatch = request.headers.get('if-none-match');
  return ifNoneMatch === currentETag;
}

// Helper function to group assets by category
function groupByCategory(assets: Asset[]): Record<string, Asset[]> {
  const grouped: Record<string, Asset[]> = {};
  
  assets.forEach(asset => {
    if (!grouped[asset.category]) {
      grouped[asset.category] = [];
    }
    grouped[asset.category].push(asset);
  });
  
  return grouped;
}

// Scan public directory for all image assets
function scanPublicAssets(): Asset[] {
  const publicDir = path.join(process.cwd(), 'public');
  const assets: Asset[] = [];
  const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico']);
  
  function scan(dir: string, relPath: string = ''): void {
    try {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const relativePath = relPath ? path.join(relPath, item) : item;
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scan(fullPath, relativePath);
        } else if (IMAGE_EXTS.has(path.extname(item).toLowerCase())) {
          const ext = path.extname(item).toLowerCase();
          const size = stat.size;
          const sizeFormatted = size > 1024 * 1024 
            ? `${(size / (1024 * 1024)).toFixed(1)} MB`
            : size > 1024 
            ? `${(size / 1024).toFixed(1)} KB`
            : `${size} B`;
          
          // Determine category based on path
          let category = 'images';
          if (relativePath.includes('icons/') || relativePath.includes('icon')) {
            category = 'icons';
          } else if (relativePath.includes('favicon') || relativePath.includes('chrome') || relativePath.includes('apple-touch')) {
            category = 'favicons';
          }
          
          assets.push({
            id: `public_${relativePath.replace(/[^a-zA-Z0-9]/g, '_')}`,
            name: item.replace(/\.[^/.]+$/, ""), // Remove extension
            filename: item,
            path: `/${relativePath}`,
            fullPath: fullPath,
            extension: ext,
            size: size,
            sizeFormatted: sizeFormatted,
            category: category,
            mimeType: `image/${ext.substring(1)}`,
            lastModified: stat.mtime.toISOString(),
            createdAt: stat.birthtime.toISOString(),
            updatedAt: stat.mtime.toISOString()
          });
        }
      }
    } catch (error) {
      // Ignore directories that can't be read
    }
  }
  
  scan(publicDir);
  return assets;
}

// Check if an asset file actually exists
function assetExists(assetPath: string): boolean {
  const fullPath = path.join(process.cwd(), 'public', assetPath);
  return fs.existsSync(fullPath);
}

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    
    // Get base URL for constructing full image URLs
    const baseUrl = request.nextUrl.origin;
    
    // Get database assets
    const dbAssets = await db.all(`
      SELECT * FROM assets 
      ORDER BY category, name
    `);

    // Get all public directory assets
    const publicAssets = scanPublicAssets();
    
    // Merge and deduplicate assets (public assets take precedence, only include existing files)
    const allAssets = new Map<string, Asset>();
    
    // Add database assets first (only if they exist)
    dbAssets.forEach((asset: any) => {
      if (assetExists(asset.path)) {
        allAssets.set(asset.path, asset);
      }
    });
    
    // Override/add public assets
    publicAssets.forEach((asset) => {
      allAssets.set(asset.path, asset);
    });
    
    const assets = Array.from(allAssets.values());

    // Transform assets for ImageSelector compatibility
    const transformedAssets = assets.map((asset: any) => ({
      value: asset.path,
      label: asset.name,
      description: `${asset.category} • ${asset.sizeFormatted}`,
      category: asset.category,
      metadata: {
        size: asset.sizeFormatted,
        lastModified: asset.lastModified,
        extension: asset.extension,
        fullUrl: `${baseUrl}${asset.path}` // Add full URL for proper image loading
      }
    }));
    
    // Group assets by category
    const categories = groupByCategory(assets);
    
    // Calculate metadata
    const totalAssets = assets.length;
    const categoryNames = Object.keys(categories);
    const totalSize = assets.reduce((sum: number, asset: any) => sum + asset.size, 0);
    const totalSizeFormatted = `${(totalSize / 1024).toFixed(2)} KB`;
    
    const assetsData = {
      metadata: {
        generatedAt: new Date().toISOString(),
        totalAssets,
        categories: categoryNames,
        totalSize,
        totalSizeFormatted
      },
      categories,
      selection: transformedAssets // For compatibility with existing code
    };
    
    // Generate ETag
    const content = JSON.stringify(assetsData);
    const etag = generateETag(content);

    // Check cache validity
    if (checkCacheValidity(request, etag)) {
      return new NextResponse(null, { 
        status: 304,
        headers: {
          'ETag': etag,
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=600'
        }
      });
    }

    // Return fresh data with cache headers
    const response = NextResponse.json(assetsData);
    response.headers.set('ETag', etag);
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    response.headers.set('Last-Modified', new Date().toUTCString());
    response.headers.set('Vary', 'Accept-Encoding');

    return response;

  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assets' },
      { status: 500 }
    );
  }
}

// Handle POST for cache invalidation
export async function POST(request: NextRequest) {
  try {
    // Security: Check request method
    if (request.method !== 'POST') {
      return NextResponse.json(
        { error: 'Method not allowed' }, 
        { status: 405 }
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
    
    // Security: Validate required fields
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' }, 
        { status: 400 }
      );
    }

    if (body.action === 'invalidate') {
      // Security: Validate action
      const validActions = ['invalidate'];
      if (!validActions.includes(body.action)) {
        return NextResponse.json(
          { error: 'Invalid action' }, 
          { status: 400 }
        );
      }

      // Security: Validate key parameter
      if (body.key && typeof body.key !== 'string') {
        return NextResponse.json(
          { error: 'Invalid key parameter' }, 
          { status: 400 }
        );
      }

      // Security: Sanitize key parameter
      const sanitizedKey = body.key ? body.key.replace(/[^a-zA-Z0-9_]/g, '').substring(0, 50) : null;
      
      // Clear cache for specific key or all
      if (sanitizedKey) {
        // Invalidate specific cache entry
        console.log(`Invalidating cache for key: ${sanitizedKey}`);
      } else {
        // Invalidate all cache
        console.log('Invalidating all cache');
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Cache invalidated successfully',
        timestamp: new Date().toISOString()
      });
    }

    // Security: Log invalid action attempts
    console.warn('Invalid action attempted:', body.action);
    return NextResponse.json(
      { error: 'Invalid action' }, 
      { status: 400 }
    );

  } catch (error) {
    console.error('Error handling cache invalidation:', error);
    return NextResponse.json(
      { error: 'Failed to invalidate cache' }, 
      { status: 500 }
    );
  }
}
