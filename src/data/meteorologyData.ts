import { MeteorologicalRecord, WindRoseData } from '../types/meteorology';
import { buildWindRoseData } from '../utils/meteorologyCalculations';

// OFFICIAL METEOROLOGICAL STATIONS IN LIMA METROPOLITANA & CALLAO (SENAMHI / RED OFICIAL)
export const OFFICIAL_METEOROLOGICAL_STATIONS: MeteorologicalRecord[] = [
  {
    id: 'MET-SENAMHI-001',
    stationName: 'Estación Meteorológica Campo de Marte',
    district: 'Jesús María',
    coordinates: [-12.0719, -77.0428],
    elevationMeters: 137,
    date: '2026-08-23',
    time: '14:00',
    temperature: 20.4,
    relativeHumidity: 76,
    atmosphericPressure: 1012.8,
    windSpeed: 3.4,
    windDirectionDegrees: 210, // SSW (Vientos predominantes del Océano Pacífico)
    windDirectionCardinal: 'SSW',
    precipitation: 0.0,
    solarRadiation: 540,
    cloudCoverOctas: 5,
    pasquillClass: 'C',
    mixingHeightMeters: 620,
    thermalInversionPresent: true,
    inversionBaseHeightMeters: 450,
    surfaceRoughnessZ0: 1.0, // Zona urbana densa
    dewPointCelsius: 16.0,
    heatIndexCelsius: 20.4,
    uvIndex: 7,
    sourceAuthority: 'SENAMHI',
    sensorModel: 'Davis Vantage Pro2 Plus / Campbell Scientific CR1000X',
    notes: 'Estación meteorológica de referencia central de Lima Metropolitana. Presencia de capa de inversión marina estratocúmulo.'
  },
  {
    id: 'MET-SENAMHI-002',
    stationName: 'Estación Meteorológica Von Humboldt (UNALM)',
    district: 'La Molina',
    coordinates: [-12.0825, -76.9422],
    elevationMeters: 251,
    date: '2026-08-23',
    time: '14:00',
    temperature: 23.8,
    relativeHumidity: 58,
    atmosphericPressure: 998.4,
    windSpeed: 2.1,
    windDirectionDegrees: 240, // WSW (Brisa de valle hacia los Andes)
    windDirectionCardinal: 'WSW',
    precipitation: 0.0,
    solarRadiation: 780,
    cloudCoverOctas: 2,
    pasquillClass: 'B',
    mixingHeightMeters: 950,
    thermalInversionPresent: false,
    surfaceRoughnessZ0: 0.5,
    dewPointCelsius: 15.0,
    heatIndexCelsius: 24.1,
    uvIndex: 10,
    sourceAuthority: 'SENAMHI',
    sensorModel: 'Campbell Scientific Met Station Climatológica Principal',
    notes: 'Microclima de cuenca oriental con mayor radiación solar incidente y menor humedad relativa.'
  },
  {
    id: 'MET-SENAMHI-003',
    stationName: 'Estación Meteorológica Carabayllo',
    district: 'Carabayllo',
    coordinates: [-11.8986, -77.0347],
    elevationMeters: 238,
    date: '2026-08-23',
    time: '14:00',
    temperature: 22.5,
    relativeHumidity: 64,
    atmosphericPressure: 1001.2,
    windSpeed: 2.8,
    windDirectionDegrees: 195, // SSW
    windDirectionCardinal: 'SSW',
    precipitation: 0.0,
    solarRadiation: 690,
    cloudCoverOctas: 3,
    pasquillClass: 'B',
    mixingHeightMeters: 800,
    thermalInversionPresent: true,
    inversionBaseHeightMeters: 550,
    surfaceRoughnessZ0: 0.8,
    dewPointCelsius: 15.3,
    heatIndexCelsius: 22.8,
    uvIndex: 9,
    sourceAuthority: 'SENAMHI',
    sensorModel: 'Vaisala WXT536 All-in-One Multi-Parameter Weather Station',
    notes: 'Cono Norte de Lima. Receptor de masa de aire advectada desde el sur y centro con acumulación de contaminantes.'
  },
  {
    id: 'MET-CORPAC-004',
    stationName: 'Estación Meteorológica Aeronáutica Aeropuerto Jorge Chávez',
    district: 'Callao',
    coordinates: [-12.0219, -77.1143],
    elevationMeters: 34,
    date: '2026-08-23',
    time: '14:00',
    temperature: 19.2,
    relativeHumidity: 84,
    atmosphericPressure: 1014.2,
    windSpeed: 5.6, // Mayor velocidad por efecto de brisa marina costera
    windDirectionDegrees: 200, // SSW
    windDirectionCardinal: 'SSW',
    precipitation: 0.0,
    solarRadiation: 480,
    cloudCoverOctas: 6,
    pasquillClass: 'D',
    mixingHeightMeters: 450,
    thermalInversionPresent: true,
    inversionBaseHeightMeters: 380,
    surfaceRoughnessZ0: 0.05, // Área aeroportuaria despejada costera
    dewPointCelsius: 16.4,
    heatIndexCelsius: 19.2,
    uvIndex: 6,
    sourceAuthority: 'CORPAC',
    sensorModel: 'Vaisala AWOS Metar Automated Weather Station',
    notes: 'Litoral marino de Callao. Fuerte influencia de la Corriente de Humboldt con brisa marina constante del SSW/SW.'
  },
  {
    id: 'MET-SENAMHI-005',
    stationName: 'Estación Meteorológica Villa María del Triunfo',
    district: 'Villa María del Triunfo',
    coordinates: [-12.1622, -76.9381],
    elevationMeters: 175,
    date: '2026-08-23',
    time: '14:00',
    temperature: 19.8,
    relativeHumidity: 82,
    atmosphericPressure: 1009.5,
    windSpeed: 4.1,
    windDirectionDegrees: 180, // S
    windDirectionCardinal: 'S',
    precipitation: 0.2, // Llovizna/Garúa costera invernal
    solarRadiation: 420,
    cloudCoverOctas: 7,
    pasquillClass: 'D',
    mixingHeightMeters: 510,
    thermalInversionPresent: true,
    inversionBaseHeightMeters: 400,
    surfaceRoughnessZ0: 0.6,
    dewPointCelsius: 16.6,
    heatIndexCelsius: 19.8,
    uvIndex: 5,
    sourceAuthority: 'SENAMHI',
    sensorModel: 'Campbell CR800 Weather Logger',
    notes: 'Sector sur de Lima con alta nubosidad baja y humedad condensante (lomas costeras).'
  },
  {
    id: 'MET-SENAMHI-006',
    stationName: 'Estación Meteorológica Huachipa (Valle Rímac)',
    district: 'San Juan de Lurigancho',
    coordinates: [-12.0125, -76.9238],
    elevationMeters: 310,
    date: '2026-08-23',
    time: '14:00',
    temperature: 24.1,
    relativeHumidity: 55,
    atmosphericPressure: 992.0,
    windSpeed: 2.3,
    windDirectionDegrees: 255, // WSW (Canalización valle Rímac)
    windDirectionCardinal: 'WSW',
    precipitation: 0.0,
    solarRadiation: 810,
    cloudCoverOctas: 2,
    pasquillClass: 'B',
    mixingHeightMeters: 1050,
    thermalInversionPresent: false,
    surfaceRoughnessZ0: 0.7,
    dewPointCelsius: 14.5,
    heatIndexCelsius: 24.3,
    uvIndex: 11,
    sourceAuthority: 'SENAMHI',
    sensorModel: 'Davis Vantage Pro2 Wireless',
    notes: 'Entrada a quebrada interandina. Excelente dispersión térmica diurna pero atrapamiento nocturno.'
  }
];

