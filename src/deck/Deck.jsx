import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../store.js';
import { localizeDeck, pendingReviews } from '../data/deckLocale.js';
import { PRESENTATION_ASSETS } from '../data/presentationAssets.js';
import { localizedChapters, DEFAULT_TRACK } from '../data/tracks.js';
import { DeckContext, Icon, Photo, MtiIcon } from './parts.jsx';
import { MeetingsButton } from '../components/Meetings.jsx';
import { LookSwitch } from '../components/CampusLooks.jsx';
import { beatFor } from './choreography.js';
import { useCityDirector } from './cityBridge.js';
import { BUILD_TAG_POS } from './stage/BuildStation.jsx';
import Opening from './scenes/Opening.jsx';
import World from './scenes/World.jsx';
import Sectors from './scenes/Sectors.jsx';
import Delivery, { buildLabels } from './scenes/Delivery.jsx';
import Platforms, { flowLabels } from './scenes/Platforms.jsx';
import Projects from './scenes/Projects.jsx';
import Contact from './scenes/Contact.jsx';
import AgIntro from './scenes/agentic/AgIntro.jsx';
import AgArch from './scenes/agentic/AgArch.jsx';
import AgAgents from './scenes/agentic/AgAgents.jsx';
import AgCases from './scenes/agentic/AgCases.jsx';
import AgDelivery from './scenes/agentic/AgDelivery.jsx';
import AgWhy from './scenes/agentic/AgWhy.jsx';
import { ClientHello, ClientSolutions, ClientPlan, ClientClose } from './scenes/client/ClientScenes.jsx';
import './deck.css';
import './agentic.css';
import './client.css';
import './client-live.css';

// el lienzo 3D es lo más pesado del recorrido: se carga aparte
const DeckStage = lazy(() => import('./stage/DeckStage.jsx'));

const SCENES = {
  opening: Opening,
  world: World,
  sectors: Sectors,
  delivery: Delivery,
  platforms: Platforms,
  projects: Projects,
  contact: Contact,
  'ag-intro': AgIntro,
  'ag-arch': AgArch,
  'ag-agents': AgAgents,
  'ag-cases': AgCases,
  'ag-delivery': AgDelivery,
  'ag-why': AgWhy,
  'cl-hello': ClientHello,
  'cl-solutions': ClientSolutions,
  'cl-plan': ClientPlan,
  'cl-close': ClientClose,
};

/** Presentación de origen de cada recorrido (panel de fuentes). */
const TRACK_FILE = { mti: 'MTI_GROUP_Presentation_v.01', agentify: 'MTi_Group_IA_Agentiva_Recort_v.01', espol: 'Propuesta ESPOL · cifras de espol.edu.ec' };

/* ------------------------------------------------------------------ */
/* Capacidades del equipo                                              */
/* ------------------------------------------------------------------ */

/** ¿Hay WebGL? Lo decide el store una sola vez (la sonda libera su contexto). */
export const hasWebGL = () => useStore.getState().webgl;

/** Equipos modestos o móviles: menos partículas y menos resolución. */
function detectLowPower(quality) {
  if (quality === 'baja') return true;
  const cores = navigator.hardwareConcurrency ?? 8;
  const mem = navigator.deviceMemory ?? 8;
  const small = Math.min(window.innerWidth, window.innerHeight) < 700;
  return cores <= 4 || mem <= 4 || small;
}

/** Países que se iluminan en el globo, y desde qué paso. */
const COUNTRY_HIGHLIGHTS = [
  // sede
  { iso: 724, color: '#e6a817', fromStep: 0 },
  // oficinas
  { iso: 784, color: '#38bdf8', fromStep: 1 },
  { iso: 682, color: '#38bdf8', fromStep: 1 },
  { iso: 818, color: '#38bdf8', fromStep: 1 },
  { iso: 404, color: '#38bdf8', fromStep: 1 },
  { iso: 484, color: '#38bdf8', fromStep: 1 },
  { iso: 458, color: '#38bdf8', fromStep: 1 },
  { iso: 276, color: '#38bdf8', fromStep: 1 },
  // países con proyectos y sin oficina
  { iso: 634, color: '#f472b6', fromStep: 2 },
  { iso: 840, color: '#f472b6', fromStep: 2 },
  { iso: 704, color: '#f472b6', fromStep: 2 },
  { iso: 616, color: '#f472b6', fromStep: 2 },
  { iso: 250, color: '#f472b6', fromStep: 2 },
  { iso: 380, color: '#f472b6', fromStep: 2 },
  { iso: 120, color: '#f472b6', fromStep: 2 },
  { iso: 152, color: '#f472b6', fromStep: 2 },
  { iso: 32, color: '#f472b6', fromStep: 2 },
]

