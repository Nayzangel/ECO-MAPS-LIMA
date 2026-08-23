import * as turf from '@turf/turf';
import { LIMA_STATIONS_DEMO } from '../data/demoData';
import { LIMA_ENVIRONMENTAL_SOURCES, LIMA_ROAD_CORRIDORS } from '../data/gisData';
import { ZoneType } from '../types';

/**
 * Calculates total geodesic distance in meters and kilometers from an array of [lat, lng] points
 */
export function calculatePolylineDistance(points: [number, number][]): {
  totalKm: number;
  totalMeters: number;
  segmentsKm: number[];
} {
  if (points.length < 2) {
    return { totalKm: 0, totalMeters: 0, segmentsKm: [] };
  }

  let totalKm = 0;
  const segmentsKm: number[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    const from = turf.point([points[i][1], points[i][0]]); // [lng, lat]
    const to = turf.point([points[i + 1][1], points[i + 1][0]]);
    const segDist = turf.distance(from, to, { units: 'kilometers' });
    segmentsKm.push(segDist);
    totalKm += segDist;
  }

  return {
    totalKm: Number(totalKm.toFixed(3)),
    totalMeters: Math.round(totalKm * 1000),
    segmentsKm
  };
}

/**
 * Calculates area in m², hectares (ha), and km² plus perimeter for a polygon defined by [lat, lng] points
 */
export function calculatePolygonArea(points: [number, number][]): {
  areaM2: number;
  hectares: number;
  areaKm2: number;
  perimeterMeters: number;
} {
  if (points.length < 3) {
    return { areaM2: 0, hectares: 0, areaKm2: 0, perimeterMeters: 0 };
  }

  // Ensure closed polygon in [lng, lat] format
  const coords = points.map(p => [p[1], p[0]]);
  if (
    coords[0][0] !== coords[coords.length - 1][0] ||
    coords[0][1] !== coords[coords.length - 1][1]
  ) {
    coords.push([coords[0][0], coords[0][1]]);
  }

  const poly = turf.polygon([coords]);
  const areaM2 = turf.area(poly);
  const line = turf.polygonToLine(poly);
  const perimeterKm = line ? turf.length(line, { units: 'kilometers' }) : 0;

  return {
    areaM2: Math.round(areaM2),
    hectares: Number((areaM2 / 10000).toFixed(2)),
    areaKm2: Number((areaM2 / 1000000).toFixed(3)),
    perimeterMeters: Math.round(perimeterKm * 1000)
  };
}

/**
 * Converts standard WGS84 Lat/Lng to approximate UTM Zone 18S (Lima, Peru)
 */
export function latLngToUTM18S(lat: number, lng: number): {
  easting: number;
  northing: number;
  zone: string;
} {
  // Approximate UTM conversion for Central Peru (Zone 18S, central meridian -75°)
  const a = 6378137.0; // WGS84 semi-major axis
  const f = 1 / 298.257223563;
  const k0 = 0.9996;
  const e = Math.sqrt(2 * f - f * f);
  const e2 = e * e;
  const ePrime2 = e2 / (1 - e2);

  const radLat = (lat * Math.PI) / 180;
  const radLng = (lng * Math.PI) / 180;
  const centralMeridian = -75; // Zone 18
  const radCm = (centralMeridian * Math.PI) / 180;

  const N = a / Math.sqrt(1 - e2 * Math.sin(radLat) * Math.sin(radLat));
  const T = Math.tan(radLat) * Math.tan(radLat);
  const C = ePrime2 * Math.cos(radLat) * Math.cos(radLat);
  const A = Math.cos(radLat) * (radLng - radCm);

  const M =
    a *
    ((1 - e2 / 4 - (3 * e2 * e2) / 64 - (5 * e2 * e2 * e2) / 256) * radLat -
      ((3 * e2) / 8 + (3 * e2 * e2) / 32 + (45 * e2 * e2 * e2) / 1024) * Math.sin(2 * radLat) +
      ((15 * e2 * e2) / 256 + (45 * e2 * e2 * e2) / 1024) * Math.sin(4 * radLat) -
      ((35 * e2 * e2 * e2) / 3072) * Math.sin(6 * radLat));

  const easting =
    k0 *
      N *
      (A +
        ((1 - T + C) * Math.pow(A, 3)) / 6 +
        ((5 - 18 * T + T * T + 72 * C - 58 * ePrime2) * Math.pow(A, 5)) / 120) +
    500000.0;

  let northing =
    k0 *
    (M +
      N *
        Math.tan(radLat) *
        ((A * A) / 2 +
          ((5 - T + 9 * C + 4 * C * C) * Math.pow(A, 4)) / 24 +
          ((61 - 58 * T + T * T + 600 * C - 330 * ePrime2) * Math.pow(A, 6)) / 720));

  if (lat < 0) {
    northing += 10000000.0; // False northing for southern hemisphere
  }

  return {
    easting: Math.round(easting),
    northing: Math.round(northing),
    zone: '18S'
  };
}

