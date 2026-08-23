import React, { useState, useMemo, useEffect } from 'react';
import { 
  CloudSun, 
  Wind, 
  Compass, 
  Layers, 
  Plus, 
  BarChart2, 
  Table, 
  Sparkles, 
  Download, 
  RefreshCw,
  MapPin,
  Clock,
  Thermometer,
  ShieldCheck
} from 'lucide-react';
import { 
  MeteorologicalRecord, 
  WindRoseData 
} from '../../types/meteorology';
import { 
  OFFICIAL_METEOROLOGICAL_STATIONS, 
  DEFAULT_WIND_ROSE_CAMPO_DE_MARTE,
  generate24hMeteorologicalSeries 
} from '../../data/meteorologyData';
import { buildWindRoseData } from '../../utils/meteorologyCalculations';
import { WindRose } from '../meteorology/WindRose';
import { MeteorologyStationCard } from '../meteorology/MeteorologyStationCard';
import { AtmosphericStabilityWidget } from '../meteorology/AtmosphericStabilityWidget';
import { MeteorologyTimeSeriesChart } from '../meteorology/MeteorologyTimeSeriesChart';
import { MeteorologyTable } from '../meteorology/MeteorologyTable';
import { MeteorologyInputModal } from '../meteorology/MeteorologyInputModal';

interface MeteorologySectionProps {
  onSelectStationForMap?: (stationId: string) => void;
}

type TabMode = 'ROSA_VIENTOS' | 'ESTABILIDAD_DISPERSION' | 'EVOLUCION_24H' | 'TABLA_REGISTROS';

