import React, { useState } from 'react';
import { TrendingUp, Sun, Moon, AlertTriangle, ShieldCheck, Info, Flame, Activity } from 'lucide-react';
import { NoiseHourlyPoint } from '../../data/noiseQualityData';
import { NoiseMeasurementRecord } from '../../types/noiseQuality';

interface NoiseTimeSeriesChartProps {
  hourlyData: NoiseHourlyPoint[];
  record: NoiseMeasurementRecord;
}

export const NoiseTimeSeriesChart: React.FC<NoiseTimeSeriesChartProps> = ({
  hourlyData,
  record
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<NoiseHourlyPoint | null>(null);
  const [visibleLines, setVisibleLines] = useState<{
    laeq: boolean;
    lafmax: boolean;
    lafmin: boolean;
    lcpeak: boolean;
    eca: boolean;
  }>({
    laeq: true,
    lafmax: true,
    lafmin: true,
    lcpeak: true,
    eca: true
  });

  const chartHeight = 240;
  const chartWidth = 720;
  const padding = { top: 25, right: 30, bottom: 35, left: 45 };

  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Max and Min values for Y scale (30 dB to 120 dB)
  const minY = 30;
  const maxY = 120;

  const getX = (index: number) => padding.left + (index / (hourlyData.length - 1)) * innerWidth;
  const getY = (val: number) => padding.top + innerHeight - ((val - minY) / (maxY - minY)) * innerHeight;

  // SVG Paths
  const laeqPath = hourlyData.reduce((acc, d, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.laeq)}`, '');
  const lafmaxPath = hourlyData.reduce((acc, d, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.lafmax)}`, '');
  const lafminPath = hourlyData.reduce((acc, d, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.lafmin)}`, '');
  const lcpeakPath = hourlyData.reduce((acc, d, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.lcpeak)}`, '');
  const ecaPath = hourlyData.reduce((acc, d, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.ecaLimit)}`, '');

  // Envelope Area between LAFmax and LAFmin
  const envelopeArea = hourlyData.length > 0 ? `
    M ${getX(0)} ${getY(hourlyData[0].lafmax)}
    ${hourlyData.map((d, i) => `L ${getX(i)} ${getY(d.lafmax)}`).join(' ')}
    ${hourlyData.slice().reverse().map((d, i) => `L ${getX(hourlyData.length - 1 - i)} ${getY(d.lafmin)}`).join(' ')}
    Z
  ` : '';

  // Day hours shaded box (07:00 to 22:00 -> index 7 to index 22)
  const dayStartX = getX(7);
  const dayEndX = getX(22);

  // Active point for stats: hovered point or current point
  const activeStats = hoveredPoint || hourlyData[12] || hourlyData[0];

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-2xl">
      
      {/* HEADER & LEGEND CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 uppercase">
              Ciclo Acústico 24 Horas
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {record.district} • {record.zoneType}
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-white mt-1">
            Dinámica Temporal de Presión Sonora & Parámetros Estadísticos
          </h3>
        </div>

        {/* TOGGLE LINES */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-bold">
          <button
            type="button"
            onClick={() => setVisibleLines(prev => ({ ...prev, laeq: !prev.laeq }))}
            className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              visibleLines.laeq ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-950 text-slate-500 border-slate-800'
            }`}
          >
            <span className="w-2.5 h-1 bg-cyan-400 rounded-full" />
            <span>LAeq (Continuo)</span>
          </button>

          <button
            type="button"
            onClick={() => setVisibleLines(prev => ({ ...prev, lafmax: !prev.lafmax }))}
            className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              visibleLines.lafmax ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-950 text-slate-500 border-slate-800'
            }`}
          >
            <span className="w-2.5 h-1 bg-amber-400 rounded-full" />
            <span>LAFmax</span>
          </button>

          <button
            type="button"
            onClick={() => setVisibleLines(prev => ({ ...prev, lafmin: !prev.lafmin }))}
            className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              visibleLines.lafmin ? 'bg-teal-500/20 text-teal-300 border-teal-500/40' : 'bg-slate-950 text-slate-500 border-slate-800'
            }`}
          >
            <span className="w-2.5 h-1 bg-teal-400 rounded-full" />
            <span>LAFmin</span>
          </button>

          <button
            type="button"
            onClick={() => setVisibleLines(prev => ({ ...prev, lcpeak: !prev.lcpeak }))}
            className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              visibleLines.lcpeak ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-slate-950 text-slate-500 border-slate-800'
            }`}
          >
            <span className="w-2.5 h-1 bg-rose-400 rounded-full" />
            <span>LCpeak</span>
          </button>

          <button
            type="button"
            onClick={() => setVisibleLines(prev => ({ ...prev, eca: !prev.eca }))}
            className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              visibleLines.eca ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-slate-950 text-slate-500 border-slate-800'
            }`}
          >
            <span className="w-2.5 h-1 bg-red-500 rounded-full" />
            <span>ECA D.S. 085-2003</span>
          </button>
        </div>
      </div>

      {/* SVG CHART CONTAINER */}
      <div className="relative bg-slate-950/80 p-4 rounded-2xl border border-slate-800 overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto min-w-[620px] overflow-visible"
        >
          {/* DAYTIME BACKGROUND SHADE (07:01 to 22:00) */}
          <rect
            x={dayStartX}
            y={padding.top}
            width={dayEndX - dayStartX}
            height={innerHeight}
            fill="#f59e0b"
            fillOpacity={0.04}
          />
          <text
            x={dayStartX + 10}
            y={padding.top + 15}
            fill="#f59e0b"
            fontSize="10"
            fontWeight="bold"
            opacity="0.5"
          >
            ☀️ HORARIO DIURNO (07:01 - 22:00)
          </text>

          {/* GRID LINES & Y AXIS LABELS */}
          {[40, 50, 60, 70, 80, 90, 100, 110].map((level) => {
            const y = getY(level);
            return (
              <g key={level}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="#334155"
                  strokeDasharray="3 3"
                  strokeWidth="0.8"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {level} dB
                </text>
              </g>
            );
          })}

          {/* ENVELOPE AREA (LAFmax to LAFmin) */}
          {visibleLines.lafmax && visibleLines.lafmin && (
            <path
              d={envelopeArea}
              fill="#06b6d4"
              fillOpacity={0.07}
            />
          )}

          {/* ECA NORMATIVE STEP LINE */}
          {visibleLines.eca && (
            <path
              d={ecaPath}
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="5 3"
            />
          )}

          {/* LCPEAK LINE */}
          {visibleLines.lcpeak && (
            <path
              d={lcpeakPath}
              fill="none"
              stroke="#f43f5e"
              strokeWidth="1.5"
              opacity="0.7"
            />
          )}

          {/* LAFMIN LINE */}
          {visibleLines.lafmin && (
            <path
              d={lafminPath}
              fill="none"
              stroke="#14b8a6"
              strokeWidth="1.5"
              opacity="0.8"
            />
          )}

          {/* LAFMAX LINE */}
          {visibleLines.lafmax && (
            <path
              d={lafmaxPath}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.8"
            />
          )}

          {/* LAEQ LINE (MAIN CONTINUOUS EQUIVALENT) */}
          {visibleLines.laeq && (
            <path
              d={laeqPath}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="3"
            />
          )}

          {/* DATA POINTS HOVER CIRCLES & X LABELS */}
          {hourlyData.map((d, i) => {
            const x = getX(i);
            const isHovered = hoveredPoint?.hour === d.hour;

            return (
              <g key={d.hour} className="cursor-pointer">
                {/* X Axis Label */}
                {i % 2 === 0 && (
                  <text
                    x={x}
                    y={chartHeight - 10}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {d.hour}
                  </text>
                )}

                {/* Vertical hover marker line */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={chartHeight - padding.bottom}
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Point on LAeq */}
                {visibleLines.laeq && (
                  <circle
                    cx={x}
                    cy={getY(d.laeq)}
                    r={isHovered ? 6 : d.isExceeding ? 4 : 2.5}
                    fill={d.isExceeding ? '#ef4444' : '#06b6d4'}
                    stroke="#020617"
                    strokeWidth="1.5"
                  />
                )}

                {/* Invisible hover capture rect */}
                <rect
                  x={x - innerWidth / (hourlyData.length * 2)}
                  y={padding.top}
                  width={innerWidth / hourlyData.length}
                  height={innerHeight}
                  fill="transparent"
                  onMouseEnter={() => setHoveredPoint(d)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* FLOATING HOVER TOOLTIP */}
        {hoveredPoint && (
          <div className="absolute top-6 right-6 p-3.5 bg-slate-950/95 border border-cyan-500/50 rounded-2xl text-xs space-y-1.5 shadow-2xl font-mono animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-1">
              <span className="text-cyan-400 font-bold">Hora {hoveredPoint.hour}</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                hoveredPoint.period === 'DIURNO' ? 'bg-amber-950 text-amber-300' : 'bg-indigo-950 text-indigo-300'
              }`}>
                {hoveredPoint.period}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
              <span className="text-slate-400">LAeq Continuo:</span>
              <span className="font-black text-cyan-300 text-right">{hoveredPoint.laeq} dBA</span>
              
              <span className="text-slate-400">LAFmax:</span>
              <span className="font-bold text-amber-400 text-right">{hoveredPoint.lafmax} dBA</span>

              <span className="text-slate-400">LAFmin:</span>
              <span className="font-bold text-teal-400 text-right">{hoveredPoint.lafmin} dBA</span>

              <span className="text-slate-400">LCpeak (Pico):</span>
              <span className="font-bold text-rose-400 text-right">{hoveredPoint.lcpeak} dBC</span>

              <span className="text-slate-400">Límite ECA:</span>
              <span className="font-bold text-white text-right">{hoveredPoint.ecaLimit} dBA</span>
            </div>

            <div className="pt-1 border-t border-slate-800 text-[10px] flex items-center justify-between">
              <span className="text-slate-400">Estado:</span>
              <span className={`font-bold ${hoveredPoint.isExceeding ? 'text-rose-400' : 'text-emerald-400'}`}>
                {hoveredPoint.isExceeding ? `⚠️ Excede +${(hoveredPoint.laeq - hoveredPoint.ecaLimit).toFixed(1)} dB` : '✓ Conforme'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* PERCENTILES & ACOUSTIC DYNAMICS SUMMARY */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        
        <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between">
            <span>Percentil L10</span>
            <span className="text-amber-400">Picos de Tráfico</span>
          </div>
          <div className="text-xl font-mono font-black text-amber-300">
            {record.statistical?.l10 || (record.laeq + 3.8).toFixed(1)} <span className="text-xs font-normal text-slate-400">dBA</span>
          </div>
          <div className="text-[10px] text-slate-400">Superado el 10% del tiempo</div>
        </div>

        <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between">
            <span>Percentil L50</span>
            <span className="text-cyan-400">Mediana Sonora</span>
          </div>
          <div className="text-xl font-mono font-black text-cyan-300">
            {record.statistical?.l50 || (record.laeq - 1.2).toFixed(1)} <span className="text-xs font-normal text-slate-400">dBA</span>
          </div>
          <div className="text-[10px] text-slate-400">Nivel medio continuo</div>
        </div>

        <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between">
            <span>Percentil L90</span>
            <span className="text-teal-400">Ruido de Fondo</span>
          </div>
          <div className="text-xl font-mono font-black text-teal-300">
            {record.statistical?.l90 || (record.laeq - 6.5).toFixed(1)} <span className="text-xs font-normal text-slate-400">dBA</span>
          </div>
          <div className="text-[10px] text-slate-400">Línea base residual</div>
        </div>

        <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between">
            <span>Rango Dinámico</span>
            <span className="text-purple-400">Lmax - Lmin</span>
          </div>
          <div className="text-xl font-mono font-black text-purple-300">
            {(record.lafmax - record.lafmin).toFixed(1)} <span className="text-xs font-normal text-slate-400">dB</span>
          </div>
          <div className="text-[10px] text-slate-400">Amplitud de variabilidad</div>
        </div>

      </div>

    </div>
  );
};
