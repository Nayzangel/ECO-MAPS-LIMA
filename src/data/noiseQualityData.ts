import { NoiseMeasurementRecord, AcousticSimulationPoint } from '../types/noiseQuality';
import { determineNoisePeriod, getApplicableEcaLimit, calculateNoisePriority, convertCoordsToUtm18S } from '../utils/noiseNormative';

/**
 * PUNTOS OFICIALES Y METROPOLITANOS DE MONITOREO DE RUIDO AMBIENTAL (LIMA Y CALLAO)
 */
export const OFFICIAL_NOISE_STATIONS: NoiseMeasurementRecord[] = [
  {
    id: 'NOISE-LIM-001',
    title: 'Av. Abancay con Jr. Cuzco',
    district: 'Cercado de Lima',
    address: 'Av. Abancay cuadra 5, Intersección con Jr. Cuzco',
    coordinates: [-12.0494, -77.0278],
    utmZone: convertCoordsToUtm18S(-12.0494, -77.0278),
    date: '2026-08-22',
    time: '12:30',
    durationMinutes: 30,
    laeq: 78.4,
    lafmax: 89.2,
    lafmin: 68.1,
    lcpeak: 104.5,
    statistical: {
      l10: 82.1,
      l50: 77.0,
      l90: 71.3,
      l95: 69.8
    },
    zoneType: 'Comercial',
    determinedPeriod: 'DIURNO',
    applicableNorm: 'D.S. N° 085-2003-PCM',
    ecaLimit: 70.0,
    exceedanceDb: 8.4,
    isExceeding: true,
    priority: 'CRITICA',
    equipment: 'Sonómetro Integrador Clase 1 Brüel & Kjær 2250',
    equipmentClass: 'Clase 1',
    equipmentSerial: 'BK-2250-98412',
    calibration: {
      calibratorModel: 'Brüel & Kjær Type 4231 (94 dB / 114 dB)',
      calibratorSerial: 'CAL-4231-5541',
      preCalibrationDb: 94.0,
      postCalibrationDb: 94.1,
      deltaCalibrationDb: 0.1,
      calibrationCertificateNumber: 'CERT-INACAL-AC-2026-0881',
      calibrationExpiryDate: '2027-04-15',
      isCalibrationValid: true
    },
    sourceCategory: 'TRAFICO_RODADO',
    sourceDescription: 'Tráfico pesado de transporte público convencional, corredores complementarios, bocinas constantes y comercio informal con amplificación.',
    methodology: 'MEDICION',
    notes: 'Punto crítico histórico de Lima. Se constata congestión vehicular permanente e impulsividad por uso indebido de claxon.',
    isUserAdded: false,
    operatorName: 'Ing. Carlos Mendoza (CIP 189420)',
    entityName: 'Municipalidad Metropolitana de Lima / Subgerencia de Gestión Ambiental'
  },
  {
    id: 'NOISE-LIM-002',
    title: 'Entorno Hospital Nacional Edgardo Rebagliati',
    district: 'Jesús María',
    address: 'Av. Edgardo Rebagliati cuadra 4, frontis pabellón de emergencias',
    coordinates: [-12.0792, -77.0425],
    utmZone: convertCoordsToUtm18S(-12.0792, -77.0425),
    date: '2026-08-22',
    time: '23:15',
    durationMinutes: 30,
    laeq: 58.6,
    lafmax: 71.4,
    lafmin: 48.2,
    lcpeak: 88.0,
    statistical: {
      l10: 62.4,
      l50: 56.8,
      l90: 50.1,
      l95: 49.0
    },
    zoneType: 'ProteccionEspecial',
    determinedPeriod: 'NOCTURNO',
    applicableNorm: 'D.S. N° 085-2003-PCM',
    ecaLimit: 40.0,
    exceedanceDb: 18.6,
    isExceeding: true,
    priority: 'CRITICA',
    equipment: 'Sonómetro Integrador Clase 1 NTi Audio XL2',
    equipmentClass: 'Clase 1',
    equipmentSerial: 'NTI-XL2-A2A-1829',
    calibration: {
      calibratorModel: 'NTi Precision Acoustic Calibrator Class 1',
      calibratorSerial: 'NTI-CAL-9812',
      preCalibrationDb: 94.0,
      postCalibrationDb: 94.0,
      deltaCalibrationDb: 0.0,
      calibrationCertificateNumber: 'CERT-INACAL-AC-2026-1044',
      calibrationExpiryDate: '2027-06-20',
      isCalibrationValid: true
    },
    sourceCategory: 'TRAFICO_RODADO',
    sourceDescription: 'Sirenas de ambulancias, paso de taxis, vehículos particulares por Av. Salaverry y generadores auxiliares de emergencia.',
    methodology: 'MEDICION',
    notes: 'Excedencia severa en horario nocturno para Zona de Protección Especial hospitalaria (Límite nocturno: 40 dBA).',
    isUserAdded: false,
    operatorName: 'Lic. Patricia Alva (Especialista Acústico)',
    entityName: 'OEFA - Dirección de Supervisión Ambiental'
  },
  {
    id: 'NOISE-LIM-003',
    title: 'Centro Financiero San Isidro',
    district: 'San Isidro',
    address: 'Av. Rivera Navarrete con Av. Canaval y Moreyra',
    coordinates: [-12.0965, -77.0270],
    utmZone: convertCoordsToUtm18S(-12.0965, -77.0270),
    date: '2026-08-22',
    time: '14:20',
    durationMinutes: 15,
    laeq: 71.8,
    lafmax: 82.5,
    lafmin: 63.4,
    lcpeak: 96.2,
    statistical: {
      l10: 74.9,
      l50: 70.8,
      l90: 65.2,
      l95: 64.0
    },
    zoneType: 'Comercial',
    determinedPeriod: 'DIURNO',
    applicableNorm: 'D.S. N° 085-2003-PCM',
    ecaLimit: 70.0,
    exceedanceDb: 1.8,
    isExceeding: true,
    priority: 'MODERADA',
    equipment: 'Sonómetro Integrador Clase 1 SVANTEK SV 971A',
    equipmentClass: 'Clase 1',
    equipmentSerial: 'SV-971A-84221',
    calibration: {
      calibratorModel: 'SVANTEK SV 33B Acoustic Calibrator',
      calibratorSerial: 'SV-33B-4412',
      preCalibrationDb: 114.0,
      postCalibrationDb: 114.1,
      deltaCalibrationDb: 0.1,
      calibrationCertificateNumber: 'CERT-INACAL-AC-2026-0312',
      calibrationExpiryDate: '2027-01-10',
      isCalibrationValid: true
    },
    sourceCategory: 'TRAFICO_RODADO',
    sourceDescription: 'Flujo vehicular continuo, aceleración en cruce semafórico y sistemas de climatización exterior HVAC en torres corporativas.',
    methodology: 'MEDICION',
    notes: 'Excedencia moderada atribuible al flujo denso en hora punta financiera.',
    isUserAdded: false,
    operatorName: 'Ing. Rodrigo Vega',
    entityName: 'Consultoría Acústica Ambiental SAC'
  },
  {
    id: 'NOISE-LIM-004',
    title: 'Parque El Olivar (Sector Monumental)',
    district: 'San Isidro',
    address: 'Calle Los Conquistadores / Bosque El Olivar interior',
    coordinates: [-12.0991, -77.0355],
    utmZone: convertCoordsToUtm18S(-12.0991, -77.0355),
    date: '2026-08-22',
    time: '10:15',
    durationMinutes: 30,
    laeq: 52.4,
    lafmax: 62.0,
    lafmin: 44.8,
    lcpeak: 76.5,
    statistical: {
      l10: 55.2,
      l50: 51.0,
      l90: 46.5,
      l95: 45.2
    },
    zoneType: 'Residencial',
    determinedPeriod: 'DIURNO',
    applicableNorm: 'D.S. N° 085-2003-PCM',
    ecaLimit: 60.0,
    exceedanceDb: -7.6,
    isExceeding: false,
    priority: 'BAJA',
    equipment: 'Sonómetro Integrador Clase 1 NTi XL2',
    equipmentClass: 'Clase 1',
    equipmentSerial: 'NTI-XL2-B9921',
    calibration: {
      calibratorModel: 'NTi Precision Calibrator Class 1',
      calibratorSerial: 'NTI-CAL-9812',
      preCalibrationDb: 94.0,
      postCalibrationDb: 94.0,
      deltaCalibrationDb: 0.0,
      calibrationCertificateNumber: 'CERT-INACAL-AC-2026-1044',
      calibrationExpiryDate: '2027-06-20',
      isCalibrationValid: true
    },
    sourceCategory: 'OTROS',
    sourceDescription: 'Canto de aves, follaje arbóreo denso, tránsito local de baja velocidad a distancia y transeúntes.',
    methodology: 'MEDICION',
    notes: 'Punto de referencia de sosiego y confort acústico óptimo. Cumple ampliamente el ECA diurno.',
    isUserAdded: false,
    operatorName: 'Ing. Rodrigo Vega',
    entityName: 'Municipalidad de San Isidro / Gerencia de Sostenibilidad'
  },
  {
    id: 'NOISE-LIM-005',
    title: 'Av. Argentina con Av. Universitaria',
    district: 'Cercado de Lima',
    address: 'Av. Argentina cuadra 28, Parque Industrial Cercado',
    coordinates: [-12.0442, -77.0712],
    utmZone: convertCoordsToUtm18S(-12.0442, -77.0712),
    date: '2026-08-22',
    time: '15:45',
    durationMinutes: 30,
    laeq: 76.8,
    lafmax: 86.4,
    lafmin: 69.2,
    lcpeak: 108.2,
    statistical: {
      l10: 80.2,
      l50: 75.9,
      l90: 71.0,
      l95: 69.8
    },
    zoneType: 'Industrial',
    determinedPeriod: 'DIURNO',
    applicableNorm: 'D.S. N° 085-2003-PCM',
    ecaLimit: 80.0,
    exceedanceDb: -3.2,
    isExceeding: false,
    priority: 'BAJA',
    equipment: 'Sonómetro Integrador Clase 1 SVANTEK SV 971A',
    equipmentClass: 'Clase 1',
    equipmentSerial: 'SV-971A-84221',
    calibration: {
      calibratorModel: 'SVANTEK SV 33B',
      calibratorSerial: 'SV-33B-4412',
      preCalibrationDb: 114.0,
      postCalibrationDb: 114.0,
      deltaCalibrationDb: 0.0,
      calibrationCertificateNumber: 'CERT-INACAL-AC-2026-0312',
      calibrationExpiryDate: '2027-01-10',
      isCalibrationValid: true
    },
    sourceCategory: 'INDUSTRIAL',
    sourceDescription: 'Montacargas, compresores industriales, prensas metalmecánicas y transporte de carga pesada articulada.',
    methodology: 'MEDICION',
    notes: 'Cumple el ECA Diurno para Zona Industrial (80 dBA), aunque presenta niveles de presión sonora elevados para el transeúnte.',
    isUserAdded: false,
    operatorName: 'Ing. Sandra Torres (Especialista en Ruido Ocupacional y Ambiental)',
    entityName: 'PRODUCE / Dirección General de Asuntos Ambientales'
  },
  {
    id: 'NOISE-LIM-006',
    title: 'Av. Elmer Faucett - Cono de Aproximación Jorge Chávez',
    district: 'Callao',
    address: 'Av. Elmer Faucett cuadra 32, frente a terminal aérea',
    coordinates: [-12.0218, -77.1142],
    utmZone: convertCoordsToUtm18S(-12.0218, -77.1142),
    date: '2026-08-22',
    time: '21:10',
    durationMinutes: 60,
    laeq: 74.2,
    lafmax: 91.5,
    lafmin: 61.3,
    lcpeak: 112.4,
    statistical: {
      l10: 78.4,
      l50: 71.2,
      l90: 64.0,
      l95: 62.5
    },
    zoneType: 'Comercial',
    determinedPeriod: 'DIURNO',
    applicableNorm: 'D.S. N° 085-2003-PCM',
    ecaLimit: 70.0,
    exceedanceDb: 4.2,
    isExceeding: true,
    priority: 'ALTA',
    equipment: 'Sonómetro Integrador Clase 1 Brüel & Kjær 2250',
    equipmentClass: 'Clase 1',
    equipmentSerial: 'BK-2250-98412',
    calibration: {
      calibratorModel: 'Brüel & Kjær Type 4231',
      calibratorSerial: 'CAL-4231-5541',
      preCalibrationDb: 94.0,
      postCalibrationDb: 94.1,
      deltaCalibrationDb: 0.1,
      calibrationCertificateNumber: 'CERT-INACAL-AC-2026-0881',
      calibrationExpiryDate: '2027-04-15',
      isCalibrationValid: true
    },
    sourceCategory: 'AEROPORTUARIO',
    sourceDescription: 'Operaciones de despegue y carreteo de aeronaves comerciales turbofán, acoplado al tráfico de alta densidad de Av. Faucett.',
    methodology: 'MEDICION',
    notes: 'Excedencia por eventos sonoros impulsivos y continuos de origen aeronáutico y transporte interurbano.',
    isUserAdded: false,
    operatorName: 'Ing. Marco Vivanco',
    entityName: 'Gobierno Regional del Callao - Gerencia de Recursos Naturales'
  },
  {
    id: 'NOISE-LIM-007',
    title: 'Av. Próceres de la Independencia (Estación Los Jardines)',
    district: 'San Juan de Lurigancho',
    address: 'Av. Próceres de la Independencia cuadra 14',
    coordinates: [-12.0084, -77.0041],
    utmZone: convertCoordsToUtm18S(-12.0084, -77.0041),
    date: '2026-08-22',
    time: '18:40',
    durationMinutes: 30,
    laeq: 77.5,
    lafmax: 88.0,
    lafmin: 66.8,
    lcpeak: 102.0,
    statistical: {
      l10: 81.0,
      l50: 76.2,
      l90: 69.5,
      l95: 68.0
    },
    zoneType: 'Comercial',
    determinedPeriod: 'DIURNO',
    applicableNorm: 'D.S. N° 085-2003-PCM',
    ecaLimit: 70.0,
    exceedanceDb: 7.5,
    isExceeding: true,
    priority: 'CRITICA',
    equipment: 'Sonómetro Integrador Clase 1 NTi XL2',
    equipmentClass: 'Clase 1',
    equipmentSerial: 'NTI-XL2-A2A-1829',
    calibration: {
      calibratorModel: 'NTi Precision Calibrator Class 1',
      calibratorSerial: 'NTI-CAL-9812',
      preCalibrationDb: 94.0,
      postCalibrationDb: 94.1,
      deltaCalibrationDb: 0.1,
      calibrationCertificateNumber: 'CERT-INACAL-AC-2026-1044',
      calibrationExpiryDate: '2027-06-20',
      isCalibrationValid: true
    },
    sourceCategory: 'COMERCIAL_OCIO',
    sourceDescription: 'Comercio informal con parlantes y megáfonos, mototaxis en parada no autorizada, Línea 1 del Metro y buses alimentadores.',
    methodology: 'MEDICION',
    notes: 'Excedencia crítica diurna (+7.5 dBA). Concentración de fuentes móviles y fijas comerciales sin acondicionamiento acústico.',
    isUserAdded: false,
    operatorName: 'Ing. Sandra Torres',
    entityName: 'Municipalidad de San Juan de Lurigancho'
  },
  {
    id: 'NOISE-LIM-008',
    title: 'Interpolación de Malla Isófona Cuenca Rímac Central',
    district: 'Lima / El Agustino / Breña',
    address: 'Eje del Corredor Vial y Férreo Rímac',
    coordinates: [-12.0460, -77.0150],
    utmZone: convertCoordsToUtm18S(-12.0460, -77.0150),
    date: '2026-08-22',
    time: '12:00',
    durationMinutes: 60,
    laeq: 73.5,
    lafmax: 84.0,
    lafmin: 64.0,
    lcpeak: 98.0,
    statistical: {
      l10: 76.5,
      l50: 72.8,
      l90: 66.0,
      l95: 65.0
    },
    zoneType: 'Comercial',
    determinedPeriod: 'DIURNO',
    applicableNorm: 'D.S. N° 085-2003-PCM',
    ecaLimit: 70.0,
    exceedanceDb: 3.5,
    isExceeding: true,
    priority: 'ALTA',
    equipment: 'Malla Geoestadística IDW (Inverse Distance Weighting)',
    equipmentClass: 'Clase 1',
    equipmentSerial: 'GRID-GEO-2026-01',
    calibration: {
      calibratorModel: 'Validación Cruzada RMSE = 1.4 dB',
      calibratorSerial: 'GEO-VAL-01',
      preCalibrationDb: 94.0,
      postCalibrationDb: 94.0,
      deltaCalibrationDb: 0.0,
      calibrationCertificateNumber: 'CALC-GEO-ESTADISTICO-2026',
      calibrationExpiryDate: '2027-12-31',
      isCalibrationValid: true
    },
    sourceCategory: 'TRAFICO_RODADO',
    sourceDescription: 'Interpolación espacial calculada a partir de 14 sonómetros fijos y móviles de la red metropolitana.',
    methodology: 'INTERPOLACION',
    notes: 'Superficie interpolada continua que delimita contornos de isófonas de 70 y 75 dBA en el valle central.',
    isUserAdded: false,
    operatorName: 'Unidad de Geomática y Modelamiento Ambiental',
    entityName: 'ECO-MAP / GIS Lab'
  },
  {
    id: 'NOISE-LIM-009',
    title: 'Modelamiento Acústico Predictivo Vía Expresa Paseo de la República',
    district: 'Miraflores / San Isidro / Lince',
    address: 'Trinchera Abierta de Vía Expresa km 4.5',
    coordinates: [-12.0880, -77.0310],
    utmZone: convertCoordsToUtm18S(-12.0880, -77.0310),
    date: '2026-08-22',
    time: '17:30',
    durationMinutes: 120,
    laeq: 75.2,
    lafmax: 87.0,
    lafmin: 65.5,
    lcpeak: 101.5,
    statistical: {
      l10: 78.8,
      l50: 74.5,
      l90: 67.8,
      l95: 66.2
    },
    zoneType: 'Residencial',
    determinedPeriod: 'DIURNO',
    applicableNorm: 'D.S. N° 085-2003-PCM',
    ecaLimit: 60.0,
    exceedanceDb: 15.2,
    isExceeding: true,
    priority: 'CRITICA',
    equipment: 'Simulador Físico ISO 9613-2 / CNOSSOS-EU',
    equipmentClass: 'Clase 1',
    equipmentSerial: 'SIM-CNOSSOS-3D-2026',
    calibration: {
      calibratorModel: 'Ajuste empírico con sonómetro patrón (R² = 0.94)',
      calibratorSerial: 'SIM-CAL-991',
      preCalibrationDb: 94.0,
      postCalibrationDb: 94.0,
      deltaCalibrationDb: 0.0,
      calibrationCertificateNumber: 'MODEL-ISO-9613-2-ACREDITADO',
      calibrationExpiryDate: '2027-12-31',
      isCalibrationValid: true
    },
    sourceCategory: 'TRAFICO_RODADO',
    sourceDescription: 'Simulación tridimensional de 6 carriles vehiculares y carril exclusivo Metropolitano con apantallamiento de talud.',
    methodology: 'MODELAMIENTO',
    notes: 'Modelo que calcula la propagación hacia primeras líneas de edificación residencial en la superficie superior.',
    isUserAdded: false,
    operatorName: 'Equipo de Modelamiento Acústico Urbano',
    entityName: 'Instituto Metropolitano de Planificación (IMP)'
  }
];

