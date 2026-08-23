import React, { useState } from 'react';
import { 
  Activity, 
  Layers, 
  Wind, 
  Volume2, 
  Cpu, 
  Database, 
  HelpCircle, 
  CreditCard, 
  PhoneCall, 
  Menu, 
  X, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Compass, 
  FileText,
  CloudSun,
  Flame
} from 'lucide-react';
import { ViewMode } from '../../types';

interface NavbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onOpenMap: () => void;
  onOpenAnalysis: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  onOpenMap,
  onOpenAnalysis
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Inicio', href: '#hero', icon: Compass },
    { name: 'Mapa GIS', href: '#mapa', icon: MapPin },
    { name: 'Motor Decisión', href: '#motor-decision', icon: Sparkles },
    { name: 'Datos Ambientales', href: '#datos-ambientales', icon: Database },
    { name: 'Calidad del Aire', href: '#aire', icon: Wind },
    { name: 'Ruido Ambiental', href: '#ruido', icon: Volume2 },
    { name: 'Meteorología', href: '#meteorologia', icon: CloudSun },
    { name: 'Fuentes Emisión', href: '#fuentes-emision', icon: Flame },
    { name: 'Modelamiento', href: '#modelamiento', icon: Cpu },
    { name: 'Fuentes Oficiales', href: '#fuentes', icon: Layers },
    { name: 'Planes', href: '#planes', icon: CreditCard },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO ECO-MAP */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <div className="relative">
                  <Activity className="w-6 h-6 text-emerald-400 transform group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  ECO-MAP
                </span>
                <span className="text-xs px-1.5 py-0.5 font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-md">
                  LIMA
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                Inteligencia Ambiental Territorial
              </span>
            </div>
          </a>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-emerald-400 hover:bg-slate-900/60 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Icon className="w-3.5 h-3.5 opacity-70" />
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* ACTIONS & VIEW SWITCHER */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* View Mode Toggle: Ciudadano vs Profesional */}
            <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('ciudadano')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'ciudadano'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Vista simplificada con semáforos y recomendaciones de salud pública"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Ciudadano
              </button>
              <button
                type="button"
                onClick={() => setViewMode('profesional')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'profesional'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Vista técnica con parámetros ECA, concentraciones numéricas y herramientas GIS"
              >
                <Layers className="w-3.5 h-3.5" />
                Profesional
              </button>
            </div>

            {/* Quick Map Button */}
            <button
              onClick={onOpenMap}
              className="px-3.5 py-2 text-xs font-bold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all flex items-center gap-2 hover:border-emerald-500/50 shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Explorar Mapa
            </button>

            {/* Quick Analysis Button */}
            <button
              onClick={onOpenAnalysis}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 flex items-center gap-2 transform active:scale-95"
            >
              <Activity className="w-3.5 h-3.5" />
              Iniciar Análisis
            </button>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl"
              aria-label="Abrir Menú"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE EXPANDED MENU */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs text-slate-400 font-semibold uppercase">Modo de Visualización:</span>
            <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => { setViewMode('ciudadano'); }}
                className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                  viewMode === 'ciudadano' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                Ciudadano
              </button>
              <button
                type="button"
                onClick={() => { setViewMode('profesional'); }}
                className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                  viewMode === 'profesional' ? 'bg-cyan-600 text-white' : 'text-slate-400'
                }`}
              >
                Profesional
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2.5 text-xs font-medium text-slate-300 hover:text-emerald-400 bg-slate-900/60 rounded-lg flex items-center gap-2"
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  {link.name}
                </a>
              );
            })}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenMap();
              }}
              className="w-full py-2.5 text-xs font-bold text-slate-200 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              Explorar Mapa Interactivo
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAnalysis();
              }}
              className="w-full py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center gap-2"
            >
              <Activity className="w-4 h-4" />
              Iniciar Análisis Ambiental
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
