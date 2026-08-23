import React from 'react';
import { Volume2, AlertTriangle, ShieldCheck, Activity, Gauge, Flame } from 'lucide-react';
import { NoiseMeasurementRecord } from '../../types/noiseQuality';

interface NoiseIndicatorsSummaryProps {
  records: NoiseMeasurementRecord[];
}

export const NoiseIndicatorsSummary: React.FC<NoiseIndicatorsSummaryProps> = ({ records }) => {
  const totalCount = records.length;
  
  if (totalCount === 0) return null;

  // Energy equivalent average: 10 * log10 ( (1/N) * sum(10^(LAeq/10)) )
  const meanEnergyLaeq = Number((
    10 * Math.log10(
      records.reduce((acc, r) => acc + Math.pow(10, r.laeq / 10), 0) / totalCount
    )
  ).toFixed(1));

  const exceedingCount = records.filter(r => r.isExceeding).length;
  const exceedancePercent = Math.round((exceedingCount / totalCount) * 100);

  const highestLafmaxRecord = [...records].sort((a, b) => b.lafmax - a.lafmax)[0];
  const highestLcpeakRecord = [...records].sort((a, b) => b.lcpeak - a.lcpeak)[0];

  const calibratedCount = records.filter(r => r.calibration?.isCalibrationValid).length;
  const calibratedPercent = Math.round((calibratedCount / totalCount) * 100);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      
      {/* 1: TOTAL POINTS */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase text-slate-400">Puntos de Monitoreo</span>
          <Volume2 className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-black font-mono text-white">
          {totalCount}
        </div>
        <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>Red Lima & Callao</span>
        </div>
      </div>

      {/* 2: AVERAGE LAEQ */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase text-slate-400">LAeq Promedio Energético</span>
          <Activity className="w-4 h-4 text-blue-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-300">
          {meanEnergyLaeq} <span className="text-xs font-normal text-slate-400">dBA</span>
        </div>
        <div className="text-[10px] text-slate-400">
          Media logarítmica urbana
        </div>
      </div>

      {/* 3: EXCEEDANCE PERCENTAGE */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase text-slate-400">% Puntos Sobre ECA</span>
          <AlertTriangle className={`w-4 h-4 ${exceedancePercent > 50 ? 'text-rose-400' : 'text-amber-400'}`} />
        </div>
        <div className={`text-2xl sm:text-3xl font-black font-mono ${
          exceedancePercent > 50 ? 'text-rose-400' : exceedancePercent > 20 ? 'text-amber-400' : 'text-emerald-400'
        }`}>
          {exceedancePercent}%
        </div>
        <div className="text-[10px] text-slate-400">
          {exceedingCount} de {totalCount} superan D.S. 085-2003
        </div>
      </div>

      {/* 4: MAX LAFMAX */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase text-slate-400">Pico Máximo LAFmax</span>
          <Flame className="w-4 h-4 text-orange-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-black font-mono text-orange-400">
          {highestLafmaxRecord ? highestLafmaxRecord.lafmax : '--'} <span className="text-xs font-normal text-slate-400">dBA</span>
        </div>
        <div className="text-[10px] text-slate-400 truncate">
          {highestLafmaxRecord ? highestLafmaxRecord.district : 'Sin datos'}
        </div>
      </div>

      {/* 5: CALIBRATION METROLOGY */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5 col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase text-slate-400">Trazabilidad Metrológica</span>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
          {calibratedPercent}%
        </div>
        <div className="text-[10px] text-slate-400">
          Δ ≤ 0.5 dB (ISO 1996)
        </div>
      </div>

    </div>
  );
};