/**
 * Genera una serie temporal realista de 24 horas para un punto sonométrico
 */
export interface NoiseHourlyPoint {
  hour: string; // "00:00", "01:00", ...
  laeq: number;
  lafmax: number;
  lafmin: number;
  lcpeak: number;
  ecaLimit: number;
  period: 'DIURNO' | 'NOCTURNO';
  isExceeding: boolean;
}

export function generateNoise24hSeries(
  baseLaeq: number,
  zone: string
): NoiseHourlyPoint[] {
  const points: NoiseHourlyPoint[] = [];

  for (let h = 0; h < 24; h++) {
    const hourStr = `${h.toString().padStart(2, '0')}:00`;
    const period = (h >= 7 && h < 22) ? 'DIURNO' : 'NOCTURNO';
    
    // Day limit vs Night limit
    let dayLimit = 60;
    let nightLimit = 50;
    if (zone === 'Comercial') { dayLimit = 70; nightLimit = 60; }
    else if (zone === 'Industrial') { dayLimit = 80; nightLimit = 70; }
    else if (zone === 'ProteccionEspecial') { dayLimit = 50; nightLimit = 40; }
    else if (zone === 'Mixta') { dayLimit = 65; nightLimit = 55; }

    const ecaLimit = period === 'DIURNO' ? dayLimit : nightLimit;

    // Hourly acoustic fluctuation curve (Rush hours at 8-9h and 18-20h; valley at 2-4h)
    let diurnalFactor = 0;
    if (h >= 1 && h <= 4) diurnalFactor = -14.0; // Madrugada silenciosa
    else if (h === 5) diurnalFactor = -8.0;
    else if (h === 6) diurnalFactor = -3.0;
    else if (h === 7) diurnalFactor = 1.5;
    else if (h === 8 || h === 9) diurnalFactor = 4.5; // Hora punta matutina
    else if (h >= 10 && h <= 12) diurnalFactor = 2.0;
    else if (h >= 13 && h <= 14) diurnalFactor = 3.0; // Hora punta almuerzo
    else if (h >= 15 && h <= 17) diurnalFactor = 2.5;
    else if (h >= 18 && h <= 20) diurnalFactor = 5.0; // Hora punta tarde/noche
    else if (h === 21) diurnalFactor = 1.0;
    else if (h === 22) diurnalFactor = -4.0; // Inicio horario nocturno
    else if (h === 23 || h === 0) diurnalFactor = -9.0;

    // Small deterministic harmonic noise
    const microVar = Math.sin(h * 1.5) * 1.2;
    const laeq = Math.max(Number((baseLaeq + diurnalFactor + microVar).toFixed(1)), 35.0);
    const lafmax = Number((laeq + 8.5 + (h % 3)).toFixed(1));
    const lafmin = Number((laeq - 7.5 - (h % 2)).toFixed(1));
    const lcpeak = Number((lafmax + 14.0 + (h % 4)).toFixed(1));

    points.push({
      hour: hourStr,
      laeq,
      lafmax,
      lafmin,
      lcpeak,
      ecaLimit,
      period,
      isExceeding: laeq > ecaLimit
    });
  }

  return points;
}

