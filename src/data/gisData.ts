import { DistrictBoundary, RoadCorridor, EnvironmentalSource, MeteorologyPoint, GeoSearchResult } from '../types/gis';

// Polígonos y centros de distritos clave de Lima Metropolitana
export const LIMA_DISTRICTS_GIS: DistrictBoundary[] = [
  {
    id: 'dist-sjl',
    name: 'San Juan de Lurigancho',
    zone: 'Lima Este',
    center: [-11.9754, -76.9942],
    polygon: [
      [-11.9000, -76.9800],
      [-11.9300, -76.9400],
      [-11.9900, -76.9600],
      [-12.0300, -77.0100],
      [-12.0100, -77.0300],
      [-11.9500, -77.0200],
      [-11.9000, -76.9800]
    ],
    population: 1120000,
    vulnerabilityIndex: 'Muy Alto',
    avgPm25: 58.4,
    avgNoiseDay: 68.5
  },
  {
    id: 'dist-cercado',
    name: 'Cercado de Lima',
    zone: 'Lima Centro',
    center: [-12.0464, -77.0282],
    polygon: [
      [-12.0300, -77.0500],
      [-12.0350, -77.0150],
      [-12.0700, -77.0250],
      [-12.0650, -77.0600],
      [-12.0300, -77.0500]
    ],
    population: 270000,
    vulnerabilityIndex: 'Alto',
    avgPm25: 48.9,
    avgNoiseDay: 76.8
  },
  {
    id: 'dist-miraflores',
    name: 'Miraflores',
    zone: 'Lima Centro',
    center: [-12.1221, -77.0366],
    polygon: [
      [-12.1050, -77.0450],
      [-12.1080, -77.0200],
      [-12.1400, -77.0250],
      [-12.1350, -77.0480],
      [-12.1050, -77.0450]
    ],
    population: 99000,
    vulnerabilityIndex: 'Bajo',
    avgPm25: 16.2,
    avgNoiseDay: 51.2
  },
  {
    id: 'dist-san-borja',
    name: 'San Borja',
    zone: 'Lima Centro',
    center: [-12.0911, -76.9986],
    polygon: [
      [-12.0750, -77.0100],
      [-12.0800, -76.9800],
      [-12.1100, -76.9900],
      [-12.1050, -77.0180],
      [-12.0750, -77.0100]
    ],
    population: 113000,
    vulnerabilityIndex: 'Bajo',
    avgPm25: 19.5,
    avgNoiseDay: 54.2
  },
  {
    id: 'dist-ate',
    name: 'Ate Vitarte',
    zone: 'Lima Este',
    center: [-12.0289, -76.9205],
    polygon: [
      [-12.0000, -76.9400],
      [-12.0100, -76.8800],
      [-12.0600, -76.8900],
      [-12.0500, -76.9500],
      [-12.0000, -76.9400]
    ],
    population: 680000,
    vulnerabilityIndex: 'Alto',
    avgPm25: 52.8,
    avgNoiseDay: 78.4
  },
  {
    id: 'dist-carabayllo',
    name: 'Carabayllo',
    zone: 'Lima Norte',
    center: [-11.8986, -77.0347],
    polygon: [
      [-11.8400, -77.0400],
      [-11.8600, -76.9800],
      [-11.9300, -77.0100],
      [-11.9200, -77.0600],
      [-11.8400, -77.0400]
    ],
    population: 330000,
    vulnerabilityIndex: 'Muy Alto',
    avgPm25: 64.2,
    avgNoiseDay: 64.0
  },
  {
    id: 'dist-puente-piedra',
    name: 'Puente Piedra',
    zone: 'Lima Norte',
    center: [-11.8667, -77.0783],
    polygon: [
      [-11.8300, -77.0900],
      [-11.8500, -77.0500],
      [-11.9000, -77.0700],
      [-11.8800, -77.1100],
      [-11.8300, -77.0900]
    ],
    population: 390000,
    vulnerabilityIndex: 'Alto',
    avgPm25: 61.0,
    avgNoiseDay: 74.5
  },
  {
    id: 'dist-callao',
    name: 'Callao (Prov. Constitucional)',
    zone: 'Callao',
    center: [-12.0145, -77.1189],
    polygon: [
      [-11.9800, -77.1400],
      [-12.0000, -77.0900],
      [-12.0600, -77.1100],
      [-12.0700, -77.1600],
      [-11.9800, -77.1400]
    ],
    population: 995000,
    vulnerabilityIndex: 'Alto',
    avgPm25: 44.0,
    avgNoiseDay: 77.2
  },
  {
    id: 'dist-vmt',
    name: 'Villa María del Triunfo',
    zone: 'Lima Sur',
    center: [-12.1611, -76.9383],
    polygon: [
      [-12.1300, -76.9500],
      [-12.1400, -76.9100],
      [-12.1900, -76.9300],
      [-12.1800, -76.9600],
      [-12.1300, -76.9500]
    ],
    population: 440000,
    vulnerabilityIndex: 'Muy Alto',
    avgPm25: 56.1,
    avgNoiseDay: 63.8
  },
  {
    id: 'dist-ves',
    name: 'Villa El Salvador',
    zone: 'Lima Sur',
    center: [-12.2144, -76.9362],
    polygon: [
      [-12.1900, -76.9500],
      [-12.2000, -76.9000],
      [-12.2500, -76.9200],
      [-12.2400, -76.9700],
      [-12.1900, -76.9500]
    ],
    population: 400000,
    vulnerabilityIndex: 'Alto',
    avgPm25: 49.5,
    avgNoiseDay: 67.2
  },
  {
    id: 'dist-san-isidro',
    name: 'San Isidro',
    zone: 'Lima Centro',
    center: [-12.0964, -77.0353],
    polygon: [
      [-12.0850, -77.0450],
      [-12.0880, -77.0200],
      [-12.1100, -77.0250],
      [-12.1050, -77.0500],
      [-12.0850, -77.0450]
    ],
    population: 68000,
    vulnerabilityIndex: 'Bajo',
    avgPm25: 18.0,
    avgNoiseDay: 58.0
  },
  {
    id: 'dist-comas',
    name: 'Comas',
    zone: 'Lima Norte',
    center: [-11.9333, -77.0500],
    polygon: [
      [-11.9100, -77.0600],
      [-11.9200, -77.0200],
      [-11.9600, -77.0300],
      [-11.9500, -77.0700],
      [-11.9100, -77.0600]
    ],
    population: 540000,
    vulnerabilityIndex: 'Alto',
    avgPm25: 57.0,
    avgNoiseDay: 69.1
  }
];

