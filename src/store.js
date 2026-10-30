import { create } from 'zustand';
import { SOLUTIONS as LOCAL, INDUSTRIES, CAPABILITIES, buildMatrix } from './data/solutions.js';
import { chaptersFor, DEFAULT_TRACK } from './data/tracks.js';
import { isClientTrack } from './data/clients/index.js';

/** Registro de nodos DOM de las etiquetas 3D (se actualizan fuera de React, por frame). */
export const labelNodes = new Map();

/**
 * Anclajes del recorrido corporativo sobre la ciudad 3D: un nodo DOM y un
 * punto del mundo. La escena de la ciudad los proyecta cada frame, igual que
 * las etiquetas de los casos: así las cifras y los pilares aparecen sobre
 * edificios reales en vez de en una tarjeta.
 */
export const deckAnchors = new Map();

/** Objetivo de cámara: mutado imperativamente para no re-renderizar en cada frame. */
export const cameraGoal = {
  position: [340, 1180, 1620],
  target: [180, 0, 60],
  version: 0,
};

/**
 * Mueve la cámara de la ciudad. Con `{ snap: true }` corta directamente a esa
 * posición en vez de volar: el recorrido lo usa para arrancar un descenso
 * desde muy arriba sin que se vea el trayecto de subida.
 */
export const flyTo = (position, target, opts) => {
  cameraGoal.position = position;
  cameraGoal.target = target;
  cameraGoal.snap = Boolean(opts?.snap);
  cameraGoal.version++;
};

export const OVERVIEW = { position: [340, 1180, 1620], target: [180, 0, 60] };

/**
 * Vista por defecto: un barrio en escorzo, no la ciudad entera desde arriba.
 * A 4 km de altura los edificios de 20 m no se ven y todo parece plano; a ~1 km
 * y 32° de inclinación se leen las fachadas, las sombras y el relieve.
 */
export const setOverview = (extent, focus) => {
  const cx = focus ? focus[0] : (extent.minX + extent.maxX) / 2;
  const cz = focus ? focus[1] : (extent.minZ + extent.maxZ) / 2;
  const dist = 1150;
  OVERVIEW.target = [cx, 0, cz];
  OVERVIEW.position = [cx + dist * 0.34, dist * 0.62, cz + dist * 0.82];
  WIDE.target = [(extent.minX + extent.maxX) / 2, 0, (extent.minZ + extent.maxZ) / 2];
  const span = Math.max(extent.maxX - extent.minX, extent.maxZ - extent.minZ);
  WIDE.position = [
    (extent.minX + extent.maxX) / 2 + span * 0.16,
    span * 0.5,
    (extent.minZ + extent.maxZ) / 2 + span * 0.66,
  ];
};

/** Vista amplia de toda la zona (botón "Vista general" al pulsarlo dos veces). */
export const WIDE = { position: [0, 3000, 4000], target: [0, 0, 0] };

const withDocs = (list) =>
  list.map((s) => ({ ...s, docUrl: `/docs/${s.pdf.split('/').pop()}`, docAvailable: false }));

/**
 * Proyecta el anclaje geográfico de cada caso a los metros locales de la zona
 * cargada. Así el catálogo no depende del trozo de ciudad que se descargue.
 */
export const projectSolutions = (list, center) => {
  const [lat0, lon0] = center;
  const mLat = 111320;
  const mLon = 111320 * Math.cos((lat0 * Math.PI) / 180);
  return list.map((s) => {
    if (!s.latlon) return s;
    const [lat, lon] = s.latlon;
    const x = +((lon - lon0) * mLon).toFixed(1);
    const z = +((lat0 - lat) * mLat).toFixed(1);
    const y = s.height ?? 40;
    return {
      ...s,
      anchor: [x, y, z],
      camera: [x + 210, y + 130, z + 260],
    };
  });
};

