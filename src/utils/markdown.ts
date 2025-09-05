import MarkdownIt from 'markdown-it'
import Prism from 'prismjs'

// Import markdown-it plugins
import markdownItAnchor from 'markdown-it-anchor'
import markdownItToc from 'markdown-it-toc-done-right'
import markdownItFootnote from 'markdown-it-footnote'
import markdownItContainer from 'markdown-it-container'
// import * as markdownItEmoji from 'markdown-it-emoji'
import markdownItTaskLists from 'markdown-it-task-lists'
import markdownItMark from 'markdown-it-mark'
import markdownItIns from 'markdown-it-ins'
import markdownItAbbr from 'markdown-it-abbr'

// Import Prism languages you want to support
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-yaml'

// Configure markdown-it
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
})

// Add plugins
md.use(markdownItAnchor, {
  permalink: markdownItAnchor.permalink.headerLink()
})
md.use(markdownItToc, {
  includeLevel: [1, 2, 3, 4],
  containerClass: 'table-of-contents',
  listType: 'ul'
})
md.use(markdownItFootnote)
// md.use(markdownItEmoji) // Skip emoji for now due to type issues
md.use(markdownItTaskLists, { enabled: true })
md.use(markdownItMark) // ==highlighted text==
md.use(markdownItIns) // ++inserted text++
md.use(markdownItAbbr) // Abbreviations

// Custom containers for callouts
md.use(markdownItContainer, 'info', {
  render: (tokens: any[], idx: number) => {
    if (tokens[idx].nesting === 1) {
      return '<div class="callout callout-info">\n'
    } else {
      return '</div>\n'
    }
  }
})
md.use(markdownItContainer, 'warning', {
  render: (tokens: any[], idx: number) => {
    if (tokens[idx].nesting === 1) {
      return '<div class="callout callout-warning">\n'
    } else {
      return '</div>\n'
    }
  }
})
md.use(markdownItContainer, 'tip', {
  render: (tokens: any[], idx: number) => {
    if (tokens[idx].nesting === 1) {
      return '<div class="callout callout-tip">\n'
    } else {
      return '</div>\n'
    }
  }
})
md.use(markdownItContainer, 'danger', {
  render: (tokens: any[], idx: number) => {
    if (tokens[idx].nesting === 1) {
      return '<div class="callout callout-danger">\n'
    } else {
      return '</div>\n'
    }
  }
})

// Custom renderer for code blocks with syntax highlighting
md.renderer.rules.fence = (tokens, idx) => {
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
const defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, _env, renderer) {
  return renderer.renderToken(tokens, idx, options)
}

md.renderer.rules.link_open = function (tokens, idx, options, _env, renderer) {
  const token = tokens[idx]
  const href = token.attrGet('href')
  
  if (href && (href.startsWith('http') || href.startsWith('//'))) {
    token.attrSet('target', '_blank')
    token.attrSet('rel', 'noopener noreferrer')
  }
  
  return defaultRender(tokens, idx, options, _env, renderer)
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
    (_match, hashes, title) => {
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