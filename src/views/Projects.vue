<template>
  <div class="projects">
    <div class="container">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <p>Loading projects...</p>
      </div>


      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="loadProjects" class="btn btn-primary">Try Again</button>
      </div>

      <!-- Projects Grid/List -->
      <div 
        v-else-if="filteredProjects.length > 0" 
        class="projects-container"
        :class="[
          effectiveViewMode === 'grid' ? 'projects-grid' : 'projects-list'
        ]"
      >
        <article 
          v-for="project in filteredProjects" 
          :key="project.id"
          class="project-card"
          :class="{ 
            'project-card--list': effectiveViewMode === 'list',
            'project-card--featured': (project.featured && effectiveViewMode === 'grid') || (isMobile && effectiveViewMode === 'grid')
          }"
        >
          <div 
            class="project-image"
            :class="{ 'image-loaded': imageLoadedStates[project.id] }"
          >
            <router-link :to="`/projects/${project.id}`">
              <img 
                :key="getImageKey(project.id, project.image)"
                :src="getImageSrcByPerformanceMode(project.image)" 
                :alt="project.title" 
                :class="{ 
                  loaded: imageLoadedStates[project.id],
                  'gif-static': isGifImage(project.image) && performanceMode === 'power-saver',
                  'gif-animated': isGifImage(project.image) && performanceMode === 'full'
                }"
                @load="onImageLoad(project.id)"
                @error="onImageError(project.id)"
                loading="lazy"
              />
            </router-link>
          </div>
          <div class="project-content">
            <h3 class="project-title">
              <router-link :to="`/projects/${project.id}`">
                {{ project.title }}
              </router-link>
            </h3>
            <p class="project-description">
              {{ project.description }}
            </p>
            <div class="project-meta">
              <div class="project-tags">
                <span 
                  v-for="tag in project.tags" 
                  :key="tag"
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <h3>No projects found</h3>
        <p v-if="searchQuery || selectedCategory"></p>
        <p v-else>
          Projects are coming soon! Check back later.
        </p>
        <button 
          v-if="searchQuery || selectedCategory"
          @click="clearFilters"
          class="btn btn-primary"
        >
          Clear Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, toRefs, watch } from 'vue'
import { MarkdownLoader, ProjectUtils, type Project, type ProjectCategory } from '@/utils/projects'
import { ImageOptimizer, type ThumbnailOptions } from '@/utils/image-optimizer'

interface Props {
  selectedCategory?: string
  viewMode?: 'grid' | 'list'
}

const props = withDefaults(defineProps<Props>(), {
  selectedCategory: '',
  viewMode: 'grid'
})

const emit = defineEmits<{
  'update-project-filters': [data: { categories: ProjectCategory[] }]
  'update:selectedCategory': [category: string]
}>()

const searchQuery = ref('')
const projects = ref<Project[]>([])
const categories = ref<ProjectCategory[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const isMobile = ref(false)
const imageLoadedStates = ref<Record<string, boolean>>({})
const currentPerformanceMode = ref<'full' | 'power-saver'>('full')

// Get performance mode from document attribute and keep it reactive
const performanceMode = computed(() => currentPerformanceMode.value)

// Watch for performance mode changes in the DOM
const updatePerformanceMode = () => {
  const mode = document.documentElement.getAttribute('data-performance') as 'full' | 'power-saver' || 'full'
  if (mode !== currentPerformanceMode.value) {
    currentPerformanceMode.value = mode
  }
}

// Check if mobile on mount and window resize
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 767
}

// Fix image paths for GitHub Pages and use optimized thumbnails
const getImageSrc = (imagePath: string, preferAnimation = false): string => {
  if (!imagePath) return ''
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) return imagePath
  
  // Create thumbnail options based on current view mode and device
  const thumbnailOptions: ThumbnailOptions = {
    viewMode: effectiveViewMode.value,
    isMobile: isMobile.value,
    isRetina: window.devicePixelRatio > 1,
    preferAnimation: preferAnimation
  }
  
  // Use the ImageOptimizer to get the best thumbnail
  try {
    return ImageOptimizer.getImageSrc(imagePath, thumbnailOptions)
  } catch (error) {
    console.warn('Failed to get optimized image, falling back to original:', error)
    // Fallback to original image path logic
    const basePath = window.location.hostname === 'mrleemurray.github.io' ? '/site' : ''
    return imagePath.startsWith('/') ? `${basePath}${imagePath}` : `${basePath}/${imagePath}`
  }
}

// Check if image is a GIF
const isGifImage = (imagePath: string): boolean => {
  return ImageOptimizer.isGif(imagePath)
}

