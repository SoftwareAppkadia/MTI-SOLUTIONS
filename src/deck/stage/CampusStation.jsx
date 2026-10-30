import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneClock, damp, makePulseMaterial, pulseLineGeometry, GOLD } from './fx.jsx';
import { CAMPUS_LIVE, co2, co2Status, intensity } from './campusLive.js';

/**
 * Espacio cliente · el campus o recinto del cliente en 3D.
 *
 * Geometría real de OpenStreetMap (`npm run client:campus`) dibujada por
 * nosotros: no hay proveedor de mapas detrás, así que el estilo (`look`) se
 * elige libremente al empezar la reunión:
 *
 *   holo       holográfico MTi: vidrio oscuro y aristas de luz (por defecto)
 *   satellite  realista: imagen aérea de Esri World Imagery bajo los
 *              edificios (se pide en directo, con atribución; no se guarda)
 *   model      maqueta: blanco arquitectónico sobre base clara
 *   map        mapa: colores de cartografía (calles, parques, agua)
 *
 * Encima, una capa distinta según la solución que se cuenta (`mode`):
 *
 *   intro · overview   el campus aparece y gira despacio
 *   security   cámaras con su cono de visión y barrido
 *   energy     columnas de consumo sobre cada edificio
 *   sensors    sensores en aulas: cada edificio se tiñe por su CO₂
 *   efficiency mapa de calor energético que pasa de «antes» a «con MTi»
 *   forest     sensores ambientales en las zonas verdes, con ondas LoRa
 *   command    todos los edificios conectados al centro de datos (pulsos)
 *   agentify   agentes que viajan entre los edificios de servicios
 *   lab        facultades y laboratorios emitiendo datos hacia arriba
 *   dim        en calma, de fondo
 */

export const CAMPUS_CENTER = new THREE.Vector3(-90, 0, 140);
export const CAMPUS_LOOKS = ['holo', 'satellite', 'model', 'map'];
const SCALE = 0.05; // 1 unidad = 20 m
const CLIP = 640; // m: fuera de este radio no se pinta (vecinos del campus)
const HK = SCALE * 1.15; // altura exagerada un poco: se lee mejor en perspectiva

const SKY = new THREE.Color('#24aeff');
const BLUE = new THREE.Color('#0073b6');
const GREEN = new THREE.Color('#34d399');
const OK = new THREE.Color('#22c55e');
const WARN = new THREE.Color('#f59e0b');
const ALERT = new THREE.Color('#ef4444');

/** Paleta de cada estilo. Opacidades a 0 = esa capa no se dibuja. */
const LOOK = {
  holo: { body: '#0b1a33', emissive: 0.18, metal: 0.4, rough: 0.35, edge: '#24aeff', edgeO: 0.6, road: '#5b7fb4', roadO: 0.35, main: '#24aeff', mainO: 0.45, ribbons: false, green: '#0f5132', greenO: 0.4, water: '#0b3a66', waterO: 0.7, grid: 1, base: null, hemi: 0.9, sun: 1.1 },
  satellite: { body: '#e6e1d8', emissive: 0, metal: 0, rough: 0.9, edge: '#3d4656', edgeO: 0.3, roadO: 0, mainO: 0, ribbons: false, greenO: 0, waterO: 0, grid: 0, base: 'imagery', hemi: 1.0, sun: 1.6 },
  model: { body: '#ffffff', emissive: 0, metal: 0, rough: 0.85, edge: '#8792a3', edgeO: 0.45, road: '#d3dae4', roadO: 1, main: '#c0cad8', mainO: 1, ribbons: true, green: '#d3e8c9', greenO: 1, water: '#b7d8ef', waterO: 1, grid: 0, base: '#eef1f5', hemi: 1.35, sun: 1.7 },
  map: { body: '#e6dccd', emissive: 0, metal: 0, rough: 0.9, edge: '#b19f88', edgeO: 0.4, road: '#ffffff', roadO: 1, main: '#f8d47a', mainO: 1, ribbons: true, green: '#c5e4b3', greenO: 1, water: '#a4d0e4', waterO: 1, grid: 0, base: '#f4f0e8', hemi: 1.1, sun: 1.3 },
};

/** Edificios que protagonizan cada modo (por nombre de OSM, sin acentos). */
const FOCUS = {
  command: /tecnolog|gtsi/i,
  agentify: /rectorado|biblioteca|bienestar|tesorer|gtsi|vinculos|vículos/i,
  lab: /11a|11b|11c|11f|laborator|fiec|instituto|biomedic|postgrado/i,
  sensors: /11a|11b|11c|biblioteca|postgrado|aulas|fadcom/i,
};

/** Etiquetas que se muestran en cada modo. */
const LABELS = {
  overview: /biblioteca central|rectorado|coliseo nuevo|11a - fiec|fadcom$/i,
  command: /tecnolog/i,
  agentify: /rectorado|biblioteca central|bienestar/i,
  lab: /11a - fiec|biomedicina|postgrado stem/i,
  sensors: /11a - fiec|biblioteca central|postgrado stem/i,
};

/**
 * Centro (en coordenadas del mundo) de los edificios protagonistas de cada
 * modo: lo rellena la estación al cargar el campus y la cámara lo encuadra.
 */
const FOCUS_AT = {};

