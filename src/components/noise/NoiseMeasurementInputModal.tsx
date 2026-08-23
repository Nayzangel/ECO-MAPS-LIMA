import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Volume2, 
  MapPin, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  PlusCircle, 
  Compass, 
  Building, 
  Radio, 
  Sparkles, 
  Layers,
  Scale
} from 'lucide-react';
import { 
  NoiseMeasurementRecord, 
  NoiseZoneType, 
  NoiseSourceCategory, 
  AcousticMethodologyType 
} from '../../types/noiseQuality';
import { 
  determineNoisePeriod, 
  getApplicableEcaLimit, 
  calculateNoisePriority, 
  evaluateCalibration, 
  convertCoordsToUtm18S, 
  PERUVIAN_NOISE_NORMATIVE 
} from '../../utils/noiseNormative';

interface NoiseMeasurementInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: NoiseMeasurementRecord) => void;
}

export const NoiseMeasurementInputModal: React.FC<NoiseMeasurementInputModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  // Form State
  const [title, setTitle] = useState<string>('Punto de Monitoreo Acústico Municipal');
  const [district, setDistrict] = useState<string>('Miraflores');
  const [address, setAddress] = useState<string>('Av. Larco cuadra 8');
  const [lat, setLat] = useState<string>('-12.1245');
  const [lng, setLng] = useState<string>('-77.0298');
  
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState<string>(todayStr);
  const [time, setTime] = useState<string>('14:30');
  const [durationMinutes, setDurationMinutes] = useState<number>(30);

  // Acoustic Parameters
  const [laeq, setLaeq] = useState<string>('68.5');
  const [lafmax, setLafmax] = useState<string>('78.2');
  const [lafmin, setLafmin] = useState<string>('59.0');
  const [lcpeak, setLcpeak] = useState<string>('94.5');

  // Zoning & Source
  const [zoneType, setZoneType] = useState<NoiseZoneType>('Comercial');
  const [sourceCategory, setSourceCategory] = useState<NoiseSourceCategory>('TRAFICO_RODADO');
  const [sourceDescription, setSourceDescription] = useState<string>('Tráfico vehicular de transporte público y taxis en hora punta.');
  const [methodology, setMethodology] = useState<AcousticMethodologyType>('MEDICION');
  const [notes, setNotes] = useState<string>('Monitoreo in situ con pantalla antiviento.');

  // Equipment & Calibration
  const [equipment, setEquipment] = useState<string>('Sonómetro Integrador Clase 1 NTi XL2');
  const [equipmentClass, setEquipmentClass] = useState<'Clase 1' | 'Clase 2'>('Clase 1');
  const [equipmentSerial, setEquipmentSerial] = useState<string>('NTI-XL2-4891');
  const [calibratorModel, setCalibratorModel] = useState<string>('NTi Precision Calibrator Class 1 (94 dB)');
  const [calibratorSerial, setCalibratorSerial] = useState<string>('CAL-NTI-912');
  const [preCalibrationDb, setPreCalibrationDb] = useState<string>('94.0');
  const [postCalibrationDb, setPostCalibrationDb] = useState<string>('94.1');
  const [certNumber, setCertNumber] = useState<string>('CERT-INACAL-AC-2026-0912');
  const [certExpiryDate, setCertExpiryDate] = useState<string>('2027-08-30');

  // Geolocation
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Computed Dynamic Properties
  const period = useMemo(() => determineNoisePeriod(time), [time]);
  const applicableLimit = useMemo(() => getApplicableEcaLimit(zoneType, period), [zoneType, period]);
  
  const parsedLaeq = parseFloat(laeq) || 0;
  const parsedLafmax = parseFloat(lafmax) || parsedLaeq + 8;
  const parsedLafmin = parseFloat(lafmin) || Math.max(parsedLaeq - 8, 30);
  const parsedLcpeak = parseFloat(lcpeak) || parsedLafmax + 14;

  const exceedanceDb = parsedLaeq - applicableLimit;
  const isExceeding = exceedanceDb > 0;

  const priorityResult = useMemo(() => {
    return calculateNoisePriority(parsedLaeq, applicableLimit, parsedLcpeak, zoneType);
  }, [parsedLaeq, applicableLimit, parsedLcpeak, zoneType]);

  const calibrationCheck = useMemo(() => {
    const pre = parseFloat(preCalibrationDb) || 94.0;
    const post = parseFloat(postCalibrationDb) || 94.0;
    return evaluateCalibration(pre, post, certExpiryDate);
  }, [preCalibrationDb, postCalibrationDb, certExpiryDate]);

  const calculatedUtm = useMemo(() => {
    const numLat = parseFloat(lat) || -12.0464;
    const numLng = parseFloat(lng) || -77.0328;
    return convertCoordsToUtm18S(numLat, numLng);
  }, [lat, lng]);

  // Handle GPS location
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude.toFixed(5));
          setLng(pos.coords.longitude.toFixed(5));
          setIsLocating(false);
        },
        (err) => {
          console.warn('Geolocation error', err);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numLat = parseFloat(lat) || -12.0464;
    const numLng = parseFloat(lng) || -77.0328;

    const newRecord: NoiseMeasurementRecord = {
      id: `NOISE-USR-${Date.now()}`,
      title: title || `${district} - ${address}`,
      district,
      address,
      coordinates: [numLat, numLng],
      utmZone: calculatedUtm,
      date,
      time,
      durationMinutes: Number(durationMinutes) || 15,
      laeq: Number(parsedLaeq.toFixed(1)),
      lafmax: Number(parsedLafmax.toFixed(1)),
      lafmin: Number(parsedLafmin.toFixed(1)),
      lcpeak: Number(parsedLcpeak.toFixed(1)),
      statistical: {
        l10: Number((parsedLaeq + 3.2).toFixed(1)),
        l50: Number((parsedLaeq - 1.0).toFixed(1)),
        l90: Number((parsedLaeq - 5.8).toFixed(1)),
        l95: Number((parsedLaeq - 7.0).toFixed(1))
      },
      zoneType,
      determinedPeriod: period,
      applicableNorm: 'D.S. N° 085-2003-PCM',
      ecaLimit: applicableLimit,
      exceedanceDb: Number(exceedanceDb.toFixed(1)),
      isExceeding,
      priority: priorityResult.priority,
      equipment,
      equipmentClass,
      equipmentSerial,
      calibration: {
        calibratorModel,
        calibratorSerial,
        preCalibrationDb: parseFloat(preCalibrationDb) || 94.0,
        postCalibrationDb: parseFloat(postCalibrationDb) || 94.0,
        deltaCalibrationDb: calibrationCheck.deltaDb,
        calibrationCertificateNumber: certNumber,
        calibrationExpiryDate: certExpiryDate,
        isCalibrationValid: calibrationCheck.isValid
      },
      sourceCategory,
      sourceDescription,
      methodology,
      notes,
      isUserAdded: true,
      operatorName: 'Inspector / Auditor Usuario',
      entityName: 'Registro Directo ECO-MAP'
    };

    onSave(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8 space-y-0">
        
        {/* HEADER */}
        <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                FORMULARIO DE INGRESO DE MONITOREO ACÚSTICO
              </div>
              <h2 className="text-xl font-black text-white">
                Registro de Presión Sonora & Evaluación ECA (D.S. 085-2003-PCM)
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar text-xs">
          
          {/* AUTOMATIC EVALUATION PREVIEW BANNER */}
          <div className={`p-4 rounded-2xl border ${
            isExceeding ? 'bg-rose-950/40 border-rose-500/50' : 'bg-emerald-950/40 border-emerald-500/50'
          } flex items-center justify-between flex-wrap gap-3`}>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                Dictamen Automático: Horario {period} • {zoneType}
              </span>
              <div className="text-sm font-black text-white flex items-center gap-2">
                <span>Límite ECA: <strong>{applicableLimit} dBA</strong></span>
                <span>•</span>
                <span className={isExceeding ? 'text-rose-400' : 'text-emerald-400'}>
                  {isExceeding ? `Excede +${exceedanceDb.toFixed(1)} dB` : 'Dentro de Norma'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Prioridad:</span>
              <span className={`px-2.5 py-1 rounded-xl text-xs font-black font-mono ${
                priorityResult.priority === 'CRITICA' ? 'bg-rose-500 text-slate-950' :
                priorityResult.priority === 'ALTA' ? 'bg-amber-500 text-slate-950' :
                priorityResult.priority === 'MODERADA' ? 'bg-yellow-400 text-slate-950' : 'bg-emerald-500 text-slate-950'
              }`}>
                {priorityResult.priority}
              </span>
            </div>
          </div>

          {/* METHODOLOGY SELECTOR */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-300 uppercase">
              Tipo de Entrada / Metodología
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['MEDICION', 'INTERPOLACION', 'MODELAMIENTO'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethodology(m)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    methodology === m
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{m}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 1: ACOUSTIC READINGS (LAeq, LAFmax, LAFmin, LCpeak) */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 text-xs">
              <Volume2 className="w-4 h-4" />
              1. Parámetros Acústicos (Nivel de Presión Sonora)
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">
                  LAeq (dBA) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={laeq}
                  onChange={(e) => setLaeq(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white font-mono font-bold text-sm"
                  placeholder="ej. 68.5"
                />
                <span className="text-[9px] text-slate-400 block mt-0.5">Continuo equivalente</span>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">
                  LAFmax (dBA) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={lafmax}
                  onChange={(e) => setLafmax(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white font-mono font-bold text-sm"
                  placeholder="ej. 78.2"
                />
                <span className="text-[9px] text-slate-400 block mt-0.5">Nivel Fast Máximo</span>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">
                  LAFmin (dBA) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={lafmin}
                  onChange={(e) => setLafmin(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white font-mono font-bold text-sm"
                  placeholder="ej. 59.0"
                />
                <span className="text-[9px] text-slate-400 block mt-0.5">Nivel Fast Mínimo</span>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">
                  LCpeak (dBC) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={lcpeak}
                  onChange={(e) => setLcpeak(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white font-mono font-bold text-sm"
                  placeholder="ej. 94.5"
                />
                <span className="text-[9px] text-slate-400 block mt-0.5">Pico ponderación C</span>
              </div>
            </div>
          </div>

          {/* 2: TEMPORALITY & ZONING */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 text-xs">
              <Clock className="w-4 h-4" />
              2. Temporalidad, Zonificación & Fuente
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Fecha</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Hora (HH:mm)</label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
                <span className="text-[9px] text-cyan-300 block mt-0.5">Periodo detectado: {period}</span>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Duración (minutos)</label>
                <input
                  type="number"
                  min="1"
                  max="1440"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white font-mono text-xs"
                  placeholder="ej. 30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">
                  Zonificación Normativa (D.S. 085-2003) *
                </label>
                <select
                  value={zoneType}
                  onChange={(e) => setZoneType(e.target.value as NoiseZoneType)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white font-medium text-xs"
                >
                  <option value="ProteccionEspecial">Zona de Protección Especial (Día 50 / Noche 40 dBA)</option>
                  <option value="Residencial">Zona Residencial (Día 60 / Noche 50 dBA)</option>
                  <option value="Comercial">Zona Comercial (Día 70 / Noche 60 dBA)</option>
                  <option value="Industrial">Zona Industrial (Día 80 / Noche 70 dBA)</option>
                  <option value="Mixta">Zona Mixta (Día 65 / Noche 55 dBA)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">
                  Categoría de Fuente Predominante *
                </label>
                <select
                  value={sourceCategory}
                  onChange={(e) => setSourceCategory(e.target.value as NoiseSourceCategory)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white font-medium text-xs"
                >
                  <option value="TRAFICO_RODADO">Tráfico Rodado / Vehicular</option>
                  <option value="INDUSTRIAL">Actividad Fabril / Industrial</option>
                  <option value="CONSTRUCCION">Obras de Construcción / Edificación</option>
                  <option value="COMERCIAL_OCIO">Comercio / Locales de Ocio Nocturno</option>
                  <option value="AEROPORTUARIO">Operaciones Aeronáuticas / Aeropuerto</option>
                  <option value="FERROVIARIO">Tránsito Ferroviario / Metro</option>
                  <option value="VECINAL_PERIFONEO">Vecinal / Perifoneo / Megafonía</option>
                  <option value="OTROS">Otras Fuentes</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">
                Descripción de la Fuente y Dinámica Sonora
              </label>
              <input
                type="text"
                value={sourceDescription}
                onChange={(e) => setSourceDescription(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white text-xs"
                placeholder="ej. Circulación continua de buses interurbanos y uso frecuente de bocina."
              />
            </div>
          </div>

          {/* 3: GEOLOCATION & LOCATION */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 text-xs">
                <MapPin className="w-4 h-4" />
                3. Ubicación & Georreferenciación
              </span>

              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isLocating}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
              >
                <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Obteniendo GPS...' : 'Usar GPS Actual'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Nombre / Identificador del Punto</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white text-xs"
                  placeholder="ej. Av. Larco cuadra 8"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Distrito</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white text-xs"
                  placeholder="ej. Miraflores"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Latitud (WGS84)</label>
                <input
                  type="text"
                  required
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white font-mono text-xs"
                  placeholder="-12.1245"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Longitud (WGS84)</label>
                <input
                  type="text"
                  required
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white font-mono text-xs"
                  placeholder="-77.0298"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Zona UTM Calculada</label>
                <input
                  type="text"
                  disabled
                  value={calculatedUtm}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-slate-400 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* 4: EQUIPMENT & CALIBRATION (INACAL ISO 1996) */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 text-xs">
                <ShieldCheck className="w-4 h-4" />
                4. Equipo & Calibración Acústica (ISO 1996)
              </span>

              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                calibrationCheck.isValid ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-rose-950 text-rose-300 border border-rose-500/40'
              }`}>
                {calibrationCheck.isValid ? '✓ CALIBRACIÓN VÁLIDA' : '⚠️ DERIVA EXCESIVA'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Sonómetro (Marca / Modelo)</label>
                <input
                  type="text"
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white text-xs"
                  placeholder="ej. Sonómetro Integrador Clase 1 NTi XL2"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Clase del Sonómetro</label>
                <select
                  value={equipmentClass}
                  onChange={(e) => setEquipmentClass(e.target.value as 'Clase 1' | 'Clase 2')}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white text-xs"
                >
                  <option value="Clase 1">Clase 1 (Precisión / Peritaje)</option>
                  <option value="Clase 2">Clase 2 (Propósito General)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Pre-Calibración (dB)</label>
                <input
                  type="number"
                  step="0.01"
                  value={preCalibrationDb}
                  onChange={(e) => setPreCalibrationDb(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white font-mono text-xs"
                  placeholder="94.0"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Post-Calibración (dB)</label>
                <input
                  type="number"
                  step="0.01"
                  value={postCalibrationDb}
                  onChange={(e) => setPostCalibrationDb(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white font-mono text-xs"
                  placeholder="94.1"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Deriva (Δ ≤ 0.5 dB)</label>
                <div className="w-full bg-slate-900/70 border border-slate-800 rounded-xl px-3 py-2 text-cyan-300 font-mono font-bold text-xs">
                  {calibrationCheck.deltaDb} dB
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Vence Certificado</label>
                <input
                  type="date"
                  value={certExpiryDate}
                  onChange={(e) => setCertExpiryDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTONS */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Registrar & Auditar Medición</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
