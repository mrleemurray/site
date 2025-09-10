# Image Optimization Guide

This project uses an automated image optimization system to create thumbnails for better performance and faster loading times.

## How It Works

The image optimization script (`scripts/optimize-images.js`) automatically generates three sizes of thumbnails for each project image:

- **Grid view** (`-grid.jpg`): Optimized for 175px height (350px for retina displays)
- **List view** (`-list.jpg`): Optimized for 420px width (840px for retina displays)  
- **Mobile view** (`-small.jpg`): Optimized for 280px width (560px for retina displays)

### Special GIF Handling

For GIF files, the system creates both static and animated versions:

- **Static thumbnails** (`-grid-static.jpg`, `-list-static.jpg`, `-small-static.jpg`): JPEG versions of the first frame for fast loading
- **Animated thumbnails** (`-grid.gif`, `-list.gif`, `-small.gif`): Optimized GIF versions with reduced color palette
- **Performance-based display**: 
  - **Full Performance Mode**: Shows animated GIFs automatically (🎬 indicator)
  - **Power-Saver Mode**: Shows static JPEG versions (📷 indicator)
- **Automatic switching**: Users can toggle between modes using the performance button in the header

## Generated Files

### Standard Images
Original: `/public/images/project-name/cover.png`

Thumbnails:

- `/public/images/thumbnails/project-name/cover-grid.jpg`
- `/public/images/thumbnails/project-name/cover-list.jpg`
- `/public/images/thumbnails/project-name/cover-small.jpg`

### GIF Images
Original: `/public/images/project-name/cover.gif`

Static thumbnails:

- `/public/images/thumbnails/project-name/cover-grid-static.jpg`
- `/public/images/thumbnails/project-name/cover-list-static.jpg`
- `/public/images/thumbnails/project-name/cover-small-static.jpg`

Animated thumbnails:

- `/public/images/thumbnails/project-name/cover-grid.gif`
- `/public/images/thumbnails/project-name/cover-list.gif`
- `/public/images/thumbnails/project-name/cover-small.gif`

## Usage

### Automatic (Recommended)
The optimization runs automatically during the build process:
```bash
npm run build  # Optimizes images then builds
```

### Manual
You can also run optimization manually:
```bash
npm run optimize-images
```

### For New Projects
1. Add your project image to `/public/images/project-name/cover.png`
2. Run `npm run optimize-images` to generate thumbnails
3. The Vue component will automatically use the optimized images

## Performance Benefits

- **95-99% file size reduction** for most images
- **Responsive image selection** based on view mode and device
- **Automatic fallback** to original images if thumbnails fail
- **Retina display support** with 2x resolution thumbnails
- **Progressive JPEG encoding** for faster perceived loading
- **Intelligent GIF handling** with static thumbnails for power-saver mode and animated versions for full performance mode

## File Size Comparison

Typical compression results:

- Original PNG: ~500KB → Optimized JPEG: ~25KB (95% smaller)
- Original JPEG: ~200KB → Optimized JPEG: ~10KB (95% smaller)
- **Original GIF: ~2.2MB → Static JPEG: ~25KB (98.9% smaller)**
- **Original GIF: ~2.2MB → Optimized GIF: ~12KB (99.5% smaller)**
- SVG files are skipped (already optimized)

## Technical Details

- Uses **Sharp** for high-performance image processing
- **Progressive JPEG** with mozjpeg encoder for best compression
- **Maintains aspect ratios** while fitting target dimensions
- **Skips already optimized** images (checks modification time)
- **Automatically excludes** the thumbnails directory from processing
- **Animated GIF detection** and special handling
- **Color palette reduction** for GIF optimization (64 colors)
- **Performance mode integration** for automatic GIF animation control

## Browser Compatibility

The optimized images work in all modern browsers and automatically fall back to original images if thumbnails aren't available. GIF animations are supported in all modern browsers with graceful degradation to static images.

## Gitignore

The thumbnails directory is automatically added to `.gitignore` since these are generated files that don't need to be committed to version control.
