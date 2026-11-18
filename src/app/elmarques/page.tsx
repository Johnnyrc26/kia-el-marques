import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import Hero from '@/components/Hero';
import ModelsShowroom from '@/components/ModelsShowroom';
import FaqSection from '@/components/FaqSection';
import LocationContact from '@/components/LocationContact';

export const metadata: Metadata = {
  title: 'Kia El Marqués · Concesionario Oficial Kia en Caracas, Venezuela',
  description:
    'Concesionario oficial autorizado de la red Kia en Caracas, Venezuela. Venta de modelos 0 km (Tasman, Sportage, Seltos, Sorento, Picanto, Carnival), financiamiento directo y bancario, atención a la diáspora y taller seguro.',
  alternates: {
    canonical: 'https://kiaelmarques.com/elmarques',
  },
  openGraph: {
    title: 'Kia El Marqués · Concesionario Oficial Kia en Caracas',
    description:
      'Concesionario oficial autorizado de la red Kia en Caracas. Venta de modelos 0 km, financiamiento transparente y taller seguro.',
    url: 'https://kiaelmarques.com/elmarques',
    siteName: 'Kia El Marqués',
    images: [
      {
        url: '/assets/kia-og.png',
        width: 1200,
        height: 630,
        alt: 'Kia El Marqués · Concesionario Oficial Caracas',
      },
    ],
    locale: 'es_VE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kia El Marqués · Concesionario Oficial Kia en Caracas',
    description:
      'Concesionario oficial autorizado Kia en Caracas, Venezuela. Venta de 0 km, financiamiento transparente y taller seguro.',
    images: ['/assets/kia-og.png'],
  },
};

export default function ElMarquesPage() {
  return (
    <>
      <JsonLd />
      <Hero />
      <main>
        <ModelsShowroom />
        <FaqSection />
        <LocationContact />
      </main>
    </>
  );
}
