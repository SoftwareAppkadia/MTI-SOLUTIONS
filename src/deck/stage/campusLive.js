/**
 * Campus en vivo · lecturas SIMULADAS para la demo.
 *
 * El campus 3D y los paneles del espacio cliente leen de aquí, así el edificio
 * que se pone en rojo en 3D es el mismo que salta en el panel. Son funciones
 * deterministas del tiempo (sin estado): la misma escena se ve igual cada vez.
 *
 * Nada de esto es un dato del cliente ni un resultado de MTi: los paneles lo
 * rotulan como «vista ilustrativa · datos simulados».
 */

/** Lo que publica la estación en cada fotograma: reloj y edificios con sensores. */
export const CAMPUS_LIVE = {
  t: 0,
  /** [{ i, name, area }] edificios con nombre y sensórica, de mayor a menor */
  rooms: [],
};

const rnd = (i) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** CO₂ en ppm: aulas que se llenan y se ventilan. */
export const co2 = (i, t) => {
  const base = 520 + rnd(i) * 260;
  const wave = 0.5 + 0.5 * Math.sin(t * (0.09 + rnd(i + 3) * 0.08) + i * 1.7);
  return Math.round(base + wave * (380 + rnd(i + 9) * 520));
};
export const co2Status = (ppm) => (ppm < 800 ? 'ok' : ppm < 1100 ? 'warn' : 'alert');

/** Temperatura interior (°C): Guayaquil es cálido, la climatización manda. */
export const temp = (i, t) => +(23 + rnd(i + 1) * 2.5 + Math.sin(t * 0.07 + i) * 1.4).toFixed(1);
export const hum = (i, t) => Math.round(55 + rnd(i + 2) * 12 + Math.sin(t * 0.05 + i * 2) * 6);
export const occ = (i, t) => Math.max(0, Math.round((0.35 + 0.45 * (0.5 + 0.5 * Math.sin(t * 0.06 + i))) * (40 + rnd(i + 4) * 80)));

/** Potencia instantánea de un edificio (kW), proporcional a su tamaño. */
export const kw = (i, t, area = 2000) => Math.round((area / 1000) * (18 + rnd(i + 5) * 22) * (0.8 + 0.2 * Math.sin(t * 0.3 + i * 0.7)));

/**
 * Eficiencia: ciclo «antes → con MTi» de 18 s.
 *   0–6 s antes · 6–9 s se aplican las reglas · 9–16 s con MTi · 16–18 s vuelve
 */
export function effPhase(t) {
  const c = t % 18;
  if (c < 6) return 0;
  if (c < 9) return (c - 6) / 3;
  if (c < 16) return 1;
  return 1 - (c - 16) / 2;
}

/** Intensidad energética relativa (0 eficiente … 1 derroche) de un edificio. */
export const intensity = (i, t) => {
  const before = 0.25 + rnd(i + 7) * 0.75;
  // la mayoría mejora al aplicar las reglas; alguno no (se ve en el panel)
  const gain = rnd(i + 11) > 0.15 ? 0.35 + rnd(i + 13) * 0.3 : 0.05;
  return Math.max(0.05, before * (1 - gain * effPhase(t)));
};

/** Serie de potencia del campus (kW) para la curva del panel. */
export const campusKw = (t) => Math.round(1400 + 260 * Math.sin(t * 0.21) + 120 * Math.sin(t * 0.83 + 1) + 60 * Math.sin(t * 2.1));

/** Curva diaria (24 puntos) antes y con MTi: misma forma, sin picos fuera de horario. */
export const dayCurve = (after) =>
  Array.from({ length: 24 }, (_, h) => {
    const occupied = h >= 7 && h <= 20;
    const base = occupied ? 0.55 + 0.4 * Math.sin(((h - 7) / 13) * Math.PI) : 0.42;
    if (!after) return base;
    return occupied ? base * 0.86 : 0.14;
  });
