const Article = require('../models/article');

exports.createArticle = (req, res) => {
    const { title, content, author, category, tags } = req.body;
    // Validation
    if (!title || !author) {
        return res.status(400).json({ error: 'Le titre et l\'auteur sont obligatoires' });
    }
    const date = new Date().toISOString().split('T')[0];
    const tagsStr = tags ? (Array.isArray(tags) ? tags.join(',') : tags) : '';
    Article.create({ title, content, author, date, category, tags: tagsStr }, (err, id) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id, message: 'Article créé avec succès' });
    });
};

exports.getAllArticles = (req, res) => {
    const { category, author, date } = req.query;
    Article.findAll({ category, author, date }, (err, articles) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(articles);
    });
};

exports.getArticleById = (req, res) => {
    const { id } = req.params;
    Article.findById(id, (err, article) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!article) return res.status(404).json({ error: 'Article non trouvé' });
        res.status(200).json(article);
    });
};

exports.updateArticle = (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    Article.update(id, updates, (err, changes) => {
        if (err) return res.status(500).json({ error: err.message });
        if (changes === 0) return res.status(404).json({ error: 'Article non trouvé ou aucune modification' });
        res.status(200).json({ message: 'Article mis à jour' });
    });
};

exports.deleteArticle = (req, res) => {
    const { id } = req.params;
    Article.delete(id, (err, changes) => {
        if (err) return res.status(500).json({ error: err.message });
        if (changes === 0) return res.status(404).json({ error: 'Article non trouvé' });
        res.status(200).json({ message: 'Article supprimé' });
    });
};

exports.searchArticles = (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'Paramètre de recherche manquant' });
    Article.search(query, (err, articles) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(articles);
    });
};
