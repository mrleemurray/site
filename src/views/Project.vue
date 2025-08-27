<template>
  <div class="project-detail">
    <div class="container">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading project...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <h1>Project Not Found</h1>
        <p>{{ error }}</p>
        <router-link to="/projects" class="btn btn-primary">
          Back to Projects
        </router-link>
      </div>

      <!-- Project Content -->
      <div v-else-if="project">
        <!-- Back Navigation -->
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <router-link to="/projects" class="back-link">
            ← Back to Projects
          </router-link>
        </nav>

        <!-- Project Header -->
        <header class="project-header">
          <h1 class="project-title">{{ project.title }}</h1>
          <p class="project-subtitle">{{ project.subtitle }}</p>
          
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
        </header>

        <!-- Project Image -->
        <div class="project-image">
          <img :src="project.image" :alt="project.title" />
        </div>

        <!-- Project Content -->
        <div class="project-content">
          <div class="content-main">
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
import { useRoute } from 'vue-router'
import { MarkdownLoader, ProjectUtils, type Project } from '@/utils/projects'

interface Props {
  slug: string
}

const props = defineProps<Props>()
const route = useRoute()

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
  padding: var(--space-8) 0 var(--space-16);
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
  margin-bottom: var(--space-4);
}

.project-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-8);
}

.project-meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  align-items: center;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: center;
  }
}

.project-links {
  display: flex;
  gap: var(--space-4);
}

.project-link {
  padding: var(--space-3) var(--space-6);
  background: var(--color-primary-600);
  color: white;
  text-decoration: none;
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-medium);
  transition: background var(--duration-fast) var(--ease-out);
  
  &:hover, &:focus {
    background: var(--color-primary-700);
    color: white;
    text-decoration: none;
  }
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  justify-content: center;
}

.tag {
  display: inline-block;
  padding: var(--space-2) var(--space-4);
  background: var(--color-primary-50);
  color: var(--color-primary-700);
  font-size: var(--font-size-sm);
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-medium);
}

.project-image {
  margin-bottom: var(--space-12);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  
  img {
    width: 100%;
    height: auto;
    display: block;
  }
}

.project-content {
  display: grid;
  gap: var(--space-12);
  margin-bottom: var(--space-16);
  
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 300px;
    gap: var(--space-16);
  }
}

.content-main {
  min-width: 0; // Prevent grid overflow
}

.markdown-content {
  line-height: var(--line-height-relaxed);
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: var(--space-12);
    margin-bottom: var(--space-6);
    color: var(--color-text-primary);
    
    &:first-child {
      margin-top: 0;
    }
  }
  
  h2 {
    border-bottom: 2px solid var(--color-border);
    padding-bottom: var(--space-4);
  }
  
  p {
    margin-bottom: var(--space-4);
    color: var(--color-text-secondary);
  }
  
  ul, ol {
    margin-bottom: var(--space-4);
    margin-left: var(--space-6);
    
    li {
      margin-bottom: var(--space-2);
      color: var(--color-text-secondary);
    }
  }
  
  pre {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    padding: var(--space-6);
    border-radius: var(--radius-lg);
    overflow-x: auto;
    margin-bottom: var(--space-6);
    
    code {
      font-family: var(--font-family-mono);
      font-size: var(--font-size-sm);
      color: var(--color-text-primary);
    }
  }
  
  code:not(pre code) {
    background: var(--color-surface);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
    font-family: var(--font-family-mono);
    font-size: 0.9em;
    color: var(--color-primary-700);
  }
  
  blockquote {
    border-left: 4px solid var(--color-primary-500);
    margin: var(--space-6) 0;
    padding: var(--space-4) var(--space-6);
    background: var(--color-surface);
    font-style: italic;
    
    p {
      margin-bottom: 0;
    }
  }
  
  img {
    max-width: 100%;
    height: auto;
    border-radius: var(--radius-lg);
    margin: var(--space-6) 0;
    box-shadow: var(--shadow-md);
  }
  
  a {
    color: var(--color-primary-600);
    
    &:hover, &:focus {
      color: var(--color-primary-700);
    }
  }
  
  table {
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
  top: var(--space-24);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
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
  h2 {
    text-align: center;
    margin-bottom: var(--space-8);
  }
}

.related-grid {
  max-width: 800px;
  margin: 0 auto;
}

.related-card {
  padding: var(--space-6);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  transition: all var(--duration-normal) var(--ease-out);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
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
</style>