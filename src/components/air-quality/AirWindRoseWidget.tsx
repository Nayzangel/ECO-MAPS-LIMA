import React from 'react';
import { MeteorologyData } from '../../types/airQuality';
import { 
  Wind, 
  Compass, 
  Thermometer, 
  Droplets, 
  Sun, 
  Gauge, 
  ShieldAlert,
  Layers,
  ArrowUp
} from 'lucide-react';

interface AirWindRoseWidgetProps {
  meteorology: MeteorologyData;
  stationName: string;
}

export const AirWindRoseWidget: React.FC<AirWindRoseWidgetProps> = ({
  meteorology,
  stationName
}) => {
  // Cardinal directions for the compass rose
  const directions = [
    { label: 'N', angle: 0 },
    { label: 'NE', angle: 45 },
    { label: 'E', angle: 90 },
    { label: 'SE', angle: 135 },
    { label: 'S', angle: 180 },
    { label: 'SO', angle: 225 },
    { label: 'O', angle: 270 },
    { label: 'NO', angle: 315 }
  ];

  // Inversion theme
  let inversionBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  if (meteorology.thermalInversionRisk === 'CRITICO' || meteorology.thermalInversionRisk === 'ALTO') {
    inversionBadge = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
  } else if (meteorology.thermalInversionRisk === 'MODERADO') {
    inversionBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  }

  return (
    <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              Meteorología & Dispersión Atmosférica
            </h4>
            <p className="text-[10px] text-slate-400">Vector eólico y condiciones termodinámicas</p>
          </div>
        </div>

        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold border ${inversionBadge}`}>
          Inversión Térmica: {meteorology.thermalInversionRisk}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        
        {/* COMPASS / WIND ROSE VISUAL */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center py-2">
          <div className="relative w-36 h-36 rounded-full border-2 border-slate-800 bg-slate-950 flex items-center justify-center shadow-inner">
            
            {/* Cardinal labels */}
            {directions.map((d) => (
              <span
                key={d.label}
                className={`absolute text-[9px] font-mono font-bold ${
                  meteorology.windDirectionCardinal === d.label ? 'text-teal-300 scale-125 font-black' : 'text-slate-500'
                }`}
                style={{
                  top: d.angle === 0 ? '6px' : d.angle === 180 ? 'auto' : '50%',
                  bottom: d.angle === 180 ? '6px' : 'auto',
                  left: d.angle === 270 ? '8px' : d.angle === 90 ? 'auto' : '50%',
                  right: d.angle === 90 ? '8px' : 'auto',
                  transform: d.angle % 90 !== 0 
                    ? `rotate(${d.angle}deg) translate(0, -52px) rotate(-${d.angle}deg)` 
                    : (d.angle === 0 || d.angle === 180) ? 'translateX(-50%)' : 'translateY(-50%)'
                }}
              >
                {d.label}
              </span>
            ))}

            {/* Inner Ring */}
            <div className="w-20 h-20 rounded-full border border-slate-800 flex items-center justify-center bg-slate-900/60">
              
              {/* Rotating Arrow according to wind degree */}
              <div
                className="transition-transform duration-700 ease-out flex flex-col items-center justify-center"
                style={{ transform: `rotate(${meteorology.windDirectionDeg}deg)` }}
              >
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[18px] border-b-teal-400 drop-shadow-[0_0_6px_rgba(45,212,191,0.6)]" />
                <div className="w-1.5 h-6 bg-slate-600 rounded-full -mt-1" />
              </div>

            </div>

            {/* Center Speed Value */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[10px] font-mono font-black text-white bg-slate-950/90 px-1.5 py-0.5 rounded border border-slate-700 shadow">
                {meteorology.windSpeed} m/s
              </span>
            </div>

          </div>

          <span className="text-[10px] text-slate-400 font-mono mt-2">
            Viento desde el <strong>{meteorology.windDirectionCardinal} ({meteorology.windDirectionDeg}°)</strong>
          </span>
        </div>

        {/* METEOROLOGY METRICS TILES */}
        <div className="sm:col-span-7 grid grid-cols-2 gap-2 text-xs">
          
          {/* Temperature */}
          <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              <span>Temperatura</span>
            </div>
            <div className="text-base font-mono font-bold text-white">
              {meteorology.temperature} <span className="text-xs font-normal text-slate-400">°C</span>
            </div>
          </div>

          {/* Humidity */}
          <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>Humedad Relativa</span>
            </div>
            <div className="text-base font-mono font-bold text-white">
              {meteorology.humidity} <span className="text-xs font-normal text-slate-400">%</span>
            </div>
          </div>

          {/* Solar Radiation */}
          <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Sun className="w-3.5 h-3.5 text-yellow-400" />
              <span>Radiación Solar</span>
            </div>
            <div className="text-base font-mono font-bold text-white">
              {meteorology.solarRadiation ?? 480} <span className="text-xs font-normal text-slate-400">W/m²</span>
            </div>
          </div>

          {/* Pressure */}
          <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Gauge className="w-3.5 h-3.5 text-teal-400" />
              <span>Presión Barométrica</span>
            </div>
            <div className="text-base font-mono font-bold text-white">
              {meteorology.atmosphericPressure ?? 1013} <span className="text-xs font-normal text-slate-400">hPa</span>
            </div>
          </div>

        </div>

      </div>

      {/* Atmospheric Insight Box */}
      <div className="p-3 bg-slate-950/90 rounded-2xl border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
        <span className="font-bold text-teal-400">Efecto en la Cuenca de Lima: </span>
        {meteorology.windSpeed < 2.0 
          ? 'Velocidad de viento baja (<2.0 m/s) restringe la dispersión horizontal, favoreciendo la acumulación de contaminantes primarios en Lima Norte y Este.' 
          : 'Viento con velocidad moderada (>2.0 m/s) promueve el transporte de material particulado hacia la vertiente andina.'}
      </div>

    </div>
  );
};
