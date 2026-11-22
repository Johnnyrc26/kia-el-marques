export interface FinancingEntity {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  type: 'banco' | 'financiera';
  color: string;
  lightBg: string;
  borderColor: string;

  // Tasa de Interés
  interestRateText: string;
  annualInterestRate: number; // Tasa nominal por defecto (%)
  interestRateMin?: number;
  interestRateMax?: number;
  rateType: 'fija' | 'variable';

  // Financiamiento Máximo & Mínimo de Inicial
  maxFinancingPctPN: number; // e.g. 50, 70, 60, 90
  maxFinancingPctPJ?: number; // e.g. 100 para Provincial PJ
  minInitialPctPN: number;
  minInitialPctPJ?: number;
  financingText: string;

  // Plazos
  minMonths: number;
  maxMonths: number;
  allowedMonths: number[]; // Plazos exactos disponibles
  plazoText: string;

  // Comisiones & Gastos
  flatFeePct: number;
  flatFeeNotes: string;
  adminFeeAnnualPct?: number; // e.g. 6-7% anual en Arca
  disbursementFeePct?: number; // e.g. 3% en Eleva Valor
  legalExpensesFixedUSD?: number; // e.g. $400 en SMF 24

  // Seguros
  insuranceNotes: string;

  // Modalidad de Pago
  paymentCurrency: 'USD ($)' | 'Bs Cargo en Cuenta';
  paymentMethodText: string;

  // Pagos Anticipados
  earlyPaymentAllowed: boolean;
  earlyPaymentFromMonth?: number;
  earlyPaymentPenaltyText: string;

  // Condiciones & Requisitos
  accountCondition: string;
  bankAccountSeniorityYears: number;
  observations: string;
}

