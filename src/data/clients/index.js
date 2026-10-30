import { ESPOL, ESPOL_CHAPTERS } from './espol.js';

/**
 * Pre-clientes con espacio personalizado (panel «Reuniones»).
 *
 * Cada cliente es además un recorrido (`deckTrack` = su id) con sus capítulos.
 * Para añadir uno: su archivo de datos en esta carpeta (+ .en.js), su entrada
 * aquí, en CLIENTS de deck.js / deck.en.js y en TRACK_CHAPTERS (tracks.js), y su
 * campus o recinto con `npm run client:campus -- --client=<id>`.
 */
export const CLIENT_SPACES = [{ ...ESPOL, CHAPTERS: ESPOL_CHAPTERS }];

export const CLIENT_CHAPTERS = { espol: ESPOL_CHAPTERS };

export const isClientTrack = (track) => Boolean(CLIENT_CHAPTERS[track]);
