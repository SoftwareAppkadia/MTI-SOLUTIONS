import React, { useEffect, useState } from 'react';
import { useStore } from '../store.js';
import { CLIENT_SPACES } from '../data/clients/index.js';
import { ESPOL_EN } from '../data/clients/espol.en.js';
import { LookGrid } from './CampusLooks.jsx';
import './meetings.css';

/**
 * Reuniones · espacios de pre-clientes.
 *
 * Un botón arriba a la izquierda (portada, ciudad y presentación) abre un
 * cajón con las propuestas preparadas para cada reunión. Cada tarjeta entra
 * en el espacio del cliente: su campus en 3D y las soluciones de MTi que más
 * sentido tienen para él. Para añadir un cliente: src/data/clients/.
 */

// textos traducidos de la tarjeta (el resto de cada espacio lo traduce localizeDeck)
const CARD_EN = { espol: ESPOL_EN };

const TXT = {
  es: { title: 'Reuniones', lead: 'Propuestas preparadas para cada cliente.', open: 'Abrir propuesta', close: 'Cerrar', pick: '¿Cómo quieres ver el campus?', pickLead: 'Puedes cambiarlo durante la presentación.', start: 'Empezar presentación', back: 'Volver' },
  en: { title: 'Meetings', lead: 'Proposals prepared for each client.', open: 'Open proposal', close: 'Close', pick: 'How should the campus look?', pickLead: 'You can change it during the presentation.', start: 'Start presentation', back: 'Back' },
};

export function MeetingsButton({ className = '' }) {
  const lang = useStore((s) => s.lang);
  const toggle = useStore((s) => s.toggleMeetings);
  const t = TXT[lang] ?? TXT.es;
  return (
    <button className={`meet-btn ${className}`.trim()} onClick={() => toggle(true)} title={t.lead}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="18" height="15" rx="3" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </svg>
      <span>{t.title}</span>
      <i aria-hidden="true">{CLIENT_SPACES.length}</i>
    </button>
  );
}

export function MeetingsPanel() {
  const open = useStore((s) => s.meetingsOpen);
  const lang = useStore((s) => s.lang);
  const toggle = useStore((s) => s.toggleMeetings);
  const openClient = useStore((s) => s.openClient);
  const campusLook = useStore((s) => s.campusLook);
  const t = TXT[lang] ?? TXT.es;
  // segundo paso: el cliente elegido y la vista del campus
  const [picked, setPicked] = useState(null);
  const [look, setLook] = useState(campusLook);
  useEffect(() => {
    if (open) {
      setPicked(null);
      setLook(useStore.getState().campusLook);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        // el recorrido también escucha Esc (abre el índice): aquí solo se cierra el cajón
        e.stopImmediatePropagation();
        toggle(false);
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, toggle]);

  if (!open) return null;
  return (
    <div className="meet" role="dialog" aria-label={t.title}>
      <div className="meet__scrim" onClick={() => toggle(false)} />
      <aside className="meet__panel">
        <header className="meet__head">
          <span className="eyebrow">
            <i className="dot" /> MTi · {t.title}
          </span>
          <button className="meet__close" onClick={() => toggle(false)} aria-label={t.close}>
            ×
          </button>
        </header>
        {picked ? (
          <div className="meet__pick" key="pick">
            <button className="meet__back" onClick={() => setPicked(null)}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 12H5M11 18l-6-6 6-6" />
              </svg>
              {t.back}
            </button>
            <img className="meet__pick-logo" src={picked.logo} alt={picked.name} />
            <h2 className="meet__title meet__title--s">{t.pick}</h2>
            <p className="meet__lead">{t.pickLead}</p>
            <LookGrid client={picked.id} value={look} onChange={setLook} />
            <button className="meet__start" onClick={() => openClient(picked.id, look)}>
              {t.start}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        ) : (
          <>
        <h2 className="meet__title">{t.title}</h2>
        <p className="meet__lead">{t.lead}</p>

        <div className="meet__list">
          {CLIENT_SPACES.map((c, i) => {
            const tr = lang === 'en' ? { ...c, ...CARD_EN[c.id] } : c;
            return (
              <button
                key={c.id}
                className="meet-card"
                onClick={() => setPicked(c)}
                style={{ '--i': i, '--c1': c.colors.navy, '--c2': c.colors.blue, '--c3': c.colors.sky }}
              >
                <span className="meet-card__bg" aria-hidden="true">
                  <img src={c.seal} alt="" />
                </span>
                <span className="meet-card__top">
                  <img className="meet-card__logo" src={c.logo} alt={c.name} />
                  <em className="meet-card__status">{tr.status}</em>
                </span>
                <strong>{c.fullName}</strong>
                <span className="meet-card__place">{tr.place}</span>
                <span className="meet-card__meta">
                  <span>{tr.sector}</span>
                  <span>{tr.meeting}</span>
                </span>
                <span className="meet-card__go">
                  {t.open}
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </button>
            );
          })}
        </div>
          </>
        )}
      </aside>
    </div>
  );
}
