import React, { useState } from 'react';
import { 
  AnyEmissionSource, 
  StackPointSource, 
  RoadwayLineSource, 
  SurfaceAreaSource,
  EmissionSourceType 
} from '../../types/emissionSources';
import { 
  Search, 
  Download, 
  Flame, 
  Navigation, 
  Grid, 
  Filter, 
  Plus, 
  ShieldCheck, 
  AlertCircle,
  Layers,
  ArrowRight
} from 'lucide-react';

interface EmissionInventoryTableProps {
  sources: AnyEmissionSource[];
  onSelectSource?: (source: AnyEmissionSource) => void;
  onOpenStackModal: () => void;
  onOpenLineModal: () => void;
  onOpenAreaModal: () => void;
}

export const EmissionInventoryTable: React.FC<EmissionInventoryTableProps> = ({
  sources,
  onSelectSource,
  onOpenStackModal,
  onOpenLineModal,
  onOpenAreaModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | EmissionSourceType>('ALL');

  const filtered = sources.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ('facilityName' in s && s.facilityName ? s.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) : false);

    const matchesType = typeFilter === 'ALL' || s.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const exportToCsv = () => {
    const headers = [
      'ID', 'Tipo_Fuente', 'Nombre', 'Instalacion', 'Distrito', 'Latitud', 'Longitud',
      'Parametros_Geometricos', 'Caudal_m3s', 'Tasa_Emision_g_s', 'Contaminantes'
    ];

    const rows = filtered.map(s => {
      let geom = '';
      let flow = 'N/A';
      let rates = s.pollutants.map(p => `${p.pollutant}: ${p.rateValue} g/s`).join('; ');

      if (s.type === 'PUNTUAL_CHIMENEA') {
        geom = `Altura: ${s.stackHeightMeters}m, Diam: ${s.stackInnerDiameterMeters}m, Temp: ${s.gasExitTemperatureCelsius}C, Vel: ${s.gasExitVelocityMs}m/s`;
        flow = `${s.volumetricFlowRateM3s} m3/s`;
      } else if (s.type === 'LINEAL_VIA') {
        geom = `Longitud: ${s.lengthMeters}m, Ancho: ${s.roadwayWidthMeters}m, Aforo: ${s.trafficVolumeVehiclesPerHour} veh/h`;
      } else if (s.type === 'AREA_SUPERFICIAL') {
        geom = `Superficie: ${s.surfaceAreaHectares} ha (${s.surfaceAreaM2} m2), Altura: ${s.releaseHeightMeters}m`;
      }

      return [
        s.id,
        s.type,
        `"${s.name}"`,
        `"${'facilityName' in s ? s.facilityName : s.district}"`,
        `"${s.district}"`,
        s.type === 'PUNTUAL_CHIMENEA' ? s.coordinates[0] : s.type === 'LINEAL_VIA' ? s.startCoordinates[0] : s.centerCoordinates[0],
        s.type === 'PUNTUAL_CHIMENEA' ? s.coordinates[1] : s.type === 'LINEAL_VIA' ? s.startCoordinates[1] : s.centerCoordinates[1],
        `"${geom}"`,
        flow,
        `"${rates}"`,
        `"${s.pollutants.map(p => p.pollutant).join(', ')}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Inventario_Fuentes_Emision_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden">
      
      {/* TOOLBAR */}
      <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/60">
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* SEARCH */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar chimenea, vía, cantera..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* SOURCE TYPE FILTER */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="ALL">Todas las fuentes ({sources.length})</option>
              <option value="PUNTUAL_CHIMENEA">Puntuales (Chimeneas)</option>
              <option value="LINEAL_VIA">Lineales (Vías vehiculares)</option>
              <option value="AREA_SUPERFICIAL">De Área (Superficies difusas)</option>
            </select>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={exportToCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5" /> Exportar CSV
          </button>
          
          <div className="flex items-center gap-1">
            <button
              onClick={onOpenStackModal}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold transition"
            >
              <Plus className="w-3.5 h-3.5" /> + Chimenea
            </button>
            <button
              onClick={onOpenLineModal}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-bold transition"
            >
              <Plus className="w-3.5 h-3.5" /> + Vía
            </button>
            <button
              onClick={onOpenAreaModal}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition"
            >
              <Plus className="w-3.5 h-3.5" /> + Área
            </button>
          </div>
        </div>

      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Tipo & Fuente</th>
              <th className="py-3 px-3">Titular / Instalación</th>
              <th className="py-3 px-3">Distrito</th>
              <th className="py-3 px-3">Geometría Física</th>
              <th className="py-3 px-3">Caudal / Aforo</th>
              <th className="py-3 px-3">Tasas de Emisión (g/s)</th>
              <th className="py-3 px-3">LMP / Conformidad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans text-xs">
            {filtered.map((src) => {
              const isStack = src.type === 'PUNTUAL_CHIMENEA';
              const isLine = src.type === 'LINEAL_VIA';
              const isArea = src.type === 'AREA_SUPERFICIAL';

              return (
                <tr
                  key={src.id}
                  onClick={() => onSelectSource && onSelectSource(src)}
                  className="hover:bg-slate-800/50 cursor-pointer transition"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-start gap-2.5">
                      <div className={`p-1.5 rounded-lg mt-0.5 ${
                        isStack 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                          : isLine 
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {isStack && <Flame className="w-4 h-4" />}
                        {isLine && <Navigation className="w-4 h-4" />}
                        {isArea && <Grid className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-bold text-white leading-tight flex items-center gap-1.5">
                          {src.name}
                          {src.isUserAdded && (
                            <span className="text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1 py-0.2 rounded font-mono">
                              USUARIO
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {isStack ? 'Fuente Puntual (Chimenea)' : isLine ? 'Fuente Lineal (Carretera)' : 'Fuente de Área (Superficie)'}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 font-medium text-slate-200">
                    {'facilityName' in src ? src.facilityName : 'Red Vial Metropolitana'}
                  </td>

                  <td className="py-3.5 px-3 text-slate-400">
                    {src.district}
                  </td>

                  <td className="py-3.5 px-3 font-mono text-[11px]">
                    {isStack && (
                      <div className="space-y-0.5">
                        <div>h: <strong className="text-white">{src.stackHeightMeters}m</strong> | d: <strong className="text-white">{src.stackInnerDiameterMeters}m</strong></div>
                        <div className="text-slate-400">Ts: {src.gasExitTemperatureCelsius}°C | vs: {src.gasExitVelocityMs} m/s</div>
                      </div>
                    )}
                    {isLine && (
                      <div className="space-y-0.5">
                        <div>L: <strong className="text-white">{src.lengthMeters}m</strong> | W: {src.roadwayWidthMeters}m</div>
                        <div className="text-slate-400">H escape: {src.releaseHeightMeters}m</div>
                      </div>
                    )}
                    {isArea && (
                      <div className="space-y-0.5">
                        <div>Sup: <strong className="text-white">{src.surfaceAreaHectares} ha</strong></div>
                        <div className="text-slate-400">H lib: {src.releaseHeightMeters}m</div>
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-3 font-mono text-[11px]">
                    {isStack && (
                      <span className="text-cyan-400 font-bold">
                        {src.volumetricFlowRateM3s} m³/s
                      </span>
                    )}
                    {isLine && (
                      <span className="text-indigo-400 font-bold">
                        {src.trafficVolumeVehiclesPerHour} veh/h
                      </span>
                    )}
                    {isArea && (
                      <span className="text-emerald-400 font-bold">
                        {src.surfaceAreaM2.toLocaleString()} m²
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-3 font-mono text-[11px]">
                    <div className="flex flex-wrap gap-1.5">
                      {src.pollutants.map(p => (
                        <span
                          key={p.pollutant}
                          className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px]"
                        >
                          <strong className="text-slate-400">{p.pollutant}:</strong>{' '}
                          <span className="text-amber-400 font-bold">{p.rateValue} g/s</span>
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" /> Conforme Norma
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
