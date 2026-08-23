import React from 'react';
import { Bookmark, X, Trash2, Download, MapPin, Eye, Plus, Sparkles } from 'lucide-react';
import { CustomUserPoint } from '../../types/gis';

interface CustomPointsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  points: CustomUserPoint[];
  onSelectPoint: (point: CustomUserPoint) => void;
  onDeletePoint: (pointId: string) => void;
  onClearAllPoints: () => void;
  onExportGeoJSON: () => void;
  onExportCSV: () => void;
}

export const CustomPointsDrawer: React.FC<CustomPointsDrawerProps> = ({
  isOpen,
  onClose,
  points,
  onSelectPoint,
  onDeletePoint,
  onClearAllPoints,
  onExportGeoJSON,
  onExportCSV
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-slate-900/95 backdrop-blur-2xl border-l border-slate-700/80 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      
      {/* Header */}
      <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Bookmark className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white">Puntos de Monitoreo Guardados</h3>
            <p className="text-[10px] text-slate-400 font-mono">{points.length} puntos colocados por el usuario</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Point List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {points.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
              <MapPin className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Aún no has colocado puntos en el mapa. Utiliza la herramienta de <strong>Colocar Puntos</strong> en la barra flotante.
            </p>
          </div>
        ) : (
          points.map((point) => (
            <div
              key={point.id}
              className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2 hover:border-emerald-500/40 transition-colors group"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {point.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                    <span className="bg-slate-900 px-2 py-0.5 rounded text-slate-300 font-mono">
                      {point.category}
                    </span>
                    <span>{point.zoneType}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onSelectPoint(point)}
                    title="Ver en el mapa"
                    className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-950/40"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeletePoint(point.id)}
                    title="Eliminar punto"
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Coordinates & Estimation */}
              <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Lat: {point.coordinates[0].toFixed(4)}, Lng: {point.coordinates[1].toFixed(4)}</span>
                {point.pm25Estimated && (
                  <span className="text-emerald-400 font-bold">PM2.5: {point.pm25Estimated} µg</span>
                )}
              </div>

              {point.notes && (
                <p className="text-[11px] text-slate-400 bg-slate-900/80 p-2 rounded-xl italic">
                  "{point.notes}"
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer / Export Actions */}
      {points.length > 0 && (
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={onExportGeoJSON}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl flex items-center justify-center gap-1.5 font-semibold"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              GeoJSON
            </button>
            <button
              onClick={onExportCSV}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl flex items-center justify-center gap-1.5 font-semibold"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              CSV
            </button>
          </div>

          <button
            onClick={onClearAllPoints}
            className="w-full py-2 text-[11px] text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl transition-colors font-medium flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Eliminar todos los puntos
          </button>
        </div>
      )}

    </div>
  );
};
