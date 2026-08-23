import React, { useState, useMemo } from 'react';
import { Cpu, Layers, Sparkles, Sliders, Shield, Radio, ArrowRight, Activity, Info } from 'lucide-react';
import { calculatePointSourceAttenuation, PERUVIAN_NOISE_NORMATIVE } from '../../utils/noiseNormative';
import { NoiseZoneType } from '../../types/noiseQuality';

export const NoiseAcousticModelingWidget: React.FC = () => {
  // Simulator Parameters
  const [soundPowerLw, setSoundPowerLw] = useState<number>(105); // dB (e.g. Heavy truck / compressor / factory)
  const [sourceType, setSourceType] = useState<'PUNTUAL' | 'LINEAL_VIAL'>('LINEAL_VIAL');
  const [barrierHeightMeters, setBarrierHeightMeters] = useState<number>(3.0); // Acoustic screen height (m)
  const [hasBarrier, setHasBarrier] = useState<boolean>(true);
  const [groundType, setGroundType] = useState<'DURO' | 'POROSO'>('DURO'); // Asfalto vs Césped
  const [targetZone, setTargetZone] = useState<NoiseZoneType>('Residencial');

  const barrierAttenuationDb = hasBarrier ? Math.min(5 + barrierHeightMeters * 2.5, 20) : 0;
  const groundAbsorptionG = groundType === 'POROSO' ? 0.8 : 0.1;

  const targetLimitDay = PERUVIAN_NOISE_NORMATIVE[targetZone].dayLimit;
  const targetLimitNight = PERUVIAN_NOISE_NORMATIVE[targetZone].nightLimit;

  // Compute attenuation curve from 5m to 200m
  const distances = [5, 10, 20, 35, 50, 75, 100, 150, 200];
  
  const simulationPoints = useMemo(() => {
    return distances.map((dist) => {
      let lp = 0;
      if (sourceType === 'PUNTUAL') {
        // Spherical divergence: 20 * log10(r) + 11
        lp = calculatePointSourceAttenuation(soundPowerLw, dist, barrierAttenuationDb, groundAbsorptionG);
      } else {
        // Line source cylindrical divergence: 10 * log10(r) + 8
        const aDivLine = 10 * Math.log10(dist) + 8;
        const aAtm = 0.005 * dist;
        const aGround = groundAbsorptionG * 1.8;
        lp = Math.max(Number((soundPowerLw - aDivLine - aAtm - barrierAttenuationDb - aGround).toFixed(1)), 30.0);
      }

      return {
        dist,
        lp,
        exceedsDay: lp > targetLimitDay,
        exceedsNight: lp > targetLimitNight
      };
    });
  }, [soundPowerLw, sourceType, barrierAttenuationDb, groundAbsorptionG, targetLimitDay, targetLimitNight]);

  // Critical setback distance where ECA Day is satisfied
  const safeDistanceDay = simulationPoints.find(p => !p.exceedsDay)?.dist || '> 200m';

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-2xl">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[11px] font-bold uppercase tracking-wider mb-1.5">
            <Cpu className="w-3.5 h-3.5" />
            Motor de Simulación Acústica ISO 9613-2 / CNOSSOS-EU
          </div>
          <h3 className="text-lg font-black text-white">
            Modelamiento Predictivo de Propagación & Atenuación de Barreras
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl">
            Simule el decaimiento de presión sonora según la distancia a la fuente, absorción del suelo y la atenuación por inserción de pantallas acústicas urbanas.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-purple-500/30 text-[11px] font-mono text-purple-300 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Física Acústica 3D</span>
        </div>
      </div>

      {/* CONTROLS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT: SLIDERS & CONFIG */}
        <div className="lg:col-span-5 space-y-4 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
          <div className="font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-4 h-4" />
            Variables del Modelo
          </div>

          {/* Source Power Lw */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-bold">Potencia Sonora de Fuente (Lw):</span>
              <span className="font-mono font-black text-purple-300 text-sm">{soundPowerLw} dB</span>
            </div>
            <input
              type="range"
              min="70"
              max="130"
              step="1"
              value={soundPowerLw}
              onChange={(e) => setSoundPowerLw(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>70 dB (Vehículo ligero)</span>
              <span>100 dB (Bus/Camión)</span>
              <span>130 dB (Turbofán/Planta)</span>
            </div>
          </div>

          {/* Source Geometry */}
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-bold">Geometría de la Fuente:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSourceType('LINEAL_VIAL')}
                className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  sourceType === 'LINEAL_VIAL' ? 'bg-purple-500 text-white border-purple-400' : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                Lineal (Autopista / Vía)
              </button>
              <button
                type="button"
                onClick={() => setSourceType('PUNTUAL')}
                className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  sourceType === 'PUNTUAL' ? 'bg-purple-500 text-white border-purple-400' : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                Puntual (Fábrica / Obra)
              </button>
            </div>
          </div>

          {/* Barrier Toggle & Height */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-bold">
                <input
                  type="checkbox"
                  checked={hasBarrier}
                  onChange={(e) => setHasBarrier(e.target.checked)}
                  className="rounded border-slate-700 text-purple-500 focus:ring-purple-400"
                />
                <span>Incorporar Pantalla Acústica</span>
              </label>
              {hasBarrier && (
                <span className="font-mono text-emerald-400 font-bold">
                  -{barrierAttenuationDb.toFixed(1)} dB inserción
                </span>
              )}
            </div>

            {hasBarrier && (
              <div className="space-y-1 pl-4">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Altura de Barrera:</span>
                  <span className="font-mono font-bold text-white">{barrierHeightMeters} metros</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="6.0"
                  step="0.5"
                  value={barrierHeightMeters}
                  onChange={(e) => setBarrierHeightMeters(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Ground Surface */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <label className="block text-slate-300 font-bold">Superficie del Suelo:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGroundType('DURO')}
                className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  groundType === 'DURO' ? 'bg-slate-800 text-cyan-300 border-cyan-500/40' : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                Duro (Asfalto / Concreto)
              </button>
              <button
                type="button"
                onClick={() => setGroundType('POROSO')}
                className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  groundType === 'POROSO' ? 'bg-slate-800 text-emerald-300 border-emerald-500/40' : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                Poroso (Parques / Césped)
              </button>
            </div>
          </div>

          {/* Target Zoning Limit */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <label className="block text-slate-300 font-bold">Receptor / Zonificación Objetivo:</label>
            <select
              value={targetZone}
              onChange={(e) => setTargetZone(e.target.value as NoiseZoneType)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
            >
              <option value="ProteccionEspecial">Zona Protección Especial (50 / 40 dBA)</option>
              <option value="Residencial">Zona Residencial (60 / 50 dBA)</option>
              <option value="Comercial">Zona Comercial (70 / 60 dBA)</option>
              <option value="Industrial">Zona Industrial (80 / 70 dBA)</option>
            </select>
          </div>
        </div>

        {/* RIGHT: DISTANCE DECAY TABLE & CHART */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* SAFE SETBACK KPI */}
          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/40 flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-300 block">
                Distancia Mínima de Amortiguamiento (Buffer Diurno)
              </span>
              <span className="text-xl font-mono font-black text-white">
                {safeDistanceDay} metros
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Para alcanzar ≤ {targetLimitDay} dBA ({targetZone})
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Atenuación Pantalla</span>
              <span className="text-lg font-mono font-bold text-emerald-400">
                {hasBarrier ? `-${barrierAttenuationDb.toFixed(1)} dBA` : '0 dBA (Sin barrera)'}
              </span>
            </div>
          </div>

          {/* SIMULATION POINTS BARS */}
          <div className="space-y-2 p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
              <span>Distancia al Receptor</span>
              <span>Lp Calculado vs ECA ({targetLimitDay} dBA)</span>
            </div>

            <div className="space-y-2">
              {simulationPoints.map((pt) => {
                const exceeds = pt.lp > targetLimitDay;
                const percent = Math.min((pt.lp / 110) * 100, 100);

                return (
                  <div key={pt.dist} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-300 font-bold">{pt.dist} m</span>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white">{pt.lp} dBA</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-sans font-bold ${
                          exceeds ? 'bg-rose-950 text-rose-300 border border-rose-600' : 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                        }`}>
                          {exceeds ? `+${(pt.lp - targetLimitDay).toFixed(1)} dB` : 'Cumple ECA'}
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          exceeds ? 'bg-gradient-to-r from-amber-500 to-rose-500' : 'bg-gradient-to-r from-teal-500 to-emerald-400'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
