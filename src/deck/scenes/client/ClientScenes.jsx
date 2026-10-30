import React, { useEffect, useState } from 'react';
import { Kicker, Headline, Counter, Icon, MtiIcon, Photo, useDeck, useGlider, projectPhotoId } from '../../parts.jsx';
import FlowDiagram from '../../FlowDiagram.jsx';
import CampusDash from './CampusDash.jsx';
import { PROJECT_ORDER } from '../../choreography.js';
import { chapterIndex } from '../../../data/tracks.js';
import { useStore } from '../../../store.js';

/**
 * Espacio cliente · escenas genéricas (`cl-*`).
 *
 * Sirven para cualquier pre-cliente: el contenido sale de
 * `deck.CLIENTS[track]` (p. ej. src/data/clients/espol.js) y el decorado es su
 * campus o recinto en 3D (CampusStation). Cuatro capítulos:
 *
 *   cl-hello      0 portada «MTi × cliente» con sus cifras · 1 el campus
 *   cl-solutions  una solución por paso: primero el campus animado y el
 *                 titular; luego, el esquema grande y los ejemplos reales
 *   cl-plan       del piloto a todo el campus
 *   cl-close      siguiente paso y saltos al resto de MTi
 */

export function useClient() {
  const deck = useDeck();
  const track = useStore((s) => s.deckTrack);
  return deck.CLIENTS?.[track] ?? null;
}

/** «MTi × ESPOL»: los dos logos se encuentran en el centro. */
export function Lockup({ client, size = 'l' }) {
  return (
    <div className={`cl-lockup cl-lockup--${size}`}>
      <img className="cl-lockup__mti" src="/brand/logo-mti.png" alt="MTi" />
      <span className="cl-lockup__x" aria-hidden="true">
        ×
      </span>
      <img className="cl-lockup__client" src={client.logo} alt={client.name} />
    </div>
  );
}

/* ================================================================== */
/* Enlaces a ejemplos reales de MTi                                    */
/* ================================================================== */

const KIND_ICON = { city: 'city', project: 'route', case: 'ai', agent: 'ai' };

/** Resuelve un enlace a su destino real; si el destino no existe, no se pinta. */
function useLinkTarget(link) {
  const deck = useDeck();
  const solutions = useStore((s) => s.solutions);
  const webgl = useStore((s) => s.webgl);
  const jump = useStore((s) => s.jumpToSolution);
  const openTrack = useStore((s) => s.openTrack);
  const ag = deck.AGENTIFY;
  switch (link.kind) {
    case 'city': {
      const sol = solutions.find((s) => s.id === link.id);
      if (!sol || !webgl) return null;
      return { go: () => jump(link.id), photo: null };
    }
    case 'project': {
      const i = PROJECT_ORDER.indexOf(link.id);
      if (i < 0) return null;
      return { go: () => openTrack('mti', chapterIndex('mti', 'projects'), i + 1), photo: projectPhotoId(link.id) };
    }
    case 'case': {
      const i = ag.CASES.findIndex((c) => c.id === link.id);
      if (i < 0) return null;
      return { go: () => openTrack('agentify', chapterIndex('agentify', 'ag-cases'), i + 1), photo: `ag-case-${link.id}` };
    }
    case 'agent': {
      const i = ag.AGENTS.findIndex((a) => a.id === link.id);
      if (i < 0) return null;
      return { go: () => openTrack('agentify', chapterIndex('agentify', 'ag-agents'), i + 1), photo: null, icon: `ag-${link.id}` };
    }
    default:
      return null;
  }
}

function ClientLink({ link, kinds, i }) {
  const t = useLinkTarget(link);
  if (!t) return null;
  return (
    <button className="cl-link" onClick={t.go} style={{ '--i': i }}>
      <span className="cl-link__thumb">
        {t.photo ? <Photo id={t.photo} sizes="120px" /> : t.icon ? <MtiIcon name={t.icon} /> : <Icon name={KIND_ICON[link.kind]} />}
      </span>
      <span className="cl-link__text">
        <em>{kinds?.[link.kind]}</em>
        <b>{link.label}</b>
      </span>
      <svg className="cl-link__go" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </button>
  );
}

/* ================================================================== */
/* 1 · Bienvenida                                                      */
/* ================================================================== */

