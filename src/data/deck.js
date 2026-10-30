/**
 * MTI · Recorrido corporativo
 * ===========================
 *
 * Contenido de la presentación interactiva que sustituye al PowerPoint
 * (MTI_GROUP_Presentation_v.01.pdf, 30 páginas). Todo el texto vive aquí para
 * poder editarlo sin tocar componentes; la traducción al inglés está en
 * `deck.en.js` con la misma forma.
 *
 * CONVENCIONES
 * ------------
 * `src`      páginas del PDF de las que sale cada bloque. Sirve para auditar
 *            cifras antes de enseñarlas a un cliente.
 * `solution` id de un caso de uso del catálogo de la ciudad 3D. Solo se rellena
 *            cuando la relación es REAL; si no existe, se deja `null` y la
 *            interfaz muestra el contenido sin botón de demo.
 * `review`   nota para revisión editorial interna. NUNCA se pinta al usuario
 *            final: se ve en el panel de fuentes (tecla F).
 *
 * CIFRAS: hay tres familias que no deben mezclarse —métricas de grupo
 * (p. 2 y 5), métricas de plataforma (p. 16-21) y métricas de proyecto
 * (p. 23-28)—. Cada una lleva su `scope`.
 */

import { AGENTIFY } from './agentic.js';
import { CLIENT_SPACES } from './clients/index.js';
import { PROJECT_REELS, PROJECT_REELS_UI } from './projectReels.js';

export const CONTACT = {
  email: 'info@mingothings.com',
  phone: '+34 934 860 961',
  web: 'www.mingothings.com',
  webUrl: 'https://www.mingothings.com/',
  hq: 'HQ · Barcelona, España',
  legal: '© 2026 MTi Group — Mingothings S.L. · ISO 9001 certified',
  src: [30],
};

/* ================================================================== */
/* 1 · MTI en una frase                                                */
/* ================================================================== */

export const OPENING = {
  kicker: 'Technology Systems Integrator · Desde 2016',
  title: ['Tecnología', 'que transforma las operaciones'],
  lead:
    'Integración de sistemas, IA agéntica, IoT y smart cities para organizaciones que no se pueden permitir fallar. De extremo a extremo. Crítico. Con ROI medible.',
  manifestoKicker: 'Lo que creemos',
  manifesto:
    'Construimos tecnología que opera donde más importa: los momentos en los que una organización no se puede permitir fallar.',
  about:
    'Fundada en 2016 en Barcelona, MTi entrega soluciones críticas y complejas para el sector público y privado: ingeniería, oficina técnica, diseño de proyecto, integración de tecnologías innovadoras y gestión de proyectos llave en mano.',
  aboutNote:
    'Reforzada recientemente con la adquisición de Ingeco Vallès y Diprotech, ya parte de MTi Group.',
  divisions: [
    {
      id: 'services',
      label: 'División 01',
      title: 'Services',
      body:
        'Diseño e ingeniería, instalación e integración, certificación y auditoría, configuración y mantenimiento — para transporte, aeropuertos, metro, seguridad e infraestructura crítica.',
      tags: ['Multi-marca', 'Experto ITxPT', 'Llave en mano'],
    },
    {
      id: 'solutions',
      label: 'División 02',
      title: 'Solutions',
      body:
        'Plataformas y software propios —IoT, Digital Twin, Smart City OS e IA agéntica— desplegados en producción en ciudades, industria y utilities.',
      tags: ['MTi Hypervisor', 'thethings.io', 'Digital Twin', 'Agentic AI'],
    },
  ],
  stats: [
    { value: '25+', label: 'Países de operación', scope: 'grupo' },
    { value: '150K+', label: 'Dispositivos IoT conectados', scope: 'grupo' },
    { value: '8', label: 'Hubs de ingeniería y entrega', scope: 'grupo' },
    { value: '30+', label: 'Casos de IA en producción', scope: 'grupo' },
  ],
  src: [1, 2, 4, 5, 8],
};

/* ================================================================== */
/* 2 · Presencia global                                                */
/* ================================================================== */

/**
 * Sede, oficinas y proyectos.
 *
 * FUENTE: la lista de oficinas la ha facilitado MTI (septiembre de 2026):
 * Barcelona (sede), Madrid, Sabadell, Les Franqueses del Vallès, Dubái (EAU),
 * Arabia Saudí, Egipto, Kenia, México y Malasia. Para las que solo se conoce el
 * país, el punto se coloca en la capital y el rótulo dice solo el país.
 *
 * `satellite`: oficina a pocos kilómetros de la sede; en el globo no lleva arco
 *              ni rótulo propio (se superpondría) y aparece en la ficha de la sede.
 * `projects`:  proyectos del capítulo 6 que se enseñan al elegir esta ubicación.
 * `flag`:      código ISO 3166-1 alfa-2 de la bandera (public/assets/flags).
 */
export const PLACES = [
  {
    id: 'barcelona',
    iso: 724,
    flag: 'es',
    kind: 'sede',
    name: 'Barcelona',
    country: 'España',
    lat: 41.3874,
    lon: 2.1686,
    body: 'Sede central de MTi Group. Desde aquí se diseñan y se coordinan los proyectos de todo el mundo.',
    projects: ['aena', 'metro', 'buses', 'hospitalet', 'navantia'],
    projectsLabel: 'Proyectos en España',
    src: [1, 3, 8, 30],
  },
  { id: 'madrid', iso: 724, flag: 'es', kind: 'oficina', satellite: true, name: 'Madrid', country: 'España', lat: 40.4168, lon: -3.7038, body: 'Oficina de Madrid.' },
  { id: 'sabadell', iso: 724, flag: 'es', kind: 'oficina', satellite: true, name: 'Sabadell', country: 'España', lat: 41.5463, lon: 2.1086, body: 'Oficina de Sabadell.' },
  {
    id: 'franqueses',
    iso: 724,
    flag: 'es',
    kind: 'oficina',
    satellite: true,
    name: 'Les Franqueses del Vallès',
    country: 'España',
    lat: 41.6333,
    lon: 2.2967,
    body: 'Oficina de Les Franqueses del Vallès.',
  },
  { id: 'dubai', iso: 784, flag: 'ae', kind: 'oficina', name: 'Dubái', label: 'Dubái', country: 'Emiratos Árabes Unidos', lat: 25.2048, lon: 55.2708, body: 'Oficina en Dubái, Emiratos Árabes Unidos.' },
  {
    id: 'saudi',
    iso: 682,
    flag: 'sa',
    kind: 'oficina',
    name: 'Arabia Saudí',
    country: 'Arabia Saudí',
    lat: 24.7136,
    lon: 46.6753,
    labelSide: 'below',
    body: 'Oficina en Arabia Saudí. El distrito KAFD, en Riad, está en producción.',
    projects: ['kafd'],
    review: 'Se conoce el país de la oficina, no la ciudad: el punto está en Riad. Confirmar la ciudad si se quiere rotular.',
  },
  { id: 'egypt', iso: 818, flag: 'eg', kind: 'oficina', labelSide: 'left', name: 'Egipto', country: 'Egipto', lat: 30.0444, lon: 31.2357, body: 'Oficina en Egipto.', review: 'Se conoce el país, no la ciudad: el punto está en El Cairo.' },
  { id: 'kenya', iso: 404, flag: 'ke', kind: 'oficina', name: 'Kenia', country: 'Kenia', lat: -1.2921, lon: 36.8219, body: 'Oficina en Kenia.', review: 'Se conoce el país, no la ciudad: el punto está en Nairobi.' },
  { id: 'mexico', iso: 484, flag: 'mx', kind: 'oficina', name: 'México', country: 'México', lat: 19.4326, lon: -99.1332, body: 'Oficina en México. También hay proyectos realizados en el país.', review: 'Se conoce el país, no la ciudad: el punto está en Ciudad de México. Los proyectos en México no están detallados.' },
  {
    id: 'germany',
    iso: 276,
    flag: 'de',
    kind: 'oficina',
    name: 'Alemania',
    country: 'Alemania',
    lat: 52.52,
    lon: 13.405,
    body: 'Oficina en Alemania. También hay proyectos realizados en el país.',
    review: 'Se conoce el país, no la ciudad: el punto está en Berlín. Confirmar la ciudad si se quiere rotular. Los proyectos en Alemania no están detallados.',
  },
  {
    id: 'malaysia',
    iso: 458,
    flag: 'my',
    kind: 'oficina',
    name: 'Malasia',
    country: 'Malasia',
    lat: 3.139,
    lon: 101.6869,
    body: 'Oficina en Malasia, donde también opera la red de calidad del aire Predictive AQI.',
    projects: ['malaysia-aqi'],
    review: 'Se conoce el país, no la ciudad: el punto está en Kuala Lumpur.',
  },

  /* --- proyectos en países sin oficina ------------------------------ */
  {
    id: 'gibraltar',
    flag: 'gi',
    kind: 'proyecto',
    name: 'Aeropuerto de Gibraltar',
    label: 'Gibraltar',
    country: 'Gibraltar · Reino Unido',
    lat: 36.1512,
    lon: -5.3496,
    body: 'Acceso biométrico por iris: 126 lectores y 16 unidades biométricas.',
    src: [23],
  },
  {
    id: 'qatar',
    iso: 634,
    flag: 'qa',
    kind: 'proyecto',
    name: 'Smart Waste · Qatar',
    label: 'Qatar',
    country: 'Qatar',
    lat: 25.2854,
    lon: 51.531,
    body: 'Contenedores con RFID, control de rutas por GPS e integración municipal.',
    projects: ['qatar-waste'],
    src: [28],
  },
  {
    id: 'nsu',
    iso: 840,
    flag: 'us',
    kind: 'proyecto',
    name: 'NSU Florida · Living Lab',
    label: 'Florida',
    country: 'Estados Unidos',
    lat: 26.0787,
    lon: -80.2472,
    body: 'Sensórica ambiental, flujos de movilidad y analítica comunitaria en campus.',
    projects: ['nsu'],
    src: [28],
  },
  { id: 'poland', iso: 616, flag: 'pl', kind: 'proyecto', name: 'Polonia', country: 'Polonia', lat: 52.2297, lon: 21.0122, body: 'Proyectos realizados por MTi en Polonia.', review: 'MTI confirma proyectos en Polonia, sin detallar cuáles. El punto está en Varsovia. Completar nombre, ciudad y descripción para enseñarlos en la ficha.' },
  { id: 'france', iso: 250, flag: 'fr', kind: 'proyecto', name: 'Francia', country: 'Francia', lat: 48.8566, lon: 2.3522, labelSide: 'left', body: 'Proyectos realizados por MTi en Francia.', review: 'MTI confirma proyectos en Francia, sin detallar cuáles. El punto está en París. Completar nombre, ciudad y descripción para enseñarlos en la ficha.' },
  { id: 'italy', iso: 380, flag: 'it', kind: 'proyecto', name: 'Italia', country: 'Italia', lat: 41.9028, lon: 12.4964, labelSide: 'below', body: 'Proyectos realizados por MTi en Italia.', review: 'MTI confirma proyectos en Italia, sin detallar cuáles. El punto está en Roma. Completar nombre, ciudad y descripción para enseñarlos en la ficha.' },
  { id: 'cameroon', iso: 120, flag: 'cm', kind: 'proyecto', name: 'Camerún', country: 'Camerún', lat: 3.848, lon: 11.5021, labelSide: 'left', body: 'Proyectos realizados por MTi en Camerún.', review: 'MTI confirma proyectos en Camerún, sin detallar cuáles. El punto está en Yaundé. Completar nombre, ciudad y descripción para enseñarlos en la ficha.' },
  { id: 'chile', iso: 152, flag: 'cl', kind: 'proyecto', name: 'Chile', country: 'Chile', lat: -33.4489, lon: -70.6693, labelSide: 'left', body: 'Proyectos realizados por MTi en Chile.', review: 'MTI confirma proyectos en Chile, sin detallar cuáles. El punto está en Santiago de Chile. Completar nombre, ciudad y descripción para enseñarlos en la ficha.' },
  { id: 'argentina', iso: 32, flag: 'ar', kind: 'proyecto', name: 'Argentina', country: 'Argentina', lat: -34.6037, lon: -58.3816, body: 'Proyectos realizados por MTi en Argentina.', review: 'MTI confirma proyectos en Argentina, sin detallar cuáles. El punto está en Buenos Aires. Completar nombre, ciudad y descripción para enseñarlos en la ficha.' },
  {
    id: 'vietnam',
    iso: 704,
    flag: 'vn',
    kind: 'proyecto',
    name: 'Vietnam',
    country: 'Vietnam',
    lat: 21.0278,
    lon: 105.8342,
    body: 'Proyectos realizados por MTi en Vietnam.',
    review:
      'MTI confirma proyectos en Vietnam, pero no se ha detallado cuáles. Completar nombre, ciudad y descripción para enseñarlos en la ficha.',
  },
];

