const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('ffmpeg-static');

const mediaDir = path.join(__dirname, 'media');

// Find all mp4 files recursively
function findMp4Files(dir) {
  let results = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(findMp4Files(fullPath));
    } else if (item.toLowerCase().endsWith('.mp4')) {
      results.push(fullPath);
    }
  }
  return results;
}

const mp4Files = findMp4Files(mediaDir);
console.log(`\nFound ${mp4Files.length} MP4 files to convert:\n`);
mp4Files.forEach(f => console.log('  ' + path.relative(__dirname, f)));

let completed = 0;
let failed = [];

function convertFile(mp4Path) {
  const webmPath = mp4Path.replace(/\.mp4$/i, '.webm');
  const relPath = path.relative(__dirname, mp4Path);
  console.log(`\n[${completed + 1}/${mp4Files.length}] Converting: ${relPath}`);

  try {
    // VP9 + Opus — best quality/size for web
    execSync(
      `"${ffmpeg}" -i "${mp4Path}" -c:v libvpx-vp9 -crf 33 -b:v 0 -c:a libopus -b:a 96k -deadline good -cpu-used 2 -row-mt 1 -y "${webmPath}"`,
      { stdio: 'inherit', timeout: 600000 }
    );
    const sizeMp4 = (fs.statSync(mp4Path).size / 1024 / 1024).toFixed(1);
    const sizeWebm = (fs.statSync(webmPath).size / 1024 / 1024).toFixed(1);
    console.log(`  ✅ Done: ${sizeMp4}MB → ${sizeWebm}MB`);
  } catch (err) {
    console.error(`  ❌ Failed: ${relPath}`);
    failed.push(relPath);
  }
  completed++;
}

// Convert sequentially to avoid overwhelming the CPU
for (const f of mp4Files) {
  convertFile(f);
}

console.log(`\n${'='.repeat(60)}`);
console.log(`Conversion complete: ${completed - failed.length}/${mp4Files.length} successful`);
if (failed.length > 0) {
  console.log(`Failed files:`);
  failed.forEach(f => console.log('  ' + f));
}
