# ✍️ BlogHub API & Dashboard

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.18-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite3](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

**Plateforme complète et moderne de gestion d'articles avec API RESTful Node.js/Express, base de données SQLite embarquée, documentation Swagger interactive et interface utilisateur temps réel.**

[🚀 Fonctionnalités](#-fonctionnalités) • [📐 Architecture](#-architecture-du-projet) • [📚 Documentation API](#-documentation-api) • [⚡ Démarrage Rapide](#-démarrage-rapide) • [👨‍💻 Auteur](#-auteur--contributeurs)

</div>

---

## ✨ Fonctionnalités

### 🔌 Backend (API RESTful)
- **CRUD Complet** : Création, lecture, mise à jour partielle/complète et suppression d'articles.
- **Recherche Avancée & Filtrage** : Recherche multi-champs (titre, contenu, auteur, tags) et filtrage par catégorie/date.
- **Pagination & Tri** : Support de pagination avec calcul automatique des pages (`?page=1&limit=10`) et tri paramétrable.
- **Statistiques & Métriques** : Endpoint `/api/articles/stats/summary` fournissant la répartition par catégorie, le top des auteurs et les vues cumulées.
- **Calcul du temps de lecture** : Estimation automatique du temps de lecture lors de la création ou modification.
- **Compteur de vues** : Incrémentation automatique du compteur de vues lors de la consultation unitaire d'un article.
- **Documentation Swagger / OpenAPI 3.0** : Interface interactive intégrée sur `/api-docs`.
- **Health Check** : Endpoint de vérification de santé sur `/health`.

### 🎨 Frontend (Dashboard Moderne)
- **Interface Glassmorphism & Dark Mode** : Design responsive, sombre et épuré avec bascule clair/sombre.
- **Graphique Dynamique Chart.js** : Visualisation instantanée de la répartition des articles par catégorie.
- **Recherche Instantanée (Live Search)** : Recherche debouncée en temps réel.
- **Système de Toasts Flottants** : Notifications animées pour les actions de création, mise à jour et suppression.
- **Modal d'Édition Contextuelle** : Modification rapide des articles sans rechargement de page.

---

## 📐 Architecture du Projet

```text
projet-blog-api/
├── backend/
│   ├── app.js                      # Point d'entrée serveur Express & Swagger
│   ├── controllers/
│   │   └── articleController.js    # Logique métier, validation & contrôleurs
│   ├── db/
│   │   ├── database.js             # Connexion SQLite et initialisation du schéma
│   │   └── blog.db                 # Fichier SQLite (généré automatiquement)
│   ├── models/
│   │   └── article.js              # Modèle de données & requêtes paramétrées
│   └── routes/
│       └── articleRoutes.js        # Définition des endpoints & annotations Swagger
├── frontend/
│   ├── index.html                  # Interface utilisateur HTML5 sémantique
│   ├── script.js                   # Logique frontend, appels API asynchrones & Chart.js
│   └── style.css                   # Feuilles de styles modernes (variables CSS, flex/grid)
├── .gitignore                      # Fichiers et dossiers exclus du versionnement
├── CONTRIBUTING.md                 # Guide de contribution
├── LICENSE                         # Licence MIT
├── package.json                    # Dépendances & scripts du projet
└── README.md                       # Documentation officielle
```

---

## 📚 Documentation API

L'API expose les routes suivantes (également testables interactivement sur `http://localhost:3000/api-docs`) :

| Méthode | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Vérification de l'état de santé du service |
| `GET` | `/api/articles` | Liste de tous les articles (supporte `category`, `author`, `page`, `limit`) |
| `GET` | `/api/articles/:id` | Récupère un article par son ID (incrémente les vues) |
| `POST` | `/api/articles` | Crée un nouvel article (`title` et `author` obligatoires) |
| `PUT` | `/api/articles/:id` | Modifie un article existant |
| `DELETE` | `/api/articles/:id` | Supprime un article |
| `GET` | `/api/articles/search?query=...` | Recherche textuelle dans les titres, contenus et tags |
| `GET` | `/api/articles/stats/summary` | Résumé statistique global du blog |

### Exemple de requête (cURL) :

```bash
# Créer un article
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Maîtriser Node.js et Express",
    "content": "Node.js permet de construire des backends rapides et extensibles...",
    "author": "Bill Armel",
    "category": "Backend",
    "tags": "nodejs,express,javascript"
  }'
```

---

## ⚡ Démarrage Rapide

### Prérequis
- [Node.js](https://nodejs.org/) (version 18 ou supérieure recommandée)
- npm ou yarn

### Installation

1. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/MoakoEkangoBillArmel/projet-blog-api.git
   cd projet-blog-api
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

3. **Lancer le serveur en mode développement :**
   ```bash
   npm run dev
   ```
   *Ou en production :*
   ```bash
   npm start
   ```

4. **Accéder à l'application :**
   - **Tableau de bord :** [http://localhost:3000](http://localhost:3000)
   - **Documentation Swagger :** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
   - **Healthcheck :** [http://localhost:3000/health](http://localhost:3000/health)

---

## 👨‍💻 Auteur & Contributeurs

Ce projet est maintenu et développé par :

- **MOAKO EKANGO BILL ARMEL** ([@MoakoEkangoBillArmel](https://github.com/MoakoEkangoBillArmel))
  - *Étudiant & Développeur en Informatique & Cybersécurité*
  - Contact : `armel.moako@facsciences-uy1.cm`

Les contributions, signalements de bugs et suggestions d'améliorations sont les bienvenus via les [Issues GitHub](https://github.com/MoakoEkangoBillArmel/projet-blog-api/issues).

---

## 📄 Licence

Ce projet est sous licence libre **MIT**. Consultez le fichier [LICENSE](./LICENSE) pour plus de détails.
