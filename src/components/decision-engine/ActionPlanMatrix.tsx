import React from 'react';
import { ActionPlanRecommendation, DecisionClassification } from '../../types/decisionEngine';
import { 
  Building, 
  Clock, 
  TrendingDown, 
  Scale, 
  DollarSign, 
  ShieldAlert, 
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface ActionPlanMatrixProps {
  plans: ActionPlanRecommendation[];
  classification: DecisionClassification;
}

export const ActionPlanMatrix: React.FC<ActionPlanMatrixProps> = ({
  plans,
  classification
}) => {
  if (plans.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              Plan de Acción y Fiscalización Institucional Recomendado
            </h4>
            <p className="text-[10px] text-slate-400">
              Protocolos de mitigación articulados entre OEFA, MINAM, ATU y Gobiernos Locales
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
          {plans.length} Medidas Priorizadas
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {plans.map((plan) => {
          let categoryBadge = 'bg-slate-900 text-slate-300 border-slate-700';
          if (plan.category === 'EMERGENCIA') categoryBadge = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
          if (plan.category === 'FISCALIZACION') categoryBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
          if (plan.category === 'URBANISMO') categoryBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
          if (plan.category === 'SALUD_PUBLICA') categoryBadge = 'bg-purple-500/20 text-purple-300 border-purple-500/40';

          return (
            <div
              key={plan.id}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded border font-bold uppercase ${categoryBadge}`}>
                    {plan.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    ID: {plan.id}
                  </span>
                </div>

                <h5 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {plan.title}
                </h5>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              {/* Action Metadata Details */}
              <div className="pt-2 border-t border-slate-900 space-y-1.5 text-[10px]">
                
                {/* Entidad Responsable */}
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1 font-medium">
                    <Building className="w-3 h-3 text-slate-500" /> Responsable:
                  </span>
                  <span className="font-bold text-slate-200 truncate max-w-[170px]">
                    {plan.responsibleEntity}
                  </span>
                </div>

                {/* Plazo de Ejecución */}
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-slate-500" /> Plazo sugerido:
                  </span>
                  <span className="font-mono font-bold text-teal-400">
                    &lt; {plan.executionWindowHours} horas
                  </span>
                </div>

                {/* Reducción esperada */}
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1 font-medium">
                    <TrendingDown className="w-3 h-3 text-emerald-500" /> Reducción proyectada:
                  </span>
                  <span className="font-mono font-bold text-emerald-400">
                    -{plan.expectedReductionPercent}%
                  </span>
                </div>

                {/* Base Legal */}
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1 font-medium">
                    <Scale className="w-3 h-3 text-slate-500" /> Marco Legal:
                  </span>
                  <span className="font-bold text-slate-300 truncate max-w-[170px]">
                    {plan.legalBasis}
                  </span>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
