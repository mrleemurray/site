#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_IMAGES_DIR = path.join(__dirname, '../public/images');
const THUMBNAILS_DIR = path.join(PUBLIC_IMAGES_DIR, 'thumbnails');

// Thumbnail configurations based on your CSS dimensions
const THUMBNAIL_CONFIGS = {
  // Grid view: 175px height, maintain aspect ratio
  grid: {
    width: null,
    height: 350, // 2x for retina
    fit: 'inside',
    withoutEnlargement: true,
    quality: 85,
    suffix: '-grid'
  },
  // List view: 420px width, maintain aspect ratio  
  list: {
    width: 840, // 2x for retina
    height: null,
    fit: 'inside',
    withoutEnlargement: true,
    quality: 85,
    suffix: '-list'
  },
  // Small grid for mobile: 280px width (min grid size)
  small: {
    width: 560, // 2x for retina
    height: null,
    fit: 'inside',
    withoutEnlargement: true,
    quality: 80,
    suffix: '-small'
  }
};

// Supported image formats
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.svg', '.gif'];

async function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateThumbnail(inputPath, outputPath, config) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Skip SVG files as they're already vector and small
    if (metadata.format === 'svg') {
      console.log(`⏭️  Skipping SVG: ${inputPath}`);
      return;
    }

    // Handle GIF files specially
    if (metadata.format === 'gif') {
      // Check if the GIF is animated
      const isAnimated = metadata.pages && metadata.pages > 1;
      
      if (isAnimated) {
        console.log(`🎬 Animated GIF detected: ${inputPath}`);
        // For animated GIFs, we'll create a static thumbnail from the first frame
        // but also preserve the original GIF for when animation is needed
        
        const staticOutputPath = outputPath.replace('.jpg', '-static.jpg');
        
        // Create static thumbnail from first frame
        await image
          .resize({
            width: config.width,
            height: config.height,
            fit: config.fit,
            withoutEnlargement: config.withoutEnlargement
          })
          .jpeg({ 
            quality: config.quality, 
            progressive: true,
            mozjpeg: true 
          })
          .toFile(staticOutputPath);

        // Also create an optimized GIF version
        const optimizedGifPath = outputPath.replace('.jpg', '.gif');
        
        // For animated GIFs, Sharp doesn't preserve animation well during resize
        // So we'll use a fallback strategy: use original GIF if it's reasonably sized,
        // otherwise create a static fallback
        const originalStats = fs.statSync(inputPath);
        const maxGifSize = 1024 * 1024; // 1MB limit for animated GIFs
        
        if (originalStats.size <= maxGifSize) {
          // Original is small enough, just copy it
          fs.copyFileSync(inputPath, optimizedGifPath);
          console.log(`✅ ${path.basename(optimizedGifPath)} (copied original, animation preserved)`);
        } else {
          // Original is too large, create a static version
          await image
            .resize({
              width: config.width,
              height: config.height,
              fit: config.fit,
              withoutEnlargement: config.withoutEnlargement
            })
            .gif({ colors: 128 })
            .toFile(optimizedGifPath);
            
          const gifStats = fs.statSync(optimizedGifPath);
          const gifRatio = ((1 - gifStats.size / originalStats.size) * 100).toFixed(1);
          console.log(`✅ ${path.basename(optimizedGifPath)} (static fallback, ${gifRatio}% smaller)`);
        }

        const inputStats = fs.statSync(inputPath);
        const staticStats = fs.statSync(staticOutputPath);
        const staticRatio = ((1 - staticStats.size / inputStats.size) * 100).toFixed(1);
        
        console.log(`✅ ${path.basename(staticOutputPath)} (static, ${staticRatio}% smaller)`);
        return;
      }
    }

    const resizeOptions = {
      fit: config.fit,
      withoutEnlargement: config.withoutEnlargement
    };

    if (config.width) resizeOptions.width = config.width;
    if (config.height) resizeOptions.height = config.height;

    await image
      .resize(resizeOptions)
      .jpeg({ 
        quality: config.quality, 
        progressive: true,
        mozjpeg: true 
      })
      .toFile(outputPath);

    const inputStats = fs.statSync(inputPath);
    const outputStats = fs.statSync(outputPath);
    const compressionRatio = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);
    
    console.log(`✅ ${path.basename(outputPath)} (${compressionRatio}% smaller)`);
  } catch (error) {
    console.error(`❌ Error processing ${inputPath}:`, error.message);
  }
}

async function processImagesInDirectory(dir, projectName = '') {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    // Skip the thumbnails directory to avoid recursive processing
    if (item === 'thumbnails') continue;
    
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      await processImagesInDirectory(itemPath, item);
    } else if (stat.isFile()) {
      const ext = path.extname(item).toLowerCase();
      if (SUPPORTED_FORMATS.includes(ext)) {
        // Generate thumbnails for each configuration
        for (const [configName, config] of Object.entries(THUMBNAIL_CONFIGS)) {
          const fileName = path.basename(item, ext);
          const outputFileName = `${fileName}${config.suffix}.jpg`;
          
          let outputDir;
          if (projectName) {
            outputDir = path.join(THUMBNAILS_DIR, projectName);
          } else {
            outputDir = THUMBNAILS_DIR;
          }
          
          await ensureDirectory(outputDir);
          const outputPath = path.join(outputDir, outputFileName);
          
          // Check if thumbnail already exists and is newer than source
          if (fs.existsSync(outputPath)) {
            const sourceTime = stat.mtime.getTime();
            const thumbTime = fs.statSync(outputPath).mtime.getTime();
            if (thumbTime > sourceTime) {
              // For GIFs, also check if the optimized versions exist
              if (ext.toLowerCase() === '.gif') {
                const staticPath = outputPath.replace('.jpg', '-static.jpg');
                const gifPath = outputPath.replace('.jpg', '.gif');
                if (fs.existsSync(staticPath) && fs.existsSync(gifPath)) {
                  continue; // Skip if all GIF variants are newer
                }
              } else {
                continue; // Skip if thumbnail is newer
              }
            }
          }
          
          await generateThumbnail(itemPath, outputPath, config);
        }
      }
    }
  }
}

async function optimizeImages() {
  console.log('🖼️  Image Optimization Tool\n');
  
  if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
    console.error(`❌ Images directory not found: ${PUBLIC_IMAGES_DIR}`);
    process.exit(1);
  }

  // Ensure thumbnails directory exists
  await ensureDirectory(THUMBNAILS_DIR);

  console.log('📁 Processing images...\n');
  
  // Process all images in the public/images directory
  await processImagesInDirectory(PUBLIC_IMAGES_DIR);
  
  console.log('\n✨ Image optimization complete!');
  console.log(`📂 Thumbnails saved to: ${path.relative(process.cwd(), THUMBNAILS_DIR)}`);
  console.log('\n💡 Usage in Vue component:');
  console.log('   Grid view: `/images/thumbnails/project-name/cover-grid.jpg`');
  console.log('   List view: `/images/thumbnails/project-name/cover-list.jpg`');
  console.log('   Mobile:    `/images/thumbnails/project-name/cover-small.jpg`');
}

// Add to .gitignore if not already there
function updateGitignore() {
  const gitignorePath = path.join(__dirname, '../.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    if (!gitignoreContent.includes('# Generated thumbnails')) {
      const appendContent = '\n# Generated thumbnails\npublic/images/thumbnails/\n';
      fs.appendFileSync(gitignorePath, appendContent);
      console.log('📝 Added thumbnails directory to .gitignore');
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeImages()
    .then(() => {
      updateGitignore();
    })
    .catch(error => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

export { optimizeImages };