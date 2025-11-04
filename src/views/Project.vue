<template>
  <div class="project-detail">
    <div class="project-container">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading project...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <h2>Project Not Found</h2>
          <router-link to="/" class="btn btn-primary">
            ← Back to Projects
          </router-link>
        </div>

        <!-- Project Content -->
        <div v-else-if="project">

        <!-- Project Image -->
        <div class="project-image">
          <img 
            v-lazy="getImageSrc(project.image, true)" 
            :alt="project.title"
            :class="{ loaded: heroImageLoaded }"
            @load="onHeroImageLoad"
            @error="onHeroImageError"
          />
        </div>

        <!-- Project Content -->
        <div class="project-content">
          <div class="content-main">
            <!-- Project Meta -->
            <div ref="projectMetaRef" class="project-meta">
              <div class="project-links">
                <a 
                  v-if="project.liveUrl"
                  :href="project.liveUrl" 
                  class="project-link" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {{ project.liveUrlLabel || 'View Live Site' }}
                </a>
                <a 
                  v-if="project.sourceUrl"
                  :href="project.sourceUrl" 
                  class="project-link" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {{ project.sourceUrlLabel || 'View Source' }}
                </a>
              </div>
              
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
            <!-- Markdown content will be rendered here -->
            <div 
              v-if="markdownContent"
              :key="`markdown-${props.slug}-${markdownContent.length}`"
              class="markdown-content"
              v-html="markdownContent"
            ></div>
            <div v-else class="content-loading">
              <p>Loading project details...</p>
            </div>
          </div>

          <!-- Table of Contents -->
          <aside ref="tocRef" v-if="tableOfContents.length > 0" class="content-sidebar">
            <nav class="toc" aria-label="Table of contents">
              <h3>Table of Contents</h3>
              <ul>
                <li 
                  v-for="heading in tableOfContents" 
                  :key="heading.id"
                  :class="`toc-level-${heading.level}`"
                >
                  <a 
                    :href="`#${heading.id}`"
                    @click.prevent="scrollToHeading(heading.id)"
                  >
                    {{ heading.text }}
                  </a>
                </li>
              </ul>
            </nav>
          </aside>
        </div>

        <!-- Related Projects -->
        <section v-if="relatedProjects.length > 0" class="related-projects">
          <h2>Related Projects</h2>
          <div class="related-grid grid grid-responsive">
            <article 
              v-for="relatedProject in relatedProjects" 
              :key="relatedProject.id"
              class="related-card"
            >
              <div class="related-image">
                <router-link :to="`/projects/${relatedProject.id}`">
                  <img 
                    :src="getImageSrc(relatedProject.image)" 
                    :alt="relatedProject.title"
                    loading="lazy"
                  />
                </router-link>
              </div>
              <h3>
                <router-link :to="`/projects/${relatedProject.id}`">
                  {{ relatedProject.title }}
                </router-link>
              </h3>
              <p>{{ relatedProject.description }}</p>
              <div class="related-tags">
                <span 
                  v-for="tag in relatedProject.tags.slice(0, 3)" 
                  :key="tag"
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>
            </article>
          </div>
        </section>
        
        </div> <!-- End of v-else-if="project" -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { MarkdownLoader, type Project } from '@/utils/projects'
import { ImageOptimizer, type ThumbnailOptions } from '@/utils/image-optimizer'

interface Props {
  slug: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'sticky-title-change': [title: string | null]
}>()

const project = ref<Project | null>(null)
const allProjects = ref<Project[]>([])
const markdownContent = ref('')
const tableOfContents = ref<Array<{ id: string; text: string; level: number }>>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const heroImageLoaded = ref(false)

// Refs for sticky detection
const projectMetaRef = ref<HTMLElement>()
const tocRef = ref<HTMLElement>()
let intersectionObserver: IntersectionObserver | null = null

const relatedProjects = computed(() => {
  if (!project.value || !allProjects.value.length) return []
  
  return allProjects.value
    .filter(p => 
      p.id !== project.value!.id && 
      (p.category === project.value!.category || 
       p.tags.some(tag => project.value!.tags.includes(tag)))
    )
    .slice(0, 4)
})

