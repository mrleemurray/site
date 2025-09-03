<template>
  <div class="sticky-header">
    <!-- Navigation Section -->
    <div class="nav-section">
      <nav class="nav" role="navigation" aria-label="Main navigation">
        <div class="logo-nav">
          <!-- Show logo when NOT on project page, OR when on project page but in desktop mode -->
          <router-link 
            v-if="!isProjectPage"
            to="/" 
            class="brand" 
            aria-label="Go to projects" 
            @click="handleLogoClick"
          >
            <LogoIcon />
          </router-link>
          
          <!-- Desktop logo for project page -->
          <router-link 
            v-if="isProjectPage"
            to="/" 
            class="brand brand--desktop-only" 
            aria-label="Go to projects" 
            @click="handleLogoClick"
          >
            <LogoIcon />
          </router-link>
          
          <!-- Mobile layout for project page -->
          <div v-if="isProjectPage" class="mobile-project-nav">
            <router-link to="/" class="mobile-back-button" @click="handleMobileBackClick">
              ←
            </router-link>
            <div class="sticky-project-title">
              {{ stickyProjectTitle }}
            </div>
            <div class="mobile-spacer"></div>
          </div>
        </div>

        <div v-if="isProjectPage" class="back-to-projects">
          <router-link to="/" class="back-link" @click="handleDesktopBackClick">
            ← Back to Projects
          </router-link>
        </div>

        <div v-else class="category-switch">
          <button
            type="button"
            class="category-btn"
            :class="{ 'category-btn--active': selectedCategory === '' }"
            @click="handleCategoryClick('')"
          >
            All
          </button>
          <button
            type="button"
            class="category-btn"
            :class="{ 'category-btn--active': selectedCategory === 'work' }"
            @click="handleCategoryClick('work')"
          >
            Work
          </button>
          <button
            type="button"
            class="category-btn"
            :class="{ 'category-btn--active': selectedCategory === 'experiments' }"
            @click="handleCategoryClick('experiments')"
          >
            Experiments
          </button>
        </div>

        <!-- Controls -->
        <div class="nav-controls">
          <!-- Desktop About Button -->
          <button 
            class="control-btn about-btn" 
            @click="$emit('toggle-about')"
            aria-label="Open about modal"
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
              v-if="!isProjectPage"
              type="button"
              class="control-btn view-mode-btn"
              @click="$emit('update:viewMode', viewMode === 'grid' ? 'list' : 'grid')"
              :aria-label="`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`"
            >
              <GridIcon v-if="viewMode === 'grid'" />
              <ListIcon v-else />
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
              <button 
                class="mobile-nav-link mobile-nav-button" 
                role="menuitem"
                @click="handleMobileAbout"
                type="button"
              >
                About
              </button>
            </li>
            <li v-if="!isProjectPage" role="none">
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
            <li v-if="false" role="none">
              <button 
                class="mobile-nav-link mobile-nav-button mobile-control-item"
                role="menuitem"
                @click="handleMobileViewModeToggle"
                type="button"
              >
                <span class="mobile-control-label">View Mode</span>
                <div class="mobile-control-value">
                  <GridIcon v-if="viewMode === 'grid'" />
                  <ListIcon v-else />
                  <span>{{ viewMode === 'grid' ? 'Grid' : 'List' }}</span>
                </div>
              </button>
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
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import ThemeIcon from './icons/ThemeIcon.vue'
import PerformanceIcon from './icons/PerformanceIcon.vue'
import MenuIcon from './icons/MenuIcon.vue'
import GridIcon from './icons/GridIcon.vue'
import ListIcon from './icons/ListIcon.vue'
import LogoIcon from './icons/LogoIcon.vue'

interface Props {
  theme: 'light' | 'dark'
  performanceMode: 'full' | 'power-saver'
  showProjectControls?: boolean
  selectedCategory?: string
  viewMode?: 'grid' | 'list'
  stickyProjectTitle?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  showProjectControls: false,
  selectedCategory: '',
  viewMode: 'grid'
})

const route = useRoute()
const isProjectPage = computed(() => route.name === 'Project')

const emit = defineEmits<{
  'toggle-theme': []
  'toggle-performance': []
  'toggle-about': []
  'close-about': []
  'category-change': [category: string]
  'view-mode-change': [mode: 'grid' | 'list']
  'update:selectedCategory': [category: string]
  'update:viewMode': [mode: 'grid' | 'list']
  'clear-sticky-title': []
}>()

