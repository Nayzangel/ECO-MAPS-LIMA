import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Volume2, Layers, Eye, Sparkles, FileText, CheckCircle2, ShieldAlert, Cpu, Activity, Compass } from 'lucide-react';
import { NoiseMeasurementRecord, AcousticMethodologyType } from '../../types/noiseQuality';
import { getIsophoneColor } from '../../utils/noiseNormative';
import { SAMPLE_ISOPHONE_CONTOURS } from '../../data/noiseQualityData';

interface NoiseMapProps {
  records: NoiseMeasurementRecord[];
  selectedRecordId: string;
  onSelectRecord: (id: string) => void;
  onOpenDossier: (record: NoiseMeasurementRecord) => void;
  onOpenDecisionEngine?: (record: NoiseMeasurementRecord) => void;
}

export const NoiseMap: React.FC<NoiseMapProps> = ({
  records,
  selectedRecordId,
  onSelectRecord,
  onOpenDossier,
  onOpenDecisionEngine
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const isophonesLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const bufferLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [baseMap, setBaseMap] = useState<'dark' | 'streets' | 'satellite'>('dark');
  const [showIsophones, setShowIsophones] = useState<boolean>(true);
  const [showBuffers, setShowBuffers] = useState<boolean>(false);
  const [filterMethod, setFilterMethod] = useState<AcousticMethodologyType | 'ALL'>('ALL');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-12.0650, -77.0380], // Lima Metropolitana Central
      zoom: 12,
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
    isophonesLayerRef.current.addTo(map);
    bufferLayerRef.current.addTo(map);
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

  // Render Isophone Polygons Layer
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    isophonesLayerRef.current.clearLayers();

    if (showIsophones) {
      SAMPLE_ISOPHONE_CONTOURS.forEach((iso) => {
        const polygon = L.polygon(iso.polygon as [number, number][], {
          color: iso.color,
          weight: 2,
          opacity: 0.8,
          fillColor: iso.color,
          fillOpacity: iso.fillOpacity,
          dashArray: iso.level >= 75 ? undefined : '5, 5'
        });

        polygon.bindTooltip(
          `<div class="font-sans text-xs font-bold text-slate-900 bg-white p-1 rounded shadow">${iso.label}</div>`,
          { sticky: true }
        );

        isophonesLayerRef.current.addLayer(polygon);
      });
    }
  }, [showIsophones]);

  // Render Buffer Dispersion Circles
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    bufferLayerRef.current.clearLayers();

    if (showBuffers) {
      records.forEach((record) => {
        if (record.isExceeding) {
          // Acoustic impact buffer: 300m critical radius
          const circle = L.circle(record.coordinates, {
            radius: 350,
            color: '#ef4444',
            weight: 1,
            fillColor: '#f43f5e',
            fillOpacity: 0.12,
            dashArray: '4, 4'
          });
          circle.bindTooltip(`Radio de Impacto Acústico (~350m): ${record.title}`, { sticky: true });
          bufferLayerRef.current.addLayer(circle);
        }
      });
    }
  }, [showBuffers, records]);

  // Render Markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    markersLayerRef.current.clearLayers();

    const filtered = records.filter(r => filterMethod === 'ALL' || r.methodology === filterMethod);

    filtered.forEach((record) => {
      const isSelected = record.id === selectedRecordId;
      const isExceeded = record.isExceeding;
      const isoStyle = getIsophoneColor(record.laeq);

      // Distinct marker icon according to methodology
      let methodIconBadge = '';
      if (record.methodology === 'INTERPOLACION') {
        methodIconBadge = `<span class="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full border border-slate-900" title="Interpolación"></span>`;
      } else if (record.methodology === 'MODELAMIENTO') {
        methodIconBadge = `<span class="absolute -top-1 -left-1 w-3 h-3 bg-purple-500 rounded-full border border-slate-900" title="Modelamiento"></span>`;
      }

      const markerHtml = `
        <div class="relative flex items-center justify-center group cursor-pointer">
          ${
            isExceeded
              ? `<div class="absolute w-9 h-9 rounded-full bg-rose-500/30 animate-ping"></div>`
              : ''
          }
          ${methodIconBadge}
          <div class="w-8 h-8 rounded-full flex items-center justify-center font-mono font-black text-[11px] shadow-xl border-2 transition-transform duration-200 hover:scale-125 ${
            isSelected
              ? 'border-white scale-125 ring-4 ring-cyan-400/50 text-white'
              : 'border-slate-900 text-white'
          }" style="background-color: ${isoStyle.fill};">
            ${Math.round(record.laeq)}
          </div>
          <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded bg-slate-950/90 border border-slate-800 text-[9px] font-mono font-bold text-slate-200 whitespace-nowrap shadow pointer-events-none">
            ${record.laeq} dB
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-noise-station-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18]
      });

      const marker = L.marker(record.coordinates, { icon: customIcon });

      const popupContent = `
        <div class="p-3 max-w-[270px] space-y-2.5 font-sans">
          <div class="flex items-center justify-between border-b border-slate-700 pb-1.5">
            <span class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded text-cyan-400 bg-cyan-950/80 border border-cyan-800 uppercase">
              ${record.methodology}
            </span>
            <span class="text-[10px] font-mono text-slate-400">
              ${record.time} (${record.determinedPeriod})
            </span>
          </div>

          <div>
            <h4 class="font-extrabold text-white text-xs leading-snug">${record.title}</h4>
            <p class="text-[11px] text-slate-400 mt-0.5">${record.district} • ${record.zoneType}</p>
          </div>

          <div class="grid grid-cols-2 gap-1.5 p-2 bg-slate-900 rounded-xl border border-slate-800 text-center font-mono">
            <div>
              <div class="text-[9px] text-slate-400">LAeq Medido</div>
              <div class="text-sm font-black text-white">${record.laeq} dBA</div>
            </div>
            <div>
              <div class="text-[9px] text-slate-400">Límite ECA</div>
              <div class="text-sm font-black text-cyan-400">${record.ecaLimit} dBA</div>
            </div>
          </div>

          <div class="text-[10px] flex items-center justify-between">
            <span class="text-slate-400">Excedencia:</span>
            <span class="font-bold font-mono ${record.isExceeding ? 'text-rose-400' : 'text-emerald-400'}">
              ${record.isExceeding ? `+${record.exceedanceDb.toFixed(1)} dB (Supera)` : '✓ Conforme'}
            </span>
          </div>

          <div class="text-[10px] text-slate-400">
            <strong>Equipo:</strong> ${record.equipment}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'custom-noise-popup',
        closeButton: true
      });

      marker.on('click', () => {
        onSelectRecord(record.id);
      });

      markersLayerRef.current.addLayer(marker);
    });
  }, [records, selectedRecordId, filterMethod, onSelectRecord]);

  // Center on Selected Record
  const handleCenterSelected = () => {
    const target = records.find(r => r.id === selectedRecordId);
    if (target && mapInstanceRef.current) {
      mapInstanceRef.current.setView(target.coordinates, 15, { animate: true });
    }
  };

  const selectedRecord = records.find(r => r.id === selectedRecordId) || records[0];

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl space-y-0">
      
      {/* MAP CONTROLS TOOLBAR */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* BASEMAP SWITCHER */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 px-2 flex items-center gap-1">
            <Layers className="w-3 h-3 text-cyan-400" />
            Mapa:
          </span>
          {(['dark', 'streets', 'satellite'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setBaseMap(mode)}
              className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                baseMap === mode
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {mode === 'dark' ? 'Oscuro' : mode === 'streets' ? 'Calles' : 'Satélite'}
            </button>
          ))}
        </div>

        {/* METHODOLOGY FILTER */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 px-2 flex items-center gap-1">
            <Activity className="w-3 h-3 text-cyan-400" />
            Capa:
          </span>
          {(['ALL', 'MEDICION', 'INTERPOLACION', 'MODELAMIENTO'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setFilterMethod(m)}
              className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                filterMethod === m
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {m === 'ALL' ? 'Todo' : m === 'MEDICION' ? 'Medición' : m === 'INTERPOLACION' ? 'Isófonas' : 'Modelo 3D'}
            </button>
          ))}
        </div>

        {/* LAYER TOGGLE SWITCHES */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowIsophones(!showIsophones)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
              showIsophones
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Curvas Isófonas 2D</span>
          </button>

          <button
            type="button"
            onClick={() => setShowBuffers(!showBuffers)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
              showBuffers
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Área de Impacto (350m)</span>
          </button>

          <button
            type="button"
            onClick={handleCenterSelected}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Centrar en el punto activo"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Centrar</span>
          </button>
        </div>

      </div>

      {/* MAP CONTAINER */}
      <div className="relative w-full h-[480px] bg-slate-950">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* MAP FLOATING ACOUSTIC CHROMATIC LEGEND */}
        <div className="absolute bottom-4 left-4 z-[400] p-3 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-[10px] space-y-1.5 shadow-xl max-w-xs pointer-events-auto">
          <div className="font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-1">
            <span>Escala Isófona (dBA)</span>
            <span className="text-[9px] text-cyan-400">ISO 1996</span>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span className="text-slate-300">&lt; 50 (Excelente)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500" />
              <span className="text-slate-300">50 - 55 (Bajo)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
              <span className="text-slate-300">55 - 60 (Mod. Resid.)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
              <span className="text-slate-300">60 - 65 (Mod. Com.)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-orange-500" />
              <span className="text-slate-300">65 - 70 (Alto)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
              <span className="text-slate-300">&gt; 70 (Excedencia ECA)</span>
            </div>
          </div>
        </div>

        {/* SELECTED POINT FLOATING QUICK ACTION PILL */}
        {selectedRecord && (
          <div className="absolute top-4 left-4 z-[400] p-3 rounded-2xl bg-slate-950/95 backdrop-blur-md border border-cyan-500/40 shadow-2xl max-w-sm pointer-events-auto flex items-center justify-between gap-3">
            <div>
              <span className="text-[9px] font-mono uppercase text-cyan-400 font-bold block">
                Punto Seleccionado
              </span>
              <div className="font-extrabold text-white text-xs truncate max-w-[180px]">
                {selectedRecord.title}
              </div>
              <div className="text-[10px] font-mono text-slate-300">
                LAeq: <strong className="text-cyan-300">{selectedRecord.laeq} dBA</strong> | ECA: {selectedRecord.ecaLimit} dBA
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onOpenDossier(selectedRecord)}
                className="px-2.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold shadow transition-all flex items-center gap-1 cursor-pointer"
                title="Ver Ficha Técnica Completa"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Ficha</span>
              </button>

              {onOpenDecisionEngine && (
                <button
                  type="button"
                  onClick={() => onOpenDecisionEngine(selectedRecord)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 transition-all cursor-pointer"
                  title="Auditar en Motor de Decisión"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
