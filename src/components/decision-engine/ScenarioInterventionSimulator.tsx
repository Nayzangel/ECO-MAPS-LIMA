import React, { useState, useMemo } from 'react';
import { DecisionInputPoint, DecisionEngineResult } from '../../types/decisionEngine';
import { runEnvironmentalDecisionEngine } from '../../utils/environmentalDecisionEngine';
import { 
  Sparkles, 
  TrendingDown, 
  RotateCcw, 
  Sliders, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Zap,
  Layers
} from 'lucide-react';

interface ScenarioInterventionSimulatorProps {
  basePoint: DecisionInputPoint;
  baseResult: DecisionEngineResult;
}

interface InterventionToggle {
  id: string;
  name: string;
  category: string;
  pmReductionPct: number;
  noiseReductionDb: number;
  active: boolean;
  description: string;
}

export const ScenarioInterventionSimulator: React.FC<ScenarioInterventionSimulatorProps> = ({
  basePoint,
  baseResult
}) => {
  const [interventions, setInterventions] = useState<InterventionToggle[]>([
    {
      id: 'int-truck-reroute',
      name: 'Desvío de Transporte Pesado Diésel (Horas Punta)',
      category: 'Tránsito & Emisiones',
      pmReductionPct: 25,
      noiseReductionDb: 4,
      active: false,
      description: 'Restricción de camiones >3.5t en el corredor urbano distrital.'
    },
    {
      id: 'int-oefa-filters',
      name: 'Fiscalización & Filtros en Chimeneas Industriales',
      category: 'Industria',
      pmReductionPct: 20,
      noiseReductionDb: 2,
      active: false,
      description: 'Exigencia de precipitadores electrostáticos a calderas y fundiciones.'
    },
    {
      id: 'int-green-barrier',
      name: 'Malla Verde & Arbolado Urbano Captador',
      category: 'Infraestructura Verde',
      pmReductionPct: 15,
      noiseReductionDb: 5,
      active: false,
      description: 'Cortina vegetal de molle y meijo con retención de micropartículas.'
    },
    {
      id: 'int-quiet-asphalt',
      name: 'Pavimento Fonoabsorbente & Zona 30 km/h',
      category: 'Acústica Vial',
      pmReductionPct: 8,
      noiseReductionDb: 7,
      active: false,
      description: 'Asfalto drenante y reducción de velocidad para mitigar ruido de rodadura.'
    }
  ]);

  const toggleIntervention = (id: string) => {
    setInterventions(prev => prev.map(item => item.id === id ? { ...item, active: !item.active } : item));
  };

  const handleReset = () => {
    setInterventions(prev => prev.map(item => ({ ...item, active: false })));
  };

  // Calculate simulated values
  const simulatedData = useMemo(() => {
    const isNoise = (basePoint.parameter || '').includes('Ruido');
    const origVal = Number(basePoint.value || 0);

    let totalPmPct = 0;
    let totalNoiseDb = 0;

    interventions.filter(i => i.active).forEach(i => {
      totalPmPct += i.pmReductionPct;
      totalNoiseDb += i.noiseReductionDb;
    });

    // Diminishing returns cap
    totalPmPct = Math.min(65, totalPmPct);
    totalNoiseDb = Math.min(18, totalNoiseDb);

    let newVal = origVal;
    if (isNoise) {
      newVal = Math.max(35, Math.round((origVal - totalNoiseDb) * 10) / 10);
    } else {
      newVal = Math.max(5, Math.round(origVal * (1 - totalPmPct / 100) * 10) / 10);
    }

    const simPoint: DecisionInputPoint = {
      ...basePoint,
      value: newVal,
      trend: interventions.some(i => i.active) ? 'MEJORANDO' : basePoint.trend
    };

    const simResult = runEnvironmentalDecisionEngine(simPoint);

    return {
      simPoint,
      simResult,
      totalPmPct,
      totalNoiseDb,
      hasActive: interventions.some(i => i.active)
    };
  }, [basePoint, interventions]);

  return (
    <div className="p-5 rounded-3xl bg-slate-950/90 border border-slate-800 space-y-4">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/30">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              Simulador de Intervenciones "¿Qué pasaría si...?"
            </h4>
            <p className="text-[10px] text-slate-400">
              Pruebe medidas de mitigación y observe la reducción proyectada en el EPS y la clasificación
            </p>
          </div>
        </div>

        {simulatedData.hasActive && (
          <button
            onClick={handleReset}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restablecer</span>
          </button>
        )}
      </div>

      {/* INTERVENTION TOGGLE BUTTONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {interventions.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => toggleIntervention(item.id)}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between gap-2 ${
              item.active
                ? 'bg-teal-950/40 border-teal-400/60 shadow-lg shadow-teal-500/10 ring-1 ring-teal-400/30'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 uppercase font-semibold">
                  {item.category}
                </span>
                <span className="text-[10px] font-bold text-teal-400 font-mono">
                  -{item.pmReductionPct}% PM | -{item.noiseReductionDb} dBA
                </span>
              </div>
              <h5 className="text-xs font-bold text-white">{item.name}</h5>
              <p className="text-[10px] text-slate-400">{item.description}</p>
            </div>

            <div className={`w-5 h-5 rounded-lg border flex items-center justify-center flex-shrink-0 mt-1 ${
              item.active ? 'bg-teal-400 border-teal-300 text-slate-950' : 'border-slate-700 bg-slate-950'
            }`}>
              {item.active && <CheckCircle2 className="w-4 h-4" />}
            </div>
          </button>
        ))}
      </div>

      {/* COMPARATIVE IMPACT BANNER */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          
          {/* Valor Original */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block font-medium">Medición Original</span>
            <div className="text-base sm:text-lg font-mono font-bold text-slate-200">
              {basePoint.value} <span className="text-[10px] font-normal text-slate-400">{basePoint.unit}</span>
            </div>
            <span className="text-[9px] text-rose-400 font-bold">Base inicial</span>
          </div>

          {/* Valor Simulado */}
          <div className="p-2.5 rounded-xl bg-teal-950/30 border border-teal-500/30">
            <span className="text-[10px] text-teal-300 block font-medium">Proyección con Medidas</span>
            <div className="text-base sm:text-lg font-mono font-extrabold text-teal-300">
              {simulatedData.simPoint.value} <span className="text-[10px] font-normal text-teal-400">{basePoint.unit}</span>
            </div>
            <span className="text-[9px] text-teal-400 font-bold">
              {simulatedData.hasActive ? 'Simulación Activa' : 'Sin cambios'}
            </span>
          </div>

          {/* EPS Original */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block font-medium">EPS Original</span>
            <div className="text-base sm:text-lg font-mono font-bold text-slate-200">
              {baseResult.eps.totalScore} <span className="text-[10px] font-normal text-slate-400">/ 100</span>
            </div>
            <span className={`text-[9px] font-bold ${
              baseResult.classification === 'CRITICO' ? 'text-rose-400' : 'text-amber-400'
            }`}>
              {baseResult.classification}
            </span>
          </div>

          {/* EPS Simulado */}
          <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
            <span className="text-[10px] text-emerald-300 block font-medium">EPS Proyectado</span>
            <div className="text-base sm:text-lg font-mono font-extrabold text-emerald-400">
              {simulatedData.simResult.eps.totalScore} <span className="text-[10px] font-normal text-emerald-400">/ 100</span>
            </div>
            <span className={`text-[9px] font-bold ${
              simulatedData.simResult.classification === 'BAJO'
                ? 'text-emerald-400'
                : simulatedData.simResult.classification === 'MEDIO'
                ? 'text-amber-400'
                : 'text-rose-400'
            }`}>
              {simulatedData.simResult.classification}
            </span>
          </div>

        </div>
      </div>

    </div>
  );
};
