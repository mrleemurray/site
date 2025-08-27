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
  markdownFile: string
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

// Markdown parsing utility
export class MarkdownLoader {
  private static cache = new Map<string, string>()

  static async loadProjectContent(markdownFile: string): Promise<string> {
    // Check cache first
    if (this.cache.has(markdownFile)) {
      return this.cache.get(markdownFile)!
    }

    try {
      const response = await fetch(markdownFile)
      if (!response.ok) {
        throw new Error(`Failed to load markdown: ${response.statusText}`)
      }
      
      const content = await response.text()
      
      // Cache the content
      this.cache.set(markdownFile, content)
      
      return content
    } catch (error) {
      console.error('Error loading markdown:', error)
      return `# Error Loading Project\n\nSorry, there was an error loading the project content. Please try again later.`
    }
  }

  static async loadProjectsData(): Promise<ProjectsData> {
    try {
      const response = await fetch('/projects/projects.json')
      if (!response.ok) {
        throw new Error(`Failed to load projects data: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error loading projects data:', error)
      return {
        projects: [],
        categories: []
      }
    }
  }

  static parseMarkdownToHTML(markdown: string): string {
    // Basic markdown parsing - in a real app, use a library like markdown-it
    return markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      
      // Bold and italic
      .replace(/\*\*\*(.*)\*\*\*/gim, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img alt="$1" src="$2" />')
      
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