export function ClientHello({ step }) {
  const c = useClient();
  if (!c) return null;
  const h = c.hello;
  return (
    <div className="scene scene--client">
      {step === 0 && (
        <div className="cl-hero" key="hero">
          <Lockup client={c} />
          <Kicker>{h.kicker}</Kicker>
          <Headline parts={h.title} size="xl" as="h1" />
          <p className="scene-lead__line">{h.lead}</p>
          <ul className="cl-stats">
            {h.stats.map((s, i) => (
              <li key={s.label} style={{ '--i': i }}>
                <strong>
                  <Counter value={s.value} duration={1800} />
                </strong>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
          <p className="scene-note">{h.statsNote}</p>
        </div>
      )}

      {step === 1 && (
        <div className="scene-lead scene-lead--left cl-campus" key="campus">
          <Kicker>{h.campus.kicker}</Kicker>
          <Headline parts={h.campus.title} size="l" />
          <p className="scene-lead__line">{h.campus.line}</p>
          <ul className="cl-chips">
            {h.campus.chips.map((x, i) => (
              <li key={x} style={{ '--i': i }}>
                {x}
              </li>
            ))}
          </ul>
        </div>
      )}
      <CampusCaption client={c} />
    </div>
  );
}

function CampusCaption({ client }) {
  return (
    <p className="cl-caption">
      <img src={client.seal} alt="" aria-hidden="true" />
      <span>{client.ui.campusLabel}</span>
    </p>
  );
}

/* ================================================================== */
/* 2 · Soluciones                                                      */
/* ================================================================== */

// el campus se cuenta solo unos segundos antes de que entre el esquema
const FLOW_DELAY = 5200;

export function ClientSolutions({ step, paused, goto }) {
  const c = useClient();
  const chapter = useStore((s) => s.deckChapter);
  const sol = c?.solutions[step];
  // tiempos del paso: el titular sobre el campus → el panel en vivo (si la
  // solución lo tiene) o el esquema; el presentador cambia entre los dos
  const [view, setView] = useState('intro');
  const glider = useGlider(step);
  const hasDash = Boolean(sol?.dash && c?.ui.live);

  useEffect(() => {
    setView('intro');
    if (paused) return undefined;
    const id = setTimeout(() => setView(hasDash ? 'live' : 'flow'), FLOW_DELAY);
    return () => clearTimeout(id);
  }, [step, paused, hasDash]);

  if (!c || !sol) return null;
  const open = view !== 'intro';
  const links =
    sol.links?.length > 0 ? (
      <aside className={`cl-links${view === 'live' ? ' cl-links--side' : ''}`} key={`l-${sol.id}-${view}`}>
        <span className="cl-links__head">
          <i aria-hidden="true" />
          {c.ui.realExample}
        </span>
        <div className="cl-links__row">
          {sol.links.map((l, i) => (
            <ClientLink key={`${l.kind}-${l.id}`} link={l} kinds={c.ui.linkKinds} i={i} />
          ))}
        </div>
      </aside>
    ) : null;

  return (
    <div className={`scene scene--client cl-sol${open ? ' is-flow' : ''} cl-sol--${view}`}>
      <nav className="cl-rail has-glider" ref={glider} aria-label={c.solutionsMeta.rail}>
        {c.solutions.map((s, i) => (
          <button key={s.id} className={i === step ? 'is-active' : ''} onClick={() => goto(chapter, i)} aria-current={i === step ? 'step' : undefined}>
            <Icon name={s.icon} />
            <span>{s.tab}</span>
          </button>
        ))}
      </nav>

      <div className="cl-sol__title" key={`t-${sol.id}`}>
        <Kicker>{sol.kicker}</Kicker>
        <Headline parts={sol.title} size={open ? 'm' : 'xl'} />
        {!open && <p className="scene-lead__line">{sol.line}</p>}
      </div>

      {!open && (
        <button className="cl-sol__more dbtn dbtn--ghost" onClick={() => setView(hasDash ? 'live' : 'flow')} key={`m-${sol.id}`}>
          <Icon name={hasDash ? 'chart' : 'integration'} />
          <span>{hasDash ? c.ui.liveLabel : c.ui.howItWorks}</span>
        </button>
      )}

      {/* en vivo · cómo funciona */}
      {open && hasDash && (
        <div className="cl-views" role="tablist">
          <button role="tab" aria-selected={view === 'live'} className={view === 'live' ? 'is-on' : ''} onClick={() => setView('live')}>
            <i className="cl-views__dot" aria-hidden="true" />
            {c.ui.liveLabel}
          </button>
          <button role="tab" aria-selected={view === 'flow'} className={view === 'flow' ? 'is-on' : ''} onClick={() => setView('flow')}>
            <Icon name="integration" />
            {c.ui.howItWorks}
          </button>
        </div>
      )}

      {view === 'live' && <CampusDash kind={sol.dash} live={c.ui.live} paused={paused} key={`d-${sol.id}`} />}

      {view === 'flow' && (
        <section className="cl-sol__flow" key={`f-${sol.id}`}>
          <FlowDiagram {...sol.flow} labels={c.ui.flowLabels} paused={paused} size="lg" className="fd--xl fd--client" />
        </section>
      )}

      {open && links}
    </div>
  );
}

/* ================================================================== */
/* 3 · Plan                                                            */
/* ================================================================== */

export function ClientPlan() {
  const c = useClient();
  if (!c) return null;
  const p = c.plan;
  return (
    <div className="scene scene--client cl-plan">
      <div className="cl-plan__head">
        <Kicker>{p.kicker}</Kicker>
        <Headline parts={p.title} size="l" />
        <p className="scene-lead__line">{p.line}</p>
      </div>
      <ol className="cl-phases">
        {p.phases.map((ph, i) => (
          <li key={ph.title} style={{ '--i': i }}>
            <span className="cl-phases__dot">
              <Icon name={ph.icon} />
            </span>
            <span className="cl-phases__num">{String(i + 1).padStart(2, '0')}</span>
            <strong>{ph.title}</strong>
            <em>{ph.time}</em>
            <p>{ph.body}</p>
          </li>
        ))}
      </ol>
      <div className="cl-pilot">
        <span className="cl-pilot__tag">
          <i aria-hidden="true" />
          {p.pilot.title}
        </span>
        <p>{p.pilot.body}</p>
      </div>
      <p className="scene-note cl-plan__note">{p.note}</p>
    </div>
  );
}

/* ================================================================== */
/* 4 · Siguiente paso                                                  */
/* ================================================================== */

export function ClientClose() {
  const c = useClient();
  const deck = useDeck();
  const ui = deck.DECK_UI;
  const openTrack = useStore((s) => s.openTrack);
  const enterExplorer = useStore((s) => s.enterExplorer);
  const toggleMeetings = useStore((s) => s.toggleMeetings);
  const webgl = useStore((s) => s.webgl);
  if (!c) return null;
  const k = c.close;
  const contact = deck.CONTACT;
  return (
    <div className="scene scene--client cl-close">
      <div className="cl-close__main">
        <Lockup client={c} size="m" />
        <Kicker>{k.kicker}</Kicker>
        <Headline parts={k.title} size="xl" />
        <p className="scene-lead__line">{k.line}</p>
        <div className="cl-close__contact">
          <a href={`mailto:${contact.email}`}>
            <Icon name="mail" />
            {contact.email}
          </a>
          <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>
            <Icon name="phone" />
            {contact.phone}
          </a>
          <a href={contact.webUrl} target="_blank" rel="noreferrer">
            <Icon name="external" />
            {contact.web}
          </a>
        </div>
      </div>

      <div className="cl-close__more">
        <span className="cl-links__head">
          <i aria-hidden="true" />
          {k.explore}
        </span>
        <div className="cl-close__btns">
          <button className="dbtn dbtn--gold" onClick={() => openTrack('mti', 0, 0)}>
            <Icon name="play" />
            <span>{ui.title}</span>
          </button>
          {deck.SERVICE_TRACKS.map((t) => (
            <button key={t.id} className="dbtn dbtn--ghost" onClick={() => openTrack(t.id, 0, 0)}>
              <Icon name="ai" />
              <span>{t.name}</span>
            </button>
          ))}
          {webgl && (
            <button className="dbtn dbtn--ghost" onClick={enterExplorer}>
              <Icon name="city" />
              <span>{ui.explore}</span>
            </button>
          )}
          <button className="dbtn dbtn--ghost" onClick={() => toggleMeetings(true)}>
            <Icon name="people" />
            <span>{c.ui.back}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
