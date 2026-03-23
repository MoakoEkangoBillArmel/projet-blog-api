const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'blog.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Erreur de connexion :', err);
    else console.log('Connecté à SQLite');
});

// Création de la table articles
db.run(`
    CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author TEXT NOT NULL,
        date TEXT NOT NULL,
        category TEXT,
        tags TEXT
    )
`);

module.exports = db;
