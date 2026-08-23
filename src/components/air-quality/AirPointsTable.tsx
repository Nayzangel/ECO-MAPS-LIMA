import React, { useState, useMemo } from 'react';
import { AirMeasurementRecord, AirParameterKey, DataSourceType } from '../../types/airQuality';
import { PERUVIAN_AIR_NORMATIVE, calculateIncaIndex } from '../../utils/airQualityNormative';
import { 
  Search, 
  Filter, 
  Download, 
  MapPin, 
  Sparkles, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Wind, 
  Building2,
  SlidersHorizontal,
  FileSpreadsheet
} from 'lucide-react';

interface AirPointsTableProps {
  stations: AirMeasurementRecord[];
  selectedStationId: string;
  onSelectStation: (stationId: string) => void;
  onDeleteUserStation?: (stationId: string) => void;
  onOpenDecisionEngineForStation?: (station: AirMeasurementRecord) => void;
}

export const AirPointsTable: React.FC<AirPointsTableProps> = ({
  stations,
  selectedStationId,
  onSelectStation,
  onDeleteUserStation,
  onOpenDecisionEngineForStation
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParamFilter, setSelectedParamFilter] = useState<string>('ALL');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  // Filtered stations
  const filteredStations = useMemo(() => {
    return stations.filter((st) => {
      const matchesSearch = 
        st.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesParam = selectedParamFilter === 'ALL' || st.parameter === selectedParamFilter;

      const matchesSource = 
        selectedSourceFilter === 'ALL' ||
        (selectedSourceFilter === 'OFFICIAL' && !st.isUserAdded) ||
        (selectedSourceFilter === 'USER' && st.isUserAdded);

      const meta = PERUVIAN_AIR_NORMATIVE[st.parameter] || PERUVIAN_AIR_NORMATIVE.PM2_5;
      const isExceeded = st.concentration > meta.ecaLimit;

      const matchesStatus = 
        selectedStatusFilter === 'ALL' ||
        (selectedStatusFilter === 'EXCEEDED' && isExceeded) ||
        (selectedStatusFilter === 'COMPLIANT' && !isExceeded);

      return matchesSearch && matchesParam && matchesSource && matchesStatus;
    });
  }, [stations, searchTerm, selectedParamFilter, selectedSourceFilter, selectedStatusFilter]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Estacion', 'Distrito', 'Direccion', 'Latitud', 'Longitud', 'Parametro', 'Concentracion', 'Unidad', 'ECA_Limite', 'Excede_ECA', 'INCA', 'Fecha', 'Hora', 'Fuente', 'Equipo', 'Viento_ms', 'Dir_Viento', 'Temp_C', 'Humedad_Pct'];
    
    const rows = filteredStations.map(st => {
      const meta = PERUVIAN_AIR_NORMATIVE[st.parameter] || PERUVIAN_AIR_NORMATIVE.PM2_5;
      const inca = calculateIncaIndex(st.parameter, st.concentration);
      const isExceeded = st.concentration > meta.ecaLimit ? 'SI' : 'NO';

      return [
        st.id,
        `"${st.title}"`,
        `"${st.district}"`,
        `"${st.address}"`,
        st.coordinates[0],
        st.coordinates[1],
        st.parameter,
        st.concentration,
        st.unit,
        meta.ecaLimit,
        isExceeded,
        inca.category,
        st.date,
        st.time,
        `"${st.sourceName}"`,
        `"${st.equipment}"`,
        st.meteorology.windSpeed,
        st.meteorology.windDirectionCardinal,
        st.meteorology.temperature,
        st.meteorology.humidity
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ecomap_calidad_aire_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
      
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h4 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider">
            Registro Integral de Puntos & Estaciones de Calidad del Aire
          </h4>
          <p className="text-[11px] text-slate-400">
            Mostrando {filteredStations.length} de {stations.length} puntos monitoreados
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-700 transition-all self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Exportar Tabla (CSV)</span>
        </button>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
        
        {/* Search Input */}
        <div className="sm:col-span-4 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por distrito, estación o dirección..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
          />
        </div>

        {/* Param Filter */}
        <div className="sm:col-span-3">
          <select
            value={selectedParamFilter}
            onChange={(e) => setSelectedParamFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-emerald-400"
          >
            <option value="ALL">Todos los Parámetros</option>
            {Object.values(PERUVIAN_AIR_NORMATIVE).map(p => (
              <option key={p.key} value={p.key}>{p.code} - {p.name}</option>
            ))}
          </select>
        </div>

        {/* Source Filter */}
        <div className="sm:col-span-3">
          <select
            value={selectedSourceFilter}
            onChange={(e) => setSelectedSourceFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-emerald-400"
          >
            <option value="ALL">Todas las Fuentes</option>
            <option value="OFFICIAL">Red Oficial (SENAMHI / OEFA / MML)</option>
            <option value="USER">Monitoreos Propios / Usuario</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-2">
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-emerald-400"
          >
            <option value="ALL">Todo Estado</option>
            <option value="EXCEEDED">⚠️ Supera ECA</option>
            <option value="COMPLIANT">✓ Cumple ECA</option>
          </select>
        </div>

      </div>

      {/* TABLE */}
      <div className="overflow-x-auto custom-scrollbar border border-slate-800 rounded-2xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800 tracking-wider">
            <tr>
              <th className="py-3 px-3.5">Punto / Estación</th>
              <th className="py-3 px-3">Distrito</th>
              <th className="py-3 px-3">Parámetro</th>
              <th className="py-3 px-3">Concentración</th>
              <th className="py-3 px-3">ECA Norma</th>
              <th className="py-3 px-3">Estado INCA</th>
              <th className="py-3 px-3">Meteorología</th>
              <th className="py-3 px-3">Fuente</th>
              <th className="py-3 px-3.5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {filteredStations.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-500">
                  No se encontraron puntos de monitoreo con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              filteredStations.map((st) => {
                const meta = PERUVIAN_AIR_NORMATIVE[st.parameter] || PERUVIAN_AIR_NORMATIVE.PM2_5;
                const inca = calculateIncaIndex(st.parameter, st.concentration);
                const isExceeded = st.concentration > meta.ecaLimit;
                const isSelected = st.id === selectedStationId;

                return (
                  <tr
                    key={st.id}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-950/40 hover:bg-emerald-950/50'
                        : 'hover:bg-slate-800/40 bg-slate-950/30'
                    }`}
                    onClick={() => onSelectStation(st.id)}
                  >
                    {/* Estacion */}
                    <td className="py-3 px-3.5">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{st.title}</span>
                        {st.isUserAdded && (
                          <span className="px-1.5 py-0.2 rounded bg-indigo-950 border border-indigo-500/30 text-indigo-300 text-[9px] font-mono">
                            Usuario
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 truncate max-w-[180px] block">
                        {st.address}
                      </span>
                    </td>

                    {/* Distrito */}
                    <td className="py-3 px-3 font-semibold text-slate-300">
                      {st.district}
                    </td>

                    {/* Parámetro */}
                    <td className="py-3 px-3 font-mono font-bold text-teal-300">
                      {meta.code}
                    </td>

                    {/* Concentración */}
                    <td className="py-3 px-3">
                      <span className="font-mono font-extrabold text-sm text-white">
                        {st.concentration}{' '}
                        <span className="text-[10px] font-normal text-slate-400">{st.unit}</span>
                      </span>
                    </td>

                    {/* ECA Norma */}
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-300">
                      {meta.ecaLimit} {meta.unit}
                    </td>

                    {/* INCA Badge */}
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold border ${inca.bgClass} ${inca.borderClass} ${inca.textClass}`}>
                        {inca.category}
                      </span>
                    </td>

                    {/* Meteorología */}
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-300">
                      <div>{st.meteorology.windSpeed} m/s ({st.meteorology.windDirectionCardinal})</div>
                      <div className="text-slate-500">{st.meteorology.temperature}°C • {st.meteorology.humidity}% HR</div>
                    </td>

                    {/* Fuente */}
                    <td className="py-3 px-3 text-[10px] text-slate-400 truncate max-w-[120px]">
                      {st.sourceName}
                    </td>

                    {/* Acciones */}
                    <td className="py-3 px-3.5 text-right space-x-1 whitespace-nowrap">
                      {onOpenDecisionEngineForStation && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenDecisionEngineForStation(st);
                          }}
                          className="px-2 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition-all"
                          title="Auditar en Motor de Decisión"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Auditar</span>
                        </button>
                      )}

                      {st.isUserAdded && onDeleteUserStation && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteUserStation(st.id);
                          }}
                          className="p-1 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-500/40 text-rose-300 inline-flex items-center cursor-pointer transition-all"
                          title="Eliminar Medición"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
