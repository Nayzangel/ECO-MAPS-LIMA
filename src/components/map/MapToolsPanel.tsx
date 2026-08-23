import React from 'react';
import { 
  Hand, 
  MapPinPlus, 
  Ruler, 
  Pentagon, 
  RotateCcw, 
  Plus, 
  Minus, 
  Crosshair, 
  Maximize2, 
  Minimize2,
  Trash2,
  Bookmark
} from 'lucide-react';
import { ActiveMapTool } from '../../types/gis';

interface MapToolsPanelProps {
  activeTool: ActiveMapTool;
  onSelectTool: (tool: ActiveMapTool) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onClearMeasurements: () => void;
  hasMeasurements: boolean;
  customPointsCount: number;
  onOpenPointsDrawer: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  className?: string;
}

export const MapToolsPanel: React.FC<MapToolsPanelProps> = ({
  activeTool,
  onSelectTool,
  onZoomIn,
  onZoomOut,
  onResetView,
  onClearMeasurements,
  hasMeasurements,
  customPointsCount,
  onOpenPointsDrawer,
  isFullscreen,
  onToggleFullscreen,
  className = ''
}) => {
  return (
    <div className={`flex flex-col gap-2 z-30 ${className}`}>
      
      {/* TOOLBAR GROUP: INTERACTIVE TOOLS */}
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-1.5 shadow-2xl flex flex-col gap-1 text-xs">
        
        {/* Navegar */}
        <button
          onClick={() => onSelectTool('navigate')}
          title="Modo Navegación (Moverse y explorar)"
          className={`p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
            activeTool === 'navigate'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Hand className="w-4 h-4" />
        </button>

        {/* Colocar Punto */}
        <button
          onClick={() => onSelectTool('add_point')}
          title="Colocar Punto de Monitoreo / Denuncia en el mapa"
          className={`p-2.5 rounded-xl transition-all relative flex items-center justify-center cursor-pointer ${
            activeTool === 'add_point'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <MapPinPlus className="w-4 h-4" />
          {customPointsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 text-slate-950 text-[9px] font-bold rounded-full flex items-center justify-center">
              {customPointsCount}
            </span>
          )}
        </button>

        {/* Medir Distancia */}
        <button
          onClick={() => onSelectTool('measure_distance')}
          title="Medir Distancias (Haga clic en varios puntos para calcular longitud)"
          className={`p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
            activeTool === 'measure_distance'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Ruler className="w-4 h-4" />
        </button>

        {/* Medir Área */}
        <button
          onClick={() => onSelectTool('measure_area')}
          title="Medir Área y Perímetro (Haga clic en 3 o más puntos para calcular polígono)"
          className={`p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
            activeTool === 'measure_area'
              ? 'bg-indigo-500 text-slate-950 font-bold shadow-lg shadow-indigo-500/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Pentagon className="w-4 h-4" />
        </button>

        {/* Limpiar mediciones activas si existen */}
        {hasMeasurements && (
          <button
            onClick={onClearMeasurements}
            title="Limpiar líneas y polígonos de medición"
            className="p-2.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-all flex items-center justify-center"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        {/* Ver Lista de Puntos guardados */}
        {customPointsCount > 0 && (
          <button
            onClick={onOpenPointsDrawer}
            title={`Ver lista de ${customPointsCount} puntos creados`}
            className="p-2.5 rounded-xl text-teal-400 hover:text-teal-300 hover:bg-slate-800 transition-all flex items-center justify-center border-t border-slate-800 mt-1"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        )}

      </div>

      {/* NAVIGATION CONTROLS (ZOOM & RESET) */}
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-1.5 shadow-2xl flex flex-col gap-1">
        
        {/* Zoom In */}
        <button
          onClick={onZoomIn}
          title="Acercar mapa (Zoom In)"
          className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={onZoomOut}
          title="Alejar mapa (Zoom Out)"
          className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center"
        >
          <Minus className="w-4 h-4" />
        </button>

        {/* Centrar en Lima Metropolitana */}
        <button
          onClick={onResetView}
          title="Centrar en Lima Metropolitana"
          className="p-2.5 rounded-xl text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 transition-all flex items-center justify-center"
        >
          <Crosshair className="w-4 h-4" />
        </button>

        {/* Pantalla Completa */}
        <button
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Salir de pantalla completa' : 'Ver en pantalla completa'}
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

      </div>

    </div>
  );
};
