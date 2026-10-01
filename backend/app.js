const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const articleRoutes = require('./routes/articleRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Fichiers statiques du frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        service: 'blog-api',
        version: '1.2.0'
    });
});

// Configuration Swagger OpenAPI 3.0
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Blog API - Plateforme de Gestion d'Articles',
            version: '1.2.0',
            description: 'API RESTful haute performance pour la gestion, recherche et analyse d\'articles de blog.',
            contact: {
                name: 'MOAKO EKANGO BILL ARMEL',
                url: 'https://github.com/MoakoEkangoBillArmel',
                email: 'armel.moako@facsciences-uy1.cm'
            }
        },
        servers: [
            { url: `http://localhost:${port}`, description: 'Serveur local de développement' }
        ],
    },
    apis: [path.join(__dirname, 'routes', '*.js')],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Documentation API Blog'
}));

// Routes API
app.use('/api/articles', articleRoutes);

// Route par défaut / fallback vers le frontend
app.get('*', (req, res) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/api-docs')) {
        return res.status(404).json({ error: 'Route API introuvable' });
    }
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`===============================================`);
    console.log(`🚀 Blog API démarré sur : http://localhost:${port}`);
    console.log(`📚 Documentation Swagger : http://localhost:${port}/api-docs`);
    console.log(`🩺 Health check         : http://localhost:${port}/health`);
    console.log(`===============================================`);
});

module.exports = app;
