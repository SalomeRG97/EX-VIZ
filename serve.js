/**
 * EX-VIZ — Local Development Server
 * ===================================
 * Run:  node serve.js
 * Then open:  http://localhost:3000
 *
 * Behaves exactly like the live hosting:
 *   /contact        -> serves contact.html
 *   /es/contact     -> serves es/contact.html
 *   /renderingstudio -> serves renderingstudio.html
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');
const url  = require('url');

const PORT = 3000;
const ROOT = __dirname;

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css':  'text/css',
    '.js':   'application/javascript',
    '.json': 'application/json',
    '.webp': 'image/webp',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif':  'image/gif',
    '.svg':  'image/svg+xml',
    '.ico':  'image/x-icon',
    '.woff': 'font/woff',
    '.woff2':'font/woff2',
    '.ttf':  'font/ttf',
};

function serve(res, filePath, status) {
    status = status || 200;
    var ext  = path.extname(filePath).toLowerCase();
    var mime = MIME[ext] || 'application/octet-stream';
    var data = fs.readFileSync(filePath);
    res.writeHead(status, { 'Content-Type': mime });
    res.end(data);
}

function redirect(res, location) {
    res.writeHead(301, { Location: location });
    res.end();
}

var server = http.createServer(function(req, res) {
    var pathname = url.parse(req.url).pathname;
    try { pathname = decodeURIComponent(pathname); } catch (e) {}

    if (pathname === '/index' || pathname === '/index.html') return redirect(res, '/');
    if (pathname === '/es/index' || pathname === '/es/index.html') return redirect(res, '/es/');
    if (pathname.endsWith('.html')) return redirect(res, pathname.slice(0, -5) || '/');

    var filePath = path.join(ROOT, pathname);

    try {
        var stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            var indexFile = path.join(filePath, 'index.html');
            if (fs.existsSync(indexFile)) return serve(res, indexFile);
            res.writeHead(404); res.end('Not found'); return;
        }
        return serve(res, filePath);
    } catch (e) {
        var htmlPath = filePath + '.html';
        if (fs.existsSync(htmlPath)) return serve(res, htmlPath);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - Page not found: ' + pathname);
    }
});

server.listen(PORT, function() {
    console.log('\n?  EX-VIZ local server running at:\n');
    console.log('    http://localhost:' + PORT + '\n');
    console.log('    Press Ctrl+C to stop.\n');
});
