import React, { useState, useMemo } from 'react';
import { 
  Volume2, 
  VolumeX, 
  MapPin, 
  TrendingUp, 
  PlusCircle, 
  Table, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Cpu, 
  CheckCircle2, 
  HelpCircle,
  Clock,
  Activity
} from 'lucide-react';
import { 
  NoiseMeasurementRecord, 
  AcousticMethodologyType, 
  NoiseZoneType 
} from '../../types/noiseQuality';
import { 
  OFFICIAL_NOISE_STATIONS, 
  generateNoise24hSeries, 
  SAMPLE_ISOPHONE_CONTOURS 
} from '../../data/noiseQualityData';
import { 
  PERUVIAN_NOISE_NORMATIVE, 
  determineNoisePeriod, 
  getApplicableEcaLimit 
} from '../../utils/noiseNormative';
import { ViewMode, StationData } from '../../types';

// Subcomponents
import { NoiseIndicatorsSummary } from '../noise/NoiseIndicatorsSummary';
import { NoiseMethodologyExplainer } from '../noise/NoiseMethodologyExplainer';
import { NoiseMap } from '../noise/NoiseMap';
import { NoiseTimeSeriesChart } from '../noise/NoiseTimeSeriesChart';
import { NoiseTechnicalDossierModal } from '../noise/NoiseTechnicalDossierModal';
import { NoiseMeasurementInputModal } from '../noise/NoiseMeasurementInputModal';
import { NoiseAcousticModelingWidget } from '../noise/NoiseAcousticModelingWidget';
import { NoisePointsTable } from '../noise/NoisePointsTable';

interface NoiseSectionProps {
  viewMode?: ViewMode;
  onSelectStationForMap?: (stationId: string) => void;
  onOpenAnalysisWithStation?: (station: StationData) => void;
}

