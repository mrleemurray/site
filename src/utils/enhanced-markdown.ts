import MarkdownIt from 'markdown-it'
import Prism from 'prismjs'

// Import Prism languages
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

// Import markdown-it plugins
import markdownItAnchor from 'markdown-it-anchor'
import markdownItToc from 'markdown-it-toc-done-right'
import markdownItFootnote from 'markdown-it-footnote'
import markdownItContainer from 'markdown-it-container'
import markdownItTaskLists from 'markdown-it-task-lists'
import markdownItMark from 'markdown-it-mark'
import markdownItIns from 'markdown-it-ins'
import markdownItAbbr from 'markdown-it-abbr'

// Create a fresh markdown instance
const createMarkdownProcessor = () => {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true
  })

  // Add all plugins
  md.use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.headerLink()
  })
  
  md.use(markdownItToc, {
    includeLevel: [1, 2, 3, 4],
    containerClass: 'table-of-contents',
    listType: 'ul'
  })
  
  md.use(markdownItFootnote)
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
  
  md.use(markdownItContainer, 'tip', {
    render: (tokens: any[], idx: number) => {
      if (tokens[idx].nesting === 1) {
        return '<div class="callout callout-tip">\n'
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
        console.warn('Prism highlighting failed:', error)
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

  return md
}

// Create a single instance
const markdownProcessor = createMarkdownProcessor()

// Enhanced markdown processor with image path processing
export function processEnhancedMarkdown(content: string, basePath = ''): string {
  console.log('🔄 processEnhancedMarkdown called with:', { 
    contentLength: content.length,
    basePath,
    hasCallouts: content.includes(':::'),
    hasTaskLists: content.includes('- [ ]') || content.includes('- [x]'),
    hasCodeBlocks: content.includes('```'),
    contentPreview: content.substring(0, 100)
  })
  
  if (!content || content.trim() === '') {
    console.warn('⚠️ Empty content passed to processEnhancedMarkdown')
    return ''
  }
  
  // Process image paths if basePath is provided
  let processedContent = content
  if (basePath) {
    processedContent = content.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/gim, 
      (_, alt, src) => {
        const imageSrc = src.startsWith('/') ? `${basePath}${src}` : 
                        src.startsWith('http') ? src : 
                        `${basePath}/${src}`
        return `![${alt}](${imageSrc})`
      }
    )
  }
  
  console.log('🔧 About to render with markdown processor...')
  
  // Render with enhanced processor
  const result = markdownProcessor.render(processedContent)
  
  console.log('✅ Enhanced markdown processed:', {
    inputLength: processedContent.length,
    resultLength: result.length,
    hasCalloutDivs: result.includes('callout-'),
    hasTaskListItems: result.includes('task-list-item'),
    hasHighlightedCode: result.includes('class="hljs'),
    hasAnyHTML: result.includes('<'),
    resultPreview: result.substring(0, 200)
  })
  
  if (!result || result.trim() === '') {
    console.error('❌ Markdown processor returned empty result!')
  }
  
  return result
}

// Table of contents extraction
export function extractTOC(content: string): Array<{ id: string; text: string; level: number }> {
  const tokens = markdownProcessor.parse(content, {})
  const toc: Array<{ id: string; text: string; level: number }> = []
  
  tokens.forEach(token => {
    if (token.type === 'heading_open') {
      const level = parseInt(token.tag.slice(1))
      const titleToken = tokens[tokens.indexOf(token) + 1]
      
      if (titleToken && titleToken.type === 'inline') {
        const title = titleToken.content
        const id = title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim()
        
        toc.push({ id, text: title, level })
      }
    }
  })
  
  return toc
}