/**
 * Coreografía del recorrido corporativo
 * =====================================
 *
 * Para cada capítulo y paso, qué se ve detrás del texto:
 *
 *   stage   escena propia del recorrido (lienzo 3D transparente encima de la
 *           ciudad): 'logo' · 'globe' · 'build' · 'flow' · 'void' · null
 *   city    si la ciudad 3D real hace de decorado, cómo:
 *             look     { sol, az, dist, elev } alrededor de un caso de uso,
 *                      o 'overview' · 'wide' · 'high'
 *             from     pose desde la que arranca el vuelo (corte previo)
 *             layer    capa de datos (traffic, coverage, energy, network…)
 *             caps     filtro por solución (enciende sus puntos)
 *             inds     filtro por industria
 *             hour     hora del día (la noche hace que las capas brillen)
 *           null = la ciudad no se dibuja en este paso
 *   cover   opacidad del velo oscuro sobre la ciudad (legibilidad del texto)
 *
 * Tener esto en un solo sitio es lo que da continuidad: cada paso es un
 * movimiento de cámara o un cambio de capa sobre la misma escena, no una
 * pantalla nueva.
 */

const NIGHT = 21.4;
const DUSK = 19.4;

export const CHOREO = {
  opening: [
    { stage: 'logo', city: null },
    { stage: 'void', city: { from: 'high', look: 'overview', hour: DUSK }, cover: 0.25 },
    // ¿cómo?: la secuencia se reproduce sola sobre el campo de partículas
    { stage: 'void', city: null },
    { stage: null, city: { look: { fit: ['command-control', 'water-metering', 'smart-lighting', 'urban-security', 'waste-management', 'mobility-fleet'], az: 65, elev: 60, lead: 0.55, pad: 1.5 }, layer: 'traffic', hour: NIGHT }, cover: 0.2 },
  ],
  world: [
    { stage: 'globe', city: null },
    { stage: 'globe', city: null },
    { stage: 'globe', city: null },
    { stage: 'globe', city: null },
  ],
  sectors: [
    { stage: null, city: { from: 'high', look: { fit: ['urban-security', 'command-control', 'mobility-fleet'], az: 55, elev: 44, lead: 0.6, pad: 1.1 }, hour: DUSK }, cover: 0.2 },
    { stage: null, city: { look: { sol: 'urban-security', az: 300, dist: 380, elev: 27 }, caps: ['security'], layer: 'coverage', hour: NIGHT }, cover: 0.15 },
    { stage: null, city: { look: { sol: 'command-control', az: 25, dist: 600, elev: 34 }, inds: ['smart-cities'], layer: 'traffic', hour: DUSK }, cover: 0.15 },
    { stage: null, city: { look: 'wide', hour: NIGHT }, cover: 0.82 },
    { stage: null, city: { look: { sol: 'command-control', az: 150, dist: 1700, elev: 58 }, layer: 'network', hour: NIGHT }, cover: 0.55 },
    { stage: null, city: { look: { sol: 'stadium', az: 60, dist: 560, elev: 30 }, inds: ['venues'], hour: DUSK }, cover: 0.15 },
    { stage: null, city: { look: { sol: 'mobility-fleet', az: 160, dist: 460, elev: 26 }, inds: ['transport'], layer: 'traffic', hour: DUSK }, cover: 0.15 },
    { stage: null, city: { look: 'wide', hour: DUSK }, cover: 0.3 },
  ],
  // 0: el camino de extremo a extremo (diagrama) con la obra de fondo; 1-7: la obra se construye
  delivery: [{ stage: 'build', stageStep: 0, city: null }, ...Array.from({ length: 7 }, (_, i) => ({ stage: 'build', stageStep: i, city: null }))],
  platforms: Array.from({ length: 7 }, () => ({ stage: 'flow', city: null })),
  // mapa, nueve proyectos y, al final, los clientes en órbita sobre el campo de partículas
  projects: [{ stage: 'void', city: null }, ...Array.from({ length: 9 }, () => ({ stage: null, city: null })), { stage: 'void', city: null }],
  // cierre: la ciudad entera en operación, detrás del contacto
  contact: [{ stage: null, city: { look: 'wide', layer: 'traffic', hour: NIGHT }, cover: 0.45 }],

  /* ---------------- Agentify AI: la ciudad no participa ---------------- */
  // `orch` es el modo de la escena del orquestador (ver OrchestratorStation)
  'ag-intro': [
    { stage: 'orch', orch: 'idle', city: null },
    { stage: 'orch', orch: 'dim', city: null },
    { stage: 'orch', orch: 'idle', city: null },
  ],
  'ag-arch': [
    { stage: 'orch', orch: 'detect', city: null },
    { stage: 'orch', orch: 'route', city: null },
    { stage: 'orch', orch: 'act', city: null },
  ],
  'ag-agents': [{ stage: 'orch', orch: 'catalog', city: null }, ...Array.from({ length: 8 }, () => ({ stage: 'orch', orch: 'agent', city: null }))],
  // el mosaico sobre el orquestador en calma; cada caso, con su propia imagen
  'ag-cases': [{ stage: 'orch', orch: 'dim', city: null }, ...Array.from({ length: 14 }, () => ({ stage: null, city: null }))],
  'ag-delivery': Array.from({ length: 5 }, () => ({ stage: 'orch', orch: 'delivery', city: null })),
  'ag-why': [
    { stage: 'orch', orch: 'dim', city: null },
    { stage: 'void', city: null },
    { stage: 'orch', orch: 'idle', city: null },
  ],

  /* ------------- Espacios cliente: su campus o recinto en 3D ------------- */
  // `campus` es el modo de CampusStation; 'solution' = el de la solución del paso
  'cl-hello': [
    { stage: 'campus', campus: 'intro', city: null },
    { stage: 'campus', campus: 'overview', city: null },
  ],
  'cl-solutions': Array.from({ length: 12 }, () => ({ stage: 'campus', campus: 'solution', city: null })),
  'cl-plan': [{ stage: 'campus', campus: 'overview', city: null }],
  'cl-close': [{ stage: 'campus', campus: 'dim', city: null }],
};


