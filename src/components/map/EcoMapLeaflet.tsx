import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { 
  LayerVisibilityState, 
  BaseMapType, 
  ActiveMapTool, 
  CustomUserPoint, 
  EnvironmentalSource, 
  DistrictBoundary, 
  MapFilterOptions 
} from '../../types/gis';
import { StationData, ViewMode } from '../../types';
import { LIMA_STATIONS_DEMO } from '../../data/demoData';
import { 
  LIMA_DISTRICTS_GIS, 
  LIMA_ROAD_CORRIDORS, 
  LIMA_ENVIRONMENTAL_SOURCES, 
  LIMA_METEOROLOGY_STATIONS 
} from '../../data/gisData';
import { 
  calculatePolylineDistance, 
  calculatePolygonArea, 
  latLngToUTM18S 
} from '../../utils/gisUtils';

// Subcomponents
import { MapSearchBar } from './MapSearchBar';
import { LayersControlPanel } from './LayersControlPanel';
import { MapToolsPanel } from './MapToolsPanel';
import { MapLegendPanel } from './MapLegendPanel';
import { MapFilterModal } from './MapFilterModal';
import { CustomPointsDrawer } from './CustomPointsDrawer';
import { PointDetailDrawer } from './PointDetailDrawer';
import { AddPointModal } from './AddPointModal';

// Icons
import { 
  SlidersHorizontal, 
  Maximize2, 
  Ruler, 
  Pentagon, 
  Compass, 
  MapPin, 
  Sparkles,
  Info,
  Layers,
  X
} from 'lucide-react';

interface EcoMapLeafletProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  selectedStationId?: string | null;
  onLaunchDecisionEngine: (station: StationData) => void;
  viewMode?: ViewMode;
  isModal?: boolean;
  onCloseModal?: () => void;
}

