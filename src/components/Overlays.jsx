import React, { useEffect, useMemo, useState } from 'react';
import Icon from './icons.jsx';
import { MeetingsButton } from './Meetings.jsx';
import { useStore, labelNodes, OVERVIEW, flyTo } from '../store.js';
import { useT, useSolutions, useIndustries, useCapabilities } from '../i18n.js';
import { LAYERS } from '../three/datalayers.js';
import { CITY_STYLES } from '../three/citystyles.js';
import { INCIDENT_DURATION, INCIDENT_STEPS } from '../three/incident.js';

/* ================================================================== */
/* Contador animado                                                    */
/* ================================================================== */

export function CountUp({ to, suffix = '', duration = 1100 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const decimals = String(to).includes('.') ? 1 : 0;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Number((to * eased).toFixed(decimals)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return (
    <>
      {v}
      {suffix}
    </>
  );
}

/* ================================================================== */
/* Carga                                                               */
/* ================================================================== */

const STEPS = [
  'Descargando modelos 3D…',
  'Generando la retícula del Eixample…',
  'Levantando edificios y landmarks…',
  'Poniendo en marcha el tráfico…',
  'Conectando sensores y cámaras…',
  'Listo',
];

export function Loader() {
  const phase = useStore((s) => s.phase);
  const progress = useStore((s) => s.progress);
  const loadError = useStore((s) => s.loadError);
  const step = STEPS[Math.min(Math.floor(progress * (STEPS.length - 1)), STEPS.length - 1)];
  return (
    <div className={`loader${phase === 'loading' ? '' : ' done'}`}>
      <div className="loader__grid" />
      <div className="loader__inner">
        <div className="brand brand--xl">
          <span className="brand__logo brand__logo--xl">
            <img src="/brand/logo-mti.png" alt="MTi · Mingo Things" />
          </span>
          <span className="brand__name">Mingo Things</span>
        </div>
        <div className={`loader__bar${loadError ? ' loader__bar--err' : ''}`}>
          <i style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
        {loadError ? (
          <p className="loader__status loader__status--err">
            No se ha podido cargar la ciudad: {loadError}
            <small>Recarga la página; si sigue igual, revisa que estén los archivos de /city.</small>
          </p>
        ) : (
          <p className="loader__status">{step}</p>
        )}
      </div>
    </div>
  );
}

/* ================================================================== */
/* Intro                                                               */
/* ================================================================== */

/** Palabras que rota el titular de portada: el catálogo, en una línea. */
const INTRO_WORDS_EN = [
  'cities',
  'stadiums',
  'transport',
  'waste',
  'water',
  'air quality',
  'security',
  'industry',
  'maintenance',
  'energy',
  'construction',
  'buildings',
  'major events',
  'public services',
];

const INTRO_WORDS = [
  'ciudades',
  'estadios',
  'transporte',
  'residuos',
  'agua',
  'seguridad',
  'industria',
  'mantenimiento',
  'energía',
  'logística',
  'grandes eventos',
  'servicios públicos',
];

/**
 * Cambia de palabra cada 2,2 s. La saliente sube y se desenfoca, la entrante
 * llega desde abajo: el ojo sigue el cambio sin perder la frase.
 */
function RotatingWord({ words, run = true, every = 2200 }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!run) return undefined;
    const id = setInterval(() => setI((n) => (n + 1) % words.length), every);
    return () => clearInterval(id);
  }, [run, words.length, every]);

  return (
    <span className="rotword">
      {/* la palabra más larga reserva el ancho: la frase no da saltos */}
      <span className="rotword__ghost" aria-hidden="true">
        {words.reduce((a, b) => (b.length > a.length ? b : a), '')}
      </span>
      <span className="rotword__word grad" key={i}>
        {words[i]}
      </span>
    </span>
  );
}

