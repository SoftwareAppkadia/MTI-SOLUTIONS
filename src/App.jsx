import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import CityScene from './components/CityScene.jsx';

// El modo mapa (MapLibre) solo se descarga si se pulsa el botón: no lastra la
// carga inicial de la ciudad 3D, que es lo que se usa el 99% del tiempo.
const MapView = lazy(() => import('./components/MapView.jsx'));

// El recorrido corporativo tampoco lastra el arranque: solo se descarga cuando
// alguien elige "Conocer MTI".
const Deck = lazy(() => import('./deck/Deck.jsx'));
import {
  Loader,
  Intro,
  TopBar,
  Sidebar,
  Labels,
  DetailPanel,
  DocViewer,
  HelpBox,
  Hud,
  TourFlag,
  MatrixOverlay,
  Credits,
  SceneIntro,
  CityControls,
  IncidentNarration,
  CutFade,
} from './components/Overlays.jsx';
import { useStore } from './store.js';
import { MeetingsPanel } from './components/Meetings.jsx';
import { loadModels } from './three/assets.js';
import { loadCityData, buildRealCity } from './three/realcity.js';
import { buildRealTraffic } from './three/realtraffic.js';
import { LAYERS } from './three/datalayers.js';

export default function App() {
  const setPhase = useStore((s) => s.setPhase);
  const mode = useStore((s) => s.mode);
  const mapMode = useStore((s) => s.mapMode);
  const setProgress = useStore((s) => s.setProgress);
  const loadSolutions = useStore((s) => s.loadSolutions);

  useEffect(() => {
    loadSolutions();
  }, [loadSolutions]);

  // datos reales (OSM + ortofoto), modelos 3D y construcción del mundo
  const [world, setWorld] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const setLoadErrorStore = useStore((s) => s.setLoadError);
  const applyCityCenter = useStore((s) => s.applyCityCenter);

  useEffect(() => {
    /* Sin WebGL la ciudad 3D no puede dibujarse: antes la carga se quedaba
       esperando para siempre. Ahora se salta y la portada ofrece el recorrido,
       que tiene versión plana de cada escena. */
    if (!useStore.getState().webgl) {
      setProgress(1);
      setPhase('intro');
      return undefined;
    }
    let alive = true;
    /* Ojo con `??` aquí: una variable de entorno vacía —VITE_CITY= en el panel
       de Vercel, por ejemplo— NO es null, así que `??` la daba por buena y se
       pedía `/city/.json`, que no existe: la carga se quedaba colgada para
       siempre. Con `||` cualquier valor vacío cae al preset por defecto. */
    const preset =
      new URLSearchParams(window.location.search).get('city') ||
      import.meta.env.VITE_CITY ||
      'barcelona';
    const lowQ = useStore.getState().quality === 'baja';

    (async () => {
      const [cityData, library] = await Promise.all([
        loadCityData(preset),
        loadModels((p) => alive && setProgress(0.05 + p * 0.35)),
      ]);
      if (!alive) return;
      applyCityCenter(cityData.center, cityData.extent);

      // la ortofoto son varias imágenes grandes: se avisa del progreso
      const city = await buildRealCity(cityData, library, (p) => alive && setProgress(0.4 + p * 0.4));
      if (!alive) return;
      setProgress(0.85);

      const traffic = buildRealTraffic(city.network, library, {
        center: [0, 0],
        density: lowQ ? 0.3 : 1,
        people: lowQ ? 16 : 70,
      });
      if (!alive) return;
      setWorld({ city, traffic, cityData, library });
      setProgress(0.95);
    })().catch((err) => {
      if (!alive) return;
      // que se vea: si algo falla, mejor un mensaje que una barra parada
      console.error('MTI · carga del mundo:', err);
      setLoadError(err.message);
      setLoadErrorStore(err.message);
    });

    return () => {
      alive = false;
    };
  }, [setProgress, applyCityCenter]);

  const handleSceneReady = useCallback(() => {
    setProgress(1);
    // solo la primera vez: si la escena vuelve a avisar de que está lista, la
    // portada no debe reaparecer encima de la presentación
    setTimeout(() => {
      if (useStore.getState().phase === 'loading') setPhase('intro');
    }, 550);
  }, [setPhase, setProgress]);

  // atajos de teclado pensados para presentar en reunión
  useEffect(() => {
    const onKey = (e) => {
      const s = useStore.getState();
      // con el recorrido delante, las teclas las gobierna Deck
      if (s.mode === 'deck') return;
      if (e.target instanceof HTMLElement && (e.target.matches('input, textarea, select') || (e.target.matches('button') && e.code === 'Space') || e.target.isContentEditable)) return;
      if (e.code === 'Space' && s.phase !== 'loading') {
        e.preventDefault();
        s.toggleTour();
      } else if (e.key === 'n' || e.key === 'N') {
        s.toggleNight();
      } else if (e.key === 'Escape') {
        if (s.creditsOpen) s.toggleCredits();
        else if (s.docSolution) s.closeDoc();
        else if (s.matrixOpen) s.toggleMatrix();
        else if (s.activeId) s.clearSelection();
        s.stopTour();
      } else if (e.key === 'h' || e.key === 'H') {
        s.toggleHelp();
      } else if (e.key === 'm' || e.key === 'M') {
        s.toggleMatrix();
      } else if (e.key === 'p' || e.key === 'P') {
        s.togglePhoto();
      } else if (e.key === 't' || e.key === 'T') {
        s.cycleCityStyle();
      } else if (e.key === 'i' || e.key === 'I') {
        s.toggleIncident();
      } else if (e.key === 'l' || e.key === 'L') {
        // recorre las capas de datos
        const ids = Object.keys(LAYERS);
        const i = ids.indexOf(s.dataLayer);
        s.setDataLayer(i === ids.length - 1 ? null : ids[i + 1]);
      } else if (/^[1-9]$/.test(e.key)) {
        const list = s.visibleSolutions();
        const sol = list[Number(e.key) - 1];
        if (sol) {
          s.stopTour();
          s.select(sol.id);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const deckOpen = mode === 'deck';

  return (
    <>
      {world && <CityScene onReady={handleSceneReady} world={world} deckOpen={deckOpen} />}
      {/* el mapa se prepara en cuanto la ciudad está lista, aunque no se vea:
          al pulsar "Mapa" ya está cargado */}
      {world && (
        <Suspense fallback={null}>
          <MapView cityData={world.cityData} />
        </Suspense>
      )}
      {/* La interfaz de la ciudad no se desmonta al abrir el recorrido: se
          oculta. Así las etiquetas 3D conservan sus nodos DOM y al volver todo
          está exactamente donde se dejó. */}
      <div className={`city-ui${deckOpen ? ' city-ui--away' : ''}`}>
        <Labels />
        <TopBar />
        <Sidebar />
        <CutFade />
        <SceneIntro />
        <CityControls />
        <IncidentNarration />
        <DetailPanel />
        <TourFlag />
        <MatrixOverlay />
        <Credits />
        <HelpBox />
        <Hud />
        <DocViewer />
      </div>
      {deckOpen && (
        <Suspense fallback={<DeckFallback />}>
          <Deck />
        </Suspense>
      )}
      <Intro />
      <MeetingsPanel />
      <Loader />
    </>
  );
}

/** Mientras se descarga el recorrido: el fondo ya es el suyo, no un salto. */
function DeckFallback() {
  return (
    <div className="deck-boot">
      <img src="/brand/logo-mti.png" alt="MTi · Mingo Things" />
      <i />
    </div>
  );
}
