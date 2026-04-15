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

  // We find matches for /media/(aboutus|careers|clients|sustainability)/SOMETHING.(png|jpg|jpeg)
  // in either case-insensitive config. We replace the extension with .webp
  const regex = /(\/media\/(?:aboutus|careers|clients|sustainability)\/[^"']*\.)(png|jpg|jpeg)/gi;

  const newContent = content.replace(regex, (match, prefix, ext) => {
    changed = true;
    totalUpdated++;
    return prefix + 'webp';
  });

  if (changed) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`✅ Updated ${totalUpdated} image references in ${path.relative(webRoot, file)}`);
    totalUpdated = 0; // reset for logging purposes per file
  }
}

console.log(`\nDone updating HTML paths.`);
