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
          <h1>Project Not Found</h1>
          <p>{{ error }}</p>
          <router-link to="/" class="btn btn-primary">
            Back to Projects
          </router-link>
        </div>

        <!-- Project Content -->
        <div v-else-if="project">

        <!-- Project Image -->
        <div class="project-image">
          <img :src="project.image" :alt="project.title" />
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
                  View Live Site
                </a>
                <a 
                  v-if="project.sourceUrl"
                  :href="project.sourceUrl" 
                  class="project-link" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View Source
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { MarkdownLoader, type Project } from '@/utils/projects'

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

const loadProject = async () => {
  isLoading.value = true
  error.value = null
  markdownContent.value = ''
  tableOfContents.value = []
  
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

    // Process the markdown content
    markdownContent.value = MarkdownLoader.parseMarkdownToHTML(parsed.content)
    tableOfContents.value = MarkdownLoader.extractTableOfContents(parsed.content)

    // Set up sticky detection after content is loaded
    setTimeout(() => {
      setupStickyDetection()
    }, 100)

  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load project'
    console.error('Error loading project:', err)
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
  top: calc(var(--space-16) - 6px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background);
  z-index: 10;

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
    color: var(--color-primary-700);
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
  
  img {
    width: 100%;
    height: auto;
    display: block;
  }
}

.project-content {
  display: grid;
  // margin-bottom: var(--space-16);
  
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
  
  :deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
    margin-top: var(--space-8);
    margin-bottom: var(--space-6);
    color: var(--color-text-primary);
    
    &:first-child {
      margin-top: 0;
    }
  }

  :deep(h1) {
    font-size: var(--font-size-3xl);
  }
  
  :deep(h2) {
    // border-bottom: 2px solid var(--color-border);
    padding-bottom: var(--space-4);
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
    
    &:hover, &:focus {
      color: var(--color-primary-700);
    }
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
  border-left: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);

  padding: var(--space-5);

  @media (max-width: 768px) {
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
  padding-top: var(--space-4);
  h2 {
    padding-left: var(--space-4);
    margin-bottom: var(--space-4);
  }
}

.related-card {
  padding: var(--space-4);

  h3 {
    margin-bottom: var(--space-3);
    
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
    margin-bottom: var(--space-4);
  }
}

.related-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  
  .tag {
    font-size: var(--font-size-xs);
    padding: var(--space-1) var(--space-2);
  }
}

.loading-state, .error-state {
  text-align: center;
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
  .project-image img {
    filter: 
      grayscale(100%) 
      contrast(5) 
      brightness(1.2)
      hue-rotate(10deg) 
      saturate(1)
      opacity(0.85);
  }
  
  .project-container {
    position: relative;
  }
  
  .project-image {
    position: relative;
  
  }
  
  .markdown-content :deep(img) {
    filter: 
      grayscale(100%) 
      contrast(1.2) 
      brightness(0.9)
      sepia(100%) 
      hue-rotate(10deg) 
      saturate(0.8)
      opacity(0.85);
    
    &:hover {
      filter: 
        grayscale(80%) 
        contrast(1.1) 
        brightness(0.95)
        sepia(60%) 
        hue-rotate(10deg) 
        saturate(0.6)
        opacity(0.9);
    }
  }
}
</style>