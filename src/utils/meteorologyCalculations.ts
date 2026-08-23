import { 
  CardinalDirection, 
  PasquillStabilityClass, 
  TemperatureUnit, 
  PressureUnit, 
  WindSpeedUnit, 
  RadiationUnit, 
  PrecipitationUnit,
  WindRoseData,
  WindRoseSector
} from '../types/meteorology';

// 16-Sector Compass Rose definition
export const CARDINAL_SECTORS: { name: CardinalDirection; minDeg: number; maxDeg: number; midDeg: number }[] = [
  { name: 'N', minDeg: 348.75, maxDeg: 11.25, midDeg: 0 },
  { name: 'NNE', minDeg: 11.25, maxDeg: 33.75, midDeg: 22.5 },
  { name: 'NE', minDeg: 33.75, maxDeg: 56.25, midDeg: 45 },
  { name: 'ENE', minDeg: 56.25, maxDeg: 78.75, midDeg: 67.5 },
  { name: 'E', minDeg: 78.75, maxDeg: 101.25, midDeg: 90 },
  { name: 'ESE', minDeg: 101.25, maxDeg: 123.75, midDeg: 112.5 },
  { name: 'SE', minDeg: 123.75, maxDeg: 146.25, midDeg: 135 },
  { name: 'SSE', minDeg: 146.25, maxDeg: 168.75, midDeg: 157.5 },
  { name: 'S', minDeg: 168.75, maxDeg: 191.25, midDeg: 180 },
  { name: 'SSW', minDeg: 191.25, maxDeg: 213.75, midDeg: 202.5 },
  { name: 'SW', minDeg: 213.75, maxDeg: 236.25, midDeg: 225 },
  { name: 'WSW', minDeg: 236.25, maxDeg: 258.75, midDeg: 247.5 },
  { name: 'W', minDeg: 258.75, maxDeg: 281.25, midDeg: 270 },
  { name: 'WNW', minDeg: 281.25, maxDeg: 303.75, midDeg: 292.5 },
  { name: 'NW', minDeg: 303.75, maxDeg: 326.25, midDeg: 315 },
  { name: 'NNW', minDeg: 326.25, maxDeg: 348.75, midDeg: 337.5 }
];

// SPEED BINS FOR WIND ROSE (STANDARD EPA / WMO ENVIRONMENTAL METEOROLOGY)
export const STANDARD_SPEED_BINS = [
  { label: '0.5 - 2.1 m/s (Brisa muy débil)', minSpeed: 0.5, maxSpeed: 2.1, color: '#38bdf8' }, // Light blue
  { label: '2.1 - 3.6 m/s (Brisa débil)', minSpeed: 2.1, maxSpeed: 3.6, color: '#34d399' }, // Emerald
  { label: '3.6 - 5.7 m/s (Brisa moderada)', minSpeed: 3.6, maxSpeed: 5.7, color: '#fbbf24' }, // Amber
  { label: '5.7 - 8.8 m/s (Brisa fresca)', minSpeed: 5.7, maxSpeed: 8.8, color: '#f97316' }, // Orange
  { label: '> 8.8 m/s (Viento fuerte)', minSpeed: 8.8, maxSpeed: 99.0, color: '#ef4444' } // Red
];

// CONVERT DEGREES TO CARDINAL DIRECTION (16 sectors)
export function degreesToCardinal(deg: number): CardinalDirection {
  const normalized = ((deg % 360) + 360) % 360;
  if (normalized >= 348.75 || normalized < 11.25) return 'N';
  for (const s of CARDINAL_SECTORS) {
    if (normalized >= s.minDeg && normalized < s.maxDeg) {
      return s.name;
    }
  }
  return 'N';
}

// CONVERT CARDINAL DIRECTION TO DEGREES MIDPOINT
export function cardinalToDegrees(cardinal: CardinalDirection): number {
  const found = CARDINAL_SECTORS.find(s => s.name === cardinal);
  return found ? found.midDeg : 0;
}

// TEMPERATURE CONVERSIONS
export function convertTemperature(val: number, from: TemperatureUnit, to: TemperatureUnit): number {
  if (from === to) return val;
  // Convert from -> Celsius
  let c = val;
  if (from === 'F') c = (val - 32) * (5 / 9);
  else if (from === 'K') c = val - 273.15;
  
  // Convert Celsius -> to
  if (to === 'C') return Number(c.toFixed(2));
  if (to === 'F') return Number((c * (9 / 5) + 32).toFixed(2));
  if (to === 'K') return Number((c + 273.15).toFixed(2));
  return c;
}

