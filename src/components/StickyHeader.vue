<template>
  <div class="sticky-header">
    <!-- Navigation Section -->
    <div class="nav-section">
      <nav class="nav" role="navigation" aria-label="Main navigation">
        <!-- Logo/Brand -->
        <router-link to="/" class="brand" aria-label="Go to projects">
          <span class="brand-text">LM</span>
        </router-link>

        <div class="category-switch">
          <button
            type="button"
            class="category-btn"
            :class="{ 'category-btn--active': selectedCategory === '' }"
            @click="$emit('update:selectedCategory', '')"
          >
            All
          </button>
          <button
            type="button"
            class="category-btn"
            :class="{ 'category-btn--active': selectedCategory === 'work' }"
            @click="$emit('update:selectedCategory', 'work')"
          >
            Work
          </button>
          <button
            type="button"
            class="category-btn"
            :class="{ 'category-btn--active': selectedCategory === 'experiments' }"
            @click="$emit('update:selectedCategory', 'experiments')"
          >
            Experiments
          </button>
        </div>

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
}

withDefaults(defineProps<Props>(), {
  showProjectControls: false,
  selectedCategory: '',
  viewMode: 'grid'
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
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 1280px;
  z-index: 1000;
  // background: color-mix(in srgb, var(--color-background) 60%, transparent);
  background: var(--color-background);
  // backdrop-filter: blur(16px);
  transition: all var(--duration-normal) var(--ease-out);
  margin: 0 auto;
  padding: var(--space-2) var(--space-2) 0 var(--space-2);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.nav-section {
  border: 1px solid var(--color-border);
  padding: 0 var(--space-2);
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3rem;
}

.category-switch {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background-color: var(--color-surface);
  overflow: hidden;
  padding-top: 3px;
}

.category-btn {
  background: none;
  border: none;
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 3px solid transparent;


  &:last-child {
    border-right: none;
  }

  &:hover {
    border-color: var(--color-border);
  }

  &--active {
    border-color: var(--color-primary-600);
  }
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
  // margin: 0 calc(var(--space-4) + 1px);
  padding: var(--space-2) var(--space-2);
  border: 1px solid var(--color-border);
}

.projects-controls {
  width: var(--container-width);
  max-width: 100%;
  margin: 0 auto;
  padding: 0 var(--space-md);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: var(--space-xl);

  .controls-group {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    flex: 1;
    justify-content: center;
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