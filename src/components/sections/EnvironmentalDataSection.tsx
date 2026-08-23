import React, { useState, useMemo } from 'react';
import { 
  Database, 
  Plus, 
  UploadCloud, 
  Download, 
  Search, 
  Filter, 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  FileSpreadsheet, 
  FileText, 
  FileCode, 
  MapPin, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Trash2, 
  Layers, 
  RefreshCw,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { 
  EnvironmentalRecord, 
  DataOrigin, 
  EnvironmentalParameter, 
  ValidationStatus, 
  ReliabilityTier, 
  EnvironmentalDataFilter 
} from '../../types/environmentalData';
import { getInitialEnvironmentalRecords } from '../../data/environmentalDatasets';
import { 
  exportRecordsToFile, 
  downloadExcelTemplate, 
  downloadCSVTemplate, 
  downloadJSONTemplate, 
  downloadGeoJSONTemplate,
  validateEnvironmentalRecord,
  PARAMETER_STANDARD_UNITS
} from '../../utils/environmentalValidator';
import { DataOriginBadge, ORIGIN_CONFIG } from '../environmental-data/DataOriginBadge';
import { ReliabilityBadge } from '../environmental-data/ReliabilityBadge';
import { DataIngestionModal } from '../environmental-data/DataIngestionModal';
import { RecordDetailModal } from '../environmental-data/RecordDetailModal';
import { ValidationIssuesDrawer } from '../environmental-data/ValidationIssuesDrawer';

export const EnvironmentalDataSection: React.FC = () => {
  // Master Environmental Records State
  const [records, setRecords] = useState<EnvironmentalRecord[]>(() => getInitialEnvironmentalRecords());

  // Modal / Drawer States
  const [isIngestionOpen, setIsIngestionOpen] = useState(false);
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<EnvironmentalRecord | null>(null);
  const [isIssuesDrawerOpen, setIsIssuesDrawerOpen] = useState(false);

  // Filters State
  const [filters, setFilters] = useState<EnvironmentalDataFilter>({
    search: '',
    origin: 'TODOS',
    parameter: 'TODOS',
    district: 'TODOS',
    reliabilityTier: 'TODOS',
    status: 'TODOS',
    onlyExceedingEca: false
  });

  // Unique Districts in current dataset
  const uniqueDistricts = useMemo(() => {
    const set = new Set(records.map(r => r.distrito));
    return Array.from(set).sort();
  }, [records]);

  // Total Statistics Calculations
  const stats = useMemo(() => {
    const total = records.length;
    const countOficial = records.filter(r => r.origen === 'OFICIAL').length;
    const countUsuario = records.filter(r => r.origen === 'USUARIO').length;
    const countDemo = records.filter(r => r.origen === 'DEMO').length;
    const countModelado = records.filter(r => r.origen === 'MODELADO').length;
    const countSimulado = records.filter(r => r.origen === 'SIMULADO').length;

    const validCount = records.filter(r => r.status === 'VALID').length;
    const warningCount = records.filter(r => r.status === 'WARNING').length;
    const rejectedCount = records.filter(r => r.status === 'REJECTED').length;
    const issuesCount = warningCount + rejectedCount;

    const totalScoreSum = records.reduce((acc, r) => acc + (r.reliability?.totalScore || 0), 0);
    const avgReliability = total > 0 ? Math.round(totalScoreSum / total) : 0;

    return {
      total,
      countOficial,
      countUsuario,
      countDemo,
      countModelado,
      countSimulado,
      validCount,
      warningCount,
      rejectedCount,
      issuesCount,
      avgReliability
    };
  }, [records]);

  // Filtered Records List
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      // 1. Origin Filter
      if (filters.origin !== 'TODOS' && r.origen !== filters.origin) return false;

      // 2. Parameter Filter
      if (filters.parameter !== 'TODOS' && r.parametro !== filters.parameter) return false;

      // 3. District Filter
      if (filters.district !== 'TODOS' && r.distrito !== filters.district) return false;

      // 4. Reliability Tier Filter
      if (filters.reliabilityTier !== 'TODOS' && r.reliability.tier !== filters.reliabilityTier) return false;

      // 5. Validation Status Filter
      if (filters.status !== 'TODOS' && r.status !== filters.status) return false;

      // 6. ECA Exceedance Filter
      if (filters.onlyExceedingEca && !r.exceedsEca) return false;

      // 7. Search text filter
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchDist = r.distrito.toLowerCase().includes(query);
        const matchDir = (r.direccion || '').toLowerCase().includes(query);
        const matchParam = r.parametro.toLowerCase().includes(query);
        const matchEquipo = r.equipo.toLowerCase().includes(query);
        const matchFuente = r.fuente.toLowerCase().includes(query);
        const matchObs = (r.observaciones || '').toLowerCase().includes(query);
        if (!matchDist && !matchDir && !matchParam && !matchEquipo && !matchFuente && !matchObs) {
          return false;
        }
      }

      return true;
    });
  }, [records, filters]);

  // Handlers for record updates
  const handleSaveSingleRecord = (newRecord: EnvironmentalRecord) => {
    setRecords(prev => [newRecord, ...prev]);
  };

  const handleBatchImport = (newRecords: EnvironmentalRecord[]) => {
    setRecords(prev => [...newRecords, ...prev]);
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const handleClearNonOfficial = () => {
    if (window.confirm('¿Está seguro de restablecer y conservar únicamente los datos oficiales?')) {
      setRecords(prev => prev.filter(r => r.origen === 'OFICIAL'));
    }
  };

  // Auto-Fix Reversible Issues (Inverted coordinates & Standard units)
  const handleAutoFixAll = () => {
    const updated = records.map(r => {
      const { validatedRecord } = validateEnvironmentalRecord(r, records);
      return validatedRecord;
    });
    setRecords(updated);
    setIsIssuesDrawerOpen(false);
  };

  // Remove exact duplicates
  const handleRemoveDuplicates = () => {
    const seen = new Set<string>();
    const unique: EnvironmentalRecord[] = [];

    records.forEach(r => {
      const key = `${r.fecha}_${r.hora.slice(0, 5)}_${r.parametro}_${r.coordenadas[0].toFixed(3)}_${r.coordenadas[1].toFixed(3)}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(r);
      }
    });

    setRecords(unique);
    setIsIssuesDrawerOpen(false);
  };

  return (
    <section id="datos-ambientales" className="py-16 bg-slate-950 border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* 1. SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Database className="w-3.5 h-3.5" />
              Gestión Integral de Datos Ambientales
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Módulo de <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Datos Ambientales</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Ingrese, importe y valide información ambiental en formatos <strong>Formulario, Excel, CSV, JSON y GeoJSON</strong>. 
              El motor de verificación analiza de forma automática coordenadas, completitud, unidades, duplicidad y consistencia física, 
              clasificando con estricta trazabilidad cada origen de datos.
            </p>
          </div>

          {/* TOP ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsIngestionOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ingresar Datos</span>
            </button>

            {stats.issuesCount > 0 && (
              <button
                onClick={() => setIsIssuesDrawerOpen(true)}
                className="px-3.5 py-2.5 bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-amber-300 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Auditoría ({stats.issuesCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. STATISTICAL METRICS SUMMARY */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          {/* Total */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Registros</span>
            <div className="text-2xl font-mono font-extrabold text-white">{stats.total}</div>
            <span className="text-[10px] text-emerald-400 font-semibold">En base de datos</span>
          </div>

          {/* Oficiales */}
          <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-blue-300 uppercase font-bold">Oficiales</span>
              <span className="w-2 h-2 rounded-full bg-blue-400" />
            </div>
            <div className="text-2xl font-mono font-extrabold text-blue-300">{stats.countOficial}</div>
            <span className="text-[10px] text-slate-400">SENAMHI / OEFA</span>
          </div>

          {/* Usuario */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-emerald-300 uppercase font-bold">Del Usuario</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-2xl font-mono font-extrabold text-emerald-300">{stats.countUsuario}</div>
            <span className="text-[10px] text-slate-400">Ingresados en sesión</span>
          </div>

          {/* Demo */}
          <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-amber-300 uppercase font-bold">Demo</span>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            </div>
            <div className="text-2xl font-mono font-extrabold text-amber-300">{stats.countDemo}</div>
            <span className="text-[10px] text-slate-400">Puntos de prueba</span>
          </div>

          {/* Modelados & Simulados */}
          <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-purple-300 uppercase font-bold">Modelados / Sim.</span>
              <span className="w-2 h-2 rounded-full bg-purple-400" />
            </div>
            <div className="text-2xl font-mono font-extrabold text-purple-300">
              {stats.countModelado + stats.countSimulado}
            </div>
            <span className="text-[10px] text-slate-400">AERMOD / Plan 2030</span>
          </div>

          {/* Confiabilidad Promedio */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Confiabilidad Media</span>
            <div className="text-2xl font-mono font-extrabold text-teal-400">{stats.avgReliability}%</div>
            <span className="text-[10px] text-slate-400">Índice ponderado</span>
          </div>

        </div>

        {/* 3. STRICT ORIGIN CATEGORY TABS (NUNCA MEZCLARLOS SIN IDENTIFICARLOS) */}
        <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                Filtro Estricto por Origen del Dato
              </h3>
            </div>
            <span className="text-[10px] text-slate-400">
              Visualización segregada para evitar contaminación analítica
            </span>
          </div>

          {/* Tab buttons for origin */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            
            {/* TODOS */}
            <button
              onClick={() => setFilters(prev => ({ ...prev, origin: 'TODOS' }))}
              className={`p-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                filters.origin === 'TODOS'
                  ? 'bg-slate-800 border-emerald-400 text-white shadow-md'
                  : 'bg-slate-950/60 border-slate-850 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Todos los Datos</span>
              <span className="px-1.5 py-0.5 rounded-md bg-slate-900 text-[10px] font-mono">{stats.total}</span>
            </button>

            {/* OFICIALES */}
            <button
              onClick={() => setFilters(prev => ({ ...prev, origin: 'OFICIAL' }))}
              className={`p-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                filters.origin === 'OFICIAL'
                  ? 'bg-blue-950 border-blue-400 text-blue-300 shadow-md ring-1 ring-blue-400/40'
                  : 'bg-slate-950/60 border-slate-850 text-slate-400 hover:text-blue-300'
              }`}
            >
              <span>Oficiales</span>
              <span className="px-1.5 py-0.5 rounded-md bg-blue-900/60 text-blue-300 text-[10px] font-mono">{stats.countOficial}</span>
            </button>

            {/* USUARIO */}
            <button
              onClick={() => setFilters(prev => ({ ...prev, origin: 'USUARIO' }))}
              className={`p-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                filters.origin === 'USUARIO'
                  ? 'bg-emerald-950 border-emerald-400 text-emerald-300 shadow-md ring-1 ring-emerald-400/40'
                  : 'bg-slate-950/60 border-slate-850 text-slate-400 hover:text-emerald-300'
              }`}
            >
              <span>Del Usuario</span>
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-900/60 text-emerald-300 text-[10px] font-mono">{stats.countUsuario}</span>
            </button>

            {/* DEMO */}
            <button
              onClick={() => setFilters(prev => ({ ...prev, origin: 'DEMO' }))}
              className={`p-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                filters.origin === 'DEMO'
                  ? 'bg-amber-950 border-amber-400 text-amber-300 shadow-md ring-1 ring-amber-400/40'
                  : 'bg-slate-950/60 border-slate-850 text-slate-400 hover:text-amber-300'
              }`}
            >
              <span>Demo</span>
              <span className="px-1.5 py-0.5 rounded-md bg-amber-900/60 text-amber-300 text-[10px] font-mono">{stats.countDemo}</span>
            </button>

            {/* MODELADOS */}
            <button
              onClick={() => setFilters(prev => ({ ...prev, origin: 'MODELADO' }))}
              className={`p-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                filters.origin === 'MODELADO'
                  ? 'bg-purple-950 border-purple-400 text-purple-300 shadow-md ring-1 ring-purple-400/40'
                  : 'bg-slate-950/60 border-slate-850 text-slate-400 hover:text-purple-300'
              }`}
            >
              <span>Modelados</span>
              <span className="px-1.5 py-0.5 rounded-md bg-purple-900/60 text-purple-300 text-[10px] font-mono">{stats.countModelado}</span>
            </button>

            {/* SIMULADOS */}
            <button
              onClick={() => setFilters(prev => ({ ...prev, origin: 'SIMULADO' }))}
              className={`p-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                filters.origin === 'SIMULADO'
                  ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-md ring-1 ring-cyan-400/40'
                  : 'bg-slate-950/60 border-slate-850 text-slate-400 hover:text-cyan-300'
              }`}
            >
              <span>Simulados</span>
              <span className="px-1.5 py-0.5 rounded-md bg-cyan-900/60 text-cyan-300 text-[10px] font-mono">{stats.countSimulado}</span>
            </button>

          </div>
        </div>

        {/* 4. SEARCH, ADVANCED FILTERS & EXPORT TOOLBAR */}
        <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            
            {/* Search */}
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por distrito, calle, equipo, fuente o parámetro..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* Parameter Filter */}
            <div>
              <select
                value={filters.parameter}
                onChange={(e) => setFilters(prev => ({ ...prev, parameter: e.target.value as any }))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-400"
              >
                <option value="TODOS">Todos los Parámetros</option>
                <option value="PM2.5">PM2.5</option>
                <option value="PM10">PM10</option>
                <option value="Ruido Diurno">Ruido Diurno</option>
                <option value="Ruido Nocturno">Ruido Nocturno</option>
                <option value="SO2">SO2</option>
                <option value="NO2">NO2</option>
                <option value="CO">CO</option>
                <option value="O3">O3</option>
              </select>
            </div>

            {/* District Filter */}
            <div>
              <select
                value={filters.district}
                onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-400"
              >
                <option value="TODOS">Todos los Distritos</option>
                {uniqueDistricts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Reliability Tier */}
            <div>
              <select
                value={filters.reliabilityTier}
                onChange={(e) => setFilters(prev => ({ ...prev, reliabilityTier: e.target.value as any }))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-400"
              >
                <option value="TODOS">Toda Confiabilidad</option>
                <option value="ALTA">Alta Confiabilidad (&gt;85%)</option>
                <option value="MEDIA">Confiable / Media (60-84%)</option>
                <option value="BAJA">Baja / Precaución (40-59%)</option>
                <option value="RECHAZADO">Rechazado (&lt;40%)</option>
              </select>
            </div>

          </div>

          {/* SECONDARY BAR: EXCEED ECA TOGGLE + EXPORT DROPDOWN */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-800 text-xs">
            
            {/* Toggles */}
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={filters.onlyExceedingEca}
                  onChange={(e) => setFilters(prev => ({ ...prev, onlyExceedingEca: e.target.checked }))}
                  className="rounded border-slate-700 bg-slate-900 text-emerald-400 focus:ring-0"
                />
                <span>Mostrar solo registros que <strong className="text-rose-400 font-bold">superan límites ECA</strong></span>
              </label>

              <span className="text-slate-500">|</span>

              <span className="text-[11px] text-slate-400">
                Mostrando <strong className="text-white">{filteredRecords.length}</strong> de {records.length} registros
              </span>
            </div>

            {/* Export buttons */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">Exportar:</span>
              <button
                type="button"
                onClick={() => exportRecordsToFile(filteredRecords, 'EXCEL')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-all"
                title="Exportar a Excel"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Excel</span>
              </button>
              <button
                type="button"
                onClick={() => exportRecordsToFile(filteredRecords, 'CSV')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-all"
                title="Exportar a CSV"
              >
                <FileText className="w-3.5 h-3.5 text-teal-400" />
                <span>CSV</span>
              </button>
              <button
                type="button"
                onClick={() => exportRecordsToFile(filteredRecords, 'JSON')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-all"
                title="Exportar a JSON"
              >
                <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                <span>JSON</span>
              </button>
              <button
                type="button"
                onClick={() => exportRecordsToFile(filteredRecords, 'GEOJSON')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-all"
                title="Exportar a GeoJSON GIS"
              >
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>GeoJSON</span>
              </button>
            </div>

          </div>

        </div>

        {/* 5. MAIN ENVIRONMENTAL DATA TABLE */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Origen del Dato</th>
                  <th className="py-3.5 px-4">Fecha / Hora</th>
                  <th className="py-3.5 px-4">Ubicación & Coords</th>
                  <th className="py-3.5 px-4">Parámetro & Valor</th>
                  <th className="py-3.5 px-4">ECA Cumplimiento</th>
                  <th className="py-3.5 px-4">Equipo & Fuente</th>
                  <th className="py-3.5 px-4 text-center">Confiabilidad</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <Database className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <span className="font-bold block text-slate-300">No se encontraron registros con los filtros seleccionados.</span>
                      <span className="text-[11px]">Ajuste los criterios de búsqueda o incorpore nuevos datos con el botón "Ingresar Datos".</span>
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => {
                    const isExceeding = record.exceedsEca;
                    return (
                      <tr key={record.id} className="hover:bg-slate-850/60 transition-colors group">
                        
                        {/* Origen */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <DataOriginBadge origin={record.origen} size="sm" />
                        </td>

                        {/* Fecha y Hora */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-mono font-bold text-slate-200 block">{record.fecha}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{record.hora} hrs</span>
                        </td>

                        {/* Ubicación */}
                        <td className="py-3 px-4 max-w-xs">
                          <span className="font-bold text-white block truncate">{record.distrito}</span>
                          <span className="text-[10px] text-slate-400 font-mono truncate block">
                            [{record.coordenadas[0].toFixed(4)}, {record.coordenadas[1].toFixed(4)}]
                          </span>
                        </td>

                        {/* Parámetro y Valor */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="text-slate-400 text-[10px] block">{record.parametro}</span>
                          <span className="font-mono text-sm font-extrabold text-white">
                            {record.valor} <span className="text-xs font-normal text-slate-400">{record.unidad}</span>
                          </span>
                        </td>

                        {/* Estado ECA */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {record.ecaLimit ? (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border ${
                              isExceeding
                                ? 'bg-rose-950/80 border-rose-500/40 text-rose-300'
                                : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                            }`}>
                              {isExceeding ? <XCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                              <span>{isExceeding ? 'SUPERA ECA' : 'CUMPLE ECA'}</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-mono">Sin ECA Ref.</span>
                          )}
                        </td>

                        {/* Equipo y Fuente */}
                        <td className="py-3 px-4 max-w-xs">
                          <span className="font-semibold text-slate-300 block truncate">{record.equipo}</span>
                          <span className="text-[10px] text-slate-400 block truncate">{record.fuente}</span>
                        </td>

                        {/* Confiabilidad */}
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <ReliabilityBadge reliability={record.reliability} size="sm" />
                        </td>

                        {/* Acciones */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedRecordForDetail(record)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                              title="Ver Ficha Técnica"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {record.origen !== 'OFICIAL' && (
                              <button
                                onClick={() => handleDeleteRecord(record.id)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition-all cursor-pointer"
                                title="Eliminar Registro"
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

        {/* 6. MODALS AND DRAWERS */}
        <DataIngestionModal
          isOpen={isIngestionOpen}
          onClose={() => setIsIngestionOpen(false)}
          onSaveRecord={handleSaveSingleRecord}
          onBatchImport={handleBatchImport}
          existingRecords={records}
        />

        <RecordDetailModal
          record={selectedRecordForDetail}
          onClose={() => setSelectedRecordForDetail(null)}
          onDeleteRecord={handleDeleteRecord}
        />

        <ValidationIssuesDrawer
          isOpen={isIssuesDrawerOpen}
          onClose={() => setIsIssuesDrawerOpen(false)}
          records={records}
          onAutoFixAll={handleAutoFixAll}
          onRemoveDuplicates={handleRemoveDuplicates}
        />

      </div>
    </section>
  );
};