// PRESSURE CONVERSIONS (Base: hPa)
export function convertPressure(val: number, from: PressureUnit, to: PressureUnit): number {
  if (from === to) return val;
  let hpa = val;
  if (from === 'mbar') hpa = val;
  else if (from === 'mmHg') hpa = val * 1.33322;
  else if (from === 'atm') hpa = val * 1013.25;
  else if (from === 'kPa') hpa = val * 10.0;
  
  if (to === 'hPa' || to === 'mbar') return Number(hpa.toFixed(1));
  if (to === 'mmHg') return Number((hpa / 1.33322).toFixed(1));
  if (to === 'atm') return Number((hpa / 1013.25).toFixed(4));
  if (to === 'kPa') return Number((hpa / 10.0).toFixed(2));
  return hpa;
}

// WIND SPEED CONVERSIONS (Base: m/s)
export function convertWindSpeed(val: number, from: WindSpeedUnit, to: WindSpeedUnit): number {
  if (from === to) return val;
  let ms = val;
  if (from === 'km/h') ms = val / 3.6;
  else if (from === 'knots') ms = val * 0.514444;
  else if (from === 'mph') ms = val * 0.44704;

  if (to === 'm/s') return Number(ms.toFixed(2));
  if (to === 'km/h') return Number((ms * 3.6).toFixed(2));
  if (to === 'knots') return Number((ms / 0.514444).toFixed(2));
  if (to === 'mph') return Number((ms / 0.44704).toFixed(2));
  return ms;
}

// SOLAR RADIATION CONVERSIONS (Base: W/m²)
export function convertRadiation(val: number, from: RadiationUnit, to: RadiationUnit): number {
  if (from === to) return val;
  let wm2 = val;
  if (from === 'MJ/m2') wm2 = (val * 1000000) / 3600; // Assuming 1 hour rate
  else if (from === 'cal/cm2_min') wm2 = val * 697.8;

  if (to === 'W/m2') return Number(wm2.toFixed(1));
  if (to === 'MJ/m2') return Number(((wm2 * 3600) / 1000000).toFixed(3));
  if (to === 'cal/cm2_min') return Number((wm2 / 697.8).toFixed(3));
  return wm2;
}

// DEW POINT CALCULATION (Magnus-Tetens Equation)
export function calculateDewPointCelsius(tempC: number, rhPercent: number): number {
  const a = 17.27;
  const b = 237.7;
  const clampedRh = Math.max(Math.min(rhPercent, 100), 1);
  const alpha = ((a * tempC) / (b + tempC)) + Math.log(clampedRh / 100);
  const td = (b * alpha) / (a - alpha);
  return Number(td.toFixed(1));
}

// HEAT INDEX / SENSACIÓN TÉRMICA (NOAA Equation)
export function calculateHeatIndexCelsius(tempC: number, rhPercent: number): number {
  if (tempC < 20) return tempC; // Below 20°C heat index equals temperature
  const tF = tempC * 1.8 + 32;
  const r = rhPercent;
  
  const c1 = -42.379;
  const c2 = 2.04901523;
  const c3 = 10.14333127;
  const c4 = -0.22475541;
  const c5 = -0.00683783;
  const c6 = -0.05481717;
  const c7 = 0.00122874;
  const c8 = 0.00085282;
  const c9 = -0.00000199;

  const hiF = c1 + c2 * tF + c3 * r + c4 * tF * r + c5 * tF * tF + c6 * r * r + c7 * tF * tF * r + c8 * tF * r * r + c9 * tF * tF * r * r;
  const hiC = (hiF - 32) / 1.8;
  return Number(hiC.toFixed(1));
}

// PASQUILL-GIFFORD STABILITY CLASS DETERMINATION
export function calculatePasquillStability(
  windSpeedMs: number,
  solarRadiationWm2: number,
  cloudCoverOctas: number,
  isDaytime: boolean
): PasquillStabilityClass {
  const u = windSpeedMs;

  if (isDaytime) {
    // Daytime insolation classification:
    // Strong (> 600 W/m2), Moderate (300 - 600 W/m2), Slight (< 300 W/m2)
    let insolation: 'STRONG' | 'MODERATE' | 'SLIGHT' = 'MODERATE';
    if (solarRadiationWm2 >= 600) insolation = 'STRONG';
    else if (solarRadiationWm2 >= 300) insolation = 'MODERATE';
    else insolation = 'SLIGHT';

    if (u < 2.0) {
      if (insolation === 'STRONG') return 'A';
      if (insolation === 'MODERATE') return 'A';
      return 'B';
    } else if (u < 3.0) {
      if (insolation === 'STRONG') return 'A';
      if (insolation === 'MODERATE') return 'B';
      return 'C';
    } else if (u < 5.0) {
      if (insolation === 'STRONG') return 'B';
      if (insolation === 'MODERATE') return 'B';
      return 'C';
    } else if (u < 6.0) {
      if (insolation === 'STRONG') return 'C';
      if (insolation === 'MODERATE') return 'C';
      return 'D';
    } else {
      // u >= 6.0 m/s
      if (insolation === 'STRONG') return 'C';
      if (insolation === 'MODERATE') return 'D';
      return 'D';
    }
  } else {
    // Nighttime: thin or overcast cloudiness (>= 4/8) vs mostly clear (< 4/8)
    const isCloudy = cloudCoverOctas >= 4;
    if (u < 2.0) {
      return isCloudy ? 'E' : 'F';
    } else if (u < 3.0) {
      return isCloudy ? 'E' : 'F';
    } else if (u < 5.0) {
      return isCloudy ? 'D' : 'E';
    } else {
      return 'D';
    }
  }
}

