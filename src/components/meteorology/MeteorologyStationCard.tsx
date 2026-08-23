import React from 'react';
import { MeteorologicalRecord } from '../../types/meteorology';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Compass, 
  Gauge, 
  Sun, 
  CloudRain, 
  ShieldCheck, 
  MapPin, 
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface MeteorologyStationCardProps {
  station: MeteorologicalRecord;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const MeteorologyStationCard: React.FC<MeteorologyStationCardProps> = ({
  station,
  isSelected,
  onSelect
}) => {
  return (
    <div
      onClick={onSelect}
      className={`relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
        isSelected
          ? 'bg-slate-900/95 border-cyan-500 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500'
          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
      }`}
    >
      {/* BADGES & HEADER */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {station.sourceAuthority}
            </span>
            {station.thermalInversionPresent && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Inversión Térmica
              </span>
            )}
          </div>
          <h4 className="text-sm font-bold text-white leading-snug line-clamp-1">
            {station.stationName}
          </h4>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-slate-500" />
            {station.district} • {station.elevationMeters} msnm
          </p>
        </div>

        {/* PASQUILL STABILITY BADGE */}
        <div className="flex flex-col items-end">
          <div className="px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg text-center">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Pasquill</span>
            <span className="text-xs font-black text-emerald-400">Clase {station.pasquillClass}</span>
          </div>
        </div>
      </div>

      {/* METEOROLOGICAL GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 py-3 border-y border-slate-800/80 my-3">
        
        {/* TEMPERATURA */}
        <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/50">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
            <Thermometer className="w-3.5 h-3.5 text-rose-400" /> Temp.
          </div>
          <div className="text-sm font-black text-white font-mono">
            {station.temperature} °C
          </div>
          <div className="text-[9px] text-slate-500">
            P.Rocío: {station.dewPointCelsius}°C
          </div>
        </div>

        {/* HUMEDAD RELATIVA */}
        <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/50">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
            <Droplets className="w-3.5 h-3.5 text-blue-400" /> Humedad
          </div>
          <div className="text-sm font-black text-white font-mono">
            {station.relativeHumidity}%
          </div>
          <div className="text-[9px] text-slate-500">
            {station.relativeHumidity > 80 ? 'Húmedo / Saturado' : 'Confort normal'}
          </div>
        </div>

        {/* VIENTO & DIRECCIÓN */}
        <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/50">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
            <Wind className="w-3.5 h-3.5 text-teal-400" /> Viento
          </div>
          <div className="text-sm font-black text-white font-mono flex items-center gap-1">
            <span>{station.windSpeed} m/s</span>
            <span
              className="inline-block transform text-teal-400"
              style={{ transform: `rotate(${station.windDirectionDegrees}deg)` }}
              title={`Hacia ${station.windDirectionCardinal} (${station.windDirectionDegrees}°)`}
            >
              ↑
            </span>
          </div>
          <div className="text-[9px] text-amber-400 font-semibold">
            {station.windDirectionCardinal} ({station.windDirectionDegrees}°)
          </div>
        </div>

        {/* RADIACIÓN SOLAR */}
        <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/50">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
            <Sun className="w-3.5 h-3.5 text-amber-400" /> Radiación
          </div>
          <div className="text-sm font-black text-white font-mono">
            {station.solarRadiation} W/m²
          </div>
          <div className="text-[9px] text-slate-500">
            UV: {station.uvIndex || '—'}
          </div>
        </div>

        {/* PRESIÓN */}
        <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/50">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
            <Gauge className="w-3.5 h-3.5 text-emerald-400" /> Presión
          </div>
          <div className="text-sm font-black text-white font-mono">
            {station.atmosphericPressure} hPa
          </div>
          <div className="text-[9px] text-slate-500">
            Nivel local
          </div>
        </div>

        {/* CAPA DE MEZCLA */}
        <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/50">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" /> Capa Mezcla
          </div>
          <div className="text-sm font-black text-white font-mono">
            {station.mixingHeightMeters} m
          </div>
          <div className="text-[9px] text-slate-500">
            z0: {station.surfaceRoughnessZ0}m
          </div>
        </div>

      </div>

      {/* FOOTER METADATA */}
      <div className="flex items-center justify-between text-[10px] text-slate-400">
        <span>Último reporte: {station.date} {station.time}</span>
        <span className="text-cyan-400 font-semibold flex items-center gap-0.5 group-hover:underline">
          Ver Rosa de Vientos <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};