export const FINANCING_ENTITIES: FinancingEntity[] = [
  {
    id: 'pivca',
    name: 'PIVCA',
    shortName: 'PIVCA',
    tagline: 'Financiera de Vehículos BNC',
    type: 'financiera',
    color: '#4338ca', // Indigo
    lightBg: '#eef2ff',
    borderColor: '#c7d2fe',
    interestRateText: '18% Anual',
    annualInterestRate: 18.0,
    rateType: 'fija',
    maxFinancingPctPN: 50,
    minInitialPctPN: 50,
    financingText: 'Financia hasta 50% · Inicial mínima 50%',
    minMonths: 24,
    maxMonths: 36,
    allowedMonths: [24, 36],
    plazoText: 'Desde 24 hasta 36 Meses',
    flatFeePct: 6.0,
    flatFeeNotes: '6.0% Comisión flat (0,06)',
    insuranceNotes: 'Póliza Todo Riesgo Seguros Venezuela (1er Año De Contado, 2do Año Financiada)',
    paymentCurrency: 'USD ($)',
    paymentMethodText: 'Pago Mensual en $ USD',
    earlyPaymentAllowed: false,
    earlyPaymentPenaltyText: 'No permitidos',
    accountCondition: 'Cuenta Moneda Extranjera',
    bankAccountSeniorityYears: 0,
    observations: 'Cuenta $ BNC (Banco Nacional de Crédito)',
  },
  {
    id: 'arca',
    name: 'ARCA FINANCE',
    shortName: 'ARCA',
    tagline: 'Planes Flexibles hasta 48 Meses',
    type: 'financiera',
    color: '#7c3aed', // Purple
    lightBg: '#faf5ff',
    borderColor: '#e9d5ff',
    interestRateText: '14% - 16% Anual Fija Según Monto',
    annualInterestRate: 15.0,
    interestRateMin: 14.0,
    interestRateMax: 16.0,
    rateType: 'fija',
    maxFinancingPctPN: 70,
    minInitialPctPN: 30,
    financingText: 'Financia hasta 70% · Inicial mínima 30%',
    minMonths: 12,
    maxMonths: 48,
    allowedMonths: [12, 18, 24, 36, 48],
    plazoText: 'Desde 12 hasta 48 Meses',
    flatFeePct: 5.5,
    adminFeeAnnualPct: 6.5,
    flatFeeNotes: '5% - 6% Flat + Administrativos 6% - 7% anual',
    insuranceNotes: 'Póliza Vehículo + Vida + GPS',
    paymentCurrency: 'USD ($)',
    paymentMethodText: 'Pago Mensual en $ USD',
    earlyPaymentAllowed: true,
    earlyPaymentFromMonth: 13,
    earlyPaymentPenaltyText: 'Permitido a partir del Mes 13',
    accountCondition: 'Cuenta Moneda Extranjera',
    bankAccountSeniorityYears: 2,
    observations: 'Mínimo 2 años de antigüedad en cuentas bancarias',
  },
  {
    id: 'mopane',
    name: 'MOPANE',
    shortName: 'MOPANE',
    tagline: 'Financiamiento Rápido desde 6 Meses',
    type: 'financiera',
    color: '#059669', // Emerald
    lightBg: '#ecfdf5',
    borderColor: '#a7f3d0',
    interestRateText: '22% Anual',
    annualInterestRate: 22.0,
    rateType: 'fija',
    maxFinancingPctPN: 60,
    minInitialPctPN: 40,
    financingText: 'Financia hasta 60% · Inicial mínima 40%',
    minMonths: 6,
    maxMonths: 36,
    allowedMonths: [6, 12, 18, 24, 30, 36],
    plazoText: 'Desde 6 hasta 36 Meses',
    flatFeePct: 3.5,
    flatFeeNotes: '3.5% Comisión flat',
    insuranceNotes: 'Póliza de Seguro + Fiador',
    paymentCurrency: 'USD ($)',
    paymentMethodText: 'Pago Mensual en $ USD',
    earlyPaymentAllowed: true,
    earlyPaymentFromMonth: 13,
    earlyPaymentPenaltyText: 'A partir del Mes 13 (5% penalización sobre monto otorgado)',
    accountCondition: 'Cuenta Moneda Extranjera',
    bankAccountSeniorityYears: 2,
    observations: 'Mínimo 2 años de antigüedad en cuentas bancarias',
  },
  {
    id: 'smf24',
    name: 'SMF 24',
    shortName: 'SMF 24',
    tagline: 'Hasta 70% Financiado en 24 Meses',
    type: 'financiera',
    color: '#d97706', // Amber
    lightBg: '#fffbeb',
    borderColor: '#fde68a',
    interestRateText: '18% - 21% Anual',
    annualInterestRate: 19.5,
    interestRateMin: 18.0,
    interestRateMax: 21.0,
    rateType: 'fija',
    maxFinancingPctPN: 70,
    minInitialPctPN: 30,
    financingText: 'Financia hasta 70% · Inicial mínima 30%',
    minMonths: 12,
    maxMonths: 24,
    allowedMonths: [12, 18, 24],
    plazoText: 'Hasta 24 Meses',
    flatFeePct: 5.0, // 5% para 18m, 6% para 24m
    legalExpensesFixedUSD: 400,
    flatFeeNotes: '5% (18m) / 6% (24m) + $400 Gastos Legales',
    insuranceNotes: 'Póliza Vehículo',
    paymentCurrency: 'USD ($)',
    paymentMethodText: 'Pago Mensual en $ USD',
    earlyPaymentAllowed: true,
    earlyPaymentFromMonth: 6,
    earlyPaymentPenaltyText: 'Permitido a partir del Mes 6',
    accountCondition: 'Cuenta en Moneda Extranjera',
    bankAccountSeniorityYears: 2,
    observations: 'Mínimo 2 años de antigüedad en cuentas bancarias',
  },
  {
    id: 'eleva_valor',
    name: 'ELEVA VALOR',
    shortName: 'ELEVA VALOR',
    tagline: 'Alianza Bancamiga Cuenta Custodia',
    type: 'financiera',
    color: '#db2777', // Pink
    lightBg: '#fdf2f8',
    borderColor: '#fbcfe8',
    interestRateText: '18% Anual',
    annualInterestRate: 18.0,
    rateType: 'fija',
    maxFinancingPctPN: 50,
    minInitialPctPN: 50,
    financingText: 'Financia hasta 50% · Inicial mínima 50%',
    minMonths: 12,
    maxMonths: 24,
    allowedMonths: [12, 18, 24],
    plazoText: 'Hasta 24 Meses',
    flatFeePct: 5.0,
    disbursementFeePct: 3.0,
    flatFeeNotes: '5% Flat + 3% Desembolso (Total 8%)',
    insuranceNotes: 'Póliza Vehículo + Póliza de Vida Seguroamiga',
    paymentCurrency: 'USD ($)',
    paymentMethodText: 'Pago Mensual en $ USD',
    earlyPaymentAllowed: false,
    earlyPaymentPenaltyText: 'No permitido',
    accountCondition: 'Cuenta Custodia Bancamiga',
    bankAccountSeniorityYears: 2,
    observations: 'Mínimo 2 años de antigüedad en cuentas bancarias',
  },
  {
    id: 'provincial',
    name: 'BBVA PROVINCIAL',
    shortName: 'PROVINCIAL',
    tagline: 'Líder Bancario: Hasta 90% PN y 100% PJ',
    type: 'banco',
    color: '#0284c7', // BBVA Sky Blue
    lightBg: '#f0f9ff',
    borderColor: '#bae6fd',
    interestRateText: '13% - 16% Anual (Variable)',
    annualInterestRate: 14.5,
    interestRateMin: 13.0,
    interestRateMax: 16.0,
    rateType: 'variable',
    maxFinancingPctPN: 90,
    minInitialPctPN: 10,
    maxFinancingPctPJ: 100,
    minInitialPctPJ: 0,
    financingText: 'Financia hasta 90% PN · 100% PJ (Inicial 10% / 0%)',
    minMonths: 12,
    maxMonths: 48,
    allowedMonths: [12, 18, 24, 36, 48],
    plazoText: 'Desde 12 hasta 48 Meses',
    flatFeePct: 0.5,
    flatFeeNotes: '0.5% Comisión flat bancaria',
    insuranceNotes: 'Póliza Preferencial',
    paymentCurrency: 'Bs Cargo en Cuenta',
    paymentMethodText: 'Bs Cargo en Cuenta (indexado a tasa oficial BCV)',
    earlyPaymentAllowed: true,
    earlyPaymentPenaltyText: 'Sin penalización',
    accountCondition: 'Movimientos Bancarios Clientes y No Clientes',
    bankAccountSeniorityYears: 2,
    observations: 'Mínimo 2 años de antigüedad en cuentas bancarias',
  },
  {
    id: 'banesco',
    name: 'BANESCO',
    shortName: 'BANESCO',
    tagline: 'Crédito Vehículo Cuota en Bs al BCV',
    type: 'banco',
    color: '#15803d', // Banesco Green
    lightBg: '#f0fdf4',
    borderColor: '#bbf7d0',
    interestRateText: '18% Anual (Variable)',
    annualInterestRate: 18.0,
    rateType: 'variable',
    maxFinancingPctPN: 70,
    minInitialPctPN: 30,
    financingText: 'Financia hasta 70% · Inicial mínima 30%',
    minMonths: 12,
    maxMonths: 36,
    allowedMonths: [12, 18, 24, 30, 36],
    plazoText: 'Desde 12 hasta 36 Meses',
    flatFeePct: 3.0,
    flatFeeNotes: '3.0% Comisión flat bancaria',
    insuranceNotes: 'Póliza Seguros Banesco',
    paymentCurrency: 'Bs Cargo en Cuenta',
    paymentMethodText: 'Bs Cargo en Cuenta (indexado a tasa oficial BCV)',
    earlyPaymentAllowed: true,
    earlyPaymentPenaltyText: 'Sin penalización',
    accountCondition: 'Movimientos Bancarios Cliente Banesco',
    bankAccountSeniorityYears: 2,
    observations: 'Mínimo 2 años de antigüedad en cuentas bancarias',
  },
];