// Fix image paths for GitHub Pages and use optimized images
const getImageSrc = (imagePath: string, isHeroImage: boolean = false): string => {
  if (!imagePath) return ''
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) return imagePath
  
  // For hero images, use optimization
  if (isHeroImage) {
    // Check if it's a GIF to decide on animation preference
    const isGif = ImageOptimizer.isGif(imagePath)
    
    // Create thumbnail options for hero images - use 'hero' view mode for 500px height
    const thumbnailOptions: ThumbnailOptions = {
      viewMode: 'hero', // Use hero mode for 500px height optimized images
      isMobile: window.innerWidth <= 767,
      isRetina: window.devicePixelRatio > 1,
      preferAnimation: isGif // For GIFs, prefer animated versions; for others, use static
    }
    
    // Use the ImageOptimizer to get the best optimized image
    try {
      return ImageOptimizer.getImageSrc(imagePath, thumbnailOptions)
    } catch (error) {
      console.warn('Failed to get optimized hero image, falling back to original:', error)
      // Fall through to original logic
    }
  }
  
  // Fallback to original image path logic for non-hero images or optimization failure
  return imagePath.startsWith('/') ? imagePath : `/${imagePath}`
}

// Image loading handlers
const onHeroImageLoad = () => {
  heroImageLoaded.value = true
}

const onHeroImageError = () => {
  heroImageLoaded.value = true // Show content even if image fails
}

const loadProject = async () => {
  isLoading.value = true
  error.value = null
  project.value = null  // Reset project data
  markdownContent.value = ''
  tableOfContents.value = []
  heroImageLoaded.value = false // Reset hero image loaded state
  
  // Clear any previous title
  emit('sticky-title-change', null)

  try {
    // Load all projects data first (for related projects)
    const data = await MarkdownLoader.loadProjectsData()
    allProjects.value = data.projects

    // Load the specific project with its content
    const parsed = await MarkdownLoader.loadProjectContent(props.slug)
    project.value = parsed.frontmatter

    // Emit the project title immediately for mobile header
    emit('sticky-title-change', project.value.title)

    // Images use root path
    
    // Extract TOC manually first (before processing headers)
    const tocMatches = parsed.content.matchAll(/^(#{1,6})\s+(.*)$/gm)
    const toc = Array.from(tocMatches).map((match: RegExpMatchArray) => {
      const level = match[1].length
      const text = match[2].trim()
      const id = text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
      return { level, text, id }
    })
    tableOfContents.value = toc
    
    // Manual markdown processing that will definitely work
    let result = parsed.content
      // Headers - use the same ID generation as TOC
      .replace(/^### (.*$)/gim, (_, title) => {
        const id = title.trim().toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
        return `<h3 id="${id}">${title}</h3>`
      })
      .replace(/^## (.*$)/gim, (_, title) => {
        const id = title.trim().toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
        return `<h2 id="${id}">${title}</h2>`
      })
      .replace(/^# (.*$)/gim, (_, title) => {
        const id = title.trim().toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
        return `<h1 id="${id}">${title}</h1>`
      })
      // Bold and italic
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Callouts
      .replace(/::: info\n([\s\S]*?)\n:::/g, '<div class="callout callout-info"><p>$1</p></div>')
      .replace(/::: tip\n([\s\S]*?)\n:::/g, '<div class="callout callout-tip"><p>$1</p></div>')
      .replace(/::: warning\n([\s\S]*?)\n:::/g, '<div class="callout callout-warning"><p>$1</p></div>')
      .replace(/::: danger\n([\s\S]*?)\n:::/g, '<div class="callout callout-danger"><p>$1</p></div>')
      // Task lists
      .replace(/^- \[ \] (.*)$/gm, '<li class="task-list-item"><input type="checkbox" disabled> $1</li>')
      .replace(/^- \[x\] (.*)$/gm, '<li class="task-list-item"><input type="checkbox" checked disabled> $1</li>')
      // Highlighted text
      .replace(/==(.*?)==/g, '<mark>$1</mark>')
      .replace(/\+\+(.*?)\+\+/g, '<ins>$1</ins>')
      // Code blocks
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="hljs language-$1">$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Images - load immediately (no lazy loading)
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
        const altText = alt || 'Project image'
        // Process the image path here to ensure correct base path
        const processedSrc = getImageSrc(src)
        return `<img src="${processedSrc}" alt="${altText}" />`
      })
      // Links (after images so images don't get converted to links)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Lists
      .replace(/^- (.*)$/gm, '<li>$1</li>')
      // Wrap consecutive list items in ul tags
      .replace(/(<li>.*<\/li>)(\n<li>.*<\/li>)*/g, (match) => {
        return '<ul>' + match.replace(/\n/g, '') + '</ul>'
      })
      // Wrap task list items in ul tags
      .replace(/(<li class="task-list-item">.*<\/li>)(\n<li class="task-list-item">.*<\/li>)*/g, (match) => {
        return '<ul>' + match.replace(/\n/g, '') + '</ul>'
      })
      // Paragraphs
      .split('\n\n')
      .map(paragraph => {
        const trimmed = paragraph.trim()
        if (trimmed === '') return ''
        if (trimmed.startsWith('<')) return trimmed // Already HTML
        return `<p>${trimmed}</p>`
      })
      .filter(p => p !== '')
      .join('\n')
    
    markdownContent.value = result

    // Force re-render and reapply styles after markdown is processed
    await nextTick()

    // Set up sticky detection after content is loaded
    setTimeout(() => {
      setupStickyDetection()
    }, 100)

  } catch (err) {
    console.error('❌ Error loading project:', err)
    error.value = err instanceof Error ? err.message : 'Failed to load project'
  } finally {
    isLoading.value = false
  }
}

