import React from 'react';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  User, 
  Briefcase, 
  ArrowRight,
  Zap
} from 'lucide-react';

interface PricingPlansSectionProps {
  onOpenAnalysis: () => void;
}

export const PricingPlansSection: React.FC<PricingPlansSectionProps> = ({ onOpenAnalysis }) => {
  const plans = [
    {
      id: 'free',
      name: 'Plan Ciudadano',
      subtitle: 'Acceso Libre y Comunitario',
      icon: User,
      price: 'S/ 0',
      period: 'Gratis para siempre',
      description: 'Diseñado para vecinos, colectivos ambientales y ciudadanos interesados en la salud ambiental de su distrito.',
      features: [
        'Visualizador cartográfico semafórico de Lima',
        'Consulta de estaciones públicas (SENAMHI / DEMO)',
        'Índice INCA y recomendaciones de salud pública',
        'Alertas de superación de ECA para aire y ruido',
        'Modo Móvil y Web responsive'
      ],
      ctaText: 'Acceso Gratuito',
      isFeatured: false,
      buttonStyle: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
    },
    {
      id: 'pro',
      name: 'Plan Profesional Pro',
      subtitle: 'Para Consultores & Ingenieros Ambientales',
      icon: Briefcase,
      price: 'S/ 189',
      period: 'por usuario / mes (DEMO)',
      badge: 'MÁS RECOMENDADO',
      description: 'Herramientas de cálculo numérico, ingesta de monitoreos de campo y emisión instantánea de informes normativos.',
      features: [
        'Todo lo del Plan Ciudadano',
        'Ingesta ilimitada de datasets propios (CSV / GeoJSON)',
        'Simulador de Dispersión Gaussiana y Plumas de Humo',
        'Simulador de Ruido Acústico ISO 9613-2 por Zonas',
        'Generador de Informes Técnicos de Auditoría ECA',
        'Exportación de capas GIS en Shapefile y GeoJSON',
        'Contraste normativo automático D.S. 003 y 085'
      ],
      ctaText: 'Probar Modo Profesional',
      isFeatured: true,
      buttonStyle: 'bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/25'
    },
    {
      id: 'institutional',
      name: 'Plan Institucional & Municipal',
      subtitle: 'Para OEFA, MINAM, MML y Distritos',
      icon: Building2,
      price: 'Personalizado',
      period: 'Anual con SLA garantizado',
      description: 'Plataforma centralizada de inteligencia territorial para fiscalización, ordenamiento urbano y gestión del riesgo.',
      features: [
        'Todo lo del Plan Profesional',
        'Integración con servidores WMS / WFS y Catastro MML',
        'Módulo de Matriz de Priorización de Puntos Calientes',
        'Gestión multi-usuario para fiscalizadores ambientales',
        'Soporte técnico dedicado e inducción técnica',
        'Personalización de capas y umbrales normativos'
      ],
      ctaText: 'Contactar para Convenio',
      isFeatured: false,
      buttonStyle: 'bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30'
    }
  ];

  return (
    <section id="planes" className="py-20 bg-slate-900/40 border-b border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            Modelos de Acceso y Escalabilidad
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Planes adaptados a <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">cada perfil de decisión</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Desde la consulta vecinal abierta hasta la modelación avanzada para fiscalizadores y consultoras ambientales.
          </p>
        </div>

        {/* PLANS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all ${
                  plan.isFeatured
                    ? 'bg-slate-900/90 border-2 border-emerald-500 shadow-2xl shadow-emerald-950/50 -translate-y-2'
                    : 'bg-slate-900/50 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Featured Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-[10px] font-extrabold tracking-wider uppercase shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Plan Top */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-slate-800 text-emerald-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-slate-400 font-medium">{plan.subtitle}</span>
                    </div>

                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="pt-2 border-t border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-white font-mono">{plan.price}</span>
                      <span className="text-xs text-slate-400">/ {plan.period}</span>
                    </div>
                  </div>

                  {/* Feature list */}
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Incluye:
                    </div>
                    <ul className="space-y-2.5">
                      {plan.features.map((f, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-8 mt-auto">
                  <button
                    onClick={onOpenAnalysis}
                    className={`w-full py-3 text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${plan.buttonStyle}`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
