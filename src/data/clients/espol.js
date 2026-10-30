/**
 * Espacio cliente · ESPOL (Escuela Superior Politécnica del Litoral)
 * ===================================================================
 *
 * Propuesta personalizada para una reunión. Reglas:
 *   - Las cifras de ESPOL salen de su web pública (espol.edu.ec, «ESPOL en
 *     cifras», consultada en octubre de 2026): `src: 'web'`.
 *   - Lo que propone MTI se rotula como propuesta: no se afirma nada sobre los
 *     sistemas actuales de ESPOL.
 *   - Cada solución enlaza a ejemplos reales de MTI ya presentes en la app
 *     (ciudad 3D, proyectos insignia, casos de Agentify AI).
 *   - El campus 3D es geometría real de OpenStreetMap (npm run client:campus).
 *
 * Tipos de enlace (`links`):
 *   { kind: 'city', id }       caso de uso de la ciudad 3D (solutions.js)
 *   { kind: 'project', id }    proyecto insignia del recorrido MTI
 *   { kind: 'case', id }       caso de Agentify AI
 *   { kind: 'agent', id }      agente de Agentify AI (C01…C08)
 */

export const ESPOL = {
  id: 'espol',
  name: 'ESPOL',
  fullName: 'Escuela Superior Politécnica del Litoral',
  place: 'Campus Gustavo Galindo · Guayaquil, Ecuador',
  sector: 'Universidad · Educación superior e investigación',
  logo: '/clients/espol/logo-espol.svg',
  seal: '/clients/espol/sello-espol.svg',
  web: 'https://www.espol.edu.ec/es',
  campus: '/clients/espol/campus.json',
  status: 'Pre-cliente · propuesta',
  meeting: 'Reunión de presentación',
  // paleta de ESPOL (de su hoja de estilos pública)
  colors: { navy: '#223263', blue: '#0073b6', sky: '#24aeff' },

  ui: {
    title: 'MTi × ESPOL',
    subtitle: 'Propuesta · Smart Campus',
    proposal: 'Propuesta',
    realExample: 'Ejemplos reales de MTi',
    howItWorks: 'Cómo funciona',
    liveLabel: 'En vivo',
    flowLabels: { in: 'En el campus', core: 'MTi', out: 'Para ESPOL' },
    campusLabel: 'Campus Gustavo Galindo · geometría real de OpenStreetMap',
    back: 'Reuniones',
    backLong: 'Volver a reuniones',
    live: {
      tag: 'Vista ilustrativa · datos simulados',
      energy: { title: 'Consumo del campus', now: 'Ahora', unit: 'kW', top: 'Edificios que más consumen', uses: ['Climatización', 'Iluminación', 'Equipos'] },
      sensors: { title: 'Sensórica en aulas', room: 'Aula monitorizada', co2: 'CO₂', temp: 'Temperatura', hum: 'Humedad', occ: 'Ocupación', people: 'personas', status: { ok: 'Aire bueno', warn: 'Ventilar', alert: 'CO₂ alto' }, action: 'Ventilación activada', list: 'Edificios' },
      efficiency: { title: 'Eficiencia energética', before: 'Antes', after: 'Con MTi', curve: 'Consumo en un día tipo', rank: 'Intensidad por edificio', actions: ['Climatización por horario y ocupación', 'Iluminación por presencia', 'Consumos fuera de horario detectados', 'Alertas de picos'], saving: 'El ahorro real se mide en el piloto', low: 'Eficiente', high: 'Derroche' },
    },
    linkKinds: { city: 'Demo en la ciudad 3D', project: 'Proyecto real', case: 'Caso de IA', agent: 'Agente' },
  },

  /* ---------------- 1 · Bienvenida ---------------- */
  hello: {
    kicker: 'Propuesta para ESPOL',
    title: ['Un campus', 'que piensa.'],
    lead: 'Cómo MTi puede ayudar a la Escuela Superior Politécnica del Litoral a operar su campus de forma más segura, eficiente y sostenible, con tecnología que ya funciona en aeropuertos, ciudades y universidades.',
    stats: [
      { value: '9.811', label: 'estudiantes en 2025' },
      { value: '984', label: 'profesores' },
      { value: '16', label: 'centros de investigación' },
      { value: '142', label: 'laboratorios' },
      { value: '332,3 ha', label: 'de bosque protector' },
    ],
    statsNote: 'Fuente: espol.edu.ec · ESPOL en cifras',
    campus: {
      kicker: 'El campus',
      title: ['Gustavo Galindo:', 'una ciudad pequeña.'],
      line: 'Edificios de nueve facultades, laboratorios, coliseos, comedores, terminal de buses y un bosque protector. Lo que funciona en una ciudad funciona aquí.',
      chips: ['Facultades y aulas', 'Laboratorios', 'Bosque protector', 'Coliseos y deportes', 'Terminal de buses', 'Servicios al estudiante'],
    },
    src: 'web',
  },

  /* ---------------- 2 · Soluciones ---------------- */
  solutionsMeta: {
    kicker: 'Lo que proponemos',
    rail: 'Soluciones para ESPOL',
  },
  solutions: [
    {
      id: 'security',
      tab: 'Seguridad',
      icon: 'shield',
      mode: 'security',
      kicker: '01 · Campus seguro',
      title: ['Un campus seguro,', 'visto desde un solo sitio.'],
      line: 'Videovigilancia con analítica, control de accesos y protocolos guiados para cubrir aulas, laboratorios, aparcamientos y accesos.',
      flow: {
        inputs: [
          { icon: 'camera', label: 'Cámaras CCTV', sub: 'Accesos, parqueos, pasillos' },
          { icon: 'lock', label: 'Control de accesos', sub: 'Laboratorios y edificios' },
          { icon: 'alert', label: 'Botones de ayuda', sub: 'Puntos de emergencia' },
        ],
        core: { icon: 'shield', mti: 'platform-hypervisor', kicker: 'VMS + analítica', title: 'MTi Hypervisor', steps: ['Integra cámaras de cualquier marca', 'Analítica de vídeo', 'Correlaciona alarmas', 'Guía el protocolo'] },
        outputs: [
          { icon: 'alert', label: 'Alerta verificada' },
          { icon: 'user', label: 'Seguridad guiada' },
          { icon: 'doc', label: 'Evidencia trazable' },
        ],
      },
      links: [
        { kind: 'project', id: 'aena', label: 'AENA · 1.900 cámaras en El Prat' },
        { kind: 'project', id: 'metro', label: 'TMB · CCTV de metro desde 2005' },
        { kind: 'city', id: 'urban-security', label: 'Videovigilancia urbana' },
      ],
    },
    {
      id: 'energy',
      tab: 'Energía',
      icon: 'gauge',
      mode: 'energy',
      kicker: '02 · Consumo energético',
      title: ['Cada edificio,', 'medido en tiempo real.'],
      dash: 'energy',
      line: 'Telemedida de electricidad, agua y climatización en cada bloque, centralizada en thethings.io para reducir consumos y anticipar averías.',
      flow: {
        inputs: [
          { icon: 'gauge', label: 'Contadores', sub: 'Electricidad y agua' },
          { icon: 'sensor', label: 'Sensores', sub: 'Temperatura, ocupación' },
          { logo: 'excel', label: 'Hojas de cálculo', sub: 'Lo que hay hoy' },
        ],
        core: { icon: 'sensor', mti: 'platform-thethings', kicker: 'Plataforma IoT', title: 'thethings.io', steps: ['Conecta cada contador', 'Normaliza las lecturas', 'Reglas y alarmas', 'Cuadros de mando por bloque'] },
        outputs: [
          { icon: 'chart', label: 'Consumo por edificio' },
          { icon: 'alert', label: 'Fugas y picos detectados' },
          { icon: 'check', label: 'Ahorro medible' },
        ],
      },
      links: [
        { kind: 'project', id: 'hospitalet', label: "L'Hospitalet · 157 cajas de telemedida" },
        { kind: 'city', id: 'building-management', label: 'Gestión de edificios' },
        { kind: 'city', id: 'water-metering', label: 'Telemedida de agua' },
      ],
    },
    {
      id: 'sensors',
      tab: 'Sensórica',
      icon: 'sensor',
      mode: 'sensors',
      dash: 'sensors',
      kicker: '03 · Sensórica en aulas',
      title: ['Aulas que se sienten', 'en tiempo real.'],
      line: 'Sensores de CO₂, temperatura, humedad y ocupación en aulas, laboratorios y biblioteca: calidad del aire y confort a la vista, y la ventilación responde sola.',
      flow: {
        inputs: [
          { icon: 'air', label: 'CO₂ y calidad del aire', sub: 'Aulas y laboratorios' },
          { icon: 'gauge', label: 'Temperatura y humedad', sub: 'Confort térmico' },
          { icon: 'people', label: 'Ocupación', sub: 'Presencia y aforo' },
        ],
        core: { icon: 'sensor', mti: 'platform-thethings', kicker: 'Plataforma IoT', title: 'thethings.io', steps: ['Lee cada sensor', 'Detecta umbrales', 'Activa la ventilación', 'Histórico por aula'] },
        outputs: [
          { icon: 'check', label: 'Aulas saludables' },
          { icon: 'wrench', label: 'Aviso a mantenimiento' },
          { icon: 'chart', label: 'Ocupación real por espacio' },
        ],
      },
      links: [
        { kind: 'city', id: 'air-quality', label: 'Calidad del aire' },
        { kind: 'city', id: 'building-management', label: 'Gestión de edificios' },
        { kind: 'project', id: 'nsu', label: 'NSU Florida · Living Lab' },
      ],
    },
    {
      id: 'efficiency',
      tab: 'Eficiencia',
      icon: 'leaf',
      mode: 'efficiency',
      dash: 'efficiency',
      kicker: '04 · Eficiencia energética',
      title: ['Gastar menos,', 'sin perder confort.'],
      line: 'Comparamos los edificios entre sí, detectamos consumos fuera de horario y ajustamos climatización e iluminación según la ocupación real. El ahorro se mide, edificio a edificio.',
      flow: {
        inputs: [
          { icon: 'gauge', label: 'Consumo por edificio', sub: 'Contadores' },
          { icon: 'air', label: 'Climatización', sub: 'BMS y equipos' },
          { icon: 'lamp', label: 'Iluminación', sub: 'Interior y exterior' },
          { icon: 'clock', label: 'Horarios y ocupación' },
        ],
        core: { icon: 'twin', mti: 'platform-twin', kicker: 'Gemelo digital + reglas', title: 'Eficiencia MTi', steps: ['Compara edificios (kWh/m²)', 'Detecta consumo fuera de horario', 'Ajusta clima e iluminación', 'Mide el ahorro'] },
        outputs: [
          { icon: 'bolt', label: 'Menos consumo' },
          { icon: 'leaf', label: 'Menos emisiones de CO₂' },
          { icon: 'doc', label: 'Informe por edificio' },
        ],
      },
      links: [
        { kind: 'city', id: 'building-management', label: 'Gestión de edificios' },
        { kind: 'city', id: 'smart-lighting', label: 'Alumbrado inteligente' },
        { kind: 'project', id: 'kafd', label: 'KAFD · distrito gestionado' },
      ],
    },
    {
      id: 'forest',
      tab: 'Bosque',
      icon: 'sensor',
      mode: 'forest',
      kicker: '05 · Bosque protector',
      title: ['332 hectáreas de bosque,', 'vigiladas sin alterarlo.'],
      line: 'Sensores ambientales de bajo consumo para calidad del aire, temperatura, humedad y riesgo de incendio, con alertas al instante.',
      flow: {
        inputs: [
          { icon: 'sensor', label: 'Sensores ambientales', sub: 'Aire, temperatura, humedad' },
          { icon: 'signal', label: 'Red LoRaWAN', sub: 'Bajo consumo, largo alcance' },
          { icon: 'camera', label: 'Cámaras de perímetro', sub: 'Accesos al bosque' },
        ],
        core: { icon: 'sensor', mti: 'platform-thethings', kicker: 'IoT ambiental', title: 'thethings.io', steps: ['Recoge las lecturas', 'Detecta umbrales', 'Avisa a quien corresponde', 'Histórico para investigación'] },
        outputs: [
          { icon: 'alert', label: 'Alerta temprana' },
          { icon: 'chart', label: 'Datos abiertos para investigar' },
          { icon: 'shield', label: 'Bosque protegido' },
        ],
      },
      links: [
        { kind: 'project', id: 'malaysia-aqi', label: 'Malasia · red de calidad del aire' },
        { kind: 'city', id: 'air-quality', label: 'Calidad del aire' },
      ],
    },
    {
      id: 'command',
      tab: 'Centro de mando',
      icon: 'command',
      mode: 'command',
      kicker: '06 · Gemelo digital',
      title: ['Todo el campus', 'en un único mando.'],
      line: 'Seguridad, energía, mantenimiento y movilidad integrados en un centro de mando con el gemelo digital del campus.',
      flow: {
        inputs: [
          { icon: 'camera', label: 'Seguridad' },
          { icon: 'gauge', label: 'Energía y agua' },
          { icon: 'wrench', label: 'Mantenimiento' },
          { icon: 'bus', label: 'Movilidad y parqueos' },
        ],
        core: { icon: 'command', mti: 'platform-twin', kicker: 'Hypervisor + Digital Twin', title: 'Centro de mando', steps: ['Integra cada sistema', 'Gemelo digital del campus', 'Correlaciona incidencias', 'Coordina la respuesta'] },
        outputs: [
          { icon: 'grid', label: 'Vista única del campus' },
          { icon: 'route', label: 'Respuesta coordinada' },
          { icon: 'chart', label: 'Decisiones con datos' },
        ],
      },
      links: [
        { kind: 'project', id: 'kafd', label: 'KAFD · 160 ha desde un solo mando' },
        { kind: 'project', id: 'navantia', label: 'Navantia · gemelo digital' },
        { kind: 'city', id: 'command-control', label: 'Centro de mando urbano' },
      ],
    },
    {
      id: 'agentify',
      tab: 'IA agentiva',
      icon: 'ai',
      mode: 'agentify',
      kicker: '07 · Agentify AI',
      title: ['Servicios universitarios', 'que responden solos.'],
      line: 'Agentes de IA que atienden correos de secretaría, responden sobre reglamentos con fuentes y dan soporte TI por voz, integrados con los sistemas de la universidad.',
      flow: {
        inputs: [
          { logos: ['outlook', 'gmail'], label: 'Correos de estudiantes' },
          { logos: ['pdf', 'word'], label: 'Reglamentos y normativa' },
          { icon: 'phone', label: 'Llamadas de soporte' },
        ],
        core: { icon: 'ai', mti: 'platform-agentic', kicker: 'Agentify AI', title: 'Agentes de IA', steps: ['Entiende la consulta', 'Busca en la normativa', 'Redacta con fuentes', 'Registra la incidencia'], agents: ['C01', 'C07', 'C03'] },
        outputs: [
          { icon: 'send', label: 'Respuesta revisada' },
          { icon: 'book', label: 'Cita al reglamento' },
          { icon: 'ticket', label: 'Ticket de soporte' },
        ],
      },
      links: [
        { kind: 'case', id: 'sigi', label: 'SIGI · CAU por voz en un hospital' },
        { kind: 'case', id: 'nautia', label: 'NAUTIA · conocimiento y normativa' },
        { kind: 'agent', id: 'C07', label: 'Asistente de Conocimiento' },
      ],
    },
    {
      id: 'lab',
      tab: 'Living lab',
      icon: 'spark',
      mode: 'lab',
      kicker: '08 · Investigación',
      title: ['El campus,', 'un laboratorio vivo.'],
      line: 'Los datos del campus al servicio de facultades y centros de investigación: una plataforma abierta para que estudiantes e investigadores experimenten con datos reales.',
      flow: {
        inputs: [
          { icon: 'sensor', label: 'Sensórica del campus' },
          { icon: 'route', label: 'Flujos de movilidad' },
          { icon: 'database', label: 'Datos históricos' },
        ],
        core: { icon: 'spark', mti: 'platform-thethings', kicker: 'Plataforma abierta', title: 'thethings.io + API', steps: ['Datos en tiempo real', 'API para investigadores', 'Entornos de prueba', 'Analítica y visualización'] },
        outputs: [
          { icon: 'book', label: 'Investigación aplicada' },
          { icon: 'people', label: 'Proyectos de estudiantes' },
          { icon: 'chart', label: 'Publicaciones con datos reales' },
        ],
      },
      links: [{ kind: 'project', id: 'nsu', label: 'NSU Florida · Living Lab universitario' }],
    },
  ],

  /* ---------------- 3 · Cómo empezaríamos ---------------- */
  plan: {
    kicker: 'Cómo empezaríamos',
    title: ['Del piloto', 'a todo el campus.'],
    line: 'Un modelo de entrega pequeño para empezar y preparado para escalar.',
    phases: [
      { icon: 'route', title: 'Discovery', time: '2 semanas', body: 'Visitamos el campus con el equipo de ESPOL y priorizamos los casos con más impacto.' },
      { icon: 'spark', title: 'Piloto', time: '4–6 semanas', body: 'Un edificio o una facultad: energía y seguridad funcionando sobre las plataformas MTi.' },
      { icon: 'layers', title: 'Escalado', time: 'Por fases', body: 'Extendemos a todo el campus e integramos los sistemas existentes.' },
      { icon: 'gauge', title: 'Operación', time: '24/7', body: 'Instalación, mantenimiento y evolución continua, con un único responsable.' },
    ],
    pilot: { title: 'Piloto sugerido', body: 'Telemedida energética y videovigilancia en un bloque de la FIEC, con su gemelo digital.' },
    note: 'Propuesta orientativa: plazos y alcance se definen en el discovery.',
  },

  /* ---------------- 4 · Hablemos ---------------- */
  close: {
    kicker: 'Siguiente paso',
    title: ['Construyamos', 'el campus del futuro.'],
    line: 'Agendemos el discovery en el Campus Gustavo Galindo.',
    explore: 'Ver más de MTi',
  },
};

/* ------------------------------------------------------------------ */

export const ESPOL_CHAPTERS = [
  { id: 'cl-hello', num: '01', label: 'MTi × ESPOL', short: 'ESPOL', steps: 2, src: ['web'] },
  { id: 'cl-solutions', num: '02', label: 'Lo que proponemos', short: 'Soluciones', steps: 8, src: [] },
  { id: 'cl-plan', num: '03', label: 'Cómo empezaríamos', short: 'Plan', steps: 1, src: [] },
  { id: 'cl-close', num: '04', label: 'Siguiente paso', short: 'Contacto', steps: 1, src: [] },
];

export default ESPOL;
