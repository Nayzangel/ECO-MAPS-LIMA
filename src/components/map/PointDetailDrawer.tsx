import React from 'react';
import { 
  X, 
  Wind, 
  Volume2, 
  Activity, 
  MapPin, 
  Compass, 
  Thermometer, 
  Droplets, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight,
  Trash2,
  Share2
} from 'lucide-react';
import { StationData } from '../../types';
import { CustomUserPoint, EnvironmentalSource, DistrictBoundary } from '../../types/gis';
import { latLngToUTM18S } from '../../utils/gisUtils';

interface PointDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStation?: StationData | null;
  selectedCustomPoint?: CustomUserPoint | null;
  selectedSource?: EnvironmentalSource | null;
  selectedDistrict?: DistrictBoundary | null;
  onLaunchDecisionEngine: (station: StationData) => void;
  onDeleteCustomPoint?: (pointId: string) => void;
}

export const PointDetailDrawer: React.FC<PointDetailDrawerProps> = ({
  isOpen,
  onClose,
  selectedStation,
  selectedCustomPoint,
  selectedSource,
  selectedDistrict,
  onLaunchDecisionEngine,
  onDeleteCustomPoint
}) => {
  if (!isOpen) return null;

  // Derive coordinates and name
  let title = 'Detalle de Inspección Territorial';
  let subtitle = 'Punto Geoespacial';
  let coords: [number, number] = [-12.0464, -77.0428];
  let pm25 = 0;
  let noise = 0;
  let zoneType = 'Residencial';
  let riskLevel = 'Moderado';
  let isCustom = false;
  let isSource = false;
  let isDistrict = false;

  if (selectedStation) {
    title = selectedStation.name;
    subtitle = `${selectedStation.district} • Red de Monitoreo`;
    coords = selectedStation.coordinates;
    pm25 = selectedStation.pm25;
    noise = selectedStation.noiseDay;
    zoneType = selectedStation.zoneType;
    riskLevel = selectedStation.riskLevel;
  } else if (selectedCustomPoint) {
    title = selectedCustomPoint.name;
    subtitle = `${selectedCustomPoint.category} • Punto de Usuario`;
    coords = selectedCustomPoint.coordinates;
    pm25 = selectedCustomPoint.pm25Estimated || 35;
    noise = selectedCustomPoint.noiseEstimated || 62;
    zoneType = selectedCustomPoint.zoneType;
    isCustom = true;
  } else if (selectedSource) {
    title = selectedSource.name;
    subtitle = `${selectedSource.district} • ${selectedSource.category}`;
    coords = selectedSource.coordinates;
    isSource = true;
  } else if (selectedDistrict) {
    title = `Distrito: ${selectedDistrict.name}`;
    subtitle = `${selectedDistrict.zone} • Población: ${selectedDistrict.population.toLocaleString()} hab.`;
    coords = selectedDistrict.center;
    pm25 = selectedDistrict.avgPm25;
    noise = selectedDistrict.avgNoiseDay;
    isDistrict = true;
  }

  const utm = latLngToUTM18S(coords[0], coords[1]);

  // ECA limits
  const pm25Limit = 50;
  const noiseLimit = zoneType === 'Residencial' ? 60 : zoneType === 'Comercial' ? 70 : 80;
  const pm25Exceeds = pm25 > pm25Limit;
  const noiseExceeds = noise > noiseLimit;

  // Mock Station Data for Decision Engine when launching from custom point or district
  const constructMockStation = (): StationData => {
    if (selectedStation) return selectedStation;
    return {
      id: selectedCustomPoint?.id || selectedDistrict?.id || 'temp-point',
      name: title,
      district: selectedCustomPoint ? 'Punto Personalizado' : selectedDistrict?.name || 'Lima',
      zoneType: (zoneType as any) || 'Residencial',
      coordinates: coords,
      elevation: 150,
      pm25: pm25,
      pm10: pm25 * 2.1,
      so2: 15,
      no2: 42,
      co: 1.8,
      o3: 25,
      noiseDay: noise,
      noiseNight: Math.max(noise - 10, 40),
      temperature: 21.5,
      humidity: 80,
      windSpeed: 2.3,
      windDirection: 'SO (Suroeste)',
      lastUpdate: '2026-08-23 09:30 (DEMO)',
      incaIndex: pm25 > 75 ? 'Cuidado' : pm25 > 50 ? 'Malo' : pm25 > 25 ? 'Moderado' : 'Bueno',
      riskLevel: (riskLevel as any) || 'Moderado',
      primaryIssue: 'Evaluación puntual para toma de decisión ambiental.',
      isDemo: true
    };
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900/95 backdrop-blur-2xl border-l border-slate-700/80 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      
      {/* Header */}
      <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {isSource ? 'Foco Emisor' : isDistrict ? 'Polígono Distrital' : isCustom ? 'Punto de Usuario' : 'Estación Fija'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">UTM: {utm.easting}E, {utm.northing}N</span>
          </div>
          <h3 className="text-base font-extrabold text-white leading-tight">{title}</h3>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 flex-shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 p-5 overflow-y-auto space-y-5 text-xs">
        
        {/* Coordinates Box */}
        <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 font-mono text-[11px] grid grid-cols-2 gap-2">
          <div>
            <span className="text-slate-500 block text-[10px]">Latitud (WGS84):</span>
            <span className="text-slate-200 font-bold">{coords[0].toFixed(5)}°</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Longitud (WGS84):</span>
            <span className="text-slate-200 font-bold">{coords[1].toFixed(5)}°</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Zona UTM:</span>
            <span className="text-teal-400 font-bold">{utm.zone} (Lima)</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Zonificación:</span>
            <span className="text-slate-200 font-bold">{zoneType}</span>
          </div>
        </div>

        {/* Source Specific Details */}
        {selectedSource && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Tipo de Emisión:</span>
              <p className="text-xs text-rose-300 font-semibold">{selectedSource.emissionType}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Capacidad / Flujo Estimado:</span>
              <p className="text-xs text-slate-200">{selectedSource.estimatedOutput}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Radio de Impacto Inmediato:</span>
              <p className="text-xs font-mono text-amber-400 font-bold">~{selectedSource.impactRadiusMeters} metros</p>
            </div>
            <p className="text-[11px] text-slate-400 italic bg-slate-900 p-2.5 rounded-xl">
              {selectedSource.description}
            </p>
          </div>
        )}

        {/* Environmental Parameters Grid */}
        {!selectedSource && (
          <div className="space-y-4">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Parámetros Monitoreados / Estimados</span>
              <span className="text-[10px] font-mono text-emerald-400">DEMO Activo</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              
              {/* PM2.5 Card */}
              <div className={`p-3.5 rounded-2xl border ${
                pm25Exceeds ? 'bg-rose-950/30 border-rose-500/40' : 'bg-slate-950/80 border-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-emerald-400" /> PM2.5
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    pm25Exceeds ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {pm25Exceeds ? '▲ SUPERA' : '✓ CUMPLE'}
                  </span>
                </div>
                <div className="text-xl font-mono font-extrabold text-white">
                  {pm25} <span className="text-[11px] font-normal text-slate-400">µg/m³</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">ECA: 50 µg/m³ (24h)</span>
              </div>

              {/* Noise Card */}
              <div className={`p-3.5 rounded-2xl border ${
                noiseExceeds ? 'bg-rose-950/30 border-rose-500/40' : 'bg-slate-950/80 border-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> Ruido Diurno
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    noiseExceeds ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {noiseExceeds ? '▲ SUPERA' : '✓ CUMPLE'}
                  </span>
                </div>
                <div className="text-xl font-mono font-extrabold text-white">
                  {noise} <span className="text-[11px] font-normal text-slate-400">dBA</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">ECA ({zoneType}): {noiseLimit} dBA</span>
              </div>

            </div>

            {/* Detailed Normative Audit Accordion */}
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-300 block">
                Auditoría Normativa Peruana
              </span>
              <div className="space-y-1.5 text-[11px] text-slate-400">
                <div className="flex items-center justify-between py-1 border-b border-slate-900">
                  <span>D.S. N° 003-2017-MINAM (Aire)</span>
                  <strong className={pm25Exceeds ? 'text-rose-400 font-mono' : 'text-emerald-400 font-mono'}>
                    {pm25Exceeds ? 'Alerta por Superación' : 'Dentro del estándar'}
                  </strong>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-900">
                  <span>D.S. N° 085-2003-PCM (Ruido)</span>
                  <strong className={noiseExceeds ? 'text-rose-400 font-mono' : 'text-emerald-400 font-mono'}>
                    {noiseExceeds ? 'Superación Acústica' : 'Nivel Conforme'}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-slate-950/90 border-t border-slate-800 space-y-2">
        <button
          onClick={() => {
            onLaunchDecisionEngine(constructMockStation());
            onClose();
          }}
          className="w-full py-3 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Lanzar en Motor de Decisión Ambiental
          <ArrowRight className="w-4 h-4" />
        </button>

        {isCustom && selectedCustomPoint && onDeleteCustomPoint && (
          <button
            onClick={() => {
              onDeleteCustomPoint(selectedCustomPoint.id);
              onClose();
            }}
            className="w-full py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl transition-colors font-medium flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Eliminar este punto personalizado
          </button>
        )}
      </div>

    </div>
  );
};
