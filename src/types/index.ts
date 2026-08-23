export type ZoneType = 'Residencial' | 'Comercial' | 'Industrial' | 'ProteccionEspecial';

export type RiskLevel = 'Optimo' | 'Moderado' | 'Alerta' | 'Critico';

export interface StationData {
  id: string;
  name: string;
  district: string;
  zoneType: ZoneType;
  coordinates: [number, number]; // [lat, lng]
  elevation: number; // msnm
  pm25: number; // µg/m³
  pm10: number; // µg/m³
  so2: number; // µg/m³
  no2: number; // µg/m³
  co: number; // mg/m³
  o3: number; // µg/m³
  noiseDay: number; // dBA
  noiseNight: number; // dBA
  temperature: number; // °C
  humidity: number; // %
  windSpeed: number; // m/s
  windDirection: string;
  lastUpdate: string;
  incaIndex: 'Bueno' | 'Moderado' | 'Malo' | 'Cuidado';
  riskLevel: RiskLevel;
  primaryIssue: string;
  isDemo: boolean;
}

export interface ExternalSource {
  id: string;
  name: string;
  institution: string;
  url: string;
  type: 'Gubernamental' | 'Académica' | 'Sensor Comunitario' | 'Satélite' | 'Simulación DEMO';
  updateFrequency: string;
  license: string;
  connectionMethod: 'REST API' | 'WMS/WFS' | 'Descarga CSV' | 'Sensor IoT' | 'Dataset Local DEMO';
  connectionStatus: 'Conectado' | 'En Validación' | 'DEMO Activo' | 'Programado';
  lastSync: string;
  coverage: string;
  isDemo: boolean;
  description: string;
}

export interface NormativeLimit {
  parameter: string;
  standardName: string;
  legalBase: string;
  unit: string;
  period: string;
  limitValue: number;
  description: string;
}

export interface DecisionAction {
  id: string;
  category: 'Tránsito y Transporte' | 'Fiscalización Industrial' | 'Salud Pública' | 'Infraestructura Verde' | 'Monitoreo Focalizado';
  title: string;
  description: string;
  priority: 'Alta' | 'Media' | 'Inmediata' | 'Estratégica';
  estimatedImpact: string;
  responsibleEntity: string;
}

export type ViewMode = 'ciudadano' | 'profesional';
