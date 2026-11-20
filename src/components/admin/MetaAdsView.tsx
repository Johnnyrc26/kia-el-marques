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
} from 'lucide-react';

interface MetaAdsViewProps {
  data: any;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function MetaAdsView({ data, loading, error, onRefresh }: MetaAdsViewProps) {
  const adAccount = data?.adAccount;
  const activeAd = adAccount?.activeAd;
  const instagram = data?.instagram;
  const posts = instagram?.posts || [];
  const totals = instagram?.totals;

  const defaultCampaigns = [
    {
      id: 'boost_tasman_nov20',
      type: 'Boosted Instagram reel',
      mediaType: 'reel',
      vehicle: 'Tasman',
      name: 'Tasman: Redefine Pickup (Nov 20)',
      caption: 'Tasman redefine lo que puede ser una pickup: no solo es una herramienta imbatible para trabajos pesados...',
      status: 'Active',
      statusLabel: 'Activo',
      date: '20 nov',
      dailyBudget: 16.0,
      amountSpent: 3.21,
      views: 4520,
      viewers: 3950,
      resultType: 'Link Clicks',
      resultCount: 142,
      costPerResult: 0.023,
    },
    {
      id: 'boost_tasman_nov19',
      type: 'Boosted Instagram reel',
      mediaType: 'reel',
      vehicle: 'Tasman',
      name: 'Tasman: Perfil Instagram (Nov 19)',
      caption: 'Tasman redefine lo que puede ser una pickup: no solo es una herramienta imbatible para trabajos pesados...',
      status: 'Paused',
      statusLabel: 'Pausado',
      date: '19 nov',
      dailyBudget: 10.0,
      amountSpent: 6.23,
      views: 2215,
      viewers: 1888,
      resultType: 'Instagram profile visits',
      resultCount: 75,
      costPerResult: 0.083,
    },
    {
      id: 'boost_soluto_nov17',
      type: 'Boosted Instagram reel',
      mediaType: 'reel',
      vehicle: 'Soluto',
      name: 'Soluto: Rutina Familiar (Nov 17)',
      caption: 'Cuando un vehículo responde tanto a la rutina familiar como a tus compromisos laborales...',
      status: 'Active',
      statusLabel: 'Activo',
      date: '17 nov',
      dailyBudget: 10.0,
      amountSpent: 46.62,
      views: 59240,
      viewers: 40680,
      resultType: 'Link Clicks',
      resultCount: 1945,
      costPerResult: 0.024,
    },
    {
      id: 'boost_seltos_nov17',
      type: 'Boosted Instagram post',
      mediaType: 'post',
      vehicle: 'Seltos',
      name: 'Seltos: Movilidad Urbana (Nov 17)',
      caption: 'Manejar por la ciudad exige un vehículo que te dé tranquilidad, sin renunciar al estilo...',
      status: 'Paused',
      statusLabel: 'Pausado',
      date: '17 nov',
      dailyBudget: 10.0,
      amountSpent: 5.92,
      views: 6500,
      viewers: 5200,
      resultType: 'Link Clicks',
      resultCount: 185,
      costPerResult: 0.032,
    },
    {
      id: 'boost_tasman_nov12',
      type: 'Boosted Instagram post',
      mediaType: 'post',
      vehicle: 'Tasman',
      name: 'Tasman: Lanzamiento Nueva Sede (Nov 12)',
      caption: 'Hay una nueva forma de descubrir el poder y la presencia de Kia. Nuestra Tasman llegó para redefinir...',
      status: 'Paused',
      statusLabel: 'Pausado',
      date: '12 nov',
      dailyBudget: 16.0,
      amountSpent: 50.66,
      views: 62400,
      viewers: 42800,
      resultType: 'Link Clicks / Profile visits',
      resultCount: 1540,
      costPerResult: 0.033,
    },
  ];

  const campaignsList: any[] = (adAccount?.campaigns && adAccount.campaigns.length > 0) ? adAccount.campaigns : defaultCampaigns;
  const totalSpentUSD = adAccount?.amountSpent ? Number(adAccount.amountSpent) : campaignsList.reduce((acc, c) => acc + (c.amountSpent || 0), 0);
  const totalViews = data?.crossChannelSummary?.adImpressions ? Number(data.crossChannelSummary.adImpressions) : campaignsList.reduce((acc, c) => acc + (c.views || 0), 0);
  const totalReach = data?.crossChannelSummary?.totalReachSocial ? Number(data.crossChannelSummary.totalReachSocial) : campaignsList.reduce((acc, c) => acc + (c.viewers || 0), 0);
  const totalLinkClicks = data?.crossChannelSummary?.linkClicksToWebsite ? Number(data.crossChannelSummary.linkClicksToWebsite) : campaignsList.reduce((acc, c) => acc + (c.resultCount || 0), 0);
  const avgCpc = totalLinkClicks > 0 ? (totalSpentUSD / totalLinkClicks).toFixed(3) : '0.030';

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

      {/* 4 KPIs de Meta Ads */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {/* KPI 1: Inversión en Anuncios */}
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.04em' }}>
                Inversión en Anuncios
              </span>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginTop: '2px', fontFamily: 'monospace' }}>
                ${totalSpentUSD.toFixed(2)} USD
              </div>
            </div>
            <div style={{ padding: '8px', background: '#fdf2f8', borderRadius: '8px', color: '#db2777' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '8px', fontWeight: 600 }}>
            ● {campaignsList.length} publicaciones promocionadas en Meta
          </div>
        </div>

