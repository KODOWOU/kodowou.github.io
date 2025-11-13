Mode d’emploi pour gérer le site (sans serveur)

1) Où mettre les fichiers
- CV: public/cv.pdf
- Recherche: public/recherche/ + public/recherche/index.json
- Projets: public/projets/ + public/projets/index.json

2) Format de index.json
- Tableau d’objets: title, description, path (path commence par /recherche/… ou /projets/…)
Exemple:
[
  { "title": "Mon article", "description": "Brève description", "path": "/recherche/mon-article.pdf" },
  { "title": "Autre", "description": "…", "path": "/recherche/autre.pdf" }
]

3) Étapes
- Ajouter le PDF au bon dossier
- Mettre à jour l’index.json correspondant
- git add . && git commit -m "maj contenu" && git push origin main
- Attendre 1–2 minutes puis rafraîchir le site

Note: Les anciens dossiers sous frontend/ ne sont pas utilisés pour le déploiement. Utiliser uniquement les dossiers à la racine (public/, src/, …).
