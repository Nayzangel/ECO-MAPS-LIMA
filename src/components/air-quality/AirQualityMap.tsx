import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { AirMeasurementRecord, AirNormativeStandard } from '../../types/airQuality';
import { calculateIncaIndex } from '../../utils/airQualityNormative';
import { 
  Layers, 
  MapPin, 
  Wind, 
  Maximize2, 
  Compass, 
  Eye, 
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';

interface AirQualityMapProps {
  stations: AirMeasurementRecord[];
  selectedStationId: string;
  onSelectStation: (stationId: string) => void;
  meta: AirNormativeStandard;
  onOpenDecisionEngineForStation?: (station: AirMeasurementRecord) => void;
}

export const AirQualityMap: React.FC<AirQualityMapProps> = ({
  stations,
  selectedStationId,
  onSelectStation,
  meta,
  onOpenDecisionEngineForStation
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const [baseMap, setBaseMap] = useState<'dark' | 'streets' | 'satellite'>('dark');
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-12.0464, -77.0328], // Lima Metropolitana
      zoom: 11,
      zoomControl: false,
      attributionControl: false
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    const tileUrls = {
      dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    };

    const tileLayer = L.tileLayer(tileUrls.dark, {
      maxZoom: 19
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    markersLayerRef.current.addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update BaseMap Tiles
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    const tileUrls = {
      dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    };

    tileLayerRef.current.setUrl(tileUrls[baseMap]);
  }, [baseMap]);

  // Render Markers on Map
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    markersLayerRef.current.clearLayers();

    stations.forEach((station) => {
      const incaInfo = calculateIncaIndex(station.parameter, station.concentration);
      const isSelected = station.id === selectedStationId;
      const isExceeded = station.concentration > meta.ecaLimit;

      // Custom HTML Marker with pulsing aura if exceeded
      const markerHtml = `
        <div class="relative flex items-center justify-center group cursor-pointer">
          ${
            isExceeded
              ? `<div class="absolute w-8 h-8 rounded-full bg-rose-500/40 animate-ping"></div>`
              : ''
          }
          <div class="w-7 h-7 rounded-full flex items-center justify-center border-2 shadow-lg transition-transform transform ${
            isSelected ? 'scale-125 ring-2 ring-white z-50' : 'hover:scale-110'
          }" style="background-color: ${incaInfo.color}; border-color: ${isSelected ? '#ffffff' : '#0f172a'};">
            <span style="font-family: monospace; font-size: 10px; font-weight: 900; color: #0f172a;">
              ${Math.round(station.concentration)}
            </span>
          </div>
          <div class="absolute -bottom-4 whitespace-nowrap px-1 py-0.2 rounded bg-slate-950/90 border border-slate-700 text-[8px] font-bold text-slate-200 shadow pointer-events-none">
            ${station.district.slice(0, 10)}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-air-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker(station.coordinates, { icon: customIcon });

      // Interactive Popup
      const popupHtml = `
        <div style="font-family: sans-serif; min-width: 220px; color: #f8fafc; padding: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 9px; font-family: monospace; text-transform: uppercase; color: #34d399; font-weight: bold;">
              ${station.sourceName.slice(0, 24)}
            </span>
            <span style="font-size: 8px; font-family: monospace; padding: 2px 5px; border-radius: 4px; background: ${incaInfo.color}33; color: ${incaInfo.color}; border: 1px solid ${incaInfo.color}66; font-weight: bold;">
              INCA: ${incaInfo.category}
            </span>
          </div>

          <div style="font-size: 13px; font-weight: 800; color: #ffffff; margin-bottom: 2px;">
            ${station.title}
          </div>
          <div style="font-size: 11px; color: #94a3b8; margin-bottom: 6px;">
            ${station.district} • ${station.address}
          </div>

          <div style="background: #090d16; padding: 8px; border-radius: 8px; border: 1px solid #1e293b; margin-bottom: 6px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <span style="font-size: 10px; color: #94a3b8;">${station.parameter}:</span>
              <span style="font-size: 16px; font-family: monospace; font-weight: 900; color: ${isExceeded ? '#fb7185' : '#34d399'};">
                ${station.concentration} <span style="font-size: 10px; font-weight: normal; color: #94a3b8;">${station.unit}</span>
              </span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; margin-top: 4px; border-top: 1px solid #1e293b; padding-top: 4px;">
              <span>Límite ECA:</span>
              <span style="font-family: monospace; color: #cbd5e1; font-weight: bold;">${meta.ecaLimit} ${meta.unit}</span>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 10px; color: #cbd5e1; margin-bottom: 4px;">
            <span>Viento: <strong>${station.meteorology.windSpeed} m/s (${station.meteorology.windDirectionCardinal})</strong></span>
            <span>Temp: <strong>${station.meteorology.temperature}°C</strong></span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        className: 'custom-leaflet-popup'
      });

      marker.on('click', () => {
        onSelectStation(station.id);
      });

      markersLayerRef.current.addLayer(marker);
    });

  }, [stations, selectedStationId, meta, onSelectStation]);

  // Center on Selected Station
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const st = stations.find(s => s.id === selectedStationId);
    if (st) {
      mapInstanceRef.current.panTo(st.coordinates, { animate: true, duration: 0.5 });
    }
  }, [selectedStationId, stations]);

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([-12.0464, -77.0328], 11);
    }
  };

  return (
    <div className="relative w-full h-[400px] sm:h-[480px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      
      {/* MAP CANVAS */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* TOP CONTROLS BAR OVERLAY */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left Badge */}
        <div className="pointer-events-auto bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-800 flex items-center gap-2 shadow-lg">
          <Wind className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white">
            Red de Vigilancia de Calidad del Aire (Lima & Callao)
          </span>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-500/30">
            {stations.length} Estaciones
          </span>
        </div>

        {/* Right Map Style Buttons */}
        <div className="pointer-events-auto flex items-center gap-1 bg-slate-950/85 backdrop-blur-md p-1 rounded-2xl border border-slate-800 shadow-lg">
          <button
            type="button"
            onClick={() => setBaseMap('dark')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
              baseMap === 'dark' ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Oscuro
          </button>
          <button
            type="button"
            onClick={() => setBaseMap('streets')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
              baseMap === 'streets' ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Calles
          </button>
          <button
            type="button"
            onClick={() => setBaseMap('satellite')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
              baseMap === 'satellite' ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Satélite
          </button>
          <button
            type="button"
            onClick={handleResetView}
            className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-700 transition-all cursor-pointer"
            title="Centrar Vista Lima"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* BOTTOM LEGEND OVERLAY */}
      <div className="absolute bottom-3 left-3 right-3 z-10 pointer-events-none flex flex-col sm:flex-row items-end sm:items-center justify-between gap-2">
        <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-md p-2.5 rounded-2xl border border-slate-800 text-[10px] space-y-1 shadow-lg max-w-sm">
          <span className="font-bold text-slate-300 block">Semáforo INCA (R.M. 181-2016-MINAM):</span>
          <div className="flex items-center gap-2 flex-wrap font-mono">
            <span className="flex items-center gap-1 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Bueno (0-50)
            </span>
            <span className="flex items-center gap-1 text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Moderado (51-100)
            </span>
            <span className="flex items-center gap-1 text-orange-300">
              <span className="w-2 h-2 rounded-full bg-orange-400" /> Malo (101-150)
            </span>
            <span className="flex items-center gap-1 text-rose-300">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" /> Cuidado (&gt;150)
            </span>
          </div>
        </div>

        <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-800 text-[10px] text-slate-400 shadow-lg">
          Haga clic en cualquier punto para enfocar su serie temporal y auditoría
        </div>
      </div>

    </div>
  );
};
