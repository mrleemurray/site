<template>
  <div class="projects">
    <div class="container">
      <!-- Filters and Search -->
      <div class="projects-controls">
        <!-- <div class="search-container">
          <label for="project-search" class="visually-hidden">Search projects</label>
          <input
            id="project-search"
            type="text"
            placeholder="Search projects..."
            class="search-input"
            v-model="searchQuery"
          >
        </div> -->

        <div class="controls-group">
          <div class="filters">
            <label for="category-filter" class="filter-label">Filter by:</label>
            <select 
              id="category-filter"
              v-model="selectedCategory"
              class="filter-select"
            >
              <option value="">All Categories</option>
              <option 
                v-for="category in categories" 
                :key="category.id" 
                :value="category.id"
              >
                {{ category.name }} ({{ category.count }})
              </option>
            </select>
          </div>

          <div class="view-toggle">
            <label class="filter-label">View:</label>
            <div class="toggle-buttons">
              <button
                type="button"
                class="toggle-btn"
                :class="{ 'toggle-btn--active': viewMode === 'grid' }"
                @click="viewMode = 'grid'"
                aria-label="Grid view"
              >
                <GridIcon />
              </button>
              <button
                type="button"
                class="toggle-btn"
                :class="{ 'toggle-btn--active': viewMode === 'list' }"
                @click="viewMode = 'list'"
                aria-label="List view"
              >
                <ListIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

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
          viewMode === 'grid' ? 'projects-grid grid grid-responsive' : 'projects-list'
        ]"
      >
        <article 
          v-for="project in filteredProjects" 
          :key="project.id"
          class="project-card"
          :class="{ 'project-card--list': viewMode === 'list' }"
        >
          <div class="project-image">
            <img :src="project.image" :alt="project.title" loading="lazy" />
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
import { ref, computed, onMounted } from 'vue'
import { MarkdownLoader, ProjectUtils, type Project, type ProjectCategory } from '@/utils/projects'
import GridIcon from '../components/icons/GridIcon.vue'
import ListIcon from '../components/icons/ListIcon.vue'

const searchQuery = ref('')
const selectedCategory = ref('')
const viewMode = ref<'grid' | 'list'>('grid')
const projects = ref<Project[]>([])
const categories = ref<ProjectCategory[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const filteredProjects = computed(() => {
  let filtered = projects.value

  // Filter by category
  if (selectedCategory.value) {
    filtered = ProjectUtils.getProjectsByCategory(filtered, selectedCategory.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    filtered = ProjectUtils.searchProjects(filtered, searchQuery.value)
  }

  // Sort by date (newest first)
  return ProjectUtils.sortProjects(filtered, 'date')
})

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
}

const loadProjects = async () => {
  isLoading.value = true
  error.value = null

  try {
    const data = await MarkdownLoader.loadProjectsData()
    projects.value = data.projects
    categories.value = data.categories
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
  padding: var(--space-8) 0 var(--space-16);
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

.projects-controls {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-bottom: var(--space-12);
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.controls-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    gap: var(--space-6);
  }
}

.search-container {
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border);
  font-size: var(--font-size-base);
  background: var(--color-surface);
  color: var(--color-text-primary);
  transition: border-color var(--duration-fast) var(--ease-out);
  
  &:focus {
    border-color: var(--color-primary-500);
    outline: none;
  }
  
  &::placeholder {
    color: var(--color-text-tertiary);
  }
}

.filters {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.filter-label {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.filter-select {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  
  &:focus {
    border-color: var(--color-primary-500);
    outline: none;
  }
}

.view-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.toggle-buttons {
  display: flex;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2);
  background: var(--color-surface);
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  
  &:hover {
    background: var(--color-primary-50);
    color: var(--color-primary-600);
  }
  
  &--active {
    background: var(--color-primary-600);
    color: var(--color-white);
    
    &:hover {
      background: var(--color-primary-700);
    }
  }
  
  &:focus {
    outline: 2px solid var(--color-primary-500);
    outline-offset: 2px;
  }
}

.projects-container {
  margin-bottom: var(--space-12);
  
  &.projects-grid {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    padding: 1px; /* Prevents border collapse issues */
  }
}

.projects-list {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.project-card {
  background: var(--color-surface);
  border: none;
  border-radius: 0;
  overflow: hidden;
  transition: all var(--duration-normal) var(--ease-out);
  
  /* Grid view borders */
  .projects-grid & {
    border-right: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
    margin: -1px -1px -1px 0; /* Overlap borders */
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    z-index: 1;
    position: relative;
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
    
    &:hover {
      transform: translateY(-2px);
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
    transition: transform var(--duration-normal) var(--ease-out);
  }
}

.project-card:hover .project-image img {
  transform: scale(1.05);
}

.project-content {
  padding: var(--space-6);
  flex: 1;
  
  .project-card--list & {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}

.project-title {
  margin-bottom: var(--space-3);
  
  a {
    color: var(--color-text-primary);
    text-decoration: none;
    
    &:hover, &:focus {
      color: var(--color-primary-600);
    }
  }
}

.project-description {
  margin-bottom: var(--space-4);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
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
  }
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.project-links {
  display: flex;
  gap: var(--space-3);
  
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
  background: var(--color-primary-50);
  color: var(--color-primary-700);
  font-size: var(--font-size-xs);
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-medium);
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