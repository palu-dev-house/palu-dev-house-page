#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function convertImages(dryRun = true, cleanup = false) {
  const publicDir = path.join(__dirname, '../public');
  const imagesDir = path.join(publicDir, 'images');
  
  if (!fs.existsSync(imagesDir)) {
    console.log('⚠️  Images directory does not exist, skipping...');
    return [];
  }
  
  const convertibleExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff'];
  const convertedFiles = [];
  
  function scanDirectory(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase();
        
        if (convertibleExtensions.includes(ext)) {
          const webpPath = fullPath.replace(ext, '.webp');
          
          if (!fs.existsSync(webpPath)) {
            if (dryRun) {
              console.log(`🔍 Would convert: ${item.name} -> ${item.name.replace(ext, '.webp')}`);
              convertedFiles.push({
                original: fullPath,
                webp: webpPath,
                action: 'would_convert'
              });
            } else {
              console.log(`⚠️  WebP conversion requires sharp package. Install with: npm install sharp`);
              console.log(`🔄 Skipping conversion for: ${item.name}`);
            }
          } else {
            console.log(`✅ WebP version exists: ${item.name.replace(ext, '.webp')}`);
            
            // If cleanup is enabled and WebP exists, remove original PNG
            if (cleanup && ext === '.png') {
              try {
                fs.unlinkSync(fullPath);
                console.log(`🗑️  Removed original PNG: ${item.name}`);
                convertedFiles.push({
                  original: fullPath,
                  webp: webpPath,
                  action: 'cleaned'
                });
              } catch (error) {
                console.log(`⚠️  Failed to remove ${item.name}: ${error.message}`);
              }
            }
          }
        }
      }
    }
  }
  
  console.log(dryRun ? '🔍 Checking WebP conversion (dry run)...' : '🖼️  Converting images to WebP...');
  scanDirectory(imagesDir);
  
  if (dryRun && convertedFiles.length > 0) {
    console.log(`\n📊 Found ${convertedFiles.length} files that could be converted to WebP`);
    console.log('💡 Run "npm run convert-images" to perform actual conversion');
  } else if (!dryRun) {
    console.log(`\n✅ Processed ${convertedFiles.length} files`);
  }
  
  return convertedFiles;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const dryRun = !args.includes('--force');
  const cleanup = args.includes('--cleanup');
  
  try {
    convertImages(dryRun, cleanup);
    process.exit(0);
  } catch (error) {
    console.error('❌ Image conversion failed:', error.message);
    process.exit(1);
  }
}

module.exports = { convertImages };