export const PLACE_KINDS = {
  sede: { label: 'Sede central', color: '#e6a817' },
  oficina: { label: 'Oficina', color: '#38bdf8' },
  proyecto: { label: 'Proyecto', color: '#f472b6' },
};

export const WORLD = {
  kicker: 'Alcance global · ejecución local',
  title: ['Desde Barcelona,', 'a cuatro continentes.'],
  lead:
    'Once oficinas en ocho países y proyectos en producción en todo el mundo, con equipos que hablan el idioma y conocen la regulación local.',
  stats: [
    { value: '11', label: 'Oficinas en 8 países', scope: 'grupo' },
    { value: '25+', label: 'Países de operación', scope: 'grupo', src: [1, 2, 3] },
    { value: '4', label: 'Continentes con oficina', scope: 'grupo' },
  ],
  review:
    'La presentación (p. 2) habla de «8 hubs de ingeniería y entrega»; la lista de oficinas facilitada tiene 11 en 8 países. El capítulo 1 mantiene «8 hubs» por ser la cifra del PDF: confirmar si sigue vigente.',
  disclosure: 'Proyectos en producción en Europa, Oriente Medio, África, Asia y América.',
  legendTitle: 'Qué hay en el mapa',
  src: [3],
};

/* ================================================================== */
/* 3 · Dónde trabajamos                                                */
/* ================================================================== */

export const SECTORS = [
  {
    id: 'security',
    num: '01',
    rank: 'Prioridad',
    icon: 'shield',
    title: 'Seguridad',
    problem: 'Miles de cámaras generan horas de vídeo que nadie puede mirar.',
    body: 'CCTV, VMS, control de accesos, perímetro y operación de sala de control.',
    tags: ['AENA', 'SIPA', 'Metro', 'Aeropuertos'],
    solution: 'urban-security',
    layer: 'coverage',
    src: [6],
  },
  {
    id: 'smart-cities',
    num: '02',
    rank: 'Foco',
    icon: 'city',
    title: 'Smart Cities',
    problem: 'Cada servicio municipal tiene su sistema y ninguno habla con los demás.',
    body: 'Centros de mando, residuos, alumbrado, movilidad, utilities y telemedida IoT.',
    tags: ['KAFD', 'Qatar', 'Hospitalet', 'NSU'],
    solution: 'command-control',
    layer: 'traffic',
    src: [6],
  },
  {
    id: 'industry-naval',
    num: '03',
    rank: 'Profundidad',
    icon: 'factory',
    title: 'Industria y Naval',
    problem: 'La planta produce datos que se quedan en la máquina y nunca llegan a la decisión.',
    body: 'Digital Twin, SCADA, Industria 4.0 y fábricas digitales de astillero.',
    tags: ['Navantia', 'Freire', 'Industria 4.0'],
    solution: null,
    review:
      'No hay todavía un caso de uso naval/industrial en la ciudad 3D. Decidir si se crea uno (fábrica digital Navantia) o si el sector se queda informativo.',
    src: [6],
  },
  {
    id: 'cybersecurity',
    num: '04',
    rank: 'Capa',
    icon: 'shield',
    title: 'Ciberseguridad',
    problem: 'Conectar la operación amplía la superficie de ataque de toda la organización.',
    body: 'Diseño de SOC, segmentación de red y cumplimiento NIS2 e ISO 27001.',
    tags: ['Zero-trust', 'Encrypted fabric'],
    solution: null,
    review: 'Sin caso de uso equivalente en el catálogo actual. Contenido informativo.',
    src: [6],
  },
  {
    id: 'venues',
    num: '05',
    rank: 'Recinto',
    icon: 'stadium',
    title: 'Recintos deportivos',
    problem: 'Noventa mil personas entran y salen en dos horas y todo tiene que salir bien.',
    body: 'CCTV de estadio, accesos, IoT y gemelo digital del recinto.',
    tags: ['FC Barcelona', 'PortAventura'],
    solution: 'stadium',
    src: [6],
  },
  {
    id: 'transport',
    num: '06',
    rank: 'Escala',
    icon: 'bus',
    title: 'Transportes',
    problem: 'Una flota entera circula sin saber en tiempo real qué le pasa a cada vehículo.',
    body: 'Metros, autobuses y aeropuertos — VMS, ITxPT, PIS y CCTV embarcado.',
    tags: ['TMB', 'Moventia', 'AENA'],
    solution: 'mobility-fleet',
    src: [6],
  },
];

export const SECTORS_ALSO = [
  { id: 'water', label: 'Agua y utilities', solution: 'water-metering' },
  { id: 'datacenter', label: 'Centros de datos', solution: null },
  { id: 'telecom', label: 'Telecomunicaciones', solution: null },
  { id: 'health', label: 'Salud y campus', solution: null },
  { id: 'public', label: 'Edificios públicos', solution: 'building-management' },
  { id: 'retail', label: 'Retail y hostelería', solution: null },
];

export const SECTORS_META = {
  kicker: 'Sectores de actividad',
  title: ['Entendemos', 'tu sector.'],
  lead:
    'Seis sectores donde MTi tiene recorrido propio, y una lista larga de entornos donde la misma tecnología encaja.',
  alsoLabel: 'También damos servicio a',
  problemLabel: 'El problema',
  src: [6],
};

/* ================================================================== */
/* 4 · Cómo entregamos                                                 */
/* ================================================================== */

export const DELIVERY_CYCLE = [
  {
    id: 'design',
    num: '1',
    title: 'Diseñar',
    body: 'Oficina técnica, diseño de proyecto, electrónica y mecánica, prototipado.',
  },
  {
    id: 'deploy',
    num: '2',
    title: 'Desplegar',
    body: 'Equipos multidisciplinares en campo instalando hardware multimarca.',
  },
  {
    id: 'integrate',
    num: '3',
    title: 'Integrar',
    body: 'Federar lo instalado con lo que ya existía: SCADA, CCTV, ITS, ERP.',
  },
  {
    id: 'operate',
    num: '4',
    title: 'Operar',
    body: 'Puesta en marcha, SLA contratado y mantenimiento 24/7 durante años.',
  },
];

