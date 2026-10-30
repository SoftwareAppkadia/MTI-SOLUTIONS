import { CHAPTERS } from './deck.js';
import { AG_CHAPTERS } from './agentic.js';
import { CLIENT_CHAPTERS } from './clients/index.js';

/**
 * Recorridos disponibles: el corporativo y uno por línea de servicio.
 *
 * El store solo necesita la estructura (cuántos capítulos y pasos tiene cada
 * uno); los textos, traducidos, salen de `localizeDeck`. Para añadir una línea
 * nueva: su archivo de datos, su entrada aquí y en `SERVICE_TRACKS` de deck.js.
 */
export const TRACK_CHAPTERS = {
  mti: CHAPTERS,
  agentify: AG_CHAPTERS,
  ...CLIENT_CHAPTERS,
};

export const DEFAULT_TRACK = 'mti';

export const chaptersFor = (track) => TRACK_CHAPTERS[track] ?? TRACK_CHAPTERS[DEFAULT_TRACK];

/** Capítulos ya traducidos de un recorrido, a partir del contenido localizado. */
export const localizedChapters = (deck, track) =>
  track === 'agentify' ? deck.AGENTIFY.CHAPTERS : deck.CLIENTS?.[track]?.CHAPTERS ?? deck.CHAPTERS;

/** Índice de un capítulo por su id dentro de un recorrido (0 si no existe). */
export const chapterIndex = (track, id) => Math.max(0, chaptersFor(track).findIndex((c) => c.id === id));
