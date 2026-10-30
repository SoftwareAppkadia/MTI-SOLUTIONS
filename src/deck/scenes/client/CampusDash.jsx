import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '../../parts.jsx';
import { CAMPUS_LIVE, co2, co2Status, temp, hum, occ, kw, campusKw, effPhase, intensity, dayCurve } from '../../stage/campusLive.js';

/**
 * Panel «en vivo» del espacio cliente: consumo, sensórica y eficiencia.
 *
 * Lee las mismas funciones que tiñen el campus 3D (campusLive.js) con el reloj
 * que publica la estación, así lo que salta aquí es lo que se ve en el campus.
 * Todo es SIMULADO y se rotula así: no son datos del cliente ni resultados.
 */

/** Reloj de la escena (o el propio, si la estación aún no ha publicado) a ~6 Hz. */
function useLiveClock(paused) {
  const [t, setT] = useState(() => CAMPUS_LIVE.t);
  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => setT(CAMPUS_LIVE.t || performance.now() / 1000), 160);
    return () => clearInterval(id);
  }, [paused]);
  return t;
}

/** Guarda las últimas `n` lecturas de una serie. */
function useSeries(value, n = 48) {
  const ref = useRef([]);
  const last = ref.current[ref.current.length - 1];
  if (last !== value) {
    ref.current = [...ref.current, value].slice(-n);
  }
  return ref.current;
}

function Spark({ values, min, max, color = '#24aeff', height = 46, fill = true }) {
  if (values.length < 2) return <svg className="cdash__spark" viewBox="0 0 100 40" />;
  const lo = min ?? Math.min(...values);
  const hi = max ?? Math.max(...values);
  const span = hi - lo || 1;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * 100, 38 - ((v - lo) / span) * 34]);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  return (
    <svg className="cdash__spark" viewBox="0 0 100 40" preserveAspectRatio="none" style={{ height }}>
      {fill && <path d={`${d} L100 40 L0 40 Z`} fill={color} opacity="0.14" />}
      <path d={d} fill="none" stroke={color} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.2" fill={color} />
    </svg>
  );
}

const STATUS_COLOR = { ok: '#22c55e', warn: '#f59e0b', alert: '#ef4444' };
const heatColor = (v) => (v < 0.35 ? '#22c55e' : v < 0.6 ? '#a3e635' : v < 0.8 ? '#f59e0b' : '#ef4444');
const short = (name) => name.replace(/,.*$/, '').replace(/ - /, ' · ');

/* ------------------------------------------------------------------ */

function EnergyDash({ L, t }) {
  const now = campusKw(t);
  const series = useSeries(now);
  const top = CAMPUS_LIVE.rooms
    .map((r) => ({ ...r, v: kw(r.i, t, r.area) }))
    .sort((a, b) => b.v - a.v)
    .slice(0, 5);
  const max = top[0]?.v || 1;
  const uses = [58 + Math.round(Math.sin(t * 0.2) * 3), 22, 20 - Math.round(Math.sin(t * 0.2) * 3)];
  return (
    <>
      <div className="cdash__hero">
        <span>{L.now}</span>
        <strong>
          {now.toLocaleString('es-ES')}
          <small> {L.unit ?? 'kW'}</small>
        </strong>
        <Spark values={series} color="#e6a817" />
      </div>
      <h4>{L.top}</h4>
      <ul className="cdash__bars">
        {top.map((r, k) => (
          <li key={r.i} style={{ '--i': k }}>
            <span>{short(r.name)}</span>
            <i style={{ transform: `scaleX(${r.v / max})` }} />
            <b>{r.v} kW</b>
          </li>
        ))}
      </ul>
      <div className="cdash__uses">
        {uses.map((u, k) => (
          <span key={k} style={{ flexGrow: u, '--c': ['#e6a817', '#24aeff', '#94a3b8'][k] }}>
            <b>{u}%</b>
            {L.uses[k]}
          </span>
        ))}
      </div>
    </>
  );
}

