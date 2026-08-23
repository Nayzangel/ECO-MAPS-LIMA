import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Flame, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Gauge, 
  Thermometer, 
  Compass, 
  Calculator,
  ShieldCheck
} from 'lucide-react';
import { 
  StackPointSource, 
  IndustrialSector, 
  LengthUnit, 
  VelocityUnit, 
  VolumetricFlowUnit, 
  MassEmissionUnit, 
  PollutantEmissionRate 
} from '../../types/emissionSources';
import { 
  convertLength, 
  convertVelocity, 
  convertVolumetricFlow, 
  convertMassEmission, 
  calculateStackArea, 
  calculateFlowFromVelocity, 
  calculateVelocityFromFlow, 
  validateStackFluidDynamics,
  calculateBriggsPlumeRise 
} from '../../utils/emissionCalculations';

interface StackSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSource: (source: StackPointSource) => void;
}

export const StackSourceModal: React.FC<StackSourceModalProps> = ({
  isOpen,
  onClose,
  onAddSource
}) => {
  // Identification
  const [name, setName] = useState('Chimenea Principal Caldera / Horno');
  const [facilityName, setFacilityName] = useState('Complejo Industrial Lima');
  const [sector, setSector] = useState<IndustrialSector>('REFINERIA_HIDROCARBUROS');
  const [district, setDistrict] = useState('Ventanilla');
  const [lat, setLat] = useState<number>(-11.8795);
  const [lng, setLng] = useState<number>(-77.1382);
  const [legalEntity, setLegalEntity] = useState('Empresa Operadora S.A.');
  const [environmentalInstrument, setEnvironmentalInstrument] = useState('EIA-d / PAMA Aprobado');

  // Stack Dimensions & Thermodynamic Parameters
  const [heightVal, setHeightVal] = useState<number>(60.0);
  const [heightUnit, setHeightUnit] = useState<LengthUnit>('m');

  const [diameterVal, setDiameterVal] = useState<number>(2.50);
  const [diameterUnit, setDiameterUnit] = useState<LengthUnit>('m');

  const [tempVal, setTempVal] = useState<number>(160.0); // °C

  const [velocityVal, setVelocityVal] = useState<number>(15.0);
  const [velocityUnit, setVelocityUnit] = useState<VelocityUnit>('m/s');

  const [flowVal, setFlowVal] = useState<number>(73.63);
  const [flowUnit, setFlowUnit] = useState<VolumetricFlowUnit>('m3/s');

  // Operational info
  const [hoursPerDay, setHoursPerDay] = useState<number>(24);
  const [daysPerYear, setDaysPerYear] = useState<number>(350);
  const [fuelType, setFuelType] = useState<string>('Gas Natural / Petróleo Industrial');
  const [controlEquipment, setControlEquipment] = useState<string>('Filtro de Mangas / ESP');

  // Pollutant Emission Rates
  const [so2Rate, setSo2Rate] = useState<number>(8.5);
  const [so2MgNm3, setSo2MgNm3] = useState<number>(280);

  const [noxRate, setNoxRate] = useState<number>(6.2);
  const [noxMgNm3, setNoxMgNm3] = useState<number>(210);

  const [pm10Rate, setPm10Rate] = useState<number>(1.2);
  const [pm10MgNm3, setPm10MgNm3] = useState<number>(40);

  const [coRate, setCoRate] = useState<number>(3.0);
  const [coMgNm3, setCoMgNm3] = useState<number>(55);

  // Normalized values in base SI units
  const heightMeters = convertLength(heightVal, heightUnit, 'm');
  const diameterMeters = convertLength(diameterVal, diameterUnit, 'm');
  const velocityMs = convertVelocity(velocityVal, velocityUnit, 'm/s');
  const flowM3s = convertVolumetricFlow(flowVal, flowUnit, 'm3/s');

  // Fluid Dynamics Validation Check
  const fluidValidation = validateStackFluidDynamics(diameterMeters, velocityMs, flowM3s);

  // Live Briggs Plume Rise Calculation
  const plumeResult = calculateBriggsPlumeRise(
    heightMeters,
    diameterMeters,
    tempVal,
    velocityMs,
    20.0,
    3.5
  );

  // Auto-calculate flow button
  const handleAutoComputeFlow = () => {
    const computed = calculateFlowFromVelocity(diameterMeters, velocityMs);
    setFlowVal(computed);
    setFlowUnit('m3/s');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const pollutants: PollutantEmissionRate[] = [
      {
        pollutant: 'SO2',
        rateValue: so2Rate,
        rateUnit: 'g/s',
        concentrationMgNm3: so2MgNm3,
        emissionLimitMgNm3: 500,
        exceedsLmp: so2MgNm3 > 500
      },
      {
        pollutant: 'NOX',
        rateValue: noxRate,
        rateUnit: 'g/s',
        concentrationMgNm3: noxMgNm3,
        emissionLimitMgNm3: 400,
        exceedsLmp: noxMgNm3 > 400
      },
      {
        pollutant: 'PM10',
        rateValue: pm10Rate,
        rateUnit: 'g/s',
        concentrationMgNm3: pm10MgNm3,
        emissionLimitMgNm3: 50,
        exceedsLmp: pm10MgNm3 > 50
      },
      {
        pollutant: 'CO',
        rateValue: coRate,
        rateUnit: 'g/s',
        concentrationMgNm3: coMgNm3,
        emissionLimitMgNm3: 100,
        exceedsLmp: coMgNm3 > 100
      }
    ];

    const newStack: StackPointSource = {
      id: `STACK-USER-${Date.now()}`,
      type: 'PUNTUAL_CHIMENEA',
      name,
      facilityName,
      sector,
      district,
      coordinates: [lat, lng],
      stackHeightMeters: heightMeters,
      stackInnerDiameterMeters: diameterMeters,
      gasExitTemperatureCelsius: tempVal,
      gasExitVelocityMs: velocityMs,
      volumetricFlowRateM3s: flowM3s,
      buoyancyFluxFb: plumeResult.buoyancyFluxFb,
      momentumFluxFm: plumeResult.momentumFluxFm,
      plumeRiseDeltaH: plumeResult.plumeRiseDeltaH,
      effectiveStackHeightMeters: plumeResult.effectiveStackHeight,
      pollutants,
      operatingHoursPerDay: hoursPerDay,
      operatingDaysPerYear: daysPerYear,
      fuelType,
      controlEquipment,
      legalEntity,
      environmentalInstrument,
      isUserAdded: true
    };

    onAddSource(newStack);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 border border-rose-500/30 text-rose-400">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Ingreso de Fuente Puntual: Chimenea de Emisión Industrial
              </h2>
              <p className="text-xs text-slate-400">
                Parámetros geométricos, hidrodinámicos y tasas de emisión validadas
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
          
          {/* 1: IDENTIFICACIÓN Y UBICACIÓN */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Compass className="w-4 h-4" /> 1. Datos Generales y Georreferenciación
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nombre de la Chimenea / Ducto</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Planta / Establecimiento</label>
                <input
                  type="text"
                  required
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Sector Industrial</label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value as IndustrialSector)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-cyan-400 font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  <option value="REFINERIA_HIDROCARBUROS">Refinería e Hidrocarburos</option>
                  <option value="MINERIA_METALURGIA">Minería y Metalurgia</option>
                  <option value="TERMOELECTRICA">Central Termoeléctrica</option>
                  <option value="CEMENTERA_CALERA">Cemento y Cal</option>
                  <option value="PESQUERA_HARINA">Pesquera (Harina y Aceite)</option>
                  <option value="QUIMICA_PETROQUIMICA">Química y Petroquímica</option>
                  <option value="OTRA_INDUSTRIA">Otras Industrias Manufactureras</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Distrito / Localidad</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
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
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
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
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* 2: PARÁMETROS FÍSICOS, GEOMETRÍA Y CAUDAL (CON VALIDACIÓN ESTRICTA DE UNIDADES) */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Gauge className="w-4 h-4" /> 2. Geometría y Parámetros Termodinámicos de la Chimenea
              </h3>
              <button
                type="button"
                onClick={handleAutoComputeFlow}
                className="text-[11px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg font-semibold hover:bg-amber-500/20 transition flex items-center gap-1.5"
              >
                <Calculator className="w-3.5 h-3.5" /> Calcular Caudal Q = A × v
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              
              {/* ALTURA FÍSICA */}
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-200">Altura física (hs)</label>
                  <select
                    value={heightUnit}
                    onChange={(e) => setHeightUnit(e.target.value as LengthUnit)}
                    className="bg-slate-800 text-[11px] text-cyan-400 rounded px-1.5 py-0.5 border border-slate-700"
                  >
                    <option value="m">metros (m)</option>
                    <option value="ft">pies (ft)</option>
                    <option value="cm">cm</option>
                  </select>
                </div>
                <input
                  type="number"
                  min="1"
                  step="0.1"
                  required
                  value={heightVal}
                  onChange={(e) => setHeightVal(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Altura efectiva: <strong className="text-emerald-400">{plumeResult.effectiveStackHeight} m</strong>
                </span>
              </div>

              {/* DIÁMETRO INTERNO */}
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-200">Diámetro interno (d)</label>
                  <select
                    value={diameterUnit}
                    onChange={(e) => setDiameterUnit(e.target.value as LengthUnit)}
                    className="bg-slate-800 text-[11px] text-cyan-400 rounded px-1.5 py-0.5 border border-slate-700"
                  >
                    <option value="m">metros (m)</option>
                    <option value="cm">cm</option>
                    <option value="in">pulgadas (in)</option>
                    <option value="ft">ft</option>
                  </select>
                </div>
                <input
                  type="number"
                  min="0.1"
                  step="0.05"
                  required
                  value={diameterVal}
                  onChange={(e) => setDiameterVal(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Área de salida: <strong className="text-white">{calculateStackArea(diameterMeters).toFixed(3)} m²</strong>
                </span>
              </div>

              {/* TEMPERATURA DE GASES */}
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                <label className="text-xs font-semibold text-slate-200 block mb-1">
                  Temperatura Gases (Ts en °C)
                </label>
                <input
                  type="number"
                  step="1"
                  required
                  value={tempVal}
                  onChange={(e) => setTempVal(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Temperatura absoluta: <strong className="text-white">{(tempVal + 273.15).toFixed(1)} K</strong>
                </span>
              </div>

              {/* VELOCIDAD DE SALIDA */}
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-200">Velocidad gases (vs)</label>
                  <select
                    value={velocityUnit}
                    onChange={(e) => setVelocityUnit(e.target.value as VelocityUnit)}
                    className="bg-slate-800 text-[11px] text-cyan-400 rounded px-1.5 py-0.5 border border-slate-700"
                  >
                    <option value="m/s">m/s</option>
                    <option value="ft/s">ft/s</option>
                    <option value="km/h">km/h</option>
                  </select>
                </div>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  required
                  value={velocityVal}
                  onChange={(e) => setVelocityVal(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Velocidad: <strong className="text-white">{velocityMs} m/s</strong>
                </span>
              </div>

              {/* CAUDAL VOLUMÉTRICO */}
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-200">Caudal emisión (Qv)</label>
                  <select
                    value={flowUnit}
                    onChange={(e) => setFlowUnit(e.target.value as VolumetricFlowUnit)}
                    className="bg-slate-800 text-[11px] text-cyan-400 rounded px-1.5 py-0.5 border border-slate-700"
                  >
                    <option value="m3/s">m³/s</option>
                    <option value="m3/h">m³/h</option>
                    <option value="Nm3/h">Nm³/h</option>
                    <option value="ACFM">ACFM</option>
                  </select>
                </div>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  required
                  value={flowVal}
                  onChange={(e) => setFlowVal(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Caudal: <strong className="text-white">{flowM3s} m³/s</strong> ({(flowM3s * 3600).toFixed(0)} m³/h)
                </span>
              </div>

              {/* PLUME RISE CALCULATION RESULT */}
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 flex flex-col justify-center">
                <div className="text-[11px] font-bold text-slate-300 mb-1">
                  Elevación Penacho (Briggs Δh):
                </div>
                <div className="text-base font-black text-rose-400 font-mono">
                  + {plumeResult.plumeRiseDeltaH} m
                </div>
                <div className="text-[10px] text-slate-400">
                  {plumeResult.isBuoyancyDominated ? 'Dominado por Flotabilidad Térmica' : 'Dominado por Momento'}
                </div>
              </div>

            </div>

            {/* FLUID DYNAMICS VALIDATION ALERT */}
            <div className={`mt-3 p-2.5 rounded-lg border flex items-center gap-2 text-xs ${
              fluidValidation.isValid 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}>
              {fluidValidation.isValid ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-400" />
              )}
              <span>{fluidValidation.message}</span>
            </div>

          </div>

          {/* 3: TASAS DE EMISIÓN DE CONTAMINANTES */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Flame className="w-4 h-4" /> 3. Tasas de Emisión y Concentración de Contaminantes
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* SO2 */}
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                <div className="text-xs font-bold text-slate-200 mb-1">Dióxido de Azufre (SO2)</div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Tasa másica (g/s)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={so2Rate}
                  onChange={(e) => setSo2Rate(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono mb-2"
                />
                <label className="text-[10px] text-slate-400 block mb-0.5">Conc. (mg/Nm³)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={so2MgNm3}
                  onChange={(e) => setSo2MgNm3(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono"
                />
                <span className="text-[9px] text-slate-400 mt-1 block">LMP: 500 mg/Nm³</span>
              </div>

              {/* NOX */}
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                <div className="text-xs font-bold text-slate-200 mb-1">Óxidos de Nitrógeno (NOx)</div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Tasa másica (g/s)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={noxRate}
                  onChange={(e) => setNoxRate(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono mb-2"
                />
                <label className="text-[10px] text-slate-400 block mb-0.5">Conc. (mg/Nm³)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={noxMgNm3}
                  onChange={(e) => setNoxMgNm3(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono"
                />
                <span className="text-[9px] text-slate-400 mt-1 block">LMP: 400 mg/Nm³</span>
              </div>

              {/* PM10 */}
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                <div className="text-xs font-bold text-slate-200 mb-1">Material Particulado (PM10)</div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Tasa másica (g/s)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={pm10Rate}
                  onChange={(e) => setPm10Rate(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono mb-2"
                />
                <label className="text-[10px] text-slate-400 block mb-0.5">Conc. (mg/Nm³)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={pm10MgNm3}
                  onChange={(e) => setPm10MgNm3(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono"
                />
                <span className="text-[9px] text-slate-400 mt-1 block">LMP: 50 mg/Nm³</span>
              </div>

              {/* CO */}
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                <div className="text-xs font-bold text-slate-200 mb-1">Monóxido de Carbono (CO)</div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Tasa másica (g/s)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={coRate}
                  onChange={(e) => setCoRate(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono mb-2"
                />
                <label className="text-[10px] text-slate-400 block mb-0.5">Conc. (mg/Nm³)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={coMgNm3}
                  onChange={(e) => setCoMgNm3(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono"
                />
                <span className="text-[9px] text-slate-400 mt-1 block">LMP: 100 mg/Nm³</span>
              </div>

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
              className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 rounded-xl shadow-lg shadow-rose-500/20 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Guardar Fuente Chimenea
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
