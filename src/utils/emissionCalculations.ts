import { 
  LengthUnit, 
  VelocityUnit, 
  VolumetricFlowUnit, 
  MassEmissionUnit, 
  ConcentrationUnit,
  StackPointSource
} from '../types/emissionSources';

// CONVERT LENGTH UNITS (Base: meters)
export function convertLength(val: number, from: LengthUnit, to: LengthUnit): number {
  if (from === to) return val;
  let m = val;
  if (from === 'cm') m = val / 100;
  else if (from === 'ft') m = val * 0.3048;
  else if (from === 'in') m = val * 0.0254;

  if (to === 'm') return Number(m.toFixed(3));
  if (to === 'cm') return Number((m * 100).toFixed(1));
  if (to === 'ft') return Number((m / 0.3048).toFixed(2));
  if (to === 'in') return Number((m / 0.0254).toFixed(2));
  return m;
}

// CONVERT VELOCITY UNITS (Base: m/s)
export function convertVelocity(val: number, from: VelocityUnit, to: VelocityUnit): number {
  if (from === to) return val;
  let ms = val;
  if (from === 'ft/s') ms = val * 0.3048;
  else if (from === 'km/h') ms = val / 3.6;

  if (to === 'm/s') return Number(ms.toFixed(2));
  if (to === 'ft/s') return Number((ms / 0.3048).toFixed(2));
  if (to === 'km/h') return Number((ms * 3.6).toFixed(2));
  return ms;
}

// CONVERT VOLUMETRIC FLOW UNITS (Base: m³/s)
export function convertVolumetricFlow(val: number, from: VolumetricFlowUnit, to: VolumetricFlowUnit): number {
  if (from === to) return val;
  let m3s = val;
  if (from === 'm3/h') m3s = val / 3600;
  else if (from === 'Nm3/h') m3s = (val / 3600) * (293.15 / 273.15); // Approximate standard conversion
  else if (from === 'ACFM') m3s = val * 0.000471947; // ft3/min to m3/s

  if (to === 'm3/s') return Number(m3s.toFixed(3));
  if (to === 'm3/h') return Number((m3s * 3600).toFixed(1));
  if (to === 'Nm3/h') return Number(((m3s * 3600) * (273.15 / 293.15)).toFixed(1));
  if (to === 'ACFM') return Number((m3s / 0.000471947).toFixed(1));
  return m3s;
}

// CONVERT MASS EMISSION RATE (Base: g/s)
export function convertMassEmission(val: number, from: MassEmissionUnit, to: MassEmissionUnit): number {
  if (from === to) return val;
  let gs = val;
  if (from === 'kg/h') gs = (val * 1000) / 3600;
  else if (from === 'ton/year') gs = (val * 1000000) / (365 * 24 * 3600);
  else if (from === 'lb/hr') gs = (val * 453.592) / 3600;

  if (to === 'g/s') return Number(gs.toFixed(4));
  if (to === 'kg/h') return Number(((gs * 3600) / 1000).toFixed(3));
  if (to === 'ton/year') return Number(((gs * 365 * 24 * 3600) / 1000000).toFixed(3));
  if (to === 'lb/hr') return Number(((gs * 3600) / 453.592).toFixed(3));
  return gs;
}

// CALCULATE STACK CROSS-SECTION AREA (m²)
export function calculateStackArea(diameterMeters: number): number {
  const r = diameterMeters / 2;
  return Math.PI * r * r;
}

// CALCULATE VOLUMETRIC FLOW FROM VELOCITY AND DIAMETER (m³/s)
export function calculateFlowFromVelocity(diameterMeters: number, velocityMs: number): number {
  const area = calculateStackArea(diameterMeters);
  return Number((area * velocityMs).toFixed(3));
}

// CALCULATE VELOCITY FROM VOLUMETRIC FLOW AND DIAMETER (m/s)
export function calculateVelocityFromFlow(diameterMeters: number, flowM3s: number): number {
  const area = calculateStackArea(diameterMeters);
  if (area <= 0) return 0;
  return Number((flowM3s / area).toFixed(2));
}

// VALIDATE PHYSICAL CONSISTENCY OF STACK PARAMETERS
export interface StackConsistencyCheck {
  isValid: boolean;
  calculatedFlowM3s: number;
  enteredFlowM3s: number;
  percentageDiscrepancy: number;
  message: string;
}

