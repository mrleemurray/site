---
id: portfolio-website
title: Portfolio Website
subtitle: Modern Vue 3 portfolio with markdown CMS
description: A responsive portfolio website built with Vue 3, TypeScript, and a custom markdown-based content management system featuring YAML frontmatter and beautiful design.
category: web
tags: [Vue.js, TypeScript, Vite, SCSS, Markdown, CMS]
image: https://via.placeholder.com/800x400/638475/fff8f0?text=Portfolio+Website
featured: true
liveUrl: https://your-portfolio.com
sourceUrl: https://github.com/username/portfolio
completedAt: 2024-08-27
duration: 1 week
---

# Portfolio Website

A modern, responsive portfolio website built with Vue 3 and TypeScript, featuring a custom markdown-based content management system.

![Portfolio Website](https://via.placeholder.com/800x400/638475/fff8f0?text=Portfolio+Website)

## Overview

This portfolio website demonstrates modern web development practices with Vue 3, TypeScript, and a custom-built content management system using markdown files with YAML frontmatter. The site features a beautiful custom design system, full accessibility support, and responsive design.

### Key Features

- **YAML Frontmatter CMS**: Manage projects using markdown files with frontmatter
- **Responsive Design**: Mobile-first approach with perfect tablet and desktop layouts
- **Custom Theme System**: Beautiful color palette with light/dark mode support
- **Accessibility First**: WCAG compliant with screen reader support
- **Performance Optimized**: Fast loading with code splitting and caching
- **SEO Ready**: Semantic HTML and meta tags for search optimization

## Technical Implementation

### Frontend Architecture

```typescript
// Vue 3 Composition API with TypeScript
export default defineComponent({
  setup() {
    const projects = ref<Project[]>([])
    const isLoading = ref(false)
    
    const loadProjects = async () => {
      const data = await MarkdownLoader.loadProjectsData()
      projects.value = data.projects
    }
    
    return { projects, loadProjects }
  }
})
```

### YAML Frontmatter Parser

```typescript
export class FrontmatterParser {
  static parseMarkdownWithFrontmatter(markdown: string): ParsedMarkdown {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
    const match = markdown.match(frontmatterRegex)
    
    if (!match) {
      throw new Error('No frontmatter found in markdown file')
    }
    
    const [, yamlString, content] = match
    const frontmatter = this.parseYAML(yamlString) as Project
    
    return { frontmatter, content }
  }
}
```

### Design System

Custom CSS design tokens with semantic color system:

```scss
:root {
  // Custom Color Palette
  --color-night: #11140c;
  --color-bittersweet: #fe5f55;
  --color-hookers-green: #638475;
  --color-floral-white: #fff8f0;
  --color-cornsilk: #f6f1d1;
  
  // Semantic Colors
  --color-background: var(--color-floral-white);
  --color-text-primary: var(--color-night);
  --color-primary-600: var(--color-bittersweet);
}

[data-theme="dark"] {
  --color-background: var(--color-night);
  --color-text-primary: var(--color-cornsilk);
}
```

## Content Management System

### Project Structure

```
public/projects/
├── project-name.md          # Markdown file with frontmatter
├── another-project.md       # Each project is a single file
└── third-project.md         # Self-contained with metadata

src/utils/
├── projects.ts              # Markdown parsing utilities
└── project-registry.ts      # Simple project registry
```

### Adding New Projects

1. **Create markdown file** with YAML frontmatter:

```markdown
---
id: my-new-project
title: My New Project
subtitle: Short description
description: Longer description for project cards
category: web
tags: [Vue.js, TypeScript]
featured: true
liveUrl: https://example.com
sourceUrl: https://github.com/user/repo
completedAt: 2024-08-27
duration: 2 weeks
---

# My New Project

Project content in markdown...
```

2. **Register the project** in `project-registry.ts`:

```typescript
export const PROJECT_REGISTRY = [
  'existing-project',
  'my-new-project'  // Add here
]
```

## Performance Features

### Caching Strategy

```typescript
export class MarkdownLoader {
  private static cache = new Map<string, ParsedMarkdown>()
  private static projectsCache: ProjectsData | null = null
  
  static async loadProjectContent(projectId: string): Promise<ParsedMarkdown> {
    // Check cache first
    if (this.cache.has(markdownPath)) {
      return this.cache.get(markdownPath)!
    }
    
    // Load and cache
    const parsed = FrontmatterParser.parseMarkdownWithFrontmatter(rawMarkdown)
    this.cache.set(markdownPath, parsed)
    
    return parsed
  }
}
```

### Lazy Loading

- **Dynamic imports** for project registry
- **Image lazy loading** with `loading="lazy"`
- **Route-based code splitting** for better performance

## Accessibility Features

### Semantic HTML

```html
<main>
  <header>
    <h1>Page Title</h1>
    <nav aria-label="Breadcrumb">
      <a href="/projects">← Back to Projects</a>
    </nav>
  </header>
  
  <article>
    <section class="project-content">
      <!-- Markdown content -->
    </section>
    
    <aside aria-label="Table of contents">
      <!-- Auto-generated TOC -->
    </aside>
  </article>
</main>
```

### Focus Management

```typescript
// Modal focus trap
const trapFocus = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeModal()
    return
  }
  
  if (event.key === 'Tab') {
    // Handle tab navigation within modal
  }
}
```

## SEO Optimization

### Meta Tags

Each project page includes:
- Dynamic page titles
- Meta descriptions from frontmatter
- Open Graph tags for social sharing
- Structured data markup

### URL Structure

Clean, semantic URLs:
- `/projects` - Projects listing
- `/projects/project-name` - Individual project
- Proper breadcrumb navigation

## Responsive Design

### Mobile-First CSS

```scss
.project-content {
  display: grid;
  gap: var(--space-12);
  
  // Mobile: stacked layout
  grid-template-columns: 1fr;
  
  // Desktop: sidebar layout
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 300px;
    gap: var(--space-16);
  }
}
```

### Adaptive Navigation

- **Mobile**: Hamburger menu with modal
- **Tablet**: Horizontal navigation
- **Desktop**: Full navigation with theme controls

## Development Workflow

### Local Development

```bash
# Start development server
npm run dev

# Add new project
touch public/projects/new-project.md
# Edit src/utils/project-registry.ts
# Write frontmatter and content
```

### Deployment

The site is optimized for static hosting:
- All projects loaded at build time
- No server-side rendering required
- CDN-friendly asset optimization

## Future Enhancements

- [ ] Automated project registry generation
- [ ] Image optimization pipeline
- [ ] Full-text search across projects
- [ ] Project tagging system improvements
- [ ] Analytics integration
- [ ] Comment system for projects

## Links

- **Live Portfolio**: [https://your-portfolio.com](https://your-portfolio.com)
- **Source Code**: [https://github.com/username/portfolio](https://github.com/username/portfolio)
- **Design System**: [View style guide](https://your-portfolio.com/styleguide)

---

*This portfolio demonstrates modern Vue.js development with a focus on performance, accessibility, and maintainable content management.*