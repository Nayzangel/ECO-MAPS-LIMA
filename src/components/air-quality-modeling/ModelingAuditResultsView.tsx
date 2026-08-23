import React, { useState } from 'react';
import { 
  ModelingSufficiencyAudit, 
  AirQualityModelingProject 
} from '../../types/airQualityModeling';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Cpu, 
  Layers, 
  FileCode, 
  ShieldAlert, 
  Info, 
  Download, 
  Copy, 
  Sparkles, 
  Lock, 
  Compass, 
  Flame, 
  Wind, 
  Mountain, 
  Users, 
  Ban,
  Terminal
} from 'lucide-react';

interface ModelingAuditResultsViewProps {
  project: AirQualityModelingProject;
  audit: ModelingSufficiencyAudit;
}

export const ModelingAuditResultsView: React.FC<ModelingAuditResultsViewProps> = ({
  project,
  audit
}) => {
  const [activeTab, setActiveTab] = useState<'AUDITORIA' | 'INPUT_SCRIPTS' | 'INTEGRACION'>('AUDITORIA');
  const [copiedScript, setCopiedScript] = useState(false);

  const handleCopyScript = () => {
    if (audit.inputScriptPreview?.aermodInp) {
      navigator.clipboard.writeText(audit.inputScriptPreview.aermodInp);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    }
  };

  const handleDownloadInp = () => {
    if (!audit.inputScriptPreview?.aermodInp) return;
    const blob = new Blob([audit.inputScriptPreview.aermodInp], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aermod_control_${project.pollutant.pollutant.toLowerCase()}.inp`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. TOP STATUS BANNER - CRITICAL POLICY NOTICE */}
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/70 border-2 border-amber-500/50 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex-shrink-0">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  ESTADO REGULATORIO DEL MOTOR
                </span>
                <span className="text-xs text-slate-400 font-mono">US-EPA Guidelines / D.S. 003-2017-MINAM</span>
              </div>
              <h3 className="text-lg font-black text-amber-300 tracking-wide mt-1">
                MODELO ESPECIALIZADO PENDIENTE DE INTEGRACIÓN
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
                El sistema ECO-MAP ha preparado la arquitectura de datos, parametrización de fuentes, meteorología (AERMET) y receptores (AERMAP). Sin embargo, <strong>no efectúa simulaciones ficticias ni cálculos aproximados</strong> que sustituyan al motor compilado oficial EPA AERMOD / CALPUFF. Los mapas de isoconcentración se generarán únicamente cuando el motor regulatorio binario esté conectado.
              </p>
            </div>
          </div>

          <div className="flex-shrink-0 bg-slate-950/90 border border-amber-500/30 rounded-xl p-3.5 text-center min-w-[200px]">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Generación de Mapas</div>
            <div className="text-sm font-bold text-rose-400 flex items-center justify-center gap-1.5 mt-1">
              <Ban className="w-4 h-4" /> Bloqueada sin motor
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Integridad Científica</span>
          </div>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION FOR AUDIT DETAILS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('AUDITORIA')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'AUDITORIA'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" /> Diagnóstico & Datos Suficientes
          </button>
          
          <button
            onClick={() => setActiveTab('INPUT_SCRIPTS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'INPUT_SCRIPTS'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4" /> Archivos de Control (.INP / AERMOD)
          </button>

          <button
            onClick={() => setActiveTab('INTEGRACION')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'INTEGRACION'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Cpu className="w-4 h-4" /> Arquitectura para AERMOD / CALPUFF
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Completitud: <strong className="text-emerald-400">{audit.dataCompletenessPercentage}%</strong>
        </div>
      </div>

      {/* 3. TAB: AUDITORÍA DE DATOS (DATOS DISPONIBLES, FALTANTES, RECOMENDADO, LIMITACIONES) */}
      {activeTab === 'AUDITORIA' && (
        <div className="space-y-6">
          
          {/* TOP 2 COLUMNS: MODELO RECOMENDADO & RESUMEN DE COMPLETITUD */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* MODELO RECOMENDADO */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">
                    Resultado del Análisis de Idoneidad Técnica
                  </span>
                  <h4 className="text-base font-bold text-white">
                    MODELO RECOMENDADO
                  </h4>
                </div>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-xl border border-indigo-500/30 space-y-2">
                <div className="text-sm font-black text-indigo-300 font-mono">
                  {audit.recommendedModelFullName}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {audit.recommendationReason}
                </p>
              </div>

              {/* SCREENING VS REFINED APPLICABILITY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${audit.isSufficientForScreening ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {audit.isSufficientForScreening ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-200 block">Modelo de Tamizaje (Screening)</span>
                    <span className="text-[10px] text-slate-400">
                      {audit.isSufficientForScreening ? 'Datos suficientes para AERSCREEN' : 'Faltan parámetros mínimos'}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${audit.isSufficientForRefined ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {audit.isSufficientForRefined ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-200 block">Modelo Refinado (AERMOD/CALPUFF)</span>
                    <span className="text-[10px] text-slate-400">
                      {audit.isSufficientForRefined ? 'Elegible para ejecución refinada' : 'Requiere completar datos faltantes'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* LIMITACIONES TÉCNICAS Y REGULATORIAS */}
            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                      Condiciones de Validez
                    </span>
                    <h4 className="text-base font-bold text-white">
                      LIMITACIONES
                    </h4>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-300">
                  {audit.modelLimitations.map((lim, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-amber-400 font-bold text-xs mt-0.5">•</span>
                      <span className="leading-snug text-[11px]">{lim}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-800 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                Normativa de referencia: EPA 40 CFR Part 51 Appendix W & D.S. 003-2017-MINAM
              </div>
            </div>

          </div>

          {/* MAIN 2-COLUMN SECTION: DATOS DISPONIBLES & DATOS FALTANTES */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* DATOS DISPONIBLES */}
            <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      DATOS DISPONIBLES ({audit.availableData.length})
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Parámetros configurados y validados para el modelo
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  {audit.availableData.length} Parámetros
                </span>
              </div>

              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {audit.availableData.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 bg-slate-950/70 border border-slate-800/90 rounded-xl flex items-start justify-between gap-3 hover:border-emerald-500/30 transition"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 uppercase font-bold">
                          {item.category}
                        </span>
                        <span className="text-xs font-bold text-white">
                          {item.parameter}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-400/90 font-mono font-medium">
                        {item.value}
                      </p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  </div>
                ))}
              </div>
            </div>

            {/* DATOS FALTANTES */}
            <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      DATOS FALTANTES ({audit.missingData.length})
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Requisitos técnicos pendientes para completar el modelamiento
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                  audit.missingData.length === 0 
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                    : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                }`}>
                  {audit.missingData.length === 0 ? 'Sin Faltantes Críticos' : `${audit.missingData.length} Requerimientos`}
                </span>
              </div>

              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {audit.missingData.length === 0 ? (
                  <div className="p-6 bg-slate-950/40 rounded-xl border border-dashed border-emerald-500/30 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <div className="text-sm font-bold text-white">Todos los datos requeridos están presentes</div>
                    <p className="text-xs text-slate-400">
                      El proyecto cuenta con la parametrización completa en las 7 dimensiones requeridas.
                    </p>
                  </div>
                ) : (
                  audit.missingData.map((missing, idx) => {
                    const isCritical = missing.severity === 'CRITICO';
                    const isAlert = missing.severity === 'ALERTA';

                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border space-y-1.5 transition ${
                          isCritical
                            ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                            : isAlert
                            ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                              isCritical
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : isAlert
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                              {missing.severity} • {missing.category}
                            </span>
                            <span className="text-xs font-bold text-white">
                              {missing.parameter}
                            </span>
                          </div>
                          {isCritical ? (
                            <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          )}
                        </div>

                        <p className="text-xs text-slate-300 leading-snug">
                          {missing.reason}
                        </p>

                        <div className="text-[10px] text-slate-400 bg-slate-950/80 p-1.5 rounded-lg border border-slate-800/80">
                          <strong className="text-slate-300">Impacto regulatorio:</strong> {missing.regulatoryImpact}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 4. TAB: INPUT SCRIPTS GENERATOR (.INP EPA AERMOD) */}
      {activeTab === 'INPUT_SCRIPTS' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-cyan-400" />
                <h4 className="text-base font-bold text-white">
                  Generador de Archivos de Control Regulatorios (.INP)
                </h4>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Estructura de tarjetas estándar EPA para ejecución en AERMOD (CO, SO, RE, ME, OU Pathways)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyScript}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition"
              >
                <Copy className="w-3.5 h-3.5" /> {copiedScript ? 'Copiado!' : 'Copiar .INP'}
              </button>
              <button
                onClick={handleDownloadInp}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-600/20 transition"
              >
                <Download className="w-3.5 h-3.5" /> Descargar aermod.inp
              </button>
            </div>
          </div>

          <div className="relative">
            <pre className="bg-slate-950 text-cyan-300 p-4 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed select-all">
              {audit.inputScriptPreview?.aermodInp}
            </pre>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs font-mono">
              <div className="font-bold text-indigo-400 mb-1">Preprocesamiento Meteorológico (AERMET):</div>
              <p className="text-slate-400 text-[11px] whitespace-pre-line">
                {audit.inputScriptPreview?.aermetStage3Summary}
              </p>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs font-mono">
              <div className="font-bold text-emerald-400 mb-1">Preprocesamiento Topográfico (AERMAP):</div>
              <p className="text-slate-400 text-[11px] whitespace-pre-line">
                {audit.inputScriptPreview?.aermapStructure}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB: ARQUITECTURA DE INTEGRACIÓN AERMOD / CALPUFF */}
      {activeTab === 'INTEGRACION' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              <h4 className="text-base font-bold text-white">
                Arquitectura de Acoplamiento para Modelos Especializados (AERMOD & CALPUFF)
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
              ECO-MAP implementa una arquitectura desacoplada y auditable lista para conectar ejecutables oficiales certificados de la Agencia de Protección Ambiental de EE.UU. (US-EPA) o servicios de cálculo en la nube (High Performance Computing - HPC).
            </p>
          </div>

          {/* PIPELINE ARCHITECTURE SCHEMATIC */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans">
            
            {/* ETAPA 1 */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                  ETAPA 1 (LISTA)
                </span>
              </div>
              <h5 className="font-bold text-white">1. Parametrización & Validación</h5>
              <p className="text-slate-400 text-[11px] leading-snug">
                Captura rigurosa de las 7 variables (Coordenadas, Contaminante, Emisión, Fuente, Meteorología, Terreno, Receptores).
              </p>
            </div>

            {/* ETAPA 2 */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-indigo-400 font-bold px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800">
                  ETAPA 2 (LISTA)
                </span>
              </div>
              <h5 className="font-bold text-white">2. Generador de Scripts .INP</h5>
              <p className="text-slate-400 text-[11px] leading-snug">
                Traducción automática de datos a archivos de control estándar EPA (AERMOD .INP, AERMET Stage 1-3, AERMAP DEM).
              </p>
            </div>

            {/* ETAPA 3 */}
            <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-950 border border-amber-800 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> PENDIENTE
                </span>
              </div>
              <h5 className="font-bold text-amber-300">3. Conexión a Motor Binario</h5>
              <p className="text-slate-300 text-[11px] leading-snug">
                Conexión con el binario compilado Fortran <code className="text-amber-300">aermod.exe / calpuff.exe</code> mediante microservicio backend o contenedor Docker.
              </p>
            </div>

            {/* ETAPA 4 */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-400 font-bold px-2 py-0.5 rounded bg-slate-800">
                  ETAPA 4 (LISTA)
                </span>
              </div>
              <h5 className="font-bold text-white">4. Malla GIS & Isoconcentraciones</h5>
              <p className="text-slate-400 text-[11px] leading-snug">
                Parseo de archivos <code className="text-cyan-400">.PLT</code> / <code className="text-cyan-400">.CON</code> y renderizado de isolíneas georreferenciadas sobre el mapa satelital.
              </p>
            </div>

          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl text-xs text-amber-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-300">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Compromiso de Integridad Regulatoria:
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              En cumplimiento estricto del SEIA (Ley N° 27446) y los estándares de evaluación de impacto ambiental, los mapas de inmisión no se publicarán mediante fórmulas analíticas simplificadas que simulen falsamente la dispersión turbulenta tridimensional de AERMOD.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
