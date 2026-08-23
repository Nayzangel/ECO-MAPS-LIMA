import React, { useState, useEffect } from 'react';
import { 
  X, 
  Activity, 
  Wind, 
  Volume2, 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Download, 
  Sparkles, 
  ShieldAlert, 
  Layers,
  ChevronRight,
  Flame,
  Printer
} from 'lucide-react';
import { StationData, DecisionAction } from '../../types';
import { LIMA_STATIONS_DEMO, DEMO_DECISION_ACTIONS } from '../../data/demoData';

interface AnalysisWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedStation?: StationData | null;
}

export const AnalysisWizardModal: React.FC<AnalysisWizardModalProps> = ({
  isOpen,
  onClose,
  preselectedStation
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedStation, setSelectedStation] = useState<StationData>(
    preselectedStation || LIMA_STATIONS_DEMO[0]
  );
  
  // Custom tweaks for simulation
  const [customPm25, setCustomPm25] = useState<number>(selectedStation.pm25);
  const [customNoise, setCustomNoise] = useState<number>(selectedStation.noiseDay);
  const [zoneType, setZoneType] = useState<string>(selectedStation.zoneType);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [reportGenerated, setReportGenerated] = useState<boolean>(false);

  useEffect(() => {
    if (preselectedStation) {
      setSelectedStation(preselectedStation);
      setCustomPm25(preselectedStation.pm25);
      setCustomNoise(preselectedStation.noiseDay);
      setZoneType(preselectedStation.zoneType);
    }
  }, [preselectedStation]);

  if (!isOpen) return null;

  // Decision metrics calculation
  const pm25Limit = 50; // D.S. 003-2017-MINAM
  const noiseLimit = zoneType === 'Residencial' ? 60 : zoneType === 'Comercial' ? 70 : 80;
  
  const pm25Exceeds = customPm25 > pm25Limit;
  const noiseExceeds = customNoise > noiseLimit;
  const isCritical = customPm25 > 60 || (pm25Exceeds && noiseExceeds);

  const handleRunAnalysis = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setCurrentStep(3);
    }, 900);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  Motor de Decisión Ambiental | ECO-MAP LIMA
                </h3>
                <span className="text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                  SIMULACIÓN
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Paso {currentStep} de 3: {currentStep === 1 ? 'Selección del Punto' : currentStep === 2 ? 'Parámetros y Normativa' : 'Diagnóstico y Plan de Acción'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP PROGRESS BAR */}
        <div className="grid grid-cols-3 bg-slate-950 border-b border-slate-800 text-xs font-semibold">
          <div className={`py-2.5 text-center border-b-2 transition-all ${
            currentStep >= 1 ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-slate-500'
          }`}>
            1. Territorio & Punto
          </div>
          <div className={`py-2.5 text-center border-b-2 transition-all ${
            currentStep >= 2 ? 'border-teal-400 text-teal-400 bg-teal-500/5' : 'border-transparent text-slate-500'
          }`}>
            2. Contraste Normativo
          </div>
          <div className={`py-2.5 text-center border-b-2 transition-all ${
            currentStep >= 3 ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5' : 'border-transparent text-slate-500'
          }`}>
            3. Dictamen & Decisiones
          </div>
        </div>

        {/* STEP BODY */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* STEP 1: SELECT POINT */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-white">Seleccione el Punto de Lima a Evaluar</h4>
                <p className="text-xs text-slate-400">
                  Escoja una estación de monitoreo o punto representativo de la red metropolitana.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {LIMA_STATIONS_DEMO.map((st) => {
                  const isSelected = selectedStation.id === st.id;
                  return (
                    <div
                      key={st.id}
                      onClick={() => {
                        setSelectedStation(st);
                        setCustomPm25(st.pm25);
                        setCustomNoise(st.noiseDay);
                        setZoneType(st.zoneType);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-800 border-emerald-500 shadow-md'
                          : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">{st.district}</span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                          {st.zoneType}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 font-medium">{st.name}</div>
                      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span>PM2.5: {st.pm25} µg</span>
                        <span>Ruido: {st.noiseDay} dB</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: PARAMETERS & AUDIT */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                    {selectedStation.district}
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-400">{selectedStation.name}</span>
                </div>
                <h4 className="text-lg font-bold text-white">Ajuste de Parámetros y Zonificación</h4>
                <p className="text-xs text-slate-400">
                  Puede utilizar las lecturas capturadas o simular valores específicos para evaluar la respuesta del motor de decisión.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* PM2.5 Adjust */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-bold flex items-center gap-1.5">
                      <Wind className="w-4 h-4 text-emerald-400" /> PM2.5 (µg/m³ 24h)
                    </span>
                    <span className="font-mono font-extrabold text-white bg-slate-900 px-2 py-1 rounded">
                      {customPm25} µg/m³
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="150"
                    step="0.5"
                    value={customPm25}
                    onChange={(e) => setCustomPm25(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="text-[11px] text-slate-500 flex justify-between">
                    <span>ECA D.S. 003-2017: 50 µg/m³</span>
                    <span className={pm25Exceeds ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                      {pm25Exceeds ? '▲ Supera ECA' : '✓ En norma'}
                    </span>
                  </div>
                </div>

                {/* Noise Adjust */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-bold flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-cyan-400" /> Ruido Diurno (LAeqT dBA)
                    </span>
                    <span className="font-mono font-extrabold text-white bg-slate-900 px-2 py-1 rounded">
                      {customNoise} dBA
                    </span>
                  </div>
                  <input
                    type="range"
                    min="35"
                    max="95"
                    step="0.5"
                    value={customNoise}
                    onChange={(e) => setCustomNoise(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="text-[11px] text-slate-500 flex justify-between">
                    <span>ECA D.S. 085-2003: {noiseLimit} dBA</span>
                    <span className={noiseExceeds ? 'text-rose-400 font-bold' : 'text-cyan-400'}>
                      {noiseExceeds ? '▲ Supera ECA' : '✓ En norma'}
                    </span>
                  </div>
                </div>

              </div>

              {/* Zonification selector */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-300">Zonificación Municipal Aplicable:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {['Residencial', 'Comercial', 'Industrial', 'ProteccionEspecial'].map((z) => (
                    <button
                      key={z}
                      onClick={() => setZoneType(z)}
                      className={`p-2.5 rounded-xl border text-center font-medium transition-all ${
                        zoneType === z
                          ? 'bg-slate-800 border-emerald-500 text-white font-bold'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {z}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: RESULT & DECISION PLAN */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Executive Assessment Banner */}
              <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isCritical 
                  ? 'bg-rose-950/40 border-rose-500/50' 
                  : pm25Exceeds || noiseExceeds
                  ? 'bg-amber-950/40 border-amber-500/50'
                  : 'bg-emerald-950/40 border-emerald-500/50'
              }`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      isCritical ? 'bg-rose-500 text-slate-950' : 'bg-amber-500 text-slate-950'
                    }`}>
                      {isCritical ? 'PRIORIDAD INMEDIATA (HOTSPOT)' : 'PRIORIDAD MEDIA'}
                    </span>
                    <span className="text-xs text-slate-300 font-mono">
                      Distrito: {selectedStation.district}
                    </span>
                  </div>
                  <h4 className="text-xl font-extrabold text-white">
                    Dictamen Técnico: {isCritical ? 'Superación Crítica de Estándares Ambientales' : 'Monitoreo en Rango Moderado'}
                  </h4>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-mono font-extrabold text-white">
                    Score: {isCritical ? '88/100' : '42/100'}
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase">Severidad Territorial</span>
                </div>
              </div>

              {/* RECOMMENDED MITIGATION ACTIONS (MOTOR DE DECISIÓN) */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Acciones de Mitigación Prioritarias Propuestas por el Motor:</span>
                  <span className="text-teal-400 font-mono text-[10px]">{DEMO_DECISION_ACTIONS.length} Medidas sugeridas</span>
                </div>

                <div className="space-y-2.5">
                  {DEMO_DECISION_ACTIONS.map((act) => (
                    <div
                      key={act.id}
                      className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{act.title}</span>
                          <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                            {act.category}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          act.priority === 'Inmediata' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {act.priority}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {act.description}
                      </p>

                      <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-900 font-mono">
                        <span>Impacto estimado: <strong className="text-emerald-400">{act.estimatedImpact}</strong></span>
                        <span>Responsable: <strong className="text-slate-200">{act.responsibleEntity}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/90">
          <div>
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl"
              >
                Atrás
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentStep < 2 ? (
              <button
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl flex items-center gap-2"
              >
                Continuar a Parámetros
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : currentStep === 2 ? (
              <button
                onClick={handleRunAnalysis}
                disabled={isSimulating}
                className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/25"
              >
                {isSimulating ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    Procesando Motor Normativo...
                  </>
                ) : (
                  <>
                    <Activity className="w-4 h-4" />
                    Ejecutar Motor de Decisión
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handlePrintReport}
                className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl flex items-center gap-2 shadow-md"
              >
                <Printer className="w-4 h-4" />
                Imprimir / Exportar Informe Técnico
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
