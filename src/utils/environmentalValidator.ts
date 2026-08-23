import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { 
  EnvironmentalRecord, 
  EnvironmentalParameter, 
  ParameterUnit, 
  DataOrigin, 
  EquipmentGrade, 
  ValidationIssue, 
  ValidationStatus, 
  ReliabilityBreakdown, 
  ReliabilityTier,
  IngestionPreviewResult 
} from '../types/environmentalData';
import { latLngToUTM18S } from './gisUtils';

// Standard expected units for each parameter
export const PARAMETER_STANDARD_UNITS: Record<EnvironmentalParameter, ParameterUnit[]> = {
  'PM2.5': ['µg/m³', 'mg/m³'],
  'PM10': ['µg/m³', 'mg/m³'],
  'Ruido Diurno': ['dBA'],
  'Ruido Nocturno': ['dBA'],
  'SO2': ['µg/m³', 'ppb', 'ppm'],
  'NO2': ['µg/m³', 'ppb', 'ppm'],
  'CO': ['mg/m³', 'ppm', 'µg/m³'],
  'O3': ['µg/m³', 'ppb'],
  'Temperatura': ['°C'],
  'Humedad': ['%'],
  'Velocidad Viento': ['m/s']
};

// Regulatory limits (ECA D.S. 003-2017-MINAM & D.S. 085-2003-PCM)
export const PARAMETER_ECA_LIMITS: Record<EnvironmentalParameter, { limit: number; unit: ParameterUnit; standard: string }> = {
  'PM2.5': { limit: 50, unit: 'µg/m³', standard: 'D.S. 003-2017-MINAM (24h)' },
  'PM10': { limit: 100, unit: 'µg/m³', standard: 'D.S. 003-2017-MINAM (24h)' },
  'Ruido Diurno': { limit: 60, unit: 'dBA', standard: 'D.S. 085-2003-PCM (Residencial Diurno)' },
  'Ruido Nocturno': { limit: 50, unit: 'dBA', standard: 'D.S. 085-2003-PCM (Residencial Nocturno)' },
  'SO2': { limit: 250, unit: 'µg/m³', standard: 'D.S. 003-2017-MINAM (24h)' },
  'NO2': { limit: 200, unit: 'µg/m³', standard: 'D.S. 003-2017-MINAM (1h)' },
  'CO': { limit: 10, unit: 'mg/m³', standard: 'D.S. 003-2017-MINAM (8h)' },
  'O3': { limit: 100, unit: 'µg/m³', standard: 'D.S. 003-2017-MINAM (8h)' },
  'Temperatura': { limit: 35, unit: '°C', standard: 'Referencia Microclimática' },
  'Humedad': { limit: 95, unit: '%', standard: 'Referencia Microclimática' },
  'Velocidad Viento': { limit: 15, unit: 'm/s', standard: 'Referencia Meteorológica' }
};

// Physical plausibility limits for anomaly detection
export const PARAMETER_PHYSICAL_RANGES: Record<EnvironmentalParameter, { min: number; max: number; alertHigh: number }> = {
  'PM2.5': { min: 0, max: 700, alertHigh: 150 },
  'PM10': { min: 0, max: 1200, alertHigh: 300 },
  'Ruido Diurno': { min: 25, max: 135, alertHigh: 90 },
  'Ruido Nocturno': { min: 25, max: 125, alertHigh: 80 },
  'SO2': { min: 0, max: 800, alertHigh: 300 },
  'NO2': { min: 0, max: 600, alertHigh: 250 },
  'CO': { min: 0, max: 50, alertHigh: 15 },
  'O3': { min: 0, max: 400, alertHigh: 160 },
  'Temperatura': { min: 5, max: 45, alertHigh: 35 },
  'Humedad': { min: 5, max: 100, alertHigh: 98 },
  'Velocidad Viento': { min: 0, max: 40, alertHigh: 18 }
};

