import React from 'react';
import { Radio, Activity, Layers, Cpu, CheckCircle2, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';
import { AcousticMethodologyType } from '../../types/noiseQuality';

interface NoiseMethodologyExplainerProps {
  selectedMethod?: AcousticMethodologyType | 'ALL';
  onSelectMethod?: (method: AcousticMethodologyType | 'ALL') => void;
}

export const NoiseMethodologyExplainer: React.FC<NoiseMethodologyExplainerProps> = ({
  selectedMethod = 'ALL',
  onSelectMethod
}) => {
  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-bold uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3 h-3" />
            Marco Metodológico Acústico Diferenciado
          </div>
          <h3 className="text-lg font-black text-white">
            Tres Niveles de Información Acústica: Medición, Interpolación y Modelamiento
          </h3>
          <p className="text-xs text-slate-400 max-w-3xl">
            La gestión integral del ruido ambiental requiere distinguir con precisión el origen y la validez técnica de los datos para evitar confusiones periciales o jurídicas.
          </p>
        </div>

        {onSelectMethod && (
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => onSelectMethod('ALL')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                selectedMethod === 'ALL' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => onSelectMethod('MEDICION')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                selectedMethod === 'MEDICION' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Medición
            </button>
            <button
              type="button"
              onClick={() => onSelectMethod('INTERPOLACION')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                selectedMethod === 'INTERPOLACION' ? 'bg-blue-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Interpolación
            </button>
            <button
              type="button"
              onClick={() => onSelectMethod('MODELAMIENTO')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                selectedMethod === 'MODELAMIENTO' ? 'bg-purple-500 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Modelamiento
            </button>
          </div>
        )}
      </div>

      {/* 3 COMPARATIVE PILLARS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* PILLAR 1: MEDICION */}
        <div className={`p-5 rounded-2xl border transition-all space-y-3.5 relative overflow-hidden ${
          selectedMethod === 'MEDICION' || selectedMethod === 'ALL'
            ? 'bg-slate-950/80 border-emerald-500/40 ring-1 ring-emerald-500/20'
            : 'bg-slate-950/40 border-slate-800 opacity-60'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
              1. Empírico / In Situ
            </span>
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>

          <h4 className="text-base font-black text-white flex items-center gap-2">
            <span>MEDICIÓN</span>
          </h4>

          <p className="text-xs text-slate-300 leading-relaxed">
            Captura física y directa de la presión acústica en un punto y tiempo específicos mediante un <strong>sonómetro integrador Clase 1 o 2</strong> con micrófono calibrado in situ.
          </p>

          <div className="space-y-2 text-[11px] text-slate-300 border-t border-slate-800/80 pt-3">
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Validez Legal:</strong> Apto para fiscalización, sanción y procesos judiciales (D.S. 085-2003).</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Requisito:</strong> Calibración acústica previa y posterior con deriva Δ ≤ 0.5 dB.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Limitación:</strong> Representatividad espacial limitada al punto exacto del receptor.</span>
            </div>
          </div>
        </div>

        {/* PILLAR 2: INTERPOLACION */}
        <div className={`p-5 rounded-2xl border transition-all space-y-3.5 relative overflow-hidden ${
          selectedMethod === 'INTERPOLACION' || selectedMethod === 'ALL'
            ? 'bg-slate-950/80 border-blue-500/40 ring-1 ring-blue-500/20'
            : 'bg-slate-950/40 border-slate-800 opacity-60'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase">
              2. Geoestadístico / 2D
            </span>
            <Layers className="w-5 h-5 text-blue-400" />
          </div>

          <h4 className="text-base font-black text-white flex items-center gap-2">
            <span>INTERPOLACIÓN</span>
          </h4>

          <p className="text-xs text-slate-300 leading-relaxed">
            Estimación espacial matemática (IDW, Kriging o Splines) que genera una superficie continua y <strong>curvas isófonas</strong> a partir de una malla de puntos medidos reales.
          </p>

          <div className="space-y-2 text-[11px] text-slate-300 border-t border-slate-800/80 pt-3">
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <span><strong>Utilidad:</strong> Visualización de mapas de calor sonoro e identificación de zonas calientes.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <span><strong>Ventaja:</strong> Permite estimar niveles entre estaciones sin costo de instrumentar cada cuadra.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Limitación:</strong> No considera apantallamiento de edificios ni reflexiones en fachadas.</span>
            </div>
          </div>
        </div>

        {/* PILLAR 3: MODELAMIENTO */}
        <div className={`p-5 rounded-2xl border transition-all space-y-3.5 relative overflow-hidden ${
          selectedMethod === 'MODELAMIENTO' || selectedMethod === 'ALL'
            ? 'bg-slate-950/80 border-purple-500/40 ring-1 ring-purple-500/20'
            : 'bg-slate-950/40 border-slate-800 opacity-60'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 uppercase">
              3. Físico / Predictivo 3D
            </span>
            <Cpu className="w-5 h-5 text-purple-400" />
          </div>

          <h4 className="text-base font-black text-white flex items-center gap-2">
            <span>MODELAMIENTO</span>
          </h4>

          <p className="text-xs text-slate-300 leading-relaxed">
            Simulación numérica basada en física acústica (<strong>ISO 9613-2 / CNOSSOS-EU</strong>) calculando potencia de fuente ($L_w$), atenuación geométrica, difracción en barreras y reflexión urbana 3D.
          </p>

          <div className="space-y-2 text-[11px] text-slate-300 border-t border-slate-800/80 pt-3">
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
              <span><strong>Capacidad Predictiva:</strong> Permite evaluar escenarios futuros ("¿Qué pasa si se coloca una barrera?").</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
              <span><strong>Precisión Física:</strong> Modela sombras acústicas, reflexiones de primer y segundo orden.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Requisito:</strong> Demanda datos de aforo vehicular, modelos 3D de edificación y clima.</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
