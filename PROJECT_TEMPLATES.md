# Project Template System

This repository includes a streamlined template system for quickly creating new project documentation using a simple, effective template.

## Template Available

### Simple Template (`_simple-template.md`)

- **Use for**: All types of projects - work portfolio pieces, side projects, prototypes, experiments
- **Includes**: Overview, key features, technical details, implementation highlights, results, and links
- **Best for**: Clean, focused project documentation that highlights what matters most

## How to Create New Projects

### Method 1: Using npm script (Recommended)
```bash
npm run create-project
```
This will prompt you for:

- Project ID (kebab-case, e.g., `my-awesome-app`)
- Project Title (e.g., `My Awesome App`)
- Project Subtitle

### Method 2: Using bash script (macOS/Linux)
```bash
./create-project.sh project-id "Project Title" "Project subtitle"
```

### Method 3: Using Node.js script directly
```bash
node scripts/create-project.js
```

### Method 4: Manual duplication

1. Copy `_simple-template.md`
2. Rename to your `project-id.md`
3. Update the frontmatter (metadata between `---`)
4. Replace template content with your project details
5. Add the project ID to `src/utils/project-registry.ts`

## Project Structure

Each project file follows this structure:

```markdown
---
id: unique-project-id
title: Display Title
subtitle: Brief description
description: Longer description for SEO and cards
category: work | personal | experiment
tags: [Technology, Framework, Tool]
image: /images/project-id.svg
featured: true | false
liveUrl: https://example.com (optional)
sourceUrl: https://github.com/username/repo
completedAt: YYYY-MM-DD
duration: X weeks
---

Content goes here...
```

### Frontmatter Fields

- **id**: Unique identifier, must match filename (without .md)
- **title**: Display name shown in UI
- **subtitle**: Brief tagline or summary
- **description**: Longer description for meta tags and project cards
- **category**: Type of project (`work`, `personal`, `experiment`)
- **tags**: Array of technologies used
- **image**: Path to project image (relative to public folder)
- **featured**: Whether to highlight on homepage
- **liveUrl**: Link to live demo (optional)
- **sourceUrl**: Link to source code repository
- **completedAt**: Completion date (YYYY-MM-DD format)
- **duration**: How long the project took

## Content Guidelines

### For Full Template Projects

1. **Overview**: Explain the problem solved and target audience
2. **Technical Stack**: Use the JSON format for consistency
3. **Architecture**: Include diagrams and design decisions
4. **Implementation**: Show key code examples
5. **Performance**: Document optimizations made
6. **Testing**: Include test examples and strategy
7. **Challenges**: Be honest about difficulties and solutions
8. **Results**: Include metrics and outcomes

### For Simple Template Projects

1. **Keep it concise**: Focus on key points
2. **Highlight impact**: What was achieved?
3. **Show key tech**: Main technologies used
4. **Include visuals**: Screenshots or diagrams
5. **Link to demo**: If available

## Image Guidelines

- Place images in `public/images/`
- Use SVG format when possible for scalability
- Create a main project image named `project-id.svg`
- Ensure images are optimized for web
- Consider creating diagrams for technical projects

## Best Practices

### Content Writing
- Start with a compelling hook
- Use active voice
- Include specific metrics when possible
- Balance technical depth with readability
- Proofread for grammar and spelling

### Technical Details
- Include code examples that showcase key concepts
- Use proper syntax highlighting
- Explain complex implementations
- Show before/after comparisons when relevant

### SEO Optimization
- Use descriptive titles and subtitles
- Include relevant keywords in the description
- Add alt text for images
- Use semantic HTML structure

## Registry Management

The `src/utils/project-registry.ts` file maintains a list of all projects. When using the automated scripts, this is updated automatically. For manual creation, add your project ID to the array.

```typescript
export const PROJECT_REGISTRY = [
  'newest-project',
  'older-project',
  // ... other projects
]
```

Projects are displayed in the order listed, so put newer projects first.

## Markdown Linting

The project uses markdown linting. Common rules:
- Use proper heading hierarchy
- Include blank lines around headings and lists
- Use underscore emphasis instead of asterisks
- End files with a single newline
- Specify language for code blocks

## Tips for Great Project Documentation

1. **Tell a story**: Explain the journey, not just the outcome
2. **Show your thinking**: Include decision-making process
3. **Be specific**: Use concrete examples and metrics
4. **Include visuals**: Screenshots, diagrams, and code examples
5. **Link everything**: Demos, repos, related resources
6. **Update regularly**: Keep content current as projects evolve

## Troubleshooting

### Common Issues

**Project not showing up**
- Check that the ID is added to `project-registry.ts`
- Verify the markdown file is in `public/projects/`
- Ensure frontmatter is properly formatted

**Images not loading**
- Confirm image path is correct (`/images/project-id.svg`)
- Check that image exists in `public/images/`
- Verify image format is supported

**Markdown errors**
- Run linting to check for syntax issues
- Ensure proper blank lines around headings
- Check that code blocks have language specified

---

This template system is designed to speed up project documentation while maintaining consistency and quality across your portfolio.