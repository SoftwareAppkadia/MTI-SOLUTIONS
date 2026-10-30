# MTI Solutions Explorer · Guía para developers

Todo lo que hace falta saber para trabajar en este código: qué hace, cómo está
montado, qué librerías y servicios usa, cómo se añaden cosas y qué conviene
optimizar para que cargue más rápido y pese menos.

> Complementa al `README.md` (más orientado a uso) y a `CREDITS.md` (licencias y
> atribuciones). Si algo de aquí contradice al código, manda el código.

---

## 1. Qué es

Una web de ventas para reuniones con dos modos, que se eligen en la portada:

| Modo | Qué es | Dónde vive |
|---|---|---|
| **Explorar soluciones** | Una ciudad 3D real (Barcelona: geometría de OpenStreetMap + ortofoto del ICGC) donde cada caso de uso de MTI se cuenta como una escena animada con su panel de datos. Tiene además un **modo mapa** (MapLibre). | `src/components/`, `src/three/` |
| **Conocer MTI** | Una presentación inmersiva que sustituye al PowerPoint corporativo: 7 capítulos, escenas 3D propias y la ciudad como decorado. Incluye recorridos por línea de servicio (hoy: **Agentify AI**). | `src/deck/` |

Los dos modos comparten estado (zustand) y se puede saltar de uno a otro y
volver al punto exacto.

---

## 2. Arranque rápido

```bash
npm install
npm run dev          # API (5181) + web Vite (5180) a la vez
npm run build        # build de producción en dist/
npm start            # Express sirve dist/ + la API (producción sin Vercel)
```

Variables de entorno (`.env`, ver `.env.example`):

| Variable | Para qué | Obligatoria |
|---|---|---|
| `VITE_GOOGLE_TILES_KEY` | Activa el modo fotorrealista (Google Photorealistic 3D Tiles) | No |
| `VITE_CITY` | Preset de ciudad a cargar (`barcelona` por defecto, también `?city=` en la URL) | No |

Parámetros de URL útiles: `?quality=baja` (equipos modestos), `?city=test`.

### Scripts

| Script | Qué hace | Cuándo |
|---|---|---|
| `city:fetch` | Descarga edificios, calles, árboles… de OpenStreetMap (Overpass) → `public/city/barcelona.json` | Al cambiar de zona |
| `city:ortho` / `city:ortho:detail` | Descarga la ortofoto del ICGC en teselas → `public/city/barcelona-ortho*/` | Al cambiar de zona |
| `city:photos` | Fotos de Wikimedia Commons para los paneles de la ciudad → `public/photos/` | Ocasional |
| `deck:assets` | Extrae y optimiza imágenes de los dos `.pptx` + fotos de stock → `public/assets/mti-presentation/` y `presentationAssets.meta.json` | Al cambiar el manifiesto de recursos |
| `deck:stock` | Descarga las fotos de alta resolución (Wikimedia) a `assets-src/stock/` (no se publica) | Antes de `deck:assets`, una vez |
| `deck:globe` | Hornea países y malla de puntos del globo (Natural Earth) → `public/geo/` | Casi nunca |
| `deck:check` | Prueba de extremo a extremo con Puppeteer y GPU real (necesita `npm run dev` arrancado) | Antes de entregar |
| `client:campus` | Descarga el campus de un cliente de OpenStreetMap → `public/clients/<id>/campus.json` (`npm run client:campus -- --client=espol`) | Al crear un espacio cliente |
| `client:looks` | Miniaturas de las cuatro vistas del campus para el selector → `public/clients/<id>/looks/` | Tras cambiar un estilo |
| `client:check` | Prueba del espacio cliente: Reuniones, capítulos, saltos a ejemplos reales y vuelta, móvil (`CLIENT=espol`) | Antes de una reunión |

> **Importante:** la app **nunca** lee los `.pptx` en ejecución. Solo los usan
> los scripts. Los `.pptx` originales no se modifican ni se mueven.

---

## 3. Stack y librerías

### En la aplicación (`dependencies`)

