import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { vehicleModels } from '@/data/models';
import VehicleQuiz from '@/components/VehicleQuiz';
import VehicleGalleryCarousel from '@/components/VehicleGalleryCarousel';
import ModelTabsSection from '@/components/ModelTabsSection';
import { MessageCircle, FileDown, ChevronRight, Sparkles } from 'lucide-react';

interface ModelPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return vehicleModels.map((model) => ({
    slug: model.slug,
  }));
}

export async function generateMetadata({ params }: ModelPageProps): Promise<Metadata> {
  const { slug } = await params;
  const model = vehicleModels.find((m) => m.slug === slug);

  if (!model) {
    return { title: 'Modelo no encontrado' };
  }

  const title = `${model.name} · Ficha Técnica y Comercial en Caracas | Kia El Marqués`;
  const description = `${model.name} en Kia El Marqués, Caracas. ${model.tagline} Motor ${model.technicalSpecs.engine}, ${model.technicalSpecs.power}. Ficha comercial, especificaciones oficiales y financiamiento.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://kiaelmarques.com/modelos/${model.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://kiaelmarques.com/modelos/${model.slug}`,
      images: [
        {
          url: model.image,
          width: 800,
          height: 500,
          alt: `${model.name} en Kia El Marqués Caracas`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [model.image],
    },
  };
}

export default async function ModelDetailPage({ params }: ModelPageProps) {
  const { slug } = await params;
  const model = vehicleModels.find((m) => m.slug === slug);

  if (!model) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: model.name,
    image: `https://kiaelmarques.com${model.image}`,
    description: model.description,
    brand: {
      '@type': 'Brand',
      name: 'Kia',
    },
    vehicleConfiguration: model.category,
    bodyType: model.category,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'AutoDealer',
        name: 'Kia El Marqués',
        url: 'https://kiaelmarques.com',
      },
    },
  };

  const waLeadText = encodeURIComponent(
    `¡Hola Kia El Marqués! Deseo información oficial, disponibilidad y cotización formal para el ${model.name}.`
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="main-content model-page-wrapper">
        <div className="shell">
          {/* Breadcrumbs */}
          <nav className="editorial-breadcrumbs" aria-label="Ruta de navegación">
            <Link href="/">Inicio</Link>
            <ChevronRight size={13} className="breadcrumb-arrow" aria-hidden="true" />
            <span className="breadcrumb-current">{model.name}</span>
          </nav>

          {/* Model Hero Header - Comentado por solicitud del cliente */}
          {/*
          <section className="model-hero-card">
            <div className="model-hero-grid">
              <div className="model-hero-info">
                <div className="model-badge-row">
                  <span className="badge badge-blue">
                    {model.category}
                  </span>
                  <span className="badge badge-gray">
                    Garantía 5&nbsp;Años / 100.000&nbsp;km
                  </span>
                </div>

                <h1 className="model-title">
                  {model.name}
                </h1>

                <p className="model-tagline">
                  {model.tagline}
                </p>

                <p className="model-description">
                  {model.description}
                </p>

                <div className="model-specs-pills">
                  {model.specs.map((s, idx) => (
                    <span key={idx} className="spec-pill">
                      <Sparkles size={12} className="spec-pill-icon" />
                      <span>{s}</span>
                    </span>
                  ))}
                </div>

                <div className="model-actions-row">
                  <a
                    href="#cotizar"
                    className="btn btn-primary btn-model-whatsapp"
                  >
                    <MessageCircle size={16} />
                    <span>Solicitar Propuesta Oficial&nbsp;↓</span>
                  </a>
                  <a
                    href={model.sheetPdf}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-model-pdf"
                  >
                    <FileDown size={16} />
                    <span>Descargar Ficha Técnica PDF&nbsp;↓</span>
                  </a>
                </div>
              </div>

              <div className="model-visual-wrap">
                <VehicleGalleryCarousel
                  images={
                    model.gallery && model.gallery.length > 0
                      ? model.gallery
                      : [{ src: model.image, alt: model.name, caption: model.tagline }]
                  }
                  modelName={model.name}
                />
              </div>
            </div>
          </section>
          */}

          {/* Tabs Unificadas: Ficha Técnica & Ficha Comercial */}
          <ModelTabsSection model={model} />

          {/* Interactive Lead & Vehicle Discovery Form */}
          <section id="cotizar" className="model-quiz-section">
            <div className="model-quiz-header">
              <span className="section-tag">Asesoría a Medida</span>
              <h2 className="section-title">
                Cuéntanos qué buscas en tu {model.name}
              </h2>
              <p className="section-desc">
                Indícanos tus prioridades de uso y plan de compra para preparar tu propuesta comercial oficial con entrega directa en Caracas.
              </p>
            </div>

            <div className="quiz-container-wrap">
              <VehicleQuiz initialModel={model.name} />
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