export function campusPose(mode, aspect) {
  const c = FOCUS_AT[mode] ?? CAMPUS_CENTER;
  const narrow = aspect < 0.9;
  const k = narrow ? 1.6 : 1;
  // la cámara gira muy despacio alrededor del campus
  const t = performance.now() / 1000;
  const spin = mode === 'dim' ? 0.02 : 0.035;
  const az = -0.6 + t * spin;
  // `lead` desplaza el encuadre a lo largo del eje derecho de la cámara: el
  // campus queda a la derecha y el texto, a la izquierda
  const look = (r, h, lead = 0) => {
    const l = narrow ? 0 : lead;
    const tx = c.x - Math.sin(az) * l;
    const tz = c.z + Math.cos(az) * l;
    return { position: [tx + Math.cos(az) * r * k, h * k, tz + Math.sin(az) * r * k], target: [tx, narrow ? -4 : 0, tz] };
  };
  switch (mode) {
    case 'intro':
      return look(46, 30, 8);
    case 'security':
      return look(34, 20, 10);
    case 'energy':
      return look(36, 26, 10);
    case 'sensors':
      return look(32, 22, 12);
    case 'efficiency':
      return look(44, 34, 9);
    case 'forest':
      return look(48, 34, 10);
    case 'command':
      return look(34, 24, 12);
    case 'agentify':
      return look(38, 24, 13);
    case 'lab':
      return look(34, 22, 13);
    case 'dim':
      return look(58, 40, 0);
    default:
      return look(42, 28, 8);
  }
}

/* ------------------------------------------------------------------ */
/* Datos                                                               */
/* ------------------------------------------------------------------ */

