/**
 * Recorrido corporativo · traducción al inglés.
 *
 * Misma forma que `deck.js`. Las listas se traducen POR ID, no por posición:
 * así se pueden reordenar los capítulos o añadir sectores sin desalinear nada.
 * Lo que no esté aquí se queda en castellano, que es el idioma de referencia.
 *
 * Los nombres propios —productos, clientes, certificaciones— no se traducen.
 */

import { AGENTIFY_EN } from './agentic.en.js';
import { ESPOL_EN } from './clients/espol.en.js';
import { PROJECT_REELS_EN, PROJECT_REELS_UI_EN } from './projectReels.js';

export const DECK_EN = {
  OPENING: {
    kicker: 'Technology Systems Integrator · Since 2016',
    title: ['Technology', 'that transforms operations'],
    lead:
      'Systems integration, Agentic AI, IoT and Smart Cities for organisations that cannot afford to fail. End-to-end. Mission-critical. Measurable ROI.',
    manifestoKicker: 'What we believe',
    manifesto:
      'We build technology that operates where it matters most — the moments organisations cannot afford to fail.',
    about:
      'Founded in 2016 in Barcelona, MTi delivers complex, mission-critical solutions for the public and private sectors: engineering, technical office, project design, integration of innovative technologies and turnkey project management.',
    aboutNote:
      'Recently strengthened by the acquisition of Ingeco Vallès and Diprotech — now part of the MTi Group.',
    divisions: {
      services: {
        label: 'Division 01',
        title: 'Services',
        body:
          'Design & engineering, installation & integration, certification & audit, configuration & maintenance — for transport, airports, metro, security and critical infrastructure.',
        tags: ['Multi-brand', 'ITxPT expert', 'Turnkey'],
      },
      solutions: {
        label: 'Division 02',
        title: 'Solutions',
        body:
          'Proprietary platforms and software — IoT, Digital Twin, Smart City OS and Agentic AI — deployed in production across cities, industry and utilities.',
        tags: ['MTi Hypervisor', 'thethings.io', 'Digital Twin', 'Agentic AI'],
      },
    },
    stats: [
      { label: 'Countries of operation' },
      { label: 'IoT devices connected' },
      { label: 'Engineering + delivery hubs' },
      { label: 'AI cases in production' },
    ],
  },

  PLACES: {
    barcelona: {
      country: 'Spain',
      body: 'MTi Group headquarters. Projects all over the world are designed and coordinated from here.',
      projectsLabel: 'Projects in Spain',
    },
    madrid: { country: 'Spain', body: 'Madrid office.' },
    sabadell: { country: 'Spain', body: 'Sabadell office.' },
    franqueses: { country: 'Spain', body: 'Les Franqueses del Vallès office.' },
    dubai: { name: 'Dubai', label: 'Dubai', country: 'United Arab Emirates', body: 'Office in Dubai, United Arab Emirates.' },
    saudi: { name: 'Saudi Arabia', country: 'Saudi Arabia', body: 'Office in Saudi Arabia. The KAFD district in Riyadh is in production.' },
    egypt: { name: 'Egypt', country: 'Egypt', body: 'Office in Egypt.' },
    kenya: { name: 'Kenya', country: 'Kenya', body: 'Office in Kenya.' },
    mexico: { name: 'Mexico', country: 'Mexico', body: 'Office in Mexico. MTi has also delivered projects in the country.' },
    germany: { name: 'Germany', country: 'Germany', body: 'Office in Germany. MTi has also delivered projects in the country.' },
    poland: { name: 'Poland', country: 'Poland', body: 'Projects delivered by MTi in Poland.' },
    france: { name: 'France', country: 'France', body: 'Projects delivered by MTi in France.' },
    italy: { name: 'Italy', country: 'Italy', body: 'Projects delivered by MTi in Italy.' },
    cameroon: { name: 'Cameroon', country: 'Cameroon', body: 'Projects delivered by MTi in Cameroon.' },
    chile: { name: 'Chile', country: 'Chile', body: 'Projects delivered by MTi in Chile.' },
    argentina: { name: 'Argentina', country: 'Argentina', body: 'Projects delivered by MTi in Argentina.' },
    malaysia: { name: 'Malaysia', country: 'Malaysia', body: 'Office in Malaysia, where the Predictive AQI air-quality network also runs.' },
    gibraltar: { name: 'Gibraltar Airport', country: 'Gibraltar · United Kingdom', body: 'Iris biometric access: 126 readers and 16 biometric units.' },
    qatar: { country: 'Qatar', body: 'RFID bins, GPS route control and municipal integration.' },
    nsu: { country: 'United States', body: 'Environmental sensing, mobility flows and community analytics on campus.' },
    vietnam: { name: 'Vietnam', country: 'Vietnam', body: 'Projects delivered by MTi in Vietnam.' },
  },

  PLACE_KINDS: {
    sede: { label: 'Headquarters' },
    oficina: { label: 'Office' },
    proyecto: { label: 'Project' },
  },

  WORLD: {
    kicker: 'Global reach · local execution',
    title: ['From Barcelona,', 'to four continents.'],
    lead: 'Eleven offices in eight countries and projects in production worldwide, with teams that speak the language and know the local regulation.',
    stats: [{ label: 'Offices in 8 countries' }, { label: 'Countries of operation' }, { label: 'Continents with an office' }],
    disclosure: 'Projects in production across Europe, the Middle East, Africa, Asia and the Americas.',
    legendTitle: "What's on the map",
  },

  SECTORS: {
    security: {
      title: 'Security',
      problem: 'Thousands of cameras produce hours of video nobody can watch.',
      body: 'CCTV, VMS, access control, perimeter and control-room operations.',
      rank: 'Priority',
    },
    'smart-cities': {
      title: 'Smart Cities',
      problem: 'Every municipal service has its own system and none of them talk to each other.',
      body: 'Command centres, waste, lighting, mobility, utilities and IoT metering.',
      rank: 'Focus',
    },
    'industry-naval': {
      title: 'Industry & Naval',
      problem: 'The plant produces data that stays inside the machine and never reaches a decision.',
      body: 'Digital Twin, SCADA, Industry 4.0 and shipyard digital factories.',
      rank: 'Depth',
    },
    cybersecurity: {
      title: 'Cybersecurity',
      problem: 'Connecting the operation widens the attack surface of the whole organisation.',
      body: 'SOC design, network segmentation, NIS2 and ISO 27001 compliance.',
      rank: 'Layer',
    },
    venues: {
      title: 'Sports Venues',
      problem: 'Ninety thousand people come and go in two hours and everything has to go right.',
      body: 'Stadium CCTV, access, IoT and a digital twin of the venue.',
      rank: 'Venue',
    },
    transport: {
      title: 'Transports',
      problem: 'A whole fleet runs without knowing in real time what is happening to each vehicle.',
      body: 'Metros, buses and airports — VMS, ITxPT, PIS and onboard CCTV.',
      rank: 'Scale',
    },
  },

  SECTORS_ALSO: {
    water: { label: 'Water & utilities' },
    datacenter: { label: 'Data centers' },
    telecom: { label: 'Telecom' },
    health: { label: 'Healthcare & campus' },
    public: { label: 'Public buildings' },
    retail: { label: 'Retail & hospitality' },
  },

  SECTORS_META: {
    kicker: 'Sectors of activity',
    title: ['We understand', 'your sector.'],
    lead:
      'Six sectors where MTi has a track record of its own, and a long list of environments where the same technology fits.',
    alsoLabel: 'Also serving',
    problemLabel: 'The problem',
  },

  DELIVERY_CYCLE: {
    design: {
      title: 'Design',
      body: 'Technical office, project design, electronics and mechanics, prototyping.',
    },
    deploy: {
      title: 'Deploy',
      body: 'Multidisciplinary field teams installing multi-brand hardware.',
    },
    integrate: {
      title: 'Integrate',
      body: 'Federate what was installed with what was already there: SCADA, CCTV, ITS, ERP.',
    },
    operate: {
      title: 'Operate',
      body: 'Commissioning, contracted SLA and 24/7 maintenance for years.',
    },
  },

  SERVICE_LINES: {
    design: {
      title: 'Design & engineering',
      body: 'Project design, technical office, electronic and mechanical component design, prototyping.',
    },
    install: {
      title: 'Installation & integration',
      body: 'Multidisciplinary on-site teams: CCTV, ITS, ticketing, PIS/SIU across multi-brand hardware.',
    },
    iot: {
      title: 'IoT & connectivity',
      body: '150K+ devices, real-time telemetry, alarms and analytics via thethings.io.',
    },
    ai: {
      title: 'Agentic AI',
      body: 'Orchestrator and specialised agents connected to ERP, CRM, IoT and documents.',
    },
    twin: {
      title: 'Digital Twin & BIM',
      body: 'Building- and factory-scale twins for operations, maintenance and energy.',
    },
    smartcity: {
      title: 'Smart City platforms',
      body: 'MTi Hypervisor and city-scale command centres for districts and utilities.',
    },
    cert: {
      title: 'Certification & audit',
      body: 'Product certification, audits and functional testing to ensure compliance.',
    },
    om: {
      title: 'Configuration & 24/7 O&M',
      body: 'Turnkey installs, commissioning, SLA-critical preventive and corrective maintenance.',
    },
  },

  SERVICE_FEATURES: {
    integration: {
      num: 'Service line · 01',
      title: 'System integration',
      lead:
        'We install the technology that runs your operation — from the CCTV pole on the runway to the SCADA gateway inside the shipyard. Multi-brand, ITxPT-standard, turnkey.',
      chips: [
        'Design & engineering',
        'Multi-brand hardware',
        'On-site installation',
        'Networking & fibre',
        'Commissioning',
        'SLA-based maintenance',
        '24/7 O&M',
      ],
      claim: 'We install technology that already works together.',
      footer: '1,900 cameras · 5,000 buses · 150K IoT devices · one turnkey partner',
    },
    transformation: {
      num: 'Service line · 02',
      title: 'Digital transformation & innovation',
      lead:
        'We help operational-heavy companies re-imagine how they run — mapping processes, prototyping AI use-cases and building the roadmap that turns technology into measurable business outcomes.',
      chips: [
        'Process re-engineering',
        'Data foundations',
        'AI use-case activation',
        'People & adoption',
        'Compliance & security',
      ],
      claim: 'Five levers, one plan.',
      footer: 'Discover → Design → Deploy · MVP to production with the team on board',
      vendors: 'Proven at Navantia · FERRI · Merchant Union · Hospital Álvaro Cunqueiro',
    },
    cctv: {
      num: 'Service line · 03',
      title: 'CCTV & security systems',
      lead:
        'A decade designing, installing and operating mission-critical surveillance for airports, metros, cities, industrial sites and stadiums. From single-camera pilots to multi-thousand-camera national deployments.',
      chips: ['Cameras', 'VMS / NVR', 'Video analytics', 'Access control', 'Perimeter'],
      claim: 'We build the surveillance layer your operation can trust.',
      footer: '1,900 cameras at AENA T1 · 5,000 buses · L9/L10 since 2005 · 24/7 control room',
    },
    maintenance: {
      num: 'Service line · 04',
      title: 'Maintenance & support',
      lead:
        'Installation is only day one. We keep your systems running for the next ten years — with contracted SLAs, preventive plans and a spare-parts stock ready to move.',
      chips: ['Preventive', 'Corrective', 'AI-powered predictive', 'Extended warranty'],
      claim: 'On-site in under 4 hours. Anywhere in Spain.',
      footer: '24/7 · 365 · spare-parts warehouse at HQ · 10+ years with TMB, AENA, KAFD and Hospitalet',
      vendors: 'Our own field team, not resellers',
    },
  },

  DELIVERY_META: {
    kicker: 'What we do · Services',
    title: ['End-to-end', 'expertise.'],
    lead:
      'From concept and engineering to AI deployment and 24/7 operations — one accountable partner for the whole cycle.',
    cycleTitle: 'The full cycle',
    linesTitle: 'Eight service lines',
    featuresTitle: 'Developed in depth',
  },

  PLATFORMS: {
    thethings: {
      role: 'IoT platform',
      claim: 'Every device. Every reading. One layer.',
      body:
        "MTi's IoT ingestion layer: a rules engine, dashboards and API surface that consolidate every sensor, meter, gateway and controller into a single normalised data model.",
      metrics: [
        { label: 'Devices connected' },
        { value: '10 years', label: 'In production' },
        { label: 'HTTP · CoAP · LoRaWAN' },
        { label: 'Managed service' },
      ],
      bullets: [
        'Dashboards and real-time analytics',
        'Device management and threshold alerts',
        'REST and WebSocket API for any downstream system',
      ],
      best: 'Utilities · Smart cities · Industry',
    },
    hypervisor: {
      role: 'Command & control',
      claim: 'One brain for every city system.',
      body:
        'Our command and control intelligence layer: it ingests data from every urban system, fuses it in real time and drives automated responses across traffic, transit, safety, utilities and emergency services.',
      metrics: [
        { label: 'Cities deployed' },
        { label: 'Integrations' },
        { label: 'Alert response' },
        { value: '99.99%', label: 'HA uptime SLA' },
      ],
      bullets: [
        'Presentation layer: control-room UI, mobile app and public APIs',
        'Intelligence layer: CEP engine, AI models and correlation rules',
        'Integration layer: 100+ connectors, normalisation and event bus',
      ],
      best: 'Cities · Airports · Metros',
    },
    twin: {
      role: 'Digital twin',
      claim: 'Your assets, alive in the cloud.',
      body:
        'It connects BIM geometry, IoT sensor data, point clouds and operational documents into a single living model — from a single room to an entire city.',
      metrics: [
        { label: 'Active projects' },
        { label: 'Model fidelity' },
        { label: 'Open standard' },
        { label: 'Data connectors' },
      ],
      bullets: [
        'Buildings and facilities: energy, predictive FM, occupancy',
        'Industry and naval: SCADA, PLC, predictive maintenance',
        'Cities: LOD 1–3 3D model, utility overlays and simulation',
      ],
      best: 'Naval · Industry · Buildings · Cities',
    },
    agentic: {
      role: 'Autonomous ops',
      claim: 'Real autonomy in your operations.',
      body:
        'Not prototypes — solutions in production with measured outcomes. An orchestrator agent coordinates specialised agents connected to your ERP, IoT, documents and CRM, with full traceability.',
      metrics: [
        { label: 'Productised agents' },
        { label: 'Cases in production' },
        { label: 'Quote generation time · COPEGAL' },
        { label: 'Offer preparation · FERRI' },
      ],
      bullets: [
        'Predictive alerts and automated tasks',
        'Natural-language assistants and ERP + CRM integration',
        'Twin updates and full explainability',
      ],
      best: 'Any ops-heavy company',
    },
  },

  PLATFORM_FLOW: {
    sense: {
      title: 'The sensor measures',
      body: 'A meter in the network sends its reading over LoRaWAN. One of more than 150,000 connected devices.',
    },
    normalize: {
      title: 'The platform normalises',
      body: 'thethings.io ingests the reading, maps it to the common data model and fires the threshold rule.',
    },
    correlate: {
      title: 'The control centre correlates',
      body: 'MTi Hypervisor cross-checks that alert with cameras, traffic and open tickets: it stops being a data point and becomes an incident.',
    },
    contextualize: {
      title: 'The twin places it',
      body: 'The Digital Twin shows which asset it is, where it sits, what documentation it has and what depends on it.',
    },
    act: {
      title: 'The agent proposes and executes',
      body: 'An agent drafts the work order, notifies the owner and logs every decision so it can be audited.',
    },
  },

  AGENTS: {
    C01: {
      title: 'AI Email Operations',
      body:
        'Every email answered, every action triggered: it reads intent, extracts data, queries ERP/CRM and drafts a contextual reply.',
      tags: ['Multi-intent classification', 'Full audit trail'],
    },
    C02: {
      title: 'AI Tender & Offer Engine',
      body: 'It analyses complex documentation, costs each line item and drafts the technical offer.',
      tags: ['−50% prep time', '100% traceability'],
    },
    C03: {
      title: 'AI Voice Support',
      body: '24/7 intelligent call handling with hand-off to human agents and real-time incident structuring.',
      tags: ['Zero audio stored', 'GDPR compliant'],
    },
    C04: {
      title: 'AI Sales Intelligence',
      body: 'Your CRM always up to date: it auto-logs meetings, scores leads and surfaces next-best actions.',
      tags: ['HubSpot', 'Salesforce', 'Zoho'],
    },
    C05: {
      title: 'AI Order Processing',
      body: 'From order email to ERP entry: it reads, parses the SKUs, validates prices and posts.',
      tags: ['SAP', 'Odoo', 'Dynamics', 'SAGE'],
    },
    C06: {
      title: 'AI Delivery & Docs',
      body: 'Dispatch documents generated, sent and reconciled: CMRs, invoices, POs and delivery notes.',
      tags: ['Zero paperwork errors'],
    },
    C07: {
      title: 'AI Knowledge Assistant',
      body:
        'Your company documentation, instantly searchable. RAG and knowledge graph over specs, manuals, contracts and regulation.',
      tags: ['Cited answers', 'Version-aware'],
    },
    C08: {
      title: 'AI Incident & Quality',
      body:
        'Every incident captured, classified and resolved. It correlates operations data to detect anomalies before they escalate.',
      tags: ['Predictive alerts', 'Root-cause'],
    },
  },

  PLATFORMS_META: {
    kicker: 'Four proprietary platforms',
    title: ['The software', 'behind every delivery.'],
    lead:
      'Each product solves a specific problem. Together they form one integrated stack — from the sensor on the pole to the AI agent making the decision.',
    flowTitle: 'One data point, end to end',
    flowLead: 'The same journey any reading makes in a real deployment.',
    agentsTitle: 'Eight agents. One platform.',
    agentsLead:
      'Productised agents built from 30+ real deployments — integration-first, auditable, ready for your ERP, IoT, documents and CRM.',
  },

  PROJECTS: {
    aena: {
      tech: ['Bosch CCTV', 'SIPA', 'Control tower'],
      tag: 'Flagship · Airports · Public sector',
      client: 'AENA · SIPA · Public tender',
      title: "Spain's flagship airport, seen from every angle",
      place: 'Barcelona · El Prat · T1',
      challenge:
        'Bring the new T1 terminal into service with full surveillance and a control tower able to see everything at once.',
      solution:
        'Massive installation of 1,900 Bosch CCTV cameras, the SIPA information system and comprehensive Control Tower monitoring.',
      outcome: 'A new-build terminal covered end to end and 24/7 tower operations.',
      metrics: [
        { label: 'CCTV cameras' },
        { label: 'Terminal · new build' },
        { label: 'Control tower' },
      ],
      extra:
        'Also delivered in the United Kingdom: Gibraltar Airport — iris biometric access, 126 readers and 16 biometric units.',
    },
    metro: {
      tech: ['VMS', 'IP CCTV', 'Recording', 'Network integration'],
      tag: 'Flagship · Metro · Public sector',
      client: 'TMB · Barcelona',
      title: 'Metro CCTV: an entire network watched',
      place: 'Barcelona · L9 · L10',
      challenge:
        'Give video visibility and control to a metro network in service, including the fully automatic line.',
      solution:
        'Engineering, development and customisation of the VMS visualisation software, recording and CCTV control applications for the fully automatic Metro Line 9, plus continuous service on L9/L10 and thousands of IP cameras since 2005.',
      outcome: 'Uninterrupted service with a 24/7 critical SLA and full network integration.',
      metrics: [{ label: 'In service since' }, { label: 'Lines served' }, { label: 'Critical SLA' }],
    },
    buses: {
      tech: ['Onboard CCTV', 'PIS', 'Ticketing', 'EN 50155'],
      tag: 'Flagship · Bus fleet · Public sector',
      client: 'TMB · Onboard systems',
      title: '5,000 buses. One integrated fleet.',
      place: 'Barcelona · Zona Franca, Triangle, Horta and Ponent',
      challenge:
        'Equip the entire bus fleet with CCTV, passenger information and ticketing without stopping service.',
      solution:
        'Installation and management of onboard CCTV, PIS and ticketing across the whole fleet, mainly at the Zona Franca, Triangle, Horta and Ponent depots.',
      outcome:
        'EN50155-certified dome cameras, full-cabin coverage, GDPR-compliant privacy masking and turnkey installation at every depot.',
      metrics: [
        { label: 'Buses equipped' },
        { label: 'Depots · Barcelona' },
        { label: 'Rail-grade certification' },
        { label: 'GDPR compliance' },
      ],
    },
    hospitalet: {
      tech: ['Metering', 'thethings.io', '30+ sources'],
      tag: 'Flagship · Smart City · City council',
      client: "L'Hospitalet de Llobregat · Spain",
      title: 'Building automation, city-scale',
      place: "L'Hospitalet de Llobregat",
      challenge:
        'Find out what municipal buildings actually consume, with data spread across more than thirty different systems.',
      solution:
        '157 metering boxes deployed, centralising real-time data from more than 30 data sources to optimise building management.',
      outcome: 'A live platform in production, serving the city’s smart-city sustainability goals.',
      metrics: [{ label: 'Metering boxes' }, { label: 'Data sources' }, { label: 'Realtime · in production' }],
    },
    navantia: {
      tech: ['Digital Twin', 'SCADA', 'thethings.io', 'Industry 4.0'],
      tag: 'Flagship · Naval & Defence · State-owned',
      client: 'Navantia · Warship yards',
      title: 'A digital factory for warships',
      place: 'Spain · shipyards',
      challenge: 'Turn the operation of a warship yard into a measurable digital factory.',
      solution:
        'Over 80 machines connected and integrated with SCADA, PLCs and IoT sensors under one operational Digital Twin, certified by Dell NativeEdge.',
      outcome: 'Real-time acquisition from 80+ industrial machines on thethings.io.',
      metrics: [
        { label: 'Machines connected' },
        { label: 'Single operational model' },
        { label: 'Certification' },
      ],
    },
    kafd: {
      tag: 'Smart city in production · Sovereign',
      client: 'KAFD · Saudi Arabia',
      title: 'KAFD Smart District',
      place: 'Riyadh · Saudi Arabia',
      challenge: 'Give a single command layer to a 160-hectare flagship district with dozens of separate systems.',
      solution:
        'A digital backbone integrating BMS, security, ITS, GIS and citizen apps under a single command layer.',
      outcome: 'A 160-hectare district operated from one common command layer.',
      metrics: [{ label: 'District area' }, { label: 'Command layer' }],
    },
    'qatar-waste': {
      tech: ['RFID', 'GPS', 'Municipal integration'],
      tag: 'Smart city in production · Municipal',
      client: 'Qatar · Municipal',
      title: 'Smart waste management',
      place: 'Qatar',
      challenge: 'Collect waste across a metro area without knowing which bin is full.',
      solution:
        'A connected platform with RFID bins, GPS route control and municipal integration, in a modular district rollout.',
      outcome: 'Modular rollout across the key districts of the metro area.',
      metrics: [{ label: 'Bin identification' }, { label: 'Route control' }],
    },
    nsu: {
      tech: ['thethings.io', 'R&D', 'Campus'],
      tag: 'Smart city in production · Public university',
      client: 'Nova Southeastern University · Florida, USA',
      title: 'NSU Florida · Living Lab',
      place: 'Florida · United States',
      challenge: 'Turn a university campus into a living city laboratory.',
      solution: 'Environmental sensing, mobility flows and community analytics on thethings.io.',
      outcome: "A working living lab researching tomorrow's cities.",
      metrics: [{ label: 'Platform' }, { label: 'Scope · R&D' }],
    },
    'malaysia-aqi': {
      tech: ['thethings.io', 'Alerting', 'IoT'],
      tag: 'Smart city in production · Environmental',
      client: 'Malaysia · Local authorities',
      title: 'Predictive AQI',
      place: 'Malaysia',
      challenge: 'Make public-health decisions without live air data of your own.',
      solution:
        'A network of CO, NO₂, PM2.5 and PM10 sensors giving local authorities live data to decide on.',
      outcome: 'Live environmental data and alerting on thethings.io.',
      metrics: [{ label: 'PM2.5 · PM10' }, { label: 'thethings.io · IoT' }],
    },
  },

  PROJECTS_META: {
    kicker: 'Flagship projects',
    clientsKicker: 'Clients',
    clientsTitle: ['They trust', 'us.'],
    clientsLine: 'Public administrations, transport operators, industrial groups and private companies.',
    title: ['Real projects.', 'Real results.'],
    lead:
      "From Spain's flagship airport to warship digital factories — the projects that define what MTi means by mission-critical.",
    labels: { challenge: 'The challenge', solution: 'The solution', outcome: 'The outcome', client: 'Client' },
    customers: {
      title: 'A decade of critical deployments',
      lead:
        'From national airports and city councils to shipyards and industrial groups — MTi delivers to both regulated public procurement and demanding private operators.',
      public: {
        title: 'MTi delivers to public tenders.',
        body:
          'National authorities, city councils and public transport operators choose MTi for mission-critical projects — subject to public tender processes, security clearance and long-term SLA obligations.',
      },
      private: {
        title: 'And to enterprise operators.',
        body:
          'Shipyards, industrial groups, sports venues and services operators — chosen for demanding SLAs, secure integration and measurable ROI on operations.',
      },
    },
  },

  REASONS: {
    multibrand: {
      title: 'Multi-brand installation',
      body: 'Experts in hardware from diverse manufacturers with no brand dependency.',
      bullets: ['Tech independence', 'Certified assembly', 'Mixed fleet adaptation'],
    },
    itxpt: {
      title: 'ITxPT expertise',
      body: 'Deep mastery of the standards for an open and scalable architecture.',
      bullets: ['Data bus integration', 'Protocol auditing', 'System homologation'],
    },
    pm: {
      title: 'Project management',
      body: 'Comprehensive coordination of complex deployments in large fleets.',
      bullets: ['Installation logistics', 'Minimised downtime', 'QA quality control'],
    },
    support: {
      title: 'Post-sale support',
      body: 'Continuous accompaniment after installation and commissioning.',
      bullets: ['Preventive maintenance', 'Warranty management', 'OTA updates'],
    },
    hetero: {
      title: 'Heterogeneous systems',
      body: 'We unify diverse technologies into one coherent operational solution.',
      bullets: ['Real interoperability', 'Custom configuration', 'Turnkey solution'],
    },
  },

  CLOSING: {
    kicker: 'Ready when you are',
    title: ["Let's build", 'the next one together.'],
    lead:
      "Tell us your challenge. We'll show you how MTi solves it — with real technology, real integrations and measurable results from day one.",
    reasonsKicker: 'Why choose MTi',
    reasonsTitle: ['Five reasons', 'partners choose us.'],
    contactTitle: "Let's talk",
    ctaCity: 'Explore the solutions in the 3D city',
    ctaProjects: 'Back to the projects',
    ctaIndex: 'Back to the index',
  },

  CONTACT: { hq: 'HQ · Barcelona, Spain' },

  SCENES: {
    opening: {
      claim: 'Technology that transforms operations',
      claimSub: 'Systems integration, Agentic AI, IoT and Smart Cities',
      facts: ['25+ Countries', 'AI Expertise', '150K+ IoT Devices'],
      arrival: ['Technology integrator.', 'Barcelona, 2016.'],
      arrivalLine: 'Engineering, integration and operation of mission-critical systems for the public and private sectors.',
      how: {
        how: 'How?',
        client: 'Company or government',
        captions: {
          need: 'When a company or a government has a need…',
          mti: 'MTi steps in.',
          help: 'And helps with hardware and software.',
          ops: 'All with our installation and 24/7 maintenance.',
          e2e: 'End to end.',
          industries: 'This is how we have helped all these industries.',
        },
        needs: ['Integrate all my systems', 'Software that automates my processes', 'Hardware that measures my facilities', 'See my whole operation from one place'],
        hardware: { items: [{ label: 'Design and engineering' }, { label: 'Installation and integration' }, { label: 'Certification and audit' }] },
        software: { items: [{ label: 'IoT and connectivity' }, { label: 'Proprietary platforms' }, { label: 'Agentic AI' }, { label: 'Smart City' }, { label: 'Digital Twin' }] },
        ops: { label: 'Installation and 24/7 maintenance', sub: 'One single owner, for years' },
        replay: 'Play again',
      },
      metricsHead: 'Proven at scale.',
      metrics: {
        countries: { label: 'countries of operation' },
        iot: { label: 'IoT devices connected' },
        hubs: { label: 'engineering + delivery hubs' },
        ai: { label: 'Agentic AI cases in production' },
        customers: { label: 'reference customers' },
        public: { value: 'Public + private', label: 'public tenders and private operators' },
      },
    },
    world: {
      hqSub: 'Headquarters · since 2016',
      network: 'From Barcelona, one network.',
      networkLine: 'Regional teams that speak the local language and know the local regulation.',
      projects: 'Projects in production all over the world.',
      explore: 'Pick a location',
      countriesLabel: 'countries of operation',
      hubsLabel: 'engineering + delivery hubs',
      continentsLabel: 'continents with projects',
      selectedProjects: 'Projects here',
      noProjects: 'Presence confirmed in the presentation, no detailed project.',
      openProject: 'Open the project',
    },
    sectors: {
      intro: ['We understand', 'your sector.'],
      introLine: 'Six sectors with a track record of our own. Each one switches on a different system.',
      offMap: 'More sectors',
      systems: {
        security: ['CCTV', 'VMS', 'Access control', 'Perimeter', 'Control room'],
        'smart-cities': ['Command centre', 'Mobility', 'Lighting', 'Waste', 'IoT metering'],
        'industry-naval': ['Digital Twin', 'SCADA', 'PLC', 'Industry 4.0'],
        cybersecurity: ['SOC', 'Segmentation', 'NIS2', 'ISO 27001'],
        venues: ['Stadium CCTV', 'Access', 'IoT', 'Venue twin'],
        transport: ['Metro', 'Buses', 'Airports', 'ITxPT', 'PIS', 'Onboard CCTV'],
      },
      scada: ['PLC · cutting line', 'PLC · welding', 'SCADA · gantry crane', 'IoT · assembly hall', 'Digital Twin · sync'],
      blocked: 'blocked',
      allowed: 'allowed',
      alsoHead: 'And the same technology, in more environments.',
      flowTitle: 'How it works',
      flowLabels: { in: 'In', core: 'MTi', out: 'Out' },
      flows: {
        security: {
          inputs: [{ label: 'CCTV cameras' }, { label: 'Access control' }, { label: 'Perimeter' }],
          core: { kicker: 'VMS + analytics', steps: ['Takes in video and events', 'Video analytics', 'Correlates in the control room', 'Triggers the protocol'] },
          outputs: [{ label: 'Verified alert' }, { label: 'Guided operator' }, { label: 'Traceable evidence' }],
        },
        'smart-cities': {
          inputs: [{ label: 'IoT sensors' }, { label: 'Meters' }, { label: 'Lighting and waste' }],
          core: { title: 'Command centre', steps: ['Captures and normalises', 'Rules and alarms', 'Crosses city services', 'Coordinates the response'] },
          outputs: [{ label: 'Single city view' }, { label: 'Actionable alarms' }, { label: 'Dashboards' }],
        },
        'industry-naval': {
          inputs: [{ label: 'Machines and PLCs' }, { label: 'SCADA' }, { label: 'IoT sensors' }],
          core: { kicker: 'thethings.io + twin', steps: ['Real-time acquisition', 'Common data model', 'Operational twin', 'Deviation detection'] },
          outputs: [{ label: 'Live plant twin' }, { label: 'Earlier maintenance' }, { label: 'Data to decide' }],
        },
        cybersecurity: {
          inputs: [{ label: 'Network traffic' }, { label: 'Events and logs' }, { label: 'Access' }],
          core: { kicker: 'SOC · segmentation', steps: ['Monitors the network', 'Segments and isolates', 'Detects the threat', 'Responds and logs'] },
          outputs: [{ label: 'Threat contained' }, { label: 'NIS2 · ISO 27001' }, { label: 'Auditable record' }],
        },
        venues: {
          inputs: [{ label: 'Stadium CCTV' }, { label: 'Access and turnstiles' }, { label: 'IoT sensors' }],
          core: { kicker: 'Hypervisor + twin', title: 'Venue operations', steps: ['Joins video and access', 'Live occupancy', 'Venue twin', 'Coordinates the operation'] },
          outputs: [{ label: 'Occupancy by stand' }, { label: 'Safe event' }, { label: 'Exit flows' }],
        },
        transport: {
          inputs: [{ label: 'Onboard CCTV' }, { label: 'ITxPT data bus' }, { label: 'Fleet position' }],
          core: { title: 'Control centre', steps: ['Integrates onboard systems', 'Video on demand', 'Status of every vehicle', 'Informs passengers'] },
          outputs: [{ label: 'Monitored fleet' }, { label: 'PIS information' }, { label: 'Video for investigation' }],
        },
      },
    },
    delivery: {
      e2e: {
        kicker: 'How we work',
        title: ['End to end.', 'One single owner.'],
        line: 'Every project follows the same path: understand the challenge, design the solution, build it with whatever hardware and software it needs, install it on the client site and keep it running.',
        replay: 'Play again',
        nodes: {
          discover: { title: 'Discovery', body: 'We visit the operation and understand the real need.' },
          design: { title: 'We design the solution', body: 'Technical office and project engineering.' },
          hw: { title: 'Does it need hardware?' },
          sw: { title: 'Does it need software?' },
          'hw-market': { title: 'Multi-brand equipment', body: 'CCTV, IoT, onboard systems.' },
          'hw-custom': { title: 'We design it', body: 'Electronics, mechanics and prototyping.' },
          'sw-platform': { title: 'Proprietary platforms' },
          'sw-existing': { title: 'We integrate what exists', body: 'SCADA, CCTV, ITS, ERP.' },
          install: { title: 'We install on the client site', body: 'Hardware in the field. Software deployed and integrated.' },
          maintain: { title: 'Ongoing maintenance', body: 'Preventive, corrective and predictive, 24/7.' },
        },
        edges: [{}, {}, {}, { label: 'Market' }, { label: 'Custom' }, { label: 'Our own' }, { label: 'Existing' }, {}, {}, {}, {}, {}, { label: 'Continuous evolution' }],
      },
      stages: ['Design', 'Deploy', 'Integrate', 'Operate'],
      beats: [
        { head: 'First, the plan.' },
        { head: 'Devices and sensors, from any brand.' },
        { head: 'Every device, connected.' },
        { head: 'The new talks to what was already there.' },
        { head: 'The control centre comes on.' },
        { head: 'Installation is only day one.' },
        { head: 'Real operations, and continuous evolution.' },
      ],
    },
    platforms: {
      chainHead: 'From the sensor to the decision.',
      chainLine: 'Four proprietary platforms, one integrated stack.',
      stations: ['Device', 'thethings.io', 'MTi Hypervisor', 'Digital Twin', 'Agentic AI', 'Action'],
      sensorHead: 'A meter sends a reading.',
      reading: { id: 'METER · SECTOR 12', value: '42.7 m³/h', proto: 'LoRaWAN', state: 'out of range' },
      example: 'Illustrative example of a data point’s journey',
      actionHead: 'The decision, traced.',
      action: ['Work order drafted', 'Owner notified', 'Decision logged for audit'],
      features: {
        thethings: ['Sensors', 'Meters', 'Gateways', 'Normalisation', 'Rules', 'Alarms', 'Dashboards', 'API'],
        hypervisor: ['CCTV', 'Mobility', 'Security', 'Utilities', 'Alarms', 'Coordinated response'],
        twin: ['BIM', 'IoT data', 'Documents', 'Assets', 'Operational state'],
        agentic: ['ERP', 'CRM', 'IoT', 'Documents'],
      },
      agentsHint: 'Eight productised agents · tap one to see it',
    },
    projects: {
      hub: {
        kicker: 'Projects',
        title: ['These are', 'our projects.'],
        line: 'Airports, metros, cities, shipyards and industrial companies. Critical systems in production all over the world.',
        stats: [{ label: 'flagship projects' }, { label: 'agentic AI deployments' }, { label: 'countries of operation' }],
        walk: { title: 'Walk through the key ones', sub: 'Nine flagship projects, one by one' },
        filter: { title: 'Explore and filter', sub: 'By business line: CCTV, smart city, AI…' },
        map: { title: 'See them on the map', sub: 'Browse by country and by project' },
        back: 'Projects',
        all: 'All',
        filterTitle: ['All our projects,', 'by business line.'],
        mapTitle: ['Projects', 'on the map.'],
        mapHint: 'Tap a point to travel to the project.',
        agentic: 'Agentic AI · Agentify AI',
        lines: [{ label: 'Security and CCTV' }, { label: 'Transport' }, { label: 'Smart city' }, { label: 'IoT and data' }, { label: 'Industry and digital twin' }, { label: 'Agentic AI' }],
      },
      overview: ['Real projects.', 'Real results.'],
      overviewLine: "From Spain's flagship airport to warship digital factories.",
      travel: 'Travel to the project',
      tech: 'Technology',
    },
    why: {
      clientsHead: 'A decade of critical deployments.',
      clientsLine: 'Public and private customers. Tap a logo to see the relationship.',
      clusters: {
        flagship: 'Flagship projects',
        sector: 'Sectors in the presentation',
        agentic: 'Agentic AI in production',
        transformation: 'Digital transformation',
        reference: 'Reference customers',
      },
      reasonsHead: 'Five reasons.',
      reasonsLine: 'Capabilities switched on inside a complete operation.',
      closing: ["Let's build", 'the next one together.'],
      restart: 'Restart the walkthrough',
      openProject: 'Open a project',
      chapters: 'Go to a chapter',
    },
  },

  CLIENT_LINKS: {
    'client-aena': { note: 'Barcelona-El Prat T1 · 1,900 CCTV cameras' },
    'client-tmb': { note: 'L9/L10 metro CCTV and 5,000 buses' },
    'client-navantia': { note: 'Digital factory for warships' },
    'client-fcb': { note: 'Sports venues' },
    'client-moventia': { note: 'Transports' },
    'client-copegal': { note: '−80% quote generation time' },
    'client-rcfil': { note: '−65% manual management' },
    'client-ferri': { note: '−70% offer preparation' },
    'client-merchant-union': { note: 'Digital transformation' },
  },

  CHAPTERS: {
    opening: { label: 'MTi in one sentence', short: 'MTi' },
    world: { label: 'Global presence', short: 'World' },
    sectors: { label: 'Where we work', short: 'Sectors' },
    delivery: { label: 'How we deliver', short: 'Delivery' },
    platforms: { label: 'Our platforms', short: 'Platforms' },
    projects: { label: 'Projects that prove it', short: 'Projects' },
    contact: { label: "Let's talk", short: 'Contact' },
  },

  DECK_UI: {
    title: 'Discover MTi',
    subtitle: 'Company walkthrough',
    explore: 'Explore solutions',
    back: 'Back to the presentation',
    index: 'Index',
    prev: 'Previous',
    next: 'Next',
    pause: 'Pause animations',
    play: 'Resume animations',
    close: 'Leave the walkthrough',
    openSolution: 'See the solution in the 3D city',
    noSolution: 'No linked demo yet',
    sources: 'Sources',
    sourcePage: 'PDF p.',
    scope: { grupo: 'MTi Group', plataforma: 'platform', proyecto: 'project' },
    keyboard: '← → steps · ↑ ↓ chapters · Space advances · Esc index',
    chapter: 'Chapter',
    phone: 'Phone',
    step: 'Step',
    of: 'of',
    webglOff:
      'This browser cannot show 3D graphics. The walkthrough is still complete: the globe and the scenes fall back to their flat version.',
    loading: 'Preparing the scene…',
    returnHint: 'You come back to exactly where you left off.',
    scrollHint: 'Wheel, arrows or swipe to advance',
    more: 'More information',
    illustrative: 'Illustrative signal',
    reviewTitle: 'Pending validation',
    contact: 'Contact',
    restart: 'Restart',
    otherServices: 'Explore other services',
    otherServicesLead: 'Each service line has its own walkthrough, with its cases and its way of working.',
    moreProjects: 'Explore more projects',
    moreProjectsLead: 'Cases by service line',
    startTrack: 'Start the walkthrough',
    seeCases: 'See the cases',
    tracksTitle: 'Walkthroughs',
  },

  SERVICE_TRACKS: {
    agentify: {
      kicker: 'Agentic AI',
      line: 'Productised agents working inside your ERP, CRM, IoT and documents.',
      stats: [{ label: 'deployments' }, { label: 'agents' }],
    },
  },

  AGENTIFY: AGENTIFY_EN,
  PROJECT_REELS: PROJECT_REELS_EN,
  PROJECT_REELS_UI: PROJECT_REELS_UI_EN,
  CLIENTS: { espol: ESPOL_EN },
};

export default DECK_EN;
