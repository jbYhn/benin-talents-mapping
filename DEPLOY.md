# Déploiement — Vercel (Next.js + Node)

## Structure du repo

```
benin-talents-mapping/
├── app/
│   ├── api/talents/route.js   ← API qui lit Google Drive
│   ├── DiasporaMap.jsx        ← carte interactive
│   ├── page.js
│   └── layout.js
├── scripts/
│   └── generate-geo-cache.mjs ← à lancer en local si nouveau pays
├── geo-cache.json             ← coordonnées des pays (committé dans le repo)
├── next.config.js
├── package.json
└── .env.example
```

---

## Variables d'environnement Vercel

| Variable | Valeur |
|---|---|
| `DRIVE_FILE_ID` | ID du fichier Google Drive |
| `GOOGLE_CREDENTIALS` | Contenu JSON du credentials.json |

---

## Déploiement initial

```bash
# 1. Installer les dépendances
npm install

# 2. Créer .env.local à partir de l'exemple
cp .env.example .env.local
# Remplir DRIVE_FILE_ID et GOOGLE_CREDENTIALS

# 3. Tester en local
npm run dev
# → http://localhost:3000

# 4. Push sur GitHub
git add .
git commit -m "initial commit"
git push origin master

# 5. Sur vercel.com
# New Project → Import Git Repository → benin-talents-mapping
# Environment Variables → ajouter DRIVE_FILE_ID et GOOGLE_CREDENTIALS
# Deploy
```

---

## Workflow quotidien

```
Modifier talents.xlsx sur Google Drive → la carte se met à jour ✅
```

---

## Ajouter un nouveau pays

Quand un nouveau pays apparaît dans le xlsx (ex: Canada) :

```bash
node scripts/generate-geo-cache.mjs Canada
git add geo-cache.json
git commit -m "add Canada to geo-cache"
git push
```

Vercel redéploie automatiquement → le nouveau pays apparaît sur la carte.