// Principales arterias viales y corredores acústicos de Lima Metropolitana
export const LIMA_ROAD_CORRIDORS: RoadCorridor[] = [
  {
    id: 'road-pan-norte',
    name: 'Panamericana Norte (Ancón - Evitamiento)',
    type: 'Autopista / Panamericana',
    coordinates: [
      [-11.8000, -77.1200],
      [-11.8500, -77.0800],
      [-11.9200, -77.0650],
      [-11.9700, -77.0600],
      [-12.0200, -77.0300]
    ],
    estimatedNoiseDb: 79.5,
    vehicleVolume: '> 140,000 veh/día (alto porcentaje diésel y carga)',
    congestionAqiImpact: 'Crítico'
  },
  {
    id: 'road-via-expresa',
    name: 'Vía Expresa Paseo de la República / Metropolitano',
    type: 'Vía Expresa',
    coordinates: [
      [-12.0580, -77.0340],
      [-12.0850, -77.0290],
      [-12.1120, -77.0250],
      [-12.1450, -77.0180]
    ],
    estimatedNoiseDb: 77.0,
    vehicleVolume: '> 120,000 veh/día (cañón acústico encajonado)',
    congestionAqiImpact: 'Alto'
  },
  {
    id: 'road-javier-prado',
    name: 'Av. Javier Prado Este / Oeste',
    type: 'Corredor Troncal',
    coordinates: [
      [-12.0920, -77.0650],
      [-12.0900, -77.0350],
      [-12.0860, -76.9950],
      [-12.0720, -76.9500],
      [-12.0500, -76.9100]
    ],
    estimatedNoiseDb: 78.2,
    vehicleVolume: '> 95,000 veh/día (frecuentes picos en horas punta)',
    congestionAqiImpact: 'Alto'
  },
  {
    id: 'road-carretera-central',
    name: 'Carretera Central (Ate - Chaclacayo)',
    type: 'Autopista / Panamericana',
    coordinates: [
      [-12.0450, -77.0000],
      [-12.0350, -76.9500],
      [-12.0250, -76.9000],
      [-11.9900, -76.8400]
    ],
    estimatedNoiseDb: 81.0,
    vehicleVolume: '> 80,000 veh/día (transporte interprovincial y mineral)',
    congestionAqiImpact: 'Crítico'
  },
  {
    id: 'road-av-abancay',
    name: 'Av. Abancay (Centro Histórico)',
    type: 'Corredor Troncal',
    coordinates: [
      [-12.0400, -77.0250],
      [-12.0464, -77.0282],
      [-12.0550, -77.0310]
    ],
    estimatedNoiseDb: 82.5,
    vehicleVolume: '> 55,000 veh/día (alta concentración de buses y colectivos)',
    congestionAqiImpact: 'Crítico'
  },
  {
    id: 'road-faucett-gambetta',
    name: 'Av. Elmer Faucett - Av. Néstor Gambetta',
    type: 'Corredor Troncal',
    coordinates: [
      [-11.9600, -77.1350],
      [-12.0200, -77.1150],
      [-12.0600, -77.0900]
    ],
    estimatedNoiseDb: 79.0,
    vehicleVolume: '> 75,000 veh/día (corredor de carga portuaria y aeropuerto)',
    congestionAqiImpact: 'Alto'
  },
  {
    id: 'road-pan-sur',
    name: 'Panamericana Sur (Trébol Javier Prado - Conchán)',
    type: 'Autopista / Panamericana',
    coordinates: [
      [-12.0860, -76.9750],
      [-12.1350, -76.9750],
      [-12.1850, -76.9600],
      [-12.2450, -76.9250]
    ],
    estimatedNoiseDb: 77.8,
    vehicleVolume: '> 110,000 veh/día',
    congestionAqiImpact: 'Medio'
  }
];