/** Sectores que se señalan sobre la ciudad en la vista de zonas (paso 0 del capítulo 3). */
export const SECTOR_ZONES = ['security', 'smart-cities', 'transport'];

/** Qué sector enseña cada paso del capítulo 3. */
export const SECTOR_STEPS = { 1: 'security', 2: 'smart-cities', 3: 'industry-naval', 4: 'cybersecurity', 5: 'venues', 6: 'transport' };

/** Proyecto de cada paso del capítulo 6 (el paso 0 es el mapa). */
export const PROJECT_ORDER = ['aena', 'metro', 'buses', 'hospitalet', 'navantia', 'kafd', 'qatar-waste', 'nsu', 'malaysia-aqi'];

export function beatFor(chapterId, step) {
  const list = CHOREO[chapterId] ?? [];
  return list[Math.max(0, Math.min(step, list.length - 1))] ?? { stage: null, city: null };
}

/* ------------------------------------------------------------------ */
/* Poses de cámara de la ciudad                                        */
/* ------------------------------------------------------------------ */

const rad = (d) => (d * Math.PI) / 180;

/**
 * Encuadre que contiene a la vez varios casos de uso: centro en su media y
 * distancia según su dispersión. Así las cifras ancladas caben todas en plano,
 * sea cual sea la zona de ciudad cargada.
 */
export function fitPose(sols, { az = 60, elev = 48, pad = 1, lead = 0 } = {}) {
  const pts = sols.filter((s) => s?.anchor);
  if (!pts.length) return null;
  const cx = pts.reduce((a, s) => a + s.anchor[0], 0) / pts.length;
  const cz = pts.reduce((a, s) => a + s.anchor[2], 0) / pts.length;
  const r = Math.max(...pts.map((s) => Math.hypot(s.anchor[0] - cx, s.anchor[2] - cz)));
  const dist = (r * 2.3 + 380) * pad;
  const h = Math.cos(rad(elev)) * dist;
  // `lead` desplaza el encuadre para que el grupo quede a la derecha y el
  // texto de la izquierda no tape ningún rótulo
  const sx = -Math.sin(rad(az)) * r * lead;
  const sz = Math.cos(rad(az)) * r * lead;
  return {
    position: [cx + Math.cos(rad(az)) * h + sx, Math.sin(rad(elev)) * dist, cz + Math.sin(rad(az)) * h + sz],
    target: [cx + sx, 0, cz + sz],
  };
}

/** Posición y objetivo de cámara alrededor de un caso de uso. */
export function poseAround(sol, { az = 45, dist = 500, elev = 32 } = {}) {
  const [x, y, z] = sol.anchor;
  const h = Math.cos(rad(elev)) * dist;
  return {
    position: [x + Math.cos(rad(az)) * h, Math.sin(rad(elev)) * dist + y * 0.4, z + Math.sin(rad(az)) * h],
    target: [x, y * 0.35, z],
  };
}
