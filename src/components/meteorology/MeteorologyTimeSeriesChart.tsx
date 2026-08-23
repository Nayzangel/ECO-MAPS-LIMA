import React, { useState } from 'react';
import { MeteorologicalRecord } from '../../types/meteorology';
import { generate24hMeteorologicalSeries } from '../../data/meteorologyData';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  Clock, 
  Layers 
} from 'lucide-react';

interface MeteorologyTimeSeriesChartProps {
  station: MeteorologicalRecord;
}

type SelectedParam = 'temperature' | 'relativeHumidity' | 'windSpeed' | 'solarRadiation';

export const MeteorologyTimeSeriesChart: React.FC<MeteorologyTimeSeriesChartProps> = ({
  station
}) => {
  const [selectedParam, setSelectedParam] = useState<SelectedParam>('temperature');

  const seriesData = generate24hMeteorologicalSeries(station);

  const paramConfig: Record<SelectedParam, { name: string; unit: string; color: string; icon: any; min: number; max: number }> = {
    temperature: {
      name: 'Temperatura',
      unit: '°C',
      color: '#f43f5e',
      icon: Thermometer,
      min: 10,
      max: 30
    },
    relativeHumidity: {
      name: 'Humedad Relativa',
      unit: '%',
      color: '#38bdf8',
      icon: Droplets,
      min: 20,
      max: 100
    },
    windSpeed: {
      name: 'Velocidad del Viento',
      unit: 'm/s',
      color: '#2dd4bf',
      icon: Wind,
      min: 0,
      max: 10
    },
    solarRadiation: {
      name: 'Radiación Solar',
      unit: 'W/m²',
      color: '#f59e0b',
      icon: Sun,
      min: 0,
      max: 1000
    }
  };

  const currentCfg = paramConfig[selectedParam];

  // Dynamic SVG Chart calculations
  const chartHeight = 220;
  const chartWidth = 720;
  const paddingX = 45;
  const paddingY = 25;

  const innerW = chartWidth - paddingX * 2;
  const innerH = chartHeight - paddingY * 2;

  // Find min and max for chart scale
  const values = seriesData.map(d => d[selectedParam]);
  const minVal = Math.min(...values, currentCfg.min);
  const maxVal = Math.max(...values, currentCfg.max);
  const range = maxVal - minVal || 1;

  const points = seriesData.map((d, idx) => {
    const x = paddingX + (idx / (seriesData.length - 1)) * innerW;
    const y = paddingY + innerH - ((d[selectedParam] - minVal) / range) * innerH;
    return { x, y, val: d[selectedParam], hour: d.hour };
  });

  const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingY + innerH} L ${points[0].x} ${paddingY + innerH} Z`;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
      
      {/* HEADER & PARAMETER TOGGLES */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            Evolución Temporal 24 Horas: {station.stationName}
          </h4>
          <p className="text-xs text-slate-400">
            Comportamiento diurno/nocturno de variables atmosféricas
          </p>
        </div>

        {/* PARAMETER SELECTORS */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
          {(Object.keys(paramConfig) as SelectedParam[]).map((k) => {
            const cfg = paramConfig[k];
            const Icon = cfg.icon;
            const isSelected = selectedParam === k;
            return (
              <button
                key={k}
                onClick={() => setSelectedParam(k)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
                style={isSelected ? { borderColor: `${cfg.color}60` } : {}}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                <span>{cfg.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG CHART CONTAINER */}
      <div className="relative pt-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto select-none"
        >
          <defs>
            <linearGradient id={`grad-${selectedParam}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={currentCfg.color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={currentCfg.color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* GRID LINES & Y AXIS LABELS */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = paddingY + innerH - ratio * innerH;
            const valLabel = (minVal + ratio * range).toFixed(1);
            return (
              <g key={`grid-y-${i}`}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="#334155"
                  strokeDasharray="2 2"
                  strokeWidth="0.8"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {valLabel}
                </text>
              </g>
            );
          })}

          {/* X AXIS LABELS (HOURS) */}
          {points.filter((_, idx) => idx % 3 === 0).map((p, i) => (
            <text
              key={`grid-x-${i}`}
              x={p.x}
              y={paddingY + innerH + 16}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="9"
              fontFamily="monospace"
            >
              {p.hour}
            </text>
          ))}

          {/* AREA FILL UNDER CURVE */}
          <path d={areaD} fill={`url(#grad-${selectedParam})`} />

          {/* MAIN LINE */}
          <path
            d={pathD}
            fill="none"
            stroke={currentCfg.color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* DATA POINTS & HOVER CIRCLES */}
          {points.map((p, idx) => (
            <g key={`dot-${idx}`} className="group cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r="3.5"
                fill="#0f172a"
                stroke={currentCfg.color}
                strokeWidth="2"
                className="transition-all group-hover:r-5"
              />
              <title>{`${p.hour}: ${p.val} ${currentCfg.unit}`}</title>
            </g>
          ))}
        </svg>
      </div>

      {/* PARAMETER STATS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 mt-2 border-t border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <span>Unidad de Medida:</span>
          <strong className="text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-mono">
            {currentCfg.unit}
          </strong>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-slate-400">
            Mín: <strong className="text-white">{Math.min(...values)}</strong> {currentCfg.unit}
          </span>
          <span className="text-slate-400">
            Prom: <strong className="text-cyan-400">{(values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)}</strong> {currentCfg.unit}
          </span>
          <span className="text-slate-400">
            Máx: <strong className="text-rose-400">{Math.max(...values)}</strong> {currentCfg.unit}
          </span>
        </div>
      </div>

    </div>
  );
};
