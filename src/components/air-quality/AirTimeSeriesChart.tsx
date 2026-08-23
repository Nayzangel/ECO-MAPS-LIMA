import React, { useState } from 'react';
import { HourlyDataPoint, DailyDataPoint, AirNormativeStandard } from '../../types/airQuality';
import { 
  TrendingUp, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  Sun, 
  Moon, 
  Zap, 
  ShieldAlert,
  Info
} from 'lucide-react';

interface AirTimeSeriesChartProps {
  hourlyData: HourlyDataPoint[];
  weeklyData: DailyDataPoint[];
  meta: AirNormativeStandard;
  stationName: string;
}

export const AirTimeSeriesChart: React.FC<AirTimeSeriesChartProps> = ({
  hourlyData,
  weeklyData,
  meta,
  stationName
}) => {
  const [viewMode, setViewMode] = useState<'HOURLY' | 'WEEKLY'>('HOURLY');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Determine Max for Y axis scaling
  const maxValHourly = Math.max(...hourlyData.map(d => d.value), meta.ecaLimit * 1.3);
  const maxValWeekly = Math.max(...weeklyData.map(d => d.maxValue), meta.ecaLimit * 1.3);
  const currentMax = viewMode === 'HOURLY' ? maxValHourly : maxValWeekly;

  // SVG Chart dimensions
  const width = 800;
  const height = 260;
  const padding = { top: 30, right: 30, bottom: 40, left: 50 };

  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Y coordinate mapper
  const getY = (val: number) => {
    return height - padding.bottom - (val / currentMax) * graphHeight;
  };

  // X coordinate mapper for hourly (24 points)
  const getXHourly = (index: number) => {
    return padding.left + (index / (hourlyData.length - 1)) * graphWidth;
  };

  // X coordinate mapper for weekly (7 points)
  const getXWeekly = (index: number) => {
    return padding.left + (index / (weeklyData.length - 1)) * graphWidth;
  };

  // Generate SVG path for hourly line
  const hourlyPath = hourlyData.reduce((acc, point, idx) => {
    const x = getXHourly(idx);
    const y = getY(point.value);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Generate SVG area fill path
  const hourlyAreaPath = `${hourlyPath} L ${getXHourly(hourlyData.length - 1)} ${height - padding.bottom} L ${getXHourly(0)} ${height - padding.bottom} Z`;

  // Threshold Y
  const thresholdY = getY(meta.ecaLimit);

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
      
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider">
              Evolución Temporal de {meta.code} ({meta.unit})
            </h4>
          </div>
          <p className="text-[11px] text-slate-400">
            {stationName} • Comparativo continuo vs Límite ECA ({meta.ecaLimit} {meta.unit})
          </p>
        </div>

        {/* TIME VIEW TOGGLE */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => { setViewMode('HOURLY'); setHoveredIndex(null); }}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'HOURLY'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Ciclo Horario (24h)</span>
          </button>

          <button
            type="button"
            onClick={() => { setViewMode('WEEKLY'); setHoveredIndex(null); }}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'WEEKLY'
                ? 'bg-teal-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>Histórico 7 Días</span>
          </button>
        </div>
      </div>

      {/* CHART CONTAINER */}
      <div className="relative w-full overflow-hidden bg-slate-950/80 rounded-2xl border border-slate-800/80 p-2">
        
        {/* RUSH HOUR CALLOUTS (HORA PUNTA) */}
        {viewMode === 'HOURLY' && (
          <div className="flex items-center justify-between px-4 pt-1 text-[10px] text-slate-400 border-b border-slate-900 pb-2">
            <span className="flex items-center gap-1 text-slate-400">
              <Moon className="w-3 h-3 text-indigo-400" /> Madrugada (Bajo tráfico)
            </span>
            <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
              <Zap className="w-3 h-3" /> Hora Punta Matutina (07:00 - 09:00)
            </span>
            <span className="flex items-center gap-1 text-rose-400 font-bold bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/30">
              <Zap className="w-3 h-3" /> Hora Punta Nocturna (18:00 - 20:00)
            </span>
          </div>
        )}

        {/* SVG RENDER */}
        <div className="w-full aspect-[21/9] sm:aspect-[24/8] min-h-[220px]">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full overflow-visible"
          >
            <defs>
              <linearGradient id="hourlyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="70%" stopColor="#10b981" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="exceedanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid horizontal lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const val = Math.round(currentMax * pct);
              const y = getY(val);
              return (
                <g key={i}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="#1e293b"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 4}
                    fill="#64748b"
                    fontSize="10"
                    fontFamily="monospace"
                    textAnchor="end"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* NORMATIVE ECA THRESHOLD LINE */}
            {thresholdY >= padding.top && thresholdY <= height - padding.bottom && (
              <g>
                <line
                  x1={padding.left}
                  y1={thresholdY}
                  x2={width - padding.right}
                  y2={thresholdY}
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="6 3"
                />
                <rect
                  x={width - padding.right - 130}
                  y={thresholdY - 18}
                  width="125"
                  height="16"
                  rx="4"
                  fill="#7f1d1d"
                  opacity="0.9"
                />
                <text
                  x={width - padding.right - 68}
                  y={thresholdY - 6}
                  fill="#fecdd3"
                  fontSize="9"
                  fontWeight="bold"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  LÍMITE ECA: {meta.ecaLimit} {meta.unit}
                </text>
              </g>
            )}

            {/* HOURLY MODE */}
            {viewMode === 'HOURLY' && (
              <>
                {/* Area under curve */}
                <path d={hourlyAreaPath} fill="url(#hourlyGradient)" />

                {/* Main line */}
                <path
                  d={hourlyPath}
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Interactive Points */}
                {hourlyData.map((pt, idx) => {
                  const cx = getXHourly(idx);
                  const cy = getY(pt.value);
                  const isHovered = hoveredIndex === idx;
                  const isExceeded = pt.isExceeded;

                  return (
                    <g
                      key={idx}
                      className="cursor-pointer group"
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {/* Vertical tracker on hover */}
                      {isHovered && (
                        <line
                          x1={cx}
                          y1={padding.top}
                          x2={cx}
                          y2={height - padding.bottom}
                          stroke="#38bdf8"
                          strokeWidth="1.5"
                          strokeDasharray="2 2"
                        />
                      )}

                      {/* Point Circle */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? 6 : isExceeded ? 4.5 : 3.5}
                        fill={isExceeded ? '#f43f5e' : '#10b981'}
                        stroke="#0f172a"
                        strokeWidth="2"
                        className="transition-all duration-150"
                      />

                      {/* X Axis Labels every 3 hours */}
                      {idx % 3 === 0 && (
                        <text
                          x={cx}
                          y={height - padding.bottom + 18}
                          fill="#94a3b8"
                          fontSize="9"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          {pt.hour}
                        </text>
                      )}
                    </g>
                  );
                })}
              </>
            )}

            {/* WEEKLY MODE: BAR CHART & RANGE */}
            {viewMode === 'WEEKLY' && (
              <>
                {weeklyData.map((day, idx) => {
                  const cx = getXWeekly(idx);
                  const barWidth = 32;
                  const avgY = getY(day.avgValue);
                  const maxY = getY(day.maxValue);
                  const minY = getY(day.minValue);
                  const barHeight = (height - padding.bottom) - avgY;
                  const isHovered = hoveredIndex === idx;
                  const isExceeded = day.avgValue > meta.ecaLimit;

                  return (
                    <g
                      key={idx}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {/* Max-Min Range Line */}
                      <line
                        x1={cx}
                        y1={maxY}
                        x2={cx}
                        y2={minY}
                        stroke="#64748b"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <circle cx={cx} cy={maxY} r="3" fill="#f43f5e" />
                      <circle cx={cx} cy={minY} r="3" fill="#10b981" />

                      {/* Average Bar */}
                      <rect
                        x={cx - barWidth / 2}
                        y={avgY}
                        width={barWidth}
                        height={Math.max(barHeight, 4)}
                        rx="6"
                        fill={isExceeded ? '#f43f5e' : isHovered ? '#2dd4bf' : '#0d9488'}
                        opacity={isHovered ? 1 : 0.85}
                        className="transition-all"
                      />

                      {/* Value label on top of bar */}
                      <text
                        x={cx}
                        y={avgY - 8}
                        fill="#f8fafc"
                        fontSize="10"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {day.avgValue}
                      </text>

                      {/* X Axis Day Label */}
                      <text
                        x={cx}
                        y={height - padding.bottom + 18}
                        fill="#cbd5e1"
                        fontSize="10"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        {day.dayName}
                      </text>
                    </g>
                  );
                })}
              </>
            )}

          </svg>
        </div>

        {/* HOVER DETAILS CARD / TOOLTIP */}
        {hoveredIndex !== null && (
          <div className="mt-2 p-3 bg-slate-900 rounded-xl border border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in duration-150">
            {viewMode === 'HOURLY' ? (
              <>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-emerald-400 font-bold">Hora: {hourlyData[hoveredIndex].hour}</span>
                  <span>•</span>
                  <span className="text-white font-extrabold text-sm">
                    {hourlyData[hoveredIndex].value} {meta.unit}
                  </span>
                  <span>•</span>
                  <span className={hourlyData[hoveredIndex].isExceeded ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                    {hourlyData[hoveredIndex].isExceeded ? '⚠️ Supera ECA' : '✓ En Norma'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-300 font-mono">
                  <span>Viento: <strong>{hourlyData[hoveredIndex].windSpeed} m/s ({hourlyData[hoveredIndex].windDirection})</strong></span>
                  <span>Temp: <strong>{hourlyData[hoveredIndex].temperature} °C</strong></span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-teal-400 font-bold">{weeklyData[hoveredIndex].dayName} ({weeklyData[hoveredIndex].date})</span>
                  <span>•</span>
                  <span className="text-white font-extrabold text-sm">
                    Promedio: {weeklyData[hoveredIndex].avgValue} {meta.unit}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-300 font-mono">
                  <span className="text-rose-300">Máx: {weeklyData[hoveredIndex].maxValue}</span>
                  <span className="text-emerald-300">Mín: {weeklyData[hoveredIndex].minValue}</span>
                  <span className="text-amber-300">Excedencias: {weeklyData[hoveredIndex].exceedanceCount}h</span>
                </div>
              </>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
