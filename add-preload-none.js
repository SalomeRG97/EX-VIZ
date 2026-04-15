const fs = require('fs');
const path = require('path');

const webRoot = __dirname;
const htmlFiles = [];

function findHtml(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory() && item !== 'node_modules' && !item.startsWith('.')) {
      findHtml(full);
    } else if (item.endsWith('.html')) {
      htmlFiles.push(full);
    }
  }
}

findHtml(webRoot);

let totalUpdated = 0;

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // We find all <video ...> tags (but not the closing </video> tags)
  const videoTagRegex = /<video\s+([^>]*?)>/gi;

  const newContent = content.replace(videoTagRegex, (match, attrs) => {
    // If it already has preload="none", skip
    if (attrs.includes('preload="none"')) {
      return match;
    }
    changed = true;
    totalUpdated++;
    return `<video preload="none" ${attrs}>`;
  });

  if (changed) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`✅ Updated ${totalUpdated} tags in ${path.relative(webRoot, file)}`);
  }
}

console.log(`\nDone. Added preload="none" to ${totalUpdated} video tags.`);
