import React, { useState } from 'react';
import { 
  Cpu, 
  Wind, 
  Layers, 
  Flame, 
  Volume2, 
  Thermometer, 
  Sliders, 
  Sparkles, 
  ArrowRight, 
  Activity,
  CheckCircle,
  HelpCircle,
  ShieldAlert,
  Terminal,
  Lock
} from 'lucide-react';
import { ViewMode } from '../../types';
import { AirQualityModelingModule } from '../air-quality-modeling/AirQualityModelingModule';

interface ModelingSectionProps {
  viewMode: ViewMode;
  onOpenAnalysis: () => void;
}

export const ModelingSection: React.FC<ModelingSectionProps> = ({
  viewMode,
  onOpenAnalysis
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'AIR_QUALITY_MODELING' | 'CONCEPTUAL_SIMULATORS'>('AIR_QUALITY_MODELING');
  
  // Interactive Simulation Controls (Conceptual Playground)
  const [selectedConceptual, setSelectedConceptual] = useState<'dispersion' | 'ruido' | 'microclima'>('dispersion');
  const [emissionRate, setEmissionRate] = useState<number>(45); // g/s
  const [windSpeed, setWindSpeed] = useState<number>(3.5); // m/s
  const [stackHeight, setStackHeight] = useState<number>(30); // m
  const [distance, setDistance] = useState<number>(500); // m

  const estimatedConcentration = Math.max(
    5,
    Math.round((emissionRate * 1000) / (Math.PI * (windSpeed + 0.1) * (distance * 0.15 + 10)) * Math.exp(-Math.pow(stackHeight / 30, 2)))
  );

  return (
    <section id="modelamiento" className="py-20 bg-slate-950 border-b border-slate-800/80 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5" />
              Arquitectura de Modelamiento Ambiental & Dispersión
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Modelamiento de <span className="text-indigo-400">Calidad del Aire</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              Sistema de evaluación técnica, suficiencia de datos y preprocesamiento de archivos de control regulatorio para modelos de dispersión atmosférica (<strong>AERMOD</strong> y <strong>CALPUFF</strong>).
            </p>
          </div>

          {/* VIEW SWITCHER SUBTABS */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
            <button
              onClick={() => setActiveSubTab('AIR_QUALITY_MODELING')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeSubTab === 'AIR_QUALITY_MODELING'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4" /> Módulo Regulatorio & Auditoría
            </button>

            <button
              onClick={() => setActiveSubTab('CONCEPTUAL_SIMULATORS')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeSubTab === 'CONCEPTUAL_SIMULATORS'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" /> Simuladores Conceptuales
            </button>
          </div>
        </div>

        {/* 1. PRIMARY SUBTAB: AIR QUALITY MODELING SYSTEM */}
        {activeSubTab === 'AIR_QUALITY_MODELING' && (
          <AirQualityModelingModule />
        )}

        {/* 2. SECONDARY SUBTAB: CONCEPTUAL PEDAGOGICAL SIMULATORS */}
        {activeSubTab === 'CONCEPTUAL_SIMULATORS' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* MODEL TABS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => setSelectedConceptual('dispersion')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  selectedConceptual === 'dispersion'
                    ? 'bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-950/40'
                    : 'bg-slate-900/50 border-slate-800 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                    <Wind className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-indigo-300 font-bold bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">
                    FÍSICA GAUSSIANA
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">Dispersión Atmosférica</h3>
                <p className="text-xs text-slate-400">
                  Comportamiento ilustrativo de pluma de contaminantes (PM2.5, SO2) desde fuentes puntuales.
                </p>
              </div>

              <div
                onClick={() => setSelectedConceptual('ruido')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  selectedConceptual === 'ruido'
                    ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-950/40'
                    : 'bg-slate-900/50 border-slate-800 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                    ISO 9613-2
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">Propagación Acústica</h3>
                <p className="text-xs text-slate-400">
                  Atenuación geométrica de sonido por distancia, topografía y pantallas acústicas.
                </p>
              </div>

              <div
                onClick={() => setSelectedConceptual('microclima')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  selectedConceptual === 'microclima'
                    ? 'bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-950/40'
                    : 'bg-slate-900/50 border-slate-800 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Thermometer className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                    ISLAS DE CALOR
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">Microclima & Cobertura</h3>
                <p className="text-xs text-slate-400">
                  Impacto del asfalto, densidad de edificación y mitigación por arborización urbana.
                </p>
              </div>
            </div>

            {/* INTERACTIVE MODEL PLAYGROUND */}
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
                <div>
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    Simulador Conceptual Rápido
                  </span>
                  <h4 className="text-lg font-bold text-white">
                    Sensibilidad de Parámetros de Pluma Gaussiana
                  </h4>
                </div>
                <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 font-mono">
                  Q={emissionRate} g/s | u={windSpeed} m/s | H={stackHeight} m
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* PARAMETER SLIDERS */}
                <div className="lg:col-span-6 space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">Tasa de emisión de la chimenea (Q):</span>
                      <span className="font-mono font-bold text-indigo-400">{emissionRate} g/s</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="150"
                      value={emissionRate}
                      onChange={(e) => setEmissionRate(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">Velocidad del viento predominante (u):</span>
                      <span className="font-mono font-bold text-teal-400">{windSpeed} m/s</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="12"
                      step="0.5"
                      value={windSpeed}
                      onChange={(e) => setWindSpeed(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">Altura efectiva de chimenea (H):</span>
                      <span className="font-mono font-bold text-cyan-400">{stackHeight} metros</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="80"
                      value={stackHeight}
                      onChange={(e) => setStackHeight(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">Distancia al receptor / zona urbana (x):</span>
                      <span className="font-mono font-bold text-emerald-400">{distance} metros</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="2000"
                      step="50"
                      value={distance}
                      onChange={(e) => setDistance(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>

                {/* DYNAMIC VISUALIZATION CANVAS */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-bold uppercase">Resultado Proyectado en Receptor:</span>
                      <span className="text-[10px] text-indigo-400 font-mono">Fórmula Analítica Directa</span>
                    </div>

                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-slate-400">Concentración calculada a {distance} m</div>
                        <div className="text-3xl font-extrabold text-white font-mono mt-1">
                          {estimatedConcentration} <span className="text-sm font-normal text-slate-400">µg/m³</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                          estimatedConcentration > 50 
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {estimatedConcentration > 50 ? 'Excede Umbral Referencial' : 'Bajo Umbral'}
                        </span>
                      </div>
                    </div>

                    <div className="h-28 bg-slate-900/90 rounded-xl border border-slate-800 relative overflow-hidden flex items-center px-4">
                      <div className="w-4 bg-slate-600 rounded-t-md relative flex flex-col justify-end" style={{ height: `${Math.min(stackHeight + 20, 80)}px` }}>
                        <div className="w-full h-1 bg-amber-400 animate-pulse" />
                      </div>

                      <div
                        className="flex-1 h-12 ml-2 rounded-r-full blur-md opacity-70 transition-all duration-300"
                        style={{
                          background: `linear-gradient(to right, rgba(239, 68, 68, ${Math.min(emissionRate / 100, 0.9)}), rgba(245, 158, 11, 0.5), transparent)`,
                          transform: `scaleY(${Math.max(1, distance / 400)})`,
                        }}
                      />

                      <div className="absolute right-6 bottom-2 flex flex-col items-center">
                        <span className="text-[10px] font-mono text-emerald-400">Receptor</span>
                        <div className="w-2 h-4 bg-emerald-500 rounded" />
                      </div>
                    </div>

                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-300">
                      <strong>Nota regulatoria:</strong> Esta aproximación es meramente didáctica y conceptual. Los estudios de impacto ambiental formales deben evaluarse con el <strong>Módulo Regulatorio de Calidad del Aire</strong> conforme a los lineamientos EPA / MINAM.
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