export const SERVICE_LINES = [
  {
    id: 'design',
    num: '01',
    icon: 'gauge',
    title: 'Diseño e ingeniería',
    body: 'Diseño de proyecto, oficina técnica, diseño de componente electrónico y mecánico, prototipado.',
    stage: 'design',
    solution: null,
    src: [10],
  },
  {
    id: 'install',
    num: '02',
    icon: 'integration',
    title: 'Instalación e integración',
    body: 'Equipos multidisciplinares en campo: CCTV, ITS, ticketing, PIS/SIU sobre hardware multimarca.',
    stage: 'deploy',
    solution: null,
    src: [10],
  },
  {
    id: 'iot',
    num: '03',
    icon: 'sensor',
    title: 'IoT y conectividad',
    body: 'Más de 150.000 dispositivos, telemetría en tiempo real, alarmas y analítica con thethings.io.',
    stage: 'integrate',
    solution: 'water-metering',
    src: [10],
  },
  {
    id: 'ai',
    num: '04',
    icon: 'ai',
    title: 'IA agéntica',
    body: 'Orquestador y agentes especializados conectados a ERP, CRM, IoT y documentos.',
    stage: 'operate',
    solution: 'command-control',
    src: [10],
  },
  {
    id: 'twin',
    num: '05',
    icon: 'twin',
    title: 'Digital Twin y BIM',
    body: 'Gemelos a escala de edificio y de fábrica para operación, mantenimiento y energía.',
    stage: 'integrate',
    solution: 'command-control',
    src: [10],
  },
  {
    id: 'smartcity',
    num: '06',
    icon: 'city',
    title: 'Plataformas smart city',
    body: 'MTi Hypervisor y centros de mando a escala de ciudad para distritos y utilities.',
    stage: 'operate',
    solution: 'command-control',
    src: [10],
  },
  {
    id: 'cert',
    num: '07',
    icon: 'check',
    title: 'Certificación y auditoría',
    body: 'Certificación de producto, auditorías y pruebas funcionales para asegurar el cumplimiento.',
    stage: 'deploy',
    solution: null,
    src: [10],
  },
  {
    id: 'om',
    num: '08',
    icon: 'clock',
    title: 'Configuración y O&M 24/7',
    body: 'Instalación llave en mano, puesta en marcha y mantenimiento preventivo y correctivo con SLA crítico.',
    stage: 'operate',
    solution: null,
    src: [10],
  },
];

/** Las cuatro líneas que la presentación desarrolla con página propia. */
export const SERVICE_FEATURES = [
  {
    id: 'integration',
    num: 'Línea de servicio · 01',
    title: 'Integración de sistemas',
    lead:
      'Instalamos la tecnología que hace funcionar tu operación — desde el poste de CCTV en la pista hasta la pasarela SCADA dentro del astillero. Multimarca, estándar ITxPT, llave en mano.',
    chips: [
      'Diseño e ingeniería',
      'Hardware multimarca',
      'Instalación en campo',
      'Redes y fibra',
      'Puesta en marcha',
      'Mantenimiento con SLA',
      'O&M 24/7',
    ],
    claim: 'Instalamos tecnología que ya funciona junta.',
    footer: '1.900 cámaras · 5.000 autobuses · 150K dispositivos IoT · un único responsable',
    vendors: 'Bosch · Axis · Milestone · Genetec · Nedap · Siemens · Cisco · Advantech',
    solution: null,
    src: [11],
  },
  {
    id: 'transformation',
    num: 'Línea de servicio · 02',
    title: 'Transformación digital e innovación',
    lead:
      'Ayudamos a empresas intensivas en operación a repensar cómo funcionan: mapeamos procesos, prototipamos casos de IA y construimos la hoja de ruta que convierte tecnología en resultados de negocio medibles.',
    chips: [
      'Reingeniería de procesos',
      'Cimientos de datos',
      'Activación de casos de IA',
      'Personas y adopción',
      'Cumplimiento y seguridad',
    ],
    claim: 'Cinco palancas, un solo plan.',
    footer: 'Descubrir → Diseñar → Desplegar · del MVP a producción con el equipo dentro',
    vendors: 'Probado en Navantia · FERRI · Merchant Union · Hospital Álvaro Cunqueiro',
    solution: null,
    src: [12],
  },
  {
    id: 'cctv',
    num: 'Línea de servicio · 03',
    title: 'CCTV y sistemas de seguridad',
    lead:
      'Una década diseñando, instalando y operando videovigilancia crítica para aeropuertos, metros, ciudades, plantas industriales y estadios. Desde pilotos de una cámara hasta despliegues nacionales de miles.',
    chips: ['Cámaras', 'VMS / NVR', 'Analítica de vídeo', 'Control de accesos', 'Perímetro'],
    claim: 'Construimos la capa de vigilancia en la que tu operación puede confiar.',
    footer: '1.900 cámaras en AENA T1 · 5.000 autobuses · L9/L10 desde 2005 · sala 24/7',
    vendors: 'Bosch · Axis · Hikvision · Milestone · Genetec · Nedap',
    solution: 'urban-security',
    src: [13],
  },
  {
    id: 'maintenance',
    num: 'Línea de servicio · 04',
    title: 'Mantenimiento y soporte',
    lead:
      'La instalación es solo el día uno. Mantenemos los sistemas funcionando los diez años siguientes, con SLA contratado, planes preventivos y stock de repuesto listo para salir.',
    chips: ['Preventivo', 'Correctivo', 'Predictivo con IA', 'Garantía extendida'],
    claim: 'En sitio en menos de 4 horas. En cualquier punto de España.',
    footer: '24/7 · 365 · almacén de repuestos en la sede · 10+ años con TMB, AENA, KAFD y Hospitalet',
    vendors: 'Equipo propio de campo, no distribuidores',
    solution: null,
    src: [14],
  },
];

export const DELIVERY_META = {
  kicker: 'Qué hacemos · Servicios',
  title: ['Experiencia', 'de extremo a extremo.'],
  lead:
    'Del concepto y la ingeniería al despliegue de IA y la operación 24/7 — un único responsable durante todo el ciclo.',
  cycleTitle: 'El ciclo completo',
  linesTitle: 'Ocho líneas de servicio',
  featuresTitle: 'Con desarrollo propio',
  src: [9, 10, 11, 12, 13, 14],
};

/* ================================================================== */
/* 5 · Nuestras plataformas                                            */
/* ================================================================== */

export const PLATFORMS = [
  {
    id: 'thethings',
    num: '02',
    icon: 'sensor',
    name: 'thethings.io',
    role: 'Plataforma IoT',
    color: '#38bdf8',
    claim: 'Cada dispositivo. Cada lectura. Una sola capa.',
    body:
      'La capa de ingesta IoT de MTi: motor de reglas, cuadros de mando y API que consolidan cada sensor, contador, gateway y controlador en un único modelo de datos normalizado.',
    metrics: [
      { value: '150K+', label: 'Dispositivos conectados', scope: 'plataforma' },
      { value: '10 años', label: 'En producción', scope: 'plataforma' },
      { value: 'MQTT', label: 'HTTP · CoAP · LoRaWAN', scope: 'plataforma' },
      { value: '24/7', label: 'Servicio gestionado', scope: 'plataforma' },
    ],
    bullets: [
      'Cuadros de mando y analítica en tiempo real',
      'Gestión de dispositivos y alertas por umbral',
      'API REST y WebSocket para cualquier sistema aguas abajo',
    ],
    best: 'Utilities · Smart cities · Industria',
    solution: 'water-metering',
    src: [16, 17],
  },
  {
    id: 'hypervisor',
    num: '01',
    icon: 'command',
    name: 'MTi Hypervisor',
    role: 'Mando y control',
    color: '#e6a817',
    claim: 'Un cerebro para todos los sistemas de la ciudad.',
    body:
      'Capa de inteligencia de mando y control: ingiere datos de cada sistema urbano, los fusiona en tiempo real y dispara respuestas automatizadas en tráfico, transporte, seguridad, utilities y emergencias.',
    metrics: [
      { value: '25+', label: 'Ciudades desplegadas', scope: 'plataforma' },
      { value: '100+', label: 'Integraciones', scope: 'plataforma' },
      { value: '<1s', label: 'Respuesta ante alerta', scope: 'plataforma' },
      { value: '99,99%', label: 'SLA de disponibilidad', scope: 'plataforma' },
    ],
    bullets: [
      'Capa de presentación: sala de control, app móvil y APIs públicas',
      'Capa de inteligencia: motor CEP, modelos de IA y reglas de correlación',
      'Capa de integración: 100+ conectores, normalización y bus de eventos',
    ],
    best: 'Ciudades · Aeropuertos · Metros',
    solution: 'command-control',
    review:
      'La presentación llama al producto «MTi Hypervisor»; la ciudad 3D lo rotula «Smart Hypervisor». Unificar el nombre comercial.',
    src: [16, 18],
  },
  {
    id: 'twin',
    num: '03',
    icon: 'twin',
    name: 'Digital Twin',
    role: 'Gemelo digital',
    color: '#a855f7',
    claim: 'Tus activos, vivos en la nube.',
    body:
      'Conecta geometría BIM, datos de sensores IoT, nubes de puntos y documentación operativa en un único modelo vivo — desde una sola sala hasta una ciudad entera.',
    metrics: [
      { value: '50+', label: 'Proyectos activos', scope: 'plataforma' },
      { value: 'LOD 500', label: 'Fidelidad del modelo', scope: 'plataforma' },
      { value: 'IFC 4', label: 'Estándar abierto', scope: 'plataforma' },
      { value: '20+', label: 'Conectores de datos', scope: 'plataforma' },
    ],
    bullets: [
      'Edificios y facilities: energía, FM predictivo, ocupación',
      'Industria y naval: SCADA, PLC, mantenimiento predictivo',
      'Ciudades: modelo 3D LOD 1–3, capas de utilities y simulación',
    ],
    best: 'Naval · Industria · Edificios · Ciudades',
    solution: 'command-control',
    src: [16, 19],
  },
  {
    id: 'agentic',
    num: '04',
    icon: 'ai',
    name: 'Agentic AI',
    role: 'Operación autónoma',
    color: '#10b981',
    claim: 'Autonomía real en tus operaciones.',
    body:
      'No son prototipos: soluciones en producción con resultados medidos. Un agente orquestador coordina agentes especializados conectados a tu ERP, IoT, documentos y CRM, con trazabilidad completa.',
    metrics: [
      { value: '8', label: 'Agentes productizados', scope: 'plataforma' },
      { value: '30+', label: 'Casos en producción', scope: 'grupo' },
      { value: '−80%', label: 'Tiempo de generación de oferta · COPEGAL', scope: 'proyecto' },
      { value: '−70%', label: 'Preparación de oferta · FERRI', scope: 'proyecto' },
    ],
    bullets: [
      'Alertas predictivas y tareas automatizadas',
      'Asistentes en lenguaje natural e integración ERP + CRM',
      'Actualización del gemelo digital y explicabilidad completa',
    ],
    best: 'Cualquier empresa intensiva en operación',
    solution: 'command-control',
    src: [16, 20, 21],
  },
];

