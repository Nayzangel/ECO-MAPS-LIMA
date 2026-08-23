import React from 'react';
import { DecisionClassification } from '../../types/decisionEngine';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  HelpCircle, 
  Sparkles, 
  Scale, 
  HeartPulse, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface ExplainabilityBannerProps {
  classification: DecisionClassification;
  explanation: {
    primaryStatement: string;
    keyDrivers: string[];
    riskSummary: string;
    regulatoryVerdict: string;
  };
  isInsufficient?: boolean;
}

export const ExplainabilityBanner: React.FC<ExplainabilityBannerProps> = ({
  classification,
  explanation,
  isInsufficient = false
}) => {
  if (isInsufficient) {
    return (
      <div className="p-5 rounded-3xl bg-slate-900 border-2 border-slate-700 space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase font-extrabold tracking-wider">
              Estado de Auditoría
            </span>
            <h3 className="text-base font-extrabold text-white">
              INFORMACIÓN INSUFICIENTE PARA DETERMINAR PRIORIDAD
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
          {explanation.primaryStatement}
        </p>

        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Datos Requeridos Faltantes:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {explanation.keyDrivers.map((driver, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono">
                ⚠️ {driver}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Styles for valid classifications
  const isCritical = classification === 'CRITICO';
  const isMedium = classification === 'MEDIO';

  const theme = isCritical
    ? {
        border: 'border-rose-500/50 bg-rose-950/25',
        badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        badgeText: 'CLASIFICACIÓN CRÍTICA',
        icon: ShieldAlert,
        iconColor: 'text-rose-400',
        accentText: 'text-rose-300',
        calloutBg: 'bg-rose-950/40 border-rose-500/30'
      }
    : isMedium
    ? {
        border: 'border-amber-500/50 bg-amber-950/25',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        badgeText: 'CLASIFICACIÓN MEDIA (ALERTA)',
        icon: AlertTriangle,
        iconColor: 'text-amber-400',
        accentText: 'text-amber-300',
        calloutBg: 'bg-amber-950/40 border-amber-500/30'
      }
    : {
        border: 'border-emerald-500/50 bg-emerald-950/25',
        badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        badgeText: 'CLASIFICACIÓN BAJA (CUMPLE)',
        icon: ShieldCheck,
        iconColor: 'text-emerald-400',
        accentText: 'text-emerald-300',
        calloutBg: 'bg-emerald-950/40 border-emerald-500/30'
      };

  const Icon = theme.icon;

  return (
    <div className={`p-5 sm:p-6 rounded-3xl border-2 space-y-4 shadow-xl relative overflow-hidden ${theme.border}`}>
      
      {/* HEADER WITH BADGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl border ${theme.calloutBg} ${theme.iconColor}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold border ${theme.badgeBg}`}>
                {theme.badgeText}
              </span>
              <span className="text-[10px] font-mono text-slate-400">Motor Explicable ECO-MAP</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white">
              Dictamen del Motor de Decisión Ambiental
            </h3>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>Explicabilidad Algorítmica</span>
        </div>
      </div>

      {/* CORE EXPLANATION NARRATIVE */}
      <div className={`p-4 sm:p-4.5 rounded-2xl border ${theme.calloutBg} space-y-2`}>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
          Fundamentación de la Clasificación:
        </span>
        <p className="text-sm font-semibold text-white leading-relaxed">
          {explanation.primaryStatement}
        </p>
      </div>

      {/* KEY DRIVERS CHIPS */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
          Factores Determinantes Clave:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {explanation.keyDrivers.map((driver, index) => (
            <div 
              key={index}
              className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-2 text-xs text-slate-300"
            >
              <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${theme.iconColor}`} />
              <span>{driver}</span>
            </div>
          ))}
        </div>
      </div>

      {/* HEALTH RISK & REGULATORY VERDICT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
        
        {/* Health Risk Box */}
        <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-1.5 text-rose-400 font-bold">
            <HeartPulse className="w-4 h-4" />
            <span>Impacto en Salud Pública Poblacional</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {explanation.riskSummary}
          </p>
        </div>

        {/* Regulatory Verdict Box */}
        <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-1.5 text-teal-400 font-bold">
            <Scale className="w-4 h-4" />
            <span>Dictamen Regulatorio & Fiscalización</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {explanation.regulatoryVerdict}
          </p>
        </div>

      </div>

    </div>
  );
};
