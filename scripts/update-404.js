#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the built index.html to extract asset paths
const indexPath = path.join(__dirname, '../dist/index.html');
const html404Path = path.join(__dirname, '../dist/404.html');

try {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Extract CSS and JS asset paths from index.html
  const cssMatch = indexContent.match(/href="([^"]*\.css)"/);
  const jsMatch = indexContent.match(/src="([^"]*\.js)"/);
  
  if (!cssMatch || !jsMatch) {
    console.error('Could not find CSS or JS assets in index.html');
    process.exit(1);
  }
  
  const cssPath = cssMatch[1];
  const jsPath = jsMatch[1];
  
  console.log('Found assets:');
  console.log('CSS:', cssPath);
  console.log('JS:', jsPath);
  
  // Simply copy the index.html content and update the asset paths to be absolute
  let html404Content = indexContent
    // Make CSS path absolute
    .replace(/href="([^"]*\.css)"/, `href="${cssPath}"`)
    // Make JS path absolute  
    .replace(/src="([^"]*\.js)"/, `src="${jsPath}"`)
    // Make favicon absolute
    .replace(/href="\.\/favicon\.svg"/, 'href="/favicon.svg"')
    // Make apple touch icon absolute
    .replace(/href="\.\/apple-touch-icon\.png"/, 'href="/apple-touch-icon.png"')
    // Update the main.ts script to be the bundled JS
    .replace(/src="\.\/src\/main\.ts"/, `src="${jsPath}"`);

  // Write the updated 404.html
  fs.writeFileSync(html404Path, html404Content);
  console.log('✅ 404.html updated with current assets');
  
} catch (error) {
  console.error('Error updating 404.html:', error);
  process.exit(1);
}