#!/bin/bash

# Project Template Creator
# Usage: ./create-project.sh project-name "Project Title" "Brief subtitle"

set -e

# Check if correct number of arguments provided
if [ $# -lt 3 ]; then
    echo "Usage: $0 <project-id> <project-title> <project-subtitle>"
    echo "Example: $0 my-awesome-app \"My Awesome App\" \"A revolutionary mobile application\""
    exit 1
fi

PROJECT_ID="$1"
PROJECT_TITLE="$2"
PROJECT_SUBTITLE="$3"
TEMPLATE_FILE="public/projects/_simple-template.md"
NEW_FILE="public/projects/${PROJECT_ID}.md"

# Check if template exists
if [ ! -f "$TEMPLATE_FILE" ]; then
    echo "Error: Template file not found at $TEMPLATE_FILE"
    exit 1
fi

# Check if project already exists
if [ -f "$NEW_FILE" ]; then
    echo "Error: Project file already exists at $NEW_FILE"
    exit 1
fi

# Copy template and replace placeholders
cp "$TEMPLATE_FILE" "$NEW_FILE"

# Get current date in YYYY-MM-DD format
CURRENT_DATE=$(date +%Y-%m-%d)

# Replace template values using sed (macOS compatible)
sed -i '' "s/id: simple-template/id: ${PROJECT_ID}/" "$NEW_FILE"
sed -i '' "s/title: Simple Project Template/title: ${PROJECT_TITLE}/" "$NEW_FILE"
sed -i '' "s/subtitle: Quick template for simpler projects/subtitle: ${PROJECT_SUBTITLE}/" "$NEW_FILE"
sed -i '' "s/image: \/images\/simple-template.svg/image: \/images\/${PROJECT_ID}.svg/" "$NEW_FILE"
sed -i '' "s/completedAt: 2024-01-15/completedAt: ${CURRENT_DATE}/" "$NEW_FILE"

# Update project registry
REGISTRY_FILE="src/utils/project-registry.ts"
if [ -f "$REGISTRY_FILE" ]; then
    # Add the new project to the registry array
    sed -i '' "/export const PROJECT_REGISTRY = \[/a\\
  '${PROJECT_ID}'," "$REGISTRY_FILE"
    echo "✅ Added '${PROJECT_ID}' to project registry"
else
    echo "⚠️  Warning: Could not find project registry at $REGISTRY_FILE"
    echo "   Remember to manually add '${PROJECT_ID}' to the PROJECT_REGISTRY array"
fi

echo "✅ Created new project file: $NEW_FILE"
echo "📝 Next steps:"
echo "   1. Edit $NEW_FILE to add your project content"
echo "   2. Add project image at public/images/${PROJECT_ID}.svg"
echo "   3. Update the description, tags, and URLs in the frontmatter"
echo "   4. Replace placeholder content with your project details"
echo ""
echo "🚀 Your project template is ready for customization!"