import React, { useState, useMemo } from 'react';
import { 
  Table, 
  Search, 
  Download, 
  Trash2, 
  FileText, 
  Sparkles, 
  Eye, 
  Layers, 
  Activity, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { NoiseMeasurementRecord, AcousticMethodologyType, NoiseZoneType } from '../../types/noiseQuality';

interface NoisePointsTableProps {
  records: NoiseMeasurementRecord[];
  selectedRecordId: string;
  onSelectRecord: (id: string) => void;
  onDeleteUserRecord: (id: string) => void;
  onOpenDossier: (record: NoiseMeasurementRecord) => void;
  onOpenDecisionEngine?: (record: NoiseMeasurementRecord) => void;
}

export const NoisePointsTable: React.FC<NoisePointsTableProps> = ({
  records,
  selectedRecordId,
  onSelectRecord,
  onDeleteUserRecord,
  onOpenDossier,
  onOpenDecisionEngine
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [zoneFilter, setZoneFilter] = useState<string>('ALL');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  const [exceedanceFilter, setExceedanceFilter] = useState<string>('ALL');

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch = 
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.equipment.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesZone = zoneFilter === 'ALL' || r.zoneType === zoneFilter;
      const matchesMethod = methodFilter === 'ALL' || r.methodology === methodFilter;
      const matchesExceedance = 
        exceedanceFilter === 'ALL' ||
        (exceedanceFilter === 'EXCEEDING' && r.isExceeding) ||
        (exceedanceFilter === 'COMPLIANT' && !r.isExceeding);

      return matchesSearch && matchesZone && matchesMethod && matchesExceedance;
    });
  }, [records, searchTerm, zoneFilter, methodFilter, exceedanceFilter]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Titulo',
      'Distrito',
      'Direccion',
      'Latitud',
      'Longitud',
      'Zona_UTM',
      'Fecha',
      'Hora',
      'Periodo',
      'Duracion_min',
      'LAeq_dBA',
      'LAFmax_dBA',
      'LAFmin_dBA',
      'LCpeak_dBC',
      'Zonificacion',
      'Limite_ECA_dBA',
      'Excedencia_dB',
      'Estado_Cumplimiento',
      'Prioridad',
      'Equipo',
      'Clase_Equipo',
      'Calibracion_Delta_dB',
      'Metodologia',
      'Categoria_Fuente'
    ];

    const rows = filteredRecords.map((r) => [
      `"${r.id}"`,
      `"${r.title}"`,
      `"${r.district}"`,
      `"${r.address}"`,
      r.coordinates[0],
      r.coordinates[1],
      `"${r.utmZone || ''}"`,
      `"${r.date}"`,
      `"${r.time}"`,
      `"${r.determinedPeriod}"`,
      r.durationMinutes,
      r.laeq,
      r.lafmax,
      r.lafmin,
      r.lcpeak,
      `"${r.zoneType}"`,
      r.ecaLimit,
      r.exceedanceDb,
      r.isExceeding ? '"SUPERA ECA"' : '"EN NORMA"',
      `"${r.priority}"`,
      `"${r.equipment}"`,
      `"${r.equipmentClass}"`,
      r.calibration?.deltaCalibrationDb || 0,
      `"${r.methodology}"`,
      `"${r.sourceCategory}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ecomap_ruido_ambiental_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-2xl">
      
      {/* HEADER & FILTERS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Table className="w-5 h-5 text-cyan-400" />
            Registro Integral de Puntos de Monitoreo Acústico ({filteredRecords.length})
          </h3>
          <p className="text-xs text-slate-400">
            Puntos auditados según D.S. 085-2003-PCM y estándares de metrología ISO 1996.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center gap-1.5 transition-all cursor-pointer shadow"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV Oficial</span>
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por distrito, vía, equipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white text-xs placeholder-slate-500 focus:border-cyan-500"
          />
        </div>

        {/* Zone Filter */}
        <select
          value={zoneFilter}
          onChange={(e) => setZoneFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 text-xs focus:border-cyan-500"
        >
          <option value="ALL">Todas las Zonificaciones</option>
          <option value="ProteccionEspecial">Protección Especial</option>
          <option value="Residencial">Residencial</option>
          <option value="Comercial">Comercial</option>
          <option value="Industrial">Industrial</option>
          <option value="Mixta">Mixta</option>
        </select>

        {/* Methodology Filter */}
        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 text-xs focus:border-cyan-500"
        >
          <option value="ALL">Todas las Metodologías</option>
          <option value="MEDICION">Medición In Situ (Sonómetro)</option>
          <option value="INTERPOLACION">Interpolación (Isófonas 2D)</option>
          <option value="MODELAMIENTO">Modelamiento (Simulación 3D)</option>
        </select>

        {/* Exceedance Filter */}
        <select
          value={exceedanceFilter}
          onChange={(e) => setExceedanceFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 text-xs focus:border-cyan-500"
        >
          <option value="ALL">Todos los Estados ECA</option>
          <option value="EXCEEDING">⚠️ Solo Excedencias (&gt; ECA)</option>
          <option value="COMPLIANT">✓ En Norma (&le; ECA)</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/90 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Punto / Distrito</th>
              <th className="py-3 px-3">Metodología</th>
              <th className="py-3 px-3">Horario</th>
              <th className="py-3 px-3 text-right">LAeq</th>
              <th className="py-3 px-3 text-right">LAFmax</th>
              <th className="py-3 px-3 text-right">LCpeak</th>
              <th className="py-3 px-3">Zonif. / ECA</th>
              <th className="py-3 px-3">Estado ECA</th>
              <th className="py-3 px-3">Prioridad</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-500 text-xs font-mono">
                  No se encontraron puntos con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              filteredRecords.map((r) => {
                const isSelected = r.id === selectedRecordId;

                return (
                  <tr
                    key={r.id}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/40 border-l-4 border-l-cyan-400'
                        : 'hover:bg-slate-900/60'
                    }`}
                    onClick={() => onSelectRecord(r.id)}
                  >
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-white">{r.title}</div>
                      <div className="text-[11px] text-slate-400">{r.district} • {r.address}</div>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        r.methodology === 'MEDICION' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        r.methodology === 'INTERPOLACION' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                        'bg-purple-950 text-purple-300 border border-purple-800'
                      }`}>
                        {r.methodology}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-slate-300">
                      <div>{r.time} ({r.determinedPeriod})</div>
                      <div className="text-[10px] text-slate-500">{r.date}</div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-cyan-300 text-sm">
                      {r.laeq} <span className="text-[10px] text-slate-400 font-normal">dB</span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-amber-300">
                      {r.lafmax}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-rose-300">
                      {r.lcpeak}
                    </td>

                    <td className="py-3 px-3 text-[11px]">
                      <div className="font-semibold text-slate-200">{r.zoneType}</div>
                      <div className="text-[10px] font-mono text-slate-400">ECA: {r.ecaLimit} dBA</div>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono inline-flex items-center gap-1 ${
                        r.isExceeding
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {r.isExceeding ? `+${r.exceedanceDb.toFixed(1)} dB` : '✓ Cumple'}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black ${
                        r.priority === 'CRITICA' ? 'bg-rose-500 text-slate-950' :
                        r.priority === 'ALTA' ? 'bg-amber-500 text-slate-950' :
                        r.priority === 'MODERADA' ? 'bg-yellow-400 text-slate-950' : 'bg-emerald-500 text-slate-950'
                      }`}>
                        {r.priority}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => onOpenDossier(r)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-all cursor-pointer"
                          title="Ver Ficha Técnica Oficial"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>

                        {onOpenDecisionEngine && (
                          <button
                            type="button"
                            onClick={() => onOpenDecisionEngine(r)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 transition-all cursor-pointer"
                            title="Auditar en Motor de Decisión"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {r.isUserAdded && (
                          <button
                            type="button"
                            onClick={() => onDeleteUserRecord(r.id)}
                            className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-400 transition-all cursor-pointer"
                            title="Eliminar Registro de Usuario"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
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
