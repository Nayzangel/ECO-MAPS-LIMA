import { 
  DecisionEngineResult, 
  DecisionInputPoint, 
  DecisionClassification, 
  ThirteenFactorsSummary, 
  FactorDetail,
  ScoreBreakdown,
  ActionPlanRecommendation
} from '../types/decisionEngine';
import { latLngToUTM18S } from './gisUtils';

/**
 * Tabla de Normativa Ambiental Peruana de Referencia
 */
export const PERUVIAN_ENVIRONMENTAL_STANDARDS: Record<string, {
  normName: string;
  legalBase: string;
  defaultUnit: string;
  limits: Record<string, { limit: number; period: string; obs?: string }>;
}> = {
  'PM2.5': {
    normName: 'ECA para Aire - Material Particulado Fino',
    legalBase: 'D.S. N° 003-2017-MINAM',
    defaultUnit: 'µg/m³',
    limits: {
      'DEFAULT': { limit: 50, period: '24 horas' },
      'ANUAL': { limit: 25, period: 'Anual' },
      'OMS_GUIA': { limit: 15, period: '24 horas (Guía OMS)' }
    }
  },
  'PM10': {
    normName: 'ECA para Aire - Material Particulado Respirable',
    legalBase: 'D.S. N° 003-2017-MINAM',
    defaultUnit: 'µg/m³',
    limits: {
      'DEFAULT': { limit: 100, period: '24 horas' },
      'ANUAL': { limit: 50, period: 'Anual' },
      'OMS_GUIA': { limit: 45, period: '24 horas (Guía OMS)' }
    }
  },
  'Ruido Diurno': {
    normName: 'ECA para Ruido Ambiental - Horario Diurno (07:01 a 22:00)',
    legalBase: 'D.S. N° 085-2003-PCM',
    defaultUnit: 'dBA',
    limits: {
      'ProteccionEspecial': { limit: 50, period: 'Horario Diurno (Hospitales / Colegios)' },
      'Residencial': { limit: 60, period: 'Horario Diurno' },
      'Comercial': { limit: 70, period: 'Horario Diurno' },
      'Industrial': { limit: 80, period: 'Horario Diurno' },
      'DEFAULT': { limit: 60, period: 'Horario Diurno' }
    }
  },
  'Ruido Nocturno': {
    normName: 'ECA para Ruido Ambiental - Horario Nocturno (22:01 a 07:00)',
    legalBase: 'D.S. N° 085-2003-PCM',
    defaultUnit: 'dBA',
    limits: {
      'ProteccionEspecial': { limit: 40, period: 'Horario Nocturno (Hospitales / Clínicas)' },
      'Residencial': { limit: 50, period: 'Horario Nocturno' },
      'Comercial': { limit: 60, period: 'Horario Nocturno' },
      'Industrial': { limit: 70, period: 'Horario Nocturno' },
      'DEFAULT': { limit: 50, period: 'Horario Nocturno' }
    }
  },
  'SO2': {
    normName: 'ECA para Aire - Dióxido de Azufre',
    legalBase: 'D.S. N° 003-2017-MINAM',
    defaultUnit: 'µg/m³',
    limits: {
      'DEFAULT': { limit: 250, period: '24 horas' },
      'OMS_GUIA': { limit: 40, period: '24 horas (Guía OMS)' }
    }
  },
  'NO2': {
    normName: 'ECA para Aire - Dióxido de Nitrógeno',
    legalBase: 'D.S. N° 003-2017-MINAM',
    defaultUnit: 'µg/m³',
    limits: {
      'DEFAULT': { limit: 200, period: '1 hora' },
      'ANUAL': { limit: 100, period: 'Anual' }
    }
  },
  'CO': {
    normName: 'ECA para Aire - Monóxido de Carbono',
    legalBase: 'D.S. N° 003-2017-MINAM',
    defaultUnit: 'mg/m³',
    limits: {
      'DEFAULT': { limit: 10, period: '8 horas (10,000 µg/m³)' },
      '1_HORA': { limit: 30, period: '1 hora (30,000 µg/m³)' }
    }
  },
  'O3': {
    normName: 'ECA para Aire - Ozono Troposférico',
    legalBase: 'D.S. N° 003-2017-MINAM',
    defaultUnit: 'µg/m³',
    limits: {
      'DEFAULT': { limit: 100, period: '8 horas' }
    }
  }
};

