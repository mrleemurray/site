<template>
  <div 
    id="app" 
    :data-theme="theme" 
    :data-performance="performanceMode"
    class="app"
  >
    <a href="#main-content" class="skip-link">Skip to main content</a>
    
    <AppHeader 
      :theme="theme"
      :performance-mode="performanceMode"
      @toggle-theme="toggleTheme"
      @toggle-performance="togglePerformance"
      @open-about="openAboutModal"
    />
    
    <main id="main-content" class="main" role="main">
      <router-view />
    </main>
    
    <AboutModal 
      :is-open="aboutModalOpen"
      @close="closeAboutModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AboutModal from './components/AboutModal.vue'

// Theme management
const theme = ref<'light' | 'dark'>('light')
const performanceMode = ref<'full' | 'power-saver'>('full')
const aboutModalOpen = ref(false)

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
  padding-top: var(--space-20); // Account for fixed header
}

@media (max-width: 767px) {
  .main {
    padding-top: var(--space-16);
  }
}
</style>