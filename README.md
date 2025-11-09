# kodowou.github.io — Nouveau site

Ce dépôt contient le code source du site personnel (React + Vite + Tailwind) et le workflow GitHub Pages.

## Déploiement (vous n’avez qu’à pousser)
1. Assurez-vous que ce dossier contient:
   - dossier `frontend/` (code React)
   - `.github/workflows/deploy.yml` (déploiement automatique)
2. Remplacez `frontend/public/cv.pdf` par votre CV si besoin.
3. Poussez sur `main`.
4. GitHub Actions va:
   - installer les dépendances
   - construire le site (`frontend/dist`)
   - copier `index.html` en `404.html` (fallback SPA)
   - déployer sur GitHub Pages
5. Accédez ensuite à: https://kodowou.github.io/

Aucune configuration serveur n’est requise.