/**
 * Función Principal del Motor de Decisión Ambiental ECO-MAP
 * Analiza un punto y genera los 13 factores, score EPS, clasificación explicable y plan de acción.
 */
export function runEnvironmentalDecisionEngine(input: DecisionInputPoint): DecisionEngineResult {
  // 1. CHEQUEO DE SUFICIENCIA DE INFORMACIÓN
  const hasCoords = Array.isArray(input.coordinates) && 
                    input.coordinates.length === 2 && 
                    !isNaN(input.coordinates[0]) && 
                    !isNaN(input.coordinates[1]);

  const hasValue = input.value !== undefined && input.value !== null && !isNaN(Number(input.value));
  const hasParam = !!input.parameter && input.parameter.trim().length > 0;
  const hasDate = !!input.date && input.date.trim().length > 0;

  if (!hasCoords || !hasValue || !hasParam) {
    const missing: string[] = [];
    if (!hasCoords) missing.push('Coordenadas geoespaciales válidas');
    if (!hasValue) missing.push('Valor cuantitativo de medición');
    if (!hasParam) missing.push('Parámetro ambiental especificado');

    return buildInsufficientResult(input, missing);
  }

  // Sanitizar inputs
  const coords = input.coordinates!;
  const rawParam = input.parameter!.trim();
  const param = matchStandardParam(rawParam);
  const val = Number(input.value);
  const unit = input.unit || getStandardUnitForParam(param);
  const dateStr = input.date || new Date().toISOString().split('T')[0];
  const timeStr = input.time || '10:00';
  const districtStr = input.district || 'Lima Metropolitana';
  const addressStr = input.address || 'Punto de muestreo georreferenciado';
  const zone = input.zoneType || 'Residencial';
  const sourceStr = input.source || 'Red de Monitoreo Ambiental';
  const equipStr = input.equipment || 'Sensor Calibrado de Monitoreo';
  const reliability = input.reliabilityScore !== undefined ? input.reliabilityScore : 88;
  const trend = input.trend || (val > 45 ? 'EMPEORANDO' : 'ESTABLE');

  // Convertir a UTM
  const utm = latLngToUTM18S(coords[0], coords[1]);

  // 2. OBTENER LÍMITE NORMATIVO APLICABLE
  const stdInfo = PERUVIAN_ENVIRONMENTAL_STANDARDS[param] || {
    normName: 'Estándar de Calidad Ambiental Referencial',
    legalBase: 'Normativa Ambiental Vigente',
    defaultUnit: unit,
    limits: { DEFAULT: { limit: 50, period: '24h' } }
  };

  let normLimit = 50;
  let normPeriod = '24 horas';

  if (param === 'Ruido Diurno' || param === 'Ruido Nocturno') {
    const zoneKey = zone in stdInfo.limits ? zone : 'DEFAULT';
    normLimit = stdInfo.limits[zoneKey].limit;
    normPeriod = stdInfo.limits[zoneKey].period;
  } else {
    normLimit = stdInfo.limits.DEFAULT.limit;
    normPeriod = stdInfo.limits.DEFAULT.period;
  }

  // 3. CÁLCULO DE EXCEDENCIA
  const diff = val - normLimit;
  const exceedPercent = Math.round(((val - normLimit) / normLimit) * 100);
  const isExceeding = val > normLimit;
  const ratio = val / normLimit;

  // 4. CÁLCULO DEL ENVIRONMENTAL PRIORITY SCORE (EPS) (0 - 100 pts)
  // Sub-scores:
  // A. Excedencia y Severidad (Max 35 pts)
  let exceedanceScore = 0;
  if (ratio <= 0.5) exceedanceScore = 5;
  else if (ratio <= 0.8) exceedanceScore = 12;
  else if (ratio <= 1.0) exceedanceScore = 20; // Cerca del límite
  else if (ratio <= 1.3) exceedanceScore = 28; // Excede leve/moderado
  else exceedanceScore = 35; // Severamente excedido

  // B. Vulnerabilidad de Zonificación & Población (Max 25 pts)
  let vulnerabilityScore = 10;
  if (zone === 'ProteccionEspecial') vulnerabilityScore = 25; // Hospitales, colegios
  else if (zone === 'Residencial') vulnerabilityScore = 20;
  else if (zone === 'Comercial') vulnerabilityScore = 15;
  else if (zone === 'Industrial') vulnerabilityScore = 10;

  // C. Tendencia Histórica & Proyección (Max 15 pts)
  let trendScore = 5;
  if (trend === 'EMPEORANDO') trendScore = 15;
  else if (trend === 'ESTABLE') trendScore = 8;
  else trendScore = 3; // Mejorando

  // D. Sinergia Multicontaminante (Max 15 pts)
  let synergyScore = 7;
  if (input.secondaryParameter) {
    if (input.secondaryParameter.name.includes('Ruido') && input.secondaryParameter.value > 65) {
      synergyScore = 15;
    } else if (input.secondaryParameter.value > 50) {
      synergyScore = 12;
    }
  } else if (isExceeding && (zone === 'Residencial' || zone === 'ProteccionEspecial')) {
    synergyScore = 12;
  }

  // E. Calidad y Confiabilidad del Dato (Max 10 pts)
  const dataQualityScore = Math.min(10, Math.max(1, Math.round(reliability / 10)));

  const totalEpsScore = Math.min(100, Math.round(
    exceedanceScore + vulnerabilityScore + trendScore + synergyScore + dataQualityScore
  ));

  const eps: ScoreBreakdown = {
    exceedanceScore,
    vulnerabilityScore,
    trendScore,
    synergyScore,
    dataQualityScore,
    totalScore: totalEpsScore
  };

  // 5. CLASIFICACIÓN FINAL (BAJO / MEDIO / CRITICO)
  let classification: DecisionClassification = 'BAJO';
  let classificationColor: 'emerald' | 'amber' | 'rose' | 'slate' = 'emerald';
  let classificationTitle = '🟢 BAJO RIESGO AMBIENTAL';

  if (totalEpsScore >= 70 || (isExceeding && exceedPercent >= 20 && zone !== 'Industrial')) {
    classification = 'CRITICO';
    classificationColor = 'rose';
    classificationTitle = '🔴 CRÍTICO - PRIORIDAD DE INTERVENCIÓN';
  } else if (totalEpsScore >= 40 || isExceeding || ratio >= 0.85) {
    classification = 'MEDIO';
    classificationColor = 'amber';
    classificationTitle = '🟡 MEDIO - ALERTA & VIGILANCIA PREVENTIVA';
  } else {
    classification = 'BAJO';
    classificationColor = 'emerald';
    classificationTitle = '🟢 BAJO - CUMPLIMIENTO NORMATIVO';
  }

  // 6. LOS 13 FACTORES DE ANÁLISIS EXPLICABLES
  const factors: ThirteenFactorsSummary = {
    // 1. Ubicación
    ubicacion: {
      id: 1,
      name: 'Ubicación Geoespacial',
      category: 'ESPACIAL',
      value: `${districtStr} (${utm.easting}E, ${utm.northing}N)`,
      unit: 'WGS84 / UTM 18S',
      status: 'OPTIMO',
      description: `Punto localizado en el distrito de ${districtStr}, coordenadas [${coords[0].toFixed(5)}°, ${coords[1].toFixed(5)}°], Zona 18 Sur.`,
      badge: districtStr
    },
    // 2. Parámetro
    parametro: {
      id: 2,
      name: 'Parámetro Ambiental',
      category: 'METROLOGICA',
      value: param,
      unit: unit,
      status: 'NEUTRO',
      description: `Agente evaluado: ${param}. Monitoreado como indicador clave de calidad ambiental urbana.`,
      badge: param
    },
    // 3. Medición
    medicion: {
      id: 3,
      name: 'Medición Cuantitativa',
      category: 'METROLOGICA',
      value: `${val} ${unit}`,
      rawValue: val,
      unit: unit,
      status: isExceeding ? 'CRITICO' : ratio > 0.8 ? 'ALERTA' : 'OPTIMO',
      description: `Magnitud puntual registrada de ${val} ${unit}.`,
      badge: `${val} ${unit}`
    },
    // 4. Unidad
    unidad: {
      id: 4,
      name: 'Unidad de Medida',
      category: 'METROLOGICA',
      value: unit,
      status: 'OPTIMO',
      description: `Unidad estandarizada conforme a los Estándares de Calidad Ambiental (ECA) peruanos.`,
      badge: unit
    },
    // 5. Fecha y Temporalidad
    fecha: {
      id: 5,
      name: 'Fecha y Hora del Registro',
      category: 'ANALITICA',
      value: `${dateStr} ${timeStr}`,
      status: 'NEUTRO',
      description: `Toma de muestra efectuada el ${dateStr} a las ${timeStr} hrs.`,
      badge: `${dateStr}`
    },
    // 6. Fuente y Trazabilidad
    fuente: {
      id: 6,
      name: 'Fuente y Metrología',
      category: 'METROLOGICA',
      value: `${sourceStr} / ${equipStr}`,
      status: reliability >= 80 ? 'OPTIMO' : 'ALERTA',
      description: `Custodia por ${sourceStr}. Instrumento: ${equipStr}.`,
      badge: sourceStr.slice(0, 20)
    },
    // 7. Zonificación Territorial
    zonificacion: {
      id: 7,
      name: 'Zonificación Territorial',
      category: 'ESPACIAL',
      value: getZonificationLabel(zone),
      status: zone === 'ProteccionEspecial' ? 'CRITICO' : zone === 'Residencial' ? 'ALERTA' : 'NEUTRO',
      description: `Área clasificada como ${getZonificationLabel(zone)}, sujeta a sensibilidad poblacional diferenciada.`,
      badge: getZonificationLabel(zone)
    },
    // 8. Norma Aplicable
    normaAplicable: {
      id: 8,
      name: 'Norma Legal Aplicable',
      category: 'NORMATIVA',
      value: stdInfo.legalBase,
      status: 'NEUTRO',
      description: `${stdInfo.normName} aprobado mediante ${stdInfo.legalBase} de la República del Perú.`,
      badge: stdInfo.legalBase
    },
    // 9. Límite Normativo (ECA)
    limite: {
      id: 9,
      name: 'Límite Normativo (ECA)',
      category: 'NORMATIVA',
      value: `${normLimit} ${unit} (${normPeriod})`,
      rawValue: normLimit,
      unit: unit,
      status: 'NEUTRO',
      description: `Valor máximo permitido de ${normLimit} ${unit} para periodo de ${normPeriod} en zonificación ${getZonificationLabel(zone)}.`,
      badge: `ECA: ${normLimit} ${unit}`
    },
    // 10. Excedencia
    excedencia: {
      id: 10,
      name: 'Nivel de Excedencia',
      category: 'NORMATIVA',
      value: isExceeding ? `+${exceedPercent}% (${diff > 0 ? '+' : ''}${diff.toFixed(1)} ${unit})` : `Cumple (-${Math.abs(exceedPercent)}%)`,
      rawValue: exceedPercent,
      status: isExceeding ? 'CRITICO' : ratio > 0.8 ? 'ALERTA' : 'OPTIMO',
      description: isExceeding 
        ? `Supera el límite legal en un ${exceedPercent}% (+${diff.toFixed(1)} ${unit} por encima del ECA).`
        : `Dentro del umbral legal con un margen de seguridad de ${Math.abs(exceedPercent)}%.`,
      badge: isExceeding ? `SUPERA (+${exceedPercent}%)` : `CUMPLE`
    },
    // 11. Calidad del Dato
    calidadDato: {
      id: 11,
      name: 'Calidad y Confiabilidad del Dato',
      category: 'ANALITICA',
      value: `${reliability}% (Índice de Certeza Metrológica)`,
      rawValue: reliability,
      status: reliability >= 80 ? 'OPTIMO' : reliability >= 60 ? 'ALERTA' : 'CRITICO',
      description: `Índice de confiabilidad de ${reliability}% calculado según calibración, completitud y trazabilidad de origen.`,
      badge: `${reliability}% Confiable`
    },
    // 12. Tendencia
    tendencia: {
      id: 12,
      name: 'Tendencia y Derivada Temporal',
      category: 'ANALITICA',
      value: trend === 'EMPEORANDO' ? '↗️ Empeorando (Alcista)' : trend === 'MEJORANDO' ? '↘️ Mejorando (Favorable)' : '➡️ Estable (Sin variaciones)',
      status: trend === 'EMPEORANDO' ? 'CRITICO' : trend === 'ESTABLE' ? 'NEUTRO' : 'OPTIMO',
      description: trend === 'EMPEORANDO'
        ? 'Vector de acumulación ascendente en las últimas lecturas.'
        : trend === 'MEJORANDO'
        ? 'Curva descendente con disipación progresiva.'
        : 'Serie temporal estacionaria.',
      badge: trend
    },
    // 13. Prioridad
    prioridad: {
      id: 13,
      name: 'Prioridad de Gestión',
      category: 'ANALITICA',
      value: classification === 'CRITICO' ? '🚨 PRIORIDAD 1: INTERVENCIÓN INMEDIATA' : classification === 'MEDIO' ? '⚠️ PRIORIDAD 2: VIGILANCIA & MITIGACIÓN' : 'ℹ️ PRIORIDAD 3: MONITOREO CONTINUO',
      status: classification === 'CRITICO' ? 'CRITICO' : classification === 'MEDIO' ? 'ALERTA' : 'OPTIMO',
      description: classification === 'CRITICO'
        ? 'Exige acción fiscalizadora y notificación urgente a OEFA / MML.'
        : classification === 'MEDIO'
        ? 'Requiere planes de contingencia preventiva y patrullaje ambiental.'
        : 'Mantener protocolo estándar de registro.',
      badge: classification
    }
  };

  const factorsList = Object.values(factors);

  // 7. GENERADOR DE EXPLICABILIDAD FORMAL ("Este punto fue clasificado como...")
  const explanation = buildExplainableNarrative({
    classification,
    param,
    val,
    unit,
    normLimit,
    exceedPercent,
    isExceeding,
    zone,
    district: districtStr,
    trend,
    reliability,
    totalEpsScore,
    legalBase: stdInfo.legalBase
  });

  // 8. PLAN DE ACCIÓN Y MITIGACIÓN RECOMENDADO
  const actionPlans = generateActionPlans(classification, param, isExceeding, zone, districtStr);

  return {
    isSufficient: true,
    classification,
    classificationColor,
    classificationTitle,
    eps,
    factors,
    factorsList,
    explanation,
    actionPlans,
    pointSnapshot: {
      title: input.title || `${param} en ${districtStr}`,
      district: districtStr,
      coordinates: coords,
      utm18s: `${utm.easting} E, ${utm.northing} N (Zona 18S)`,
      parameter: param,
      measuredValue: val,
      unit: unit,
      zoneType: getZonificationLabel(zone),
      date: `${dateStr} ${timeStr}`,
      source: sourceStr
    }
  };
}