export const MeteorologySection: React.FC<MeteorologySectionProps> = ({
  onSelectStationForMap
}) => {
  // State for records (initialized from official data + localStorage)
  const [records, setRecords] = useState<MeteorologicalRecord[]>(() => {
    try {
      const stored = localStorage.getItem('ecomap_meteorological_records');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...OFFICIAL_METEOROLOGICAL_STATIONS, ...parsed.filter((p: any) => p.isUserAdded)];
        }
      }
    } catch (e) {
      console.warn('Error reading stored meteorological records', e);
    }
    return OFFICIAL_METEOROLOGICAL_STATIONS;
  });

  const [selectedStationId, setSelectedStationId] = useState<string>(
    OFFICIAL_METEOROLOGICAL_STATIONS[0].id
  );
  const [activeTab, setActiveTab] = useState<TabMode>('ROSA_VIENTOS');
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [periodFilter, setPeriodFilter] = useState<'24H' | 'DIURNO' | 'NOCTURNO'>('24H');

  // Selected station record
  const selectedStation = useMemo(() => {
    return records.find(r => r.id === selectedStationId) || records[0];
  }, [records, selectedStationId]);

  // Compute live wind rose for currently selected station
  const currentWindRoseData = useMemo<WindRoseData>(() => {
    if (!selectedStation) return DEFAULT_WIND_ROSE_CAMPO_DE_MARTE;

    const series24 = generate24hMeteorologicalSeries(selectedStation);
    let filteredSeries = series24;

    if (periodFilter === 'DIURNO') {
      filteredSeries = series24.filter((_, idx) => idx >= 6 && idx <= 18);
    } else if (periodFilter === 'NOCTURNO') {
      filteredSeries = series24.filter((_, idx) => idx < 6 || idx > 18);
    }

    const obs: { windSpeed: number; windDirectionDegrees: number }[] = [];
    
    // Simulate natural turbulent variation around each hour
    const repetitions = periodFilter === '24H' ? 15 : 20;
    for (let day = 0; day < repetitions; day++) {
      filteredSeries.forEach(pt => {
        const noiseDir = (Math.random() - 0.5) * 18;
        const noiseSpeed = (Math.random() - 0.5) * 1.0;
        obs.push({
          windSpeed: Math.max(pt.windSpeed + noiseSpeed, 0.2),
          windDirectionDegrees: (pt.windDirectionDegrees + noiseDir + 360) % 360
        });
      });
    }

    const periodDesc = 
      periodFilter === '24H' 
        ? 'Régimen Completo (24 Horas / 360 Obs)' 
        : periodFilter === 'DIURNO' 
        ? 'Régimen Diurno (Brisa Marina 06:00 - 18:00)' 
        : 'Régimen Nocturno (Terral y Calmas 19:00 - 05:00)';

    return buildWindRoseData(obs, selectedStation.id, selectedStation.stationName, periodDesc);
  }, [selectedStation, periodFilter]);

  const handleAddRecord = (newRec: MeteorologicalRecord) => {
    setRecords(prev => {
      const updated = [newRec, ...prev];
      try {
        const userOnly = updated.filter(r => r.isUserAdded);
        localStorage.setItem('ecomap_meteorological_records', JSON.stringify(userOnly));
      } catch (e) {
        console.error('Error saving record', e);
      }
      return updated;
    });
    setSelectedStationId(newRec.id);
  };

  return (
    <section id="meteorologia" className="py-20 bg-slate-950 text-white relative overflow-hidden border-t border-slate-800">
      
      {/* BACKGROUND AMBIENT GLOW */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[300px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-800">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <CloudSun className="w-4 h-4" /> Módulo Meteorológico & Dinámica de Vientos
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
              Meteorología Ambiental & Rosa de Vientos
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Monitoreo y análisis de variables micrometeorológicas: Temperatura, Humedad, Presión, Velocidad y Dirección del Viento, Radiación Solar, Precipitación, Capa de Mezcla y Diagnóstico de Estabilidad Pasquill-Gifford con datos oficiales (SENAMHI / Redes Industriales).
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsInputModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition transform active:scale-95"
            >
              <Plus className="w-4 h-4" /> Ingresar Datos Meteorológicos
            </button>
          </div>
        </div>

        {/* TOP STATION SELECTOR CAROUSEL / ROW */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Estaciones Meteorológicas Activas ({records.length})
            </h3>
            <span className="text-xs text-slate-500">Haz clic en una estación para cargar sus vectores de viento</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {records.slice(0, 6).map((st) => (
              <MeteorologyStationCard
                key={st.id}
                station={st}
                isSelected={st.id === selectedStationId}
                onSelect={() => setSelectedStationId(st.id)}
              />
            ))}
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('ROSA_VIENTOS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'ROSA_VIENTOS'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Compass className="w-4 h-4" /> Rosa de los Vientos (Wind Rose)
          </button>

          <button
            onClick={() => setActiveTab('ESTABILIDAD_DISPERSION')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'ESTABILIDAD_DISPERSION'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" /> Estabilidad & Capa Límite (Pasquill-Gifford)
          </button>

          <button
            onClick={() => setActiveTab('EVOLUCION_24H')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'EVOLUCION_24H'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <BarChart2 className="w-4 h-4" /> Ciclo Temporal 24 Horas
          </button>

          <button
            onClick={() => setActiveTab('TABLA_REGISTROS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'TABLA_REGISTROS'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Table className="w-4 h-4" /> Inventario de Registros ({records.length})
          </button>
        </div>

        {/* TAB 1: WIND ROSE VIEW */}
        {activeTab === 'ROSA_VIENTOS' && (
          <div className="space-y-6">
            
            {/* PERIOD SELECTOR PILL */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Filtro de Régimen de Vientos:</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setPeriodFilter('24H')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                    periodFilter === '24H'
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  24 Horas (Completo)
                </button>
                <button
                  onClick={() => setPeriodFilter('DIURNO')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                    periodFilter === 'DIURNO'
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Diurno (Brisa marina 06h - 18h)
                </button>
                <button
                  onClick={() => setPeriodFilter('NOCTURNO')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                    periodFilter === 'NOCTURNO'
                      ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Nocturno (Terral y Calmas)
                </button>
              </div>
            </div>

            {/* MAIN WIND ROSE COMPONENT */}
            <WindRose
              data={currentWindRoseData}
              onExportCsv={() => {
                const headers = ['Sector', 'Rumbo_Grados', 'Frecuencia_Total_Porc', 'Vel_0_5_a_2_1', 'Vel_2_1_a_3_6', 'Vel_3_6_a_5_7', 'Vel_5_7_a_8_8', 'Vel_Mayor_8_8'];
                const rows = currentWindRoseData.sectors.map(s => [
                  s.direction,
                  s.degreesMid,
                  s.totalFrequencyPercent,
                  ...s.speedBins.map(b => b.frequencyPercent)
                ]);
                const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
                const link = document.createElement('a');
                link.setAttribute('href', encodeURI(csv));
                link.setAttribute('download', `Rosa_Vientos_${selectedStation.stationName.replace(/\s+/g, '_')}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            />

            {/* SYNCED QUICK DIAGNOSIS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AtmosphericStabilityWidget
                currentClass={selectedStation.pasquillClass}
                mixingHeight={selectedStation.mixingHeightMeters}
                hasInversion={selectedStation.thermalInversionPresent}
                inversionBase={selectedStation.inversionBaseHeightMeters}
                windSpeed={selectedStation.windSpeed}
              />
              <MeteorologyTimeSeriesChart station={selectedStation} />
            </div>

          </div>
        )}

        {/* TAB 2: ATMOSPHERIC STABILITY & DISPERSION */}
        {activeTab === 'ESTABILIDAD_DISPERSION' && (
          <div className="space-y-6">
            <AtmosphericStabilityWidget
              currentClass={selectedStation.pasquillClass}
              mixingHeight={selectedStation.mixingHeightMeters}
              hasInversion={selectedStation.thermalInversionPresent}
              inversionBase={selectedStation.inversionBaseHeightMeters}
              windSpeed={selectedStation.windSpeed}
            />
            <MeteorologyTimeSeriesChart station={selectedStation} />
          </div>
        )}

        {/* TAB 3: 24H TIME SERIES */}
        {activeTab === 'EVOLUCION_24H' && (
          <div className="space-y-6">
            <MeteorologyTimeSeriesChart station={selectedStation} />
          </div>
        )}

        {/* TAB 4: COMPLETE TABLE VIEW */}
        {activeTab === 'TABLA_REGISTROS' && (
          <MeteorologyTable
            records={records}
            onSelectStation={(rec) => {
              setSelectedStationId(rec.id);
              setActiveTab('ROSA_VIENTOS');
            }}
            onOpenInputModal={() => setIsInputModalOpen(true)}
          />
        )}

      </div>

      {/* INPUT MODAL */}
      <MeteorologyInputModal
        isOpen={isInputModalOpen}
        onClose={() => setIsInputModalOpen(false)}
        onAddRecord={handleAddRecord}
      />

    </section>
  );
};