| Librería | Versión | Para qué se usa |
|---|---|---|
| **react / react-dom** | 19 | UI. Componentes funcionales y hooks; nada de clases. |
| **zustand** | 5 | Estado global único (`src/store.js`). Expuesto como `window.__mtiStore` en desarrollo. |
| **three** | 0.170 | Motor 3D de la ciudad y de las escenas del recorrido. |
| **@react-three/fiber** | 9 | Three.js en React (`<Canvas>`, `useFrame`). |
| **@react-three/drei** | 10 | Utilidades: `OrbitControls`, `Html` (rótulos HTML en 3D), `AdaptiveDpr`, `Stars`, `Line`… |
| **@react-three/postprocessing** | 3 | `Bloom` y `Vignette` de la ciudad. |
| **3d-tiles-renderer** | 0.5 | Modo fotorrealista opcional (Google 3D Tiles). |
| **maplibre-gl** | 6 | Modo mapa (vectorial) con capas vivas y modelos 3D. |
| **express / compression** | 5 / 1 | Backend mínimo: API del catálogo y PDFs. |

### Solo en desarrollo (`devDependencies`)

| Librería | Para qué |
|---|---|
| **vite** + **@vitejs/plugin-react** | Bundler y servidor de desarrollo (proxy `/api` y `/docs` al 5181). |
| **concurrently** | Arrancar API y web juntos. |
| **sharp** | Procesado de imágenes en los scripts (WebP, recortes, LQIP, logos). |
| **puppeteer** | Pruebas de extremo a extremo y capturas. |

No hay TypeScript, ni framework de CSS, ni router: la navegación es estado
(`mode`, `deckChapter`, `deckStep`…). CSS plano por archivo.

---

## 4. Arquitectura general

```
index.html → src/main.jsx → src/App.jsx
                               │
          ┌────────────────────┼────────────────────────┐
          │                    │                        │
   CityScene (siempre)   MapView (lazy)          Deck (lazy)
   ciudad 3D R3F         MapLibre                presentación
          │                                             │
     src/three/*                              src/deck/* (+ DeckStage lazy)
          └──────────────── src/store.js (zustand) ─────┘
```

- **`src/App.jsx`** carga la ciudad (datos + modelos, con barra de progreso),
  decide el modo y monta las piezas. `MapView` y `Deck` se cargan con
  `React.lazy` (trozos aparte en el build).
- **`src/store.js`** es la única fuente de verdad: modo (`choice | deck | city`),
  caso activo, filtros, capas, hora del día, calidad, idioma, y todo el estado
  del recorrido (`deckTrack`, `deckChapter`, `deckStep`, `deckSel`, punto de
  retorno…). Las acciones viven en el propio store.
- **`src/components/Overlays.jsx`** es toda la interfaz HTML de la ciudad
  (portada, barra superior, matriz industrias × soluciones, fichas, créditos).
- **i18n:** `src/i18n.js` + `src/data/en.js` para la ciudad; el recorrido usa
  `deck.js` / `deck.en.js` mezclados por `id` en `src/data/deckLocale.js`.
  El castellano es el idioma de referencia: lo que falte en inglés se queda en
  castellano.

### Backend (`server/index.js`)

| Ruta | Qué devuelve |
|---|---|
| `GET /api/solutions` | Catálogo (`src/data/solutions.js`) + si existe el PDF de cada solución |
| `GET /api/solutions/:id` | Una solución |
| `GET /api/health` | Ping |
| `/docs/*` | PDFs de `server/docs/` |
| resto | En producción, el build de `dist/` |

En **Vercel** (`vercel.json`) el front se sirve estático; la API no se despliega
ahí salvo que se configure aparte (las funciones que dependen de ella se
ocultan si no responde).

---

## 5. La ciudad 3D

### 5.1 Datos (se generan con scripts, no en ejecución)

| Dato | Origen | Archivo | Peso aprox. |
|---|---|---|---|
| Edificios, calles, árboles, aceras | OpenStreetMap vía Overpass API | `public/city/barcelona.json` | 11 MB |
| Ortofoto (suelo y tejados) | ICGC (WMS abierto) | `public/city/barcelona-ortho/` (16 teselas) | 24 MB |
| Ortofoto de detalle | ICGC | `public/city/barcelona-ortho-detail/` (17 teselas) | 16 MB |
| Modelos 3D (coches, bus, farolas, cámaras…) | poly.pizza (CC0 / CC-BY) | `public/models/*.glb` | 3,3 MB |
| Fotos de los paneles | Wikimedia Commons | `public/photos/` | 5,9 MB |

