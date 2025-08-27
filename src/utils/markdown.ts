import MarkdownIt from 'markdown-it'
import Prism from 'prismjs'

// Import Prism languages you want to support
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-markdown'

// Configure markdown-it
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
})

// Custom renderer for code blocks with syntax highlighting
md.renderer.rules.fence = (tokens, idx, options, env, renderer) => {
  const token = tokens[idx]
  const info = token.info ? token.info.trim() : ''
  const langName = info.split(/\s+/g)[0]
  
  let highlighted: string
  
  if (langName && Prism.languages[langName]) {
    try {
      highlighted = Prism.highlight(token.content, Prism.languages[langName], langName)
    } catch (error) {
      highlighted = md.utils.escapeHtml(token.content)
    }
  } else {
    highlighted = md.utils.escapeHtml(token.content)
  }
  
  const langClass = langName ? ` language-${langName}` : ''
  
  return `<pre><code class="hljs${langClass}">${highlighted}</code></pre>`
}

// Add target="_blank" and rel="noopener noreferrer" to external links
const defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, renderer) {
  return renderer.renderToken(tokens, idx, options)
}

md.renderer.rules.link_open = function (tokens, idx, options, env, renderer) {
  const token = tokens[idx]
  const href = token.attrGet('href')
  
  if (href && (href.startsWith('http') || href.startsWith('//'))) {
    token.attrSet('target', '_blank')
    token.attrSet('rel', 'noopener noreferrer')
  }
  
  return defaultRender(tokens, idx, options, env, renderer)
}

// Table of Contents generator
export function generateTOC(markdownContent: string): Array<{ title: string; anchor: string; level: number }> {
  const tokens = md.parse(markdownContent, {})
  const toc: Array<{ title: string; anchor: string; level: number }> = []
  
  tokens.forEach(token => {
    if (token.type === 'heading_open') {
      const level = parseInt(token.tag.slice(1))
      const titleToken = tokens[tokens.indexOf(token) + 1]
      
      if (titleToken && titleToken.type === 'inline') {
        const title = titleToken.content
        const anchor = title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim()
        
        toc.push({ title, anchor, level })
      }
    }
  })
  
  return toc
}

// Process markdown content and add anchors to headings
export function processMarkdown(content: string): { html: string; toc: Array<{ title: string; anchor: string; level: number }> } {
  const toc = generateTOC(content)
  
  // Add IDs to headings for anchor linking
  const processedContent = content.replace(
    /^(#{1,6})\s+(.+)$/gm,
    (match, hashes, title) => {
      const anchor = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()
      
      return `${hashes} ${title} {#${anchor}}`
    }
  )
  
  const html = md.render(processedContent)
  
  return { html, toc }
}

// Render simple markdown to HTML
export function renderMarkdown(content: string): string {
  return md.render(content)
}

// Extract excerpt from markdown
export function extractExcerpt(content: string, maxLength: number = 160): string {
  // Remove markdown syntax and get plain text
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // Remove headings
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim()
  
  if (plainText.length <= maxLength) {
    return plainText
  }
  
  return plainText.slice(0, maxLength).replace(/\s+\w*$/, '') + '...'
}

export default md