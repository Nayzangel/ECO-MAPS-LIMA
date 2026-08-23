import React from 'react';
import { ThirteenFactorsSummary, FactorDetail } from '../../types/decisionEngine';
import { 
  MapPin, 
  Wind, 
  Gauge, 
  Ruler, 
  Calendar, 
  Radio, 
  Building2, 
  Scale, 
  ShieldAlert, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertOctagon,
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';

interface ThirteenFactorsGridProps {
  factors: ThirteenFactorsSummary;
  isInsufficient?: boolean;
}

const FACTOR_ICONS: Record<number, React.ElementType> = {
  1: MapPin,         // 1. Ubicación
  2: Wind,           // 2. Parámetro
  3: Gauge,          // 3. Medición
  4: Ruler,          // 4. Unidad
  5: Calendar,       // 5. Fecha
  6: Radio,          // 6. Fuente
  7: Building2,      // 7. Zonificación
  8: Scale,          // 8. Norma aplicable
  9: ShieldAlert,    // 9. Límite
  10: AlertOctagon,  // 10. Excedencia
  11: CheckCircle2,  // 11. Calidad del dato
  12: TrendingUp,    // 12. Tendencia
  13: Clock          // 13. Prioridad
};

export const ThirteenFactorsGrid: React.FC<ThirteenFactorsGridProps> = ({
  factors,
  isInsufficient = false
}) => {
  const factorsArray: FactorDetail[] = [
    factors.ubicacion,
    factors.parametro,
    factors.medicion,
    factors.unidad,
    factors.fecha,
    factors.fuente,
    factors.zonificacion,
    factors.normaAplicable,
    factors.limite,
    factors.excedencia,
    factors.calidadDato,
    factors.tendencia,
    factors.prioridad
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              Análisis Exhaustivo de los 13 Factores de Decisión
            </h4>
            <p className="text-[10px] text-slate-400">
              Evaluación multifactorial estandarizada según el protocolo ECO-MAP
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
          13 / 13 Factores Auditados
        </span>
      </div>

      {/* 13-FACTORS TILES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
        {factorsArray.map((factor) => {
          const Icon = FACTOR_ICONS[factor.id] || Info;
          
          let statusStyle = 'border-slate-800 bg-slate-950/60 text-slate-300';
          let badgeStyle = 'bg-slate-900 text-slate-400 border-slate-700';

          if (factor.status === 'CRITICO') {
            statusStyle = 'border-rose-500/40 bg-rose-950/20 text-rose-200';
            badgeStyle = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
          } else if (factor.status === 'ALERTA') {
            statusStyle = 'border-amber-500/40 bg-amber-950/20 text-amber-200';
            badgeStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
          } else if (factor.status === 'OPTIMO') {
            statusStyle = 'border-emerald-500/30 bg-emerald-950/20 text-emerald-200';
            badgeStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
          } else if (factor.status === 'INCOMPLETO') {
            statusStyle = 'border-rose-800/80 bg-rose-950/40 text-rose-400';
            badgeStyle = 'bg-rose-900 text-rose-300 border-rose-600';
          }

          return (
            <div 
              key={factor.id} 
              className={`p-3 rounded-2xl border transition-all hover:border-slate-600 space-y-2 flex flex-col justify-between ${statusStyle}`}
            >
              {/* Factor Header */}
              <div className="flex items-start justify-between gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-mono text-[10px] font-bold">
                    {factor.id}
                  </span>
                  <div className="flex items-center gap-1 text-slate-300 text-[11px] font-bold">
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{factor.name}</span>
                  </div>
                </div>

                {factor.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border font-semibold truncate max-w-[120px] ${badgeStyle}`}>
                    {factor.badge}
                  </span>
                )}
              </div>

              {/* Factor Main Value */}
              <div className="font-mono text-sm font-extrabold text-white break-words">
                {factor.value}
              </div>

              {/* Description / Audit Note */}
              <p className="text-[10px] text-slate-400 leading-tight border-t border-slate-900 pt-1.5">
                {factor.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