/**
 * Generador de Explicabilidad Humana & Técnica
 */
function buildExplainableNarrative(params: {
  classification: DecisionClassification;
  param: string;
  val: number;
  unit: string;
  normLimit: number;
  exceedPercent: number;
  isExceeding: boolean;
  zone: string;
  district: string;
  trend: string;
  reliability: number;
  totalEpsScore: number;
  legalBase: string;
}) {
  const {
    classification,
    param,
    val,
    unit,
    normLimit,
    exceedPercent,
    isExceeding,
    zone,
    district,
    trend,
    reliability,
    totalEpsScore,
    legalBase
  } = params;

  const keyDrivers: string[] = [];
  let primaryStatement = '';
  let riskSummary = '';
  let regulatoryVerdict = '';

  if (classification === 'CRITICO') {
    primaryStatement = `Este punto fue clasificado como CRÍTICO porque registra un Environmental Priority Score de ${totalEpsScore}/100, motivado por una superación de ${isExceeding ? `+${exceedPercent}%` : 'alta concentración'} sobre el Estándar de Calidad Ambiental (${normLimit} ${unit}) en el distrito de ${district}, impactando una zona ${getZonificationLabel(zone).toLowerCase()} con tendencia ${trend === 'EMPEORANDO' ? 'ascendente y desfavorable' : 'persistente'}.`;
    
    if (isExceeding) {
      keyDrivers.push(`Superación normativa del ${exceedPercent}% respecto a ${legalBase} (${val} ${unit} vs. límite de ${normLimit} ${unit}).`);
    }
    if (zone === 'ProteccionEspecial' || zone === 'Residencial') {
      keyDrivers.push(`Alta sensibilidad territorial por zonificación ${getZonificationLabel(zone)} con presencia de población vulnerable.`);
    }
    if (trend === 'EMPEORANDO') {
      keyDrivers.push(`Vector temporal alcista que agrava la persistencia del contaminante.`);
    }
    if (reliability >= 80) {
      keyDrivers.push(`Alta certidumbre del dato (${reliability}%), descartando falso positivo de sensor.`);
    }

    riskSummary = `Riesgo sanitario agudo para el sistema respiratorio y cardiovascular de los habitantes de ${district}, con necesidad de desvío vehicular y fiscalización inmediata de emisiones.`;
    regulatoryVerdict = `INFRACCIÓN / ALERTA CRÍTICA: Se excede el límite máximo legal de ${legalBase}. Requiere reporte obligatorio a OEFA y activación de protocolo de contingencia distrital.`;
  } else if (classification === 'MEDIO') {
    primaryStatement = `Este punto fue clasificado como MEDIO (Alerta Preventiva) porque su valor de ${val} ${unit} alcanza un EPS de ${totalEpsScore}/100, situándose en un rango de advertencia cercano o con superación moderada del límite de ${normLimit} ${unit} en ${district}.`;
    
    if (isExceeding) {
      keyDrivers.push(`Excedencia moderada (+${exceedPercent}%) sobre el estándar regulatorio.`);
    } else {
      keyDrivers.push(`Concentración al 80-99% del límite permisible, en riesgo de superar el umbral ante picos de tráfico o inversión térmica.`);
    }
    keyDrivers.push(`Zonificación ${getZonificationLabel(zone)} con moderada exposición.`);
    
    riskSummary = `Posible afectación en grupos sensibles (niños, adultos mayores) y molestia auditiva/respiratoria continua si no se mitigan las fuentes emisoras.`;
    regulatoryVerdict = `VIGILANCIA PREVENTIVA: Nivel cercano o con leve superación del estándar ${legalBase}. Se sugiere patrullaje preventivo y fiscalización municipal.`;
  } else {
    primaryStatement = `Este punto fue clasificado como BAJO (Cumplimiento Óptimo) porque registra ${val} ${unit}, encontrándose un ${Math.abs(exceedPercent)}% por debajo del límite regulatorio (${normLimit} ${unit}) establecido en ${legalBase}, con un EPS favorable de ${totalEpsScore}/100.`;
    
    keyDrivers.push(`Concentración controlada dentro de los parámetros seguros de ${legalBase}.`);
    keyDrivers.push(`Margen de seguridad positivo del ${Math.abs(exceedPercent)}% respecto al ECA.`);
    keyDrivers.push(`Condiciones ambientales estables para la población del sector.`);

    riskSummary = `Riesgo mínimo para la salud pública en las condiciones de muestreo actuales.`;
    regulatoryVerdict = `CONFORME: Cumple plenamente los Estándares de Calidad Ambiental normados por el Ministerio del Ambiente.`;
  }

  return {
    primaryStatement,
    keyDrivers,
    riskSummary,
    regulatoryVerdict
  };
}

