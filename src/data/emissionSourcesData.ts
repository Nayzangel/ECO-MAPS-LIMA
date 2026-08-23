import { 
  StackPointSource, 
  RoadwayLineSource, 
  SurfaceAreaSource, 
  AnyEmissionSource 
} from '../types/emissionSources';
import { calculateBriggsPlumeRise, calculateFlowFromVelocity } from '../utils/emissionCalculations';

// OFFICIAL & STANDARDIZED POINT SOURCES (CHIMENEAS / STACKS)
export const OFFICIAL_STACK_SOURCES: StackPointSource[] = [
  {
    id: 'STACK-REFINERIA-001',
    type: 'PUNTUAL_CHIMENEA',
    name: 'Chimenea Principal Unidad Craqueo Catalítico (FCC)',
    facilityName: 'Refinería La Pampilla (Repsol)',
    sector: 'REFINERIA_HIDROCARBUROS',
    district: 'Ventanilla',
    coordinates: [-11.8795, -77.1382],
    utmCoordinates: {
      zone: '18S',
      eastX: 267320,
      northY: 8686150
    },
    stackHeightMeters: 65.0, // hs (m)
    stackInnerDiameterMeters: 2.80, // d (m)
    gasExitTemperatureCelsius: 185.0, // Ts (°C)
    gasExitVelocityMs: 14.5, // vs (m/s)
    volumetricFlowRateM3s: calculateFlowFromVelocity(2.80, 14.5), // Qv = 89.28 m3/s
    buoyancyFluxFb: 182.4,
    momentumFluxFm: 45.2,
    plumeRiseDeltaH: 128.5,
    effectiveStackHeightMeters: 193.5, // 65.0 + 128.5
    pollutants: [
      {
        pollutant: 'SO2',
        rateValue: 12.4, // g/s
        rateUnit: 'g/s',
        concentrationMgNm3: 380,
        emissionLimitMgNm3: 500, // D.S. 014-2010-MINAM
        exceedsLmp: false
      },
      {
        pollutant: 'NOX',
        rateValue: 8.9, // g/s
        rateUnit: 'g/s',
        concentrationMgNm3: 270,
        emissionLimitMgNm3: 400,
        exceedsLmp: false
      },
      {
        pollutant: 'PM10',
        rateValue: 1.8, // g/s
        rateUnit: 'g/s',
        concentrationMgNm3: 45,
        emissionLimitMgNm3: 50,
        exceedsLmp: false
      }
    ],
    operatingHoursPerDay: 24,
    operatingDaysPerYear: 350,
    fuelType: 'Gas de Refinería + Residual',
    controlEquipment: 'Precipitador Electrostático (ESP) + Claus Sulfur Recovery Unit',
    legalEntity: 'Repsol Refinería La Pampilla S.A.A.',
    environmentalInstrument: 'PAMA / Modificación de EIA aprobado por SENACE'
  },
  {
    id: 'STACK-TERMO-002',
    type: 'PUNTUAL_CHIMENEA',
    name: 'Chimenea Turbina de Gas Ciclo Combinado TG-1',
    facilityName: 'Central Térmica Ventanilla (Enel Generación)',
    sector: 'TERMOELECTRICA',
    district: 'Ventanilla',
    coordinates: [-11.8624, -77.1265],
    utmCoordinates: {
      zone: '18S',
      eastX: 268610,
      northY: 8688040
    },
    stackHeightMeters: 50.0,
    stackInnerDiameterMeters: 4.20,
    gasExitTemperatureCelsius: 110.0,
    gasExitVelocityMs: 18.2,
    volumetricFlowRateM3s: calculateFlowFromVelocity(4.20, 18.2), // Qv = 252.1 m3/s
    buoyancyFluxFb: 210.8,
    momentumFluxFm: 145.6,
    plumeRiseDeltaH: 142.0,
    effectiveStackHeightMeters: 192.0,
    pollutants: [
      {
        pollutant: 'NOX',
        rateValue: 14.5,
        rateUnit: 'g/s',
        concentrationMgNm3: 110,
        emissionLimitMgNm3: 150,
        exceedsLmp: false
      },
      {
        pollutant: 'CO',
        rateValue: 4.2,
        rateUnit: 'g/s',
        concentrationMgNm3: 32,
        emissionLimitMgNm3: 100,
        exceedsLmp: false
      }
    ],
    operatingHoursPerDay: 24,
    operatingDaysPerYear: 360,
    fuelType: 'Gas Natural de Camisea',
    controlEquipment: 'Quemadores Dry Low-NOx (DLN)',
    legalEntity: 'Enel Generación Perú S.A.A.',
    environmentalInstrument: 'EIA Central Térmica Ventanilla (MINEM)'
  },
  {
    id: 'STACK-CEMENTO-003',
    type: 'PUNTUAL_CHIMENEA',
    name: 'Chimenea Horno de Clinker N° 1',
    facilityName: 'Planta Atocongo (UNACEM)',
    sector: 'CEMENTERA_CALERA',
    district: 'Villa María del Triunfo',
    coordinates: [-12.1645, -76.9298],
    utmCoordinates: {
      zone: '18S',
      eastX: 290150,
      northY: 8654620
    },
    stackHeightMeters: 78.0,
    stackInnerDiameterMeters: 3.50,
    gasExitTemperatureCelsius: 145.0,
    gasExitVelocityMs: 12.0,
    volumetricFlowRateM3s: calculateFlowFromVelocity(3.50, 12.0),
    buoyancyFluxFb: 135.2,
    momentumFluxFm: 48.0,
    plumeRiseDeltaH: 112.4,
    effectiveStackHeightMeters: 190.4,
    pollutants: [
      {
        pollutant: 'PM10',
        rateValue: 3.6,
        rateUnit: 'g/s',
        concentrationMgNm3: 35,
        emissionLimitMgNm3: 50, // LMP Industria del Cemento D.S. 003-2002-PRODUCE
        exceedsLmp: false
      },
      {
        pollutant: 'SO2',
        rateValue: 6.8,
        rateUnit: 'g/s',
        concentrationMgNm3: 180,
        emissionLimitMgNm3: 400,
        exceedsLmp: false
      },
      {
        pollutant: 'NOX',
        rateValue: 11.2,
        rateUnit: 'g/s',
        concentrationMgNm3: 310,
        emissionLimitMgNm3: 600,
        exceedsLmp: false
      }
    ],
    operatingHoursPerDay: 24,
    operatingDaysPerYear: 340,
    fuelType: 'Gas Natural + Coque de Petróleo',
    controlEquipment: 'Filtro de Mangas de Alta Eficiencia (Baghouse)',
    legalEntity: 'Unión Andina de Cementos S.A.A. (UNACEM)',
    environmentalInstrument: 'PAMA Planta Atocongo (PRODUCE)'
  },
  {
    id: 'STACK-PESQUERA-004',
    type: 'PUNTUAL_CHIMENEA',
    name: 'Chimenea Caldera & Secador Rotatubo',
    facilityName: 'Planta Harinera Pesquera Callao Puerto',
    sector: 'PESQUERA_HARINA',
    district: 'Callao',
    coordinates: [-12.0452, -77.1420],
    utmCoordinates: {
      zone: '18S',
      eastX: 266850,
      northY: 8667820
    },
    stackHeightMeters: 32.0,
    stackInnerDiameterMeters: 1.40,
    gasExitTemperatureCelsius: 125.0,
    gasExitVelocityMs: 11.5,
    volumetricFlowRateM3s: calculateFlowFromVelocity(1.40, 11.5),
    buoyancyFluxFb: 18.5,
    momentumFluxFm: 7.2,
    plumeRiseDeltaH: 48.0,
    effectiveStackHeightMeters: 80.0,
    pollutants: [
      {
        pollutant: 'H2S',
        rateValue: 0.45,
        rateUnit: 'g/s',
        concentrationMgNm3: 5.2,
        emissionLimitMgNm3: 10.0,
        exceedsLmp: false
      },
      {
        pollutant: 'PM10',
        rateValue: 1.2,
        rateUnit: 'g/s',
        concentrationMgNm3: 72,
        emissionLimitMgNm3: 150,
        exceedsLmp: false
      },
      {
        pollutant: 'SO2',
        rateValue: 4.8,
        rateUnit: 'g/s',
        concentrationMgNm3: 310,
        emissionLimitMgNm3: 500,
        exceedsLmp: false
      }
    ],
    operatingHoursPerDay: 18,
    operatingDaysPerYear: 120, // Temporadas de pesca
    fuelType: 'R-500 / Gas Natural',
    controlEquipment: 'Lavador de Gases Húmedo (Venturi Scrubber) + Ciclones',
    legalEntity: 'Pesquera Exalmar / TASA Callao',
    environmentalInstrument: 'DIA Sector Pesquero (PRODUCE)'
  }
];

