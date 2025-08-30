<template>
  <div class="projects">
    <div class="container">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
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
          viewMode === 'grid' ? 'projects-grid' : 'projects-list'
        ]"
      >
        <article 
          v-for="project in filteredProjects" 
          :key="project.id"
          class="project-card"
          :class="{ 'project-card--list': viewMode === 'list' }"
        >
          <div class="project-image">
            <router-link :to="`/projects/${project.id}`">
              <img :src="project.image" :alt="project.title" loading="lazy" />
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
              <div class="project-links">
                <a 
                  v-if="project.liveUrl" 
                  :href="project.liveUrl" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="project-link"
                >
                  Live Demo
                </a>
                <a 
                  v-if="project.sourceUrl" 
                  :href="project.sourceUrl" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="project-link"
                >
                  Source Code
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <h3>No projects found</h3>
        <p v-if="searchQuery || selectedCategory">
          Try adjusting your search criteria or browse all projects.
        </p>
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
import { ref, computed, onMounted, toRefs } from 'vue'
import { MarkdownLoader, ProjectUtils, type Project, type ProjectCategory } from '@/utils/projects'

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
}>()

const searchQuery = ref('')
const projects = ref<Project[]>([])
const categories = ref<ProjectCategory[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

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
const { selectedCategory, viewMode } = toRefs(props)

const clearFilters = () => {
  searchQuery.value = ''
}

const loadProjects = async () => {
  isLoading.value = true
  error.value = null

  try {
    const data = await MarkdownLoader.loadProjectsData()
    projects.value = data.projects
    categories.value = data.categories
    
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
})
</script>

<style lang="scss" scoped>
.projects {
  padding: var(--space-8) 0 var(--space-14);
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
    padding-right: 1px; /* Prevents border collapse issues */
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
  transition: all var(--duration-normal) var(--ease-out);
  height: 100%;
  display: flex;
  flex-direction: column;
  
  /* Grid view borders */
  .projects-grid & {
    border-right: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
    margin-right: -1px;
    margin-bottom: -1px;
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
    
    @media (max-width: 767px) {
      flex-direction: column;
    }
  }
}

.project-image {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  
  .project-card--list & {
    flex-shrink: 0;
    width: 300px;
    aspect-ratio: 16 / 10;
    
    @media (max-width: 767px) {
      width: 100%;
      aspect-ratio: 16 / 9;
    }
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
  border-bottom: 1px solid var(--color-border);
}

.project-meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  
  
  .project-card--list & {
    @media (min-width: 768px) {
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-end;
    }

    .project-links {
      border-top: none;
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
    
    &:hover, &:focus {
      color: var(--color-primary-700);
      text-decoration: underline;
    }
  }
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

.loading-state, .error-state {
  text-align: center;
  padding: var(--space-16);
  color: var(--color-text-secondary);
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

.empty-state {
  text-align: center;
  padding: var(--space-16);
  color: var(--color-text-secondary);
  
  h3 {
    margin-bottom: var(--space-4);
    color: var(--color-text-primary);
  }
  
  p {
    margin-bottom: var(--space-6);
  }
}
</style>