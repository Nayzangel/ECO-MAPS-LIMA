import React from 'react';
import { 
  X, 
  AlertTriangle, 
  XCircle, 
  Wrench, 
  CheckCircle2, 
  MapPin, 
  Trash2, 
  RefreshCw,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { EnvironmentalRecord } from '../../types/environmentalData';
import { DataOriginBadge } from './DataOriginBadge';

interface ValidationIssuesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  records: EnvironmentalRecord[];
  onAutoFixAll: () => void;
  onRemoveDuplicates: () => void;
}

export const ValidationIssuesDrawer: React.FC<ValidationIssuesDrawerProps> = ({
  isOpen,
  onClose,
  records,
  onAutoFixAll,
  onRemoveDuplicates
}) => {
  if (!isOpen) return null;

  // Filter records that have warnings or errors
  const problematicRecords = records.filter(r => r.issues && r.issues.length > 0);

  // Group issue statistics
  const stats = {
    coordErrors: 0,
    missingData: 0,
    unitErrors: 0,
    duplicates: 0,
    anomalies: 0
  };

  problematicRecords.forEach(r => {
    r.issues.forEach(iss => {
      if (iss.type === 'COORDINATES_ERROR') stats.coordErrors++;
      if (iss.type === 'MISSING_DATA') stats.missingData++;
      if (iss.type === 'INVALID_UNIT') stats.unitErrors++;
      if (iss.type === 'DUPLICATE') stats.duplicates++;
      if (iss.type === 'ANOMALOUS_VALUE') stats.anomalies++;
    });
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200 text-xs">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* HEADER */}
        <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                Centro de Auditoría y Validación de Datos
              </h3>
              <p className="text-slate-400 text-xs">
                Detección automática de inconsistencias, anomalías, unidades y coordenadas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SUMMARY STATS GRID */}
        <div className="p-5 bg-slate-950/60 border-b border-slate-800 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Coords. Inválidas</span>
              <span className="font-mono font-extrabold text-rose-400 text-base">{stats.coordErrors}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Datos Incompletos</span>
              <span className="font-mono font-extrabold text-amber-400 text-base">{stats.missingData}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Unidades Inválidas</span>
              <span className="font-mono font-extrabold text-cyan-400 text-base">{stats.unitErrors}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Duplicados</span>
              <span className="font-mono font-extrabold text-indigo-400 text-base">{stats.duplicates}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Valores Anómalos</span>
              <span className="font-mono font-extrabold text-orange-400 text-base">{stats.anomalies}</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
            {stats.duplicates > 0 && (
              <button
                type="button"
                onClick={onRemoveDuplicates}
                className="px-3 py-1.5 rounded-xl bg-indigo-950 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Depurar Duplicados</span>
              </button>
            )}

            <button
              type="button"
              onClick={onAutoFixAll}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Saneamiento Automático de Unidades & Coordenadas</span>
            </button>
          </div>
        </div>

        {/* PROBLEMATIC RECORDS LIST */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3 custom-scrollbar">
          {problematicRecords.length === 0 ? (
            <div className="p-8 text-center space-y-2 bg-slate-950/40 rounded-3xl border border-slate-800">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-white font-bold">¡Base de Datos Sanitizada y Confiable!</h4>
              <p className="text-slate-400 text-[11px] max-w-md mx-auto">
                No se detectaron errores críticos en coordenadas, unidades, datos incompletos ni anomalías físicas.
              </p>
            </div>
          ) : (
            problematicRecords.map((r) => (
              <div key={r.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-2">
                  <div className="flex items-center gap-2">
                    <DataOriginBadge origin={r.origen} size="sm" />
                    <span className="font-mono text-slate-300 font-bold">{r.fecha} {r.hora}</span>
                    <span className="text-slate-400">({r.distrito})</span>
                  </div>

                  <span className="font-mono text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {r.parametro}: <strong>{r.valor} {r.unidad}</strong>
                  </span>
                </div>

                <div className="space-y-1">
                  {r.issues.map((iss, idx) => (
                    <div
                      key={idx}
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
                      <div>
                        <span className="font-bold">{iss.message}</span>
                        {iss.suggestedFix && (
                          <span className="block text-[10px] opacity-80">Sugerencia: {iss.suggestedFix}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl cursor-pointer"
          >
            Cerrar Panel
          </button>
        </div>

      </div>
    </div>
  );
};
