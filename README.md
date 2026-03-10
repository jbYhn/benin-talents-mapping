# 🇧🇯 Diaspora Béninoise — Carte des Talents

Carte interactive des talents de la diaspora béninoise dans le monde.

## 🚀 Déploiement sur Vercel (3 étapes)

### Étape 1 — Installer et tester en local
```bash
npm install
npm run dev
# Ouvre http://localhost:3000
```

### Étape 2 — Pousser sur GitHub
```bash
git init
git add .
git commit -m "Initial commit — Diaspora Béninoise Map"
git branch -M main
git remote add origin https://github.com/TON_USERNAME/diaspora-teli.git
git push -u origin main
```
> Crée d'abord le repo sur https://github.com/new (sans README)

### Étape 3 — Déployer sur Vercel
1. Va sur https://vercel.com/new
2. Clique **"Import Git Repository"**
3. Sélectionne ton repo `diaspora-teli`
4. Clique **Deploy** — Vercel détecte Next.js automatiquement ✅

**Ton site sera en ligne sur** `https://diaspora-teli.vercel.app` 🎉

## 🛠 Stack technique
- **Next.js 14** — framework React
- **D3.js v7** — projection cartographique
- **TopoJSON** — données géographiques (Natural Earth 110m)
- **Vercel** — hébergement gratuit

## 📂 Structure
```
app/
  page.js          → point d'entrée
  layout.js        → HTML shell
  DiasporaMap.jsx  → composant carte principal
```