// Lista Oficial de Precios Kia El Marqués — Vigencia Noviembre 2026
// Extraída de Lista_de_Precios_Kia_El_Marques_A4_Elegante.pdf
export interface KiaVehiclePriceItem {
  id: string;
  model: string;
  trim: string;
  fullName: string;
  category: 'Sedanes & Compactos Urbanos' | 'Gama SUVs & Crossovers' | 'Alta Gama & Todoterreno';
  priceUSD: number;
  engine: string;
  description: string;
}

export const KIA_OFFICIAL_PRICE_LIST: KiaVehiclePriceItem[] = [
  // SEDANES & COMPACTOS URBANOS
  {
    id: 'picanto-mt',
    model: 'Picanto',
    trim: '1.2 MT 4x2',
    fullName: 'Picanto 1.2 MT 4x2',
    category: 'Sedanes & Compactos Urbanos',
    priceUSD: 24000,
    engine: '1.2L MPI · Manual 5V · Tracción Delantera',
    description: 'Motor 1.2L MPI · Transmisión Manual 5V · Tracción Delantera · Pantalla Táctil',
  },
  {
    id: 'picanto-at',
    model: 'Picanto',
    trim: '1.2 AT 4x2',
    fullName: 'Picanto 1.2 AT 4x2',
    category: 'Sedanes & Compactos Urbanos',
    priceUSD: 26100,
    engine: '1.2L MPI · Automática · Tracción Delantera',
    description: 'Motor 1.2L MPI · Transmisión Automática · Manejo Urbano Ágil · Conectividad',
  },
  {
    id: 'soluto-mt',
    model: 'Soluto',
    trim: '1.4 MT',
    fullName: 'Soluto 1.4 MT',
    category: 'Sedanes & Compactos Urbanos',
    priceUSD: 23000,
    engine: '1.4L MPI · Manual 5V · Maletero 475L',
    description: 'Motor 1.4L MPI · Transmisión Manual 5V · Maletero 475 Litros · Aire Acondicionado',
  },
  {
    id: 'soluto-at',
    model: 'Soluto',
    trim: '1.4 AT 4x2',
    fullName: 'Soluto 1.4 AT 4x2',
    category: 'Sedanes & Compactos Urbanos',
    priceUSD: 27500,
    engine: '1.4L MPI · Automática · Cámara Reversa',
    description: 'Motor 1.4L MPI · Transmisión Automática · Gran Espacio Familiar · Cámara Reversa',
  },

  // GAMA SUVS & CROSSOVERS
  {
    id: 'sonet-at',
    model: 'Sonet',
    trim: '1.5 AT 4x2',
    fullName: 'Sonet 1.5 AT 4x2',
    category: 'Gama SUVs & Crossovers',
    priceUSD: 34500,
    engine: '1.5L Smartstream · Transmisión IVT',
    description: 'Motor 1.5L Smartstream · Transmisión IVT · 6 Airbags · Rieles de Techo',
  },
  {
    id: 'seltos-15-at',
    model: 'Seltos',
    trim: '1.5 AT 4x2',
    fullName: 'Seltos 1.5 AT 4x2',
    category: 'Gama SUVs & Crossovers',
    priceUSD: 41000,
    engine: '1.5L · Automática · Pantalla Panorámica',
    description: 'Motor 1.5L · Transmisión Automática · Pantalla Panorámica · Conectividad Wireless',
  },
  {
    id: 'seltos-20-at',
    model: 'Seltos',
    trim: '2.0 AT 4x2',
    fullName: 'Seltos 2.0 AT 4x2',
    category: 'Gama SUVs & Crossovers',
    priceUSD: 43900,
    engine: '2.0L MPI · Automática · Rines 17"',
    description: 'Motor 2.0L MPI · Desempeño Superior · Asientos Confort · Rines de Lujo 17"',
  },
  {
    id: 'sportage-gt-at',
    model: 'Sportage',
    trim: 'GT 2.0 AT 4x2',
    fullName: 'Sportage GT 2.0 AT 4x2',
    category: 'Gama SUVs & Crossovers',
    priceUSD: 47900,
    engine: '2.0L · Línea Deportiva GT · Automática 6V',
    description: 'Motor 2.0L · Línea Deportiva GT · Transmisión Automática 6V · Iluminación Full LED',
  },
  {
    id: 'sportage-gtl-at',
    model: 'Sportage',
    trim: 'GTL 2.0 AT 4x2',
    fullName: 'Sportage GTL 2.0 AT 4x2',
    category: 'Gama SUVs & Crossovers',
    priceUSD: 56400,
    engine: '2.0L · GT Line Full Equipo · Techo Skyview',
    description: 'Motor 2.0L · GT Line Full Equipo · Techo Panorámico Skyview · Pantalla Curva',
  },
  {
    id: 'sorento-at',
    model: 'Sorento',
    trim: 'AT AWD (7 Pasajeros)',
    fullName: 'Sorento AT AWD (7 Pasajeros)',
    category: 'Gama SUVs & Crossovers',
    priceUSD: 76900,
    engine: 'SUV Premium 3 Filas · Tracción AWD',
    description: 'SUV Premium 3 Filas / 7 Pasajeros · Tracción Integral AWD · Máxima Seguridad',
  },

  // ALTA GAMA & TODOTERRENO
  {
    id: 'carnival-at',
    model: 'Carnival',
    trim: 'AT (8 Pasajeros)',
    fullName: 'Carnival AT (8 Pasajeros)',
    category: 'Alta Gama & Todoterreno',
    priceUSD: 76400,
    engine: 'Gran Turismo Familiar 8P · Lujo VIP',
    description: 'Gran Turismo Familiar 8 Pasajeros · Puertas Corredizas Eléctricas · Lujo VIP',
  },
  {
    id: 'tasman-4x2',
    model: 'Tasman',
    trim: '4x2 Turbo',
    fullName: 'Tasman 4x2 Turbo',
    category: 'Alta Gama & Todoterreno',
    priceUSD: 55900,
    engine: '2.5L Turbo · Chasis Alta Resistencia',
    description: 'Pick-Up Doble Cabina · Motor 2.5L Turbo · Chasis Alta Resistencia · Batea Espaciosa',
  },
  {
    id: 'tasman-4x4-lt',
    model: 'Tasman',
    trim: '4x4 LT Reductora',
    fullName: 'Tasman 4x4 LT Reductora',
    category: 'Alta Gama & Todoterreno',
    priceUSD: 61900,
    engine: '4x4 Doble Cabina · Arrastre 3.5T',
    description: 'Pick-Up 4x4 Doble Cabina · Caja Reductora 4WD · Arrastre 3.5T · Protección Inferior',
  },
  {
    id: 'tasman-4x4-xpro',
    model: 'Tasman',
    trim: '4x4 X-PRO Off-Road',
    fullName: 'Tasman 4x4 X-PRO Off-Road',
    category: 'Alta Gama & Todoterreno',
    priceUSD: 77500,
    engine: 'X-PRO · Bloqueo Diferencial · Despeje 252mm',
    description: 'Edición Off-Road Extrema · Bloqueo Diferencial · Despeje 252mm · Rines All-Terrain',
  },
];

