import { NextResponse } from 'next/server';

// Caché en memoria de 5 minutos para respetar límites de Meta Graph API
let cachedData: any = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  Pragma: 'no-cache',
};

const MANUAL_ADS_SNAPSHOT = [
  {
    id: 'boost_soluto_nov17',
    name: 'Boosted Instagram reel - Soluto (Familiar)',
    caption:
      'Cuando un vehículo responde tanto a la rutina familiar como a tus compromisos laborales, el espacio y la seguridad no se negocian. Nuestro Soluto ofrece un amplio maletero para equipaje, compras o herramientas...',
    vehicle: 'Soluto',
    status: 'Paused',
    statusLabel: 'Pausado',
    mediaType: 'reel',
    date: '17 nov – 27 nov',
    views: 111898,
    viewers: 62336,
    resultType: 'Link Clicks',
    resultCount: 3454,
    amountSpent: 86.39,
    dailyBudget: 10.0,
    costPerResult: 0.025,
    permalink: 'https://www.instagram.com/p/DCejqf7u77B/',
  },
  {
    id: 'boost_tasman_nov20',
    name: 'Boosted Instagram reel - Tasman (Redefine Pickup)',
    caption:
      'Tasman redefine lo que puede ser una pickup: no solo es una herramienta imbatible para trabajos pesados, sino un espacio donde la arquitectura interior y la ergonomía compiten con los SUV más reconocidos...',
    vehicle: 'Tasman',
    status: 'Paused',
    statusLabel: 'Pausado',
    mediaType: 'reel',
    date: '20 nov – 24 nov',
    views: 118600,
    viewers: 82526,
    resultType: 'Link Clicks',
    resultCount: 3213,
    amountSpent: 70.8,
    dailyBudget: 20.0,
    costPerResult: 0.022,
    permalink: 'https://www.instagram.com/reel/DCmQnSvuWbH/',
  },
  {
    id: 'boost_tasman_nov19',
    name: 'Boosted Instagram post - Tasman (Perfil)',
    caption:
      'Tasman redefine lo que puede ser una pickup: no solo es una herramienta imbatible para trabajos pesados, sino un espacio donde la arquitectura interior y la ergonomía compiten con los SUV más reconocidos...',
    vehicle: 'Tasman',
    status: 'Paused',
    statusLabel: 'Pausado',
    mediaType: 'post',
    date: '19 nov – 23 nov',
    views: 2215,
    viewers: 1888,
    resultType: 'Instagram profile visits',
    resultCount: 79,
    amountSpent: 6.32,
    dailyBudget: 10.0,
    costPerResult: 0.08,
    permalink: 'https://www.instagram.com/reel/DCmQnSvuWbH/',
  },
];

const MANUAL_BENCHMARK_SNAPSHOT = {
  source: 'manual_snapshot_2026-11-24',
  publishedContent: {
    count: 32,
    typical: 21,
    status: 'Similar to others',
    percentiles: { p25: 9, p50: 21, mine: 32, p75: 43 },
    feedback:
      'Over the last 28 days, you typically published the same amount of posts and stories compared to other businesses in this category. Well done! Stay on track by creating a new post or scheduling in advance.',
  },
  instagramFollowers: { count: 628, typical: 1147, status: 'Similar to others' },
  followsGained: { count: 581, typical: 25, status: 'Higher than others', multiplier: 23 },
  contentInteractions: { count: 3122, typical: 295, status: 'Higher than others', multiplier: 10.5 },
};

