import React from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  Tv, 
  Cpu, 
  Sparkles,
  Info
} from 'lucide-react';
import { DataOrigin } from '../../types/environmentalData';

interface DataOriginBadgeProps {
  origin: DataOrigin;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
  className?: string;
}

export const ORIGIN_CONFIG: Record<DataOrigin, {
  label: string;
  shortLabel: string;
  description: string;
  badgeClass: string;
  icon: React.ElementType;
  iconColor: string;
}> = {
  OFICIAL: {
    label: 'DATO OFICIAL',
    shortLabel: 'OFICIAL',
    description: 'Entidades del Estado (SENAMHI, OEFA, DIGESA, MINAM) con equipos normativos.',
    badgeClass: 'bg-blue-950/80 text-blue-300 border-blue-500/40 shadow-blue-500/10',
    icon: ShieldCheck,
    iconColor: 'text-blue-400'
  },
  USUARIO: {
    label: 'DATO DEL USUARIO',
    shortLabel: 'USUARIO',
    description: 'Registros ingresados o subidos manualmente por el usuario en esta sesión.',
    badgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10',
    icon: UserCheck,
    iconColor: 'text-emerald-400'
  },
  DEMO: {
    label: 'DATO DEMO',
    shortLabel: 'DEMO',
    description: 'Datos de muestra precargados por la plataforma para demostración.',
    badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-500/40 shadow-amber-500/10',
    icon: Tv,
    iconColor: 'text-amber-400'
  },
  MODELADO: {
    label: 'DATO MODELADO',
    shortLabel: 'MODELADO',
    description: 'Resultados de modelos matemáticos y dispersión atmosférica (AERMOD, CALINE).',
    badgeClass: 'bg-purple-950/80 text-purple-300 border-purple-500/40 shadow-purple-500/10',
    icon: Cpu,
    iconColor: 'text-purple-400'
  },
  SIMULADO: {
    label: 'DATO SIMULADO',
    shortLabel: 'SIMULADO',
    description: 'Escenarios prospectivos predictivos (ej. Planes de Mitigación 2030).',
    badgeClass: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40 shadow-cyan-500/10',
    icon: Sparkles,
    iconColor: 'text-cyan-400'
  }
};

export const DataOriginBadge: React.FC<DataOriginBadgeProps> = ({
  origin,
  size = 'md',
  showDescription = false,
  className = ''
}) => {
  const config = ORIGIN_CONFIG[origin] || ORIGIN_CONFIG.USUARIO;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm gap-2 font-bold'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  return (
    <div className={`inline-flex flex-col ${className}`}>
      <span
        title={config.description}
        className={`inline-flex items-center rounded-xl border font-mono font-bold tracking-wider uppercase shadow-sm transition-all select-none ${sizeClasses[size]} ${config.badgeClass}`}
      >
        <Icon className={`${iconSizes[size]} ${config.iconColor} flex-shrink-0`} />
        <span>{size === 'sm' ? config.shortLabel : config.label}</span>
      </span>
      {showDescription && (
        <span className="text-[10px] text-slate-400 mt-1 max-w-xs leading-tight">
          {config.description}
        </span>
      )}
    </div>
  );
};