// Precios referenciales base por modelo (compatibilidad con selectores rápidos)
export const KIA_REFERENCE_PRICES: { model: string; priceUSD: number; description: string }[] = [
  { model: 'Picanto', priceUSD: 24000, description: 'Desde $24,000 USD (1.2 MT) hasta $26,100 USD (1.2 AT)' },
  { model: 'Soluto', priceUSD: 23000, description: 'Desde $23,000 USD (1.4 MT) hasta $27,500 USD (1.4 AT)' },
  { model: 'Sonet', priceUSD: 34500, description: '$34,500 USD (1.5 AT 4x2 Smartstream IVT)' },
  { model: 'Seltos', priceUSD: 41000, description: 'Desde $41,000 USD (1.5 AT) hasta $43,900 USD (2.0 AT)' },
  { model: 'Sportage', priceUSD: 47900, description: 'Desde $47,900 USD (GT 2.0 AT) hasta $56,400 USD (GTL 2.0 AT)' },
  { model: 'Tasman', priceUSD: 55900, description: 'Desde $55,900 USD (4x2) hasta $77,500 USD (X-PRO Off-Road)' },
  { model: 'Sorento', priceUSD: 76900, description: '$76,900 USD (SUV Premium AWD 3 Filas / 7 Pasajeros)' },
  { model: 'Carnival', priceUSD: 76400, description: '$76,400 USD (Gran Turismo 8 Pasajeros Puertas Eléctricas)' },
];

