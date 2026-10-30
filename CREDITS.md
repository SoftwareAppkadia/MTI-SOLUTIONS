# Créditos y licencias

## Geometría de la ciudad — OpenStreetMap (ODbL)

Las manzanas, alturas de edificio, calles, parques y masas de agua son **datos reales de
OpenStreetMap**, descargados con `npm run city:fetch` (Overpass API) y horneados a
`public/city/<zona>.json`.

> © colaboradores de OpenStreetMap — licencia [ODbL](https://www.openstreetmap.org/copyright)

La atribución se muestra en el pie de la aplicación y en el panel de créditos. Es
obligatoria: si se despliega la web en otro sitio, tiene que seguir visible.

## Ortofoto aérea — ICGC (CC BY 4.0)

El suelo y las cubiertas de los edificios son **fotografía aérea real** del
Institut Cartogràfic i Geològic de Catalunya, descargada con `npm run city:ortho`
desde su servicio WMS abierto (`ortofoto_color_vigent`, 0,76 m/píxel).

> Ortofoto © Institut Cartogràfic i Geològic de Catalunya — [CC BY 4.0](https://www.icgc.cat)

## Fotografías de los paneles — Wikimedia Commons

Las escenas muestran una foto real del activo del que hablan. Se descargan con
`npm run city:photos`, filtrando solo licencias reutilizables:

| Archivo | Imagen | Autor | Licencia | Origen |
| ------- | ------ | ----- | -------- | ------ |
| `water.jpg` | Water meter (aka) clip.jpg | Georg Wiora Dr. Schorsch. Author o | CC BY-SA 2.5 | https://commons.wikimedia.org/wiki/File:Water_meter_(aka)_clip.jpg |
| `bus.jpg` | Autobús histórico 3036 de TMB.jpg | The STB | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Autob%C3%BAs_hist%C3%B3rico_3036_de_TMB.jpg |
| `waste-truck.jpg` | Southampton City refuse cart - geograph.org.uk - 150 | Peter Facey | CC BY-SA 2.0 | https://commons.wikimedia.org/wiki/File:Southampton_City_refuse_cart_-_geograph.org.uk_-_1502736.jpg |
| `cctv.jpg` | 2020-04-05 17.18.01 Pole with surveillance cameras i | µKöff | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:2020-04-05_17.18.01_Pole_with_surveillance_cameras_in_Saarbr%C3%BCcken.jpg |
| `traffic.jpg` | Torre Agbar - Barcelona, Spain - Jan 2007.jpg | Diliff | CC BY 2.5 | https://commons.wikimedia.org/wiki/File:Torre_Agbar_-_Barcelona,_Spain_-_Jan_2007.jpg |
| `stadium.jpg` | Camp Nou - Interior (2005).jpg | Mutari 09:33, 21 September 2007 (U | Public domain | https://commons.wikimedia.org/wiki/File:Camp_Nou_-_Interior_(2005).jpg |
| `control-room.jpg` | CERN control room computer monitors.jpg | Robert Scoble from Half Moon Bay,  | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:CERN_control_room_computer_monitors.jpg |
| `streetlight.jpg` | DZ6 2576 Streetlight wrapped in colorful LED strands | PattayaPatrol | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:DZ6_2576_Streetlight_wrapped_in_colorful_LED_strands_glows_at_dusk_along_a_busy_city_avenue.jpg |
| `hospital.jpg` | West Wings, Old Buffalo State Hospital, Richardson O | w_lemay | CC BY-SA 2.0 | https://commons.wikimedia.org/wiki/File:West_Wings,_Old_Buffalo_State_Hospital,_Richardson_Olmsted_Complex,_Elmwood_Village,_Buffalo,_NY.jpg |
| `containers.jpg` | Public waste recycling containers at the Liefkenshoe | Donald Trung Quoc Don (Chữ Hán: 徵國 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Public_waste_recycling_containers_at_the_Liefkenshoek,_Winschoten_(2019)_01.jpg |
| `building.jpg` | Construction of a new office-building near Beatrixkw | Fons Heijnsbroek | CC0 | https://commons.wikimedia.org/wiki/File:Construction_of_a_new_office-building_near_Beatrixkwartier_in_The_Hague_city;_high_resolution_image_by_FotoDutch,_June_2013.jpg |
| `crane.jpg` | Crane and the Millennium Tower (301 Mission Street)  | Cheers. Trance addict - Armin van  | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Crane_and_the_Millennium_Tower_(301_Mission_Street)_construction_site,_SF.JPG |
| `air.jpg` | Air Quality Monitoring Station - geograph.org.uk - 2 | Jonathan Thacker | CC BY-SA 2.0 | https://commons.wikimedia.org/wiki/File:Air_Quality_Monitoring_Station_-_geograph.org.uk_-_2573031.jpg |
| `slope.jpg` | Myanmar Landslide 2015 (before).jpg | Global Precipitation Measurement S | Public domain | https://commons.wikimedia.org/wiki/File:Myanmar_Landslide_2015_(before).jpg |
| `flood.jpg` | Dunham Pipe Bridge and River Trent in flood - geogra | Richard Croft | CC BY-SA 2.0 | https://commons.wikimedia.org/wiki/File:Dunham_Pipe_Bridge_and_River_Trent_in_flood_-_geograph.org.uk_-_337925.jpg |

Las licencias CC BY y CC BY-SA obligan a mantener esta atribución.

## Datos en vivo del modo mapa

Las capas en vivo son fuentes públicas y abiertas:

| Capa | Fuente | Licencia / uso |
| ---- | ------ | -------------- |
| Bicing en vivo | [GBFS de Bicing Barcelona](https://barcelona.publicbikesystem.net/customer/gbfs/v2/gbfs.json) | feed público del sistema de bicicleta pública |
| Lluvia (radar) | [RainViewer](https://www.rainviewer.com/api.html) | API pública gratuita, atribución «Radar © RainViewer» |

## Modo mapa — MapLibre GL, CARTO y OpenStreetMap

El botón *Mapa* usa [MapLibre GL JS](https://maplibre.org) (licencia BSD de 3
cláusulas; el worker y su módulo compartido están copiados en
`public/maplibre/`) con los estilos base gratuitos de CARTO, construidos sobre
datos de OpenStreetMap:

> © CARTO · © colaboradores de OpenStreetMap

Esa atribución se pinta en el propio mapa y es obligatoria mantenerla.

## Logotipo

`public/brand/logo-mti.png` es el logotipo corporativo de MTi / Mingo Things,
tomado de mingothings.com. Es propiedad de la empresa y no se redistribuye
fuera de esta aplicación.

## Modo fotorrealista — Google Photorealistic 3D Tiles

Opcional, solo si se configura `VITE_GOOGLE_TILES_KEY`. Las imágenes son de Google y su
atribución la pinta el propio visor (`TilesAttributionOverlay`); no debe ocultarse. El
servicio se factura por uso según las condiciones de Google Maps Platform.

## Modelos 3D — poly.pizza (CC0 / CC-BY 3.0)

Vehículos, personas y mobiliario urbano son modelos libres descargados de
[poly.pizza](https://poly.pizza).

Todos los archivos están en [`public/models/`](public/models) y se cargan desde
[`src/three/assets.js`](src/three/assets.js).

| Archivo               | Modelo              | Autor           | Licencia | Origen                              |
| --------------------- | ------------------- | --------------- | -------- | ----------------------------------- |
| `car-hatchback.glb`   | Car                 | Poly by Google  | CC-BY    | https://poly.pizza/m/75h3mi6uHuC    |
| `car-sedan.glb`       | Red Car             | J-Toastie       | CC-BY    | https://poly.pizza/m/dVLJ5CjB0h     |
| `car-taxi.glb`        | Taxi                | Poly by Google  | CC-BY    | https://poly.pizza/m/fet47VieV0L    |
| `car-van.glb`         | Van                 | Poly by Google  | CC-BY    | https://poly.pizza/m/aT_24cDaW1a    |
| `car-police.glb`      | Police car          | Poly by Google  | CC-BY    | https://poly.pizza/m/0-j0ksmXXtz    |
| `car-ambulance.glb`   | Ambulance           | Poly by Google  | CC-BY    | https://poly.pizza/m/beDwEv9UB7x    |
| `bus.glb`             | Bus                 | Poly by Google  | CC-BY    | https://poly.pizza/m/4CPpvEmrMoF    |
| `truck-waste.glb`     | Truck               | KolosStudios    | CC-BY    | https://poly.pizza/m/jHwRymyg2C     |
| `cctv-camera.glb`     | Security Camera     | J-Toastie       | CC-BY    | https://poly.pizza/m/a6J7IDufQP     |
| `traffic-light.glb`   | Traffic light       | Poly by Google  | CC-BY    | https://poly.pizza/m/57rxXzowK8w    |
| `street-lamp.glb`     | Street Light        | Quaternius      | CC0      | https://poly.pizza/m/nFwrlcLvM5     |
| `crane-tower.glb`     | Building construction crane | Kieran Farr | CC-BY | https://poly.pizza/m/cm5teXZ5Ctr |
| `bench.glb`           | Bench               | Ev Amitay       | CC-BY    | https://poly.pizza/m/dOSjmdmKaxi    |
| `container-a.glb`     | Shipping Container  | Clint Chilcott  | CC-BY    | https://poly.pizza/m/dlBoC4Wkzp2    |
| `container-b.glb`     | Container           | KolosStudios    | CC-BY    | https://poly.pizza/m/CQMziXZfYh     |
| `tree-round.glb`      | Tree                | Marc Solà       | CC-BY    | https://poly.pizza/m/6Yjt8nIwLsD    |
| `tree-pine.glb`       | Pine Trees          | Quaternius      | CC0      | https://poly.pizza/m/oYtDty0fR6     |
| `person-man.glb`      | Man (animado)       | Quaternius      | CC0      | https://poly.pizza/m/HMnuH5geEG     |
| `person-woman.glb`    | Animated Woman      | Quaternius      | CC0      | https://poly.pizza/m/9kF7eTDbhO     |
| `building-block.glb`  | Large Building      | Kenney          | CC0      | https://poly.pizza/m/ppwtREejXg     |
| `building-office.glb` | Large Building      | Kenney          | CC0      | https://poly.pizza/m/sxXonOmtct     |
| `building-tower.glb`  | Skyscraper          | Kenney          | CC0      | https://poly.pizza/m/obYD8hWLTZ     |

## Recorrido corporativo — recursos de la presentación de MTI

Fotografías, logos, capturas e iconos del recorrido «Conocer MTI» se extraen de
`public/MTI_GROUP_Presentation_v.01.pptx` con `npm run deck:assets` y se guardan
optimizados en `public/assets/mti-presentation/`. El manifiesto
`src/data/presentationAssets.js` recoge de qué diapositiva sale cada uno.

Son material de la propia presentación corporativa de MTI: los logotipos de
clientes y las fotografías conservan los derechos de sus titulares. Dos imágenes
están marcadas para revisión (tecla F dentro del recorrido): la de KAFD lleva la
marca de agua de un fotógrafo y la de Qatar no identifica la ciudad retratada.

## Recorrido Agentify AI — recursos de la presentación de IA Agentiva

Las fotografías de los casos, los dos gráficos (RCFIL, REGENASA), los logos de
clientes que no estaban en la corporativa (Regenasa, Promega, Ucalsa, Frioteis,
Aspol) y los iconos de los ocho agentes y de los cuatro rasgos salen de
`public/MTi_Group_IA_Agentiva_Recort_v.01.pptx`, con el mismo
`npm run deck:assets`, a `public/assets/mti-presentation/agentic/`, `clients/` e
`icons/`. Material de MTI; logos y fotografías conservan los derechos de sus
titulares. Las diapositivas de NAUTIA y Técnicas del Mar llevan el logo de
Merchant Union: no se usa hasta confirmar la relación.

## Logos de herramientas (Agentify AI y esquemas «Cómo funciona»)

Los logos de las herramientas que nombra la presentación de IA Agentiva están en
`public/assets/logos/` y se registran en `src/data/logos.js`. Los que trae el
PowerPoint son mapas de bits de 16 px, así que se han sustituido por versiones
vectoriales:

- **Simple Icons** (CC0, v16.33.0), coloreados con el color oficial de cada
  marca: Odoo, SAP, Sage, HubSpot, Zoho, WhatsApp, Python, React, Neo4j, Qdrant,
  Google Chrome, LangChain, LangGraph y Model Context Protocol. Odoo, Sage y Zoho
  se han recortado a su contorno y guardado en PNG para que se lean en ficha
  pequeña.
- **Wikimedia Commons**: Microsoft Outlook, Word, Excel y SharePoint (iconos
  2019–2025), Microsoft Dynamics 365, Microsoft Azure, Salesforce, OpenAI
  (símbolo 2025), Adobe Acrobat (PDF) y Gmail (icono 2020).

Son marcas registradas de sus titulares; se muestran solo para identificar las
integraciones que describe la presentación. Para cambiar uno basta con
sustituir su archivo manteniendo el nombre.

## Fotografías de sectores y proyectos — Wikimedia Commons

Las fotos de sectores, los fondos de proyecto y las imágenes de los «monitores» del
reel de cada proyecto no vienen de las presentaciones (las de la presentación son
de 400-900 px y no aguantan ir a toda la altura o a sangre). Se descargan con
`npm run deck:stock` desde Wikimedia Commons (manifiesto en
`src/data/stockPhotos.js`) y se optimizan con `npm run deck:assets` en
`public/assets/mti-presentation/stock/`. Las de licencia CC BY-SA se publican con
esta atribución; no se han modificado salvo recorte y compresión.

| Archivo | Título original | Autor | Licencia | Fuente |
|---|---|---|---|---|
| sector-seguridad-camaras-cctv-noche | CCTV cameras in Mumbai.jpg | Punit Rajpal | CC0 | https://commons.wikimedia.org/wiki/File:CCTV_cameras_in_Mumbai.jpg |
| sector-smart-city-barcelona-noche | Barcelona desde El Carmel (1).JPG | Jcca76 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Barcelona_desde_El_Carmel_(1).JPG |
| sector-industria-robots | Factory Automation Robotics Palettizing Bread.jpg | KUKA Roboter GmbH, Bachmann | Public domain | https://commons.wikimedia.org/wiki/File:Factory_Automation_Robotics_Palettizing_Bread.jpg |
| sector-ciber-cables-red | Wikimedia Foundation Servers 2015-88 | VGrigas (WMF) | CC BY-SA 3.0 | https://commons.wikimedia.org/w/index.php?curid=44043649 |
| sector-recintos-camp-nou | Camp Nou during El Clasico October 2012.jpg | Jackpollock | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Camp_Nou_during_El_Clasico_October_2012.jpg |
| sector-transporte-tmb | 3409 TMB - Flickr - antoniovera1.jpg | Antonio Vera | CC BY-SA 2.0 | https://commons.wikimedia.org/wiki/File:3409_TMB_-_Flickr_-_antoniovera1.jpg |
| aena-t1-barcelona | Terminal 1 of Barcelona Airport - 23 | Little Savage | CC BY-SA 3.0 | https://commons.wikimedia.org/w/index.php?curid=27084032 |
| aena-t1-pasajeros | Terminal 1 of Barcelona Airport - 07 | Little Savage | CC BY-SA 3.0 | https://commons.wikimedia.org/w/index.php?curid=27083849 |
| metro-l9-tunel | Barcelona Metro Line 9 (16049118954) | International Railway Summit | CC BY-SA 2.0 | https://commons.wikimedia.org/w/index.php?curid=78375052 |
| metro-l9-vagon | Barcelona Metro Line 9 (16645826306) | International Railway Summit | CC BY-SA 2.0 | https://commons.wikimedia.org/w/index.php?curid=78375069 |
| tmb-autobus-noche | TMB (Barcelona) driver of bus 1766 - has a moment to himself (36696335140) | Paul Burroughs | CC BY-SA 2.0 | https://commons.wikimedia.org/w/index.php?curid=90077492 |
| autobus-interior | Bus interior with yellow grabrails and handholds BCC bus P1290479.jpg | John Robert McPherson | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Bus_interior_with_yellow_grabrails_and_handholds_BCC_bus_P1290479.jpg |
| hospitalet-plaza-europa | Hospitalet de Llobregat - Plaza de Europa, Torres de Toyo Ito (Torres Porta Fira), Hotel Porta Fira y Torre Realia BCN 08 edited | Zarateman | CC0 1.0 | https://commons.wikimedia.org/w/index.php?curid=142924647 |
| sala-de-control | Celebro Studios Gallery | RuslonV | CC BY-SA 4.0 | https://commons.wikimedia.org/w/index.php?curid=79812581 |
| navantia-astillero-bam | Puesta en quilla del BAM 'Audaz' | PEPE GADEIRAS | CC BY-SA 4.0 | https://commons.wikimedia.org/w/index.php?curid=179371901 |
| soldadura-taller | Making sparks for parts (8625884).jpg | U.S. Air Force photo by Senior Airman Luis E. Rios Calderon | Public domain | https://commons.wikimedia.org/wiki/File:Making_sparks_for_parts_(8625884).jpg |
| kafd-riad-noche | King Abdullah Financial District 201553 | Ahmed | CC BY-SA 4.0 | https://commons.wikimedia.org/w/index.php?curid=120250309 |
| kafd-riad-dia | King Abdullah Financial District 20230411 114859 | Ahmed | CC BY-SA 4.0 | https://commons.wikimedia.org/w/index.php?curid=157318656 |
| doha-skyline-noche | Doha Skyline Nacht night | FLASHPACKER TRAVELGUIDE | CC BY-SA 2.0 | https://commons.wikimedia.org/w/index.php?curid=87285877 |
| contenedores-reciclaje | File:Vancouver street recycling.JPG | Daylen | CC0 1.0 | https://commons.wikimedia.org/w/index.php?curid=66184719 |
| kuala-lumpur-noche | Kuala Lumpur skyline at night (2019) | Lee Wei | CC BY 2.0 | https://commons.wikimedia.org/w/index.php?curid=115902236 |
| kuala-lumpur-calima | Kuala Lumpur skyline thunderstorm 03 | Pradana Aumars (talk · contribs) | CC BY-SA 4.0 | https://commons.wikimedia.org/w/index.php?curid=75362513 |

## Globo del recorrido — Natural Earth (dominio público)

Los contornos y la malla de puntos del globo salen de Natural Earth a escala
1:110m, vía el paquete `world-atlas@2.0.2`. Se hornean una sola vez con
`npm run deck:globe` en `public/geo/world-110m.json`; la aplicación no consulta
ninguna red en ejecución.

## Banderas — flag-icons (MIT)

Las banderas del globo y de las fichas de ubicación son los SVG de
[flag-icons](https://github.com/lipis/flag-icons) 7.2.3, licencia MIT, copiados
en `public/assets/flags/` (añadidas Alemania, Polonia, Francia, Italia, Chile,
Argentina y Camerún).

## Qué implica cada licencia

- **CC0** — dominio público. Uso libre, también comercial, sin atribución.
- **CC-BY 3.0** — uso libre, también comercial, **citando al autor**. Esa cita es este archivo,
  y además está dentro de la propia web (Ayuda → *Créditos de los modelos 3D*), de modo que
  la atribución viaja con la aplicación aunque se despliegue en otro sitio.

Si en algún momento hay que eliminar la dependencia de terceros, cada modelo tiene un
sustituto primitivo ya programado: al no encontrarse el `.glb`, `assets.js` deja pasar el error
y la ciudad se dibuja con cajas del tamaño correcto, sin romper la demo.

## Espacios cliente (panel «Reuniones»)

- **Campus Gustavo Galindo (ESPOL)**: geometría real de OpenStreetMap (© colaboradores
  de OpenStreetMap, [ODbL](https://www.openstreetmap.org/copyright)), descargada con
  `npm run client:campus` a `public/clients/espol/campus.json`.
- **Logotipo y sello de ESPOL**: propiedad de la Escuela Superior Politécnica del Litoral,
  tomados de su web pública ([espol.edu.ec](https://www.espol.edu.ec/es)) y usados solo
  para identificarla en la propuesta de la reunión. Paleta de colores tomada de su hoja
  de estilos pública.
- **Cifras de ESPOL** (estudiantes, profesores, centros, laboratorios, bosque protector):
  de «ESPOL en cifras», en su web pública.
- **Vista «Satélite» del campus**: imagen aérea de **Esri World Imagery** (fuentes: Esri,
  Maxar, Earthstar Geographics y la comunidad de usuarios de SIG). Se pide en directo al
  elegir ese estilo y no se guarda en el repositorio; la atribución sale en pantalla. Las
  miniaturas del selector (`public/clients/<id>/looks/`) son capturas de la propia app.
  **Pendiente de confirmar**: las condiciones de uso comercial de Esri (normalmente
  requieren una cuenta ArcGIS); si no encajan, se puede cambiar el proveedor en
  `IMAGERY_URL` (`src/deck/stage/CampusStation.jsx`) por Mapbox Satellite o Google con su clave.
- **Paneles «en vivo»** (consumo, sensórica, eficiencia): datos **simulados**
  (`src/deck/stage/campusLive.js`), rotulados como «vista ilustrativa · datos simulados».
