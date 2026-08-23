import React, { useState } from 'react';
import { 
  Layers, 
  Wind, 
  Volume2, 
  Building2, 
  Route, 
  Radio, 
  Factory, 
  CloudSun, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  EyeOff, 
  Map as MapIcon, 
  Sun, 
  Moon, 
  Globe 
} from 'lucide-react';
import { LayerVisibilityState, BaseMapType } from '../../types/gis';

interface LayersControlPanelProps {
  layers: LayerVisibilityState;
  onToggleLayer: (layerKey: keyof LayerVisibilityState) => void;
  baseMap: BaseMapType;
  onChangeBaseMap: (baseMap: BaseMapType) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  className?: string;
}

export const LayersControlPanel: React.FC<LayersControlPanelProps> = ({
  layers,
  onToggleLayer,
  baseMap,
  onChangeBaseMap,
  isOpen,
  onToggleOpen,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'layers' | 'basemap'>('layers');

  const layerItems: {
    key: keyof LayerVisibilityState;
    label: string;
    description: string;
    icon: React.ElementType;
    color: string;
    badge?: string;
  }[] = [
    {
      key: 'airQuality',
      label: 'Calidad del Aire',
      description: 'Zonas de concentración PM2.5 / PM10 (Índice INCA)',
      icon: Wind,
      color: 'text-emerald-400',
      badge: 'ECA D.S. 003'
    },
    {
      key: 'noise',
      label: 'Ruido Acústico',
      description: 'Contornos sonoros y niveles diurnos/nocturnos en dBA',
      icon: Volume2,
      color: 'text-cyan-400',
      badge: 'ECA D.S. 085'
    },
    {
      key: 'districts',
      label: 'Límites Distritales',
      description: 'Polígonos de Lima Metropolitana y Callao',
      icon: Building2,
      color: 'text-indigo-400',
      badge: '43 Distritos'
    },
    {
      key: 'roads',
      label: 'Vías & Corredores',
      description: 'Arterias de alto flujo vehicular y cañones acústicos',
      icon: Route,
      color: 'text-amber-400',
      badge: 'Red Vial'
    },
    {
      key: 'monitoringStations',
      label: 'Puntos de Monitoreo',
      description: 'Estaciones fijas SENAMHI / Red DEMO activa',
      icon: Radio,
      color: 'text-teal-400',
      badge: 'En Vivo'
    },
    {
      key: 'environmentalSources',
      label: 'Fuentes Ambientales',
      description: 'Refinerías, rellenos, puertos, aeropuerto e industrias',
      icon: Factory,
      color: 'text-rose-400',
      badge: 'Emisores'
    },
    {
      key: 'meteorology',
      label: 'Meteorología & Vientos',
      description: 'Vectores de viento (brisa costera), temp. y humedad',
      icon: CloudSun,
      color: 'text-sky-400',
      badge: 'Microclima'
    }
  ];

  const baseMapOptions: {
    id: BaseMapType;
    label: string;
    description: string;
    icon: React.ElementType;
  }[] = [
    {
      id: 'dark',
      label: 'Modo Oscuro ECO-MAP',
      description: 'CartoDB Dark Matter (Óptimo para capas ambientales)',
      icon: Moon
    },
    {
      id: 'osm',
      label: 'OpenStreetMap Estándar',
      description: 'Cartografía base abierta con detalle de calles',
      icon: MapIcon
    },
    {
      id: 'positron',
      label: 'CartoDB Positron (Claro)',
      description: 'Fondo minimalista de alto contraste',
      icon: Sun
    },
    {
      id: 'satellite',
      label: 'Satélite (Esri World Imagery)',
      description: 'Fotografía satelital de alta resolución',
      icon: Globe
    }
  ];

  const activeLayersCount = Object.values(layers).filter(Boolean).length;

  return (
    <div className={`transition-all duration-200 z-30 ${className}`}>
      {/* Trigger button if collapsed */}
      {!isOpen ? (
        <button
          onClick={onToggleOpen}
          className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 hover:border-emerald-500 rounded-2xl text-xs font-bold text-white shadow-xl group transition-all"
        >
          <Layers className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span>Capas ({activeLayersCount})</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      ) : (
        <div className="w-80 sm:w-88 bg-slate-900/95 backdrop-blur-xl border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
          
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                Panel de Capas & Cartografía
              </h3>
            </div>
            <button
              onClick={onToggleOpen}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>

          {/* Subheader Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-950/60 border-b border-slate-800 text-[11px] font-bold">
            <button
              onClick={() => setActiveTab('layers')}
              className={`py-1.5 rounded-xl transition-all ${
                activeTab === 'layers'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Capas Temáticas ({activeLayersCount})
            </button>
            <button
              onClick={() => setActiveTab('basemap')}
              className={`py-1.5 rounded-xl transition-all ${
                activeTab === 'basemap'
                  ? 'bg-slate-800 text-teal-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mapa Base
            </button>
          </div>

          {/* Body */}
          <div className="p-3 overflow-y-auto space-y-2 flex-1">
            {activeTab === 'layers' ? (
              <div className="space-y-1.5">
                {layerItems.map((item) => {
                  const isVisible = layers[item.key];
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={() => onToggleLayer(item.key)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                        isVisible
                          ? 'bg-slate-800/80 border-slate-700 shadow-sm'
                          : 'bg-slate-950/40 border-slate-800/60 opacity-60 hover:opacity-100 hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className={`p-1.5 rounded-lg bg-slate-900 mt-0.5 flex-shrink-0 ${item.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs font-bold truncate ${isVisible ? 'text-white' : 'text-slate-400'}`}>
                              {item.label}
                            </span>
                            {item.badge && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800 font-mono">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 leading-tight truncate">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        {isVisible ? (
                          <div className="p-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <Eye className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="p-1 rounded bg-slate-800 text-slate-500">
                            <EyeOff className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-400 px-1">
                  Seleccione el estilo de mapa cartográfico de fondo:
                </p>
                {baseMapOptions.map((opt) => {
                  const isSelected = baseMap === opt.id;
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => onChangeBaseMap(opt.id)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-950/40 border-emerald-500 text-white'
                          : 'bg-slate-950/50 border-slate-800 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold block">{opt.label}</span>
                        <span className="text-[10px] text-slate-400">{opt.description}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer stats */}
          <div className="px-3 py-2 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Lima Metropolitana</span>
            <span className="text-emerald-400">GIS Open Source</span>
          </div>

        </div>
      )}
    </div>
  );
};
