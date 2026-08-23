import { 
  AirParameterKey, 
  AirNormativeStandard, 
  IncaCategory, 
  ExceedanceAnalysisResult, 
  AirStatisticsSummary, 
  HourlyDataPoint 
} from '../types/airQuality';

/**
 * ESTÁNDARES OFICIALES DE CALIDAD AMBIENTAL DEL AIRE EN EL PERÚ
 * Marco Normativo: D.S. N° 003-2017-MINAM y R.M. N° 181-2016-MINAM
 */
export const PERUVIAN_AIR_NORMATIVE: Record<AirParameterKey, AirNormativeStandard> = {
  PM2_5: {
    key: 'PM2_5',
    code: 'PM2.5',
    name: 'Material Particulado Fino (PM2.5)',
    chemicalFormula: 'PM₂.₅',
    primaryTimeframe: '24h',
    ecaLimit: 50,
    unit: 'µg/m³',
    legalBasis: 'D.S. N° 003-2017-MINAM (Anexo I)',
    measurementMethod: 'Separación inercial/filtración o Atenuación de Rayos Beta (BAM-1020) / Microbalanza TEOM',
    healthEffects: 'Penetración alveolar profunda y pase al torrente circulatorio. Afecciones cardiopulmonares, crisis asmáticas e incremento de morbilidad respiratoria.',
    criticalSources: 'Combustión de diésel en transporte público/pesado, calderas industriales, quema de biomasa y resuspensión secundaria.',
    incaThresholds: {
      buenoMax: 25,     // 0 - 50 INCA
      moderadoMax: 50,  // 51 - 100 INCA (Límite ECA)
      maloMax: 125,     // 101 - 150 INCA
      cuidadoMax: 250   // > 150 INCA
    }
  },
  PM10: {
    key: 'PM10',
    code: 'PM10',
    name: 'Material Particulado Torácico (PM10)',
    chemicalFormula: 'PM₁₀',
    primaryTimeframe: '24h',
    ecaLimit: 100,
    unit: 'µg/m³',
    legalBasis: 'D.S. N° 003-2017-MINAM (Anexo I)',
    measurementMethod: 'Separación inercial/filtración Gravimétrica o Atenuación Beta',
    healthEffects: 'Irritación de vías respiratorias superiores, tos crónica, bronquitis y agravamiento de asma.',
    criticalSources: 'Tránsito en vías no pavimentadas, obras civiles, resuspensión de polvo del litoral y molienda mineral.',
    incaThresholds: {
      buenoMax: 50,
      moderadoMax: 100,
      maloMax: 200,
      cuidadoMax: 350
    }
  },
  SO2: {
    key: 'SO2',
    code: 'SO2',
    name: 'Dióxido de Azufre (SO2)',
    chemicalFormula: 'SO₂',
    primaryTimeframe: '24h',
    ecaLimit: 250,
    unit: 'µg/m³',
    legalBasis: 'D.S. N° 003-2017-MINAM (Anexo I)',
    measurementMethod: 'Fluorescencia Ultravioleta (Automático continuo)',
    healthEffects: 'Broncoconstricción refleja, espasmos respiratorios, irritación ocular y precursora de lluvia ácida (H2SO4).',
    criticalSources: 'Refinerías de petróleo, fundiciones, plantas de generación térmica y uso de combustibles con alto azufre.',
    incaThresholds: {
      buenoMax: 80,
      moderadoMax: 250,
      maloMax: 500,
      cuidadoMax: 1000
    }
  },
  NO2: {
    key: 'NO2',
    code: 'NO2',
    name: 'Dióxido de Nitrógeno (NO2)',
    chemicalFormula: 'NO₂',
    primaryTimeframe: '1h',
    ecaLimit: 200,
    unit: 'µg/m³',
    legalBasis: 'D.S. N° 003-2017-MINAM (Anexo I)',
    measurementMethod: 'Quimioluminiscencia en Fase Gaseosa',
    healthEffects: 'Inflamación de mucosas pulmonares, susceptibilidad a infecciones respiratorias y precursor clave de ozono troposférico (smog fotoquímico).',
    criticalSources: 'Tránsito automotor de alta densidad (gasolina y diésel) en cañones urbanos, hornos y plantas de energía.',
    incaThresholds: {
      buenoMax: 100,
      moderadoMax: 200,
      maloMax: 400,
      cuidadoMax: 800
    }
  },
  CO: {
    key: 'CO',
    code: 'CO',
    name: 'Monóxido de Carbono (CO)',
    chemicalFormula: 'CO',
    primaryTimeframe: '8h',
    ecaLimit: 10000, // 10 mg/m³ = 10,000 µg/m³
    unit: 'µg/m³',
    legalBasis: 'D.S. N° 003-2017-MINAM (Anexo I: 10 000 µg/m³ para 8 horas / 30 000 µg/m³ para 1 hora)',
    measurementMethod: 'Fotometría Infrarroja No Dispersiva (NDIR)',
    healthEffects: 'Formación de carboxihemoglobina (COHb), privando de oxígeno al miocardio y sistema nervioso central. Cefalea, mareos y fatiga.',
    criticalSources: 'Combustión incompleta en motores vehiculares descalibrados y congestiones en vías subterráneas.',
    incaThresholds: {
      buenoMax: 5000,
      moderadoMax: 10000,
      maloMax: 15000,
      cuidadoMax: 30000
    }
  },
  O3: {
    key: 'O3',
    code: 'O3',
    name: 'Ozono Troposférico (O3)',
    chemicalFormula: 'O₃',
    primaryTimeframe: '8h',
    ecaLimit: 100,
    unit: 'µg/m³',
    legalBasis: 'D.S. N° 003-2017-MINAM (Anexo I)',
    measurementMethod: 'Fotometría de Absorción Ultravioleta',
    healthEffects: 'Poderoso oxidante. Causa daño en tejido pulmonar, reduce función ventilatoria y agrava patologías alérgicas.',
    criticalSources: 'Contaminante secundario formado por radiación solar intensa sobre óxidos de nitrógeno (NOx) y compuestos orgánicos volátiles (COVs).',
    incaThresholds: {
      buenoMax: 50,
      moderadoMax: 100,
      maloMax: 160,
      cuidadoMax: 300
    }
  },
  PB_PM10: {
    key: 'PB_PM10',
    code: 'Pb en PM10',
    name: 'Plomo en Material Particulado (Pb)',
    chemicalFormula: 'Pb',
    primaryTimeframe: 'Mensual',
    ecaLimit: 1.5,
    unit: 'µg/m³',
    legalBasis: 'D.S. N° 003-2017-MINAM (Anexo I: 1.5 µg/m³ mensual / 0.5 µg/m³ anual)',
    measurementMethod: 'Espectrofotometría de Absorción Atómica o ICP-MS tras digestión ácida',
    healthEffects: 'Saturnismo, afección irreversible del neurodesarrollo infantil, daño renal y anemia por inhibición de síntesis de hemoglobina.',
    criticalSources: 'Depósitos minerales portuarios, fundición secundaria de baterías y reciclaje metalúrgico informal.',
    incaThresholds: {
      buenoMax: 0.75,
      moderadoMax: 1.5,
      maloMax: 3.0,
      cuidadoMax: 6.0
    }
  },
  BENZENE: {
    key: 'BENZENE',
    code: 'Benceno',
    name: 'Benceno (C6H6)',
    chemicalFormula: 'C₆H₆',
    primaryTimeframe: 'Anual',
    ecaLimit: 2.0,
    unit: 'µg/m³',
    legalBasis: 'D.S. N° 003-2017-MINAM (Anexo I)',
    measurementMethod: 'Cromatografía de Gases con Detector FID/MS',
    healthEffects: 'Carcinógeno humano comprobado (Grupo 1 IARC). Riesgo de leucemia mieloide y depresión hematopoyética.',
    criticalSources: 'Evaporación de gasolinas en grifos, refinerías y emisiones vehiculares sin catalizador.',
    incaThresholds: {
      buenoMax: 1.0,
      moderadoMax: 2.0,
      maloMax: 4.0,
      cuidadoMax: 8.0
    }
  },
  H2S: {
    key: 'H2S',
    code: 'H2S',
    name: 'Sulfuro de Hidrógeno (H2S)',
    chemicalFormula: 'H₂S',
    primaryTimeframe: '24h',
    ecaLimit: 150,
    unit: 'µg/m³',
    legalBasis: 'D.S. N° 003-2017-MINAM (Anexo I)',
    measurementMethod: 'Fluorescencia UV con Convertidor Catalítico',
    healthEffects: 'Olor fétido a huevo podrido, fatiga olfativa rápida, irritación conjuntival y náuseas.',
    criticalSources: 'Plantas de tratamiento de aguas residuales (PTAR), redes de alcantarillado e industrias pesqueras.',
    incaThresholds: {
      buenoMax: 75,
      moderadoMax: 150,
      maloMax: 300,
      cuidadoMax: 600
    }
  }
};

