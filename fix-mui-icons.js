const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.resolve(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 1. Fix @mui/icons-material imports
  // Change import { Alarm, Home } from '@mui/icons-material' to direct imports
  const iconImportRegex = /import\s+\{\s*([^}]+)\s*\}\s*from\s+['"]@mui\/icons-material['"]/g;
  content = content.replace(iconImportRegex, (match, p1) => {
    const icons = p1.split(',').map(i => i.trim()).filter(i => i !== '');
    changed = true;
    return icons.map(icon => `import ${icon} from "@mui/icons-material/${icon}";`).join('\n');
  });

  // 2. Fix @mui/material imports (if any missed)
  const materialImportRegex = /import\s+\{\s*([^}]+)\s*\}\s*from\s+['"]@mui\/material['"]/g;
  content = content.replace(materialImportRegex, (match, p1) => {
    const components = p1.split(',').map(i => i.trim()).filter(i => i !== '');
    changed = true;
    return components.map(c => `import ${c} from "@mui/material/${c}";`).join('\n');
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed MUI imports in: ${file}`);
  }
});