// Fuentes ambientales críticas (Industrias, térmicas, rellenos, terminales)
export const LIMA_ENVIRONMENTAL_SOURCES: EnvironmentalSource[] = [
  {
    id: 'src-pampilla',
    name: 'Refinería La Pampilla - Repsol',
    category: 'Industria Pesada',
    coordinates: [-11.9218, -77.1353],
    district: 'Ventanilla',
    emissionType: 'SO2, COV, Partículas de Combustión',
    estimatedOutput: '115,000 barriles/día de refinación',
    impactRadiusMeters: 3800,
    criticality: 'Crítica',
    description: 'Mayor complejo refinador de hidrocarburos de la costa central peruana.'
  },
  {
    id: 'src-huaycoloro',
    name: 'Relleno Sanitario Huaycoloro',
    category: 'Relleno Sanitario',
    coordinates: [-11.9630, -76.9050],
    district: 'San Antonio / SJL',
    emissionType: 'Metano (CH4), Ácido Sulfhídrico (H2S), Partículas en suspensión',
    estimatedOutput: 'Disposición de ~4,500 ton/día de RSU',
    impactRadiusMeters: 4500,
    criticality: 'Crítica',
    description: 'Principal vertedero controlado de residuos sólidos del este metropolitano.'
  },
  {
    id: 'src-atocongo-cement',
    name: 'Planta de Cemento Atocongo - UNACEM',
    category: 'Industria Pesada',
    coordinates: [-12.1700, -76.9400],
    district: 'Villa María del Triunfo',
    emissionType: 'Polvo de Clinker, PM10, NOx, CO2',
    estimatedOutput: 'Capacidad de ~5.5 millones ton cemento/año',
    impactRadiusMeters: 3200,
    criticality: 'Crítica',
    description: 'Horno y molienda de clínker con dispersión hacia lomas del sur.'
  },
  {
    id: 'src-puerto-callao',
    name: 'Terminal Portuario Callao (APM / DP World)',
    category: 'Puerto & Logística',
    coordinates: [-12.0520, -77.1500],
    district: 'Callao',
    emissionType: 'SOx por búnker marino, PM2.5 de grúas y tractocamiones',
    estimatedOutput: '> 2.7 millones de TEUs/año',
    impactRadiusMeters: 2500,
    criticality: 'Alta',
    description: 'Eje portuario nacional con emisiones continuas de buques atracados y tráfico de patio.'
  },
  {
    id: 'src-aeropuerto-jorge-chavez',
    name: 'Aeropuerto Internacional Jorge Chávez',
    category: 'Aeroportuario',
    coordinates: [-12.0219, -77.1143],
    district: 'Callao',
    emissionType: 'Ruido aeronáutico (LAeqT > 85 dBA en despegue), NOx, Hidrocarburos',
    estimatedOutput: '> 200,000 operaciones de vuelo anuales',
    impactRadiusMeters: 4200,
    criticality: 'Crítica',
    description: 'Huella acústica sobre zonas urbanas residenciales de San Martín de Porres y Callao.'
  },
  {
    id: 'src-parque-infantas',
    name: 'Parque Industrial Infantas - Los Olivos',
    category: 'Parque Fabril',
    coordinates: [-11.9610, -77.0680],
    district: 'Los Olivos',
    emissionType: 'Solventes orgánicos, humo de fundición, efluentes volátiles',
    estimatedOutput: '> 180 talleres de manufactura y metalmecánica',
    impactRadiusMeters: 1800,
    criticality: 'Alta',
    description: 'Clúster industrial de mediana y pequeña escala colindante con urbanizaciones densas.'
  },
  {
    id: 'src-parque-ves',
    name: 'Parque Industrial de Villa El Salvador',
    category: 'Parque Fabril',
    coordinates: [-12.2050, -76.9400],
    district: 'Villa El Salvador',
    emissionType: 'Polvillo de madera, pinturas y lacas (COV), ruido de maquinaria',
    estimatedOutput: '> 1,200 microempresas de carpintería y calzado',
    impactRadiusMeters: 1600,
    criticality: 'Media',
    description: 'Generación dispersa de aserrín respirable y vapores de solventes.'
  }
];

