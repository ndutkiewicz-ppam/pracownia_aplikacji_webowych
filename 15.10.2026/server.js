const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.get(['/', '/home'], (req, res) => {
    res.send('Strona główna'); 
});

app.get('/api/data', (req, res) => {
    const jsonData = {
        user: "Mirek Szyper",
        role: "Admin",
        active: true
    };
    res.json(jsonData);
});

app.get('/html-generated', (req, res) => {
    const htmlContent = `<h1>HTML</h1><p>wygenerowany expressem.js</p>`;
    res.send(htmlContent); 
});

app.get('/html-file', (req, res) => {
    const filePath = path.join(__dirname, 'index.html');
        res.sendFile(filePath);
});

app.get('/get_params', (req, res) => {
    const queryParams = req.query;
    console.log(queryParams);

    const timestamp = Date.now();
    const filename = `params_${timestamp}.json`;
    const filePath = path.join(__dirname, filename);
    
    fs.writeFile(filePath, JSON.stringify(queryParams), (error) => {
        if (error) {
            return res.status(500).send('Błąd zapisu pliku');
        }
        res.json({ 'ok': 'ok' });
    });
});

app.use(express.static(path.join(__dirname, 'assets')));
app.use((req, res) => {
    res.status(404).json({ 'error': '404 Not Found' });
});


app.listen(port, () => {
    console.log(`Serwer Express działa na http://localhost:${port}`);
});



