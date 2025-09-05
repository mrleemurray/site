---
id: test-callouts
title: Enhanced Markdown Test
subtitle: Testing all advanced markdown features
description: A comprehensive test for enhanced markdown functionality
category: experiment
tags: [Test, Markdown, Demo]
featured: false
completedAt: 2024-03-15
duration: 5 minutes
---

# Enhanced Markdown Test

This page tests all the enhanced markdown features.

## Callout Boxes

::: info
This is an **info** callout box with *formatting* support!
:::

::: tip
This is a **tip** callout with some helpful information.
:::

::: warning
This is a **warning** callout. Be careful!
:::

::: danger
This is a **danger** callout. Critical information here!
:::

## Task Lists

Project checklist:

- [x] Basic markdown parsing
- [x] Callout containers
- [x] Task list support
- [ ] Footnote testing
- [ ] Table of contents
- [ ] Advanced typography

## Code Blocks with Syntax Highlighting

### JavaScript
```javascript
function enhancedMarkdown() {
  const features = ['callouts', 'task-lists', 'footnotes'];
  console.log('Features:', features);
  return features.length > 0;
}
```

### TypeScript
```typescript
interface MarkdownFeature {
  name: string;
  enabled: boolean;
  description?: string;
}

const features: MarkdownFeature[] = [
  { name: 'callouts', enabled: true, description: 'Info, warning, tip boxes' },
  { name: 'task-lists', enabled: true }
];
```

### Python
```python
def test_enhanced_features():
    """Test enhanced markdown functionality."""
    features = {
        'callouts': True,
        'task_lists': True,
        'syntax_highlighting': True
    }
    return all(features.values())
```

## Enhanced Typography

**Bold text** and *italic text* work great.

==Highlighted text== should appear with a background color.

++Inserted text++ should show as inserted content.

## Footnotes

Here's a sentence with a footnote[^1]. You can have multiple footnotes[^2] in your content.

[^1]: This is the first footnote with detailed information.
[^2]: This is the second footnote explaining something else.

## Tables

| Feature | Status | Notes |
|---------|--------|-------|
| Callouts | ✅ | Working great |
| Task Lists | ✅ | Interactive |
| Syntax Highlighting | ✅ | Multiple languages |
| Footnotes | ✅ | Reference style |
| Enhanced Typography | ✅ | Highlighting, etc. |

## Links and Images

- [External Link](https://github.com/markdown-it/markdown-it)
- [Internal Link](#callout-boxes)

![Test Image](/images/profile.png)

## Blockquotes

> This is a blockquote with **bold** and *italic* text.
> 
> It can span multiple paragraphs and include other markdown elements.

---

**All features tested!** The enhanced markdown system provides rich formatting capabilities for documentation.