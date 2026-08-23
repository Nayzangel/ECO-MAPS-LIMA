export type TemperatureUnit = 'C' | 'F' | 'K';
export type PressureUnit = 'hPa' | 'mbar' | 'mmHg' | 'atm' | 'kPa';
export type WindSpeedUnit = 'm/s' | 'km/h' | 'knots' | 'mph';
export type RadiationUnit = 'W/m2' | 'MJ/m2' | 'cal/cm2_min';
export type PrecipitationUnit = 'mm' | 'mm/h' | 'in';

export type CardinalDirection = 
  | 'N' | 'NNE' | 'NE' | 'ENE'
  | 'E' | 'ESE' | 'SE' | 'SSE'
  | 'S' | 'SSW' | 'SW' | 'WSW'
  | 'W' | 'WNW' | 'NW' | 'NNW';

export type PasquillStabilityClass = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface MeteorologicalRecord {
  id: string;
  stationName: string;
  district: string;
  coordinates: [number, number]; // [lat, lng]
  elevationMeters: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  
  // Basic & Configurable Atmospheric Parameters
  temperature: number; // Stored in Celsius
  temperatureUnit?: TemperatureUnit;
  
  relativeHumidity: number; // Percentage % (0 - 100)
  
  atmosphericPressure: number; // Stored in hPa
  pressureUnit?: PressureUnit;
  
  windSpeed: number; // Stored in m/s
  windSpeedUnit?: WindSpeedUnit;
  
  windDirectionDegrees: number; // 0 - 360°
  windDirectionCardinal: CardinalDirection;
  
  precipitation: number; // mm
  precipitationUnit?: PrecipitationUnit;
  
  solarRadiation: number; // Stored in W/m²
  radiationUnit?: RadiationUnit;
  
  // Advanced & Configurable Dispersion Parameters
  cloudCoverOctas: number; // 0 to 8 octas
  pasquillClass: PasquillStabilityClass;
  mixingHeightMeters: number; // Altura capa de mezcla (m)
  thermalInversionPresent: boolean;
  inversionBaseHeightMeters?: number; // Base de la inversión térmica (m)
  surfaceRoughnessZ0: number; // Longitud de rugosidad z0 (m)
  dewPointCelsius: number; // Punto de rocío calculado (°C)
  heatIndexCelsius?: number; // Sensación térmica (°C)
  uvIndex?: number; // Índice de radiación UV (1 - 15+)
  
  isUserAdded?: boolean;
  sourceAuthority: 'SENAMHI' | 'RED_ECO_MAP' | 'ESTACION_PROPIA' | 'DIGESA' | 'CORPAC';
  sensorModel?: string;
  notes?: string;
}

export interface WindRoseSector {
  direction: CardinalDirection;
  degreesMin: number;
  degreesMax: number;
  degreesMid: number;
  totalFrequencyPercent: number;
  speedBins: {
    label: string; // '0.5 - 2.1 m/s', '2.1 - 3.6 m/s', etc.
    minSpeed: number;
    maxSpeed: number;
    frequencyPercent: number;
    color: string;
  }[];
}

export interface WindRoseData {
  stationId: string;
  stationName: string;
  periodDescription: string;
  totalObservations: number;
  calmPercent: number; // Calmas (< 0.5 m/s)
  meanSpeed: number; // m/s
  dominantDirection: CardinalDirection;
  sectors: WindRoseSector[];
}
