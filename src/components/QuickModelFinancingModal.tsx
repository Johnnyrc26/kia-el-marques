'use client';

import React, { useState, useMemo } from 'react';
import {
  X,
  Calculator,
  DollarSign,
  Calendar,
  Percent,
  Check,
  Copy,
  Send,
  Sparkles,
  AlertCircle,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import {
  FINANCING_ENTITIES,
  KIA_REFERENCE_PRICES,
  simulateFinancing,
  FinancingSimulationResult,
} from '@/data/financingOptions';

interface QuickModelFinancingModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelName: string;
  advisorName?: string;
  advisorPhone?: string;
  clientName?: string;
  clientPhone?: string;
}

export default function QuickModelFinancingModal({
  isOpen,
  onClose,
  modelName,
  advisorName,
  advisorPhone,
  clientName: initialClientName = '',
  clientPhone: initialClientPhone = '',
}: QuickModelFinancingModalProps) {
  const [activeModel, setActiveModel] = useState<string>(modelName);

  // Encontrar el precio base referencial para el modelo activo
  const matchedModel = useMemo(() => {
    return (
      KIA_REFERENCE_PRICES.find((m) =>
        m.model.toLowerCase().includes(activeModel.toLowerCase()) ||
        activeModel.toLowerCase().includes(m.model.toLowerCase())
      ) || KIA_REFERENCE_PRICES[0]
    );
  }, [activeModel]);

  const [priceUSD, setPriceUSD] = useState<number>(matchedModel.priceUSD);
  const [initialPct, setInitialPct] = useState<number>(30); // 30% por defecto
  const [termMonths, setTermMonths] = useState<number>(24); // 24 meses por defecto
  const [buyerType, setBuyerType] = useState<'natural' | 'juridica'>('natural');
  const [bcvRate] = useState<number>(54.5); // Tasa oficial referencial
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [clientInputName, setClientInputName] = useState<string>(initialClientName);

  // Sincronizar si cambia la prop
  React.useEffect(() => {
    setActiveModel(modelName);
  }, [modelName]);

  // Actualizar precio si cambia el modelo seleccionado
  React.useEffect(() => {
    setPriceUSD(matchedModel.priceUSD);
  }, [matchedModel]);

  // Simulación para las 7 entidades en simultáneo
  const simulationResults: FinancingSimulationResult[] = useMemo(() => {
    return FINANCING_ENTITIES.map((entity) =>
      simulateFinancing(entity, priceUSD, initialPct, termMonths, buyerType)
    );
  }, [priceUSD, initialPct, termMonths, buyerType]);

  // Entidad con menor cuota
  const bestResult = useMemo(() => {
    return [...simulationResults].sort((a, b) => a.monthlyPaymentUSD - b.monthlyPaymentUSD)[0];
  }, [simulationResults]);

  if (!isOpen) return null;

  // Generar texto para WhatsApp de una entidad específica
  const generateSingleEntityWhatsApp = (res: FinancingSimulationResult) => {
    const e = res.entity;
    const isBs = e.paymentCurrency.includes('Bs');
    const monthlyBs = (res.monthlyPaymentUSD * bcvRate).toLocaleString('es-VE', { maximumFractionDigits: 0 });

    let msg = `🚗 *PLAN DE FINANCIAMIENTO — KIA ${activeModel.toUpperCase()} 0 KM*\n`;
    if (advisorName) {
      msg += `Te atiende: *${advisorName}* (Kia El Marqués, Caracas)\n`;
    }
    if (clientInputName) {
      msg += `Propuesta para: *${clientInputName}*\n\n`;
    } else {
      msg += `\n`;
    }

    msg += `🔹 *Modelo:* Kia ${activeModel} 0 km\n`;
    msg += `🔹 *Precio:* $${res.vehiclePrice.toLocaleString('en-US')} USD\n`;
    msg += `🔹 *Inicial (${res.initialPct}%):* $${res.initialAmountUSD.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD\n`;
    msg += `🔹 *Monto Financiado:* $${res.financedAmountUSD.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD\n`;
    msg += `🔹 *Plazo:* ${res.appliedMonths} Meses\n\n`;

    msg += `🏦 *Entidad Financiadora:* *${e.name}*\n`;
    msg += `💳 *CUOTA MENSUAL ESTIMADA:*\n`;
    msg += `👉 *$${res.monthlyPaymentUSD.toFixed(2)} USD / mes*\n`;
    if (isBs) {
      msg += `👉 *${monthlyBs} Bs / mes* (Cargo en cuenta al BCV ref: ${bcvRate} Bs/$)\n`;
    }
    msg += `\n📋 *Condiciones:* ${e.flatFeeNotes} · ${e.insuranceNotes}\n`;
    msg += `⚡ *Pagos Anticipados:* ${e.earlyPaymentPenaltyText}\n`;
    msg += `📍 *Ubicación:* Concesionario Kia El Marqués, Av. Francisco de Miranda, Caracas.\n`;
    msg += `¿Deseas que te reservemos cita en el showroom para revisar recaudos?`;

    return msg;
  };

  // Generar resumen consolidado de las 7 opciones para WhatsApp
  const generateFullSummaryWhatsApp = () => {
    let msg = `🚗 *COMPARATIVA DE FINANCIAMIENTO — KIA ${activeModel.toUpperCase()} 0 KM*\n`;
    if (advisorName) msg += `Asesor: *${advisorName}* · Kia El Marqués\n`;
    if (clientInputName) msg += `Cliente: *${clientInputName}*\n`;
    msg += `\nPrecio: *$${priceUSD.toLocaleString('en-US')} USD* · Plazo base: *${termMonths} meses*\n\n`;
    msg += `📊 *CUOTAS MENSUALES ESTIMADAS (7 OPCIONES):*\n`;

    simulationResults.forEach((res, i) => {
      const e = res.entity;
      const isBs = e.paymentCurrency.includes('Bs');
      const bsText = isBs ? ` (en Bs al BCV)` : ` ($)`;
      msg += `\n${i + 1}. *${e.name}*: *$${res.monthlyPaymentUSD.toFixed(2)} USD/mes*${bsText}\n`;
      msg += `   • Inicial requerida: ${res.initialPct}% ($${res.initialAmountUSD.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD)\n`;
      msg += `   • Plazo: ${res.appliedMonths}m · Tasa: ${e.interestRateText}\n`;
    });

    msg += `\n📍 *Kia El Marqués, Caracas*\n¿Cuál de estas alternativas se ajusta mejor a tu presupuesto?`;
    return msg;
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSendWhatsApp = (text: string) => {
    const clean = initialClientPhone.replace(/\D/g, '');
    const url = `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 20, 31, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '18px',
          maxWidth: '720px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Modal */}
        <div
          style={{
            padding: '18px 24px',
            background: 'linear-gradient(135deg, #05141f 0%, #0f2942 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: '#38bdf8',
                  color: '#05141f',
                  textTransform: 'uppercase',
                }}
              >
                Financiamiento 0 km
              </span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                7 Entidades Oficiales
              </span>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 900, margin: '4px 0 0 0', letterSpacing: '-0.02em' }}>
              Kia {activeModel} — ${priceUSD.toLocaleString('en-US')} USD
            </h2>
            {advisorName && (
              <div style={{ fontSize: '12px', color: '#bae6fd', marginTop: '2px' }}>
                Asesor: <strong>{advisorName}</strong> · Kia El Marqués
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#ffffff',
              transition: 'background 0.15s',
            }}
            title="Cerrar ventana"
          >
            <X size={18} />
          </button>
        </div>

        {/* Barra de Selección Rápida de los 8 Modelos Kia */}
        <div
          style={{
            background: '#091e30',
            borderBottom: '1px solid #163854',
            padding: '10px 16px',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
          }}
        >
          {KIA_REFERENCE_PRICES.map((m) => {
            const isSel = m.model.toLowerCase() === activeModel.toLowerCase();
            return (
              <button
                key={m.model}
                type="button"
                onClick={() => {
                  setActiveModel(m.model);
                  setPriceUSD(m.priceUSD);
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: isSel ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.15)',
                  background: isSel ? '#0284c7' : 'rgba(255,255,255,0.06)',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                  flexShrink: 0,
                }}
              >
                <span>{m.model}</span>
                <span
                  style={{
                    fontSize: '10.5px',
                    color: isSel ? '#ffffff' : '#93c5fd',
                    fontWeight: 800,
                  }}
                >
                  ${(m.priceUSD / 1000).toFixed(1)}k
                </span>
              </button>
            );
          })}
        </div>

        {/* Barra de Ajuste Rápido de Parámetros */}
        <div
          style={{
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            padding: '14px 22px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
          }}
        >
          {/* Inicial Rápida */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                Inicial: {initialPct}%
              </span>
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#0369a1' }}>
                ${((priceUSD * initialPct) / 100).toLocaleString('en-US')} USD
              </span>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[10, 20, 30, 40, 50].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setInitialPct(pct)}
                  style={{
                    flex: 1,
                    padding: '6px 2px',
                    borderRadius: '6px',
                    border: initialPct === pct ? '2px solid #0369a1' : '1px solid #cbd5e1',
                    background: initialPct === pct ? '#0369a1' : '#ffffff',
                    color: initialPct === pct ? '#ffffff' : '#334155',
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                Plazo: {termMonths} Meses
              </span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                {termMonths / 12} {termMonths === 12 ? 'año' : 'años'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[12, 18, 24, 36, 48].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setTermMonths(m)}
                  style={{
                    flex: 1,
                    padding: '6px 2px',
                    borderRadius: '6px',
                    border: termMonths === m ? '2px solid #05141f' : '1px solid #cbd5e1',
                    background: termMonths === m ? '#05141f' : '#ffffff',
                    color: termMonths === m ? '#ffffff' : '#334155',
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

          {/* Tipo Persona */}
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Tipo de Persona
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                type="button"
                onClick={() => setBuyerType('natural')}
                style={{
                  flex: 1,
                  padding: '6px 4px',
                  borderRadius: '6px',
                  border: buyerType === 'natural' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                  background: buyerType === 'natural' ? '#e0f2fe' : '#ffffff',
                  color: buyerType === 'natural' ? '#0369a1' : '#475569',
                  fontSize: '11.5px',
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
                  padding: '6px 4px',
                  borderRadius: '6px',
                  border: buyerType === 'juridica' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                  background: buyerType === 'juridica' ? '#e0f2fe' : '#ffffff',
                  color: buyerType === 'juridica' ? '#0369a1' : '#475569',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Jurídica (PJ)
              </button>
            </div>
          </div>
        </div>

        {/* Banner Mejor Cuota */}
        <div
          style={{
            background: '#ecfdf5',
            borderBottom: '1px solid #a7f3d0',
            padding: '10px 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px' }}>🏆</span>
            <span style={{ fontSize: '12.5px', color: '#065f46', fontWeight: 600 }}>
              Cuota más baja: <strong>${bestResult.monthlyPaymentUSD.toFixed(2)} USD/mes</strong> con{' '}
              <strong>{bestResult.entity.name}</strong> ({bestResult.appliedMonths}m)
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleCopy(generateFullSummaryWhatsApp(), 'summary_all')}
            style={{
              background: '#059669',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              color: '#ffffff',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {copiedId === 'summary_all' ? <Check size={13} /> : <Copy size={13} />}
            <span>{copiedId === 'summary_all' ? '¡Copiado!' : 'Copiar Resumen 7 Opciones'}</span>
          </button>
        </div>

        {/* Lista de las 7 Entidades */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {simulationResults.map((result) => {
            const e = result.entity;
            const isBest = e.id === bestResult.entity.id;
            const isBs = e.paymentCurrency.includes('Bs');
            const monthlyBs = (result.monthlyPaymentUSD * bcvRate).toLocaleString('es-VE', { maximumFractionDigits: 0 });

            return (
              <div
                key={e.id}
                style={{
                  border: isBest ? '2px solid #059669' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  background: isBest ? '#f0fdf4' : '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                {/* Info Entidad */}
                <div style={{ flex: '1 1 260px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: '4px',
                        background: e.type === 'banco' ? '#0f172a' : e.color,
                        color: '#ffffff',
                        textTransform: 'uppercase',
                      }}
                    >
                      {e.type}
                    </span>
                    <strong style={{ fontSize: '14px', color: '#0f172a' }}>{e.name}</strong>
                    {isBest && (
                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#059669', background: '#dcfce7', padding: '1px 6px', borderRadius: '4px' }}>
                        MEJOR CUOTA
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '11.5px', color: '#64748b', display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                    <span>Tasa: <strong>{e.interestRateText}</strong></span>
                    <span>·</span>
                    <span>Plazo: <strong>{result.appliedMonths}m</strong></span>
                    <span>·</span>
                    <span>Inicial ({result.initialPct}%): <strong>${result.initialAmountUSD.toLocaleString('en-US', { maximumFractionDigits: 0 })}</strong></span>
                  </div>

                  <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>
                    <span>{e.flatFeeNotes}</span> · <span>{e.paymentMethodText}</span>
                  </div>
                </div>

                {/* Cifra Cuota y Botones */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '20px', fontWeight: 900, color: e.color }}>
                      ${result.monthlyPaymentUSD.toFixed(2)}{' '}
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>USD/mes</span>
                    </div>
                    {isBs && (
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#15803d' }}>
                        ≈ Bs. {monthlyBs} (BCV)
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => handleCopy(generateSingleEntityWhatsApp(result), e.id)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        background: copiedId === e.id ? '#ecfdf5' : '#ffffff',
                        color: copiedId === e.id ? '#059669' : '#334155',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      title="Copiar texto de cotización para WhatsApp"
                    >
                      {copiedId === e.id ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedId === e.id ? 'Copiado' : 'Copiar'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendWhatsApp(generateSingleEntityWhatsApp(result))}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#25D366',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      title="Abrir WhatsApp con esta cotización lista"
                    >
                      <Send size={13} />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Rápido con Enlace a la Matriz Completa */}
        <div
          style={{
            padding: '12px 22px',
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: '#64748b',
          }}
        >
          <span>Calculado bajo Sistema Francés de amortización fija</span>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
