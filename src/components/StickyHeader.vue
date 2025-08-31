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
            class="about-btn desktop-only" 
            @click="$emit('toggle-about')"
          >
            <span>
              About
            </span>
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
              <div class="mobile-nav-link mobile-control-item">
                <span class="mobile-control-label">Category</span>
                <div class="mobile-category-switch">
                  <button
                    type="button"
                    class="mobile-category-btn"
                    :class="{ 'mobile-category-btn--active': selectedCategory === '' }"
                    @click="handleMobileCategory('')"
                  >
                    All
                  </button>
                  <button
                    type="button"
                    class="mobile-category-btn"
                    :class="{ 'mobile-category-btn--active': selectedCategory === 'work' }"
                    @click="handleMobileCategory('work')"
                  >
                    Work
                  </button>
                  <button
                    type="button"
                    class="mobile-category-btn"
                    :class="{ 'mobile-category-btn--active': selectedCategory === 'experiments' }"
                    @click="handleMobileCategory('experiments')"
                  >
                    Experiments
                  </button>
                </div>
              </div>
            </li>
            <li role="none">
              <button 
                class="mobile-nav-link mobile-nav-button mobile-control-item" 
                role="menuitem"
                @click="handleMobileTheme"
                type="button"
              >
                <span class="mobile-control-label">Theme</span>
                <div class="mobile-control-value">
                  <ThemeIcon :theme="theme" />
                  <span>{{ theme === 'light' ? 'Light' : 'Dark' }}</span>
                </div>
              </button>
            </li>
            <li role="none">
              <button 
                class="mobile-nav-link mobile-nav-button mobile-control-item" 
                role="menuitem"
                @click="handleMobilePerformance"
                type="button"
              >
                <span class="mobile-control-label">Performance</span>
                <div class="mobile-control-value">
                  <PerformanceIcon :mode="performanceMode" />
                  <span>{{ performanceMode === 'full' ? 'Full' : 'Power Saver' }}</span>
                </div>
              </button>
            </li>
            <li role="none">
              <div class="mobile-nav-link mobile-control-item">
                <span class="mobile-control-label">View Mode</span>
                <div class="mobile-view-toggle">
                  <button
                    type="button"
                    class="mobile-toggle-btn"
                    :class="{ 'mobile-toggle-btn--active': viewMode === 'grid' }"
                    @click="handleMobileViewMode('grid')"
                    aria-label="Grid view"
                  >
                    <GridIcon />
                    <span>Grid</span>
                  </button>
                  <button
                    type="button"
                    class="mobile-toggle-btn"
                    :class="{ 'mobile-toggle-btn--active': viewMode === 'list' }"
                    @click="handleMobileViewMode('list')"
                    aria-label="List view"
                  >
                    <ListIcon />
                    <span>List</span>
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
    </div>
  </div>

  <!-- Mobile Menu Backdrop -->
  <div 
    v-if="mobileMenuOpen"
    class="mobile-menu-backdrop"
    @click="closeMobileMenu"
  ></div>
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
  'toggle-about': []
  'category-change': [category: string]
  'view-mode-change': [mode: 'grid' | 'list']
  'update:selectedCategory': [category: string]
  'update:viewMode': [mode: 'grid' | 'list']
}>()

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const handleMobileAbout = () => {
  emit('toggle-about')
  toggleMobileMenu()
}

const handleMobileTheme = () => {
  emit('toggle-theme')
  closeMobileMenu()
}

const handleMobilePerformance = () => {
  emit('toggle-performance')
  closeMobileMenu()
}

const handleMobileViewMode = (mode: 'grid' | 'list') => {
  emit('update:viewMode', mode)
  closeMobileMenu()
}

const handleMobileCategory = (category: string) => {
  emit('update:selectedCategory', category)
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
  z-index: 1001;
  transition: all var(--duration-normal) var(--ease-out);
  margin: 0 auto;
  padding: var(--space-2) 0 0 var(--space-2);
  
  // Create opaque backdrop only above the header
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: var(--space-2); // Only cover the padding area above
    background: var(--color-background);
    z-index: 0;
    pointer-events: none;
  }
}

.nav-section {
  border: 1px solid var(--color-border);
  background: var(--color-background);
  padding: 0;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3rem;
  padding: 0 var(--space-4);
}

.category-switch {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: var(--space-4);
  overflow: hidden;
  padding-top: 3px;
  
  @media (max-width: 767px) {
    display: none;
  }
}

.category-btn {
  background: none;
  border: none;
  font-family: var(--font-family-serif);
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
}

.nav-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: inherit;
  font-family: inherit;
}

.about-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: inherit;
  font-family: inherit;
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  transition: all var(--duration-fast) var(--ease-out);
  
  &:hover, &:focus {
    color: var(--color-primary-600);
    text-decoration: none;
  }
  
  &:focus {
    outline: 2px solid var(--color-primary-500);
    outline-offset: 2px;
  }
}

.nav-controls {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  
  @media (max-width: 767px) {
    .nav-link,
    .control-btn,
    .view-toggle {
      display: none;
    }
  }
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
  width: 28px;
  height: 28px;
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  
  &:hover, &:focus {
    color: var(--color-primary-600);
  }
  
  &:focus {
    outline: 2px solid var(--color-primary-500);
    outline-offset: 2px;
  }
}

.about-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  transition: all var(--duration-fast) var(--ease-out);
  
  &:hover, &:focus {
    color: var(--color-primary-600);
    text-decoration: none;
  }
  
  &:focus {
    outline: 2px solid var(--color-primary-500);
    outline-offset: 2px;
  }
}

.mobile-menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  
  &:hover, &:focus {
    color: var(--color-primary-600);
  }
  
  &:focus {
    outline: 2px solid var(--color-primary-500);
    outline-offset: 2px;
  }
  
  @media (min-width: 768px) {
    display: none;
  }
}

.mobile-menu-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 500;
  opacity: 0;
  animation: fadeIn var(--duration-fast) var(--ease-out) forwards;
  pointer-events: auto;
  
  @media (min-width: 768px) {
    display: none;
  }
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.mobile-menu {
  display: none;
  border-top: 1px solid var(--color-border);
  position: relative;
  z-index: 501;
  
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
  color: var(--color-text-primary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: all var(--duration-fast) var(--ease-out);
  
  &:hover, &:focus {
    color: var(--color-primary-600);
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

.mobile-control-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mobile-control-label {
  font-weight: var(--font-weight-medium);
  cursor: default;
}

.mobile-control-value {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.mobile-view-toggle {
  display: flex;
  gap: var(--space-2);
  color: var(--color-text-primary);
}

.mobile-toggle-btn {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  background: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  font-size: var(--font-size-xs);
  
  &:hover {
    color: var(--color-primary-600);
  }
  
  &--active {
    background: var(--color-primary-600);
    color: var(--color-white);
    border-color: var(--color-primary-600);
  }
}

.mobile-category-switch {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  color: var(--color-text-primary);
}

.mobile-category-btn {
  padding: var(--space-1) var(--space-2);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  
  &:hover {
    color: var(--color-primary-600);
  }
  
  &--active {
    background: var(--color-primary-600);
    color: var(--color-white);
    border-color: var(--color-primary-600);
  }
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
  // border: 1px solid var(--color-border);
  overflow: hidden;
  margin-top: 1px;
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-1);
  background: var(--color-background);
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  border-bottom: 2px solid transparent;
  
  &:hover {
    color: var(--color-primary-600);
  }
  
  &:focus {
    border-bottom: 2px solid var(--color-primary-500);
  }

  &--active {
    color: var(--color-primary-600);
  }
}
</style>