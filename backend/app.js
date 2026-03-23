const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const articleRoutes = require('./routes/articleRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Servir les fichiers statiques du dossier frontend (situé à la racine du projet)
app.use(express.static(path.join(__dirname, '../frontend')));

// Configuration Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Blog API',
            version: '1.0.0',
            description: 'API pour gérer les articles de blog',
        },
        servers: [{ url: `http://localhost:${port}` }],
    },
    apis: [path.join(__dirname, 'routes', '*.js')], // lecture des annotations dans les fichiers routes
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes de l'API
app.use('/api/articles', articleRoutes);

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
    console.log(`Documentation Swagger : http://localhost:${port}/api-docs`);
});
