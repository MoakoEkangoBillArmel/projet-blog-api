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
 *           description: ID auto-généré de l'article
 *         title:
 *           type: string
 *           description: Titre de l'article
 *         content:
 *           type: string
 *           description: Contenu de l'article
 *         author:
 *           type: string
 *           description: Nom de l'auteur
 *         date:
 *           type: string
 *           format: date
 *           description: Date de création (YYYY-MM-DD)
 *         category:
 *           type: string
 *           description: Catégorie de l'article
 *         tags:
 *           type: string
 *           description: Tags séparés par des virgules
 *     ArticleInput:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         title:
 *           type: string
 *           description: Titre de l'article
 *         content:
 *           type: string
 *           description: Contenu de l'article
 *         author:
 *           type: string
 *           description: Nom de l'auteur
 *         category:
 *           type: string
 *           description: Catégorie de l'article
 *         tags:
 *           type: string
 *           description: Tags séparés par des virgules
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Message d'erreur
 */

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Créer un nouvel article
 *     description: Crée un article avec les informations fournies. La date est générée automatiquement.
 *     tags:
 *       - Articles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleInput'
 *           example:
 *             title: "Mon premier article"
 *             content: "Ceci est le contenu de mon article..."
 *             author: "John Doe"
 *             category: "Technologie"
 *             tags: "JavaScript,Node.js,API"
 *     responses:
 *       201:
 *         description: Article créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 message:
 *                   type: string
 *             example:
 *               id: 1
 *               message: "Article créé avec succès"
 *       400:
 *         description: Requête invalide - Titre ou auteur manquant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Le titre et l'auteur sont obligatoires"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', articleController.createArticle);

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Récupérer tous les articles
 *     description: Retourne la liste complète des articles, avec possibilité de filtrage
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrer par catégorie (exact match)
 *         example: "Technologie"
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filtrer par auteur (exact match)
 *         example: "John Doe"
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrer par date (YYYY-MM-DD)
 *         example: "2026-03-22"
 *     responses:
 *       200:
 *         description: Liste des articles récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 *             example:
 *               - id: 1
 *                 title: "Mon premier article"
 *                 content: "Ceci est le contenu..."
 *                 author: "John Doe"
 *                 date: "2026-03-22"
 *                 category: "Technologie"
 *                 tags: "JavaScript,Node.js,API"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', articleController.getAllArticles);

/**
 * @swagger
 * /api/articles/search:
 *   get:
 *     summary: Rechercher des articles
 *     description: Recherche les articles dont le titre ou le contenu contient le texte spécifié
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Texte à rechercher dans le titre ou le contenu
 *         example: "JavaScript"
 *     responses:
 *       200:
 *         description: Résultats de recherche
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 *             example:
 *               - id: 1
 *                 title: "Mon premier article"
 *                 content: "Ceci est le contenu avec JavaScript..."
 *                 author: "John Doe"
 *                 date: "2026-03-22"
 *                 category: "Technologie"
 *                 tags: "JavaScript,Node.js,API"
 *       400:
 *         description: Paramètre de recherche manquant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Paramètre de recherche manquant"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/search', articleController.searchArticles);

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Récupérer un article par son ID
 *     description: Retourne les détails d'un article spécifique
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'article à récupérer
 *         example: 1
 *     responses:
 *       200:
 *         description: Article trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *             example:
 *               id: 1
 *               title: "Mon premier article"
 *               content: "Ceci est le contenu de mon article..."
 *               author: "John Doe"
 *               date: "2026-03-22"
 *               category: "Technologie"
 *               tags: "JavaScript,Node.js,API"
 *       404:
 *         description: Article non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Article non trouvé"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', articleController.getArticleById);

/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     summary: Modifier un article
 *     description: Met à jour les informations d'un article existant
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'article à modifier
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Nouveau titre
 *               content:
 *                 type: string
 *                 description: Nouveau contenu
 *               author:
 *                 type: string
 *                 description: Nouvel auteur
 *               category:
 *                 type: string
 *                 description: Nouvelle catégorie
 *               tags:
 *                 type: string
 *                 description: Nouveaux tags
 *           example:
 *             title: "Titre modifié"
 *             content: "Contenu mis à jour"
 *             category: "Développement Web"
 *     responses:
 *       200:
 *         description: Article mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Article mis à jour"
 *       400:
 *         description: Requête invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Article non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Article non trouvé ou aucune modification"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', articleController.updateArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: Supprimer un article
 *     description: Supprime un article existant de la base de données
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'article à supprimer
 *         example: 1
 *     responses:
 *       200:
 *         description: Article supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Article supprimé"
 *       404:
 *         description: Article non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Article non trouvé"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', articleController.deleteArticle);

module.exports = router;
