import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface ImageData {
  path: string;
  name: string;
  size: number;
  type: string;
}

// Common image directories to scan
const IMAGE_DIRECTORIES = [
  'public/images',
  'public/assets/images',
  'public/projects',
  'public/founders',
  'public/articles'
];

// Supported image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'];

function scanDirectory(dirPath: string, basePath: string = ''): ImageData[] {
  const images: ImageData[] = [];
  
  try {
    if (!fs.existsSync(dirPath)) {
      return images;
    }

    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        // Recursively scan subdirectories
        images.push(...scanDirectory(itemPath, path.join(basePath, item)));
      } else {
        // Check if it's an image file
        const ext = path.extname(item).toLowerCase();
        if (IMAGE_EXTENSIONS.includes(ext)) {
          const relativePath = path.join(basePath, item).replace(/\\/g, '/');
          const publicPath = '/' + relativePath;
          
          images.push({
            path: publicPath,
            name: item,
            size: stat.size,
            type: `image/${ext.slice(1)}`
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
  }
  
  return images;
}

// GET - Get all images
export async function GET() {
  try {
    const allImages: ImageData[] = [];
    
    // Scan all image directories
    for (const dir of IMAGE_DIRECTORIES) {
      const fullPath = path.join(process.cwd(), dir);
      const images = scanDirectory(fullPath, dir.replace('public/', ''));
      allImages.push(...images);
    }
    
    // Remove duplicates and sort
    const uniqueImages = allImages.filter((image, index, self) =>
      index === self.findIndex(img => img.path === image.path)
    );
    
    uniqueImages.sort((a, b) => a.path.localeCompare(b.path));
    
    return NextResponse.json({
      success: true,
      images: uniqueImages,
      count: uniqueImages.length
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    
    // Return fallback images if scanning fails
    const fallbackImages: ImageData[] = [
      { path: '/images/logo.svg', name: 'logo.svg', size: 0, type: 'image/svg+xml' },
      { path: '/images/hero-bg.jpg', name: 'hero-bg.jpg', size: 0, type: 'image/jpeg' },
      { path: '/images/stiven.webp', name: 'stiven.webp', size: 0, type: 'image/webp' },
      { path: '/images/ferdy.webp', name: 'ferdy.webp', size: 0, type: 'image/webp' },
      { path: '/images/projects/umkm-manager-1.jpg', name: 'umkm-manager-1.jpg', size: 0, type: 'image/jpeg' },
      { path: '/images/projects/umkm-manager-2.jpg', name: 'umkm-manager-2.jpg', size: 0, type: 'image/jpeg' },
      { path: '/images/projects/content-kit-1.jpg', name: 'content-kit-1.jpg', size: 0, type: 'image/jpeg' },
      { path: '/images/projects/content-kit-2.jpg', name: 'content-kit-2.jpg', size: 0, type: 'image/jpeg' },
      { path: '/images/projects/dev-utils-1.jpg', name: 'dev-utils-1.jpg', size: 0, type: 'image/jpeg' },
    ];
    
    return NextResponse.json({
      success: true,
      images: fallbackImages,
      count: fallbackImages.length
    });
  }
}
