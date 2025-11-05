---
id: markdown-features-demo
title: Enhanced Markdown Features Demo
subtitle: Showcase of all available markdown capabilities
description: A comprehensive demonstration of the enhanced markdown features including callouts, task lists, footnotes, and more
category: experiment
tags: [Markdown, Documentation, Demo]
image: /images/markdown-demo.svg
featured: false
sourceUrl: https://github.com/mrleemurray/site
completedAt: 2024-03-15
duration: 1 day
---

# Enhanced Markdown Features Demo

This document demonstrates all the enhanced markdown features available in your portfolio site.

## Table of Contents

[[toc]]

## Basic Formatting

You can use **bold text**, *italic text*, and ***bold italic text***. You can also ==highlight text== and ++insert new text++.

Here's some `inline code` and regular text with an abbreviation: HTML

*[HTML]: HyperText Markup Language

## Callout Boxes

::: info
This is an info callout box. Use it for general information or tips.
:::

::: tip
This is a tip callout. Perfect for helpful hints and best practices.
:::

::: warning
This is a warning callout. Use it for important warnings or caveats.
:::

::: danger
This is a danger callout. Use it for critical warnings or error messages.
:::

## Task Lists

Here's a project todo list:

- [x] Set up enhanced markdown parsing
- [x] Add syntax highlighting
- [x] Create callout boxes
- [ ] Add diagram support
- [ ] Implement custom components
- [ ] Add search functionality

## Code Examples

### TypeScript Example

```typescript
interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  category: 'web' | 'mobile' | 'api' | 'tools'
  tags: string[]
  featured?: boolean
}

const createProject = (data: Partial<Project>): Project => {
  return {
    id: '',
    title: '',
    subtitle: '',
    description: '',
    category: 'web',
    tags: [],
    ...data
  }
}
```

### Python Example

```python
def process_markdown(content: str) -> dict:
    """Process markdown content and return HTML with metadata."""
    
    # Parse frontmatter
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            frontmatter = yaml.safe_load(parts[1])
            markdown_content = parts[2].strip()
        else:
            frontmatter = {}
            markdown_content = content
    else:
        frontmatter = {}
        markdown_content = content
    
    # Convert to HTML
    html = markdown.markdown(markdown_content, extensions=[
        'markdown.extensions.codehilite',
        'markdown.extensions.toc',
        'markdown.extensions.tables'
    ])
    
    return {
        'frontmatter': frontmatter,
        'html': html,
        'raw': markdown_content
    }
```

### Shell Commands

```bash
# Install dependencies
npm install markdown-it prismjs

# Add plugin packages
npm install markdown-it-anchor markdown-it-footnote markdown-it-container

# Run development server
npm run dev
```

## Tables

| Feature | Status | Description |
|---------|--------|-------------|
| Basic Markdown | ✅ | Headers, lists, links, images |
| Syntax Highlighting | ✅ | Code blocks with Prism.js |
| Table of Contents | ✅ | Auto-generated from headings |
| Callout Boxes | ✅ | Info, tip, warning, danger |
| Task Lists | ✅ | Interactive checkboxes |
| Footnotes | ✅ | Reference-style footnotes |
| Emoji | ✅ | :rocket: :sparkles: :fire: |

## Footnotes

Here's a paragraph with a footnote[^1]. You can have multiple footnotes[^2] in your content.

[^1]: This is the first footnote with more detailed information.
[^2]: This is the second footnote explaining something else.

## Emoji Support

You can use emoji in several ways:

- Unicode: 🚀 ✨ 📝 💻 🎯
- Shortcodes: :rocket: :sparkles: :memo: :computer: :dart:

## Mathematical Expressions

While not included in this setup, you could easily add KaTeX or MathJax for mathematical expressions.

## Images and Media

![Example Image](/images/profile.png)

## Links and References

- [External Link](https://github.com/markdown-it/markdown-it)
- [Internal Link](#basic-formatting)
- [Email Link](mailto:example@email.com)

## Advanced Features

### Custom HTML

Since HTML is enabled, you can include custom HTML elements:

<details>
<summary>Click to expand</summary>

This content is hidden by default and can be expanded.

```javascript
console.log('Hidden code example')
```

</details>

### Blockquotes

> This is a blockquote. It can contain **formatted text** and other markdown elements.
> 
> Multiple paragraphs are supported.

### Horizontal Rules

---

## Performance Considerations

The enhanced markdown features are optimized for:

- **Fast parsing**: Efficient markdown-it plugins
- **Small bundle size**: Only needed Prism languages are loaded
- **SEO friendly**: Semantic HTML output
- **Accessibility**: Proper heading hierarchy and ARIA labels

---

