# MTI · Solutions Explorer

Plataforma web para presentar **Mingo Things** en reuniones. Son dos experiencias
conectadas entre sí:

- **Conocer MTI** — un recorrido corporativo de siete capítulos con globo
  interactivo, escenas animadas y flujos de datos. Sustituye al PowerPoint.
- **Explorar soluciones** — la ciudad 3D viva donde cada caso de uso tiene su
  punto luminoso, su ficha animada, su documentación en PDF y su enlace a demo.

Se salta de una a otra en cualquier momento, y al volver se retoma en el punto
exacto donde se dejó.

![stack](https://img.shields.io/badge/React_19-Vite_5-0ea5e9?style=flat-square) ![stack](https://img.shields.io/badge/three.js-R3F-E6A817?style=flat-square) ![stack](https://img.shields.io/badge/Node-Express_5-10b981?style=flat-square)

## Arrancar

```bash
npm install
npm run dev          # API (5181) + web (5180) a la vez → abre http://localhost:5180
```

Para presentar desde un equipo sin entorno de desarrollo:

```bash
npm run build
npm start            # sirve web + API en http://localhost:5181
```

## Los dos ejes: industrias × soluciones

El catálogo no es una lista plana. Cada caso de uso pertenece a **una industria**
(dónde se aplica) y combina **varias soluciones** (qué se despliega):

| Industrias                                                            | Soluciones                                                                                                                                       |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Smart Cities · Transporte y Movilidad · Medio Ambiente y Residuos · Estadios y Grandes Recintos · Edificios y Facilities · Construcción y Obra | Centro de Control · IoT y Sensórica · Seguridad y Videovigilancia · Agentic AI · Analítica y Predictivo · Integración · Conectividad y Edge · Gemelo Digital |

Ocho casos de uso: **Smart Hypervisor** (centro de control), **agua y contadores
inteligentes**, **videovigilancia urbana**, **smart lighting**, **gestión de
edificios**, **flota y transporte público**, **waste management** y **smart
stadium**. Así se responde en reunión a "¿y esto en un estadio?": el **Centro de
Control** aparece en ciudad, en recinto y en edificio; el **IoT** en agua,
alumbrado, residuos, edificios y flota. La tecla `M` abre la **matriz** completa:
pulsar una celda salta al caso concreto, pulsar una columna muestra esa solución en
todas las industrias.

## El mismo catálogo sobre un mapa (MapLibre)

El botón **Mapa** de la barra superior abre una segunda lectura del explorer:
en vez de la ciudad construida y guardada en el proyecto, un **mapa vectorial**
(MapLibre GL con estilos de CARTO, gratis y sin clave) al que se le levantan los
edificios con `fill-extrusion`. Tres estilos: oscuro, claro y callejero.

No es un mapa muerto:

- **Modelos 3D de verdad encima del mapa**: MapLibre admite una *capa
  personalizada* que te entrega el contexto WebGL y la matriz de la cámara, así
  que se monta una escena de three.js con los mismos GLB de la ciudad. Hay un
  **autobús** parado en la Estació del Nord, un **camión de la basura** que
  recorre de verdad una calle del Fort Pienc —se le pasa el viario del volcado
  y lo sigue, ida y vuelta— y una **grúa torre** girando en las obras de La
  Sagrera. Al pulsar cualquiera de los tres se abre su caso y arranca su
  relato; la zona de clic del camión viaja con él. Añadir más es una línea en
  la lista `MODELOS` de `MapView.jsx`.
- **Dos capas de datos reales, sin clave y sin registro**:
  **Bicing en vivo** (formato GBFS del sistema de bicicleta pública de
  Barcelona: 545 estaciones con disponibilidad real, refrescadas cada 30 s) y
  **lluvia** (radar de RainViewer, las últimas dos horas animadas). Sirven para
  enseñar el argumento de fondo: la plataforma se alimenta de lo que ya hay, no
  solo de sus propios sensores.

- **Capas vivas**: coches, taxis, autobuses y camiones circulan por el **mismo
  viario real** que usa la ciudad 3D (`public/city/barcelona.json`, invirtiendo
  su proyección a latitud/longitud), y los contenedores se pintan con su color
  según el llenado. Dos fuentes GeoJSON refrescadas a 12 Hz con un temporizador
  —no con `requestAnimationFrame`, que en equipos justos se lo queda la ciudad
  3D y la flota se paraba.
- **El relato completo**: al elegir un caso —desde el mapa, desde el panel
  lateral o pulsando su modelo 3D— arranca el mismo guion de cuatro tiempos.
  Aquí va más rápido (primera tarjeta a los 2,5 s) y **mucho más cerca** (zoom
  17,4-17,9): lo que se cuenta pasa en una calle, no en la comarca. En pantalla
  hay dos piezas: una **chapa de alerta con el icono, clavada sobre el sitio**
  donde ocurre, y la **tarjeta al lado**, unidas por un hilo. La tarjeta se
  coloca midiendo los paneles de la interfaz, así que nunca se sale del hueco
  libre, y tanto ella como el cuadro de mando **crecen con la pantalla**
  (`clamp` sobre `vw`): en un monitor grande pesan lo mismo que los paneles de
  la ciudad 3D.
- **El mismo cuadro de mando**: el panel del caso —foto real del activo, tres
  cifras que laten, gráfica y registro— también se pinta sobre el mapa, en HTML.
  Los datos salen de `src/data/panels.js`, que comparten las dos lecturas: se
  escriben una vez y se ven igual en la ciudad 3D y en el mapa.
- **El panel lateral y la ficha mandan sobre el mapa**: se filtra y se elige
  caso igual que en la ciudad 3D.

Dos decisiones de rendimiento que se notan:

1. El radar se pide hasta zoom 9 y por encima se amplía la tesela: pedir zoom
   de calle a un radar meteorológico es pedir imágenes que no existen (y llenar
   la consola de 429).
2. El mapa **se prepara con la aplicación**, no al pulsar el botón: cuando la
   ciudad 3D termina de cargar, el mapa ya está descargando su estilo y sus
   teselas de fondo. Abrirlo tarda menos de un segundo en vez de quince.
3. Solo Barcelona: `maxBounds` sobre la extensión del volcado y zoom entre 13 y
   18,5. No se descargan teselas de medio mundo, y con el mapa delante **la
   ciudad 3D deja de dibujar** (`frameloop="never"`), así que la GPU es toda
   para MapLibre.

Sirve para comparar los dos caminos:

| | Ciudad 3D (la principal) | Mapa MapLibre |
| --- | --- | --- |
| Conexión | **no hace falta**, todo descargado | obligatoria, las teselas llegan en directo |
| Alcance | la zona preparada de Barcelona | el mundo entero, sin preparar nada |
| Aspecto | maqueta, ortofoto real, tráfico y escenas animadas | mapa con etiquetas de calle, volúmenes y flota viva |
| Relato | los cuatro tiempos, con la escena animada detrás | los mismos cuatro tiempos, sobre el mapa |

Detalle de montaje: MapLibre carga su *worker* con una ruta relativa a su
propio paquete, que Vite no emite. Por eso el worker y su módulo compartido se
sirven desde `public/maplibre/` y la aplicación se lo indica con
`setWorkerUrl()`. Sin eso el mapa se queda cargando para siempre, y sin dar
ningún error.

## Publicar en Vercel

Con `vercel.json` ya en el repositorio no hace falta configurar nada: framework
Vite, salida `dist`, reescritura a `index.html` para todo lo que no sea un
archivo real y caché larga para lo pesado (`/city`, `/models`, `/maplibre`).

Dos avisos, por experiencia propia:

1. **No dejes `VITE_CITY` vacía** en el panel de Vercel. Daba igual antes,
   porque el código usaba `??` y una cadena vacía no es `null`: se pedía
   `/city/.json`, que no existe, y la carga se quedaba colgada en la pantalla
   del logotipo, sin decir nada. Ahora se usa `||` y cualquier valor vacío cae
   en `barcelona`, pero mejor no ponerla si no se va a usar.
2. **No hay API en Vercel.** `GET /api/solutions` responde 404 y la aplicación
   sigue con el catálogo local; lo único que se pierde es la detección
   automática de qué PDF existe. Para tener eso hay que desplegar también
   `server/index.js` (Railway, Render, un VPS…) y servir la web desde ahí.

Y si algo falla al cargar, ahora **se ve**: la barra se pone en rojo y debajo
aparece el motivo, en vez de quedarse girando para siempre.

## Dos idiomas

En la portada se elige **castellano o inglés** antes de entrar, y la elección se
recuerda para la próxima vez. Cambia todo lo que se lee: la interfaz, el
catálogo, los relatos de las escenas y los cuadros de mando. Los textos de la
interfaz están en `src/i18n.js` —con el castellano como clave, así que si falta
una traducción se ve el original y nunca una clave rota— y el contenido de venta
en `src/data/en.js`.

## Dónde está cada caso

Solo dos casos están donde de verdad se hicieron: el **Camp Nou** y los
**autobuses de TMB**. Esos llevan `realPlace: true` en el catálogo y su
ubicación se rotula en pantalla. Los demás se colocan por la ciudad únicamente
para poder enseñarlos, así que **no se rotula dónde están**: sería vender un
proyecto que no existe.

## La ciudad es Barcelona de verdad

Nada está inventado. Todo se descarga y se deja en el proyecto:

```bash
npm run city:fetch     # geometría de OpenStreetMap  → public/city/barcelona.json
npm run city:ortho     # ortofoto aérea del ICGC     → public/city/barcelona-ortho/
npm run city:photos    # fotos de los paneles        → public/photos/
```

- **Geometría** (OSM, ODbL): **29.962 edificios** con sus huellas y alturas reales,
  7.244 calles y 1.006 zonas verdes de una zona de **6,6 × 4,3 km** que va del
  **Camp Nou** a **Glòries**.
- **Ortofoto** (ICGC, CC BY 4.0): 15 teselas a **0,76 m/píxel**. Es el suelo —calles,
  plazas, patios de manzana, arbolado— y también la **cubierta de cada edificio**:
  cada tejado lleva proyectada su propia foto aérea.
- **Fachadas y relieve**: módulo dibujado con las proporciones del Eixample (planta de
  3,3 m, hueco vertical, balcón de forja y línea de forjado). El volumen se refuerza
  horneando en los vértices el sombreado por orientación de cada fachada, una cornisa en
  el remate y oclusión en el arranque; encima van sombras reales cuya caja sigue al punto
  que mira la cámara, así son nítidas aunque la ciudad mida kilómetros.
- **Tráfico**: circula por el **grafo de calles real**; en cada cruce el vehículo elige
  una calle conectada de verdad.

Los casos de uso se anclan por **coordenadas geográficas** (`latlon` en
`solutions.js`), así que se pueden cambiar de zona sin tocar nada: Camp Nou, Torre
Glòries, Parc de la Ciutadella, Mercat dels Encants, Estació del Nord, Mercat del
Fort Pienc…

### Cada caso se cuenta como un relato

Al abrir un caso no se enciende todo a la vez. Primero entra el **rótulo grande**
en el centro y se lee con calma; después la escena va contando la historia en
cuatro tiempos, con tarjetas que brotan del punto donde pasa algo y un hilo de
datos que sube hasta la plataforma:

1. **pasa algo** — el contenedor se llena, el acceso se satura, el contador no para
2. **llega a Smart Hypervisor** — la señal sube y se cruza con el resto de sistemas
3. **se decide** — ruta recalculada, tornos abiertos, orden de trabajo
4. **se resuelve** — el camión llega, el flujo se normaliza, el sector se estabiliza

Cada tarjeta lleva su paso (`1/4 · SUCEDE`, `2/4 · PLATAFORMA`…), así que la
secuencia se sigue sin explicarla. El texto se dibuja en un lienzo de 620×168
que reserva la columna derecha para la chapa del paso y la hora, encoge el
título lo justo y parte el subtítulo en dos líneas: ningún texto se sale ni se
monta encima de otro (comprobado sobre los 96 textos del catálogo). Y mientras un caso está abierto la ciudad
**se queda solo con él**: los puntos y las etiquetas de los demás se apagan para
que nada compita con lo que se está contando.

La regla que hace legible todo esto: **mientras hay una tarjeta en pantalla la
cámara no se mueve**. Se planta delante, a la distancia a la que esa tarjeta se
lee —el tamaño se calcula a partir de la distancia del plano, así que ocupa lo
mismo en un contenedor que en un estadio entero— y espera. Entre tarjeta y
tarjeta hay un travelling corto de dos segundos hasta el siguiente encuadre. Los
planos se colocan **a lo largo del eje de la calle**, nunca de frente contra una
medianera.

Cada caso tiene además **varias tandas de casuísticas** que se van turnando en
cada vuelta: el estadio cuenta gente, energía y seguridad; el agua, fuga,
consumo anómalo y telelectura; el autobús, la tecnología a bordo, la operación
de la línea y el mantenimiento predictivo.

Para cambiar de zona: edita el preset en `scripts/fetch-city.mjs`, lanza los tres
scripts y listo. Con `?city=test` se carga una zona mínima para equipos sin GPU.

### Modo fotorrealista (opcional)

Con una clave de Google Maps Platform (Map Tiles API) en `.env`:

```
VITE_GOOGLE_TILES_KEY=AIza...
```

aparece el botón **Fotorrealista** (tecla `P`), que sustituye la ciudad de OSM por las
**Photorealistic 3D Tiles de Google** — la misma malla fotogramétrica de Google Earth,
reorientada para que encaje con las coordenadas de la app.

**Cuidado con el coste**: no es gratis. Es un SKU Enterprise con **1.000 peticiones
gratis al mes** y **6 $ por cada 1.000** a partir de ahí; el antiguo crédito de 200 $/mes
desapareció el 28/02/2025. Cada tesela descargada cuenta, así que una demo moviéndose por
la ciudad consume miles. Antes de activarlo: restringir la clave por dominio, poner
presupuesto con alertas en Google Cloud y dejar OSM como modo por defecto. La atribución
de Google se pinta sola; no la quites.

Encima de la ciudad se cargan modelos 3D (~3 MB) para el detalle cercano:

- **Tráfico**: ~480 vehículos (coches, taxis, furgonetas, autobuses, camión de recogida,
  policía y ambulancia con sirena) circulando por las calles reales
- **70 peatones** con animación esquelética caminando por las aceras reales
- **Mobiliario urbano**: farolas, semáforos, bancos, arbolado, contenedores portuarios
- **Red de videovigilancia**: cámaras que barren la escena y muestran su cono de visión
  al activar cualquier caso de seguridad
- Las torres de la Sagrada Família, que OSM no modela, se añaden por código
- Modo **día / noche** con ventanas encendidas, farolas, faros y bloom

Los modelos son CC0 / CC-BY de [poly.pizza](https://poly.pizza) y los datos de ciudad son
ODbL de OpenStreetMap — atribución completa en [CREDITS.md](CREDITS.md), en el pie de la
web y en Ayuda → Créditos. Si un `.glb` falta, la ciudad se dibuja igual con primitivas:
la demo nunca se rompe.

## Escenas: cada caso de uso se cuenta solo

Al abrir un caso no se hace solo zoom: se monta una **escena** con su coreografía de
cámara y su panel de datos en vivo (KPIs, gráfico y registro de eventos que se mueven).

| Caso de uso | Qué se ve |
| ----------- | --------- |
| **Videovigilancia** | travelling por el eje de la calle hasta una cámara real, con un **monitor en vivo** que renderiza la escena desde el punto de vista de la propia cámara: dentro se ven los peatones y sus recuadros de detección, con rótulo, testigo de grabación y reloj |
| **Smart Stadium** | vuelo alrededor del **Camp Nou** con la operación del recinto |
| **Flota conectada** | cámara de persecución detrás de un autobús con su telemetría a bordo |
| **ITS y tráfico** | línea de aforo sobre el cruce y un contador 3D de vehículos/hora que va subiendo |
| **Residuos** | contenedores con su nivel de llenado y el **camión de recogida** recorriendo la ruta, trazada **por calles reales** (no en línea recta), con la cámara persiguiéndolo |
| **Alumbrado** | atardece, y un frente de encendido recorre las **farolas reales** del sector alejándose del punto de mando |
| **Gemelo digital** | plano de escaneo recorriendo el distrito sobre una malla de referencia |
| **Resto** | pulsos de sensor sobre el edificio y panel con los KPIs del caso |

Al abrir un caso entra un **rótulo de escena** con barras cinematográficas, como el
título de un plano. Cada panel lleva una **foto real** del activo del que habla (la cámara, el autobús, los
contenedores, el Camp Nou…), tres cifras con su **icono** —energía, personas, vehículos,
alertas, ruta…—, una serie temporal en movimiento y el registro de eventos. Además se
resalta con una caja luminosa el edificio del que se está hablando. Cada escena es una **secuencia de planos** —general para situar, aproximación con el campo
de visión cerrándose, travelling y plano de detalle— con enlaces suaves entre ellos. Si el
salto entre escenas es largo, se **corta con un fundido** en vez de volar medio minuto por
encima de la ciudad. Algunas escenas cambian el ambiente: el alumbrado atardece solo, y al
salir se recupera la hora anterior.

La coreografía va con **reloj real**, así que dura lo mismo en un portátil flojo que en
una estación de trabajo. En cuanto arrastras el ratón, la cámara vuelve a ser tuya.

## Estilos de ciudad

La misma geometría real, cuatro lecturas (tecla `T`, o el panel *Vista de la ciudad*):

| Estilo | Qué es | Cuándo usarlo |
| ------ | ------ | ------------- |
| **Moderno** | Fachadas de cristal y piedra clara, bordes de cubierta, agua animada y calles con flujos | Vista inicial para explorar y presentar la ciudad |
| **Foto aérea** | Ortofoto real del ICGC en suelo y cubiertas | Máximo realismo, el que impresiona |
| **Maqueta** | Sin fotografía: volúmenes claros sobre calles dibujadas | Se lee mejor al señalar cosas; va muy suelto en equipos flojos |
| **Técnico** | Plano oscuro de sala de control, calles luminosas | Hablar de gemelo digital y centro de mando |

Cambiar de estilo no reconstruye nada: solo intercambia materiales. La paleta se conserva durante las transiciones de luz. Al salir de Técnico se recupera la hora anterior.

En **Detalle y movimiento** se pueden activar por separado los bordes y marcas de calle, los flujos de tráfico, la órbita y la animación urbana. La cámara espera ocho segundos después de una interacción antes de volver a orbitar. La preferencia del sistema de reducir movimiento desactiva la animación ambiental al abrir la ciudad.

### Nitidez al acercarse

La ortofoto base cubre 7,8 × 5,1 km a 0,76 m/píxel, que se ve pixelada a pie de calle. Por
eso hay una **segunda capa de detalle** sobre el corredor Sagrada Família–Glòries a
**0,24 m/píxel** (3× más nítida), que se descarga y se muestra sola cuando la cámara baja
de 420 m, y se retira al subir. Se genera con:

```bash
npm run city:ortho -- --detail --span=2000 --cols=4 --rows=4 --x=2200 --z=-860
```

Ajustando `--x`, `--z` y `--span` se puede poner la zona de detalle donde interese.

## Capas de datos

Siete lecturas ilustrativas sobre la geometría real de la ciudad. Los mapas de calor se
funden al cambiar de capa; la conectividad dibuja enlaces elevados con pulsos animados.
Las intensidades y conexiones son de demostración, no mediciones en vivo:

| Capa | Se calcula a partir de |
| ---- | ---------------------- |
| Zonas verdes | polígonos de parques y jardines de OpenStreetMap |
| Conectividad urbana | nodos de calle distribuidos por los barrios, unidos por enlaces ilustrativos |
| Intensidad de tráfico | jerarquía real de la trama viaria (primarias, secundarias…) |
| Cobertura de cámaras | posiciones de las cámaras de la simulación |
| Consumo energético | volumen construido de cada edificio |
| Llenado de contenedores | puntos de acera repartidos por la ciudad |
| Calidad del aire | campo continuo sobre la zona |

Tecla `L` para recorrerlas. Debajo, la **línea de tiempo del día**: mueve el sol —con sus
sombras largas a primera y última hora—, el cielo, el encendido del alumbrado y el modo noche.
Incluye accesos a amanecer, día, atardecer y noche.

Comprobaciones de movimiento y continuidad de la iluminación: `node --test scripts/city-motion.test.mjs`.

## Simulación de incidente

El botón **Incidente** (tecla `I`) lanza una secuencia de 45 segundos que enseña cómo
encajan las verticales entre sí, con narración paso a paso:

1. La videoanalítica detecta una colisión y genera el aviso
2. El centro de mando correlaciona cámaras, aforo y sensores
3. Se despacha la ambulancia más cercana, que **conduce hasta el punto por calles reales**
   (enrutado voraz sobre el grafo viario) con prioridad semafórica
4. Se dibuja el corredor de desvío del tráfico
5. Se cierra el aviso y queda trazado

Es el argumento que no se puede contar enseñando las verticales por separado.

## Rendimiento

La ciudad son ~30.000 edificios y ~480 vehículos. Además del modo reducido manual, el motor
**se ajusta solo**: mide los fotogramas por segundo cada segundo y medio y, si no llega a
30, recorta primero las sombras y después la resolución de render; si sobra músculo, las
recupera. A eso se suman:

- **Peatones por nivel de detalle**: se animan los esqueletos cercanos, a media frecuencia
  los intermedios, y los lejanos ni se dibujan
- **Faros solo de noche**: de día no se recalculan 480 matrices por frame
- **Ortofoto de detalle bajo demanda**: se carga al bajar de 420 m y se retira al subir
- **Paneles a 10 Hz**: repintar el canvas a 60 fps no aporta nada

Para portátiles antiguos o proyectores hay además el modo reducido manual (sin sombras ni
post-proceso y con menos tráfico):

```
http://localhost:5181/?quality=baja      # se recuerda en el navegador
http://localhost:5181/?city=test         # zona mínima, para equipos sin GPU
http://localhost:5181/?ortho=off         # sin foto aérea (solo volúmenes)
```

## Cómo se usa en una reunión

| Acción              | Atajo                                          |
| ------------------- | ---------------------------------------------- |
| Girar / zoom        | arrastrar · rueda                              |
| Abrir un caso de uso| clic en el punto luminoso, la etiqueta o la lista |
| Matriz industrias × soluciones | `M`                                 |
| Modo presentación   | `Espacio` (recorre los casos cada 14 s)        |
| Ciudad OSM ↔ fotorrealista | `P` (si hay clave de Google configurada) |
| Día / noche         | `N`                                            |
| Volver atrás        | `Esc`                                          |
| Ir al caso N        | `1` … `9`                                      |
| Ayuda               | `H`                                            |

## El recorrido corporativo

Al terminar la carga, la portada ofrece los dos caminos. El recorrido son siete
capítulos y 43 pasos; cada paso es un movimiento de cámara, una capa que se
enciende o un dato que avanza sobre la misma escena, no una pantalla nueva.
Nada avanza solo: quien presenta manda.

### Qué hay detrás de cada escena

Hay dos escenarios 3D y se alternan según la coreografía de
`src/deck/choreography.js`:

- **La ciudad 3D real**, conducida desde el recorrido (cámara, capas de datos,
  filtros, hora del día). Las cifras y capacidades se anclan sobre edificios
  reales y la ciudad las coloca frame a frame, sin solaparse.
- **Un lienzo 3D propio y persistente** (`src/deck/stage/`) con estaciones
  separadas en el mismo espacio: el logo de partículas, el globo, la obra que
  se construye y la cadena de plataformas. La cámara viaja de una a otra
  atravesando el campo de partículas.

| # | Capítulo | Pasos | Escenario |
|---|----------|-------|-----------|
| 01 | MTI en una frase | 4 | Logo de partículas → descenso a Barcelona → **¿Cómo?**, una secuencia de ~34 s que se reproduce sola (`src/deck/HowStory.jsx`): la necesidad de un cliente, entra MTi, hardware y software, instalación y mantenimiento 24/7, vista completa e industrias → cifras de grupo sobre edificios |
| 02 | Presencia global | 4 | Globo con países reales y banderas: sede en Barcelona → oficinas (el globo gira descubriéndolas) → proyectos → exploración |
| 03 | Dónde trabajamos | 8 | Foto de alta resolución a toda la altura a la derecha. Zonas de la ciudad; cada sector vuela a su zona y activa su sistema (industria y ciberseguridad, con foto, telemetría y red). Cada sector trae su esquema «Cómo funciona»: qué entra → qué hace MTi → qué sale |
| 04 | Cómo entregamos | 8 | **De extremo a extremo**: diagrama de flujo con preguntas (¿hardware? ¿software?) que se construye despacio → una infraestructura se construye: plano → equipos → conectividad → integración → centro de control → mantenimiento → operación |
| 05 | Nuestras plataformas | 7 | Un dato recorre dispositivo → thethings.io → MTi Hypervisor → Digital Twin → Agentic AI → acción |
| 06 | Proyectos que lo prueban | 11 | Portada con mosaico de proyectos en movimiento y tres accesos (recorrer los más relevantes, filtrar por línea de negocio —incluidos los casos de IA agentiva— o verlos en el mapa) → nueve proyectos con la foto real a sangre y un reel «qué hicimos» (monitor + instalamos → captamos → integramos → resultado) → los clientes en órbita alrededor de MTi |
| 07 | Hablemos | 1 | Contacto sobre la ciudad en operación y salto a las presentaciones de cada línea de servicio (Agentify AI…), a la ciudad 3D o a un proyecto |

«¿Cómo?» (`src/deck/HowStory.jsx`) vive en un plano virtual de 1440 × 760; una
cámara recorre el guion de tiempos (`T`, `CAMERA`) y una frase grande narra cada
momento. Se para con la pausa y tiene botón «Ver de nuevo». Contenido en
`SCENES.opening.how`.

El esquema «Cómo funciona» es el componente `src/deck/FlowDiagram.jsx`: fichas
de entrada, núcleo MTi con sus pasos y fichas de salida, unidos por cables SVG
que se miden sobre la maquetación real. Un pulso recorre el ciclo completo
(entradas → pasos del núcleo → salidas) en 6,4 s. Sus datos por sector están en
`SCENES.sectors.flows` de `src/data/deck.js`.

Las oficinas (Barcelona, Madrid, Sabadell, Les Franqueses del Vallès, Dubái,
Arabia Saudí, Egipto, Kenia, México y Malasia) las facilitó MTI directamente; se
editan en `PLACES` de `src/data/deck.js`. Al pasar de un paso a otro, el bloque
de texto saliente se funde mientras entra el nuevo (componente `Swap`).

### Recorridos por línea de servicio: Agentify AI

Además del corporativo hay recorridos por línea de servicio. El primero es
**Agentify AI** (IA Agentiva), construido a partir de
`public/MTi_Group_IA_Agentiva_Recort_v.01.pptx`. Tiene seis capítulos y 38 pasos:

| # | Capítulo | Pasos | Escenario |
|---|----------|-------|-----------|
| 01 | IA que actúa | 3 | Portada con cifras y clientes → «un chat se queda en la respuesta; un agente sigue trabajando» → cuatro rasgos |
| 02 | Cómo funciona | 3 | El orquestador 3D detecta (PDF, correo, IoT, CRM, voz) → encamina a los agentes → actúa (ERP, correo, ticket) sobre la capa de datos |
| 03 | Ocho agentes | 9 | Catálogo → cada agente con su esquema entra→plataforma→sale, su vista de producto animada, su stack y sus clientes en producción |
| 04 | Catorce despliegues | 15 | Mosaico filtrable por agente → cada caso a pantalla completa con cifras, agentes, qué hace y con qué está conectado |
| 05 | Cómo lo entregamos | 5 | Discovery → piloto → escalado → operación (el anillo de datos se completa por cuartos) → qué recibes desde el día uno |
| 06 | Por qué MTi | 3 | Cinco razones → resultados agregados → cierre con contacto |

Cómo se llega y cómo se vuelve:

- **Proyectos** (capítulo 06, portada): el filtro por línea de negocio incluye los
  casos de IA agentiva; al pulsar uno se abre en Agentify.
- **Hablemos** (capítulo 07): «Explorar otros servicios» abre el recorrido desde
  el principio.
- **Índice** (`Esc`): pestañas por recorrido.
- En la cabecera, **Presentación MTI** vuelve al punto exacto del recorrido
  corporativo desde el que se salió. Ir a la ciudad y volver retoma el recorrido
  y el paso en el que estabas.

Contenido en `src/data/agentic.js` (castellano) y `src/data/agentic.en.js`
(inglés). La escena 3D es `src/deck/stage/OrchestratorStation.jsx` y las escenas
están en `src/deck/scenes/agentic/`. Las vistas de producto (borrador de correo,
hoja de pre-cierre, llamada, CRM, pedido, albarán, consulta con fuentes, no
conformidad) reproducen los ejemplos de la propia presentación y se rotulan como
vista ilustrativa.

Los esquemas de los agentes y de los 14 casos llevan los **logos reales** de las
herramientas que nombra la presentación (Gmail, Outlook, Odoo, SAP, HubSpot,
Salesforce, WhatsApp, Excel, PDF…): registro en `src/data/logos.js`, archivos en
`public/assets/logos/`. Cada caso tiene su propio esquema entra → solución →
sale en `AG_CASE_FLOWS` de `src/data/agentic.js`. Si un contenido no cabe en una
pantalla baja, `FitBox` lo escala entero en vez de cortarlo.

**Añadir otra línea** (seguridad, smart cities…): un archivo de datos con sus
capítulos, su entrada en `TRACK_CHAPTERS` de `src/data/tracks.js`, su entrada en
`SERVICE_TRACKS` de `src/data/deck.js` y sus escenas. Las tarjetas de «Explorar
otros servicios» y «Explorar más proyectos» y las pestañas del índice la
recogen solas.

### Cómo se conduce

| Control | Hace |
|---------|------|
| `→` `Espacio` `AvPág` · rueda · deslizar | Siguiente paso |
| `←` `RePág` · rueda · deslizar | Paso anterior |
| `↑` `↓` | Capítulo anterior / siguiente |
| `Inicio` `Fin` | Principio / final |
| `Esc` | Índice (o cierra lo que esté abierto) |
| `P` | Pausa las animaciones de ambiente |
| `F` | Panel interno de fuentes y pendientes de validación |

`prefers-reduced-motion` congela el ambiente sin quitar contenido. Sin WebGL, la
portada lo indica, el recorrido usa sus versiones planas (mapa del mundo en
SVG, cifras en rejilla) y se ocultan los enlaces a la ciudad.

### Ir y volver entre la presentación y la ciudad

- **Explorar soluciones** (cabecera) lleva a la ciudad libre.
- Sectores, líneas de servicio, plataformas, proyectos y logos abren su caso de
  uso **solo si existe de verdad** en el catálogo.
- Al salir se guardan capítulo, paso y selección (ubicación del globo, agente,
  logo…) y la ciudad vuelve exactamente a como estaba antes del recorrido.
  **Volver a la presentación** devuelve a ese punto.

### Recursos de la presentación

```bash
npm run deck:stock    # descarga las fotos de alta resolución (Wikimedia Commons) a assets-src/stock
npm run deck:assets   # extrae y optimiza los medios del .pptx (no lo modifica) y esas fotos
npm run deck:globe    # hornea los países del globo (Natural Earth 1:110m)
```

El script lee las dos presentaciones (corporativa y de IA Agentiva); cada
recurso del manifiesto dice de cuál sale (`source`). Los recursos quedan en
`public/assets/mti-presentation/` (`brand`, `clients`, `projects`, `sectors`,
`services`, `platforms`, `backgrounds`, `icons`, `agentic/cases`), en
WebP (y SVG donde el original lo es), con versión de 960 px para móvil y vista
previa difuminada. El manifiesto `src/data/presentationAssets.js` relaciona cada
archivo con cliente, proyecto, sector, plataforma, capítulo, texto alternativo y
caso de uso. La aplicación nunca abre el `.pptx`.

### Editar los textos

`src/data/deck.js` (castellano) y `src/data/deck.en.js` (inglés, mezclado por
`id`). Cada bloque lleva `src` (páginas del PDF) y, si falta confirmar algo,
`review`: no se enseña nunca al cliente, sale en el panel de la tecla `F`. Las
cifras llevan `scope` —grupo, plataforma o proyecto— y se rotulan así.

### Comprobar el flujo completo

```bash
npm run dev
npm run deck:check    # sin ventana, con la GPU del equipo
```

Recorre los 43 pasos, el recorrido de Agentify AI (entradas desde proyectos y
cierre, sus 38 pasos, el filtro de casos, ida y vuelta a la ciudad, índice por
recorridos), el globo (selección, arrastre, redimensionado, reentrada), rueda y
pausa, el salto a la ciudad y el regreso exacto, la ciudad original, móvil,
movimiento reducido y un equipo sin WebGL. Falla si hay errores en
consola. Capturas en `.artifacts/deck/`.

## Añadir o editar un caso de uso

Todo el catálogo vive en un único archivo: [`src/data/solutions.js`](src/data/solutions.js).
Cada entrada genera automáticamente el hotspot 3D, la tarjeta del panel, la celda de la
matriz y la ficha.

```js
{
  id: 'mi-caso',
  industry: 'industry',                       // clave de INDUSTRIES (define color e icono)
  capabilities: ['digital-twin', 'iot'],      // claves de CAPABILITIES
  title: 'Título del caso de uso',
  tagline: 'Frase corta con gancho.',
  anchor: [x, y, z],                          // dónde aparece el punto luminoso
  camera: [x, y, z],                          // desde dónde lo mira la cámara
  summary: '…',
  bullets: ['…'],
  kpis: [{ value: 62, suffix: '%', label: 'Ahorro energético' }],
  stack: ['thethings.io'],
  references: ['Cliente o proyecto'],
  pdf: 'docs/mi-caso.pdf',                    // archivo dentro de server/docs/
  demo: 'https://…',                          // enlace externo (o null)
}
```

- **PDFs**: se dejan en [`server/docs/`](server/docs/README.md) con el nombre indicado en `pdf`.
  El backend detecta si existe y el visor lo abre embebido; si falta, la ficha explica
  dónde ponerlo en vez de dar error.
- **Demos**: cualquier URL externa; se abre en una pestaña nueva.

## Estructura

```
scripts/fetch-city.mjs      descarga y hornea la geometría real de OSM
scripts/deck-walk.mjs       comprobación de extremo a extremo del recorrido
scripts/extract-presentation.mjs  extrae y optimiza los recursos del .pptx
scripts/build-globe.mjs     hornea los países del globo
src/
  data/solutions.js         catálogo: industrias, soluciones y casos de uso
  data/deck.js              contenido del recorrido corporativo (+ deck.en.js)
  data/deckLocale.js        mezcla contenido y traducción; notas de revisión
  data/presentationAssets.js  manifiesto de recursos extraídos del .pptx
  deck/Deck.jsx             armazón: navegación, teclado, rueda, gestos, índice, fuentes
  deck/choreography.js      qué se ve en cada paso: escenario, cámara, capas
  deck/cityBridge.js        conduce la ciudad 3D desde el recorrido y ancla rótulos
  deck/scenes/              las siete escenas (capa de texto, fotos y controles)
  deck/stage/               lienzo 3D propio: logo, globo, obra y cadena de plataformas
  deck/parts.jsx            fotos, logos, rótulos anclados, contadores, enlaces
  three/realcity.js         ciudad real: edificios, calles, parques, cámaras CCTV
  three/realtraffic.js      tráfico y peatones sobre el grafo de calles real
  three/assets.js           carga de modelos glTF, normalizado e instanciado
  three/hotspots.js         marcadores 3D por caso de uso
  three/theme.js            interpolación día ↔ noche
  components/CityScene.jsx  escena react-three-fiber (cámara, luces, bloom, loop)
  components/PhotoCity.jsx  modo fotorrealista con Google 3D Tiles (opcional)
  components/Overlays.jsx   loader, intro, barra, filtros, matriz, ficha, visor PDF
  store.js                  estado global (zustand) y objetivo de cámara
server/index.js             API Express + servidor de PDFs + build de producción
public/city/                geometría real de la ciudad (generada, ver CREDITS.md)
public/models/              modelos 3D (ver CREDITS.md)
```

## API

| Endpoint                 | Devuelve                                                      |
| ------------------------ | ------------------------------------------------------------- |
| `GET /api/solutions`     | industrias, soluciones, matriz y casos con `docUrl`/`docAvailable` |
| `GET /api/solutions/:id` | un caso de uso                                                |
| `GET /api/health`        | estado del servicio                                           |
| `GET /docs/:archivo`     | PDF de documentación                                          |

Si la API no está levantada, la web sigue funcionando con el catálogo local
(el punto junto al logo indica si la API está conectada).

## Reuniones · espacios de pre-clientes

Arriba a la izquierda (portada y ciudad; dentro del recorrido, en el índice) el
botón **Reuniones** abre las propuestas preparadas para cada cliente. Hoy:
**ESPOL** (Escuela Superior Politécnica del Litoral, Guayaquil).

Cada espacio es un recorrido propio con la estética MTi y el color del cliente:

1. **MTi × cliente**: portada con sus cifras públicas y su campus en 3D
   (geometría real de OpenStreetMap).
Al elegir el cliente se elige también **cómo se ve su campus**: Holográfico
(estética MTi), Satélite (imagen aérea real), Maqueta (blanco arquitectónico) o
Mapa (cartografía). Se puede cambiar en cualquier momento desde la cabecera.

2. **Lo que proponemos**: ocho soluciones, una por paso (seguridad, consumo
   energético, sensórica en aulas, eficiencia energética, bosque, centro de
   mando, IA agentiva, living lab). Consumo, sensórica y eficiencia llevan un
   **panel en vivo** (datos simulados, rotulados así) sincronizado con el campus:
   el edificio que se pone rojo en 3D es el que salta en el panel. Primero el campus anima la
   solución (cámaras y conos de visión, consumo por edificio, sensores del
   bosque, centro de mando, agentes de IA, laboratorio vivo); a los cinco
   segundos, o al pulsar «Cómo funciona», entra el esquema entra → MTi → sale con
   logos reales y los **ejemplos reales de MTi** (proyectos, casos de Agentify AI,
   demos de la ciudad 3D). Al saltar a un ejemplo, la cabecera devuelve al punto
   exacto del cliente.
3. **Cómo empezaríamos**: discovery, piloto, escalado y operación.
4. **Siguiente paso**: contacto y saltos al resto de MTi.

```bash
npm run client:campus -- --client=espol   # campus de OSM → public/clients/espol/campus.json
npm run client:check                      # prueba completa del espacio (con npm run dev)
```

Para añadir un cliente, ver `docs/GUIA-DEVELOPER.md` (6.3 bis).
