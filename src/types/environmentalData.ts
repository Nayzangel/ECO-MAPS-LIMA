import { ZoneType } from './index';

export type DataOrigin = 'OFICIAL' | 'USUARIO' | 'DEMO' | 'MODELADO' | 'SIMULADO';

export type EnvironmentalParameter = 
  | 'PM2.5'
  | 'PM10'
  | 'Ruido Diurno'
  | 'Ruido Nocturno'
  | 'SO2'
  | 'NO2'
  | 'CO'
  | 'O3'
  | 'Temperatura'
  | 'Humedad'
  | 'Velocidad Viento';

export type ParameterUnit = 
  | 'µg/m³'
  | 'mg/m³'
  | 'dBA'
  | 'ppm'
  | 'ppb'
  | '°C'
  | '%'
  | 'm/s';

export type EquipmentGrade = 
  | 'Referencia / Regulatorio'
  | 'Portátil Calibrado (Clase 1 / 2)'
  | 'Sensor IoT de Bajo Costo'
  | 'Estación Meteorológica'
  | 'Modelo Matemático / Software'
  | 'No especificado';

export type ValidationStatus = 'VALID' | 'WARNING' | 'REJECTED';

export type ReliabilityTier = 'ALTA' | 'MEDIA' | 'BAJA' | 'RECHAZADO';

export interface ValidationIssue {
  type: 'COORDINATES_ERROR' | 'MISSING_DATA' | 'INVALID_UNIT' | 'DUPLICATE' | 'ANOMALOUS_VALUE' | 'EQUIPMENT_UNVERIFIED';
  severity: 'ERROR' | 'WARNING';
  message: string;
  field?: string;
  suggestedFix?: string;
}

export interface ReliabilityBreakdown {
  totalScore: number; // 0 - 100
  tier: ReliabilityTier;
  equipmentScore: number; // 0 - 35
  completenessScore: number; // 0 - 25
  coordinatesScore: number; // 0 - 20
  plausibilityScore: number; // 0 - 15
  uniquenessScore: number; // 0 - 5
  reasons: string[];
}

export interface EnvironmentalRecord {
  id: string;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:mm:ss or HH:mm
  coordenadas: [number, number]; // [lat, lng]
  utm?: {
    easting: number;
    northing: number;
    zone: string;
  };
  distrito: string;
  direccion?: string;
  parametro: EnvironmentalParameter;
  valor: number;
  unidad: ParameterUnit;
  equipo: string;
  tipoEquipo: EquipmentGrade;
  certificadoCalibracion?: string;
  fuente: string;
  origen: DataOrigin;
  observaciones?: string;
  creadoEn: string;
  
  // Validation and Quality Engine fields
  status: ValidationStatus;
  issues: ValidationIssue[];
  reliability: ReliabilityBreakdown;
  ecaLimit?: number;
  exceedsEca?: boolean;
}

export interface EnvironmentalDataFilter {
  search: string;
  origin: DataOrigin | 'TODOS';
  parameter: EnvironmentalParameter | 'TODOS';
  district: string | 'TODOS';
  reliabilityTier: ReliabilityTier | 'TODOS';
  status: ValidationStatus | 'TODOS';
  onlyExceedingEca: boolean;
}

export interface IngestionPreviewResult {
  records: EnvironmentalRecord[];
  totalParsed: number;
  validCount: number;
  warningCount: number;
  rejectedCount: number;
  duplicateCount: number;
  avgReliability: number;
  detectedOrigin: DataOrigin;
  fileName?: string;
  fileFormat: 'EXCEL' | 'CSV' | 'JSON' | 'GEOJSON' | 'MANUAL';
}
