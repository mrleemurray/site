# Quick Reference: Project Template System

## Quick Start

```bash
# Create a new project (interactive)
npm run create-project

# Or use the bash script
./create-project.sh my-project "My Project" "A cool project"
```

## Template

**Simple Template**: Streamlined template for all project types - covers overview, features, tech stack, implementation, and results in a clean, focused format.

## Required Steps

1. **Create project file** - Use script or manual copy
2. **Add project image** - Place SVG in `public/images/your-project-id.svg`
3. **Update frontmatter** - Customize metadata between `---`
4. **Replace content** - Add your project details
5. **Update registry** - Add ID to `src/utils/project-registry.ts` (auto with scripts)

## Frontmatter Checklist

```yaml
id: kebab-case-id           # ✅ Must match filename
title: Display Title        # ✅ Shown in UI
subtitle: Brief tagline     # ✅ Under title
description: SEO text       # ✅ For cards/meta
category: work              # ✅ work|personal|experiment
tags: [Tech, Framework]     # ✅ Array format
image: /images/id.svg       # ✅ Must exist
featured: false             # ✅ Homepage highlight
liveUrl: https://demo.com   # ⚠️ Optional
sourceUrl: https://github   # ✅ Repository
completedAt: 2024-01-15     # ✅ YYYY-MM-DD
duration: 2 weeks           # ✅ Time spent
```

## Common Sections (Full Template)

- Overview + Core Features
- Technical Stack (JSON format)
- Architecture Overview
- Implementation Highlights
- Performance Optimizations
- Testing Strategy
- Challenges & Solutions
- Deployment & DevOps
- Lessons Learned
- Future Enhancements
- Metrics & Results
- Links

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Project not showing | Check registry, verify file location |
| Image not loading | Confirm path and file exists |
| Markdown errors | Add blank lines around headings/lists |
| Script fails | Check permissions (`chmod +x`) |

---

**💡 Pro Tip**: The template is designed to be flexible - add more detail for complex projects or keep it concise for simpler ones.