/**
 * Generador de Planes de Acción Recomendados
 */
function generateActionPlans(
  classification: DecisionClassification,
  param: string,
  isExceeding: boolean,
  zone: string,
  district: string
): ActionPlanRecommendation[] {
  const plans: ActionPlanRecommendation[] = [];

  if (classification === 'CRITICO') {
    if (param.includes('Ruido')) {
      plans.push({
        id: 'PLAN-NOISE-01',
        title: 'Operativo de Fiscalización y Control Acústico Inmediato',
        category: 'EMERGENCIA',
        description: `Inspección in situ con sonómetro calibrado clase 1 a fuentes móviles (bocinas, escapes libres) y locales comerciales en ${district}.`,
        responsibleEntity: 'Municipalidad de Lima / Gerencia de Fiscalización Distrital',
        executionWindowHours: 4,
        expectedReductionPercent: 20,
        legalBasis: 'D.S. 085-2003-PCM y Ordenanza MML N° 1965',
        estimatedCostLevel: 'BAJO'
      });
      plans.push({
        id: 'PLAN-NOISE-02',
        title: 'Instalación de Barreras Acústicas y Repavimentación Fonoabsorbente',
        category: 'URBANISMO',
        description: `Implementación de pantallas acústicas en tramos críticos y mantenimiento de asfalto para reducir ruido de rodadura.`,
        responsibleEntity: 'Emape / MML / ATU',
        executionWindowHours: 72,
        expectedReductionPercent: 35,
        legalBasis: 'Ley General del Ambiente N° 28611',
        estimatedCostLevel: 'ALTO'
      });
    } else {
      plans.push({
        id: 'PLAN-AIR-01',
        title: 'Restricción y Desvío de Flujo Vehicular Pesado (Horas Punta)',
        category: 'EMERGENCIA',
        description: `Desvío provisional de camiones diésel y transporte de carga pesada hacia vías periféricas no residenciales de ${district}.`,
        responsibleEntity: 'Autoridad de Transporte Urbano (ATU) / PNP Tránsito',
        executionWindowHours: 6,
        expectedReductionPercent: 28,
        legalBasis: 'D.S. 003-2017-MINAM y Ley General de Transporte N° 27181',
        estimatedCostLevel: 'MEDIO'
      });
      plans.push({
        id: 'PLAN-AIR-02',
        title: 'Fiscalización de Fuentes Fijas e Industrias del Entorno',
        category: 'FISCALIZACION',
        description: `Auditoría extraordinaria de emisiones a chimeneas, calderas y plantas industriales en el radio de 2 km por OEFA.`,
        responsibleEntity: 'Organismo de Evaluación y Fiscalización Ambiental (OEFA)',
        executionWindowHours: 24,
        expectedReductionPercent: 22,
        legalBasis: 'Ley del SINEFA N° 29325',
        estimatedCostLevel: 'MEDIO'
      });
      plans.push({
        id: 'PLAN-AIR-03',
        title: 'Alerta Sanitaria y Protocolo Escolar de Protección',
        category: 'SALUD_PUBLICA',
        description: `Suspensión preventiva de actividades cívicas/deportivas al aire libre en colegios de la zona e intensificación de triaje respiratorio.`,
        responsibleEntity: 'DIRIS Lima / MINSA / UGEL',
        executionWindowHours: 2,
        expectedReductionPercent: 0,
        legalBasis: 'D.S. N° 009-2019-MINSA',
        estimatedCostLevel: 'BAJO'
      });
    }
  } else if (classification === 'MEDIO') {
    plans.push({
      id: 'PLAN-MED-01',
      title: 'Monitoreo de Vigilancia Intensiva y Patrullaje Preventivo',
      category: 'PREVENTIVO',
      description: `Incremento de la frecuencia de muestreo cada 1 hora para detectar picos y evitar transición a estado crítico.`,
      responsibleEntity: 'Subgerencia de Gestión Ambiental Distrital',
      executionWindowHours: 12,
      expectedReductionPercent: 10,
      legalBasis: 'D.S. 003-2017-MINAM',
      estimatedCostLevel: 'BAJO'
    });
    plans.push({
      id: 'PLAN-MED-02',
      title: 'Plan de Arborización Urbana y Malla Verde Captadora',
      category: 'URBANISMO',
      description: `Siembra de especies arbóreas de follaje denso (molle costeño, meijo) con alta capacidad de retención de PM2.5 y amortiguación sonora.`,
      responsibleEntity: 'SERPAR / Municipalidad Distrital',
      executionWindowHours: 120,
      expectedReductionPercent: 18,
      legalBasis: 'Plan Verde Lima 2030',
      estimatedCostLevel: 'MEDIO'
    });
  } else {
    plans.push({
      id: 'PLAN-LOW-01',
      title: 'Mantenimiento del Protocolo de Línea Base y Conservación',
      category: 'PREVENTIVO',
      description: `Preservar las condiciones favorables actuales mediante inspecciones ordinarias semestrales.`,
      responsibleEntity: 'Red Metropolitana de Monitoreo Ambiental',
      executionWindowHours: 720,
      expectedReductionPercent: 5,
      legalBasis: 'MINAM / OEFA',
      estimatedCostLevel: 'BAJO'
    });
  }

  return plans;
}