// GENERATE WIND ROSE FROM OBSERVATION ARRAY
export function buildWindRoseData(
  observations: { windSpeed: number; windDirectionDegrees: number }[],
  stationId: string,
  stationName: string,
  periodDescription: string = 'Últimas 24 Horas'
): WindRoseData {
  const total = observations.length;
  if (total === 0) {
    return {
      stationId,
      stationName,
      periodDescription,
      totalObservations: 0,
      calmPercent: 0,
      meanSpeed: 0,
      dominantDirection: 'S',
      sectors: CARDINAL_SECTORS.map(s => ({
        direction: s.name,
        degreesMin: s.minDeg,
        degreesMax: s.maxDeg,
        degreesMid: s.midDeg,
        totalFrequencyPercent: 0,
        speedBins: STANDARD_SPEED_BINS.map(b => ({
          label: b.label,
          minSpeed: b.minSpeed,
          maxSpeed: b.maxSpeed,
          frequencyPercent: 0,
          color: b.color
        }))
      }))
    };
  }

  let calmsCount = 0;
  let sumSpeed = 0;

  // Initialize sector counters
  const sectorMap: Record<CardinalDirection, { [binLabel: string]: number; total: number }> = {
    N: { total: 0 }, NNE: { total: 0 }, NE: { total: 0 }, ENE: { total: 0 },
    E: { total: 0 }, ESE: { total: 0 }, SE: { total: 0 }, SSE: { total: 0 },
    S: { total: 0 }, SSW: { total: 0 }, SW: { total: 0 }, WSW: { total: 0 },
    W: { total: 0 }, WNW: { total: 0 }, NW: { total: 0 }, NNW: { total: 0 }
  };

  STANDARD_SPEED_BINS.forEach(b => {
    CARDINAL_SECTORS.forEach(s => {
      sectorMap[s.name][b.label] = 0;
    });
  });

  observations.forEach(obs => {
    sumSpeed += obs.windSpeed;
    if (obs.windSpeed < 0.5) {
      calmsCount++;
    } else {
      const cardinal = degreesToCardinal(obs.windDirectionDegrees);
      sectorMap[cardinal].total++;

      for (const bin of STANDARD_SPEED_BINS) {
        if (obs.windSpeed >= bin.minSpeed && (bin.maxSpeed === 99.0 ? obs.windSpeed <= bin.maxSpeed : obs.windSpeed < bin.maxSpeed)) {
          sectorMap[cardinal][bin.label]++;
          break;
        }
      }
    }
  });

  const calmPercent = Number(((calmsCount / total) * 100).toFixed(1));
  const meanSpeed = Number((sumSpeed / total).toFixed(2));

  let maxSectorFreq = -1;
  let dominantDir: CardinalDirection = 'S';

  const sectors: WindRoseSector[] = CARDINAL_SECTORS.map(s => {
    const sData = sectorMap[s.name];
    const totalFreq = Number(((sData.total / total) * 100).toFixed(2));

    if (totalFreq > maxSectorFreq) {
      maxSectorFreq = totalFreq;
      dominantDir = s.name;
    }

    const speedBins = STANDARD_SPEED_BINS.map(b => {
      const count = sData[b.label] || 0;
      const freq = Number(((count / total) * 100).toFixed(2));
      return {
        label: b.label,
        minSpeed: b.minSpeed,
        maxSpeed: b.maxSpeed,
        frequencyPercent: freq,
        color: b.color
      };
    });

    return {
      direction: s.name,
      degreesMin: s.minDeg,
      degreesMax: s.maxDeg,
      degreesMid: s.midDeg,
      totalFrequencyPercent: totalFreq,
      speedBins
    };
  });

  return {
    stationId,
    stationName,
    periodDescription,
    totalObservations: total,
    calmPercent,
    meanSpeed,
    dominantDirection: dominantDir,
    sectors
  };
}
