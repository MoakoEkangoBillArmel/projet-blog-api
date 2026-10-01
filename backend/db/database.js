const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'blog.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('[DB] Erreur de connexion SQLite :', err.message);
    } else {
        console.log('[DB] Connexion réussie à la base SQLite (' + dbPath + ')');
    }
});

// Initialisation du schéma avec colonnes étendues
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            author TEXT NOT NULL,
            date TEXT NOT NULL,
            category TEXT DEFAULT 'Général',
            tags TEXT DEFAULT '',
            read_time INTEGER DEFAULT 1,
            views INTEGER DEFAULT 0,
            status TEXT DEFAULT 'published'
        )
    `, (err) => {
        if (err) console.error('[DB] Erreur création table :', err.message);
    });

    // Création d'index pour les filtres fréquents
    db.run(`CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_articles_date ON articles(date)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author)`);
});

module.exports = db;
