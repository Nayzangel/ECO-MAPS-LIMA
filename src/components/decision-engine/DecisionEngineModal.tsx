import React, { useState, useMemo } from 'react';
import { 
  X, 
  Sparkles, 
  MapPin, 
  Printer, 
  Download, 
  Activity, 
  Sliders, 
  Layers, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { DecisionInputPoint } from '../../types/decisionEngine';
import { runEnvironmentalDecisionEngine } from '../../utils/environmentalDecisionEngine';
import { PriorityScoreGauge } from './PriorityScoreGauge';
import { ExplainabilityBanner } from './ExplainabilityBanner';
import { ThirteenFactorsGrid } from './ThirteenFactorsGrid';
import { ActionPlanMatrix } from './ActionPlanMatrix';
import { ScenarioInterventionSimulator } from './ScenarioInterventionSimulator';
import { LIMA_STATIONS_DEMO } from '../../data/demoData';

interface DecisionEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPoint?: DecisionInputPoint | null;
}

export const DecisionEngineModal: React.FC<DecisionEngineModalProps> = ({
  isOpen,
  onClose,
  initialPoint
}) => {
  // Active Point under analysis
  const [currentPoint, setCurrentPoint] = useState<DecisionInputPoint>(() => {
    if (initialPoint) return initialPoint;
    const defaultStation = LIMA_STATIONS_DEMO[0];
    return {
      id: defaultStation.id,
      title: defaultStation.name,
      district: defaultStation.district,
      address: `Av. Túpac Amaru / Sector ${defaultStation.district}`,
      coordinates: defaultStation.coordinates,
      parameter: 'PM2.5',
      value: defaultStation.pm25,
      unit: 'µg/m³',
      date: '2026-08-23',
      time: '09:30',
      source: 'SENAMHI / Red Metropolitana',
      equipment: 'Met One BAM-1020 (Acreditado INACAL)',
      zoneType: defaultStation.zoneType,
      reliabilityScore: 94,
      trend: defaultStation.pm25 > 50 ? 'EMPEORANDO' : 'ESTABLE'
    };
  });

  // Sync when initialPoint changes
  React.useEffect(() => {
    if (initialPoint) {
      setCurrentPoint(initialPoint);
    }
  }, [initialPoint]);

  // Tab mode within Decision Engine
  const [activeTab, setActiveTab] = useState<'AUDITORIA' | 'SIMULADOR' | 'ACCIONES'>('AUDITORIA');

  // Run Decision Engine
  const decisionResult = useMemo(() => {
    return runEnvironmentalDecisionEngine(currentPoint);
  }, [currentPoint]);

  if (!isOpen) return null;

  const handleStationQuickSelect = (stationId: string) => {
    const st = LIMA_STATIONS_DEMO.find(s => s.id === stationId);
    if (!st) return;
    setCurrentPoint({
      id: st.id,
      title: st.name,
      district: st.district,
      address: `Sector ${st.district} - Punto de Control`,
      coordinates: st.coordinates,
      parameter: 'PM2.5',
      value: st.pm25,
      unit: 'µg/m³',
      date: '2026-08-23',
      time: '10:00',
      source: 'SENAMHI / OEFA',
      equipment: 'Monitor Beta Atenuación BAM-1020',
      zoneType: st.zoneType,
      reliabilityScore: 92,
      trend: st.pm25 > 50 ? 'EMPEORANDO' : 'ESTABLE',
      secondaryParameter: {
        name: 'Ruido Diurno',
        value: st.noiseDay,
        unit: 'dBA'
      }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200 text-xs">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  Motor de Decisión Ambiental
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                  ECO-MAP ENGINE v3.5
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Auditoría algorítmica de 13 factores, Environmental Priority Score (EPS) y clasificación explicable
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer hidden sm:flex items-center gap-1 text-[11px] font-semibold"
              title="Imprimir Ficha Técnica"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Ficha</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* QUICK STATION / POINT SELECTOR STRIP */}
        <div className="px-5 py-3 bg-slate-950/60 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex-shrink-0">
              Puntos Rápidos:
            </span>
            {LIMA_STATIONS_DEMO.slice(0, 5).map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => handleStationQuickSelect(st.id)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  currentPoint.id === st.id
                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {st.name}
              </button>
            ))}
          </div>

          {/* TABS SELECTOR */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('AUDITORIA')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                activeTab === 'AUDITORIA' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Auditoría & 13 Factores
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('SIMULADOR')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                activeTab === 'SIMULADOR' ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Simulador "¿Qué pasaría si...?"
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ACCIONES')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                activeTab === 'ACCIONES' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Planes de Acción
            </button>
          </div>
        </div>

        {/* SCROLLABLE MAIN CONTENT */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
          
          {/* 1. TOP SNAPSHOT CARD & ENVIRONMENTAL PRIORITY SCORE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* SNAPSHOT RESUMEN DEL PUNTO */}
            <div className="lg:col-span-4 p-4 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                    Punto en Evaluación
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {decisionResult.pointSnapshot.date}
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-white">
                  {decisionResult.pointSnapshot.title}
                </h4>

                <div className="space-y-1 text-[11px] text-slate-300 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Distrito:</span>
                    <span className="font-bold text-slate-200">{decisionResult.pointSnapshot.district}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Zonificación:</span>
                    <span className="font-bold text-teal-300">{decisionResult.pointSnapshot.zoneType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">UTM 18S:</span>
                    <span className="text-slate-300 text-[10px]">{decisionResult.pointSnapshot.utm18s}</span>
                  </div>
                </div>
              </div>

              {/* Medición Value Callout */}
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  {decisionResult.pointSnapshot.parameter}:
                </span>
                <div className="text-2xl font-mono font-black text-white">
                  {decisionResult.pointSnapshot.measuredValue}{' '}
                  <span className="text-xs font-normal text-slate-400">{decisionResult.pointSnapshot.unit}</span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                  <span>Fuente: {decisionResult.pointSnapshot.source.slice(0, 18)}</span>
                  <span className="text-emerald-400 font-bold">Auditado</span>
                </div>
              </div>
            </div>

            {/* ENVIRONMENTAL PRIORITY SCORE GAUGE */}
            <div className="lg:col-span-8">
              <PriorityScoreGauge
                score={decisionResult.eps}
                classification={decisionResult.classification}
              />
            </div>

          </div>

          {/* 2. EXPLAINABILITY CORE ("Este punto fue clasificado como...") */}
          <ExplainabilityBanner
            classification={decisionResult.classification}
            explanation={decisionResult.explanation}
            isInsufficient={!decisionResult.isSufficient}
          />

          {/* 3. DYNAMIC TAB CONTENT */}
          {activeTab === 'AUDITORIA' && (
            <ThirteenFactorsGrid
              factors={decisionResult.factors}
              isInsufficient={!decisionResult.isSufficient}
            />
          )}

          {activeTab === 'SIMULADOR' && (
            <ScenarioInterventionSimulator
              basePoint={currentPoint}
              baseResult={decisionResult}
            />
          )}

          {activeTab === 'ACCIONES' && (
            <ActionPlanMatrix
              plans={decisionResult.actionPlans}
              classification={decisionResult.classification}
            />
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Auditoría legal conforme a D.S. N° 003-2017-MINAM y D.S. N° 085-2003-PCM.</span>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all cursor-pointer"
            >
              Cerrar Motor de Decisión
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