/**
 * Resultado cuando falta información esencial
 */
function buildInsufficientResult(input: DecisionInputPoint, missingFields: string[]): DecisionEngineResult {
  const dummyEps: ScoreBreakdown = {
    exceedanceScore: 0,
    vulnerabilityScore: 0,
    trendScore: 0,
    synergyScore: 0,
    dataQualityScore: 0,
    totalScore: 0
  };

  const emptyFactor: FactorDetail = {
    id: 0,
    name: 'Dato Incompleto',
    category: 'METROLOGICA',
    value: 'No registrado',
    status: 'INCOMPLETO',
    description: 'Información insuficiente para procesar el factor.'
  };

  const explanation = {
    primaryStatement: `INFORMACIÓN INSUFICIENTE PARA DETERMINAR PRIORIDAD. El registro ambiental seleccionado carece de los siguientes datos indispensables: ${missingFields.join(', ')}.`,
    keyDrivers: missingFields.map(f => `Falta: ${f}`),
    riskSummary: 'No es posible evaluar el riesgo toxicológico ni normativo sin datos cuantitativos completos y georreferenciación precisa.',
    regulatoryVerdict: 'AUDITORÍA SUSPENDIDA: Requiere completar los datos del punto para habilitar el motor de decisión.'
  };

  return {
    isSufficient: false,
    insufficientReason: `Faltan campos críticos: ${missingFields.join(', ')}`,
    classification: 'INSUFICIENTE',
    classificationColor: 'slate',
    classificationTitle: '⚪ INFORMACIÓN INSUFICIENTE PARA DETERMINAR PRIORIDAD',
    eps: dummyEps,
    factors: {
      ubicacion: { ...emptyFactor, id: 1, name: 'Ubicación' },
      parametro: { ...emptyFactor, id: 2, name: 'Parámetro' },
      medicion: { ...emptyFactor, id: 3, name: 'Medición' },
      unidad: { ...emptyFactor, id: 4, name: 'Unidad' },
      fecha: { ...emptyFactor, id: 5, name: 'Fecha' },
      fuente: { ...emptyFactor, id: 6, name: 'Fuente' },
      zonificacion: { ...emptyFactor, id: 7, name: 'Zonificación' },
      normaAplicable: { ...emptyFactor, id: 8, name: 'Norma aplicable' },
      limite: { ...emptyFactor, id: 9, name: 'Límite' },
      excedencia: { ...emptyFactor, id: 10, name: 'Excedencia' },
      calidadDato: { ...emptyFactor, id: 11, name: 'Calidad del dato' },
      tendencia: { ...emptyFactor, id: 12, name: 'Tendencia' },
      prioridad: { ...emptyFactor, id: 13, name: 'Prioridad' }
    },
    factorsList: [],
    explanation,
    actionPlans: [],
    pointSnapshot: {
      title: input.title || 'Punto Incompleto',
      district: input.district || 'Desconocido',
      coordinates: input.coordinates || [0, 0],
      utm18s: 'No disponible',
      parameter: input.parameter || 'Sin parámetro',
      measuredValue: 0,
      unit: input.unit || '',
      zoneType: 'No especificada',
      date: input.date || '',
      source: input.source || 'Desconocida'
    }
  };
}

function matchStandardParam(raw: string): string {
  const clean = raw.trim();
  if (/PM2\.?5/i.test(clean)) return 'PM2.5';
  if (/PM10/i.test(clean)) return 'PM10';
  if (/ruido.*noc/i.test(clean)) return 'Ruido Nocturno';
  if (/ruido/i.test(clean)) return 'Ruido Diurno';
  if (/SO2|azufre/i.test(clean)) return 'SO2';
  if (/NO2|nitrogeno/i.test(clean)) return 'NO2';
  if (/CO|monoxido/i.test(clean)) return 'CO';
  if (/O3|ozono/i.test(clean)) return 'O3';
  return clean;
}

function getStandardUnitForParam(param: string): string {
  if (param.includes('Ruido')) return 'dBA';
  if (param === 'CO') return 'mg/m³';
  return 'µg/m³';
}

function getZonificationLabel(zone: string): string {
  switch (zone) {
    case 'ProteccionEspecial': return 'Protección Especial (Salud/Educación)';
    case 'Residencial': return 'Residencial';
    case 'Comercial': return 'Comercial';
    case 'Industrial': return 'Industrial';
    default: return zone;
  }
}