export function Intro() {
  const t = useT();
  const lang = useStore((s) => s.lang);
  const setLang = useStore((s) => s.setLang);
  const phase = useStore((s) => s.phase);
  const enterCity = useStore((s) => s.enterCity);
  const openDeck = useStore((s) => s.openDeck);
  const webgl = useStore((s) => s.webgl);
  const startTour = useStore((s) => s.startTour);
  const toggleMatrix = useStore((s) => s.toggleMatrix);
  const solutions = useSolutions();
  const industries = useIndustries();
  const capabilities = useCapabilities();
  const mode = useStore((s) => s.mode);
  /* La portada se retira en cuanto se elige camino. Con el recorrido abierto la
     fase sigue siendo 'intro' —no se ha entrado a la ciudad—, así que hay que
     mirar también el modo: si no, la portada se queda encima y se come los
     clics del recorrido. */
  const open = phase === 'intro' && mode === 'choice';

  return (
    <div className={`intro${open ? '' : ' hidden'}`}>
      {/* reuniones con pre-clientes: arriba a la izquierda, fuera del relato */}
      <MeetingsButton className="meet-btn--intro" />
      <div className="intro__panel">
        <div className="intro__top">
          <span className="eyebrow">
            <i className="dot" /> Solutions Explorer
          </span>

          {/* el idioma se elige aquí, antes de entrar: la reunión puede ser
              en castellano o en inglés y no hay que reiniciar nada */}
          <div className="langpick" role="group" aria-label={t('Idioma')}>
            {[
              { id: 'es', label: 'ES', nombre: 'Castellano' },
              { id: 'en', label: 'EN', nombre: 'English' },
            ].map((l) => (
              <button
                key={l.id}
                className={`langpick__btn${lang === l.id ? ' active' : ''}`}
                onClick={() => setLang(l.id)}
                title={l.nombre}
                aria-pressed={lang === l.id}
              >
                {t(l.label)}
              </button>
            ))}
          </div>
        </div>

        <h1 className="intro__title">
          {lang === 'en' ? 'Smart solutions' : 'Soluciones inteligentes'}
          <br />
          <em>{lang === 'en' ? 'for' : 'para'}</em>{' '}
          <RotatingWord words={lang === 'en' ? INTRO_WORDS_EN : INTRO_WORDS} run={open} />
        </h1>
        <p className="intro__lead">
          {lang === 'en' ? (
            <>
              A living city where you can watch our work running. Filter by <b>industry</b> —city,
              venue, building, site— or by <b>solution</b> —control centre, IoT, agentic AI, video
              surveillance— and open each case with its documentation and its demo.
            </>
          ) : (
            <>
              Una ciudad viva donde ver funcionando lo que hacemos. Filtra por <b>industria</b>{' '}
              —ciudad, recinto, edificio, obra— o por <b>solución</b> —centro de control, IoT,
              agentic AI, videovigilancia— y abre cada caso con su documentación y su demo.
            </>
          )}
        </p>
        <div className="intro__stats">
          <div>
            <strong>{open && <CountUp to={solutions.length} />}</strong>
            <span>{t('casos de uso')}</span>
          </div>
          <div>
            <strong>{open && <CountUp to={Object.keys(industries).length} />}</strong>
            <span>{t('industrias')}</span>
          </div>
          <div>
            <strong>{open && <CountUp to={Object.keys(capabilities).length} />}</strong>
            <span>{t('soluciones')}</span>
          </div>
        </div>
        {/* Dos caminos, uno al lado del otro: la historia de MTI o el
            catálogo vivo. Se puede saltar de uno a otro en cualquier momento. */}
        <div className="intro__choice">
          <button className="choice choice--deck" onClick={() => openDeck(0, 0)}>
            <span className="choice__icon">
              <Icon name="spark" />
            </span>
            <span className="choice__body">
              <strong>{t('Conocer MTI')}</strong>
              <span>
                {lang === 'en'
                  ? 'Seven chapters: who we are, where we operate, how we deliver and the projects that prove it.'
                  : 'Siete capítulos: quiénes somos, dónde operamos, cómo entregamos y los proyectos que lo prueban.'}
              </span>
            </span>
            <svg viewBox="0 0 24 24" className="choice__arrow">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>

          <button className="choice choice--city" onClick={enterCity} disabled={!webgl} title={webgl ? undefined : t('Este navegador no puede mostrar la ciudad 3D')}>
            <span className="choice__icon">
              <Icon name="city" />
            </span>
            <span className="choice__body">
              <strong>{t('Explorar soluciones')}</strong>
              <span>
                {!webgl
                  ? t('Este navegador no puede mostrar la ciudad 3D')
                  : lang === 'en'
                    ? 'Straight into the 3D city: every use case, live, with its documentation and its demo.'
                    : 'Directo a la ciudad 3D: cada caso de uso, en vivo, con su documentación y su demo.'}
              </span>
            </span>
            <svg viewBox="0 0 24 24" className="choice__arrow">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>

        <div className="intro__actions">
          <button
            className="btn btn--ghost"
            onClick={() => {
              enterCity();
              toggleMatrix();
            }}
          >
            <Icon name="grid" /> {t('Ver la matriz')}
          </button>
          <button className="btn btn--ghost" onClick={startTour}>
            <Icon name="play" /> {t('Modo presentación')}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Barra superior                                                      */
/* ================================================================== */

export function TopBar() {
  const t = useT();
  const phase = useStore((s) => s.phase);
  const night = useStore((s) => s.night);
  const tour = useStore((s) => s.tour);
  const matrixOpen = useStore((s) => s.matrixOpen);
  const toggleNight = useStore((s) => s.toggleNight);
  const toggleTour = useStore((s) => s.toggleTour);
  const toggleHelp = useStore((s) => s.toggleHelp);
  const toggleMatrix = useStore((s) => s.toggleMatrix);
  const clearSelection = useStore((s) => s.clearSelection);
  const apiOnline = useStore((s) => s.apiOnline);
  const incident = useStore((s) => s.incident);
  const toggleIncident = useStore((s) => s.toggleIncident);
  const photoAvailable = useStore((s) => s.photoAvailable);
  const photoMode = useStore((s) => s.photoMode);
  const togglePhoto = useStore((s) => s.togglePhoto);
  const toggleMapMode = useStore((s) => s.toggleMapMode);
  const mapMode = useStore((s) => s.mapMode);
  const deckReturn = useStore((s) => s.deckReturn);
  const deckSeen = useStore((s) => s.deckSeen);
  const resumeDeck = useStore((s) => s.resumeDeck);
  const openDeck = useStore((s) => s.openDeck);

  return (
    <header className={`topbar${phase === 'explore' ? '' : ' hidden'}${mapMode ? ' over-map' : ''}`}>
      <div className="topbar__left">
        <div className="brand">
          <span className="brand__logo">
            <img src="/brand/logo-mti.png" alt="MTi · Mingo Things" />
          </span>
          <span className="brand__divider" />
          <span className="brand__name">Solutions Explorer</span>
          <span className={`api-dot${apiOnline ? ' on' : ''}`} title={apiOnline ? 'API conectada' : 'Catálogo local'} />
        </div>
        <MeetingsButton />
      </div>
      <div className="topbar__right">
        {/* Solo aparece si ya se ha estado en el recorrido: devuelve al
            capítulo y al paso exactos que se dejaron. */}
        {(deckReturn || deckSeen) && (
          <button
            className="chip-btn chip-btn--deck"
            onClick={deckReturn ? resumeDeck : () => openDeck()}
            title={t('Volver a la presentación')}
          >
            <Icon name="spark" />
            <span>{t('Volver a la presentación')}</span>
          </button>
        )}
        {photoAvailable && (
          <button
            className={`chip-btn${photoMode ? ' active' : ''}`}
            onClick={togglePhoto}
            title="Alternar entre la ciudad de OpenStreetMap y las teselas fotorrealistas de Google (P)"
          >
            <Icon name="layers" />
            <span>{photoMode ? 'Modelo OSM' : 'Fotorrealista'}</span>
          </button>
        )}
        <button
          className={`chip-btn${mapMode ? ' active' : ''}`}
          onClick={toggleMapMode}
          title="El mismo catálogo sobre el mapa vectorial de MapLibre (necesita conexión)"
        >
          <Icon name="layers" />
          <span>{mapMode ? t('Ciudad 3D') : t('Mapa')}</span>
        </button>
        <button className={`chip-btn${matrixOpen ? ' active' : ''}`} onClick={toggleMatrix} title={t('Matriz industrias × soluciones (M)')}>
          <Icon name="grid" />
          <span>{t('Matriz')}</span>
        </button>
        <button className="chip-btn" onClick={toggleNight} title={t('Alternar día / noche (N)')}>
          <svg viewBox="0 0 24 24">
            {night ? (
              <>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </>
            ) : (
              <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
            )}
          </svg>
          <span>{night ? t('Día') : t('Noche')}</span>
        </button>
        <button
          className={`chip-btn chip-btn--alert${incident ? ' active' : ''}`}
          onClick={toggleIncident}
          title="Simular un incidente y ver reaccionar a toda la plataforma (I)"
        >
          <Icon name="alert" />
          <span>{t('Incidente')}</span>
        </button>
        <button className={`chip-btn${tour ? ' active' : ''}`} onClick={toggleTour} title={t('Recorrido automático (Espacio)')}>
          <Icon name={tour ? 'check' : 'play'} />
          <span>{t('Presentación')}</span>
        </button>
        <button
          className="chip-btn"
          onClick={() => {
            clearSelection();
            flyTo(OVERVIEW.position, OVERVIEW.target);
          }}
          title={t('Vista general (Esc)')}
        >
          <svg viewBox="0 0 24 24">
            <path d="M3 9l9-6 9 6v11a1 1 0 01-1 1H4a1 1 0 01-1-1z" />
          </svg>
          <span>{t('Vista general')}</span>
        </button>
        <button className="chip-btn chip-btn--icon" onClick={toggleHelp} title={t('Ayuda (H)')}>
          <svg viewBox="0 0 24 24">
            <path d="M9.1 9a3 3 0 115.8 1c0 2-3 2.5-3 4" />
            <circle cx="12" cy="18" r=".6" />
          </svg>
        </button>
      </div>
    </header>
  );
}

/* ================================================================== */
/* Panel lateral: filtros de dos ejes + listado                        */
/* ================================================================== */

export function Sidebar() {
  const t = useT();
  const phase = useStore((s) => s.phase);
  const mapMode = useStore((s) => s.mapMode);
  const industries = useIndustries();
  const capabilities = useCapabilities();
  const solutions = useSolutions();
  const fInd = useStore((s) => s.filterIndustries);
  const fCap = useStore((s) => s.filterCapabilities);
  const activeId = useStore((s) => s.activeId);
  const collapsed = useStore((s) => s.sidebarCollapsed);
  // al abrir los controles de vista, la lista se comprime para no solaparse
  const controlsOpen = useStore((s) => s.controlsOpen);
  const toggleIndustry = useStore((s) => s.toggleIndustry);
  const toggleCapability = useStore((s) => s.toggleCapability);
  const clearFilters = useStore((s) => s.clearFilters);
  const toggleSidebar = useStore((s) => s.toggleSidebar);
  const select = useStore((s) => s.select);
  const stopTour = useStore((s) => s.stopTour);

  const visible = useMemo(
    () =>
      solutions.filter(
        (s) =>
          (!fInd.length || fInd.includes(s.industry)) &&
          (!fCap.length || (s.capabilities ?? []).some((c) => fCap.includes(c)))
      ),
    [solutions, fInd, fCap]
  );

  // cuántos casos aportaría cada chip con el filtro contrario ya aplicado
  const countFor = (kind, id) =>
    solutions.filter((s) =>
      kind === 'industry'
        ? s.industry === id && (!fCap.length || (s.capabilities ?? []).some((c) => fCap.includes(c)))
        : (s.capabilities ?? []).includes(id) && (!fInd.length || fInd.includes(s.industry))
    ).length;

  const filtered = fInd.length > 0 || fCap.length > 0;

  return (
    <>
      <aside
        className={`sidebar${phase === 'explore' ? '' : ' hidden'}${collapsed ? ' collapsed' : ''}${
          controlsOpen ? ' sidebar--compact' : ''
        }${mapMode ? ' over-map' : ''}`}
      >
        <div className="sidebar__head">
          <h2>{t('Explorar')}</h2>
          <button className="icon-btn" onClick={toggleSidebar} title={t('Plegar panel')}>
            <svg viewBox="0 0 24 24">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
        </div>

        <div className="filter-group">
          <h3 className="filter-group__title">
            <Icon name="layers" /> {t('Industria')}
          </h3>
          <div className="filters">
            {Object.values(industries).map((c) => {
              const n = countFor('industry', c.id);
              const on = fInd.includes(c.id);
              return (
                <button
                  key={c.id}
                  className={`f-chip${on ? ' on' : ''}${n === 0 ? ' empty' : ''}`}
                  style={{ color: on ? c.color : undefined }}
                  onClick={() => toggleIndustry(c.id)}
                  title={c.label}
                >
                  <i style={{ background: c.color, boxShadow: `0 0 8px ${c.color}` }} />
                  {c.short}
                  <b>{n}</b>
                </button>
              );
            })}
          </div>
        </div>

        <div className="filter-group">
          <h3 className="filter-group__title">
            <Icon name="grid" /> {t('Solución')}
          </h3>
          <div className="filters">
            {Object.values(capabilities).map((c) => {
              const n = countFor('capability', c.id);
              const on = fCap.includes(c.id);
              return (
                <button
                  key={c.id}
                  className={`f-chip f-chip--cap${on ? ' on' : ''}${n === 0 ? ' empty' : ''}`}
                  onClick={() => toggleCapability(c.id)}
                  title={c.blurb}
                >
                  <Icon name={c.icon} />
                  {c.label}
                  <b>{n}</b>
                </button>
              );
            })}
          </div>
        </div>

        <div className="sol-list">
          {visible.map((s, i) => {
            const ind = industries[s.industry];
            return (
              <button
                key={s.id}
                className={`sol-item${activeId === s.id ? ' active' : ''}`}
                style={{ color: ind.color, animationDelay: `${i * 26}ms` }}
                onClick={() => {
                  stopTour();
                  select(s.id);
                }}
              >
                <span className="sol-item__ico">
                  <Icon name={ind.icon} />
                </span>
                <span className="sol-item__txt">
                  <strong>{s.title}</strong>
                  <span>{ind.label}</span>
                </span>
                <span className="sol-item__caps">
                  {(s.capabilities ?? []).slice(0, 4).map((c) => (
                    <i key={c} className={fCap.includes(c) ? 'on' : ''} title={capabilities[c]?.label}>
                      <Icon name={capabilities[c]?.icon ?? 'grid'} />
                    </i>
                  ))}
                </span>
              </button>
            );
          })}
          {!visible.length && (
            <p className="sol-empty">
              No hay casos con esa combinación todavía.
              <br />
              <button className="link-btn" onClick={clearFilters}>
                Quitar filtros
              </button>
            </p>
          )}
        </div>

        <div className="sidebar__foot">
          <span>
            {visible.length} {t("de")} {solutions.length} {t('casos')}
          </span>
          {filtered && (
            <button className="link-btn" onClick={clearFilters}>
              Ver todos
            </button>
          )}
        </div>
      </aside>

      {collapsed && phase === 'explore' && (
        <button className="sidebar-open" onClick={toggleSidebar} title={t('Mostrar el panel')}>
          <svg viewBox="0 0 24 24">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      )}
    </>
  );
}

/* ================================================================== */
/* Matriz industrias × soluciones                                      */
/* ================================================================== */

export function MatrixOverlay() {
  const t = useT();
  const open = useStore((s) => s.matrixOpen);
  const toggleMatrix = useStore((s) => s.toggleMatrix);
  const industries = useIndustries();
  const capabilities = useCapabilities();
  const solutions = useSolutions();
  const focusCell = useStore((s) => s.focusCell);
  const focusCapability = useStore((s) => s.focusCapability);
  const toggleIndustry = useStore((s) => s.toggleIndustry);
  const [hover, setHover] = useState(null);

  const cells = useMemo(() => {
    const map = {};
    for (const s of solutions) {
      for (const c of s.capabilities ?? []) {
        (map[`${s.industry}|${c}`] ??= []).push(s);
      }
    }
    return map;
  }, [solutions]);

  const caps = Object.values(capabilities);
  const inds = Object.values(industries);

  return (
    <div className={`matrix${open ? ' open' : ''}`} aria-hidden={!open} onClick={(e) => e.target === e.currentTarget && toggleMatrix()}>
      <div className="matrix__panel">
        <header className="matrix__head">
          <div>
            <span className="eyebrow">
              <i className="dot" /> {t('Mapa de capacidades')}
            </span>
            <h2>
              Qué <em>solución</em> en qué <em>industria</em>
            </h2>
            <p>
              Cada punto es un caso de uso real. Pulsa una celda para abrirlo en la ciudad, o una
              columna para ver esa solución en todas las industrias.
            </p>
          </div>
          <button className="icon-btn" onClick={toggleMatrix} title={t('Cerrar (M)')}>
            <svg viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="matrix__scroll">
          <div className="matrix__grid" style={{ '--cols': caps.length }}>
            <div className="matrix__corner" />
            {caps.map((c, i) => (
              <button
                key={c.id}
                className={`matrix__col${hover?.cap === c.id ? ' hot' : ''}`}
                style={{ animationDelay: `${i * 40}ms` }}
                onClick={() => focusCapability(c.id)}
                onMouseEnter={() => setHover({ cap: c.id })}
                onMouseLeave={() => setHover(null)}
                title={c.blurb}
              >
                <Icon name={c.icon} />
                <span>{c.label}</span>
              </button>
            ))}

            {inds.map((ind, r) => (
              <React.Fragment key={ind.id}>
                <button
                  className={`matrix__row${hover?.ind === ind.id ? ' hot' : ''}`}
                  style={{ color: ind.color, animationDelay: `${r * 50}ms` }}
                  onClick={() => {
                    toggleIndustry(ind.id);
                    toggleMatrix();
                  }}
                  onMouseEnter={() => setHover({ ind: ind.id })}
                  onMouseLeave={() => setHover(null)}
                >
                  <Icon name={ind.icon} />
                  <span>{ind.label}</span>
                </button>

                {caps.map((c, i) => {
                  const list = cells[`${ind.id}|${c.id}`] ?? [];
                  const hot = hover?.cap === c.id || hover?.ind === ind.id;
                  return (
                    <button
                      key={c.id}
                      className={`matrix__cell${list.length ? ' has' : ''}${hot ? ' hot' : ''}`}
                      style={{
                        '--accent': ind.color,
                        animationDelay: `${(r * caps.length + i) * 12}ms`,
                      }}
                      disabled={!list.length}
                      onClick={() => focusCell(ind.id, c.id)}
                      onMouseEnter={() => setHover({ ind: ind.id, cap: c.id })}
                      onMouseLeave={() => setHover(null)}
                      title={list.map((s) => s.title).join(' · ')}
                    >
                      {list.length > 0 && (
                        <span className="matrix__dot">
                          {list.length > 1 ? list.length : <Icon name="check" />}
                        </span>
                      )}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        <footer className="matrix__foot">
          {hover?.ind && hover?.cap && (cells[`${hover.ind}|${hover.cap}`] ?? []).length ? (
            <span className="matrix__hint">
              <b>{industries[hover.ind].label}</b> · {capabilities[hover.cap].label} —{' '}
              {(cells[`${hover.ind}|${hover.cap}`] ?? []).map((s) => s.title).join(', ')}
            </span>
          ) : (
            <span className="matrix__hint matrix__hint--dim">
              {solutions.length} casos de uso · {inds.length} industrias · {caps.length} soluciones
            </span>
          )}
        </footer>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Etiquetas flotantes                                                 */
/* ================================================================== */

export function Labels() {
  const t = useT();
  const phase = useStore((s) => s.phase);
  const solutions = useSolutions();
  const industries = useIndustries();
  const select = useStore((s) => s.select);
  const stopTour = useStore((s) => s.stopTour);

  useEffect(() => () => labelNodes.clear(), []);

  return (
    <div className={`labels${phase === 'explore' ? '' : ' hidden'}`}>
      {solutions.map((s) => {
        const ind = industries[s.industry];
        return (
          <button
            key={s.id}
            className="label"
            style={{ color: ind.color }}
            ref={(el) => (el ? labelNodes.set(s.id, el) : labelNodes.delete(s.id))}
            onClick={() => {
              stopTour();
              select(s.id);
            }}
          >
            <span className="label__ico">
              <Icon name={ind.icon} />
            </span>
            {s.title.split(/[·&]/)[0].trim()}
          </button>
        );
      })}
    </div>
  );
}

/* ================================================================== */
/* Ficha de caso de uso                                                */
/* ================================================================== */

export function DetailPanel() {
  const t = useT();
  const activeId = useStore((s) => s.activeId);
  const mapMode = useStore((s) => s.mapMode);
  const solutions = useSolutions();
  const industries = useIndustries();
  const capabilities = useCapabilities();
  const clearSelection = useStore((s) => s.clearSelection);
  const openDoc = useStore((s) => s.openDoc);
  const focusCapability = useStore((s) => s.focusCapability);
  const sol = solutions.find((s) => s.id === activeId);
  const [shown, setShown] = useState(sol);

  useEffect(() => {
    if (sol) setShown(sol);
  }, [sol]);

  const ind = shown ? industries[shown.industry] : null;
  const siblings = shown
    ? solutions.filter(
        (s) => s.id !== shown.id && (s.capabilities ?? []).some((c) => (shown.capabilities ?? []).includes(c))
      )
    : [];

  return (
    <section
      className={`detail${sol ? ' open' : ''}${mapMode ? ' over-map' : ''}`}
      style={{ '--accent': ind?.color }}
      aria-hidden={!sol}
    >
      <button className="detail__close" onClick={clearSelection} title={t('Cerrar (Esc)')}>
        <svg viewBox="0 0 24 24">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
      {shown && (
        <div className="detail__scroll" key={shown.id}>
          <span className="d-cat reveal">
            <Icon name={ind.icon} /> {ind.label}
          </span>
          <h2 className="d-title reveal" style={{ animationDelay: '60ms' }}>
            {shown.title}
          </h2>
          <p className="d-tag reveal" style={{ animationDelay: '110ms' }}>
            {shown.tagline}
          </p>

          <div className="d-caps reveal" style={{ animationDelay: '150ms' }}>
            {(shown.capabilities ?? []).map((c) => (
              <button key={c} className="d-cap" onClick={() => focusCapability(c)} title={`Ver ${capabilities[c]?.label} en todas las industrias`}>
                <Icon name={capabilities[c]?.icon ?? 'grid'} />
                {capabilities[c]?.label}
              </button>
            ))}
          </div>

          <div className="d-kpis reveal" style={{ animationDelay: '190ms' }}>
            {shown.kpis.map((k) => (
              <div className="d-kpi" key={k.label}>
                <b>{sol && <CountUp to={k.value} suffix={k.suffix} />}</b>
                <span>{k.label}</span>
              </div>
            ))}
          </div>

          <p className="d-summary reveal" style={{ animationDelay: '230ms' }}>
            {shown.summary}
          </p>

          <h3 className="d-h reveal" style={{ animationDelay: '260ms' }}>
            {t('Qué incluye')}
          </h3>
          <ul className="d-list reveal" style={{ animationDelay: '290ms' }}>
            {shown.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>

          <h3 className="d-h reveal" style={{ animationDelay: '330ms' }}>
            {t('Plataformas y tecnología')}
          </h3>
          <div className="d-chips reveal" style={{ animationDelay: '360ms' }}>
            {shown.stack.map((s) => (
              <span className="d-chip" key={s}>
                {s}
              </span>
            ))}
          </div>

          <h3 className="d-h reveal" style={{ animationDelay: '390ms' }}>
            {t('Referencias')}
          </h3>
          <div className="d-refs reveal" style={{ animationDelay: '420ms' }}>
            {shown.references.map((r) => (
              <div className="d-ref" key={r}>
                <Icon name="check" /> {r}
              </div>
            ))}
          </div>

          {siblings.length > 0 && (
            <>
              <h3 className="d-h reveal" style={{ animationDelay: '450ms' }}>
                {t('Lo mismo, en otra industria')}
              </h3>
              <div className="d-related reveal" style={{ animationDelay: '470ms' }}>
                {siblings.slice(0, 3).map((s) => (
                  <button
                    key={s.id}
                    className="d-rel"
                    style={{ '--c': industries[s.industry].color }}
                    onClick={() => useStore.getState().select(s.id)}
                  >
                    <Icon name={industries[s.industry].icon} />
                    <span>
                      <b>{industries[s.industry].short}</b>
                      {s.title}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="d-actions reveal" style={{ animationDelay: '500ms' }}>
            <button className="btn btn--primary btn--block" onClick={() => openDoc(shown)}>
              <Icon name="doc" /> {t('Ver documentación')}
            </button>
            {shown.demo && (
              <a className="btn btn--ghost btn--block" href={shown.demo} target="_blank" rel="noopener noreferrer">
                <Icon name="external" /> {t('Abrir demo')}
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

/* ================================================================== */
/* Visor de documentación                                              */
/* ================================================================== */

export function DocViewer() {
  const t = useT();
  const doc = useStore((s) => s.docSolution);
  const closeDoc = useStore((s) => s.closeDoc);
  const [status, setStatus] = useState('checking');
  const url = doc?.docUrl ?? (doc ? `/docs/${doc.pdf.split('/').pop()}` : null);

  useEffect(() => {
    if (!doc) return;
    let alive = true;
    setStatus('checking');
    fetch(url, { method: 'HEAD' })
      .then((r) => alive && setStatus(r.ok ? 'ok' : 'missing'))
      .catch(() => alive && setStatus('missing'));
    return () => {
      alive = false;
    };
  }, [doc, url]);

  return (
    <div
      className={`docviewer${doc ? ' open' : ''}`}
      aria-hidden={!doc}
      onClick={(e) => e.target === e.currentTarget && closeDoc()}
    >
      <div className="docviewer__panel">
        <header>
          <div>
            <span className="eyebrow">
              <i className="dot" /> Documentación
            </span>
            <h3>{doc?.title ?? '—'}</h3>
          </div>
          <div className="docviewer__actions">
            {status === 'ok' && (
              <a className="btn btn--ghost btn--sm" href={url} target="_blank" rel="noopener noreferrer">
                <Icon name="external" /> Abrir en pestaña
              </a>
            )}
            <button className="icon-btn" onClick={closeDoc} title={t('Cerrar')}>
              <svg viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </header>
        <div className="docviewer__frame">
          {status === 'ok' && doc && <iframe title={doc.title} src={`${url}#view=FitH`} />}
          {status === 'missing' && doc && (
            <div className="doc-missing">
              <Icon name="doc" />
              <p>
                Todavía no hay PDF para <b>{doc.title}</b>.
              </p>
              <p>
                Deja el archivo en <code>server/docs/</code> con el nombre
                <br />
                <code>{doc.pdf.split('/').pop()}</code> y aparecerá aquí al instante.
              </p>
            </div>
          )}
          {status === 'checking' && <div className="doc-missing">{t('Comprobando documentación…')}</div>}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Ayuda, créditos, HUD y aviso de presentación                        */
/* ================================================================== */

export function HelpBox() {
  const t = useT();
  const open = useStore((s) => s.helpOpen);
  const toggleCredits = useStore((s) => s.toggleCredits);
  return (
    <div className={`helpbox${open ? '' : ' hidden'}`}>
      <h4>{t('Cómo se maneja')}</h4>
      <ul>
        <li>
          <b>Arrastrar</b> — girar la ciudad
        </li>
        <li>
          <b>Rueda</b> — acercar y alejar
        </li>
        <li>
          <b>Clic en un punto</b> — abrir el caso de uso
        </li>
        <li>
          <b>M</b> — matriz industrias × soluciones
        </li>
        <li>
          <b>Espacio</b> — modo presentación
        </li>
        <li>
          <b>N</b> — día / noche · <b>Esc</b> — volver
        </li>
      </ul>
      <button className="link-btn" onClick={toggleCredits}>
        Créditos de los modelos 3D
      </button>
    </div>
  );
}

export function Credits() {
  const t = useT();
  const open = useStore((s) => s.creditsOpen);
  const toggleCredits = useStore((s) => s.toggleCredits);
  return (
    <div className={`credits${open ? ' open' : ''}`} aria-hidden={!open} onClick={(e) => e.target === e.currentTarget && toggleCredits()}>
      <div className="credits__panel">
        <header>
          <h3>Modelos 3D</h3>
          <button className="icon-btn" onClick={toggleCredits}>
            <svg viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </header>
        <h4 className="credits__h">Geometría de la ciudad</h4>
        <p>
          Las manzanas, alturas, calles y parques son datos reales de{' '}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
            OpenStreetMap
          </a>{' '}
          (licencia ODbL), descargados con <code>npm run city:fetch</code>. En modo fotorrealista, la
          malla es de Google Photorealistic 3D Tiles y su atribución la pinta el propio visor.
        </p>
        <h4 className="credits__h">Vehículos, personas y mobiliario</h4>
        <p>
          Modelos libres de
          <a href="https://poly.pizza" target="_blank" rel="noopener noreferrer"> poly.pizza</a>, con licencia CC0 o CC-BY 3.0:
        </p>
        <ul>
          <li><b>Quaternius</b> — personajes animados, farola, pinos <span>CC0</span></li>
          <li><b>Kenney</b> — edificios <span>CC0</span></li>
          <li><b>Poly by Google</b> — coche, taxi, furgoneta, policía, ambulancia, autobús, semáforo <span>CC-BY</span></li>
          <li><b>J-Toastie</b> — coche rojo, cámara de seguridad <span>CC-BY</span></li>
          <li><b>KolosStudios</b> — camión, contenedor <span>CC-BY</span></li>
          <li><b>Clint Chilcott</b> — contenedor marítimo <span>CC-BY</span></li>
          <li><b>Marc Solà</b> — árbol <span>CC-BY</span></li>
          <li><b>Ev Amitay</b> — banco <span>CC-BY</span></li>
        </ul>
        <p className="credits__note">El detalle completo está en CREDITS.md del repositorio.</p>
      </div>
    </div>
  );
}

/**
 * Rótulo de entrada de escena: aparece al abrir un caso de uso, como el título
 * de un plano, y se retira solo. Junto con las barras da el aire cinematográfico.
 */
export function SceneIntro() {
  const t = useT();
  const activeId = useStore((s) => s.activeId);
  const mapMode = useStore((s) => s.mapMode);
  const solutions = useSolutions();
  const industries = useIndustries();
  const [card, setCard] = useState(null);

  useEffect(() => {
    if (!activeId) {
      setCard(null);
      return;
    }
    const sol = solutions.find((s) => s.id === activeId);
    if (!sol) return;
    // se deja pasar un instante: montar la escena 3D ocupa el hilo principal y
    // la animación de entrada del rótulo se perdería justo al arrancar
    const entrada = setTimeout(() => setCard({ ...sol, key: `${activeId}-${Date.now()}` }), 160);
    // seis segundos en pantalla: da tiempo a leerlo antes de que empiece la escena
    const salida = setTimeout(() => setCard(null), 6400);
    return () => {
      clearTimeout(entrada);
      clearTimeout(salida);
    };
  }, [activeId, solutions]);

  const ind = card ? industries[card.industry] : null;

  return (
    <>
      <div className={`filmbars${activeId ? ' on' : ''}`} aria-hidden="true">
        <i />
        <i />
      </div>
      {card && (
        <div
          className={`scenetitle${mapMode ? ' over-map' : ''}`}
          key={card.key}
          style={{ '--accent': ind?.color }}
        >
          {/* el fondo se apaga un poco: el título se lee sin ruido detrás */}
          <div className="scenetitle__veil" />
          <div className="scenetitle__inner">
            {/* el icono de la industria entra girando dentro de su anillo */}
            <span className="scenetitle__badge">
              <i className="scenetitle__ring" />
              <i className="scenetitle__ring scenetitle__ring--2" />
              <Icon name={ind?.icon ?? 'city'} />
            </span>

            <span className="scenetitle__eyebrow">{ind?.label}</span>

            {/* el título entra palabra a palabra, no de golpe */}
            <h2>
              {card.title.split(' ').map((palabra, i) => (
                <span key={`${palabra}-${i}`} className="scenetitle__w" style={{ '--i': i }}>
                  {palabra}
                </span>
              ))}
            </h2>

            {card.tagline && <p className="scenetitle__tagline">{card.tagline}</p>}
            <span className="scenetitle__rule" />

            {/* las tres cifras del caso, que es lo que se recuerda */}
            {Array.isArray(card.kpis) && (
              <div className="scenetitle__kpis">
                {card.kpis.slice(0, 3).map((k, i) => (
                  <span key={k.label} className="scenetitle__kpi" style={{ '--i': i }}>
                    <b>
                      {k.value}
                      {k.suffix}
                    </b>
                    <em>{k.label}</em>
                  </span>
                ))}
              </div>
            )}

            {/* la ubicación solo se enseña donde el proyecto es real */}
            {card.realPlace && card.place && (
              <p className="scenetitle__place">
                <Icon name="city" />
                {card.place}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ================================================================== */
/* Capas de datos + línea de tiempo del día                            */
/* ================================================================== */

export function CityControls() {
  const t = useT();
  const phase = useStore((s) => s.phase);
  const dataLayer = useStore((s) => s.dataLayer);
  const setDataLayer = useStore((s) => s.setDataLayer);
  const hour = useStore((s) => s.hour);
  const setHour = useStore((s) => s.setHour);
  const incident = useStore((s) => s.incident);
  const cityStyle = useStore((s) => s.cityStyle);
  const setCityStyle = useStore((s) => s.setCityStyle);
  const open = useStore((s) => s.controlsOpen);
  const toggleControls = useStore((s) => s.toggleControls);
  const cityDetails = useStore((s) => s.cityDetails);
  const streetFlow = useStore((s) => s.streetFlow);
  const autoOrbit = useStore((s) => s.autoOrbit);
  const motionEnabled = useStore((s) => s.motionEnabled);
  const mapMode = useStore((s) => s.mapMode);
  const toggleCityOption = useStore((s) => s.toggleCityOption);
  const layers = Object.values(LAYERS);
  const active = dataLayer ? LAYERS[dataLayer] : null;

  const hh = String(Math.floor(hour)).padStart(2, '0');
  const mm = String(Math.round((hour % 1) * 60)).padStart(2, '0');

  return (
    <div className={`citycontrols${phase === 'explore' && !incident && !mapMode ? '' : ' hidden'}${open ? ' open' : ''}`}>
      <button className="citycontrols__toggle" onClick={toggleControls} aria-expanded={open} aria-controls="city-view-options">
        <Icon name="layers" />
        <span>{t('Vista de la ciudad')}</span>
        <b>
          {t(CITY_STYLES[cityStyle].label)}
          {active ? ` · ${t(active.label).split(' ')[0]}` : ''}
        </b>
        <svg viewBox="0 0 24 24" className="citycontrols__caret">
          <path d="M6 15l6-6 6 6" />
        </svg>
      </button>

      <div id="city-view-options" className="citycontrols__body" inert={!open}>
      <div className="styleswitch">
        <span className="layers__title">{t('Estilo de ciudad')}</span>
        <div className="styleswitch__row">
          {Object.values(CITY_STYLES).map((st) => (
            <button
              key={st.id}
              className={`style-chip${cityStyle === st.id ? ' on' : ''}`}
              onClick={() => setCityStyle(st.id)}
              title={t(st.hint)}
              aria-pressed={cityStyle === st.id}
            >
              <Icon name={st.icon} />
              <span>{t(st.label)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="layers">
        <span className="layers__title">{t('Capas de datos')}</span>
        <div className="layers__row">
          {layers.map((l, i) => (
            <button
              key={l.id}
              className={`layer-chip${dataLayer === l.id ? ' on' : ''}`}
              style={{ '--c': l.color, animationDelay: `${i * 40}ms` }}
              onClick={() => setDataLayer(l.id)}
              title={t(l.label)}
              aria-pressed={dataLayer === l.id}
              aria-label={t(l.label)}
            >
              <Icon name={l.icon} />
              <span>{t(l.label)}</span>
            </button>
          ))}
        </div>
        <p className="layers__source">{t('Capas ilustrativas sobre cartografía real')}</p>
        {active && (
          <div className="layers__legend" style={{ '--c': active.color }}>
            <span>{t(active.legend[0])}</span>
            <i />
            <span>{t(active.legend[2])}</span>
            <b>{t(active.unit)}</b>
          </div>
        )}
      </div>

      <div className="city-ambience">
        <span className="layers__title">{t('Detalle y movimiento')}</span>
        <div className="city-ambience__grid">
          {[
            ['cityDetails', cityDetails, 'building', 'Detalle urbano'],
            ['streetFlow', streetFlow, 'route', 'Flujos de calle'],
            ['autoOrbit', autoOrbit, 'route', 'Órbita suave'],
            ['motionEnabled', motionEnabled, 'play', 'Animación urbana'],
          ].map(([key, enabled, icon, label]) => (
            <button key={key} className={enabled ? 'on' : ''} aria-pressed={enabled} onClick={() => toggleCityOption(key)}>
              <Icon name={icon} /><span>{t(label)}</span><i />
            </button>
          ))}
        </div>
      </div>
      <div className="timeline">
        <span className="timeline__clock">
          {hh}:{mm}
        </span>
        <input
          type="range"
          min="0"
          max="23.9"
          step="0.1"
          value={hour}
          onChange={(e) => setHour(Number(e.target.value))}
          aria-label={t('Hora del día')}
        />
        <span className="timeline__hint">{t('Hora del día')}</span>
        <div className="timeline__presets">
          {[[8, 'Amanecer'], [13, 'Día'], [19, 'Atardecer'], [22, 'Noche']].map(([value, label]) => (
            <button key={value} onClick={() => setHour(value)} aria-pressed={Math.abs(hour - value) < 0.2}>{t(label)}</button>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Narración de la simulación de incidente                             */
/* ================================================================== */

export function IncidentNarration() {
  const t = useT();
  const incident = useStore((s) => s.incident);
  const step = useStore((s) => s.incidentStep);
  const progress = useStore((s) => s.incidentProgress);
  const stopIncident = useStore((s) => s.stopIncident);
  // los pasos viven junto a la escena, para que texto y animación no se separen
  const steps = INCIDENT_STEPS;
  const current = steps[step] ?? null;

  return (
    <div className={`incident${incident ? ' on' : ''}`} aria-hidden={!incident}>
      {current && (
        <div className="incident__caption">
          <strong>{t(current.title)}</strong>
          <p>{t(current.text)}</p>
        </div>
      )}
      <div className="incident__bar">
        <span className="incident__pill">
          <i />
          {t('Simulación de incidente')}
        </span>
        <div className="incident__steps">
          {steps.map((st, i) => (
            <span key={st.title} className={`incident__dot${i <= step ? ' done' : ''}`} title={st.title} />
          ))}
        </div>
        <span className="incident__time">
          {Math.round(progress * INCIDENT_DURATION)}s / {INCIDENT_DURATION}s
        </span>
        <button className="link-btn" onClick={stopIncident}>
          {t('parar')}
        </button>
      </div>
      <div className="incident__progress">
        <i style={{ transform: `scaleX(${progress})` }} />
      </div>
    </div>
  );
}

/** Fundido de corte: tapa el salto cuando la cámara cambia de barrio. */
export function CutFade() {
  const cut = useStore((s) => s.cut);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!cut) return;
    setOn(true);
    const t = setTimeout(() => setOn(false), 90);
    return () => clearTimeout(t);
  }, [cut]);

  return <div className={`cutfade${on ? ' on' : ''}`} aria-hidden="true" />;
}

export function Hud() {
  const t = useT();
  const phase = useStore((s) => s.phase);
  const photoMode = useStore((s) => s.photoMode);
  const activeId = useStore((s) => s.activeId);
  const toggleCredits = useStore((s) => s.toggleCredits);
  return (
    <footer className={`hud${phase === 'explore' ? '' : ' hidden'}`}>
      <span className="hud__hint">
        {t(
          activeId
            ? 'Escena en vivo · arrastra para tomar el control de la cámara'
            : 'Arrastra para girar · rueda para zoom · clic en un punto luminoso'
        )}
      </span>
      <span className="hud__live">
        <i /> {t('Barcelona real · datos en tiempo real')}
      </span>
      <button className="hud__attrib" onClick={toggleCredits}>
        {photoMode ? t('Imágenes © Google') : t('© colaboradores de OpenStreetMap')}
      </button>
    </footer>
  );
}

export function TourFlag() {
  const t = useT();
  const tour = useStore((s) => s.tour);
  const progress = useStore((s) => s.tourProgress);
  const stopTour = useStore((s) => s.stopTour);
  return (
    <div className={`tour-flag${tour ? ' on' : ''}`}>
      <Icon name="spark" />
      Modo presentación
      <span className="tour-flag__bar">
        <i style={{ width: `${Math.round(progress * 100)}%` }} />
      </span>
      <button className="link-btn" onClick={stopTour}>
        parar
      </button>
    </div>
  );
}