// Estaciones meteorológicas de viento y microclima en Lima
export const LIMA_METEOROLOGY_STATIONS: MeteorologyPoint[] = [
  {
    id: 'met-costa-miraflores',
    name: 'Boya & Estación Costera Miraflores',
    coordinates: [-12.1290, -77.0420],
    temperature: 19.4,
    humidity: 86,
    windSpeed: 4.8,
    windDirectionDeg: 215, // SSO
    windDirectionText: 'SSO (Suroeste)',
    pressure: 1014.2
  },
  {
    id: 'met-callao-costa',
    name: 'Estación Marina Callao - La Punta',
    coordinates: [-12.0720, -77.1620],
    temperature: 19.8,
    humidity: 88,
    windSpeed: 5.2,
    windDirectionDeg: 200,
    windDirectionText: 'SSO (Suroeste)',
    pressure: 1013.9
  },
  {
    id: 'met-valle-rimac',
    name: 'Estación Valle Rímac - Lima Centro',
    coordinates: [-12.0460, -77.0250],
    temperature: 21.6,
    humidity: 79,
    windSpeed: 1.6,
    windDirectionDeg: 230,
    windDirectionText: 'SO (Suroeste débil)',
    pressure: 1012.8
  },
  {
    id: 'met-cuenca-sjl',
    name: 'Estación Cuenca Ciega SJL',
    coordinates: [-11.9650, -76.9900],
    temperature: 22.8,
    humidity: 75,
    windSpeed: 1.2, // Atrapamiento
    windDirectionDeg: 240,
    windDirectionText: 'SO (Baja ventilación)',
    pressure: 1011.5
  },
  {
    id: 'met-norte-carabayllo',
    name: 'Estación Cono Norte - Carabayllo',
    coordinates: [-11.8900, -77.0300],
    temperature: 24.5,
    humidity: 69,
    windSpeed: 1.9,
    windDirectionDeg: 190,
    windDirectionText: 'S (Sur)',
    pressure: 1010.8
  },
  {
    id: 'met-sur-lurin',
    name: 'Estación Valle Sur - Lurín',
    coordinates: [-12.2700, -76.8700],
    temperature: 23.0,
    humidity: 72,
    windSpeed: 3.1,
    windDirectionDeg: 210,
    windDirectionText: 'SSO (Suroeste)',
    pressure: 1013.0
  }
];