/** El caso de extremo a extremo que se anima en el capítulo 5. */
export const PLATFORM_FLOW = [
  {
    id: 'sense',
    platform: 'thethings',
    title: 'El sensor mide',
    body: 'Un contador de la red envía su lectura por LoRaWAN. Es uno entre más de 150.000 dispositivos conectados.',
  },
  {
    id: 'normalize',
    platform: 'thethings',
    title: 'La plataforma normaliza',
    body: 'thethings.io ingiere la lectura, la lleva al modelo de datos común y dispara la regla de umbral.',
  },
  {
    id: 'correlate',
    platform: 'hypervisor',
    title: 'El centro de control correlaciona',
    body: 'MTi Hypervisor cruza esa alerta con cámaras, tráfico y avisos abiertos: deja de ser un dato y pasa a ser un incidente.',
  },
  {
    id: 'contextualize',
    platform: 'twin',
    title: 'El gemelo lo sitúa',
    body: 'El Digital Twin muestra qué activo es, dónde está, qué documentación tiene y qué depende de él.',
  },
  {
    id: 'act',
    platform: 'agentic',
    title: 'El agente propone y ejecuta',
    body: 'Un agente prepara la orden de trabajo, avisa al responsable y deja registrada cada decisión para poder auditarla.',
  },
];

export const AGENTS = [
  {
    id: 'C01',
    title: 'AI Email Operations',
    body:
      'Cada correo respondido y cada acción disparada: lee la intención, extrae datos, consulta ERP/CRM y redacta una respuesta con contexto.',
    tags: ['Clasificación multi-intención', 'Traza completa'],
  },
  {
    id: 'C02',
    title: 'AI Tender & Offer Engine',
    body: 'Analiza documentación compleja, cuesta cada partida y redacta la oferta técnica.',
    tags: ['−50% tiempo de preparación', '100% trazabilidad'],
  },
  {
    id: 'C03',
    title: 'AI Voice Support',
    body:
      'Atención de llamadas 24/7 con traspaso a agente humano y estructuración del incidente en tiempo real.',
    tags: ['Cero audio almacenado', 'Cumple RGPD'],
  },
  {
    id: 'C04',
    title: 'AI Sales Intelligence',
    body: 'El CRM siempre al día: registra reuniones, puntúa leads y propone la siguiente mejor acción.',
    tags: ['HubSpot', 'Salesforce', 'Zoho'],
  },
  {
    id: 'C05',
    title: 'AI Order Processing',
    body: 'Del correo de pedido a la entrada en ERP: lee, interpreta los SKU, valida precios y registra.',
    tags: ['SAP', 'Odoo', 'Dynamics', 'SAGE'],
  },
  {
    id: 'C06',
    title: 'AI Delivery & Docs',
    body: 'Documentos de expedición generados, enviados y conciliados: CMR, facturas, pedidos y albaranes.',
    tags: ['Cero errores de papeleo'],
  },
  {
    id: 'C07',
    title: 'AI Knowledge Assistant',
    body:
      'Toda la documentación de la empresa, buscable al instante. RAG y grafo de conocimiento sobre especificaciones, manuales, contratos y normativa.',
    tags: ['Respuestas citadas', 'Consciente de versión'],
  },
  {
    id: 'C08',
    title: 'AI Incident & Quality',
    body:
      'Cada incidencia capturada, clasificada y resuelta. Correlaciona datos de operación para detectar anomalías antes de que escalen.',
    tags: ['Alertas predictivas', 'Análisis de causa raíz'],
  },
];

export const PLATFORMS_META = {
  kicker: 'Cuatro plataformas propias',
  title: ['El software', 'detrás de cada entrega.'],
  lead:
    'Cada producto resuelve un problema concreto. Juntos forman una sola pila integrada — del sensor en el poste al agente que toma la decisión.',
  flowTitle: 'Un dato, de punta a punta',
  flowLead: 'El mismo recorrido que hace cualquier lectura en un despliegue real.',
  agentsTitle: 'Ocho agentes. Una plataforma.',
  agentsLead:
    'Agentes productizados a partir de más de 30 despliegues reales — primero la integración, auditables, listos para tu ERP, IoT, documentos y CRM.',
  src: [15, 16, 17, 18, 19, 20, 21],
};

/* ================================================================== */
/* 6 · Proyectos que lo prueban                                        */
/* ================================================================== */

