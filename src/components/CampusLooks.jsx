import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../store.js';

/**
 * Estilos del campus del cliente (ver CampusStation): se eligen al abrir la
 * reunión desde «Reuniones» y se pueden cambiar en cualquier momento desde la
 * cabecera del espacio cliente.
 *
 * La vista previa es una captura real de cada estilo
 * (`public/clients/<id>/looks/<estilo>.webp`); si no existe, un degradado.
 */

export const LOOKS = [
  { id: 'holo', es: ['Holográfico', 'Estética MTi: vidrio y luz'], en: ['Holographic', 'MTi look: glass and light'], bg: 'linear-gradient(135deg,#0b1a33,#0073b6 60%,#24aeff)' },
  { id: 'satellite', es: ['Satélite', 'Imagen aérea real'], en: ['Satellite', 'Real aerial imagery'], bg: 'linear-gradient(135deg,#3f5d3a,#7d8f6a 50%,#c9c2b0)' },
  { id: 'model', es: ['Maqueta', 'Blanco arquitectónico'], en: ['Model', 'Architectural white'], bg: 'linear-gradient(135deg,#ffffff,#dfe5ec 60%,#b8c3d1)' },
  { id: 'map', es: ['Mapa', 'Calles, parques y agua'], en: ['Map', 'Streets, parks and water'], bg: 'linear-gradient(135deg,#f4f0e8,#c5e4b3 55%,#a4d0e4)' },
];

const lookText = (l, lang) => l[lang] ?? l.es;

function Preview({ client, look }) {
  const [ok, setOk] = useState(true);
  const src = `/clients/${client}/looks/${look.id}.webp`;
  return (
    <span className="look__img" style={{ background: look.bg }}>
      {ok && <img src={src} alt="" onError={() => setOk(false)} loading="lazy" />}
    </span>
  );
}

/** Rejilla grande de estilos (panel «Reuniones», antes de empezar). */
export function LookGrid({ client, value, onChange }) {
  const lang = useStore((s) => s.lang);
  return (
    <div className="looks" role="radiogroup">
      {LOOKS.map((l, i) => {
        const [name, sub] = lookText(l, lang);
        return (
          <button
            key={l.id}
            className={`look${value === l.id ? ' is-on' : ''}`}
            role="radio"
            aria-checked={value === l.id}
            onClick={() => onChange(l.id)}
            style={{ '--i': i }}
          >
            <Preview client={client} look={l} />
            <span className="look__text">
              <b>{name}</b>
              <em>{sub}</em>
            </span>
            <i className="look__check" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}

/** Botón de la cabecera del espacio cliente: cambia el estilo sobre la marcha. */
export function LookSwitch({ client }) {
  const lang = useStore((s) => s.lang);
  const look = useStore((s) => s.campusLook);
  const setLook = useStore((s) => s.setCampusLook);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    window.addEventListener('pointerdown', close);
    return () => window.removeEventListener('pointerdown', close);
  }, [open]);
  const current = LOOKS.find((l) => l.id === look) ?? LOOKS[0];
  const title = lang === 'en' ? 'Campus view' : 'Vista del campus';
  return (
    <div className="lookswitch" ref={ref}>
      <button className="lookswitch__btn" onClick={() => setOpen((v) => !v)} aria-expanded={open} title={title}>
        <span className="lookswitch__dot" style={{ background: current.bg }} />
        <span>{lookText(current, lang)[0]}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="lookswitch__menu" role="menu" aria-label={title}>
          <span className="lookswitch__title">{title}</span>
          {LOOKS.map((l) => {
            const [name, sub] = lookText(l, lang);
            return (
              <button
                key={l.id}
                role="menuitemradio"
                aria-checked={look === l.id}
                className={look === l.id ? 'is-on' : ''}
                onClick={() => {
                  setLook(l.id);
                  setOpen(false);
                }}
              >
                <Preview client={client} look={l} />
                <span>
                  <b>{name}</b>
                  <em>{sub}</em>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
