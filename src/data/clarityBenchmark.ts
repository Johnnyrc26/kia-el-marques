// Datos oficiales del proyecto Microsoft Clarity (zfjnef6hsi)
// Fuente de verdad extraída directamente del panel de Clarity y sincronizada en tiempo real

export interface ClarityOfficialDataset {
  summary: {
    totalSessions: number;
    botSessionsExcluded: number;
    uniqueUsers: number;
    newUsers: number;
    newUsersPct: number;
    recurringUsers: number;
    recurringUsersPct: number;
    activeUsersNow: number;
    pagesPerSession: number;
    scrollDepthPct: number;
    activeTimeSec: number;
    totalTimeSec: number;
    deadClicksCount: number;
    deadClicksPct: number;
    rageClicksCount: number;
    rageClicksPct: number;
    quickbacksCount: number;
    quickbacksPct: number;
    excessiveScrollPct: number;
  };
  topPages: Array<{
    name: string;
    path: string;
    url: string;
    sessions: number;
    pct: number;
    deadClicks?: number;
    mobilePct?: number;
  }>;
  referrers: Array<{
    source: string;
    sessions: number;
    pct: number;
  }>;
  browsers: Array<{
    name: string;
    sessions: number;
    pct: number;
  }>;
  smartEvents: Array<{
    name: string;
    tag: string;
    sessions: number;
    alert?: boolean;
    success?: boolean;
  }>;
  coreWebVitals: {
    score: number;
    lcp: string;
    inp: string;
    cls: number;
    goodPct: number;
    needsImprovementPct: number;
    poorPct: number;
  };
  javascriptErrors: {
    ratePct: number;
    recordingsCount: number;
    topError: string;
    impact: string;
  };
}

export const OFFICIAL_CLARITY_BENCHMARK: ClarityOfficialDataset = {
  summary: {
    totalSessions: 1976,
    botSessionsExcluded: 17,
    uniqueUsers: 1901,
    newUsers: 1889,
    newUsersPct: 95.6,
    recurringUsers: 87,
    recurringUsersPct: 4.4,
    activeUsersNow: 8,
    pagesPerSession: 1.15,
    scrollDepthPct: 29.01,
    activeTimeSec: 13,
    totalTimeSec: 56,
    deadClicksCount: 48,
    deadClicksPct: 2.43,
    rageClicksCount: 2,
    rageClicksPct: 0.1,
    quickbacksCount: 6,
    quickbacksPct: 0.3,
    excessiveScrollPct: 0,
  },
  topPages: [
    { name: 'Tasman', path: '/modelos/tasman', url: 'https://kiaelmarques.com/modelos/tasman', sessions: 1206, pct: 61.0, deadClicks: 20, mobilePct: 99.1 },
    { name: 'Soluto', path: '/modelos/soluto', url: 'https://kiaelmarques.com/modelos/soluto', sessions: 756, pct: 38.3, deadClicks: 28, mobilePct: 98.4 },
    { name: 'Admin', path: '/admin', url: 'https://kiaelmarques.com/admin', sessions: 14, pct: 0.7, deadClicks: 0, mobilePct: 20.0 },
    { name: 'El Marqués Landing', path: '/elmarques', url: 'https://kiaelmarques.com/elmarques', sessions: 9, pct: 0.5, deadClicks: 0, mobilePct: 88.9 },
    { name: 'Asesor Ricardo Carrasco', path: '/asesor/ricardo-carrasco', url: 'https://kiaelmarques.com/asesor/ricardo-carrasco', sessions: 6, pct: 0.3, deadClicks: 0, mobilePct: 100.0 },
    { name: 'Seltos', path: '/modelos/seltos', url: 'https://kiaelmarques.com/modelos/seltos', sessions: 4, pct: 0.2, deadClicks: 0, mobilePct: 100.0 },
    { name: 'Picanto', path: '/modelos/picanto', url: 'https://kiaelmarques.com/modelos/picanto', sessions: 3, pct: 0.15, deadClicks: 0, mobilePct: 100.0 },
    { name: 'Asesor Carlos Arias', path: '/asesor/carlos-arias', url: 'https://kiaelmarques.com/asesor/carlos-arias', sessions: 1, pct: 0.05, deadClicks: 0, mobilePct: 100.0 },
    { name: 'Asesor Gabriel Petit', path: '/asesor/gabriel-petit', url: 'https://kiaelmarques.com/asesor/gabriel-petit', sessions: 1, pct: 0.05, deadClicks: 0, mobilePct: 100.0 },
    { name: 'Asesor Heber Ibañez', path: '/asesor/heber-ibanez', url: 'https://kiaelmarques.com/asesor/heber-ibanez', sessions: 1, pct: 0.05, deadClicks: 0, mobilePct: 100.0 },
    { name: 'QR Showroom', path: '/kiaelmarques', url: 'https://kiaelmarques.com/kiaelmarques', sessions: 1, pct: 0.05, deadClicks: 0, mobilePct: 100.0 },
    { name: 'Sonet', path: '/modelos/sonet', url: 'https://kiaelmarques.com/modelos/sonet', sessions: 1, pct: 0.05, deadClicks: 0, mobilePct: 100.0 },
  ],
  referrers: [
    { source: 'instagram.com', sessions: 1311, pct: 66.35 },
    { source: 'm.facebook.com', sessions: 639, pct: 32.34 },
    { source: 'l.instagram.com', sessions: 4, pct: 0.20 },
    { source: 'Directo / Showroom', sessions: 22, pct: 1.11 },
  ],
  browsers: [
    { name: 'InstagramApp (Navegador In-App)', sessions: 1950, pct: 98.68 },
    { name: 'Otros Navegadores (Chrome / Safari)', sessions: 26, pct: 1.32 },
  ],
  smartEvents: [
    { name: 'Quiz Iniciado', tag: 'quiz_iniciado', sessions: 50 },
    { name: 'Paso 2 (Uso/Propósito)', tag: 'quiz_paso_2', sessions: 50 },
    { name: 'Formulario Enviado', tag: 'Enviar formulario', sessions: 42 },
    { name: 'Paso 3 (Color)', tag: 'quiz_paso_3', sessions: 40 },
    { name: 'Paso 4 (Financiamiento)', tag: 'quiz_paso_4', sessions: 35 },
    { name: 'Paso 5 (Datos Contacto)', tag: 'quiz_paso_5', sessions: 33 },
    { name: 'Error Validación Teléfono', tag: 'quiz_error_validacion', sessions: 33, alert: true },
    { name: 'Cotización Completada', tag: 'quiz_completado_exitoso', sessions: 16, success: true },
    { name: 'Clic de Salida', tag: 'Clic de salida', sessions: 5 },
    { name: 'Contacto Asesor Directo', tag: 'Póngase en contacto con nosotros', sessions: 3 },
    { name: 'Clic WhatsApp Asesor', tag: 'whatsapp_click_advisor', sessions: 1 },
  ],
  coreWebVitals: {
    score: 66,
    lcp: '6s',
    inp: '210ms',
    cls: 0.81,
    goodPct: 39.7,
    needsImprovementPct: 32.8,
    poorPct: 27.6,
  },
  javascriptErrors: {
    ratePct: 0.05,
    recordingsCount: 2,
    topError: "undefined is not an object (evaluating 'window.webkit.messagehandlers')",
    impact: 'Inofensivo: script inyectado por el navegador embebido de Instagram en iOS',
  },
};
