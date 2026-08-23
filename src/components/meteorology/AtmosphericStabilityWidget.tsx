import React from 'react';
import { PasquillStabilityClass } from '../../types/meteorology';
import { Layers, AlertCircle, Info, ShieldAlert, Sparkles, Wind } from 'lucide-react';

interface AtmosphericStabilityWidgetProps {
  currentClass: PasquillStabilityClass;
  mixingHeight: number;
  hasInversion: boolean;
  inversionBase?: number;
  windSpeed: number;
}

export const AtmosphericStabilityWidget: React.FC<AtmosphericStabilityWidgetProps> = ({
  currentClass,
  mixingHeight,
  hasInversion,
  inversionBase,
  windSpeed
}) => {
  const classesInfo: Record<PasquillStabilityClass, { name: string; dispersion: string; color: string; desc: string }> = {
    A: {
      name: 'Extremadamente Inestable',
      dispersion: 'Excelente dispersión vertical y horizontal por fuerte convección térmica diurna.',
      color: '#10b981', // Emerald
      desc: 'Radiación solar intensa con viento leve. Penachos presentan comportamiento de rizado (looping).'
    },
    B: {
      name: 'Moderadamente Inestable',
      dispersion: 'Muy buena capacidad de dilución de contaminantes.',
      color: '#34d399',
      desc: 'Día soleado con viento moderado. Rápida mezcla turbulenta.'
    },
    C: {
      name: 'Ligeramente Inestable',
      dispersion: 'Buena capacidad dispersiva atmosférica.',
      color: '#38bdf8', // Light blue
      desc: 'Nubosidad parcial diurna y vientos de 3 a 5 m/s.'
    },
    D: {
      name: 'Neutral (Adiabático)',
      dispersion: 'Dispersión mecánica gobernada por cizalladura del viento (cono simétrico).',
      color: '#94a3b8', // Slate
      desc: 'Días cubiertos o vientos fuertes (> 6 m/s). Sin flotabilidad térmica neta.'
    },
    E: {
      name: 'Ligeramente Estable',
      dispersion: 'Dilución moderada a baja; atrapamiento nocturno.',
      color: '#f59e0b', // Amber
      desc: 'Noches con nubosidad. Penacho tipo abanico (fanning).'
    },
    F: {
      name: 'Moderadamente Estable',
      dispersion: 'Pobre dispersión atmosférica; alto riesgo de acumulación de contaminantes.',
      color: '#ef4444', // Red
      desc: 'Noches despejadas con vientos en calma (< 2 m/s). Fuerte enfriamiento radiativo superficial.'
    }
  };

  const selectedInfo = classesInfo[currentClass];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Diagnóstico de Estabilidad Atmosférica & Capa Límite
            </h3>
            <p className="text-xs text-slate-400">
              Metodología Pasquill-Gifford / Briggs para dispersión de plumas
            </p>
          </div>
        </div>
        <div
          className="px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border shadow-sm"
          style={{
            backgroundColor: `${selectedInfo.color}15`,
            color: selectedInfo.color,
            borderColor: `${selectedInfo.color}40`
          }}
        >
          Clase {currentClass} — {selectedInfo.name}
        </div>
      </div>

      {/* CLASSIFICATION SPECTRUM BAR */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Inestable (Alta dilución)</span>
          <span>Neutral</span>
          <span>Estable (Atrapamiento)</span>
        </div>
        <div className="grid grid-cols-6 gap-1 h-3 rounded-lg overflow-hidden p-0.5 bg-slate-950 border border-slate-800">
          {(['A', 'B', 'C', 'D', 'E', 'F'] as PasquillStabilityClass[]).map((c) => (
            <div
              key={c}
              className={`h-full rounded transition-all duration-200 ${
                c === currentClass ? 'ring-2 ring-white shadow-md scale-105' : 'opacity-40'
              }`}
              style={{ backgroundColor: classesInfo[c].color }}
              title={`Clase ${c}: ${classesInfo[c].name}`}
            />
          ))}
        </div>
      </div>

      {/* DETAILED EXPLANATION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* CURRENT PASQUILL DIAGNOSIS */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 mb-1.5">
            <Wind className="w-4 h-4 text-cyan-400" /> Dinámica del Penacho Atmosférico
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedInfo.dispersion}
          </p>
          <p className="text-[11px] text-slate-400 mt-2 italic">
            {selectedInfo.desc}
          </p>
        </div>

        {/* INVERSION & MIXING HEIGHT DIAGNOSIS */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-400" /> Capa de Mezcla ($z_i$)
              </span>
              <span className="text-xs font-mono font-bold text-purple-400">
                {mixingHeight} m
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Volumen atmosférico vertical disponible para la dilución de efluentes gaseosos y material particulado.
            </p>
          </div>

          {hasInversion ? (
            <div className="mt-2.5 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2 text-[11px] text-amber-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
              <div>
                <strong>Inversión Térmica Activa:</strong> Base en ~{inversionBase || 450} msnm. Actúa como tapa térmica (techo de dispersión) que restringe el ascenso de contaminantes.
              </div>
            </div>
          ) : (
            <div className="mt-2.5 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-start gap-2 text-[11px] text-emerald-300">
              <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
              <div>
                <strong>Sin Inversión Térmica:</strong> Gradiente vertical normal permite la ventilación atmosférica sin taponamiento térmico.
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
