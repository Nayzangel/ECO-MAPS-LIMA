import { 
  NoiseZoneType, 
  NoiseTimePeriod, 
  NoiseNormativeReference, 
  NoisePriorityLevel,
  NoiseCalibrationInfo,
  AcousticMethodologyType
} from '../types/noiseQuality';

/**
 * ESTÁNDARES NACIONALES DE CALIDAD AMBIENTAL PARA RUIDO (D.S. N° 085-2003-PCM)
 */
export const PERUVIAN_NOISE_NORMATIVE: Record<NoiseZoneType, NoiseNormativeReference> = {
  ProteccionEspecial: {
    zoneType: 'ProteccionEspecial',
    title: 'Zona de Protección Especial',
    dayLimit: 50,
    nightLimit: 40,
    legalBasis: 'D.S. N° 085-2003-PCM - Anexo 1',
    description: 'Área que requiere condiciones especiales de tranquilidad y sosiego, tales como entornos inmediatos a centros hospitalarios, policlínicos, colegios, asilos y áreas naturales.',
    examples: 'Hospital Rebagliati, Hospital Almenara, Hospital del Niño, Colegios Emblemáticos, Santuarios.',
    healthEffects: 'Alteración grave del descanso y recuperación de convalecientes, interferencia cognitiva en el aprendizaje escolar y estrés fisiológico elevado.'
  },
  Residencial: {
    zoneType: 'Residencial',
    title: 'Zona Residencial',
    dayLimit: 60,
    nightLimit: 50,
    legalBasis: 'D.S. N° 085-2003-PCM - Anexo 1',
    description: 'Áreas urbanas destinadas predominantemente a la vivienda unifamiliar o multifamiliar, así como al uso residencial compatible.',
    examples: 'Urbanizaciones de San Borja, Jesús María, Surco, San Isidro (sector residencial), Los Olivos.',
    healthEffects: 'Trastornos del sueño (insomnio nocturno), irritabilidad, incremento del riesgo cardiovascular por exposición crónica y fatiga diurna.'
  },
  Comercial: {
    zoneType: 'Comercial',
    title: 'Zona Comercial',
    dayLimit: 70,
    nightLimit: 60,
    legalBasis: 'D.S. N° 085-2003-PCM - Anexo 1',
    description: 'Áreas destinadas al comercio metropolitano, distrital, local, servicios, recreación y actividades financieras con flujo peatonal y vehicular.',
    examples: 'Av. Abancay, Mesa Redonda, Jirón de la Unión, Gamarra, Centro Financiero San Isidro, Av. Javier Prado.',
    healthEffects: 'Interferencia en la comunicación verbal (dificultad para hablar a distancia normal), estrés acústico ocupacional y cefaleas tensionales.'
  },
  Industrial: {
    zoneType: 'Industrial',
    title: 'Zona Industrial',
    dayLimit: 80,
    nightLimit: 70,
    legalBasis: 'D.S. N° 085-2003-PCM - Anexo 1',
    description: 'Áreas destinadas a la localización y funcionamiento de establecimientos industriales, manufactureros, depósitos y logística de carga pesada.',
    examples: 'Av. Argentina (Cercado de Lima), Carretera Central (Ate/Santa Anita), Zona Industrial Callao (Ventanilla/Faucett).',
    healthEffects: 'Riesgo de hipoacusia inducida por ruido (trauma acústico crónico), fatiga auditiva y elevación persistente de la presión arterial.'
  },
  Mixta: {
    zoneType: 'Mixta',
    title: 'Zona Mixta (Comercial / Residencial)',
    dayLimit: 65,
    nightLimit: 55,
    legalBasis: 'D.S. N° 085-2003-PCM - Criterio de Ponderación Normativa',
    description: 'Áreas con coexistencia de uso residencial y comercial en un mismo frente urbano o eje vial distrital.',
    examples: 'Avenidas principales con comercio en primer piso y viviendas superiores en Miraflores, Lince o Magdalena.',
    healthEffects: 'Conflicto de usos nocturnos, molestia moderada a severa durante horas de descanso y perturbación del confort acústico.'
  }
};

/**
 * Determina automáticamente el periodo acústico (DIURNO o NOCTURNO)
 * según el horario oficial del D.S. N° 085-2003-PCM:
 * - Diurno: de 07:01 a 22:00 horas
 * - Nocturno: de 22:01 a 07:00 horas
 */