// Clear sticky title when leaving project page
watch(isProjectPage, (newIsProjectPage) => {
  if (!newIsProjectPage) {
    emit('clear-sticky-title')
  }
})

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const handleMobileTheme = () => {
  emit('toggle-theme')
  closeMobileMenu()
}

const handleMobilePerformance = () => {
  emit('toggle-performance')
  closeMobileMenu()
}

const handleMobileAbout = () => {
  emit('toggle-about')
  closeMobileMenu()
}

const handleMobileViewModeToggle = () => {
  const newMode = props.viewMode === 'grid' ? 'list' : 'grid'
  emit('update:viewMode', newMode)
  closeMobileMenu()
}

const handleMobileCategory = (category: string) => {
  emit('update:selectedCategory', category)
  emit('close-about')
  closeMobileMenu()
}

const handleCategoryClick = (category: string) => {
  emit('update:selectedCategory', category)
  emit('close-about')
}

const handleLogoClick = () => {
  emit('update:selectedCategory', '')
  emit('close-about')
  closeMobileMenu()
}

const handleMobileBackClick = () => {
  emit('close-about')
  closeMobileMenu()
}

const handleDesktopBackClick = () => {
  emit('close-about')
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
  z-index: 1100;
  margin: 0 auto;
  padding: var(--space-2) 0 0 0;

  @media (max-width: 1280px) {
    padding: 0px;
  }
  
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
  @media (max-width: 768px) {
    border: none;
    border-bottom: 1px solid var(--color-border);
  }
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3rem;
  padding: 0 var(--space-4);
  
  @media (max-width: 767px) {
    gap: var(--space-2);
  }
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

.back-to-projects {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  
  @media (max-width: 767px) {
    display: none;
  }
}

.back-link {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-family: var(--font-family-serif);
  font-size: var(--font-size-base);
  font-weight: 500;
  
  &:hover, &:focus {
    color: var(--color-primary-600);
    text-decoration: none;
  }
}

.sticky-project-title {
  color: var(--color-text-primary);
  font-family: var(--font-family-serif);
  font-weight: var(--font-weight-medium);
  opacity: 0;
  transition: all var(--duration-normal) var(--ease-out);
  
  &:not(:empty) {
    opacity: 1;
    transform: translateY(0);
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
  border-bottom: 3px solid transparent;


  &:last-child {
    border-right: none;
  }

  &:hover {
    border-color: var(--color-border);
  }

  &--active, &:focus {
    border-color: var(--color-primary-600);
  }
}

.brand {
  display: flex;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  text-decoration: none;
  
  &:hover, &:focus {
    color: var(--color-primary-600);
    text-decoration: none;
  }
}

.brand--desktop-only {
  @media (max-width: 767px) {
    display: none;
  }
}

.logo-nav {
  display: flex;
  align-items: center;
  padding-right: var(--space-4);
  height: 100%;
  border-right: 1px solid var(--color-border);
  


  @media (max-width: 1280px) {
    border: none;
  }
}

.mobile-project-nav {
  display: none;
  
  @media (max-width: 767px) {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    width: 100%;
    gap: var(--space-2);
    
    .sticky-project-title {
      text-align: center;
      grid-column: 2;
    }
    
    .mobile-back-button {
      grid-column: 1;
      justify-self: start;
    }
    
    .mobile-spacer {
      grid-column: 3;
    }
  }
}

.mobile-back-button {
  display: none;
  
  @media (max-width: 767px) {
    display: block;
    color: var(--color-text-secondary);
    text-decoration: none;
    font-weight: var(--font-weight-medium);
    font-family: var(--font-family-serif);
    
    &:hover, &:focus {
      color: var(--color-primary-600);
    }
  }
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
  line-height: 28px;
  text-decoration: none;
  
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
    .view-toggle,
    .about-btn,
    .view-mode-btn {
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
  z-index: 10;
  
  &:hover, &:focus {
    color: var(--color-primary-600);
  }
  
  &:focus {
    outline: 2px solid var(--color-primary-500);
    outline-offset: 2px;
  }
}

.about-btn {
  width: auto;
  padding: 0 var(--space-2);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  font-family: inherit;
  
  @media (max-width: 767px) {
    display: none;
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
  z-index: 10;
  
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
  z-index: 1050;
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
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  padding-bottom: var(--sapce-2);
  background: var(--color-background);
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
</style>