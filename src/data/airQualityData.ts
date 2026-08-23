import { AirMeasurementRecord, HourlyDataPoint, DailyDataPoint, AirParameterKey } from '../types/airQuality';
import { PERUVIAN_AIR_NORMATIVE } from '../utils/airQualityNormative';

/**
 * ESTACIONES Y PUNTOS DE MONITOREO DE CALIDAD DEL AIRE EN LIMA METROPOLITANA Y CALLAO
 * Integrando Red Oficial SENAMHI, Red de Vigilancia OEFA y Redes Municipales.
 */
export const OFFICIAL_AIR_STATIONS: AirMeasurementRecord[] = [
  {
    id: 'air-sjl-01',
    title: 'Estación SJL - San Antonio de Jicamarca',
    district: 'San Juan de Lurigancho',
    address: 'Av. Wiesse alt. Paradero 12 / Sector San Antonio',
    coordinates: [-11.9754, -76.9942],
    utmZone: '18S 283145m E 8675200m N',
    date: '2026-08-23',
    time: '10:00',
    parameter: 'PM2_5',
    concentration: 62.4, // Supera ECA (50)
    unit: 'µg/m³',
    equipment: 'Monitor Continuo de Atenuación Beta Met One BAM-1020 (Acreditado INACAL)',
    sourceType: 'SENAMHI',
    sourceName: 'SENAMHI - Red Metropolitana de Monitoreo Automático',
    meteorology: {
      windSpeed: 1.8,
      windDirectionDeg: 210,
      windDirectionCardinal: 'SO',
      temperature: 21.5,
      humidity: 82,
      solarRadiation: 480,
      atmosphericPressure: 1012,
      thermalInversionRisk: 'ALTO'
    },
    zoneType: 'Residencial',
    notes: 'Topografía de cuenca ciega con estancamiento matutino de micropartículas diésel.',
    isUserAdded: false
  },
  {
    id: 'air-carabayllo-01',
    title: 'Estación Carabayllo - Lomas de Carabayllo',
    district: 'Carabayllo',
    address: 'Av. Túpac Amaru Km 22.5',
    coordinates: [-11.8986, -77.0347],
    utmZone: '18S 278780m E 8683700m N',
    date: '2026-08-23',
    time: '10:00',
    parameter: 'PM10',
    concentration: 138.5, // Supera ECA (100)
    unit: 'µg/m³',
    equipment: 'Muestreador Gravimétrico de Alto Volumen Hi-Vol & Sensor Óptico Calibrado',
    sourceType: 'SENAMHI',
    sourceName: 'SENAMHI - Estación Fija Climatológica y Calidad del Aire',
    meteorology: {
      windSpeed: 2.1,
      windDirectionDeg: 180,
      windDirectionCardinal: 'S',
      temperature: 23.2,
      humidity: 74,
      solarRadiation: 550,
      atmosphericPressure: 1011,
      thermalInversionRisk: 'MODERADO'
    },
    zoneType: 'Residencial',
    notes: 'Resuspensión eólica de polvo por canteras no reguladas y vías sin pavimentar.',
    isUserAdded: false
  },
  {
    id: 'air-ate-01',
    title: 'Estación Ate - Carretera Central Ceres',
    district: 'Ate Vitarte',
    address: 'Carretera Central Km 7.8 c/ Av. Prolongación Javier Prado',
    coordinates: [-12.0289, -76.9205],
    utmZone: '18S 291190m E 8669350m N',
    date: '2026-08-23',
    time: '10:00',
    parameter: 'NO2',
    concentration: 145.2, // Cumple (200) pero elevado
    unit: 'µg/m³',
    equipment: 'Analizador por Quimioluminiscencia Thermo Scientific 42i',
    sourceType: 'OEFA',
    sourceName: 'OEFA - Red de Vigilancia y Fiscalización de Aire en Lima Este',
    meteorology: {
      windSpeed: 2.5,
      windDirectionDeg: 225,
      windDirectionCardinal: 'SO',
      temperature: 22.0,
      humidity: 76,
      solarRadiation: 510,
      atmosphericPressure: 1013,
      thermalInversionRisk: 'MODERADO'
    },
    zoneType: 'Industrial',
    notes: 'Emisiones mixtas de transporte de carga pesada interprovincial y fundiciones fabriles.',
    isUserAdded: false
  },
  {
    id: 'air-callao-01',
    title: 'Estación Callao - Av. Néstor Gambetta',
    district: 'Callao',
    address: 'Av. Néstor Gambetta alt. Refinería La Pampilla / Terminal Marítimo',
    coordinates: [-12.0145, -77.1189],
    utmZone: '18S 269600m E 8670900m N',
    date: '2026-08-23',
    time: '10:00',
    parameter: 'SO2',
    concentration: 64.8, // En norma (250)
    unit: 'µg/m³',
    equipment: 'Analizador de Fluorescencia Ultravioleta Horiba APSA-370',
    sourceType: 'OEFA',
    sourceName: 'OEFA - Estación de Monitoreo Zona Industrial Ventanilla / Callao',
    meteorology: {
      windSpeed: 4.8,
      windDirectionDeg: 195,
      windDirectionCardinal: 'S',
      temperature: 19.8,
      humidity: 86,
      solarRadiation: 420,
      atmosphericPressure: 1014,
      thermalInversionRisk: 'BAJO'
    },
    zoneType: 'Industrial',
    notes: 'Monitoreo de azufre por tráfico de buques portacontenedores e industria química.',
    isUserAdded: false
  },
  {
    id: 'air-lima-centro-01',
    title: 'Estación Lima Centro - Av. Abancay c/ Cusco',
    district: 'Cercado de Lima',
    address: 'Av. Abancay Cdra 5 - Cañón Urbano',
    coordinates: [-12.0464, -77.0282],
    utmZone: '18S 279470m E 8667350m N',
    date: '2026-08-23',
    time: '10:00',
    parameter: 'CO',
    concentration: 4800, // 4.8 mg/m³ (Límite: 10,000 µg/m³)
    unit: 'µg/m³',
    equipment: 'Monitor Infrarrojo No Dispersivo (NDIR) Teledyne T300',
    sourceType: 'MUNICIPAL',
    sourceName: 'Municipalidad Metropolitana de Lima - Red de Monitoreo Ambiental',
    meteorology: {
      windSpeed: 1.4,
      windDirectionDeg: 270,
      windDirectionCardinal: 'O',
      temperature: 20.8,
      humidity: 79,
      solarRadiation: 390,
      atmosphericPressure: 1013,
      thermalInversionRisk: 'ALTO'
    },
    zoneType: 'Comercial',
    notes: 'Efecto túnel en cañón urbano por edificios altos con escasa dispersión lateral.',
    isUserAdded: false
  },
  {
    id: 'air-san-borja-01',
    title: 'Estación San Borja - Parque Pentagonito',
    district: 'San Borja',
    address: 'Av. Boulevard c/ Av. San Borja Norte',
    coordinates: [-12.0911, -76.9986],
    utmZone: '18S 282680m E 8662400m N',
    date: '2026-08-23',
    time: '10:00',
    parameter: 'PM2_5',
    concentration: 18.2, // Cumple excelente
    unit: 'µg/m³',
    equipment: 'Estación Automática SENAMHI con Acreditación Internacional',
    sourceType: 'SENAMHI',
    sourceName: 'SENAMHI - Estación de Referencia Urbana Fondo',
    meteorology: {
      windSpeed: 3.2,
      windDirectionDeg: 190,
      windDirectionCardinal: 'S',
      temperature: 21.0,
      humidity: 78,
      solarRadiation: 520,
      atmosphericPressure: 1013,
      thermalInversionRisk: 'BAJO'
    },
    zoneType: 'Residencial',
    notes: 'Fondo urbano con amplia arborización y retención de partículas por copas vegetales.',
    isUserAdded: false
  },
  {
    id: 'air-miraflores-01',
    title: 'Estación Miraflores - Malecón Cisneros',
    district: 'Miraflores',
    address: 'Malecón Cisneros / Parque del Amor',
    coordinates: [-12.1221, -77.0366],
    utmZone: '18S 278540m E 8658950m N',
    date: '2026-08-23',
    time: '10:00',
    parameter: 'O3',
    concentration: 28.5, // Cumple (100)
    unit: 'µg/m³',
    equipment: 'Fotómetro de Absorción Ultravioleta Thermo 49i',
    sourceType: 'SENAMHI',
    sourceName: 'SENAMHI - Estación Costera de Calidad del Aire',
    meteorology: {
      windSpeed: 4.6,
      windDirectionDeg: 220,
      windDirectionCardinal: 'SO',
      temperature: 19.4,
      humidity: 85,
      solarRadiation: 530,
      atmosphericPressure: 1014,
      thermalInversionRisk: 'BAJO'
    },
    zoneType: 'ProteccionEspecial',
    notes: 'Brisa marina constante del Suroeste favorece la ventilación continua.',
    isUserAdded: false
  },
  {
    id: 'air-vmt-01',
    title: 'Estación VMT - Lomas de Villa María',
    district: 'Villa María del Triunfo',
    address: 'Av. Salvador Allende c/ Av. El Triunfo',
    coordinates: [-12.1611, -76.9383],
    utmZone: '18S 289240m E 8654710m N',
    date: '2026-08-23',
    time: '10:00',
    parameter: 'PM2_5',
    concentration: 54.8, // Supera ECA
    unit: 'µg/m³',
    equipment: 'Monitor Óptico Calibrado MetOne Aerocet 531S',
    sourceType: 'SENAMHI',
    sourceName: 'SENAMHI - Estación Microclimática y Calidad del Aire',
    meteorology: {
      windSpeed: 2.0,
      windDirectionDeg: 215,
      windDirectionCardinal: 'SO',
      temperature: 20.2,
      humidity: 90,
      solarRadiation: 380,
      atmosphericPressure: 1012,
      thermalInversionRisk: 'ALTO'
    },
    zoneType: 'Residencial',
    notes: 'Alta humedad relativa y niebla costera favorecen condensación de aerosol higroscópico.',
    isUserAdded: false
  },
  {
    id: 'air-puente-piedra-01',
    title: 'Estación Puente Piedra - Óvalo Zapallal',
    district: 'Puente Piedra',
    address: 'Panamericana Norte Km 32',
    coordinates: [-11.8667, -77.0783],
    utmZone: '18S 274000m E 8687250m N',
    date: '2026-08-23',
    time: '10:00',
    parameter: 'PM10',
    concentration: 142.0, // Supera ECA (100)
    unit: 'µg/m³',
    equipment: 'Muestreador Automático TEOM 1405',
    sourceType: 'SENAMHI',
    sourceName: 'SENAMHI - Red Norte de Vigilancia Atmosférica',
    meteorology: {
      windSpeed: 2.2,
      windDirectionDeg: 210,
      windDirectionCardinal: 'SO',
      temperature: 23.8,
      humidity: 72,
      solarRadiation: 580,
      atmosphericPressure: 1011,
      thermalInversionRisk: 'MODERADO'
    },
    zoneType: 'Comercial',
    notes: 'Congestión de camiones interprovinciales de carga pesada y comercio ambulatorio masivo.',
    isUserAdded: false
  },
  {
    id: 'air-santa-anita-01',
    title: 'Estación Santa Anita - Mercado Mayorista',
    district: 'Santa Anita',
    address: 'Av. Nicolás Ayllón c/ Av. La Cultura',
    coordinates: [-12.0436, -76.9631],
    utmZone: '18S 286560m E 8667680m N',
    date: '2026-08-23',
    time: '10:00',
    parameter: 'PM2_5',
    concentration: 51.5, // Ligeramente sobre ECA (50)
    unit: 'µg/m³',
    equipment: 'Monitor Óptico Beta-Atenuación MetOne 1020',
    sourceType: 'SENAMHI',
    sourceName: 'SENAMHI - Estación Este Metropolitana',
    meteorology: {
      windSpeed: 1.9,
      windDirectionDeg: 230,
      windDirectionCardinal: 'SO',
      temperature: 22.4,
      humidity: 77,
      solarRadiation: 490,
      atmosphericPressure: 1012,
      thermalInversionRisk: 'MODERADO'
    },
    zoneType: 'Comercial',
    notes: 'Actividad logística intensiva 24h con flotas de transporte frigorífico diésel.',
    isUserAdded: false
  }
];

