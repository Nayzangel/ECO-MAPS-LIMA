import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  CloudSun, 
  Wind, 
  Thermometer, 
  Droplets, 
  Compass, 
  Gauge, 
  Sun, 
  CloudRain, 
  Layers, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { 
  MeteorologicalRecord, 
  TemperatureUnit, 
  PressureUnit, 
  WindSpeedUnit, 
  RadiationUnit, 
  PrecipitationUnit,
  CardinalDirection,
  PasquillStabilityClass 
} from '../../types/meteorology';
import { 
  degreesToCardinal, 
  cardinalToDegrees, 
  calculateDewPointCelsius, 
  calculateHeatIndexCelsius, 
  calculatePasquillStability,
  convertTemperature,
  convertPressure,
  convertWindSpeed,
  convertRadiation,
  CARDINAL_SECTORS 
} from '../../utils/meteorologyCalculations';

interface MeteorologyInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecord: (record: MeteorologicalRecord) => void;
}

export const MeteorologyInputModal: React.FC<MeteorologyInputModalProps> = ({
  isOpen,
  onClose,
  onAddRecord
}) => {
  // Form State
  const [stationName, setStationName] = useState('Estación de Monitoreo Local');
  const [district, setDistrict] = useState('Lima');
  const [lat, setLat] = useState<number>(-12.0500);
  const [lng, setLng] = useState<number>(-77.0300);
  const [elevation, setElevation] = useState<number>(120);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>('12:00');

  // Meteorological Parameters & Units
  const [tempVal, setTempVal] = useState<number>(21.5);
  const [tempUnit, setTempUnit] = useState<TemperatureUnit>('C');

  const [rhVal, setRhVal] = useState<number>(75);

  const [pressVal, setPressVal] = useState<number>(1013.2);
  const [pressUnit, setPressUnit] = useState<PressureUnit>('hPa');

  const [windSpeedVal, setWindSpeedVal] = useState<number>(3.2);
  const [windSpeedUnit, setWindSpeedUnit] = useState<WindSpeedUnit>('m/s');

  const [windDirDeg, setWindDirDeg] = useState<number>(200);
  const [windDirCardinal, setWindDirCardinal] = useState<CardinalDirection>('SSW');

  const [precipVal, setPrecipVal] = useState<number>(0.0);
  const [precipUnit, setPrecipUnit] = useState<PrecipitationUnit>('mm');

  const [radVal, setRadVal] = useState<number>(650);
  const [radUnit, setRadUnit] = useState<RadiationUnit>('W/m2');

  // Configurable Dispersion Parameters
  const [cloudCoverOctas, setCloudCoverOctas] = useState<number>(4);
  const [mixingHeight, setMixingHeight] = useState<number>(750);
  const [hasThermalInversion, setHasThermalInversion] = useState<boolean>(true);
  const [inversionBase, setInversionBase] = useState<number>(480);
  const [roughnessZ0, setRoughnessZ0] = useState<number>(0.8);
  const [sensorModel, setSensorModel] = useState<string>('Estación Meteorológica Automática Profesional');
  const [notes, setNotes] = useState<string>('');

  // Live Computed Values
  const tempCelsius = convertTemperature(tempVal, tempUnit, 'C');
  const pressHpa = convertPressure(pressVal, pressUnit, 'hPa');
  const windMs = convertWindSpeed(windSpeedVal, windSpeedUnit, 'm/s');
  const radWm2 = convertRadiation(radVal, radUnit, 'W/m2');
  
  const dewPoint = calculateDewPointCelsius(tempCelsius, rhVal);
  const heatIndex = calculateHeatIndexCelsius(tempCelsius, rhVal);
  
  // Is it daytime according to hour?
  const hourNum = parseInt(time.split(':')[0] || '12', 10);
  const isDaytime = hourNum >= 6 && hourNum <= 18;
  const computedPasquill = calculatePasquillStability(windMs, radWm2, cloudCoverOctas, isDaytime);

  // Sync Direction Degrees <-> Cardinal
  const handleDegreeChange = (deg: number) => {
    const clamped = Math.max(0, Math.min(360, deg));
    setWindDirDeg(clamped);
    setWindDirCardinal(degreesToCardinal(clamped));
  };

  const handleCardinalChange = (cardinal: CardinalDirection) => {
    setWindDirCardinal(cardinal);
    setWindDirDeg(cardinalToDegrees(cardinal));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRecord: MeteorologicalRecord = {
      id: `MET-USER-${Date.now()}`,
      stationName,
      district,
      coordinates: [lat, lng],
      elevationMeters: elevation,
      date,
      time,
      temperature: tempCelsius,
      temperatureUnit: tempUnit,
      relativeHumidity: rhVal,
      atmosphericPressure: pressHpa,
      pressureUnit: pressUnit,
      windSpeed: windMs,
      windSpeedUnit: windSpeedUnit,
      windDirectionDegrees: windDirDeg,
      windDirectionCardinal: windDirCardinal,
      precipitation: precipVal,
      precipitationUnit: precipUnit,
      solarRadiation: radWm2,
      radiationUnit: radUnit,
      cloudCoverOctas,
      pasquillClass: computedPasquill,
      mixingHeightMeters: mixingHeight,
      thermalInversionPresent: hasThermalInversion,
      inversionBaseHeightMeters: hasThermalInversion ? inversionBase : undefined,
      surfaceRoughnessZ0: roughnessZ0,
      dewPointCelsius: dewPoint,
      heatIndexCelsius: heatIndex,
      isUserAdded: true,
      sourceAuthority: 'ESTACION_PROPIA',
      sensorModel,
      notes
    };

    onAddRecord(newRecord);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Ingreso de Registro Meteorológico</h2>
              <p className="text-xs text-slate-400">
                Parámetros atmosféricos y variables micrometeorológicas para dispersión ambiental
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* SECTION 1: STATION & TEMPORAL DATA */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Compass className="w-4 h-4" /> 1. Identificación y Ubicación Georreferenciada
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nombre Estación / Punto</label>
                <input
                  type="text"
                  required
                  value={stationName}
                  onChange={(e) => setStationName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Distrito / Localidad</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Latitud (WGS84)</label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Longitud (WGS84)</label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Elevación (msnm)</label>
                <input
                  type="number"
                  value={elevation}
                  onChange={(e) => setElevation(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Fecha</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Hora (HH:mm)</label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Modelo Sensor</label>
                <input
                  type="text"
                  value={sensorModel}
                  onChange={(e) => setSensorModel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: CORE METEOROLOGICAL PARAMETERS WITH UNIT SELECTORS */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Thermometer className="w-4 h-4" /> 2. Parámetros Meteorológicos Base y Unidades
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              
              {/* TEMPERATURA */}
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-rose-400" /> Temperatura
                  </label>
                  <select
                    value={tempUnit}
                    onChange={(e) => setTempUnit(e.target.value as TemperatureUnit)}
                    className="bg-slate-800 text-[11px] text-cyan-400 rounded px-1.5 py-0.5 border border-slate-700"
                  >
                    <option value="C">°C</option>
                    <option value="F">°F</option>
                    <option value="K">K</option>
                  </select>
                </div>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={tempVal}
                  onChange={(e) => setTempVal(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Normalizado: <strong className="text-white">{tempCelsius} °C</strong>
                </span>
              </div>

              {/* HUMEDAD RELATIVA */}
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 mb-1.5">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" /> Humedad Relativa (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  required
                  value={rhVal}
                  onChange={(e) => setRhVal(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Punto de Rocío: <strong className="text-cyan-400">{dewPoint} °C</strong>
                </span>
              </div>

              {/* PRESIÓN ATMOSFÉRICA */}
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-emerald-400" /> Presión Atmosférica
                  </label>
                  <select
                    value={pressUnit}
                    onChange={(e) => setPressUnit(e.target.value as PressureUnit)}
                    className="bg-slate-800 text-[11px] text-cyan-400 rounded px-1.5 py-0.5 border border-slate-700"
                  >
                    <option value="hPa">hPa / mbar</option>
                    <option value="mmHg">mmHg</option>
                    <option value="atm">atm</option>
                    <option value="kPa">kPa</option>
                  </select>
                </div>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={pressVal}
                  onChange={(e) => setPressVal(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Presión estándar: <strong className="text-white">{pressHpa} hPa</strong>
                </span>
              </div>

              {/* VELOCIDAD DEL VIENTO */}
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-teal-400" /> Velocidad del Viento
                  </label>
                  <select
                    value={windSpeedUnit}
                    onChange={(e) => setWindSpeedUnit(e.target.value as WindSpeedUnit)}
                    className="bg-slate-800 text-[11px] text-cyan-400 rounded px-1.5 py-0.5 border border-slate-700"
                  >
                    <option value="m/s">m/s</option>
                    <option value="km/h">km/h</option>
                    <option value="knots">nudos (kt)</option>
                    <option value="mph">mph</option>
                  </select>
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  required
                  value={windSpeedVal}
                  onChange={(e) => setWindSpeedVal(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Velocidad: <strong className="text-white">{windMs} m/s</strong> ({(windMs * 3.6).toFixed(1)} km/h)
                </span>
              </div>

              {/* DIRECCIÓN DEL VIENTO (GRADOS Y CARDINAL SINCRONIZADOS) */}
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-cyan-400" /> Dirección del Viento
                  </label>
                  <select
                    value={windDirCardinal}
                    onChange={(e) => handleCardinalChange(e.target.value as CardinalDirection)}
                    className="bg-slate-800 text-[11px] text-amber-400 font-bold rounded px-1.5 py-0.5 border border-slate-700"
                  >
                    {CARDINAL_SECTORS.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name} ({s.midDeg}°)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="1"
                    value={windDirDeg}
                    onChange={(e) => handleDegreeChange(parseInt(e.target.value, 10))}
                    className="flex-1 accent-cyan-400"
                  />
                  <input
                    type="number"
                    min="0"
                    max="360"
                    value={windDirDeg}
                    onChange={(e) => handleDegreeChange(parseInt(e.target.value, 10))}
                    className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono text-center"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Rumbo: <strong className="text-amber-400">{windDirCardinal}</strong> ({windDirDeg}°)
                </span>
              </div>

              {/* RADIACIÓN SOLAR */}
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-400" /> Radiación Solar
                  </label>
                  <select
                    value={radUnit}
                    onChange={(e) => setRadUnit(e.target.value as RadiationUnit)}
                    className="bg-slate-800 text-[11px] text-cyan-400 rounded px-1.5 py-0.5 border border-slate-700"
                  >
                    <option value="W/m2">W/m²</option>
                    <option value="MJ/m2">MJ/m²</option>
                    <option value="cal/cm2_min">cal/cm²·min</option>
                  </select>
                </div>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={radVal}
                  onChange={(e) => setRadVal(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Insolación: <strong className="text-white">{radWm2} W/m²</strong>
                </span>
              </div>

              {/* PRECIPITACIÓN */}
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <CloudRain className="w-3.5 h-3.5 text-indigo-400" /> Precipitación
                  </label>
                  <select
                    value={precipUnit}
                    onChange={(e) => setPrecipUnit(e.target.value as PrecipitationUnit)}
                    className="bg-slate-800 text-[11px] text-cyan-400 rounded px-1.5 py-0.5 border border-slate-700"
                  >
                    <option value="mm">mm</option>
                    <option value="mm/h">mm/h</option>
                    <option value="in">pulgadas (in)</option>
                  </select>
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  required
                  value={precipVal}
                  onChange={(e) => setPrecipVal(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Lluvia/Garúa: <strong className="text-white">{precipVal} mm</strong>
                </span>
              </div>

            </div>
          </div>

          {/* SECTION 3: ADVANCED & CONFIGURABLE DISPERSION PARAMETERS */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4" /> 3. Parámetros de Dispersión y Estabilidad Atmosférica
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Cobertura Nubosa (Octas: 0 a 8)
                </label>
                <input
                  type="number"
                  min="0"
                  max="8"
                  value={cloudCoverOctas}
                  onChange={(e) => setCloudCoverOctas(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {cloudCoverOctas <= 2 ? 'Despejado' : cloudCoverOctas <= 5 ? 'Parcialmente nublado' : 'Cubierto'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Capa de Mezcla (zi en m)
                </label>
                <input
                  type="number"
                  min="100"
                  max="4000"
                  value={mixingHeight}
                  onChange={(e) => setMixingHeight(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Espesor de dilución vertical
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Rugosidad Superficial (z0 en m)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.001"
                  max="3.0"
                  value={roughnessZ0}
                  onChange={(e) => setRoughnessZ0(parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Urbano ~0.8-1.5m, Rural ~0.1m
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Clase Pasquill-Gifford
                </label>
                <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-emerald-400 font-bold flex items-center justify-between">
                  <span>Clase {computedPasquill}</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {computedPasquill === 'A' || computedPasquill === 'B' ? 'Inestable' : computedPasquill === 'D' ? 'Neutral' : 'Estable'}
                  </span>
                </div>
              </div>

            </div>

            {/* THERMAL INVERSION TOGGLE */}
            <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasThermalInversion}
                  onChange={(e) => setHasThermalInversion(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700 focus:ring-cyan-500"
                />
                <div>
                  <span className="text-xs font-medium text-slate-200">Presencia de Inversión Térmica</span>
                  <p className="text-[10px] text-slate-400">Típica de la costa central peruana por la corriente de Humboldt</p>
                </div>
              </label>

              {hasThermalInversion && (
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-300">Base Inversión (m):</label>
                  <input
                    type="number"
                    min="100"
                    max="1500"
                    value={inversionBase}
                    onChange={(e) => setInversionBase(parseInt(e.target.value, 10))}
                    className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-300 mb-1">Notas / Observaciones del Operador</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. Garúa matutina, viento en calma durante las primeras horas..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* FOOTER ACTIONS */}
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
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-xl shadow-lg shadow-cyan-500/20 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Guardar Registro Meteorológico
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