// Get image source based on performance mode for GIFs
const getImageSrcByPerformanceMode = (imagePath: string): string => {
  if (!isGifImage(imagePath)) {
    // For non-GIF images, use the standard optimized version
    return getImageSrc(imagePath, false)
  }
  
  // For GIF images, decide based on performance mode
  if (performanceMode.value === 'power-saver') {
    // In power-saver mode, use static JPEG version
    return getImageSrc(imagePath, false)
  } else {
    // In full performance mode, use animated GIF version
    return getImageSrc(imagePath, true)
  }
}

// Force grid mode on mobile, use props viewMode on desktop
const effectiveViewMode = computed(() => {
  return isMobile.value ? 'grid' : props.viewMode
})

// Watch for performance mode changes and force image reloads for GIFs
watch(currentPerformanceMode, (newMode, oldMode) => {
  if (newMode !== oldMode) {
    // Force re-render of GIF images by temporarily setting them as not loaded
    // then reloading them with the new performance mode
    projects.value.forEach(project => {
      if (isGifImage(project.image)) {
        imageLoadedStates.value[project.id] = false
        // Small delay to allow DOM update, then reload
        setTimeout(() => {
          imageLoadedStates.value[project.id] = true
        }, 50)
      }
    })
  }
})

// Create a computed key that changes when performance mode changes to force image re-render
const getImageKey = (projectId: string, imagePath: string): string => {
  if (isGifImage(imagePath)) {
    return `${projectId}-${performanceMode.value}`
  }
  return projectId
}

// Use props for filtering
const filteredProjects = computed(() => {
  let filtered = projects.value

  // Filter by category from props
  if (props.selectedCategory) {
    filtered = ProjectUtils.getProjectsByCategory(filtered, props.selectedCategory)
  }

  // Filter by search query (local state)
  if (searchQuery.value) {
    filtered = ProjectUtils.searchProjects(filtered, searchQuery.value)
  }

  // Sort by date (newest first)
  return ProjectUtils.sortProjects(filtered, 'date')
})

// Expose computed props for parent component access
const { selectedCategory } = toRefs(props)

const clearFilters = () => {
  searchQuery.value = ''
  emit('update:selectedCategory', '')
}

// Image loading handlers
const onImageLoad = (projectId: string) => {
  imageLoadedStates.value[projectId] = true
}

const onImageError = (projectId: string) => {
  imageLoadedStates.value[projectId] = true // Show content even if image fails
}

const loadProjects = async () => {
  isLoading.value = true
  error.value = null

  try {
    const data = await MarkdownLoader.loadProjectsData()
    projects.value = data.projects
    categories.value = data.categories
    
    // Initialize image loading states
    imageLoadedStates.value = {}
    data.projects.forEach(project => {
      imageLoadedStates.value[project.id] = false
    })
    
    // Emit categories to parent for use in StickyHeader
    emit('update-project-filters', { categories: data.categories })
  } catch (err) {
    error.value = 'Failed to load projects. Please try again later.'
    console.error('Error loading projects:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadProjects()
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  // Initialize performance mode
  updatePerformanceMode()
  
  // Watch for performance mode changes using MutationObserver
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-performance') {
        updatePerformanceMode()
      }
    })
  })
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-performance']
  })
  
  // Store observer for cleanup
  ;(window as any).__performanceModeObserver = observer
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  
  // Clean up performance mode observer
  const observer = (window as any).__performanceModeObserver
  if (observer) {
    observer.disconnect()
    delete (window as any).__performanceModeObserver
  }
})
</script>

<style lang="scss" scoped>
.projects {
  padding: var(--space-8) 0 var(--space-14);
}

.container {
  padding-right: 0;
}

.page-header {
  text-align: center;
  margin-bottom: var(--space-12);
}

.page-title {
  margin-bottom: var(--space-4);
}

.page-description {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

.projects-container {
  margin-bottom: var(--space-12);
  
  &.projects-grid {
    border-left: 1px solid var(--color-border);
    border-top: 1px solid var(--color-border);
    overflow: hidden;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    position: relative;
    background-color: var(--color-background);
    
    /* Diagonal stripe pattern background for empty spaces */
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: var(--pattern-diagonal-stripes);
      background-size: 18px 18px;
      pointer-events: none;
      z-index: 0;
    }
    
    /* Ensure at least 2 columns for featured items to work properly */
    @media (min-width: var(--breakpoint-md)) {
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      /* Make sure we have at least 2 columns when screen is wide enough */
      min-width: 560px;
    }
  }
}

.projects-list {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.project-card {
  border: none;
  border-radius: 0;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background);
  
  /* Grid view borders */
  .projects-grid & {
    border-right: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
    position: relative;
    z-index: 1;
  }
  
  /* Featured projects span two columns */
  &--featured {
    grid-column: span 2;
  }
  
  &--list {
    display: flex;
    flex-direction: row;
    border: none;
    border-radius: 0;
    border-bottom: 1px solid var(--color-border);
    
    &:last-child {
      border-bottom: none;
    }
    
    @media (max-width: calc(var(--breakpoint-md) - 1px)) {
      flex-direction: column;
    }
  }
}

