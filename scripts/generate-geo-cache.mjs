/**
 * Script à lancer en local quand un nouveau pays apparaît dans le xlsx.
 *   node scripts/generate-geo-cache.mjs
 *   node scripts/generate-geo-cache.mjs Canada Sénégal   ← forcer des pays spécifiques
 *
 * Lit geo-cache.json, géocode les pays manquants, sauvegarde.
 * Committer geo-cache.json ensuite → Vercel l'utilise en prod.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_PATH = path.join(__dirname, '..', 'geo-cache.json');
const PAYS_ARGS = process.argv.slice(2);

async function geocode(name) {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fields=latlng,area`);
    if (res.ok) {
      const data = await res.json();
      if (data?.[0]?.latlng) {
        const [lat, lng] = data[0].latlng;
        const area = data[0].area || 100_000;
        const jitter = Math.min(Math.max(Math.sqrt(area) / 600, 0.3), 6.0);
        console.log(`  ✅ ${name} → lat=${lat.toFixed(2)}, lng=${lng.toFixed(2)}, jitter=${jitter.toFixed(2)}`);
        return { lat, lng, jitter };
      }
    }
  } catch (_) {}

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(name)}&format=json&limit=1&featuretype=country`,
      { headers: { 'User-Agent': 'diaspora-beninoise/1.0' } }
    );
    if (res.ok) {
      const data = await res.json();
      if (data?.[0]) {
        const lat = parseFloat(data[0].lat), lng = parseFloat(data[0].lon);
        console.log(`  ✅ ${name} (Nominatim) → lat=${lat.toFixed(2)}, lng=${lng.toFixed(2)}`);
        return { lat, lng, jitter: 0.5 };
      }
    }
  } catch (_) {}

  console.error(`  ❌ Impossible de géocoder "${name}"`);
  return null;
}

async function main() {
  let cache = {};
  if (fs.existsSync(CACHE_PATH)) {
    cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
    console.log(`Cache existant : ${Object.keys(cache).length} pays → ${Object.keys(cache).join(', ')}\n`);
  }

  const toProcess = PAYS_ARGS.length > 0
    ? PAYS_ARGS
    : Object.keys(cache).filter(p => !cache[p]);  // re-tenter les échecs

  if (toProcess.length === 0 && PAYS_ARGS.length === 0) {
    console.log('✅ Tous les pays sont déjà en cache. Rien à faire.');
    console.log('   Pour forcer un pays : node scripts/generate-geo-cache.mjs "Nom du pays"');
    return;
  }

  for (const pays of toProcess) {
    if (cache[pays] && PAYS_ARGS.length === 0) { console.log(`  ⏭  ${pays}`); continue; }
    console.log(`Géocodage : ${pays}`);
    const coords = await geocode(pays);
    if (coords) cache[pays] = coords;
    await new Promise(r => setTimeout(r, 300)); // respecter les rate limits
  }

  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
  console.log(`\n✅ geo-cache.json mis à jour (${Object.keys(cache).length} pays)`);
  console.log('👉 git add geo-cache.json && git commit -m "update geo cache"');
}

main();
