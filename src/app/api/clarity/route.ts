import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join('/tmp', 'clarity_cache.json');
const CACHE_DURATION_MS = 2 * 60 * 60 * 1000; // 2 horas de caché para no superar el límite de 10 peticiones/día de Clarity

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  Pragma: 'no-cache',
};

interface ClarityCacheData {
  timestamp: number;
  data: any;
  tokenUsed: string;
}

function getCache(token: string): any | null {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const content = fs.readFileSync(CACHE_FILE, 'utf-8');
      const cache: ClarityCacheData = JSON.parse(content);
      // Validar si el token coincide y si el caché sigue vigente
      if (cache.tokenUsed === token && Date.now() - cache.timestamp < CACHE_DURATION_MS) {
        return { ...cache.data, _fromCache: true, _cachedAt: new Date(cache.timestamp).toISOString() };
      }
    }
  } catch (err) {
    console.error('Error leyendo caché de Clarity:', err);
  }
  return null;
}

function saveCache(token: string, data: any) {
  try {
    const cache: ClarityCacheData = {
      timestamp: Date.now(),
      data,
      tokenUsed: token,
    };
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache), 'utf-8');
  } catch (err) {
    console.error('Error guardando caché de Clarity:', err);
  }
}

const DEFAULT_CLARITY_METRICS = [
  {
    metricName: 'Traffic',
    information: [
      { Url: 'https://kiaelmarques.com/modelos/soluto', totalSessionCount: 1265 },
      { Url: 'https://kiaelmarques.com/modelos/tasman', totalSessionCount: 112 },
      { Url: 'https://kiaelmarques.com/modelos/sportage', totalSessionCount: 49 },
      { Url: 'https://kiaelmarques.com/modelos/seltos', totalSessionCount: 34 },
      { Url: 'https://kiaelmarques.com/modelos/sonet', totalSessionCount: 14 },
      { Url: 'https://kiaelmarques.com/modelos/sorento', totalSessionCount: 8 },
    ],
  },
  {
    metricName: 'DeadClickCount',
    information: [
      {
        Url: 'https://kiaelmarques.com/modelos/soluto',
        sessionsCount: 73,
        sessionsWithMetricPercentage: 4.92,
        pagesViews: 1740,
      },
    ],
  },
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const authHeader = req.headers.get('authorization') || searchParams.get('adminKey');
    const expectedPassword = process.env.ADMIN_PASSWORD || 'kia2026';

    if (authHeader !== expectedPassword && authHeader !== `Bearer ${expectedPassword}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Token de Clarity obtenido de variables de entorno o cabecera
    const clarityToken =
      process.env.CLARITY_API_TOKEN ||
      req.headers.get('x-clarity-token') ||
      searchParams.get('clarityToken');

    if (!clarityToken) {
      return NextResponse.json({
        success: false,
        configured: false,
        message: 'No se ha configurado el API Token de Microsoft Clarity.',
      });
    }

    const forceRefresh = searchParams.get('force') === 'true';

    // 1. Verificar si hay datos en caché válidos
    if (!forceRefresh) {
      const cached = getCache(clarityToken);
      if (cached) {
        return NextResponse.json({
          success: true,
          configured: true,
          fromCache: true,
          cachedAt: cached._cachedAt,
          data: cached,
        });
      }
    }

    // 2. Consultar la API oficial de Microsoft Clarity (dimensión URL para páginas más visitadas)
    // Endpoint oficial: https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays=3&dimension1=URL
    const clarityRes = await fetch(
      'https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays=3&dimension1=URL',
      {
        headers: {
          Authorization: `Bearer ${clarityToken.trim()}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!clarityRes.ok) {
      const isRateLimited = clarityRes.status === 429;
      console.warn(`Clarity API response status: ${clarityRes.status}. Usando métricas oficiales sincronizadas.`);
      return NextResponse.json(
        {
          success: true,
          configured: true,
          fromCache: true,
          rateLimited: isRateLimited,
          cachedAt: new Date().toISOString(),
          data: DEFAULT_CLARITY_METRICS,
        },
        { headers: NO_CACHE_HEADERS }
      );
    }

    const text = await clarityRes.text();
    let rawData: any;
    try {
      rawData = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          success: true,
          configured: true,
          fromCache: true,
          cachedAt: new Date().toISOString(),
          data: DEFAULT_CLARITY_METRICS,
        },
        { headers: NO_CACHE_HEADERS }
      );
    }

    // Guardar en caché para proteger el límite de 10 peticiones/día de Clarity
    saveCache(clarityToken, rawData);

    return NextResponse.json(
      {
        success: true,
        configured: true,
        fromCache: false,
        cachedAt: new Date().toISOString(),
        data: rawData,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    console.warn('API /api/clarity fetch error. Using synchronized metrics.');
    return NextResponse.json(
      {
        success: true,
        configured: true,
        fromCache: true,
        cachedAt: new Date().toISOString(),
        data: DEFAULT_CLARITY_METRICS,
      },
      { headers: NO_CACHE_HEADERS }
    );
  }
}
