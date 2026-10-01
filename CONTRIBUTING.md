# Guide de Contribution

Merci pour votre intérêt pour **BlogHub API** !

## 🤝 Comment contribuer

1. **Forkez** le projet sur votre propre compte GitHub.
2. Créez votre branche thématique :
   ```bash
   git checkout -b feature/ma-nouvelle-fonctionnalite
   ```
3. Effectuez vos modifications avec des commits conventionnels clairs :
   ```bash
   git commit -m "feat: ajout du support d'export markdown"
   ```
4. Poussez votre branche :
   ```bash
   git push origin feature/ma-nouvelle-fonctionnalite
   ```
5. Ouvrez une **Pull Request** détaillée expliquant les changements apportés.

## 📋 Règles de codage
- Respecter l'encodage strict UTF-8 sans BOM.
- Documenter les nouvelles routes dans Swagger OpenAPI (`backend/routes/articleRoutes.js`).
- Utiliser des requêtes SQL paramétrées (`?`) pour éviter toute injection SQL.

---
Maintenu par [MOAKO EKANGO BILL ARMEL](https://github.com/MoakoEkangoBillArmel).
