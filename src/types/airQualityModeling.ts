import { IndustrialSector, EmissionSourceType } from './emissionSources';

export type ModelingDatum = 'WGS84' | 'PSAD56' | 'SIRGAS2000';
export type UtmZone = '17S' | '18S' | '19S';

export interface ModelingDomainCoordinates {
  centerLat: number;
  centerLng: number;
  utmZone: UtmZone;
  datum: ModelingDatum;
  utmEasting: number; // m E
  utmNorthing: number; // m N
  domainWidthKm: number; // e.g. 20 km
  domainHeightKm: number; // e.g. 20 km
  gridResolutionMeters: number; // e.g. 100m, 250m, 500m
  elevationBaseMeters: number;
}

export type ModelingPollutantKey = 'SO2' | 'NOX' | 'NO2' | 'PM10' | 'PM2_5' | 'CO' | 'H2S' | 'VOC';

export interface ModelingPollutantConfig {
  pollutant: ModelingPollutantKey;
  name: string;
  chemicalFormula: string;
  averagingPeriods: ('1_HORA' | '8_HORAS' | '24_HORAS' | 'MENSUAL' | 'ANUAL')[];
  selectedAveragingPeriod: '1_HORA' | '8_HORAS' | '24_HORAS' | 'MENSUAL' | 'ANUAL';
  nationalEcaMgM3?: number; // ECA Perú D.S. 003-2017-MINAM
  isPhotochemical: boolean; // Needs NO to NO2 conversion (OLM/PVMRM)
  particleDensityGcm3?: number; // For deposition modeling
}

export interface ModelingSourceConfig {
  sourceType: EmissionSourceType | 'VOLUMEN';
  sourceName: string;
  facilityName: string;
  sector: IndustrialSector;
  // Spatial
  lat: number;
  lng: number;
  utmX: number;
  utmY: number;
  elevationMeters: number;
  // Emissions
  emissionRateGs: number; // g/s
  // Point Source Geometry (Stacks)
  stackHeightM?: number;
  stackDiameterM?: number;
  gasExitTempC?: number;
  gasExitVelocityMs?: number;
  // Building downwash (PRIME)
  hasBuildingDownwash?: boolean;
  buildingHeightM?: number;
  buildingWidthM?: number;
  buildingLengthM?: number;
  // Area Source Geometry
  areaLengthX?: number;
  areaLengthY?: number;
  areaReleaseHeight?: number;
  // Line Source Geometry
  lineLengthMeters?: number;
  roadwayWidthMeters?: number;
}

export interface ModelingMeteorologyConfig {
  sourceType: 'ESTACION_SUPERFICIAL' | 'DATOS_SINTETICOS_WRF' | 'AERMET_PROCESADO' | 'CALMET_3D';
  stationName: string;
  hasHourlySurfaceData: boolean; // Hourly wind, temp, pressure, cloud cover
  hasUpperAirSounding: boolean; // Radiosondeo para perfil vertical
  anemometerHeightMeters: number;
  // Surface characteristics (AERMET stages 1-3)
  surfaceRoughnessZ0: number; // m (e.g. 0.05 urban/rough, 0.001 water)
  bowenRatio: number; // Bowen ratio (sensible/latent heat flux)
  surfaceAlbedo: number; // Reflectivity
  mixingHeightDetermined: boolean;
  calmsPercentage: number; // % de vientos calmos (< 0.5 m/s)
  prevailingWindDirDeg: number;
  avgWindSpeedMs: number;
  temperatureC: number;
  stabilityClass: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  processedAermetFilesAvailable: boolean; // .SFC and .PFL
}

export interface ModelingTerrainConfig {
  terrainType: 'PLANO' | 'ONDULADO' | 'COMPLEJO_MONTANOSO' | 'COSTERO_VALLE';
  hasDigitalElevationModel: boolean; // DEM SRTM 30m / ASTER
  demResolutionMeters?: number;
  aermapProcessed: boolean;
  maxTerrainElevationMeters: number;
  minTerrainElevationMeters: number;
  hasCoastalBoundaryRecirculation: boolean; // Thermal internal boundary layer (TIBL) in Lima
}

export interface DiscreteReceptor {
  id: string;
  name: string;
  type: 'POBLADO' | 'HOSPITAL' | 'COLEGIO' | 'LIMITE_PROPIEDAD' | 'MONITOREO_HISTORICO';
  lat: number;
  lng: number;
  utmX: number;
  utmY: number;
  elevationMeters: number;
  flagpoleHeightMeters: number; // 1.5m breathing zone
}

export interface ModelingReceptorsConfig {
  gridType: 'CARTESIANA_UNIFORME' | 'POLAR' | 'ANIDADA';
  gridSpacingMeters: number; // e.g. 100m near source, 500m far
  totalGridReceptors: number;
  discreteReceptors: DiscreteReceptor[];
  includePropertyBoundaryReceptors: boolean;
  flagpoleReceptorHeightM: number;
}

export interface DataAvailabilityItem {
  category: 'COORDENADAS' | 'CONTAMINANTE' | 'EMISION' | 'FUENTE' | 'METEOROLOGIA' | 'TERRENO' | 'RECEPTORES';
  parameter: string;
  value: string;
  status: 'COMPLETO' | 'PARCIAL' | 'NO_CONFIGURADO';
  isRegulatoryRequirement: boolean;
}

export interface MissingDataItem {
  category: 'COORDENADAS' | 'CONTAMINANTE' | 'EMISION' | 'FUENTE' | 'METEOROLOGIA' | 'TERRENO' | 'RECEPTORES';
  parameter: string;
  reason: string;
  severity: 'CRITICO' | 'ALERTA' | 'RECOMENDADO';
  regulatoryImpact: string;
}

export interface ModelingSufficiencyAudit {
  // Available vs Missing
  availableData: DataAvailabilityItem[];
  missingData: MissingDataItem[];
  dataCompletenessPercentage: number;
  isSufficientForScreening: boolean;
  isSufficientForRefined: boolean;

  // Recommendations & Constraints
  recommendedModel: 'AERMOD' | 'CALPUFF' | 'AERSCREEN' | 'CALINE4' | 'CMAQ' | 'NO_DETERMINADO';
  recommendedModelFullName: string;
  recommendationReason: string;
  modelLimitations: string[];

  // Integration Status
  integrationStatus: 'MODELO_ESPECIALIZADO_PENDIENTE' | 'MOTOR_INTEGRADO_CONECTADO';
  statusMessage: string;
  canGenerateConcentrationMap: boolean; // Must be false unless a valid verified model is connected

  // Configuration files architecture preview (.INP / .DAT)
  inputScriptPreview?: {
    aermodInp?: string;
    calpuffInp?: string;
    aermetStage3Summary?: string;
    aermapStructure?: string;
  };
}

export interface AirQualityModelingProject {
  id: string;
  projectName: string;
  description: string;
  organization: string;
  coordinates: ModelingDomainCoordinates;
  pollutant: ModelingPollutantConfig;
  source: ModelingSourceConfig;
  meteorology: ModelingMeteorologyConfig;
  terrain: ModelingTerrainConfig;
  receptors: ModelingReceptorsConfig;
  auditResult?: ModelingSufficiencyAudit;
  createdAt: string;
  updatedAt: string;
}
