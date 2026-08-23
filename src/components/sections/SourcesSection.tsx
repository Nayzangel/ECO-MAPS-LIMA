import React, { useState } from 'react';
import { 
  Database, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  FileCode, 
  UploadCloud, 
  Filter, 
  Sparkles, 
  AlertCircle,
  FileSpreadsheet,
  Layers
} from 'lucide-react';
import { EXTERNAL_SOURCES_CATALOGUE } from '../../data/demoData';
import { ExternalSource } from '../../types';

export const SourcesSection: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('todos');
  const [selectedSource, setSelectedSource] = useState<ExternalSource>(EXTERNAL_SOURCES_CATALOGUE[0]);
  const [showUploadSimulationModal, setShowUploadSimulationModal] = useState<boolean>(false);

  const filteredSources = EXTERNAL_SOURCES_CATALOGUE.filter(s => {
    if (filterType === 'todos') return true;
    return s.type.toLowerCase().includes(filterType.toLowerCase());
  });

  return (
    <section id="fuentes" className="py-20 bg-slate-900/30 border-b border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase tracking-wider">
              <Database className="w-3.5 h-3.5" />
              Gobernanza & Trazabilidad de Datos
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Registro Oficial de <span className="text-teal-400">Fuentes & Conectores</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
              Máxima transparencia científica e institucional. Registro exhaustivo de metadatos, 
              licencias de uso, periodicidad y estado de conexión para cada dataset integrado en ECO-MAP.
            </p>
          </div>

          {/* User Data Ingestion CTA */}
          <button
            onClick={() => setShowUploadSimulationModal(true)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-teal-500/40 text-teal-300 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm self-start md:self-auto cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-teal-400" />
            Cargar Datos Propios (CSV/GeoJSON)
          </button>
        </div>

        {/* TRANSPARENCY NOTICE BANNER */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-amber-500/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <span className="font-bold text-amber-300">Declaración de Transparencia y Rigor Técnico:</span>
            <p className="text-slate-300 leading-relaxed">
              ECO-MAP distingue estrictamente entre fuentes oficiales gubernamentales (SENAMHI, OEFA, DIGESA, MML) 
              y conjuntos de datos <strong>DEMO simulados</strong>. Ningún dato generado computacionalmente se presenta 
              como registro oficial sin su respectivo sello de validación técnica.
            </p>
          </div>
        </div>

        {/* SOURCE FILTER TABS */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-bold uppercase mr-2">Filtrar por origen:</span>
          {['todos', 'Gubernamental', 'Sensor Comunitario'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-all cursor-pointer ${
                filterType === t
                  ? 'bg-teal-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {t === 'todos' ? 'Todas las Fuentes' : t}
            </button>
          ))}
        </div>

        {/* SOURCES GRID & DETAIL CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: SOURCE CARDS */}
          <div className="lg:col-span-7 space-y-3">
            {filteredSources.map((source) => {
              const isSelected = selectedSource.id === source.id;
              return (
                <div
                  key={source.id}
                  onClick={() => setSelectedSource(source)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-teal-500/80 shadow-lg shadow-teal-950/30'
                      : 'bg-slate-900/50 border-slate-800 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-teal-400 uppercase tracking-wide">
                          {source.type}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs text-slate-400 font-medium">{source.institution}</span>
                      </div>
                      <h4 className="text-base font-bold text-white leading-snug">{source.name}</h4>
                    </div>

                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      {source.connectionStatus}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                    <span>Método: <strong className="text-slate-300">{source.connectionMethod}</strong></span>
                    <span>Actualización: <strong className="text-slate-300">{source.updateFrequency}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: SELECTED SOURCE TECHNICAL SHEET */}
          <div className="lg:col-span-5">
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-5 sticky top-28">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCode className="w-4 h-4" /> Ficha Técnica de la Fuente
                </span>
                <span className="text-[10px] font-mono bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                  ID: {selectedSource.id}
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-extrabold text-white leading-snug">
                  {selectedSource.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedSource.description}
                </p>
              </div>

              {/* METADATA TABLE */}
              <div className="space-y-2.5 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800/90 font-mono">
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400 font-sans">Institución:</span>
                  <span className="text-slate-200 font-bold text-right">{selectedSource.institution}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400 font-sans">Método de Enlace:</span>
                  <span className="text-teal-400 font-bold">{selectedSource.connectionMethod}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400 font-sans">Frecuencia:</span>
                  <span className="text-slate-200">{selectedSource.updateFrequency}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400 font-sans">Licencia Legal:</span>
                  <span className="text-slate-300 text-right">{selectedSource.license}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400 font-sans">Última Sincronización:</span>
                  <span className="text-amber-400">{selectedSource.lastSync}</span>
                </div>
              </div>

              {/* ACTION LINKS */}
              <div className="pt-2 flex items-center gap-3">
                <a
                  href={selectedSource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Sitio Institucional
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* MODAL SIMULATION FOR USER UPLOAD */}
      {showUploadSimulationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-teal-400" />
                Cargar Datos Propios del Usuario
              </h3>
              <button
                onClick={() => setShowUploadSimulationModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Sube tus monitoreos de campo en formato CSV o GeoJSON para contrastarlos automáticamente contra los Estándares de Calidad Ambiental (ECA Perú).
            </p>

            <div className="p-8 border-2 border-dashed border-slate-700 hover:border-teal-500 rounded-xl text-center space-y-2 cursor-pointer transition-colors bg-slate-950/50">
              <FileSpreadsheet className="w-8 h-8 text-teal-400 mx-auto" />
              <div className="text-xs text-slate-200 font-bold">Arrastra tu archivo CSV o GeoJSON aquí</div>
              <div className="text-[10px] text-slate-400">Columnas requeridas: lat, lng, pm25, pm10, noise_dba, date</div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowUploadSimulationModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  alert('¡Archivo de prueba cargado correctamente en memoria demo!');
                  setShowUploadSimulationModal(false);
                }}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl"
              >
                Cargar Dataset Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
