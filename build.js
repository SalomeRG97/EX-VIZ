const fs = require('fs');
const path = require('path');

const repoPrefix = '/EX-VIZ';
const srcDir = __dirname;
const distDir = path.join(srcDir, 'dist');

// Folders/files to ignore during build
const ignoredNames = new Set([
    '.git',
    '.github',
    'node_modules',
    'dist',
    'build.js',
    'serve.js',
    'audit_report.md',
    'README.md',
    'task.md',
    'implementation_plan.md',
    'walkthrough.md'
]);

function copyRecursive(src, dest) {
    const stats = fs.statSync(src);
    const name = path.basename(src);

    if (ignoredNames.has(name)) {
        return;
    }

    if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        const children = fs.readdirSync(src);
        for (const child of children) {
            copyRecursive(path.join(src, child), path.join(dest, child));
        }
    } else if (stats.isFile()) {
        // Ensure parent directory exists
        const parentDir = path.dirname(dest);
        if (!fs.existsSync(parentDir)) {
            fs.mkdirSync(parentDir, { recursive: true });
        }
        
        if (name.endsWith('.html')) {
            // Read and process HTML files
            const content = fs.readFileSync(src, 'utf8');
            const processed = rewriteHtmlPaths(content);
            fs.writeFileSync(dest, processed, 'utf8');
            console.log(`Processed: ${path.relative(srcDir, src)} -> ${path.relative(srcDir, dest)}`);
        } else {
            // Copy binary/static files as-is
            fs.copyFileSync(src, dest);
        }
    }
}

function rewriteHtmlPaths(content) {
    // Matches href, src, content, or action attributes starting with a single slash (absolute path)
    // E.g., href="/css/styles.css" or href="/aboutus#history"
    // Negative lookahead (?!\/) prevents matching protocol-relative URLs like //fonts.googleapis.com
    const regex = /(href|src|content|action)=((['"]))\/(?!\/)([^'"]*)\2/g;
    
    return content.replace(regex, (match, attribute, quoteWrapper, quote, urlPath) => {
        let cleanPath = urlPath;
        let suffix = '';
        
        // Find if there's a hash (#) or query parameter (?)
        const hashIdx = urlPath.indexOf('#');
        const queryIdx = urlPath.indexOf('?');
        let splitIdx = -1;
        if (hashIdx !== -1 && queryIdx !== -1) {
            splitIdx = Math.min(hashIdx, queryIdx);
        } else if (hashIdx !== -1) {
            splitIdx = hashIdx;
        } else if (queryIdx !== -1) {
            splitIdx = queryIdx;
        }
        
        if (splitIdx !== -1) {
            cleanPath = urlPath.slice(0, splitIdx);
            suffix = urlPath.slice(splitIdx);
        }

        // Rewrite empty root path "/" or root anchors like "/#history"
        if (cleanPath === '') {
            return `${attribute}=${quote}${repoPrefix}/${suffix}${quote}`;
        }

        // Rewrite directory root paths ending with "/"
        if (cleanPath.endsWith('/')) {
            return `${attribute}=${quote}${repoPrefix}/${cleanPath}${suffix}${quote}`;
        }

        // Check if the path references a page that physically exists as <path>.html in the root.
        // If so, append ".html" to the link to support GitHub Pages clean URL limitation.
        const sourceHtmlFile = path.join(srcDir, cleanPath + '.html');
        if (fs.existsSync(sourceHtmlFile) && fs.statSync(sourceHtmlFile).isFile()) {
            return `${attribute}=${quote}${repoPrefix}/${cleanPath}.html${suffix}${quote}`;
        }

        // Otherwise (for assets like css, js, media, or already-extended files)
        return `${attribute}=${quote}${repoPrefix}/${urlPath}${quote}`;
    });
}

console.log('Starting build for GitHub Pages...');

// Clean and recreate dist directory
if (fs.existsSync(distDir)) {
    console.log('Cleaning existing dist directory...');
    fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Run the copying and rewriting process
const children = fs.readdirSync(srcDir);
for (const child of children) {
    if (child !== 'dist') {
        copyRecursive(path.join(srcDir, child), path.join(distDir, child));
    }
}

console.log('Build completed successfully!');
