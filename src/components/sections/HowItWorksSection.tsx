import React, { useState } from 'react';
import { 
  Database, 
  Cpu, 
  Scale, 
  BarChart2, 
  Flame, 
  CheckSquare, 
  FileText, 
  ArrowRight, 
  Sparkles,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const pipelineSteps = [
    {
      id: 'datos',
      stepNumber: '01',
      title: 'DATOS',
      subtitle: 'Ingesta & Homogenización',
      icon: Database,
      color: 'from-emerald-500 to-teal-500',
      badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      description: 'Captura continua de datos de redes oficiales (SENAMHI, OEFA, DIGESA), sensores IoT de bajo costo y monitoreos propios del usuario.',
      outputExample: 'Series temporales georreferenciadas de PM2.5, PM10, LAeqT (dBA), meteorología y metadatos de fuente.'
    },
    {
      id: 'analisis',
      stepNumber: '02',
      title: 'ANÁLISIS',
      subtitle: 'Tratamiento Geoespacial & Estadístico',
      icon: Cpu,
      color: 'from-teal-500 to-cyan-500',
      badgeColor: 'text-teal-400 border-teal-500/30 bg-teal-500/10',
      description: 'Interpolación espacial IDW, correlación multivariable de vientos, identificación de cañones urbanos y picos horarios.',
      outputExample: 'Superficie de calor continuo y mapa de isófonas acústicas para Lima Metropolitana.'
    },
    {
      id: 'normativa',
      stepNumber: '03',
      title: 'NORMATIVA',
      subtitle: 'Motor de Compliance Ambiental Peruano',
      icon: Scale,
      color: 'from-cyan-500 to-blue-500',
      badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
      description: 'Cotejo automatizado en tiempo real contra los ECA para Aire (D.S. 003-2017-MINAM), ECA para Ruido (D.S. 085-2003-PCM) y zonificación.',
      outputExample: 'Cálculo de porcentaje de superación (% sobre el umbral legal) y tipificación de la zona afectada.'
    },
    {
      id: 'resultado',
      stepNumber: '04',
      title: 'RESULTADO',
      subtitle: 'Índice de Severidad & Diagnóstico',
      icon: BarChart2,
      color: 'from-blue-500 to-indigo-500',
      badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      description: 'Generación del diagnóstico ambiental con índice INCA (Bueno, Moderado, Malo, Cuidado) y calificación del nivel de exposición.',
      outputExample: 'Diagnóstico: Severidad Nivel 4 en San Juan de Lurigancho por resuspensión vial e inversión térmica.'
    },
    {
      id: 'prioridad',
      stepNumber: '05',
      title: 'PRIORIDAD',
      subtitle: 'Matriz de Riesgo Multi-Criterio',
      icon: Flame,
      color: 'from-indigo-500 to-violet-500',
      badgeColor: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
      description: 'Cálculo de vulnerabilidad poblacional cruzando densidad demográfica, presencia de colegios/hospitales y duración del evento.',
      outputExample: 'Clasificación de "Punto Caliente Crítico" (Hotspot Prioritario N° 1 del distrito).'
    },
    {
      id: 'decision',
      stepNumber: '06',
      title: 'DECISIÓN',
      subtitle: 'Catálogo de Acciones de Mitigación',
      icon: CheckSquare,
      color: 'from-violet-500 to-purple-500',
      badgeColor: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
      description: 'Propuesta automática de medidas concretas de gestión: desvío vehicular, fiscalización industrial, alertas sanitarias y arborización.',
      outputExample: 'Plan de acción en 3 niveles: Inmediato (alerta escolar), Corto Plazo (desvío pesado) y Estratégico (barrera verde).'
    },
    {
      id: 'informe',
      stepNumber: '07',
      title: 'INFORME',
      subtitle: 'Ficha Técnica Exportable',
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      description: 'Generación instantánea del informe técnico oficial con gráficos, mapas capturados, dictamen legal y metadatos de las fuentes.',
      outputExample: 'Reporte PDF formal listo para auditorías de OEFA, Gobiernos Locales, MINAM o consultoría privada.'
    }
  ];

  const currentStep = pipelineSteps[activeStep];
  const StepIcon = currentStep.icon;

  return (
    <section id="como-funciona" className="py-20 bg-slate-950 border-b border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Flujo de Inteligencia Integral
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            ¿Cómo transforma ECO-MAP <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">los datos en decisiones</span>?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Arquitectura de decisión estructurada en 7 etapas para convertir datos ambientales dispersos en resoluciones técnicas y planes de mitigación respaldados por la normativa peruana.
          </p>
        </div>

        {/* PIPELINE NAVIGATION BAR (DESKTOP) */}
        <div className="hidden lg:grid grid-cols-7 gap-2 bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
          {pipelineSteps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-xl transition-all flex flex-col items-center gap-1.5 cursor-pointer text-center relative ${
                  isSelected
                    ? 'bg-slate-800 border border-slate-700 shadow-md'
                    : 'hover:bg-slate-800/50'
                }`}
              >
                <span className="text-[10px] font-mono text-slate-500 font-bold">{step.stepNumber}</span>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${step.color} text-slate-950`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white tracking-wide">{step.title}</span>
              </button>
            );
          })}
        </div>

        {/* PIPELINE SELECTOR FOR MOBILE */}
        <div className="flex lg:hidden overflow-x-auto gap-2 pb-2">
          {pipelineSteps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeStep === idx
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              {step.stepNumber}. {step.title}
            </button>
          ))}
        </div>

        {/* ACTIVE STEP SPOTLIGHT CARD */}
        <div className="glass-card p-6 sm:p-10 rounded-3xl border border-slate-800 relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* LEFT DETAILS */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="flex items-center gap-3">
                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${currentStep.badgeColor}`}>
                  ETAPA {currentStep.stepNumber}
                </span>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  {currentStep.subtitle}
                </span>
              </div>

              <h3 className="text-3xl font-extrabold text-white tracking-tight">
                {currentStep.title}
              </h3>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {currentStep.description}
              </p>

              {/* Real World Example in Lima */}
              <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800 space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Salida Concreta en Lima:
                </span>
                <p className="text-xs text-slate-300 font-mono">
                  {currentStep.outputExample}
                </p>
              </div>

              {/* Navigation controls */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                  Anterior
                </button>
                <button
                  disabled={activeStep === pipelineSteps.length - 1}
                  onClick={() => setActiveStep(prev => Math.min(pipelineSteps.length - 1, prev + 1))}
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                  Siguiente Etapa
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* RIGHT VISUAL EMBLEM */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center p-6 text-center space-y-4 shadow-2xl">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${currentStep.color} flex items-center justify-center shadow-lg shadow-emerald-500/20`}>
                  <StepIcon className="w-10 h-10 text-slate-950" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-400 uppercase">Módulo Activo</div>
                  <div className="text-lg font-extrabold text-white">{currentStep.title}</div>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  ECO-MAP LIMA DECISION ENGINE v1.0
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
