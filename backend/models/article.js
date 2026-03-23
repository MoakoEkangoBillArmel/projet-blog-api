const db = require('../db/database');

class Article {
    static create(article, callback) {
        const { title, content, author, date, category, tags } = article;
        const sql = `INSERT INTO articles (title, content, author, date, category, tags)
                     VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(sql, [title, content, author, date, category, tags], function(err) {
            callback(err, this?.lastID);
        });
    }

    static findAll(filters = {}, callback) {
        let sql = 'SELECT * FROM articles';
        const params = [];
        const conditions = [];
        if (filters.category) {
            conditions.push('category = ?');
            params.push(filters.category);
        }
        if (filters.author) {
            conditions.push('author = ?');
            params.push(filters.author);
        }
        if (filters.date) {
            conditions.push('date = ?');
            params.push(filters.date);
        }
        if (conditions.length) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }
        db.all(sql, params, callback);
    }

    static findById(id, callback) {
        const sql = 'SELECT * FROM articles WHERE id = ?';
        db.get(sql, [id], callback);
    }

    static update(id, updates, callback) {
        const fields = [];
        const values = [];
        for (const [key, val] of Object.entries(updates)) {
            if (val !== undefined) {
                fields.push(`${key} = ?`);
                values.push(val);
            }
        }
        if (fields.length === 0) {
            return callback(new Error('Aucune donnée à mettre à jour'));
        }
        values.push(id);
        const sql = `UPDATE articles SET ${fields.join(', ')} WHERE id = ?`;
        db.run(sql, values, function(err) {
            callback(err, this?.changes);
        });
    }

    static delete(id, callback) {
        const sql = 'DELETE FROM articles WHERE id = ?';
        db.run(sql, [id], function(err) {
            callback(err, this?.changes);
        });
    }

    static search(query, callback) {
        const sql = `SELECT * FROM articles WHERE title LIKE ? OR content LIKE ?`;
        const param = `%${query}%`;
        db.all(sql, [param, param], callback);
    }
}

module.exports = Article;