export const PROJECTS = [
  {
    id: 'aena',
    coords: [41.2974, 2.0833], // ciudad o país nombrados en la presentación
    tech: ['CCTV Bosch', 'SIPA', 'Torre de control'],
    tag: 'Insignia · Aeropuertos · Sector público',
    client: 'AENA · SIPA · Licitación pública',
    title: 'El aeropuerto insignia de España, visto desde todos los ángulos',
    place: 'Barcelona · El Prat · T1',
    challenge:
      'Poner en servicio la nueva terminal T1 con vigilancia total y una torre de control capaz de verlo todo a la vez.',
    solution:
      'Instalación masiva de 1.900 cámaras CCTV Bosch, el sistema de información SIPA y la monitorización integral de la Torre de Control.',
    outcome: 'Terminal de obra nueva cubierta de extremo a extremo y operación de torre 24/7.',
    metrics: [
      { value: '1.900', label: 'Cámaras CCTV', scope: 'proyecto' },
      { value: 'T1', label: 'Terminal · obra nueva', scope: 'proyecto' },
      { value: '24/7', label: 'Torre de control', scope: 'proyecto' },
    ],
    extra:
      'También entregado en Reino Unido: aeropuerto de Gibraltar — acceso biométrico por iris, 126 lectores y 16 unidades biométricas.',
    place3d: 'elprat',
    solutionId: 'urban-security',
    src: [23],
  },
  {
    id: 'metro',
    coords: [41.3874, 2.1686], // ciudad o país nombrados en la presentación
    tech: ['VMS', 'CCTV IP', 'Grabación', 'Integración de red'],
    tag: 'Insignia · Metro · Sector público',
    client: 'TMB · Barcelona',
    title: 'CCTV de metro: una red entera vigilada',
    place: 'Barcelona · L9 · L10',
    challenge:
      'Dar visión y control de vídeo a una red de metro en servicio, incluida la línea totalmente automática.',
    solution:
      'Ingeniería, desarrollo y personalización del software de visualización VMS, grabación y aplicaciones de control de CCTV para la L9 automática, más servicio continuado en L9/L10 y miles de cámaras IP desde 2005.',
    outcome: 'Servicio ininterrumpido con SLA crítico 24/7 e integración de red completa.',
    metrics: [
      { value: '2005', label: 'Servicio desde', scope: 'proyecto' },
      { value: 'L9 / L10', label: 'Líneas atendidas', scope: 'proyecto' },
      { value: '24/7', label: 'SLA crítico', scope: 'proyecto' },
    ],
    place3d: 'elprat',
    solutionId: 'urban-security',
    src: [13, 24],
  },
  {
    id: 'buses',
    coords: [41.3874, 2.1686], // ciudad o país nombrados en la presentación
    tech: ['CCTV embarcado', 'PIS', 'Ticketing', 'EN 50155'],
    tag: 'Insignia · Flota de autobuses · Sector público',
    client: 'TMB · Sistemas embarcados',
    title: '5.000 autobuses. Una flota integrada.',
    place: 'Barcelona · Zona Franca, Triangle, Horta y Ponent',
    challenge:
      'Equipar la flota completa de autobuses con CCTV, información al viajero y ticketing sin parar el servicio.',
    solution:
      'Instalación y gestión de CCTV embarcado, PIS y ticketing en toda la flota, principalmente en las cocheras de Zona Franca, Triangle, Horta y Ponent.',
    outcome:
      'Cámaras domo certificadas EN50155, cobertura completa de cabina, enmascarado de privacidad conforme al RGPD e instalación llave en mano en todas las cocheras.',
    metrics: [
      { value: '5.000', label: 'Autobuses equipados', scope: 'proyecto' },
      { value: '4', label: 'Cocheras · Barcelona', scope: 'proyecto' },
      { value: 'EN 50155', label: 'Certificación ferroviaria', scope: 'proyecto' },
      { value: '100%', label: 'Cumplimiento RGPD', scope: 'proyecto' },
    ],
    place3d: 'elprat',
    solutionId: 'mobility-fleet',
    src: [25],
  },
  {
    id: 'hospitalet',
    coords: [41.3597, 2.0995], // ciudad o país nombrados en la presentación
    tech: ['Telemedida', 'thethings.io', '30+ fuentes'],
    tag: 'Insignia · Smart City · Ayuntamiento',
    client: "L'Hospitalet de Llobregat · España",
    title: 'Automatización de edificios a escala de ciudad',
    place: "L'Hospitalet de Llobregat",
    challenge:
      'Saber qué consumen de verdad los edificios municipales, con datos repartidos en más de treinta sistemas distintos.',
    solution:
      'Despliegue de 157 cajas de telemedida que centralizan datos en tiempo real de más de 30 fuentes para optimizar la gestión de edificios.',
    outcome:
      'Plataforma en producción, en tiempo real, al servicio de la sostenibilidad smart city del municipio.',
    metrics: [
      { value: '157', label: 'Cajas de telemedida', scope: 'proyecto' },
      { value: '30+', label: 'Fuentes de datos', scope: 'proyecto' },
      { value: 'Live', label: 'Tiempo real · en producción', scope: 'proyecto' },
    ],
    place3d: 'elprat',
    solutionId: 'building-management',
    src: [17, 26],
  },
  {
    id: 'navantia',
    coords: [40.0, -4.0], // ciudad o país nombrados en la presentación
    tech: ['Digital Twin', 'SCADA', 'thethings.io', 'Industria 4.0'],
    tag: 'Insignia · Naval y Defensa · Empresa pública',
    client: 'Navantia · Astilleros de buques de guerra',
    title: 'Una fábrica digital para buques de guerra',
    place: 'España · astilleros',
    challenge: 'Transformar la operación de un astillero de buques de guerra en una fábrica digital medible.',
    solution:
      'Más de 80 máquinas conectadas e integradas con SCADA, PLC y sensores IoT bajo un único Digital Twin operativo, certificado por Dell NativeEdge.',
    outcome: 'Adquisición en tiempo real desde más de 80 máquinas industriales sobre thethings.io.',
    metrics: [
      { value: '80+', label: 'Máquinas conectadas', scope: 'proyecto' },
      { value: 'Digital Twin', label: 'Modelo operativo único', scope: 'proyecto' },
      { value: 'Dell NativeEdge', label: 'Certificación', scope: 'proyecto' },
    ],
    place3d: 'navantia',
    solutionId: null,
    review:
      'Sin caso de uso industrial/naval equivalente en la ciudad 3D. El proyecto se queda informativo hasta decidirlo.',
    src: [17, 27],
  },
  {
    id: 'kafd',
    coords: [24.7607, 46.6412], // ciudad o país nombrados en la presentación
    tech: ['Hypervisor', 'IoT', 'BMS', 'ITS', 'GIS'],
    tag: 'Smart city en producción · Soberano',
    client: 'KAFD · Arabia Saudí',
    title: 'KAFD Smart District',
    place: 'Riad · Arabia Saudí',
    challenge: 'Dar un mando único a un distrito insignia de 160 hectáreas con decenas de sistemas propios.',
    solution:
      'Backbone digital que integra BMS, seguridad, ITS, GIS y aplicaciones ciudadanas bajo una sola capa de mando.',
    outcome: 'Distrito de 160 hectáreas operado desde una capa de mando común.',
    metrics: [
      { value: '160 ha', label: 'Superficie del distrito', scope: 'proyecto' },
      { value: 'Hypervisor', label: 'Capa de mando', scope: 'proyecto' },
    ],
    place3d: 'kafd',
    solutionId: 'command-control',
    src: [28],
  },
  {
    id: 'qatar-waste',
    coords: [25.2854, 51.531], // ciudad o país nombrados en la presentación
    tech: ['RFID', 'GPS', 'Integración municipal'],
    tag: 'Smart city en producción · Municipal',
    client: 'Qatar · Municipal',
    title: 'Gestión inteligente de residuos',
    place: 'Qatar',
    challenge: 'Recoger residuos en un área metropolitana sin saber qué contenedor está lleno.',
    solution:
      'Plataforma conectada con contenedores RFID, control de rutas por GPS e integración municipal, en despliegue modular por distritos.',
    outcome: 'Despliegue modular sobre los distritos clave del área metropolitana.',
    metrics: [
      { value: 'RFID', label: 'Identificación de contenedor', scope: 'proyecto' },
      { value: 'GPS', label: 'Control de rutas', scope: 'proyecto' },
    ],
    place3d: 'qatar',
    solutionId: 'waste-management',
    src: [28],
  },
  {
    id: 'nsu',
    coords: [26.0787, -80.2472], // ciudad o país nombrados en la presentación
    tech: ['thethings.io', 'I+D', 'Campus'],
    tag: 'Smart city en producción · Universidad pública',
    client: 'Nova Southeastern University · Florida, EE. UU.',
    title: 'NSU Florida · Living Lab',
    place: 'Florida · Estados Unidos',
    challenge: 'Convertir un campus universitario en un laboratorio vivo de ciudad.',
    solution: 'Sensórica ambiental, flujos de movilidad y analítica comunitaria sobre thethings.io.',
    outcome: 'Living lab en funcionamiento para investigar las ciudades del futuro.',
    metrics: [
      { value: 'thethings.io', label: 'Plataforma', scope: 'proyecto' },
      { value: 'Campus', label: 'Ámbito · I+D', scope: 'proyecto' },
    ],
    place3d: 'nsu',
    solutionId: 'air-quality',
    src: [28],
  },
  {
    id: 'malaysia-aqi',
    coords: [3.139, 101.6869], // ciudad o país nombrados en la presentación
    tech: ['thethings.io', 'Alertas', 'IoT'],
    tag: 'Smart city en producción · Ambiental',
    client: 'Malasia · Autoridades locales',
    title: 'Predictive AQI',
    place: 'Malasia',
    challenge: 'Tomar decisiones de salud pública sin datos de aire propios y en vivo.',
    solution:
      'Red de sensores de CO, NO₂, PM2.5 y PM10 que da a las autoridades locales datos en vivo para decidir.',
    outcome: 'Alertas y datos ambientales en vivo sobre thethings.io.',
    metrics: [
      { value: 'CO · NO₂', label: 'PM2.5 · PM10', scope: 'proyecto' },
      { value: 'Alerting', label: 'thethings.io · IoT', scope: 'proyecto' },
    ],
    place3d: 'malaysia',
    solutionId: 'air-quality',
    src: [28],
  },
];

/** Líneas de negocio de cada proyecto insignia (filtro del capítulo 6), según su ficha. */
export const PROJECT_LINES = {
  aena: ['security', 'transport'],
  metro: ['security', 'transport'],
  buses: ['transport', 'security'],
  hospitalet: ['iot', 'smartcity'],
  navantia: ['industry', 'iot'],
  kafd: ['smartcity', 'security'],
  'qatar-waste': ['smartcity', 'iot'],
  nsu: ['iot', 'smartcity'],
  'malaysia-aqi': ['iot', 'smartcity'],
};

export const PROJECTS_META = {
  kicker: 'Proyectos insignia',
  title: ['Proyectos reales.', 'Resultados reales.'],
  lead:
    'Del aeropuerto insignia de España a las fábricas digitales de buques de guerra — los proyectos que definen qué entendemos por crítico.',
  labels: { challenge: 'El reto', solution: 'La solución', outcome: 'El resultado', client: 'Cliente' },
  clientsKicker: 'Clientes',
  clientsTitle: ['Confían', 'en nosotros.'],
  clientsLine: 'Administraciones, operadores de transporte, grupos industriales y empresas privadas.',
  customers: {
    title: 'Una década de despliegues críticos',
    lead:
      'De aeropuertos nacionales y ayuntamientos a astilleros y grupos industriales — MTi entrega tanto a contratación pública regulada como a operadores privados exigentes.',
    public: {
      title: 'MTi entrega a licitación pública.',
      body:
        'Autoridades nacionales, ayuntamientos y operadores de transporte público eligen a MTi para proyectos críticos — con procesos de licitación, habilitación de seguridad y obligaciones de SLA a largo plazo.',
      names: ['AENA', 'TMB', 'Hospitalet', 'KAFD', 'Ministerio de Defensa', 'NSU Florida'],
    },
    private: {
      title: 'Y a operadores privados.',
      body:
        'Astilleros, grupos industriales, recintos deportivos y operadores de servicios — elegidos por SLA exigentes, integración segura y ROI medible sobre la operación.',
      names: ['Navantia', 'Abertis', 'Moventia', 'Freire', 'FC Barcelona', 'PortAventura'],
    },
    logos: [
      'Navantia',
      'Abertis',
      'AENA',
      'Moventia',
      'Fujitsu',
      'Galpi',
      'RCFIL',
      'Merchant Union',
      'Copegal',
      'GMV',
      'FC Barcelona',
      'Indra',
      'TMB',
      'Etra',
      'RadioVigo',
      'Galmetec',
      'Ferri',
      'Servizo Galego de Saúde',
    ],
  },
  src: [7, 22, 23, 24, 25, 26, 27, 28],
};

