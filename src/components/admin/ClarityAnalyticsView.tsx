'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Globe,
  RefreshCw,
  ExternalLink,
  Flame,
  Video,
  MousePointerClick,
  Smartphone,
  Monitor,
  AlertTriangle,
  ChevronRight,
  TrendingDown,
  Layers,
  Key,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Car,
  Filter,
  Users,
  Compass,
  ArrowRight,
  Share2,
  Sparkles,
  Gauge,
  Bug,
  ClipboardPaste,
  Check,
  X,
  FileText,
} from 'lucide-react';
import {
  OFFICIAL_CLARITY_BENCHMARK,
  ClarityOfficialDataset,
  parseClarityReportText,
} from '@/data/clarityBenchmark';

interface ClarityProps {
  data: any;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onSaveToken: (token: string) => void;
  token: string;
  onUpdateCustomReport?: (report: ClarityOfficialDataset) => void;
}

export function ClarityAnalyticsView({
  data,
  loading,
  error,
  onRefresh,
  onSaveToken,
  token,
  onUpdateCustomReport,
}: ClarityProps) {
  const [activeSubSection, setActiveSubSection] = useState<'paginas' | 'canales' | 'eventos' | 'rendimiento'>('paginas');
  const [funnelMode, setFunnelMode] = useState<'pasos' | 'diagnostico'>('pasos');

  // Estado del modal de pegado directo de Clarity
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [pasteSuccess, setPasteSuccess] = useState(false);
  const [localReport, setLocalReport] = useState<ClarityOfficialDataset | null>(null);

  // Cargar reporte personalizado previo desde localStorage si existe y está al día
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kia_clarity_custom_report_v6');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.summary && parsed.summary.totalSessions >= OFFICIAL_CLARITY_BENCHMARK.summary.totalSessions) {
            setLocalReport(parsed);
          } else {
            localStorage.removeItem('kia_clarity_custom_report_v4');
            localStorage.removeItem('kia_clarity_custom_report_v5');
            localStorage.removeItem('kia_clarity_custom_report_v6');
          }
        } else {
          localStorage.removeItem('kia_clarity_custom_report_v4');
          localStorage.removeItem('kia_clarity_custom_report_v5');
        }
      } catch {}
    }
  }, []);

  // Extraer el benchmark oficial o datos sincronizados de manera reactiva y dinámica
  const benchmark: ClarityOfficialDataset = useMemo(() => {
    if (localReport?.summary && localReport.summary.totalSessions >= OFFICIAL_CLARITY_BENCHMARK.summary.totalSessions) return localReport;
    if (data?.summary && data.summary.totalSessions >= OFFICIAL_CLARITY_BENCHMARK.summary.totalSessions) return data;
    if (data?.benchmark?.summary && data.benchmark.summary.totalSessions >= OFFICIAL_CLARITY_BENCHMARK.summary.totalSessions) return data.benchmark;
    if (Array.isArray(data)) {
      const b = data.find((m: any) => m.metricName === 'OfficialBenchmark')?.data;
      if (b?.summary && b.summary.totalSessions >= OFFICIAL_CLARITY_BENCHMARK.summary.totalSessions) return b;
    }
    return OFFICIAL_CLARITY_BENCHMARK;
  }, [localReport, data]);

  const summary = benchmark.summary;

  // Sesiones reales garantizadas
  const sessionTotal = summary.totalSessions;
  const botSessionsExcluded = summary.botSessionsExcluded;
  const uniqueUsers = summary.uniqueUsers;
  const newUsers = summary.newUsers;
  const newUsersPct = summary.newUsersPct;
  const recurringUsers = summary.recurringUsers;
  const activeUsersNow = summary.activeUsersNow;
  const deadClicksCount = summary.deadClicksCount;
  const deadClicksPct = `${summary.deadClicksPct.toString().replace('.', ',')}%`;
  const rageClicksCount = summary.rageClicksCount;
  const quickbacksCount = summary.quickbacksCount;
  const avgActiveTime = `${summary.activeTimeSec} s`;
  const totalTime = `${summary.totalTimeSec} s`;
  const scrollDepth = `${summary.scrollDepthPct.toString().replace('.', ',')}%`;
  const pagesPerSession = summary.pagesPerSession.toString().replace('.', ',');

  // Distribución real de modelos y páginas
  const pagesList = benchmark.topPages;
  const referrersList = benchmark.referrers;
  const browsersList = benchmark.browsers;
  const smartEventsList = benchmark.smartEvents;
  const coreWebVitals = benchmark.coreWebVitals;
  const jsErrors = benchmark.javascriptErrors;

  // Manejar el parseo y guardado del reporte pegado
  const handleApplyPastedReport = () => {
    if (!pastedText.trim()) return;
    const parsed = parseClarityReportText(pastedText, benchmark);
    setLocalReport(parsed);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('kia_clarity_custom_report_v6', JSON.stringify(parsed));
      } catch {}
    }
    onUpdateCustomReport?.(parsed);
    setPasteSuccess(true);
    setTimeout(() => {
      setPasteSuccess(false);
      setShowPasteModal(false);
      setPastedText('');
    }, 1200);
  };

  return (
    <div>
      {/* Header Bar con Estado en Vivo */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '22px 26px',
          border: '1px solid #e2e8f0',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <span
              style={{
                background: '#e0f2fe',
                color: '#0369a1',
                fontSize: '11px',
                fontWeight: 800,
                padding: '2px 9px',
                borderRadius: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Globe size={12} />
              Microsoft Clarity Oficial
            </span>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
              Proyecto ID: <strong>zfjnef6hsi</strong>
            </span>
            <span
              style={{
                fontSize: '11.5px',
                background: '#ecfdf5',
                color: '#059669',
                border: '1px solid #a7f3d0',
                fontWeight: 700,
                padding: '2px 9px',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              <strong>{activeUsersNow} Usuarios Activos Ahora</strong> (&lt; 1 min)
            </span>
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Tráfico Web, UX & Comportamiento (Microsoft Clarity)
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0', maxWidth: '780px', lineHeight: 1.4 }}>
            Métricas oficiales sincronizadas: <strong>{sessionTotal.toLocaleString()} sesiones</strong> totales, <strong>{uniqueUsers.toLocaleString()} usuarios únicos</strong>, y <strong>{botSessionsExcluded} sesiones de bot excluidas</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Botón Sincronizar / Pegar Reporte Rápido */}
          <button
            type="button"
            onClick={() => setShowPasteModal(true)}
            style={{
              padding: '8px 14px',
              fontSize: '12.5px',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#f0f9ff',
              border: '1.5px solid #0284c7',
              color: '#0369a1',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(2,132,199,0.1)',
              transition: 'all 0.15s ease',
            }}
            title="Pega el texto copiado de tu panel de Microsoft Clarity para actualizar al instante todas las métricas"
          >
            <ClipboardPaste size={15} color="#0284c7" />
            <span>📋 Pegar Reporte en Vivo</span>
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="btn btn-outline"
            style={{
              padding: '8px 14px',
              fontSize: '12.5px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Sincronizando...' : 'Refrescar'}</span>
          </button>

          <a
            href="https://clarity.microsoft.com/projects/view/zfjnef6hsi/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{
              padding: '8px 16px',
              fontSize: '12.5px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Clarity Dashboard ↗</span>
          </a>

          <a
            href="https://clarity.microsoft.com/projects/view/zfjnef6hsi/recordings"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{
              padding: '8px 14px',
              fontSize: '12.5px',
              fontWeight: 700,
              color: '#7e22ce',
              borderColor: '#e9d5ff',
              background: '#faf5ff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Video size={14} />
            <span>Grabaciones ↗</span>
          </a>
        </div>
      </div>

      {/* 4 Tarjetas Principales de Resumen Clarity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', marginBottom: '22px' }}>
        {/* KPI 1: Sesiones */}
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.04em' }}>
                Sesiones Totales
              </span>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginTop: '2px', fontFamily: 'monospace' }}>
                {sessionTotal.toLocaleString()}
              </div>
            </div>
            <div style={{ padding: '8px', background: '#e0f2fe', borderRadius: '8px', color: '#0369a1' }}>
              <Globe size={18} />
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#0369a1', marginTop: '8px', fontWeight: 600 }}>
            {botSessionsExcluded} sesiones de bot excluidas · {pagesPerSession} págs/sesión
          </div>
        </div>

        {/* KPI 2: Usuarios Únicos */}
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.04em' }}>
                Usuarios Únicos
              </span>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginTop: '2px', fontFamily: 'monospace' }}>
                {uniqueUsers.toLocaleString()}
              </div>
            </div>
            <div style={{ padding: '8px', background: '#eff6ff', borderRadius: '8px', color: '#2563eb' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#2563eb', marginTop: '8px', fontWeight: 600 }}>
            {newUsersPct}% Nuevos ({newUsers}) · {recurringUsers} Recurrentes
          </div>
        </div>

        {/* KPI 3: Clics Fallidos (Dead Clicks) */}
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.04em' }}>
                Clics Fallidos (Dead Clicks)
              </span>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#b91c1c', marginTop: '2px', fontFamily: 'monospace' }}>
                {deadClicksPct}
              </div>
            </div>
            <div style={{ padding: '8px', background: '#fef2f2', borderRadius: '8px', color: '#dc2626' }}>
              <MousePointerClick size={18} />
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '8px', fontWeight: 600 }}>
            {deadClicksCount} sesiones afectadas · {rageClicksCount} clics de rabia
          </div>
        </div>

        {/* KPI 4: Tiempo & Desplazamiento */}
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.04em' }}>
                Tiempo Activo & Scroll
              </span>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginTop: '2px', fontFamily: 'monospace' }}>
                {avgActiveTime}
              </div>
            </div>
            <div style={{ padding: '8px', background: '#f0fdf4', borderRadius: '8px', color: '#16a34a' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '8px', fontWeight: 600 }}>
            {totalTime} tiempo total · {scrollDepth} profundidad scroll
          </div>
        </div>
      </div>

      {/* Sub-navegación interna de la sección Clarity */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '2px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setActiveSubSection('paginas')}
          style={{
            padding: '9px 18px',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            background: activeSubSection === 'paginas' ? '#05141f' : 'transparent',
            color: activeSubSection === 'paginas' ? '#ffffff' : '#64748b',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
          }}
        >
          <Car size={15} />
          <span>Páginas & Modelos ({pagesList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubSection('canales')}
          style={{
            padding: '9px 18px',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            background: activeSubSection === 'canales' ? '#05141f' : 'transparent',
            color: activeSubSection === 'canales' ? '#ffffff' : '#64748b',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
          }}
        >
          <Share2 size={15} />
          <span>Orígenes & Navegadores</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubSection('eventos')}
          style={{
            padding: '9px 18px',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            background: activeSubSection === 'eventos' ? '#05141f' : 'transparent',
            color: activeSubSection === 'eventos' ? '#ffffff' : '#64748b',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
          }}
        >
          <Layers size={15} />
          <span>Eventos Inteligentes & Embudo ({smartEventsList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubSection('rendimiento')}
          style={{
            padding: '9px 18px',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            background: activeSubSection === 'rendimiento' ? '#05141f' : 'transparent',
            color: activeSubSection === 'rendimiento' ? '#ffffff' : '#64748b',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
          }}
        >
          <Gauge size={15} />
          <span>Rendimiento Web & Errores JS</span>
        </button>
      </div>

      {/* SUB-SECCIÓN 1: PÁGINAS Y MODELOS MÁS VISITADOS */}
      {activeSubSection === 'paginas' && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Distribución de Tráfico por Ficha Técnica y Landing Page
              </h3>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Datos oficiales de Clarity: <strong>Tasman lidera con {pagesList[0]?.sessions.toLocaleString()} visitas ({pagesList[0]?.pct}%)</strong> tras el lanzamiento publicitario, seguido de Soluto ({pagesList[1]?.sessions.toLocaleString()} visitas).
              </span>
            </div>
          </div>

          <div className="admin-table-scroll">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px' }}>
                  <th style={{ padding: '12px 14px' }}>Página / Modelo</th>
                  <th style={{ padding: '12px 14px' }}>Sesiones</th>
                  <th style={{ padding: '12px 14px' }}>% Tráfico</th>
                  <th style={{ padding: '12px 14px' }}>Móvil</th>
                  <th style={{ padding: '12px 14px' }}>Clics Fallidos</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Mapa de Calor</th>
                </tr>
              </thead>
              <tbody>
                {pagesList.map((p, idx) => (
                  <tr key={p.path} style={{ borderBottom: '1px solid #f1f5f9', background: idx === 0 ? '#f0fdf4' : idx === 1 ? '#f8fafc' : '#ffffff' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '13.5px' }}>
                          {p.name}
                        </span>
                        {idx === 0 && (
                          <span style={{ background: '#dcfce7', color: '#166534', fontSize: '10px', fontWeight: 800, padding: '2px 7px', borderRadius: '10px' }}>
                            Top #1 Tráfico
                          </span>
                        )}
                        {idx === 1 && (
                          <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '10px', fontWeight: 800, padding: '2px 7px', borderRadius: '10px' }}>
                            Top #2 Tráfico
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '11.5px', color: '#64748b', fontFamily: 'monospace' }}>
                        {p.path}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 800, fontFamily: 'monospace', fontSize: '14px', color: '#0f172a' }}>
                      {p.sessions.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '90px', height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${Math.min(p.pct, 100)}%`,
                              height: '100%',
                              background: idx === 0 ? '#10b981' : idx === 1 ? '#0284c7' : '#94a3b8',
                            }}
                          />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '12.5px', color: '#334155' }}>
                          {p.pct}%
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#475569', fontWeight: 600 }}>
                      {p.mobilePct ? `${p.mobilePct}%` : '100%'}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {p.deadClicks && p.deadClicks > 0 ? (
                        <span style={{ color: '#dc2626', fontWeight: 700, background: '#fef2f2', padding: '2px 8px', borderRadius: '6px', fontSize: '11.5px' }}>
                          {p.deadClicks} clics
                        </span>
                      ) : (
                        <span style={{ color: '#16a34a', fontSize: '11.5px', fontWeight: 700 }}>
                          ✓ 0
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <a
                        href={`https://clarity.microsoft.com/projects/view/zfjnef6hsi/heatmaps?filter=page_url_eq_${encodeURIComponent('https://kiaelmarques.com' + p.path)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '12px',
                          color: '#0284c7',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: '#f0f9ff',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          border: '1px solid #bae6fd',
                        }}
                      >
                        <Flame size={12} color="#ea580c" />
                        <span>Ver Heatmap ↗</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-SECCIÓN 2: CANALES DE ADQUISICIÓN Y NAVEGADORES */}
      {activeSubSection === 'canales' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '20px' }}>
          {/* Tarjeta de Orígenes de Referencia */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ padding: '6px', background: '#fae8ff', color: '#a21caf', borderRadius: '6px' }}>
                <Share2 size={16} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Origen de Referencia (Referrers)
                </h3>
                <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                  De dónde llegan los prospectos a la web
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {referrersList.map((ref) => (
                <div
                  key={ref.source}
                  style={{
                    background: '#f8fafc',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>{ref.source}</strong>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                      {ref.sessions.toLocaleString()} sesiones
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#a21caf', fontFamily: 'monospace' }}>
                      {ref.pct}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tarjeta de Navegadores y Entornos */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ padding: '6px', background: '#eff6ff', color: '#2563eb', borderRadius: '6px' }}>
                <Smartphone size={16} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Navegadores & Sistemas
                </h3>
                <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                  El 98.6% abre la web en el navegador interno de Instagram
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {browsersList.map((b) => (
                <div
                  key={b.name}
                  style={{
                    background: '#f8fafc',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>{b.name}</strong>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                      {b.sessions.toLocaleString()} sesiones
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#2563eb', fontFamily: 'monospace' }}>
                      {b.pct}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '16px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px' }}>
              <strong style={{ fontSize: '12px', color: '#1e40af', display: 'block', marginBottom: '3px' }}>
                💡 Implicación Clave de Diseño:
              </strong>
              <p style={{ fontSize: '11.5px', color: '#1e3a8a', margin: 0, lineHeight: 1.45 }}>
                Dado que casi todo el tráfico navega dentro del WebView de Instagram, la experiencia móvil con teclado flotante, validación de inputs y botones de WhatsApp directo debe ser sumamente rápida y sin saltos visuales.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECCIÓN 3: EVENTOS INTELIGENTES Y EMBUDO */}
      {activeSubSection === 'eventos' && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Eventos Inteligentes de Conversión (Smart Events)
              </h3>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Monitoreo exacto de las acciones registradas en el Cuestionario / Quiz de Kia El Marqués
              </span>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setFunnelMode('pasos')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: funnelMode === 'pasos' ? '#0f172a' : '#fff',
                  color: funnelMode === 'pasos' ? '#fff' : '#475569',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Lista de Eventos
              </button>
              <button
                type="button"
                onClick={() => setFunnelMode('diagnostico')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: funnelMode === 'diagnostico' ? '#0f172a' : '#fff',
                  color: funnelMode === 'diagnostico' ? '#fff' : '#475569',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Diagnóstico de Fricción
              </button>
            </div>
          </div>

          {funnelMode === 'pasos' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {smartEventsList.map((ev, idx) => (
                <div
                  key={ev.tag}
                  style={{
                    background: ev.alert ? '#fef2f2' : ev.success ? '#f0fdf4' : '#f8fafc',
                    border: `1px solid ${ev.alert ? '#fecaca' : ev.success ? '#bbf7d0' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    padding: '12px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: ev.alert ? '#dc2626' : ev.success ? '#16a34a' : '#05141f',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>{ev.name}</strong>
                      <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '8px', fontFamily: 'monospace' }}>
                        [{ev.tag}]
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {ev.alert && (
                      <span style={{ fontSize: '11px', background: '#fee2e2', color: '#dc2626', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                        ¡Fricción Detectada!
                      </span>
                    )}
                    {ev.success && (
                      <span style={{ fontSize: '11px', background: '#dcfce7', color: '#166534', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                        Conversión Lead
                      </span>
                    )}
                    <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>
                      {ev.sessions} sesiones
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {funnelMode === 'diagnostico' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '16px' }}>
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#991b1b', marginBottom: '8px' }}>
                  <AlertTriangle size={18} />
                  <strong style={{ fontSize: '14.5px' }}>Alerta: 35 Errores de Validación de Teléfono</strong>
                </div>
                <p style={{ fontSize: '12.5px', color: '#7f1d1d', lineHeight: 1.5, margin: 0 }}>
                  Clarity registró que <strong>35 usuarios</strong> intentaron enviar el formulario pero fallaron por el formato del número telefónico. Al estar en Venezuela, muchos usuarios escriben <code>0414...</code>, <code>0424...</code> o <code>+58</code> y si la validación es estricta o confusa, genera rechazo.
                </p>
                <div style={{ marginTop: '12px', background: '#ffffff', padding: '10px', borderRadius: '6px', border: '1px solid #fca5a5', fontSize: '12px', color: '#991b1b', fontWeight: 700 }}>
                  ✓ Estado Actual: El formateador inteligente de WhatsApp en el código ya limpia y estandariza los prefijos automáticamente.
                </div>
              </div>

              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', marginBottom: '8px' }}>
                  <CheckCircle2 size={18} />
                  <strong style={{ fontSize: '14.5px' }}>18 Cotizaciones Completadas Directas</strong>
                </div>
                <p style={{ fontSize: '12.5px', color: '#14532d', lineHeight: 1.5, margin: 0 }}>
                  De los 53 usuarios que inician el cuestionario, <strong>18 completan exitosamente</strong> y saltan a WhatsApp con su asesor asignado. Esto representa una <strong>tasa de conversión del 34% en el quiz</strong>, muy superior al 2%-3% de formularios estáticos convencionales.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-SECCIÓN 4: RENDIMIENTO Y ERRORES JS */}
      {activeSubSection === 'rendimiento' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '20px' }}>
          {/* Core Web Vitals */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ padding: '6px', background: '#fef3c7', color: '#d97706', borderRadius: '6px' }}>
                <Gauge size={16} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Rendimiento de URL (Clarity CWV)
                </h3>
                <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                  Puntuación global: <strong>{coreWebVitals.score}/100</strong> (60 páginas vistas evaluadas)
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '12.5px', color: '#0f172a' }}>LCP (Pintura de Contenido Grande):</strong>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#dc2626' }}>{coreWebVitals.lcp} (Pobre)</span>
                </div>
                <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                  Las imágenes de los vehículos tardan en cargar en conexiones móviles locales.
                </span>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '12.5px', color: '#0f172a' }}>INP (Interacción con Próxima Pintura):</strong>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#d97706' }}>{coreWebVitals.inp} (Mejora)</span>
                </div>
                <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                  Respuesta táctil al cambiar de paso en el quiz.
                </span>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '12.5px', color: '#0f172a' }}>CLS (Desplazamiento Acumulativo):</strong>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#dc2626' }}>{coreWebVitals.cls} (Pobre)</span>
                </div>
                <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                  Ajustes en altura de sliders e imágenes al cargar en mobile.
                </span>
              </div>
            </div>
          </div>

          {/* Errores JS */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ padding: '6px', background: '#fee2e2', color: '#dc2626', borderRadius: '6px' }}>
                <Bug size={16} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Errores de JavaScript Detectados
                </h3>
                <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                  Tasa de error mínima: <strong>{jsErrors.ratePct}%</strong> ({jsErrors.recordingsCount} grabaciones)
                </span>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#dc2626', fontWeight: 800, letterSpacing: '0.04em' }}>
                Error #1 (100% de los errores):
              </span>
              <pre style={{ fontSize: '11.5px', color: '#0f172a', margin: '6px 0', fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {jsErrors.topError}
              </pre>
              <div style={{ fontSize: '11.5px', color: '#16a34a', fontWeight: 700, marginTop: '6px' }}>
                ✓ Diagnóstico: {jsErrors.impact}
              </div>
            </div>

            <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>
              Este error no rompe la experiencia de los clientes ni impide que coticen o envíen mensajes de WhatsApp. Ocurre porque la app de Instagram en iOS intenta ejecutar manejadores internos propietarios que no existen en navegadores estándar.
            </p>
          </div>
        </div>
      )}

      {/* MODAL PARA PEGAR REPORTE EN VIVO DE MICROSOFT CLARITY */}
      {showPasteModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 20, 31, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px',
          }}
          onClick={() => setShowPasteModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '680px',
              padding: '26px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '90vh',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ padding: '8px', background: '#e0f2fe', borderRadius: '8px', color: '#0369a1' }}>
                  <ClipboardPaste size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Sincronizador Rápido de Microsoft Clarity
                  </h3>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    Copia y pega cualquier texto de tu panel de Clarity para actualizar métricas en 1 clic
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPasteModal(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.5, marginBottom: '12px' }}>
              Como la API de exportación de Microsoft Clarity tiene cuota de 10 peticiones/día y trunca las URLs de pauta publicitaria a 1,000 registros, puedes copiar el texto completo de tu pantalla de Clarity y pegarlo aquí:
            </p>

            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Ejemplo:
Sesiones
2055
17 sesiones de bot excluidas
Páginas por sesión 1,15
Usuarios únicos 1974
...
https://kiaelmarques.com/modelos/tasman 1248
https://kiaelmarques.com/modelos/soluto 791"
              rows={10}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '12px',
                fontFamily: 'monospace',
                background: '#f8fafc',
                color: '#0f172a',
                resize: 'vertical',
                marginBottom: '16px',
                lineHeight: 1.4,
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setShowPasteModal(false)}
                className="btn btn-outline"
                style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 600 }}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleApplyPastedReport}
                disabled={!pastedText.trim()}
                style={{
                  padding: '9px 20px',
                  fontSize: '13px',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: pasteSuccess ? '#16a34a' : '#05141f',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: pastedText.trim() ? 'pointer' : 'not-allowed',
                  opacity: pastedText.trim() ? 1 : 0.6,
                  transition: 'all 0.15s ease',
                }}
              >
                {pasteSuccess ? (
                  <>
                    <Check size={16} />
                    <span>¡Sincronizado con Éxito!</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={15} color="#38bdf8" />
                    <span>Sincronizar y Guardar Métricas</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