### 5.2 Módulos (`src/three/`)

| Módulo | Responsabilidad |
|---|---|
| `realcity.js` | Construye la ciudad real: extruye huellas de OSM, proyecta la ortofoto en suelo y tejados, fusiona geometrías por material (ojo: `mergeGeometries` pierde `materialIndex`, ver memoria del proyecto). |
| `moderncity.js`, `facades.js`, `citystyles.js` | Estilos de ciudad (moderno, maqueta…) y fachadas procedurales. |
| `realtraffic.js` | Coches y peatones que recorren el viario real de OSM (instanciados). |
| `assets.js` | Carga de los GLB y su escala real. |
| `theme.js`, `atmosphere.js` | Día ↔ noche y ambiente. |
| `datalayers.js` | Capas de datos (tráfico, cobertura, energía, red) como mapas de calor proyectados. |
| `connectivity.js` | Red de conectividad entre activos. |
| `cinematics.js` + `shots.js` | Director de escenas: cada caso de uso es una secuencia de planos con su guion. Es el archivo más grande (~2.300 líneas). |
| `datapanel.js` | Panel de datos 3D (canvas repintado a 10 Hz). |
| `povmonitor.js` | «Lo que ve la cámara»: segunda cámara renderizada a textura. |
| `popups.js`, `hotspots.js` | Avisos y puntos interactivos en escena. |
| `incident.js` | Simulación de incidente completo (detección → protocolo → ambulancia → cierre). |

`src/components/CityScene.jsx` monta todo en un `<Canvas>`:
`frameloop` se pone a `never` cuando la ciudad no se ve (modo mapa o recorrido
sin ciudad), `AdaptiveDpr`, `EffectComposer` con `Bloom`.

### 5.3 Catálogo

`src/data/solutions.js` define **industrias × capacidades × soluciones** (dos
ejes, no lista plana). Cada solución tiene su ancla en la ciudad, su escena, su
panel (`src/data/panels.js`) y su relato (`src/data/stories.js`).

### 5.4 Modo mapa (`src/components/Map*`)

- `MapView.jsx`: MapLibre con mapas base de **CARTO** (`basemaps.cartocdn.com`).
- `MapLive.js`: tráfico animado sobre el mismo viario de OSM.
- `MapFeeds.js`: **datos en vivo reales**: Bicing (GBFS público) y radar de lluvia
  (**RainViewer**). Sin claves; CORS abierto.
- `MapModels.js`: capa personalizada de MapLibre que pinta los GLB con three.js
  dentro del contexto WebGL del mapa.
- `MapStory.jsx`, `MapPanel.jsx`: el mismo relato y panel que en 3D, en HTML.

### 5.5 Modo fotorrealista (opcional)

`PhotoCity.jsx` usa `3d-tiles-renderer` con las **Google Photorealistic 3D
Tiles**. Solo aparece si hay `VITE_GOOGLE_TILES_KEY` (tiene coste por uso en
Google Cloud).

---

## 6. La presentación (`src/deck/`)

### 6.1 Contenido = datos

Todo el texto está en datos, no en componentes:

| Archivo | Contenido |
|---|---|
| `src/data/deck.js` / `deck.en.js` | Recorrido corporativo: capítulos, sedes, sectores, plataformas, proyectos, cierre, textos de interfaz. |
| `src/data/agentic.js` / `agentic.en.js` | Recorrido Agentify AI: agentes, 14 casos, entrega, razones. |
| `src/data/projectReels.js` | El «reel» de cada proyecto (instalamos → captamos → integramos → resultado). |
| `src/data/presentationAssets.js` (+ `.meta.json`) | Manifiesto de imágenes extraídas de los PPTX: id, origen, carpeta, alt, cliente/proyecto. El `.meta.json` lo genera el script (tamaños, LQIP). |
| `src/data/stockPhotos.js` | Fotos de alta resolución de Wikimedia con su autor y licencia. |
| `src/data/logos.js` | Logos de herramientas (Gmail, Odoo, SAP…) en `public/assets/logos/`. |
| `src/data/tracks.js` | Registro de recorridos (`mti`, `agentify`) y sus capítulos. |

