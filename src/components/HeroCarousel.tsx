'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSlide {
  src: string;
  modelName: string;
  tagline: string;
  slug: string;
  alt: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    src: '/assets/hero/slide-sportage.jpg',
    modelName: 'Sportage',
    tagline: 'SUV Ícono Global · Diseño y Tecnología',
    slug: 'sportage',
    alt: 'Kia Sportage en autopista con montañas al fondo',
  },
  {
    src: '/assets/hero/slide-tasman.jpg',
    modelName: 'Tasman',
    tagline: 'Pick-up 4×4 Global · Expedición Todo Terreno',
    slug: 'tasman',
    alt: 'Kia Tasman en entorno natural y expedición off-road',
  },
  {
    src: '/assets/hero/slide-seltos.jpg',
    modelName: 'Seltos',
    tagline: 'SUV Urbana Versátil · En la Cota Mil con El Ávila',
    slug: 'seltos',
    alt: 'Kia Seltos en la Cota Mil con el cerro El Ávila de fondo',
  },
  {
    src: '/assets/hero/slide-picanto.jpg',
    modelName: 'Picanto',
    tagline: 'Movilidad Urbana Ágil · Presencia en Caracas',
    slug: 'picanto',
    alt: 'Kia Picanto azul en el bulevar de Las Mercedes Caracas',
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const goToSlide = (idx: number) => {
    setCurrent(idx);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <div
      className="hero-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-roledescription="carrusel automático"
      aria-label="Galería de modelos Kia en Caracas"
    >
      <div className="hero-carousel-viewport">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === current;
          return (
            <Link
              key={slide.slug}
              href={`/modelos/${slide.slug}`}
              className={`hero-carousel-slide ${isActive ? 'is-active' : ''}`}
              aria-hidden={!isActive}
              tabIndex={isActive ? 0 : -1}
              title={`Ver detalles de ${slide.modelName}`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={idx === 0}
                loading={idx === 0 ? 'eager' : 'lazy'}
                sizes="(max-width: 900px) 100vw, 560px"
                className="hero-carousel-img"
              />
            </Link>
          );
        })}

        {/* Navigation Arrows */}
        <button
          type="button"
          onClick={handlePrev}
          className="hero-carousel-nav-btn hero-nav-prev"
          aria-label="Ver modelo anterior"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="hero-carousel-nav-btn hero-nav-next"
          aria-label="Ver siguiente modelo"
        >
          <ChevronRight size={18} />
        </button>

        {/* Pagination Indicators / Dots */}
        <div className="hero-carousel-dots" aria-label="Selector de modelo">
          {HERO_SLIDES.map((slide, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => goToSlide(dotIdx)}
              className={`hero-carousel-dot ${dotIdx === current ? 'is-active' : ''}`}
              aria-label={`Ir a ${slide.modelName}`}
              aria-current={dotIdx === current ? 'true' : 'false'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
