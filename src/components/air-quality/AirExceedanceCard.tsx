import React from 'react';
import { ExceedanceAnalysisResult, AirNormativeStandard } from '../../types/airQuality';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Scale, 
  HeartPulse, 
  Building2, 
  FileText,
  Sparkles
} from 'lucide-react';

interface AirExceedanceCardProps {
  exceedance: ExceedanceAnalysisResult;
  meta: AirNormativeStandard;
  currentValue: number;
}

export const AirExceedanceCard: React.FC<AirExceedanceCardProps> = ({
  exceedance,
  meta,
  currentValue
}) => {
  const isExceeded = exceedance.isExceeded;

  let theme = {
    cardBg: 'bg-emerald-950/20 border-emerald-500/40',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    titleColor: 'text-emerald-400',
    icon: ShieldCheck,
    statusText: 'CONFORME AL ESTÁNDAR NACIONAL (ECA)'
  };

  if (exceedance.severityLevel === 'EPISODIO_CRITICO') {
    theme = {
      cardBg: 'bg-rose-950/30 border-rose-500/50 shadow-xl shadow-rose-500/10',
      badgeBg: 'bg-rose-500/30 text-rose-200 border-rose-500/50 animate-pulse',
      titleColor: 'text-rose-400',
      icon: AlertOctagon,
      statusText: 'EPISODIO CRÍTICO DE CONTAMINACIÓN'
    };
  } else if (exceedance.severityLevel === 'EXCEDENCIA_SEVERA') {
    theme = {
      cardBg: 'bg-rose-950/25 border-rose-500/40',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      titleColor: 'text-rose-400',
      icon: ShieldAlert,
      statusText: 'EXCEDENCIA SEVERA NORMATIVA'
    };
  } else if (exceedance.severityLevel === 'EXCEDENCIA_MODERADA') {
    theme = {
      cardBg: 'bg-amber-950/25 border-amber-500/40',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      titleColor: 'text-amber-400',
      icon: AlertTriangle,
      statusText: 'EXCEDENCIA MODERADA NORMATIVA'
    };
  } else if (exceedance.severityLevel === 'ALERTA_PREVENTIVA') {
    theme = {
      cardBg: 'bg-amber-950/20 border-amber-500/30',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      titleColor: 'text-amber-400',
      icon: AlertTriangle,
      statusText: 'ALERTA PREVENTIVA (CERCANO AL LÍMITE)'
    };
  }

  const Icon = theme.icon;

  return (
    <div className={`p-5 sm:p-6 rounded-3xl border-2 space-y-4 ${theme.cardBg}`}>
      
      {/* CARD HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white shadow-inner">
            <Icon className={`w-6 h-6 ${theme.titleColor}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold border ${theme.badgeBg}`}>
                {theme.statusText}
              </span>
              <span className="text-[10px] font-mono text-slate-400">Motor Normativo MINAM</span>
            </div>
            <h4 className="text-sm sm:text-base font-extrabold text-white">
              Dictamen de Excedencia para {meta.name}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs self-start sm:self-auto">
          <span className="text-slate-400">Límite Normativo:</span>
          <span className="px-2 py-1 bg-slate-900 rounded-lg border border-slate-800 font-bold text-white">
            {meta.ecaLimit} {meta.unit} ({meta.primaryTimeframe})
          </span>
        </div>
      </div>

      {/* METRIC COMPARISON STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 text-center font-mono">
        <div>
          <span className="text-[10px] text-slate-400 uppercase block font-sans font-semibold">Valor Registrado</span>
          <span className="text-lg font-black text-white">{currentValue} {meta.unit}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase block font-sans font-semibold">Magnitud de Exceso</span>
          <span className={`text-lg font-black ${isExceeded ? 'text-rose-400' : 'text-emerald-400'}`}>
            {isExceeded ? `+${exceedance.excessMagnitude} ${meta.unit}` : '0.0 (Dentro de ECA)'}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase block font-sans font-semibold">Porcentaje de Desvío</span>
          <span className={`text-lg font-black ${isExceeded ? 'text-rose-400' : 'text-emerald-400'}`}>
            {isExceeded ? `+${exceedance.excessPercentage}%` : 'Conforme'}
          </span>
        </div>
      </div>

      {/* ALERT & LEGAL ACTIONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        
        {/* Health Risk Box */}
        <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <HeartPulse className="w-4 h-4" />
            <span>Impacto en la Salud y Población Sensible</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            {meta.healthEffects}
          </p>
        </div>

        {/* Regulatory Action Box */}
        <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-teal-400 font-bold">
            <Scale className="w-4 h-4" />
            <span>Medida de Fiscalización & Protocolo Legal</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            {exceedance.regulatoryAction}
          </p>
          <div className="pt-1.5 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-400">
            <span>Base Legal: <strong>{meta.legalBasis}</strong></span>
            <span className="text-emerald-400 font-mono font-bold">Vigente</span>
          </div>
        </div>

      </div>

    </div>
  );
};