export const useStore = create((set, get) => ({
  /* --- catálogo ---------------------------------------------------- */
  industries: INDUSTRIES,
  capabilities: CAPABILITIES,
  solutions: withDocs(LOCAL),
  matrix: buildMatrix(LOCAL),
  apiOnline: false,

  /** Recoloca el catálogo sobre la zona de ciudad recién cargada. */
  applyCityCenter: (center, extent) => {
    // el foco por defecto es el corredor Sagrada Família – Glòries, donde está
    // la mayoría de casos de uso
    const [lat0, lon0] = center;
    const mLon = 111320 * Math.cos((lat0 * Math.PI) / 180);
    const focus = [(2.1815 - lon0) * mLon, (lat0 - 41.4025) * 111320];
    if (extent) setOverview(extent, focus);
    set({
      cityCenter: center,
      solutions: projectSolutions(get().solutions, center),
    });
  },
  cityCenter: null,

  loadSolutions: async () => {
    try {
      const res = await fetch('/api/solutions');
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      const center = get().cityCenter;
      set({
        solutions: center ? projectSolutions(data.solutions, center) : data.solutions,
        industries: data.industries,
        capabilities: data.capabilities,
        matrix: data.matrix ?? buildMatrix(data.solutions),
        apiOnline: true,
      });
    } catch {
      set({ apiOnline: false }); // sin backend seguimos con el catálogo local
    }
  },

  /* --- flujo ------------------------------------------------------- */
  phase: 'loading', // loading · intro · explore
  progress: 0,
  setProgress: (progress) => set({ progress }),
  setPhase: (phase) => set({ phase }),

  enterCity: () => {
    set({ phase: 'explore', mode: 'city' });
    flyTo(OVERVIEW.position, OVERVIEW.target);
  },

  /* --- recorrido corporativo --------------------------------------- */
  /*
   * `mode` decide qué se está enseñando:
   *   'choice'  la pantalla de entrada (Conocer MTI / Explorar soluciones)
   *   'deck'    la presentación corporativa
   *   'city'    la ciudad 3D de siempre, intacta
   *
   * `deckSel` guarda lo que el presentador ha elegido dentro de cada escena
   * (ubicación del globo, proyecto, plataforma, agente, sector, logo…). Vive en
   * el store y no en los componentes para que sobreviva al salto a la ciudad:
   * al volver, cada escena reaparece con la misma selección.
   *
   * `deckReturn` es la foto del punto exacto —capítulo, paso y selección— que
   * se toma al saltar a una solución.
   *
   * `cityLive` indica que la escena actual del recorrido usa la ciudad 3D
   * como decorado: la ciudad se dibuja detrás del recorrido y el recorrido la
   * conduce (cámara, capas, filtros). `citySnapshot` es el estado que tenía la
   * ciudad antes de que el recorrido la tocara, para devolverla intacta.
   */
  mode: 'choice',
  /** ¿Puede este equipo dibujar 3D? Sin WebGL no hay ciudad, pero sí recorrido. */
  webgl: (() => {
    if (typeof document === 'undefined') return true;
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2') || c.getContext('webgl');
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
      return Boolean(gl);
    } catch {
      return false;
    }
  })(),
  /** Recorrido activo: el corporativo ('mti') o el de una línea de servicio. */
  deckTrack: DEFAULT_TRACK,
  /** Punto del recorrido (corporativo o de cliente) del que se salió hacia otro. */
  deckTrackReturn: null,
  /** Panel «Reuniones» (espacios de pre-clientes) abierto. */
  meetingsOpen: false,
  /** Cliente de la reunión en curso (id de CLIENT_SPACES) o null. */
  clientSpace: null,
  /** Estilo del campus del cliente: holo · satellite · model · map (se elige al abrir la reunión). */
  campusLook: 'holo',
  deckChapter: 0,
  deckStep: 0,
  deckPaused: false,
  deckIndexOpen: false,
  deckSourcesOpen: false,
  deckInfo: null, // panel de información ampliada abierto: { kind, id }
  deckReturn: null,
  deckSeen: false,
  deckSel: {},
  cityLive: false,
  citySnapshot: null,

  setDeckSel: (key, value) => set({ deckSel: { ...get().deckSel, [key]: value } }),
  setCityLive: (cityLive) => {
    if (!get().webgl) cityLive = false;
    if (get().cityLive !== cityLive) set({ cityLive });
  },
  openDeckInfo: (kind, id) => set({ deckInfo: kind ? { kind, id } : null }),

  /** Guarda el estado de la ciudad antes de que el recorrido la conduzca. */
  snapshotCity: () => {
    if (get().citySnapshot) return;
    const s = get();
    set({
      citySnapshot: {
        dataLayer: s.dataLayer,
        filterIndustries: s.filterIndustries,
        filterCapabilities: s.filterCapabilities,
        hour: s.hour,
        cityStyle: s.cityStyle,
        styleHour: s.styleHour,
      },
    });
  },

  /** Devuelve la ciudad tal y como estaba antes del recorrido. */
  restoreCity: () => {
    const snap = get().citySnapshot;
    if (!snap) return;
    const { hour, cityStyle, styleHour, ...rest } = snap;
    set({ ...rest, cityStyle, styleHour, hour, night: hour < 7.2 || hour > 20.4, citySnapshot: null, cityLive: false });
  },

  /** Entra al recorrido. Sin argumentos retoma donde se dejó. */
  openDeck: (chapter, step) => {
    const s = get();
    const CH = chaptersFor(s.deckTrack);
    const c = Math.max(0, Math.min(chapter ?? s.deckChapter, CH.length - 1));
    s.snapshotCity();
    set({
      mode: 'deck',
      deckSeen: true,
      deckChapter: c,
      deckStep: Math.max(0, Math.min(step ?? (chapter === undefined ? s.deckStep : 0), CH[c].steps - 1)),
      deckIndexOpen: false,
      deckInfo: null,
      matrixOpen: false,
      tour: false,
      incident: false,
      activeId: null,
    });
  },

  /** Retoma la presentación en el punto guardado al saltar a una solución. */
  resumeDeck: () => {
    const r = get().deckReturn;
    if (r?.track) set({ deckTrack: r.track });
    if (r?.sel) set({ deckSel: r.sel });
    get().openDeck(r?.chapter, r?.step);
    set({ deckReturn: null });
  },

  /** Vuelve al principio del recorrido activo, sin selecciones. */
  restartDeck: () => set({ deckChapter: 0, deckStep: 0, deckSel: {}, deckIndexOpen: false, deckInfo: null }),

  /**
   * Cambia de recorrido (p. ej. de la presentación corporativa a Agentify AI).
   * Al salir del corporativo se guarda el punto exacto para poder volver.
   */
  openTrack: (track, chapter = 0, step = 0) => {
    const s = get();
    const CH = chaptersFor(track);
    const c = Math.max(0, Math.min(chapter, CH.length - 1));
    const patch = {
      deckTrack: track,
      deckChapter: c,
      deckStep: Math.max(0, Math.min(step, CH[c].steps - 1)),
      deckSel: {},
      deckIndexOpen: false,
      deckSourcesOpen: false,
      deckInfo: null,
    };
    // al salir del corporativo o de un espacio de cliente se guarda el punto
    // exacto: el botón de la cabecera devuelve allí
    if (s.mode === 'deck' && s.deckTrack !== track && (s.deckTrack === DEFAULT_TRACK || isClientTrack(s.deckTrack))) {
      patch.deckTrackReturn = { track: s.deckTrack, chapter: s.deckChapter, step: s.deckStep, sel: { ...s.deckSel } };
    }
    set(patch);
    if (s.mode !== 'deck') get().openDeck(c, patch.deckStep);
  },

  /** Abre el espacio de un pre-cliente (panel «Reuniones»). */
  openClient: (id, look) => {
    set({ clientSpace: id, meetingsOpen: false, deckTrackReturn: null, ...(look ? { campusLook: look } : {}) });
    get().openTrack(id, 0, 0);
    set({ mode: 'deck', deckTrackReturn: null });
  },
  toggleMeetings: (open) => set({ meetingsOpen: open ?? !get().meetingsOpen }),
  setCampusLook: (look) => set({ campusLook: look }),

  /** Vuelve al recorrido del que se salió (corporativo o de cliente), al punto exacto. */
  backToMainTrack: () => {
    const r = get().deckTrackReturn;
    set({
      deckTrack: r?.track ?? DEFAULT_TRACK,
      deckChapter: r?.chapter ?? 0,
      deckStep: r?.step ?? 0,
      deckSel: r?.sel ?? {},
      deckTrackReturn: null,
      deckIndexOpen: false,
      deckSourcesOpen: false,
      deckInfo: null,
    });
  },

  /** Guarda el punto actual del recorrido para poder volver a él. */
  rememberDeck: () => {
    const s = get();
    set({ deckReturn: { track: s.deckTrack, chapter: s.deckChapter, step: s.deckStep, sel: { ...s.deckSel } } });
  },

  /** Sale del recorrido a la ciudad 3D, dejándola como estaba. */
  enterExplorer: () => {
    get().rememberDeck();
    get().restoreCity();
    set({ mode: 'city', deckIndexOpen: false, deckSourcesOpen: false, deckInfo: null, activeId: null });
    if (get().phase !== 'explore') get().enterCity();
    else flyTo(OVERVIEW.position, OVERVIEW.target);
  },

  /**
   * Salto desde la presentación a un caso de uso concreto de la ciudad 3D.
   * Guarda capítulo, paso y selección para poder volver exactamente aquí.
   */
  jumpToSolution: (id, opts = {}) => {
    const s = get();
    if (!s.solutions.some((x) => x.id === id)) return false;
    s.rememberDeck();
    s.restoreCity();
    set({ mode: 'city', deckIndexOpen: false, deckSourcesOpen: false, deckInfo: null });
    if (opts.layer) set({ dataLayer: opts.layer });
    get().select(id);
    return true;
  },

  deckGoto: (chapter, step = 0) => {
    const CH = chaptersFor(get().deckTrack);
    const c = Math.max(0, Math.min(chapter, CH.length - 1));
    set({
      deckChapter: c,
      deckStep: Math.max(0, Math.min(step, CH[c].steps - 1)),
      deckIndexOpen: false,
      deckInfo: null,
    });
  },

  /** Avanza un paso; al agotar los del capítulo, salta al siguiente. */
  deckNext: () => {
    const { deckChapter, deckStep, deckTrack } = get();
    const CH = chaptersFor(deckTrack);
    const steps = CH[deckChapter].steps;
    if (deckStep < steps - 1) return set({ deckStep: deckStep + 1, deckInfo: null });
    if (deckChapter < CH.length - 1) return set({ deckChapter: deckChapter + 1, deckStep: 0, deckInfo: null });
    return undefined; // último paso del último capítulo: no se sale solo
  },

  /** Retrocede un paso; al principio del capítulo, al final del anterior. */
  deckPrev: () => {
    const { deckChapter, deckStep, deckTrack } = get();
    if (deckStep > 0) return set({ deckStep: deckStep - 1, deckInfo: null });
    if (deckChapter > 0) {
      const prev = deckChapter - 1;
      return set({ deckChapter: prev, deckStep: chaptersFor(deckTrack)[prev].steps - 1, deckInfo: null });
    }
    return undefined;
  },

  /** Capítulo entero adelante/atrás. */
  deckNextChapter: () => {
    const { deckChapter, deckTrack } = get();
    if (deckChapter < chaptersFor(deckTrack).length - 1) set({ deckChapter: deckChapter + 1, deckStep: 0, deckInfo: null });
  },
  deckPrevChapter: () => {
    const { deckChapter } = get();
    if (deckChapter > 0) set({ deckChapter: deckChapter - 1, deckStep: 0, deckInfo: null });
  },

  toggleDeckPause: () => set({ deckPaused: !get().deckPaused }),
  toggleDeckIndex: () => set({ deckIndexOpen: !get().deckIndexOpen }),
  toggleDeckSources: () => set({ deckSourcesOpen: !get().deckSourcesOpen }),

  /* --- selección --------------------------------------------------- */
  activeId: null,

  select: (id) => {
    const sol = get().solutions.find((s) => s.id === id);
    if (!sol) return;
    set({ activeId: id, phase: 'explore', mode: 'city', matrixOpen: false });
    const [ax, ay, az] = sol.anchor;
    flyTo(sol.camera ?? [ax + 220, ay + 120, az + 260], [ax, ay * 0.5, az]);
  },

  clearSelection: () => {
    set({ activeId: null });
    flyTo(OVERVIEW.position, OVERVIEW.target);
  },

  /* --- filtros de dos ejes ------------------------------------------ */
  filterIndustries: [],
  filterCapabilities: [],

  toggleIndustry: (id) => {
    const list = get().filterIndustries;
    set({ filterIndustries: list.includes(id) ? list.filter((x) => x !== id) : [...list, id] });
  },
  toggleCapability: (id) => {
    const list = get().filterCapabilities;
    set({ filterCapabilities: list.includes(id) ? list.filter((x) => x !== id) : [...list, id] });
  },
  /** Salta a una celda de la matriz: una industria y una solución concretas. */
  focusCell: (industry, capability) => {
    set({ filterIndustries: [industry], filterCapabilities: [capability], matrixOpen: false });
    const list = get().visibleSolutions();
    if (list.length) get().select(list[0].id);
  },
  /** "Enséñame esta solución en todas las industrias". */
  focusCapability: (capability) => {
    set({ filterCapabilities: [capability], filterIndustries: [], matrixOpen: false, activeId: null });
    flyTo(OVERVIEW.position, OVERVIEW.target);
  },
  clearFilters: () => set({ filterIndustries: [], filterCapabilities: [] }),

  visibleSolutions: () => {
    const { solutions, filterIndustries, filterCapabilities } = get();
    return solutions.filter(
      (s) =>
        (!filterIndustries.length || filterIndustries.includes(s.industry)) &&
        (!filterCapabilities.length || (s.capabilities ?? []).some((c) => filterCapabilities.includes(c)))
    );
  },

  isVisible: (sol) => {
    const { filterIndustries, filterCapabilities } = get();
    return (
      (!filterIndustries.length || filterIndustries.includes(sol.industry)) &&
      (!filterCapabilities.length || (sol.capabilities ?? []).some((c) => filterCapabilities.includes(c)))
    );
  },

  /* --- carga: si algo falla, se cuenta en pantalla ---------------------- */
  loadError: null,
  setLoadError: (loadError) => set({ loadError }),

  /* --- idioma de la presentación --------------------------------------- */
  lang: (typeof localStorage !== 'undefined' && localStorage.getItem('mti-lang')) || 'es',
  setLang: (lang) => {
    try {
      localStorage.setItem('mti-lang', lang);
    } catch {
      // navegación privada: se queda solo en memoria
    }
    set({ lang });
  },

  /* --- el mismo catálogo sobre un mapa vectorial (MapLibre) -------------- */
  mapMode: false,
  toggleMapMode: () => set({ mapMode: !get().mapMode }),

  /* --- rendimiento: nivel que el propio motor va ajustando -------------- */
  perfLevel: 2, // 2 alto · 1 medio · 0 ligero

  /* --- montaje: fundido de corte entre planos lejanos ------------------ */
  cut: 0, // se incrementa para disparar el fundido
  shotIndex: 0,
  flashCut: () => set({ cut: get().cut + 1 }),
  markShotChange: (shotIndex) => set({ shotIndex }),

  /* --- controles de ciudad (plegables para no comer sitio) ------------- */
  controlsOpen: false,
  toggleControls: () => set({ controlsOpen: !get().controlsOpen }),

  /* --- estilo de la ciudad -------------------------------------------- */
  cityStyle: 'moderno',
  styleHour: null,
  cityDetails: true,
  streetFlow: true,
  autoOrbit: true,
  motionEnabled: typeof window === 'undefined' || !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  toggleCityOption: (key) => {
    if (['cityDetails', 'streetFlow', 'autoOrbit', 'motionEnabled'].includes(key)) set({ [key]: !get()[key] });
  },
  setCityStyle: (cityStyle) => {
    if (!['moderno', 'foto', 'maqueta', 'tecnico'].includes(cityStyle)) return;
    const s = get();
    if (cityStyle === 'tecnico' && s.cityStyle !== 'tecnico') {
      set({ cityStyle, styleHour: s.hour, hour: 22, night: true });
    } else if (s.cityStyle === 'tecnico' && cityStyle !== 'tecnico') {
      const hour = s.styleHour ?? 17;
      set({ cityStyle, styleHour: null, hour, night: hour < 7.2 || hour > 20.4 });
    } else set({ cityStyle });
  },
  cycleCityStyle: () => {
    const order = ['moderno', 'foto', 'maqueta', 'tecnico'];
    const i = order.indexOf(get().cityStyle);
    get().setCityStyle(order[(i + 1) % order.length]);
  },

  /* --- capas de datos ------------------------------------------------ */
  dataLayer: null, // 'traffic' | 'coverage' | 'energy' | 'waste' | 'air'
  setDataLayer: (id) => set({ dataLayer: get().dataLayer === id ? null : id }),

  /* --- simulación de incidente --------------------------------------- */
  incident: false,
  incidentStep: 0,
  incidentProgress: 0,
  setIncidentState: (step, progress) => {
    if (step !== get().incidentStep || Math.abs(progress - get().incidentProgress) > 0.02) {
      set({ incidentStep: step, incidentProgress: progress });
    }
  },
  startIncident: () => {
    set({ incident: true, incidentStep: 0, incidentProgress: 0, activeId: null, tour: false, matrixOpen: false });
  },
  stopIncident: () => set({ incident: false, incidentStep: 0, incidentProgress: 0 }),
  toggleIncident: () => (get().incident ? get().stopIncident() : get().startIncident()),

  /* --- hora del día --------------------------------------------------- */
  // 0..1 = 00:00..24:00. Mueve el sol, el encendido y la densidad de tráfico.
  hour: 17,
  setHour: (hour) => set({ hour, night: hour < 7.2 || hour > 20.4 }),

  /* --- modos de presentación ---------------------------------------- */
  night: false,
  toggleNight: () => get().setHour(get().night ? 13 : 22),

  /**
   * Calidad gráfica. 'alta' con sombras y bloom; 'baja' para portátiles flojos o
   * proyectores (sin sombras, sin post-proceso, menos tráfico). Se puede forzar
   * con ?quality=baja en la URL.
   */
  quality:
    (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('quality')) ||
    (typeof window !== 'undefined' && window.localStorage?.getItem('mti-quality')) ||
    'alta',
  setQuality: (quality) => {
    try {
      window.localStorage?.setItem('mti-quality', quality);
    } catch {
      /* modo privado: da igual */
    }
    set({ quality });
  },
  toggleQuality: () => get().setQuality(get().quality === 'alta' ? 'baja' : 'alta'),

  // modo fotorrealista (Google 3D Tiles): solo si hay clave configurada
  photoAvailable: Boolean(import.meta.env?.VITE_GOOGLE_TILES_KEY),
  photoMode: false,
  togglePhoto: () => get().photoAvailable && set({ photoMode: !get().photoMode }),

  matrixOpen: false,
  toggleMatrix: () => set({ matrixOpen: !get().matrixOpen }),

  tour: false,
  tourProgress: 0,
  setTourProgress: (tourProgress) => set({ tourProgress }),
  startTour: () => {
    set({ tour: true, phase: 'explore', tourProgress: 0, matrixOpen: false });
    const list = get().visibleSolutions();
    if (list.length) get().select(list[0].id);
  },
  stopTour: () => set({ tour: false, tourProgress: 0 }),
  toggleTour: () => (get().tour ? get().stopTour() : get().startTour()),

  /* --- overlays ------------------------------------------------------ */
  docSolution: null,
  openDoc: (sol) => set({ docSolution: sol }),
  closeDoc: () => set({ docSolution: null }),

  helpOpen: false,
  toggleHelp: () => set({ helpOpen: !get().helpOpen }),

  creditsOpen: false,
  toggleCredits: () => set({ creditsOpen: !get().creditsOpen }),

  sidebarCollapsed: false,
  toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
}));

/* En desarrollo el store queda accesible desde la consola y desde los scripts
   de comprobación de `scripts/`. En producción no se expone nada. */
if (import.meta.env?.DEV && typeof window !== 'undefined') {
  window.__mtiStore = useStore;
}
