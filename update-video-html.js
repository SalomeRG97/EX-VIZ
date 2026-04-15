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
console.log(`Found ${htmlFiles.length} HTML files\n`);

let totalReplacements = 0;

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');

  // Match <video ...attributes... src="path/to/file.mp4" ...attributes...></video>
  // Captures everything before src, the src path, and everything after src up to >
  const videoSrcRegex = /<video((?:[^>](?!src=))*)\ssrc="([^"]+\.mp4)"((?:[^>])*?)><\/video>/gi;

  let count = 0;
  const newContent = content.replace(videoSrcRegex, (match, before, mp4Src, after) => {
    const webmSrc = mp4Src.replace(/\.mp4$/i, '.webm');
    const attrs = (before + ' ' + after).trim().replace(/\s+/g, ' ');
    count++;
    totalReplacements++;
    return `<video ${attrs} class="bg-video">
                <source src="${webmSrc}" type="video/webm">
                <source src="${mp4Src}" type="video/mp4">
            </video>`;
  });

  if (count > 0) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`✅ ${path.relative(webRoot, file)}  (${count} video tag${count > 1 ? 's' : ''} updated)`);
  }
}

console.log(`\nDone. ${totalReplacements} video tags updated.`);