.project-image {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  max-height: 175px;
  min-height: 175px;
  position: relative; /* iOS Safari fix */
  width: 100%; /* Explicit width for iOS */
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 12px,
      var(--color-border) 12px,
      var(--color-border) 13px
    );
    opacity: 1;
    z-index: 0;
  }
  
  img {
    position: relative;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.3s ease;
    
    &.loaded {
      opacity: 1;
    }
    
    &.lazy-loading {
      opacity: 0;
    }
    
    &.lazy-loaded {
      opacity: 1;
    }
    
    &.lazy-error {
      opacity: 0.5;
    }
  }
  
  .project-card--list & {
    flex-shrink: 0;
    width: 420px;
    aspect-ratio: 16 / 10;
    max-height: 999px;
    min-height: 0px;
    
    @media (max-width: calc(var(--breakpoint-md) - 1px)) {
      width: 100%;
      aspect-ratio: 16 / 9;
    }
  }
  
  /* Featured projects keep same image height */
  .project-card--featured & {
    aspect-ratio: 16 / 9; /* Maintain same aspect ratio */
    max-height: 175px; /* Shorter height to match regular cards better */
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block; /* Fix iOS browser width issues */
    min-width: 100%; /* Ensure full width on iOS */
    position: absolute; /* iOS Safari positioning fix */
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transition: opacity 0.2s ease;
    
    &.gif-static {
      /* Static GIF version (power-saver mode) */
      opacity: 1;
    }
    
    &.gif-animated {
      /* Animated GIF version (full performance mode) */
      opacity: 1;
    }
  }
  
}

.project-content {
  padding: var(--space-4) 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--color-border);
  
  .project-card--list & {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-top: none;
    border-left: 1px solid var(--color-border);
    padding-bottom: 0px;

    .project-description {
      margin-bottom: 0;
    }

    .project-meta {
      gap: 0px;
    }
  }
}

.project-title {
  margin-bottom: var(--space-4);
  padding: 0 var(--space-4) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  
  a {
    color: var(--color-text-primary);
    text-decoration: none;
    
    &:hover, &:focus {
      color: var(--color-primary-600);
    }
  }
}

.project-description {
  padding: 0 var(--space-4) var(--space-4);
  margin-bottom: var(--space-4);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  flex-grow: 1;
}

.project-meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  
  
  .project-card--list & {
    @media (min-width: var(--breakpoint-md)) {
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-end;
    }

    .project-links {
      border-left: 1px solid var(--color-border);
      padding: var(--space-4);
      height: -webkit-fill-available;
      align-items: center;
    }

    .project-tags {
      padding: var(--space-4);
    }
  }
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: 0 var(--space-4);
}

.project-links {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-4) 0 var(--space-4);
  border-top: 1px solid var(--color-border);
  
  a {
    font-size: var(--font-size-sm);
    color: var(--color-primary-600);
    text-decoration: none;
    font-weight: var(--font-weight-medium);
    line-height: 28px;
    
    &:hover, &:focus {
      text-decoration: underline;
    }
  }
}

.tag {
  display: inline-block;
  padding: var(--space-1) var(--space-3);
  color: var(--color-primary-600);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  border: 1px solid color-mix(in srgb, var(--color-primary-600) 20%, transparent);
  cursor: default;
}

.loading-state, .error-state {
  text-align: center;
  padding: var(--space-16);
  color: var(--color-text-secondary);
}

.empty-state {
  text-align: center;
  padding: var(--space-16);
  color: var(--color-text-secondary);
  border-bottom: 1px solid var(--color-border);
  
  h3 {
    margin-bottom: var(--space-4);
    color: var(--color-text-primary);
  }
  
  p {
    margin-bottom: var(--space-6);
  }
}

/* Battery Saver Mode - Themed Monochrome & Printed Effect */
[data-performance="power-saver"] {
  .project-image img {
    /* Convert to grayscale first, then apply site color theme */
    filter: var(--filter-battery-saver);
  }
  
  .project-card {
    /* Add subtle texture overlay for printed effect with site colors */
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 50%, transparent 20%, var(--color-text-secondary) 21%, var(--color-text-secondary) 34%, transparent 35%, transparent),
        linear-gradient(0deg, var(--color-background) 50%, transparent 50%);
      opacity: 0.03;
      pointer-events: none;
      z-index: 1;
      mix-blend-mode: multiply;
    }
    
    .project-image {
      position: relative;
      
      /* Add a themed color overlay */
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          135deg,
          var(--color-text-secondary) 0%,
          var(--color-background) 100%
        );
        opacity: 0.08;
        pointer-events: none;
        z-index: 1;
        mix-blend-mode: overlay;
      }
    }
  }
}
</style>