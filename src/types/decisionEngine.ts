import { ZoneType } from './index';

export type DecisionClassification = 'BAJO' | 'MEDIO' | 'CRITICO' | 'INSUFICIENTE';

export type InterventionType = 
  | 'DESVIO_TRANSPORTE' 
  | 'FISCALIZACION_INDUSTRIAL' 
  | 'BARRERAS_ACUSTICAS' 
  | 'ARBOLADO_URBANO' 
  | 'ALERTA_ESCOLAR' 
  | 'PAVIMENTO_FONOABSORBENTE'
  | 'ELECTROMOVILIDAD';

export interface FactorDetail {
  id: number;
  name: string;
  category: 'ESPACIAL' | 'METROLOGICA' | 'NORMATIVA' | 'ANALITICA';
  value: string;
  rawValue?: number | string | boolean | null;
  unit?: string;
  status: 'OPTIMO' | 'ALERTA' | 'CRITICO' | 'NEUTRO' | 'INCOMPLETO';
  description: string;
  badge?: string;
}

export interface ThirteenFactorsSummary {
  // 1. Ubicación
  ubicacion: FactorDetail;
  // 2. Parámetro
  parametro: FactorDetail;
  // 3. Medición
  medicion: FactorDetail;
  // 4. Unidad
  unidad: FactorDetail;
  // 5. Fecha
  fecha: FactorDetail;
  // 6. Fuente
  fuente: FactorDetail;
  // 7. Zonificación
  zonificacion: FactorDetail;
  // 8. Norma aplicable
  normaAplicable: FactorDetail;
  // 9. Límite
  limite: FactorDetail;
  // 10. Excedencia
  excedencia: FactorDetail;
  // 11. Calidad del dato
  calidadDato: FactorDetail;
  // 12. Tendencia
  tendencia: FactorDetail;
  // 13. Prioridad
  prioridad: FactorDetail;
}

export interface ScoreBreakdown {
  exceedanceScore: number; // Max 35
  vulnerabilityScore: number; // Max 25
  trendScore: number; // Max 15
  synergyScore: number; // Max 15
  dataQualityScore: number; // Max 10
  totalScore: number; // 0 - 100
}

export interface ActionPlanRecommendation {
  id: string;
  title: string;
  category: 'EMERGENCIA' | 'FISCALIZACION' | 'URBANISMO' | 'SALUD_PUBLICA' | 'PREVENTIVO';
  description: string;
  responsibleEntity: string;
  executionWindowHours: number;
  expectedReductionPercent: number;
  legalBasis: string;
  estimatedCostLevel: 'BAJO' | 'MEDIO' | 'ALTO';
}

export interface DecisionEngineResult {
  isSufficient: boolean;
  insufficientReason?: string;
  classification: DecisionClassification;
  classificationColor: 'emerald' | 'amber' | 'rose' | 'slate';
  classificationTitle: string;
  
  // Environmental Priority Score (EPS)
  eps: ScoreBreakdown;
  
  // 13 Analysed Factors
  factors: ThirteenFactorsSummary;
  factorsList: FactorDetail[];
  
  // Explainability Core ("Este punto fue clasificado como...")
  explanation: {
    primaryStatement: string;
    keyDrivers: string[];
    riskSummary: string;
    regulatoryVerdict: string;
  };
  
  // Proposed Action Plans
  actionPlans: ActionPlanRecommendation[];
  
  // Point metadata snapshot
  pointSnapshot: {
    title: string;
    district: string;
    coordinates: [number, number];
    utm18s: string;
    parameter: string;
    measuredValue: number;
    unit: string;
    zoneType: string;
    date: string;
    source: string;
  };
}

export interface DecisionInputPoint {
  id?: string;
  title?: string;
  district?: string;
  address?: string;
  coordinates?: [number, number];
  parameter?: string;
  value?: number | null;
  unit?: string;
  date?: string;
  time?: string;
  source?: string;
  equipment?: string;
  zoneType?: ZoneType | string;
  dataOrigin?: string;
  reliabilityScore?: number;
  trend?: 'EMPEORANDO' | 'ESTABLE' | 'MEJORANDO';
  secondaryParameter?: {
    name: string;
    value: number;
    unit: string;
  };
}
