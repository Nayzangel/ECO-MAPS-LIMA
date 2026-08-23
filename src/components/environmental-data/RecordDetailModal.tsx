import React from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  Gauge, 
  Cpu, 
  Building2, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Share2, 
  Trash2,
  ExternalLink,
  Award
} from 'lucide-react';
import { EnvironmentalRecord } from '../../types/environmentalData';
import { DataOriginBadge } from './DataOriginBadge';
import { ReliabilityBadge } from './ReliabilityBadge';

interface RecordDetailModalProps {
  record: EnvironmentalRecord | null;
  onClose: () => void;
  onDeleteRecord?: (id: string) => void;
}

export const RecordDetailModal: React.FC<RecordDetailModalProps> = ({
  record,
  onClose,
  onDeleteRecord
}) => {
  if (!record) return null;

  const isExceeding = record.exceedsEca;
  const ratio = record.ecaLimit ? Math.round((record.valor / record.ecaLimit) * 100) : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative text-xs">
        
        {/* HEADER */}
        <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-slate-400">ID: {record.id}</span>
                <DataOriginBadge origin={record.origen} size="sm" />
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                Ficha Técnica del Registro Ambiental
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {/* 1. PRIMARY METRIC & ECA STATUS BANNER */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isExceeding
              ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
          }`}>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                Parámetro Medido:
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-extrabold flex items-baseline gap-2">
                <span className="text-white">{record.parametro}:</span>
                <span className={isExceeding ? 'text-rose-400' : 'text-emerald-400'}>
                  {record.valor} {record.unidad}
                </span>
              </div>
              {record.ecaLimit && (
                <div className="text-[11px] opacity-90">
                  Límite Estándar de Calidad Ambiental (ECA): <strong>{record.ecaLimit} {record.unidad}</strong>
                </div>
              )}
            </div>

            <div className="flex flex-col items-start sm:items-end gap-1">
              <span className={`px-3 py-1 rounded-xl text-xs font-mono font-extrabold border ${
                isExceeding
                  ? 'bg-rose-900/80 border-rose-500 text-rose-200'
                  : 'bg-emerald-900/80 border-emerald-500 text-emerald-200'
              }`}>
                {isExceeding ? `⚠️ SUPERA ECA (+${(ratio || 100) - 100}%)` : `✓ CUMPLE ECA (${ratio}%)`}
              </span>
              <span className="text-[10px] opacity-70">
                {record.parametro.includes('Ruido') ? 'Ref. D.S. 085-2003-PCM' : 'Ref. D.S. 003-2017-MINAM'}
              </span>
            </div>
          </div>

          {/* 2. QUALITY & RELIABILITY SCORE AUDIT */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2 text-white font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Auditoría de Calidad y Confiabilidad</span>
              </div>
              <ReliabilityBadge reliability={record.reliability} size="md" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Metrología</span>
                <span className="font-mono text-emerald-400 font-bold">{record.reliability.equipmentScore}/35</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Completitud</span>
                <span className="font-mono text-emerald-400 font-bold">{record.reliability.completenessScore}/25</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Georreferencia</span>
                <span className="font-mono text-emerald-400 font-bold">{record.reliability.coordinatesScore}/20</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Consistencia</span>
                <span className="font-mono text-emerald-400 font-bold">{record.reliability.plausibilityScore}/15</span>
              </div>
            </div>

            {/* Validation Issues if any */}
            {record.issues && record.issues.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Advertencias Registradas:
                </span>
                {record.issues.map((iss, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-xl border flex items-center gap-2 text-[11px] ${
                      iss.severity === 'ERROR'
                        ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                        : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                    }`}
                  >
                    {iss.severity === 'ERROR' ? (
                      <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    )}
                    <span>{iss.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. GEOSPATIAL & TEMPORAL DETAILS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Temporal */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-slate-300 font-bold">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Fecha y Hora</span>
              </div>
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Fecha:</span>
                  <span className="font-mono font-bold text-white">{record.fecha}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hora:</span>
                  <span className="font-mono font-bold text-white">{record.hora} hrs</span>
                </div>
              </div>
            </div>

            {/* Georreferencia */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-slate-300 font-bold">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Ubicación Espacial</span>
              </div>
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Distrito:</span>
                  <span className="font-bold text-white">{record.distrito}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">WGS84:</span>
                  <span className="font-mono text-[11px] text-teal-400">
                    [{record.coordenadas[0]}, {record.coordenadas[1]}]
                  </span>
                </div>
                {record.utm && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">UTM 18S:</span>
                    <span className="font-mono text-[10px] text-cyan-400">
                      {record.utm.easting} E / {record.utm.northing} N
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* 4. INSTRUMENT & SOURCE METADATA */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-slate-300 font-bold">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Metadatos del Instrumento y Entidad</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-0.5">
                <span className="text-slate-400 block text-[10px]">Equipo Empleado:</span>
                <span className="font-bold text-white block">{record.equipo}</span>
                <span className="text-[10px] text-emerald-400 block">{record.tipoEquipo}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-0.5">
                <span className="text-slate-400 block text-[10px]">Fuente / Custodio:</span>
                <span className="font-bold text-white block">{record.fuente}</span>
                {record.certificadoCalibracion && (
                  <span className="text-[10px] text-teal-400 block">Certificado: {record.certificadoCalibracion}</span>
                )}
              </div>
            </div>

            {record.observaciones && (
              <div className="pt-1">
                <span className="text-[10px] text-slate-400 block mb-0.5">Observaciones de Campo:</span>
                <p className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80 text-slate-300 text-[11px] italic">
                  "{record.observaciones}"
                </p>
              </div>
            )}
          </div>

        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div>
            {onDeleteRecord && record.origen !== 'OFICIAL' && (
              <button
                type="button"
                onClick={() => {
                  onDeleteRecord(record.id);
                  onClose();
                }}
                className="px-3 py-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar Registro</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Cerrar Ficha
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
