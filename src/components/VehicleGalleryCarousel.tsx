'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface VehicleGalleryCarouselProps {
  images: GalleryImage[];
  modelName: string;
}

export default function VehicleGalleryCarousel({
  images,
  modelName,
}: VehicleGalleryCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  // If there's only 1 image, render cleanly without carousel controls
  if (!images || images.length === 0) {
    return null;
  }

  const scrollToIndex = useCallback((index: number) => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const slideWidth = track.clientWidth;
    isScrollingRef.current = true;
    track.scrollTo({
      left: index * slideWidth,
      behavior: 'smooth',
    });
    setActiveIndex(index);
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 450);
  }, []);

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % images.length;
    scrollToIndex(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (activeIndex - 1 + images.length) % images.length;
    scrollToIndex(prevIdx);
  };

  // Listen to native touch scroll-snap on mobile
  const handleScroll = () => {
    if (isScrollingRef.current || !trackRef.current) return;
    const track = trackRef.current;
    const slideWidth = track.clientWidth;
    if (slideWidth > 0) {
      const newIdx = Math.round(track.scrollLeft / slideWidth);
      if (newIdx !== activeIndex && newIdx >= 0 && newIdx < images.length) {
        setActiveIndex(newIdx);
      }
    }
  };

  // Keyboard navigation support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    }
  };

  return (
    <div
      className="vehicle-carousel-container"
      role="region"
      aria-roledescription="carrusel"
      aria-label={`Galería fotográfica oficial de ${modelName}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Main Slides Track */}
      <div className="carousel-main-viewport">
        {/* Counter Badge */}
        <div className="carousel-counter-badge" aria-live="polite">
          <Camera size={13} aria-hidden="true" />
          <span>{activeIndex + 1} / {images.length}</span>
        </div>

        {/* Scroll Track */}
        <div
          ref={trackRef}
          className="carousel-track"
          onScroll={handleScroll}
        >
          {images.map((img, idx) => (
            <div
              key={idx}
              className="carousel-slide"
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`Foto ${idx + 1} de ${images.length}: ${img.alt}`}
            >
              <div className="carousel-image-box">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  priority={idx === 0}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  sizes="(max-width: 768px) 100vw, 560px"
                  className={`carousel-img ${img.src.endsWith('.png') ? 'carousel-img-contain' : 'carousel-img-cover'}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows (Desktop & Tablet) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="carousel-nav-btn carousel-nav-prev"
              aria-label="Ver imagen anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="carousel-nav-btn carousel-nav-next"
              aria-label="Ver siguiente imagen"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Pagination Dots */}
      {images.length > 1 && (
        <div className="carousel-dots-row" aria-label="Indicadores de diapositiva">
          {images.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => scrollToIndex(dotIdx)}
              className={`carousel-dot ${dotIdx === activeIndex ? 'is-active' : ''}`}
              aria-label={`Ir a la foto ${dotIdx + 1}`}
              aria-current={dotIdx === activeIndex ? 'true' : 'false'}
            />
          ))}
        </div>
      )}
    </div>
  );
}
