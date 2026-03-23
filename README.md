README – Blog API

https://img.shields.io/badge/Node.js-20.x-green
https://img.shields.io/badge/Express-4.18-blue
https://img.shields.io/badge/SQLite-3.x-lightgrey
https://img.shields.io/badge/Swagger-UI-brightgreen
https://img.shields.io/badge/License-MIT-yellow

    API REST complète pour la gestion d’articles de blog, accompagnée d’un frontend moderne. Développée avec Node.js, Express, SQLite, Swagger, et Chart.js.

📝 Table des matières

    À propos

    Fonctionnalités

    Technologies utilisées

    Prérequis

    Installation

        Windows

        Ubuntu / Linux

    Lancement du projet

    Documentation de l’API

    Endpoints

    Frontend

    Structure du projet

    Déploiement

    Contribution

    Licence

    Auteur

🧾 À propos

Ce projet a été réalisé dans le cadre de l’UE INF222 – Programmation Web à l’Université de Yaoundé I. L’objectif est de mettre en pratique les concepts de développement backend en construisant une API REST pour un blog, et de l’interfacer avec un frontend interactif. Le développement s’est appuyé sur les parcours proposés par la plateforme CleeRoute.
✨ Fonctionnalités

Backend

    CRUD complet sur les articles

    Validation des entrées (titre et auteur obligatoires)

    Filtrage (catégorie, auteur, date)

    Recherche par mot‑clé (titre / contenu)

    Codes HTTP appropriés (200, 201, 400, 404, 500)

    Documentation interactive Swagger

Frontend

    Interface moderne et responsive

    Création, édition et suppression d’articles

    Recherche avancée (texte, catégorie, auteur, date)

    Pagination (6 articles par page)

    Notifications toast (succès / erreur)

    Graphique des articles par catégorie (Chart.js)

🛠 Technologies utilisées

    Node.js – environnement d’exécution JavaScript

    Express – framework web pour Node.js

    SQLite – base de données légère

    Swagger (swagger-jsdoc, swagger-ui-express) – documentation API

    HTML5 / CSS3 – structure et style du frontend

    JavaScript (Vanilla) – interactions dynamiques

    Chart.js – visualisation de données

📋 Prérequis

Avant de commencer, assurez‑vous d’avoir installé sur votre machine :

    Node.js (version 14 ou supérieure) – Télécharger

    npm (livré avec Node.js)

    Git (optionnel, pour cloner le dépôt)

🚀 Installation
Windows

    Ouvrez PowerShell (ou l’invite de commandes) et exécutez :
    bash

git clone https://github.com/charo2000/projet-blog-api.git
cd projet-blog-api

Installez les dépendances :
bash

npm install

Ubuntu / Linux

    Ouvrez un terminal et exécutez :
    bash

git clone https://github.com/charo2000/projet-blog-api.git
cd projet-blog-api

Installez les dépendances :
bash

npm install

    Note : Le projet utilise SQLite ; aucune installation supplémentaire n’est requise car le driver sqlite3 est inclus dans les dépendances.

▶️ Lancement du projet

Démarrez le serveur en mode développement (avec rechargement automatique) :
bash

npm run dev

Ou en mode production :
bash

npm start

Le serveur est accessible à l’adresse : http://localhost:3000
📖 Documentation de l’API

Une fois le serveur lancé, la documentation interactive Swagger est disponible à :
👉 http://localhost:3000/api-docs

Vous y trouverez tous les endpoints, paramètres, exemples et codes de réponse.
🔗 Endpoints
Méthode	URL	Description
POST	/api/articles	Créer un article
GET	/api/articles	Récupérer tous les articles (avec filtres : category, author, date)
GET	/api/articles/search?query=texte	Recherche par titre / contenu
GET	/api/articles/:id	Récupérer un article par son ID
PUT	/api/articles/:id	Modifier un article
DELETE	/api/articles/:id	Supprimer un article

Exemple de création (avec curl) :
bash

curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mon premier article",
    "content": "Contenu de l’article",
    "author": "John Doe",
    "category": "Technologie",
    "tags": "Node.js,Express"
  }'

🎨 Frontend

Le frontend est servi directement par Express à l’URL racine :
👉 http://localhost:3000

Il offre une interface complète pour interagir avec l’API :

    Créer : formulaire avec validation.

    Lire : affichage sous forme de cartes, pagination, filtres.

    Modifier : cliquer sur ✏️ ouvre une modal.

    Supprimer : confirmation avant suppression.

    Recherche avancée : par texte, catégorie, auteur, date.

    Graphique : nombre d’articles par catégorie.

📁 Structure du projet
text

projet-blog-api/
├── backend/
│   ├── models/               # Modèle Article (SQLite)
│   ├── controllers/          # Logique métier
│   ├── routes/               # Définition des routes + annotations Swagger
│   ├── db/                   # Connexion à la base de données
│   └── app.js                # Point d’entrée du serveur
├── frontend/
│   ├── index.html            # Page principale
│   ├── style.css             # Styles modernes
│   └── script.js             # Interactions AJAX et dynamiques
├── package.json              # Dépendances et scripts
├── .gitignore                # Fichiers ignorés par Git
└── README.md                 # Ce fichier

🌐 Déploiement (optionnel)

Vous pouvez déployer l’application sur des plateformes comme Railway ou Render.
Exemple avec Railway

    Installez l’outil CLI : npm install -g @railway/cli

    Connectez-vous : railway login

    Depuis le dossier du projet : railway up

    Suivez les instructions. L’API sera disponible à une URL publique.

N’oubliez pas d’ajuster API_URL dans frontend/script.js si nécessaire.
🤝 Contribution

Les contributions sont les bienvenues !

    Forkez le projet.

    Créez votre branche (git checkout -b feature/AmazingFeature).

    Commitez vos changements (git commit -m 'Add some AmazingFeature').

    Poussez vers la branche (git push origin feature/AmazingFeature).

    Ouvrez une Pull Request.

📄 Licence

Ce projet est sous licence MIT. Consultez le fichier LICENSE pour plus de détails.

👨‍💻 Auteur

MOAKO EKANGO BILL
Étudiant en Informatique, Université de Yaoundé I
GitHub : charo2000
Projet : projet-blog-api
