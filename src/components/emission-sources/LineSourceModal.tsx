import React, { useState } from 'react';
import { X, Plus, Navigation, Truck, MapPin } from 'lucide-react';
import { RoadwayLineSource, PollutantEmissionRate } from '../../types/emissionSources';

interface LineSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSource: (source: RoadwayLineSource) => void;
}

export const LineSourceModal: React.FC<LineSourceModalProps> = ({
  isOpen,
  onClose,
  onAddSource
}) => {
  const [name, setName] = useState('Tramo Corredor Metropolitano');
  const [district, setDistrict] = useState('Lima');
  const [startLat, setStartLat] = useState<number>(-12.0650);
  const [startLng, setStartLng] = useState<number>(-77.0350);
  const [endLat, setEndLat] = useState<number>(-12.0850);
  const [endLng, setEndLng] = useState<number>(-77.0300);
  const [lengthMeters, setLengthMeters] = useState<number>(2500);
  const [roadwayWidth, setRoadwayWidth] = useState<number>(24.0);
  const [releaseHeight, setReleaseHeight] = useState<number>(1.2);
  const [trafficVolume, setTrafficVolume] = useState<number>(4500);
  const [heavyVehicles, setHeavyVehicles] = useState<number>(15);
  const [avgSpeed, setAvgSpeed] = useState<number>(50);

  // Pollutant emission rates
  const [noxLinear, setNoxLinear] = useState<number>(0.0035); // g/s·m
  const [pm10Linear, setPm10Linear] = useState<number>(0.0008); // g/s·m

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const pollutants: PollutantEmissionRate[] = [
      {
        pollutant: 'NOX',
        rateValue: Number((noxLinear * lengthMeters).toFixed(3)),
        rateUnit: 'g/s'
      },
      {
        pollutant: 'PM10',
        rateValue: Number((pm10Linear * lengthMeters).toFixed(3)),
        rateUnit: 'g/s'
      }
    ];

    const newLine: RoadwayLineSource = {
      id: `LINE-USER-${Date.now()}`,
      type: 'LINEAL_VIA',
      name,
      district,
      startCoordinates: [startLat, startLng],
      endCoordinates: [endLat, endLng],
      lengthMeters,
      roadwayWidthMeters: roadwayWidth,
      releaseHeightMeters: releaseHeight,
      trafficVolumeVehiclesPerHour: trafficVolume,
      heavyVehiclesPercent: heavyVehicles,
      averageSpeedKmh: avgSpeed,
      linearEmissionRateGPerSMeter: noxLinear,
      pollutants,
      isUserAdded: true
    };

    onAddSource(newLine);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-indigo-500/30 text-indigo-400">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Ingreso de Fuente Lineal: Vía / Carretera</h2>
              <p className="text-xs text-slate-400">Emisiones vehiculares lineales continuas por tramo vial</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-4">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> 1. Geometría del Tramo y Coordenadas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nombre de la Vía / Avenida</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Distrito(s)</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Coordenadas Inicio (Lat, Lng)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.0001"
                    value={startLat}
                    onChange={(e) => setStartLat(parseFloat(e.target.value))}
                    className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                  <input
                    type="number"
                    step="0.0001"
                    value={startLng}
                    onChange={(e) => setStartLng(parseFloat(e.target.value))}
                    className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Coordenadas Fin (Lat, Lng)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.0001"
                    value={endLat}
                    onChange={(e) => setEndLat(parseFloat(e.target.value))}
                    className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                  <input
                    type="number"
                    step="0.0001"
                    value={endLng}
                    onChange={(e) => setEndLng(parseFloat(e.target.value))}
                    className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Longitud del Tramo (m)</label>
                <input
                  type="number"
                  min="10"
                  step="10"
                  required
                  value={lengthMeters}
                  onChange={(e) => setLengthMeters(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Ancho de Calzada (m)</label>
                <input
                  type="number"
                  min="3"
                  step="0.5"
                  value={roadwayWidth}
                  onChange={(e) => setRoadwayWidth(parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-4">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-4 h-4" /> 2. Tráfico Vehicular y Tasas de Emisión Lineales
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Flujo (veh/hora)</label>
                <input
                  type="number"
                  min="10"
                  value={trafficVolume}
                  onChange={(e) => setTrafficVolume(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">% Vehículos Pesados (Diesel)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={heavyVehicles}
                  onChange={(e) => setHeavyVehicles(parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Velocidad Promedio (km/h)</label>
                <input
                  type="number"
                  min="5"
                  max="140"
                  value={avgSpeed}
                  onChange={(e) => setAvgSpeed(parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Tasa Lineal $NO_x$ ($g/s \cdot m$)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={noxLinear}
                  onChange={(e) => setNoxLinear(parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Emisión total: {(noxLinear * lengthMeters).toFixed(2)} g/s
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Tasa Lineal $PM_{10}$ ($g/s \cdot m$)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={pm10Linear}
                  onChange={(e) => setPm10Linear(parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Emisión total: {(pm10Linear * lengthMeters).toFixed(2)} g/s
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-400 hover:to-blue-400 rounded-xl shadow-lg shadow-indigo-500/20 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Guardar Fuente Lineal
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