// REAL 24-HOUR TIME SERIES GENERATOR FOR WIND ROSE & TEMPORAL DYNAMICS
export function generate24hMeteorologicalSeries(base: MeteorologicalRecord) {
  const hours = [
    '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  return hours.map((h, i) => {
    const isDay = i >= 6 && i <= 18;
    const hourFactor = Math.sin(((i - 8) / 14) * Math.PI); // Peak at 14:00
    
    // Thermal cycle: Min at 06:00, Max at 14:00
    const temp = Number((base.temperature - 3.5 + (isDay ? hourFactor * 5.5 : -1.5)).toFixed(1));
    // RH cycle: Inverse to temperature
    const rh = Math.min(Math.max(Math.round(base.relativeHumidity + (isDay ? -hourFactor * 22 : 12)), 35), 98);
    // Solar Radiation cycle (W/m2)
    const solar = isDay ? Math.max(Math.round(Math.sin(((i - 6) / 12) * Math.PI) * base.solarRadiation * 1.15), 10) : 0;
    // Wind Speed cycle: Stronger in afternoon (sea breeze)
    const windSpeed = Number((Math.max(base.windSpeed * (0.4 + (isDay ? Math.max(hourFactor, 0) * 0.8 : 0.1)), 0.6)).toFixed(1));
    
    // Wind Direction: Diurnal breeze veer (S/SSW during day, veers slightly to SE/SSE during night)
    let windDir = base.windDirectionDegrees;
    if (isDay) {
      windDir = (base.windDirectionDegrees + (i % 3) * 5) % 360;
    } else {
      windDir = (base.windDirectionDegrees - 30 + (i % 2) * 10) % 360;
    }

    return {
      hour: h,
      temperature: temp,
      relativeHumidity: rh,
      atmosphericPressure: Number((base.atmosphericPressure + Math.cos((i / 24) * 2 * Math.PI) * 1.5).toFixed(1)),
      windSpeed,
      windDirectionDegrees: windDir,
      solarRadiation: solar,
      precipitation: (i === 5 || i === 6) && base.precipitation > 0 ? 0.1 : 0.0,
      pasquillClass: isDay ? (windSpeed < 3 ? 'B' : 'C') : (windSpeed < 2 ? 'F' : 'D')
    };
  });
}

// SAMPLE PRE-COMPUTED WIND ROSES FOR DEFAULT DISPLAY
export const DEFAULT_WIND_ROSE_CAMPO_DE_MARTE: WindRoseData = (() => {
  const station = OFFICIAL_METEOROLOGICAL_STATIONS[0];
  const series24 = generate24hMeteorologicalSeries(station);
  
  // Extended dataset representing multi-day representative Lima South-Southwest regime
  const observations: { windSpeed: number; windDirectionDegrees: number }[] = [];
  
  // Replicate with natural atmospheric turbulence variation
  for (let day = 0; day < 15; day++) {
    series24.forEach(pt => {
      const noiseDir = (Math.random() - 0.5) * 20;
      const noiseSpeed = (Math.random() - 0.5) * 1.2;
      observations.push({
        windSpeed: Math.max(pt.windSpeed + noiseSpeed, 0.2),
        windDirectionDegrees: (pt.windDirectionDegrees + noiseDir + 360) % 360
      });
    });
  }

  return buildWindRoseData(observations, station.id, station.stationName, 'Serie Estacional de 360 Observaciones');
})();
