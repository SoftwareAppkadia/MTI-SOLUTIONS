/**
 * Vistas previas de los estilos del campus de un cliente (selector de «Reuniones»).
 *
 *   npm run dev
 *   npm run client:looks              (CLIENT=espol por defecto)
 *
 * Abre el espacio del cliente, oculta la interfaz, fotografía el campus con
 * cada estilo y guarda `public/clients/<id>/looks/<estilo>.webp` (480×300).
 */

import puppeteer from 'puppeteer';
import sharp from 'sharp';
import fs from 'node:fs';

const BASE = process.env.BASE || 'http://localhost:5180';
const CLIENT = process.env.CLIENT || 'espol';
const OUT = `public/clients/${CLIENT}/looks`;
const LOOKS = ['holo', 'satellite', 'model', 'map'];
fs.mkdirSync(OUT, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--use-angle=d3d11', '--use-gl=angle', '--ignore-gpu-blocklist', '--enable-gpu', '--window-size=1440,900'],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__mtiStore?.getState().phase === 'intro', { timeout: 180000 });
  await page.evaluate((id) => window.__mtiStore.getState().openClient(id, 'holo'), CLIENT);
  await page.waitForSelector('.deck--client', { timeout: 30000 });
  // solo el campus: fuera textos, cabecera, pie y viñetas
  await page.addStyleTag({ content: '.deck__scene,.deck__top,.deck__bottom,.deck__vignette,.deck__sweep,.campus-tag{display:none!important}' });
  await page.evaluate(() => {
    const s = window.__mtiStore.getState();
    s.deckGoto(0, 1);
    s.toggleDeckPause();
  });
  await wait(6000);
  for (const look of LOOKS) {
    await page.evaluate((l) => window.__mtiStore.getState().setCampusLook(l), look);
    await wait(look === 'satellite' ? 8000 : 3500);
    const buf = await page.screenshot({ clip: { x: 520, y: 160, width: 800, height: 500 } });
    await sharp(buf).resize(480, 300).webp({ quality: 82 }).toFile(`${OUT}/${look}.webp`);
    console.log('·', look);
  }
  console.log(`OK · vistas previas en ${OUT}`);
} finally {
  await browser.close();
}
