import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--sans-font',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--mono-font',
  display: 'swap',
});

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
        url: '/assets/models/tasman-2026.webp',
        width: 1200,
        height: 630,
        alt: 'Tasman Pick-up en Kia El Marqués Caracas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kia El Marqués · Concesionario Oficial Kia en Caracas',
    description:
      'Concesionario oficial autorizado Kia en Caracas, Venezuela. Venta de 0 km, financiamiento transparente y taller seguro.',
    images: ['/assets/models/tasman-2026.webp'],
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
    <html lang="es" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "zfjnef6hsi");`,
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
