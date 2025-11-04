// Image optimization utilities for selecting the best thumbnail

export interface ThumbnailOptions {
  viewMode: 'grid' | 'list' | 'hero'
  isMobile: boolean
  isRetina?: boolean
  preferAnimation?: boolean // New option for GIF handling
}

export class ImageOptimizer {
  /**
   * Get the optimal thumbnail path based on view mode and device capabilities
   */
  static getThumbnailPath(originalImagePath: string, options: ThumbnailOptions): string {
    if (!originalImagePath) return ''
    
    // If it's already a full URL, return as is
    if (originalImagePath.startsWith('http')) return originalImagePath
    
    // Extract the image details
    const pathParts = originalImagePath.split('/')
    const fileName = pathParts[pathParts.length - 1]
    const fileBaseName = fileName.split('.')[0]
    const fileExtension = fileName.split('.').pop()?.toLowerCase()
    const projectFolder = pathParts[pathParts.length - 2] || ''
    
    // Determine the best thumbnail suffix based on view mode and device
    let suffix = 'grid' // default
    
    if (options.viewMode === 'hero') {
      suffix = 'hero' // Use hero thumbnails for Project.vue hero images
    } else if (options.isMobile) {
      suffix = 'small' // Use small thumbnails on mobile for faster loading
    } else if (options.viewMode === 'list') {
      suffix = 'list'
    } else {
      suffix = 'grid'
    }
    
    // Handle GIF files specially
    if (fileExtension === 'gif') {
      if (options.preferAnimation) {
        // For animation, check if we have an optimized version, otherwise use original
        const optimizedGifPath = `/images/thumbnails/${projectFolder}/${fileBaseName}-${suffix}.gif`
        
        // Check if the optimized version exists and is actually animated
        // For now, we'll fall back to the original GIF for guaranteed animation
        // In the future, you could add a check to see if the optimized version is animated
        return originalImagePath // Use original for guaranteed animation
      } else {
        // Return static JPEG version for better performance
        const thumbnailPath = `/images/thumbnails/${projectFolder}/${fileBaseName}-${suffix}-static.jpg`
        return thumbnailPath
      }
    }
    
    // Construct thumbnail path for other formats
    const thumbnailPath = `/images/thumbnails/${projectFolder}/${fileBaseName}-${suffix}.jpg`
    
    return thumbnailPath
  }
  
  /**
   * Get the correct base path for GitHub Pages vs local development
   */
  static getBasePath(): string {
    return ''
  }
  
  /**
   * Get the full image src with proper base path handling
   */
  static getImageSrc(imagePath: string, options?: ThumbnailOptions): string {
    if (!imagePath) return ''
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) return imagePath
    
    const basePath = this.getBasePath()
    
    // If optimization options are provided, use thumbnail
    if (options) {
      const thumbnailPath = this.getThumbnailPath(imagePath, options)
      // If the path starts with /, it's absolute from public folder
      return thumbnailPath.startsWith('/') ? `${basePath}${thumbnailPath}` : `${basePath}/${thumbnailPath}`
    }
    
    // Fallback to original image
    return imagePath.startsWith('/') ? `${basePath}${imagePath}` : `${basePath}/${imagePath}`
  }
  
  /**
   * Create a fallback strategy that tries thumbnail first, then original
   */
  static createImageWithFallback(originalImagePath: string, options: ThumbnailOptions): {
    primary: string
    fallback: string
    animated?: string // For GIF files
  } {
    const result: { primary: string; fallback: string; animated?: string } = {
      primary: this.getImageSrc(originalImagePath, options),
      fallback: this.getImageSrc(originalImagePath) // original without optimization
    }
    
    // For GIF files, also provide animated version
    const fileExtension = originalImagePath.split('.').pop()?.toLowerCase()
    if (fileExtension === 'gif') {
      const animatedOptions = { ...options, preferAnimation: true }
      result.animated = this.getImageSrc(originalImagePath, animatedOptions)
    }
    
    return result
  }
  
  /**
   * Preload critical images for better perceived performance
   */
  static preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve()
      img.onerror = reject
      img.src = src
    })
  }
  
  /**
   * Get responsive srcset for different screen densities
   */
  static getResponsiveSrcSet(originalImagePath: string, options: ThumbnailOptions): string {
    const basePath = this.getBasePath()
    const thumbnailPath = this.getThumbnailPath(originalImagePath, options)
    
    // For now, just return the optimized image
    // In the future, you could generate multiple sizes: 1x, 2x, etc.
    return `${basePath}${thumbnailPath}`
  }
  
  /**
   * Check if thumbnail exists (for development debugging)
   */
  static async checkThumbnailExists(imagePath: string, options: ThumbnailOptions): Promise<boolean> {
    try {
      const thumbnailSrc = this.getImageSrc(imagePath, options)
      const response = await fetch(thumbnailSrc, { method: 'HEAD' })
      return response.ok
    } catch {
      return false
    }
  }
  
  /**
   * Check if the image is a GIF file
   */
  static isGif(imagePath: string): boolean {
    return imagePath.toLowerCase().endsWith('.gif')
  }
  
  /**
   * Get the best image source for GIF files with animation preference
   */
  static getGifSrc(originalImagePath: string, options: ThumbnailOptions, preferStatic = false): string {
    if (!this.isGif(originalImagePath)) {
      return this.getImageSrc(originalImagePath, options)
    }
    
    const gifOptions = { ...options, preferAnimation: !preferStatic }
    return this.getImageSrc(originalImagePath, gifOptions)
  }
}