/* ================================================================== */
/* 7 · Por qué MTI y cierre                                            */
/* ================================================================== */

export const REASONS = [
  {
    id: 'multibrand',
    num: '01',
    icon: 'layers',
    title: 'Instalación multimarca',
    body: 'Expertos en hardware de fabricantes diversos, sin dependencia de marca.',
    bullets: ['Independencia tecnológica', 'Montaje certificado', 'Adaptación a flota mixta'],
  },
  {
    id: 'itxpt',
    num: '02',
    icon: 'integration',
    title: 'Experiencia ITxPT',
    body: 'Dominio profundo de los estándares para una arquitectura abierta y escalable.',
    bullets: ['Integración de bus de datos', 'Auditoría de protocolos', 'Homologación de sistemas'],
  },
  {
    id: 'pm',
    num: '03',
    icon: 'clock',
    title: 'Gestión de proyectos',
    body: 'Coordinación integral de despliegues complejos en flotas grandes.',
    bullets: ['Logística de instalación', 'Parada mínima', 'Control de calidad QA'],
  },
  {
    id: 'support',
    num: '04',
    icon: 'check',
    title: 'Soporte posventa',
    body: 'Acompañamiento continuo después de la instalación y la puesta en marcha.',
    bullets: ['Mantenimiento preventivo', 'Gestión de garantías', 'Actualizaciones OTA'],
  },
  {
    id: 'hetero',
    num: '05',
    icon: 'command',
    title: 'Sistemas heterogéneos',
    body: 'Unificamos tecnologías diversas en una solución operativa coherente.',
    bullets: ['Interoperabilidad real', 'Configuración a medida', 'Solución llave en mano'],
  },
];

export const CLOSING = {
  kicker: 'Cuando quieras',
  title: ['Construyamos', 'el siguiente juntos.'],
  lead:
    'Cuéntanos tu reto. Te enseñamos cómo lo resuelve MTi — con tecnología real, integraciones reales y resultados medibles desde el primer día.',
  reasonsKicker: 'Por qué elegir MTi',
  reasonsTitle: ['Cinco razones', 'por las que nos eligen.'],
  contactTitle: 'Hablemos',
  ctaCity: 'Explorar las soluciones en la ciudad 3D',
  ctaProjects: 'Volver a los proyectos',
  ctaIndex: 'Volver al índice',
  src: [29, 30],
};

/* ================================================================== */
/* Índice de capítulos                                                 */
/* ================================================================== */

/**
 * `steps` es el número de pasos de cada capítulo. La navegación avanza paso
 * a paso y solo cambia de capítulo al agotar los suyos: nada avanza solo.
 */
export const CHAPTERS = [
  { id: 'opening', num: '01', label: 'MTI en una frase', short: 'MTI', steps: 4, src: [1, 2, 4, 5, 8] },
  { id: 'world', num: '02', label: 'Presencia global', short: 'Mundo', steps: 4, src: [3, 23, 28] },
  { id: 'sectors', num: '03', label: 'Dónde trabajamos', short: 'Sectores', steps: 8, src: [6] },
  { id: 'delivery', num: '04', label: 'Cómo entregamos', short: 'Entrega', steps: 8, src: [9, 10, 11, 12, 13, 14] },
  { id: 'platforms', num: '05', label: 'Nuestras plataformas', short: 'Plataformas', steps: 7, src: [15, 16, 17, 18, 19, 20, 21] },
  { id: 'projects', num: '06', label: 'Proyectos que lo prueban', short: 'Proyectos', steps: 11, src: [22, 23, 24, 25, 26, 27, 28] },
  { id: 'contact', num: '07', label: 'Hablemos', short: 'Contacto', steps: 1, src: [30] },
];

/**
 * Textos breves de cada escena. Es lo único que está en pantalla mientras se
 * habla: titulares, frases cortas y etiquetas. Lo largo vive en los bloques de
 * arriba y solo aparece al abrir «Más información».
 */
