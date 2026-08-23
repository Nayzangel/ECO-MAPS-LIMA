import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Activity, 
  MapPin, 
  Layers, 
  SlidersHorizontal, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle, 
  ShieldCheck, 
  ShieldAlert, 
  FileSpreadsheet, 
  Zap, 
  Building2, 
  Scale, 
  ArrowRight,
  Info
} from 'lucide-react';
import { DecisionInputPoint, DecisionEngineResult } from '../../types/decisionEngine';
import { runEnvironmentalDecisionEngine } from '../../utils/environmentalDecisionEngine';
import { PriorityScoreGauge } from '../decision-engine/PriorityScoreGauge';
import { ExplainabilityBanner } from '../decision-engine/ExplainabilityBanner';
import { ThirteenFactorsGrid } from '../decision-engine/ThirteenFactorsGrid';
import { ActionPlanMatrix } from '../decision-engine/ActionPlanMatrix';
import { ScenarioInterventionSimulator } from '../decision-engine/ScenarioInterventionSimulator';
import { LIMA_STATIONS_DEMO } from '../../data/demoData';

interface PresetScenario {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  point: DecisionInputPoint;
}

export const DecisionEngineSection: React.FC = () => {
  // Preset demo scenarios to demonstrate the decision engine capabilities
  const PRESETS: PresetScenario[] = useMemo(() => [
    {
      id: 'critico-sjl',
      name: 'San Juan de Lurigancho (Pico PM2.5)',
      badge: 'CASO CRÍTICO',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      point: {
        id: 'st-sjl-01',
        title: 'Estación SJL - San Juan de Lurigancho',
        district: 'San Juan de Lurigancho',
        address: 'Av. Wiesse alt. Paradero 12',
        coordinates: [-11.9822, -76.9989],
        parameter: 'PM2.5',
        value: 78.4,
        unit: 'µg/m³',
        date: '2026-08-23',
        time: '08:45',
        source: 'SENAMHI / Red Metropolitana',
        equipment: 'Analizador Beta Atenuación BAM-1020',
        zoneType: 'Residencial',
        reliabilityScore: 95,
        trend: 'EMPEORANDO',
        secondaryParameter: {
          name: 'Ruido Diurno',
          value: 71.2,
          unit: 'dBA'
        }
      }
    },
    {
      id: 'medio-ate',
      name: 'Ate Vitarte (Tránsito & Polvo)',
      badge: 'CASO ALERTA / MEDIO',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      point: {
        id: 'st-ate-01',
        title: 'Estación Ate - Carretera Central',
        district: 'Ate',
        address: 'Carretera Central Km 8.5',
        coordinates: [-12.0289, -76.9189],
        parameter: 'PM10',
        value: 112.5,
        unit: 'µg/m³',
        date: '2026-08-23',
        time: '11:15',
        source: 'OEFA / Red Vigilancia',
        equipment: 'Monitor Óptico Calibrado MetOne',
        zoneType: 'Comercial',
        reliabilityScore: 89,
        trend: 'ESTABLE',
        secondaryParameter: {
          name: 'Ruido Diurno',
          value: 68.0,
          unit: 'dBA'
        }
      }
    },
    {
      id: 'critico-ruido-san-isidro',
      name: 'San Isidro Hospitalario (Ruido Nocturno)',
      badge: 'PROTECCIÓN ESPECIAL',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      point: {
        id: 'st-si-ruido',
        title: 'Entorno Hospitalario Av. Guardia Civil',
        district: 'San Isidro',
        address: 'Av. Guardia Civil c/ Av. Javier Prado',
        coordinates: [-12.0964, -77.0215],
        parameter: 'Ruido Nocturno',
        value: 58.6,
        unit: 'dBA',
        date: '2026-08-23',
        time: '23:30',
        source: 'Sensor IoT Municipal Calibrado',
        equipment: 'Sonómetro Integrador Clase 1',
        zoneType: 'ProteccionEspecial',
        reliabilityScore: 91,
        trend: 'EMPEORANDO'
      }
    },
    {
      id: 'bajo-miraflores',
      name: 'Miraflores - Costa Verde (Cumplimiento Óptimo)',
      badge: 'CASO BAJO / CONFORME',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      point: {
        id: 'st-mf-01',
        title: 'Estación Malecón Miraflores',
        district: 'Miraflores',
        address: 'Malecón Cisneros / Parque del Amor',
        coordinates: [-12.1264, -77.0389],
        parameter: 'PM2.5',
        value: 16.2,
        unit: 'µg/m³',
        date: '2026-08-23',
        time: '14:00',
        source: 'SENAMHI / Red Costera',
        equipment: 'Analizador BAM-1020',
        zoneType: 'Residencial',
        reliabilityScore: 98,
        trend: 'MEJORANDO'
      }
    },
    {
      id: 'caso-insuficiente',
      name: 'Punto No Estandarizado (Datos Incompletos)',
      badge: 'INFO INSUFICIENTE',
      badgeColor: 'bg-slate-700 text-slate-300 border-slate-600',
      point: {
        id: 'st-incompleto',
        title: 'Muestra Informal sin Georreferenciación',
        district: 'Sector No Especificado',
        address: 'Calle desconocida',
        coordinates: undefined, // Simula coordenadas ausentes
        parameter: 'PM2.5',
        value: null, // Simula valor nulo
        unit: '',
        date: '',
        source: 'Origen anónimo no verificado',
        zoneType: 'Residencial'
      }
    }
  ], []);

  // Selected preset or custom active point
  const [selectedPresetId, setSelectedPresetId] = useState<string>('critico-sjl');
  const [customPoint, setCustomPoint] = useState<DecisionInputPoint>(PRESETS[0].point);

  // Tab mode
  const [activeTab, setActiveTab] = useState<'13FACTORES' | 'SIMULADOR' | 'ACCIONES'>('13FACTORES');

  // Handle preset selection
  const handleSelectPreset = (preset: PresetScenario) => {
    setSelectedPresetId(preset.id);
    setCustomPoint(preset.point);
  };

  // Run Decision Engine computation
  const decisionResult: DecisionEngineResult = useMemo(() => {
    return runEnvironmentalDecisionEngine(customPoint);
  }, [customPoint]);

  return (
    <section id="motor-decision" className="py-20 bg-slate-950 border-b border-slate-800 relative overflow-hidden">
      
      {/* BACKGROUND GLOW ACCENTS */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[200px] bg-teal-500/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative">
        
        {/* 1. SECTION HEADER (PRINCIPAL DIFERENCIADOR DE ECO-MAP) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              El Corazón Inteligente de ECO-MAP
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Motor de <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Decisión Ambiental</span>
            </h2>
            
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Transforme mediciones ambientales en <strong>decisiones públicas y corporativas auditables</strong>. 
              Al seleccionar cualquier punto, ECO-MAP analiza de forma automática los <strong>13 factores normativos, metrológicos y espaciales</strong>, 
              calcula el <strong>Environmental Priority Score (EPS)</strong> y emite una <strong>clasificación completamente explicable</strong> (🟢 BAJO, 🟡 MEDIO, 🔴 CRÍTICO o ⚪ INFORMACIÓN INSUFICIENTE).
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 self-start md:self-auto">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div className="text-[11px] leading-tight">
              <span className="font-bold text-white block">Marco Regulatorio Oficial</span>
              <span className="text-slate-400">D.S. 003-2017-MINAM & D.S. 085-2003-PCM</span>
            </div>
          </div>
        </div>

        {/* 2. SCENARIO PRESETS QUICK SELECTOR */}
        <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-400" />
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                Seleccione un Caso de Estudio Territorial para Evaluar el Motor:
              </h3>
            </div>
            <span className="text-[10px] text-slate-400">
              Evaluación automatizada en tiempo real
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    isSelected
                      ? 'bg-slate-850 border-emerald-400/80 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-400/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="space-y-1">
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border inline-block ${preset.badgeColor}`}>
                      {preset.badge}
                    </span>
                    <h4 className="text-xs font-bold text-white leading-tight">
                      {preset.name}
                    </h4>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-1 block">
                    {preset.point.parameter || 'Sin parámetro'}: {preset.point.value !== null && preset.point.value !== undefined ? `${preset.point.value} ${preset.point.unit}` : 'N/A'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. MAIN DASHBOARD: SNAPSHOT & ENVIRONMENTAL PRIORITY SCORE (EPS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: POINT SNAPSHOT INSPECTOR */}
          <div className="lg:col-span-4 p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-extrabold uppercase">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Inspección de Punto</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {decisionResult.pointSnapshot.date || 'Sin fecha'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-white leading-tight">
                  {decisionResult.pointSnapshot.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {decisionResult.pointSnapshot.district} • {decisionResult.pointSnapshot.zoneType}
                </p>
              </div>

              {/* Geo & Metrology info */}
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Coordenadas:</span>
                  <span className="text-slate-300 font-bold">
                    {customPoint.coordinates 
                      ? `[${customPoint.coordinates[0].toFixed(4)}°, ${customPoint.coordinates[1].toFixed(4)}°]` 
                      : 'No registradas'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">UTM 18S:</span>
                  <span className="text-teal-400 font-bold">
                    {decisionResult.pointSnapshot.utm18s}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Fuente:</span>
                  <span className="text-slate-300 truncate max-w-[140px]">
                    {decisionResult.pointSnapshot.source}
                  </span>
                </div>
              </div>
            </div>

            {/* Parameter Measurement Highlight */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Agente Evaluado: {decisionResult.pointSnapshot.parameter}
              </span>
              <div className="text-3xl font-mono font-black text-white">
                {decisionResult.pointSnapshot.measuredValue}{' '}
                <span className="text-sm font-normal text-slate-400">{decisionResult.pointSnapshot.unit}</span>
              </div>
              <span className="text-[10px] text-slate-400 block pt-1 border-t border-slate-800">
                Auditoría algorítmica completada por el motor de decisión.
              </span>
            </div>
          </div>

          {/* RIGHT: PRIORITY SCORE GAUGE */}
          <div className="lg:col-span-8">
            <PriorityScoreGauge
              score={decisionResult.eps}
              classification={decisionResult.classification}
            />
          </div>

        </div>

        {/* 4. THE EXPLAINABILITY CORE (OBLIGATORIO: "Este punto fue clasificado como... porque...") */}
        <ExplainabilityBanner
          classification={decisionResult.classification}
          explanation={decisionResult.explanation}
          isInsufficient={!decisionResult.isSufficient}
        />

        {/* 5. INTERACTIVE VIEW TABS (13 Factores, Simulador "¿Qué pasaría si...?", Planes de Acción) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Módulos de Auditoría & Intervención Avanzada
              </h3>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab('13FACTORES')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === '13FACTORES'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Los 13 Factores Auditados</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('SIMULADOR')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'SIMULADOR'
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-extrabold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Simulador "¿Qué pasaría si...?"</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ACCIONES')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'ACCIONES'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-extrabold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Planes de Acción Institucional</span>
              </button>
            </div>
          </div>

          {/* DYNAMIC CONTENT PER TAB */}
          {activeTab === '13FACTORES' && (
            <ThirteenFactorsGrid
              factors={decisionResult.factors}
              isInsufficient={!decisionResult.isSufficient}
            />
          )}

          {activeTab === 'SIMULADOR' && (
            <ScenarioInterventionSimulator
              basePoint={customPoint}
              baseResult={decisionResult}
            />
          )}

          {activeTab === 'ACCIONES' && (
            <ActionPlanMatrix
              plans={decisionResult.actionPlans}
              classification={decisionResult.classification}
            />
          )}
        </div>

      </div>
    </section>
  );
};