// Lima Metropolitan Bounds
export const LIMA_GEO_BOUNDS = {
  latMin: -12.75,
  latMax: -11.50,
  lngMin: -77.35,
  lngMax: -76.65
};

// Peru Bounds
export const PERU_GEO_BOUNDS = {
  latMin: -18.5,
  latMax: 0.5,
  lngMin: -81.5,
  lngMax: -68.5
};

/**
 * Normalizes parameter string to standard enum
 */
export function normalizeParameter(param: string): EnvironmentalParameter {
  const p = (param || '').trim().toLowerCase();
  if (p.includes('pm2.5') || p.includes('pm 2.5') || p.includes('pm25')) return 'PM2.5';
  if (p.includes('pm10') || p.includes('pm 10')) return 'PM10';
  if (p.includes('nocturno') && (p.includes('ruido') || p.includes('sonoro') || p.includes('dba'))) return 'Ruido Nocturno';
  if (p.includes('ruido') || p.includes('sonoro') || p.includes('dba') || p.includes('decibel')) return 'Ruido Diurno';
  if (p.includes('so2') || p.includes('azufre')) return 'SO2';
  if (p.includes('no2') || p.includes('nitrogeno') || p.includes('nitrógeno')) return 'NO2';
  if (p.includes('co') && !p.includes('co2')) return 'CO';
  if (p.includes('o3') || p.includes('ozono')) return 'O3';
  if (p.includes('temp')) return 'Temperatura';
  if (p.includes('humed')) return 'Humedad';
  if (p.includes('viento') || p.includes('wind')) return 'Velocidad Viento';
  return 'PM2.5';
}

/**
 * Normalizes parameter unit string
 */
export function normalizeUnit(unit: string, param: EnvironmentalParameter): ParameterUnit {
  const u = (unit || '').trim().toLowerCase();
  if (u.includes('ug') || u.includes('µg') || u.includes('microgram')) return 'µg/m³';
  if (u.includes('mg/m') || u.includes('mgm')) return 'mg/m³';
  if (u.includes('dba') || u.includes('db(a)') || u.includes('db')) return 'dBA';
  if (u.includes('ppm')) return 'ppm';
  if (u.includes('ppb')) return 'ppb';
  if (u.includes('°c') || u.includes('c') || u.includes('celsius')) return '°C';
  if (u.includes('%')) return '%';
  if (u.includes('m/s') || u.includes('ms')) return 'm/s';
  
  // Default to standard unit for the parameter
  return PARAMETER_STANDARD_UNITS[param][0];
}

/**
 * Comprehensive Record Validator and Reliability Calculation
 */