// Watch for route changes
watch(() => props.slug, () => {
  loadProject()
})

// Setup intersection observer for sticky detection
const setupStickyDetection = () => {
  if (!projectMetaRef.value) return
  
  // Create a sentinel element just above the sticky element
  const sentinel = document.createElement('div')
  sentinel.style.height = '1px'
  sentinel.style.position = 'absolute'
  sentinel.style.top = 'calc(var(--space-16) - 7px)' // Just above sticky position
  sentinel.style.left = '0'
  sentinel.style.right = '0'
  sentinel.style.pointerEvents = 'none'
  sentinel.setAttribute('data-sticky-sentinel', 'true')
  
  // Insert sentinel before the sticky element
  projectMetaRef.value.parentNode?.insertBefore(sentinel, projectMetaRef.value)
  
  // Create intersection observer
  intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.target === sentinel) {
          // When sentinel is not visible, sticky element is sticking
          const isSticking = !entry.isIntersecting
          if (isSticking && project.value?.title) {
            emit('sticky-title-change', project.value.title)
          } else {
            // On mobile, always keep the title visible
            // On desktop, clear it when not sticking
            const isMobile = window.innerWidth <= 767
            if (!isMobile) {
              emit('sticky-title-change', null)
            }
          }
        }
      })
    },
    {
      rootMargin: '0px',
      threshold: 0
    }
  )
  
  intersectionObserver.observe(sentinel)
}

const cleanupStickyDetection = () => {
  if (intersectionObserver) {
    intersectionObserver.disconnect()
    intersectionObserver = null
  }
  
  // Remove sentinel elements
  const sentinels = document.querySelectorAll('[data-sticky-sentinel]')
  sentinels.forEach(sentinel => sentinel.remove())
}

const scrollToHeading = (headingId: string) => {
  const element = document.getElementById(headingId)
  if (!element) return
  
  // Calculate offset for sticky metadata section
  // The sticky metadata has a top offset of calc(var(--space-16) - 6px) plus its own height
  const stickyMetaHeight = projectMetaRef.value?.offsetHeight || 0
  
  // Get the CSS custom property value for --space-16 (typically 4rem = 64px)
  const computedStyle = getComputedStyle(document.documentElement)
  const space16 = parseFloat(computedStyle.getPropertyValue('--space-16')) * 16 || 64 // Convert rem to px
  const stickyTopOffset = space16 - 6 // calc(var(--space-16) - 6px)
  
  const extraOffset = 20 // Additional spacing for comfort
  const totalOffset = stickyTopOffset + stickyMetaHeight + extraOffset
  
  // Get the element's position
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
  const offsetPosition = elementPosition - totalOffset
  
  // Smooth scroll to the calculated position
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  })
}

onMounted(() => {
  loadProject()
})

onUnmounted(() => {
  cleanupStickyDetection()
})
</script>

<style lang="scss" scoped>
.project-detail {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  background: var(--color-background);
}

.project-container {
  padding: 0;
  border: 1px solid var(--color-border);

  @media (max-width: 768px) {
    margin-left: 0px;
  }
}

