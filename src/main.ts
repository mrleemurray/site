import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import VueLazyload from 'vue3-lazyload'
import App from './App.vue'
import './styles/global.scss'

// Route definitions
const routes = [
  {
    path: '/',
    name: 'Projects',
    component: () => import('./views/Projects.vue')
  },
  {
    path: '/projects/:slug',
    name: 'Project',
    component: () => import('./views/Project.vue'),
    props: true
  }
]

// Determine base path for GitHub Pages vs local development
const basePath = '/'

const router = createRouter({
  history: createWebHistory(basePath),
  routes,
  scrollBehavior(to: any, _from: any, savedPosition: any) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      return { top: 0 }
    }
  }
})

const app = createApp(App)
app.use(router)

// Configure vue3-lazyload for image optimization
app.use(VueLazyload, {
  loading: `${basePath}images/loading-placeholder.svg`,
  error: `${basePath}images/error-placeholder.svg`,
  observerOptions: {
    rootMargin: '50px', // Start loading 50px before image enters viewport
    threshold: 0.1
  },
  lifecycle: {
    loading: (el: any) => {
      el.classList.add('lazy-loading')
    },
    error: (el: any) => {
      el.classList.add('lazy-error')
    },
    loaded: (el: any) => {
      el.classList.remove('lazy-loading')
      el.classList.add('lazy-loaded')
    }
  }
})
app.mount('#app')