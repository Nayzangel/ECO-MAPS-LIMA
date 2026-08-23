import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, Wind, Volume2, ShieldCheck, Factory } from 'lucide-react';
import { LayerVisibilityState } from '../../types/gis';

interface MapLegendPanelProps {
  layers: LayerVisibilityState;
  className?: string;
}

export const MapLegendPanel: React.FC<MapLegendPanelProps> = ({
  layers,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`z-20 transition-all ${className}`}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 hover:border-emerald-500 rounded-xl text-xs font-bold text-white shadow-lg cursor-pointer"
        >
          <Info className="w-3.5 h-3.5 text-teal-400" />
          <span>Leyenda</span>
          <ChevronUp className="w-3 h-3 text-slate-400" />
        </button>
      ) : (
        <div className="w-64 sm:w-72 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-3.5 space-y-3 max-h-[60vh] overflow-y-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5">
              <Info className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                Leyenda de Capas
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 1. Calidad del Aire (Índice INCA) */}
          {layers.airQuality && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-emerald-400" />
                <span>Índice INCA (PM2.5 / PM10)</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <div className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-lg border border-emerald-500/20">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  <span className="text-slate-300">Bueno (&le; 25 µg)</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-lg border border-amber-500/20">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0" />
                  <span className="text-slate-300">Moderado (&le; 50 µg)</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-lg border border-orange-500/20">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 flex-shrink-0" />
                  <span className="text-slate-300">Malo (&le; 75 µg)</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-lg border border-rose-500/20">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0" />
                  <span className="text-slate-300">Cuidado (&gt; 75 µg)</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. Ruido Acústico */}
          {layers.noise && (
            <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
              <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Niveles de Ruido (dBA)</span>
              </div>
              <div className="space-y-1 text-[10px]">
                <div className="flex items-center justify-between text-slate-300 bg-slate-950/60 px-2 py-1 rounded">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded bg-emerald-400" /> Confort / Tranquilo
                  </span>
                  <span className="font-mono text-emerald-400">&lt; 55 dBA</span>
                </div>
                <div className="flex items-center justify-between text-slate-300 bg-slate-950/60 px-2 py-1 rounded">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded bg-amber-400" /> Residencial / Diurno
                  </span>
                  <span className="font-mono text-amber-400">55 - 65 dBA</span>
                </div>
                <div className="flex items-center justify-between text-slate-300 bg-slate-950/60 px-2 py-1 rounded">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded bg-rose-500" /> Cañón Vial / Industrial
                  </span>
                  <span className="font-mono text-rose-400">&gt; 75 dBA</span>
                </div>
              </div>
            </div>
          )}

          {/* 3. Zonificación y Fuentes */}
          {layers.environmentalSources && (
            <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
              <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Factory className="w-3.5 h-3.5 text-rose-400" />
                <span>Fuentes Ambientales</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400">
                <span className="flex items-center gap-1">🏭 Refinerías/Fábricas</span>
                <span className="flex items-center gap-1">🚢 Terminales Puerto</span>
                <span className="flex items-center gap-1">✈️ Aeropuerto</span>
                <span className="flex items-center gap-1">🗑️ Rellenos Huaycoloro</span>
              </div>
            </div>
          )}

          {/* 4. Normativa Ref */}
          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[9px] text-slate-500 font-mono">
            <span>D.S. 003-2017-MINAM</span>
            <span>D.S. 085-2003-PCM</span>
          </div>

        </div>
      )}
    </div>
  );
};