export const SCENES = {
  opening: {
    claim: 'Technology that transforms operations',
    claimSub: 'Tecnología que transforma las operaciones',
    facts: ['25+ países', 'Experiencia en IA', '150K+ dispositivos IoT'],
    arrival: ['Integrador tecnológico.', 'Barcelona, 2016.'],
    arrivalLine: 'Ingeniería, integración y operación de sistemas críticos para el sector público y privado.',
    /**
     * «¿Cómo?» (HowStory): una secuencia que se reproduce sola. Las líneas de
     * servicio son las de la presentación (p. 10); las industrias, las del
     * capítulo 3 y la lista «también damos servicio a».
     */
    how: {
      how: '¿Cómo?',
      client: 'Empresa o gobierno',
      captions: {
        need: 'Cuando una empresa o un gobierno tiene una necesidad…',
        mti: 'MTi interviene.',
        help: 'Y le ayuda con hardware y software.',
        ops: 'Todo con nuestra instalación y mantenimiento 24/7.',
        e2e: 'De extremo a extremo.',
        industries: 'Así hemos ayudado a todas estas industrias.',
      },
      needs: ['Integrar todos mis sistemas', 'Un software que automatice mis procesos', 'Un hardware que mida mis instalaciones', 'Ver toda mi operación desde un solo sitio'],
      hardware: {
        label: 'Hardware',
        items: [
          { mti: 'service-design', label: 'Diseño e ingeniería' },
          { mti: 'service-install', label: 'Instalación e integración' },
          { mti: 'service-cert', label: 'Certificación y auditoría' },
        ],
      },
      software: {
        label: 'Software',
        items: [
          { mti: 'service-iot', label: 'IoT y conectividad' },
          { mti: 'platform-thethings', label: 'Plataformas propias' },
          { mti: 'service-ai', label: 'IA agentiva' },
          { mti: 'service-smartcity', label: 'Smart City' },
          { mti: 'service-twin', label: 'Digital Twin' },
        ],
      },
      ops: { label: 'Instalación y mantenimiento 24/7', sub: 'Un único responsable, durante años' },
      replay: 'Ver de nuevo',
    },
    metricsHead: 'Probado a escala.',
    metrics: [
      { id: 'countries', value: '25+', label: 'países de operación', anchor: 'command-control' },
      { id: 'iot', value: '150K+', label: 'dispositivos IoT conectados', anchor: 'water-metering' },
      { id: 'hubs', value: '8', label: 'hubs de ingeniería y entrega', anchor: 'smart-lighting' },
      { id: 'ai', value: '30+', label: 'casos de IA agéntica en producción', anchor: 'urban-security' },
      { id: 'customers', value: '20+', label: 'clientes de referencia', anchor: 'waste-management' },
      { id: 'public', value: 'Público + privado', label: 'licitación pública y operadores privados', anchor: 'mobility-fleet' },
    ],
    metricsSrc: [1, 2, 5, 7],
  },
  world: {
    hq: 'Barcelona',
    hqSub: 'Sede central · desde 2016',
    network: 'Desde Barcelona, una sola red.',
    networkLine: 'Equipos regionales que hablan el idioma y conocen la regulación local.',
    projects: 'Proyectos en producción por todo el mundo.',
    explore: 'Elige una ubicación',
    countriesLabel: 'países de operación',
    hubsLabel: 'hubs de ingeniería y entrega',
    continentsLabel: 'continentes con proyectos',
    selectedProjects: 'Proyectos aquí',
    noProjects: 'Presencia confirmada en la presentación, sin proyecto detallado.',
    openProject: 'Abrir el proyecto',
  },
  sectors: {
    intro: ['Entendemos', 'tu sector.'],
    introLine: 'Seis sectores con recorrido propio. Cada uno activa un sistema distinto.',
    offMap: 'Más sectores',
    systems: {
      security: ['CCTV', 'VMS', 'Control de accesos', 'Perímetro', 'Sala de control'],
      'smart-cities': ['Centro de mando', 'Movilidad', 'Alumbrado', 'Residuos', 'Telemedida IoT'],
      'industry-naval': ['Digital Twin', 'SCADA', 'PLC', 'Industria 4.0'],
      cybersecurity: ['SOC', 'Segmentación', 'NIS2', 'ISO 27001'],
      venues: ['CCTV de estadio', 'Accesos', 'IoT', 'Gemelo del recinto'],
      transport: ['Metro', 'Autobuses', 'Aeropuertos', 'ITxPT', 'PIS', 'CCTV embarcado'],
    },
    scada: ['PLC · línea de corte', 'PLC · soldadura', 'SCADA · grúa pórtico', 'IoT · nave de montaje', 'Digital Twin · sincronía'],
    blocked: 'bloqueado',
    allowed: 'autorizado',
    alsoHead: 'Y la misma tecnología, en más entornos.',
    /* «Cómo funciona»: qué entra, qué hace MTi y qué sale, por sector. Solo
       usa los sistemas y plataformas que la presentación asocia a cada uno. */
    flowTitle: 'Cómo funciona',
    flowLabels: { in: 'Entra', core: 'MTi', out: 'Sale' },
    flows: {
      security: {
        inputs: [
          { icon: 'camera', label: 'Cámaras CCTV' },
          { icon: 'lock', label: 'Control de accesos' },
          { icon: 'sensor', label: 'Perímetro' },
        ],
        core: { icon: 'shield', kicker: 'VMS + analítica', title: 'MTi Hypervisor', steps: ['Recibe vídeo y eventos', 'Analítica de vídeo', 'Correlaciona en sala', 'Activa el protocolo'] },
        outputs: [
          { icon: 'alert', label: 'Alerta verificada' },
          { icon: 'user', label: 'Operador guiado' },
          { icon: 'doc', label: 'Evidencia trazable' },
        ],
      },
      'smart-cities': {
        inputs: [
          { icon: 'sensor', label: 'Sensores IoT' },
          { icon: 'gauge', label: 'Contadores' },
          { icon: 'lamp', label: 'Alumbrado y residuos' },
        ],
        core: { icon: 'command', kicker: 'thethings.io + Hypervisor', title: 'Centro de mando', steps: ['Captura y normaliza', 'Reglas y alarmas', 'Cruza servicios urbanos', 'Coordina la respuesta'] },
        outputs: [
          { icon: 'grid', label: 'Vista única de ciudad' },
          { icon: 'alert', label: 'Alarmas accionables' },
          { icon: 'chart', label: 'Cuadros de mando' },
        ],
      },
      'industry-naval': {
        inputs: [
          { icon: 'factory', label: 'Máquinas y PLC' },
          { icon: 'network', label: 'SCADA' },
          { icon: 'sensor', label: 'Sensores IoT' },
        ],
        core: { icon: 'twin', kicker: 'thethings.io + gemelo', title: 'Digital Twin', steps: ['Adquisición en tiempo real', 'Modelo de datos común', 'Gemelo operativo', 'Detección de desvíos'] },
        outputs: [
          { icon: 'cube', label: 'Gemelo de planta vivo' },
          { icon: 'wrench', label: 'Mantenimiento anticipado' },
          { icon: 'chart', label: 'Datos para decidir' },
        ],
      },
      cybersecurity: {
        inputs: [
          { icon: 'network', label: 'Tráfico de red' },
          { icon: 'database', label: 'Eventos y logs' },
          { icon: 'user', label: 'Accesos' },
        ],
        core: { icon: 'lock', kicker: 'SOC · segmentación', title: 'Zero-trust', steps: ['Monitoriza la red', 'Segmenta y aísla', 'Detecta la amenaza', 'Responde y registra'] },
        outputs: [
          { icon: 'shield', label: 'Amenaza contenida' },
          { icon: 'check', label: 'NIS2 · ISO 27001' },
          { icon: 'doc', label: 'Registro auditable' },
        ],
      },
      venues: {
        inputs: [
          { icon: 'camera', label: 'CCTV de estadio' },
          { icon: 'ticket', label: 'Accesos y tornos' },
          { icon: 'sensor', label: 'Sensores IoT' },
        ],
        core: { icon: 'stadium', kicker: 'Hypervisor + gemelo', title: 'Operación del recinto', steps: ['Integra vídeo y accesos', 'Aforo en tiempo real', 'Gemelo del recinto', 'Coordina el operativo'] },
        outputs: [
          { icon: 'people', label: 'Aforo por sector' },
          { icon: 'shield', label: 'Evento seguro' },
          { icon: 'route', label: 'Flujos de salida' },
        ],
      },
      transport: {
        inputs: [
          { icon: 'camera', label: 'CCTV embarcado' },
          { icon: 'bus', label: 'Bus de datos ITxPT' },
          { icon: 'signal', label: 'Posición de flota' },
        ],
        core: { icon: 'command', kicker: 'ITxPT + VMS', title: 'Centro de control', steps: ['Integra lo embarcado', 'Vídeo bajo demanda', 'Estado de cada vehículo', 'Informa al viajero'] },
        outputs: [
          { icon: 'route', label: 'Flota monitorizada' },
          { icon: 'message', label: 'Información PIS' },
          { icon: 'play', label: 'Vídeo para investigar' },
        ],
      },
    },
  },
  delivery: {
    /**
     * Primer paso del capítulo: el camino completo de un proyecto, como diagrama
     * de flujo con sus preguntas. Todo sale de las líneas de servicio (diseño e
     * ingeniería con prototipado, instalación multimarca, integración con SCADA,
     * CCTV, ITS y ERP, plataformas propias, mantenimiento 24/7).
     */
    e2e: {
      kicker: 'Cómo trabajamos',
      title: ['De extremo a extremo.', 'Un único responsable.'],
      line: 'Cada proyecto recorre el mismo camino: entender el reto, diseñar la solución, construirla con el hardware y el software que haga falta, instalarla en casa del cliente y mantenerla funcionando.',
      replay: 'Ver de nuevo',
      nodes: [
        { id: 'discover', type: 'step', num: '01', col: 1, row: '1 / span 4', t: 0.3, icon: 'people', title: 'Descubrimiento', body: 'Visitamos la operación y entendemos la necesidad real.' },
        { id: 'design', type: 'step', num: '02', col: 2, row: '1 / span 4', t: 1.9, mti: 'service-design', title: 'Diseñamos la solución', body: 'Oficina técnica e ingeniería de proyecto.' },
        { id: 'hw', type: 'decision', col: 3, row: '1 / span 2', t: 3.4, title: '¿Necesita hardware?' },
        { id: 'sw', type: 'decision', col: 3, row: '3 / span 2', t: 3.7, title: '¿Necesita software?' },
        { id: 'hw-market', type: 'answer', tone: 'hw', col: 5, row: 1, t: 5.2, icon: 'camera', title: 'Equipos multimarca', body: 'CCTV, IoT, sistemas embarcados.' },
        { id: 'hw-custom', type: 'answer', tone: 'hw', col: 5, row: 2, t: 6.0, icon: 'cube', title: 'Lo diseñamos', body: 'Electrónica, mecánica y prototipado.' },
        { id: 'sw-platform', type: 'answer', tone: 'sw', col: 5, row: 3, t: 7.2, icon: 'layers', title: 'Plataformas propias', chips: [{ mti: 'platform-thethings', label: 'thethings.io' }, { mti: 'platform-hypervisor', label: 'Hypervisor' }, { mti: 'platform-twin', label: 'Digital Twin' }, { mti: 'platform-agentic', label: 'Agentic AI' }] },
        { id: 'sw-existing', type: 'answer', tone: 'sw', col: 5, row: 4, t: 8.0, icon: 'integration', title: 'Integramos lo que ya hay', body: 'SCADA, CCTV, ITS, ERP.' },
        { id: 'install', type: 'step', num: '03', col: 6, row: '1 / span 4', t: 9.6, mti: 'service-install', title: 'Instalamos en casa del cliente', body: 'El hardware, en campo. El software, desplegado e integrado.' },
        { id: 'maintain', type: 'step', num: '04', col: 7, row: '1 / span 4', t: 11.4, mti: 'service-om', title: 'Mantenimiento continuo', body: 'Preventivo, correctivo y predictivo, 24/7.' },
      ],
      edges: [
        { from: 'discover', to: 'design', t: 1.4 },
        { from: 'design', to: 'hw', t: 3.0 },
        { from: 'design', to: 'sw', t: 3.2 },
        { from: 'hw', to: 'hw-market', t: 4.8, label: 'Mercado' },
        { from: 'hw', to: 'hw-custom', t: 5.6, label: 'A medida' },
        { from: 'sw', to: 'sw-platform', t: 6.8, label: 'Propio' },
        { from: 'sw', to: 'sw-existing', t: 7.6, label: 'Existente' },
        { from: 'hw-market', to: 'install', t: 9.0 },
        { from: 'hw-custom', to: 'install', t: 9.1 },
        { from: 'sw-platform', to: 'install', t: 9.2 },
        { from: 'sw-existing', to: 'install', t: 9.3 },
        { from: 'install', to: 'maintain', t: 11.0 },
        { from: 'maintain', to: 'discover', t: 12.6, loop: true, label: 'Evolución continua' },
      ],
      src: [9, 10, 11, 12, 13, 14],
    },
    stages: ['Diseñar', 'Desplegar', 'Integrar', 'Operar'],
    beats: [
      { stage: 0, head: 'Primero, el plano.', lines: ['design'] },
      { stage: 1, head: 'Equipos y sensores, de cualquier marca.', lines: ['install'], feature: 'cctv' },
      { stage: 1, head: 'Cada equipo, conectado.', lines: ['iot'] },
      { stage: 2, head: 'Lo nuevo habla con lo que ya existía.', lines: ['twin'], feature: 'integration' },
      { stage: 2, head: 'Se enciende el centro de control.', lines: ['smartcity', 'ai'] },
      { stage: 3, head: 'La instalación es solo el día uno.', lines: ['cert', 'om'], feature: 'maintenance' },
      { stage: 3, head: 'Operación real, y evolución continua.', lines: [], feature: 'transformation' },
    ],
  },
  platforms: {
    chainHead: 'Del sensor a la decisión.',
    chainLine: 'Cuatro plataformas propias, una sola pila integrada.',
    stations: ['Dispositivo', 'thethings.io', 'MTi Hypervisor', 'Digital Twin', 'Agentic AI', 'Acción'],
    sensorHead: 'Un contador envía una lectura.',
    reading: { id: 'CONTADOR · SECTOR 12', value: '42,7 m³/h', proto: 'LoRaWAN', state: 'fuera de rango' },
    example: 'Ejemplo ilustrativo del recorrido de un dato',
    actionHead: 'La decisión, trazada.',
    action: ['Orden de trabajo preparada', 'Responsable avisado', 'Decisión registrada para auditoría'],
    features: {
      thethings: ['Sensores', 'Contadores', 'Gateways', 'Normalización', 'Reglas', 'Alarmas', 'Dashboards', 'API'],
      hypervisor: ['CCTV', 'Movilidad', 'Seguridad', 'Utilities', 'Alarmas', 'Respuesta coordinada'],
      twin: ['BIM', 'Datos IoT', 'Documentación', 'Activos', 'Estado operativo'],
      agentic: ['ERP', 'CRM', 'IoT', 'Documentos'],
    },
    agentsHint: 'Ocho agentes productizados · pulsa uno para verlo',
  },
  projects: {
    /** Entrada del capítulo: mosaico de fondo y tres formas de ver los proyectos. */
    hub: {
      kicker: 'Proyectos',
      title: ['Estos son', 'nuestros proyectos.'],
      line: 'Aeropuertos, metros, ciudades, astilleros y empresas industriales. Sistemas críticos en producción en todo el mundo.',
      stats: [
        { value: '9', label: 'proyectos insignia' },
        { value: '14', label: 'despliegues de IA agentiva' },
        { value: '25+', label: 'países de operación' },
      ],
      walk: { title: 'Recorre los más relevantes', sub: 'Nueve proyectos insignia, uno a uno' },
      filter: { title: 'Explora y filtra', sub: 'Por línea de negocio: CCTV, smart city, IA…' },
      map: { title: 'Míralos en el mapa', sub: 'Navega por país y por proyecto' },
      back: 'Proyectos',
      all: 'Todos',
      filterTitle: ['Todos nuestros proyectos,', 'por línea de negocio.'],
      mapTitle: ['Proyectos', 'en el mapa.'],
      mapHint: 'Pulsa un punto para viajar al proyecto.',
      agentic: 'IA agentiva · Agentify AI',
      lines: [
        { id: 'security', label: 'Seguridad y CCTV', icon: 'camera' },
        { id: 'transport', label: 'Transporte', icon: 'bus' },
        { id: 'smartcity', label: 'Smart city', icon: 'city' },
        { id: 'iot', label: 'IoT y datos', icon: 'sensor' },
        { id: 'industry', label: 'Industria y gemelo digital', icon: 'factory' },
        { id: 'ai', label: 'IA agentiva', icon: 'ai' },
      ],
    },
    overview: ['Proyectos reales.', 'Resultados reales.'],
    overviewLine: 'Del aeropuerto insignia de España a las fábricas digitales de buques de guerra.',
    travel: 'Viajar al proyecto',
    tech: 'Tecnología',
  },
  why: {
    clientsHead: 'Una década de despliegues críticos.',
    clientsLine: 'Clientes públicos y privados. Pulsa un logo para ver la relación.',
    clusters: {
      flagship: 'Proyectos insignia',
      sector: 'Sectores de la presentación',
      agentic: 'IA agéntica en producción',
      transformation: 'Transformación digital',
      reference: 'Clientes de referencia',
    },
    reasonsHead: 'Cinco razones.',
    reasonsLine: 'Capacidades que se activan dentro de una operación completa.',
    closing: ['Construyamos', 'el siguiente juntos.'],
    restart: 'Reiniciar el recorrido',
    openProject: 'Abrir un proyecto',
    chapters: 'Ir a un capítulo',
  },
};