/**
 * Generador de serie temporal horaria de 24 horas para un parámetro y estación
 */
export function generateHourlySeries(param: AirParameterKey, baseValue: number, ecaLimit: number): HourlyDataPoint[] {
  const hours = [
    '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  // Hourly curve multipliers reflecting Lima urban traffic rush hours and thermal inversion
  const hourlyCurveFactors = [
    0.65, 0.58, 0.52, 0.48, 0.55, 0.78, // Madrugada
    1.15, 1.35, 1.42, 1.25, 1.05, 0.95, // Pico Matutino (07:00 - 09:00)
    0.88, 0.82, 0.85, 0.92, 1.08, 1.28, // Tarde
    1.38, 1.32, 1.18, 1.02, 0.88, 0.74  // Pico Nocturno (18:00 - 20:00)
  ];

  return hours.map((hour, idx) => {
    const factor = hourlyCurveFactors[idx];
    const val = Math.round(baseValue * factor * 10) / 10;
    const isExceeded = val > ecaLimit;

    // Wind speed varies with sea breeze peaking at 14:00
    const windSpeed = Math.round((1.2 + Math.sin((idx / 24) * Math.PI) * 2.8) * 10) / 10;
    const temp = Math.round((18.0 + Math.sin(((idx - 6) / 24) * 2 * Math.PI) * 5.5) * 10) / 10;

    return {
      hour,
      value: val,
      incaIndex: Math.round((val / ecaLimit) * 100),
      windSpeed: Math.max(0.8, windSpeed),
      windDirection: idx >= 10 && idx <= 18 ? 'SO' : 'S',
      temperature: temp,
      isExceeded
    };
  });
}

/**
 * Generador de histórico semanal de 7 días
 */
export function generateWeeklySeries(param: AirParameterKey, baseValue: number, ecaLimit: number): DailyDataPoint[] {
  const days = [
    { date: '2026-08-17', dayName: 'Lun', factor: 1.12 },
    { date: '2026-08-18', dayName: 'Mar', factor: 1.08 },
    { date: '2026-08-19', dayName: 'Mié', factor: 1.15 },
    { date: '2026-08-20', dayName: 'Jue', factor: 1.05 },
    { date: '2026-08-21', dayName: 'Vie', factor: 1.22 }, // Viernes punta
    { date: '2026-08-22', dayName: 'Sáb', factor: 0.92 },
    { date: '2026-08-23', dayName: 'Dom (Hoy)', factor: 0.78 } // Domingo baja tráfico
  ];

  return days.map(d => {
    const avg = Math.round(baseValue * d.factor * 10) / 10;
    const max = Math.round(avg * 1.4 * 10) / 10;
    const min = Math.round(avg * 0.55 * 10) / 10;
    const exceedances = avg > ecaLimit ? 8 : (max > ecaLimit ? 3 : 0);

    let incaCategory: DailyDataPoint['incaCategory'] = 'BUENO';
    if (avg > ecaLimit * 1.5) incaCategory = 'CUIDADO';
    else if (avg > ecaLimit) incaCategory = 'MALO';
    else if (avg > ecaLimit * 0.5) incaCategory = 'MODERADO';

    return {
      date: d.date,
      dayName: d.dayName,
      avgValue: avg,
      maxValue: max,
      minValue: min,
      exceedanceCount: exceedances,
      incaCategory
    };
  });
}
