const Article = require('../models/article');

exports.createArticle = (req, res) => {
    const { title, content, author, category, tags, status } = req.body;

    if (!title || !title.trim() || !author || !author.trim()) {
        return res.status(400).json({ error: "Le titre et l'auteur sont obligatoires." });
    }

    const tagsStr = tags ? (Array.isArray(tags) ? tags.map(t => t.trim()).join(',') : tags.trim()) : '';

    Article.create({
        title: title.trim(),
        content: (content || '').trim(),
        author: author.trim(),
        category: (category || 'Général').trim(),
        tags: tagsStr,
        status: status || 'published'
    }, (err, id) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id, message: "Article créé avec succès", articleId: id });
    });
};

exports.getAllArticles = (req, res) => {
    const { category, author, date, tag, sortBy, order, page, limit } = req.query;

    Article.findAll({ category, author, date, tag, sortBy, order, page, limit }, (err, articles) => {
        if (err) return res.status(500).json({ error: err.message });

        if (page && limit) {
            Article.countAll({ category, author, date, tag }, (countErr, total) => {
                if (countErr) return res.status(500).json({ error: countErr.message });
                return res.status(200).json({
                    data: articles,
                    pagination: {
                        page: parseInt(page, 10),
                        limit: parseInt(limit, 10),
                        total,
                        totalPages: Math.ceil(total / parseInt(limit, 10))
                    }
                });
            });
        } else {
            res.status(200).json(articles);
        }
    });
};

exports.getArticleById = (req, res) => {
    const { id } = req.params;
    Article.findById(id, (err, article) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!article) return res.status(404).json({ error: "Article non trouvé" });
        res.status(200).json(article);
    });
};

exports.updateArticle = (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (updates.tags && Array.isArray(updates.tags)) {
        updates.tags = updates.tags.join(',');
    }

    Article.update(id, updates, (err, changes) => {
        if (err) return res.status(500).json({ error: err.message });
        if (changes === 0) return res.status(404).json({ error: "Article non trouvé ou aucune modification enregistrée" });
        res.status(200).json({ message: "Article mis à jour avec succès" });
    });
};

exports.deleteArticle = (req, res) => {
    const { id } = req.params;
    Article.delete(id, (err, changes) => {
        if (err) return res.status(500).json({ error: err.message });
        if (changes === 0) return res.status(404).json({ error: "Article non trouvé" });
        res.status(200).json({ message: "Article supprimé avec succès" });
    });
};

exports.searchArticles = (req, res) => {
    const { query } = req.query;
    if (!query || !query.trim()) {
        return res.status(400).json({ error: "Paramètre de recherche 'query' manquant ou vide" });
    }

    Article.search(query.trim(), (err, articles) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(articles);
    });
};

exports.getStats = (req, res) => {
    Article.getStats((err, stats) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(stats);
    });
};