const campusCache = new Map();
function useCampus(url) {
  const [data, setData] = useState(() => campusCache.get(url) ?? null);
  useEffect(() => {
    let alive = true;
    if (campusCache.has(url)) {
      setData(campusCache.get(url));
      return undefined;
    }
    fetch(url)
      .then((r) => r.json())
      .then((j) => {
        campusCache.set(url, j);
        if (alive) setData(j);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [url]);
  return data;
}

const inside = (p) => p.every(([x, z]) => Math.abs(x) < CLIP && Math.abs(z) < CLIP);
const touches = (p) => p.some(([x, z]) => Math.abs(x) < CLIP && Math.abs(z) < CLIP);
const centroid = (p) => {
  const n = p.length;
  return p.reduce((a, [x, z]) => [a[0] + x / n, a[1] + z / n], [0, 0]);
};
const area = (p) => Math.abs(p.reduce((a, [x1, z1], i) => {
  const [x2, z2] = p[(i + 1) % p.length];
  return a + x1 * z2 - x2 * z1;
}, 0)) / 2;
const norm = (s) => (s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Pseudoaleatorio estable por índice: la misma «lectura» cada vez. */
const rand = (i) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** Fusiona edificios en una geometría y guarda qué vértices son de cada uno (para teñirlos). */
function buildingGeometry(list) {
  const parts = [];
  for (const b of list) {
    const pts = b.p.map(([x, z]) => new THREE.Vector2(x * SCALE, -z * SCALE));
    if (pts.length < 3) continue;
    const g = new THREE.ExtrudeGeometry(new THREE.Shape(pts), { depth: b.h * HK, bevelEnabled: false });
    g.rotateX(-Math.PI / 2);
    const ng = g.index ? g.toNonIndexed() : g;
    if (ng !== g) g.dispose();
    parts.push({ b, g: ng });
  }
  if (!parts.length) return null;
  const count = parts.reduce((n, p) => n + p.g.attributes.position.count, 0);
  const pos = new Float32Array(count * 3);
  const nor = new Float32Array(count * 3);
  const ranges = [];
  let o = 0;
  for (const { b, g } of parts) {
    pos.set(g.attributes.position.array, o * 3);
    nor.set(g.attributes.normal.array, o * 3);
    ranges.push({ i: b.i, start: o, count: g.attributes.position.count });
    o += g.attributes.position.count;
    g.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3).fill(1), 3));
  out.userData.ranges = ranges;
  return out;
}

function flatGeometry(list, y) {
  const geos = list
    .filter((g) => g.p.length >= 3)
    .map((g) => {
      const geo = new THREE.ShapeGeometry(new THREE.Shape(g.p.map(([x, z]) => new THREE.Vector2(x * SCALE, -z * SCALE))));
      geo.rotateX(-Math.PI / 2);
      geo.translate(0, y, 0);
      const ng = geo.toNonIndexed();
      geo.dispose();
      return ng;
    });
  if (!geos.length) return null;
  const n = geos.reduce((a, g) => a + g.attributes.position.count, 0);
  const pos = new Float32Array(n * 3);
  let o = 0;
  for (const g of geos) {
    pos.set(g.attributes.position.array, o);
    o += g.attributes.position.array.length;
    g.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  return out;
}

function roadLines(roads) {
  const seg = [];
  for (const r of roads) {
    for (let i = 1; i < r.p.length; i++) {
      const [x1, z1] = r.p[i - 1];
      const [x2, z2] = r.p[i];
      seg.push(x1 * SCALE, 0.04, z1 * SCALE, x2 * SCALE, 0.04, z2 * SCALE);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(seg, 3));
  return g;
}

/** Calles con su anchura real (para los estilos claros, donde una línea de 1 px no se ve). */
function roadRibbons(roads, y, minW) {
  const v = [];
  for (const r of roads) {
    const hw = (Math.max(r.w ?? 4, minW) / 2) * SCALE;
    for (let i = 1; i < r.p.length; i++) {
      const [x1, z1] = r.p[i - 1].map((n) => n * SCALE);
      const [x2, z2] = r.p[i].map((n) => n * SCALE);
      const len = Math.hypot(x2 - x1, z2 - z1) || 1;
      const nx = (-(z2 - z1) / len) * hw;
      const nz = ((x2 - x1) / len) * hw;
      v.push(x1 + nx, y, z1 + nz, x2 + nx, y, z2 + nz, x2 - nx, y, z2 - nz, x1 + nx, y, z1 + nz, x2 - nx, y, z2 - nz, x1 - nx, y, z1 - nz);
      // junta redonda barata: un rombo en cada vértice tapa los huecos entre tramos
      v.push(x2 - hw, y, z2, x2, y, z2 - hw, x2 + hw, y, z2, x2 - hw, y, z2, x2 + hw, y, z2, x2, y, z2 + hw);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  return g;
}

/* ------------------------------------------------------------------ */
/* Imagen aérea (estilo realista)                                      */
/* ------------------------------------------------------------------ */

const IMAGERY_URL = (z, y, x) => `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
const imageryCache = new Map();

/**
 * Cose las teselas de Esri World Imagery que cubren el campus en un solo
 * lienzo y devuelve la textura con sus límites en metros locales.
 */
function loadImagery([lat0, lon0], radius, z) {
  const key = `${lat0},${lon0},${radius},${z}`;
  if (imageryCache.has(key)) return imageryCache.get(key);
  const n = 2 ** z;
  const mLat = 111320;
  const mLon = 111320 * Math.cos((lat0 * Math.PI) / 180);
  const lonToX = (lon) => ((lon + 180) / 360) * n;
  const latToY = (lat) => {
    const r = (lat * Math.PI) / 180;
    return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n;
  };
  const xToLon = (x) => (x / n) * 360 - 180;
  const yToLat = (y) => (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n))) * 180) / Math.PI;
  const x0 = Math.floor(lonToX(lon0 - radius / mLon));
  const x1 = Math.floor(lonToX(lon0 + radius / mLon));
  const y0 = Math.floor(latToY(lat0 + radius / mLat));
  const y1 = Math.floor(latToY(lat0 - radius / mLat));
  const cols = x1 - x0 + 1;
  const rows = y1 - y0 + 1;
  const canvas = document.createElement('canvas');
  canvas.width = cols * 256;
  canvas.height = rows * 256;
  const ctx = canvas.getContext('2d');
  const jobs = [];
  for (let ty = y0; ty <= y1; ty++) {
    for (let tx = x0; tx <= x1; tx++) {
      jobs.push(
        new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            ctx.drawImage(img, (tx - x0) * 256, (ty - y0) * 256);
            resolve(true);
          };
          img.onerror = () => resolve(false);
          img.src = IMAGERY_URL(z, ty, tx);
        })
      );
    }
  }
  const p = Promise.all(jobs).then((ok) => {
    if (!ok.some(Boolean)) throw new Error('sin imagen aérea');
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    const west = xToLon(x0);
    const east = xToLon(x1 + 1);
    const north = yToLat(y0);
    const south = yToLat(y1 + 1);
    return {
      texture: tex,
      xMin: (west - lon0) * mLon,
      xMax: (east - lon0) * mLon,
      zMin: (lat0 - north) * mLat,
      zMax: (lat0 - south) * mLat,
    };
  });
  imageryCache.set(key, p);
  p.catch(() => imageryCache.delete(key));
  return p;
}

/* ------------------------------------------------------------------ */
/* Suelos                                                              */
/* ------------------------------------------------------------------ */

const gridFrag = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColor;
  varying vec2 vP;
  void main() {
    float r = length(vP);
    vec2 g = abs(fract(vP / 2.5) - 0.5);
    float line = smoothstep(0.47, 0.5, max(g.x, g.y));
    // ondas finas que se alejan del centro (línea fina en el borde de cada periodo)
    float ring = smoothstep(0.44, 0.5, abs(fract(r / 6.0 - uTime * 0.05) - 0.5));
    float fade = smoothstep(42.0, 6.0, r);
    float a = (line * 0.12 + ring * 0.18) * fade * uOpacity;
    // luz sumada sin tocar el alfa del lienzo: con alfa, el anillo oscurecía el fondo
    gl_FragColor = vec4(uColor * a, 0.0);
  }
`;
const flatVert = /* glsl */ `
  varying vec2 vP;
  varying vec2 vUv;
  void main() {
    vP = position.xy;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
/** Base del campus (color o imagen aérea), con los bordes fundidos en la oscuridad. */
const baseFrag = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uHasMap;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uDim;
  uniform vec2 uHalf;
  varying vec2 vP;
  varying vec2 vUv;
  void main() {
    vec3 c = uHasMap > 0.5 ? texture2D(uMap, vUv).rgb : uColor;
    vec2 e = abs(vP) / uHalf;
    float edge = 1.0 - smoothstep(0.72, 1.0, max(e.x, e.y));
    float round = 1.0 - smoothstep(0.85, 1.25, length(e));
    gl_FragColor = vec4(c * uDim, uOpacity * edge * round);
    #include <colorspace_fragment>
  }
`;

/* ------------------------------------------------------------------ */

export default function CampusStation({ active, mode = 'overview', look = 'holo', paused, url, labels = true, lowPower }) {
  const data = useCampus(url);
  const clock = useSceneClock(paused);
  const root = useRef();
  const fade = useRef(0);
  const reveal = useRef(0);
  const L = LOOK[look] ?? LOOK.holo;

  const scene = useMemo(() => {
    if (!data) return null;
    const buildings = data.buildings.filter((b) => inside(b.p)).map((b, i) => ({ ...b, i, c: centroid(b.p), key: norm(b.name), area: area(b.p) }));
    const roads = data.roads.filter((r) => touches(r.p));
    const main = roads.filter((r) => r.w >= 5);
    const minor = roads.filter((r) => r.w < 5);
    const green = data.green.filter((g) => g.p.length > 2 && touches(g.p));
    const water = (data.water ?? []).filter((g) => g.p.length > 2 && touches(g.p));
    const hub = buildings.find((b) => FOCUS.command.test(b.key)) ?? buildings[0];

    const geoAll = buildingGeometry(buildings);
    const edges = geoAll ? new THREE.EdgesGeometry(geoAll, 30) : null;
    const focusSets = Object.fromEntries(Object.entries(FOCUS).map(([k, re]) => [k, buildings.filter((b) => re.test(b.key))]));
    const focusGeo = Object.fromEntries(Object.entries(focusSets).map(([k, l]) => [k, buildingGeometry(l)]));

    // edificios con sensórica: los que tienen nombre, de mayor a menor
    const rooms = buildings
      .filter((b) => b.name)
      .sort((a, b) => b.area - a.area)
      .slice(0, 28);
    CAMPUS_LIVE.rooms = rooms.map((b) => ({ i: b.i, name: b.name, area: Math.round(b.area) }));

    // cámaras: en las esquinas de ~18 edificios repartidos
    const cams = buildings.filter((_, i) => i % 5 === 0).slice(0, 18).map((b) => ({ x: b.p[0][0] * SCALE, z: b.p[0][1] * SCALE, h: b.h * HK + 0.2, a: rand(b.i) * Math.PI * 2 }));

    // sensores en las zonas verdes
    const sensors = [];
    green.forEach((g, gi) => {
      const [cx, cz] = centroid(g.p);
      if (Math.abs(cx) > CLIP || Math.abs(cz) > CLIP) return;
      const n = Math.min(3, 1 + Math.floor(g.p.length / 14));
      for (let k = 0; k < n; k++) {
        const v = g.p[Math.floor(rand(gi * 7 + k) * g.p.length)];
        sensors.push({ x: (cx * 0.6 + v[0] * 0.4) * SCALE, z: (cz * 0.6 + v[1] * 0.4) * SCALE, s: rand(gi + k) });
      }
    });

    // líneas al centro de datos (modo mando)
    const hubP = new THREE.Vector3(hub.c[0] * SCALE, hub.h * HK + 1.2, hub.c[1] * SCALE);
    const links = buildings
      .filter((b) => b !== hub && b.name)
      .slice(0, 26)
      .map((b, i) => {
        const a = new THREE.Vector3(b.c[0] * SCALE, b.h * HK, b.c[1] * SCALE);
        const mid = a.clone().lerp(hubP, 0.5);
        mid.y += 3 + a.distanceTo(hubP) * 0.12;
        const curve = new THREE.QuadraticBezierCurve3(a, mid, hubP);
        return { geometry: pulseLineGeometry(curve.getPoints(40)), material: makePulseMaterial(SKY, { speed: 0.45, phase: rand(i) }) };
      });

    // rutas de agentes entre edificios de servicios
    const ag = focusSets.agentify;
    const agentRoutes =
      ag.length > 1
        ? ag.map((b, i) => {
            const n = ag[(i + 1) % ag.length];
            const a = new THREE.Vector3(b.c[0] * SCALE, b.h * HK + 0.5, b.c[1] * SCALE);
            const z = new THREE.Vector3(n.c[0] * SCALE, n.h * HK + 0.5, n.c[1] * SCALE);
            const mid = a.clone().lerp(z, 0.5);
            mid.y += 5;
            return new THREE.QuadraticBezierCurve3(a, mid, z);
          })
        : [];
    const agentLines = agentRoutes.map((c, i) => ({ geometry: pulseLineGeometry(c.getPoints(40)), material: makePulseMaterial(GOLD, { speed: 0.35, phase: i * 0.2 }) }));

    Object.keys(FOCUS_AT).forEach((k) => delete FOCUS_AT[k]);
    Object.entries(focusSets).forEach(([k, list]) => {
      if (!list.length) return;
      const [x, z] = list.reduce((a, b) => [a[0] + b.c[0] / list.length, a[1] + b.c[1] / list.length], [0, 0]);
      FOCUS_AT[k] = new THREE.Vector3(CAMPUS_CENTER.x + x * SCALE, 0, CAMPUS_CENTER.z + z * SCALE);
    });

    return {
      buildings,
      byIndex: new Map(buildings.map((b) => [b.i, b])),
      rooms,
      roomSet: new Set(rooms.map((b) => b.i)),
      geoAll,
      edges,
      focusGeo,
      focusSets,
      green: flatGeometry(green, 0.02),
      water: flatGeometry(water, 0.025),
      roads: roadLines(roads),
      mainRoads: roadLines(main),
      minorRibbons: roadRibbons(minor, 0.03, 3.5),
      mainRibbons: roadRibbons(main, 0.035, 7),
      cams,
      sensors,
      hub,
      hubP,
      links,
      agentRoutes,
      agentLines,
    };
  }, [data]);

  useEffect(
    () => () => {
      if (!scene) return;
      [scene.geoAll, scene.edges, scene.green, scene.water, scene.roads, scene.mainRoads, scene.minorRibbons, scene.mainRibbons, ...Object.values(scene.focusGeo)].forEach((g) => g?.dispose());
      [...scene.links, ...scene.agentLines].forEach((l) => (l.geometry.dispose(), l.material.dispose()));
    },
    [scene]
  );

  /* --- imagen aérea: solo si se elige el estilo realista --- */
  const [imagery, setImagery] = useState(null);
  useEffect(() => {
    if (look !== 'satellite' || !data?.center) return undefined;
    let alive = true;
    loadImagery(data.center, CLIP + 60, lowPower ? 17 : 18)
      .then((im) => alive && setImagery(im))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [look, data, lowPower]);

  /* --- materiales --- */
  const gridMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 }, uColor: { value: SKY.clone() } },
        vertexShader: flatVert,
        fragmentShader: gridFrag,
        transparent: true,
        depthWrite: false,
        blending: THREE.CustomBlending,
        blendSrc: THREE.OneFactor,
        blendDst: THREE.OneFactor,
        blendSrcAlpha: THREE.ZeroFactor,
        blendDstAlpha: THREE.OneFactor,
      }),
    []
  );
  const baseMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uMap: { value: null }, uHasMap: { value: 0 }, uColor: { value: new THREE.Color('#eef1f5') }, uOpacity: { value: 0 }, uDim: { value: 1 }, uHalf: { value: new THREE.Vector2(34, 34) } },
        vertexShader: flatVert,
        fragmentShader: baseFrag,
        transparent: true,
        depthWrite: false,
      }),
    []
  );
  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffffff', vertexColors: true, emissive: BLUE, emissiveIntensity: 0.18, metalness: 0.4, roughness: 0.35, transparent: true, opacity: 0 }), []);
  const edgeMat = useMemo(() => new THREE.LineBasicMaterial({ color: SKY, transparent: true, opacity: 0, toneMapped: false }), []);
  const focusMat = useMemo(() => new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0, toneMapped: false, depthWrite: false }), []);
  const greenMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#0f5132', transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }), []);
  const waterMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#0b3a66', transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }), []);
  const roadMat = useMemo(() => new THREE.LineBasicMaterial({ color: '#5b7fb4', transparent: true, opacity: 0, toneMapped: false }), []);
  const mainMat = useMemo(() => new THREE.LineBasicMaterial({ color: SKY, transparent: true, opacity: 0, toneMapped: false }), []);
  const ribbonMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#d3dae4', transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }), []);
  const mainRibbonMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#c0cad8', transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }), []);
  const mats = [gridMat, baseMat, bodyMat, edgeMat, focusMat, greenMat, waterMat, roadMat, mainMat, ribbonMat, mainRibbonMat];
  useEffect(() => () => mats.forEach((m) => m.dispose()), mats); // eslint-disable-line react-hooks/exhaustive-deps

  // el estilo cambia colores y materiales de golpe (bajo el fundido de opacidades)
  useEffect(() => {
    bodyMat.emissiveIntensity = L.emissive;
    bodyMat.metalness = L.metal;
    bodyMat.roughness = L.rough;
    edgeMat.color.set(L.edge);
    if (L.road) roadMat.color.set(L.road);
    if (L.main) mainMat.color.set(L.main);
    if (L.road) ribbonMat.color.set(L.road);
    if (L.main) mainRibbonMat.color.set(L.main);
    if (L.water) waterMat.color.set(L.water);
    if (L.base && L.base !== 'imagery') baseMat.uniforms.uColor.value.set(L.base);
    baseMat.uniforms.uHasMap.value = 0;
    baseMat.uniforms.uHalf.value.set(34, 34);
    if (L.base === 'imagery' && imagery) {
      baseMat.uniforms.uMap.value = imagery.texture;
      baseMat.uniforms.uHasMap.value = 1;
      baseMat.uniforms.uHalf.value.set(((imagery.xMax - imagery.xMin) / 2) * SCALE, ((imagery.zMax - imagery.zMin) / 2) * SCALE);
    }
    baseMat.needsUpdate = true;
    tint.current.reset = true;
  }, [look, imagery]); // eslint-disable-line react-hooks/exhaustive-deps

  // plano base: tamaño y posición (la imagen aérea tiene sus propios límites)
  const basePlane = useMemo(() => {
    if (L.base === 'imagery' && imagery) {
      const w = (imagery.xMax - imagery.xMin) * SCALE;
      const h = (imagery.zMax - imagery.zMin) * SCALE;
      return { w, h, x: ((imagery.xMin + imagery.xMax) / 2) * SCALE, z: ((imagery.zMin + imagery.zMax) / 2) * SCALE };
    }
    return { w: 68, h: 68, x: 0, z: 0 };
  }, [L.base, imagery]);

  /* --- tinte por edificio (sensórica y eficiencia) --- */
  const tint = useRef({ cur: null, reset: true, acc: 0 });
  const baseColor = useMemo(() => new THREE.Color(L.body), [L.body]);
  const tmpC = useMemo(() => new THREE.Color(), []);

  const { camera } = useThree();
  const labelRefs = useRef([]);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const camRefs = useRef([]);
  const sensorRefs = useRef([]);
  const roomRefs = useRef([]);
  const barRefs = useRef([]);
  const agentRefs = useRef([]);
  const dataRefs = useRef([]);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.1);
    const t = clock.current;
    fade.current = damp(fade.current, active ? 1 : 0, active ? 1.6 : 4, dt);
    if (root.current) root.current.visible = fade.current > 0.01;
    if (!root.current?.visible || !scene) return;
    CAMPUS_LIVE.t = t;
    const f = fade.current;
    // aparición del campus: el suelo, luego los edificios crecen
    reveal.current = active ? Math.min(1, reveal.current + dt * 0.45) : reveal.current;
    const rv = reveal.current;
    const dim = mode === 'dim' ? 0.45 : 1;
    const tinted = mode === 'sensors' || mode === 'efficiency';
    const light = look !== 'holo';

    gridMat.uniforms.uTime.value = t;
    gridMat.uniforms.uOpacity.value = damp(gridMat.uniforms.uOpacity.value, L.grid * f, 3, dt);
    const hasBase = L.base && (L.base !== 'imagery' || imagery);
    baseMat.uniforms.uOpacity.value = damp(baseMat.uniforms.uOpacity.value, hasBase ? f : 0, 2.5, dt);
    baseMat.uniforms.uDim.value = damp(baseMat.uniforms.uDim.value, mode === 'dim' ? 0.55 : tinted && light ? 0.8 : 1, 2, dt);
    bodyMat.opacity = damp(bodyMat.opacity, (light ? 1 : 0.92) * f * (light ? 1 : dim), 3, dt);
    bodyMat.transparent = bodyMat.opacity < 0.99;
    bodyMat.emissiveIntensity = damp(bodyMat.emissiveIntensity, tinted && !light ? 0.05 : L.emissive, 3, dt);
    edgeMat.opacity = damp(edgeMat.opacity, (mode === 'command' || mode === 'agentify' ? 0.6 : 1) * L.edgeO * f * dim, 3, dt);
    greenMat.opacity = damp(greenMat.opacity, (mode === 'forest' ? Math.max(0.6, L.greenO) + Math.sin(t * 1.5) * 0.08 : L.greenO) * f, 3, dt);
    greenMat.color.lerp(tmpC.set(mode === 'forest' && !light ? '#0d7a55' : mode === 'forest' && look === 'satellite' ? '#22c55e' : L.green ?? '#0f5132'), 1 - Math.exp(-dt * 2));
    waterMat.opacity = damp(waterMat.opacity, L.waterO * f, 3, dt);
    roadMat.opacity = damp(roadMat.opacity, L.ribbons ? 0 : L.roadO * f * dim, 3, dt);
    mainMat.opacity = damp(mainMat.opacity, L.ribbons ? 0 : (L.mainO + (L.mainO ? Math.sin(t * 2) * 0.1 : 0)) * f * dim, 3, dt);
    ribbonMat.opacity = damp(ribbonMat.opacity, L.ribbons ? L.roadO * f : 0, 3, dt);
    mainRibbonMat.opacity = damp(mainRibbonMat.opacity, L.ribbons ? L.mainO * f : 0, 3, dt);
    focusMat.opacity = damp(focusMat.opacity, FOCUS[mode] && mode !== 'sensors' ? (0.35 + Math.sin(t * 3) * 0.15) * f : 0, 3, dt);

    if (root.current.userData.city) {
      const g = root.current.userData.city;
      g.scale.y = THREE.MathUtils.lerp(0.02, 1, 1 - Math.pow(1 - rv, 3));
    }

    /* tinte de cada edificio: color base del estilo, o su estado */
    const geo = scene.geoAll;
    if (geo) {
      const ranges = geo.userData.ranges;
      const T = tint.current;
      if (!T.cur || T.cur.length !== ranges.length * 3) T.cur = new Float32Array(ranges.length * 3);
      const k = T.reset ? 1 : 1 - Math.exp(-dt * 2.5);
      const col = geo.attributes.color;
      let dirty = false;
      ranges.forEach((r, n) => {
        let target = baseColor;
        if (mode === 'sensors' && scene.roomSet.has(r.i)) {
          const s = co2Status(co2(r.i, t));
          target = tmpC.copy(baseColor).lerp(s === 'ok' ? OK : s === 'warn' ? WARN : ALERT, 0.8);
        } else if (mode === 'efficiency') {
          const v = intensity(r.i, t);
          const heat = v < 0.5 ? tmpC.copy(OK).lerp(WARN, v / 0.5) : tmpC.copy(WARN).lerp(ALERT, (v - 0.5) / 0.5);
          target = heat.lerp(baseColor, 0.15);
        }
        const o = n * 3;
        const nr = T.cur[o] + (target.r - T.cur[o]) * k;
        const ng = T.cur[o + 1] + (target.g - T.cur[o + 1]) * k;
        const nb = T.cur[o + 2] + (target.b - T.cur[o + 2]) * k;
        if (T.reset || Math.abs(nr - T.cur[o]) + Math.abs(ng - T.cur[o + 1]) + Math.abs(nb - T.cur[o + 2]) > 0.002) {
          T.cur[o] = nr;
          T.cur[o + 1] = ng;
          T.cur[o + 2] = nb;
          for (let v = r.start; v < r.start + r.count; v++) col.setXYZ(v, nr, ng, nb);
          dirty = true;
        }
      });
      T.reset = false;
      if (dirty) col.needsUpdate = true;
    }

    // etiquetas: las que caerían bajo el texto (mitad izquierda) se apagan
    const narrow = window.innerWidth / Math.max(1, window.innerHeight) < 0.9;
    labelRefs.current.forEach((l) => {
      if (!l?.el) return;
      tmp.copy(l.pos).add(CAMPUS_CENTER).project(camera);
      const show = narrow ? tmp.y < 0.35 : tmp.x > -0.12 && tmp.x < 0.5;
      l.el.style.opacity = show ? '1' : '0';
    });

    // cámaras de seguridad: el cono barre
    const sec = mode === 'security' ? 1 : 0;
    camRefs.current.forEach((g, i) => {
      if (!g) return;
      const s = damp(g.scale.x, sec ? 1 : 0.001, 4, dt);
      g.scale.setScalar(s);
      g.visible = s > 0.01;
      g.rotation.y = scene.cams[i].a + Math.sin(t * 0.7 + i) * 0.7;
    });
    // sensores del bosque: ondas
    const fo = mode === 'forest' || mode === 'lab' ? 1 : 0;
    sensorRefs.current.forEach((g, i) => {
      if (!g) return;
      const s = damp(g.userData.k ?? 0, fo, 3, dt);
      g.userData.k = s;
      g.visible = s > 0.01;
      const ring = g.children[1];
      const p = (t * 0.6 + scene.sensors[i].s) % 1;
      ring.scale.setScalar(0.2 + p * 2.4 * s);
      ring.material.opacity = (1 - p) * 0.8 * s;
      g.children[0].scale.setScalar(s);
    });
    // sensores de aula: un nodo sobre cada edificio, con el color de su CO₂
    const se = mode === 'sensors' ? 1 : 0;
    roomRefs.current.forEach((g, n) => {
      if (!g) return;
      const b = scene.rooms[n];
      const s = damp(g.userData.k ?? 0, se, 3, dt);
      g.userData.k = s;
      g.visible = s > 0.01;
      const st = co2Status(co2(b.i, t));
      const c = st === 'ok' ? OK : st === 'warn' ? WARN : ALERT;
      g.children[0].material.color.copy(c);
      g.children[1].material.color.copy(c);
      g.children[2].material.color.copy(c);
      const p = (t * (st === 'alert' ? 1.1 : 0.5) + rand(b.i)) % 1;
      g.children[1].scale.setScalar((0.4 + p * 2.2) * s);
      g.children[1].material.opacity = (1 - p) * 0.9 * s;
      g.children[0].scale.setScalar(s);
      g.children[2].scale.set(1, s, 1);
    });
    // columnas de consumo
    const en = mode === 'energy' ? 1 : 0;
    barRefs.current.forEach((m, i) => {
      if (!m) return;
      const b = scene.buildings[i];
      const target = en ? (0.6 + rand(b.i) * 3.2) * (0.85 + Math.sin(t * 1.4 + i) * 0.15) : 0.001;
      m.scale.y = damp(m.scale.y, target, 3, dt);
      m.visible = m.scale.y > 0.02;
      m.material.opacity = 0.85 * f;
    });
    // centro de mando: pulsos al centro de datos
    const cm = mode === 'command' ? 1 : 0;
    scene.links.forEach((l) => {
      const u = l.material.uniforms;
      u.uTime.value = t;
      u.uOpacity.value = damp(u.uOpacity.value, cm * f, 3, dt);
      u.uDraw.value = damp(u.uDraw.value, cm ? 1.001 : 0, 1.4, dt);
    });
    // agentes viajando
    const ai = mode === 'agentify' ? 1 : 0;
    scene.agentLines.forEach((l) => {
      const u = l.material.uniforms;
      u.uTime.value = t;
      u.uOpacity.value = damp(u.uOpacity.value, ai * f * 0.8, 3, dt);
      u.uDraw.value = damp(u.uDraw.value, ai ? 1.001 : 0, 1.2, dt);
    });
    agentRefs.current.forEach((m, i) => {
      if (!m) return;
      const route = scene.agentRoutes[i % scene.agentRoutes.length];
      if (!route) return;
      route.getPointAt((((t * 0.12 + i * 0.37) % 1) + 1) % 1, m.position);
      const s = damp(m.scale.x, ai ? 1 : 0.001, 4, dt);
      m.scale.setScalar(s);
      m.visible = s > 0.01;
    });
    // laboratorio vivo: datos que suben
    const lb = mode === 'lab' ? 1 : 0;
    dataRefs.current.forEach((m, i) => {
      if (!m) return;
      const b = scene.focusSets.lab[i % Math.max(1, scene.focusSets.lab.length)];
      if (!b) return;
      const p = (t * 0.25 + rand(i)) % 1;
      m.position.set(b.c[0] * SCALE + (rand(i * 3) - 0.5) * 1.5, b.h * HK + p * 9, b.c[1] * SCALE + (rand(i * 5) - 0.5) * 1.5);
      m.material.opacity = (1 - p) * lb * f;
      m.visible = lb > 0;
    });
  });

  const labelRe = LABELS[mode];
  const shownLabels = active && labels && scene && labelRe ? scene.buildings.filter((b) => b.name && labelRe.test(b.key)).slice(0, 6) : [];
  labelRefs.current.length = shownLabels.length;

  return (
    <group ref={root} position={CAMPUS_CENTER.toArray()}>
      <hemisphereLight args={[look === 'holo' ? '#9cc8ff' : '#ffffff', look === 'holo' ? '#06101f' : look === 'model' ? '#c4ccd8' : '#9aa3b2', L.hemi]} />
      <directionalLight position={[20, 40, 10]} intensity={L.sun} color={look === 'holo' ? '#cfe6ff' : '#fff6e8'} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={gridMat}>
        <circleGeometry args={[46, 96]} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[basePlane.x, -0.01, basePlane.z]} material={baseMat} renderOrder={-1}>
        <planeGeometry args={[basePlane.w, basePlane.h]} />
      </mesh>

      {scene && (
        <>
          {scene.water && <mesh geometry={scene.water} material={waterMat} />}
          {scene.green && <mesh geometry={scene.green} material={greenMat} />}
          <lineSegments geometry={scene.roads} material={roadMat} />
          <lineSegments geometry={scene.mainRoads} material={mainMat} />
          <mesh geometry={scene.minorRibbons} material={ribbonMat} />
          <mesh geometry={scene.mainRibbons} material={mainRibbonMat} />

          <group ref={(g) => root.current && (root.current.userData.city = g)}>
            {scene.geoAll && <mesh geometry={scene.geoAll} material={bodyMat} />}
            {scene.edges && <lineSegments geometry={scene.edges} material={edgeMat} />}
            {FOCUS[mode] && mode !== 'sensors' && scene.focusGeo[mode] && <mesh geometry={scene.focusGeo[mode]} material={focusMat} scale={[1.01, 1.04, 1.01]} />}
          </group>

          {/* seguridad */}
          {scene.cams.map((c, i) => (
            <group key={`c${i}`} ref={(el) => (camRefs.current[i] = el)} position={[c.x, c.h, c.z]}>
              <mesh>
                <sphereGeometry args={[0.22, 12, 12]} />
                <meshBasicMaterial color="#fde68a" toneMapped={false} />
              </mesh>
              <mesh position={[0, -c.h / 2, 1.6]} rotation={[Math.PI / 2 + 0.6, 0, 0]}>
                <coneGeometry args={[1.1, 3.2, 20, 1, true]} />
                <meshBasicMaterial color={SKY} transparent opacity={look === 'holo' ? 0.16 : 0.32} depthWrite={false} side={THREE.DoubleSide} blending={look === 'holo' ? THREE.AdditiveBlending : THREE.NormalBlending} toneMapped={false} />
              </mesh>
            </group>
          ))}

          {/* sensores ambientales */}
          {scene.sensors.map((s, i) => (
            <group key={`s${i}`} ref={(el) => (sensorRefs.current[i] = el)} position={[s.x, 0.25, s.z]}>
              <mesh>
                <sphereGeometry args={[0.2, 10, 10]} />
                <meshBasicMaterial color={look === 'holo' ? '#a7f3d0' : '#059669'} toneMapped={false} />
              </mesh>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.45, 0.55, 32]} />
                <meshBasicMaterial color={look === 'holo' ? GREEN : '#047857'} transparent opacity={0} depthWrite={false} toneMapped={false} />
              </mesh>
            </group>
          ))}

          {/* sensores de aula (CO₂, temperatura, ocupación) */}
          {scene.rooms.map((b, n) => (
            <group key={`r${b.i}`} ref={(el) => (roomRefs.current[n] = el)} position={[b.c[0] * SCALE, b.h * HK, b.c[1] * SCALE]} visible={false}>
              <mesh position={[0, 1.4, 0]}>
                <octahedronGeometry args={[0.32]} />
                <meshBasicMaterial color={OK} toneMapped={false} />
              </mesh>
              <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.5, 0.62, 40]} />
                <meshBasicMaterial color={OK} transparent opacity={0} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
              </mesh>
              <mesh position={[0, 0.6, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 1.2, 6]} />
                <meshBasicMaterial color={OK} toneMapped={false} />
              </mesh>
            </group>
          ))}

          {/* consumo por edificio */}
          {scene.buildings.map((b, i) => (
            <mesh key={`b${i}`} ref={(el) => (barRefs.current[i] = el)} position={[b.c[0] * SCALE, b.h * HK, b.c[1] * SCALE]} scale={[1, 0.001, 1]}>
              <boxGeometry args={[0.35, 1, 0.35]} />
              <meshBasicMaterial color={rand(b.i) > 0.8 ? '#f87171' : GOLD} transparent opacity={0} toneMapped={false} />
            </mesh>
          ))}

          {/* centro de mando */}
          {scene.links.map((l, i) => (
            <line key={`l${i}`} geometry={l.geometry} material={l.material} />
          ))}
          {mode === 'command' && (
            <mesh position={scene.hubP.toArray()}>
              <octahedronGeometry args={[0.9]} />
              <meshBasicMaterial color={SKY} wireframe toneMapped={false} />
            </mesh>
          )}

          {/* agentes */}
          {scene.agentLines.map((l, i) => (
            <line key={`a${i}`} geometry={l.geometry} material={l.material} />
          ))}
          {Array.from({ length: Math.min(8, scene.agentRoutes.length * 2) }, (_, i) => (
            <mesh key={`ag${i}`} ref={(el) => (agentRefs.current[i] = el)} scale={0.001}>
              <icosahedronGeometry args={[0.45, 0]} />
              <meshBasicMaterial color={look === 'holo' ? '#fde68a' : '#d97706'} wireframe toneMapped={false} />
            </mesh>
          ))}

          {/* datos del laboratorio vivo */}
          {Array.from({ length: 40 }, (_, i) => (
            <mesh key={`d${i}`} ref={(el) => (dataRefs.current[i] = el)}>
              <boxGeometry args={[0.12, 0.12, 0.12]} />
              <meshBasicMaterial color={look === 'holo' ? SKY : '#0073b6'} transparent opacity={0} toneMapped={false} />
            </mesh>
          ))}

          {shownLabels.map((b, i) => {
            const pos = new THREE.Vector3(b.c[0] * SCALE, b.h * HK + 1.6, b.c[1] * SCALE);
            return (
              <Html key={b.i} position={pos.toArray()} center zIndexRange={[4, 0]} style={{ pointerEvents: 'none' }}>
                <span className="campus-tag" ref={(el) => (labelRefs.current[i] = el ? { el, pos } : null)}>
                  {b.name}
                </span>
              </Html>
            );
          })}
        </>
      )}
    </group>
  );
}
