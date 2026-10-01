const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         id:
 *           type: integer
 *           description: Identifiant unique auto-généré
 *         title:
 *           type: string
 *           description: Titre de l'article
 *         content:
 *           type: string
 *           description: Contenu détaillé de l'article
 *         author:
 *           type: string
 *           description: Nom ou pseudo de l'auteur
 *         date:
 *           type: string
 *           format: date
 *           description: Date de publication (YYYY-MM-DD)
 *         category:
 *           type: string
 *           description: Catégorie thématique
 *         tags:
 *           type: string
 *           description: Mots-clés séparés par des virgules
 *         read_time:
 *           type: integer
 *           description: Temps de lecture estimé en minutes
 *         views:
 *           type: integer
 *           description: Nombre de vues de l'article
 *         status:
 *           type: string
 *           enum: [draft, published]
 *           description: Statut de publication
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 */

/**
 * @swagger
 * /api/articles/stats/summary:
 *   get:
 *     summary: Récupérer les statistiques globales du blog
 *     tags:
 *       - Statistiques
 *     responses:
 *       200:
 *         description: Statistiques complètes
 */
router.get('/stats/summary', articleController.getStats);

/**
 * @swagger
 * /api/articles/search:
 *   get:
 *     summary: Recherche multi-champs dans les articles
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des articles correspondants
 */
router.get('/search', articleController.searchArticles);

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Récupérer tous les articles (avec filtres et pagination)
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des articles
 *   post:
 *     summary: Créer un nouvel article
 *     tags:
 *       - Articles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Article'
 *     responses:
 *       201:
 *         description: Article créé avec succès
 */
router.get('/', articleController.getAllArticles);
router.post('/', articleController.createArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Récupérer un article par ID
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de l'article
 *   put:
 *     summary: Mettre à jour un article
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Article mis à jour
 *   delete:
 *     summary: Supprimer un article
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Article supprimé
 */
router.get('/:id', articleController.getArticleById);
router.put('/:id', articleController.updateArticle);
router.delete('/:id', articleController.deleteArticle);

module.exports = router;
