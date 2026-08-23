import React, { useState } from 'react';
import { 
  Flame, 
  Layers, 
  Plus, 
  Navigation, 
  Grid, 
  Table, 
  Calculator, 
  Sparkles, 
  ShieldCheck, 
  Download,
  MapPin,
  FileSpreadsheet
} from 'lucide-react';
import { AnyEmissionSource, StackPointSource, RoadwayLineSource, SurfaceAreaSource } from '../../types/emissionSources';
import { 
  OFFICIAL_STACK_SOURCES, 
  OFFICIAL_LINE_SOURCES, 
  OFFICIAL_AREA_SOURCES 
} from '../../data/emissionSourcesData';
import { PlumeRiseCalculatorWidget } from '../emission-sources/PlumeRiseCalculatorWidget';
import { EmissionInventoryTable } from '../emission-sources/EmissionInventoryTable';
import { StackSourceModal } from '../emission-sources/StackSourceModal';
import { LineSourceModal } from '../emission-sources/LineSourceModal';
import { AreaSourceModal } from '../emission-sources/AreaSourceModal';

interface EmissionSourcesSectionProps {
  onSelectSourceForMap?: (sourceId: string) => void;
}

type TabMode = 'INVENTARIO_FUENTES' | 'CALCULADORA_BRIGGS' | 'FUENTES_PUNTUALES' | 'FUENTES_LINEALES' | 'FUENTES_AREA';

export const EmissionSourcesSection: React.FC<EmissionSourcesSectionProps> = ({
  onSelectSourceForMap
}) => {
  const [sources, setSources] = useState<AnyEmissionSource[]>(() => {
    try {
      const stored = localStorage.getItem('ecomap_emission_sources');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [
            ...OFFICIAL_STACK_SOURCES,
            ...OFFICIAL_LINE_SOURCES,
            ...OFFICIAL_AREA_SOURCES,
            ...parsed.filter((p: any) => p.isUserAdded)
          ];
        }
      }
    } catch (e) {
      console.warn('Error reading stored emission sources', e);
    }
    return [
      ...OFFICIAL_STACK_SOURCES,
      ...OFFICIAL_LINE_SOURCES,
      ...OFFICIAL_AREA_SOURCES
    ];
  });

  const [activeTab, setActiveTab] = useState<TabMode>('INVENTARIO_FUENTES');
  
  // Modals
  const [isStackModalOpen, setIsStackModalOpen] = useState(false);
  const [isLineModalOpen, setIsLineModalOpen] = useState(false);
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);

  const handleAddSource = (newSrc: AnyEmissionSource) => {
    setSources(prev => {
      const updated = [newSrc, ...prev];
      try {
        const userOnly = updated.filter(s => s.isUserAdded);
        localStorage.setItem('ecomap_emission_sources', JSON.stringify(userOnly));
      } catch (e) {
        console.error('Error saving emission source', e);
      }
      return updated;
    });
  };

  const stackCount = sources.filter(s => s.type === 'PUNTUAL_CHIMENEA').length;
  const lineCount = sources.filter(s => s.type === 'LINEAL_VIA').length;
  const areaCount = sources.filter(s => s.type === 'AREA_SUPERFICIAL').length;

  return (
    <section id="fuentes-emision" className="py-20 bg-slate-950 text-white relative overflow-hidden border-t border-slate-800">
      
      {/* BACKGROUND AMBIENT GLOW */}
      <div className="absolute top-1/3 right-1/4 w-[700px] h-[350px] bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[300px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-800">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-4 h-4" /> Módulo de Fuentes de Emisión & Chimeneas Industriales
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-rose-400 bg-clip-text text-transparent">
              Inventario de Fuentes Puntuales, Lineales y de Área
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Caracterización físico-química y termodinámica de fuentes de emisión atmosférica. Validación de altura, diámetro, velocidad, temperatura y caudal volumétrico de chimeneas con cálculo de elevación de penacho (Briggs) y verificación de Límites Máximos Permisibles (LMP) normativos.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsStackModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/20 transition transform active:scale-95"
            >
              <Plus className="w-4 h-4" /> + Chimenea
            </button>
            <button
              onClick={() => setIsLineModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition transform active:scale-95"
            >
              <Plus className="w-4 h-4" /> + Vía Lineal
            </button>
            <button
              onClick={() => setIsAreaModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition transform active:scale-95"
            >
              <Plus className="w-4 h-4" /> + Área Difusa
            </button>
          </div>
        </div>

        {/* METRICS STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">Fuentes Puntuales (Stacks)</span>
              <div className="text-xl font-extrabold text-white font-mono">{stackCount} Chimeneas</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">Fuentes Lineales (Vías)</span>
              <div className="text-xl font-extrabold text-white font-mono">{lineCount} Corredores</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Grid className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">Fuentes de Área (Superficies)</span>
              <div className="text-xl font-extrabold text-white font-mono">{areaCount} Áreas Difusas</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">Validación Normativa</span>
              <div className="text-xs font-bold text-emerald-400">100% Coherencia Física</div>
            </div>
          </div>

        </div>

        {/* NAVIGATION TABS */}
        <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('INVENTARIO_FUENTES')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'INVENTARIO_FUENTES'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Table className="w-4 h-4" /> Inventario Consolidado de Fuentes ({sources.length})
          </button>

          <button
            onClick={() => setActiveTab('CALCULADORA_BRIGGS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'CALCULADORA_BRIGGS'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Calculator className="w-4 h-4" /> Simulador Briggs (Elevación de Penacho $\Delta h$)
          </button>
        </div>

        {/* TAB CONTENTS */}
        {activeTab === 'INVENTARIO_FUENTES' && (
          <div className="space-y-6">
            <EmissionInventoryTable
              sources={sources}
              onOpenStackModal={() => setIsStackModalOpen(true)}
              onOpenLineModal={() => setIsLineModalOpen(true)}
              onOpenAreaModal={() => setIsAreaModalOpen(true)}
            />
            <PlumeRiseCalculatorWidget />
          </div>
        )}

        {activeTab === 'CALCULADORA_BRIGGS' && (
          <div className="space-y-6">
            <PlumeRiseCalculatorWidget />
          </div>
        )}

      </div>

      {/* MODALS */}
      <StackSourceModal
        isOpen={isStackModalOpen}
        onClose={() => setIsStackModalOpen(false)}
        onAddSource={handleAddSource}
      />

      <LineSourceModal
        isOpen={isLineModalOpen}
        onClose={() => setIsLineModalOpen(false)}
        onAddSource={handleAddSource}
      />

      <AreaSourceModal
        isOpen={isAreaModalOpen}
        onClose={() => setIsAreaModalOpen(false)}
        onAddSource={handleAddSource}
      />

    </section>
  );
};