export function validateStackFluidDynamics(
  diameterM: number,
  velocityMs: number,
  flowM3s: number
): StackConsistencyCheck {
  if (diameterM <= 0 || velocityMs <= 0) {
    return {
      isValid: false,
      calculatedFlowM3s: 0,
      enteredFlowM3s: flowM3s,
      percentageDiscrepancy: 100,
      message: 'El diámetro y la velocidad deben ser mayores a cero.'
    };
  }

  const expectedFlow = calculateFlowFromVelocity(diameterM, velocityMs);
  
  if (flowM3s <= 0) {
    return {
      isValid: true,
      calculatedFlowM3s: expectedFlow,
      enteredFlowM3s: expectedFlow,
      percentageDiscrepancy: 0,
      message: `Caudal calculado automáticamente a partir de geometría: ${expectedFlow} m³/s.`
    };
  }

  const diff = Math.abs(expectedFlow - flowM3s);
  const percentDiff = (diff / flowM3s) * 100;

  if (percentDiff <= 5.0) {
    return {
      isValid: true,
      calculatedFlowM3s: expectedFlow,
      enteredFlowM3s: flowM3s,
      percentageDiscrepancy: Number(percentDiff.toFixed(1)),
      message: `Consistencia hidrodinámica verificada (Discrepancia ${percentDiff.toFixed(1)}% ≤ 5% de tolerancia).`
    };
  } else {
    return {
      isValid: false,
      calculatedFlowM3s: expectedFlow,
      enteredFlowM3s: flowM3s,
      percentageDiscrepancy: Number(percentDiff.toFixed(1)),
      message: `Discrepancia física del ${percentDiff.toFixed(1)}%: El caudal para d=${diameterM}m y vs=${velocityMs}m/s debe ser ~${expectedFlow} m³/s (Q = Área × vs).`
    };
  }
}

// BRIGGS PLUME RISE EQUATIONS (EPA Industrial Source Complex / AERMOD Formulation)
export interface BriggsPlumeRiseResult {
  buoyancyFluxFb: number; // m⁴/s³
  momentumFluxFm: number; // m⁴/s²
  crossoverTemperatureDelta: number; // K
  isBuoyancyDominated: boolean;
  plumeRiseDeltaH: number; // m
  effectiveStackHeight: number; // m
}

export function calculateBriggsPlumeRise(
  stackHeightM: number,
  stackDiameterM: number,
  gasTempCelsius: number,
  gasVelocityMs: number,
  ambientTempCelsius: number = 20.0,
  windSpeedAtStackMs: number = 3.5
): BriggsPlumeRiseResult {
  const g = 9.80665; // m/s²
  const Ts = gasTempCelsius + 273.15; // Gas temp in K
  const Ta = ambientTempCelsius + 273.15; // Ambient temp in K
  const r = stackDiameterM / 2;
  const u = Math.max(windSpeedAtStackMs, 0.8); // Avoid zero wind division

  // 1: Buoyancy Flux Fb = g * vs * r² * (Ts - Ta) / Ts
  const deltaT = Math.max(Ts - Ta, 0);
  const Fb = g * gasVelocityMs * (r * r) * (deltaT / Ts);

  // 2: Momentum Flux Fm = vs² * r² * (Ta / Ts)
  const Fm = (gasVelocityMs * gasVelocityMs) * (r * r) * (Ta / Ts);

  // 3: Crossover temp test (Briggs buoyancy vs momentum threshold)
  let deltaTc = 0;
  if (Fb < 55) {
    deltaTc = 0.0297 * Ts * (Math.pow(gasVelocityMs, 1/3) / Math.pow(stackDiameterM, 2/3));
  } else {
    deltaTc = 0.00575 * Ts * (Math.pow(gasVelocityMs, 2/3) / Math.pow(stackDiameterM, 1/3));
  }

  const isBuoyancyDominated = deltaT > deltaTc;

  // 4: Plume Rise Delta H under neutral / unstable conditions
  let deltaH = 0;
  if (isBuoyancyDominated) {
    if (Fb >= 55) {
      // Delta h = 38.71 * Fb^(3/5) / u
      deltaH = (38.71 * Math.pow(Fb, 3 / 5)) / u;
    } else {
      // Delta h = 21.42 * Fb^(3/4) / u
      deltaH = (21.42 * Math.pow(Fb, 3 / 4)) / u;
    }
  } else {
    // Momentum dominated plume rise: Delta h = 3 * d * vs / u
    deltaH = (3 * stackDiameterM * gasVelocityMs) / u;
  }

  // Cap maximum plume rise to avoid unphysical infinities
  deltaH = Math.min(Math.max(deltaH, 0), 400);

  const effectiveStackHeight = Number((stackHeightM + deltaH).toFixed(1));

  return {
    buoyancyFluxFb: Number(Fb.toFixed(2)),
    momentumFluxFm: Number(Fm.toFixed(2)),
    crossoverTemperatureDelta: Number(deltaTc.toFixed(1)),
    isBuoyancyDominated,
    plumeRiseDeltaH: Number(deltaH.toFixed(1)),
    effectiveStackHeight
  };
}
