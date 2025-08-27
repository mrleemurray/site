# Portfolio Markdown System Guide

This guide explains how to use the markdown system with YAML frontmatter to add and manage projects in your Vue 3 portfolio website.

## 📁 Project Structure

```
public/
├── projects/
│   ├── vue-task-manager.md      # Example: Vue.js project with frontmatter
│   ├── ecommerce-api.md         # Example: API project with frontmatter
│   └── react-native-fitness.md  # Example: Mobile app project with frontmatter
src/
├── utils/
│   ├── projects.ts              # Utilities for loading and parsing projects
│   └── project-registry.ts      # Registry of available projects
├── views/
│   ├── Projects.vue             # Projects listing page
│   └── Project.vue              # Individual project detail page
```

## 🚀 Quick Start

### 1. Add a New Project

1. **Create a markdown file** in `public/projects/` (e.g., `my-awesome-project.md`)
2. **Add the project ID** to `src/utils/project-registry.ts`
3. **Write your project content** using YAML frontmatter and markdown

### 2. YAML Frontmatter Format

Every project markdown file must start with YAML frontmatter containing metadata:

```markdown
---
id: my-awesome-project
title: My Awesome Project
subtitle: A brief tagline that describes the project
description: Detailed description for project cards and SEO
category: web
tags: [Vue.js, TypeScript, SCSS, API]
image: /images/my-project.svg
featured: true
liveUrl: https://my-project.com
sourceUrl: https://github.com/username/my-project
completedAt: 2024-03-15
duration: 2 weeks
---

# My Awesome Project

Your markdown content starts here...
```

### 3. Frontmatter Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | Unique identifier (matches filename without .md) |
| `title` | string | ✅ | Project name |
| `subtitle` | string | ✅ | Short tagline |
| `description` | string | ✅ | Detailed description for cards |
| `category` | string | ✅ | Category: `web`, `mobile`, `api`, `tools` |
| `tags` | array | ⚪ | Technology tags: `[Vue.js, TypeScript]` |
| `image` | string | ⚪ | Project screenshot URL |
| `featured` | boolean | ⚪ | Show on homepage: `true` or `false` |
| `liveUrl` | string | ⚪ | Live demo URL |
| `sourceUrl` | string | ⚪ | Source code URL |
| `completedAt` | string | ⚪ | Completion date: `YYYY-MM-DD` |
| `duration` | string | ⚪ | Development time: `3 weeks` |

### 4. Register Your Project

Add the project ID to `src/utils/project-registry.ts`:

```typescript
export const PROJECT_REGISTRY = [
  'vue-task-manager',
  'ecommerce-api',
  'react-native-fitness',
  'my-awesome-project'  // Add your new project here
]
```

Use this template for your markdown files:

```markdown
# Project Title

Brief project description and what it accomplishes.

![Project Screenshot](/images/my-project.svg)

## Overview

Detailed description of the project, its purpose, and key accomplishments.

### Key Features

- **Feature 1**: Description of main feature
- **Feature 2**: Another important feature
- **Feature 3**: Additional functionality

## Technical Stack

\```json
{
  "frontend": {
    "framework": "Vue 3",
    "language": "TypeScript",
    "styling": "SCSS"
  },
  "backend": {
    "runtime": "Node.js",
    "database": "PostgreSQL"
  }
}
\```

## Implementation Details

### Architecture

Explain your project's architecture and design decisions.

### Code Examples

\```typescript
// Example code snippet
interface Project {
  id: string
  title: string
  description: string
}
\```

## Challenges & Solutions

Describe problems you encountered and how you solved them.

## Performance & Optimization

Detail any performance optimizations or best practices implemented.

## Testing

Explain your testing strategy and implementation.

## Deployment

Describe how the project is deployed and any CI/CD processes.

## Future Enhancements

- [ ] Feature to be added
- [ ] Another planned improvement

## Links

- **Live Demo**: [Project URL](https://...)
- **Source Code**: [GitHub URL](https://...)
- **Documentation**: [Docs URL](https://...)

---

*Brief footer note about the project.*
```

## ✨ Benefits of YAML Frontmatter

### **Single Source of Truth**
- All project data lives in the markdown file itself
- No need to maintain separate JSON configuration
- Metadata stays with content naturally

### **Developer Experience**
- Standard approach used by Jekyll, Hugo, Gatsby, etc.
- Easy to copy/move projects between systems
- Version control friendly (all changes in one file)

### **Flexibility**
- Add custom frontmatter fields as needed
- No schema restrictions
- Easy to extend with new metadata

### **Maintainability**
- Fewer files to manage
- Content and metadata can't get out of sync
- Simpler project structure

### Supported Elements

