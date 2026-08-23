import React, { useState } from 'react';
import { MeteorologicalRecord } from '../../types/meteorology';
import { 
  Search, 
  Download, 
  Plus, 
  MapPin, 
  Wind, 
  Thermometer, 
  Droplets, 
  Sun, 
  Layers, 
  Filter,
  CheckCircle2
} from 'lucide-react';

interface MeteorologyTableProps {
  records: MeteorologicalRecord[];
  onSelectStation: (record: MeteorologicalRecord) => void;
  onOpenInputModal: () => void;
}

export const MeteorologyTable: React.FC<MeteorologyTableProps> = ({
  records,
  onSelectStation,
  onOpenInputModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ALL');

  const districts = Array.from(new Set(records.map(r => r.district))).sort();

  const filteredRecords = records.filter(r => {
    const matchesSearch = 
      r.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.sourceAuthority.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDistrict = districtFilter === 'ALL' || r.district === districtFilter;

    return matchesSearch && matchesDistrict;
  });

  const exportToCsv = () => {
    const headers = [
      'ID', 'Estacion', 'Distrito', 'Latitud', 'Longitud', 'Elevacion_msnm',
      'Fecha', 'Hora', 'Temp_C', 'HR_Porc', 'Presion_hPa', 'VelViento_ms',
      'DirViento_Deg', 'DirViento_Card', 'Precip_mm', 'RadSolar_Wm2',
      'Nubosidad_Octas', 'Pasquill_Clase', 'CapaMezcla_m', 'Inversion_Termica',
      'PuntoRocio_C', 'Autoridad'
    ];

    const rows = filteredRecords.map(r => [
      r.id,
      `"${r.stationName}"`,
      `"${r.district}"`,
      r.coordinates[0],
      r.coordinates[1],
      r.elevationMeters,
      r.date,
      r.time,
      r.temperature,
      r.relativeHumidity,
      r.atmosphericPressure,
      r.windSpeed,
      r.windDirectionDegrees,
      r.windDirectionCardinal,
      r.precipitation,
      r.solarRadiation,
      r.cloudCoverOctas,
      r.pasquillClass,
      r.mixingHeightMeters,
      r.thermalInversionPresent ? 'SI' : 'NO',
      r.dewPointCelsius,
      r.sourceAuthority
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Registros_Meteorologicos_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden">
      
      {/* TOOLBAR */}
      <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/60">
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* SEARCH INPUT */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar estación, distrito..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* DISTRICT FILTER */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="ALL">Todos los distritos ({districts.length})</option>
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ACTIONS: ADD & EXPORT */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={exportToCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5" /> Exportar CSV
          </button>
          <button
            onClick={onOpenInputModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/20 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Ingresar Datos
          </button>
        </div>

      </div>

      {/* DATA TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Estación / Localidad</th>
              <th className="py-3 px-3">Temp (°C)</th>
              <th className="py-3 px-3">HR (%)</th>
              <th className="py-3 px-3">Presión (hPa)</th>
              <th className="py-3 px-3">Viento (m/s / Dir)</th>
              <th className="py-3 px-3">Rad. Solar (W/m²)</th>
              <th className="py-3 px-3">Estabilidad Pasquill</th>
              <th className="py-3 px-3">Capa Mezcla</th>
              <th className="py-3 px-3">Inversión</th>
              <th className="py-3 px-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
            {filteredRecords.map((rec) => (
              <tr
                key={rec.id}
                onClick={() => onSelectStation(rec)}
                className="hover:bg-slate-800/50 cursor-pointer transition"
              >
                <td className="py-3 px-4 font-sans font-medium text-white">
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        {rec.stationName}
                        {rec.isUserAdded && (
                          <span className="text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-1 py-0.2 rounded">
                            USUARIO
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {rec.district} • {rec.date} {rec.time}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-3 text-rose-400 font-bold">
                  {rec.temperature} °C
                </td>

                <td className="py-3 px-3 text-blue-400">
                  {rec.relativeHumidity}%
                </td>

                <td className="py-3 px-3 text-slate-300">
                  {rec.atmosphericPressure}
                </td>

                <td className="py-3 px-3 text-teal-400 font-bold">
                  {rec.windSpeed} m/s <span className="text-amber-400">({rec.windDirectionCardinal})</span>
                </td>

                <td className="py-3 px-3 text-amber-400">
                  {rec.solarRadiation}
                </td>

                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    Clase {rec.pasquillClass}
                  </span>
                </td>

                <td className="py-3 px-3 text-purple-400">
                  {rec.mixingHeightMeters} m
                </td>

                <td className="py-3 px-3">
                  {rec.thermalInversionPresent ? (
                    <span className="text-amber-400 font-semibold">Sí ({rec.inversionBaseHeightMeters}m)</span>
                  ) : (
                    <span className="text-slate-500">No</span>
                  )}
                </td>

                <td className="py-3 px-4 text-right font-sans">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectStation(rec);
                    }}
                    className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold hover:underline"
                  >
                    Ver Rosa →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
