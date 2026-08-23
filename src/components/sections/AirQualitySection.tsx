import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wind, 
  MapPin, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  PlusCircle, 
  SlidersHorizontal, 
  Table, 
  Compass, 
  Clock, 
  Sparkles, 
  FileSpreadsheet, 
  BarChart3, 
  Info,
  CheckCircle2,
  Scale
} from 'lucide-react';
import { 
  AirMeasurementRecord, 
  AirParameterKey, 
  DataSourceType 
} from '../../types/airQuality';
import { 
  PERUVIAN_AIR_NORMATIVE, 
  calculateIncaIndex, 
  evaluateAirExceedance, 
  calculateAirStatistics 
} from '../../utils/airQualityNormative';
import { 
  OFFICIAL_AIR_STATIONS, 
  generateHourlySeries, 
  generateWeeklySeries 
} from '../../data/airQualityData';
import { ViewMode, StationData } from '../../types';

// Child Components
import { AirIndicatorsSummary } from '../air-quality/AirIndicatorsSummary';
import { AirTimeSeriesChart } from '../air-quality/AirTimeSeriesChart';
import { AirExceedanceCard } from '../air-quality/AirExceedanceCard';
import { AirWindRoseWidget } from '../air-quality/AirWindRoseWidget';
import { AirQualityMap } from '../air-quality/AirQualityMap';
import { AirPointsTable } from '../air-quality/AirPointsTable';
import { AirMeasurementInputModal } from '../air-quality/AirMeasurementInputModal';

interface AirQualitySectionProps {
  viewMode?: ViewMode;
  onSelectStationForMap?: (stationId: string) => void;
  onOpenAnalysisWithStation?: (station: StationData) => void;
}

