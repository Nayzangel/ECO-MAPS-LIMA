import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  MapPin, 
  Calendar, 
  Clock, 
  Gauge, 
  Cpu, 
  Building2, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles,
  Info,
  ShieldAlert
} from 'lucide-react';
import { 
  EnvironmentalRecord, 
  EnvironmentalParameter, 
  ParameterUnit, 
  DataOrigin, 
  EquipmentGrade 
} from '../../types/environmentalData';
import { 
  validateEnvironmentalRecord, 
  PARAMETER_STANDARD_UNITS, 
  PARAMETER_ECA_LIMITS 
} from '../../utils/environmentalValidator';
import { DataOriginBadge } from './DataOriginBadge';
import { ReliabilityBadge } from './ReliabilityBadge';
import { latLngToUTM18S } from '../../utils/gisUtils';

interface ManualDataFormProps {
  onSaveRecord: (record: EnvironmentalRecord) => void;
  existingRecords?: EnvironmentalRecord[];
  onCancel?: () => void;
}

const LIMA_PRESET_LOCATIONS = [
  { name: 'Lima Cercado - Av. Abancay', lat: -12.0464, lng: -77.0428, district: 'Lima Cercado' },
  { name: 'San Juan de Lurigancho - Av. Próceres', lat: -12.0125, lng: -77.0018, district: 'San Juan de Lurigancho' },
  { name: 'Miraflores - Parque Kennedy', lat: -12.1215, lng: -77.0298, district: 'Miraflores' },
  { name: 'Callao - Av. Faucett / Aeropuerto', lat: -12.0220, lng: -77.1120, district: 'Callao' },
  { name: 'Ate Vitarte - Carretera Central', lat: -12.0350, lng: -76.9250, district: 'Ate Vitarte' },
  { name: 'Ventanilla - Refinería La Pampilla', lat: -11.8750, lng: -77.1280, district: 'Ventanilla' },
  { name: 'San Isidro - Centro Financiero', lat: -12.0950, lng: -77.0280, district: 'San Isidro' },
  { name: 'Villa El Salvador - Ruta C', lat: -12.2050, lng: -76.9380, district: 'Villa El Salvador' }
];

