import React, { useState } from 'react';
import { ViewMode, StationData } from './types';
import { LIMA_STATIONS_DEMO } from './data/demoData';

// Layout & Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/hero/HeroSection';
import { MapSection } from './components/sections/MapSection';
import { EnvironmentalDataSection } from './components/sections/EnvironmentalDataSection';
import { AirQualitySection } from './components/sections/AirQualitySection';
import { NoiseSection } from './components/sections/NoiseSection';
import { MeteorologySection } from './components/sections/MeteorologySection';
import { EmissionSourcesSection } from './components/sections/EmissionSourcesSection';
import { ModelingSection } from './components/sections/ModelingSection';
import { SourcesSection } from './components/sections/SourcesSection';
import { HowItWorksSection } from './components/sections/HowItWorksSection';
import { PricingPlansSection } from './components/sections/PricingPlansSection';
import { ContactSection } from './components/sections/ContactSection';

// Modals
import { InteractiveMapModal } from './components/map/InteractiveMapModal';
import { DecisionEngineModal } from './components/decision-engine/DecisionEngineModal';
import { DecisionEngineSection } from './components/sections/DecisionEngineSection';
import { DecisionInputPoint } from './types/decisionEngine';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('ciudadano');
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);
  const [selectedStationIdForMap, setSelectedStationIdForMap] = useState<string>(LIMA_STATIONS_DEMO[0].id);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState<boolean>(false);
  const [stationForAnalysis, setStationForAnalysis] = useState<StationData | null>(null);

  const handleOpenMapWithStation = (stationId: string) => {
    setSelectedStationIdForMap(stationId);
    setIsMapOpen(true);
  };

  const handleOpenAnalysisWithStation = (station: StationData) => {
    setStationForAnalysis(station);
    setIsAnalysisOpen(true);
  };

  // Convert StationData to DecisionInputPoint for the Decision Engine
  const pointForDecisionModal: DecisionInputPoint | null = stationForAnalysis ? {
    id: stationForAnalysis.id,
    title: stationForAnalysis.name,
    district: stationForAnalysis.district,
    address: `Sector ${stationForAnalysis.district} - Estación de Monitoreo`,
    coordinates: stationForAnalysis.coordinates,
    parameter: 'PM2.5',
    value: stationForAnalysis.pm25,
    unit: 'µg/m³',
    date: '2026-08-23',
    time: '10:00',
    source: 'SENAMHI / Red Metropolitana',
    equipment: 'Monitor Beta Atenuación BAM-1020',
    zoneType: stationForAnalysis.zoneType,
    reliabilityScore: 94,
    trend: stationForAnalysis.pm25 > 50 ? 'EMPEORANDO' : 'ESTABLE',
    secondaryParameter: {
      name: 'Ruido Diurno',
      value: stationForAnalysis.noiseDay,
      unit: 'dBA'
    }
  } : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      
      {/* 1, 2, 3: Logo, Menú Principal y Switcher Ciudadano/Profesional */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenMap={() => setIsMapOpen(true)}
        onOpenAnalysis={() => {
          setStationForAnalysis(null);
          setIsAnalysisOpen(true);
        }}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        
        {/* 4, 5, 6: Presentación del proyecto, Botones "Explorar ECO-MAP" e "Iniciar análisis" */}
        <HeroSection
          viewMode={viewMode}
          onOpenMap={() => setIsMapOpen(true)}
          onOpenAnalysis={() => {
            setStationForAnalysis(null);
            setIsAnalysisOpen(true);
          }}
          onSelectStation={handleOpenMapWithStation}
        />

        {/* MAPA INTERACTIVO GIS DE LIMA */}
        <MapSection
          onOpenAnalysisWithStation={handleOpenAnalysisWithStation}
          viewMode={viewMode}
          onOpenFullMapModal={() => setIsMapOpen(true)}
        />

        {/* MOTOR DE DECISIÓN AMBIENTAL - EL CORAZÓN INTELIGENTE DE ECO-MAP */}
        <DecisionEngineSection />

        {/* MÓDULO DE DATOS AMBIENTALES (FORMULARIO, EXCEL, CSV, JSON, GEOJSON) */}
        <EnvironmentalDataSection />

        {/* 7: Sección "Calidad del Aire" */}
        <AirQualitySection
          viewMode={viewMode}
          onSelectStationForMap={handleOpenMapWithStation}
          onOpenAnalysisWithStation={handleOpenAnalysisWithStation}
        />

        {/* 8: Sección "Ruido Ambiental" */}
        <NoiseSection
          viewMode={viewMode}
          onSelectStationForMap={handleOpenMapWithStation}
          onOpenAnalysisWithStation={handleOpenAnalysisWithStation}
        />

        {/* 9: MÓDULO METEOROLÓGICO Y ROSA DE VIENTOS */}
        <MeteorologySection
          onSelectStationForMap={handleOpenMapWithStation}
        />

        {/* 10: MÓDULO DE FUENTES DE EMISIÓN (CHIMENEAS, LINEALES, ÁREA) */}
        <EmissionSourcesSection
          onSelectSourceForMap={handleOpenMapWithStation}
        />

        {/* 11: Sección "Modelamiento" */}
        <ModelingSection
          viewMode={viewMode}
          onOpenAnalysis={() => {
            setStationForAnalysis(null);
            setIsAnalysisOpen(true);
          }}
        />

        {/* 10: Sección "Datos y fuentes" */}
        <SourcesSection />

        {/* 11: Sección "¿Cómo funciona?" */}
        <HowItWorksSection />

        {/* 12: Sección "Planes" */}
        <PricingPlansSection
          onOpenAnalysis={() => {
            setStationForAnalysis(null);
            setIsAnalysisOpen(true);
          }}
        />

        {/* 13: Sección "Contacto" */}
        <ContactSection />
      </main>

      {/* Institutional Footer */}
      <Footer />

      {/* Interactive Leaflet GIS Map Modal */}
      <InteractiveMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        selectedStationId={selectedStationIdForMap}
        onOpenAnalysisWithStation={handleOpenAnalysisWithStation}
        viewMode={viewMode}
      />

      {/* Environmental Decision Engine Modal (ECO-MAP Core Engine) */}
      <DecisionEngineModal
        isOpen={isAnalysisOpen}
        onClose={() => setIsAnalysisOpen(false)}
        initialPoint={pointForDecisionModal}
      />

    </div>
  );
}
