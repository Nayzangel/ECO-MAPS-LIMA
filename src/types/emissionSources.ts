export type EmissionSourceType = 'PUNTUAL_CHIMENEA' | 'LINEAL_VIA' | 'AREA_SUPERFICIAL';

export type LengthUnit = 'm' | 'cm' | 'ft' | 'in';
export type VelocityUnit = 'm/s' | 'ft/s' | 'km/h';
export type VolumetricFlowUnit = 'm3/s' | 'm3/h' | 'Nm3/h' | 'ACFM';
export type MassEmissionUnit = 'g/s' | 'kg/h' | 'ton/year' | 'lb/hr';
export type ConcentrationUnit = 'mg/Nm3' | 'ppm' | 'ug/m3';

export type IndustrialSector = 
  | 'MINERIA_METALURGIA'
  | 'REFINERIA_HIDROCARBUROS'
  | 'TERMOELECTRICA'
  | 'CEMENTERA_CALERA'
  | 'PESQUERA_HARINA'
  | 'PARQUE_AUTOMOTOR'
  | 'CONSTRUCCION_AGREGADOS'
  | 'QUIMICA_PETROQUIMICA'
  | 'OTRA_INDUSTRIA';

export interface PollutantEmissionRate {
  pollutant: 'SO2' | 'NOX' | 'PM10' | 'PM2_5' | 'CO' | 'VOC' | 'PB' | 'H2S';
  rateValue: number; // Stored in g/s
  rateUnit: MassEmissionUnit;
  concentrationMgNm3?: number; // Concentración de emisión (mg/Nm3)
  emissionLimitMgNm3?: number; // Límite Máximo Permisible (LMP) normativo peruano
  exceedsLmp?: boolean;
}

// 1: POINT SOURCE (CHIMENEA / STACK)
export interface StackPointSource {
  id: string;
  type: 'PUNTUAL_CHIMENEA';
  name: string;
  facilityName: string; // Planta / Complejo
  sector: IndustrialSector;
  district: string;
  coordinates: [number, number]; // [lat, lng]
  utmCoordinates?: {
    zone: string;
    eastX: number;
    northY: number;
  };
  
  // Geometric & Thermodynamic Stack Parameters
  stackHeightMeters: number; // hs (m)
  stackInnerDiameterMeters: number; // d (m)
  gasExitTemperatureCelsius: number; // Ts (°C)
  gasExitVelocityMs: number; // vs (m/s)
  volumetricFlowRateM3s: number; // Qv (m3/s)
  
  // Plume Rise Parameters (Calculated via Briggs Equations)
  buoyancyFluxFb?: number; // Fb (m4/s3)
  momentumFluxFm?: number; // Fm (m4/s2)
  plumeRiseDeltaH?: number; // Delta h (m)
  effectiveStackHeightMeters?: number; // H = hs + Delta h (m)
  
  // Emissions
  pollutants: PollutantEmissionRate[];
  
  // Operational details
  operatingHoursPerDay: number;
  operatingDaysPerYear: number;
  fuelType?: string; // Gas Natural, Residual 500, Diesel B5, Carbón, etc.
  controlEquipment?: string; // Filtro de mangas, Lavador de gases (Scrubber), Precipitador electrostático (ESP), Ciclón, etc.
  
  isUserAdded?: boolean;
  legalEntity?: string; // Titular Minero / Industrial
  environmentalInstrument?: string; // EIA-d, DIA, PAMA, ITS aprobado
}

// 2: LINE SOURCE (VÍA / CARRETERA)
export interface RoadwayLineSource {
  id: string;
  type: 'LINEAL_VIA';
  name: string;
  district: string;
  startCoordinates: [number, number];
  endCoordinates: [number, number];
  lengthMeters: number;
  roadwayWidthMeters: number;
  releaseHeightMeters: number; // Altura de escape vehicular (~0.5 - 1.5 m)
  trafficVolumeVehiclesPerHour: number;
  heavyVehiclesPercent: number;
  averageSpeedKmh: number;
  linearEmissionRateGPerSMeter: number; // ql (g/s·m) for primary pollutant (NOx / PM10)
  pollutants: PollutantEmissionRate[];
  isUserAdded?: boolean;
}

// 3: AREA SOURCE (CANTERA / DEPÓSITO / RELAVERA / ZONA DIFUSA)
export interface SurfaceAreaSource {
  id: string;
  type: 'AREA_SUPERFICIAL';
  name: string;
  facilityName: string;
  district: string;
  centerCoordinates: [number, number];
  polygonCoordinates?: [number, number][];
  surfaceAreaM2: number; // Superficie (m2)
  surfaceAreaHectares: number; // Superficie (ha)
  releaseHeightMeters: number; // Altura de liberación difusa (m)
  areaEmissionRateGPerSM2: number; // qa (g/s·m2)
  pollutants: PollutantEmissionRate[];
  isUserAdded?: boolean;
  notes?: string;
}

export type AnyEmissionSource = StackPointSource | RoadwayLineSource | SurfaceAreaSource;
