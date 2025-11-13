Mode d’emploi (mis à jour)

1) Où mettre les fichiers (toujours à la racine du dépôt)
- CV: public/cv.pdf
- Recherche: public/recherche/ + public/recherche/index.json
- Projets: public/projets/ + public/projets/index.json
- Contenu Home (Markdown): public/contenu/about.md, public/contenu/reflexion.md, public/contenu/mes-lectures.md

2) Schéma JSON
- Recherche (catégories + date):
  {
    "title": "...",
    "description": "...",
    "path": "/recherche/mon-fichier.pdf",  // pas de préfixe public/
    "category": "etudiants" | "working_papers" | "publies" | "autres",
    "date": "YYYY-MM-DD"
  }
- Projets:
  {
    "title": "...",
    "description": "...",
    "path": "/projets/mon-fichier.pdf",
    "date": "YYYY-MM-DD"
  }

3) Étapes pour ajouter un élément
- Uploader le PDF dans le bon dossier (public/recherche ou public/projets)
- Ajouter une entrée dans l’index.json correspondant (respecter le schéma)
- git add . && git commit -m "maj contenu" && git push origin main
- Attendre 1–2 minutes puis rafraîchir le site (Ctrl/Cmd + F5)

4) Nettoyage recommandé
- Supprimer les anciens dossiers frontend/public/recherche et frontend/public/projets du dépôt (ils ne sont pas utilisés par GitHub Pages)

5) Dépannage
- Si un lien "Ouvrir" ne marche pas: assurez-vous que "path" commence par "/recherche/" ou "/projets/" (sans "public/")
- Erreur JSON: vérifiez les virgules et guillemets; pas de virgule finale
