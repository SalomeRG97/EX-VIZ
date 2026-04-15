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

  const newContent = content.replace(videoTagRegex, () => {
    changed = true;
    totalUpdated++;
    return `<video autoplay loop muted playsinline preload="none" class="bg-video">`;
  });

  if (changed) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`✅ Standardized ${totalUpdated} tags in ${path.relative(webRoot, file)}`);
  }
}

console.log(`\nDone. Standardized ${totalUpdated} video tags.`);