export function determineNoisePeriod(timeString: string): NoiseTimePeriod {
  if (!timeString) return 'DIURNO';
  const parts = timeString.split(':');
  if (parts.length < 2) return 'DIURNO';
  
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  
  if (isNaN(hours) || isNaN(minutes)) return 'DIURNO';

  const totalMinutes = hours * 60 + minutes;
  const dayStartMinutes = 7 * 60 + 1; // 07:01
  const dayEndMinutes = 22 * 60;      // 22:00

  if (totalMinutes >= dayStartMinutes && totalMinutes <= dayEndMinutes) {
    return 'DIURNO';
  } else {
    return 'NOCTURNO';
  }
}

/**
 * Obtiene el límite ECA aplicable para una zonificación y horario dados
 */
export function getApplicableEcaLimit(zone: NoiseZoneType, period: NoiseTimePeriod): number {
  const norm = PERUVIAN_NOISE_NORMATIVE[zone] || PERUVIAN_NOISE_NORMATIVE.Residencial;
  return period === 'DIURNO' ? norm.dayLimit : norm.nightLimit;
}

/**
 * Evalúa la calibración según el estándar ISO 1996:
 * La diferencia absoluta entre la calibración previa y posterior (|Pre - Post|)
 * no debe exceder de 0.5 dB.
 */
export function evaluateCalibration(
  preDb: number,
  postDb: number,
  expiryDateStr?: string
): {
  deltaDb: number;
  isValid: boolean;
  message: string;
} {
  const delta = Math.abs(preDb - postDb);
  const isDeltaValid = delta <= 0.5;
  
  let isExpired = false;
  if (expiryDateStr) {
    const expDate = new Date(expiryDateStr);
    const now = new Date();
    if (!isNaN(expDate.getTime()) && expDate < now) {
      isExpired = true;
    }
  }

  const isValid = isDeltaValid && !isExpired;
  let message = 'Calibración acústica conforme (Δ ≤ 0.5 dB - ISO 1996)';
  
  if (!isDeltaValid) {
    message = `Deriva acústica excesiva (Δ = ${delta.toFixed(2)} dB > 0.5 dB). Medición no admisible legalmente.`;
  } else if (isExpired) {
    message = `Certificado de calibración de laboratorio vencido. Requiere recalibración INACAL.`;
  }

  return {
    deltaDb: Number(delta.toFixed(2)),
    isValid,
    message
  };
}

/**
 * Calcula la prioridad de intervención fiscalizadora y de mitigación acústica
 */
export function calculateNoisePriority(
  laeq: number,
  ecaLimit: number,
  lcpeak: number,
  zone: NoiseZoneType
): {
  priority: NoisePriorityLevel;
  badgeColor: string;
  badgeBg: string;
  actionRecommendation: string;
} {
  const exceedance = laeq - ecaLimit;

  // Criterios de Severidad:
  // - Exceso > 7 dBA o LCpeak > 135 dBC o niveles superiores a 85 dBA en zona no industrial -> CRITICA
  // - Exceso > 3.0 dBA y <= 7.0 dBA -> ALTA
  // - Exceso > 0.0 dBA y <= 3.0 dBA -> MODERADA
  // - Exceso <= 0 dBA (cumple ECA) -> BAJA

  if (exceedance > 7 || lcpeak >= 135 || (zone !== 'Industrial' && laeq >= 85)) {
    return {
      priority: 'CRITICA',
      badgeColor: 'text-rose-400',
      badgeBg: 'bg-rose-950/80 border-rose-500/40',
      actionRecommendation: 'Intervención inmediata de fiscalización ambiental (OEFA / Municipalidad Provincial). Clausura o paralización temporal de fuentes ruidosas y evaluación de barreras acústicas urgentes.'
    };
  }

  if (exceedance > 3) {
    return {
      priority: 'ALTA',
      badgeColor: 'text-amber-400',
      badgeBg: 'bg-amber-950/80 border-amber-500/40',
      actionRecommendation: 'Fiscalización prioritaria, plan de restricción vehicular o insonorización de maquinaria. Notificación preventiva al generador del foco sonoro.'
    };
  }

  if (exceedance > 0) {
    return {
      priority: 'MODERADA',
      badgeColor: 'text-yellow-300',
      badgeBg: 'bg-yellow-950/80 border-yellow-500/40',
      actionRecommendation: 'Monitoreo de seguimiento continuo y fiscalización disuasiva orientativa. Optimización de señalética acústica y control de perifoneo.'
    };
  }

  return {
    priority: 'BAJA',
    badgeColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-950/80 border-emerald-500/40',
    actionRecommendation: 'Nivel acústico dentro del Estándar de Calidad Ambiental (ECA). Mantener régimen de vigilancia preventiva ordinaria.'
  };
}

