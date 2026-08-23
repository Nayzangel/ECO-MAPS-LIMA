import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle,
  Activity,
  Gauge
} from 'lucide-react';
import { ReliabilityBreakdown, ReliabilityTier } from '../../types/environmentalData';

interface ReliabilityBadgeProps {
  reliability: ReliabilityBreakdown;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TIER_CONFIG: Record<ReliabilityTier, {
  label: string;
  badgeClass: string;
  barColor: string;
  icon: React.ElementType;
  description: string;
}> = {
  ALTA: {
    label: 'Alta Confiabilidad',
    badgeClass: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300',
    barColor: 'bg-emerald-400',
    icon: CheckCircle2,
    description: 'Apto para fiscalización, auditoría y modelamiento oficial.'
  },
  MEDIA: {
    label: 'Confiable / Media',
    badgeClass: 'bg-amber-950/70 border-amber-500/40 text-amber-300',
    barColor: 'bg-amber-400',
    icon: Activity,
    description: 'Apto para diagnóstico territorial y monitoreo indicativo.'
  },
  BAJA: {
    label: 'Baja Confiabilidad',
    badgeClass: 'bg-orange-950/70 border-orange-500/40 text-orange-300',
    barColor: 'bg-orange-400',
    icon: AlertTriangle,
    description: 'Requiere calibración de equipo o validación de metadatos.'
  },
  RECHAZADO: {
    label: 'No Confiable / Rechazado',
    badgeClass: 'bg-rose-950/70 border-rose-500/40 text-rose-300',
    barColor: 'bg-rose-500',
    icon: XCircle,
    description: 'Presenta errores críticos en coordenadas, valores o unidades.'
  }
};

export const ReliabilityBadge: React.FC<ReliabilityBadgeProps> = ({
  reliability,
  showScore = true,
  size = 'md',
  className = ''
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tier = reliability?.tier || 'MEDIA';
  const score = reliability?.totalScore ?? 50;
  const config = TIER_CONFIG[tier] || TIER_CONFIG.MEDIA;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2'
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`inline-flex items-center rounded-xl border font-bold cursor-help transition-all select-none ${sizeClasses[size]} ${config.badgeClass}`}
      >
        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
        <span>{tier === 'RECHAZADO' ? 'Rechazado' : config.label}</span>
        {showScore && (
          <span className="font-mono px-1.5 py-0.2 rounded bg-slate-950/80 text-white text-[10px]">
            {score}%
          </span>
        )}
      </div>

      {/* DETAILED AUDIT TOOLTIP */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-slate-900/98 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl z-50 text-xs space-y-2 pointer-events-none animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <div className="flex items-center gap-1.5 text-white font-bold">
              <Gauge className="w-4 h-4 text-emerald-400" />
              <span>Índice de Confiabilidad</span>
            </div>
            <span className="font-mono text-emerald-400 font-extrabold text-sm">{score}/100</span>
          </div>

          <p className="text-[11px] text-slate-300 leading-snug">
            {config.description}
          </p>

          {/* Breakdown Score Bars */}
          <div className="space-y-1 text-[10px] pt-1">
            <div className="flex justify-between text-slate-400">
              <span>Equipo / Metrología (máx 35)</span>
              <span className="text-slate-200 font-mono">{reliability.equipmentScore}/35</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-blue-400 h-full rounded-full" style={{ width: `${(reliability.equipmentScore / 35) * 100}%` }} />
            </div>

            <div className="flex justify-between text-slate-400 pt-1">
              <span>Completitud de Campos (máx 25)</span>
              <span className="text-slate-200 font-mono">{reliability.completenessScore}/25</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${(reliability.completenessScore / 25) * 100}%` }} />
            </div>

            <div className="flex justify-between text-slate-400 pt-1">
              <span>Precisión Geoespacial (máx 20)</span>
              <span className="text-slate-200 font-mono">{reliability.coordinatesScore}/20</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-purple-400 h-full rounded-full" style={{ width: `${(reliability.coordinatesScore / 20) * 100}%` }} />
            </div>

            <div className="flex justify-between text-slate-400 pt-1">
              <span>Consistencia Física (máx 15)</span>
              <span className="text-slate-200 font-mono">{reliability.plausibilityScore}/15</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: `${(reliability.plausibilityScore / 15) * 100}%` }} />
            </div>
          </div>

          {reliability.reasons && reliability.reasons.length > 0 && (
            <div className="pt-1.5 border-t border-slate-800 text-[10px] text-slate-400">
              <span className="font-bold text-slate-300 block mb-0.5">Factores Clave:</span>
              <ul className="list-disc list-inside space-y-0.5">
                {reliability.reasons.map((r, i) => (
                  <li key={i} className="truncate">{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
