import React from 'react';
import { ScoreBreakdown, DecisionClassification } from '../../types/decisionEngine';
import { ShieldCheck, ShieldAlert, AlertTriangle, HelpCircle, Activity } from 'lucide-react';

interface PriorityScoreGaugeProps {
  score: ScoreBreakdown;
  classification: DecisionClassification;
}

export const PriorityScoreGauge: React.FC<PriorityScoreGaugeProps> = ({
  score,
  classification
}) => {
  const isInsufficient = classification === 'INSUFICIENTE';
  const total = isInsufficient ? 0 : score.totalScore;

  // Gauge colors and descriptions
  let colorTheme = {
    ring: 'stroke-emerald-400',
    glow: 'rgba(52, 211, 153, 0.3)',
    text: 'text-emerald-400',
    bgBadge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    label: 'BAJO RIESGO',
    icon: ShieldCheck
  };

  if (isInsufficient) {
    colorTheme = {
      ring: 'stroke-slate-500',
      glow: 'rgba(100, 116, 139, 0.2)',
      text: 'text-slate-400',
      bgBadge: 'bg-slate-800 border-slate-700 text-slate-400',
      label: 'INSUFICIENTE',
      icon: HelpCircle
    };
  } else if (classification === 'CRITICO') {
    colorTheme = {
      ring: 'stroke-rose-500',
      glow: 'rgba(244, 63, 94, 0.4)',
      text: 'text-rose-400',
      bgBadge: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
      label: 'PRIORIDAD CRÍTICA',
      icon: ShieldAlert
    };
  } else if (classification === 'MEDIO') {
    colorTheme = {
      ring: 'stroke-amber-400',
      glow: 'rgba(251, 191, 36, 0.35)',
      text: 'text-amber-400',
      bgBadge: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
      label: 'PRIORIDAD MEDIA',
      icon: AlertTriangle
    };
  }

  const Icon = colorTheme.icon;

  // SVG Circular Gauge Math
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  // Use a 240-degree arc instead of full circle for speedometer look
  const strokeDashoffset = circumference - (total / 100) * circumference * 0.75;

  return (
    <div className="p-5 bg-slate-950/80 rounded-3xl border border-slate-800/80 space-y-4">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              Environmental Priority Score (EPS)
            </h4>
            <p className="text-[10px] text-slate-400">Índice ponderado de urgencia e impacto ambiental</p>
          </div>
        </div>

        <div className={`px-2.5 py-1 rounded-full border text-[10px] font-extrabold flex items-center gap-1.5 ${colorTheme.bgBadge}`}>
          <Icon className="w-3.5 h-3.5" />
          <span>{colorTheme.label}</span>
        </div>
      </div>

      {/* GAUGE & BREAKDOWN GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
        
        {/* CIRCULAR TACÓMETRO */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center relative py-2">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-135" viewBox="0 0 160 160">
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="12"
                strokeDasharray={`${circumference * 0.75} ${circumference}`}
                fill="transparent"
                strokeLinecap="round"
              />
              {/* Progress Value Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className={`${colorTheme.ring} transition-all duration-700 ease-out`}
                strokeWidth="12"
                strokeDasharray={`${circumference * 0.75} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                fill="transparent"
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 6px ${colorTheme.glow})` }}
              />
            </svg>

            {/* Inner Score Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={`text-3xl sm:text-4xl font-mono font-black tracking-tight ${colorTheme.text}`}>
                {isInsufficient ? 'N/A' : total}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {isInsufficient ? 'Sin Datos' : 'de 100 pts'}
              </span>
            </div>
          </div>

          <span className="text-[10px] text-slate-500 mt-1 font-mono">
            Rango: 0-40 Bajo | 41-70 Medio | 71-100 Crítico
          </span>
        </div>

        {/* 5-DIMENSIONS DETAILED PROGRESS BARS */}
        <div className="sm:col-span-7 space-y-2.5 text-xs">
          
          {/* Dimension 1: Excedencia Normativa (35 max) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 font-semibold">1. Severidad y Excedencia Normativa</span>
              <span className="font-mono text-slate-200 font-bold">{score.exceedanceScore} / 35</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  score.exceedanceScore > 25 ? 'bg-rose-500' : score.exceedanceScore > 15 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${(score.exceedanceScore / 35) * 100}%` }}
              />
            </div>
          </div>

          {/* Dimension 2: Vulnerabilidad Territorial (25 max) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 font-semibold">2. Vulnerabilidad de Zonificación</span>
              <span className="font-mono text-slate-200 font-bold">{score.vulnerabilityScore} / 25</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${(score.vulnerabilityScore / 25) * 100}%` }}
              />
            </div>
          </div>

          {/* Dimension 3: Tendencia Histórica (15 max) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 font-semibold">3. Vector de Tendencia Temporal</span>
              <span className="font-mono text-slate-200 font-bold">{score.trendScore} / 15</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  score.trendScore >= 12 ? 'bg-rose-400' : score.trendScore >= 8 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${(score.trendScore / 15) * 100}%` }}
              />
            </div>
          </div>

          {/* Dimension 4: Sinergia Multicontaminante (15 max) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 font-semibold">4. Sinergia Multicontaminante</span>
              <span className="font-mono text-slate-200 font-bold">{score.synergyScore} / 15</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-purple-400 rounded-full transition-all duration-500"
                style={{ width: `${(score.synergyScore / 15) * 100}%` }}
              />
            </div>
          </div>

          {/* Dimension 5: Confiabilidad Metrológica (10 max) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 font-semibold">5. Calidad y Certeza del Dato</span>
              <span className="font-mono text-slate-200 font-bold">{score.dataQualityScore} / 10</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${(score.dataQualityScore / 10) * 100}%` }}
              />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