/** «13, 30, 31, 32» → «13, 30–32»: el pie no se desborda con capítulos largos. */
export function pageRanges(pages) {
  const out = [];
  [...pages].sort((a, b) => a - b).forEach((p) => {
    const last = out[out.length - 1];
    if (last && p === last[1] + 1) last[1] = p;
    else out.push([p, p]);
  });
  return out.map(([a, b]) => (a === b ? a : `${a}–${b}`)).join(', ');
}

/** Imagen de cada capítulo en el índice. */
const CHAPTER_THUMB = {
  opening: 'project-hospitalet',
  world: 'project-kafd',
  sectors: 'sector-smart-cities',
  delivery: 'service-integration',
  platforms: 'platform-thethings-dashboard',
  projects: 'project-aena',
  contact: 'project-navantia',
  'ag-intro': 'ag-case-frioteis',
  'ag-arch': 'ag-case-nautia',
  'ag-agents': 'ag-case-prisa',
  'ag-cases': 'ag-case-coplegal',
  'ag-delivery': 'ag-case-aspol',
  'ag-why': 'ag-case-sigi',
  'cl-hello': 'project-nsu',
  'cl-solutions': 'project-aena',
  'cl-plan': 'service-integration',
  'cl-close': 'project-kafd',
};

/* ================================================================== */

