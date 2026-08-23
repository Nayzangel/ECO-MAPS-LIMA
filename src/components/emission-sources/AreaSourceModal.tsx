import React, { useState } from 'react';
import { X, Plus, Layers, MapPin, Grid } from 'lucide-react';
import { SurfaceAreaSource, PollutantEmissionRate } from '../../types/emissionSources';

interface AreaSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSource: (source: SurfaceAreaSource) => void;
}

export const AreaSourceModal: React.FC<AreaSourceModalProps> = ({
  isOpen,
  onClose,
  onAddSource
}) => {
  const [name, setName] = useState('Patio de Acopio de Minerales / Cantera');
  const [facilityName, setFacilityName] = useState('Instalación Minero-Industrial');
  const [district, setDistrict] = useState('Callao');
  const [lat, setLat] = useState<number>(-12.0400);
  const [lng, setLng] = useState<number>(-77.1350);
  const [areaM2, setAreaM2] = useState<number>(150000);
  const [releaseHeight, setReleaseHeight] = useState<number>(3.0);
  const [pm10AreaRate, setPm10AreaRate] = useState<number>(0.000018); // g/s·m2
  const [notes, setNotes] = useState<string>('Supresores de polvo y control perimetral');

  const areaHa = areaM2 / 10000;
  const totalPm10Gs = pm10AreaRate * areaM2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const pollutants: PollutantEmissionRate[] = [
      {
        pollutant: 'PM10',
        rateValue: Number(totalPm10Gs.toFixed(3)),
        rateUnit: 'g/s'
      },
      {
        pollutant: 'PM2_5',
        rateValue: Number((totalPm10Gs * 0.3).toFixed(3)),
        rateUnit: 'g/s'
      }
    ];

    const newArea: SurfaceAreaSource = {
      id: `AREA-USER-${Date.now()}`,
      type: 'AREA_SUPERFICIAL',
      name,
      facilityName,
      district,
      centerCoordinates: [lat, lng],
      surfaceAreaM2: areaM2,
      surfaceAreaHectares: areaHa,
      releaseHeightMeters: releaseHeight,
      areaEmissionRateGPerSM2: pm10AreaRate,
      pollutants,
      notes,
      isUserAdded: true
    };

    onAddSource(newArea);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400">
              <Grid className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Ingreso de Fuente de Área: Superficie Difusa</h2>
              <p className="text-xs text-slate-400">Canteras, pilas de acopio de concentrados y relaveras</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-4">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> 1. Datos del Predio y Geometría
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nombre de la Fuente de Área</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Titular / Instalación</label>
                <input
                  type="text"
                  required
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Distrito / Localidad</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Superficie Total ($m^2$)</label>
                <input
                  type="number"
                  min="100"
                  step="500"
                  required
                  value={areaM2}
                  onChange={(e) => setAreaM2(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Área: <strong className="text-white">{areaHa.toFixed(2)} hectáreas (ha)</strong>
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Latitud Centroide (WGS84)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Longitud Centroide (WGS84)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-4">
            <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> 2. Tasa de Emisión Específica por Resuspensión Eólica
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Altura de Liberación (z_area en m)</label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={releaseHeight}
                  onChange={(e) => setReleaseHeight(parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tasa Específica PM10 (qa en g/s·m²)
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={pm10AreaRate}
                  onChange={(e) => setPm10AreaRate(parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
                <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">
                  Emisión superficial total: {totalPm10Gs.toFixed(3)} g/s ({((totalPm10Gs * 3600) / 1000).toFixed(2)} kg/h)
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Medidas de Mitigación / Notas</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              />
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
              className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Guardar Fuente de Área
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
