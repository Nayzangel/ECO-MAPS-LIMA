import React, { useState } from 'react';
import { 
  ArrowRight, 
  Map, 
  Activity, 
  ShieldAlert, 
  Wind, 
  Volume2, 
  Sparkles, 
  Compass, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  Info,
  Sliders
} from 'lucide-react';
import { LIMA_STATIONS_DEMO } from '../../data/demoData';
import { ViewMode } from '../../types';

interface HeroSectionProps {
  viewMode: ViewMode;
  onOpenMap: () => void;
  onOpenAnalysis: () => void;
  onSelectStation: (stationId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  viewMode,
  onOpenMap,
  onOpenAnalysis,
  onSelectStation
}) => {
  const [selectedQuickDistrict, setSelectedQuickDistrict] = useState(LIMA_STATIONS_DEMO[0]);

  return (
    <section id="hero" className="relative pt-8 pb-20 overflow-hidden border-b border-slate-800/60">
      {/* Background ambient gradient blurs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-32 right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP DEMO BADGE & PIPELINE TICKER */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>PILOTO LIMA METROPOLITANA</span>
            <span className="text-slate-500">|</span>
            <span className="text-amber-400 font-mono">ENTORNO DEMO & SIMULACIÓN</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-emerald-400 font-bold">DATOS</span>
            <span>→</span>
            <span className="text-teal-400 font-bold">ANÁLISIS</span>
            <span>→</span>
            <span className="text-cyan-400 font-bold">NORMATIVA</span>
            <span>→</span>
            <span className="text-blue-400 font-bold">DECISIÓN</span>
            <span>→</span>
            <span className="text-indigo-400 font-bold">INFORME</span>
          </div>
        </div>

        {/* MAIN HERO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: Project Presentation & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400">
                <Sparkles className="w-4 h-4" />
                Motor de Inteligencia & Gestión Territorial
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
                De datos ambientales a <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">decisiones con rigor normativo</span> en Lima.
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
                ECO-MAP no es sólo un visor cartográfico. Es un motor de decisión que audita en tiempo real la 
                calidad del aire (ECA MINAM D.S. 003-2017), el ruido acústico (ECA PCM D.S. 085-2003) y la zonificación, 
                generando diagnósticos y planes de mitigación prioritarios.
              </p>
            </div>

            {/* KEY VALUE PILLARS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
                  <Wind className="w-4 h-4" /> Aire & INCA
                </div>
                <p className="text-[11px] text-slate-400">PM2.5, PM10, SO2, NO2 contrastado con D.S. 003-2017.</p>
              </div>

              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-1">
                  <Volume2 className="w-4 h-4" /> Ruido por Zonas
                </div>
                <p className="text-[11px] text-slate-400">Límites diurnos/nocturnos en Residencial, Comercial e Industrial.</p>
              </div>

              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-1">
                  <Activity className="w-4 h-4" /> Motor Decisional
                </div>
                <p className="text-[11px] text-slate-400">Priorización territorial y recomendaciones técnicas directas.</p>
              </div>
            </div>

            {/* ACTION BUTTONS: "Explorar ECO-MAP" & "Iniciar análisis" */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                onClick={onOpenMap}
                className="px-6 py-3.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 rounded-xl shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
              >
                <Map className="w-4 h-4 text-slate-950 group-hover:rotate-6 transition-transform" />
                Explorar ECO-MAP
                <ChevronRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenAnalysis}
                className="px-6 py-3.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/90 hover:border-emerald-500/50 rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-md"
              >
                <Sliders className="w-4 h-4 text-emerald-400" />
                Iniciar Análisis
              </button>

              <a
                href="#como-funciona"
                className="px-4 py-3.5 text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                Ver metodología
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Transparency Note */}
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
              <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>Esta versión 1.0 utiliza fuentes estructuradas y simulaciones DEMO para fines demostrativos y de diseño.</span>
            </p>
          </div>

          {/* RIGHT: Interactive Live Station Quick Card */}
          <div className="lg:col-span-5">
            <div className="relative glass-card rounded-2xl p-6 border border-slate-700/70 shadow-2xl space-y-5">
              
              {/* Header of Quick Preview Card */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Monitor Territorial en Vivo
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                  DEMO DATA
                </span>
              </div>

              {/* District Dropdown Switcher */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">Seleccionar punto de Lima:</label>
                <select
                  value={selectedQuickDistrict.id}
                  onChange={(e) => {
                    const found = LIMA_STATIONS_DEMO.find(s => s.id === e.target.value);
                    if (found) setSelectedQuickDistrict(found);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-medium focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  {LIMA_STATIONS_DEMO.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.district} - {st.name} ({st.zoneType})
                    </option>
                  ))}
                </select>
              </div>

              {/* Station Indicators in Card */}
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <Wind className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400">Material Particulado PM2.5</div>
                      <div className="text-base font-extrabold text-white font-mono">
                        {selectedQuickDistrict.pm25} <span className="text-xs font-normal text-slate-400">µg/m³</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                      selectedQuickDistrict.pm25 > 50 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {selectedQuickDistrict.pm25 > 50 ? 'Supera ECA (50)' : 'Cumple ECA'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400">Presión Sonora Diurna</div>
                      <div className="text-base font-extrabold text-white font-mono">
                        {selectedQuickDistrict.noiseDay} <span className="text-xs font-normal text-slate-400">dBA</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-semibold text-slate-300 bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
                      Zona {selectedQuickDistrict.zoneType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Diagnosis Box */}
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Diagnóstico Rápido:
                </div>
                <p className="text-xs text-slate-300 leading-snug">
                  {selectedQuickDistrict.primaryIssue}
                </p>
              </div>

              {/* Action Inside Card */}
              <button
                onClick={() => {
                  onSelectStation(selectedQuickDistrict.id);
                  onOpenMap();
                }}
                className="w-full py-2.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-600/30 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                Auditar punto completo en el mapa GIS
              </button>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
