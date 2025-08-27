# Portfolio Website

A modern, accessible portfolio website built with Vue 3, TypeScript, and CSS design tokens. Features dark/light themes, performance modes, and full responsiveness.

## 🚀 Features

- **Vue 3 + TypeScript** - Modern framework with type safety
- **CSS Design Tokens** - Consistent design system with CSS custom properties
- **Full Accessibility** - WCAG 2.1 AA compliant
- **Dark/Light Themes** - Automatic detection with manual toggle
- **Performance Modes** - Full animations vs. power-saver mode
- **Responsive Design** - Works on all device sizes
- **Markdown Support** - Rich content for project descriptions
- **SEO Optimized** - Proper meta tags and structure

## 📁 Project Structure

```
src/
├── components/           # Reusable Vue components
│   ├── AppHeader.vue    # Main navigation header
│   ├── AppFooter.vue    # Site footer
│   └── icons/           # SVG icon components
├── views/               # Page components
│   ├── Home.vue         # Landing page
│   ├── Projects.vue     # Project listing
│   ├── Project.vue      # Individual project details
│   ├── About.vue        # About page
│   └── Contact.vue      # Contact form
├── styles/              # Global styles and design tokens
│   ├── tokens.scss      # CSS custom properties
│   └── global.scss      # Global styles and utilities
├── utils/               # Utility functions
│   └── markdown.ts      # Markdown processing
├── App.vue              # Root component
└── main.ts              # Application entry point
```

## 🛠️ Setup & Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## 🎨 Customization Guide

### 1. Design Tokens

Edit `src/styles/tokens.scss` to customize:
- Colors (primary, neutral, semantic)
- Typography (fonts, sizes, weights)
- Spacing scale
- Border radius values
- Shadow definitions
- Animation durations

### 2. Content Structure

#### Projects
Create markdown files for your projects and update the project data structure in:
- `src/views/Projects.vue` - Project listing
- `src/views/Project.vue` - Individual project pages

#### Personal Information
Update the following files with your information:
- `src/views/Home.vue` - Hero section and skills
- `src/views/About.vue` - Bio, experience, interests
- `src/views/Contact.vue` - Contact information
- `src/components/AppFooter.vue` - Social links

### 3. SEO & Meta Tags

Update `index.html` with:
- Site title and description
- Open Graph tags
- Twitter Card data
- Favicon and manifest

### 4. Theme Customization

The theme system uses CSS custom properties:
- Light theme: Default values in `:root`
- Dark theme: Overrides in `[data-theme="dark"]`
- Power saver mode: Animation disabling in `[data-performance="power-saver"]`

## 🌐 Deployment

### Static Hosting (Recommended)

Build the project and deploy the `dist` folder to:
- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload the `dist` folder to your web server

### Environment Variables

For contact form functionality, you may need to configure:
- Email service API keys
- Form submission endpoints
- Analytics tracking IDs

## ♿ Accessibility Features

- **Semantic HTML** - Proper heading hierarchy and landmarks
- **Keyboard Navigation** - Full keyboard accessibility
- **Screen Reader Support** - ARIA labels and descriptions
- **Focus Management** - Visible focus indicators
- **Reduced Motion** - Respects `prefers-reduced-motion`
- **Color Contrast** - WCAG AA compliant color ratios
- **Skip Links** - Quick navigation for assistive technology

## 🔧 Technology Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Vue Router** - Client-side routing
- **SCSS** - Enhanced CSS with variables and nesting
- **Markdown-it** - Markdown parser for content
- **Prism.js** - Syntax highlighting for code blocks

## 📝 Content Guidelines

### Project Documentation

Each project should include:
- Clear title and description
- Technologies used
- Key features
- Screenshots or demo links
- Source code links
- Challenges and solutions

### Markdown Formatting

Supported markdown features:
- Headers with auto-generated anchors
- Code blocks with syntax highlighting
- Tables with responsive styling
- Links (external links open in new tab)
- Lists and emphasis
- Blockquotes

## 🚦 Performance

### Optimization Features

- **Code Splitting** - Lazy-loaded routes
- **Image Optimization** - Responsive images with proper sizing
- **CSS Optimization** - Minimal critical CSS
- **Tree Shaking** - Unused code elimination
- **Compression** - Gzip/Brotli ready

### Performance Modes

- **Full Mode** - All animations and visual effects
- **Power Saver** - Disabled animations for better performance
- **Reduced Motion** - Automatic detection of user preference

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test accessibility and responsiveness
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the browser console for errors
2. Verify all dependencies are installed
3. Ensure you're using a supported Node.js version
4. Review the accessibility guidelines if implementing custom features

---

**Happy coding!** 🎉