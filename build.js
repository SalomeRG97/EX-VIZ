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
            console.log(`Processed HTML: ${path.relative(srcDir, src)}`);
        } else if (name.endsWith('.js')) {
            // Read and process JS files for hardcoded paths
            const content = fs.readFileSync(src, 'utf8');
            const processed = rewriteJsPaths(content);
            fs.writeFileSync(dest, processed, 'utf8');
            console.log(`Processed JS:   ${path.relative(srcDir, src)}`);
        } else {
            // Copy binary/static files as-is
            fs.copyFileSync(src, dest);
        }
    }
}

function rewriteHtmlPaths(content) {
    // Matches href, src, content, or action attributes starting with a single slash (absolute path)
    // Negative lookahead (?!\/) prevents matching protocol-relative URLs like //fonts.googleapis.com
    const regex = /(href|src|content|action)=((['"]))\/((?!\/)([^'"]*))(\2)/g;
    
    return content.replace(regex, (match, attribute, quoteWrapper, quote, urlPath) => {
        return `${attribute}=${quote}${rewriteUrl(urlPath)}${quote}`;
    });
}

function rewriteJsPaths(content) {
    let result = content;


    // 3. Replace all hardcoded absolute href="/..." and src="/..." paths inside JS
    //    Handle both escaped quotes (JSON strings) and unescaped quotes (template literals)
    
    // 3a. Unescaped quotes in template literals: href="/es/resources" or src="/media/img.png"
    result = result.replace(/(href|src)="(\/(?!\/)[^"]*)"/g, (match, attr, urlPath) => {
        return `${attr}="${rewriteUrl(urlPath)}"`;
    });

    // 3b. Escaped quotes in JSON strings: href=\"/es/resources\"
    result = result.replace(/(href|src)=\\"(\/(?!\/)[^"\\]*)\\"/g, (match, attr, urlPath) => {
        return `${attr}=\\"${rewriteUrl(urlPath)}\\"`;
    });

    return result;
}

/**
 * Core URL rewriting logic shared by HTML and JS processing.
 * Takes a path like "/aboutus" or "/es/resources" or "/css/styles.css?v=1.1.0"
 * and returns the prefixed version, appending .html where appropriate.
 */
function rewriteUrl(urlPath) {
    // Strip leading slash if present (some regexes capture it, some don't)
    if (urlPath.startsWith('/')) {
        urlPath = urlPath.slice(1);
    }

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
        return `${repoPrefix}/${suffix}`;
    }

    // Rewrite directory root paths ending with "/"
    if (cleanPath.endsWith('/')) {
        return `${repoPrefix}/${cleanPath}${suffix}`;
    }

    // Check if the path references a page that physically exists as <path>.html in the source.
    // If so, append ".html" to the link to support GitHub Pages (no clean URL support).
    const sourceHtmlFile = path.join(srcDir, cleanPath + '.html');
    if (fs.existsSync(sourceHtmlFile) && fs.statSync(sourceHtmlFile).isFile()) {
        return `${repoPrefix}/${cleanPath}.html${suffix}`;
    }

    // Check if the path references a directory with an index.html inside
    const sourceDir = path.join(srcDir, cleanPath);
    const sourceIndexFile = path.join(sourceDir, 'index.html');
    if (fs.existsSync(sourceDir) && fs.statSync(sourceDir).isDirectory() && fs.existsSync(sourceIndexFile)) {
        return `${repoPrefix}/${cleanPath}/`;
    }

    // Otherwise (for assets like css, js, media, or already-extended files)
    return `${repoPrefix}/${urlPath}`;
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