/**
 * Cálculo de amortización tradicional (Sistema Francés, cuota fija mensual)
 * M = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
 */
export function calculateMonthlyPayment(principal: number, annualRatePct: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const monthlyRate = annualRatePct / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * (monthlyRate * factor)) / (factor - 1);
}

export interface FinancingSimulationResult {
  entity: FinancingEntity;
  vehiclePrice: number;
  initialPct: number;
  initialAmountUSD: number;
  financedAmountUSD: number;
  months: number;
  appliedMonths: number;
  wasMonthsAdjusted: boolean;
  wasInitialAdjusted: boolean;
  monthlyPaymentUSD: number;
  totalMonthlyPaymentsUSD: number;
  totalInterestUSD: number;
  flatFeeUSD: number;
  disbursementFeeUSD: number;
  legalExpensesUSD: number;
  totalInitialOutlayUSD: number; // Inicial + Comisiones + Gastos iniciales
  totalCostUSD: number; // Inicial + Cuotas + Comisiones
}

export function simulateFinancing(
  entity: FinancingEntity,
  vehiclePrice: number,
  desiredInitialPct: number,
  desiredMonths: number,
  buyerType: 'natural' | 'juridica' = 'natural'
): FinancingSimulationResult {
  // Ajustar inicial mínima según tipo de persona
  const minInitialPct =
    buyerType === 'juridica' && entity.minInitialPctPJ !== undefined
      ? entity.minInitialPctPJ
      : entity.minInitialPctPN;

  const wasInitialAdjusted = desiredInitialPct < minInitialPct;
  const initialPct = Math.max(desiredInitialPct, minInitialPct);

  // Ajustar plazo según lo permitido por la entidad
  let appliedMonths = desiredMonths;
  let wasMonthsAdjusted = false;

  if (desiredMonths < entity.minMonths) {
    appliedMonths = entity.minMonths;
    wasMonthsAdjusted = true;
  } else if (desiredMonths > entity.maxMonths) {
    appliedMonths = entity.maxMonths;
    wasMonthsAdjusted = true;
  }

  // Si no está exactamente en allowedMonths, elegir el más cercano
  if (!entity.allowedMonths.includes(appliedMonths)) {
    appliedMonths = entity.allowedMonths.reduce((prev, curr) =>
      Math.abs(curr - desiredMonths) < Math.abs(prev - desiredMonths) ? curr : prev
    );
    wasMonthsAdjusted = true;
  }

  const initialAmountUSD = (vehiclePrice * initialPct) / 100;
  const financedAmountUSD = Math.max(0, vehiclePrice - initialAmountUSD);

  const monthlyPaymentUSD = calculateMonthlyPayment(
    financedAmountUSD,
    entity.annualInterestRate,
    appliedMonths
  );

  const totalMonthlyPaymentsUSD = monthlyPaymentUSD * appliedMonths;
  const totalInterestUSD = Math.max(0, totalMonthlyPaymentsUSD - financedAmountUSD);

  // Comisiones específicas por entidad
  let flatFeeUSD = (financedAmountUSD * entity.flatFeePct) / 100;
  if (entity.id === 'smf24') {
    // SMF24 cobra 5% a 18m y 6% a 24m
    const smfRate = appliedMonths > 18 ? 6.0 : 5.0;
    flatFeeUSD = (financedAmountUSD * smfRate) / 100;
  }

  const disbursementFeeUSD = entity.disbursementFeePct
    ? (financedAmountUSD * entity.disbursementFeePct) / 100
    : 0;

  const legalExpensesUSD = entity.legalExpensesFixedUSD || 0;

  const totalInitialOutlayUSD = initialAmountUSD + flatFeeUSD + disbursementFeeUSD + legalExpensesUSD;
  const totalCostUSD = totalInitialOutlayUSD + totalMonthlyPaymentsUSD;

  return {
    entity,
    vehiclePrice,
    initialPct,
    initialAmountUSD,
    financedAmountUSD,
    months: desiredMonths,
    appliedMonths,
    wasMonthsAdjusted,
    wasInitialAdjusted,
    monthlyPaymentUSD,
    totalMonthlyPaymentsUSD,
    totalInterestUSD,
    flatFeeUSD,
    disbursementFeeUSD,
    legalExpensesUSD,
    totalInitialOutlayUSD,
    totalCostUSD,
  };
}
