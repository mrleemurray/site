<template>
  <div class="sticky-header">
    <!-- Navigation Section -->
    <div class="nav-section">
      <div class="container">
        <nav class="nav" role="navigation" aria-label="Main navigation">
          <!-- Logo/Brand -->
          <router-link to="/" class="brand" aria-label="Go to projects">
            <span class="brand-text">LM</span>
          </router-link>

          <!-- Controls -->
          <div class="nav-controls">
            <button 
                class="nav-link nav-button" 
                role="menuitem"
                @click="$emit('open-about')"
                type="button"
              >
                About
              </button>
            <button 
              class="control-btn" 
              @click="$emit('toggle-theme')"
              :aria-label="`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`"
              type="button"
            >
              <ThemeIcon :theme="theme" />
            </button>
            
            <button 
              class="control-btn" 
              @click="$emit('toggle-performance')"
              :aria-label="`Switch to ${performanceMode === 'full' ? 'power saver' : 'full'} mode`"
              type="button"
            >
              <PerformanceIcon :mode="performanceMode" />
            </button>
            
            <button 
              class="mobile-menu-btn" 
              @click="toggleMobileMenu"
              :aria-expanded="mobileMenuOpen"
              aria-controls="mobile-menu"
              aria-label="Toggle navigation menu"
              type="button"
            >
              <MenuIcon :open="mobileMenuOpen" />
            </button>
          </div>
        </nav>

        <!-- Mobile Menu -->
        <div 
          id="mobile-menu"
          class="mobile-menu" 
          :class="{ 'mobile-menu--open': mobileMenuOpen }"
          :aria-hidden="!mobileMenuOpen"
        >
          <ul class="mobile-nav-links" role="menu">
            <li role="none">
              <router-link 
                to="/" 
                class="mobile-nav-link" 
                role="menuitem"
                @click="closeMobileMenu"
              >
                Projects
              </router-link>
            </li>
            <li role="none">
              <button 
                class="mobile-nav-link mobile-nav-button" 
                role="menuitem"
                @click="handleMobileAbout"
                type="button"
              >
                About
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Projects Controls Section -->
    <div v-if="showProjectControls" class="controls-section">
      <div class="container">
        <div class="projects-controls">
          <div class="controls-group">
            <div class="filters">
              <label for="category-filter" class="filter-label"></label>
              <select 
                id="category-filter"
                :value="selectedCategory"
                @change="(event) => $emit('update:selectedCategory', (event.target as HTMLSelectElement).value)"
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
              <div class="toggle-buttons">
                <button
                  type="button"
                  class="toggle-btn"
                  :class="{ 'toggle-btn--active': viewMode === 'grid' }"
                  @click="$emit('update:viewMode', 'grid')"
                  aria-label="Grid view"
                >
                  <GridIcon />
                </button>
                <button
                  type="button"
                  class="toggle-btn"
                  :class="{ 'toggle-btn--active': viewMode === 'list' }"
                  @click="$emit('update:viewMode', 'list')"
                  aria-label="List view"
                >
                  <ListIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ThemeIcon from './icons/ThemeIcon.vue'
import PerformanceIcon from './icons/PerformanceIcon.vue'
import MenuIcon from './icons/MenuIcon.vue'
import GridIcon from './icons/GridIcon.vue'
import ListIcon from './icons/ListIcon.vue'

interface Props {
  theme: 'light' | 'dark'
  performanceMode: 'full' | 'power-saver'
  showProjectControls?: boolean
  selectedCategory?: string
  viewMode?: 'grid' | 'list'
  categories?: Array<{ id: string; name: string; count: number }>
}

withDefaults(defineProps<Props>(), {
  showProjectControls: false,
  selectedCategory: '',
  viewMode: 'grid',
  categories: () => []
})

const emit = defineEmits<{
  'toggle-theme': []
  'toggle-performance': []
  'open-about': []
  'update:selectedCategory': [value: string]
  'update:viewMode': [value: 'grid' | 'list']
}>()

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const handleMobileAbout = () => {
  emit('open-about')
  closeMobileMenu()
}
</script>

<style lang="scss" scoped>
.sticky-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: color-mix(in srgb, var(--color-background) 60%, transparent);
  backdrop-filter: blur(16px);
  transition: all var(--duration-normal) var(--ease-out);
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
}

.brand {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  text-decoration: none;
  
  &:hover, &:focus {
    color: var(--color-primary-600);
    text-decoration: none;
  }
}

.brand-text {
  font-family: var(--font-family-heading);
}

.nav-links {
  display: none;
  list-style: none;
  gap: var(--space-8);
  
  @media (min-width: 768px) {
    display: flex;
  }
}

.nav-link {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  transition: all var(--duration-fast) var(--ease-out);
  
  &:hover, &:focus {
    color: var(--color-text-primary);
    background: var(--color-primary-50);
  }
  
  &[aria-current="page"] {
    color: var(--color-primary-600);
    background: var(--color-primary-50);
  }
}

.nav-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: inherit;
  font-family: inherit;
}

.nav-controls {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.controls-group {
    display: flex;
    width: 100%;
    justify-content: space-between;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  
  &:hover, &:focus {
    background: var(--color-primary-50);
    color: var(--color-primary-600);
  }
  
  &:focus {
    outline: 2px solid var(--color-primary-500);
    outline-offset: 2px;
  }
}

.mobile-menu-btn {
  display: flex;
  
  @media (min-width: 768px) {
    display: none;
  }
}

.mobile-menu {
  display: none;
  padding: var(--space-4) 0;
  border-top: 1px solid var(--color-border);
  
  &--open {
    display: block;
  }
  
  @media (min-width: 768px) {
    display: none !important;
  }
}

.mobile-nav-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.mobile-nav-link {
  display: block;
  padding: var(--space-3) var(--space-4);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  transition: all var(--duration-fast) var(--ease-out);
  
  &:hover, &:focus {
    color: var(--color-text-primary);
    background: var(--color-primary-50);
  }
}

.mobile-nav-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: inherit;
  font-family: inherit;
  width: 100%;
  text-align: left;
}

.controls-section {
  padding: var(--space-3) 0;
}

.projects-controls {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  
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

.filters {
  display: flex;
  align-items: center;
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
</style>