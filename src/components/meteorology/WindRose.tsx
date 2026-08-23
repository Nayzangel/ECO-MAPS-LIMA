import React, { useState } from 'react';
import { WindRoseData, WindRoseSector } from '../../types/meteorology';
import { STANDARD_SPEED_BINS } from '../../utils/meteorologyCalculations';
import { Compass, Download, Info, Zap, BarChart2 } from 'lucide-react';

interface WindRoseProps {
  data: WindRoseData;
  size?: number;
  className?: string;
  onExportCsv?: () => void;
}

export const WindRose: React.FC<WindRoseProps> = ({
  data,
  size = 460,
  className = '',
  onExportCsv
}) => {
  const [hoveredSector, setHoveredSector] = useState<WindRoseSector | null>(null);
  const [hoveredBinIdx, setHoveredBinIdx] = useState<number | null>(null);

  const center = size / 2;
  const maxRadius = center - 45; // Leave room for cardinal labels
  const innerCalmRadius = 24;

  // Find max frequency for scale rings (default to 20% or 30% if higher)
  let maxFreq = 20;
  data.sectors.forEach(s => {
    if (s.totalFrequencyPercent > maxFreq) {
      maxFreq = Math.ceil(s.totalFrequencyPercent / 5) * 5;
    }
  });

  // Frequency rings (e.g. 5%, 10%, 15%, 20%...)
  const rings = [];
  const ringStep = maxFreq <= 20 ? 5 : 10;
  for (let f = ringStep; f <= maxFreq; f += ringStep) {
    rings.push(f);
  }

  // Scale function: maps frequency % to radius in px
  const scaleRadius = (freqPercent: number) => {
    return innerCalmRadius + (freqPercent / maxFreq) * (maxRadius - innerCalmRadius);
  };

  // Convert polar coordinates to SVG Cartesian (0 deg = North = -90 deg in SVG canvas)
  const polarToCartesian = (radius: number, angleDegrees: number) => {
    const angleRad = ((angleDegrees - 90) * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(angleRad),
      y: center + radius * Math.sin(angleRad)
    };
  };

  // Create SVG path for an annular sector wedge (arc slice)
  const createWedgePath = (rInner: number, rOuter: number, startDeg: number, endDeg: number) => {
    const p1 = polarToCartesian(rOuter, startDeg);
    const p2 = polarToCartesian(rOuter, endDeg);
    const p3 = polarToCartesian(rInner, endDeg);
    const p4 = polarToCartesian(rInner, startDeg);

    const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;

    return `M ${p1.x} ${p1.y} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rInner} ${rInner} 0 ${largeArc} 0 ${p4.x} ${p4.y} Z`;
  };

  const handleDownloadSvg = () => {
    const svgEl = document.getElementById('wind-rose-svg-container');
    if (!svgEl) return;
    const svgString = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rosa_de_Vientos_${data.stationName.replace(/\s+/g, '_')}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl ${className}`}>
      
      {/* HEADER WITH TITLE & ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">
                Rosa de los Vientos (Wind Rose)
              </h3>
              <p className="text-xs text-slate-400">
                {data.stationName} • <span className="text-cyan-400 font-medium">{data.periodDescription}</span>
              </p>
            </div>
          </div>
        </div>

        {/* METRICS BADGES */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-2.5 py-1 bg-slate-800/80 rounded-lg border border-slate-700/60 text-xs">
            <span className="text-slate-400">Dirección Dominante:</span>{' '}
            <strong className="text-amber-400 font-bold">{data.dominantDirection}</strong>
          </div>
          <div className="px-2.5 py-1 bg-slate-800/80 rounded-lg border border-slate-700/60 text-xs">
            <span className="text-slate-400">Vel. Media:</span>{' '}
            <strong className="text-emerald-400 font-bold">{data.meanSpeed} m/s</strong>
          </div>
          <div className="px-2.5 py-1 bg-slate-800/80 rounded-lg border border-slate-700/60 text-xs">
            <span className="text-slate-400">Calmas (&lt;0.5m/s):</span>{' '}
            <strong className="text-cyan-400 font-bold">{data.calmPercent}%</strong>
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={handleDownloadSvg}
              title="Descargar Rosa de Vientos en formato vectorial SVG"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
            >
              <Download className="w-4 h-4" />
            </button>
            {onExportCsv && (
              <button
                onClick={onExportCsv}
                title="Exportar datos polares en CSV"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              >
                <BarChart2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER: SVG PLOT + LEGEND & HOVER DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-4">
        
        {/* SVG POLAR PLOT */}
        <div className="lg:col-span-7 flex justify-center items-center relative overflow-hidden">
          <svg
            id="wind-rose-svg-container"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="select-none filter drop-shadow-lg max-w-full h-auto"
          >
            <defs>
              <radialGradient id="calmGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#1e293b" />
              </radialGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* BACKGROUND CIRCLES (CONCENTRIC PERCENTAGE RINGS) */}
            {rings.map((ringVal) => {
              const r = scaleRadius(ringVal);
              return (
                <g key={`ring-${ringVal}`}>
                  <circle
                    cx={center}
                    cy={center}
                    r={r}
                    fill="none"
                    stroke="#334155"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={center + 4}
                    y={center - r + 11}
                    fill="#94a3b8"
                    fontSize="9"
                    fontWeight="600"
                    className="font-mono select-none"
                  >
                    {ringVal}%
                  </text>
                </g>
              );
            })}

            {/* RADIAL SPOKE AXES (16 SECTORS) */}
            {data.sectors.map((sector) => {
              const p = polarToCartesian(maxRadius + 5, sector.degreesMid);
              const isCardinalMain = ['N', 'E', 'S', 'W'].includes(sector.direction);
              return (
                <line
                  key={`spoke-${sector.direction}`}
                  x1={center}
                  y1={center}
                  x2={p.x}
                  y2={p.y}
                  stroke={isCardinalMain ? '#475569' : '#1e293b'}
                  strokeWidth={isCardinalMain ? '1.5' : '1'}
                />
              );
            })}

            {/* STACKED WEDGES / PETALS (16 CARDINAL DIRECTIONS) */}
            {data.sectors.map((sector) => {
              const isHovered = hoveredSector?.direction === sector.direction;
              const sectorAngle = 360 / 16; // 22.5 deg width
              const halfAngle = sectorAngle / 2 - 1.2; // slight gap between petals
              const startAngle = sector.degreesMid - halfAngle;
              const endAngle = sector.degreesMid + halfAngle;

              let cumulativeFreq = 0;

              return (
                <g
                  key={`sector-${sector.direction}`}
                  className="cursor-pointer transition-opacity duration-200"
                  onMouseEnter={() => setHoveredSector(sector)}
                  onMouseLeave={() => {
                    setHoveredSector(null);
                    setHoveredBinIdx(null);
                  }}
                  opacity={hoveredSector && !isHovered ? 0.45 : 1}
                >
                  {sector.speedBins.map((bin, bIdx) => {
                    if (bin.frequencyPercent <= 0) return null;

                    const rInner = scaleRadius(cumulativeFreq);
                    cumulativeFreq += bin.frequencyPercent;
                    const rOuter = scaleRadius(cumulativeFreq);

                    const pathData = createWedgePath(rInner, rOuter, startAngle, endAngle);
                    const isBinHovered = hoveredBinIdx === bIdx;

                    return (
                      <path
                        key={`bin-${sector.direction}-${bIdx}`}
                        d={pathData}
                        fill={bin.color}
                        stroke={isHovered ? '#ffffff' : '#0f172a'}
                        strokeWidth={isHovered ? (isBinHovered ? 1.5 : 0.8) : 0.5}
                        className="transition-all duration-150"
                        onMouseEnter={(e) => {
                          e.stopPropagation();
                          setHoveredSector(sector);
                          setHoveredBinIdx(bIdx);
                        }}
                      >
                        <title>
                          {`${sector.direction} (${sector.degreesMid}°): ${bin.label} = ${bin.frequencyPercent}%`}
                        </title>
                      </path>
                    );
                  })}
                </g>
              );
            })}

            {/* CENTER CALM CIRCLE */}
            <circle
              cx={center}
              cy={center}
              r={innerCalmRadius}
              fill="url(#calmGradient)"
              stroke="#06b6d4"
              strokeWidth="2"
              className="filter drop-shadow-md"
            />
            <text
              x={center}
              y={center - 3}
              textAnchor="middle"
              fill="#38bdf8"
              fontSize="10"
              fontWeight="bold"
              className="font-mono select-none"
            >
              {data.calmPercent}%
            </text>
            <text
              x={center}
              y={center + 8}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="7"
              fontWeight="bold"
              className="uppercase tracking-wider select-none"
            >
              Calmas
            </text>

            {/* CARDINAL & ORDINAL LABELS OUTSIDE RIMS */}
            {data.sectors.map((sector) => {
              const isMain = ['N', 'E', 'S', 'W'].includes(sector.direction);
              const labelRadius = maxRadius + 18;
              const pos = polarToCartesian(labelRadius, sector.degreesMid);

              return (
                <text
                  key={`label-${sector.direction}`}
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fill={
                    sector.direction === data.dominantDirection
                      ? '#f59e0b'
                      : isMain
                      ? '#f8fafc'
                      : '#94a3b8'
                  }
                  fontSize={isMain ? '13' : '9.5'}
                  fontWeight={isMain || sector.direction === data.dominantDirection ? 'bold' : '500'}
                  className="font-sans select-none tracking-tighter"
                >
                  {sector.direction}
                </text>
              );
            })}
          </svg>
        </div>

        {/* LEGEND & INTERACTIVE INSPECTION PANEL */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* SPEED BINS LEGEND */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Escala de Velocidad del Viento
            </h4>
            <div className="space-y-2">
              {STANDARD_SPEED_BINS.map((bin, idx) => (
                <div
                  key={bin.label}
                  onMouseEnter={() => setHoveredBinIdx(idx)}
                  onMouseLeave={() => setHoveredBinIdx(null)}
                  className={`flex items-center justify-between p-1.5 rounded-lg text-xs transition cursor-pointer ${
                    hoveredBinIdx === idx ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded shadow-sm flex-shrink-0"
                      style={{ backgroundColor: bin.color }}
                    />
                    <span className="font-medium text-[11px]">{bin.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DYNAMIC HOVER INSPECTION DETAILS */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 min-h-[140px] flex flex-col justify-center">
            {hoveredSector ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-cyan-400">{hoveredSector.direction}</span>
                    <span className="text-xs text-slate-400">({hoveredSector.degreesMid}°)</span>
                  </div>
                  <div className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded font-bold">
                    Frecuencia Total: {hoveredSector.totalFrequencyPercent}%
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-xs pt-1">
                  {hoveredSector.speedBins.map((b) => (
                    <div key={b.label} className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 truncate max-w-[120px]" title={b.label}>
                        {b.label.split('(')[0]}:
                      </span>
                      <span className="font-mono font-semibold" style={{ color: b.color }}>
                        {b.frequencyPercent}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-3 text-slate-400 text-xs flex flex-col items-center gap-1">
                <Info className="w-5 h-5 text-slate-500" />
                <p>Pasa el cursor sobre un sector cardinal para ver la distribución porcentual exacta de velocidades.</p>
              </div>
            )}
          </div>

          {/* POLAR SECTOR SUMMARY CHIPS */}
          <div className="text-[11px] text-slate-400 bg-slate-900/50 p-3 rounded-lg border border-slate-800/60 leading-relaxed">
            <span className="text-cyan-400 font-semibold">Análisis de Dispersión:</span> El viento predominante proviene del sector <strong className="text-white">{data.dominantDirection}</strong> con transporte advectivo hacia el cuadrante noreste.
          </div>

        </div>

      </div>

    </div>
  );
};
