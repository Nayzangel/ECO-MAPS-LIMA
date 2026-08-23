export type NoiseZoneType = 
  | 'ProteccionEspecial' 
  | 'Residencial' 
  | 'Comercial' 
  | 'Industrial' 
  | 'Mixta';

export type NoiseTimePeriod = 'DIURNO' | 'NOCTURNO'; // Diurno: 07:01 - 22:00, Nocturno: 22:01 - 07:00

export type NoiseSourceCategory = 
  | 'TRAFICO_RODADO' 
  | 'INDUSTRIAL' 
  | 'CONSTRUCCION' 
  | 'COMERCIAL_OCIO' 
  | 'AEROPORTUARIO' 
  | 'FERROVIARIO' 
  | 'VECINAL_PERIFONEO' 
  | 'OTROS';

export type AcousticMethodologyType = 'MEDICION' | 'INTERPOLACION' | 'MODELAMIENTO';

export type NoisePriorityLevel = 'BAJA' | 'MODERADA' | 'ALTA' | 'CRITICA';

export interface NoiseCalibrationInfo {
  calibratorModel: string;
  calibratorSerial: string;
  preCalibrationDb: number; // e.g. 94.0 dB or 114.0 dB
  postCalibrationDb: number; // e.g. 94.1 dB
  deltaCalibrationDb: number; // abs(pre - post), max allowable: 0.5 dB
  calibrationCertificateNumber: string;
  calibrationExpiryDate: string;
  isCalibrationValid: boolean; // delta <= 0.5 dB and not expired
}

export interface NoiseStatisticalLevels {
  l10?: number; // Level exceeded 10% of the time (peak traffic noise)
  l50?: number; // Median noise level
  l90?: number; // Background / ambient baseline noise level
  l95?: number; // Residual noise level
}

export interface NoiseMeasurementRecord {
  id: string;
  title: string;
  district: string;
  address: string;
  coordinates: [number, number]; // [lat, lng]
  utmZone?: string; // e.g. "18S 279400m E 8668900m N"
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number; // e.g. 15, 30, 60
  
  // Acoustic Parameters
  laeq: number; // Equivalent continuous sound level A-weighted (dBA)
  lafmax: number; // Fast maximum sound level A-weighted (dBA)
  lafmin: number; // Fast minimum sound level A-weighted (dBA)
  lcpeak: number; // C-weighted peak sound level (dBC)
  
  // Statistical Percentiles
  statistical?: NoiseStatisticalLevels;

  // Zoning & Normative Evaluation
  zoneType: NoiseZoneType;
  determinedPeriod: NoiseTimePeriod;
  applicableNorm: string; // "D.S. N° 085-2003-PCM"
  ecaLimit: number; // Applicable limit in dBA
  exceedanceDb: number; // laeq - ecaLimit
  isExceeding: boolean;
  priority: NoisePriorityLevel;

  // Equipment & Calibration
  equipment: string; // e.g. "Sonómetro Integrador Clase 1 NTi XL2"
  equipmentClass: 'Clase 1' | 'Clase 2';
  equipmentSerial: string;
  calibration: NoiseCalibrationInfo;

  // Source & Metadata
  sourceCategory: NoiseSourceCategory;
  sourceDescription: string;
  methodology: AcousticMethodologyType;
  notes?: string;
  isUserAdded?: boolean;
  operatorName?: string;
  entityName?: string;
}

export interface NoiseNormativeReference {
  zoneType: NoiseZoneType;
  title: string;
  dayLimit: number; // 07:01 - 22:00 (dBA)
  nightLimit: number; // 22:01 - 07:00 (dBA)
  legalBasis: string;
  description: string;
  examples: string;
  healthEffects: string;
}

export interface AcousticSimulationPoint {
  x: number;
  y: number;
  lat: number;
  lng: number;
  calculatedLaeq: number;
  sourceDistanceMeters: number;
}
