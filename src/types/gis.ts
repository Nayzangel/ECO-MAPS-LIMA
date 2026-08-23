import { RiskLevel, ZoneType, StationData } from './index';

export type BaseMapType = 'dark' | 'osm' | 'positron' | 'satellite';

export type ActiveMapTool = 'navigate' | 'add_point' | 'measure_distance' | 'measure_area' | 'inspect';

export interface LayerVisibilityState {
  airQuality: boolean;
  noise: boolean;
  districts: boolean;
  roads: boolean;
  monitoringStations: boolean;
  environmentalSources: boolean;
  meteorology: boolean;
}

export interface CustomUserPoint {
  id: string;
  name: string;
  category: 'Monitoreo de Campo' | 'Denuncia Ciudadana' | 'Foco Industrial' | 'Tráfico Pesado' | 'Zona Sensible';
  coordinates: [number, number]; // [lat, lng]
  pm25Estimated?: number;
  noiseEstimated?: number;
  notes?: string;
  createdAt: string;
  zoneType: ZoneType;
}

export interface EnvironmentalSource {
  id: string;
  name: string;
  category: 'Industria Pesada' | 'Termoeléctrica' | 'Relleno Sanitario' | 'Puerto & Logística' | 'Aeroportuario' | 'Parque Fabril';
  coordinates: [number, number];
  district: string;
  emissionType: string;
  estimatedOutput: string;
  impactRadiusMeters: number;
  criticality: 'Alta' | 'Media' | 'Crítica';
  description: string;
}

export interface DistrictBoundary {
  id: string;
  name: string;
  zone: 'Lima Centro' | 'Lima Norte' | 'Lima Este' | 'Lima Sur' | 'Callao';
  center: [number, number];
  polygon: [number, number][];
  population: number;
  vulnerabilityIndex: 'Bajo' | 'Medio' | 'Alto' | 'Muy Alto';
  avgPm25: number;
  avgNoiseDay: number;
}

export interface RoadCorridor {
  id: string;
  name: string;
  type: 'Vía Expresa' | 'Autopista / Panamericana' | 'Corredor Troncal' | 'Avenida Principal';
  coordinates: [number, number][];
  estimatedNoiseDb: number;
  vehicleVolume: string;
  congestionAqiImpact: 'Alto' | 'Medio' | 'Crítico';
}

export interface MeteorologyPoint {
  id: string;
  name: string;
  coordinates: [number, number];
  temperature: number; // °C
  humidity: number; // %
  windSpeed: number; // m/s
  windDirectionDeg: number; // 0-360 degrees
  windDirectionText: string;
  pressure: number; // hPa
}

export interface GeoSearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'distrito' | 'calle' | 'lugar' | 'estacion' | 'fuente';
  coordinates: [number, number];
  zoom?: number;
}

export interface MapFilterOptions {
  riskLevel: 'all' | RiskLevel;
  district: string;
  zoneType: 'all' | ZoneType;
  onlyExceedingEca: boolean;
  searchQuery: string;
}
