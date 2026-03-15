import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import fs from 'fs';

// geo-cache.json — coordonnées des pays
const GEO_CACHE = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'geo-cache.json'), 'utf8')
);

// Cache mémoire 5 minutes
const CACHE_TTL_MS = 5 * 60 * 1000;
let _cache = { data: null, timestamp: 0 };

function seededRandom(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function jitter(val, amount, seed) {
  return val + (seededRandom(seed) * 2 - 1) * amount;
}

export async function GET() {
  // Retourner depuis le cache si encore valide
  const now = Date.now();
  if (_cache.data && (now - _cache.timestamp) < CACHE_TTL_MS) {
    return NextResponse.json(_cache.data, { headers: { 'Cache-Control': 'no-store' } });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Sélectionner uniquement les champs anonymes (pas nom/prenom/email/linkedin)
    const { data: rows, error } = await supabase
      .from('talents')
      .select('id, pays, age, niveau, ecoles, domaines, statut, poste, entreprise');

    if (error) throw error;

    const talents = rows
      .filter(r => r.pays)
      .map(r => {
        const pays = r.pays.trim();
        const base = GEO_CACHE[pays] || { lat: 0, lng: 0, jitter: 0 };

        if (!GEO_CACHE[pays]) {
          console.warn(`[talents] Pays inconnu: "${pays}" — lance: node scripts/generate-geo-cache.mjs "${pays}"`);
        }

        const clean = v => {
          const s = String(v || '').trim();
          return s === 'undefined' || s === 'null' ? '' : s;
        };

        return {
          pays,
          // Jitter basé sur l'id stable — les coords ne bougent pas si on ajoute/supprime des talents
          lat: jitter(base.lat, base.jitter, r.id * 7),
          lng: jitter(base.lng, base.jitter, r.id * 7 + 1),
          age:        clean(r.age),
          niveau:     clean(r.niveau),
          ecoles:     clean(r.ecoles),
          domaines:   clean(r.domaines),
          statut:     clean(r.statut),
          poste:      clean(r.poste),
          entreprise: clean(r.entreprise),
        };
      });

    _cache = { data: talents, timestamp: now };

    return NextResponse.json(talents, { headers: { 'Cache-Control': 'no-store' } });

  } catch (err) {
    console.error('[/api/talents]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  // Vider le cache manuellement
  const token = request.headers.get('x-revalidate-token');
  const expected = process.env.REVALIDATE_TOKEN;
  if (expected && token !== expected) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  _cache = { data: null, timestamp: 0 };
  return NextResponse.json({ message: 'Cache vidé' });
}