Convenciones del contenido:
- `src`: páginas de la presentación de donde sale cada dato.
- `review`: nota interna de validación. **Nunca se pinta al cliente**; sale en el
  panel de fuentes (tecla **F**).
- `scope` en cifras: `grupo`, `plataforma` o `proyecto` (no se mezclan).
- Regla de oro: no inventar clientes, cifras ni integraciones. Si falta un dato,
  se pone `review`.

### 6.2 Piezas

| Pieza | Qué hace |
|---|---|
| `Deck.jsx` | Contenedor: navegación (teclado, rueda, gestos), cabecera, índice por recorridos, panel de fuentes, lienzo 3D, escena actual. |
| `choreography.js` | Qué se ve detrás de cada paso: estación 3D (`stage`), si la ciudad hace de decorado y con qué cámara/capa/hora (`city`), velo. Un solo sitio para la continuidad. |
| `cityBridge.js` | Conduce la ciudad real desde el recorrido (cámara, capas, filtros, hora) y ancla rótulos HTML a edificios (`deckAnchors`). |
| `stage/DeckStage.jsx` | **Un único lienzo 3D persistente** con estaciones en el mismo espacio: logo de partículas, globo, obra, cadena de plataformas, orquestador de agentes. La cámara viaja entre ellas. |
| `stage/fx.jsx` | Campo de partículas, líneas de datos, materiales de «pulso» (shaders propios). |
| `scenes/*.jsx` | Una escena por capítulo (y `scenes/agentic/*` para Agentify). |
| `parts.jsx` | Componentes comunes: `Photo` (srcset + LQIP), `LogoPlate`, `BrandLogo`, `MtiIcon`, `Headline`, `Counter`, `Swap` (relevo con fundido), `useGlider`… |
| `HowStory.jsx` | Secuencia «¿Cómo?» del capítulo 1: plano virtual 1440×760 con una cámara CSS que sigue un guion de tiempos. |
| `FlowChart.jsx` | Diagrama de flujo «de extremo a extremo» (Entrega). |
| `FlowDiagram.jsx` | Esquema entra → MTi → sale (sectores, agentes, casos). |
| `ProjectReel.jsx`, `ClientOrbit.jsx`, `TrackCards.jsx` | Reel de proyecto, órbita de clientes, tarjetas de salto a otros recorridos. |

### 6.3 Recorridos múltiples

`deckTrack` en el store (`mti` | `agentify`). Para añadir una línea (p. ej.
seguridad): su archivo de datos, su entrada en `TRACK_CHAPTERS` (`tracks.js`) y
en `SERVICE_TRACKS` (`deck.js`), sus escenas y su coreografía. Las tarjetas de
entrada y las pestañas del índice salen solas.

### 6.3 bis Espacios cliente (panel «Reuniones»)

Propuestas personalizadas para pre-clientes. El botón **Reuniones** (arriba a
la izquierda en portada y ciudad; en el índice del recorrido) abre
`src/components/Meetings.jsx`, que lista `CLIENT_SPACES`. Cada cliente es un
recorrido más (`deckTrack = 'espol'`) con cuatro capítulos genéricos `cl-*`
(`src/deck/scenes/client/ClientScenes.jsx`) y su campus en 3D
(`src/deck/stage/CampusStation.jsx`, geometría real de OSM con una capa animada
por solución: `security`, `energy`, `forest`, `command`, `agentify`, `lab`).

Para añadir un cliente:

1. Preset en `scripts/fetch-campus.mjs` (centro y radio) y `npm run client:campus -- --client=<id>`.
2. Logos en `public/clients/<id>/` (del propio cliente, solo para la reunión).
3. `src/data/clients/<id>.js` (+ `.en.js`) con la misma forma que `espol.js`:
   colores del cliente, cifras con su fuente, soluciones (`mode`, `flow`, `links`).
