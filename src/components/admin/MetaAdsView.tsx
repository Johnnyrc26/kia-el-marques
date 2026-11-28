'use client';

import React from 'react';
import {
  Megaphone,
  RefreshCw,
  ExternalLink,
  DollarSign,
  Eye,
  MousePointerClick,
  Camera,
  Heart,
  MessageCircle,
  Film,
  AlertTriangle,
  TrendingUp,
  Clock,
  Sparkles,
  Users,
  ArrowUpRight,
} from 'lucide-react';

interface MetaAdsViewProps {
  data: any;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function MetaAdsView({ data, loading, error, onRefresh }: MetaAdsViewProps) {
  const adAccount = data?.adAccount;
  const instagram = data?.instagram;
  const posts = instagram?.posts || [];
  const totals = instagram?.totals;
  const sync = data?.sync;
  const igLive = Boolean(sync?.igLive);
  const adsLive = Boolean(sync?.adsLive);
  const syncWarnings: string[] = Array.isArray(sync?.warnings) ? sync.warnings : [];
  const fetchedTimeLabel = sync?.fetchedAt
    ? new Date(sync.fetchedAt).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })
    : null;

  const campaignsList: any[] = adAccount?.campaigns || [];
  const totalSpentUSD: number | null =
    typeof adAccount?.amountSpent === 'number'
      ? adAccount.amountSpent
      : typeof data?.crossChannelSummary?.adSpendUSD === 'number'
      ? data.crossChannelSummary.adSpendUSD
      : null;
  const totalViews: number | null =
    typeof data?.crossChannelSummary?.totalViewsAll === 'number'
      ? data.crossChannelSummary.totalViewsAll
      : typeof instagram?.nativeInsights?.totalViews === 'number'
      ? instagram.nativeInsights.totalViews
      : null;
  const totalReach: number | null =
    typeof data?.crossChannelSummary?.totalReachSocial === 'number'
      ? data.crossChannelSummary.totalReachSocial
      : typeof instagram?.nativeInsights?.uniqueViewers === 'number'
      ? instagram.nativeInsights.uniqueViewers
      : null;
  const totalLinkClicks: number | null =
    typeof data?.crossChannelSummary?.totalLinkClicksAll === 'number'
      ? data.crossChannelSummary.totalLinkClicksAll
      : null;
  const adLinkClicks: number | null =
    typeof data?.crossChannelSummary?.linkClicksToWebsite === 'number'
      ? data.crossChannelSummary.linkClicksToWebsite
      : null;
  const avgCpc: string | null =
    typeof totalSpentUSD === 'number' && typeof adLinkClicks === 'number' && adLinkClicks > 0
      ? (totalSpentUSD / adLinkClicks).toFixed(3)
      : typeof data?.crossChannelSummary?.avgCpcUSD === 'number'
      ? Number(data.crossChannelSummary.avgCpcUSD).toFixed(3)
      : null;
  const nativeInsights = instagram?.nativeInsights;
  const benchmark = nativeInsights?.benchmark;
  const demographics = nativeInsights?.demographics;

  return (
    <div>
      {/* Header intro & Quick Links */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px 28px',
          border: '1px solid #e2e8f0',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                background: '#fdf2f8',
                color: '#db2777',
                fontSize: '11px',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Megaphone size={12} />
              Meta Graph API v21.0
            </span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Cuenta: {adAccount?.name || 'KiaELMarqués (Centro de Anuncios)'}
            </span>
            <span
              style={{
                fontSize: '11px',
                background: data?.connected ? '#f0fdf4' : '#fef2f2',
                color: data?.connected ? '#16a34a' : '#dc2626',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '12px',
              }}
            >
              {data?.connected ? '● En Vivo' : '● Desconectado'}
            </span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Meta Ads Manager & Instagram Intelligence
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0', maxWidth: '720px', lineHeight: 1.4 }}>
            Métricas oficiales sincronizadas desde el Centro de Anuncios de Meta y la cuenta de Instagram oficial <strong>@kiaelmarques</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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
            <span>{loading ? 'Sincronizando...' : 'Sincronizar Meta'}</span>
          </button>

          <a
            href="https://adsmanager.facebook.com"
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
              background: '#1877f2',
            }}
          >
            <span>Meta Ads Manager ↗</span>
          </a>

          <a
            href="https://www.instagram.com/kiaelmarques/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{
              padding: '8px 14px',
              fontSize: '12.5px',
              fontWeight: 700,
              color: '#c026d3',
              borderColor: '#f0abfc',
              background: '#fdf4ff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Camera size={14} />
            <span>@kiaelmarques ↗</span>
          </a>
        </div>
      </div>

      {/* Estado de Sincronización en Vivo (Instagram + Pauta) */}
      {data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {igLive && (
            <div
              style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '10px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                color: '#166534',
                fontSize: '12.5px',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <strong>● Instagram en vivo</strong> · actualizado {fetchedTimeLabel || 'recientemente'} (ventana últimos {sync?.windowDays || 28} días)
              </div>
              {adsLive && (
                <span style={{ fontWeight: 700, background: '#dcfce7', padding: '2px 8px', borderRadius: '6px' }}>
                  ● Pauta Meta Ads en vivo
                </span>
              )}
            </div>
          )}

          {!adsLive && (
            <div
              style={{
                background: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: '10px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                color: '#92400e',
                fontSize: '12.5px',
                lineHeight: 1.5,
              }}
            >
              <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Pauta en Snapshot Manual:</strong>{' '}
                {syncWarnings[0] ||
                  'La cuenta publicitaria que paga los boosts no está asignada al usuario del sistema; mostrando snapshot manual del 27-nov-2026.'}
                <div style={{ marginTop: '4px', fontSize: '12px', color: '#78350f' }}>
                  Para activarla en vivo: <strong>Business Settings → Usuarios del sistema → El Marqués → Asignar activos → Cuentas publicitarias → (la cuenta con la que se promocionan los posts) → Ver rendimiento</strong>.
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Banner si existe */}
      {error && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '10px',
            padding: '14px 18px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#991b1b',
            fontSize: '13px',
          }}
        >
          <AlertTriangle size={18} color="#dc2626" />
          <div style={{ flex: 1 }}>
            <strong>Aviso de Conexión:</strong> {error}
          </div>
          <button
            type="button"
            onClick={onRefresh}
            style={{ background: 'none', border: 'none', color: '#b91c1c', fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}
          >
            Reintentar
          </button>
        </div>
      )}

      {/* 4 KPIs de Meta Ads & Instagram Intelligence */}
      <div className="admin-kpis-grid">
        {/* KPI 1: Alcance Total Instagram (Meta API) */}
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.04em' }}>
                Alcance Instagram ({sync?.windowDays || 28}d)
              </span>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginTop: '2px', fontFamily: 'monospace' }}>
                {totalReach !== null ? totalReach.toLocaleString() : '—'}
              </div>
            </div>
            <div style={{ padding: '8px', background: '#eff6ff', borderRadius: '8px', color: '#2563eb' }}>
              <Eye size={18} />
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#2563eb', marginTop: '8px', fontWeight: 600 }}>
            {totalViews !== null ? `${totalViews.toLocaleString()} vistas en 28 días` : '—'}
          </div>
        </div>

        {/* KPI 2: Comunidad Instagram */}
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.04em' }}>
                Comunidad @kiaelmarques
              </span>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginTop: '2px', fontFamily: 'monospace' }}>
                {typeof instagram?.followersCount === 'number' ? instagram.followersCount.toLocaleString() : '—'}
              </div>
            </div>
            <div style={{ padding: '8px', background: '#faf5ff', borderRadius: '8px', color: '#7c3aed' }}>
              <Camera size={18} />
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#7c3aed', marginTop: '8px', fontWeight: 600 }}>
            {typeof nativeInsights?.newFollowers28Days === 'number'
              ? `+${nativeInsights.newFollowers28Days.toLocaleString()} ganados en 28 días`
              : '—'}
          </div>
        </div>

        {/* KPI 3: Clics al Sitio Web */}
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.04em' }}>
                Clics de Enlace ({adsLive ? 'En vivo' : 'Pauta + Bio'})
              </span>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginTop: '2px', fontFamily: 'monospace' }}>
                {totalLinkClicks !== null ? totalLinkClicks.toLocaleString() : '—'}
              </div>
            </div>
            <div style={{ padding: '8px', background: '#f0fdf4', borderRadius: '8px', color: '#16a34a' }}>
              <MousePointerClick size={18} />
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '8px', fontWeight: 600 }}>
            {adLinkClicks !== null && avgCpc !== null
              ? `${adLinkClicks.toLocaleString()} clics en ads ($${avgCpc} CPC)`
              : '—'}
          </div>
        </div>

        {/* KPI 4: Inversión en Meta Ads */}
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.04em' }}>
                Inversión en Meta Ads {!adsLive && '· Snapshot'}
              </span>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginTop: '2px', fontFamily: 'monospace' }}>
                {totalSpentUSD !== null ? `$${totalSpentUSD.toFixed(2)} USD` : '—'}
              </div>
            </div>
            <div style={{ padding: '8px', background: '#fdf2f8', borderRadius: '8px', color: '#db2777' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px', fontWeight: 600 }}>
            {campaignsList.length} publicaciones promocionadas registradas
          </div>
        </div>
      </div>

      {/* Campañas de Reels Promocionados en Meta (Centro de Anuncios) */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                style={{
                  background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
                  color: '#be185d',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  border: '1px solid #fbcfe8',
                }}
              >
                Boosted Reels & Posts
              </span>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                Centro de Anuncios de Meta · Sincronización oficial
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              Campañas de Reels Promocionados (@kiaelmarques)
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ background: '#f0fdf4', color: '#15803d', fontSize: '12px', fontWeight: 700, padding: '6px 12px', borderRadius: '8px', border: '1px solid #bbf7d0', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <DollarSign size={14} /> Total: {totalSpentUSD !== null ? `$${totalSpentUSD.toFixed(2)} USD` : '—'}
            </span>
            <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '12px', fontWeight: 700, padding: '6px 12px', borderRadius: '8px', border: '1px solid #bfdbfe', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Eye size={14} /> {totalViews !== null ? `${totalViews.toLocaleString()} Vistas IG` : '—'}
            </span>
          </div>
        </div>

        {/* Lista Dinámica de Publicaciones Promocionadas con Diseño Ejecutivo Premium */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
          {campaignsList.map((camp: any) => {
            const isActive = camp.status === 'Active';
            const isReel = camp.mediaType !== 'post';
            const isClicks = camp.resultType?.toLowerCase().includes('click');
            const resultLabel = isClicks
              ? 'Clics al Enlace'
              : camp.resultType?.toLowerCase().includes('visit')
              ? 'Visitas al Perfil'
              : camp.resultType || 'Resultados';

            return (
              <div
                key={camp.id}
                style={{
                  background: isActive
                    ? 'linear-gradient(180deg, #fdf4ff 0%, #ffffff 100%)'
                    : '#ffffff',
                  border: isActive ? '1px solid #d8b4fe' : '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '18px 22px',
                  boxShadow: isActive
                    ? '0 4px 16px -2px rgba(168, 85, 247, 0.08), 0 2px 6px -1px rgba(0,0,0,0.02)'
                    : '0 2px 8px -2px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Barra Superior: Estado, Metadatos y Botón de Acción */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '14px',
                    borderBottom: '1px solid #f1f5f9',
                    paddingBottom: '12px',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {/* Badge de Estado con Punto Pulsante si está Activo */}
                    <span
                      style={{
                        background: isActive ? '#ecfdf5' : '#f1f5f9',
                        color: isActive ? '#059669' : '#475569',
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: '20px',
                        border: isActive ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        letterSpacing: '0.02em',
                      }}
                    >
                      <span
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background: isActive ? '#10b981' : '#94a3b8',
                          boxShadow: isActive ? '0 0 6px #10b981' : 'none',
                        }}
                      />
                      {isActive ? 'En Circulación (Activo)' : 'Pausado'}
                    </span>

                    {/* Fecha */}
                    <span
                      style={{
                        fontSize: '11.5px',
                        color: '#64748b',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: '#f8fafc',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        border: '1px solid #f1f5f9',
                      }}
                    >
                      <Clock size={12} style={{ color: '#94a3b8' }} />
                      {camp.date}
                    </span>

                    {/* Vehículo Asociado */}
                    {camp.vehicle && (
                      <span
                        style={{
                          background: '#eff6ff',
                          color: '#1d4ed8',
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          border: '1px solid #bfdbfe',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        🚗 Kia {camp.vehicle}
                      </span>
                    )}

                    {/* Formato de Anuncio */}
                    <span
                      style={{
                        background: isReel ? '#fdf2f8' : '#f8fafc',
                        color: isReel ? '#be185d' : '#334155',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        border: isReel ? '1px solid #fbcfe8' : '1px solid #e2e8f0',
                      }}
                    >
                      {isReel ? '🎬 Reel' : '📷 Post'}
                    </span>
                  </div>

                  {/* Botón Acción a Meta Ads Manager */}
                  <div>
                    <a
                      href="https://adsmanager.facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '5px 12px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        color: '#334155',
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '7px',
                        textDecoration: 'none',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#f8fafc';
                        e.currentTarget.style.borderColor = '#94a3b8';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = '#ffffff';
                        e.currentTarget.style.borderColor = '#cbd5e1';
                      }}
                    >
                      {isActive ? 'Ver en Ads Manager' : 'Ver Resultados'}
                      <ArrowUpRight size={13} style={{ color: '#64748b' }} />
                    </a>
                  </div>
                </div>

                {/* Cuerpo Principal: Info del Post (Izquierda) + KPIs Estructurados (Derecha) */}
                <div className="meta-campaign-card-body">
                  {/* Columna Izquierda: Miniatura degradado Instagram + Título y Copy */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#64748b',
                        flexShrink: 0,
                      }}
                    >
                      {isReel ? <Film size={18} /> : <Camera size={18} />}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontSize: '13.5px',
                          fontWeight: 800,
                          color: '#0f172a',
                          lineHeight: 1.3,
                          marginBottom: '3px',
                        }}
                      >
                        {camp.name || camp.type}
                      </div>
                      <div
                        style={{
                          fontSize: '11.5px',
                          color: '#64748b',
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={camp.caption}
                      >
                        "{camp.caption}"
                      </div>
                    </div>
                  </div>

                  {/* Columna Derecha: 4 Tarjetas de Métricas Ejecutivas con fondo y formato limpio */}
                  <div className="meta-campaign-kpis-grid">
                    {/* KPI 1: Reproducciones */}
                    <div
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '10px 12px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          color: '#64748b',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          marginBottom: '3px',
                        }}
                      >
                        <Eye size={12} style={{ color: '#3b82f6' }} />
                        Vistas
                      </div>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: 800,
                          color: '#0f172a',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {camp.views ? Number(camp.views).toLocaleString() : '—'}
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#94a3b8', marginTop: '2px' }}>
                        Reproducciones
                      </div>
                    </div>

                    {/* KPI 2: Alcance / Cuentas Únicas */}
                    <div
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '10px 12px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          color: '#64748b',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          marginBottom: '3px',
                        }}
                      >
                        <Users size={12} style={{ color: '#6366f1' }} />
                        Alcance
                      </div>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: 800,
                          color: '#0f172a',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {camp.viewers ? Number(camp.viewers).toLocaleString() : '—'}
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#94a3b8', marginTop: '2px' }}>
                        Cuentas únicas
                      </div>
                    </div>

                    {/* KPI 3: Resultados (Clics / Visitas) */}
                    <div
                      style={{
                        background: isActive ? '#f0fdf4' : '#faf5ff',
                        border: isActive ? '1px solid #bbf7d0' : '1px solid #e9d5ff',
                        borderRadius: '10px',
                        padding: '10px 12px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          color: isActive ? '#15803d' : '#7c3aed',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          marginBottom: '3px',
                        }}
                      >
                        <MousePointerClick
                          size={12}
                          style={{ color: isActive ? '#16a34a' : '#8b5cf6' }}
                        />
                        Resultados
                      </div>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: 800,
                          color: isActive ? '#15803d' : '#6b21a8',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {camp.resultCount ? Number(camp.resultCount).toLocaleString() : '—'}
                      </div>
                      <div
                        style={{
                          fontSize: '10.5px',
                          color: isActive ? '#166534' : '#6b21a8',
                          marginTop: '2px',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={resultLabel}
                      >
                        {resultLabel}
                      </div>
                    </div>

                    {/* KPI 4: Inversión / Gasto */}
                    <div
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '10px 12px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          color: '#64748b',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          marginBottom: '3px',
                        }}
                      >
                        <DollarSign size={12} style={{ color: '#f59e0b' }} />
                        Inversión
                      </div>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: 800,
                          color: '#0f172a',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {typeof camp.amountSpent === 'number' ? `$${Number(camp.amountSpent).toFixed(2)}` : '—'}
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '2px', fontWeight: 600 }}>
                        {typeof camp.dailyBudget === 'number' ? `de $${Number(camp.dailyBudget).toFixed(0)}/día` : 'Pauta acumulada'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner de Correlación Meta Ads ➔ Microsoft Clarity */}
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '14px 18px', borderRadius: '8px', fontSize: '12.5px', color: '#166534', lineHeight: 1.5 }}>
          <strong>Atribución Cruzada Confirmada:</strong> Se registra una inversión de{' '}
          <strong>{totalSpentUSD !== null ? `$${totalSpentUSD.toFixed(2)} USD` : '—'}</strong> en {campaignsList.length} publicaciones promocionadas, generando{' '}
          <strong>{adLinkClicks !== null ? `${adLinkClicks.toLocaleString()} clics de enlace en pauta` : '—'}</strong> dentro de{' '}
          <strong>{totalLinkClicks !== null ? `${totalLinkClicks.toLocaleString()} clics de enlace totales` : '—'}</strong> en Instagram ({adsLive ? 'pauta en vivo' : 'snapshot manual'}).
        </div>
      </div>

      {/* ============================================================== */}
      {/* MÓDULO: INSTAGRAM NATIVE INTELLIGENCE & BENCHMARK COMPETITIVO  */}
      {/* ============================================================== */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span
                style={{
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                  color: '#166534',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  border: '1px solid #bbf7d0',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Sparkles size={12} color="#16a34a" />
                Instagram Insights & Benchmark
              </span>
              <span
                style={{
                  background: '#fef3c7',
                  color: '#92400e',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '10px',
                  border: '1px solid #fde68a',
                }}
              >
                Snapshot manual ({benchmark?.source === 'manual_snapshot_2026-11-24' ? '24 Nov 2026' : 'Benchmark sector'})
              </span>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                Métricas de cuenta en vivo: últimos {sync?.windowDays || 28} días
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              Inteligencia Orgánica & Benchmark de Concesionarios
            </h3>
          </div>

          <span style={{ background: '#f8fafc', color: '#0f172a', fontSize: '12px', fontWeight: 700, padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            Categoría: <strong>Vehicle Dealerships</strong> · Snapshot manual
          </span>
        </div>

        {/* 1. Componente Oficial: Meta Business Comparison (Vehicle Dealerships) */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          {/* Tabs estilo Meta Business Suite */}
          <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#0284c7',
                background: '#e0f2fe',
                padding: '6px 14px',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Business comparison
            </span>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#64748b',
                padding: '6px 12px',
                cursor: 'pointer',
              }}
            >
              Businesses to watch
            </span>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
              Compare your performance against businesses in the Vehicle dealerships category
            </h4>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Results are based on businesses with similar organic 28-day reach in your category.{' '}
              <span style={{ color: '#0284c7', fontWeight: 600, cursor: 'pointer' }}>Edit category</span>
            </div>
          </div>

          {/* Gráfico y Caja de Recomendación */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
              gap: '24px',
              paddingBottom: '24px',
              borderBottom: '1px solid #f1f5f9',
              alignItems: 'center',
            }}
          >
            {/* Lado Izquierdo: Histogram / Percentiles */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '12px', fontWeight: 700 }}>
                <span>Published content</span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>ⓘ</span>
              </div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace', margin: '4px 0 6px 0' }}>
                32
              </div>
              <div style={{ marginBottom: '16px' }}>
                <span
                  style={{
                    background: '#e0f2fe',
                    color: '#0369a1',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                  }}
                >
                  Similar to others
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#475569', fontWeight: 600, marginBottom: '14px' }}>
                How often your business published versus others in this category
              </div>

              {/* Bar Chart Percentiles */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '18px', height: '140px', paddingLeft: '28px', position: 'relative', borderBottom: '1px solid #cbd5e1' }}>
                {/* Ticks de eje Y */}
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }}>
                  <span>50</span>
                  <span>40</span>
                  <span>30</span>
                  <span>20</span>
                  <span>10</span>
                  <span>0</span>
                </div>

                {/* Barra 1: 25th percentile (9) */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' }}>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '56px',
                      height: '18%',
                      background: '#bae6fd',
                      borderRadius: '4px 4px 0 0',
                    }}
                  />
                  <span style={{ fontSize: '10.5px', color: '#64748b', marginTop: '6px', whiteSpace: 'nowrap' }}>
                    25th percentile
                  </span>
                </div>

                {/* Barra 2: 50th percentile (21) */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' }}>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '56px',
                      height: '42%',
                      background: '#7dd3fc',
                      borderRadius: '4px 4px 0 0',
                    }}
                  />
                  <span style={{ fontSize: '10.5px', color: '#64748b', marginTop: '6px', whiteSpace: 'nowrap' }}>
                    50th percentile
                  </span>
                </div>

                {/* Barra 3: Your Business (32) */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' }}>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '56px',
                      height: '64%',
                      background: '#0284c7',
                      borderRadius: '4px 4px 0 0',
                      boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)',
                    }}
                  />
                  <span style={{ fontSize: '11px', color: '#0f172a', fontWeight: 800, marginTop: '6px', whiteSpace: 'nowrap' }}>
                    Your business (32)
                  </span>
                </div>

                {/* Barra 4: 75th percentile (43) */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' }}>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '56px',
                      height: '86%',
                      background: '#bae6fd',
                      borderRadius: '4px 4px 0 0',
                    }}
                  />
                  <span style={{ fontSize: '10.5px', color: '#64748b', marginTop: '6px', whiteSpace: 'nowrap' }}>
                    75th percentile
                  </span>
                </div>
              </div>
            </div>

            {/* Lado Derecho: Feedback Oficial & CTA */}
            <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '20px', border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                Over the last 28 days, you typically published the same amount of posts and stories compared to other businesses in this category. <strong>Well done!</strong> Stay on track by creating a new post or scheduling in advance.
              </p>
              <div>
                <a
                  href="https://www.instagram.com/kiaelmarques"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#0284c7',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    padding: '9px 18px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    display: 'inline-block',
                  }}
                >
                  Create Post ↗
                </a>
              </div>
            </div>
          </div>

          {/* 3 Métricas Comparativas en Fila Inferior */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
              gap: '20px',
              paddingTop: '20px',
            }}
          >
            {/* Métrica 1: Instagram followers */}
            <div style={{ borderRight: '1px solid #f1f5f9', paddingRight: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#475569', fontSize: '12px', fontWeight: 700 }}>
                <span>Instagram followers</span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>ⓘ</span>
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace', margin: '4px 0' }}>
                {(typeof instagram?.followersCount === 'number' ? instagram.followersCount : benchmark?.instagramFollowers?.count || 647).toLocaleString()}
              </div>
              <div style={{ marginBottom: '4px' }}>
                <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '10.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px' }}>
                  Similar to others
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                Typically: <strong>{benchmark?.instagramFollowers?.typical?.toLocaleString() || '1,147'}</strong>
              </div>
            </div>

            {/* Métrica 2: Follows (Crecimiento en 28 días) */}
            <div style={{ borderRight: '1px solid #f1f5f9', paddingRight: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#475569', fontSize: '12px', fontWeight: 700 }}>
                <span>Follows</span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>ⓘ</span>
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace', margin: '4px 0' }}>
                {(typeof nativeInsights?.newFollowers28Days === 'number' ? nativeInsights.newFollowers28Days : benchmark?.followsGained?.count || 617).toLocaleString()}
              </div>
              <div style={{ marginBottom: '4px' }}>
                <span style={{ background: '#dcfce7', color: '#166534', fontSize: '10.5px', fontWeight: 800, padding: '2px 8px', borderRadius: '9999px' }}>
                  Higher than others
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#16a34a', fontWeight: 600 }}>
                Typically: <strong>{benchmark?.followsGained?.typical || 25}</strong> (+2.224% vs sector)
              </div>
            </div>

            {/* Métrica 3: Content interactions */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#475569', fontSize: '12px', fontWeight: 700 }}>
                <span>Content interactions</span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>ⓘ</span>
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace', margin: '4px 0' }}>
                {(typeof instagram?.totals?.totalInteractions === 'number' ? instagram.totals.totalInteractions : benchmark?.contentInteractions?.count || 3216).toLocaleString()}
              </div>
              <div style={{ marginBottom: '4px' }}>
                <span style={{ background: '#dcfce7', color: '#166534', fontSize: '10.5px', fontWeight: 800, padding: '2px 8px', borderRadius: '9999px' }}>
                  Higher than others
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#16a34a', fontWeight: 600 }}>
                Typically: <strong>{benchmark?.contentInteractions?.typical || 295}</strong> (+958% vs sector)
              </div>
            </div>
          </div>
        </div>

        {/* 2. Cuadrícula 2x2: Macro Métricas de Instagram + Demografía de Compradores */}
        <div className="admin-modules-2x2-grid">
          {/* Bloque Izquierdo: Resumen de Tráfico y Viralidad */}
          <div style={{ background: '#ffffff', borderRadius: '10px', padding: '20px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={16} color="#0284c7" />
              Métricas de Cuenta en Vivo (@kiaelmarques · {sync?.windowDays || 28}d)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '12.5px' }}>
                <span style={{ color: '#64748b' }}>Reproducciones de Contenido (Views):</span>
                <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>
                  {typeof nativeInsights?.totalViews === 'number' ? `${nativeInsights.totalViews.toLocaleString()} views` : '—'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '12.5px' }}>
                <span style={{ color: '#64748b' }}>Cuentas Alcanzadas (Reach):</span>
                <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>
                  {typeof nativeInsights?.uniqueViewers === 'number' ? `${nativeInsights.uniqueViewers.toLocaleString()} cuentas` : '—'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '12.5px' }}>
                <span style={{ color: '#64748b' }}>Taps en Enlace de Perfil (Bio):</span>
                <strong style={{ color: '#16a34a', fontFamily: 'monospace' }}>
                  {typeof nativeInsights?.linkClicks === 'number' ? `${nativeInsights.linkClicks.toLocaleString()} clics` : '—'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '12.5px' }}>
                <span style={{ color: '#64748b' }}>Visitas al Perfil de Instagram:</span>
                <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>
                  {typeof nativeInsights?.profileVisits === 'number' ? `${nativeInsights.profileVisits.toLocaleString()} visitas` : '—'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '12.5px' }}>
                <span style={{ color: '#64748b' }}>Interacciones Totales (28d):</span>
                <strong style={{ color: '#7c3aed', fontFamily: 'monospace' }}>
                  {typeof totals?.totalInteractions === 'number' ? `${totals.totalInteractions.toLocaleString()} interacciones` : '—'}
                </strong>
              </div>
            </div>
          </div>

          {/* Bloque Derecho: Perfil Demográfico del Comprador */}
          <div style={{ background: '#ffffff', borderRadius: '10px', padding: '20px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={16} color="#7c3aed" />
              Perfil Demográfico de Seguidores (En Vivo)
            </h4>

            {/* Género y Rango Clave */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>DISTRIBUCIÓN GÉNERO</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                  {typeof demographics?.menPct === 'number' && typeof demographics?.womenPct === 'number'
                    ? `${demographics.menPct}% H · ${demographics.womenPct}% M`
                    : '—'}
                </div>
              </div>
              <div style={{ background: '#eff6ff', padding: '10px 12px', borderRadius: '8px', textAlign: 'center', border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: 700 }}>EDAD CON PODER DE COMPRA</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#1d4ed8', marginTop: '2px' }}>
                  {typeof demographics?.primeBuyersPct === 'number' ? `${demographics.primeBuyersPct}% (35 a 54 años)` : '—'}
                </div>
              </div>
            </div>

            {/* Top Ciudades */}
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', fontWeight: 700 }}>
              Top Ciudades (Seguidores @kiaelmarques):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {Array.isArray(demographics?.topLocations) && demographics.topLocations.length > 0 ? (
                demographics.topLocations.slice(0, 8).map((loc: any) => (
                  <span
                    key={loc.city}
                    style={{ fontSize: '11.5px', background: '#f1f5f9', color: '#0f172a', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}
                  >
                    📍 {loc.city}: <strong>{loc.pct}%</strong>
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>— Sin datos demográficos disponibles</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feed de Publicaciones Oficiales en Instagram */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Publicaciones Recientes de Instagram (@kiaelmarques)
            </h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              {posts.length} publicaciones sincronizadas · {typeof totals?.likes === 'number' ? totals.likes : '—'} likes · {typeof totals?.comments === 'number' ? totals.comments : '—'} comentarios
            </span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ background: '#f1f5f9', color: '#334155', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
              ER Promedio: {typeof totals?.averageER === 'number' ? `${totals.averageER}%` : '—'}
            </span>
          </div>
        </div>

        {/* Grid de Publicaciones */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '16px' }}>
          {posts.map((post: any) => (
            <div
              key={post.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.15s, transform 0.15s',
              }}
            >
              <div>
                {/* Media Header con Badge de Tipo */}
                <div style={{ position: 'relative', height: '180px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {post.mediaType === 'VIDEO' ? (
                    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <video
                        src={post.mediaUrl}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        muted
                        playsInline
                      />
                      <div style={{ position: 'absolute', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '10px', color: '#fff' }}>
                        <Film size={20} />
                      </div>
                    </div>
                  ) : (
                    <img
                      src={post.mediaUrl}
                      alt={post.caption?.slice(0, 40) || 'Instagram post'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e: any) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}

                  <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                    <span style={{ background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                      {post.mediaType}
                    </span>
                    {post.isBoosted && (
                      <span style={{ background: '#db2777', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                        ★ PAUTA ACTIVA
                      </span>
                    )}
                  </div>

                  <span style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '11px', padding: '2px 6px', borderRadius: '4px' }}>
                    {new Date(post.timestamp).toLocaleDateString('es-VE', { day: 'numeric', month: 'short' })}
                  </span>
                </div>

                {/* Caption */}
                <div style={{ padding: '14px 16px' }}>
                  <p style={{ fontSize: '12.5px', color: '#334155', lineHeight: 1.45, margin: 0, maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {post.caption}
                  </p>
                </div>
              </div>

              {/* Stats & Link Footer */}
              <div style={{ padding: '12px 16px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#475569', fontWeight: 700 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Heart size={13} color="#e11d48" />
                    {post.likeCount}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <MessageCircle size={13} color="#2563eb" />
                    {post.commentsCount}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Eye size={13} color="#059669" />
                    {post.reach}
                  </span>
                </div>

                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '11.5px', fontWeight: 800, color: '#0284c7', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <span>Ver en IG</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