function detectVehicle(text?: string | null): string {
  const lower = (text || '').toLowerCase();
  if (lower.includes('tasman')) return 'Tasman';
  if (lower.includes('soluto')) return 'Soluto';
  if (lower.includes('sportage')) return 'Sportage';
  if (lower.includes('seltos')) return 'Seltos';
  if (lower.includes('sonet')) return 'Sonet';
  if (lower.includes('picanto')) return 'Picanto';
  if (lower.includes('sorento')) return 'Sorento';
  if (lower.includes('carnival')) return 'Carnival';
  return 'Otro';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const authHeader = request.headers.get('authorization') || searchParams.get('adminKey');
  const expectedPassword = process.env.ADMIN_PASSWORD || 'kia2026';

  if (authHeader !== expectedPassword && authHeader !== `Bearer ${expectedPassword}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401, headers: NO_CACHE_HEADERS });
  }

  const forceRefresh = searchParams.get('refresh') === 'true';

  const now = Date.now();
  if (!forceRefresh && cachedData && now - lastFetchTime < CACHE_TTL_MS) {
    return NextResponse.json(
      { ...cachedData, cached: true, cacheAgeSec: Math.round((now - lastFetchTime) / 1000) },
      { headers: NO_CACHE_HEADERS }
    );
  }

  const rawToken = process.env.META_ACCESS_TOKEN;
  const token = rawToken ? rawToken.trim().replace(/^["']|["']$/g, '') : '';
  const pageId = (process.env.META_PAGE_ID || '1479368498584058').trim().replace(/^["']|["']$/g, '');
  const adAccountId = (process.env.META_AD_ACCOUNT_ID || 'act_1115525761370828').trim().replace(/^["']|["']$/g, '');
  const igId = (process.env.META_INSTAGRAM_ID || '17841476726821910').trim().replace(/^["']|["']$/g, '');

  if (!token) {
    return NextResponse.json(
      {
        connected: false,
        error: 'META_ACCESS_TOKEN no configurado en variables de entorno.',
        timestamp: new Date().toISOString(),
      },
      { headers: NO_CACHE_HEADERS }
    );
  }

  const warnings: string[] = [];
  const untilSec = Math.floor(now / 1000);
  const sinceSec = untilSec - 28 * 86400;

  try {
    // 1. Scopes y validez del token en Meta
    let scopes: string[] = [];
    let tokenValid = false;
    try {
      const debugRes = await fetch(
        `https://graph.facebook.com/v21.0/debug_token?input_token=${encodeURIComponent(token)}&access_token=${encodeURIComponent(token)}`,
        { cache: 'no-store' }
      );
      if (debugRes.ok) {
        const debugData = await debugRes.json();
        scopes = debugData.data?.scopes || [];
        tokenValid = !!debugData.data?.is_valid;
      }
    } catch (e) {
      console.warn('Meta debug_token error:', e);
    }

    // 2. Información de la Página de Facebook
    let pageData: any = {
      id: pageId,
      name: 'Kia El Marqués',
      followers_count: null,
      fan_count: null,
      link: `https://www.facebook.com/${pageId}`,
    };
    try {
      const pRes = await fetch(
        `https://graph.facebook.com/v21.0/${pageId}?fields=name,followers_count,fan_count,link&access_token=${encodeURIComponent(token)}`,
        { cache: 'no-store' }
      );
      if (pRes.ok) {
        const pJson = await pRes.json();
        if (pJson.id) pageData = { ...pageData, ...pJson };
      }
    } catch (e) {
      console.warn('Meta page fetch error:', e);
    }

    // 3. Autodescubrimiento de cuentas publicitarias asignadas al System User y lectura de anuncios en vivo
    let adsLive = false;
    let liveCampaigns: any[] = [];
    let liveSpendTotal = 0;
    let discoveredAccountId = adAccountId;
    let discoveredAccountName = 'KiaELMarqués';
    let discoveredCurrency = 'USD';

    try {
      const accRes = await fetch(
        `https://graph.facebook.com/v21.0/me/adaccounts?fields=id,name,currency,amount_spent&access_token=${encodeURIComponent(token)}`,
        { cache: 'no-store' }
      );
      if (accRes.ok) {
        const accJson = await accRes.json();
        const accounts: any[] = Array.isArray(accJson.data) ? accJson.data : [];
        if (accounts.length > 0) {
          discoveredAccountId = accounts[0].id || adAccountId;
          discoveredAccountName = accounts[0].name || discoveredAccountName;
          discoveredCurrency = accounts[0].currency || 'USD';
        }

        for (const acc of accounts) {
          const insRes = await fetch(
            `https://graph.facebook.com/v21.0/${acc.id}/insights?level=ad&date_preset=maximum&fields=ad_id,ad_name,campaign_name,spend,impressions,reach,inline_link_clicks,cost_per_inline_link_click,date_start,date_stop&limit=100&access_token=${encodeURIComponent(token)}`,
            { cache: 'no-store' }
          );
          if (insRes.ok) {
            const insJson = await insRes.json();
            const rows: any[] = Array.isArray(insJson.data) ? insJson.data : [];
            for (const row of rows) {
              const spend = Number(row.spend || 0);
              liveSpendTotal += spend;
              const clicks = Number(row.inline_link_clicks || 0);
              const impressions = Number(row.impressions || 0);
              const reach = Number(row.reach || 0);
              const cpc =
                row.cost_per_inline_link_click !== undefined
                  ? Number(row.cost_per_inline_link_click)
                  : clicks > 0
                  ? Number((spend / clicks).toFixed(3))
                  : 0;
              liveCampaigns.push({
                id: row.ad_id || `${acc.id}_${liveCampaigns.length}`,
                name: row.ad_name || row.campaign_name || 'Anuncio Meta',
                caption: row.campaign_name || row.ad_name || '',
                vehicle: detectVehicle(`${row.ad_name || ''} ${row.campaign_name || ''}`),
                status: 'Active',
                statusLabel: 'Sincronizado en vivo',
                mediaType: 'reel',
                date: row.date_start && row.date_stop ? `${row.date_start} – ${row.date_stop}` : '',
                views: impressions,
                viewers: reach,
                resultType: 'Link Clicks',
                resultCount: clicks,
                amountSpent: spend,
                dailyBudget: null,
                costPerResult: cpc,
                permalink: '',
              });
            }
          }
        }

        if (liveSpendTotal > 0 && liveCampaigns.length > 0) {
          adsLive = true;
          liveSpendTotal = Number(liveSpendTotal.toFixed(2));
        }
      } else {
        warnings.push('No se pudo consultar me/adaccounts en Meta Graph API.');
      }
    } catch (e) {
      console.warn('Meta ad accounts discovery error:', e);
      warnings.push('Error consultando cuentas publicitarias de Meta.');
    }

    if (!adsLive) {
      warnings.push(
        'La cuenta publicitaria que paga los boosts no está asignada al usuario del sistema; mostrando snapshot manual del 27-nov-2026'
      );
    }

    const activeCampaigns = adsLive ? liveCampaigns : MANUAL_ADS_SNAPSHOT;
    const manualSpendTotal = Number(
      MANUAL_ADS_SNAPSHOT.reduce((sum, c) => sum + Number(c.amountSpent || 0), 0).toFixed(2)
    );
    const adSpendUSD = adsLive ? liveSpendTotal : manualSpendTotal;

    const adData = {
      id: discoveredAccountId,
      name: discoveredAccountName,
      currency: discoveredCurrency,
      amount_spent: adSpendUSD,
      balance: 0,
      campaigns_count: activeCampaigns.length,
      campaigns: activeCampaigns,
    };

    // 4. Datos Reales de Instagram (@kiaelmarques) en vivo
    let igLive = false;
    let instagramProfile: any = {
      id: igId,
      username: 'kiaelmarques',
      name: 'KIA EL MARQUÉS | Concesionario Oficial',
      followers_count: null,
      media_count: null,
      profile_picture_url: '',
    };

    let igReach28d: number | null = null;
    let igViews28d: number | null = null;
    let igProfileViews28d: number | null = null;
    let igWebsiteClicks28d: number | null = null;
    let igAccountsEngaged28d: number | null = null;
    let igTotalInteractions28d: number | null = null;
    let newFollowers28Days: number | null = null;
    let demographics: any = null;

    let instagramPosts: any[] = [];
    let totalRealLikes = 0;
    let totalRealComments = 0;
    let totalRealReach = 0;
    let totalRealSaves = 0;
    let totalRealInteractions = 0;

    try {
      // 4a. Perfil IG
      const igRes = await fetch(
        `https://graph.facebook.com/v21.0/${igId}?fields=id,username,name,followers_count,media_count,profile_picture_url&access_token=${encodeURIComponent(token)}`,
        { cache: 'no-store' }
      );
      if (igRes.ok) {
        const igJson = await igRes.json();
        if (igJson.username) {
          instagramProfile = igJson;
          igLive = true;
        }
      } else {
        warnings.push('No se pudo leer el perfil de Instagram en vivo.');
      }

      // 4b. Insights de cuenta (ventana 28 días)
      const insUrl = `https://graph.facebook.com/v21.0/${igId}/insights?metric=reach,views,profile_views,website_clicks,accounts_engaged,total_interactions&period=day&metric_type=total_value&since=${sinceSec}&until=${untilSec}&access_token=${encodeURIComponent(token)}`;
      const insRes = await fetch(insUrl, { cache: 'no-store' });
      if (insRes.ok) {
        const insJson = await insRes.json();
        if (Array.isArray(insJson.data)) {
          igLive = true;
          for (const m of insJson.data) {
            const val = typeof m.total_value?.value === 'number' ? m.total_value.value : null;
            if (m.name === 'reach') igReach28d = val;
            if (m.name === 'views') igViews28d = val;
            if (m.name === 'profile_views') igProfileViews28d = val;
            if (m.name === 'website_clicks') igWebsiteClicks28d = val;
            if (m.name === 'accounts_engaged') igAccountsEngaged28d = val;
            if (m.name === 'total_interactions') igTotalInteractions28d = val;
          }
        }
      } else {
        warnings.push('No se pudieron leer las métricas de rendimiento de Instagram (28 días).');
      }

      // 4c. Nuevos seguidores diarios (28 días)
      const folRes = await fetch(
        `https://graph.facebook.com/v21.0/${igId}/insights?metric=follower_count&period=day&since=${sinceSec}&until=${untilSec}&access_token=${encodeURIComponent(token)}`,
        { cache: 'no-store' }
      );
      if (folRes.ok) {
        const folJson = await folRes.json();
        const vals: any[] = folJson.data?.[0]?.values || [];
        if (Array.isArray(vals) && vals.length > 0) {
          newFollowers28Days = vals.reduce((acc, v) => acc + Number(v.value || 0), 0);
        }
      }

      // 4d. Demografía de seguidores (edad, género y ciudades)
      try {
        const [ageGenderRes, cityRes] = await Promise.all([
          fetch(
            `https://graph.facebook.com/v21.0/${igId}/insights?metric=follower_demographics&period=lifetime&metric_type=total_value&breakdown=age,gender&access_token=${encodeURIComponent(token)}`,
            { cache: 'no-store' }
          ),
          fetch(
            `https://graph.facebook.com/v21.0/${igId}/insights?metric=follower_demographics&period=lifetime&metric_type=total_value&breakdown=city&access_token=${encodeURIComponent(token)}`,
            { cache: 'no-store' }
          ),
        ]);

        let menPct: number | null = null;
        let womenPct: number | null = null;
        let primeBuyersPct: number | null = null;
        let ageBreakdown: Array<{ range: string; pct: number; menPct: number; womenPct: number }> = [];
        let topLocations: Array<{ city: string; pct: number }> = [];

        if (ageGenderRes.ok) {
          const agJson = await ageGenderRes.json();
          const results: any[] = agJson.data?.[0]?.total_value?.breakdowns?.[0]?.results || [];
          if (results.length > 0) {
            let totalAll = 0;
            let totalMen = 0;
            let totalWomen = 0;
            const byAge: Record<string, { total: number; men: number; women: number }> = {};

            for (const r of results) {
              const [age, gender] = r.dimension_values || [];
              const count = Number(r.value || 0);
              totalAll += count;
              if (!byAge[age]) byAge[age] = { total: 0, men: 0, women: 0 };
              byAge[age].total += count;
              if (gender === 'M') {
                totalMen += count;
                byAge[age].men += count;
              } else if (gender === 'F') {
                totalWomen += count;
                byAge[age].women += count;
              }
            }

            const knownGenderTotal = totalMen + totalWomen;
            if (knownGenderTotal > 0) {
              menPct = Number(((totalMen / knownGenderTotal) * 100).toFixed(1));
              womenPct = Number(((totalWomen / knownGenderTotal) * 100).toFixed(1));
            }

            if (totalAll > 0) {
              const primeCount = (byAge['35-44']?.total || 0) + (byAge['45-54']?.total || 0);
              primeBuyersPct = Number(((primeCount / totalAll) * 100).toFixed(1));
              const orderedRanges = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
              ageBreakdown = orderedRanges.map((range) => {
                const b = byAge[range] || { total: 0, men: 0, women: 0 };
                return {
                  range,
                  pct: Number(((b.total / totalAll) * 100).toFixed(1)),
                  menPct: Number(((b.men / totalAll) * 100).toFixed(1)),
                  womenPct: Number(((b.women / totalAll) * 100).toFixed(1)),
                };
              });
            }
          }
        } else {
          warnings.push('No se pudo obtener el desglose demográfico por edad y género de Instagram.');
        }

        if (cityRes.ok) {
          const cityJson = await cityRes.json();
          const cityResults: any[] = cityJson.data?.[0]?.total_value?.breakdowns?.[0]?.results || [];
          const cityTotal = cityResults.reduce((acc, r) => acc + Number(r.value || 0), 0);
          if (cityTotal > 0) {
            topLocations = [...cityResults]
              .sort((a, b) => Number(b.value || 0) - Number(a.value || 0))
              .slice(0, 10)
              .map((r) => ({
                city: r.dimension_values?.[0] || 'Desconocida',
                pct: Number(((Number(r.value || 0) / cityTotal) * 100).toFixed(1)),
              }));
          }
        }

        if (ageBreakdown.length > 0 || topLocations.length > 0) {
          demographics = {
            menPct,
            womenPct,
            primeBuyersPct,
            ageBreakdown,
            topLocations,
            topCountries: null,
          };
        }
      } catch (demoErr) {
        console.warn('IG demographics error:', demoErr);
        warnings.push('No se pudieron cargar los datos demográficos de seguidores.');
      }

      // 4e. Publicaciones recientes (con fallback de métricas si alguna da 400)
      let mediaRes = await fetch(
        `https://graph.facebook.com/v21.0/${igId}/media?fields=id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count,insights.metric(reach,total_interactions,saved,views,shares)&limit=25&access_token=${encodeURIComponent(token)}`,
        { cache: 'no-store' }
      );
      if (mediaRes.status === 400) {
        mediaRes = await fetch(
          `https://graph.facebook.com/v21.0/${igId}/media?fields=id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count,insights.metric(reach,total_interactions,saved)&limit=25&access_token=${encodeURIComponent(token)}`,
          { cache: 'no-store' }
        );
      }

      if (mediaRes.ok) {
        const mediaJson = await mediaRes.json();
        if (Array.isArray(mediaJson.data)) {
          instagramPosts = mediaJson.data.map((item: any) => {
            const likes = item.like_count || 0;
            const comments = item.comments_count || 0;
            totalRealLikes += likes;
            totalRealComments += comments;

            let reach = 0;
            let saves = 0;
            let views = 0;
            let shares = 0;
            let interactions = likes + comments;

            if (item.insights?.data && Array.isArray(item.insights.data)) {
              item.insights.data.forEach((m: any) => {
                const val = m.values?.[0]?.value || 0;
                if (m.name === 'reach') reach = val;
                if (m.name === 'saved') saves = val;
                if (m.name === 'views') views = val;
                if (m.name === 'shares') shares = val;
                if (m.name === 'total_interactions') interactions = val;
              });
            }

            totalRealReach += reach;
            totalRealSaves += saves;
            totalRealInteractions += interactions;

            return {
              id: item.id,
              caption: item.caption || 'Publicación oficial Kia El Marqués',
              mediaType: item.media_type === 'VIDEO' ? 'reel' : 'post',
              mediaUrl: item.media_url,
              permalink: item.permalink,
              timestamp: item.timestamp,
              date: item.timestamp
                ? new Date(item.timestamp).toLocaleDateString('es-VE', { day: 'numeric', month: 'short' })
                : '',
              likeCount: likes,
              commentsCount: comments,
              reach,
              views,
              shares,
              saves,
              interactions,
              vehicle: detectVehicle(item.caption),
            };
          });
        }
      }
    } catch (e) {
      console.warn('Instagram fetch error:', e);
      warnings.push('Error de red leyendo estadísticas de Instagram.');
    }

    const avgER =
      totalRealReach > 0
        ? Number((((totalRealLikes + totalRealComments + totalRealSaves) / totalRealReach) * 100).toFixed(2))
        : null;

    // Totales agregados de pauta publicitaria (Reels/Posts Promocionados)
    let totalAdViews = 0;
    let totalAdViewers = 0;
    let totalLinkClicks = 0;
    let totalProfileVisits = 0;
    let totalResults = 0;

    adData.campaigns.forEach((c: any) => {
      totalAdViews += Number(c.views || 0);
      totalAdViewers += Number(c.viewers || 0);
      if (c.resultType === 'Link Clicks') {
        totalLinkClicks += Number(c.resultCount || 0);
      } else if (c.resultType?.includes('visit')) {
        totalProfileVisits += Number(c.resultCount || 0);
      }
      totalResults += Number(c.resultCount || 0);
    });

    const totalLinkClicksAll = totalLinkClicks + (igWebsiteClicks28d ?? 0);
    const avgCpcUSD =
      totalLinkClicks > 0 ? Number((adData.amount_spent / totalLinkClicks).toFixed(3)) : null;

    const payload = {
      connected: true,
      sourceOfTruth: adsLive
        ? 'Meta Graph API v21.0 (Instagram y Pauta en Vivo)'
        : 'Meta Graph API v21.0 (Instagram en Vivo) + Snapshot Manual de Pauta',
      timestamp: new Date().toISOString(),
      sync: {
        fetchedAt: new Date().toISOString(),
        igLive,
        adsLive,
        adsSource: adsLive ? 'live' : 'manual_snapshot',
        windowDays: 28,
        warnings,
      },
      tokenValid,
      tokenScopes: scopes,
      page: {
        id: pageData.id,
        name: pageData.name,
        followersCount: pageData.followers_count,
        fanCount: pageData.fan_count,
        link: pageData.link,
      },
      adAccount: {
        id: adData.id,
        name: adData.name,
        currency: adData.currency || 'USD',
        amountSpent: adData.amount_spent,
        balance: adData.balance,
        campaignsCount: adData.campaigns_count,
        campaigns: adData.campaigns || [],
      },
      instagram: {
        id: instagramProfile.id || igId,
        username: instagramProfile.username || 'kiaelmarques',
        name: instagramProfile.name || 'KIA EL MARQUÉS | Concesionario Oficial',
        followersCount: instagramProfile.followers_count,
        mediaCount: instagramProfile.media_count,
        profilePic: instagramProfile.profile_picture_url || '',
        posts: instagramPosts,
        totals: {
          likes: totalRealLikes,
          comments: totalRealComments,
          reach: igReach28d ?? (totalRealReach > 0 ? totalRealReach : null),
          saves: totalRealSaves,
          averageER: avgER,
          totalInteractions: igTotalInteractions28d ?? (totalRealInteractions > 0 ? totalRealInteractions : null),
        },
        nativeInsights: {
          totalViews: igViews28d,
          uniqueViewers: igReach28d,
          accountsEngaged: igAccountsEngaged28d,
          nonFollowersPct: null,
          followersPct: null,
          linkClicks: igWebsiteClicks28d,
          profileVisits: igProfileViews28d,
          newFollowers28Days,
          totalFollowers: instagramProfile.followers_count,
          unfollows: null,
          demographics,
          benchmark: MANUAL_BENCHMARK_SNAPSHOT,
        },
      },
      crossChannelSummary: {
        totalReachSocial: igReach28d,
        totalOrganicReach: null,
        adImpressions: totalAdViews,
        totalViewsAll: igViews28d,
        adReach: totalAdViewers,
        linkClicksToWebsite: totalLinkClicks,
        totalLinkClicksAll,
        profileVisits: igProfileViews28d,
        totalResults,
        totalLikes: totalRealLikes,
        totalComments: totalRealComments,
        totalInteractions: igTotalInteractions28d ?? totalRealInteractions,
        adSpendUSD: adData.amount_spent,
        avgCpcUSD,
      },
    };

    cachedData = payload;
    lastFetchTime = now;

    return NextResponse.json(payload, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error('Meta API fatal error:', err);
    return NextResponse.json(
      {
        connected: false,
        error: err.message || 'Error al conectar con Meta Graph API',
        timestamp: new Date().toISOString(),
      },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
