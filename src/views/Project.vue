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
            <div class="project-meta">
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
          <aside v-if="tableOfContents.length > 0" class="content-sidebar">
            <nav class="toc" aria-label="Table of contents">
              <h3>Table of Contents</h3>
              <ul>
                <li 
                  v-for="heading in tableOfContents" 
                  :key="heading.id"
                  :class="`toc-level-${heading.level}`"
                >
                  <a :href="`#${heading.id}`">{{ heading.text }}</a>
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
import { ref, computed, onMounted, watch } from 'vue'
import { MarkdownLoader, type Project } from '@/utils/projects'

interface Props {
  slug: string
}

const props = defineProps<Props>()

const project = ref<Project | null>(null)
const allProjects = ref<Project[]>([])
const markdownContent = ref('')
const tableOfContents = ref<Array<{ id: string; text: string; level: number }>>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

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

  try {
    // Load all projects data first (for related projects)
    const data = await MarkdownLoader.loadProjectsData()
    allProjects.value = data.projects

    // Load the specific project with its content
    const parsed = await MarkdownLoader.loadProjectContent(props.slug)
    project.value = parsed.frontmatter

    // Process the markdown content
    markdownContent.value = MarkdownLoader.parseMarkdownToHTML(parsed.content)
    tableOfContents.value = MarkdownLoader.extractTableOfContents(parsed.content)

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

onMounted(() => {
  loadProject()
})
</script>

<style lang="scss" scoped>
.project-detail {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding-bottom: var(--space-2);
  background: var(--color-background);
}

.project-container {
  padding: 0;
  margin-left: var(--space-2);
  border: 1px solid var(--color-border);
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
  color: var(--color-primary-700);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  border: 1px solid color-mix(in srgb, var(--color-primary-700) 20%, transparent);
  cursor: default;
}

.project-image {
  overflow: hidden;
  border-bottom: 1px solid var(--color-border);
  
  img {
    width: 100%;
    height: auto;
    display: block;
    transition: filter var(--duration-normal) var(--ease-out);
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
    margin: var(--space-6) 0;
    box-shadow: var(--shadow-md);
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

  padding: var(--space-6);
  
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

// Battery Saver Mode - Themed Monochrome & Printed Effect for individual project pages
[data-performance="power-saver"] {
  .project-image img {
    // Convert to grayscale first, then apply site color theme
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
  
  .project-container {
    position: relative;
    
    // Add subtle texture overlay for printed effect with site colors
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
  }
  
  .project-image {
    position: relative;
    
    // Add a themed color overlay
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
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        repeating-linear-gradient(
          45deg,
          transparent,
          transparent 1px,
          var(--color-text-secondary) 1px,
          var(--color-text-secondary) 2px
        );
      pointer-events: none;
      opacity: 0.04;
      z-index: 2;
      mix-blend-mode: multiply;
    }
  }
  
  // Apply themed printed effect to markdown images as well
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