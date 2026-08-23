import React, { useState } from 'react';
import { 
  X, 
  Wind, 
  MapPin, 
  Calendar, 
  Clock, 
  Gauge, 
  Radio, 
  Thermometer, 
  Droplets, 
  Sun, 
  CheckCircle2, 
  Sparkles, 
  AlertTriangle,
  Scale,
  Compass,
  Building
} from 'lucide-react';
import { AirMeasurementRecord, AirParameterKey, DataSourceType } from '../../types/airQuality';
import { PERUVIAN_AIR_NORMATIVE, calculateIncaIndex, convertToNormativeUnit } from '../../utils/airQualityNormative';

interface AirMeasurementInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newRecord: AirMeasurementRecord) => void;
}

export const AirMeasurementInputModal: React.FC<AirMeasurementInputModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [district, setDistrict] = useState('San Juan de Lurigancho');
  const [title, setTitle] = useState('Punto de Muestreo Comunitario SJL');
  const [address, setAddress] = useState('Av. Próceres de la Independencia Cdra 15');
  const [lat, setLat] = useState(-11.9822);
  const [lng, setLng] = useState(-76.9989);
  const [zoneType, setZoneType] = useState<AirMeasurementRecord['zoneType']>('Residencial');

  const [parameter, setParameter] = useState<AirParameterKey>('PM2_5');
  const [concentration, setConcentration] = useState(58.5);
  const [unit, setUnit] = useState('µg/m³');
  const [date, setDate] = useState('2026-08-23');
  const [time, setTime] = useState('11:00');

  const [equipment, setEquipment] = useState('Monitor Óptico Portátil Calibrado (Sensor Láser PM2.5)');
  const [sourceType, setSourceType] = useState<DataSourceType>('USUARIO');
  const [sourceName, setSourceName] = useState('Monitoreo Ciudadano / Consultoría Ambiental');
  const [notes, setNotes] = useState('Muestreo puntual en hora punta de tránsito comercial.');

  // Meteorology
  const [windSpeed, setWindSpeed] = useState(2.2);
  const [windDirectionCardinal, setWindDirectionCardinal] = useState<any>('SO');
  const [temperature, setTemperature] = useState(21.5);
  const [humidity, setHumidity] = useState(80);
  const [solarRadiation, setSolarRadiation] = useState(490);
  const [atmosphericPressure, setAtmosphericPressure] = useState(1013);
  const [thermalInversionRisk, setThermalInversionRisk] = useState<any>('MODERADO');

  if (!isOpen) return null;

  const currentMeta = PERUVIAN_AIR_NORMATIVE[parameter];
  const normalizedValue = convertToNormativeUnit(concentration, unit, currentMeta.unit);
  const incaInfo = calculateIncaIndex(parameter, normalizedValue);
  const isExceeded = normalizedValue > currentMeta.ecaLimit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const record: AirMeasurementRecord = {
      id: `usr-air-${Date.now()}`,
      title,
      district,
      address,
      coordinates: [lat, lng],
      utmZone: `18S ${Math.round(lat * -20000 + 500000)}m E ${Math.round(lng * -10000 + 8660000)}m N`,
      date,
      time,
      parameter,
      concentration: normalizedValue,
      unit: currentMeta.unit,
      equipment,
      sourceType,
      sourceName,
      meteorology: {
        windSpeed,
        windDirectionDeg: windDirectionCardinal === 'N' ? 0 : windDirectionCardinal === 'NE' ? 45 : windDirectionCardinal === 'E' ? 90 : windDirectionCardinal === 'SE' ? 135 : windDirectionCardinal === 'S' ? 180 : windDirectionCardinal === 'SO' ? 225 : windDirectionCardinal === 'O' ? 270 : 315,
        windDirectionCardinal,
        temperature,
        humidity,
        solarRadiation,
        atmosphericPressure,
        thermalInversionRisk
      },
      zoneType,
      notes,
      isUserAdded: true
    };

    onSave(record);
    onClose();
  };

  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(parseFloat(pos.coords.latitude.toFixed(5)));
          setLng(parseFloat(pos.coords.longitude.toFixed(5)));
        },
        () => {
          // Fallback Lima center
          setLat(-12.0464);
          setLng(-77.0428);
        }
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200 text-xs">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  Ingreso de Medición de Calidad del Aire
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                  D.S. N° 003-2017-MINAM
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Registro estandarizado con parámetros oficiales, metrología y variables meteorológicas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SCROLLABLE FORM */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
          
          {/* 1. SECCIÓN: PARÁMETRO Y CONCENTRACIÓN */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Gauge className="w-4 h-4" />
                <span>1. Parámetro de Calidad del Aire & Concentración</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                ECA Oficial: {currentMeta.ecaLimit} {currentMeta.unit} ({currentMeta.primaryTimeframe})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              
              {/* Selector de Parámetro */}
              <div className="sm:col-span-5 space-y-1">
                <label className="text-[11px] text-slate-300 font-semibold block">
                  Contaminante Criterio (MINAM):
                </label>
                <select
                  value={parameter}
                  onChange={(e) => {
                    const newKey = e.target.value as AirParameterKey;
                    setParameter(newKey);
                    setUnit(PERUVIAN_AIR_NORMATIVE[newKey].unit);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold focus:border-emerald-400 focus:outline-none"
                >
                  {Object.values(PERUVIAN_AIR_NORMATIVE).map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.code} - {p.name}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-500 block">
                  Método de ref.: {currentMeta.measurementMethod.slice(0, 45)}...
                </span>
              </div>

              {/* Concentración y Unidad */}
              <div className="sm:col-span-4 space-y-1">
                <label className="text-[11px] text-slate-300 font-semibold block">
                  Concentración Medida:
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={concentration}
                    onChange={(e) => setConcentration(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm focus:border-emerald-400 focus:outline-none"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="µg/m³">µg/m³</option>
                    <option value="mg/m³">mg/m³</option>
                    <option value="ppm">ppm</option>
                    <option value="ppb">ppb</option>
                  </select>
                </div>
              </div>

              {/* Live INCA Evaluation Chip */}
              <div className="sm:col-span-3 flex flex-col justify-end">
                <div className={`p-2 rounded-xl border text-center font-mono ${incaInfo.bgClass} ${incaInfo.borderClass} ${incaInfo.textClass}`}>
                  <span className="text-[9px] uppercase block font-sans font-bold">Evaluación INCA</span>
                  <span className="text-xs font-black">{incaInfo.category}</span>
                  <span className="text-[9px] block text-slate-300 mt-0.5">
                    {isExceeded ? `+${Math.round(((normalizedValue - currentMeta.ecaLimit) / currentMeta.ecaLimit) * 100)}% ECA` : 'Dentro de ECA'}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* 2. SECCIÓN: GEORREFERENCIACIÓN Y TEMPORALIDAD */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>2. Ubicación Territorial & Temporalidad</span>
              </div>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="text-[10px] text-teal-300 hover:text-teal-200 font-bold underline cursor-pointer"
              >
                Usar Mi GPS Actual
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300 font-semibold block">Título / Identificador del Punto:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:border-teal-400 focus:outline-none"
                  placeholder="Ej: Estación Comunal Paradero 8"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-300 font-semibold block">Distrito:</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:border-teal-400 focus:outline-none"
                  placeholder="Ej: San Juan de Lurigancho"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-300 font-semibold block">Zonificación:</label>
                <select
                  value={zoneType}
                  onChange={(e) => setZoneType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:border-teal-400 focus:outline-none"
                >
                  <option value="ProteccionEspecial">Protección Especial (Salud/Educación)</option>
                  <option value="Residencial">Residencial</option>
                  <option value="Comercial">Comercial</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300 font-semibold block">Latitud (° Dec):</label>
                <input
                  type="number"
                  step="0.00001"
                  required
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-300 font-semibold block">Longitud (° Dec):</label>
                <input
                  type="number"
                  step="0.00001"
                  required
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-300 font-semibold block">Fecha de Muestreo:</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-300 font-semibold block">Hora (HH:mm):</label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-teal-400 focus:outline-none"
                />
              </div>

            </div>
          </div>

          {/* 3. SECCIÓN: INSTRUMENTACIÓN Y METEOROLOGÍA ACOPLADA */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                <span>3. Instrumentación, Fuente & Variables Meteorológicas</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300 font-semibold block">Equipo / Analizador:</label>
                <input
                  type="text"
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:border-cyan-400 focus:outline-none"
                  placeholder="Ej: BAM-1020 / Sensor IoT Calibrado"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-300 font-semibold block">Tipo de Fuente:</label>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value as DataSourceType)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:border-cyan-400 focus:outline-none"
                >
                  <option value="USUARIO">Monitoreo del Usuario / Consultoría Propia</option>
                  <option value="SENAMHI">SENAMHI (Red Oficial)</option>
                  <option value="OEFA">OEFA (Fiscalización Ambiental)</option>
                  <option value="DIGESA">DIGESA (Salud Ambiental)</option>
                  <option value="MUNICIPAL">Red Municipal Local</option>
                  <option value="CONSULTORIA">Estudio de Impacto Ambiental (EIA)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-300 font-semibold block">Nombre de la Entidad / Custodia:</label>
                <input
                  type="text"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:border-cyan-400 focus:outline-none"
                />
              </div>

            </div>

            {/* Fila Meteorología */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 border-t border-slate-900">
              
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-semibold block">Vel. Viento (m/s):</label>
                <input
                  type="number"
                  step="0.1"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-semibold block">Dir. Viento:</label>
                <select
                  value={windDirectionCardinal}
                  onChange={(e) => setWindDirectionCardinal(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
                >
                  <option value="N">N (Norte)</option>
                  <option value="NE">NE (Noreste)</option>
                  <option value="E">E (Este)</option>
                  <option value="SE">SE (Sureste)</option>
                  <option value="S">S (Sur)</option>
                  <option value="SO">SO (Suroeste)</option>
                  <option value="O">O (Oeste)</option>
                  <option value="NO">NO (Noroeste)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-semibold block">Temperatura (°C):</label>
                <input
                  type="number"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-semibold block">Humedad (%):</label>
                <input
                  type="number"
                  step="1"
                  value={humidity}
                  onChange={(e) => setHumidity(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

            </div>

          </div>

          {/* MODAL ACTION BUTTONS */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Guardar & Auditar Medición</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
