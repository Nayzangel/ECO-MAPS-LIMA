import React, { useState } from 'react';
import { 
  AirQualityModelingProject, 
  ModelingPollutantKey, 
  DiscreteReceptor 
} from '../../types/airQualityModeling';
import { EmissionSourceType, IndustrialSector } from '../../types/emissionSources';
import { 
  Compass, 
  Flame, 
  Wind, 
  Mountain, 
  Users, 
  Sliders, 
  Plus, 
  Trash2, 
  MapPin, 
  Activity, 
  Layers,
  Sparkles,
  Building,
  Check
} from 'lucide-react';

interface ModelingFormInputsProps {
  project: AirQualityModelingProject;
  onUpdateProject: (updated: AirQualityModelingProject) => void;
}

export const ModelingFormInputs: React.FC<ModelingFormInputsProps> = ({
  project,
  onUpdateProject
}) => {
  const [activeTab, setActiveTab] = useState<
    'COORDENADAS' | 'CONTAMINANTE' | 'FUENTE_EMISION' | 'METEOROLOGIA' | 'TERRENO' | 'RECEPTORES'
  >('COORDENADAS');

  // Helper updater
  const updateCoords = (partial: Partial<AirQualityModelingProject['coordinates']>) => {
    onUpdateProject({
      ...project,
      coordinates: { ...project.coordinates, ...partial },
      updatedAt: new Date().toISOString()
    });
  };

  const updatePollutant = (partial: Partial<AirQualityModelingProject['pollutant']>) => {
    onUpdateProject({
      ...project,
      pollutant: { ...project.pollutant, ...partial },
      updatedAt: new Date().toISOString()
    });
  };

  const updateSource = (partial: Partial<AirQualityModelingProject['source']>) => {
    onUpdateProject({
      ...project,
      source: { ...project.source, ...partial },
      updatedAt: new Date().toISOString()
    });
  };

  const updateMeteorology = (partial: Partial<AirQualityModelingProject['meteorology']>) => {
    onUpdateProject({
      ...project,
      meteorology: { ...project.meteorology, ...partial },
      updatedAt: new Date().toISOString()
    });
  };

  const updateTerrain = (partial: Partial<AirQualityModelingProject['terrain']>) => {
    onUpdateProject({
      ...project,
      terrain: { ...project.terrain, ...partial },
      updatedAt: new Date().toISOString()
    });
  };

  const updateReceptors = (partial: Partial<AirQualityModelingProject['receptors']>) => {
    onUpdateProject({
      ...project,
      receptors: { ...project.receptors, ...partial },
      updatedAt: new Date().toISOString()
    });
  };

  // Add discrete receptor
  const handleAddDiscreteReceptor = () => {
    const newId = `REC-${Date.now().toString().slice(-4)}`;
    const newReceptor: DiscreteReceptor = {
      id: newId,
      name: `Nuevo Receptor Sensible ${project.receptors.discreteReceptors.length + 1}`,
      type: 'POBLADO',
      lat: project.coordinates.centerLat + 0.01,
      lng: project.coordinates.centerLng + 0.01,
      utmX: project.coordinates.utmEasting + 1000,
      utmY: project.coordinates.utmNorthing + 1000,
      elevationMeters: project.coordinates.elevationBaseMeters + 10,
      flagpoleHeightMeters: 1.5
    };
    updateReceptors({
      discreteReceptors: [...project.receptors.discreteReceptors, newReceptor]
    });
  };

  const handleRemoveDiscreteReceptor = (id: string) => {
    updateReceptors({
      discreteReceptors: project.receptors.discreteReceptors.filter(r => r.id !== id)
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
      
      {/* 1. INPUT CATEGORY TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('COORDENADAS')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'COORDENADAS'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Compass className="w-3.5 h-3.5" /> 1. Coordenadas
        </button>

        <button
          onClick={() => setActiveTab('CONTAMINANTE')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'CONTAMINANTE'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Activity className="w-3.5 h-3.5" /> 2. Contaminante
        </button>

        <button
          onClick={() => setActiveTab('FUENTE_EMISION')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'FUENTE_EMISION'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Flame className="w-3.5 h-3.5" /> 3. Emisión & Fuente
        </button>

        <button
          onClick={() => setActiveTab('METEOROLOGIA')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'METEOROLOGIA'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Wind className="w-3.5 h-3.5" /> 4. Meteorología (AERMET)
        </button>

        <button
          onClick={() => setActiveTab('TERRENO')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'TERRENO'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Mountain className="w-3.5 h-3.5" /> 5. Terreno (AERMAP)
        </button>

        <button
          onClick={() => setActiveTab('RECEPTORES')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'RECEPTORES'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Users className="w-3.5 h-3.5" /> 6. Receptores
        </button>
      </div>

      {/* 2. TAB: COORDENADAS & DOMINIO */}
      {activeTab === 'COORDENADAS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Dominio Espacial & Sistema de Coordenadas</h4>
              <p className="text-xs text-slate-400">
                AERMOD requiere coordenadas métricas cartesianas en proyección UTM (WGS84 Zona 18S / 17S).
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800">
              UTM Zona {project.coordinates.utmZone}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Latitud Centroide (WGS84):</label>
              <input
                type="number"
                step="0.0001"
                value={project.coordinates.centerLat}
                onChange={e => updateCoords({ centerLat: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Longitud Centroide (WGS84):</label>
              <input
                type="number"
                step="0.0001"
                value={project.coordinates.centerLng}
                onChange={e => updateCoords({ centerLng: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Zona UTM / Datum:</label>
              <select
                value={project.coordinates.utmZone}
                onChange={e => updateCoords({ utmZone: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="18S">Zona 18 Sur (Lima, Callao, Ica, Junín)</option>
                <option value="17S">Zona 17 Sur (Piura, Lambayeque, La Libertad)</option>
                <option value="19S">Zona 19 Sur (Arequipa, Cusco, Puno, Tacna)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">UTM Este (m E):</label>
              <input
                type="number"
                value={project.coordinates.utmEasting}
                onChange={e => updateCoords({ utmEasting: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">UTM Norte (m N):</label>
              <input
                type="number"
                value={project.coordinates.utmNorthing}
                onChange={e => updateCoords({ utmNorthing: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Elevación Base Dominio (m s.n.m.):</label>
              <input
                type="number"
                value={project.coordinates.elevationBaseMeters}
                onChange={e => updateCoords({ elevationBaseMeters: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Ancho del Dominio (km):</label>
              <input
                type="number"
                value={project.coordinates.domainWidthKm}
                onChange={e => updateCoords({ domainWidthKm: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Largo del Dominio (km):</label>
              <input
                type="number"
                value={project.coordinates.domainHeightKm}
                onChange={e => updateCoords({ domainHeightKm: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Resolución Malla Receptores (m):</label>
              <input
                type="number"
                step="50"
                value={project.coordinates.gridResolutionMeters}
                onChange={e => updateCoords({ gridResolutionMeters: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB: CONTAMINANTE */}
      {activeTab === 'CONTAMINANTE' && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-bold text-white">Contaminante Atmosférico & Estándares ECA</h4>
            <p className="text-xs text-slate-400">
              Seleccione el contaminante de interés y el período de evaluación conforme al D.S. N° 003-2017-MINAM.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Contaminante:</label>
              <select
                value={project.pollutant.pollutant}
                onChange={e => {
                  const key = e.target.value as ModelingPollutantKey;
                  let name = 'Dióxido de Azufre';
                  let formula = 'SO₂';
                  let eca = 20;
                  if (key === 'NO2' || key === 'NOX') {
                    name = 'Dióxido de Nitrógeno';
                    formula = 'NO₂';
                    eca = 200;
                  } else if (key === 'PM10') {
                    name = 'Material Particulado PM10';
                    formula = 'PM₁₀';
                    eca = 100;
                  } else if (key === 'PM2_5') {
                    name = 'Material Particulado Fino PM2.5';
                    formula = 'PM₂.₅';
                    eca = 50;
                  } else if (key === 'CO') {
                    name = 'Monóxido de Carbono';
                    formula = 'CO';
                    eca = 10000;
                  } else if (key === 'H2S') {
                    name = 'Sulfuro de Hidrógeno';
                    formula = 'H₂S';
                    eca = 150;
                  }
                  updatePollutant({
                    pollutant: key,
                    name,
                    chemicalFormula: formula,
                    nationalEcaMgM3: eca
                  });
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value="SO2">Dióxido de Azufre (SO₂)</option>
                <option value="NO2">Dióxido de Nitrógeno (NO₂)</option>
                <option value="NOX">Óxidos de Nitrógeno (NOₓ)</option>
                <option value="PM10">Material Particulado (PM₁₀)</option>
                <option value="PM2_5">Material Particulado Fino (PM₂.₅)</option>
                <option value="CO">Monóxido de Carbono (CO)</option>
                <option value="H2S">Sulfuro de Hidrógeno (H₂S)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Período de Promediación:</label>
              <select
                value={project.pollutant.selectedAveragingPeriod}
                onChange={e => updatePollutant({ selectedAveragingPeriod: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value="1_HORA">1 Hora (Máximo horario)</option>
                <option value="8_HORAS">8 Horas (Móvil)</option>
                <option value="24_HORAS">24 Horas (Promedio diario)</option>
                <option value="ANUAL">Anual (Media aritmética)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">ECA Aire Perú (µg/m³):</label>
              <input
                type="number"
                value={project.pollutant.nationalEcaMgM3 ?? 0}
                onChange={e => updatePollutant({ nationalEcaMgM3: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>
          </div>

          {(project.pollutant.pollutant === 'NO2' || project.pollutant.pollutant === 'NOX') && (
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-rose-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-rose-300 block">Algoritmo Fotoquímico OLM / PVMRM (NO → NO₂)</span>
                <span className="text-[11px] text-slate-400">
                  Calcula la conversión dependiente de la concentración de Ozono (O₃) ambiente
                </span>
              </div>
              <input
                type="checkbox"
                checked={project.pollutant.isPhotochemical}
                onChange={e => updatePollutant({ isPhotochemical: e.target.checked })}
                className="w-4 h-4 accent-rose-500"
              />
            </div>
          )}
        </div>
      )}

      {/* 4. TAB: EMISIÓN & FUENTE */}
      {activeTab === 'FUENTE_EMISION' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Caracterización de la Fuente & Tasa de Emisión</h4>
              <p className="text-xs text-slate-400">
                Parámetros geométricos, termodinámicos y flujo de contaminantes de la instalación emisora.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-800">
              {project.source.sourceType}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Tipo de Fuente:</label>
              <select
                value={project.source.sourceType}
                onChange={e => updateSource({ sourceType: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="PUNTUAL_CHIMENEA">Puntual / Chimenea (Point Source)</option>
                <option value="LINEAL_VIA">Lineal / Vía (Line/Roadway Source)</option>
                <option value="AREA_SUPERFICIE">Área / Cantera (Area Source)</option>
                <option value="VOLUMEN">Volumen / Edificio (Volume Source)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Nombre de la Fuente:</label>
              <input
                type="text"
                value={project.source.sourceName}
                onChange={e => updateSource({ sourceName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Tasa de Emisión Másica Q (g/s):</label>
              <input
                type="number"
                step="0.1"
                value={project.source.emissionRateGs}
                onChange={e => updateSource({ emissionRateGs: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono font-bold text-amber-400"
              />
            </div>
          </div>

          {/* POINT SOURCE STACK PARAMETERS */}
          {project.source.sourceType === 'PUNTUAL_CHIMENEA' && (
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-amber-300">Geometría y Termodinámica de Salida de Gases:</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block">Altura Chimenea hs (m):</label>
                  <input
                    type="number"
                    value={project.source.stackHeightM ?? 0}
                    onChange={e => updateSource({ stackHeightM: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block">Diámetro Interior d (m):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={project.source.stackDiameterM ?? 0}
                    onChange={e => updateSource({ stackDiameterM: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block">Temp. Gases Ts (°C):</label>
                  <input
                    type="number"
                    value={project.source.gasExitTempC ?? 0}
                    onChange={e => updateSource({ gasExitTempC: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block">Velocidad Salida vs (m/s):</label>
                  <input
                    type="number"
                    step="0.5"
                    value={project.source.gasExitVelocityMs ?? 0}
                    onChange={e => updateSource({ gasExitVelocityMs: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* BUILDING DOWNWASH PRIME */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-xs">
                  <span className="font-bold text-slate-200 block">Efecto Rebufo de Edificio (BPIP / PRIME):</span>
                  <span className="text-[11px] text-slate-400">Cavidad turbulenta provocada por estructuras adyacentes</span>
                </div>
                <input
                  type="checkbox"
                  checked={project.source.hasBuildingDownwash}
                  onChange={e => updateSource({ hasBuildingDownwash: e.target.checked })}
                  className="w-4 h-4 accent-amber-500"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. TAB: METEOROLOGÍA */}
      {activeTab === 'METEOROLOGIA' && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-bold text-white">Meteorología & Preprocesador AERMET</h4>
            <p className="text-xs text-slate-400">
              AERMET calcula la capa límite atmosférica convectiva y mecánica a partir de datos de superficie y sondeo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Nombre Estación Meteorológica:</label>
              <input
                type="text"
                value={project.meteorology.stationName}
                onChange={e => updateMeteorology({ stationName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Velocidad Promedio Viento (m/s):</label>
              <input
                type="number"
                step="0.1"
                value={project.meteorology.avgWindSpeedMs}
                onChange={e => updateMeteorology({ avgWindSpeedMs: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Dirección Predominante (°):</label>
              <input
                type="number"
                value={project.meteorology.prevailingWindDirDeg}
                onChange={e => updateMeteorology({ prevailingWindDirDeg: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Rugosidad Superficial z0 (m):</label>
              <input
                type="number"
                step="0.01"
                value={project.meteorology.surfaceRoughnessZ0}
                onChange={e => updateMeteorology({ surfaceRoughnessZ0: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Razón de Bowen (Sensible/Latente):</label>
              <input
                type="number"
                step="0.1"
                value={project.meteorology.bowenRatio}
                onChange={e => updateMeteorology({ bowenRatio: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Frecuencia de Calmas (%):</label>
              <input
                type="number"
                step="0.5"
                value={project.meteorology.calmsPercentage}
                onChange={e => updateMeteorology({ calmsPercentage: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-300">Serie Horaria Continua (1 año completo):</span>
              <input
                type="checkbox"
                checked={project.meteorology.hasHourlySurfaceData}
                onChange={e => updateMeteorology({ hasHourlySurfaceData: e.target.checked })}
                className="w-4 h-4 accent-teal-500"
              />
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-300">Sondeo Vertical en Altura (Upper Air):</span>
              <input
                type="checkbox"
                checked={project.meteorology.hasUpperAirSounding}
                onChange={e => updateMeteorology({ hasUpperAirSounding: e.target.checked })}
                className="w-4 h-4 accent-teal-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB: TERRENO (AERMAP) */}
      {activeTab === 'TERRENO' && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-bold text-white">Topografía & Preprocesador AERMAP</h4>
            <p className="text-xs text-slate-400">
              AERMAP extrae elevaciones del terreno y calcula las alturas de escala de colina (hc) sobre el DEM SRTM/ASTER.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Clasificación del Terreno:</label>
              <select
                value={project.terrain.terrainType}
                onChange={e => updateTerrain({ terrainType: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="PLANO">Terreno Plano (Flat Terrain)</option>
                <option value="ONDULADO">Terreno Ondulado / Colinas suaves</option>
                <option value="COMPLEJO_MONTANOSO">Terreno Complejo Montañoso (Cerros de Lima)</option>
                <option value="COSTERO_VALLE">Valle Costero con Recirculación Marina</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Elevación Mínima (m s.n.m.):</label>
              <input
                type="number"
                value={project.terrain.minTerrainElevationMeters}
                onChange={e => updateTerrain({ minTerrainElevationMeters: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Elevación Máxima (m s.n.m.):</label>
              <input
                type="number"
                value={project.terrain.maxTerrainElevationMeters}
                onChange={e => updateTerrain({ maxTerrainElevationMeters: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-300 block">Modelo Digital de Elevación (DEM 30m):</span>
                <span className="text-[10px] text-slate-400">Archivos raster SRTM / ASTER</span>
              </div>
              <input
                type="checkbox"
                checked={project.terrain.hasDigitalElevationModel}
                onChange={e => updateTerrain({ hasDigitalElevationModel: e.target.checked })}
                className="w-4 h-4 accent-emerald-500"
              />
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-300 block">Preprocesamiento AERMAP Ejecutado:</span>
                <span className="text-[10px] text-slate-400">Alturas de escala hc determinadas</span>
              </div>
              <input
                type="checkbox"
                checked={project.terrain.aermapProcessed}
                onChange={e => updateTerrain({ aermapProcessed: e.target.checked })}
                className="w-4 h-4 accent-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* 7. TAB: RECEPTORES */}
      {activeTab === 'RECEPTORES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Malla de Receptores & Puntos Sensibles Discretos</h4>
              <p className="text-xs text-slate-400">
                Configure la cuadrícula de inmisión y receptores especiales (centros poblados, colegios, hospitales).
              </p>
            </div>
            <button
              onClick={handleAddDiscreteReceptor}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow transition"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar Receptor
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Tipo de Cuadrícula:</label>
              <select
                value={project.receptors.gridType}
                onChange={e => updateReceptors({ gridType: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="CARTESIANA_UNIFORME">Cartesiana Uniforme (Uniform Cartesian Grid)</option>
                <option value="POLAR">Polar Concéntrica (Polar Grid)</option>
                <option value="ANIDADA">Anidada de Alta Resolución (Nested Grid)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Espaciado de Malla (m):</label>
              <input
                type="number"
                step="50"
                value={project.receptors.gridSpacingMeters}
                onChange={e => updateReceptors({ gridSpacingMeters: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Altura de Respiración Flagpole (m):</label>
              <input
                type="number"
                step="0.1"
                value={project.receptors.flagpoleReceptorHeightM}
                onChange={e => updateReceptors({ flagpoleReceptorHeightM: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* DISCRETE RECEPTORS LIST */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-bold text-indigo-300">
              Receptores Discretos de Especial Interés ({project.receptors.discreteReceptors.length}):
            </div>
            
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {project.receptors.discreteReceptors.map(rec => (
                <div
                  key={rec.id}
                  className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold uppercase">
                        {rec.type}
                      </span>
                      <span className="font-bold text-white">{rec.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      UTM E: {rec.utmX.toLocaleString()} m, N: {rec.utmY.toLocaleString()} m | Elev: {rec.elevationMeters} m
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveDiscreteReceptor(rec.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition"
                    title="Eliminar receptor"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
