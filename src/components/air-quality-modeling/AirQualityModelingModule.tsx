import React, { useState, useMemo } from 'react';
import { AirQualityModelingProject } from '../../types/airQualityModeling';
import { STUDY_CASES_PRESETS } from '../../data/airQualityModelingCases';
import { evaluateModelingSufficiency } from '../../utils/airQualityModelingValidator';
import { ModelingFormInputs } from './ModelingFormInputs';
import { ModelingAuditResultsView } from './ModelingAuditResultsView';
import { 
  Cpu, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Compass, 
  Sliders, 
  RefreshCw, 
  Sparkles, 
  ShieldAlert,
  Terminal,
  MapPin,
  Flame,
  Wind,
  Mountain,
  Users,
  Activity,
  FolderOpen
} from 'lucide-react';

export const AirQualityModelingModule: React.FC = () => {
  // Current active modeling project state
  const [selectedCaseId, setSelectedCaseId] = useState<string>(STUDY_CASES_PRESETS[0].id);
  const [project, setProject] = useState<AirQualityModelingProject>(STUDY_CASES_PRESETS[0]);
  const [mainView, setMainView] = useState<'AUDITORIA_DIAGNOSTICO' | 'FORMULARIO_INPUTS' | 'MAPA_INTEGRACION'>('AUDITORIA_DIAGNOSTICO');

  // Compute live sufficiency audit
  const auditResult = useMemo(() => {
    return evaluateModelingSufficiency(project);
  }, [project]);

  // Handle case selection
  const handleSelectCase = (caseId: string) => {
    const found = STUDY_CASES_PRESETS.find(c => c.id === caseId);
    if (found) {
      setSelectedCaseId(caseId);
      setProject({ ...found });
    }
  };

  // Quick reset to empty/incomplete to demonstrate missing data check
  const handleCreateBlankProject = () => {
    setSelectedCaseId('CUSTOM-NEW');
    setProject({
      id: `CUSTOM-${Date.now()}`,
      projectName: 'Nuevo Proyecto de Modelamiento en Evaluación',
      description: 'Proyecto en etapa de levantamiento de línea base y configuración de parámetros regulatorios.',
      organization: 'Titular Minero / Industrial Lima',
      coordinates: {
        centerLat: -12.0464,
        centerLng: -77.0428,
        utmZone: '18S',
        datum: 'WGS84',
        utmEasting: 277600,
        utmNorthing: 8667400,
        domainWidthKm: 20,
        domainHeightKm: 20,
        gridResolutionMeters: 500,
        elevationBaseMeters: 150
      },
      pollutant: {
        pollutant: 'SO2',
        name: 'Dióxido de Azufre',
        chemicalFormula: 'SO₂',
        averagingPeriods: ['24_HORAS'],
        selectedAveragingPeriod: '24_HORAS',
        nationalEcaMgM3: 20,
        isPhotochemical: false
      },
      source: {
        sourceType: 'PUNTUAL_CHIMENEA',
        sourceName: 'Chimenea Caldera Auxiliar',
        facilityName: 'Planta de Procesos',
        sector: 'OTRA_INDUSTRIA',
        lat: -12.0464,
        lng: -77.0428,
        utmX: 277600,
        utmY: 8667400,
        elevationMeters: 150,
        emissionRateGs: 0, // Incompleto para mostrar DATOS FALTANTES
        stackHeightM: 0, // Incompleto
        stackDiameterM: 0,
        gasExitTempC: 0,
        gasExitVelocityMs: 0
      },
      meteorology: {
        sourceType: 'ESTACION_SUPERFICIAL',
        stationName: 'Estación No Especificada',
        hasHourlySurfaceData: false, // Faltante
        hasUpperAirSounding: false,
        anemometerHeightMeters: 10,
        surfaceRoughnessZ0: 0,
        bowenRatio: 0,
        surfaceAlbedo: 0,
        mixingHeightDetermined: false,
        calmsPercentage: 0,
        prevailingWindDirDeg: 180,
        avgWindSpeedMs: 0,
        temperatureC: 20,
        stabilityClass: 'D',
        processedAermetFilesAvailable: false
      },
      terrain: {
        terrainType: 'PLANO',
        hasDigitalElevationModel: false, // Faltante
        aermapProcessed: false,
        maxTerrainElevationMeters: 200,
        minTerrainElevationMeters: 100,
        hasCoastalBoundaryRecirculation: false
      },
      receptors: {
        gridType: 'CARTESIANA_UNIFORME',
        gridSpacingMeters: 500,
        totalGridReceptors: 0, // Faltante
        discreteReceptors: [],
        includePropertyBoundaryReceptors: false,
        flagpoleReceptorHeightM: 1.5
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-8">
      
      {/* 1. MODULE HERO & HEADER */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5" />
              Módulo de Modelamiento de Calidad del Aire
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Evaluador de Suficiencia & <span className="text-indigo-400">Arquitectura de Modelamiento</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Auditoría previa y revisión automática de requerimientos regulatorios en <strong>7 dimensiones</strong> (Coordenadas, Contaminante, Emisión, Fuente, Meteorología, Terreno y Receptores). Diseñado con arquitectura lista para acoplar motores regulatorios EPA como <strong>AERMOD</strong> o <strong>CALPUFF</strong>.
            </p>
          </div>

          {/* QUICK PRESET SELECTOR */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 min-w-[280px]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FolderOpen className="w-3.5 h-3.5 text-indigo-400" /> Casos de Estudio:
              </span>
              <button
                onClick={handleCreateBlankProject}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold underline"
              >
                + Caso Incompleto
              </button>
            </div>

            <select
              value={selectedCaseId}
              onChange={e => handleSelectCase(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500"
            >
              {STUDY_CASES_PRESETS.map(c => (
                <option key={c.id} value={c.id}>
                  {c.projectName.length > 40 ? c.projectName.slice(0, 40) + '...' : c.projectName}
                </option>
              ))}
              <option value="CUSTOM-NEW">Personalizado / En edición</option>
            </select>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
              <span>Completitud de datos:</span>
              <span className={`font-mono font-bold ${
                auditResult.dataCompletenessPercentage >= 80 ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {auditResult.dataCompletenessPercentage}%
              </span>
            </div>
          </div>
        </div>

        {/* 2. NAVIGATION BAR (Auditoría vs Formulario vs Integración) */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-slate-800">
          <button
            onClick={() => setMainView('AUDITORIA_DIAGNOSTICO')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              mainView === 'AUDITORIA_DIAGNOSTICO'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" /> 
            Auditoría: Datos Disponibles, Faltantes, Modelo & Limitaciones
          </button>

          <button
            onClick={() => setMainView('FORMULARIO_INPUTS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              mainView === 'FORMULARIO_INPUTS'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" /> 
            Editar Variables del Proyecto (7 Dimensiones)
          </button>
        </div>

      </div>

      {/* 3. MAIN CONTENT BASED ON ACTIVE VIEW */}
      {mainView === 'AUDITORIA_DIAGNOSTICO' && (
        <ModelingAuditResultsView 
          project={project} 
          audit={auditResult} 
        />
      )}

      {mainView === 'FORMULARIO_INPUTS' && (
        <div className="space-y-6">
          <ModelingFormInputs 
            project={project} 
            onUpdateProject={setProject} 
          />

          <div className="flex justify-end">
            <button
              onClick={() => setMainView('AUDITORIA_DIAGNOSTICO')}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 transition"
            >
              <CheckCircle2 className="w-4 h-4" /> Re-evaluar Suficiencia & Diagnóstico
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
