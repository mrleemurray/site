<template>
  <div class="project-detail">
    <div class="container">
      <!-- Back Navigation -->
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <router-link to="/projects" class="back-link">
          ← Back to Projects
        </router-link>
      </nav>

      <!-- Project Header -->
      <header class="project-header">
        <h1 class="project-title">{{ projectTitle }}</h1>
        <p class="project-subtitle">{{ projectSubtitle }}</p>
        
        <div class="project-meta">
          <div class="project-links">
            <a href="#" class="project-link" target="_blank" rel="noopener noreferrer">
              View Live Site
            </a>
            <a href="#" class="project-link" target="_blank" rel="noopener noreferrer">
              View Source
            </a>
          </div>
          
          <div class="project-tags">
            <span class="tag">Vue.js</span>
            <span class="tag">TypeScript</span>
            <span class="tag">SCSS</span>
          </div>
        </div>
      </header>

      <!-- Project Image -->
      <div class="project-image">
        <div class="image-placeholder">
          Project Screenshot
        </div>
      </div>

      <!-- Project Content -->
      <div class="project-content">
        <div class="content-main">
          <!-- This is where markdown content will be rendered -->
          <section class="project-section">
            <h2>Overview</h2>
            <p>
              This is placeholder content. Replace this with your actual project description 
              written in markdown. The markdown parser will convert it to HTML automatically.
            </p>
          </section>

          <section class="project-section">
            <h2>Features</h2>
            <ul>
              <li>Feature 1 description</li>
              <li>Feature 2 description</li>
              <li>Feature 3 description</li>
            </ul>
          </section>

          <section class="project-section">
            <h2>Technical Details</h2>
            <p>
              Describe the technical implementation, challenges overcome, 
              and lessons learned during development.
            </p>
          </section>

          <section class="project-section">
            <h2>Code Example</h2>
            <pre><code class="language-javascript">
// Example code snippet
function example() {
  console.log('This is where code examples go');
}
            </code></pre>
          </section>
        </div>

        <!-- Table of Contents -->
        <aside class="content-sidebar">
          <nav class="toc" aria-label="Table of contents">
            <h3>Table of Contents</h3>
            <ul>
              <li><a href="#overview">Overview</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#technical-details">Technical Details</a></li>
              <li><a href="#code-example">Code Example</a></li>
            </ul>
          </nav>
        </aside>
      </div>

      <!-- Related Projects -->
      <section class="related-projects">
        <h2>Related Projects</h2>
        <div class="related-grid grid grid-responsive">
          <article class="related-card">
            <h3>
              <router-link to="/projects/related-1">
                Related Project 1
              </router-link>
            </h3>
            <p>Brief description of related project.</p>
          </article>
          
          <article class="related-card">
            <h3>
              <router-link to="/projects/related-2">
                Related Project 2
              </router-link>
            </h3>
            <p>Brief description of related project.</p>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  slug: string
}

const props = defineProps<Props>()

// Placeholder data - replace with actual project loading logic
const projectTitle = computed(() => `Project: ${props.slug}`)
const projectSubtitle = computed(() => 'A sample project description')

// This is where you would load actual project content based on the slug
// and render markdown content using your markdown parser
</script>

<style lang="scss" scoped>
.project-detail {
  padding: var(--space-8) 0 var(--space-16);
}

.breadcrumb {
  margin-bottom: var(--space-8);
}

.back-link {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  
  &:hover, &:focus {
    color: var(--color-primary-600);
  }
}

.project-header {
  text-align: center;
  margin-bottom: var(--space-12);
}

.project-title {
  margin-bottom: var(--space-4);
}

.project-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-8);
}

.project-meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  align-items: center;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: center;
  }
}

.project-links {
  display: flex;
  gap: var(--space-4);
}

.project-link {
  padding: var(--space-3) var(--space-6);
  background: var(--color-primary-600);
  color: white;
  text-decoration: none;
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-medium);
  transition: background var(--duration-fast) var(--ease-out);
  
  &:hover, &:focus {
    background: var(--color-primary-700);
    color: white;
    text-decoration: none;
  }
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  justify-content: center;
}

.tag {
  display: inline-block;
  padding: var(--space-2) var(--space-4);
  background: var(--color-primary-50);
  color: var(--color-primary-700);
  font-size: var(--font-size-sm);
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-medium);
}

.project-image {
  margin-bottom: var(--space-12);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.image-placeholder {
  aspect-ratio: 16 / 9;
  background: var(--color-neutral-100);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  font-size: var(--font-size-lg);
}

.project-content {
  display: grid;
  gap: var(--space-12);
  margin-bottom: var(--space-16);
  
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 300px;
    gap: var(--space-16);
  }
}

.content-main {
  min-width: 0; // Prevent grid overflow
}

.project-section {
  margin-bottom: var(--space-12);
  
  h2 {
    margin-bottom: var(--space-6);
    color: var(--color-text-primary);
    border-bottom: 2px solid var(--color-border);
    padding-bottom: var(--space-4);
  }
  
  p {
    line-height: var(--line-height-relaxed);
    margin-bottom: var(--space-4);
  }
  
  ul {
    margin-left: var(--space-6);
    
    li {
      margin-bottom: var(--space-2);
      color: var(--color-text-secondary);
    }
  }
  
  pre {
    background: var(--color-neutral-100);
    padding: var(--space-6);
    border-radius: var(--radius-lg);
    overflow-x: auto;
    
    code {
      font-family: var(--font-family-mono);
      font-size: var(--font-size-sm);
    }
  }
}

.content-sidebar {
  @media (max-width: 1023px) {
    order: -1;
  }
}

.toc {
  position: sticky;
  top: var(--space-24);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  
  h3 {
    margin-bottom: var(--space-4);
    font-size: var(--font-size-lg);
    color: var(--color-text-primary);
  }
  
  ul {
    list-style: none;
    
    li {
      margin-bottom: var(--space-2);
      
      a {
        color: var(--color-text-secondary);
        text-decoration: none;
        font-size: var(--font-size-sm);
        
        &:hover, &:focus {
          color: var(--color-primary-600);
        }
      }
    }
  }
}

.related-projects {
  h2 {
    text-align: center;
    margin-bottom: var(--space-8);
  }
}

.related-grid {
  max-width: 800px;
  margin: 0 auto;
}

.related-card {
  padding: var(--space-6);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  
  h3 {
    margin-bottom: var(--space-3);
    
    a {
      color: var(--color-text-primary);
      text-decoration: none;
      
      &:hover, &:focus {
        color: var(--color-primary-600);
      }
    }
  }
  
  p {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
  }
}
</style>