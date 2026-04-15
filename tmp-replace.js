const fs = require('fs');
let p = 'es/renderingstudio.html';
let data = fs.readFileSync(p, 'utf8');

const regex = /<iframe[^>]+cFuzzz5s3aw[\s\S]*?<\/iframe>\s*<iframe[^>]+kYZ5IS6srJo[\s\S]*?<\/iframe>\s*<iframe[^>]+O_CJy218X0k[\s\S]*?<\/iframe>/g;

const repl = `<video preload="none" autoplay loop muted playsinline class="bg-video">
                <source src="/media/RenderingStudio/01-ArchitecturalCGI/VideoGaleriaA.webm" type="video/webm">
                <source src="/media/RenderingStudio/01-ArchitecturalCGI/VideoGaleriaA.mp4" type="video/mp4">
            </video>
                <video preload="none" autoplay loop muted playsinline class="bg-video">
                <source src="/media/RenderingStudio/01-ArchitecturalCGI/VideoGaleriaB.webm" type="video/webm">
                <source src="/media/RenderingStudio/01-ArchitecturalCGI/VideoGaleriaB.mp4" type="video/mp4">
            </video>
                <video preload="none" autoplay loop muted playsinline class="bg-video">
                <source src="/media/RenderingStudio/01-ArchitecturalCGI/VideoGaleriaC.webm" type="video/webm">
                <source src="/media/RenderingStudio/01-ArchitecturalCGI/VideoGaleriaC.mp4" type="video/mp4">
            </video>`;

let count = 0;
data = data.replace(regex, () => {
    count++;
    return repl;
});

fs.writeFileSync(p, data, 'utf8');
console.log(`Replaced ${count} occurrences in ${p}`);