// OFFICIAL LINE SOURCES (ROADWAYS / ARTERIAL HIGHWAYS)
export const OFFICIAL_LINE_SOURCES: RoadwayLineSource[] = [
  {
    id: 'LINE-VIAEXPRESA-001',
    type: 'LINEAL_VIA',
    name: 'Vía Expresa Paseo de la República (Javier Prado - 28 de Julio)',
    district: 'Lima / La Victoria / San Isidro',
    startCoordinates: [-12.0680, -77.0320],
    endCoordinates: [-12.0910, -77.0270],
    lengthMeters: 2850,
    roadwayWidthMeters: 28.0,
    releaseHeightMeters: 1.2,
    trafficVolumeVehiclesPerHour: 6200,
    heavyVehiclesPercent: 12.5,
    averageSpeedKmh: 45,
    linearEmissionRateGPerSMeter: 0.0038, // g/s·m (NOx)
    pollutants: [
      { pollutant: 'NOX', rateValue: 10.83, rateUnit: 'g/s' }, // 0.0038 * 2850m
      { pollutant: 'PM2_5', rateValue: 0.95, rateUnit: 'g/s' },
      { pollutant: 'CO', rateValue: 24.5, rateUnit: 'g/s' }
    ]
  },
  {
    id: 'LINE-PANAMERICANA-002',
    type: 'LINEAL_VIA',
    name: 'Autopista Panamericana Norte (Puente Piedra - Los Olivos)',
    district: 'Puente Piedra / Los Olivos',
    startCoordinates: [-11.8720, -77.0750],
    endCoordinates: [-11.9650, -77.0680],
    lengthMeters: 10500,
    roadwayWidthMeters: 36.0,
    releaseHeightMeters: 1.5,
    trafficVolumeVehiclesPerHour: 8400,
    heavyVehiclesPercent: 28.0, // Alto tráfico pesado interprovincial diesel
    averageSpeedKmh: 55,
    linearEmissionRateGPerSMeter: 0.0062,
    pollutants: [
      { pollutant: 'NOX', rateValue: 65.1, rateUnit: 'g/s' },
      { pollutant: 'PM10', rateValue: 18.9, rateUnit: 'g/s' },
      { pollutant: 'PM2_5', rateValue: 9.45, rateUnit: 'g/s' }
    ]
  }
];

