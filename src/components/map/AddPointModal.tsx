import React, { useState, useEffect } from 'react';
import { MapPinPlus, X, Wind, Volume2, Sparkles, Check } from 'lucide-react';
import { CustomUserPoint } from '../../types/gis';
import { ZoneType } from '../../types';
import { estimateEnvironmentalAtCoordinate, latLngToUTM18S } from '../../utils/gisUtils';

interface AddPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  coordinates: [number, number] | null;
  onSavePoint: (point: CustomUserPoint) => void;
}

export const AddPointModal: React.FC<AddPointModalProps> = ({
  isOpen,
  onClose,
  coordinates,
  onSavePoint
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CustomUserPoint['category']>('Monitoreo de Campo');
  const [zoneType, setZoneType] = useState<ZoneType>('Residencial');
  const [notes, setNotes] = useState('');

  if (!isOpen || !coordinates) return null;

  const utm = latLngToUTM18S(coordinates[0], coordinates[1]);
  const estimated = estimateEnvironmentalAtCoordinate(coordinates[0], coordinates[1], zoneType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPoint: CustomUserPoint = {
      id: `pt-${Date.now()}`,
      name: name.trim() || `Punto ${coordinates[0].toFixed(3)}, ${coordinates[1].toFixed(3)}`,
      category,
      zoneType,
      coordinates,
      pm25Estimated: estimated.pm25,
      noiseEstimated: estimated.noiseDay,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString()
    };
    onSavePoint(newPoint);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <MapPinPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Nuevo Punto de Monitoreo</h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Lat: {coordinates[0].toFixed(5)}, Lng: {coordinates[1].toFixed(5)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Coordinates Summary Badge */}
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">UTM 18S:</span>
            <span className="text-teal-400 font-bold">{utm.easting} E / {utm.northing} N</span>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Nombre o Etiqueta del Punto *</label>
            <input
              type="text"
              required
              placeholder="Ej: Monitoreo Esquina Av. Abancay / Denuncia Fábrica"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-400"
            >
              <option value="Monitoreo de Campo">Monitoreo de Campo (Consultoría)</option>
              <option value="Denuncia Ciudadana">Denuncia Ciudadana / Alerta Vecinal</option>
              <option value="Foco Industrial">Foco Industrial / Chimenea / Taller</option>
              <option value="Tráfico Pesado">Tráfico Pesado / Corredor Vehicular</option>
              <option value="Zona Sensible">Zona Sensible (Colegio / Hospital / Parque)</option>
            </select>
          </div>

          {/* Zonification */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Zonificación Municipal</label>
            <select
              value={zoneType}
              onChange={(e) => setZoneType(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-400"
            >
              <option value="Residencial">Residencial (ECA Ruido: 60 dBA)</option>
              <option value="Comercial">Comercial (ECA Ruido: 70 dBA)</option>
              <option value="Industrial">Industrial (ECA Ruido: 80 dBA)</option>
              <option value="ProteccionEspecial">Protección Especial (ECA Ruido: 50 dBA)</option>
            </select>
          </div>

          {/* Automated estimation preview */}
          <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
              <Sparkles className="w-3.5 h-3.5" /> Estimación Geoespacial Automática
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[11px]">
              <div>PM2.5 est.: <strong className="text-white">{estimated.pm25} µg/m³</strong></div>
              <div>Ruido est.: <strong className="text-white">{estimated.noiseDay} dBA</strong></div>
            </div>
            <div className="text-[10px] text-slate-400">
              Basado en estación más cercana: {estimated.closestStationName} ({estimated.distanceToStationKm} km)
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Notas / Observaciones de Campo</label>
            <textarea
              rows={2}
              placeholder="Detalles del emisor, horario de mayor impacto, presencia de polvo..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Guardar Punto en Mapa
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