export const EcoMapLeaflet: React.FC<EcoMapLeafletProps> = ({
  initialCenter = [-12.0464, -77.0428], // Lima Metropolitana
  initialZoom = 12,
  selectedStationId,
  onLaunchDecisionEngine,
  viewMode = 'ciudadano',
  isModal = false,
  onCloseModal
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Layer groups references
  const airLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const noiseLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const districtsLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const roadsLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const stationsLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const sourcesLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const meteoLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const customPointsLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const measurementLayerGroup = useRef<L.LayerGroup>(L.layerGroup());

  // UI States
  const [baseMap, setBaseMap] = useState<BaseMapType>('dark');
  const [layers, setLayers] = useState<LayerVisibilityState>({
    airQuality: true,
    noise: true,
    districts: true,
    roads: true,
    monitoringStations: true,
    environmentalSources: true,
    meteorology: true
  });

  const [activeTool, setActiveTool] = useState<ActiveMapTool>('navigate');
  const [isLayersPanelOpen, setIsLayersPanelOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isPointsDrawerOpen, setIsPointsDrawerOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isAddPointModalOpen, setIsAddPointModalOpen] = useState(false);
  const [pendingAddCoordinates, setPendingAddCoordinates] = useState<[number, number] | null>(null);

  // Selected Entities
  const [selectedStation, setSelectedStation] = useState<StationData | null>(null);
  const [selectedCustomPoint, setSelectedCustomPoint] = useState<CustomUserPoint | null>(null);
  const [selectedSource, setSelectedSource] = useState<EnvironmentalSource | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictBoundary | null>(null);

  // User Custom Points
  const [customPoints, setCustomPoints] = useState<CustomUserPoint[]>([
    {
      id: 'pt-init-1',
      name: 'Monitoreo Puente Nuevo (El Agustino / SJL)',
      category: 'Tráfico Pesado',
      coordinates: [-12.0320, -77.0050],
      pm25Estimated: 59.2,
      noiseEstimated: 81.5,
      notes: 'Punto neurálgico de congestión de transporte público y mototaxis.',
      createdAt: '2026-08-23',
      zoneType: 'Comercial'
    },
    {
      id: 'pt-init-2',
      name: 'Inspección Fábricas Av. Argentina',
      category: 'Foco Industrial',
      coordinates: [-12.0450, -77.0680],
      pm25Estimated: 47.8,
      noiseEstimated: 76.0,
      notes: 'Zona de almacenes textiles y procesadoras con emisiones difusas.',
      createdAt: '2026-08-23',
      zoneType: 'Industrial'
    }
  ]);

  // Measurements
  const [measurePoints, setMeasurePoints] = useState<[number, number][]>([]);

  // Mouse hover coordinates & zoom tracker
  const [cursorCoords, setCursorCoords] = useState<{
    lat: number;
    lng: number;
    zoom: number;
  }>({
    lat: initialCenter[0],
    lng: initialCenter[1],
    zoom: initialZoom
  });

  // Filters
  const [filters, setFilters] = useState<MapFilterOptions>({
    riskLevel: 'all',
    district: 'all',
    zoneType: 'all',
    onlyExceedingEca: false,
    searchQuery: ''
  });

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Distinct districts list for filters
  const allDistricts = useMemo(() => {
    const set = new Set<string>();
    LIMA_STATIONS_DEMO.forEach(s => set.add(s.district));
    LIMA_DISTRICTS_GIS.forEach(d => set.add(d.name));
    return Array.from(set).sort();
  }, []);

  // Filtered stations
  const filteredStations = useMemo(() => {
    return LIMA_STATIONS_DEMO.filter(st => {
      if (filters.riskLevel !== 'all' && st.riskLevel !== filters.riskLevel) return false;
      if (filters.district !== 'all' && st.district !== filters.district) return false;
      if (filters.zoneType !== 'all' && st.zoneType !== filters.zoneType) return false;
      if (filters.onlyExceedingEca) {
        const pmExceeds = st.pm25 > 50;
        const noiseLimit = st.zoneType === 'Residencial' ? 60 : st.zoneType === 'Comercial' ? 70 : 80;
        const noiseExceeds = st.noiseDay > noiseLimit;
        if (!pmExceeds && !noiseExceeds) return false;
      }
      return true;
    });
  }, [filters]);

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [initialCenter[0], initialCenter[1]] as L.LatLngTuple,
        zoom: initialZoom,
        zoomControl: false, // We render modern custom zoom buttons
        attributionControl: false
      });

      // Add base tile layer
      const darkTiles = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 19,
          subdomains: 'abcd'
        }
      );
      darkTiles.addTo(map);
      tileLayerRef.current = darkTiles;

      // Add Layer Groups
      airLayerGroup.current.addTo(map);
      noiseLayerGroup.current.addTo(map);
      districtsLayerGroup.current.addTo(map);
      roadsLayerGroup.current.addTo(map);
      stationsLayerGroup.current.addTo(map);
      sourcesLayerGroup.current.addTo(map);
      meteoLayerGroup.current.addTo(map);
      customPointsLayerGroup.current.addTo(map);
      measurementLayerGroup.current.addTo(map);

      // Track mouse coordinates
      map.on('mousemove', (e: L.LeafletMouseEvent) => {
        setCursorCoords({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          zoom: map.getZoom()
        });
      });

      map.on('zoomend', () => {
        setCursorCoords(prev => ({
          ...prev,
          zoom: map.getZoom()
        }));
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Handle Map Click according to Active Tool
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const clickCoords: [number, number] = [e.latlng.lat, e.latlng.lng];

      if (activeTool === 'add_point') {
        setPendingAddCoordinates(clickCoords);
        setIsAddPointModalOpen(true);
      } else if (activeTool === 'measure_distance' || activeTool === 'measure_area') {
        setMeasurePoints(prev => [...prev, clickCoords]);
      }
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [activeTool]);

  // 3. Switch Base Map Tiles
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    let options: L.TileLayerOptions = { maxZoom: 19, subdomains: 'abcd' };

    if (baseMap === 'osm') {
      url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      options = { maxZoom: 19 };
    } else if (baseMap === 'positron') {
      url = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
      options = { maxZoom: 19, subdomains: 'abcd' };
    } else if (baseMap === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      options = { maxZoom: 19 };
    }

    const newTiles = L.tileLayer(url, options);
    newTiles.addTo(map);
    tileLayerRef.current = newTiles;
  }, [baseMap]);

  // 4. Render Air Quality Heat & Isochrones Layer
  useEffect(() => {
    airLayerGroup.current.clearLayers();
    if (!layers.airQuality) return;

    // Create semi-transparent atmospheric isochrones around high pollution areas
    filteredStations.forEach(st => {
      let fillColor = '#10b981'; // Green (Bueno)
      let radius = 1800;

      if (st.pm25 > 60) {
        fillColor = '#f43f5e'; // Rose (Cuidado / Hotspot)
        radius = 3200;
      } else if (st.pm25 > 50) {
        fillColor = '#f97316'; // Orange (Malo / Supera ECA)
        radius = 2600;
      } else if (st.pm25 > 25) {
        fillColor = '#eab308'; // Yellow (Moderado)
        radius = 2100;
      }

      const circle = L.circle(st.coordinates, {
        radius,
        color: fillColor,
        weight: 1,
        fillColor,
        fillOpacity: 0.18,
        dashArray: '4, 4'
      });

      circle.bindTooltip(`
        <div class="text-xs p-1">
          <strong class="text-white">${st.district}</strong>
          <div class="text-slate-300">PM2.5: <span style="color:${fillColor}; font-weight:bold">${st.pm25} µg/m³</span></div>
          <div class="text-[10px] text-slate-400">Índice INCA: ${st.incaIndex}</div>
        </div>
      `, { sticky: true });

      airLayerGroup.current.addLayer(circle);
    });
  }, [layers.airQuality, filteredStations]);

  // 5. Render Noise Corridors & Zones Layer
  useEffect(() => {
    noiseLayerGroup.current.clearLayers();
    if (!layers.noise) return;

    LIMA_ROAD_CORRIDORS.forEach(road => {
      const isHighNoise = road.estimatedNoiseDb > 78;
      const polyline = L.polyline(road.coordinates, {
        color: isHighNoise ? '#ef4444' : '#06b6d4',
        weight: isHighNoise ? 6 : 4,
        opacity: 0.7,
        lineCap: 'round'
      });

      polyline.bindTooltip(`
        <div class="text-xs p-1">
          <strong class="text-white">${road.name}</strong>
          <div class="text-cyan-400 font-mono">Ruido estimado: ${road.estimatedNoiseDb} dBA</div>
          <div class="text-[10px] text-slate-400">${road.vehicleVolume}</div>
        </div>
      `, { sticky: true });

      polyline.on('click', () => {
        // Open inspection
        setSelectedDistrict(null);
        setSelectedSource(null);
        setSelectedStation(null);
        setSelectedCustomPoint({
          id: `road-${road.id}`,
          name: road.name,
          category: 'Tráfico Pesado',
          coordinates: road.coordinates[1] || road.coordinates[0],
          noiseEstimated: road.estimatedNoiseDb,
          pm25Estimated: 54.0,
          zoneType: 'Comercial',
          notes: road.vehicleVolume,
          createdAt: '2026-08-23'
        });
        setIsDetailDrawerOpen(true);
      });

      noiseLayerGroup.current.addLayer(polyline);
    });
  }, [layers.noise]);

  // 6. Render Districts Polygons Layer
  useEffect(() => {
    districtsLayerGroup.current.clearLayers();
    if (!layers.districts) return;

    LIMA_DISTRICTS_GIS.forEach(dist => {
      const polygon = L.polygon(dist.polygon, {
        color: '#6366f1',
        weight: 1.5,
        fillColor: '#6366f1',
        fillOpacity: 0.08,
        dashArray: '3, 5'
      });

      polygon.bindTooltip(`
        <div class="text-xs p-1">
          <strong class="text-white">${dist.name}</strong> (${dist.zone})
          <div class="text-slate-300 font-mono text-[11px]">PM2.5 prom.: ${dist.avgPm25} µg | Ruido: ${dist.avgNoiseDay} dB</div>
          <div class="text-[10px] text-indigo-300">Población: ${dist.population.toLocaleString()} hab.</div>
        </div>
      `, { sticky: true });

      polygon.on('click', () => {
        setSelectedStation(null);
        setSelectedCustomPoint(null);
        setSelectedSource(null);
        setSelectedDistrict(dist);
        setIsDetailDrawerOpen(true);
      });

      districtsLayerGroup.current.addLayer(polygon);
    });
  }, [layers.districts]);

  // 7. Render Monitoring Stations Layer
  useEffect(() => {
    stationsLayerGroup.current.clearLayers();
    if (!layers.monitoringStations) return;

    filteredStations.forEach(st => {
      let colorClass = 'bg-emerald-500 text-slate-950';
      let borderClass = 'border-emerald-400';
      if (st.riskLevel === 'Critico') {
        colorClass = 'bg-rose-500 text-slate-950 animate-pulse';
        borderClass = 'border-rose-400';
      } else if (st.riskLevel === 'Alerta') {
        colorClass = 'bg-amber-500 text-slate-950';
        borderClass = 'border-amber-400';
      }

      const iconHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="w-8 h-8 rounded-full ${colorClass} border-2 ${borderClass} shadow-lg flex items-center justify-center font-extrabold text-[11px] transform transition-transform group-hover:scale-125">
            ${st.pm25.toFixed(0)}
          </div>
          <div class="absolute -bottom-4 px-1.5 py-0.2 bg-slate-950/90 text-white border border-slate-700 text-[9px] font-bold rounded whitespace-nowrap shadow">
            ${st.district}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'station-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(st.coordinates, { icon: customIcon });

      marker.on('click', () => {
        setSelectedDistrict(null);
        setSelectedSource(null);
        setSelectedCustomPoint(null);
        setSelectedStation(st);
        setIsDetailDrawerOpen(true);
      });

      stationsLayerGroup.current.addLayer(marker);
    });
  }, [layers.monitoringStations, filteredStations]);

  // 8. Render Environmental Sources Layer (Stacks, Ports, Landfills)
  useEffect(() => {
    sourcesLayerGroup.current.clearLayers();
    if (!layers.environmentalSources) return;

    LIMA_ENVIRONMENTAL_SOURCES.forEach(src => {
      // Buffer zone circle
      const buffer = L.circle(src.coordinates, {
        radius: src.impactRadiusMeters,
        color: '#f43f5e',
        weight: 1,
        fillColor: '#f43f5e',
        fillOpacity: 0.1,
        dashArray: '2, 4'
      });
      sourcesLayerGroup.current.addLayer(buffer);

      const iconHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="w-7 h-7 rounded-xl bg-slate-900 border-2 border-rose-500 text-rose-400 shadow-xl flex items-center justify-center text-sm transform transition-transform group-hover:scale-125">
            🏭
          </div>
          <div class="absolute -bottom-4 px-1.5 py-0.2 bg-rose-950/90 text-rose-300 border border-rose-800 text-[9px] font-bold rounded whitespace-nowrap shadow">
            ${src.name.split('-')[0].trim()}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'source-div-icon',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker(src.coordinates, { icon: customIcon });

      marker.on('click', () => {
        setSelectedDistrict(null);
        setSelectedStation(null);
        setSelectedCustomPoint(null);
        setSelectedSource(src);
        setIsDetailDrawerOpen(true);
      });

      sourcesLayerGroup.current.addLayer(marker);
    });
  }, [layers.environmentalSources]);

  // 9. Render Meteorology Wind Layer
  useEffect(() => {
    meteoLayerGroup.current.clearLayers();
    if (!layers.meteorology) return;

    LIMA_METEOROLOGY_STATIONS.forEach(met => {
      const iconHtml = `
        <div class="relative flex items-center justify-center p-1 cursor-pointer">
          <div style="transform: rotate(${met.windDirectionDeg}deg)" class="w-6 h-6 rounded-full bg-sky-500/20 border border-sky-400 text-sky-400 flex items-center justify-center text-xs font-bold shadow">
            ↑
          </div>
          <div class="absolute -top-3 px-1 py-0.2 bg-slate-950/90 text-sky-300 border border-sky-900 text-[8px] font-mono rounded whitespace-nowrap">
            ${met.windSpeed} m/s
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'meteo-div-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker(met.coordinates, { icon: customIcon });

      marker.bindTooltip(`
        <div class="text-xs p-1">
          <strong class="text-white">${met.name}</strong>
          <div class="text-sky-400 font-mono">Viento: ${met.windSpeed} m/s (${met.windDirectionText})</div>
          <div class="text-slate-300 font-mono text-[10px]">Temp: ${met.temperature}°C | Humedad: ${met.humidity}%</div>
        </div>
      `, { sticky: true });

      meteoLayerGroup.current.addLayer(marker);
    });
  }, [layers.meteorology]);

  // 10. Render Custom User Placed Points Layer
  useEffect(() => {
    customPointsLayerGroup.current.clearLayers();

    customPoints.forEach(pt => {
      const iconHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="w-7 h-7 rounded-full bg-teal-400 border-2 border-white shadow-xl flex items-center justify-center text-slate-950 font-bold text-xs transform transition-transform group-hover:scale-125">
            📍
          </div>
          <div class="absolute -bottom-4 px-1.5 py-0.2 bg-teal-950 text-teal-300 border border-teal-700 text-[9px] font-bold rounded whitespace-nowrap shadow">
            ${pt.name.slice(0, 18)}...
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-point-div-icon',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker(pt.coordinates, { icon: customIcon });

      marker.on('click', () => {
        setSelectedDistrict(null);
        setSelectedStation(null);
        setSelectedSource(null);
        setSelectedCustomPoint(pt);
        setIsDetailDrawerOpen(true);
      });

      customPointsLayerGroup.current.addLayer(marker);
    });
  }, [customPoints]);

  // 11. Render Dynamic Distance & Area Measurements Layer
  useEffect(() => {
    measurementLayerGroup.current.clearLayers();
    if (measurePoints.length === 0) return;

    // Draw vertex markers
    measurePoints.forEach((pt, index) => {
      const vertexMarker = L.circleMarker(pt, {
        radius: 5,
        color: '#06b6d4',
        fillColor: '#ffffff',
        fillOpacity: 1,
        weight: 2
      });
      measurementLayerGroup.current.addLayer(vertexMarker);
    });

    if (activeTool === 'measure_distance' && measurePoints.length >= 2) {
      const polyline = L.polyline(measurePoints, {
        color: '#06b6d4',
        weight: 4,
        dashArray: '6, 6'
      });
      const distInfo = calculatePolylineDistance(measurePoints);

      polyline.bindTooltip(`
        <div class="text-xs font-bold text-white p-1">
          Distancia Total: <span class="text-cyan-400 font-mono">${distInfo.totalKm} km</span> (${distInfo.totalMeters.toLocaleString()} m)
        </div>
      `, { permanent: true, direction: 'center' }).openTooltip();

      measurementLayerGroup.current.addLayer(polyline);
    } else if (activeTool === 'measure_area' && measurePoints.length >= 3) {
      const polygon = L.polygon(measurePoints, {
        color: '#818cf8',
        fillColor: '#818cf8',
        fillOpacity: 0.25,
        weight: 2
      });
      const areaInfo = calculatePolygonArea(measurePoints);

      polygon.bindTooltip(`
        <div class="text-xs font-bold text-white p-1">
          Área: <span class="text-indigo-300 font-mono">${areaInfo.hectares} ha</span> (${areaInfo.areaM2.toLocaleString()} m²)<br/>
          Perímetro: <span class="text-slate-300 font-mono">${areaInfo.perimeterMeters.toLocaleString()} m</span>
        </div>
      `, { permanent: true, direction: 'center' }).openTooltip();

      measurementLayerGroup.current.addLayer(polygon);
    }
  }, [measurePoints, activeTool]);

  // Handle Station Preselection on mount or prop change
  useEffect(() => {
    if (selectedStationId && mapInstanceRef.current) {
      const found = LIMA_STATIONS_DEMO.find(s => s.id === selectedStationId);
      if (found) {
        mapInstanceRef.current.flyTo(found.coordinates, 14, { duration: 1.2 });
        setSelectedStation(found);
        setIsDetailDrawerOpen(true);
      }
    }
  }, [selectedStationId]);

  // Map Action Handlers
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetView = () => {
    mapInstanceRef.current?.flyTo(initialCenter, initialZoom, { duration: 1.2 });
  };

  const handleSelectLocation = (coords: [number, number], zoom: number = 14) => {
    mapInstanceRef.current?.flyTo(coords, zoom, { duration: 1.4 });
  };

  const handleToggleLayer = (layerKey: keyof LayerVisibilityState) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const handleSaveCustomPoint = (newPoint: CustomUserPoint) => {
    setCustomPoints(prev => [newPoint, ...prev]);
    setSelectedDistrict(null);
    setSelectedStation(null);
    setSelectedSource(null);
    setSelectedCustomPoint(newPoint);
    setIsDetailDrawerOpen(true);
    setActiveTool('navigate');
  };

  const handleDeleteCustomPoint = (pointId: string) => {
    setCustomPoints(prev => prev.filter(p => p.id !== pointId));
    if (selectedCustomPoint?.id === pointId) {
      setSelectedCustomPoint(null);
      setIsDetailDrawerOpen(false);
    }
  };

  const handleClearAllCustomPoints = () => {
    setCustomPoints([]);
    setSelectedCustomPoint(null);
    setIsDetailDrawerOpen(false);
    setIsPointsDrawerOpen(false);
  };

  const handleClearMeasurements = () => {
    setMeasurePoints([]);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapContainerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Export GeoJSON
  const handleExportGeoJSON = () => {
    const geojson = {
      type: 'FeatureCollection',
      features: customPoints.map(pt => ({
        type: 'Feature',
        properties: {
          name: pt.name,
          category: pt.category,
          zoneType: pt.zoneType,
          pm25: pt.pm25Estimated,
          noise: pt.noiseEstimated,
          notes: pt.notes,
          createdAt: pt.createdAt
        },
        geometry: {
          type: 'Point',
          coordinates: [pt.coordinates[1], pt.coordinates[0]] // [lng, lat]
        }
      }))
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecomap-lima-monitoreo-${Date.now()}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export CSV
  const handleExportCSV = () => {
    const header = 'ID,Nombre,Categoria,Zonificacion,Latitud,Longitud,PM25_Estimado,Ruido_Estimado,Notas,Fecha\n';
    const rows = customPoints.map(p =>
      `"${p.id}","${p.name}","${p.category}","${p.zoneType}",${p.coordinates[0]},${p.coordinates[1]},${p.pm25Estimated || ''},${p.noiseEstimated || ''},"${p.notes || ''}","${p.createdAt}"`
    ).join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecomap-lima-monitoreo-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Coordinates converted to UTM for display
  const utmCurrent = latLngToUTM18S(cursorCoords.lat, cursorCoords.lng);

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden flex flex-col select-none">
      
      {/* 1. TOP FLOATING APP BAR: SEARCH + QUICK ACTIONS */}
      <div className="absolute top-4 left-4 right-4 z-30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pointer-events-none">
        
        {/* Search Bar */}
        <div className="pointer-events-auto w-full sm:max-w-md shadow-2xl">
          <MapSearchBar onSelectLocation={handleSelectLocation} />
        </div>

        {/* Action Pills */}
        <div className="pointer-events-auto flex items-center gap-2 self-end sm:self-auto">
          
          {/* Layers Panel Toggle */}
          <LayersControlPanel
            layers={layers}
            onToggleLayer={handleToggleLayer}
            baseMap={baseMap}
            onChangeBaseMap={setBaseMap}
            isOpen={isLayersPanelOpen}
            onToggleOpen={() => setIsLayersPanelOpen(prev => !prev)}
          />

          {/* Filter Button */}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className={`flex items-center gap-2 px-3.5 py-2.5 bg-slate-900/95 backdrop-blur-md border rounded-2xl text-xs font-bold shadow-xl transition-all ${
              filters.riskLevel !== 'all' || filters.district !== 'all' || filters.onlyExceedingEca
                ? 'border-emerald-400 text-emerald-300 bg-emerald-950/40'
                : 'border-slate-700/80 text-white hover:border-emerald-500'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Filtros</span>
          </button>

          {/* Close Modal button if inside interactive modal */}
          {isModal && onCloseModal && (
            <button
              onClick={onCloseModal}
              className="p-2.5 bg-slate-900/95 backdrop-blur-md border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white rounded-2xl shadow-xl"
            >
              <X className="w-4 h-4" />
            </button>
          )}

        </div>

      </div>

      {/* 2. ACTIVE TOOL NOTIFICATION BANNER */}
      {activeTool !== 'navigate' && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-auto bg-slate-900/95 backdrop-blur-md border border-emerald-500/50 px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-3 text-xs text-white animate-in fade-in">
          {activeTool === 'add_point' && (
            <>
              <MapPin className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span>Haga clic en cualquier lugar de Lima para <strong>colocar un punto</strong></span>
            </>
          )}
          {activeTool === 'measure_distance' && (
            <>
              <Ruler className="w-4 h-4 text-cyan-400" />
              <span>Haga clic en el mapa para trazar vértices y <strong>medir distancia</strong></span>
            </>
          )}
          {activeTool === 'measure_area' && (
            <>
              <Pentagon className="w-4 h-4 text-indigo-400" />
              <span>Haga clic en 3 o más puntos para <strong>calcular área y perímetro</strong></span>
            </>
          )}
          <button
            onClick={() => {
              setActiveTool('navigate');
              setMeasurePoints([]);
            }}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px] text-slate-300 font-bold ml-1 cursor-pointer"
          >
            Finalizar
          </button>
        </div>
      )}

      {/* 3. LEFT FLOATING GIS TOOLBOX */}
      <div className="absolute left-4 top-24 z-20 pointer-events-auto">
        <MapToolsPanel
          activeTool={activeTool}
          onSelectTool={tool => {
            setActiveTool(tool);
            if (tool === 'navigate') setMeasurePoints([]);
          }}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetView={handleResetView}
          onClearMeasurements={handleClearMeasurements}
          hasMeasurements={measurePoints.length > 0}
          customPointsCount={customPoints.length}
          onOpenPointsDrawer={() => setIsPointsDrawerOpen(true)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
        />
      </div>

      {/* 4. BOTTOM RIGHT FLOATING LEGEND */}
      <div className="absolute right-4 bottom-10 z-20 pointer-events-auto">
        <MapLegendPanel layers={layers} />
      </div>

      {/* 5. BOTTOM STATUS & COORDINATES BAR */}
      <div className="absolute bottom-2 left-4 right-4 z-20 pointer-events-none flex items-center justify-between text-[11px] font-mono text-slate-300">
        
        {/* Live Coordinates Pill */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-slate-500">WGS84:</span>
            <span className="text-white font-bold">{cursorCoords.lat.toFixed(5)}°, {cursorCoords.lng.toFixed(5)}°</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <div className="hidden sm:flex items-center gap-1">
            <span className="text-slate-500">UTM:</span>
            <span className="text-teal-400 font-bold">{utmCurrent.easting} E / {utmCurrent.northing} N ({utmCurrent.zone})</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1">
            <span className="text-slate-500">Zoom:</span>
            <span className="text-emerald-400 font-bold">{cursorCoords.zoom}</span>
          </div>
        </div>

        {/* System Info Pill */}
        <div className="pointer-events-auto hidden md:flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl shadow-lg text-[10px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>ECO-MAP LIMA GIS • Licencia Open Data</span>
        </div>

      </div>

      {/* 6. LEAFLET MAP CANVAS */}
      <div ref={mapContainerRef} className="w-full h-full cursor-crosshair" />

      {/* 7. DRAWERS & MODALS */}
      <CustomPointsDrawer
        isOpen={isPointsDrawerOpen}
        onClose={() => setIsPointsDrawerOpen(false)}
        points={customPoints}
        onSelectPoint={pt => {
          handleSelectLocation(pt.coordinates, 15);
          setSelectedDistrict(null);
          setSelectedStation(null);
          setSelectedSource(null);
          setSelectedCustomPoint(pt);
          setIsDetailDrawerOpen(true);
        }}
        onDeletePoint={handleDeleteCustomPoint}
        onClearAllPoints={handleClearAllCustomPoints}
        onExportGeoJSON={handleExportGeoJSON}
        onExportCSV={handleExportCSV}
      />

      <PointDetailDrawer
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        selectedStation={selectedStation}
        selectedCustomPoint={selectedCustomPoint}
        selectedSource={selectedSource}
        selectedDistrict={selectedDistrict}
        onLaunchDecisionEngine={onLaunchDecisionEngine}
        onDeleteCustomPoint={handleDeleteCustomPoint}
      />

      <MapFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onChangeFilters={setFilters}
        onResetFilters={() =>
          setFilters({
            riskLevel: 'all',
            district: 'all',
            zoneType: 'all',
            onlyExceedingEca: false,
            searchQuery: ''
          })
        }
        districtsList={allDistricts}
      />

      <AddPointModal
        isOpen={isAddPointModalOpen}
        onClose={() => {
          setIsAddPointModalOpen(false);
          setPendingAddCoordinates(null);
        }}
        coordinates={pendingAddCoordinates}
        onSavePoint={handleSaveCustomPoint}
      />

    </div>
  );
};
