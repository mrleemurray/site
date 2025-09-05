import MarkdownIt from 'markdown-it'

// Create a basic markdown processor to test if the issue is with plugins
const basicMd = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
})

// Simple markdown processor without plugins to test
export function processBasicMarkdown(content: string): string {
  console.log('🔄 processBasicMarkdown called with:', { 
    contentLength: content.length,
    contentPreview: content.substring(0, 100)
  })
  
  if (!content || content.trim() === '') {
    console.warn('⚠️ Empty content passed to processBasicMarkdown')
    return ''
  }
  
  // Just basic markdown processing
  const result = basicMd.render(content)
  
  console.log('✅ Basic markdown processed:', {
    inputLength: content.length,
    resultLength: result.length,
    hasAnyHTML: result.includes('<'),
    resultPreview: result.substring(0, 200)
  })
  
  return result
}

// Manual callout processing to test if plugins are the issue
export function processMarkdownWithManualCallouts(content: string): string {
  console.log('🔄 processMarkdownWithManualCallouts called')
  
  // First process basic markdown
  let result = basicMd.render(content)
  
  // Then manually process callouts
  result = result.replace(
    /:::\s*(info|tip|warning|danger)\s*\n([\s\S]*?)\n:::/g,
    (match, type, content) => {
      return `<div class="callout callout-${type}">\n${content}\n</div>`
    }
  )
  
  // Process task lists manually
  result = result.replace(
    /<li>- \[ \] (.*?)<\/li>/g,
    '<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" disabled> $1</li>'
  )
  
  result = result.replace(
    /<li>- \[x\] (.*?)<\/li>/g,
    '<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" checked disabled> $1</li>'
  )
  
  console.log('✅ Manual callouts processed:', {
    hasCallouts: result.includes('callout-'),
    hasTaskLists: result.includes('task-list-item'),
    resultLength: result.length
  })
  
  return result
}