import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

// geo-cache.json — coordonnées des pays (généré par scripts/generate-geo-cache.mjs)
const GEO_CACHE = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'geo-cache.json'), 'utf8')
);

// Cache mémoire — évite de refetch Drive à chaque requête
// Vercel réinitialise entre les cold starts, mais tient le temps d'une session
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
let _cache = { data: null, timestamp: 0 };

function seededRandom(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function jitter(val, amount, seed) {
  return val + (seededRandom(seed) * 2 - 1) * amount;
}

async function downloadFromDrive(fileId) {
  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });
  const drive = google.drive({ version: 'v3', auth });

  // ✅ Export en xlsx — obligatoire pour les fichiers Google Sheets
  const res = await drive.files.export(
    { fileId, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    { responseType: 'arraybuffer' }
  );

  return Buffer.from(res.data);
}

export async function GET() {
  const fileId = process.env.DRIVE_FILE_ID;
  if (!fileId) {
    return NextResponse.json({ error: 'DRIVE_FILE_ID manquant' }, { status: 500 });
  }

  // Retourner depuis le cache si encore valide
  const now = Date.now();
  if (_cache.data && (now - _cache.timestamp) < CACHE_TTL_MS) {
    console.log('[talents] Depuis le cache mémoire');
    return NextResponse.json(_cache.data, { headers: { 'Cache-Control': 'no-store' } });
  }

  try {
    const buffer = await downloadFromDrive(fileId);
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    const talents = rows
      .filter(r => String(r['Pays de résidence'] || '').trim())
      .map((r, i) => {
        const pays = String(r['Pays de résidence'] || '').trim();
        const base = GEO_CACHE[pays] || { lat: 0, lng: 0, jitter: 0 };

        if (!GEO_CACHE[pays]) {
          console.warn(`[talents] Pays inconnu: "${pays}" — lance: node scripts/generate-geo-cache.mjs "${pays}"`);
        }

        const rawLi = String(r['Profil Linkedin'] || '').trim();
        const linkedin = rawLi && rawLi !== '0'
          ? (rawLi.startsWith('http') ? rawLi : 'https://' + rawLi)
          : '';

        const clean = v => {
          const s = String(v || '').trim();
          return s === 'undefined' || s === 'nan' ? '' : s;
        };

        return {
          pays,
          lat:        jitter(base.lat, base.jitter, i * 7),
          lng:        jitter(base.lng, base.jitter, i * 7 + 1),
          age:        clean(r['Tranche âge']),
          niveau:     clean(r['Niveau études']),
          ecoles:     clean(r['École(s)']),
          domaines:   clean(r['Domaines expertise']),
          statut:     clean(r['Statut']),
          poste:      clean(r['Titre / Poste']),
          entreprise: clean(r['Entreprise']),
          linkedin,
        };
      });

    // Mettre en cache
    _cache = { data: talents, timestamp: now };

    return NextResponse.json(talents, {
      headers: { 'Cache-Control': 'no-store' },
    });

  } catch (err) {
    console.error('[/api/talents]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export async function POST(request) {
  // Protection par token secret — définis REVALIDATE_TOKEN dans les env vars Vercel
  const token = request.headers.get('x-revalidate-token');
  const expected = process.env.REVALIDATE_TOKEN;
  if (expected && token !== expected) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  _cache = { data: null, timestamp: 0 };
  return NextResponse.json({ message: 'Cache vidé — prochaine requête rechargera depuis Drive' });
}