export const AirQualitySection: React.FC<AirQualitySectionProps> = ({
  viewMode = 'ciudadano',
  onSelectStationForMap,
  onOpenAnalysisWithStation
}) => {
  // Master Stations State (Official + User records from LocalStorage)
  const [stations, setStations] = useState<AirMeasurementRecord[]>(() => {
    try {
      const saved = localStorage.getItem('ecomap_user_air_records');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...OFFICIAL_AIR_STATIONS, ...parsed];
      }
    } catch (e) {
      console.error('Error reading localStorage for air quality', e);
    }
    return OFFICIAL_AIR_STATIONS;
  });

  // Active Parameter Filter
  const [selectedParam, setSelectedParam] = useState<AirParameterKey>('PM2_5');
  
  // Selected Station for detail view
  const [selectedStationId, setSelectedStationId] = useState<string>(OFFICIAL_AIR_STATIONS[0].id);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'MAP' | 'TIME_SERIES' | 'EXCEEDANCES' | 'TABLE'>('MAP');

  // Input Modal state
  const [isInputModalOpen, setIsInputModalOpen] = useState<boolean>(false);

  // Notification Banner State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter stations based on parameter or display all
  const currentMeta = PERUVIAN_AIR_NORMATIVE[selectedParam] || PERUVIAN_AIR_NORMATIVE.PM2_5;

  // Active station data
  const currentStation = useMemo(() => {
    return stations.find(s => s.id === selectedStationId) || stations[0];
  }, [stations, selectedStationId]);

  // Hourly series and Weekly series for the active station & parameter
  const hourlyData = useMemo(() => {
    // Generate synthetic realistic hourly series pegged to the station's measurement
    return generateHourlySeries(selectedParam, currentStation.concentration, currentMeta.ecaLimit);
  }, [selectedParam, currentStation, currentMeta]);

  const weeklyData = useMemo(() => {
    return generateWeeklySeries(selectedParam, currentStation.concentration, currentMeta.ecaLimit);
  }, [selectedParam, currentStation, currentMeta]);

  // Exceedance evaluation
  const exceedanceResult = useMemo(() => {
    return evaluateAirExceedance(selectedParam, currentStation.concentration);
  }, [selectedParam, currentStation]);

  // Summary statistics
  const statistics = useMemo(() => {
    const values = hourlyData.map(d => d.value);
    const windSpeeds = hourlyData.map(d => d.windSpeed);
    const windDirections = hourlyData.map(d => d.windDirection);
    return calculateAirStatistics(values, selectedParam, windSpeeds, windDirections);
  }, [hourlyData, selectedParam]);

  // Save new user measurement
  const handleSaveMeasurement = (newRecord: AirMeasurementRecord) => {
    const updated = [newRecord, ...stations];
    setStations(updated);
    setSelectedStationId(newRecord.id);
    setSelectedParam(newRecord.parameter);

    // Save only user added items to localStorage
    const userRecords = updated.filter(s => s.isUserAdded);
    try {
      localStorage.setItem('ecomap_user_air_records', JSON.stringify(userRecords));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }

    setToastMessage(`Medición "${newRecord.title}" registrada y auditada exitosamente.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Delete user measurement
  const handleDeleteUserStation = (id: string) => {
    const updated = stations.filter(s => s.id !== id);
    setStations(updated);
    if (selectedStationId === id) {
      setSelectedStationId(OFFICIAL_AIR_STATIONS[0].id);
    }
    const userRecords = updated.filter(s => s.isUserAdded);
    try {
      localStorage.setItem('ecomap_user_air_records', JSON.stringify(userRecords));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
    setToastMessage('Registro eliminado correctamente.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Bridge to the Decision Engine modal
  const handleOpenDecisionEngineForStation = (station: AirMeasurementRecord) => {
    if (onOpenAnalysisWithStation) {
      const bridgeStation: StationData = {
        id: station.id,
        name: station.title,
        district: station.district,
        zoneType: station.zoneType,
        coordinates: station.coordinates,
        elevation: 150,
        pm25: station.parameter === 'PM2_5' ? station.concentration : 45.0,
        pm10: station.parameter === 'PM10' ? station.concentration : 95.0,
        so2: station.parameter === 'SO2' ? station.concentration : 20.0,
        no2: station.parameter === 'NO2' ? station.concentration : 45.0,
        co: station.parameter === 'CO' ? station.concentration / 1000 : 2.5,
        o3: station.parameter === 'O3' ? station.concentration : 30.0,
        noiseDay: 62.5,
        noiseNight: 52.0,
        temperature: station.meteorology.temperature,
        humidity: station.meteorology.humidity,
        windSpeed: station.meteorology.windSpeed,
        windDirection: station.meteorology.windDirectionCardinal,
        lastUpdate: `${station.date} ${station.time}`,
        incaIndex: calculateIncaIndex(station.parameter, station.concentration).category === 'BUENO' ? 'Bueno' : 'Cuidado',
        riskLevel: station.concentration > currentMeta.ecaLimit ? 'Critico' : 'Optimo',
        primaryIssue: station.notes || `Monitoreo de ${station.parameter} según ${currentMeta.legalBasis}.`,
        isDemo: !station.isUserAdded
      };
      onOpenAnalysisWithStation(bridgeStation);
    }
  };

  return (
    <section id="aire" className="py-20 bg-slate-950/80 border-b border-slate-800/80 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* TOAST ALERT */}
        {toastMessage && (
          <div className="p-3 bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 rounded-2xl flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2 shadow-lg">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-emerald-400 hover:text-white text-xs font-mono font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* SECTION HEADER & ACTIONS */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Wind className="w-3.5 h-3.5" />
              Módulo Oficial de Calidad del Aire (MINAM)
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Vigilancia Atmosférica & <span className="text-emerald-400">Motor Normativo ECA</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-3xl leading-relaxed">
              Monitoreo y evaluación continua de contaminantes del <strong>D.S. N° 003-2017-MINAM</strong> y la escala <strong>INCA (R.M. N° 181-2016-MINAM)</strong>. 
              Analice concentraciones horarias, acoplamiento meteorológico y fiscalización de excedencias en Lima y Callao.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setIsInputModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Ingresar Medición de Calidad del Aire</span>
            </button>

            <div className="px-3 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{stations.length} Puntos Monitoreados</span>
            </div>
          </div>
        </div>

        {/* PARAMETER SELECTOR CHIPS (PERUVIAN OFFICIAL STANDARDS) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="font-bold uppercase tracking-wider text-slate-300">
              Seleccionar Contaminante Normativo (D.S. N° 003-2017-MINAM):
            </span>
            <span>ECA Límite: <strong className="text-white">{currentMeta.ecaLimit} {currentMeta.unit}</strong> ({currentMeta.primaryTimeframe})</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {Object.values(PERUVIAN_AIR_NORMATIVE).map((param) => {
              const isSelected = selectedParam === param.key;
              return (
                <button
                  key={param.key}
                  type="button"
                  onClick={() => setSelectedParam(param.key)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-slate-950' : 'bg-emerald-400'}`} />
                  <span className="font-extrabold">{param.code}</span>
                  <span className={`text-[10px] font-normal ${isSelected ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                    ({param.ecaLimit} {param.unit})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* EXECUTIVE KPI SUMMARY CARDS */}
        <AirIndicatorsSummary stats={statistics} meta={currentMeta} />

        {/* NAVIGATION TABS FOR MODULE SUBVIEWS */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 flex-wrap gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('MAP')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'MAP'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Mapa & Estación Activa</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('TIME_SERIES')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'TIME_SERIES'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Evolución Temporal (24h)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('EXCEEDANCES')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'EXCEEDANCES'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Excedencias & Marco Legal</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('TABLE')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'TABLE'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Tabla de Monitoreos ({stations.length})</span>
            </button>
          </div>

          {/* Quick audit button */}
          <button
            type="button"
            onClick={() => handleOpenDecisionEngineForStation(currentStation)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 text-xs font-bold border border-teal-500/40 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Auditar "{currentStation.title}" en Motor de Decisión</span>
          </button>
        </div>

        {/* TAB 1: MAP & SELECTED STATION VIEW */}
        {activeTab === 'MAP' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* MAP VISOR */}
            <div className="lg:col-span-7 space-y-4">
              <AirQualityMap
                stations={stations}
                selectedStationId={selectedStationId}
                onSelectStation={setSelectedStationId}
                meta={currentMeta}
                onOpenDecisionEngineForStation={handleOpenDecisionEngineForStation}
              />
            </div>

            {/* RIGHT SIDE: SELECTED STATION DOSSIER & METEOROLOGY */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* STATION CARD */}
              <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 uppercase">
                        {currentStation.sourceName.slice(0, 30)}
                      </span>
                      {currentStation.isUserAdded && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                          Usuario
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-black text-white mt-1.5">{currentStation.title}</h3>
                    <p className="text-xs text-slate-400">{currentStation.district} • {currentStation.address}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenDecisionEngineForStation(currentStation)}
                    className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer"
                    title="Auditar en Motor de Decisión"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>

                {/* CURRENT VALUE BANNER */}
                <div className="p-3.5 bg-slate-950/90 rounded-2xl border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Concentración ({currentMeta.code})
                    </span>
                    <span className="text-2xl font-mono font-black text-white">
                      {currentStation.concentration}{' '}
                      <span className="text-xs font-normal text-slate-400">{currentStation.unit}</span>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Estado Normativo
                    </span>
                    <span className={`text-xs font-mono font-black ${
                      currentStation.concentration > currentMeta.ecaLimit ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {currentStation.concentration > currentMeta.ecaLimit ? '⚠️ Supera ECA' : '✓ En Norma ECA'}
                    </span>
                  </div>
                </div>

                {/* EQUIPMENT & METROLOGY */}
                <div className="text-xs space-y-1.5 text-slate-300">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1 text-[11px]">
                    <span className="text-slate-400">Equipo / Método:</span>
                    <span className="font-semibold text-slate-200 truncate max-w-[200px]">{currentStation.equipment}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1 text-[11px]">
                    <span className="text-slate-400">Zonificación:</span>
                    <span className="font-semibold text-slate-200">{currentStation.zoneType}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Última Transmisión:</span>
                    <span className="font-mono text-slate-300">{currentStation.date} {currentStation.time}</span>
                  </div>
                </div>
              </div>

              {/* WIND ROSE WIDGET */}
              <AirWindRoseWidget
                meteorology={currentStation.meteorology}
                stationName={currentStation.title}
              />

            </div>

          </div>
        )}

        {/* TAB 2: TIME SERIES & TRENDS */}
        {activeTab === 'TIME_SERIES' && (
          <div className="space-y-6">
            <AirTimeSeriesChart
              hourlyData={hourlyData}
              weeklyData={weeklyData}
              meta={currentMeta}
              stationName={currentStation.title}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AirWindRoseWidget
                meteorology={currentStation.meteorology}
                stationName={currentStation.title}
              />
              <AirExceedanceCard
                exceedance={exceedanceResult}
                meta={currentMeta}
                currentValue={currentStation.concentration}
              />
            </div>
          </div>
        )}

        {/* TAB 3: EXCEEDANCES & LEGAL FRAMEWORK */}
        {activeTab === 'EXCEEDANCES' && (
          <div className="space-y-6">
            <AirExceedanceCard
              exceedance={exceedanceResult}
              meta={currentMeta}
              currentValue={currentStation.concentration}
            />

            {/* EXCEEDANCE PROTOCOL DETAILS */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                Marco Normativo del D.S. N° 003-2017-MINAM y Racionalidad Técnica
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Los Estándares de Calidad Ambiental para Aire vigentes en el Perú fueron promulgados mediante 
                <strong> Decreto Supremo N° 003-2017-MINAM</strong>, derogando disposiciones previas y estableciendo 
                los valores de concentración máxima para proteger la salud de la población y el equilibrio ecosistémico. 
                ECO-MAP evalúa cada punto contra estos estándares oficiales sin inferencias artificiales.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Tiempo de Exposición</span>
                  <span className="font-mono font-bold text-white text-sm">{currentMeta.primaryTimeframe}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Método de Ensayo Acreditado</span>
                  <span className="text-teal-300 font-semibold text-[11px] line-clamp-2">{currentMeta.measurementMethod}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Fuentes Críticas Típicas</span>
                  <span className="text-slate-300 text-[11px] line-clamp-2">{currentMeta.criticalSources}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: POINTS TABLE & CSV EXPORT */}
        {activeTab === 'TABLE' && (
          <AirPointsTable
            stations={stations}
            selectedStationId={selectedStationId}
            onSelectStation={setSelectedStationId}
            onDeleteUserStation={handleDeleteUserStation}
            onOpenDecisionEngineForStation={handleOpenDecisionEngineForStation}
          />
        )}

      </div>

      {/* INPUT MEASUREMENT MODAL */}
      <AirMeasurementInputModal
        isOpen={isInputModalOpen}
        onClose={() => setIsInputModalOpen(false)}
        onSave={handleSaveMeasurement}
      />

    </section>
  );
};
