import { 
  AirQualityModelingProject, 
  ModelingSufficiencyAudit, 
  DataAvailabilityItem, 
  MissingDataItem 
} from '../types/airQualityModeling';

/**
 * Validates and audits an Air Quality Modeling project across all 7 regulatory dimensions:
 * 1. Coordenadas (Spatial Domain)
 * 2. Contaminante (Pollutant & Chemistry)
 * 3. Emisión (Mass Rate & Flow)
 * 4. Fuente (Geometry & Thermodynamics)
 * 5. Meteorología (AERMET Boundary Layer / Surface / Upper Air)
 * 6. Terreno (AERMAP Topography & DEM)
 * 7. Receptores (Cartesian Grid & Sensitive Points)
 */
export function evaluateModelingSufficiency(
  project: AirQualityModelingProject
): ModelingSufficiencyAudit {
  const availableData: DataAvailabilityItem[] = [];
  const missingData: MissingDataItem[] = [];

  // ==========================================
  // 1. EVALUATION: COORDENADAS & DOMINIO
  // ==========================================
  if (project.coordinates.centerLat && project.coordinates.centerLng) {
    availableData.push({
      category: 'COORDENADAS',
      parameter: 'Centroide del Dominio (WGS84)',
      value: `Lat ${project.coordinates.centerLat.toFixed(4)}°, Lng ${project.coordinates.centerLng.toFixed(4)}°`,
      status: 'COMPLETO',
      isRegulatoryRequirement: true
    });
  } else {
    missingData.push({
      category: 'COORDENADAS',
      parameter: 'Centroide Geográfico',
      reason: 'Faltan coordenadas geográficas del centro del dominio de estudio.',
      severity: 'CRITICO',
      regulatoryImpact: 'No se puede georreferenciar la malla de dispersión ni fuentes.'
    });
  }

  if (project.coordinates.utmEasting && project.coordinates.utmNorthing) {
    availableData.push({
      category: 'COORDENADAS',
      parameter: 'Coordenadas Proyectadas UTM',
      value: `Zona ${project.coordinates.utmZone}, E: ${project.coordinates.utmEasting.toLocaleString()} m, N: ${project.coordinates.utmNorthing.toLocaleString()} m (${project.coordinates.datum})`,
      status: 'COMPLETO',
      isRegulatoryRequirement: true
    });
  } else {
    missingData.push({
      category: 'COORDENADAS',
      parameter: 'Coordenadas Proyectadas UTM',
      reason: 'AERMOD requiere coordenadas métricas cartesianas (UTM Zona 18S / 17S).',
      severity: 'CRITICO',
      regulatoryImpact: 'Los modelos regulatorios EPA operan exclusivamente sobre cuadrículas métricas planas.'
    });
  }

  if (project.coordinates.domainWidthKm > 0 && project.coordinates.domainHeightKm > 0) {
    availableData.push({
      category: 'COORDENADAS',
      parameter: 'Extensión del Dominio',
      value: `${project.coordinates.domainWidthKm} km × ${project.coordinates.domainHeightKm} km (Área: ${project.coordinates.domainWidthKm * project.coordinates.domainHeightKm} km²)`,
      status: 'COMPLETO',
      isRegulatoryRequirement: true
    });
  }

  // ==========================================
  // 2. EVALUATION: CONTAMINANTE
  // ==========================================
  if (project.pollutant && project.pollutant.pollutant) {
    availableData.push({
      category: 'CONTAMINANTE',
      parameter: 'Parámetro de Modelamiento',
      value: `${project.pollutant.name} (${project.pollutant.chemicalFormula})`,
      status: 'COMPLETO',
      isRegulatoryRequirement: true
    });

    availableData.push({
      category: 'CONTAMINANTE',
      parameter: 'Período de Promediación Regulatorio',
      value: `${project.pollutant.selectedAveragingPeriod.replace('_', ' ')} (ECA: ${project.pollutant.nationalEcaMgM3 ?? 'No especificado'} µg/m³)`,
      status: 'COMPLETO',
      isRegulatoryRequirement: true
    });

    if (project.pollutant.pollutant === 'NOX' || project.pollutant.pollutant === 'NO2') {
      if (project.pollutant.isPhotochemical) {
        availableData.push({
          category: 'CONTAMINANTE',
          parameter: 'Química de Conversión NO/NO2',
          value: 'Algoritmo de Razón Pluma OLM / PVMRM configurado con O3 de fondo',
          status: 'COMPLETO',
          isRegulatoryRequirement: false
        });
      } else {
        missingData.push({
          category: 'CONTAMINANTE',
          parameter: 'Conversión Fotoquímica de NO a NO2',
          reason: 'No se configuró concentración de Ozono (O3) ambiente para el cálculo de conversión NO/NO2.',
          severity: 'ALERTA',
          regulatoryImpact: 'Se asumirá 100% de conversión o relación fija 0.75 (Método Tier 2 ARM2).'
        });
      }
    }
  } else {
    missingData.push({
      category: 'CONTAMINANTE',
      parameter: 'Selección de Contaminante',
      reason: 'Debe especificarse el contaminante objetivo (SO2, NOx, PM10, PM2.5, CO).',
      severity: 'CRITICO',
      regulatoryImpact: 'No se pueden definir las constantes de dispersión, decaimiento ni comparación con el ECA.'
    });
  }

  // ==========================================
  // 3. EVALUATION: EMISIÓN & 4. FUENTE
  // ==========================================
  if (project.source && project.source.sourceName) {
    availableData.push({
      category: 'FUENTE',
      parameter: 'Tipo y Nombre de Fuente',
      value: `[${project.source.sourceType}] ${project.source.sourceName} (${project.source.facilityName})`,
      status: 'COMPLETO',
      isRegulatoryRequirement: true
    });

    if (project.source.emissionRateGs > 0) {
      availableData.push({
        category: 'EMISION',
        parameter: 'Tasa de Emisión Másica (Q)',
        value: `${project.source.emissionRateGs} g/s (${(project.source.emissionRateGs * 3.6).toFixed(2)} kg/h)`,
        status: 'COMPLETO',
        isRegulatoryRequirement: true
      });
    } else {
      missingData.push({
        category: 'EMISION',
        parameter: 'Tasa de Emisión Másica (Q)',
        reason: 'La tasa de emisión debe ser mayor a 0 g/s.',
        severity: 'CRITICO',
        regulatoryImpact: 'Imposible calcular concentraciones en receptores sin flujo másico.'
      });
    }

    if (project.source.sourceType === 'PUNTUAL_CHIMENEA') {
      const hasHeight = (project.source.stackHeightM ?? 0) > 0;
      const hasDiam = (project.source.stackDiameterM ?? 0) > 0;
      const hasTemp = (project.source.gasExitTempC ?? 0) > 0;
      const hasVel = (project.source.gasExitVelocityMs ?? 0) > 0;

      if (hasHeight && hasDiam && hasTemp && hasVel) {
        availableData.push({
          category: 'FUENTE',
          parameter: 'Parámetros Termodinámicos de Chimenea',
          value: `hs: ${project.source.stackHeightM} m, d: ${project.source.stackDiameterM} m, Ts: ${project.source.gasExitTempC} °C, vs: ${project.source.gasExitVelocityMs} m/s`,
          status: 'COMPLETO',
          isRegulatoryRequirement: true
        });
      } else {
        missingData.push({
          category: 'FUENTE',
          parameter: 'Geometría & Termodinámica de Chimenea',
          reason: 'Faltan parámetros físicos indispensables (altura, diámetro, temperatura o velocidad de salida).',
          severity: 'CRITICO',
          regulatoryImpact: 'No se puede calcular el empuje térmico (Fb) ni momento cinético (Fm) para la elevación de penacho.'
        });
      }

      if (project.source.hasBuildingDownwash) {
        availableData.push({
          category: 'FUENTE',
          parameter: 'Efecto Rebufo de Edificio (Building Downwash)',
          value: `Estructura: H=${project.source.buildingHeightM}m, W=${project.source.buildingWidthM}m, L=${project.source.buildingLengthM}m (Algoritmo PRIME)`,
          status: 'COMPLETO',
          isRegulatoryRequirement: false
        });
      } else {
        missingData.push({
          category: 'FUENTE',
          parameter: 'Análisis de Cavidad de Edificios (BPIP-PRIME)',
          reason: 'No se han ingresado dimensiones de edificios cercanos a la chimenea.',
          severity: 'RECOMENDADO',
          regulatoryImpact: 'Puede subestimar concentraciones a sotavento si la chimenea no cumple la regla de Buena Práctica de Ingeniería (GEP).'
        });
      }
    }
  } else {
    missingData.push({
      category: 'FUENTE',
      parameter: 'Caracterización de la Fuente',
      reason: 'No se ha configurado la fuente emisora.',
      severity: 'CRITICO',
      regulatoryImpact: 'No hay punto o geometría de liberación del contaminante.'
    });
  }

  // ==========================================
  // 5. EVALUATION: METEOROLOGÍA (AERMET)
  // ==========================================
  if (project.meteorology) {
    if (project.meteorology.hasHourlySurfaceData) {
      availableData.push({
        category: 'METEOROLOGIA',
        parameter: 'Datos Meteorológicos de Superficie',
        value: `Estación: ${project.meteorology.stationName} (Velocidad: ${project.meteorology.avgWindSpeedMs} m/s, Dir: ${project.meteorology.prevailingWindDirDeg}°, Temp: ${project.meteorology.temperatureC}°C)`,
        status: 'COMPLETO',
        isRegulatoryRequirement: true
      });
    } else {
      missingData.push({
        category: 'METEOROLOGIA',
        parameter: 'Serie Meteorológica Horaria Superficial',
        reason: 'Se requiere una serie horaria continua representativa (mínimo 1 año completo según EPA/SENAMHI).',
        severity: 'CRITICO',
        regulatoryImpact: 'Impide la ejecución de modelos refinados como AERMOD. Solo permite análisis de tamizaje exploratorio (Screening).'
      });
    }

    if (project.meteorology.hasUpperAirSounding) {
      availableData.push({
        category: 'METEOROLOGIA',
        parameter: 'Perfil Vertical / Radiosondeo en Altura',
        value: 'Datos de capa límite atmosférica y perfiles de temperatura en altura validados',
        status: 'COMPLETO',
        isRegulatoryRequirement: true
      });
    } else {
      missingData.push({
        category: 'METEOROLOGIA',
        parameter: 'Sondeo en Altura (Upper Air / Radiosondeo)',
        reason: 'Falta información de radiosondeo vertical para el cálculo de la altura de la capa de mezcla convectiva/mecánica en AERMET Stage 2.',
        severity: 'ALERTA',
        regulatoryImpact: 'Se requiere usar perfiles parametrizados WRF / MM5 o aproximaciones de capa límite costera.'
      });
    }

    if (project.meteorology.surfaceRoughnessZ0 > 0) {
      availableData.push({
        category: 'METEOROLOGIA',
        parameter: 'Parámetros Micrometeorológicos de Superficie',
        value: `Rugosidad z0: ${project.meteorology.surfaceRoughnessZ0} m, Bowen Ratio: ${project.meteorology.bowenRatio}, Albedo: ${project.meteorology.surfaceAlbedo}`,
        status: 'COMPLETO',
        isRegulatoryRequirement: true
      });
    } else {
      missingData.push({
        category: 'METEOROLOGIA',
        parameter: 'Parámetros de Rugosidad Superficial (AERSURFACE)',
        reason: 'Falta parametrización estacional de rugosidad (z0), razón de Bowen y albedo por sectores de 30° alrededor de la estación.',
        severity: 'ALERTA',
        regulatoryImpact: 'AERMET no podrá calcular el flujo de calor sensible ni la velocidad de fricción (u*).'
      });
    }
  }

  // ==========================================
  // 6. EVALUATION: TERRENO & TOPOGRAFÍA (AERMAP)
  // ==========================================
  if (project.terrain) {
    if (project.terrain.hasDigitalElevationModel) {
      availableData.push({
        category: 'TERRENO',
        parameter: 'Modelo Digital de Elevación (DEM/SRTM)',
        value: `DEM activo (${project.terrain.demResolutionMeters ?? 30}m resolución, Elev. máx: ${project.terrain.maxTerrainElevationMeters} m, mín: ${project.terrain.minTerrainElevationMeters} m)`,
        status: 'COMPLETO',
        isRegulatoryRequirement: true
      });
    } else {
      missingData.push({
        category: 'TERRENO',
        parameter: 'Modelo Digital de Elevación Topográfica (DEM)',
        reason: 'No se ha cargado archivo raster DEM (GeoTIFF / SRTM 30m) del relieve de la zona de estudio.',
        severity: project.terrain.terrainType === 'COMPLEJO_MONTANOSO' ? 'CRITICO' : 'ALERTA',
        regulatoryImpact: 'En el entorno montañoso de los cerros de Lima, asumir terreno plano subestima severamente el impacto en laderas y receptores elevados.'
      });
    }

    if (project.terrain.aermapProcessed) {
      availableData.push({
        category: 'TERRENO',
        parameter: 'Preprocesamiento AERMAP',
        value: 'Elevaciones y alturas de escala de colina (Hill Scale Heights hc) calculadas para cada receptor',
        status: 'COMPLETO',
        isRegulatoryRequirement: true
      });
    } else {
      missingData.push({
        category: 'TERRENO',
        parameter: 'Cálculo de Altura de Escala de Colina (AERMAP hc)',
        reason: 'Pendiente de procesar la relación topográfica fuente-colina para la línea de corriente crítica.',
        severity: 'ALERTA',
        regulatoryImpact: 'AERMOD requiere hc para determinar la división de flujo entre la pluma coherente y la pluma que rodea el relieve.'
      });
    }
  }

  // ==========================================
  // 7. EVALUATION: RECEPTORES
  // ==========================================
  if (project.receptors) {
    const hasGrid = project.receptors.totalGridReceptors > 0;
    const discreteCount = project.receptors.discreteReceptors?.length ?? 0;

    if (hasGrid || discreteCount > 0) {
      availableData.push({
        category: 'RECEPTORES',
        parameter: 'Red de Receptores de Calidad del Aire',
        value: `Malla: ${project.receptors.totalGridReceptors} puntos (espaciado ${project.receptors.gridSpacingMeters}m) + ${discreteCount} receptores sensibles discretos`,
        status: 'COMPLETO',
        isRegulatoryRequirement: true
      });
    } else {
      missingData.push({
        category: 'RECEPTORES',
        parameter: 'Receptores de Evaluación',
        reason: 'No se han definido receptores en malla ni puntos de interés sensible (hospitales, colegios, poblaciones).',
        severity: 'CRITICO',
        regulatoryImpact: 'No es posible evaluar la concentración de inmisión en la población ni en el límite de propiedad.'
      });
    }
  }

  // ==========================================
  // MODEL RECOMMENDATION & LOGIC
  // ==========================================
  const isDomainLarge = project.coordinates.domainWidthKm > 50 || project.coordinates.domainHeightKm > 50;
  const isComplexCoastal = project.terrain.hasCoastalBoundaryRecirculation || (project.meteorology.calmsPercentage > 15);
  const isComplexValley = project.terrain.terrainType === 'COMPLEJO_MONTANOSO';
  const hasHourlyMet = project.meteorology.hasHourlySurfaceData;

  let recommendedModel: 'AERMOD' | 'CALPUFF' | 'AERSCREEN' | 'CALINE4' | 'CMAQ' | 'NO_DETERMINADO' = 'AERMOD';
  let recommendedModelFullName = 'AERMOD (EPA Regulatory Steady-State Plume Model - Versión v23132/v24142)';
  let recommendationReason = '';
  const modelLimitations: string[] = [];

  if (isDomainLarge || (isComplexCoastal && isComplexValley)) {
    recommendedModel = 'CALPUFF';
    recommendedModelFullName = 'CALPUFF (Non-Steady-State Lagrangian Puff Modeling System - EPA Guideline)';
    recommendationReason = 'Recomendado por la presencia de recirculación costera de brisa marina en Lima, regímenes de vientos calmos (>15%) o dominio de modelamiento mayor a 50 km donde el modelo estacionario AERMOD pierde validez.';
  } else if (!hasHourlyMet) {
    recommendedModel = 'AERSCREEN';
    recommendedModelFullName = 'AERSCREEN / SCREEN3 (EPA Regulatory Screening Model)';
    recommendationReason = 'Recomendado como modelo de tamizaje (Screening) debido a la ausencia de una serie temporal meteorológica horaria completa de 1 año procesada por AERMET.';
  } else if (project.source.sourceType === 'LINEAL_VIA') {
    recommendedModel = 'AERMOD';
    recommendedModelFullName = 'AERMOD - Algoritmo LINE / RLINE (Roadway Dispersion)';
    recommendationReason = 'Recomendado para fuentes lineales vehiculares en corredores metropolitanos urbanos integrados en cuadrículas de dispersión.';
  } else {
    recommendedModel = 'AERMOD';
    recommendedModelFullName = 'AERMOD (EPA Regulatory Dispersion Model v23132/v24142 con AERMET y AERMAP)';
    recommendationReason = 'Modelo regulatorio estándar de pluma gaussiana modificada para fuentes puntuales industriales, con capacidad para terreno complejo (AERMAP) y efecto de rebufo de edificios (PRIME) en distancias menores a 50 km.';
  }

  // Mandatory Technical Limitations according to EPA / MINAM guidelines
  modelLimitations.push('AERMOD asume condiciones meteorológicas estacionarias y uniformes a lo largo de cada hora en distancias < 50 km; no reproduce inversiones térmicas con cizalladura de viento tridimensional en valles profundos.');
  modelLimitations.push('El tratamiento de períodos de calma (< 0.5 m/s) en AERMOD utiliza un límite inferior de velocidad de fricción (u*) que puede sobredimensionar la concentración local inmediata.');
  modelLimitations.push('La conversión fotoquímica de NO a NO2 en modelos no fotoquímicos requiere métodos de relación de pluma (OLM/PVMRM/ARM2) que dependen de mediciones horarias de Ozono (O3) ambiente.');
  modelLimitations.push('En la franja costera de Lima (Callao/Ventanilla/Lurín), el desarrollo de la Capa Límite Interna Térmica (TIBL) requiere caracterización fina de la temperatura de la superficie del mar (SST).');
  modelLimitations.push('Todo modelamiento regulatorio en el marco del SEIA (EIA-d / EIA-sd) debe fundamentarse en datos meteorológicos certificados por SENAMHI o modelamiento mesoescalar WRF validado.');

  // Data completeness calculation
  const totalRequiredParams = 12;
  const criticalMissing = missingData.filter(m => m.severity === 'CRITICO').length;
  const alertMissing = missingData.filter(m => m.severity === 'ALERTA').length;
  const dataCompletenessPercentage = Math.max(10, Math.min(100, Math.round(100 - (criticalMissing * 18 + alertMissing * 8))));

  const isSufficientForScreening = criticalMissing <= 1;
  const isSufficientForRefined = criticalMissing === 0 && alertMissing <= 1;

  // Generate authentic regulatory script preview for AERMOD .INP
  const aermodInp = generateAermodInputPreview(project);

  return {
    availableData,
    missingData,
    dataCompletenessPercentage,
    isSufficientForScreening,
    isSufficientForRefined,
    recommendedModel,
    recommendedModelFullName,
    recommendationReason,
    modelLimitations,
    integrationStatus: 'MODELO_ESPECIALIZADO_PENDIENTE',
    statusMessage: 'MODELO ESPECIALIZADO PENDIENTE DE INTEGRACIÓN: El cálculo regulatorio requiere conexión con el motor compilado EPA AERMOD / CALPUFF mediante archivos preprocesados .INP / .PFL / .SFC. Por política de integridad científica y regulatoria, no se efectúan simulaciones ficticias ni mapas de concentración aproximados sin motor validado.',
    canGenerateConcentrationMap: false,
    inputScriptPreview: {
      aermodInp,
      aermetStage3Summary: `** PREPROCESAMIENTO METEOROLÓGICO AERMET (Archivos Requeridos: .SFC y .PFL)
* Estación Superficial: ${project.meteorology.stationName} (Elev: ${project.coordinates.elevationBaseMeters}m)
* z0: ${project.meteorology.surfaceRoughnessZ0} m | Albedo: ${project.meteorology.surfaceAlbedo} | Bowen: ${project.meteorology.bowenRatio}
* Estado: Requiere archivo .SFC (Surface parameters) y .PFL (Profile data)`,
      aermapStructure: `** PREPROCESAMIENTO DE TERRENO AERMAP (DEM / SRTM 30m)
* Dominio UTM: Zona ${project.coordinates.utmZone}, E: ${project.coordinates.utmEasting}, N: ${project.coordinates.utmNorthing}
* Receptores en Malla: ${project.receptors.totalGridReceptors} puntos con cálculo de elevación (ze) y altura de escala (hc)`
    }
  };
}

