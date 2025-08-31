<template>
  <div 
    id="app" 
    :data-theme="theme"
    :data-performance="performanceMode"
    class="app"
  >
    <a href="#main-content" class="skip-link">Skip to main content</a>
    
        <StickyHeader 
      :theme="theme"
      :performance-mode="performanceMode"
      :selected-category="selectedCategory"
      :view-mode="viewMode"
      @toggle-theme="toggleTheme"
      @toggle-performance="togglePerformance"
      @toggle-about="toggleAboutModal"
      @update:selected-category="updateSelectedCategory"
      @update:view-mode="updateViewMode"
    />
    
    <main id="main-content" class="main" role="main">
      <router-view 
        :selected-category="selectedCategory"
        :view-mode="viewMode"
      />
    </main>
    
    <AboutModal 
      :is-open="aboutModalOpen"
      @close="closeAboutModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import StickyHeader from './components/StickyHeader.vue'
import AboutModal from './components/AboutModal.vue'

// Route management
const route = useRoute()
const isProjectsPage = computed(() => route.name === 'Projects')

// Theme management
const theme = ref<'light' | 'dark'>('light')
const performanceMode = ref<'full' | 'power-saver'>('full')
const aboutModalOpen = ref(false)

// Project controls state
const selectedCategory = ref('')
const viewMode = ref<'grid' | 'list'>('grid')

// Theme detection and persistence
const initializeTheme = () => {
  const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  theme.value = saved || (prefersDark ? 'dark' : 'light')
}

const initializePerformance = () => {
  const saved = localStorage.getItem('performance-mode') as 'full' | 'power-saver' | null
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  performanceMode.value = saved || (prefersReduced ? 'power-saver' : 'full')
}

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

const togglePerformance = () => {
  performanceMode.value = performanceMode.value === 'full' ? 'power-saver' : 'full'
}

const openAboutModal = () => {
  aboutModalOpen.value = true
}

const closeAboutModal = () => {
  aboutModalOpen.value = false
}

const toggleAboutModal = () => {
  aboutModalOpen.value = !aboutModalOpen.value
}

// Project controls handlers
const updateSelectedCategory = (value: string) => {
  selectedCategory.value = value
}

const updateViewMode = (value: 'grid' | 'list') => {
  viewMode.value = value
}

// Persist preferences
watch(theme, (newTheme) => {
  localStorage.setItem('theme', newTheme)
  document.documentElement.setAttribute('data-theme', newTheme)
})

watch(performanceMode, (newMode) => {
  localStorage.setItem('performance-mode', newMode)
  document.documentElement.setAttribute('data-performance', newMode)
})

onMounted(() => {
  initializeTheme()
  initializePerformance()
  
  // Listen for global about modal events
  window.addEventListener('open-about-modal', openAboutModal)
})

onUnmounted(() => {
  window.removeEventListener('open-about-modal', openAboutModal)
})
</script>

<style lang="scss" scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  padding-top: calc(4rem - var(--space-2)); // Nav height + controls height + padding
}

</style>