export default function Deck() {
  const lang = useStore((s) => s.lang);
  const deck = useMemo(() => localizeDeck(lang), [lang]);
  const track = useStore((s) => s.deckTrack);
  const CH = localizedChapters(deck, track);
  const ui = deck.DECK_UI;
  const onMain = track === DEFAULT_TRACK;
  const agUi = deck.AGENTIFY.UI;
  // espacio de un pre-cliente (panel «Reuniones»)
  const client = deck.CLIENTS?.[track] ?? null;
  const trackReturn = useStore((s) => s.deckTrackReturn);
  const toggleMeetings = useStore((s) => s.toggleMeetings);
  const campusLook = useStore((s) => s.campusLook);

  const chapter = useStore((s) => s.deckChapter);
  const step = useStore((s) => s.deckStep);
  const paused = useStore((s) => s.deckPaused);
  const motionEnabled = useStore((s) => s.motionEnabled);
  const indexOpen = useStore((s) => s.deckIndexOpen);
  const sourcesOpen = useStore((s) => s.deckSourcesOpen);
  const info = useStore((s) => s.deckInfo);
  const sel = useStore((s) => s.deckSel);
  const cityLive = useStore((s) => s.cityLive);
  const quality = useStore((s) => s.quality);

  const next = useStore((s) => s.deckNext);
  const prev = useStore((s) => s.deckPrev);
  const nextChapter = useStore((s) => s.deckNextChapter);
  const prevChapter = useStore((s) => s.deckPrevChapter);
  const goto = useStore((s) => s.deckGoto);
  const setSel = useStore((s) => s.setDeckSel);
  const openInfo = useStore((s) => s.openDeckInfo);
  const togglePause = useStore((s) => s.toggleDeckPause);
  const toggleIndex = useStore((s) => s.toggleDeckIndex);
  const toggleSources = useStore((s) => s.toggleDeckSources);
  const enterExplorer = useStore((s) => s.enterExplorer);
  const backToMain = useStore((s) => s.backToMainTrack);

  const current = CH[chapter] ?? CH[0];
  const Scene = SCENES[current.id] ?? Opening;
  const frozen = paused || !motionEnabled;
  const beat = beatFor(current.id, step);

  // la escena siguiente, para montarla antes de llegar (precarga)
  const upcoming = step < current.steps - 1 ? beatFor(current.id, step + 1) : CH[chapter + 1] ? beatFor(CH[chapter + 1].id, 0) : null;

  const [webgl] = useState(() => hasWebGL());
  const [contextLost, setContextLost] = useState(false);
  const [lowPower] = useState(() => detectLowPower(quality));
  const stageOk = webgl && !contextLost;

  useCityDirector(current.id, step);

  /* --- paralaje global: el puntero mueve las capas con profundidad --- */
  const root = useRef(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    let raf = 0;
    const move = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        el.style.setProperty('--px', ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
        el.style.setProperty('--py', ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
      });
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* --- al entrar, el foco vuelve al documento (no a la portada oculta) --- */
  useEffect(() => {
    const el = document.activeElement;
    if (el instanceof HTMLElement && !el.closest('.deck')) el.blur();
  }, []);

  /* --- transición de capítulo: barrido de luz ----------------------- */
  const [sweep, setSweep] = useState(0);
  const lastChapter = useRef(`${track}:${chapter}`);
  useEffect(() => {
    const key = `${track}:${chapter}`;
    if (lastChapter.current !== key) {
      lastChapter.current = key;
      setSweep((n) => n + 1);
    }
  }, [track, chapter]);

  /* --- teclado ------------------------------------------------------- */
  useEffect(() => {
    const onKey = (e) => {
      const el = e.target;
      if (el instanceof HTMLElement && (el.matches('input, textarea, select') || el.isContentEditable)) return;
      const onButton = el instanceof HTMLElement && el.matches('button, a, [role="button"]') && Boolean(el.closest('.deck'));
      const s = useStore.getState();
      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault();
          next();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          prev();
          break;
        case 'ArrowDown':
          e.preventDefault();
          nextChapter();
          break;
        case 'ArrowUp':
          e.preventDefault();
          prevChapter();
          break;
        case 'Home':
          goto(0, 0);
          break;
        case 'End':
          goto(CH.length - 1, CH[CH.length - 1].steps - 1);
          break;
        case ' ':
          if (onButton) break;
          e.preventDefault();
          next();
          break;
        case 'Escape':
          e.preventDefault();
          if (s.deckInfo) openInfo(null);
          else if (s.deckSourcesOpen) toggleSources();
          else toggleIndex();
          break;
        case 'f':
        case 'F':
          if (!onButton) toggleSources();
          break;
        case 'p':
        case 'P':
          if (!onButton) togglePause();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, nextChapter, prevChapter, goto, openInfo, toggleIndex, toggleSources, togglePause, CH]);

  /* --- rueda y gesto: avanzan paso a paso, nunca solos ---------------- */
  useEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    let acc = 0;
    let lockUntil = 0;
    const canScroll = (target, dy) => {
      let n = target instanceof Element ? target : null;
      while (n && n !== el) {
        if (n.scrollHeight > n.clientHeight + 2) {
          const style = getComputedStyle(n);
          if (/(auto|scroll)/.test(style.overflowY)) {
            if (dy > 0 && n.scrollTop + n.clientHeight < n.scrollHeight - 1) return true;
            if (dy < 0 && n.scrollTop > 0) return true;
          }
        }
        n = n.parentElement;
      }
      return false;
    };
    const onWheel = (e) => {
      if (useStore.getState().deckIndexOpen || useStore.getState().deckSourcesOpen) return;
      if (canScroll(e.target, e.deltaY)) return;
      e.preventDefault();
      const now = performance.now();
      if (now < lockUntil) return;
      acc += e.deltaY;
      if (Math.abs(acc) > 60) {
        if (acc > 0) next();
        else prev();
        acc = 0;
        lockUntil = now + 850;
      }
    };
    let start = null;
    const onTouchStart = (e) => {
      const t = e.touches[0];
      // sobre el globo, el gesto es para girarlo
      if (e.target instanceof HTMLCanvasElement && useStore.getState().deckTrack === DEFAULT_TRACK && useStore.getState().deckChapter === 1) return;
      start = { x: t.clientX, y: t.clientY, at: performance.now() };
    };
    const onTouchEnd = (e) => {
      if (!start) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      const quick = performance.now() - start.at < 700;
      start = null;
      if (!quick) return;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        if (dx < 0) next();
        else prev();
      } else if (Math.abs(dy) > 80 && Math.abs(dy) > Math.abs(dx) * 1.5 && !canScroll(e.target, -dy)) {
        if (dy < 0) next();
        else prev();
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [next, prev]);

  /* --- selección del globo: al elegir, pasa al paso de exploración --- */
  const onPlace = useCallback(
    (id) => {
      const s = useStore.getState();
      s.setDeckSel('place', s.deckSel.place === id ? null : id);
      if (s.deckTrack === DEFAULT_TRACK && s.deckChapter === 1 && s.deckStep < 3) s.deckGoto(1, 3);
    },
    []
  );

  const totalSteps = CH.reduce((n, c) => n + c.steps, 0);
  const doneSteps = CH.slice(0, chapter).reduce((n, c) => n + c.steps, 0) + step + 1;
  const atEnd = chapter === CH.length - 1 && step === current.steps - 1;
  const cover = cityLive ? beat.cover ?? 0.25 : 1;

  const stageProps = {
    station: stageOk ? beat.stage : null,
    nextStation: stageOk ? upcoming?.stage ?? null : null,
    chapterId: current.id,
    // algunos pasos llevan su propia secuencia 3D (p. ej. Entrega empieza con un diagrama)
    step: beat.stageStep ?? step,
    sel,
    paused: frozen,
    lowPower,
    onContextLost: () => setContextLost(true),
    globe: {
      places: deck.PLACES,
      kinds: Object.fromEntries(Object.entries(deck.PLACE_KINDS).map(([k, v]) => [k, v])),
      selectedId: sel.place ?? null,
      onSelect: onPlace,
      countryHighlights: COUNTRY_HIGHLIGHTS,
    },
    build: { labels: current.id === 'delivery' ? buildLabels(deck, step - 1, BUILD_TAG_POS) : [] },
    orch: orchProps(deck, current.id, step, sel, beat),
    campus: client
      ? {
          url: client.campus,
          look: campusLook,
          lowPower,
          mode: beat.campus === 'solution' ? client.solutions[step]?.mode ?? 'overview' : beat.campus ?? 'overview',
        }
      : null,
    flow: {
      labels: current.id === 'platforms' ? flowLabels(deck) : [],
      agents: deck.AGENTS,
      selectedAgent: sel.agent ?? null,
      onAgent: (id) => setSel('agent', id),
    },
  };

  const needsFallback = !stageOk && current.id === 'world';
  const brandTitle = client ? client.ui.title : onMain ? ui.title : agUi.title;
  const brandSub = client ? client.ui.subtitle : onMain ? ui.subtitle : agUi.subtitle;

  // la miga de la cabecera: vuelve a donde se vino (otro recorrido o un cliente);
  // en un cliente abierto desde «Reuniones», vuelve al panel
  const returnName = trackReturn ? deck.CLIENTS?.[trackReturn.track]?.ui.title ?? (trackReturn.track === DEFAULT_TRACK ? agUi.backToMti : null) : null;
  const crumb = returnName
    ? { label: returnName, title: returnName, go: backToMain }
    : client
      ? { label: client.ui.back, title: client.ui.backLong, go: () => toggleMeetings(true) }
      : !onMain
        ? { label: agUi.backToMti, title: agUi.backToMtiLong, go: backToMain }
        : null;

  return (
    <DeckContext.Provider value={deck}>
      <div
        ref={root}
        className={`deck${frozen ? ' deck--still' : ''}${cityLive ? ' deck--city' : ''}${client ? ' deck--client' : ''}`}
        data-chapter={current.id}
        data-track={track}
        style={client ? { '--cover': cover, '--cl-navy': client.colors.navy, '--cl-blue': client.colors.blue, '--cl-sky': client.colors.sky } : { '--cover': cover }}
      >
        <div className="deck__bg" aria-hidden="true">
          <span className="deck__glow deck__glow--a" />
          <span className="deck__glow deck__glow--b" />
          <span className="deck__grid" />
        </div>
        <div className="deck__veil" aria-hidden="true" />

        {stageOk && (
          <Suspense fallback={null}>
            <DeckStage {...stageProps} />
          </Suspense>
        )}

        <div className="deck__vignette" aria-hidden="true" />
        <div className="deck__sweep" key={sweep} aria-hidden="true" />

        {/* ---------------- escena ---------------- */}
        <main className="deck__scene" key={`${track}:${current.id}`}>
          <Scene
            step={step}
            paused={frozen}
            sel={sel}
            setSel={setSel}
            goto={goto}
            openInfo={openInfo}
            fallback={needsFallback ? <FlatGlobe deck={deck} step={step} sel={sel} onSelect={onPlace} /> : null}
          />
        </main>

        {/* imagen aérea de la vista «Satélite»: atribución obligatoria */}
        {client && campusLook === 'satellite' && beat.stage === 'campus' && (
          <p className="cl-attrib">Imagen aérea: Esri, Maxar, Earthstar Geographics · Campus: © OpenStreetMap</p>
        )}

        {/* ---------------- cabecera ---------------- */}
        <header className="deck__top">
          <div className="deck__brand">
            <img src="/brand/logo-mti.png" alt="MTi · Mingo Things" />
            {client && <img className="deck__brand-client" src={client.logo} alt={client.name} />}
            <span className="deck__brand-name">
              {brandTitle}
              <em>{brandSub}</em>
            </span>
            {crumb && (
              <button className="deck__crumb" onClick={crumb.go} title={crumb.title}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 12H5M11 18l-6-6 6-6" />
                </svg>
                <span>{crumb.label}</span>
              </button>
            )}
          </div>

          <nav className="deck__chapters" aria-label={ui.index}>
            {CH.map((c, i) => {
              const fill = i < chapter ? 1 : i === chapter ? (step + 1) / c.steps : 0;
              return (
                <button
                  key={c.id}
                  className={`deck__chapter${i === chapter ? ' active' : ''}${i < chapter ? ' done' : ''}`}
                  onClick={() => goto(i, 0)}
                  title={`${ui.chapter} ${c.num} · ${c.label}`}
                  aria-current={i === chapter ? 'step' : undefined}
                >
                  <span className="deck__chapter-num">{c.num}</span>
                  <span className="deck__chapter-label">{c.short}</span>
                  <i style={{ transform: `scaleX(${fill})` }} />
                </button>
              );
            })}
          </nav>

          <div className="deck__tools">
            {client && <LookSwitch client={track} />}
            <button className={`deck__tool${paused ? ' active' : ''}`} onClick={togglePause} title={`${paused ? ui.play : ui.pause} (P)`} aria-pressed={paused}>
              <Icon name={paused ? 'play' : 'gauge'} />
            </button>
            <button className="deck__tool" onClick={toggleIndex} title={`${ui.index} (Esc)`}>
              <Icon name="grid" />
            </button>
            {webgl && (
              <button className="deck__cta" onClick={enterExplorer}>
                <Icon name="city" />
                <span>{ui.explore}</span>
              </button>
            )}
          </div>
        </header>

        {/* ---------------- pie de navegación ---------------- */}
        <footer className="deck__bottom">
          <div className="deck__where">
            <strong>
              {current.num} · {current.label}
            </strong>
            <span>
              {ui.step} {step + 1} {ui.of} {current.steps}
            </span>
          </div>

          <div className="deck__nav">
            <button className="deck__navbtn" onClick={prev} disabled={chapter === 0 && step === 0} aria-label={ui.prev} title={`${ui.prev} (←)`}>
              <svg viewBox="0 0 24 24">
                <path d="M19 12H5M11 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="deck__dots" role="group" aria-label={ui.step}>
              {Array.from({ length: current.steps }, (_, i) => (
                <button key={i} className={`deck__dot${i === step ? ' active' : ''}${i < step ? ' done' : ''}`} onClick={() => goto(chapter, i)} aria-label={`${ui.step} ${i + 1}`} />
              ))}
            </div>
            <button className="deck__navbtn deck__navbtn--next" onClick={next} disabled={atEnd} aria-label={ui.next} title={`${ui.next} (→)`}>
              <svg viewBox="0 0 24 24">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>

          <div className="deck__meta">
            <button className="deck__sources" onClick={toggleSources} title={`${ui.sources} (F)`}>
              <Icon name="doc" />
              <span>{client ? new URL(client.web).hostname : `${ui.sourcePage} ${pageRanges(current.src)}`}</span>
            </button>
            <span className="deck__hint">{ui.scrollHint}</span>
          </div>

          <div className="deck__progress" aria-hidden="true">
            <i style={{ transform: `scaleX(${doneSteps / totalSteps})` }} />
          </div>
        </footer>

        {info && <InfoDrawer info={info} onClose={() => openInfo(null)} />}
        {indexOpen && <DeckIndex deck={deck} track={track} chapter={chapter} onPick={goto} onClose={toggleIndex} />}
        {sourcesOpen && <DeckSources deck={deck} track={track} chapter={chapter} onClose={toggleSources} />}
        {!webgl && <p className="deck__webgl">{ui.webglOff}</p>}
      </div>
    </DeckContext.Provider>
  );
}

/* ================================================================== */
/* Escena del orquestador (Agentify AI)                                */
/* ================================================================== */

/** Qué enseña el orquestador en cada paso: modo, agente al frente y agentes encendidos. */
function orchProps(deck, chapterId, step, sel, beat) {
  const ag = deck.AGENTIFY;
  let focusAgent = null;
  let litAgents = [];
  if (chapterId === 'ag-agents') focusAgent = step > 0 ? ag.AGENTS[step - 1]?.id ?? null : sel.agent ?? null;
  if (chapterId === 'ag-cases' && step === 0 && sel.agentFilter) litAgents = [sel.agentFilter];
  return {
    mode: beat.orch ?? 'idle',
    agents: ag.AGENTS,
    focusAgent,
    litAgents,
    inputs: ag.ARCH.inputs,
    outputs: ag.ARCH.outputs,
    core: ag.ARCH.core,
    ring: ag.ARCH.ring,
  };
}

/* ================================================================== */
/* Globo plano: alternativa sin WebGL                                  */
/* ================================================================== */

function FlatGlobe({ deck, step, sel, onSelect }) {
  const x = (lon) => ((lon + 180) / 360) * 1000;
  const y = (lat) => ((85 - lat) / 145) * 480;
  const hq = deck.PLACES.find((p) => p.kind === 'sede');
  const shown = deck.PLACES.filter((p) => p.kind === 'sede' || (p.kind !== 'proyecto' ? step >= 1 : step >= 2));
  return (
    <svg className="flatglobe" viewBox="0 0 1000 480" role="img" aria-label={deck.WORLD.title.join(' ')}>
      {shown
        .filter((p) => p.id !== hq.id)
        .map((p) => (
          <path
            key={`a${p.id}`}
            d={`M ${x(hq.lon)} ${y(hq.lat)} Q ${(x(hq.lon) + x(p.lon)) / 2} ${Math.min(y(hq.lat), y(p.lat)) - 60} ${x(p.lon)} ${y(p.lat)}`}
            style={{ stroke: deck.PLACE_KINDS[p.kind]?.color }}
            className="flatglobe__arc"
          />
        ))}
      {shown.map((p) => (
        <g key={p.id} onClick={() => onSelect(p.id)} className="flatglobe__pin" role="button" tabIndex={0} aria-label={p.name} onKeyDown={(e) => e.key === 'Enter' && onSelect(p.id)}>
          <circle cx={x(p.lon)} cy={y(p.lat)} r={sel.place === p.id ? 9 : 6} style={{ fill: deck.PLACE_KINDS[p.kind]?.color }} />
          <circle cx={x(p.lon)} cy={y(p.lat)} r="16" className="flatglobe__hit" />
        </g>
      ))}
    </svg>
  );
}

/* ================================================================== */
/* Más información                                                     */
/* ================================================================== */

function InfoDrawer({ info, onClose }) {
  const deck = React.useContext(DeckContext);
  const ui = deck.DECK_UI;
  let title = '';
  let body = null;

  if (info.kind === 'division') {
    const d = deck.OPENING.divisions.find((x) => x.id === info.id);
    title = d?.title;
    body = (
      <>
        <p className="info__lead">{d?.body}</p>
        <p>{deck.OPENING.about}</p>
        <p className="info__note">{deck.OPENING.aboutNote}</p>
        <div className="info__chips">{d?.tags.map((t) => <span key={t}>{t}</span>)}</div>
      </>
    );
  } else if (info.kind === 'sector') {
    const s = deck.SECTORS.find((x) => x.id === info.id);
    title = s?.title;
    body = (
      <>
        <p className="info__lead">{s?.problem}</p>
        <p>{s?.body}</p>
        <div className="info__chips">{s?.tags.map((t) => <span key={t}>{t}</span>)}</div>
      </>
    );
  } else if (info.kind === 'feature') {
    const f = deck.SERVICE_FEATURES.find((x) => x.id === info.id);
    title = f?.title;
    body = (
      <>
        <p className="info__lead">{f?.lead}</p>
        <div className="info__chips">{f?.chips.map((t) => <span key={t}>{t}</span>)}</div>
        <p className="info__claim">{f?.claim}</p>
        <p className="info__note">{f?.footer}</p>
        <p className="info__note">{f?.vendors}</p>
      </>
    );
  } else if (info.kind === 'platform') {
    const p = deck.PLATFORMS.find((x) => x.id === info.id);
    title = p?.name;
    body = (
      <>
        <p className="info__claim">{p?.claim}</p>
        <p className="info__lead">{p?.body}</p>
        <ul className="info__list">{p?.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
        <p className="info__note">{p?.best}</p>
        {info.id === 'agentic' && (
          <div className="info__agents">
            {deck.AGENTS.map((a) => (
              <div key={a.id}>
                <MtiIcon name={`agent-${a.id}`} />
                <strong>
                  {a.id} · {a.title}
                </strong>
                <p>{a.body}</p>
              </div>
            ))}
          </div>
        )}
      </>
    );
  } else if (info.kind === 'project') {
    const p = deck.PROJECTS.find((x) => x.id === info.id);
    title = p?.title;
    body = (
      <>
        <p className="info__lead">{p?.solution}</p>
        {p?.extra && <p className="info__claim">{p.extra}</p>}
      </>
    );
  }

  return (
    <div className="info" role="dialog" aria-label={title}>
      <div className="info__scrim" onClick={onClose} />
      <aside className="info__panel" data-scrollable>
        <button className="info__close" onClick={onClose} aria-label={ui.close}>
          ×
        </button>
        <span className="info__kicker">{ui.more}</span>
        <h2>{title}</h2>
        {body}
      </aside>
    </div>
  );
}

/* ================================================================== */
/* Índice                                                              */
/* ================================================================== */

function IndexCard({ c, i, active, onPick }) {
  const deck = React.useContext(DeckContext);
  return (
    <button className={`idx-card${active ? ' is-active' : ''}`} onClick={() => onPick(i, 0)} style={{ '--i': i }}>
      <Photo id={CHAPTER_THUMB[c.id]} className="idx-card__photo" sizes="320px" />
      <span className="idx-card__num">{c.num}</span>
      <strong>{c.label}</strong>
      <em>
        {c.steps} · {deck.DECK_UI.sourcePage} {pageRanges(c.src)}
      </em>
    </button>
  );
}

function DeckIndex({ deck, track, chapter, onPick, onClose }) {
  const ui = deck.DECK_UI;
  const openTrack = useStore((s) => s.openTrack);
  const backToMain = useStore((s) => s.backToMainTrack);
  // qué recorrido se está mirando en el índice (puede no ser el activo)
  const [view, setView] = useState(track);
  const tracks = [{ id: DEFAULT_TRACK, name: ui.title }, ...deck.SERVICE_TRACKS.map((t) => ({ id: t.id, name: t.name }))];
  const trackReturn = useStore((s) => s.deckTrackReturn);
  // el cliente abierto (o del que se viene) también tiene su pestaña
  const clientId = deck.CLIENTS?.[track] ? track : deck.CLIENTS?.[trackReturn?.track] ? trackReturn.track : null;
  if (clientId) tracks.unshift({ id: clientId, name: deck.CLIENTS[clientId].ui.title });
  const list = localizedChapters(deck, view);
  const pick = (i, step) => {
    if (view === track) onPick(i, step);
    else if (view === (trackReturn?.track ?? DEFAULT_TRACK)) {
      backToMain();
      onPick(i, step);
    } else openTrack(view, i, step);
  };
  return (
    <div className="dmodal" role="dialog" aria-label={ui.index}>
      <div className="dmodal__scrim" onClick={onClose} />
      <div className="dmodal__panel dmodal__panel--wide" data-scrollable>
        <header>
          <h2>{ui.index}</h2>
          <MeetingsButton className="meet-btn--index" />
          <button onClick={onClose} aria-label={ui.close}>
            ×
          </button>
        </header>
        <nav className="idx-tracks" aria-label={ui.tracksTitle}>
          {tracks.map((t) => (
            <button key={t.id} className={t.id === view ? 'is-active' : ''} onClick={() => setView(t.id)} aria-pressed={t.id === view}>
              {t.name}
              {t.id === track && <i aria-hidden="true" />}
            </button>
          ))}
        </nav>
        <div className="idx-grid" key={view}>
          {list.map((c, i) => (
            <IndexCard key={c.id} c={c} i={i} active={view === track && i === chapter} onPick={pick} />
          ))}
        </div>
        <p className="dmodal__hint">{ui.keyboard}</p>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Fuentes y revisión editorial                                        */
/* ================================================================== */

/**
 * Herramienta interna para quien prepara la reunión: de qué página del PDF
 * sale cada capítulo y qué queda por confirmar. Está detrás de una tecla.
 */
function DeckSources({ deck, track, chapter, onClose }) {
  const ui = deck.DECK_UI;
  const reviews = useMemo(() => {
    const assetReviews = PRESENTATION_ASSETS.filter((a) => a.review).map((a) => ({ path: a.id, title: `${a.folder}/${a.name}`, note: a.review, src: [a.slide] }));
    return [...pendingReviews(deck), ...assetReviews];
  }, [deck]);
  const chapters = localizedChapters(deck, track);
  const current = chapters[chapter] ?? chapters[0];

  return (
    <div className="dmodal" role="dialog" aria-label={ui.sources}>
      <div className="dmodal__scrim" onClick={onClose} />
      <div className="dmodal__panel" data-scrollable>
        <header>
          <h2>{ui.sources}</h2>
          <button onClick={onClose} aria-label={ui.close}>
            ×
          </button>
        </header>
        <p className="dmodal__lead">
          {TRACK_FILE[track] ?? TRACK_FILE.mti} · {ui.chapter} {current.num} · {ui.sourcePage} {pageRanges(current.src)}
        </p>
        <table className="srctable">
          <tbody>
            {chapters.map((c) => (
              <tr key={c.id} className={c.id === current.id ? 'active' : ''}>
                <td>{c.num}</td>
                <td>{c.label}</td>
                <td>{pageRanges(c.src)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {reviews.length > 0 && (
          <>
            <h3 className="srctable__title">
              {ui.reviewTitle} ({reviews.length})
            </h3>
            <ul className="reviewlist">
              {reviews.map((r) => (
                <li key={r.path}>
                  <strong>{r.title}</strong>
                  <p>{r.note}</p>
                  {r.src && <em>{`${ui.sourcePage} ${r.src.join(', ')}`}</em>}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

