// Types for project data
export interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  category: string
  tags: string[]
  image: string
  featured: boolean
  liveUrl: string
  sourceUrl: string
  liveUrlLabel: string
  sourceUrlLabel: string
  completedAt: string
  duration: string
}

export interface ProjectCategory {
  id: string
  name: string
  count: number
}

export interface ProjectsData {
  projects: Project[]
  categories: ProjectCategory[]
}

export interface ParsedMarkdown {
  frontmatter: Project
  content: string
}

// YAML frontmatter parsing utility
export class FrontmatterParser {
  static parseYAML(yamlString: string): Record<string, any> {
    const lines = yamlString.split('\n')
    const result: Record<string, any> = {}

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue

      const colonIndex = trimmed.indexOf(':')
      if (colonIndex === -1) continue

      const key = trimmed.substring(0, colonIndex).trim()
      let rawValue = trimmed.substring(colonIndex + 1).trim()

      // Handle different value types
      let parsedValue: any
      if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
        // Array value
        parsedValue = rawValue.slice(1, -1)
          .split(',')
          .map(item => item.trim().replace(/^["']|["']$/g, ''))
      } else if (rawValue === 'true' || rawValue === 'false') {
        // Boolean value
        parsedValue = rawValue === 'true'
      } else if (!isNaN(Number(rawValue)) && rawValue !== '') {
        // Number value
        parsedValue = Number(rawValue)
      } else {
        // String value - remove quotes if present
        parsedValue = rawValue.replace(/^["']|["']$/g, '')
      }

      result[key] = parsedValue
    }

    return result
  }

  static parseMarkdownWithFrontmatter(markdown: string): ParsedMarkdown {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
    const match = markdown.match(frontmatterRegex)

    if (!match) {
      throw new Error('No frontmatter found in markdown file')
    }

    const [, yamlString, content] = match
    const frontmatter = this.parseYAML(yamlString) as Project

    // Validate required fields
    const requiredFields = ['id', 'title', 'subtitle', 'description', 'category']
    for (const field of requiredFields) {
      if (!frontmatter[field as keyof Project]) {
        throw new Error(`Missing required frontmatter field: ${field}`)
      }
    }

    // Set defaults for optional fields
    frontmatter.tags = frontmatter.tags || []
    frontmatter.image = frontmatter.image || ''
    frontmatter.featured = frontmatter.featured || false
    frontmatter.liveUrl = frontmatter.liveUrl || ''
    frontmatter.sourceUrl = frontmatter.sourceUrl || ''
    frontmatter.liveUrlLabel = frontmatter.liveUrlLabel || 'Live Demo'
    frontmatter.sourceUrlLabel = frontmatter.sourceUrlLabel || 'Source Code'
    frontmatter.completedAt = frontmatter.completedAt || ''
    frontmatter.duration = frontmatter.duration || ''

    return { frontmatter, content }
  }
}

// Markdown parsing utility
export class MarkdownLoader {
  private static cache = new Map<string, ParsedMarkdown>()
  private static projectsCache: ProjectsData | null = null

  static async loadProjectContent(projectId: string): Promise<ParsedMarkdown> {
    const markdownPath = `/projects/${projectId}.md`
    
    // Check cache first
    if (this.cache.has(markdownPath)) {
      return this.cache.get(markdownPath)!
    }

    try {
      const response = await fetch(markdownPath)
      if (!response.ok) {
        throw new Error(`Failed to load markdown: ${response.statusText}`)
      }
      
      const rawMarkdown = await response.text()
      const parsed = FrontmatterParser.parseMarkdownWithFrontmatter(rawMarkdown)
      
      // Cache the parsed content
      this.cache.set(markdownPath, parsed)
      
      return parsed
    } catch (error) {
      console.error('Error loading markdown:', error)
      throw new Error(`Failed to load project: ${projectId}`)
    }
  }

  static async loadProjectsData(): Promise<ProjectsData> {
    // Return cached data if available
    if (this.projectsCache) {
      return this.projectsCache
    }

    try {
      // Import the project registry
      const { PROJECT_REGISTRY } = await import('./project-registry')

      const projects: Project[] = []
      const categories: Map<string, number> = new Map()

      // Load each project's frontmatter
      for (const projectId of PROJECT_REGISTRY) {
        try {
          const parsed = await this.loadProjectContent(projectId)
          projects.push(parsed.frontmatter)
          
          // Count categories
          const category = parsed.frontmatter.category
          categories.set(category, (categories.get(category) || 0) + 1)
        } catch (error) {
          console.warn(`Failed to load project ${projectId}:`, error)
        }
      }

      // Convert categories map to array
      const categoryData: ProjectCategory[] = [
        { id: 'web', name: 'Web Development', count: categories.get('web') || 0 },
        { id: 'mobile', name: 'Mobile', count: categories.get('mobile') || 0 },
        { id: 'api', name: 'APIs', count: categories.get('api') || 0 },
        { id: 'tools', name: 'Tools', count: categories.get('tools') || 0 }
      ]

      const result: ProjectsData = {
        projects,
        categories: categoryData
      }

      // Cache the result
      this.projectsCache = result
      
      return result
    } catch (error) {
      console.error('Error loading projects data:', error)
      return {
        projects: [],
        categories: []
      }
    }
  }

  static parseMarkdownToHTML(markdown: string): string {
    // Helper function to generate ID from text
    const generateId = (text: string): string => {
      return text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    }

    // Basic markdown parsing - in a real app, use a library like markdown-it
    const result = markdown
      // Headers with IDs
      .replace(/^### (.*$)/gim, (_, text) => `<h3 id="${generateId(text)}">${text}</h3>`)
      .replace(/^## (.*$)/gim, (_, text) => `<h2 id="${generateId(text)}">${text}</h2>`)
      .replace(/^# (.*$)/gim, (_, text) => `<h1 id="${generateId(text)}">${text}</h1>`)
      
      // Bold and italic
      .replace(/\*\*\*(.*)\*\*\*/gim, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      
      // Images - handle both absolute and relative paths (MUST come before links!)
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, (_, alt, src) => {
        // If the path starts with /, it's absolute from public folder
        // If it doesn't start with http/https or /, make it relative to public
        const imageSrc = src.startsWith('/') ? src : 
                        src.startsWith('http') ? src : 
                        `/${src}`
        return `<img alt="${alt}" src="${imageSrc}" />`
      })
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // Code blocks
      .replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre><code class="language-$1">$2</code></pre>')
      .replace(/`([^`]+)`/gim, '<code>$1</code>')
      
      // Lists
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gis, '<ul>$1</ul>')
      
      // Paragraphs
      .replace(/\n\n/gim, '</p><p>')
      .replace(/^(.*)$/gim, '<p>$1</p>')
      
      // Clean up
      .replace(/<p><\/p>/gim, '')
      .replace(/<p>(<h[1-6]>.*<\/h[1-6]>)<\/p>/gim, '$1')
      .replace(/<p>(<pre>.*<\/pre>)<\/p>/gims, '$1')
      .replace(/<p>(<ul>.*<\/ul>)<\/p>/gims, '$1')
    
    return result
  }

  static extractTableOfContents(markdown: string): Array<{ id: string; text: string; level: number }> {
    const headings: Array<{ id: string; text: string; level: number }> = []
    const headerRegex = /^(#{1,6})\s+(.*)$/gm
    let match

    while ((match = headerRegex.exec(markdown)) !== null) {
      const level = match[1].length
      const text = match[2].trim()
      const id = text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      headings.push({ id, text, level })
    }

    return headings
  }

  static clearCache(): void {
    this.cache.clear()
  }
}

// Project utility functions
export class ProjectUtils {
  static getProjectById(projects: Project[], id: string): Project | undefined {
    return projects.find(project => project.id === id)
  }

  static getProjectsByCategory(projects: Project[], category: string): Project[] {
    if (!category) return projects
    return projects.filter(project => project.category === category)
  }

  static getFeaturedProjects(projects: Project[]): Project[] {
    return projects.filter(project => project.featured)
  }

  static searchProjects(projects: Project[], query: string): Project[] {
    if (!query) return projects
    
    const lowercaseQuery = query.toLowerCase()
    return projects.filter(project => 
      project.title.toLowerCase().includes(lowercaseQuery) ||
      project.description.toLowerCase().includes(lowercaseQuery) ||
      project.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  }

  static sortProjects(projects: Project[], sortBy: 'date' | 'title' | 'category' = 'date'): Project[] {
    return [...projects].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'category':
          return a.category.localeCompare(b.category)
        case 'date':
        default:
          return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      }
    })
  }

  static getProjectStats(projects: Project[]) {
    const totalProjects = projects.length
    const featuredProjects = projects.filter(p => p.featured).length
    const categories = [...new Set(projects.map(p => p.category))].length
    const technologies = [...new Set(projects.flatMap(p => p.tags))].length

    return {
      totalProjects,
      featuredProjects,
      categories,
      technologies
    }
  }
}

// Error handling
export class ProjectError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'ProjectError'
  }
}

// Loading states
export interface LoadingState {
  isLoading: boolean
  error: string | null
  data: any | null
}

export const createLoadingState = (): LoadingState => ({
  isLoading: false,
  error: null,
  data: null
})