// OFFICIAL AREA SOURCES (CANTERAS / DEPÓSITOS DIFUSOS)
export const OFFICIAL_AREA_SOURCES: SurfaceAreaSource[] = [
  {
    id: 'AREA-MINERALES-001',
    type: 'AREA_SUPERFICIAL',
    name: 'Patio de Almacenamiento y Acopio de Concentrados de Minerales',
    facilityName: 'Terminal Portuario / Faja Transportadora Callao',
    district: 'Callao',
    centerCoordinates: [-12.0385, -77.1350],
    polygonCoordinates: [
      [-12.0365, -77.1370],
      [-12.0365, -77.1330],
      [-12.0405, -77.1330],
      [-12.0405, -77.1370]
    ],
    surfaceAreaM2: 160000,
    surfaceAreaHectares: 16.0,
    releaseHeightMeters: 4.5,
    areaEmissionRateGPerSM2: 0.000015, // g/s·m2 de PM10 por resuspensión eólica
    pollutants: [
      { pollutant: 'PM10', rateValue: 2.4, rateUnit: 'g/s' }, // 160000 * 0.000015
      { pollutant: 'PM2_5', rateValue: 0.72, rateUnit: 'g/s' },
      { pollutant: 'PB', rateValue: 0.045, rateUnit: 'g/s' }
    ],
    notes: 'Pilas de acopio de zinc, plomo y cobre. Cuenta con supresores de polvo y cañones de nebulización.'
  },
  {
    id: 'AREA-CANTERA-002',
    type: 'AREA_SUPERFICIAL',
    name: 'Cantera de Extracción de Materiales No Metálicos (Caliza)',
    facilityName: 'Cantera San Juan de Lurigancho',
    district: 'San Juan de Lurigancho',
    centerCoordinates: [-11.9750, -76.9850],
    surfaceAreaM2: 250000,
    surfaceAreaHectares: 25.0,
    releaseHeightMeters: 2.0,
    areaEmissionRateGPerSM2: 0.000022,
    pollutants: [
      { pollutant: 'PM10', rateValue: 5.5, rateUnit: 'g/s' },
      { pollutant: 'PM2_5', rateValue: 1.1, rateUnit: 'g/s' }
    ],
    notes: 'Actividad extractiva con chancado primario y tránsito de volquetes en vías no pavimentadas.'
  }
];
