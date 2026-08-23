export type AirParameterKey = 
  | 'PM2_5'
  | 'PM10'
  | 'SO2'
  | 'NO2'
  | 'CO'
  | 'O3'
  | 'PB_PM10'
  | 'BENZENE'
  | 'H2S';

export type IncaCategory = 'BUENO' | 'MODERADO' | 'MALO' | 'CUIDADO' | 'PELIGROSO';

export type DataSourceType = 'SENAMHI' | 'OEFA' | 'DIGESA' | 'USUARIO' | 'MUNICIPAL' | 'CONSULTORIA';

export interface AirNormativeStandard {
  key: AirParameterKey;
  code: string;
  name: string;
  chemicalFormula: string;
  primaryTimeframe: '1h' | '8h' | '24h' | 'Mensual' | 'Anual';
  ecaLimit: number;
  unit: string;
  legalBasis: string;
  measurementMethod: string;
  healthEffects: string;
  criticalSources: string;
  incaThresholds: {
    buenoMax: number;
    moderadoMax: number;
    maloMax: number;
    cuidadoMax: number;
  };
}

export interface MeteorologyData {
  windSpeed: number; // m/s
  windDirectionDeg: number; // 0 - 360 degrees
  windDirectionCardinal: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SO' | 'O' | 'NO';
  temperature: number; // °C
  humidity: number; // %
  solarRadiation?: number; // W/m²
  atmosphericPressure?: number; // hPa
  thermalInversionRisk: 'BAJO' | 'MODERADO' | 'ALTO' | 'CRITICO';
}

export interface AirMeasurementRecord {
  id: string;
  title: string;
  district: string;
  address: string;
  coordinates: [number, number]; // [lat, lng]
  utmZone?: string; // e.g. "18S 281450m E 8675400m N"
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  parameter: AirParameterKey;
  concentration: number;
  unit: string;
  equipment: string;
  sourceType: DataSourceType;
  sourceName: string;
  meteorology: MeteorologyData;
  zoneType: 'ProteccionEspecial' | 'Residencial' | 'Comercial' | 'Industrial';
  notes?: string;
  isUserAdded?: boolean;
}

export interface HourlyDataPoint {
  hour: string; // "00:00", "01:00", etc.
  value: number;
  incaIndex: number;
  windSpeed: number;
  windDirection: string;
  temperature: number;
  isExceeded: boolean;
}

export interface DailyDataPoint {
  date: string; // "2026-08-17"
  dayName: string; // "Lun", "Mar", etc.
  avgValue: number;
  maxValue: number;
  minValue: number;
  exceedanceCount: number;
  incaCategory: IncaCategory;
}

export interface ExceedanceAnalysisResult {
  isExceeded: boolean;
  excessMagnitude: number; // value - limit
  excessPercentage: number; // ((value - limit) / limit) * 100
  limit: number;
  timeframe: string;
  severityLevel: 'CONFORME' | 'ALERTA_PREVENTIVA' | 'EXCEDENCIA_MODERADA' | 'EXCEDENCIA_SEVERA' | 'EPISODIO_CRITICO';
  alertDescription: string;
  regulatoryAction: string;
}

export interface AirStatisticsSummary {
  currentValue: number;
  currentInca: IncaCategory;
  incaValue: number; // 0-200+
  averageConcentration: number;
  maxConcentration: number;
  minConcentration: number;
  standardDeviation: number;
  totalMeasurements: number;
  exceedanceCount: number;
  complianceRatePercent: number;
  dominantWind: string;
  avgWindSpeed: number;
  ventilationIndex: 'VENTILACIÓN DEFICIENTE' | 'VENTILACIÓN MODERADA' | 'ALTA DISPERSIÓN EÓLICA';
}
