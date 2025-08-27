<template>
  <header class="header" role="banner">
    <div class="container">
      <nav class="nav" role="navigation" aria-label="Main navigation">
        <!-- Logo/Brand -->
        <router-link to="/" class="brand" aria-label="Go to homepage">
          <span class="brand-text">Portfolio</span>
        </router-link>

        <!-- Desktop Navigation -->
        <ul class="nav-links" role="menubar">
          <li role="none">
            <router-link 
              to="/" 
              class="nav-link" 
              role="menuitem"
              :aria-current="$route.name === 'Home' ? 'page' : undefined"
            >
              Home
            </router-link>
          </li>
          <li role="none">
            <router-link 
              to="/projects" 
              class="nav-link" 
              role="menuitem"
              :aria-current="$route.name === 'Projects' ? 'page' : undefined"
            >
              Projects
            </router-link>
          </li>
          <li role="none">
            <button 
              class="nav-link nav-button" 
              role="menuitem"
              @click="$emit('open-about')"
              type="button"
            >
              About
            </button>
          </li>
        </ul>

        <!-- Controls -->
        <div class="controls">
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
              Home
            </router-link>
          </li>
          <li role="none">
            <router-link 
              to="/projects" 
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
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ThemeIcon from './icons/ThemeIcon.vue'
import PerformanceIcon from './icons/PerformanceIcon.vue'
import MenuIcon from './icons/MenuIcon.vue'

interface Props {
  theme: 'light' | 'dark'
  performanceMode: 'full' | 'power-saver'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'toggle-theme': []
  'toggle-performance': []
  'open-about': []
}>()

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const handleMobileAbout = () => {
  closeMobileMenu()
  emit('open-about')
}
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(8px);
  transition: all var(--duration-normal) var(--ease-out);
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
  
  @media (min-width: 768px) {
    height: 5rem;
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
  font-weight: var(--font-weight-medium);
  padding: var(--space-2) 0;
  transition: color var(--duration-fast) var(--ease-out);
  
  &:hover, &:focus {
    color: var(--color-text-primary);
    text-decoration: none;
  }
  
  &.router-link-active {
    color: var(--color-primary-600);
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--color-primary-600);
      border-radius: var(--radius-full);
    }
  }
}

.nav-button {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
}

.controls {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  
  &:hover, &:focus {
    background: var(--color-neutral-100);
    color: var(--color-text-primary);
  }
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
}

.mobile-menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  
  @media (min-width: 768px) {
    display: none;
  }
  
  &:hover, &:focus {
    background: var(--color-neutral-100);
    color: var(--color-text-primary);
  }
  
  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
}

.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  transform: translateY(-100%);
  opacity: 0;
  visibility: hidden;
  transition: all var(--duration-normal) var(--ease-out);
  
  @media (min-width: 768px) {
    display: none;
  }
  
  &--open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
}

.mobile-nav-links {
  list-style: none;
  padding: var(--space-4);
}

.mobile-nav-link {
  display: block;
  padding: var(--space-4);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  border-radius: var(--radius-lg);
  transition: all var(--duration-fast) var(--ease-out);
  
  &:hover, &:focus {
    background: var(--color-neutral-100);
    color: var(--color-text-primary);
    text-decoration: none;
  }
  
  &.router-link-active {
    background: var(--color-primary-50);
    color: var(--color-primary-600);
  }
}

.mobile-nav-button {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
}
</style>