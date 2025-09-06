#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

async function createProject() {
  try {
    console.log('🚀 Project Template Creator\n');
    
    const projectId = await question('Project ID (kebab-case, e.g., my-awesome-app): ');
    const projectTitle = await question('Project Title (e.g., My Awesome App): ');
    const projectSubtitle = await question('Project Subtitle: ');
    const liveUrlLabel = await question('Live URL Label (default: "Live Demo"): ');
    const sourceUrlLabel = await question('Source URL Label (default: "Source Code"): ');
    
    if (!projectId || !projectTitle || !projectSubtitle) {
      console.error('❌ Error: All fields are required');
      process.exit(1);
    }
    
    // Validate project ID format
    if (!/^[a-z0-9-]+$/.test(projectId)) {
      console.error('❌ Error: Project ID must be in kebab-case (lowercase letters, numbers, and hyphens only)');
      process.exit(1);
    }
    
    const templateFile = 'src/content/projects/_simple-template.md';
    const newFile = `src/content/projects/${projectId}.md`;
    
    // Check if template exists
    if (!fs.existsSync(templateFile)) {
      console.error(`❌ Error: Template file not found at ${templateFile}`);
      process.exit(1);
    }
    
    // Check if project already exists
    if (fs.existsSync(newFile)) {
      console.error(`❌ Error: Project file already exists at ${newFile}`);
      process.exit(1);
    }
    
    // Read template content
    let content = fs.readFileSync(templateFile, 'utf8');
    
    // Get current date
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Replace template placeholders
    const templateIdPattern = 'simple-template';
    const templateTitlePattern = 'Simple Project Template';
    const templateSubtitlePattern = 'Quick template for simpler projects';
    const templateDescriptionPattern = 'A streamlined template for smaller projects or rapid prototyping documentation.';
    const templateLiveUrlLabelPattern = 'Live Demo';
    const templateSourceUrlLabelPattern = 'Source Code';
    
    content = content
      .replace(`id: ${templateIdPattern}`, `id: ${projectId}`)
      .replace(`title: ${templateTitlePattern}`, `title: ${projectTitle}`)
      .replace(`subtitle: ${templateSubtitlePattern}`, `subtitle: ${projectSubtitle}`)
      .replace(`description: ${templateDescriptionPattern}`, `description: ${projectSubtitle}`)
      .replace(`liveUrlLabel: ${templateLiveUrlLabelPattern}`, `liveUrlLabel: ${liveUrlLabel || 'Live Demo'}`)
      .replace(`sourceUrlLabel: ${templateSourceUrlLabelPattern}`, `sourceUrlLabel: ${sourceUrlLabel || 'Source Code'}`)
      .replace(`image: /images/${templateIdPattern}.svg`, `image: /images/${projectId}/cover.png`)
      .replace(/completedAt: 2024-01-15/, `completedAt: ${currentDate}`)
      .replace('# Project Title', `# ${projectTitle}`);
    
    // Write new project file
    fs.writeFileSync(newFile, content);
    
    // Update project registry
    const registryFile = 'src/utils/project-registry.ts';
    if (fs.existsSync(registryFile)) {
      let registryContent = fs.readFileSync(registryFile, 'utf8');
      
      // Add new project to the registry array
      const registryPattern = /(export const PROJECT_REGISTRY = \[)([\s\S]*?)(\])/;
      registryContent = registryContent.replace(registryPattern, (match, start, middle, end) => {
        const projects = middle.split(',').map(p => p.trim().replace(/'/g, '')).filter(Boolean);
        projects.unshift(projectId); // Add to beginning for newest first
        const newMiddle = projects.map(p => `  '${p}'`).join(',\n');
        return `${start}\n${newMiddle}\n${end}`;
      });
      
      fs.writeFileSync(registryFile, registryContent);
      console.log(`✅ Added '${projectId}' to project registry`);
    } else {
      console.log(`⚠️  Warning: Could not find project registry at ${registryFile}`);
      console.log(`   Remember to manually add '${projectId}' to the PROJECT_REGISTRY array`);
    }
    
    // Update markdown content bundle
    const markdownContentFile = 'src/data/markdown-content.ts';
    if (fs.existsSync(markdownContentFile)) {
      let markdownContent = fs.readFileSync(markdownContentFile, 'utf8');
      
      // Convert projectId to camelCase for variable name
      const variableName = projectId.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase()) + 'Md';
      
      // Add import statement
      const importStatement = `import ${variableName} from '../content/projects/${projectId}.md?raw'`;
      const lastImportMatch = markdownContent.match(/import .* from '\.\.\/content\/projects\/.*\.md\?raw'/g);
      if (lastImportMatch) {
        const lastImport = lastImportMatch[lastImportMatch.length - 1];
        markdownContent = markdownContent.replace(lastImport, `${lastImport}\n${importStatement}`);
      }
      
      // Add to export object
      const exportPattern = /(export const MARKDOWN_CONTENT: Record<string, string> = \{)([\s\S]*?)(\})/;
      markdownContent = markdownContent.replace(exportPattern, (match, start, middle, end) => {
        const entries = middle.split(',').map(e => e.trim()).filter(Boolean);
        entries.unshift(`  '${projectId}': ${variableName}`); // Add to beginning for newest first
        const newMiddle = entries.join(',\n');
        return `${start}\n${newMiddle}\n${end}`;
      });
      
      fs.writeFileSync(markdownContentFile, markdownContent);
      console.log(`✅ Added '${projectId}' to markdown content bundle`);
    } else {
      console.log(`⚠️  Warning: Could not find markdown content file at ${markdownContentFile}`);
      console.log(`   Remember to manually add '${projectId}' to the markdown content bundle`);
    }
    
    console.log(`\n✅ Created new project file: ${newFile}`);
    console.log('\n📝 Next steps:');
    console.log(`   1. Edit ${newFile} to add your project content`);
    console.log(`   2. Add project image at public/images/${projectId}/cover.png`);
    console.log('   3. Update the description, tags, and URLs in the frontmatter');
    console.log('   4. Replace placeholder content with your project details');
    console.log('   5. Restart the dev server to see your changes');
    console.log('\n🚀 Your project is now registered and ready for customization!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createProject();
}

export { createProject };