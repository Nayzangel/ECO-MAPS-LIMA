import { AirQualityModelingProject } from '../types/airQualityModeling';

export const STUDY_CASES_PRESETS: AirQualityModelingProject[] = [
  {
    id: 'CASE-VENTANILLA-SO2',
    projectName: 'Estudio de Dispersión Atmosférica de SO2 - Refinería & Térmica Ventanilla',
    description: 'Evaluación de concentraciones máximas horarias y diarias de SO2 emitidas por chimeneas industriales en zona costera con régimen de brisa marina.',
    organization: 'Complejo Industrial Ventanilla / Callao',
    coordinates: {
      centerLat: -11.8795,
      centerLng: -77.1382,
      utmZone: '18S',
      datum: 'WGS84',
      utmEasting: 266850,
      utmNorthing: 8686200,
      domainWidthKm: 25,
      domainHeightKm: 25,
      gridResolutionMeters: 250,
      elevationBaseMeters: 18
    },
    pollutant: {
      pollutant: 'SO2',
      name: 'Dióxido de Azufre',
      chemicalFormula: 'SO₂',
      averagingPeriods: ['1_HORA', '24_HORAS', 'ANUAL'],
      selectedAveragingPeriod: '24_HORAS',
      nationalEcaMgM3: 20, // ECA D.S. 003-2017-MINAM (24h)
      isPhotochemical: false
    },
    source: {
      sourceType: 'PUNTUAL_CHIMENEA',
      sourceName: 'Chimenea Principal de Fraccionamiento Catalítico',
      facilityName: 'Refinería La Pampilla',
      sector: 'REFINERIA_HIDROCARBUROS',
      lat: -11.8795,
      lng: -77.1382,
      utmX: 266850,
      utmY: 8686200,
      elevationMeters: 18,
      emissionRateGs: 12.5,
      stackHeightM: 65.0,
      stackDiameterM: 2.8,
      gasExitTempC: 165.0,
      gasExitVelocityMs: 16.5,
      hasBuildingDownwash: true,
      buildingHeightM: 24.0,
      buildingWidthM: 35.0,
      buildingLengthM: 40.0
    },
    meteorology: {
      sourceType: 'ESTACION_SUPERFICIAL',
      stationName: 'Estación Automática Ventanilla - SENAMHI',
      hasHourlySurfaceData: true,
      hasUpperAirSounding: false,
      anemometerHeightMeters: 10,
      surfaceRoughnessZ0: 0.05,
      bowenRatio: 1.2,
      surfaceAlbedo: 0.18,
      mixingHeightDetermined: true,
      calmsPercentage: 8.5,
      prevailingWindDirDeg: 215, // Vientos del SSO (Brisa marina)
      avgWindSpeedMs: 4.2,
      temperatureC: 21.5,
      stabilityClass: 'C',
      processedAermetFilesAvailable: true
    },
    terrain: {
      terrainType: 'COSTERO_VALLE',
      hasDigitalElevationModel: true,
      demResolutionMeters: 30,
      aermapProcessed: true,
      maxTerrainElevationMeters: 280,
      minTerrainElevationMeters: 0,
      hasCoastalBoundaryRecirculation: true
    },
    receptors: {
      gridType: 'CARTESIANA_UNIFORME',
      gridSpacingMeters: 250,
      totalGridReceptors: 2500,
      includePropertyBoundaryReceptors: true,
      flagpoleReceptorHeightM: 1.5,
      discreteReceptors: [
        {
          id: 'REC-01',
          name: 'Colegio N° 5086 Politécnico Ventanilla',
          type: 'COLEGIO',
          lat: -11.8650,
          lng: -77.1250,
          utmX: 268300,
          utmY: 8687800,
          elevationMeters: 35,
          flagpoleHeightMeters: 1.5
        },
        {
          id: 'REC-02',
          name: 'Hospital de Ventanilla Essalud',
          type: 'HOSPITAL',
          lat: -11.8720,
          lng: -77.1280,
          utmX: 267950,
          utmY: 8687000,
          elevationMeters: 28,
          flagpoleHeightMeters: 1.5
        },
        {
          id: 'REC-03',
          name: 'Humedales de Ventanilla (Área de Conservación)',
          type: 'MONITOREO_HISTORICO',
          lat: -11.8900,
          lng: -77.1400,
          utmX: 266650,
          utmY: 8685050,
          elevationMeters: 5,
          flagpoleHeightMeters: 1.5
        }
      ]
    },
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-08-23T10:00:00Z'
  },
  {
    id: 'CASE-RIMAC-PM10',
    projectName: 'Modelamiento de PM10 en Entorno de Terreno Complejo - Valle del Río Rímac',
    description: 'Simulación de material particulado emitido por canteras y fundiciones en el valle encajonado de Huachipa / San Juan de Lurigancho.',
    organization: 'Sector Metalmecánico y Canteras Lima Este',
    coordinates: {
      centerLat: -12.0120,
      centerLng: -76.9250,
      utmZone: '18S',
      datum: 'WGS84',
      utmEasting: 290100,
      utmNorthing: 8671500,
      domainWidthKm: 18,
      domainHeightKm: 18,
      gridResolutionMeters: 200,
      elevationBaseMeters: 350
    },
    pollutant: {
      pollutant: 'PM10',
      name: 'Material Particulado PM10',
      chemicalFormula: 'PM₁₀',
      averagingPeriods: ['24_HORAS', 'ANUAL'],
      selectedAveragingPeriod: '24_HORAS',
      nationalEcaMgM3: 100, // ECA D.S. 003-2017-MINAM (24h)
      isPhotochemical: false,
      particleDensityGcm3: 2.5
    },
    source: {
      sourceType: 'PUNTUAL_CHIMENEA',
      sourceName: 'Horno de Fusión / Fundición',
      facilityName: 'Planta Metalúrgica Huachipa',
      sector: 'MINERIA_METALURGIA',
      lat: -12.0120,
      lng: -76.9250,
      utmX: 290100,
      utmY: 8671500,
      elevationMeters: 350,
      emissionRateGs: 4.8,
      stackHeightM: 35.0,
      stackDiameterM: 1.6,
      gasExitTempC: 190.0,
      gasExitVelocityMs: 14.0,
      hasBuildingDownwash: false
    },
    meteorology: {
      sourceType: 'ESTACION_SUPERFICIAL',
      stationName: 'Estación Von Humboldt / Huachipa - SENAMHI',
      hasHourlySurfaceData: true,
      hasUpperAirSounding: false,
      anemometerHeightMeters: 10,
      surfaceRoughnessZ0: 0.35, // Terreno urbano/rugoso
      bowenRatio: 2.5, // Clima árido valle
      surfaceAlbedo: 0.22,
      mixingHeightDetermined: false,
      calmsPercentage: 22.0, // Alta frecuencia de calmas nocturnas
      prevailingWindDirDeg: 250,
      avgWindSpeedMs: 2.1,
      temperatureC: 24.0,
      stabilityClass: 'E',
      processedAermetFilesAvailable: false
    },
    terrain: {
      terrainType: 'COMPLEJO_MONTANOSO',
      hasDigitalElevationModel: true,
      demResolutionMeters: 30,
      aermapProcessed: false, // Faltante crítico
      maxTerrainElevationMeters: 1250,
      minTerrainElevationMeters: 320,
      hasCoastalBoundaryRecirculation: false
    },
    receptors: {
      gridType: 'CARTESIANA_UNIFORME',
      gridSpacingMeters: 200,
      totalGridReceptors: 1800,
      includePropertyBoundaryReceptors: false,
      flagpoleReceptorHeightM: 1.5,
      discreteReceptors: [
        {
          id: 'REC-RIMAC-01',
          name: 'Centro Poblado Huachipa Norte',
          type: 'POBLADO',
          lat: -12.0050,
          lng: -76.9180,
          utmX: 290850,
          utmY: 8672280,
          elevationMeters: 380,
          flagpoleHeightMeters: 1.5
        }
      ]
    },
    createdAt: '2026-08-21T14:30:00Z',
    updatedAt: '2026-08-23T10:15:00Z'
  },
  {
    id: 'CASE-CALLAO-NOX-LINEAL',
    projectName: 'Evaluación de Emisiones Vehiculares de NOx en Vía de Alto Tráfico - Av. Néstor Gambetta',
    description: 'Modelamiento de dispersión lineal de óxidos de nitrógeno generados por transporte pesado de carga hacia el Terminal Portuario del Callao.',
    organization: 'Gerencia de Transporte y Medio Ambiente Callao',
    coordinates: {
      centerLat: -12.0250,
      centerLng: -77.1250,
      utmZone: '18S',
      datum: 'WGS84',
      utmEasting: 268300,
      utmNorthing: 8670100,
      domainWidthKm: 12,
      domainHeightKm: 12,
      gridResolutionMeters: 100,
      elevationBaseMeters: 10
    },
    pollutant: {
      pollutant: 'NO2',
      name: 'Dióxido de Nitrógeno',
      chemicalFormula: 'NO₂',
      averagingPeriods: ['1_HORA', '24_HORAS', 'ANUAL'],
      selectedAveragingPeriod: '1_HORA',
      nationalEcaMgM3: 200, // ECA D.S. 003-2017-MINAM (1h)
      isPhotochemical: true
    },
    source: {
      sourceType: 'LINEAL_VIA',
      sourceName: 'Tramo Av. Néstor Gambetta (Km 2 al Km 7)',
      facilityName: 'Corredor Portuario Callao',
      sector: 'OTRA_INDUSTRIA',
      lat: -12.0250,
      lng: -77.1250,
      utmX: 268300,
      utmY: 8670100,
      elevationMeters: 10,
      emissionRateGs: 18.2,
      lineLengthMeters: 5000,
      roadwayWidthMeters: 28.0
    },
    meteorology: {
      sourceType: 'ESTACION_SUPERFICIAL',
      stationName: 'Estación Aeropuerto Jorge Chávez - CORPAC',
      hasHourlySurfaceData: true,
      hasUpperAirSounding: true,
      anemometerHeightMeters: 10,
      surfaceRoughnessZ0: 0.1,
      bowenRatio: 0.8,
      surfaceAlbedo: 0.15,
      mixingHeightDetermined: true,
      calmsPercentage: 5.0,
      prevailingWindDirDeg: 200,
      avgWindSpeedMs: 5.1,
      temperatureC: 22.0,
      stabilityClass: 'D',
      processedAermetFilesAvailable: true
    },
    terrain: {
      terrainType: 'PLANO',
      hasDigitalElevationModel: true,
      demResolutionMeters: 30,
      aermapProcessed: true,
      maxTerrainElevationMeters: 45,
      minTerrainElevationMeters: 2,
      hasCoastalBoundaryRecirculation: true
    },
    receptors: {
      gridType: 'CARTESIANA_UNIFORME',
      gridSpacingMeters: 100,
      totalGridReceptors: 3600,
      includePropertyBoundaryReceptors: true,
      flagpoleReceptorHeightM: 1.5,
      discreteReceptors: [
        {
          id: 'REC-CALLAO-01',
          name: 'Hospital San José del Callao',
          type: 'HOSPITAL',
          lat: -12.0400,
          lng: -77.1150,
          utmX: 269400,
          utmY: 8668400,
          elevationMeters: 12,
          flagpoleHeightMeters: 1.5
        }
      ]
    },
    createdAt: '2026-08-22T09:00:00Z',
    updatedAt: '2026-08-23T10:20:00Z'
  }
];