export const NoiseSection: React.FC<NoiseSectionProps> = ({
  viewMode = 'ciudadano',
  onSelectStationForMap,
  onOpenAnalysisWithStation
}) => {
  // Master Noise Stations (Official + User records from LocalStorage)
  const [records, setRecords] = useState<NoiseMeasurementRecord[]>(() => {
    try {
      const saved = localStorage.getItem('ecomap_user_noise_records');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...OFFICIAL_NOISE_STATIONS, ...parsed];
      }
    } catch (e) {
      console.error('Error reading localStorage for noise records', e);
    }
    return OFFICIAL_NOISE_STATIONS;
  });

  // Selected Record for details / temporal chart
  const [selectedRecordId, setSelectedRecordId] = useState<string>(OFFICIAL_NOISE_STATIONS[0].id);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'MAP' | 'TIME_SERIES' | 'MODELING' | 'TABLE'>('MAP');

  // Modals state
  const [isInputModalOpen, setIsInputModalOpen] = useState<boolean>(false);
  const [dossierRecord, setDossierRecord] = useState<NoiseMeasurementRecord | null>(null);
  const [isDossierModalOpen, setIsDossierModalOpen] = useState<boolean>(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected Record Object
  const currentRecord = useMemo(() => {
    return records.find(r => r.id === selectedRecordId) || records[0];
  }, [records, selectedRecordId]);

  // Generate 24-hour acoustic series for the active record
  const hourly24Data = useMemo(() => {
    return generateNoise24hSeries(currentRecord.laeq, currentRecord.zoneType);
  }, [currentRecord]);

  // Save new user noise measurement
  const handleSaveMeasurement = (newRecord: NoiseMeasurementRecord) => {
    const updated = [newRecord, ...records];
    setRecords(updated);
    setSelectedRecordId(newRecord.id);

    // Save only user added items to localStorage
    const userRecords = updated.filter(r => r.isUserAdded);
    try {
      localStorage.setItem('ecomap_user_noise_records', JSON.stringify(userRecords));
    } catch (e) {
      console.error('Failed to save noise records to localStorage', e);
    }

    setToastMessage(`Punto "${newRecord.title}" registrado y evaluado bajo D.S. N° 085-2003-PCM.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Delete user noise measurement
  const handleDeleteUserRecord = (id: string) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    if (selectedRecordId === id) {
      setSelectedRecordId(OFFICIAL_NOISE_STATIONS[0].id);
    }
    const userRecords = updated.filter(r => r.isUserAdded);
    try {
      localStorage.setItem('ecomap_user_noise_records', JSON.stringify(userRecords));
    } catch (e) {
      console.error('Failed to save noise records to localStorage', e);
    }
    setToastMessage('Registro eliminado exitosamente.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Open Technical Dossier
  const handleOpenDossier = (record: NoiseMeasurementRecord) => {
    setDossierRecord(record);
    setIsDossierModalOpen(true);
  };

  // Bridge to Decision Engine
  const handleOpenDecisionEngineForNoise = (record: NoiseMeasurementRecord) => {
    if (onOpenAnalysisWithStation) {
      const bridgeStation: StationData = {
        id: record.id,
        name: record.title,
        district: record.district,
        zoneType: record.zoneType === 'ProteccionEspecial' ? 'ProteccionEspecial' :
                 record.zoneType === 'Industrial' ? 'Industrial' :
                 record.zoneType === 'Comercial' ? 'Comercial' : 'Residencial',
        coordinates: record.coordinates,
        elevation: 120,
        pm25: 35.0,
        pm10: 75.0,
        so2: 15.0,
        no2: 38.0,
        co: 1.8,
        o3: 25.0,
        noiseDay: record.determinedPeriod === 'DIURNO' ? record.laeq : record.laeq + 6.0,
        noiseNight: record.determinedPeriod === 'NOCTURNO' ? record.laeq : Math.max(record.laeq - 6.0, 35.0),
        temperature: 21.0,
        humidity: 78,
        windSpeed: 2.8,
        windDirection: 'SO',
        lastUpdate: `${record.date} ${record.time}`,
        incaIndex: 'Moderado',
        riskLevel: record.isExceeding ? 'Critico' : 'Optimo',
        primaryIssue: `Presión sonora LAeq: ${record.laeq} dBA (${record.isExceeding ? `Supera ECA en +${record.exceedanceDb} dB` : 'En norma'}). Fuente: ${record.sourceCategory}.`,
        isDemo: !record.isUserAdded
      };
      onOpenAnalysisWithStation(bridgeStation);
    }
  };

  return (
    <section id="ruido" className="py-20 bg-slate-950/90 border-b border-slate-800/80 relative overflow-hidden">
      
      {/* Background ambient light */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* TOAST ALERT */}
        {toastMessage && (
          <div className="p-3 bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 rounded-2xl flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2 shadow-lg">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-cyan-400 hover:text-white text-xs font-mono font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* SECTION HEADER & ACTIONS */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Volume2 className="w-3.5 h-3.5" />
              Módulo Oficial de Ruido Ambiental (D.S. N° 085-2003-PCM)
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Presión Sonora, <span className="text-cyan-400">Isófonas & Modelamiento Acústico</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-3xl leading-relaxed">
              Monitoreo y fiscalización de niveles sonoros continuos (<strong>LAeq</strong>, <strong>LAFmax</strong>, <strong>LAFmin</strong>, <strong>LCpeak</strong>). 
              Evaluación automatizada de zonificación diurna y nocturna, trazabilidad metrológica ISO 1996 y simulación de propagación.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setIsInputModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Ingresar Medición Acústica</span>
            </button>

            <div className="px-3 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>{records.length} Puntos Acústicos</span>
            </div>
          </div>
        </div>

        {/* EXECUTIVE KPI SUMMARY CARDS */}
        <NoiseIndicatorsSummary records={records} />

        {/* METHODOLOGICAL EXPLAINER (MEDICIÓN vs INTERPOLACIÓN vs MODELAMIENTO) */}
        <NoiseMethodologyExplainer />

        {/* NAVIGATION TABS FOR MODULE SUBVIEWS */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 flex-wrap gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('MAP')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'MAP'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Mapa de Ruido & Isófonas</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('TIME_SERIES')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'TIME_SERIES'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Evolución Temporal (24h)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('MODELING')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'MODELING'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Modelamiento & Barreras</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('TABLE')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'TABLE'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Tabla de Puntos ({records.length})</span>
            </button>
          </div>

          {/* Quick Dossier Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleOpenDossier(currentRecord)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-bold border border-cyan-500/40 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ficha Técnica Oficial: "{currentRecord.title.slice(0, 22)}..."</span>
            </button>

            {onOpenAnalysisWithStation && (
              <button
                type="button"
                onClick={() => handleOpenDecisionEngineForNoise(currentRecord)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 border border-teal-500/30 transition-all cursor-pointer"
                title="Auditar en Motor de Decisión"
              >
                <Sparkles className="w-4 h-4 text-teal-400" />
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: MAP & SELECTED STATION VIEW */}
        {activeTab === 'MAP' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* MAP VISOR */}
            <div className="lg:col-span-8 space-y-4">
              <NoiseMap
                records={records}
                selectedRecordId={selectedRecordId}
                onSelectRecord={setSelectedRecordId}
                onOpenDossier={handleOpenDossier}
                onOpenDecisionEngine={handleOpenDecisionEngineForNoise}
              />
            </div>

            {/* RIGHT SIDE: SELECTED POINT DOSSIER CARD */}
            <div className="lg:col-span-4 space-y-4">
              
              <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30 uppercase">
                        {currentRecord.methodology}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {currentRecord.determinedPeriod} ({currentRecord.time})
                      </span>
                    </div>
                    <h3 className="text-base font-black text-white mt-1.5">{currentRecord.title}</h3>
                    <p className="text-xs text-slate-400">{currentRecord.district} • {currentRecord.address}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenDossier(currentRecord)}
                    className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-all cursor-pointer"
                    title="Ver Ficha Técnica"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </div>

                {/* CURRENT VALUE & ECA COMPARISON */}
                <div className="p-3.5 bg-slate-950/90 rounded-2xl border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Nivel LAeq Registrado
                      </span>
                      <span className="text-2xl font-mono font-black text-cyan-300">
                        {currentRecord.laeq}{' '}
                        <span className="text-xs font-normal text-slate-400">dBA</span>
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Límite ECA ({currentRecord.zoneType})
                      </span>
                      <span className="text-xl font-mono font-bold text-slate-200">
                        {currentRecord.ecaLimit}{' '}
                        <span className="text-xs font-normal text-slate-400">dBA</span>
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 font-sans">Desvío Normativo:</span>
                    <span className={`font-bold ${currentRecord.isExceeding ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {currentRecord.isExceeding ? `⚠️ Supera en +${currentRecord.exceedanceDb.toFixed(1)} dB` : '✓ Cumple Estándar ECA'}
                    </span>
                  </div>
                </div>

                {/* PEAK & ACOUSTIC DETAILS */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">LAFmax</span>
                    <span className="font-mono font-bold text-amber-300">{currentRecord.lafmax} dB</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">LAFmin</span>
                    <span className="font-mono font-bold text-teal-300">{currentRecord.lafmin} dB</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">LCpeak</span>
                    <span className="font-mono font-bold text-rose-300">{currentRecord.lcpeak} dBC</span>
                  </div>
                </div>

                {/* METROLOGY & EQUIPMENT */}
                <div className="text-xs space-y-1 text-slate-300 border-t border-slate-800 pt-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Sonómetro:</span>
                    <span className="font-semibold text-slate-200 truncate max-w-[180px]">{currentRecord.equipment}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Calibración Pre/Post:</span>
                    <span className="font-mono text-emerald-400">Δ = {currentRecord.calibration?.deltaCalibrationDb || 0.1} dB (Conforme)</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Fuente Principal:</span>
                    <span className="font-bold text-cyan-300">{currentRecord.sourceCategory}</span>
                  </div>
                </div>

                {/* ACTION BUTTON */}
                <button
                  type="button"
                  onClick={() => handleOpenDossier(currentRecord)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-700"
                >
                  <FileText className="w-4 h-4" />
                  <span>Abrir Ficha Técnica Completa</span>
                </button>

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: TIME SERIES & ACOUSTIC CYCLE */}
        {activeTab === 'TIME_SERIES' && (
          <div className="space-y-6">
            <NoiseTimeSeriesChart
              hourlyData={hourly24Data}
              record={currentRecord}
            />
          </div>
        )}

        {/* TAB 3: ACOUSTIC MODELING & PROPAGATION */}
        {activeTab === 'MODELING' && (
          <div className="space-y-6">
            <NoiseAcousticModelingWidget />
          </div>
        )}

        {/* TAB 4: POINTS TABLE & CSV EXPORT */}
        {activeTab === 'TABLE' && (
          <NoisePointsTable
            records={records}
            selectedRecordId={selectedRecordId}
            onSelectRecord={setSelectedRecordId}
            onDeleteUserRecord={handleDeleteUserRecord}
            onOpenDossier={handleOpenDossier}
            onOpenDecisionEngine={handleOpenDecisionEngineForNoise}
          />
        )}

      </div>

      {/* INPUT MEASUREMENT MODAL */}
      <NoiseMeasurementInputModal
        isOpen={isInputModalOpen}
        onClose={() => setIsInputModalOpen(false)}
        onSave={handleSaveMeasurement}
      />

      {/* INDIVIDUAL POINT TECHNICAL DOSSIER MODAL */}
      <NoiseTechnicalDossierModal
        record={dossierRecord}
        isOpen={isDossierModalOpen}
        onClose={() => {
          setIsDossierModalOpen(false);
          setDossierRecord(null);
        }}
        onOpenDecisionEngine={handleOpenDecisionEngineForNoise}
      />

    </section>
  );
};
