'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Calculator,
  Building2,
  DollarSign,
  Calendar,
  Percent,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Send,
  Table as TableIcon,
  Layers,
  ArrowRight,
  TrendingDown,
  Info,
  Car,
  Briefcase,
  User,
  ShieldCheck,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  FileSpreadsheet,
} from 'lucide-react';
import {
  FINANCING_ENTITIES,
  KIA_REFERENCE_PRICES,
  KIA_OFFICIAL_PRICE_LIST,
  KiaVehiclePriceItem,
  FinancingEntity,
  simulateFinancing,
  calculateMonthlyPayment,
  FinancingSimulationResult,
} from '@/data/financingOptions';

interface FinancingCalculatorViewProps {
  initialLead?: {
    fullName?: string;
    phone?: string;
    model?: string;
    buyerType?: 'natural' | 'juridica';
  } | null;
  onClearLead?: () => void;
}

export function FinancingCalculatorView({ initialLead, onClearLead }: FinancingCalculatorViewProps) {
  // Pestañas internas de la vista: 'comparador' | 'matriz' | 'amortizacion' | 'precios'
  const [subTab, setSubTab] = useState<'comparador' | 'matriz' | 'amortizacion' | 'precios'>('comparador');

  // Versión oficial de vehículo seleccionada de la lista oficial de precios
  const [selectedTrimId, setSelectedTrimId] = useState<string>(() => {
    if (initialLead?.model) {
      const match = KIA_OFFICIAL_PRICE_LIST.find((v) =>
        v.model.toLowerCase().includes(initialLead.model?.toLowerCase() || '') ||
        v.fullName.toLowerCase().includes(initialLead.model?.toLowerCase() || '')
      );
      if (match) return match.id;
    }
    return 'soluto-mt'; // Soluto 1.4 MT por defecto
  });

  // Objeto de vehículo activo
  const activeVehicle: KiaVehiclePriceItem = useMemo(() => {
    return KIA_OFFICIAL_PRICE_LIST.find((v) => v.id === selectedTrimId) || KIA_OFFICIAL_PRICE_LIST[2];
  }, [selectedTrimId]);

  // Modelo macro seleccionado (ej. 'Soluto', 'Sportage', 'Tasman')
  const [selectedMacroModel, setSelectedMacroModel] = useState<string>(activeVehicle.model);

  // Precio del vehículo (permite personalización si aplica descuento o accesorio)
  const [customPrice, setCustomPrice] = useState<number>(activeVehicle.priceUSD);

  // Parámetros de simulación
  const [downPaymentPct, setDownPaymentPct] = useState<number>(30); // 30% inicial estándar
  const [selectedMonths, setSelectedMonths] = useState<number>(24); // 24 meses estándar
  const [buyerType, setBuyerType] = useState<'natural' | 'juridica'>('natural');
  const [bcvRate, setBcvRate] = useState<number>(54.5); // Tasa BCV referencial (Bs/$)
  const [clientName, setClientName] = useState<string>(initialLead?.fullName || '');
  const [clientPhone, setClientPhone] = useState<string>(initialLead?.phone || '');

  // Sincronizar automáticamente cuando cambie el prospecto seleccionado desde otra pestaña
  useEffect(() => {
    if (initialLead) {
      if (initialLead.fullName !== undefined) setClientName(initialLead.fullName || '');
      if (initialLead.phone !== undefined) setClientPhone(initialLead.phone || '');
      if (initialLead.buyerType) setBuyerType(initialLead.buyerType);
      if (initialLead.model) {
        const match = KIA_OFFICIAL_PRICE_LIST.find((v) =>
          v.model.toLowerCase().includes(initialLead.model?.toLowerCase() || '') ||
          v.fullName.toLowerCase().includes(initialLead.model?.toLowerCase() || '')
        );
        if (match) {
          setSelectedTrimId(match.id);
          setSelectedMacroModel(match.model);
          setCustomPrice(match.priceUSD);
        }
      }
    }
  }, [initialLead]);

  // Entidad seleccionada para la tabla de amortización detallada
  const [selectedAmortEntityId, setSelectedAmortEntityId] = useState<string>('provincial');

  // Estado para feedback de copiado al portapapeles
  const [copiedEntityId, setCopiedEntityId] = useState<string | null>(null);

  // Manejar cambio de modelo macro (ej. hacer clic en el chip de "Sportage")
  const handleMacroModelChange = (modelName: string) => {
    setSelectedMacroModel(modelName);
    const firstTrim = KIA_OFFICIAL_PRICE_LIST.find((v) => v.model === modelName);
    if (firstTrim) {
      setSelectedTrimId(firstTrim.id);
      setCustomPrice(firstTrim.priceUSD);
    }
  };

  // Manejar cambio de versión/trim específico (ej. "GT Line 2.0" vs "GT 2.0")
  const handleTrimChange = (trimId: string) => {
    setSelectedTrimId(trimId);
    const trim = KIA_OFFICIAL_PRICE_LIST.find((v) => v.id === trimId);
    if (trim) {
      setSelectedMacroModel(trim.model);
      setCustomPrice(trim.priceUSD);
    }
  };

  // Trims disponibles para el modelo macro activo
  const availableTrimsForMacro = useMemo(() => {
    return KIA_OFFICIAL_PRICE_LIST.filter((v) => v.model === selectedMacroModel);
  }, [selectedMacroModel]);

  // Simulación para todas las 7 entidades en paralelo
  const simulationResults: FinancingSimulationResult[] = useMemo(() => {
    return FINANCING_ENTITIES.map((entity) =>
      simulateFinancing(entity, customPrice, downPaymentPct, selectedMonths, buyerType)
    );
  }, [customPrice, downPaymentPct, selectedMonths, buyerType]);

  // Entidad con menor cuota mensual
  const bestRateEntity = useMemo(() => {
    return [...simulationResults].sort((a, b) => a.monthlyPaymentUSD - b.monthlyPaymentUSD)[0];
  }, [simulationResults]);

  // Entidad para amortización detallada
  const activeAmortResult = useMemo(() => {
    return (
      simulationResults.find((r) => r.entity.id === selectedAmortEntityId) || simulationResults[0]
    );
  }, [simulationResults, selectedAmortEntityId]);

  // Generador de tabla de amortización mensual (Sistema Francés)
  const amortizationSchedule = useMemo(() => {
    if (!activeAmortResult) return [];
    const n = activeAmortResult.appliedMonths;
    const principal = activeAmortResult.financedAmountUSD;
    const monthlyRate = activeAmortResult.entity.annualInterestRate / 100 / 12;
    const payment = activeAmortResult.monthlyPaymentUSD;

    const rows = [];
    let currentBalance = principal;

    for (let month = 1; month <= n; month++) {
      const interestForMonth = currentBalance * monthlyRate;
      const principalForMonth = Math.min(currentBalance, payment - interestForMonth);
      const endingBalance = Math.max(0, currentBalance - principalForMonth);

      rows.push({
        month,
        beginningBalance: currentBalance,
        payment,
        principalPortion: principalForMonth,
        interestPortion: interestForMonth,
        endingBalance,
      });

      currentBalance = endingBalance;
    }
    return rows;
  }, [activeAmortResult]);

  // Generar texto de cotización comercial para WhatsApp de una entidad específica
  const generateWhatsAppQuote = (result: FinancingSimulationResult): string => {
    const e = result.entity;
    const formattedPrice = result.vehiclePrice.toLocaleString('en-US');
    const formattedInitial = result.initialAmountUSD.toLocaleString('en-US', { maximumFractionDigits: 0 });
    const formattedFinanced = result.financedAmountUSD.toLocaleString('en-US', { maximumFractionDigits: 0 });
    const formattedMonthly = result.monthlyPaymentUSD.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const formattedMonthlyBs = (result.monthlyPaymentUSD * bcvRate).toLocaleString('es-VE', {
      maximumFractionDigits: 0,
    });

    const isBsPayment = e.paymentCurrency.includes('Bs');

    let text = `🚗 *PROPUESTA DE FINANCIAMIENTO — KIA EL MARQUÉS*\n`;
    if (clientName) {
      text += `Estimado/a *${clientName}*,\n`;
    }
    text += `A continuación le compartimos los detalles de financiamiento para su *Kia ${activeVehicle.fullName} 0 km* a través de *${e.name}*:\n\n`;
    text += `🔹 *Vehículo:* Kia ${activeVehicle.fullName} 0 km\n`;
    text += `🔹 *Categoría:* ${activeVehicle.category}\n`;
    text += `🔹 *Precio Oficial:* $${formattedPrice} USD\n`;
    text += `🔹 *Inicial (${result.initialPct}%):* $${formattedInitial} USD\n`;
    text += `🔹 *Monto Financiado (${100 - result.initialPct}%):* $${formattedFinanced} USD\n`;
    text += `🔹 *Plazo:* ${result.appliedMonths} Meses\n`;
    text += `🔹 *Tasa de Interés:* ${e.interestRateText}\n\n`;
    text += `💳 *CUOTA MENSUAL ESTIMADA:*\n`;
    text += `👉 *$${formattedMonthly} USD / mes*\n`;
    if (isBsPayment) {
      text += `👉 *${formattedMonthlyBs} Bs / mes* (Cargo en cuenta indexado a tasa oficial BCV referencial: ${bcvRate} Bs/$)\n`;
    }
    text += `\n📋 *Condiciones de ${e.name}:*\n`;
    text += `• *Comisión Flat:* ${e.flatFeeNotes}\n`;
    if (result.legalExpensesUSD > 0) {
      text += `• *Gastos Legales:* $${result.legalExpensesUSD} USD\n`;
    }
    text += `• *Seguro:* ${e.insuranceNotes}\n`;
    text += `• *Modalidad de Pago:* ${e.paymentMethodText}\n`;
    text += `• *Pagos Anticipados:* ${e.earlyPaymentPenaltyText}\n`;
    text += `• *Requisitos:* ${e.observations}\n\n`;
    text += `📍 *Concesionario Kia El Marqués*\n`;
    text += `Av. Rómulo Gallegos (entre Santa Eduvigis y El Marqués), Caracas.\n`;
    text += `¿Le gustaría agendar su cita o iniciar la consignación de recaudos? Estamos a su entera orden.`;

    return text;
  };

  // Generar resumen consolidado de las 7 opciones para WhatsApp
  const generateFullSummaryWhatsApp = () => {
    let msg = `🚗 *COMPARATIVA DE FINANCIAMIENTO (7 ENTIDADES) — KIA EL MARQUÉS*\n`;
    if (clientName) msg += `Propuesta preparada para: *${clientName}*\n`;
    msg += `\n*Vehículo:* Kia ${activeVehicle.fullName} 0 km\n`;
    msg += `*Precio Oficial:* $${customPrice.toLocaleString('en-US')} USD\n`;
    msg += `*Plazo Base:* ${selectedMonths} Meses · *Inicial:* ${downPaymentPct}%\n\n`;
    msg += `📊 *CUOTAS MENSUALES ESTIMADAS (7 OPCIONES):*\n`;

    simulationResults.forEach((res, i) => {
      const e = res.entity;
      const isBs = e.paymentCurrency.includes('Bs');
      const bsNote = isBs ? ` (en Bs al BCV)` : ` ($ USD)`;
      msg += `\n${i + 1}. *${e.name}*: *$${res.monthlyPaymentUSD.toFixed(2)} USD/mes*${bsNote}\n`;
      msg += `   • Inicial requerida: ${res.initialPct}% ($${res.initialAmountUSD.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD)\n`;
      msg += `   • Plazo: ${res.appliedMonths}m · Tasa: ${e.interestRateText}\n`;
      msg += `   • Flat: ${e.flatFeePct}% · Anticipados: ${e.earlyPaymentPenaltyText}\n`;
    });

    msg += `\n📍 *Concesionario Kia El Marqués*, Caracas.\n¿Cuál de estas alternativas se ajusta mejor a su plan de compra?`;
    return msg;
  };

  const handleCopyQuote = (result: FinancingSimulationResult) => {
    const text = generateWhatsAppQuote(result);
    navigator.clipboard.writeText(text);
    setCopiedEntityId(result.entity.id);
    setTimeout(() => setCopiedEntityId(null), 2500);
  };

  const handleCopyFullSummary = () => {
    const text = generateFullSummaryWhatsApp();
    navigator.clipboard.writeText(text);
    setCopiedEntityId('summary_all');
    setTimeout(() => setCopiedEntityId(null), 2500);
  };

  const handleOpenWhatsApp = (result: FinancingSimulationResult) => {
    const text = generateWhatsAppQuote(result);
    const cleanPhone = clientPhone.replace(/\D/g, '');
    const phoneParam = cleanPhone.length >= 10 ? cleanPhone : '';
    const url = `https://wa.me/${phoneParam}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Banner / Info Bar de Lead activo si fue preseleccionado */}
      {initialLead && (
        <div
          style={{
            background: 'linear-gradient(90deg, #05141f 0%, #0c4a6e 100%)',
            borderRadius: '12px',
            padding: '14px 20px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            boxShadow: '0 4px 12px rgba(5,20,31,0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <User size={20} color="#38bdf8" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14.5px', fontWeight: 800 }}>
                  Cotizando para prospecto: {initialLead.fullName || 'Cliente'}
                </span>
                <span
                  style={{
                    fontSize: '10.5px',
                    padding: '2px 7px',
                    borderRadius: '5px',
                    background: '#38bdf8',
                    color: '#05141f',
                    fontWeight: 800,
                  }}
                >
                  PRE-CARGADO
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#bae6fd', marginTop: '2px' }}>
                Interés: <strong>{initialLead.model || activeVehicle.fullName}</strong> · Teléfono:{' '}
                <strong>{initialLead.phone || 'No especificado'}</strong>
              </div>
            </div>
          </div>

          {onClearLead && (
            <button
              type="button"
              onClick={onClearLead}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '6px',
                padding: '5px 12px',
                color: '#ffffff',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Limpiar Prospecto
            </button>
          )}
        </div>
      )}

      {/* Cabecera Principal con Selector de Sub-Pestañas */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '22px 26px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: '#05141f',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Calculator size={22} color="#38bdf8" />
              </div>
              <div>
                <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                  Calculadora y Comparador Oficial de Créditos
                </h1>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0 0' }}>
                  Matriz oficial de financiamiento de 7 entidades con la <strong>Lista Oficial de Precios Vigente (Noviembre 2026)</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Selector de Sub-Pestañas */}
          <div
            style={{
              display: 'inline-flex',
              background: '#f1f5f9',
              padding: '4px',
              borderRadius: '10px',
              gap: '4px',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              onClick={() => setSubTab('comparador')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '7px',
                border: 'none',
                background: subTab === 'comparador' ? '#05141f' : 'transparent',
                color: subTab === 'comparador' ? '#ffffff' : '#475569',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Layers size={14} />
              <span>Comparador de Cuotas</span>
            </button>

            <button
              type="button"
              onClick={() => setSubTab('precios')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '7px',
                border: 'none',
                background: subTab === 'precios' ? '#05141f' : 'transparent',
                color: subTab === 'precios' ? '#ffffff' : '#475569',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <FileSpreadsheet size={14} />
              <span>Lista de Precios Oficial (14 Versiones)</span>
            </button>

            <button
              type="button"
              onClick={() => setSubTab('matriz')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '7px',
                border: 'none',
                background: subTab === 'matriz' ? '#05141f' : 'transparent',
                color: subTab === 'matriz' ? '#ffffff' : '#475569',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <TableIcon size={14} />
              <span>Matriz Oficial (7 Entidades)</span>
            </button>

            <button
              type="button"
              onClick={() => setSubTab('amortizacion')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '7px',
                border: 'none',
                background: subTab === 'amortizacion' ? '#05141f' : 'transparent',
                color: subTab === 'amortizacion' ? '#ffffff' : '#475569',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Calendar size={14} />
              <span>Amortización Francesa</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BARRA SUPERIOR DE MODELOS KIA (1 CLIC PARA COTIZAR CUALQUIER MODELO)    */}
        {/* ========================================================================= */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              🚗 Modelos Kia Oficiales — Precios Actualizados Noviembre 2026 (Haz clic para cotizar):
            </span>
          </div>

          {/* Chips Macro de los 8 Modelos */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {KIA_REFERENCE_PRICES.map((m) => {
              const isSelected = selectedMacroModel.toLowerCase() === m.model.toLowerCase();
              return (
                <button
                  key={m.model}
                  type="button"
                  onClick={() => handleMacroModelChange(m.model)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #0284c7' : '1px solid #cbd5e1',
                    background: isSelected ? '#05141f' : '#ffffff',
                    color: isSelected ? '#ffffff' : '#0f172a',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 2px 8px rgba(2,132,199,0.25)' : 'none',
                  }}
                >
                  <span style={{ fontWeight: 800, fontSize: '13px' }}>{m.model}</span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: isSelected ? '#38bdf8' : '#0369a1',
                      background: isSelected ? 'rgba(56,189,248,0.15)' : '#e0f2fe',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    ${(m.priceUSD / 1000).toFixed(1)}k
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sub-Selector de Trims / Versiones Oficiales del Modelo Seleccionado */}
          {availableTrimsForMacro.length > 0 && (
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginRight: '4px' }}>
                Versión oficial:
              </span>
              {availableTrimsForMacro.map((trim) => {
                const isSelected = selectedTrimId === trim.id;
                return (
                  <button
                    key={trim.id}
                    type="button"
                    onClick={() => handleTrimChange(trim.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: isSelected ? '2px solid #0284c7' : '1px solid #cbd5e1',
                      background: isSelected ? '#e0f2fe' : '#ffffff',
                      color: isSelected ? '#0369a1' : '#334155',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>{trim.trim}</span>
                    <strong style={{ color: '#0f172a' }}>${trim.priceUSD.toLocaleString('en-US')}</strong>
                  </button>
                );
              })}
              <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#64748b' }}>
                {activeVehicle.engine}
              </div>
            </div>
          )}
        </div>

        {/* Panel de Controles Horizontales de Simulación */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          {/* Inicial Rápida */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                INICIAL: {downPaymentPct}%
              </span>
              <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#0369a1' }}>
                ${((customPrice * downPaymentPct) / 100).toLocaleString('en-US')} USD
              </span>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[10, 20, 30, 40, 50, 60].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setDownPaymentPct(pct)}
                  style={{
                    flex: 1,
                    padding: '6px 2px',
                    borderRadius: '6px',
                    border: downPaymentPct === pct ? '2px solid #0369a1' : '1px solid #cbd5e1',
                    background: downPaymentPct === pct ? '#0369a1' : '#ffffff',
                    color: downPaymentPct === pct ? '#ffffff' : '#334155',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Plazo Rápido */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                PLAZO: {selectedMonths} MESES
              </span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                {selectedMonths / 12} {selectedMonths === 12 ? 'año' : 'años'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[12, 18, 24, 36, 48].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedMonths(m)}
                  style={{
                    flex: 1,
                    padding: '6px 2px',
                    borderRadius: '6px',
                    border: selectedMonths === m ? '2px solid #05141f' : '1px solid #cbd5e1',
                    background: selectedMonths === m ? '#05141f' : '#ffffff',
                    color: selectedMonths === m ? '#ffffff' : '#334155',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>

          {/* Tipo de Persona */}
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              TIPO DE PERSONA
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                type="button"
                onClick={() => setBuyerType('natural')}
                style={{
                  flex: 1,
                  padding: '7px 4px',
                  borderRadius: '6px',
                  border: buyerType === 'natural' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                  background: buyerType === 'natural' ? '#e0f2fe' : '#ffffff',
                  color: buyerType === 'natural' ? '#0369a1' : '#475569',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Natural (PN)
              </button>
              <button
                type="button"
                onClick={() => setBuyerType('juridica')}
                style={{
                  flex: 1,
                  padding: '7px 4px',
                  borderRadius: '6px',
                  border: buyerType === 'juridica' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                  background: buyerType === 'juridica' ? '#e0f2fe' : '#ffffff',
                  color: buyerType === 'juridica' ? '#0369a1' : '#475569',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Jurídica (PJ)
              </button>
            </div>
          </div>

          {/* Precio y Tasa BCV */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                PRECIO / TASA BCV
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="number"
                value={customPrice}
                onChange={(e) => setCustomPrice(Math.max(1000, Number(e.target.value) || 0))}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  color: '#0f172a',
                }}
                title="Precio del vehículo en USD"
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input
                  type="number"
                  step={0.1}
                  value={bcvRate}
                  onChange={(e) => setBcvRate(Number(e.target.value) || 54.5)}
                  style={{
                    width: '65px',
                    padding: '6px 4px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    textAlign: 'right',
                  }}
                  title="Tasa oficial BCV referencial (Bs/$)"
                />
                <span style={{ fontSize: '11px', color: '#64748b' }}>Bs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Input Opcional para Personalizar WhatsApp */}
        <div
          style={{
            marginTop: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            fontSize: '12px',
            color: '#64748b',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#0284c7" />
            <span>Personalizar propuesta WhatsApp (opcional):</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Nombre del cliente"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', width: '180px' }}
            />
            <input
              type="tel"
              placeholder="Teléfono (ej. 04141234567)"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', width: '150px' }}
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-PESTAÑA 1: COMPARADOR DE CUOTAS (TARJETAS IDÉNTICAS AL DISEÑO MODAL)  */}
      {/* ========================================================================= */}
      {subTab === 'comparador' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Banner de Cuota Más Baja + Botón Copiar Resumen 7 Opciones */}
          <div
            style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '12px',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '16px' }}>🏆</span>
              <div>
                <span style={{ fontSize: '13.5px', color: '#065f46', fontWeight: 700 }}>
                  Cuota más baja: <strong>${bestRateEntity.monthlyPaymentUSD.toFixed(2)} USD/mes</strong> con{' '}
                  <strong>{bestRateEntity.entity.name}</strong> ({bestRateEntity.appliedMonths}m)
                </span>
                <span style={{ fontSize: '12px', color: '#047857', marginLeft: '6px' }}>
                  · Inicial ({bestRateEntity.initialPct}%): ${bestRateEntity.initialAmountUSD.toLocaleString('en-US')} USD
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyFullSummary}
              style={{
                background: '#059669',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 4px rgba(5,150,105,0.2)',
                transition: 'background 0.15s ease',
              }}
            >
              {copiedEntityId === 'summary_all' ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedEntityId === 'summary_all' ? '¡Resumen Copiado!' : 'Copiar Resumen 7 Opciones'}</span>
            </button>
          </div>

          {/* Grilla de las 7 Entidades (Diseño Ejecutivo Limpio) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {simulationResults.map((result) => {
              const e = result.entity;
              const isBest = e.id === bestRateEntity.entity.id;
              const isBs = e.paymentCurrency.includes('Bs');
              const monthlyBs = (result.monthlyPaymentUSD * bcvRate).toLocaleString('es-VE', { maximumFractionDigits: 0 });

              return (
                <div
                  key={e.id}
                  style={{
                    border: isBest ? '2px solid #059669' : '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '16px 20px',
                    background: isBest ? '#f0fdf4' : '#ffffff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px',
                    boxShadow: isBest ? '0 4px 12px rgba(5,150,105,0.08)' : '0 1px 3px rgba(0,0,0,0.03)',
                  }}
                >
                  {/* Datos Principales de la Entidad */}
                  <div style={{ flex: '1 1 320px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span
                        style={{
                          fontSize: '10.5px',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: e.type === 'banco' ? '#0f172a' : e.color,
                          color: '#ffffff',
                          textTransform: 'uppercase',
                        }}
                      >
                        {e.type}
                      </span>
                      <strong style={{ fontSize: '16px', color: '#0f172a', fontWeight: 900 }}>{e.name}</strong>
                      {isBest && (
                        <span
                          style={{
                            fontSize: '10.5px',
                            fontWeight: 800,
                            color: '#059669',
                            background: '#dcfce7',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            border: '1px solid #bbf7d0',
                          }}
                        >
                          MEJOR CUOTA
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                      <span>Tasa: <strong>{e.interestRateText}</strong></span>
                      <span>·</span>
                      <span>Plazo: <strong>{result.appliedMonths}m</strong></span>
                      <span>·</span>
                      <span>
                        Inicial ({result.initialPct}%): <strong>${result.initialAmountUSD.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD</strong>
                      </span>
                      <span>·</span>
                      <span>Financiado: <strong>${result.financedAmountUSD.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD</strong></span>
                    </div>

                    <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '5px' }}>
                      <span>{e.flatFeeNotes}</span> · <span>{e.paymentMethodText}</span>
                      {e.earlyPaymentPenaltyText && <span> · Anticipados: {e.earlyPaymentPenaltyText}</span>}
                    </div>

                    {result.wasInitialAdjusted && (
                      <div style={{ fontSize: '11px', color: '#b45309', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AlertCircle size={12} style={{ flexShrink: 0 }} />
                        <span>Inicial ajustada al mínimo exigido por {e.shortName} ({result.initialPct}%).</span>
                      </div>
                    )}
                  </div>

                  {/* Cuota en USD/Bs y Botones Comerciales */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'right', minWidth: '130px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 900, color: e.color, letterSpacing: '-0.5px' }}>
                        ${result.monthlyPaymentUSD.toFixed(2)}{' '}
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>USD/mes</span>
                      </div>
                      {isBs && (
                        <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#15803d', marginTop: '2px' }}>
                          ≈ Bs. {monthlyBs} / mes (BCV)
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleCopyQuote(result)}
                        style={{
                          padding: '9px 14px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          background: copiedEntityId === e.id ? '#ecfdf5' : '#ffffff',
                          color: copiedEntityId === e.id ? '#059669' : '#334155',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.15s ease',
                        }}
                        title="Copiar texto de cotización para WhatsApp"
                      >
                        {copiedEntityId === e.id ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copiedEntityId === e.id ? '¡Copiado!' : 'Copiar'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenWhatsApp(result)}
                        style={{
                          padding: '9px 14px',
                          borderRadius: '8px',
                          border: 'none',
                          background: '#25D366',
                          color: '#ffffff',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 4px rgba(37,211,102,0.2)',
                          transition: 'background 0.15s ease',
                        }}
                        title="Abrir WhatsApp con esta cotización lista"
                      >
                        <Send size={14} />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-PESTAÑA 2: LISTA OFICIAL DE PRECIOS VIGENTE (NOVIEMBRE 2026 - PDF)   */}
      {/* ========================================================================= */}
      {subTab === 'precios' && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '16px 22px',
              background: '#05141f',
              color: '#ffffff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                DOCUMENTO OFICIAL · KIA EL MARQUÉS
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 900, margin: '2px 0 0 0' }}>
                Lista de Precios Oficial — Gama Completa de Vehículos 0 Km
              </h2>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                Vigencia: Noviembre 2026 · Concesionario Oficial Caracas, Venezuela
              </span>
            </div>

            <span
              style={{
                fontSize: '11.5px',
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.1)',
                color: '#ffffff',
                fontWeight: 700,
              }}
            >
              14 Versiones Homologadas
            </span>
          </div>

          <div className="admin-table-scroll">
            <table className="admin-catalog-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '12px 18px', fontWeight: 800 }}>MODELO & VERSIÓN</th>
                  <th style={{ padding: '12px 16px', fontWeight: 800 }}>CATEGORÍA</th>
                  <th style={{ padding: '12px 16px', fontWeight: 800 }}>MOTORIZACIÓN & TRANSMISIÓN</th>
                  <th style={{ padding: '12px 18px', fontWeight: 800, textAlign: 'right' }}>PRECIO OFICIAL (USD)</th>
                  <th style={{ padding: '12px 18px', fontWeight: 800, textAlign: 'center' }}>ACCIÓN</th>
                </tr>
              </thead>
              <tbody>
                {KIA_OFFICIAL_PRICE_LIST.map((car, idx) => {
                  const isCurrent = car.id === selectedTrimId;
                  return (
                    <tr
                      key={car.id}
                      style={{
                        borderBottom: '1px solid #e2e8f0',
                        background: isCurrent ? '#f0f9ff' : idx % 2 === 0 ? '#ffffff' : '#fafafa',
                      }}
                    >
                      <td style={{ padding: '14px 18px', fontWeight: 800, color: '#0f172a' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '14px' }}>{car.model}</span>
                          <span
                            style={{
                              fontSize: '11px',
                              padding: '2px 7px',
                              borderRadius: '4px',
                              background: '#e2e8f0',
                              color: '#334155',
                              fontWeight: 700,
                            }}
                          >
                            {car.trim}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', fontWeight: 500 }}>
                          Garantía Oficial 5 Años o 100.000 km
                        </div>
                      </td>

                      <td style={{ padding: '14px 16px', color: '#475569', fontSize: '12px' }}>
                        {car.category}
                      </td>

                      <td style={{ padding: '14px 16px', color: '#334155', fontSize: '12px' }}>
                        {car.description}
                      </td>

                      <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 900, fontSize: '15px', color: '#0f172a' }}>
                        ${car.priceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => {
                            handleTrimChange(car.id);
                            setSubTab('comparador');
                          }}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            background: isCurrent ? '#0284c7' : '#05141f',
                            color: '#ffffff',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Calculator size={12} />
                          <span>{isCurrent ? 'Cotizando' : 'Cotizar'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-PESTAÑA 3: MATRIZ OFICIAL COMPLETA (DOCUMENTO 7x9 ORIGINAL)          */}
      {/* ========================================================================= */}
      {subTab === 'matriz' && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e2e8f0',
              background: '#05141f',
              color: '#ffffff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>
                MATRIZ COMPARATIVA OFICIAL DE CONDICIONES DE CRÉDITO
              </h2>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                9 aspectos evaluados en las 7 entidades autorizadas en Venezuela
              </span>
            </div>
            <span
              style={{
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.1)',
                color: '#ffffff',
                fontWeight: 700,
              }}
            >
              Documento Oficial del Concesionario
            </span>
          </div>

          <div className="admin-table-scroll">
            <table
              className="admin-financing-matrix-table"
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'center',
                fontSize: '12px',
              }}
            >
              <thead>
                <tr style={{ background: '#000000', color: '#ffffff' }}>
                  <th
                    style={{
                      padding: '14px 16px',
                      fontWeight: 800,
                      textAlign: 'left',
                      minWidth: '180px',
                      borderRight: '1px solid #334155',
                      fontSize: '11.5px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    ASPECTO EVALUADO
                  </th>
                  {FINANCING_ENTITIES.map((e) => (
                    <th
                      key={e.id}
                      style={{
                        padding: '14px 12px',
                        fontWeight: 900,
                        minWidth: '150px',
                        borderRight: '1px solid #334155',
                        fontSize: '12px',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {e.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* 1. TASA DE INTERÉS */}
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 800, textAlign: 'left', color: '#0f172a', borderRight: '1px solid #e2e8f0', background: '#f1f5f9' }}>
                    TASA DE INTERES
                  </td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>18% Anual</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>14-16% Anual Fija Según Monto</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>22% Anual</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>18%-21% Anual</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>18% anual</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontWeight: 700, color: '#0284c7', background: '#f0f9ff' }}>
                    13%-16% Anual (Variable)
                  </td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>18% Anual (Variable)</td>
                </tr>

                {/* 2. FINANCIAMIENTO MÁXIMO */}
                <tr style={{ background: '#ffffff', borderBottom: '1px solid #cbd5e1' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 800, textAlign: 'left', color: '#0f172a', borderRight: '1px solid #e2e8f0', background: '#f1f5f9' }}>
                    FINANCIAMIENTO MAXIMO
                  </td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0' }}>Financia 50%</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0' }}>Financia Hasta 70% Inicial Vehículos</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0' }}>Financia Hasta 60%</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0' }}>Financia Hasta 70%</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0' }}>Financia 50%</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontWeight: 700, color: '#0284c7', background: '#f0f9ff' }}>
                    <div>Financia Hasta 90% PN</div>
                    <div style={{ marginTop: '4px', color: '#0369a1', fontWeight: 800 }}>100% PJ</div>
                  </td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0' }}>Financia Hasta 70%</td>
                </tr>

                {/* 3. PLAZO DEL CRÉDITO */}
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 800, textAlign: 'left', color: '#0f172a', borderRight: '1px solid #e2e8f0', background: '#f1f5f9' }}>
                    PLAZO DEL CRÉDITO
                  </td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0' }}>Desde 24 Meses Hasta 36 Meses</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontWeight: 700, color: '#7c3aed' }}>Desde 12 Meses Hasta 48 Meses</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0' }}>Desde 6 Meses Hasta 36 Meses</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0' }}>Hasta 24 Meses</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0' }}>Hasta 24 meses</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontWeight: 700, color: '#0284c7', background: '#f0f9ff' }}>
                    Desde 12 Meses Hasta 48 Meses
                  </td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0' }}>Desde 12 Meses Hasta 36 Meses</td>
                </tr>

                {/* 4. COMISIÓN FLAT Y RECARGAS */}
                <tr style={{ background: '#ffffff', borderBottom: '1px solid #cbd5e1' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 800, textAlign: 'left', color: '#0f172a', borderRight: '1px solid #e2e8f0', background: '#f1f5f9' }}>
                    COMISIÓN FLAT Y RECARGAS
                  </td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0' }}>0,06 (6.0%)</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0' }}>
                    <div>5-6 %</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Administrativos 6-7% anual</div>
                  </td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0' }}>3.5%</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0' }}>
                    <div>5% 18 Meses</div>
                    <div style={{ marginTop: '2px' }}>6% 24 Meses</div>
                    <div style={{ marginTop: '2px', fontWeight: 700, color: '#d97706' }}>Gastos Legales 400$</div>
                  </td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0' }}>5% mas 3% desembolso</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontWeight: 800, color: '#059669', background: '#f0f9ff' }}>0.5%</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0' }}>3%</td>
                </tr>

                {/* 5. SEGUROS Y GARANTÍAS */}
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 800, textAlign: 'left', color: '#0f172a', borderRight: '1px solid #e2e8f0', background: '#f1f5f9' }}>
                    SEGUROS Y GARANTÍAS
                  </td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontSize: '11px' }}>
                    Póliza Todo Riesgo Seguros Venezuela 1er Año De Contado 2do Año Financiada
                  </td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontSize: '11.5px' }}>Póliza Vehículo + Vida + Gps</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontSize: '11.5px' }}>Póliza De Seguro + Fiador</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontSize: '11.5px' }}>Póliza Vehículo</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontSize: '11px' }}>Póliza Vehículo + Póliza de Vida Seguroamiga</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontSize: '11.5px', background: '#f0f9ff' }}>Póliza Preferencial</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontSize: '11.5px' }}>Póliza Seguros Banesco</td>
                </tr>

                {/* 6. PAGOS */}
                <tr style={{ background: '#ffffff', borderBottom: '1px solid #cbd5e1' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 800, textAlign: 'left', color: '#0f172a', borderRight: '1px solid #e2e8f0', background: '#f1f5f9' }}>
                    PAGOS
                  </td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>Pago Mensual $</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>Pago Mensual En $</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>Pago Mensual En $</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>Pago Mensual En $</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>Pago Mensual en $</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontWeight: 700, color: '#059669', background: '#f0f9ff' }}>
                    Bs Cargo En Cuenta
                  </td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontWeight: 700, color: '#15803d' }}>Bs Cargo En Cuenta</td>
                </tr>

                {/* 7. PAGOS ANTICIPADOS */}
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 800, textAlign: 'left', color: '#0f172a', borderRight: '1px solid #e2e8f0', background: '#f1f5f9' }}>
                    PAGOS ANTICIPADOS
                  </td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', color: '#b91c1c' }}>No</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', color: '#0369a1' }}>A Partir Mes 13</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontSize: '11px' }}>
                    <div>A Partir Mes 13</div>
                    <div style={{ color: '#b91c1c', marginTop: '2px' }}>(5% penalización sobre el monto otorgado)</div>
                  </td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', color: '#0369a1' }}>A Partir Mes 6</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', color: '#b91c1c' }}>No Permitido</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontWeight: 700, color: '#059669', background: '#f0f9ff' }}>Sin Penalización</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontWeight: 700, color: '#059669' }}>Sin Penalización</td>
                </tr>

                {/* 8. CONDICIÓN */}
                <tr style={{ background: '#ffffff', borderBottom: '1px solid #cbd5e1' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 800, textAlign: 'left', color: '#0f172a', borderRight: '1px solid #e2e8f0', background: '#f1f5f9' }}>
                    CONDICIÓN
                  </td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0' }}>Cuenta Moneda Extranjera</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0' }}>Cuenta Moneda Extranjera</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0' }}>Cuenta Moneda Extranjera</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0' }}>Cuenta En Moneda Extranjera</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0' }}>Cuenta Custidia Bancamiga</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontSize: '11px', background: '#f0f9ff' }}>
                    Movimientos Bancarios Clientes Y No Clientes
                  </td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontSize: '11px' }}>
                    Movimientos Bancarios Cliente Banesco
                  </td>
                </tr>

                {/* 9. OBSERVACIONES */}
                <tr style={{ background: '#f8fafc' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 800, textAlign: 'left', color: '#0f172a', borderRight: '1px solid #e2e8f0', background: '#f1f5f9' }}>
                    OBSERVACIONES
                  </td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>Cuenta $ BNC</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontSize: '11px' }}>Mínimo 2 años de antigüedad en cuentas Bancarias</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontSize: '11px' }}>Mínimo 2 años de antigüedad en cuentas Bancarias</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontSize: '11px' }}>Mínimo 2 años de antigüedad en cuentas bancarias</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontSize: '11px' }}>Mínimo 2 años de antigüedad en cuentas bancarias</td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontSize: '11px', background: '#f0f9ff' }}>
                    Mínimo 2 años de antigüedad en cuentas bancarias
                  </td>
                  <td style={{ padding: '12px 8px', borderRight: '1px solid #e2e8f0', fontSize: '11px' }}>Mínimo 2 años de antigüedad en cuentas Bancarias</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-PESTAÑA 4: TABLA DE AMORTIZACIÓN MENSUAL (SISTEMA FRANCÉS)            */}
      {/* ========================================================================= */}
      {subTab === 'amortizacion' && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            overflow: 'hidden',
          }}
        >
          {/* Selector de Entidad para Amortización */}
          <div
            style={{
              padding: '18px 22px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              background: '#f8fafc',
            }}
          >
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Calendario de Pagos Mensual — Sistema Francés
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
                Desglose cuota fija mensual, abono a capital e intereses mes a mes para <strong>{activeVehicle.fullName}</strong>
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Entidad a simular:</span>
              <select
                value={selectedAmortEntityId}
                onChange={(e) => setSelectedAmortEntityId(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#0f172a',
                  cursor: 'pointer',
                }}
              >
                {FINANCING_ENTITIES.map((ent) => (
                  <option key={ent.id} value={ent.id}>
                    {ent.name} ({ent.interestRateText})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Resumen del Préstamo Activo */}
          {activeAmortResult && (
            <div
              style={{
                padding: '16px 22px',
                borderBottom: '1px solid #e2e8f0',
                background: '#ffffff',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>MONTO FINANCIADO</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                  ${activeAmortResult.financedAmountUSD.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>CUOTA MENSUAL FIJA</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0369a1' }}>
                  ${activeAmortResult.monthlyPaymentUSD.toFixed(2)} USD
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>PLAZO EFECTIVO</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                  {activeAmortResult.appliedMonths} Meses
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>TOTAL INTERESES</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#d97706' }}>
                  ${activeAmortResult.totalInterestUSD.toFixed(0)} USD
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>COSTO TOTAL CRÉDITO</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#059669' }}>
                  ${activeAmortResult.totalCostUSD.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD
                </div>
              </div>
            </div>
          )}

          {/* Tabla de Amortización */}
          <div className="admin-table-scroll" style={{ maxHeight: '420px', overflowY: 'auto' }}>
            <table className="admin-amortization-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '12px' }}>
              <thead style={{ position: 'sticky', top: 0, background: '#05141f', color: '#ffffff', zIndex: 1 }}>
                <tr>
                  <th style={{ padding: '10px 14px', textAlign: 'center', width: '60px' }}>Mes #</th>
                  <th style={{ padding: '10px 14px' }}>Saldo Inicial</th>
                  <th style={{ padding: '10px 14px' }}>Cuota Fija</th>
                  <th style={{ padding: '10px 14px' }}>Capital</th>
                  <th style={{ padding: '10px 14px' }}>Interés</th>
                  <th style={{ padding: '10px 14px' }}>Saldo Final</th>
                </tr>
              </thead>
              <tbody>
                {amortizationSchedule.map((row) => (
                  <tr
                    key={row.month}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      background: row.month % 2 === 0 ? '#fafafa' : '#ffffff',
                    }}
                  >
                    <td style={{ padding: '9px 14px', textAlign: 'center', fontWeight: 700, color: '#64748b' }}>
                      {row.month}
                    </td>
                    <td style={{ padding: '9px 14px', color: '#475569' }}>
                      ${row.beginningBalance.toFixed(2)}
                    </td>
                    <td style={{ padding: '9px 14px', fontWeight: 800, color: '#0369a1' }}>
                      ${row.payment.toFixed(2)}
                    </td>
                    <td style={{ padding: '9px 14px', color: '#059669', fontWeight: 600 }}>
                      ${row.principalPortion.toFixed(2)}
                    </td>
                    <td style={{ padding: '9px 14px', color: '#d97706', fontWeight: 600 }}>
                      ${row.interestPortion.toFixed(2)}
                    </td>
                    <td style={{ padding: '9px 14px', fontWeight: 700, color: '#0f172a' }}>
                      ${row.endingBalance.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