export const ManualDataForm: React.FC<ManualDataFormProps> = ({
  onSaveRecord,
  existingRecords = [],
  onCancel
}) => {
  // Form State
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [hora, setHora] = useState(
    new Date().toLocaleTimeString('es-PE', { hour12: false, hour: '2-digit', minute: '2-digit' })
  );
  const [lat, setLat] = useState('-12.0464');
  const [lng, setLng] = useState('-77.0428');
  const [distrito, setDistrito] = useState('Lima Cercado');
  const [direccion, setDireccion] = useState('Av. Abancay cdra 5');
  const [parametro, setParametro] = useState<EnvironmentalParameter>('PM2.5');
  const [valor, setValor] = useState('45.5');
  const [unidad, setUnidad] = useState<ParameterUnit>('µg/m³');
  const [equipo, setEquipo] = useState('Sensor Óptico Portátil Calibrado');
  const [tipoEquipo, setTipoEquipo] = useState<EquipmentGrade>('Portátil Calibrado (Clase 1 / 2)');
  const [certificadoCalibracion, setCertificadoCalibracion] = useState('CAL-2026-042');
  const [fuente, setFuente] = useState('Monitoreo Ambiental de Campo');
  const [origen, setOrigen] = useState<DataOrigin>('USUARIO');
  const [observaciones, setObservaciones] = useState('Condiciones meteorológicas estables. Tráfico vehicular moderado.');

  // Automatically update suggested unit when parameter changes
  const handleParameterChange = (newParam: EnvironmentalParameter) => {
    setParametro(newParam);
    const suggestedUnits = PARAMETER_STANDARD_UNITS[newParam] || ['µg/m³'];
    setUnidad(suggestedUnits[0]);
  };

  // Quick preset selector
  const handleSelectPreset = (preset: typeof LIMA_PRESET_LOCATIONS[0]) => {
    setLat(preset.lat.toString());
    setLng(preset.lng.toString());
    setDistrito(preset.district);
    setDireccion(preset.name);
  };

  // Live validation preview
  const liveValidation = useMemo(() => {
    const numLat = parseFloat(lat);
    const numLng = parseFloat(lng);
    const numVal = parseFloat(valor);

    const raw: Partial<EnvironmentalRecord> = {
      fecha,
      hora,
      coordenadas: [isNaN(numLat) ? 0 : numLat, isNaN(numLng) ? 0 : numLng],
      distrito,
      direccion,
      parametro,
      valor: isNaN(numVal) ? 0 : numVal,
      unidad,
      equipo,
      tipoEquipo,
      certificadoCalibracion,
      fuente,
      origen,
      observaciones
    };

    return validateEnvironmentalRecord(raw, existingRecords);
  }, [
    fecha, hora, lat, lng, distrito, direccion, parametro, 
    valor, unidad, equipo, tipoEquipo, certificadoCalibracion, 
    fuente, origen, observaciones, existingRecords
  ]);

  const utmPreview = useMemo(() => {
    const numLat = parseFloat(lat);
    const numLng = parseFloat(lng);
    if (isNaN(numLat) || isNaN(numLng)) return null;
    return latLngToUTM18S(numLat, numLng);
  }, [lat, lng]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveRecord(liveValidation.validatedRecord);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-xs">
      
      {/* 1. MANDATORY ORIGIN SELECTION BANNER (NUNCA MEZCLARLOS SIN IDENTIFICARLOS) */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <label className="text-xs font-extrabold text-white uppercase tracking-wider">
              Categoría de Origen del Dato *
            </label>
          </div>
          <DataOriginBadge origin={origen} size="sm" />
        </div>

        <p className="text-[11px] text-slate-400">
          <strong className="text-emerald-300">Principio de Trazabilidad:</strong> Los datos oficiales, del usuario, demo, modelados y simulados se almacenan e identifican con sellos visuales distintos para evitar sesgos analíticos.
        </p>

        {/* Origin Radio Pill Group */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(['OFICIAL', 'USUARIO', 'DEMO', 'MODELADO', 'SIMULADO'] as DataOrigin[]).map((org) => (
            <button
              type="button"
              key={org}
              onClick={() => setOrigen(org)}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                origen === org
                  ? 'bg-slate-800 border-emerald-400 shadow-md ring-1 ring-emerald-400/50'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <DataOriginBadge origin={org} size="sm" />
              <span className="text-[9px] text-slate-400 truncate max-w-full">
                {org === 'OFICIAL' && 'SENAMHI/OEFA'}
                {org === 'USUARIO' && 'Creado ahora'}
                {org === 'DEMO' && 'Muestra de prueba'}
                {org === 'MODELADO' && 'AERMOD / Gauss'}
                {org === 'SIMULADO' && 'Escenario 2030'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. FORM GRID (FECHA, HORA, PARÁMETRO, VALOR, UNIDAD) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Fecha */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Fecha de Muestreo *
          </label>
          <input
            type="date"
            required
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-400"
          />
        </div>

        {/* Hora */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" /> Hora (24h) *
          </label>
          <input
            type="time"
            required
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-400"
          />
        </div>

        {/* Parámetro */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-300 flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-emerald-400" /> Parámetro Ambiental *
          </label>
          <select
            value={parametro}
            onChange={(e) => handleParameterChange(e.target.value as EnvironmentalParameter)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-400"
          >
            <option value="PM2.5">PM2.5 (Material Particulado Fino)</option>
            <option value="PM10">PM10 (Material Particulado Respirable)</option>
            <option value="Ruido Diurno">Ruido Diurno (Nivel de Presión Sonora)</option>
            <option value="Ruido Nocturno">Ruido Nocturno (Nivel de Presión Sonora)</option>
            <option value="SO2">SO2 (Dióxido de Azufre)</option>
            <option value="NO2">NO2 (Dióxido de Nitrógeno)</option>
            <option value="CO">CO (Monóxido de Carbono)</option>
            <option value="O3">O3 (Ozono Troposférico)</option>
            <option value="Temperatura">Temperatura Ambiente</option>
            <option value="Humedad">Humedad Relativa</option>
            <option value="Velocidad Viento">Velocidad del Viento</option>
          </select>
        </div>

        {/* Valor de Medición */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-bold text-slate-300">Valor Medido *</label>
            {PARAMETER_ECA_LIMITS[parametro] && (
              <span className="text-[10px] text-slate-400 font-mono">
                ECA Ref: {PARAMETER_ECA_LIMITS[parametro].limit} {PARAMETER_ECA_LIMITS[parametro].unit}
              </span>
            )}
          </div>
          <input
            type="number"
            step="0.01"
            required
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono text-sm focus:outline-none focus:border-emerald-400"
          />
        </div>

        {/* Unidad */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-300">Unidad de Medida *</label>
          <select
            value={unidad}
            onChange={(e) => setUnidad(e.target.value as ParameterUnit)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-400"
          >
            <option value="µg/m³">µg/m³ (Microgramos por metro cúbico)</option>
            <option value="mg/m³">mg/m³ (Miligramos por metro cúbico)</option>
            <option value="dBA">dBA (Decibelios Ponderación A)</option>
            <option value="ppm">ppm (Partes por millón)</option>
            <option value="ppb">ppb (Partes por billón)</option>
            <option value="°C">°C (Grados Celsius)</option>
            <option value="%">% (Porcentaje de Humedad)</option>
            <option value="m/s">m/s (Metros por segundo)</option>
          </select>
        </div>

        {/* Distrito */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-300 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" /> Distrito de Lima / Callao *
          </label>
          <input
            type="text"
            required
            value={distrito}
            onChange={(e) => setDistrito(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-400"
          />
        </div>

      </div>

      {/* 3. COORDENADAS Y PRESETS DE LIMA */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <label className="font-bold text-white uppercase tracking-wider text-[11px]">
              Georreferenciación (Coordenadas WGS84 & UTM 18S) *
            </label>
          </div>

          {/* Quick preset dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400">Puntos frecuentes:</span>
            <select
              onChange={(e) => {
                const found = LIMA_PRESET_LOCATIONS.find(p => p.name === e.target.value);
                if (found) handleSelectPreset(found);
              }}
              className="bg-slate-900 border border-slate-700 text-slate-300 text-[11px] rounded-lg px-2 py-1 focus:outline-none"
            >
              <option value="">Seleccionar ubicación de Lima...</option>
              {LIMA_PRESET_LOCATIONS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400">Latitud WGS84 (ej. -12.0464)</span>
            <input
              type="text"
              required
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-400">Longitud WGS84 (ej. -77.0428)</span>
            <input
              type="text"
              required
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-400">Dirección / Referencia de Campo</span>
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Ej. Frente a Colegio / Esquina Av. Brasil"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        {/* UTM projection live pill */}
        {utmPreview && (
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
            <span>Conversión UTM Automática:</span>
            <span className="text-teal-400 font-bold">
              {utmPreview.easting} E / {utmPreview.northing} N (Zona {utmPreview.zone} Lima)
            </span>
          </div>
        )}
      </div>

      {/* 4. EQUIPAMIENTO Y FUENTE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Equipo */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-300 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" /> Instrumento / Modelo *
          </label>
          <input
            type="text"
            required
            value={equipo}
            onChange={(e) => setEquipo(e.target.value)}
            placeholder="Ej. Sonómetro SVAN 971 / BAM-1020"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-400"
          />
        </div>

        {/* Tipo de Equipo */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-300">Grado Metrológico del Equipo</label>
          <select
            value={tipoEquipo}
            onChange={(e) => setTipoEquipo(e.target.value as EquipmentGrade)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-400"
          >
            <option value="Referencia / Regulatorio">Referencia / Regulatorio (Acreditado INACAL)</option>
            <option value="Portátil Calibrado (Clase 1 / 2)">Portátil Calibrado (Clase 1 / Clase 2)</option>
            <option value="Sensor IoT de Bajo Costo">Sensor IoT de Bajo Costo (Óptico / Celda)</option>
            <option value="Estación Meteorológica">Estación Meteorológica Automática</option>
            <option value="Modelo Matemático / Software">Modelo Matemático / Software de Simulación</option>
            <option value="No especificado">No especificado</option>
          </select>
        </div>

        {/* Fuente / Entidad */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-300 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-emerald-400" /> Entidad / Fuente *
          </label>
          <input
            type="text"
            required
            value={fuente}
            onChange={(e) => setFuente(e.target.value)}
            placeholder="Ej. Consultoría SGA / SENAMHI / Alerta Vecinal"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-400"
          />
        </div>

      </div>

      {/* 5. OBSERVACIONES */}
      <div className="space-y-1.5">
        <label className="font-bold text-slate-300">Observaciones Técnicas / Contexto de Campo</label>
        <textarea
          rows={2}
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Presencia de polvo resuspendido, obras viales, congestión vehicular, velocidad del viento..."
          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-400 resize-none text-xs"
        />
      </div>

      {/* 6. REAL-TIME AUTOMATIC VALIDATION & RELIABILITY SCORE AUDIT */}
      <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <div>
              <h4 className="text-xs font-extrabold text-white">Validación Automática en Tiempo Real</h4>
              <p className="text-[10px] text-slate-400">Auditoría de integridad, coordenadas, unidades y plausibilidad física</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ReliabilityBadge reliability={liveValidation.reliability} size="md" />
            <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold font-mono border ${
              liveValidation.status === 'VALID'
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                : liveValidation.status === 'WARNING'
                ? 'bg-amber-950/80 border-amber-500/40 text-amber-300'
                : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
            }`}>
              {liveValidation.status === 'VALID' && '✓ REGISTRO VÁLIDO'}
              {liveValidation.status === 'WARNING' && '⚠️ CON ADVERTENCIAS'}
              {liveValidation.status === 'REJECTED' && '✕ RECHAZADO / ERRORES'}
            </span>
          </div>
        </div>

        {/* Validation Issues feedback list */}
        {liveValidation.issues.length > 0 ? (
          <div className="space-y-1.5 pt-1">
            {liveValidation.issues.map((issue, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border flex items-start gap-2 text-[11px] ${
                  issue.severity === 'ERROR'
                    ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                    : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                }`}
              >
                {issue.severity === 'ERROR' ? (
                  <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold block">{issue.message}</span>
                  {issue.suggestedFix && (
                    <span className="text-[10px] opacity-80">Sugerencia: {issue.suggestedFix}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-2 text-emerald-300 text-[11px]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Todos los parámetros son consistentes. Coordenadas, unidades y valores dentro del estándar.</span>
          </div>
        )}
      </div>

      {/* 7. ACTION BUTTONS */}
      <div className="pt-2 flex items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            Cancelar
          </button>
        )}

        <button
          type="submit"
          className="px-6 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          Guardar Registro en Base Ambiental
        </button>
      </div>

    </form>
  );
};