/**
 * Simulates environmental air and noise levels for any custom user coordinate clicked in Lima
 * Uses Inverse Distance Weighting (IDW) against nearby monitoring stations and proximity to industrial sources.
 */
export function estimateEnvironmentalAtCoordinate(
  lat: number,
  lng: number,
  zoneType: ZoneType = 'Residencial'
): {
  pm25: number;
  pm10: number;
  noiseDay: number;
  so2: number;
  no2: number;
  riskLevel: 'Optimo' | 'Moderado' | 'Alerta' | 'Critico';
  closestStationName: string;
  distanceToStationKm: number;
} {
  const clickPoint = turf.point([lng, lat]);

  let totalWeight = 0;
  let weightedPm25 = 0;
  let weightedPm10 = 0;
  let weightedNoise = 0;
  let weightedSo2 = 0;
  let weightedNo2 = 0;

  let closestDist = Infinity;
  let closestStationName = 'Estación Lima';

  LIMA_STATIONS_DEMO.forEach(station => {
    const stPoint = turf.point([station.coordinates[1], station.coordinates[0]]);
    const dist = Math.max(turf.distance(clickPoint, stPoint, { units: 'kilometers' }), 0.2);

    if (dist < closestDist) {
      closestDist = dist;
      closestStationName = station.name;
    }

    const weight = 1 / Math.pow(dist, 1.8);
    totalWeight += weight;
    weightedPm25 += station.pm25 * weight;
    weightedPm10 += station.pm10 * weight;
    weightedNoise += station.noiseDay * weight;
    weightedSo2 += station.so2 * weight;
    weightedNo2 += station.no2 * weight;
  });

  let estimatedPm25 = weightedPm25 / (totalWeight || 1);
  let estimatedPm10 = weightedPm10 / (totalWeight || 1);
  let estimatedNoise = weightedNoise / (totalWeight || 1);
  let estimatedSo2 = weightedSo2 / (totalWeight || 1);
  let estimatedNo2 = weightedNo2 / (totalWeight || 1);

  // Check proximity to industrial sources
  LIMA_ENVIRONMENTAL_SOURCES.forEach(src => {
    const srcPoint = turf.point([src.coordinates[1], src.coordinates[0]]);
    const distM = turf.distance(clickPoint, srcPoint, { units: 'kilometers' }) * 1000;
    if (distM < src.impactRadiusMeters) {
      const factor = (src.impactRadiusMeters - distM) / src.impactRadiusMeters;
      estimatedPm25 += 15 * factor;
      estimatedPm10 += 25 * factor;
      estimatedSo2 += 12 * factor;
    }
  });

  // Check proximity to major roads
  LIMA_ROAD_CORRIDORS.forEach(road => {
    const line = turf.lineString(road.coordinates.map(c => [c[1], c[0]]));
    const distToRoadKm = turf.pointToLineDistance(clickPoint, line, { units: 'kilometers' });
    if (distToRoadKm < 0.4) {
      const roadFactor = (0.4 - distToRoadKm) / 0.4;
      estimatedNoise = Math.max(estimatedNoise, road.estimatedNoiseDb - 8 * (1 - roadFactor));
      estimatedNo2 += 18 * roadFactor;
    }
  });

  // Adjust for zone
  if (zoneType === 'Industrial') {
    estimatedNoise = Math.max(estimatedNoise, 72.0);
  } else if (zoneType === 'ProteccionEspecial') {
    estimatedNoise = Math.min(estimatedNoise, 58.0);
  }

  const finalPm25 = Number(estimatedPm25.toFixed(1));
  const finalPm10 = Number(estimatedPm10.toFixed(1));
  const finalNoise = Number(estimatedNoise.toFixed(1));
  const finalSo2 = Number(estimatedSo2.toFixed(1));
  const finalNo2 = Number(estimatedNo2.toFixed(1));

  let riskLevel: 'Optimo' | 'Moderado' | 'Alerta' | 'Critico' = 'Moderado';
  if (finalPm25 > 60 || finalNoise > 78) {
    riskLevel = 'Critico';
  } else if (finalPm25 > 50 || finalNoise > 70) {
    riskLevel = 'Alerta';
  } else if (finalPm25 <= 25 && finalNoise <= 60) {
    riskLevel = 'Optimo';
  }

  return {
    pm25: finalPm25,
    pm10: finalPm10,
    noiseDay: finalNoise,
    so2: finalSo2,
    no2: finalNo2,
    riskLevel,
    closestStationName,
    distanceToStationKm: Number(closestDist.toFixed(2))
  };
}