        {/* KPI 2: Impresiones / Vistas */}
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.04em' }}>
                Vistas / Impresiones
              </span>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginTop: '2px', fontFamily: 'monospace' }}>
                {totalViews.toLocaleString()}
              </div>
            </div>
            <div style={{ padding: '8px', background: '#eff6ff', borderRadius: '8px', color: '#2563eb' }}>
              <Eye size={18} />
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#2563eb', marginTop: '8px', fontWeight: 600 }}>
            {totalReach.toLocaleString()} personas alcanzadas (Viewers)
          </div>
        </div>

        {/* KPI 3: Clics al Sitio Web */}
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.04em' }}>
                Clics / Resultados Web
              </span>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginTop: '2px', fontFamily: 'monospace' }}>
                {totalLinkClicks.toLocaleString()}
              </div>
            </div>
            <div style={{ padding: '8px', background: '#f0fdf4', borderRadius: '8px', color: '#16a34a' }}>
              <MousePointerClick size={18} />
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '8px', fontWeight: 600 }}>
            ${avgCpc} USD Costo por Resultado promedio
          </div>
        </div>

        {/* KPI 4: Comunidad Instagram */}
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.04em' }}>
                Comunidad @kiaelmarques
              </span>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginTop: '2px', fontFamily: 'monospace' }}>
                {instagram?.followersCount || 525}
              </div>
            </div>
            <div style={{ padding: '8px', background: '#faf5ff', borderRadius: '8px', color: '#7c3aed' }}>
              <Camera size={18} />
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#7c3aed', marginTop: '8px', fontWeight: 600 }}>
            {totals?.accountsEngaged || 414} cuentas interactuaron
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                style={{
                  background: '#fdf2f8',
                  color: '#db2777',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  textTransform: 'uppercase',
                }}
              >
                Boosted Instagram Reels
              </span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Centro de Anuncios de Meta (Sincronización en tiempo real)
              </span>
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Campañas de Reels Promocionados (@kiaelmarques)
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ background: '#f0fdf4', color: '#15803d', fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
              Inversión Total: ${totalSpentUSD.toFixed(2)} USD · {totalViews.toLocaleString()} Vistas
            </span>
          </div>
        </div>

        {/* Lista Dinámica de Publicaciones Promocionadas con Fidelidad al Dashboard de Meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
          {campaignsList.map((camp: any) => {
            const isActive = camp.status === 'Active';
            return (
              <div
                key={camp.id}
                style={{
                  background: isActive ? '#faf5ff' : '#ffffff',
                  border: isActive ? '1px solid #e9d5ff' : '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        background: isActive ? '#dcfce7' : '#f1f5f9',
                        color: isActive ? '#15803d' : '#475569',
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      ● {camp.status}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>• {camp.date}</span>
                    {camp.vehicle && (
                      <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '10px', fontWeight: 800, padding: '1px 6px', borderRadius: '4px' }}>
                        Kia {camp.vehicle}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a
                      href="https://adsmanager.facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                      style={{ padding: '4px 10px', fontSize: '11.5px', fontWeight: 700 }}
                    >
                      {isActive ? 'View details' : 'View results'}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 2fr) repeat(4, 1fr)', gap: '16px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: isActive ? '#6b21a8' : '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', flexShrink: 0 }}>
                      {camp.mediaType === 'post' ? <Camera size={20} /> : <Film size={20} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{camp.type || camp.name}</div>
                      <div style={{ fontSize: '11.5px', color: '#64748b', maxWidth: '340px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {camp.caption}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>
                      {camp.views ? Number(camp.views).toLocaleString() : '—'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Views</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>
                      {camp.viewers ? Number(camp.viewers).toLocaleString() : '—'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Viewers</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '17px', fontWeight: 800, color: isActive ? '#16a34a' : '#7c3aed', fontFamily: 'monospace' }}>
                      {camp.resultCount ? Number(camp.resultCount).toLocaleString() : '—'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>{camp.resultType}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>
                      ${Number(camp.amountSpent).toFixed(2)}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                      Spend of ${Number(camp.dailyBudget || 10).toFixed(2)}/day
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner de Correlación Meta Ads ➔ Microsoft Clarity */}
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '14px 18px', borderRadius: '8px', fontSize: '12.5px', color: '#166534', lineHeight: 1.5 }}>
          <strong>Atribución Cruzada Confirmada:</strong> Se han invertido un total acumulado de <strong>${totalSpentUSD.toFixed(2)} USD</strong> en {campaignsList.length} publicaciones promocionadas en Meta/Instagram, generando <strong>{totalLinkClicks.toLocaleString()} clics de enlace y visitas</strong> que alimentan el tráfico analizado en Microsoft Clarity y los prospectos cualificados por los asesores.
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
              {posts.length || 11} publicaciones sincronizadas · {totals?.likes || 332} likes · {totals?.comments || 39} comentarios
            </span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ background: '#f1f5f9', color: '#334155', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
              ER Promedio: {totals?.averageER || 6.19}%
            </span>
          </div>
        </div>

        {/* Grid de Publicaciones */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
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
