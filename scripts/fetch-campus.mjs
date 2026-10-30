#!/usr/bin/env node
/**
 * Descarga la geometría REAL de un campus o recinto de un cliente desde
 * OpenStreetMap y la hornea a un archivo compacto para el «espacio cliente».
 *
 *   npm run client:campus                      → ESPOL (Campus Gustavo Galindo)
 *   npm run client:campus -- --client=espol
 *
 * Salida: public/clients/<cliente>/campus.json
 *   { center, size, buildings[{ p, h, name }], roads[{ p, w }], green[], water[] }
 * Coordenadas en metros locales (x este, z sur) respecto al centro.
 *
 * Datos © colaboradores de OpenStreetMap, licencia ODbL.
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const CLIENTS = {
  espol: {
    label: 'ESPOL · Campus Gustavo Galindo (Guayaquil)',
    center: [-2.1466, -79.9654],
    halfLat: 0.006,
    halfLon: 0.0085,
  },
};

const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, '').split('=')));
const name = args.client ?? 'espol';
const c = CLIENTS[name];
if (!c) throw new Error(`Cliente desconocido: ${name}`);

const [lat0, lon0] = c.center;
const bbox = [lat0 - c.halfLat, lon0 - c.halfLon, lat0 + c.halfLat, lon0 + c.halfLon].join(',');
const mLat = 111320;
const mLon = 111320 * Math.cos((lat0 * Math.PI) / 180);
const project = (lat, lon) => [+((lon - lon0) * mLon).toFixed(1), +((lat0 - lat) * mLat).toFixed(1)];

const QUERY = `[out:json][timeout:120];
(
  way["building"](${bbox});
  relation["building"](${bbox});
  way["highway"](${bbox});
  way["landuse"~"^(grass|forest|meadow|recreation_ground)$"](${bbox});
  way["natural"~"^(wood|scrub|grassland|water)$"](${bbox});
  way["leisure"~"^(park|pitch|garden|stadium|track)$"](${bbox});
  way["amenity"="parking"](${bbox});
);
out geom;`;

const ENDPOINTS = ['https://overpass-api.de/api/interpreter', 'https://overpass.private.coffee/api/interpreter'];

async function overpass() {
  for (const url of ENDPOINTS) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'MTI-Solutions-Explorer/1.0 (campus baker)' },
        body: `data=${encodeURIComponent(QUERY)}`,
        signal: AbortSignal.timeout(150000),
      });
      const text = await res.text();
      if (!text.startsWith('{')) throw new Error(`HTTP ${res.status}`);
      return JSON.parse(text);
    } catch (e) {
      console.log(`  ${new URL(url).host}: ${e.message}`);
    }
  }
  throw new Error('Overpass no responde');
}

const ring = (geom) => geom.map((g) => project(g.lat, g.lon));
const ROAD_W = { primary: 12, secondary: 10, tertiary: 8, residential: 6, service: 5, unclassified: 6, footway: 2.5, path: 2, pedestrian: 4, cycleway: 2.5, steps: 2 };

function height(tags) {
  if (tags.height) return Math.min(60, parseFloat(tags.height) || 8);
  if (tags['building:levels']) return Math.min(60, (parseFloat(tags['building:levels']) || 2) * 3.4);
  return 7 + ((tags.name?.length ?? 3) % 4) * 1.6; // sin datos: 2-3 plantas
}

const data = await overpass();
const out = { client: name, label: c.label, center: c.center, size: [c.halfLon * 2 * mLon, c.halfLat * 2 * mLat].map(Math.round), buildings: [], roads: [], green: [], water: [] };

for (const e of data.elements) {
  const t = e.tags ?? {};
  const geoms = e.type === 'relation' ? (e.members ?? []).filter((m) => m.role === 'outer' && m.geometry).map((m) => m.geometry) : e.geometry ? [e.geometry] : [];
  for (const g of geoms) {
    const p = ring(g);
    if (p.length < 2) continue;
    if (t.building) out.buildings.push({ p, h: +height(t).toFixed(1), name: t.name ?? null });
    else if (t.highway) out.roads.push({ p, w: ROAD_W[t.highway] ?? 3, k: t.highway });
    else if (t.natural === 'water') out.water.push({ p });
    else out.green.push({ p, k: t.landuse ?? t.natural ?? t.leisure ?? t.amenity });
  }
}

const dir = path.join(process.cwd(), 'public', 'clients', name);
await fs.mkdir(dir, { recursive: true });
const file = path.join(dir, 'campus.json');
await fs.writeFile(file, JSON.stringify(out));
const named = out.buildings.filter((b) => b.name).length;
console.log(`${c.label}: ${out.buildings.length} edificios (${named} con nombre), ${out.roads.length} vías, ${out.green.length} zonas verdes, ${out.water.length} agua`);
console.log(`→ ${path.relative(process.cwd(), file)} (${((await fs.stat(file)).size / 1024).toFixed(0)} KB)`);