/**
 * Calcula el Índice Nacional de Calidad del Aire (INCA) y su categoría según R.M. 181-2016-MINAM
 */
export function calculateIncaIndex(param: AirParameterKey, value: number): { index: number; category: IncaCategory; label: string; color: string; bgClass: string; textClass: string; borderClass: string } {
  const meta = PERUVIAN_AIR_NORMATIVE[param] || PERUVIAN_AIR_NORMATIVE.PM2_5;
  const { buenoMax, moderadoMax, maloMax, cuidadoMax } = meta.incaThresholds;

  let inca = 0;
  let category: IncaCategory = 'BUENO';

  if (value <= buenoMax) {
    inca = Math.round((value / buenoMax) * 50);
    category = 'BUENO';
  } else if (value <= moderadoMax) {
    inca = Math.round(50 + ((value - buenoMax) / (moderadoMax - buenoMax)) * 50);
    category = 'MODERADO';
  } else if (value <= maloMax) {
    inca = Math.round(100 + ((value - moderadoMax) / (maloMax - moderadoMax)) * 50);
    category = 'MALO';
  } else {
    inca = Math.round(150 + ((value - maloMax) / (cuidadoMax - maloMax)) * 50);
    category = inca > 200 ? 'PELIGROSO' : 'CUIDADO';
  }

  const themes: Record<IncaCategory, { label: string; color: string; bgClass: string; textClass: string; borderClass: string }> = {
    BUENO: {
      label: 'BUENO (Cumple ECA)',
      color: '#10b981',
      bgClass: 'bg-emerald-500/20',
      textClass: 'text-emerald-300',
      borderClass: 'border-emerald-500/40'
    },
    MODERADO: {
      label: 'MODERADO (En Norma)',
      color: '#f59e0b',
      bgClass: 'bg-amber-500/20',
      textClass: 'text-amber-300',
      borderClass: 'border-amber-500/40'
    },
    MALO: {
      label: 'MALO (Supera ECA)',
      color: '#f97316',
      bgClass: 'bg-orange-500/20',
      textClass: 'text-orange-300',
      borderClass: 'border-orange-500/40'
    },
    CUIDADO: {
      label: 'CUIDADO / ALERTA',
      color: '#ef4444',
      bgClass: 'bg-rose-500/20',
      textClass: 'text-rose-300',
      borderClass: 'border-rose-500/40'
    },
    PELIGROSO: {
      label: 'EMERGENCIA SANITARIA',
      color: '#a855f7',
      bgClass: 'bg-purple-500/20',
      textClass: 'text-purple-300',
      borderClass: 'border-purple-500/40'
    }
  };

  const theme = themes[category];

  return {
    index: inca,
    category,
    ...theme
  };
}