/**
 * Convierte coordenadas geográficas a cadena descriptiva UTM preliminar (WGS84 Zona 18S)
 */
export function convertCoordsToUtm18S(lat: number, lng: number): string {
  // Proyección rápida aproximada para Lima / Callao (Zona 18 Sur)
  const a = 6378137;
  const f = 1 / 298.257223563;
  const k0 = 0.9996;
  const lng0 = -75; // Meridiano central zona 18

  const latRad = (lat * Math.PI) / 180;
  const lngRad = ((lng - lng0) * Math.PI) / 180;

  const e2 = 2 * f - f * f;
  const N = a / Math.sqrt(1 - e2 * Math.sin(latRad) * Math.sin(latRad));
  const T = Math.tan(latRad) * Math.tan(latRad);
  const C = (e2 / (1 - e2)) * Math.cos(latRad) * Math.cos(latRad);
  const A = Math.cos(latRad) * lngRad;

  const M = a * ((1 - e2 / 4 - 3 * e2 * e2 / 64) * latRad - (3 * e2 / 8 + 3 * e2 * e2 / 32) * Math.sin(2 * latRad) + (15 * e2 * e2 / 256) * Math.sin(4 * latRad));

  const easting = 500000 + k0 * N * (A + (1 - T + C) * Math.pow(A, 3) / 6);
  const northing = 10000000 + k0 * (M + N * Math.tan(latRad) * (A * A / 2 + (5 - T + 9 * C + 4 * C * C) * Math.pow(A, 4) / 24));

  return `18S ${Math.round(easting)}m E  ${Math.round(northing)}m N`;
}

/**
 * Calcula la suma logarítmica de decibeles
 * L_total = 10 * log10( sum( 10^(Li / 10) ) )
 */
export function logDecibelSum(levels: number[]): number {
  if (!levels || levels.length === 0) return 0;
  const sumPower = levels.reduce((acc, lvl) => acc + Math.pow(10, lvl / 10), 0);
  return Number((10 * Math.log10(sumPower)).toFixed(1));
}

/**
 * Calcula el nivel acústico resultante de una fuente puntual a una distancia r (ISO 9613-2 simplificado)
 * Lp(r) = Lw - 20*log10(r) - 11 - A_atm - A_bar
 */
export function calculatePointSourceAttenuation(
  soundPowerLw: number,
  distanceMeters: number,
  barrierAttenuationDb: number = 0,
  groundAbsorptionG: number = 0.5
): number {
  if (distanceMeters <= 0.5) return soundPowerLw;
  
  // Divergencia geométrica esférica
  const aDiv = 20 * Math.log10(distanceMeters) + 11;
  // Absorción atmosférica (aprox 0.005 dB/m a 20°C y 70% HR para 1kHz)
  const aAtm = 0.005 * distanceMeters;
  // Efecto del suelo
  const aGround = groundAbsorptionG * 2.5;

  const lp = soundPowerLw - aDiv - aAtm - barrierAttenuationDb - aGround;
  return Number(Math.max(lp, 25.0).toFixed(1));
}

/**
 * Retorna la etiqueta cromática oficial para curvas Isófonas según el nivel LAeq
 * Estándar ISO 1996 / CNOSSOS-EU
 */
export function getIsophoneColor(laeq: number): { fill: string; stroke: string; label: string } {
  if (laeq < 50) return { fill: '#10b981', stroke: '#059669', label: '< 50 dBA (Muy Bajo)' };
  if (laeq < 55) return { fill: '#06b6d4', stroke: '#0891b2', label: '50 - 55 dBA (Bajo)' };
  if (laeq < 60) return { fill: '#3b82f6', stroke: '#2563eb', label: '55 - 60 dBA (Moderado Bajo)' };
  if (laeq < 65) return { fill: '#eab308', stroke: '#ca8a04', label: '60 - 65 dBA (Moderado Alto)' };
  if (laeq < 70) return { fill: '#f97316', stroke: '#ea580c', label: '65 - 70 dBA (Alto)' };
  if (laeq < 75) return { fill: '#ef4444', stroke: '#dc2626', label: '70 - 75 dBA (Muy Alto)' };
  if (laeq < 80) return { fill: '#b91c1c', stroke: '#991b1b', label: '75 - 80 dBA (Severo)' };
  return { fill: '#7c3aed', stroke: '#6d28d9', label: '≥ 80 dBA (Crítico / Peligroso)' };
}
