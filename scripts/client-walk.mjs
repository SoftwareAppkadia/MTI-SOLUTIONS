/**
 * Comprobación de los espacios cliente (panel «Reuniones»).
 *
 *   npm run dev
 *   npm run client:check            (CLIENT=espol por defecto)
 *
 * Abre «Reuniones» desde la portada, entra en el espacio del cliente, recorre
 * sus capítulos paso a paso (campus 3D + esquemas), prueba los saltos a los
 * ejemplos reales de MTi (proyecto, caso de Agentify AI y ciudad 3D) y la
 * vuelta al punto exacto, y repite las escenas clave en móvil. Deja capturas
 * en `.artifacts/client/` y termina con error si algo falla.
 *
 * No ejecutar a la vez que `deck:check`: dos lienzos WebGL pesados a la vez
 * en la misma GPU pierden el contexto.
 */

import puppeteer from 'puppeteer';
import fs from 'node:fs';

const BASE = process.env.BASE || 'http://localhost:5180';
const OUT = process.env.OUT || '.artifacts/client';
const CLIENT = process.env.CLIENT || 'espol';
fs.mkdirSync(OUT, { recursive: true });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log('·', ...a);
const fail = (msg) => {
  throw new Error(msg);
};

const browser = await puppeteer.launch({
  headless: 'new',
  protocolTimeout: 240000,
  args: ['--use-angle=d3d11', '--use-gl=angle', '--ignore-gpu-blocklist', '--enable-gpu', '--window-size=1440,900'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => {
  const t = m.text();
  if (/Context Lost/.test(t)) return;
  if (m.type() === 'error' || /WebGL|Too many active/i.test(t)) errors.push(`${m.type()}: ${t.slice(0, 240)}`);
});
page.on('response', (r) => {
  if (r.status() >= 400 && !r.url().includes('/api/')) errors.push(`http ${r.status()}: ${r.url()}`);
});

const shot = (name) => page.screenshot({ path: `${OUT}/${name}.png` });
const S = () =>
  page.evaluate(() => {
    const s = window.__mtiStore.getState();
    return { mode: s.mode, track: s.deckTrack, chapter: s.deckChapter, step: s.deckStep, ret: s.deckTrackReturn, deckRet: s.deckReturn, meetings: s.meetingsOpen };
  });
const go = async (c, s, ms = 1800) => {
  await page.evaluate(([a, b]) => window.__mtiStore.getState().deckGoto(a, b), [c, s]);
  await wait(ms);
};

try {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__mtiStore?.getState().phase === 'intro', { timeout: 180000 });
  await wait(1500);

  /* --- portada: botón «Reuniones» arriba a la izquierda --- */
  const btn = await page.$('.meet-btn--intro');
  if (!btn) fail('falta el botón «Reuniones» en la portada');
  const box = await btn.boundingBox();
  if (box.x > 200 || box.y > 120) fail(`el botón «Reuniones» no está arriba a la izquierda (${box.x}, ${box.y})`);
  await btn.click();
  await page.waitForSelector('.meet-card', { timeout: 5000 });
  await wait(900);
  await shot('01-reuniones');
  log('panel de reuniones abierto');

  // segundo paso: elegir la vista del campus
  await page.click('.meet-card');
  await page.waitForSelector('.look', { timeout: 5000 });
  const looks = await page.$$('.look');
  if (looks.length !== 4) fail(`se esperaban 4 vistas del campus y hay ${looks.length}`);
  await looks[0].click();
  await wait(700);
  await shot('01b-vista');
  await page.click('.meet__start');
  await page.waitForSelector('.deck--client', { timeout: 30000 });
  let st = await S();
  if (st.track !== CLIENT || st.mode !== 'deck') fail(`no entra al espacio del cliente: ${JSON.stringify(st)}`);
  log('espacio', CLIENT, 'abierto');

  // el campus tarda en cargar: se espera a que el lienzo esté dibujando
  await wait(5000);
  await shot('02-hola');

  const chapters = await page.evaluate(() => {
    const s = window.__mtiStore.getState();
    return document.querySelectorAll('.deck__chapter').length;
  });
  if (chapters !== 4) fail(`se esperaban 4 capítulos y hay ${chapters}`);

  await go(0, 1, 3500);
  await shot('03-campus');

  const sols = await page.evaluate(() => window.__mtiStore.getState().deckTrack && document.querySelectorAll('.deck__dots .deck__dot').length);
  const nSol = await page.evaluate(() => {
    window.__mtiStore.getState().deckGoto(1, 0);
    return 0;
  });
  await wait(800);
  const total = await page.$$eval('.cl-rail button', (b) => b.length);
  if (total !== 8) fail(`se esperaban 8 soluciones y hay ${total} (${sols}, ${nSol})`);
  for (let i = 0; i < total; i++) {
    await go(1, i, 2600);
    await shot(`04-sol-${i}a`);
    await wait(3600);
    const live = await page.$('.cdash');
    const flow = await page.$('.cl-sol.is-flow .fd');
    if (!live && !flow) fail(`la solución ${i} no muestra panel ni esquema a los 6 s`);
    await shot(`04-sol-${i}b`);
    if (live) {
      // el presentador cambia a «Cómo funciona»
      await page.click('.cl-views button:last-child');
      await wait(1800);
      if (!(await page.$('.cl-sol .fd'))) fail(`la solución ${i} no cambia al esquema`);
      await shot(`04-sol-${i}c`);
    }
  }
  log(`${total} soluciones con su panel o esquema`);

  // las cuatro vistas del campus, sobre la sensórica (tinte por edificio)
  await go(1, 2, 6500);
  for (const look of ['holo', 'satellite', 'model', 'map']) {
    await page.evaluate((l) => window.__mtiStore.getState().setCampusLook(l), look);
    await wait(look === 'satellite' ? 6000 : 2500);
    await shot(`05-vista-${look}`);
  }
  await go(1, 3, 7500);
  await shot('05-vista-map-eficiencia');
  await page.evaluate(() => window.__mtiStore.getState().setCampusLook('satellite'));
  await go(1, 1, 7000);
  await shot('05-vista-satellite-energia');
  await page.evaluate(() => window.__mtiStore.getState().setCampusLook('holo'));
  log('cuatro vistas del campus');

  // los ejemplos reales: deben existir y llevar a su destino
  await go(1, 0, 6500);
  const links = await page.$$eval('.cl-link', (l) => l.length);
  if (links < 2) fail(`pocos ejemplos reales en seguridad: ${links}`);
  await page.click('.cl-link'); // AENA
  await wait(2500);
  st = await S();
  if (st.track !== 'mti' || st.ret?.track !== CLIENT) fail(`el enlace a proyecto no abre el recorrido MTI con vuelta: ${JSON.stringify(st)}`);
  await shot('05-proyecto-aena');
  const crumb = await page.$eval('.deck__crumb span', (e) => e.textContent);
  if (!/ESPOL/i.test(crumb)) fail(`la miga no vuelve a ESPOL: «${crumb}»`);
  await page.click('.deck__crumb');
  await wait(2500);
  st = await S();
  if (st.track !== CLIENT || st.chapter !== 1 || st.step !== 0) fail(`no vuelve al punto exacto: ${JSON.stringify(st)}`);
  log('proyecto real y vuelta al punto exacto');

  // caso de Agentify AI
  await go(1, 6, 6500);
  await page.click('.cl-link');
  await wait(2500);
  st = await S();
  if (st.track !== 'agentify') fail(`el caso no abre Agentify AI: ${JSON.stringify(st)}`);
  await shot('06-caso-agentify');
  await page.click('.deck__crumb');
  await wait(2000);
  st = await S();
  if (st.track !== CLIENT || st.step !== 6) fail(`no vuelve del caso: ${JSON.stringify(st)}`);
  log('caso de Agentify AI y vuelta');

  // ciudad 3D (desde el panel en vivo de consumo)
  await go(1, 1, 6500);
  const cityLink = await page.$$('.cl-link');
  await cityLink[1].click();
  await wait(3500);
  st = await S();
  if (st.mode !== 'city' || st.deckRet?.track !== CLIENT) fail(`el enlace a la ciudad no guarda la vuelta: ${JSON.stringify(st)}`);
  await shot('07-ciudad');
  await page.evaluate(() => window.__mtiStore.getState().resumeDeck());
  await wait(2500);
  st = await S();
  if (st.track !== CLIENT || st.chapter !== 1 || st.step !== 1) fail(`no vuelve de la ciudad: ${JSON.stringify(st)}`);
  log('ciudad 3D y vuelta');

  await go(2, 0, 4500);
  await shot('08-plan');
  await go(3, 0, 3500);
  await shot('09-cierre');

  // «Reuniones» desde la cabecera del cliente
  await page.click('.deck__crumb');
  await page.waitForSelector('.meet-card', { timeout: 5000 });
  await page.keyboard.press('Escape');
  await wait(400);
  st = await S();
  if (st.meetings) fail('Esc no cierra el panel de reuniones');
  if (await page.$('.dmodal')) fail('Esc en reuniones abrió también el índice');

  // inglés
  await page.evaluate(() => window.__mtiStore.getState().setLang('en'));
  await go(1, 4, 7000);
  await shot('10-en-bosque');
  const title = await page.$eval('.cl-sol__title h2', (e) => e.textContent);
  if (!/forest/i.test(title)) fail(`sin traducir: «${title}»`);
  await page.evaluate(() => window.__mtiStore.getState().setLang('es'));
  log('inglés');

  /* --- móvil --- */
  // cambiar a móvil recarga la página: se vuelve a entrar al espacio
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.waitForFunction(() => window.__mtiStore?.getState().phase === 'intro', { timeout: 180000 });
  await wait(1200);
  await shot('m-00-portada');
  await page.click('.meet-btn--intro');
  await page.waitForSelector('.meet-card', { timeout: 5000 });
  await wait(700);
  await shot('m-00-reuniones');
  await page.click('.meet-card');
  await page.waitForSelector('.look', { timeout: 5000 });
  await wait(700);
  await shot('m-00-vista');
  await page.click('.meet__start');
  await page.waitForSelector('.deck--client', { timeout: 30000 });
  await wait(5000);
  await shot('m-01-hola');
  await go(1, 2, 7000);
  await shot('m-02b-sensorica');
  await go(1, 1, 7000);
  await shot('m-02-energia');
  await go(2, 0, 3500);
  await shot('m-03-plan');
  await go(3, 0, 3000);
  await shot('m-04-cierre');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  if (overflow) fail('scroll horizontal en móvil');
  log('móvil');

  if (errors.length) fail(`errores en consola:\n  ${errors.join('\n  ')}`);
  console.log('\nOK · espacio cliente', CLIENT);
} catch (e) {
  console.error('\nFALLO:', e.message);
  if (errors.length) console.error(errors.join('\n'));
  await shot('zz-fallo').catch(() => {});
  process.exitCode = 1;
} finally {
  await browser.close();
}
