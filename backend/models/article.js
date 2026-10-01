const db = require('../db/database');

class Article {
    static calculateReadTime(text) {
        if (!text) return 1;
        const words = text.trim().split(/\s+/).length;
        return Math.max(1, Math.ceil(words / 200));
    }

    static create(article, callback) {
        const { title, content, author, date, category, tags, status } = article;
        const readTime = this.calculateReadTime(content);
        const postDate = date || new Date().toISOString().split('T')[0];
        const postCat = category || 'Général';
        const postStatus = status || 'published';

        const sql = `
            INSERT INTO articles (title, content, author, date, category, tags, read_time, views, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)
        `;
        db.run(sql, [title, content, author, postDate, postCat, tags || '', readTime, postStatus], function(err) {
            callback(err, this ? this.lastID : null);
        });
    }

    static findAll(options = {}, callback) {
        const { category, author, date, tag, sortBy = 'date', order = 'DESC', page, limit } = options;
        
        let sql = 'SELECT * FROM articles';
        const params = [];
        const conditions = [];

        if (category) {
            conditions.push('LOWER(category) = LOWER(?)');
            params.push(category);
        }
        if (author) {
            conditions.push('LOWER(author) = LOWER(?)');
            params.push(author);
        }
        if (date) {
            conditions.push('date = ?');
            params.push(date);
        }
        if (tag) {
            conditions.push('tags LIKE ?');
            params.push(`%${tag}%`);
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        const validSortFields = ['date', 'title', 'views', 'id', 'read_time'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'date';
        const sortOrder = String(order).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        sql += ` ORDER BY ${sortField} ${sortOrder}`;

        if (page && limit) {
            const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
            sql += ` LIMIT ? OFFSET ?`;
            params.push(parseInt(limit, 10), offset);
        }

        db.all(sql, params, callback);
    }

    static countAll(options = {}, callback) {
        const { category, author, date, tag } = options;
        let sql = 'SELECT COUNT(*) AS total FROM articles';
        const params = [];
        const conditions = [];

        if (category) {
            conditions.push('LOWER(category) = LOWER(?)');
            params.push(category);
        }
        if (author) {
            conditions.push('LOWER(author) = LOWER(?)');
            params.push(author);
        }
        if (date) {
            conditions.push('date = ?');
            params.push(date);
        }
        if (tag) {
            conditions.push('tags LIKE ?');
            params.push(`%${tag}%`);
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        db.get(sql, params, (err, row) => {
            callback(err, row ? row.total : 0);
        });
    }

    static findById(id, callback) {
        const sql = 'SELECT * FROM articles WHERE id = ?';
        db.get(sql, [id], (err, article) => {
            if (!err && article) {
                // Incrémenter les vues
                db.run('UPDATE articles SET views = views + 1 WHERE id = ?', [id]);
            }
            callback(err, article);
        });
    }

    static update(id, updates, callback) {
        const fields = [];
        const values = [];

        for (const [key, val] of Object.entries(updates)) {
            if (['title', 'content', 'author', 'category', 'tags', 'status'].includes(key) && val !== undefined) {
                fields.push(`${key} = ?`);
                values.push(val);
            }
        }

        if (updates.content) {
            fields.push('read_time = ?');
            values.push(this.calculateReadTime(updates.content));
        }

        if (fields.length === 0) {
            return callback(new Error('Aucun champ valide à mettre à jour'));
        }

        values.push(id);
        const sql = `UPDATE articles SET ${fields.join(', ')} WHERE id = ?`;
        db.run(sql, values, function(err) {
            callback(err, this ? this.changes : 0);
        });
    }

    static delete(id, callback) {
        const sql = 'DELETE FROM articles WHERE id = ?';
        db.run(sql, [id], function(err) {
            callback(err, this ? this.changes : 0);
        });
    }

    static search(query, callback) {
        const sql = `
            SELECT * FROM articles
            WHERE title LIKE ? OR content LIKE ? OR tags LIKE ? OR category LIKE ?
            ORDER BY date DESC
        `;
        const pattern = `%${query}%`;
        db.all(sql, [pattern, pattern, pattern, pattern], callback);
    }

    static getStats(callback) {
        const queries = {
            totalArticles: 'SELECT COUNT(*) as count FROM articles',
            categoriesCount: 'SELECT category, COUNT(*) as count FROM articles GROUP BY category ORDER BY count DESC',
            authorsCount: 'SELECT author, COUNT(*) as count FROM articles GROUP BY author ORDER BY count DESC LIMIT 5',
            totalViews: 'SELECT COALESCE(SUM(views), 0) as totalViews FROM articles'
        };

        db.get(queries.totalArticles, (err1, r1) => {
            if (err1) return callback(err1);
            db.all(queries.categoriesCount, (err2, r2) => {
                if (err2) return callback(err2);
                db.all(queries.authorsCount, (err3, r3) => {
                    if (err3) return callback(err3);
                    db.get(queries.totalViews, (err4, r4) => {
                        if (err4) return callback(err4);
                        callback(null, {
                            totalArticles: r1.count,
                            totalViews: r4.totalViews,
                            categories: r2,
                            topAuthors: r3
                        });
                    });
                });
            });
        });
    }
}

module.exports = Article;
