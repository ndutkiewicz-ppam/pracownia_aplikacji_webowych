const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kontakt_db',
    waitForConnections: true,
    connectionLimit: 10
});

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/o-nas', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/oferta', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'offer.html'));
});

app.get('/kontakt', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'contact.html'));
});

app.post('/kontakt', async (req, res) => {
    const { imie, nazwisko, email, wiadomosc } = req.body;

    try {
        await pool.execute(
            'INSERT INTO messages (imie, nazwisko, email, wiadomosc) VALUES (?, ?, ?, ?)',
            [imie, nazwisko, email, wiadomosc]
        );
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Błąd serwera podczas zapisu wiadomości');
    }
});

app.get('/api/contact-messages', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM messages');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

app.get('/api/contact-messages/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(404).json({ error: 'Nie znaleziono wiadomości o podanym ID' });
    }

    try {
        const [rows] = await pool.execute('SELECT * FROM messages WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Nie znaleziono wiadomości o podanym ID' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

app.listen(3000, () => {
    console.log('Serwer dziala, port 3000');
});

