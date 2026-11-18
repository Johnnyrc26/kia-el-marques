import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ADVISORS, findAdvisorBySlug } from '@/data/advisors';
import AdvisorCardClient from '@/components/AdvisorCardClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const params: Array<{ slug: string }> = [];
  
  ADVISORS.forEach((a) => {
    params.push({ slug: a.slug });
    // también agregamos sus alias para compatibilidad total
    a.aliases.forEach((alias) => {
      if (alias !== a.slug) {
        params.push({ slug: alias });
      }
    });
  });

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const advisor = findAdvisorBySlug(slug);

  if (!advisor) {
    return {
      title: 'Asesor Comercial no encontrado · Kia El Marqués',
    };
  }

  const title = `${advisor.name} · ${advisor.role} · Kia El Marqués`;
  const description = `Tarjeta digital de contacto oficial de ${advisor.name} en Kia El Marqués, Caracas. Comunícate por WhatsApp, teléfono, correo o consulta nuestros modelos Kia 0 km.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://kiaelmarques.com/asesor/${advisor.slug}`,
      siteName: 'Kia El Marqués Caracas',
      images: [
        {
          url: '/assets/kia-og.png',
          width: 1200,
          height: 630,
          alt: `${advisor.name} · Asesor Oficial Kia El Marqués`,
        },
      ],
      locale: 'es_VE',
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/assets/kia-og.png'],
    },
  };
}

export default async function AdvisorPage({ params }: Props) {
  const { slug } = await params;
  const advisor = findAdvisorBySlug(slug);

  if (!advisor) {
    notFound();
  }

  return <AdvisorCardClient advisor={advisor} />;
}
