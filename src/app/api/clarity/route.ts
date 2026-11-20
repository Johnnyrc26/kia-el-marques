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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const authHeader = req.headers.get('authorization') || searchParams.get('adminKey');
    const expectedPassword = process.env.ADMIN_PASSWORD || 'kia2026';

    if (authHeader !== expectedPassword && authHeader !== `Bearer ${expectedPassword}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Token de Clarity obtenido de variables de entorno, cabecera o fallback integrado
    const FALLBACK_CLARITY_TOKEN =
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ4M0FCMDhFNUYwRDMxNjdEOTRFMTQ3M0FEQTk2RTcyRDkwRUYwRkYiLCJ0eXAiOiJKV1QifQ.eyJqdGkiOiJkN2U4OTMzMC01M2E4LTRjMzYtOWNhNS0yZDRkNjgyMDUwMTgiLCJzdWIiOiIzNTk4NDU0OTg5MTQxNjUwIiwic2NvcGUiOiJEYXRhLkV4cG9ydCIsIm5iZiI6MTc5NTE5OTg5NywiZXhwIjo0OTQ4Nzk5ODk3LCJpYXQiOjE3OTUxOTk4OTcsImlzcyI6ImNsYXJpdHkiLCJhdWQiOiJjbGFyaXR5LmRhdGEtZXhwb3J0ZXIifQ.YrxVXJgJbrpD5yCWU1ngy6NagYINu0XS-Puv2cFWY5C4JooUiZy4V_0TFTWvnGkM86ey6kofxwRb9JwVL5069XWLpIaIAW-pJ3f-PFhs2CCDkwtxlckmlDzLzdvJAZ5xruyoA1ms7kZC2T1Lu-0WFEgy8jadKROquL0jKWcd_9qDdD0ynz1TOooh12y9f_56gXtga2Zi_0vbhW4emTEOUqYJwh9qLDE_1-4F0k97KIE74AoImmwK8Pb4kHJgZcKLzm_Dgkpv8Sl4n208Ma7HmUVKyttXsOOe4lGe52FLkOmvy8CuL2KFAW9Zyjs4y9bAmLJfnqvxMIV8jjbUWlMomw';

    const clarityToken =
      process.env.CLARITY_API_TOKEN ||
      req.headers.get('x-clarity-token') ||
      searchParams.get('clarityToken') ||
      FALLBACK_CLARITY_TOKEN;

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
      const errText = await clarityRes.text();
      console.error('Clarity API error response:', clarityRes.status, errText);
      return NextResponse.json(
        {
          success: false,
          configured: true,
          status: clarityRes.status,
          error: `Error al conectar con Microsoft Clarity (${clarityRes.status}): ${errText || 'Token inválido o cuota diaria superada'}`,
        },
        { status: 502 }
      );
    }

    const text = await clarityRes.text();
    let rawData: any;
    try {
      rawData = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          success: false,
          configured: true,
          status: clarityRes.status,
          error: 'La respuesta de Microsoft Clarity no tiene formato JSON válido.',
        },
        { status: 502 }
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
    console.error('API /api/clarity error:', err);
    return NextResponse.json(
      { success: false, error: 'Error interno consultando métricas de Clarity.' },
      { status: 500 }
    );
  }
}
