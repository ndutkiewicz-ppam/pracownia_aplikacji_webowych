const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

const server = http.createServer((req, res) => {
    const url = req.url;

    if (url === '/' || url === '/home') {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Strona główna');
    }
    else if (url === '/api/data') {
        const jsonData = {
            user: "Mirek Szyper",
            role: "Admin",
            active: true
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(jsonData));
    }
    else if (url === '/html-generated') {
        const htmlContent = `Inline HTML`;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(htmlContent);
    } 
    else if (url === '/html-file') {
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
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 - Nie znaleziono strony');
    }
    });
    server.listen(port, () => {
    console.log("Localhost:'//localhost:${port}'");
});