// Directorio y buscador exhaustivo de Lima para autocompletado instantáneo
export const LIMA_GEO_SEARCH_INDEX: GeoSearchResult[] = [
  // Distritos
  { id: 'geo-d1', title: 'San Juan de Lurigancho', subtitle: 'Distrito más poblado de Lima (Lima Este)', type: 'distrito', coordinates: [-11.9754, -76.9942], zoom: 13 },
  { id: 'geo-d2', title: 'Cercado de Lima', subtitle: 'Centro Histórico & Sede de Gobierno', type: 'distrito', coordinates: [-12.0464, -77.0282], zoom: 14 },
  { id: 'geo-d3', title: 'Miraflores', subtitle: 'Distrito Costero y Turístico (Lima Centro)', type: 'distrito', coordinates: [-12.1221, -77.0366], zoom: 14 },
  { id: 'geo-d4', title: 'San Isidro', subtitle: 'Centro Financiero y Residencial', type: 'distrito', coordinates: [-12.0964, -77.0353], zoom: 14 },
  { id: 'geo-d5', title: 'San Borja', subtitle: 'Distrito Residencial & Pentagonito', type: 'distrito', coordinates: [-12.0911, -76.9986], zoom: 14 },
  { id: 'geo-d6', title: 'Ate Vitarte', subtitle: 'Eje Carretera Central & Parque Industrial', type: 'distrito', coordinates: [-12.0289, -76.9205], zoom: 13 },
  { id: 'geo-d7', title: 'Carabayllo', subtitle: 'Distrito de Lima Norte con alta resuspensión', type: 'distrito', coordinates: [-11.8986, -77.0347], zoom: 13 },
  { id: 'geo-d8', title: 'Callao', subtitle: 'Provincia Constitucional del Callao & Puerto', type: 'distrito', coordinates: [-12.0145, -77.1189], zoom: 13 },
  { id: 'geo-d9', title: 'Villa María del Triunfo', subtitle: 'Lima Sur - Lomas y Zona Cementera', type: 'distrito', coordinates: [-12.1611, -76.9383], zoom: 13 },
  { id: 'geo-d10', title: 'Puente Piedra', subtitle: 'Lima Norte - Corredor Panamericana', type: 'distrito', coordinates: [-11.8667, -77.0783], zoom: 13 },
  { id: 'geo-d11', title: 'Santiago de Surco', subtitle: 'Lima Sur - Zonas residenciales y comerciales', type: 'distrito', coordinates: [-12.1450, -76.9850], zoom: 13 },
  { id: 'geo-d12', title: 'Los Olivos', subtitle: 'Lima Norte - Núcleo comercial e industrial', type: 'distrito', coordinates: [-11.9610, -77.0680], zoom: 14 },
  { id: 'geo-d13', title: 'Comas', subtitle: 'Lima Norte - Av. Túpac Amaru y laderas', type: 'distrito', coordinates: [-11.9333, -77.0500], zoom: 13 },
  { id: 'geo-d14', title: 'Villa El Salvador', subtitle: 'Lima Sur - Parque Industrial y Litoral', type: 'distrito', coordinates: [-12.2144, -76.9362], zoom: 13 },
  { id: 'geo-d15', title: 'La Molina', subtitle: 'Lima Este - Valle de baja ventilación', type: 'distrito', coordinates: [-12.0800, -76.9300], zoom: 13 },
  { id: 'geo-d16', title: 'San Martín de Porres', subtitle: 'Lima Norte - Cruce Caquetá y Av. Perú', type: 'distrito', coordinates: [-12.0180, -77.0680], zoom: 13 },
  { id: 'geo-d17', title: 'San Miguel', subtitle: 'Lima Centro - Costanera y Plaza San Miguel', type: 'distrito', coordinates: [-12.0780, -77.0850], zoom: 14 },
  { id: 'geo-d18', title: 'Ventanilla', subtitle: 'Callao Norte - Refinería y Humedales', type: 'distrito', coordinates: [-11.8800, -77.1250], zoom: 13 },

  // Calles y Avenidas
  { id: 'geo-c1', title: 'Av. Abancay', subtitle: 'Cercado de Lima (Cañón acústico y vehicular)', type: 'calle', coordinates: [-12.0464, -77.0282], zoom: 16 },
  { id: 'geo-c2', title: 'Av. Javier Prado Este', subtitle: 'San Isidro / San Borja / La Molina', type: 'calle', coordinates: [-12.0860, -76.9950], zoom: 15 },
  { id: 'geo-c3', title: 'Vía Expresa Paseo de la República', subtitle: 'Metropolitano - Lima Centro a Barranco', type: 'calle', coordinates: [-12.0950, -77.0270], zoom: 15 },
  { id: 'geo-c4', title: 'Panamericana Norte', subtitle: 'Corredor Norte (Puente Piedra - Ancón)', type: 'calle', coordinates: [-11.8667, -77.0783], zoom: 14 },
  { id: 'geo-c5', title: 'Carretera Central', subtitle: 'Ate Vitarte - Corredor logístico e industrial', type: 'calle', coordinates: [-12.0289, -76.9205], zoom: 15 },
  { id: 'geo-c6', title: 'Av. Túpac Amaru', subtitle: 'Rímac / Independencia / Comas', type: 'calle', coordinates: [-11.9500, -77.0450], zoom: 15 },
  { id: 'geo-c7', title: 'Av. Elmer Faucett', subtitle: 'Callao - Acceso al Aeropuerto Jorge Chávez', type: 'calle', coordinates: [-12.0219, -77.1143], zoom: 15 },
  { id: 'geo-c8', title: 'Av. Brasil', subtitle: 'Breña / Jesús María / Magdalena', type: 'calle', coordinates: [-12.0720, -77.0530], zoom: 15 },
  { id: 'geo-c9', title: 'Av. Próceres de la Independencia', subtitle: 'Eje del Metro Línea 1 en SJL', type: 'calle', coordinates: [-11.9850, -77.0000], zoom: 15 },
  { id: 'geo-c10', title: 'Av. Universitaria', subtitle: 'San Miguel / Los Olivos / Carabayllo', type: 'calle', coordinates: [-11.9900, -77.0800], zoom: 14 },

  // Lugares y Puntos de Interés
  { id: 'geo-p1', title: 'Plaza Mayor de Lima (Plaza de Armas)', subtitle: 'Palacio de Gobierno y Catedral', type: 'lugar', coordinates: [-12.0453, -77.0311], zoom: 16 },
  { id: 'geo-p2', title: 'Parque Kennedy / Ovalo de Miraflores', subtitle: 'Centro de Miraflores', type: 'lugar', coordinates: [-12.1215, -77.0298], zoom: 16 },
  { id: 'geo-p3', title: 'Aeropuerto Internacional Jorge Chávez', subtitle: 'Terminal Aéreo Principal del Perú', type: 'fuente', coordinates: [-12.0219, -77.1143], zoom: 15 },
  { id: 'geo-p4', title: 'Puerto del Callao (DP World / APM Terminals)', subtitle: 'Terminal Portuario Internacional', type: 'fuente', coordinates: [-12.0520, -77.1500], zoom: 15 },
  { id: 'geo-p5', title: 'Cuartel General del Ejército (Pentagonito)', subtitle: 'San Borja (Zona Deportiva y Ecológica)', type: 'lugar', coordinates: [-12.0980, -76.9950], zoom: 15 },
  { id: 'geo-p6', title: 'Estadio Nacional del Perú', subtitle: 'Santa Beatriz / Cercado de Lima', type: 'lugar', coordinates: [-12.0672, -77.0336], zoom: 16 },
  { id: 'geo-p7', title: 'Campus UNMSM (Universidad Nacional Mayor de San Marcos)', subtitle: 'Ciudad Universitaria', type: 'lugar', coordinates: [-12.0560, -77.0840], zoom: 15 },
  { id: 'geo-p8', title: 'Campus UNI (Universidad Nacional de Ingeniería)', subtitle: 'Rímac / Túpac Amaru', type: 'lugar', coordinates: [-12.0180, -77.0490], zoom: 15 },
  { id: 'geo-p9', title: 'Planta de Cemento Atocongo', subtitle: 'UNACEM - Villa María del Triunfo', type: 'fuente', coordinates: [-12.1700, -76.9400], zoom: 15 },
  { id: 'geo-p10', title: 'Relleno Sanitario Huaycoloro', subtitle: 'San Antonio / Quebrada Huaycoloro', type: 'fuente', coordinates: [-11.9630, -76.9050], zoom: 14 }
];