/**
 * Evaluación Exhaustiva de Excedencia Normativa
 */
export function evaluateAirExceedance(param: AirParameterKey, value: number): ExceedanceAnalysisResult {
  const meta = PERUVIAN_AIR_NORMATIVE[param] || PERUVIAN_AIR_NORMATIVE.PM2_5;
  const isExceeded = value > meta.ecaLimit;
  const excessMagnitude = isExceeded ? Math.round((value - meta.ecaLimit) * 100) / 100 : 0;
  const excessPercentage = isExceeded ? Math.round(((value - meta.ecaLimit) / meta.ecaLimit) * 100) : 0;

  let severityLevel: ExceedanceAnalysisResult['severityLevel'] = 'CONFORME';
  let alertDescription = `Concentración de ${value} ${meta.unit} cumple con el Estándar de Calidad Ambiental (ECA: ${meta.ecaLimit} ${meta.unit}). Margen disponible: ${(meta.ecaLimit - value).toFixed(1)} ${meta.unit}.`;
  let regulatoryAction = 'Monitoreo preventivo y vigilancia continua según cronograma regular.';

  if (isExceeded) {
    if (excessPercentage <= 20) {
      severityLevel = 'EXCEDENCIA_MODERADA';
      alertDescription = `Superación leve del estándar (+${excessPercentage}% sobre el ECA de ${meta.ecaLimit} ${meta.unit}). Requiere verificación de fuentes emisoras inmediatas.`;
      regulatoryAction = 'Notificación preventiva a la autoridad ambiental local y refuerzo de barreras de contención.';
    } else if (excessPercentage <= 60) {
      severityLevel = 'EXCEDENCIA_SEVERA';
      alertDescription = `Superación crítica (+${excessPercentage}% sobre el ECA de ${meta.ecaLimit} ${meta.unit}). Alta exposición para población vulnerable en el radio de influencia.`;
      regulatoryAction = 'Inspección prioritaria de OEFA / Municipalidad Provincial y restricción temporal de actividades de alto impacto.';
    } else {
      severityLevel = 'EPISODIO_CRITICO';
      alertDescription = `Episodio de contaminación extrema (+${excessPercentage}% sobre el ECA). Concentración de ${value} ${meta.unit} representa riesgo agudo a la salud pública.`;
      regulatoryAction = 'Activación del protocolo de emergencia ambiental, desvío de flujos de tránsito pesado y alerta sanitaria a centros de salud (DIRIS/MINSA).';
    }
  } else if (value >= meta.ecaLimit * 0.8) {
    severityLevel = 'ALERTA_PREVENTIVA';
    alertDescription = `Concentración al ${( (value / meta.ecaLimit) * 100 ).toFixed(0)}% del límite normativo. Próximo al umbral máximo permisible.`;
    regulatoryAction = 'Vigilancia meteorológica intensiva ante eventual estancamiento de vientos.';
  }

  return {
    isExceeded,
    excessMagnitude,
    excessPercentage,
    limit: meta.ecaLimit,
    timeframe: meta.primaryTimeframe,
    severityLevel,
    alertDescription,
    regulatoryAction
  };
}