4. Registrarlo en `src/data/clients/index.js` y el inglés en `deck.en.js` (`CLIENTS`).
5. Si los nombres de sus edificios no encajan, ajustar `FOCUS`/`LABELS` en `CampusStation.jsx`.

**Vistas del campus** (`campusLook` en el store): `holo` (holográfico MTi),
`satellite` (imagen aérea de Esri World Imagery pedida en directo y cosida en
una textura), `model` (maqueta blanca) y `map` (cartografía). No hay proveedor de
mapas: el campus es OSM dibujado por nosotros, así que cada estilo es solo una
paleta de `LOOK` en `CampusStation.jsx`. Se eligen en el segundo paso de
«Reuniones» y se cambian desde la cabecera; las miniaturas del selector se
regeneran con `npm run client:looks`.

**Paneles en vivo** (`dash: 'energy' | 'sensors' | 'efficiency'` en una
solución): `scenes/client/CampusDash.jsx`. Leen las mismas funciones simuladas
que tiñen los edificios en 3D (`stage/campusLive.js`), con el reloj que publica
la estación, así lo que salta en el panel es lo que se ve en el campus.

Los `links` llevan a ejemplos reales ya presentes en la app (`project`, `case`,
`agent`, `city`); un enlace cuyo destino no existe no se pinta. Al saltar, la
cabecera ofrece volver al punto exacto del cliente. El color del cliente entra
por variables CSS (`--cl-navy`, `--cl-blue`, `--cl-sky`, `src/deck/client.css`);
el dorado se reserva para lo que hace MTi.

### 6.4 Recursos de la presentación

```
.pptx (public/, solo lectura) ─┐
assets-src/stock/*.jpg ────────┼─ deck:assets (sharp) ─▶ public/assets/mti-presentation/<carpeta>/*.webp
                               │                          + versión -960 + LQIP en .meta.json
logos (Simple Icons / Commons) ─▶ public/assets/logos/
banderas (flag-icons)          ─▶ public/assets/flags/
```

---

## 7. Integraciones externas

| Servicio | Cuándo | Para qué | Clave |
|---|---|---|---|
| OpenStreetMap · Overpass API | Scripts `city:fetch`, `client:campus` | Geometría de la ciudad y de los campus de clientes | No |
| **Esri World Imagery** | En ejecución (vista «Satélite» del campus) | Imagen aérea | No (confirmar condiciones de uso comercial) |
| ICGC (WMS) | Script `city:ortho` | Ortofoto | No |
| Wikimedia Commons | Scripts `city:photos`, `deck:stock` | Fotos | No (respetar atribución) |
| poly.pizza | Manual | Modelos GLB | No |
| Natural Earth / world-atlas | Script `deck:globe` | Países del globo | No |
| **CARTO basemaps** | En ejecución (modo mapa) | Mapa base vectorial | No |
| **Bicing GBFS** | En ejecución (modo mapa) | Estaciones en vivo | No |
| **RainViewer** | En ejecución (modo mapa) | Radar de lluvia | No |
| **Google Photorealistic 3D Tiles** | En ejecución (opcional) | Ciudad fotorrealista | Sí (`VITE_GOOGLE_TILES_KEY`) |
| **Google Fonts** | En ejecución | Inter y JetBrains Mono | No |
| API propia (`/api/solutions`) | En ejecución | Catálogo y PDFs | No |

---

## 8. Pruebas

- `npm run deck:check` (`scripts/deck-walk.mjs`): recorre los 7 capítulos paso a
  paso, Agentify completo, filtro y mapa de proyectos, globo (selección,
  arrastre, redimensionado), ida y vuelta a la ciudad, índice, móvil sin
  desbordamiento, movimiento reducido y equipo sin WebGL. Falla si hay errores
  de consola. Capturas en `.artifacts/deck/`.
- `npm run client:check` (`scripts/client-walk.mjs`): panel Reuniones, los
  cuatro capítulos del cliente, las seis soluciones con su esquema, saltos a
  proyecto / caso de Agentify AI / ciudad 3D con vuelta al punto exacto, Esc,
  inglés y móvil. Capturas en `.artifacts/client/`.