.breadcrumb {
  margin-bottom: var(--space-8);
}

.back-link {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  
  &:hover, &:focus {
    color: var(--color-primary-600);
  }
}

.project-header {
  text-align: center;
  margin-bottom: var(--space-12);
}

.project-title {
  margin-bottom: var(--space-2);
}

.project-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-8);
}

.project-meta {
  position: sticky;
  top: calc(3rem + var(--space-2));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
  border-right: 1px solid var(--color-border);
  background: var(--color-background);
  z-index: 10;

  @media (max-width: 1280px) {
    top: 3rem;
  }

  @media (max-width: 768px) {
    position: static;
    top: auto;
  }
}

.project-links {
  display: flex;
  gap: var(--space-4);  
}

.project-link {
  font-size: var(--font-size-sm);
  color: var(--color-primary-600);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  
  &:hover, &:focus {
    text-decoration: underline;
  }
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
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

.project-image {
  overflow: hidden;
  border-bottom: 1px solid var(--color-border);
  max-height: 500px;
  position: relative;
  
  /* Diagonal stripe pattern background that shows before image loads */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: var(--pattern-diagonal-stripes-alt);
    background-size: 18px 18px;
    pointer-events: none;
    z-index: 0;
  }
  
  img {
    width: 100%;
    height: 100%;
    max-height: 500px;
    object-fit: cover;
    object-position: center;
    display: block;
    position: relative;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.3s ease;
    
    &.loaded {
      opacity: 1;
    }
  }
}

.project-content {
  display: grid;
  
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 300px;
  }
}

.content-main {
  min-width: 0; // Prevent grid overflow
}

.markdown-content {
  padding: var(--space-4);
  line-height: var(--line-height-relaxed);
  border-right: 1px solid var(--color-border);

  
  
  :deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
    margin-top: var(--space-4);
    margin-bottom: var(--space-2);
    color: var(--color-text-primary);
    
    &:first-child {
      margin-top: 0;
    }
  }

  :deep(h1) {
    margin-top: var(--space-4);
    font-size: var(--font-size-3xl);
  }
  
  :deep(h2) {
    margin-top: var(--space-8);
  }
  
  :deep(p) {
    margin-bottom: var(--space-4);
    color: var(--color-text-secondary);
  }
  
  :deep(ul), :deep(ol) {
    margin-bottom: var(--space-4);
    margin-left: var(--space-6);
    
    li {
      margin-bottom: var(--space-2);
      color: var(--color-text-secondary);
    }
  }
  
  :deep(pre) {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    padding: var(--space-6);
    overflow-x: auto;
    margin-bottom: var(--space-6);
    
    code {
      font-family: var(--font-family-mono);
      font-size: var(--font-size-sm);
      color: var(--color-text-primary);
    }
  }
  
  :deep(code:not(pre code)) {
    background: var(--color-surface);
    padding: var(--space-1) var(--space-2);
    font-family: var(--font-family-mono);
    font-size: 0.9em;
    color: var(--color-primary-700);
  }
  
  :deep(blockquote) {
    border-left: 4px solid var(--color-primary-500);
    margin: var(--space-6) 0;
    padding: var(--space-4) var(--space-6);
    background: var(--color-surface);
    font-style: italic;
    
    p {
      margin-bottom: 0;
    }
  }
  
  :deep(img) {
    max-width: 100%;
    height: auto;
    margin: var(--space-4) 0;
  }
  
  :deep(a) {
    color: var(--color-primary-600);
  }
  
  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: var(--space-6) 0;
    
    th, td {
      padding: var(--space-3) var(--space-4);
      text-align: left;
      border-bottom: 1px solid var(--color-border);
    }
    
    th {
      background: var(--color-surface);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
    }
    
    td {
      color: var(--color-text-secondary);
    }
  }

  // Enhanced markdown styles that might not be applied via v-html
  :deep(.callout) {
    padding: var(--space-4);
    margin: var(--space-4) 0;
    border-left: 4px solid;
    
    &.callout-info {
      background-color: rgba(59, 130, 246, 0.1);
      border-left-color: rgb(59, 130, 246);
    }
    
    &.callout-tip {
      background-color: rgba(34, 197, 94, 0.1);
      border-left-color: rgb(34, 197, 94);
    }
    
    &.callout-warning {
      background-color: rgba(245, 158, 11, 0.1);
      border-left-color: rgb(245, 158, 11);
    }
    
    &.callout-danger {
      background-color: rgba(239, 68, 68, 0.1);
      border-left-color: rgb(239, 68, 68);
    }
    
    p:first-child {
      margin-top: 0;
    }
    
    p:last-child {
      margin-bottom: 0;
    }
  }

  :deep(.task-list-item) {
    list-style: none;
    margin: var(--space-2) 0;
    
    .task-list-item-checkbox {
      margin-right: var(--space-2);
      margin-left: calc(-1 * var(--space-5));
    }
  }

  :deep(mark) {
    background-color: rgba(255, 235, 59, 0.3);
    padding: 0.1em 0.2em;
  }

  :deep(ins) {
    background-color: rgba(34, 197, 94, 0.2);
    text-decoration: none;
    padding: 0.1em 0.2em;
  }
}

