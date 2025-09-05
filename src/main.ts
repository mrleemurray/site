import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
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
const basePath = window.location.hostname === 'mrleemurray.github.io' ? '/site/' : '/'

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
app.mount('#app')