- `scripts/city-motion.test.mjs`: pruebas de movimiento de la ciudad (`node --test`).
- **Ojo:** las pruebas sin ventana deben usar la GPU real
  (`--use-angle=d3d11`); con SwiftShader va a 2-3 fps y las animaciones no son
  representativas. No lanzar dos pruebas a la vez: comparten GPU y provocan
  pérdidas de contexto.

---

## 9. Cómo añadir cosas (lo más habitual)

| Quiero… | Toca |
|---|---|
| Un caso de uso en la ciudad | `src/data/solutions.js` (+ `panels.js`, `stories.js`, `en.js`), su escena en `src/three/cinematics.js` |
| Un proyecto en la presentación | `PROJECTS` en `deck.js` (+ `deck.en.js`), `PROJECT_ORDER` en `choreography.js`, `PROJECT_REELS`, `PROJECT_LINES`, sus fotos en el manifiesto |
| Un sector | `SECTORS` + `SCENES.sectors.flows` en `deck.js`, foto en `Sectors.jsx` |
| Una oficina o país | `PLACES` en `deck.js`, bandera en `public/assets/flags/`, color en `COUNTRY_HIGHLIGHTS` (`Deck.jsx`) |
| Una imagen del PPTX | Entrada en `presentationAssets.js` y `npm run deck:assets` |
| Un logo de herramienta | Archivo en `public/assets/logos/` y entrada en `logos.js` |
| Un pre-cliente para una reunión | Ver 6.3 bis (`src/data/clients/`, `client:campus`) |
| Cambiar un texto | Solo `deck.js` / `deck.en.js` / `agentic*.js` / `clients/*.js` |

---

## 10. Peso actual (medido)

| Qué | Tamaño |
|---|---|
| JS principal (`index-*.js`: React, three, R3F, drei, postprocesado, ciudad) | **1,5 MB** (≈430 KB gzip) |
| JS modo mapa (MapLibre) | 990 KB (lazy) |
| JS presentación (`Deck` + `DeckStage`) | 260 KB + 31 KB (lazy) |
| CSS (`styles.css` + `deck.css` + `agentic.css`) | ~330 KB sin comprimir; `deck.css` ~9.900 líneas |
| `public/city/` (OSM + ortofotos) | **50 MB** |
| `public/assets/mti-presentation/` | **27 MB** (de ellos 14 MB fotos de stock) |
| `public/models/` | 3,3 MB |
| `public/photos/` | 5,9 MB |
| `.pptx` en `public/` | **28 MB** (no los usa la app, pero se publican) |

---

## 11. Optimización: tips priorizados

### Prioridad alta (mucho ahorro, poco esfuerzo)

1. **No publicar los `.pptx`.** Son 28 MB que Vercel sube y sirve y la app no
   usa. Sin moverlos (la regla del proyecto es no tocarlos): añadir un
   `.vercelignore` con `public/*.pptx`, o hacer que los scripts los lean desde
   otra carpeta y dejar en `public/` solo lo que se sirve.
2. **Caché larga para `/assets/`.** `vercel.json` ya la tiene para `/city`,
   `/models` y `/maplibre`, pero no para `/assets/` (27 MB de fotos de la
   presentación). Añadir `Cache-Control: public, max-age=31536000, immutable`
   (y versionar los nombres si cambian) o al menos `max-age=604800`.
3. **Borrar CSS muerto.** Tras los rediseños quedan reglas de componentes que ya
   no existen: `.bd__*` (BuildDiagram), `.sf*` (StoryFlow), `.hj*` (HowJourney),
   `.how-intro`/`.how-piece`, `.pillar-copy`/`.holo-*` (pilares). Son ~350
   bloques en `deck.css`. Pasarle un `purgecss` o limpiarlo a mano.
4. **Ortofoto en formato moderno.** 40 MB de JPG: convertir las teselas a **WebP o
   AVIF** (−40/60 %) o, mejor, a **KTX2/Basis** (texturas comprimidas en GPU:
   menos descarga y mucha menos memoria de vídeo).
