import React from 'react';
import { Filter, X, Check, RotateCcw, AlertTriangle, ShieldCheck, Building2 } from 'lucide-react';
import { MapFilterOptions } from '../../types/gis';
import { RiskLevel, ZoneType } from '../../types';

interface MapFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: MapFilterOptions;
  onChangeFilters: (filters: MapFilterOptions) => void;
  onResetFilters: () => void;
  districtsList: string[];
}

export const MapFilterModal: React.FC<MapFilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onChangeFilters,
  onResetFilters,
  districtsList
}) => {
  if (!isOpen) return null;

  const isFiltered =
    filters.riskLevel !== 'all' ||
    filters.district !== 'all' ||
    filters.zoneType !== 'all' ||
    filters.onlyExceedingEca;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Filtros Cartográficos</h3>
              <p className="text-[11px] text-slate-400">Filtrar estaciones, fuentes y zonas de Lima</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh] text-xs">
          
          {/* Nivel de Riesgo */}
          <div className="space-y-2">
            <label className="font-bold text-slate-200 block uppercase tracking-wider text-[11px]">
              Nivel de Riesgo Ambiental:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'all', label: 'Todos los niveles' },
                { id: 'Optimo', label: 'Óptimo (Bueno)' },
                { id: 'Moderado', label: 'Moderado' },
                { id: 'Alerta', label: 'Alerta / Cuidado' },
                { id: 'Critico', label: 'Crítico (Hotspot)' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onChangeFilters({ ...filters, riskLevel: item.id as any })}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    filters.riskLevel === item.id
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Distrito */}
          <div className="space-y-2">
            <label className="font-bold text-slate-200 block uppercase tracking-wider text-[11px]">
              Distrito Específico:
            </label>
            <select
              value={filters.district}
              onChange={(e) => onChangeFilters({ ...filters, district: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-400"
            >
              <option value="all">Todos los distritos de Lima y Callao</option>
              {districtsList.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Zonificación Municipal */}
          <div className="space-y-2">
            <label className="font-bold text-slate-200 block uppercase tracking-wider text-[11px]">
              Zonificación:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'all', label: 'Todas las Zonas' },
                { id: 'Residencial', label: 'Residencial' },
                { id: 'Comercial', label: 'Comercial' },
                { id: 'Industrial', label: 'Industrial' },
                { id: 'ProteccionEspecial', label: 'Protección Especial' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onChangeFilters({ ...filters, zoneType: item.id as any })}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    filters.zoneType === item.id
                      ? 'bg-teal-950/60 border-teal-500 text-teal-300 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Solo que superen ECA */}
          <div className="pt-2 border-t border-slate-800">
            <label
              onClick={() => onChangeFilters({ ...filters, onlyExceedingEca: !filters.onlyExceedingEca })}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.onlyExceedingEca}
                onChange={() => {}}
                className="w-4 h-4 text-emerald-500 rounded accent-emerald-500"
              />
              <div>
                <span className="text-xs font-bold text-white block">
                  Mostrar solo puntos que superan ECA
                </span>
                <span className="text-[10px] text-slate-400">
                  D.S. 003-2017-MINAM (Aire) o D.S. 085-2003-PCM (Ruido)
                </span>
              </div>
            </label>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onResetFilters}
            disabled={!isFiltered}
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400 hover:text-white disabled:opacity-40 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restablecer
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl shadow-md cursor-pointer"
          >
            Aplicar Filtros
          </button>
        </div>

      </div>
    </div>
  );
};