/**
 * Calcula estadísticas de una serie de mediciones
 */
export function calculateAirStatistics(values: number[], param: AirParameterKey, windSpeeds: number[] = [], windDirections: string[] = []): AirStatisticsSummary {
  if (values.length === 0) {
    return {
      currentValue: 0,
      currentInca: 'BUENO',
      incaValue: 0,
      averageConcentration: 0,
      maxConcentration: 0,
      minConcentration: 0,
      standardDeviation: 0,
      totalMeasurements: 0,
      exceedanceCount: 0,
      complianceRatePercent: 100,
      dominantWind: 'SO (Suroeste)',
      avgWindSpeed: 2.5,
      ventilationIndex: 'VENTILACIÓN MODERADA'
    };
  }

  const meta = PERUVIAN_AIR_NORMATIVE[param] || PERUVIAN_AIR_NORMATIVE.PM2_5;
  const currentVal = values[values.length - 1];
  const incaInfo = calculateIncaIndex(param, currentVal);

  const sum = values.reduce((a, b) => a + b, 0);
  const avg = sum / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);

  // Standard deviation
  const variance = values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  // Exceedance count
  const exceedances = values.filter(v => v > meta.ecaLimit).length;
  const complianceRate = Math.round(((values.length - exceedances) / values.length) * 100);

  // Wind analysis
  const avgWind = windSpeeds.length > 0 ? windSpeeds.reduce((a, b) => a + b, 0) / windSpeeds.length : 2.4;
  let dominant = 'SO (Suroeste)';
  if (windDirections.length > 0) {
    const counts: Record<string, number> = {};
    windDirections.forEach(w => { counts[w] = (counts[w] || 0) + 1; });
    dominant = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, dominant);
  }

  let ventilationIndex: AirStatisticsSummary['ventilationIndex'] = 'VENTILACIÓN MODERADA';
  if (avgWind < 1.5) {
    ventilationIndex = 'VENTILACIÓN DEFICIENTE';
  } else if (avgWind > 3.5) {
    ventilationIndex = 'ALTA DISPERSIÓN EÓLICA';
  }

  return {
    currentValue: Math.round(currentVal * 10) / 10,
    currentInca: incaInfo.category,
    incaValue: incaInfo.index,
    averageConcentration: Math.round(avg * 10) / 10,
    maxConcentration: Math.round(max * 10) / 10,
    minConcentration: Math.round(min * 10) / 10,
    standardDeviation: Math.round(stdDev * 100) / 100,
    totalMeasurements: values.length,
    exceedanceCount: exceedances,
    complianceRatePercent: complianceRate,
    dominantWind: dominant,
    avgWindSpeed: Math.round(avgWind * 10) / 10,
    ventilationIndex
  };
}

/**
 * Conversor de Unidades a la unidad estándar del ECA
 */
export function convertToNormativeUnit(value: number, fromUnit: string, toUnit: string, molecularWeightGPerMol: number = 46.0): number {
  if (fromUnit === toUnit) return value;

  // mg/m³ to µg/m³
  if (fromUnit === 'mg/m³' && toUnit === 'µg/m³') {
    return value * 1000;
  }
  // µg/m³ to mg/m³
  if (fromUnit === 'µg/m³' && toUnit === 'mg/m³') {
    return value / 1000;
  }

  // ppm to µg/m³ at 25°C and 1 atm: µg/m³ = ppm * (molecularWeight * 1000) / 24.45
  if (fromUnit === 'ppm' && toUnit === 'µg/m³') {
    return (value * molecularWeightGPerMol * 1000) / 24.45;
  }
  // ppb to µg/m³ at 25°C and 1 atm: µg/m³ = ppb * molecularWeight / 24.45
  if (fromUnit === 'ppb' && toUnit === 'µg/m³') {
    return (value * molecularWeightGPerMol) / 24.45;
  }

  return value;
}