- **Headers**: `# ## ### ####` (auto-generates table of contents)
- **Emphasis**: `*italic*` `**bold**` `***bold-italic***`
- **Links**: `[text](url)` (auto-opens in new tab for external links)
- **Images**: `![alt](url)` (responsive with styling)
- **Code**: `` `inline` `` and ```` ```language ```` blocks
- **Lists**: Unordered (`-`) and ordered (`1.`)
- **Tables**: Standard markdown tables with styling
- **Blockquotes**: `> quoted text`

### Code Syntax Highlighting

Specify language for syntax highlighting:

```markdown
\```typescript
const example: string = "TypeScript code"
\```

\```bash
npm install
npm run build
\```

\```sql
SELECT * FROM users WHERE active = true;
\```
```

### Images and Media

- Use high-quality screenshots (recommended: 800x400px)
- Local images: `/images/my-project.svg` (recommended for portfolio projects)
- External URLs: `https://example.com/image.jpg`
- Images are automatically responsive and styled

## 🎨 Styling and Theming

The markdown content automatically inherits your portfolio's design system:

- **Colors**: Uses your custom color palette (night, bittersweet, hookers-green, etc.)
- **Typography**: Matches your defined font scales and weights
- **Spacing**: Uses consistent spacing tokens
- **Dark Mode**: Automatically adapts to theme switching
- **Responsive**: Mobile-first responsive design

## 🔧 Advanced Features

### Table of Contents

Headers (`# ## ###`) automatically generate a table of contents in the sidebar.

### Related Projects

Projects with similar categories or tags are automatically suggested.

### Search and Filtering

Projects are searchable by:
- Title
- Description
- Technology tags
- Category

### Performance

- **Caching**: Markdown content is cached after first load
- **Lazy Loading**: Images load as needed
- **Code Splitting**: Project content loads on-demand

## 📱 Responsive Design

Your projects automatically work on all devices:

- **Mobile**: Stacked layout, touch-friendly navigation
- **Tablet**: Optimized grid layout
- **Desktop**: Full sidebar with table of contents

## 🔍 SEO Optimization

Each project page includes:
- Semantic HTML structure
- Meta descriptions from project data
- Open Graph tags for social sharing
- Proper heading hierarchy

## 🛠️ Development Workflow

### Local Development

1. Add your markdown file to `public/projects/`
2. Update `projects.json` with metadata
3. Run `npm run dev`
4. Navigate to `/projects/your-project-id`

### Content Updates

- Markdown files are loaded dynamically
- No build step required for content updates
- Cache is automatically managed

### Adding Categories

Update the `categories` array in `projects.json`:

```json
{
  "categories": [
    { "id": "web", "name": "Web Development", "count": 1 },
    { "id": "mobile", "name": "Mobile Apps", "count": 1 },
    { "id": "ai", "name": "AI/ML", "count": 0 }
  ]
}
```

## 📊 Project Analytics

Track project engagement with the built-in utilities:

```typescript
import { ProjectUtils } from '@/utils/projects'

// Get project statistics
const stats = ProjectUtils.getProjectStats(projects)
// Returns: { totalProjects, featuredProjects, categories, technologies }
```

## 🚀 Best Practices

### Content Writing

1. **Start with a strong overview** - explain what the project does
2. **Include technical details** - architecture, challenges, solutions
3. **Add code examples** - show key implementation details
4. **Document lessons learned** - share insights and growth
5. **Keep it visual** - include screenshots, diagrams, code blocks

### Markdown Organization

1. **Use consistent heading levels** - for proper TOC generation
2. **Break up long sections** - improve readability
3. **Include code examples** - demonstrate technical skills
4. **Add external links** - to live demos and repositories

### Media Guidelines

1. **High-quality images** - clear, professional screenshots
2. **Consistent dimensions** - 800x400px for main images
3. **Descriptive alt text** - for accessibility
4. **Compressed files** - optimize for web performance

## 🎯 Example Projects

Three complete example projects are included:

1. **Vue Task Manager** (`vue-task-manager.md`)
   - Frontend application example
   - Vue 3, TypeScript, Pinia
   - Drag & drop, PWA features

2. **E-commerce API** (`ecommerce-api.md`)
   - Backend API example
   - Node.js, Express, PostgreSQL
   - Authentication, payments, testing

3. **React Native Fitness App** (`react-native-fitness.md`)
   - Mobile application example
   - React Native, Expo, Firebase
   - Health integration, offline support

## 🔧 Customization

### Extending the Markdown Parser

The basic parser in `src/utils/projects.ts` can be enhanced:

```typescript
// Add custom markdown extensions
static parseMarkdownToHTML(markdown: string): string {
  return markdown
    // Your custom parsing rules
    .replace(/::note\[(.*?)\]/gim, '<div class="note">$1</div>')
    // ... existing parsing
}
```

### Custom Styling

Add project-specific styles in `src/views/Project.vue`:

```scss
.markdown-content {
  // Custom styles for markdown elements
  .note {
    background: var(--color-primary-50);
    padding: var(--space-4);
    border-radius: var(--radius-md);
  }
}
```

## 🤝 Contributing

1. Follow the established content structure
2. Use consistent markdown formatting
3. Test on multiple screen sizes
4. Optimize images for web
5. Update projects.json metadata

---

**Ready to showcase your projects?** Start by copying one of the example markdown files and customizing it with your own project details!