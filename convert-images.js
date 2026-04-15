const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('ffmpeg-static');

const mediaDir = path.join(__dirname, 'media');
const folders = ['aboutus', 'careers', 'clients', 'sustainability'];
let converted = 0;

for (const folder of folders) {
    const dir = path.join(mediaDir, folder);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir);
    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (['.png', '.jpg', '.jpeg'].includes(ext)) {
            const oldPath = path.join(dir, file);
            const newFile = file.slice(0, -ext.length) + '.webp';
            const newPath = path.join(dir, newFile);

            console.log(`Converting ${path.join(folder, file)} to webp...`);
            try {
                execSync(`"${ffmpeg}" -i "${oldPath}" -c:v libwebp -quality 85 -y "${newPath}"`, { stdio: 'ignore' });
                converted++;
                fs.unlinkSync(oldPath); // delete old image
            } catch (err) {
                console.error(`Error converting ${file}`);
            }
        }
    }
}

console.log(`Finished converting ${converted} images to WEBP.`);