export function validateEnvironmentalRecord(
  rawRecord: Partial<EnvironmentalRecord>,
  existingRecords: EnvironmentalRecord[] = []
): {
  validatedRecord: EnvironmentalRecord;
  issues: ValidationIssue[];
  status: ValidationStatus;
  reliability: ReliabilityBreakdown;
} {
  const issues: ValidationIssue[] = [];
  const reasons: string[] = [];

  // Default values & fallbacks
  const parametro = rawRecord.parametro || normalizeParameter(String((rawRecord as any).parameter || 'PM2.5'));
  const valor = typeof rawRecord.valor === 'number' ? rawRecord.valor : parseFloat(String((rawRecord as any).value || 0));
  const unidad = rawRecord.unidad || normalizeUnit(String((rawRecord as any).unit || ''), parametro);
  const fecha = rawRecord.fecha || new Date().toISOString().split('T')[0];
  const hora = rawRecord.hora || '12:00';
  let lat = rawRecord.coordenadas?.[0] ?? (rawRecord as any).lat ?? (rawRecord as any).latitude ?? -12.0464;
  let lng = rawRecord.coordenadas?.[1] ?? (rawRecord as any).lng ?? (rawRecord as any).longitude ?? (rawRecord as any).lon ?? -77.0428;
  const distrito = rawRecord.distrito || (rawRecord as any).district || 'Lima Cercado';
  const equipo = rawRecord.equipo || (rawRecord as any).equipment || 'Sensor No Especificado';
  const tipoEquipo = rawRecord.tipoEquipo || (rawRecord as any).equipmentGrade || 'No especificado';
  const fuente = rawRecord.fuente || (rawRecord as any).source || 'Ingreso de Usuario';
  const origen = rawRecord.origen || 'USUARIO';
  const observaciones = rawRecord.observaciones || (rawRecord as any).notes || '';

  // 1. Check for Missing Data
  let completenessScore = 25;
  if (!rawRecord.fecha) {
    issues.push({
      type: 'MISSING_DATA',
      severity: 'WARNING',
      message: 'Fecha no especificada. Se asignó la fecha actual.',
      field: 'fecha'
    });
    completenessScore -= 5;
  }
  if (!rawRecord.hora) {
    issues.push({
      type: 'MISSING_DATA',
      severity: 'WARNING',
      message: 'Hora no especificada. Se asignó hora estimada.',
      field: 'hora'
    });
    completenessScore -= 3;
  }
  if (isNaN(valor) || valor === null || valor === undefined) {
    issues.push({
      type: 'MISSING_DATA',
      severity: 'ERROR',
      message: 'Valor de medición numérico ausente o inválido.',
      field: 'valor'
    });
    completenessScore -= 12;
  }
  if (!rawRecord.equipo || equipo === 'Sensor No Especificado') {
    issues.push({
      type: 'MISSING_DATA',
      severity: 'WARNING',
      message: 'Equipo de medición no detallado. Afecta trazabilidad metrológica.',
      field: 'equipo'
    });
    completenessScore -= 5;
  }

  // 2. Check Coordinates (Inverted coords, out of bounds, NaN)
  let coordinatesScore = 20;
  if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
    issues.push({
      type: 'COORDINATES_ERROR',
      severity: 'ERROR',
      message: 'Coordenadas geográficas nulas o inválidas.',
      field: 'coordenadas'
    });
    coordinatesScore = 0;
  } else {
    // Detect Inverted Latitude / Longitude (e.g. lat is -77 and lng is -12)
    if (lat < -60 && lng > -20 && lng < 0) {
      issues.push({
        type: 'COORDINATES_ERROR',
        severity: 'WARNING',
        message: 'Coordenadas invertidas detectadas (Latitud y Longitud cambiadas de orden). Corregido automáticamente.',
        field: 'coordenadas',
        suggestedFix: `Lat: ${lng}, Lng: ${lat}`
      });
      const temp = lat;
      lat = lng;
      lng = temp;
      coordinatesScore = 15;
      reasons.push('Coordenadas invertidas corregidas automáticamente');
    }

    // Check bounds in Lima Metropolitana
    const isInsideLima = 
      lat >= LIMA_GEO_BOUNDS.latMin && 
      lat <= LIMA_GEO_BOUNDS.latMax && 
      lng >= LIMA_GEO_BOUNDS.lngMin && 
      lng <= LIMA_GEO_BOUNDS.lngMax;

    const isInsidePeru = 
      lat >= PERU_GEO_BOUNDS.latMin && 
      lat <= PERU_GEO_BOUNDS.latMax && 
      lng >= PERU_GEO_BOUNDS.lngMin && 
      lng <= PERU_GEO_BOUNDS.lngMax;

    if (!isInsidePeru) {
      issues.push({
        type: 'COORDINATES_ERROR',
        severity: 'ERROR',
        message: `Coordenadas [${lat.toFixed(4)}, ${lng.toFixed(4)}] fuera del territorio peruano.`,
        field: 'coordenadas'
      });
      coordinatesScore = 0;
    } else if (!isInsideLima) {
      issues.push({
        type: 'COORDINATES_ERROR',
        severity: 'WARNING',
        message: `Coordenadas [${lat.toFixed(4)}, ${lng.toFixed(4)}] fuera de Lima Metropolitana y Callao.`,
        field: 'coordenadas'
      });
      coordinatesScore = 12;
    }
  }

  // 3. Check Units Matching
  const validUnits = PARAMETER_STANDARD_UNITS[parametro] || [];
  if (!validUnits.includes(unidad)) {
    issues.push({
      type: 'INVALID_UNIT',
      severity: 'WARNING',
      message: `Unidad '${unidad}' no convencional para el parámetro ${parametro}. Se recomienda ${validUnits[0]}.`,
      field: 'unidad',
      suggestedFix: validUnits[0]
    });
  }

  // 4. Check Anomalous Values & Outliers
  let plausibilityScore = 15;
  const physLimits = PARAMETER_PHYSICAL_RANGES[parametro];
  if (physLimits) {
    if (valor < physLimits.min) {
      issues.push({
        type: 'ANOMALOUS_VALUE',
        severity: 'ERROR',
        message: `Valor negativo imposible (${valor} ${unidad}) para ${parametro}.`,
        field: 'valor'
      });
      plausibilityScore = 0;
    } else if (valor > physLimits.max) {
      issues.push({
        type: 'ANOMALOUS_VALUE',
        severity: 'ERROR',
        message: `Valor extremo anómalo (${valor} ${unidad}) excede límites físicos plausibles (${physLimits.max} ${unidad}). Posible falla de sensor.`,
        field: 'valor'
      });
      plausibilityScore = 0;
    } else if (valor > physLimits.alertHigh) {
      issues.push({
        type: 'ANOMALOUS_VALUE',
        severity: 'WARNING',
        message: `Valor atípico elevado (${valor} ${unidad}). Muy por encima del promedio urbano habitual.`,
        field: 'valor'
      });
      plausibilityScore = 8;
    }
  }

  // 5. Check Duplicates against existing dataset
  let uniquenessScore = 5;
  const isDuplicate = existingRecords.some(r => {
    if (r.id === rawRecord.id) return false;
    const sameTime = r.fecha === fecha && (r.hora.slice(0, 5) === hora.slice(0, 5));
    const sameParam = r.parametro === parametro;
    const sameCoords = Math.abs(r.coordenadas[0] - lat) < 0.0005 && Math.abs(r.coordenadas[1] - lng) < 0.0005;
    return sameTime && sameParam && sameCoords;
  });

  if (isDuplicate) {
    issues.push({
      type: 'DUPLICATE',
      severity: 'WARNING',
      message: 'Registro duplicado detectado: misma fecha, hora, ubicación y parámetro.',
      field: 'id'
    });
    uniquenessScore = 0;
  }

  // 6. Equipment Quality & Instrumentation Score
  let equipmentScore = 15;
  if (tipoEquipo === 'Referencia / Regulatorio') {
    equipmentScore = 35;
    reasons.push('Instrumento con certificación metrológica oficial');
  } else if (tipoEquipo === 'Portátil Calibrado (Clase 1 / 2)') {
    equipmentScore = 28;
    reasons.push('Equipo portátil certificado de precisión');
  } else if (tipoEquipo === 'Modelo Matemático / Software') {
    equipmentScore = 25;
    reasons.push('Modelo computacional parametrizado');
  } else if (tipoEquipo === 'Estación Meteorológica') {
    equipmentScore = 26;
    reasons.push('Estación meteorológica estándar');
  } else if (tipoEquipo === 'Sensor IoT de Bajo Costo') {
    equipmentScore = 18;
    reasons.push('Sensor óptico/electroquímico de bajo costo (requiere ajuste)');
  } else {
    equipmentScore = 10;
    reasons.push('Sin especificación de modelo de equipo');
  }

  // 7. Calculate Total Score & Tier
  completenessScore = Math.max(0, completenessScore);
  const totalScore = Math.round(
    Math.min(100, Math.max(0, equipmentScore + completenessScore + coordinatesScore + plausibilityScore + uniquenessScore))
  );

  let tier: ReliabilityTier = 'MEDIA';
  if (totalScore >= 85) {
    tier = 'ALTA';
  } else if (totalScore >= 60) {
    tier = 'MEDIA';
  } else if (totalScore >= 40) {
    tier = 'BAJA';
  } else {
    tier = 'RECHAZADO';
  }

  // 8. Overall Validation Status
  const hasErrors = issues.some(i => i.severity === 'ERROR');
  const hasWarnings = issues.some(i => i.severity === 'WARNING');
  const status: ValidationStatus = hasErrors ? 'REJECTED' : hasWarnings ? 'WARNING' : 'VALID';

  // 9. ECA Normative Check
  const ecaInfo = PARAMETER_ECA_LIMITS[parametro];
  const ecaLimit = ecaInfo ? ecaInfo.limit : undefined;
  const exceedsEca = ecaLimit !== undefined ? valor > ecaLimit : false;

  const reliability: ReliabilityBreakdown = {
    totalScore,
    tier,
    equipmentScore,
    completenessScore,
    coordinatesScore,
    plausibilityScore,
    uniquenessScore,
    reasons
  };

  const utm = latLngToUTM18S(lat, lng);

  const validatedRecord: EnvironmentalRecord = {
    id: rawRecord.id || `rec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    fecha,
    hora,
    coordenadas: [Number(lat.toFixed(5)), Number(lng.toFixed(5))],
    utm,
    distrito,
    direccion: rawRecord.direccion,
    parametro,
    valor: Number(valor.toFixed(2)),
    unidad,
    equipo,
    tipoEquipo,
    certificadoCalibracion: rawRecord.certificadoCalibracion,
    fuente,
    origen,
    observaciones,
    creadoEn: rawRecord.creadoEn || new Date().toISOString(),
    status,
    issues,
    reliability,
    ecaLimit,
    exceedsEca
  };

  return { validatedRecord, issues, status, reliability };
}

/**
 * Parses and validates multiple records from JSON
 */
export function parseJSONData(
  jsonText: string,
  targetOrigin: DataOrigin = 'USUARIO',
  existingRecords: EnvironmentalRecord[] = []
): IngestionPreviewResult {
  let parsed: any;
  try {
    parsed = JSON.parse(jsonText);
  } catch (err: any) {
    throw new Error(`Error de sintaxis JSON: ${err.message}`);
  }

  let rawList: any[] = [];
  let detectedFormat: 'JSON' | 'GEOJSON' = 'JSON';

  if (Array.isArray(parsed)) {
    rawList = parsed;
  } else if (parsed.type === 'FeatureCollection' && Array.isArray(parsed.features)) {
    detectedFormat = 'GEOJSON';
    rawList = parsed.features.map((f: any) => {
      const coords = f.geometry?.coordinates || [-77.0428, -12.0464];
      return {
        ...f.properties,
        lat: coords[1],
        lng: coords[0]
      };
    });
  } else if (parsed.type === 'Feature') {
    detectedFormat = 'GEOJSON';
    const coords = parsed.geometry?.coordinates || [-77.0428, -12.0464];
    rawList = [{
      ...parsed.properties,
      lat: coords[1],
      lng: coords[0]
    }];
  } else if (typeof parsed === 'object') {
    rawList = [parsed];
  }

  return processRawRecordList(rawList, targetOrigin, detectedFormat, existingRecords);
}

/**
 * Parses and validates CSV data
 */
export function parseCSVData(
  csvText: string,
  targetOrigin: DataOrigin = 'USUARIO',
  existingRecords: EnvironmentalRecord[] = []
): IngestionPreviewResult {
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true
  });

  if (result.errors && result.errors.length > 0 && result.data.length === 0) {
    throw new Error(`Error al procesar CSV: ${result.errors[0].message}`);
  }

  return processRawRecordList(result.data, targetOrigin, 'CSV', existingRecords);
}

/**
 * Parses and validates Excel Spreadsheet data (.xlsx / .xls)
 */
export function parseExcelData(
  arrayBuffer: ArrayBuffer,
  targetOrigin: DataOrigin = 'USUARIO',
  existingRecords: EnvironmentalRecord[] = []
): IngestionPreviewResult {
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error('El archivo Excel no contiene hojas de cálculo válidas.');
  }

  const worksheet = workbook.Sheets[sheetName];
  const rawData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  return processRawRecordList(rawData, targetOrigin, 'EXCEL', existingRecords);
}

/**
 * Internal helper to transform arbitrary row keys into validated EnvironmentalRecord objects
 */
function processRawRecordList(
  rows: any[],
  targetOrigin: DataOrigin,
  format: 'EXCEL' | 'CSV' | 'JSON' | 'GEOJSON' | 'MANUAL',
  existingRecords: EnvironmentalRecord[]
): IngestionPreviewResult {
  const validatedList: EnvironmentalRecord[] = [];
  let validCount = 0;
  let warningCount = 0;
  let rejectedCount = 0;
  let duplicateCount = 0;
  let totalScoreSum = 0;

  rows.forEach((row, index) => {
    // Flexible header mapping (Spanish and English variations)
    const fecha = row.fecha || row.date || row.Fecha || row.FECHA || new Date().toISOString().split('T')[0];
    const hora = row.hora || row.time || row.Hora || row.HORA || '12:00';
    
    let lat = row.latitud ?? row.lat ?? row.latitude ?? row.Latitud ?? row.LAT ?? row.y;
    let lng = row.longitud ?? row.lng ?? row.longitude ?? row.lon ?? row.Longitud ?? row.LNG ?? row.x;
    
    // Parse numeric coords if strings
    if (typeof lat === 'string') lat = parseFloat(lat.replace(',', '.'));
    if (typeof lng === 'string') lng = parseFloat(lng.replace(',', '.'));

    const rawParam = String(row.parametro || row.parameter || row.Parametro || row.PARAMETRO || 'PM2.5');
    const parametro = normalizeParameter(rawParam);

    let valor = row.valor ?? row.value ?? row.Valor ?? row.VALOR;
    if (typeof valor === 'string') valor = parseFloat(valor.replace(',', '.'));
    if (typeof valor !== 'number' || isNaN(valor)) valor = 0;

    const rawUnit = String(row.unidad || row.unit || row.Unidad || row.UNIDAD || '');
    const unidad = normalizeUnit(rawUnit, parametro);

    const distrito = String(row.distrito || row.district || row.Distrito || row.DISTRITO || 'Lima Cercado');
    const direccion = row.direccion || row.address || row.Direccion || undefined;
    const equipo = String(row.equipo || row.equipment || row.Equipo || row.EQUIPO || 'Sensor Ambiental Importado');
    const tipoEquipo = (row.tipoEquipo || row.equipmentGrade || row.TipoEquipo || 'No especificado') as EquipmentGrade;
    const fuente = String(row.fuente || row.source || row.Fuente || row.FUENTE || 'Dataset Importado');
    const observaciones = row.observaciones || row.notes || row.Observaciones || row.OBSERVACIONES || '';

    const partialRecord: Partial<EnvironmentalRecord> = {
      id: row.id ? String(row.id) : `rec-import-${Date.now()}-${index}`,
      fecha: String(fecha).slice(0, 10),
      hora: String(hora).slice(0, 8),
      coordenadas: [lat, lng],
      distrito,
      direccion,
      parametro,
      valor,
      unidad,
      equipo,
      tipoEquipo,
      fuente,
      origen: (row.origen as DataOrigin) || targetOrigin,
      observaciones: String(observaciones)
    };

    const { validatedRecord, status } = validateEnvironmentalRecord(
      partialRecord,
      [...existingRecords, ...validatedList]
    );

    validatedList.push(validatedRecord);
    totalScoreSum += validatedRecord.reliability.totalScore;

    if (status === 'VALID') validCount++;
    else if (status === 'WARNING') warningCount++;
    else if (status === 'REJECTED') rejectedCount++;

    if (validatedRecord.issues.some(i => i.type === 'DUPLICATE')) duplicateCount++;
  });

  const avgReliability = validatedList.length > 0 ? Math.round(totalScoreSum / validatedList.length) : 0;

  return {
    records: validatedList,
    totalParsed: validatedList.length,
    validCount,
    warningCount,
    rejectedCount,
    duplicateCount,
    avgReliability,
    detectedOrigin: targetOrigin,
    fileFormat: format
  };
}

/**
 * Generates ready-to-download sample files in Excel, CSV, JSON and GeoJSON
 */
export function generateSampleDataset() {
  return [
    {
      fecha: '2026-08-23',
      hora: '08:30',
      latitud: -12.0464,
      longitud: -77.0428,
      distrito: 'Lima Cercado',
      direccion: 'Av. Abancay cdra 5',
      parametro: 'PM2.5',
      valor: 58.4,
      unidad: 'µg/m³',
      equipo: 'BAM-1020 Met One Instruments',
      tipoEquipo: 'Referencia / Regulatorio',
      fuente: 'SENAMHI',
      origen: 'OFICIAL',
      observaciones: 'Tráfico denso hora punta matutina.'
    },
    {
      fecha: '2026-08-23',
      hora: '10:15',
      latitud: -12.0125,
      longitud: -77.0018,
      distrito: 'San Juan de Lurigancho',
      direccion: 'Av. Próceres de la Independencia',
      parametro: 'Ruido Diurno',
      valor: 76.8,
      unidad: 'dBA',
      equipo: 'Sonómetro Integrador Clase 1 SVAN 971',
      tipoEquipo: 'Portátil Calibrado (Clase 1 / 2)',
      fuente: 'OEFA',
      origen: 'OFICIAL',
      observaciones: 'Bocinas constantes y flujo de combis.'
    },
    {
      fecha: '2026-08-23',
      hora: '11:00',
      latitud: -12.1215,
      longitud: -77.0298,
      distrito: 'Miraflores',
      direccion: 'Parque Kennedy',
      parametro: 'PM2.5',
      valor: 18.2,
      unidad: 'µg/m³',
      equipo: 'Sensor Comunitario AirBeam 3',
      tipoEquipo: 'Sensor IoT de Bajo Costo',
      fuente: 'Red Comunitaria Vecinal',
      origen: 'USUARIO',
      observaciones: 'Zona residencial y comercial con vegetación.'
    },
    {
      fecha: '2026-08-23',
      hora: '12:30',
      latitud: -11.9250,
      longitud: -77.1250,
      distrito: 'Ventanilla',
      direccion: 'Zona Industrial La Pampilla',
      parametro: 'SO2',
      valor: 82.5,
      unidad: 'µg/m³',
      equipo: 'Software AERMOD v24 Dispersion Model',
      tipoEquipo: 'Modelo Matemático / Software',
      fuente: 'Simulación de Dispersión Atmosférica',
      origen: 'MODELADO',
      observaciones: 'Pluma de emisión modelada con vientos SO.'
    },
    {
      fecha: '2026-08-23',
      hora: '14:00',
      latitud: -12.0850,
      longitud: -77.0350,
      distrito: 'Lince',
      direccion: 'Av. Arequipa - Ciclovía',
      parametro: 'Ruido Diurno',
      valor: 58.0,
      unidad: 'dBA',
      equipo: 'Simulador Prospectivo Movilidad Sostenible',
      tipoEquipo: 'Modelo Matemático / Software',
      fuente: 'Escenario Plan Verde Lima 2030',
      origen: 'SIMULADO',
      observaciones: 'Proyección con 40% flota eléctrica.'
    }
  ];
}

/**
 * Downloads Excel Template
 */
export function downloadExcelTemplate() {
  const data = generateSampleDataset();
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos_Ambientales');
  XLSX.writeFile(workbook, 'Plantilla_Datos_Ambientales_Lima.xlsx');
}

/**
 * Downloads CSV Template
 */
export function downloadCSVTemplate() {
  const data = generateSampleDataset();
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Plantilla_Datos_Ambientales_Lima.csv';
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Downloads JSON Template
 */
export function downloadJSONTemplate() {
  const data = generateSampleDataset();
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Plantilla_Datos_Ambientales_Lima.json';
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Downloads GeoJSON Template
 */
export function downloadGeoJSONTemplate() {
  const sample = generateSampleDataset();
  const geojson = {
    type: 'FeatureCollection',
    features: sample.map(item => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [item.longitud, item.latitud]
      },
      properties: {
        fecha: item.fecha,
        hora: item.hora,
        distrito: item.distrito,
        direccion: item.direccion,
        parametro: item.parametro,
        valor: item.valor,
        unidad: item.unidad,
        equipo: item.equipo,
        tipoEquipo: item.tipoEquipo,
        fuente: item.fuente,
        origen: item.origen,
        observaciones: item.observaciones
      }
    }))
  };

  const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Plantilla_Datos_Ambientales_Lima.geojson';
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Exports current records list to any format
 */
export function exportRecordsToFile(
  records: EnvironmentalRecord[],
  format: 'EXCEL' | 'CSV' | 'JSON' | 'GEOJSON'
) {
  const cleanRows = records.map(r => ({
    ID: r.id,
    Origen: r.origen,
    Fecha: r.fecha,
    Hora: r.hora,
    Latitud: r.coordenadas[0],
    Longitud: r.coordenadas[1],
    UTM_Este: r.utm?.easting,
    UTM_Norte: r.utm?.northing,
    Distrito: r.distrito,
    Direccion: r.direccion || '',
    Parametro: r.parametro,
    Valor: r.valor,
    Unidad: r.unidad,
    Estado_ECA: r.exceedsEca ? 'SUPERA_ECA' : 'CUMPLE_ECA',
    Limite_ECA: r.ecaLimit,
    Equipo: r.equipo,
    Tipo_Equipo: r.tipoEquipo,
    Fuente: r.fuente,
    Confiabilidad_Score: r.reliability.totalScore,
    Nivel_Confiabilidad: r.reliability.tier,
    Estado_Validacion: r.status,
    Observaciones: r.observaciones || ''
  }));

  const timestamp = new Date().toISOString().slice(0, 10);

  if (format === 'EXCEL') {
    const worksheet = XLSX.utils.json_to_sheet(cleanRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos_Ambientales');
    XLSX.writeFile(workbook, `ECO_MAP_Datos_Ambientales_${timestamp}.xlsx`);
  } else if (format === 'CSV') {
    const csv = Papa.unparse(cleanRows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ECO_MAP_Datos_Ambientales_${timestamp}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  } else if (format === 'JSON') {
    const jsonStr = JSON.stringify(records, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ECO_MAP_Datos_Ambientales_${timestamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  } else if (format === 'GEOJSON') {
    const geojson = {
      type: 'FeatureCollection',
      features: records.map(r => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [r.coordenadas[1], r.coordenadas[0]]
        },
        properties: {
          id: r.id,
          origen: r.origen,
          fecha: r.fecha,
          hora: r.hora,
          distrito: r.distrito,
          parametro: r.parametro,
          valor: r.valor,
          unidad: r.unidad,
          exceedsEca: r.exceedsEca,
          equipo: r.equipo,
          fuente: r.fuente,
          reliability: r.reliability.totalScore,
          tier: r.reliability.tier,
          status: r.status,
          observaciones: r.observaciones
        }
      }))
    };
    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ECO_MAP_Datos_Ambientales_${timestamp}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