function SensorsDash({ L, t }) {
  const rooms = CAMPUS_LIVE.rooms.slice(0, 7);
  // el aula del panel va cambiando: primero la que peor aire tiene
  const pick = rooms.length ? rooms.reduce((a, r) => (co2(r.i, t) > co2(a.i, t) ? r : a), rooms[0]) : null;
  const room = pick ?? { i: 0, name: '—' };
  const ppm = co2(room.i, t);
  const st = co2Status(ppm);
  const series = useSeries(ppm);
  const tiles = [
    { k: 'co2', icon: 'air', v: ppm, unit: 'ppm', c: STATUS_COLOR[st] },
    { k: 'temp', icon: 'gauge', v: temp(room.i, t), unit: '°C' },
    { k: 'hum', icon: 'flood', v: hum(room.i, t), unit: '%' },
    { k: 'occ', icon: 'people', v: occ(room.i, t), unit: L.people },
  ];
  return (
    <>
      <div className="cdash__room">
        <span>{L.room}</span>
        <strong>{short(room.name)}</strong>
        <em className={`cdash__chip cdash__chip--${st}`}>{L.status[st]}</em>
      </div>
      <div className="cdash__tiles">
        {tiles.map((x) => (
          <div key={x.k} className="cdash__tile" style={{ '--c': x.c ?? '#24aeff' }}>
            <Icon name={x.icon} />
            <span>{L[x.k] ?? 'CO₂'}</span>
            <b>
              {x.v}
              <small> {x.unit}</small>
            </b>
          </div>
        ))}
      </div>
      <Spark values={series} color={STATUS_COLOR[st]} height={34} />
      {st !== 'ok' && (
        <p className="cdash__event" key={`${room.i}-${st}`}>
          <i />
          {L.status[st]} · {short(room.name)} → {L.action}
        </p>
      )}
      <h4>{L.list}</h4>
      <ul className="cdash__list">
        {rooms.map((r) => {
          const v = co2(r.i, t);
          const s = co2Status(v);
          return (
            <li key={r.i}>
              <i style={{ background: STATUS_COLOR[s] }} className={s !== 'ok' ? 'is-pulse' : ''} />
              <span>{short(r.name)}</span>
              <b>{v} ppm</b>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function EfficiencyDash({ L, t }) {
  const ph = effPhase(t);
  const before = dayCurve(false);
  const after = dayCurve(true);
  const cur = before.map((v, h) => v + (after[h] - v) * ph);
  const path = (arr) => arr.map((v, h) => `${h ? 'L' : 'M'}${((h / 23) * 100).toFixed(1)} ${(40 - v * 36).toFixed(1)}`).join(' ');
  const rank = CAMPUS_LIVE.rooms
    .slice(0, 12)
    .map((r) => ({ ...r, v: intensity(r.i, t) }))
    .sort((a, b) => b.v - a.v)
    .slice(0, 5);
  return (
    <>
      <div className="cdash__toggle" aria-hidden="true">
        <span className={ph < 0.5 ? 'is-on is-bad' : ''}>{L.before}</span>
        <span className={ph >= 0.5 ? 'is-on is-good' : ''}>{L.after}</span>
        <i style={{ transform: `translateX(${ph * 100}%)` }} />
      </div>
      <h4>{L.curve}</h4>
      <svg className="cdash__day" viewBox="0 0 100 42" preserveAspectRatio="none">
        <rect x="0" y="0" width={(7 / 23) * 100} height="42" className="cdash__night" />
        <rect x={(20 / 23) * 100} y="0" width={(3 / 23) * 100} height="42" className="cdash__night" />
        <path d={path(before)} className="cdash__before" />
        <path d={`${path(cur)} L100 42 L0 42 Z`} className="cdash__area" style={{ opacity: 0.12 + ph * 0.1 }} />
        <path d={path(cur)} className="cdash__now" style={{ stroke: ph > 0.5 ? '#22c55e' : '#f59e0b' }} />
      </svg>
      <div className="cdash__hours">
        <span>00h</span>
        <span>07h</span>
        <span>20h</span>
        <span>24h</span>
      </div>
      <ul className="cdash__actions">
        {L.actions.map((a, k) => (
          <li key={a} className={ph > (k + 1) / (L.actions.length + 1) ? 'is-done' : ''}>
            <i>
              <Icon name="check" />
            </i>
            {a}
          </li>
        ))}
      </ul>
      <h4>{L.rank}</h4>
      <ul className="cdash__bars cdash__bars--heat">
        {rank.map((r, k) => (
          <li key={r.i} style={{ '--i': k }}>
            <span>{short(r.name)}</span>
            <i style={{ transform: `scaleX(${r.v})`, background: heatColor(r.v) }} />
          </li>
        ))}
      </ul>
      <div className="cdash__legend">
        <span>{L.low}</span>
        <i />
        <span>{L.high}</span>
      </div>
      <p className="cdash__note">{L.saving}</p>
    </>
  );
}

const DASH = { energy: EnergyDash, sensors: SensorsDash, efficiency: EfficiencyDash };
const DASH_ICON = { energy: 'bolt', sensors: 'sensor', efficiency: 'leaf' };

export default function CampusDash({ kind, live, paused }) {
  const t = useLiveClock(paused);
  const Body = DASH[kind];
  const L = live?.[kind];
  if (!Body || !L) return null;
  return (
    <aside className={`cdash cdash--${kind}`} aria-label={L.title}>
      <header className="cdash__head">
        <span className="cdash__icon">
          <Icon name={DASH_ICON[kind]} />
        </span>
        <strong>{L.title}</strong>
        <span className="cdash__live">
          <i />
          LIVE
        </span>
      </header>
      <Body L={L} t={t} />
      <p className="cdash__tag">{live.tag}</p>
    </aside>
  );
}