/**
 * Generates standard EPA AERMOD .INP control file content based on configured parameters
 */
function generateAermodInputPreview(project: AirQualityModelingProject): string {
  const pollutantKey = project.pollutant.pollutant;
  const period = project.pollutant.selectedAveragingPeriod === '24_HORAS' ? '24' : project.pollutant.selectedAveragingPeriod === '1_HORA' ? '1' : 'ANNUAL';
  const srcId = 'STK01';
  const q = project.source.emissionRateGs;
  const hs = project.source.stackHeightM ?? 50.0;
  const ts = (project.source.gasExitTempC ?? 150) + 273.15; // K
  const vs = project.source.gasExitVelocityMs ?? 15.0; // m/s
  const ds = project.source.stackDiameterM ?? 2.0; // m

  return `** =========================================================
** ARCHIVO DE CONTROL REGULATORIO EPA AERMOD (v23132/v24142)
** PROYECTO: ${project.projectName.toUpperCase()}
** GENERADO POR: ECO-MAP SISTEMA DE INTELIGENCIA AMBIENTAL
** =========================================================

CO STARTING
   TITLEONE  ${project.projectName}
   TITLETWO  Evaluación de Inmisión de ${project.pollutant.name} - ${project.organization}
   MODELOPT  CONC  FLAT  DFAULT
   AVERTIME  ${period}  PERIOD
   POLLUTID  ${pollutantKey}
   RUNORNOT  RUN
CO FINISHED

SO STARTING
   LOCATION  ${srcId}  POINT  ${project.source.utmX}  ${project.source.utmY}  ${project.source.elevationMeters}
   SRCPARAM  ${srcId}  ${q.toFixed(2)}  ${hs.toFixed(1)}  ${ts.toFixed(1)}  ${vs.toFixed(1)}  ${ds.toFixed(2)}
   ${project.source.hasBuildingDownwash ? `BUILDHGT  ${srcId}  ${project.source.buildingHeightM}  ${project.source.buildingHeightM}  ${project.source.buildingHeightM}` : '** SIN REBUFO DE EDIFICIO DECLARADO'}
   SRCGROUP  ALL
SO FINISHED

RE STARTING
   GRIDPOLR  POL01  STA
             ORIG   ${srcId}
             DIST   100  250  500  750  1000  1500  2000  3000  5000
             DDIR   16   22.5  22.5
   GRIDPOLR  POL01  END
   ${project.receptors.discreteReceptors.map(r => `DISCCART  ${r.utmX}  ${r.utmY}  ${r.elevationMeters}  ${r.flagpoleHeightMeters}  ** Receptor: ${r.name}`).join('\n   ')}
RE FINISHED

ME STARTING
   SURFFILE  met_surface_${project.meteorology.stationName.toLowerCase().replace(/\s+/g, '_')}.sfc
   PROFFILE  met_profile_${project.meteorology.stationName.toLowerCase().replace(/\s+/g, '_')}.pfl
   SURFDATA  99999  2024  ${project.meteorology.stationName.toUpperCase()}
   UAIRDATA  99999  2024  LIMA_AEROPUERTO
   PROFBASE  ${project.coordinates.elevationBaseMeters}.0  METERS
ME FINISHED

OU STARTING
   RECTABLE  ALLAVE  FIRST-SECOND
   MAXTABLE  ALLAVE  50
   PLOTFILE  ${period}  ALL  FIRST  aermod_${pollutantKey.toLowerCase()}_${period}h.plt
OU FINISHED
`;
}
