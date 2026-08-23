import React from 'react';
import { AirStatisticsSummary, AirNormativeStandard } from '../../types/airQuality';
import { 
  Activity, 
  TrendingUp, 
  ShieldAlert, 
  ShieldCheck, 
  Wind, 
  Thermometer, 
  Droplets,
  AlertTriangle,
  Scale,
  Gauge
} from 'lucide-react';

interface AirIndicatorsSummaryProps {
  stats: AirStatisticsSummary;
  meta: AirNormativeStandard;
}

export const AirIndicatorsSummary: React.FC<AirIndicatorsSummaryProps> = ({
  stats,
  meta
}) => {
  const isExceeded = stats.currentValue > meta.ecaLimit;
  const excessPct = isExceeded ? Math.round(((stats.currentValue - meta.ecaLimit) / meta.ecaLimit) * 100) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      
      {/* 1. LECTURA ACTUAL & INCA */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2 relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
            Concentración Actual
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${
            stats.currentInca === 'BUENO'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : stats.currentInca === 'MODERADO'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : stats.currentInca === 'MALO'
              ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
          }`}>
            INCA: {stats.currentInca}
          </span>
        </div>

        <div>
          <div className="text-2xl sm:text-3xl font-mono font-black text-white">
            {stats.currentValue}{' '}
            <span className="text-xs font-normal text-slate-400">{meta.unit}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[11px]">
            <span className="text-slate-400">ECA ({meta.primaryTimeframe}):</span>
            <span className="font-mono font-bold text-slate-200">{meta.ecaLimit} {meta.unit}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
          <span className="text-slate-400">Razón vs Estándar:</span>
          <span className={`font-mono font-extrabold ${isExceeded ? 'text-rose-400' : 'text-emerald-400'}`}>
            {isExceeded ? `+${excessPct}% Exceso` : `${Math.round((stats.currentValue / meta.ecaLimit) * 100)}% de ECA`}
          </span>
        </div>
      </div>

      {/* 2. CUMPLIMIENTO NORMATIVO */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
            Cumplimiento ECA
          </span>
          <Scale className="w-4 h-4 text-teal-400" />
        </div>

        <div>
          <div className="text-2xl sm:text-3xl font-mono font-black text-teal-300">
            {stats.complianceRatePercent}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {stats.exceedanceCount} registros sobre la norma de {stats.totalMeasurements} horas
          </div>
        </div>

        {/* Mini progress bar */}
        <div className="pt-2 border-t border-slate-800/80 space-y-1">
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                stats.complianceRatePercent >= 90 ? 'bg-emerald-400' : stats.complianceRatePercent >= 70 ? 'bg-amber-400' : 'bg-rose-500'
              }`}
              style={{ width: `${stats.complianceRatePercent}%` }}
            />
          </div>
          <span className="text-[9px] text-slate-500 block text-right font-mono">D.S. N° 003-2017-MINAM</span>
        </div>
      </div>

      {/* 3. ESTADÍSTICAS DEL CICLO */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
            Rango & Dispersión
          </span>
          <TrendingUp className="w-4 h-4 text-cyan-400" />
        </div>

        <div className="space-y-1 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Promedio:</span>
            <span className="text-white font-bold">{stats.averageConcentration} {meta.unit}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Pico Máximo:</span>
            <span className="text-rose-400 font-bold">{stats.maxConcentration} {meta.unit}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Mínimo:</span>
            <span className="text-emerald-400 font-bold">{stats.minConcentration} {meta.unit}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
          <span className="text-slate-400">Desv. Estándar (σ):</span>
          <span className="font-mono text-slate-300 font-bold">±{stats.standardDeviation}</span>
        </div>
      </div>

      {/* 4. DISPERSIÓN METEOROLÓGICA */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
            Ventilación Atmosférica
          </span>
          <Wind className="w-4 h-4 text-emerald-400" />
        </div>

        <div>
          <div className="text-xs font-extrabold text-white leading-tight">
            {stats.ventilationIndex}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5 font-mono">
            <span>Viento Prom: <strong>{stats.avgWindSpeed} m/s</strong></span>
            <span>•</span>
            <span>Dir: <strong>{stats.dominantWind}</strong></span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
          <span className="text-slate-400">Acoplamiento:</span>
          <span className="text-teal-300 font-bold">Brisa Alisia de Costa</span>
        </div>
      </div>

    </div>
  );
};
