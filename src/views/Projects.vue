<template>
  <div class="projects">
    <div class="container">
      <!-- Page Header -->
      <header class="page-header">
        <h1 class="page-title">My Projects</h1>
        <p class="page-description">
          A showcase of my work, experiments, and contributions to the development community.
        </p>
      </header>

      <!-- Filters and Search -->
      <div class="projects-controls">
        <div class="search-container">
          <label for="project-search" class="visually-hidden">Search projects</label>
          <input
            id="project-search"
            type="text"
            placeholder="Search projects..."
            class="search-input"
            v-model="searchQuery"
          >
        </div>

        <div class="filters">
          <label for="category-filter" class="filter-label">Filter by:</label>
          <select 
            id="category-filter"
            v-model="selectedCategory"
            class="filter-select"
          >
            <option value="">All Categories</option>
            <option value="web">Web Development</option>
            <option value="mobile">Mobile</option>
            <option value="api">APIs</option>
            <option value="tools">Tools</option>
          </select>
        </div>
      </div>

      <!-- Projects Grid -->
      <div class="projects-grid grid grid-responsive">
        <!-- Project placeholders - will be populated with actual project data -->
        <article class="project-card">
          <div class="project-image">
            <div class="image-placeholder">Project Image</div>
          </div>
          <div class="project-content">
            <h3 class="project-title">
              <router-link to="/projects/sample-project">
                Sample Project
              </router-link>
            </h3>
            <p class="project-description">
              This is a placeholder for project descriptions. Replace with actual project content.
            </p>
            <div class="project-tags">
              <span class="tag">Vue.js</span>
              <span class="tag">TypeScript</span>
              <span class="tag">SCSS</span>
            </div>
          </div>
        </article>

        <article class="project-card">
          <div class="project-image">
            <div class="image-placeholder">Project Image</div>
          </div>
          <div class="project-content">
            <h3 class="project-title">
              <router-link to="/projects/another-project">
                Another Project
              </router-link>
            </h3>
            <p class="project-description">
              Another placeholder project description. Customize with your actual projects.
            </p>
            <div class="project-tags">
              <span class="tag">React</span>
              <span class="tag">Node.js</span>
              <span class="tag">API</span>
            </div>
          </div>
        </article>
      </div>

      <!-- Empty State -->
      <div v-if="filteredProjects.length === 0" class="empty-state">
        <p>No projects found matching your criteria.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const searchQuery = ref('')
const selectedCategory = ref('')

// Placeholder computed property - replace with actual project data
const filteredProjects = computed(() => {
  // This will be implemented when you add actual project data
  return []
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

.search-container {
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
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
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  
  &:focus {
    border-color: var(--color-primary-500);
    outline: none;
  }
}

.projects-grid {
  margin-bottom: var(--space-12);
}

.project-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: all var(--duration-normal) var(--ease-out);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
}

.project-image {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: var(--color-neutral-100);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
}

.project-content {
  padding: var(--space-6);
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

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
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

.empty-state {
  text-align: center;
  padding: var(--space-16);
  color: var(--color-text-secondary);
}
</style>