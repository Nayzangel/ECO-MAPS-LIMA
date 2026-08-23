import React from 'react';
import { 
  Map as MapIcon, 
  Layers, 
  Search, 
  Ruler, 
  MapPinPlus, 
  Compass, 
  Sparkles, 
  ShieldCheck,
  Maximize2
} from 'lucide-react';
import { EcoMapLeaflet } from '../map/EcoMapLeaflet';
import { StationData, ViewMode } from '../../types';

interface MapSectionProps {
  onOpenAnalysisWithStation: (station: StationData) => void;
  viewMode: ViewMode;
  onOpenFullMapModal: () => void;
}

export const MapSection: React.FC<MapSectionProps> = ({
  onOpenAnalysisWithStation,
  viewMode,
  onOpenFullMapModal
}) => {
  return (
    <section id="mapa" className="py-16 bg-slate-950 border-b border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <MapIcon className="w-3.5 h-3.5" />
              Visor Cartográfico Interactivo GIS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Mapa Interactivo de <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">ECO-MAP LIMA</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Explore los 43 distritos de Lima Metropolitana y el Callao. Busque calles, coloque puntos de monitoreo, 
              mida distancias y áreas territoriales, y active capas dinámicas de calidad del aire, ruido acústico, 
              red vial y focos industriales.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenFullMapModal}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Maximize2 className="w-4 h-4 text-emerald-400" />
              <span>Expandir Visor Completo</span>
            </button>
          </div>
        </div>

        {/* QUICK FEATURES PILLS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-[11px]">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-slate-300">
            <Search className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="truncate">Buscador de Calles & Distritos</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-slate-300">
            <Layers className="w-4 h-4 text-teal-400 flex-shrink-0" />
            <span className="truncate">7 Capas Ambientales</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-slate-300">
            <MapPinPlus className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span className="truncate">Colocar & Guardar Puntos</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-slate-300">
            <Ruler className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span className="truncate">Medir Distancias & Áreas</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-slate-300">
            <Compass className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="truncate">Coordenadas WGS84 / UTM</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="truncate">Licencia Open GIS Data</span>
          </div>
        </div>

        {/* INTERACTIVE MAP CONTAINER */}
        <div className="w-full h-[650px] sm:h-[720px] rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden relative glow-emerald">
          <EcoMapLeaflet
            onLaunchDecisionEngine={onOpenAnalysisWithStation}
            viewMode={viewMode}
            isModal={false}
          />
        </div>

      </div>
    </section>
  );
};
