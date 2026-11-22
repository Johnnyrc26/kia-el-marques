import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://kiaelmarques.com'),
  title: {
    default: 'Kia El Marqués · Concesionario Oficial Kia en Caracas, Venezuela',
    template: '%s · Kia El Marqués',
  },
  description:
    'Concesionario oficial autorizado de la red Kia en Caracas, Venezuela. Venta de vehículos 0 km (Tasman, Sportage, Seltos, Sorento, Picanto, Carnival), financiamiento bancario y directo, atención a la diáspora y taller seguro.',
  keywords: [
    'Kia El Marqués',
    'Kia Caracas',
    'concesionario Kia Venezuela',
    'Tasman Venezuela',
    'comprar Kia Caracas',
    'Sportage Venezuela',
    'Seltos Caracas',
    'Sorento híbrida',
    'taller oficial Kia Caracas',
    'repuestos originales Kia Venezuela',
    'financiamiento carros Kia Venezuela',
    'Kia Venezuela',
  ],
  authors: [{ name: 'Kia El Marqués', url: 'https://kiaelmarques.com' }],
  creator: 'Kia El Marqués',
  publisher: 'Kia El Marqués',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://kiaelmarques.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_VE',
    url: 'https://kiaelmarques.com',
    siteName: 'Kia El Marqués',
    title: 'Kia El Marqués · Concesionario Oficial Kia en Caracas, Venezuela',
    description:
      'Concesionario oficial autorizado de la red Kia en Caracas. Venta de modelos 0 km, financiamiento transparente, atención a la diáspora y taller seguro.',
    images: [
      {
        url: '/assets/kia-og.png',
        width: 1200,
        height: 630,
        alt: 'Kia El Marqués · Concesionario Oficial Caracas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kia El Marqués · Concesionario Oficial Kia en Caracas',
    description:
      'Concesionario oficial autorizado Kia en Caracas, Venezuela. Venta de 0 km, financiamiento transparente y taller seguro.',
    images: ['/assets/kia-og.png'],
  },
  other: {
    'facebook-domain-verification': 'mdykkimzpkwdnnrnmtkl47ajmxvr7a',
    'geo.region': 'VE-M',
    'geo.placename': 'Caracas, El Marqués',
    'geo.position': '10.4950;-66.8280',
    'ICBM': '10.4950, -66.8280',
  },
  icons: {
    icon: '/assets/kia-logo.svg',
    shortcut: '/assets/kia-logo.svg',
    apple: '/assets/app-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preload" href="/fonts/KiaSignature-Bold.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/KiaSignature-Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `(function(){if(typeof window==='undefined')return;var wrapPm=function(w){if(!w||!w.postMessage||w.__pm_shield)return;var orig=w.postMessage;w.postMessage=function(){try{return orig.apply(this,arguments);}catch(err){var m=String(err&&(err.message||err));if(m.indexOf('Java object is gone')!==-1||m.indexOf('postMessage')!==-1)return;throw err;}};w.__pm_shield=true;};wrapPm(window);try{if(window.parent&&window.parent!==window)wrapPm(window.parent);}catch(e){}var isIgnored=function(m){if(!m)return false;var s=String(m).toLowerCase();return s.indexOf('java object is gone')!==-1||(s.indexOf('postmessage')!==-1&&s.indexOf('java')!==-1)||s.indexOf('fb_instant_games')!==-1||s==='script error.'||s==='script error'||s.indexOf('script error')!==-1;};var handleChunk=function(m){var s=String(m||'').toLowerCase();if(s.indexOf('loading chunk')!==-1||s.indexOf('chunkloaderror')!==-1){try{var lr=sessionStorage.getItem('chunk_reload');var now=Date.now();if(!lr||(now-parseInt(lr,10))>15000){sessionStorage.setItem('chunk_reload',String(now));window.location.reload();return true;}}catch(e){}}return false;};var origOnError=window.onerror;window.onerror=function(msg,url,line,col,err){var m=String(msg||(err&&err.message)||'');if(handleChunk(m)||isIgnored(m)){return true;}if(origOnError)return origOnError.apply(this,arguments);return false;};window.addEventListener('error',function(e){var m=e.message||(e.error&&e.error.message)||'';if(handleChunk(m)){e.preventDefault();if(e.stopImmediatePropagation)e.stopImmediatePropagation();return true;}if(isIgnored(m)){e.preventDefault();if(e.stopImmediatePropagation)e.stopImmediatePropagation();return true;}},true);window.addEventListener('unhandledrejection',function(e){var r=e.reason&&(e.reason.message||e.reason);if(handleChunk(r)){e.preventDefault();return;}if(isIgnored(r)){e.preventDefault();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}},true);})();`,
          }}
        />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){if(typeof window!=='undefined'&&(window.location.hostname==='localhost'||window.location.hostname==='127.0.0.1'||window.location.pathname.indexOf('/admin')!==-1))return;c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "zfjnef6hsi");`,
          }}
        />
      </head>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
