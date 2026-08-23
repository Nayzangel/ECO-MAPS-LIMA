import React from 'react';
import { 
  X, 
  FileText, 
  Volume2, 
  ShieldCheck, 
  AlertTriangle, 
  Printer, 
  MapPin, 
  Clock, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Building, 
  Layers,
  Scale,
  Activity,
  Award,
  Radio
} from 'lucide-react';
import { NoiseMeasurementRecord } from '../../types/noiseQuality';
import { PERUVIAN_NOISE_NORMATIVE } from '../../utils/noiseNormative';

interface NoiseTechnicalDossierModalProps {
  record: NoiseMeasurementRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenDecisionEngine?: (record: NoiseMeasurementRecord) => void;
}

export const NoiseTechnicalDossierModal: React.FC<NoiseTechnicalDossierModalProps> = ({
  record,
  isOpen,
  onClose,
  onOpenDecisionEngine
}) => {
  if (!isOpen || !record) return null;

  const zoneInfo = PERUVIAN_NOISE_NORMATIVE[record.zoneType] || PERUVIAN_NOISE_NORMATIVE.Residencial;
  const isExceeded = record.isExceeding;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8 space-y-0">
        
        {/* MODAL HEADER */}
        <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700 uppercase">
                  FICHA TÉCNICA OFICIAL DE MONITOREO ACÚSTICO
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  ID: {record.id}
                </span>
              </div>
              <h2 className="text-xl font-black text-white mt-1">
                {record.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Imprimir / Exportar a PDF"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Imprimir Ficha</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar text-xs">
          
          {/* 1: LEGAL NORMATIVE & COMPLIANCE SUMMARY BANNER */}
          <div className={`p-5 rounded-3xl border ${
            isExceeded 
              ? 'bg-rose-950/40 border-rose-500/50' 
              : 'bg-emerald-950/40 border-emerald-500/50'
          } flex flex-col md:flex-row md:items-center justify-between gap-4`}>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950/80 text-white font-mono">
                  {record.applicableNorm}
                </span>
                <span className="text-xs font-bold text-slate-300">
                  Horario: {record.determinedPeriod} ({record.time})
                </span>
              </div>
              <h3 className="text-lg font-black text-white">
                Dictamen: {isExceeded ? '⚠️ EXCEDENCIA DEL ESTÁNDAR DE CALIDAD AMBIENTAL' : '✓ CONFORME CON EL ESTÁNDAR ECA'}
              </h3>
              <p className="text-xs text-slate-300">
                Zonificación Evaluada: <strong>{zoneInfo.title}</strong> • Límite Normativo Máximo: <strong>{record.ecaLimit} dBA</strong>
              </p>
            </div>

            <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-6 shrink-0">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Nivel LAeq Registrado</span>
                <span className="text-2xl font-mono font-black text-white">{record.laeq} dBA</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Exceso / Desvío</span>
                <span className={`text-2xl font-mono font-black ${isExceeded ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {isExceeded ? `+${record.exceedanceDb.toFixed(1)} dB` : `${record.exceedanceDb.toFixed(1)} dB`}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Prioridad Fiscalización</span>
                <span className={`px-2 py-0.5 rounded-lg text-xs font-black font-mono inline-block mt-1 ${
                  record.priority === 'CRITICA' ? 'bg-rose-500 text-slate-950' :
                  record.priority === 'ALTA' ? 'bg-amber-500 text-slate-950' :
                  record.priority === 'MODERADA' ? 'bg-yellow-400 text-slate-950' : 'bg-emerald-500 text-slate-950'
                }`}>
                  {record.priority}
                </span>
              </div>
            </div>
          </div>

          {/* 2: GEOGRAPHIC & SPATIAL DATA */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              1. Georreferenciación & Ubicación Espacial
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-slate-300">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Distrito / Jurisdicción:</span>
                <span className="font-bold text-white text-sm">{record.district}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Dirección / Referencia:</span>
                <span className="font-semibold text-slate-200">{record.address}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Coordenadas WGS84:</span>
                <span className="font-mono text-cyan-300">{record.coordinates[0].toFixed(5)}, {record.coordinates[1].toFixed(5)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Zona UTM (WGS84 18S):</span>
                <span className="font-mono text-slate-200">{record.utmZone || '18S 281450m E 8675400m N'}</span>
              </div>
            </div>
          </div>

          {/* 3: ACOUSTIC PARAMETERS TABLE */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4" />
              2. Parámetros Acústicos de Presión Sonora Registrados
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">LAeq (Continuo Equivalente)</span>
                <span className="text-xl font-mono font-black text-cyan-300">{record.laeq} <span className="text-xs font-normal text-slate-400">dBA</span></span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Nivel energético integrado</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">LAFmax (Nivel Máximo Fast)</span>
                <span className="text-xl font-mono font-black text-amber-300">{record.lafmax} <span className="text-xs font-normal text-slate-400">dBA</span></span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Pico instantáneo ponderado A</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">LAFmin (Nivel Mínimo Fast)</span>
                <span className="text-xl font-mono font-black text-teal-300">{record.lafmin} <span className="text-xs font-normal text-slate-400">dBA</span></span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Valle sonoro del muestreo</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">LCpeak (Nivel Pico C)</span>
                <span className={`text-xl font-mono font-black ${record.lcpeak >= 135 ? 'text-rose-400' : 'text-rose-300'}`}>
                  {record.lcpeak} <span className="text-xs font-normal text-slate-400">dBC</span>
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Impulsividad de la fuente</span>
              </div>
            </div>

            {/* STATISTICAL PERCENTILES */}
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between flex-wrap gap-3 font-mono text-xs">
              <span className="text-slate-400 font-bold uppercase font-sans text-[11px]">Niveles Estadísticos Percentiles:</span>
              <div><span className="text-slate-400">L10 (Tráfico):</span> <strong className="text-amber-300">{record.statistical?.l10 || (record.laeq + 3.5).toFixed(1)} dBA</strong></div>
              <div><span className="text-slate-400">L50 (Mediana):</span> <strong className="text-cyan-300">{record.statistical?.l50 || (record.laeq - 1.0).toFixed(1)} dBA</strong></div>
              <div><span className="text-slate-400">L90 (Fondo):</span> <strong className="text-teal-300">{record.statistical?.l90 || (record.laeq - 6.0).toFixed(1)} dBA</strong></div>
              <div><span className="text-slate-400">Duración Muestreo:</span> <strong className="text-white">{record.durationMinutes} min</strong></div>
            </div>
          </div>

          {/* 4: METROLOGY & CALIBRATION CHAIN */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              3. Metrología, Instrumentación & Trazabilidad de Calibración
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Sonómetro Integrador</div>
                <div className="font-bold text-white text-sm">{record.equipment}</div>
                <div className="text-slate-400 flex items-center gap-2">
                  <span>Clase: <strong className="text-cyan-300">{record.equipmentClass}</strong></span>
                  <span>•</span>
                  <span>N° Serie: <strong className="text-slate-200">{record.equipmentSerial}</strong></span>
                </div>
              </div>

              <div className="space-y-1.5 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Calibrador Acústico</span>
                  <span className={`text-[9px] font-mono px-2 py-0.2 rounded font-bold ${
                    record.calibration.isCalibrationValid ? 'bg-emerald-950 text-emerald-300 border border-emerald-600' : 'bg-rose-950 text-rose-300 border border-rose-600'
                  }`}>
                    {record.calibration.isCalibrationValid ? 'CALIBRACIÓN VÁLIDA' : 'DERIVA EXCESIVA'}
                  </span>
                </div>
                <div className="font-bold text-white text-xs">{record.calibration.calibratorModel}</div>
                <div className="text-[11px] text-slate-300 grid grid-cols-3 gap-2 font-mono pt-1">
                  <div>Pre: <strong>{record.calibration.preCalibrationDb} dB</strong></div>
                  <div>Post: <strong>{record.calibration.postCalibrationDb} dB</strong></div>
                  <div>Δ Deriva: <strong className="text-cyan-300">{record.calibration.deltaCalibrationDb} dB</strong> (≤0.5)</div>
                </div>
                <div className="text-[10px] text-slate-400">
                  Certificado: {record.calibration.calibrationCertificateNumber} (Vence: {record.calibration.calibrationExpiryDate})
                </div>
              </div>
            </div>
          </div>

          {/* 5: SOURCE CHARACTERIZATION & FIELD OBSERVATIONS */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <h4 className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4" />
              4. Caracterización de Fuentes & Observaciones de Campo
            </h4>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold">Categoría Dominante:</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold">{record.sourceCategory}</span>
              </div>
              <p className="text-slate-300">{record.sourceDescription}</p>
              {record.notes && (
                <div className="pt-2 border-t border-slate-800 text-slate-400 italic">
                  <strong>Notas del Fiscalizador:</strong> {record.notes}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            Responsable: <strong>{record.operatorName || 'Auditor Ambiental ECO-MAP'}</strong> • {record.entityName || 'Red de Vigilancia'}
          </div>

          <div className="flex items-center gap-2">
            {onOpenDecisionEngine && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenDecisionEngine(record);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 text-xs font-black shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Auditar en Motor de Decisión</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
