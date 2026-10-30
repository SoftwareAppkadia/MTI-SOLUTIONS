/** English for the ESPOL client space. Same shape as espol.js (lists with `id` keyed by id). */

const io = (...labels) => labels.map((l) => (Array.isArray(l) ? { label: l[0], sub: l[1] } : { label: l }));

export const ESPOL_EN = {
  place: 'Gustavo Galindo Campus · Guayaquil, Ecuador',
  sector: 'University · Higher education and research',
  status: 'Prospect · proposal',
  meeting: 'Introductory meeting',
  ui: {
    subtitle: 'Proposal · Smart Campus',
    proposal: 'Proposal',
    realExample: 'Real MTi examples',
    howItWorks: 'How it works',
    liveLabel: 'Live',
    flowLabels: { in: 'On campus', core: 'MTi', out: 'For ESPOL' },
    campusLabel: 'Gustavo Galindo Campus · real OpenStreetMap geometry',
    back: 'Meetings',
    backLong: 'Back to meetings',
    live: {
      tag: 'Illustrative view · simulated data',
      energy: { title: 'Campus consumption', now: 'Now', top: 'Top consuming buildings', uses: ['HVAC', 'Lighting', 'Equipment'] },
      sensors: { title: 'Classroom sensing', room: 'Monitored classroom', temp: 'Temperature', hum: 'Humidity', occ: 'Occupancy', people: 'people', status: { ok: 'Good air', warn: 'Ventilate', alert: 'High CO₂' }, action: 'Ventilation on', list: 'Buildings' },
      efficiency: { title: 'Energy efficiency', before: 'Before', after: 'With MTi', curve: 'Consumption on a typical day', rank: 'Intensity per building', actions: ['HVAC by schedule and occupancy', 'Presence-based lighting', 'Out-of-hours consumption detected', 'Peak alerts'], saving: 'Real savings are measured in the pilot', low: 'Efficient', high: 'Wasteful' },
    },
    linkKinds: { city: '3D city demo', project: 'Real project', case: 'AI case', agent: 'Agent' },
  },
  hello: {
    kicker: 'Proposal for ESPOL',
    title: ['A campus', 'that thinks.'],
    lead: 'How MTi can help the Escuela Superior Politécnica del Litoral run its campus in a safer, more efficient and more sustainable way, with technology already running in airports, cities and universities.',
    stats: [{ label: 'students in 2025' }, { label: 'professors' }, { label: 'research centres' }, { label: 'laboratories' }, { value: '332.3 ha', label: 'of protected forest' }],
    statsNote: 'Source: espol.edu.ec · ESPOL in figures',
    campus: {
      kicker: 'The campus',
      title: ['Gustavo Galindo:', 'a small city.'],
      line: 'Buildings for nine faculties, laboratories, sports halls, canteens, a bus terminal and a protected forest. What works in a city works here.',
      chips: ['Faculties and classrooms', 'Laboratories', 'Protected forest', 'Sports halls', 'Bus terminal', 'Student services'],
    },
  },
  solutionsMeta: { kicker: 'What we propose', rail: 'Solutions for ESPOL' },
  solutions: {
    security: {
      tab: 'Security',
      kicker: '01 · Safe campus',
      title: ['A safe campus,', 'seen from one place.'],
      line: 'Video surveillance with analytics, access control and guided protocols across classrooms, labs, car parks and gates.',
      flow: {
        inputs: io(['CCTV cameras', 'Gates, car parks, corridors'], ['Access control', 'Labs and buildings'], ['Help points', 'Emergency buttons']),
        core: { kicker: 'VMS + analytics', steps: ['Integrates any camera brand', 'Video analytics', 'Correlates alarms', 'Guides the protocol'] },
        outputs: io('Verified alert', 'Guided security staff', 'Traceable evidence'),
      },
      links: [{ label: 'AENA · 1,900 cameras at El Prat' }, { label: 'TMB · metro CCTV since 2005' }, { label: 'Urban video surveillance' }],
    },
    energy: {
      tab: 'Energy',
      kicker: '02 · Energy consumption',
      title: ['Every building,', 'measured in real time.'],
      line: 'Metering of electricity, water and HVAC in every block, centralised on thethings.io to cut consumption and anticipate faults.',
      flow: {
        inputs: io(['Meters', 'Electricity and water'], ['Sensors', 'Temperature, occupancy'], ['Spreadsheets', 'What exists today']),
        core: { kicker: 'IoT platform', steps: ['Connects every meter', 'Normalises readings', 'Rules and alarms', 'Dashboards per block'] },
        outputs: io('Consumption per building', 'Leaks and peaks detected', 'Measurable savings'),
      },
      links: [{ label: "L'Hospitalet · 157 metering boxes" }, { label: 'Building management' }, { label: 'Water metering' }],
    },
    sensors: {
      tab: 'Sensing',
      kicker: '03 · Classroom sensing',
      title: ['Classrooms you can feel', 'in real time.'],
      line: 'CO₂, temperature, humidity and occupancy sensors in classrooms, labs and the library: air quality and comfort at a glance, and ventilation responds by itself.',
      flow: {
        inputs: io(['CO₂ and air quality', 'Classrooms and labs'], ['Temperature and humidity', 'Thermal comfort'], ['Occupancy', 'Presence and capacity']),
        core: { kicker: 'IoT platform', steps: ['Reads every sensor', 'Detects thresholds', 'Turns on ventilation', 'History per classroom'] },
        outputs: io('Healthy classrooms', 'Maintenance alert', 'Real occupancy per space'),
      },
      links: [{ label: 'Air quality' }, { label: 'Building management' }, { label: 'NSU Florida · Living Lab' }],
    },
    efficiency: {
      tab: 'Efficiency',
      kicker: '04 · Energy efficiency',
      title: ['Spend less,', 'keep the comfort.'],
      line: 'We compare buildings with each other, detect out-of-hours consumption and tune HVAC and lighting to real occupancy. Savings are measured, building by building.',
      flow: {
        inputs: io(['Consumption per building', 'Meters'], ['HVAC', 'BMS and equipment'], ['Lighting', 'Indoor and outdoor'], 'Schedules and occupancy'),
        core: { kicker: 'Digital twin + rules', title: 'MTi Efficiency', steps: ['Compares buildings (kWh/m²)', 'Detects out-of-hours use', 'Tunes HVAC and lighting', 'Measures the savings'] },
        outputs: io('Lower consumption', 'Lower CO₂ emissions', 'Report per building'),
      },
      links: [{ label: 'Building management' }, { label: 'Smart lighting' }, { label: 'KAFD · managed district' }],
    },
    forest: {
      tab: 'Forest',
      kicker: '05 · Protected forest',
      title: ['332 hectares of forest,', 'watched without disturbing it.'],
      line: 'Low-power environmental sensors for air quality, temperature, humidity and fire risk, with instant alerts.',
      flow: {
        inputs: io(['Environmental sensors', 'Air, temperature, humidity'], ['LoRaWAN network', 'Low power, long range'], ['Perimeter cameras', 'Forest access points']),
        core: { kicker: 'Environmental IoT', steps: ['Collects readings', 'Detects thresholds', 'Alerts the right people', 'History for research'] },
        outputs: io('Early warning', 'Open data for research', 'Protected forest'),
      },
      links: [{ label: 'Malaysia · air-quality network' }, { label: 'Air quality' }],
    },
    command: {
      tab: 'Command centre',
      kicker: '06 · Digital twin',
      title: ['The whole campus', 'from one command.'],
      line: 'Security, energy, maintenance and mobility integrated in one command centre with the campus digital twin.',
      flow: {
        inputs: io('Security', 'Energy and water', 'Maintenance', 'Mobility and parking'),
        core: { title: 'Command centre', steps: ['Integrates every system', 'Campus digital twin', 'Correlates incidents', 'Coordinates the response'] },
        outputs: io('Single campus view', 'Coordinated response', 'Data-driven decisions'),
      },
      links: [{ label: 'KAFD · 160 ha from one command' }, { label: 'Navantia · digital twin' }, { label: 'Urban command centre' }],
    },
    agentify: {
      tab: 'Agentic AI',
      kicker: '07 · Agentify AI',
      title: ['University services', 'that answer by themselves.'],
      line: 'AI agents that handle registry emails, answer questions about regulations with sources and provide IT support by voice, integrated with university systems.',
      flow: {
        inputs: io('Student emails', 'Rules and regulations', 'Support calls'),
        core: { title: 'AI agents', steps: ['Understands the request', 'Searches the regulations', 'Drafts with sources', 'Logs the ticket'] },
        outputs: io('Reviewed answer', 'Citation of the regulation', 'Support ticket'),
      },
      links: [{ label: 'SIGI · voice service desk in a hospital' }, { label: 'NAUTIA · knowledge and regulation' }, { label: 'Knowledge Assistant' }],
    },
    lab: {
      tab: 'Living lab',
      kicker: '08 · Research',
      title: ['The campus,', 'a living laboratory.'],
      line: 'Campus data serving faculties and research centres: an open platform where students and researchers experiment with real data.',
      flow: {
        inputs: io('Campus sensing', 'Mobility flows', 'Historical data'),
        core: { kicker: 'Open platform', steps: ['Real-time data', 'API for researchers', 'Test environments', 'Analytics and visualisation'] },
        outputs: io('Applied research', 'Student projects', 'Papers with real data'),
      },
      links: [{ label: 'NSU Florida · university Living Lab' }],
    },
  },
  plan: {
    kicker: 'How we would start',
    title: ['From pilot', 'to the whole campus.'],
    line: 'A delivery model small enough to start and ready to scale.',
    phases: [
      { time: '2 weeks', body: 'We visit the campus with the ESPOL team and prioritise the highest-impact cases.' },
      { title: 'Pilot', time: '4–6 weeks', body: 'One building or faculty: energy and security running on MTi platforms.' },
      { title: 'Scale', time: 'In phases', body: 'We extend to the whole campus and integrate existing systems.' },
      { title: 'Operate', body: 'Installation, maintenance and continuous evolution, with one single owner.' },
    ],
    pilot: { title: 'Suggested pilot', body: 'Energy metering and video surveillance in one FIEC block, with its digital twin.' },
    note: 'Indicative proposal: timelines and scope are defined in the discovery.',
  },
  close: {
    kicker: 'Next step',
    title: ["Let's build", 'the campus of the future.'],
    line: "Let's schedule the discovery at the Gustavo Galindo Campus.",
    explore: 'See more of MTi',
  },
  CHAPTERS: {
    'cl-solutions': { label: 'What we propose', short: 'Solutions' },
    'cl-plan': { label: 'How we would start', short: 'Plan' },
    'cl-close': { label: 'Next step', short: 'Contact' },
  },
};

export default ESPOL_EN;