5. **`barcelona.json` (11 MB) en binario.** Coordenadas cuantizadas
   (Int16/Float32 en un `ArrayBuffer`) o el mismo formato con Brotli. Un JSON de
   coordenadas suele bajar a 2-3 MB. Partirlo por zonas si la ciudad crece.

### Prioridad media

6. **Trocear el JS principal.** `vite.config.js` sube el aviso a 1.600 KB pero no
   trocea. Usar `build.rollupOptions.output.manualChunks` para separar `three`,
   `@react-three/*` y `postprocessing`; importar de drei solo lo necesario.
   Valorar cargar `CityScene` en diferido cuando el usuario entra por «Conocer
   MTI» y la ciudad aún no hace falta.
7. **Comprimir los GLB** con `gltf-transform` (meshopt + texturas WebP/KTX2):
   3,3 MB → <1 MB típico, cargando con `MeshoptDecoder`.
8. **Fotos de la presentación más ligeras.** Hoy las de stock van a 2.400 px y
   q78. Generar además AVIF y una versión 1.600 px para portátiles; servir con
   `<picture>`. Las del PPTX ya llevan versión de 960 px y LQIP.
9. **Precarga dirigida.** Precargar solo la foto del paso siguiente (no todas las
   del capítulo) y usar `fetchpriority="high"` en la del paso actual.
10. **Fuentes en local.** Autoalojar Inter y JetBrains Mono (subset latino,
    `woff2`) en vez de Google Fonts: una conexión menos y sin bloqueo inicial.

### Rendimiento en ejecución (fps y memoria)

11. **Varios contextos WebGL a la vez.** Ciudad, lienzo del recorrido y MapLibre
    pueden convivir; en algunos equipos el navegador pierde contexto
    (aparece intermitentemente en las pruebas como «Context Lost»). Liberar
    (`dispose`) lo que no se ve, no montar MapLibre hasta que se use (ya es
    lazy) y, a medio plazo, compartir un solo renderer.
12. **Postprocesado.** `Bloom` cuesta un pase completo a pantalla: desactivarlo
    con `quality=baja`, en móvil y cuando la ciudad solo hace de decorado.
13. **Rótulos `Html` de drei.** Cada uno es un nodo DOM que se reposiciona en cada
    fotograma. Mostrarlos solo en la estación activa (ya se hace en la mayoría)
    y limitar cuántos hay a la vez.
14. **`frameloop` bajo demanda.** La ciudad y el lienzo del recorrido ya se paran
    cuando no se ven; mantenerlo así en todo lo nuevo (y usar `invalidate()`
    para escenas estáticas).
15. **Instanciado y geometrías fusionadas.** El tráfico ya va instanciado;
    revisar que nada nuevo cree una malla por objeto repetido.
16. **Animaciones CSS.** Las secuencias usan `transform`/`opacity` (baratas). Evitar
    animar `filter: blur()` en elementos grandes en móvil: es lo más caro.

### Mantenimiento

17. **Archivos grandes.** `cinematics.js` (~2.300 líneas), `deck.css` (~9.900) y
    `Overlays.jsx` (~1.400) piden partirse por responsabilidad.
18. **Restos.** `shotM.mjs` en la raíz parece un script temporal de capturas;
    revisar y borrar si no se usa.
19. **Vite y el vigilante de archivos.** Si un cambio de CSS no aparece en el
    navegador, reiniciar `npm run dev` (ha pasado al editar `deck.css` desde
    fuera del editor).

---

## 12. Glosario rápido

- **Recorrido / track:** presentación completa (`mti`, `agentify`).
- **Capítulo / paso:** `deckChapter` / `deckStep`; cada paso es un estado de la escena, no una diapositiva nueva.
- **Estación:** escena 3D dentro del lienzo único del recorrido (`logo`, `globe`, `build`, `flow`, `orch`).
- **Coreografía:** tabla de qué se ve detrás de cada paso (`choreography.js`).
- **Ancla:** punto de un caso de uso en la ciudad donde se colocan rótulos (`deckAnchors`).
- **Review:** nota interna de validación, visible solo con la tecla F.
