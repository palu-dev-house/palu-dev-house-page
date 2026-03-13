#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function scanAssets() {
  const publicDir = path.join(__dirname, '../public');
  const dataDir = path.join(__dirname, '../data');
  const assetsFile = path.join(dataDir, 'assets.json');
  
  // Ensure data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const assets = {
    images: [],
    icons: [],
    documents: [],
    other: [],
    lastScanned: new Date().toISOString()
  };
  
  function scanDirectory(dir, category) {
    if (!fs.existsSync(dir)) {
      console.log(`⚠️  Directory ${dir} does not exist, skipping...`);
      return;
    }
    
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      if (item.isFile()) {
        const fullPath = path.join(dir, item.name);
        const relativePath = path.relative(publicDir, fullPath);
        const stats = fs.statSync(fullPath);
        
        const asset = {
          name: item.name,
          path: relativePath,
          size: stats.size,
          lastModified: stats.mtime.toISOString(),
          type: path.extname(item.name).toLowerCase()
        };
        
        assets[category].push(asset);
      } else if (item.isDirectory() && category === 'images') {
        // Recursively scan subdirectories in images
        scanDirectory(path.join(dir, item.name), category);
      }
    }
  }
  
  console.log('📁 Scanning assets...');
  
  // Scan different asset categories
  scanDirectory(path.join(publicDir, 'images'), 'images');
  scanDirectory(path.join(publicDir, 'icons'), 'icons');
  scanDirectory(path.join(publicDir, 'docs'), 'documents');
  
  // Find any other files in public root
  const publicItems = fs.readdirSync(publicDir, { withFileTypes: true });
  for (const item of publicItems) {
    if (item.isFile()) {
      const ext = path.extname(item.name).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico'].includes(ext)) {
        continue; // Already handled by images/icons
      }
      
      const fullPath = path.join(publicDir, item.name);
      const stats = fs.statSync(fullPath);
      
      const asset = {
        name: item.name,
        path: item.name,
        size: stats.size,
        lastModified: stats.mtime.toISOString(),
        type: ext
      };
      
      assets.other.push(asset);
    }
  }
  
  // Write assets.json
  fs.writeFileSync(assetsFile, JSON.stringify(assets, null, 2));
  
  console.log(`✅ Scanned ${assets.images.length} images, ${assets.icons.length} icons, ${assets.documents.length} documents, ${assets.other.length} other files`);
  console.log(`📄 Assets saved to ${assetsFile}`);
  
  return assets;
}

if (require.main === module) {
  try {
    scanAssets();
    process.exit(0);
  } catch (error) {
    console.error('❌ Asset scanning failed:', error.message);
    process.exit(1);
  }
}

module.exports = { scanAssets };
