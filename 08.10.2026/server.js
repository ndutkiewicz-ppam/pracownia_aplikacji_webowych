const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const mime = require('mime-types');

const port = 3000;

const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);
    const pathname = reqUrl.pathname;

    if (pathname === '/' || pathname === '/home') {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Strona główna');
    }
    else if (pathname === '/api/data') {
        const jsonData = {
            user: "Mirek Szyper",
            role: "Admin",
            active: true
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(jsonData));
    }
    else if (pathname === '/html-generated') {
        const htmlContent = `Inline HTML`;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(htmlContent);
    } 
    else if (pathname === '/html-file') {
        const filePath = path.join(__dirname, 'index.html');
    
        fs.readFile(filePath, (error, content) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error: Cannot read file');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        });
    }
    else if (pathname === '/get_params') {
        const queryParams = reqUrl.query;
        console.log(queryParams);

        const timestamp = Date.now();
        const filename = `params_${timestamp}.json`;
        const filePath = path.join(__dirname, filename);
        
        fs.writeFile(filePath, JSON.stringify(queryParams), (error) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Błąd zapisu pliku');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 'ok': 'ok' }));
            }
        });
    }
    else {
        const filePath = path.join(__dirname, 'assets', pathname);

        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 'error': '404 Not Found' }));
            } else {
                fs.readFile(filePath, (error, content) => {
                    if (error) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ 'error': '500 Server Error' }));
                    } else {
                        const mimeType = mime.lookup(filePath) || 'application/octet-stream';
                        res.writeHead(200, { 'Content-Type': mimeType });
                        res.end(content);
                    }
                });
            }
        });
    }
});
server.listen(port, () => {
    console.log(`Localhost://localhost:${port}`);
});