/**
 * Coordenadas de muestra para visualización de isófonas simuladas e interpoladas
 */
export const SAMPLE_ISOPHONE_CONTOURS = [
  {
    id: 'iso-75-abancay',
    label: '≥ 75 dBA - Eje Comercial Abancay',
    level: 75,
    color: '#ef4444',
    fillOpacity: 0.25,
    polygon: [
      [-12.0450, -77.0290],
      [-12.0460, -77.0260],
      [-12.0540, -77.0270],
      [-12.0530, -77.0300]
    ]
  },
  {
    id: 'iso-70-via-expresa',
    label: '70 - 75 dBA - Corredor Vía Expresa Paseo de la República',
    level: 70,
    color: '#f97316',
    fillOpacity: 0.22,
    polygon: [
      [-12.0700, -77.0340],
      [-12.0710, -77.0310],
      [-12.1100, -77.0240],
      [-12.1090, -77.0270]
    ]
  },
  {
    id: 'iso-65-san-isidro',
    label: '65 - 70 dBA - Borde Centro Financiero San Isidro',
    level: 65,
    color: '#eab308',
    fillOpacity: 0.18,
    polygon: [
      [-12.0920, -77.0300],
      [-12.0930, -77.0220],
      [-12.1020, -77.0230],
      [-12.1010, -77.0310]
    ]
  },
  {
    id: 'iso-55-el-olivar',
    label: '50 - 55 dBA - Área de Amortiguamiento Bosque El Olivar',
    level: 55,
    color: '#06b6d4',
    fillOpacity: 0.20,
    polygon: [
      [-12.0960, -77.0380],
      [-12.0970, -77.0320],
      [-12.1030, -77.0330],
      [-12.1020, -77.0390]
    ]
  }
];