/**
 * Relación verificable de cada logo con el contenido de la presentación. Solo
 * se indica lo que la presentación dice expresamente; el resto de clientes
 * aparecen como «clientes de referencia» sin sector ni proyecto asociado.
 */
export const CLIENT_LINKS = {
  'client-aena': { cluster: 'flagship', project: 'aena', note: 'Barcelona-El Prat T1 · 1.900 cámaras CCTV', src: [23] },
  'client-tmb': { cluster: 'flagship', project: 'metro', note: 'CCTV de metro L9/L10 y 5.000 autobuses', src: [24, 25] },
  'client-navantia': { cluster: 'flagship', project: 'navantia', note: 'Fábrica digital para buques de guerra', src: [27] },
  'client-fcb': { cluster: 'sector', sector: 'venues', note: 'Recintos deportivos', src: [6] },
  'client-moventia': { cluster: 'sector', sector: 'transport', note: 'Transportes', src: [6] },
  'client-copegal': { cluster: 'agentic', platform: 'agentic', note: '−80% en tiempo de generación de ofertas', src: [20] },
  'client-rcfil': { cluster: 'agentic', platform: 'agentic', note: '−65% en gestión manual', src: [20] },
  'client-ferri': { cluster: 'agentic', platform: 'agentic', note: '−70% en preparación de ofertas', src: [20] },
  'client-merchant-union': { cluster: 'transformation', note: 'Transformación digital', src: [12] },
  'client-abertis': { cluster: 'reference', src: [5, 7] },
  'client-fujitsu': { cluster: 'reference', src: [5, 7] },
  'client-indra': { cluster: 'reference', src: [5, 7] },
  'client-gmv': { cluster: 'reference', src: [7] },
  'client-etra': { cluster: 'reference', src: [7] },
  'client-galpi': { cluster: 'reference', src: [7] },
  'client-galmetec': { cluster: 'reference', src: [7] },
  'client-radiovigo': { cluster: 'reference', src: [7] },
  'client-sergas': { cluster: 'reference', src: [7] },
};

export const DECK_UI = {
  title: 'Conocer MTI',
  subtitle: 'Recorrido corporativo',
  explore: 'Explorar soluciones',
  back: 'Volver a la presentación',
  index: 'Índice',
  prev: 'Anterior',
  next: 'Siguiente',
  pause: 'Pausar animaciones',
  play: 'Reanudar animaciones',
  close: 'Salir del recorrido',
  openSolution: 'Ver la solución en la ciudad 3D',
  noSolution: 'Sin demo asociada todavía',
  sources: 'Fuentes',
  sourcePage: 'PDF pág.',
  scope: { grupo: 'MTi Group', plataforma: 'plataforma', proyecto: 'proyecto' },
  keyboard: '← → pasos · ↑ ↓ capítulos · Espacio avanza · Esc índice',
  chapter: 'Capítulo',
  phone: 'Teléfono',
  step: 'Paso',
  of: 'de',
  webglOff:
    'Este navegador no puede mostrar gráficos 3D. El recorrido sigue completo: el globo y las escenas se ven en su versión plana.',
  loading: 'Preparando la escena…',
  returnHint: 'Vuelves al punto exacto donde lo dejaste.',
  scrollHint: 'Rueda, flechas o deslizar para avanzar',
  more: 'Más información',
  illustrative: 'Señal ilustrativa',
  reviewTitle: 'Pendiente de validación',
  contact: 'Contacto',
  restart: 'Reiniciar',
  // otros recorridos
  otherServices: 'Explorar otros servicios',
  otherServicesLead: 'Cada línea de servicio tiene su propio recorrido, con sus casos y su forma de trabajar.',
  moreProjects: 'Explorar más proyectos',
  moreProjectsLead: 'Casos por línea de servicio',
  startTrack: 'Empezar el recorrido',
  seeCases: 'Ver los casos',
  tracksTitle: 'Recorridos',
};

/**
 * Líneas de servicio con recorrido propio, además del corporativo. Solo se
 * listan las que ya tienen contenido: para añadir una (seguridad, smart
 * cities…) basta con su archivo de datos y una entrada aquí.
 */
export const SERVICE_TRACKS = [
  {
    id: 'agentify',
    name: 'Agentify AI',
    kicker: 'IA Agentiva',
    line: 'Agentes productivizados que trabajan dentro de tu ERP, CRM, IoT y documentos.',
    stats: [
      { value: '14', label: 'despliegues' },
      { value: '8', label: 'agentes' },
    ],
    photo: 'ag-case-frioteis',
    icon: 'ai',
    casesChapter: 'ag-cases',
    src: [1],
  },
];

/** Todo el contenido, en un solo objeto, para traducirlo de una pasada. */
export const DECK = {
  CONTACT,
  OPENING,
  PLACES,
  PLACE_KINDS,
  WORLD,
  SECTORS,
  SECTORS_ALSO,
  SECTORS_META,
  DELIVERY_CYCLE,
  SERVICE_LINES,
  SERVICE_FEATURES,
  DELIVERY_META,
  PLATFORMS,
  PLATFORM_FLOW,
  AGENTS,
  PLATFORMS_META,
  PROJECTS,
  PROJECTS_META,
  PROJECT_LINES,
  REASONS,
  CLOSING,
  CHAPTERS,
  SCENES,
  CLIENT_LINKS,
  DECK_UI,
  SERVICE_TRACKS,
  AGENTIFY,
  PROJECT_REELS,
  PROJECT_REELS_UI,
  // espacios de pre-clientes, por id
  CLIENTS: Object.fromEntries(CLIENT_SPACES.map((c) => [c.id, c])),
};

export default DECK;