@media (max-width: 1024px) {
  .markdown-content, .project-meta {
    border-right: none;
  }
}

.content-loading {
  text-align: center;
  padding: var(--space-16);
  color: var(--color-text-secondary);
}

.content-sidebar {
  @media (max-width: 1023px) {
    order: -1;
  }
}

.toc {
  position: sticky;
  top: calc(var(--space-16) - 6px);

  padding: var(--space-5);

  @media (max-width: 1280px) {
    top: 3rem;
  }

  @media (max-width: 1024px) {
    display: none;
  }
  
  h3 {
    margin-bottom: var(--space-4);
    font-size: var(--font-size-lg);
    color: var(--color-text-primary);
  }
  
  ul {
    list-style: none;
    
    li {
      margin-bottom: var(--space-2);
      
      &.toc-level-1 { margin-left: 0; }
      &.toc-level-2 { margin-left: var(--space-4); }
      &.toc-level-3 { margin-left: var(--space-8); }
      &.toc-level-4 { margin-left: var(--space-12); }
      &.toc-level-5 { margin-left: var(--space-16); }
      &.toc-level-6 { margin-left: var(--space-20); }
      
      a {
        color: var(--color-text-secondary);
        text-decoration: none;
        font-size: var(--font-size-sm);
        
        &:hover, &:focus {
          color: var(--color-primary-600);
        }
      }
    }
  }
}

.related-projects {
  border-top: 1px solid var(--color-border);
  padding: var(--space-4);
  h2 {
    margin-bottom: var(--space-4);
  }
}

.related-grid {
  gap: var(--space-4);
}

.related-card {
  display: flex;
  flex-direction: column;
  padding-bottom: var(--space-4);
  border: 1px solid var(--color-border);

  h3 {
    margin-bottom: var(--space-3);
    padding: 0 var(--space-4) var(--space-2);
    border-bottom: 1px solid var(--color-border);
    
    a {
      color: var(--color-text-primary);
      text-decoration: none;
      
      &:hover, &:focus {
        color: var(--color-primary-600);
      }
    }
  }
  
  p {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    padding: 0 var(--space-4);
    margin-bottom: var(--space-4);
    flex-grow: 1;
  }
}

.related-image {
  margin-bottom: var(--space-3);
  overflow: hidden;
  aspect-ratio: 16 / 9;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  a {
    display: block;
    width: 100%;
    height: 100%;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.related-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: 0 var(--space-4);
  
  .tag {
    font-size: var(--font-size-xs);
    padding: var(--space-1) var(--space-2);
  }
}

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-16);
  color: var(--color-text-secondary);
  
  h1 {
    color: var(--color-text-primary);
    margin-bottom: var(--space-4);
  }
  
  p {
    margin-bottom: var(--space-6);
  }
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-neutral-200);
  border-top: 3px solid var(--color-primary-600);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--space-4);
}

/* Battery Saver Mode - Themed Monochrome & Printed Effect */
[data-performance="power-saver"] {
  .project-image img, .related-image img {
    filter: var(--filter-battery-saver);
  }
  
  .project-container {
    position: relative;
  }
  
  .project-image {
    position: relative;
  
  }
  
  .markdown-content :deep(img) {
    filter: var(--filter-battery-saver);
  }

  .markdown-content :deep(iframe) {
    filter: var(--filter-battery-saver);
  }
}

.markdown-content :deep(iframe) {
    width: 100%;
}
</style>