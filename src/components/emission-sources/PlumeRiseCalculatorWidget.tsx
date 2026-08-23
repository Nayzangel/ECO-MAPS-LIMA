import React, { useState } from 'react';
import { Flame, Wind, Thermometer, Layers, ArrowUp, Zap, Sparkles } from 'lucide-react';
import { calculateBriggsPlumeRise, calculateStackArea, calculateFlowFromVelocity } from '../../utils/emissionCalculations';

export const PlumeRiseCalculatorWidget: React.FC = () => {
  const [hs, setHs] = useState<number>(60.0); // Stack height (m)
  const [d, setD] = useState<number>(2.5); // Diameter (m)
  const [ts, setTs] = useState<number>(160.0); // Gas temp (°C)
  const [vs, setVs] = useState<number>(15.0); // Gas exit velocity (m/s)
  const [ta, setTa] = useState<number>(20.0); // Ambient temp (°C)
  const [u, setU] = useState<number>(3.5); // Wind speed at stack top (m/s)

  const area = calculateStackArea(d);
  const flow = calculateFlowFromVelocity(d, vs);
  const result = calculateBriggsPlumeRise(hs, d, ts, vs, ta, u);

  // SVG representation dimensions
  const svgH = 260;
  const svgW = 400;
  const baseY = 220;
  const stackScaledH = Math.min((hs / 150) * 110, 110);
  const plumeScaledRise = Math.min((result.plumeRiseDeltaH / 200) * 80, 80);
  const stackTopY = baseY - stackScaledH;
  const plumeEffectiveY = stackTopY - plumeScaledRise;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Simulador de Elevación del Penacho (Ecuaciones de Briggs)
              </h3>
              <p className="text-xs text-slate-400">
                Flotabilidad térmica (Fb), Momento inercial (Fm) y Altura Efectiva (H = hs + Δh)
              </p>
            </div>
          </div>
        </div>

        <div className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl text-right">
          <span className="text-[10px] text-slate-400 block uppercase">Altura Efectiva H</span>
          <span className="text-base font-black text-emerald-400 font-mono">
            {result.effectiveStackHeight} m
          </span>
        </div>
      </div>

      {/* 2-COLUMN LAYOUT: INTERACTIVE SLIDERS + SVG SCHEMATIC */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* SLIDERS COLUMN */}
        <div className="lg:col-span-7 space-y-3.5">
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            
            {/* STACK HEIGHT */}
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Altura Chimenea (hs): <strong className="text-cyan-400">{hs} m</strong>
              </label>
              <input
                type="range"
                min="5"
                max="150"
                step="1"
                value={hs}
                onChange={(e) => setHs(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* DIAMETER */}
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Diámetro (d): <strong className="text-cyan-400">{d} m</strong>
              </label>
              <input
                type="range"
                min="0.5"
                max="8.0"
                step="0.1"
                value={d}
                onChange={(e) => setD(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* GAS TEMP */}
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Temp. Gases (Ts): <strong className="text-rose-400">{ts} °C</strong>
              </label>
              <input
                type="range"
                min="25"
                max="400"
                step="5"
                value={ts}
                onChange={(e) => setTs(parseFloat(e.target.value))}
                className="w-full accent-rose-400"
              />
            </div>

            {/* EXIT VELOCITY */}
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Velocidad (vs): <strong className="text-teal-400">{vs} m/s</strong>
              </label>
              <input
                type="range"
                min="1.0"
                max="35.0"
                step="0.5"
                value={vs}
                onChange={(e) => setVs(parseFloat(e.target.value))}
                className="w-full accent-teal-400"
              />
            </div>

            {/* AMBIENT TEMP */}
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Temp. Ambiente (Ta): <strong className="text-amber-400">{ta} °C</strong>
              </label>
              <input
                type="range"
                min="5"
                max="40"
                step="1"
                value={ta}
                onChange={(e) => setTa(parseFloat(e.target.value))}
                className="w-full accent-amber-400"
              />
            </div>

            {/* WIND SPEED */}
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Viento Vértice (u): <strong className="text-blue-400">{u} m/s</strong>
              </label>
              <input
                type="range"
                min="0.5"
                max="15.0"
                step="0.5"
                value={u}
                onChange={(e) => setU(parseFloat(e.target.value))}
                className="w-full accent-blue-400"
              />
            </div>

          </div>

          {/* BRIGGS COMPUTED METRICS CHIPS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-mono">
            <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 font-sans block">Caudal Hidráulico:</span>
              <span className="text-cyan-400 font-bold">{flow} m³/s</span>
            </div>
            <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 font-sans block">Flujo Flotabilidad (Fb):</span>
              <span className="text-rose-400 font-bold">{result.buoyancyFluxFb} m⁴/s³</span>
            </div>
            <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 font-sans block">Flujo Momento (Fm):</span>
              <span className="text-teal-400 font-bold">{result.momentumFluxFm} m⁴/s²</span>
            </div>
            <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 font-sans block">Elevación Δh:</span>
              <span className="text-amber-400 font-bold">+{result.plumeRiseDeltaH} m</span>
            </div>
          </div>

        </div>

        {/* SVG PHYSICAL SCHEMATIC */}
        <div className="lg:col-span-5 flex justify-center items-center bg-slate-950/80 rounded-xl p-4 border border-slate-800/80">
          <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto select-none">
            <defs>
              <linearGradient id="plumeGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#fb923c" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* TERRAIN GROUND */}
            <line x1="10" y1={baseY} x2={svgW - 10} y2={baseY} stroke="#475569" strokeWidth="2" />
            <text x="20" y={baseY + 18} fill="#64748b" fontSize="10" fontFamily="sans-serif">Terreno (0 m)</text>

            {/* CHIMNEY / STACK BODY */}
            <rect
              x={100}
              y={stackTopY}
              width={24}
              height={stackScaledH}
              fill="#334155"
              stroke="#64748b"
              strokeWidth="1.5"
              rx="2"
            />
            {/* Stack rim */}
            <ellipse cx={112} cy={stackTopY} rx={14} ry={3} fill="#475569" stroke="#94a3b8" />

            {/* STACK HEIGHT LABEL */}
            <line x1="80" y1={baseY} x2="80" y2={stackTopY} stroke="#38bdf8" strokeDasharray="2 2" />
            <text x="72" y={baseY - stackScaledH / 2} textAnchor="end" fill="#38bdf8" fontSize="9" fontWeight="bold">
              hs = {hs}m
            </text>

            {/* DISPERSION PLUME CURVE */}
            <path
              d={`M 112 ${stackTopY} Q 130 ${plumeEffectiveY}, ${svgW - 20} ${plumeEffectiveY + 25}`}
              fill="none"
              stroke="url(#plumeGrad)"
              strokeWidth="22"
              strokeLinecap="round"
            />
            <path
              d={`M 112 ${stackTopY} Q 130 ${plumeEffectiveY}, ${svgW - 20} ${plumeEffectiveY + 25}`}
              fill="none"
              stroke="#fb923c"
              strokeWidth="2"
              strokeDasharray="4 2"
            />

            {/* EFFECTIVE HEIGHT HORIZONTAL DASHED LINE */}
            <line x1="40" y1={plumeEffectiveY} x2={svgW - 20} y2={plumeEffectiveY} stroke="#10b981" strokeDasharray="3 3" />
            <text x="45" y={plumeEffectiveY - 6} fill="#10b981" fontSize="10" fontWeight="bold" fontFamily="monospace">
              H efectiva = {result.effectiveStackHeight} m
            </text>

            {/* DELTA H BRACKET */}
            <line x1="140" y1={stackTopY} x2="140" y2={plumeEffectiveY} stroke="#f59e0b" strokeWidth="1.5" />
            <text x="146" y={stackTopY - plumeScaledRise / 2 + 4} fill="#f59e0b" fontSize="9" fontWeight="bold">
              Δh = +{result.plumeRiseDeltaH}m
            </text>

            {/* WIND ARROW */}
            <g transform="translate(180, 25)">
              <line x1="0" y1="0" x2="40" y2="0" stroke="#38bdf8" strokeWidth="2" />
              <polygon points="40,0 34,-3 34,3" fill="#38bdf8" />
              <text x="45" y="4" fill="#38bdf8" fontSize="9" fontWeight="bold">
                Viento u = {u} m/s
              </text>
            </g>

          </svg>
        </div>

      </div>

    </div>
  );
};
