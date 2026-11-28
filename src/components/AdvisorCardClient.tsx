'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Mail, 
  MessageCircle, 
  QrCode, 
  MapPin, 
  Copy, 
  Check, 
  X,
  ExternalLink,
  ChevronRight,
  FileDown
} from 'lucide-react';
import { Advisor } from '@/data/advisors';
import VehicleQuiz from '@/components/VehicleQuiz';

interface AdvisorCardClientProps {
  advisor: Advisor;
}


// Las 8 fichas técnicas oficiales solicitadas
const OFFICIAL_FICHAS = [
  {
    name: 'Sonet',
    modelName: 'Sonet',
    slug: 'sonet',
    category: 'SUV Compacto Tecnológico',
    pdf: '/docs/fichas/ficha_sonet.pdf',
    image: '/assets/models/sonet.png',
  },
  {
    name: 'Carnival',
    modelName: 'Carnival',
    slug: 'carnival',
    category: 'Gran Utility Vehicle Familiar',
    pdf: '/docs/fichas/ficha_carnival.pdf',
    image: '/assets/models/carnival-v2.png',
  },
  {
    name: 'Seltos',
    modelName: 'Seltos',
    slug: 'seltos',
    category: 'SUV Mediano Confort & Estilo',
    pdf: '/docs/fichas/ficha_seltos.pdf',
    image: '/assets/models/seltos.png',
  },
  {
    name: 'Picanto',
    modelName: 'Picanto',
    slug: 'picanto',
    category: 'City Car Alta Eficiencia',
    pdf: '/docs/fichas/ficha_picanto.pdf',
    image: '/assets/models/picanto.png',
  },
  {
    name: 'Sorento',
    modelName: 'Sorento',
    slug: 'sorento',
    category: 'SUV Premium 4x4 · 3 Filas',
    pdf: '/docs/fichas/ficha_sorento.pdf',
    image: '/assets/models/sorento.png',
  },
  {
    name: 'Soluto',
    modelName: 'Soluto',
    slug: 'soluto',
    category: 'Sedán Ejecutivo & Espacioso',
    pdf: '/docs/fichas/ficha_soluto.pdf',
    image: '/assets/models/soluto.png',
  },
  {
    name: 'Sportage',
    modelName: 'Sportage',
    slug: 'sportage',
    category: 'SUV Crossover Emblema Global',
    pdf: '/docs/fichas/ficha_sportage.pdf',
    image: '/assets/models/sportage.png',
  },
  {
    name: 'Tasman',
    modelName: 'Tasman',
    slug: 'tasman',
    category: 'Pick-up 4x4 Chasis de Largueros',
    pdf: '/docs/fichas/ficha_tasman.pdf',
    image: '/assets/models/tasman.png',
  },
];

export default function AdvisorCardClient({ advisor }: AdvisorCardClientProps) {
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showDock, setShowDock] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(20);

  useEffect(() => {
    // Reportar etiquetas personalizadas a Microsoft Clarity para analíticas por asesor
    if (typeof window !== 'undefined') {
      const c = (window as any).clarity;
      if (typeof c === 'function') {
        try {
          c('set', 'advisor_name', advisor.name);
          c('set', 'advisor_slug', advisor.slug);
          c('set', 'page_type', 'advisor_profile');
        } catch {
          // ignore
        }
      }
    }
  }, [advisor.name, advisor.slug]);

  const trackAdvisorWhatsAppClick = () => {
    if (typeof window !== 'undefined') {
      const c = (window as any).clarity;
      if (typeof c === 'function') {
        try {
          c('event', 'whatsapp_click_advisor');
          c('set', 'advisor_contacted', advisor.name);
        } catch {}
      }
    }
  };

  useEffect(() => {
    let ticking = false;

    const updateDock = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Detectar footer para que el dock flote antes del footer y nunca lo solape
      const footer = document.querySelector('.editorial-footer') || document.querySelector('footer');
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const overlap = windowHeight - footerRect.top;
        if (overlap > 0) {
          setBottomOffset(overlap + 16);
        } else {
          setBottomOffset(20);
        }
      } else {
        setBottomOffset(20);
      }

      setShowDock(scrollY > 180);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateDock);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    updateDock();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const cleanPhone = advisor.phone.replace(/[^0-9]/g, '');
  const firstName = advisor.name.split(' ')[0] || advisor.name;
  const roleTerm = advisor.gender === 'F' ? 'asesora' : 'asesor';
  
  const waGreeting = encodeURIComponent(
    `¡Hola ${firstName}! Te contacto desde tu perfil oficial como ${roleTerm} de Kia El Marqués. Me gustaría recibir asesoría y cotización sobre los modelos Kia 0 km.`
  );
  
  const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${waGreeting}` : 'https://wa.me/584228846784';
  const telUrl = cleanPhone ? `tel:+${cleanPhone}` : 'tel:+584228846784';
  const mailUrl = `mailto:${advisor.email}`;
  const currentCardUrl = `https://kiaelmarques.com/asesor/${advisor.slug}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(currentCardUrl)}`;
  const mapsUrl = "https://maps.app.goo.gl/VSse49KmZ6AMWpnZ8";

  // Generador de tarjeta vCard (.vcf)
  const handleDownloadVCard = () => {
    const names = advisor.name.split(' ');
    const first = names[0] || '';
    const last = names.slice(1).join(' ') || '';

    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${advisor.name} · Kia El Marqués`,
      `N:${last};${first};;;`,
      'ORG:Kia El Marqués - Concesionario Oficial Caracas',
      `TITLE:${advisor.role}`,
      cleanPhone ? `TEL;TYPE=CELL,VOICE:+${cleanPhone}` : '',
      `EMAIL;TYPE=WORK,INTERNET:${advisor.email}`,
      'ADR;TYPE=WORK:;;Av. Rómulo Gallegos, Kia El Marqués;Caracas;Distrito Capital;1073;Venezuela',
      `URL:${currentCardUrl}`,
      `NOTE:Asesor Comercial Oficial Kia El Marqués Caracas.`,
      'END:VCARD',
    ].filter(Boolean).join('\r\n');

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${advisor.slug}-kia-el-marques.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentCardUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const initials = advisor.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="main-content" style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: '90px' }}>
      <div className="shell" style={{ maxWidth: '820px', margin: '0 auto' }}>
        
        {/* Breadcrumbs */}
        <nav className="editorial-breadcrumbs" aria-label="Ruta de navegación" style={{ marginTop: '20px', marginBottom: '20px' }}>
          <Link href="/elmarques">Inicio</Link>
          <ChevronRight size={13} className="breadcrumb-arrow" aria-hidden="true" />
          <span className="breadcrumb-current">{advisor.name}</span>
        </nav>

        {/* 1. Header / Tarjeta Principal del Asesor */}
        <header
          className="editorial-card"
          style={{
            background: '#ffffff',
            border: '1px solid var(--g10)',
            borderRadius: 'var(--radius-lg)',
            padding: 'clamp(24px, 4vw, 36px)',
            boxShadow: 'var(--shadow-card)',
            marginBottom: '28px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            
            {/* Avatar con Foto Oficial o Iniciales */}
            <div
              style={{
                width: '104px',
                height: '104px',
                borderRadius: '50%',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #05141f 0%, #1e293b 100%)',
                color: '#ffffff',
                marginBottom: '16px',
                boxShadow: '0 8px 24px rgba(5, 20, 31, 0.18)',
                border: '3px solid #ffffff',
                outline: '2px solid var(--g10)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {advisor.photo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={advisor.photo}
                  alt={advisor.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 15%',
                  }}
                />
              ) : (
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: 800,
                    letterSpacing: '1px',
                  }}
                >
                  {initials}
                </div>
              )}
            </div>

            {/* Nombre del Asesor */}
            <h1
              style={{
                fontSize: 'clamp(26px, 4vw, 36px)',
                fontWeight: 800,
                color: 'var(--g100)',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                marginBottom: '10px',
              }}
            >
              {advisor.name}
            </h1>

            {/* Badges de Verificación */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '14px' }}>
              <span className="badge badge-blue">
                {advisor.role}
              </span>
              <span className="badge badge-gray">
                Kia El Marqués · Caracas
              </span>
            </div>

            <p
              style={{
                fontSize: '14.5px',
                color: 'var(--g60)',
                lineHeight: 1.5,
                maxWidth: '520px',
                marginBottom: '24px',
              }}
            >
              Asesor comercial oficial en el concesionario Kia El Marqués. Atención directa y personalizada para la adquisición y entrega de tu vehículo Kia 0&nbsp;km.
            </p>

            {/* Botones de Acción Primaria */}
            <div style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '10px', margin: '0 auto' }}>
              {/* Botón Principal: WhatsApp ancho completo */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackAdvisorWhatsAppClick}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  backgroundColor: '#25D366',
                  borderColor: '#25D366',
                  padding: '13px 20px',
                  fontSize: '14.5px',
                  fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(37, 211, 102, 0.28)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <MessageCircle size={19} />
                <span>Escribir por WhatsApp</span>
              </a>

              {/* Fila Secundaria Equilibrada: Email + Cómo llegar + QR */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 46px',
                  gap: '8px',
                  width: '100%',
                }}
              >
                <a
                  href={mailUrl}
                  className="btn btn-outline"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '11px 8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-md)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Mail size={15} />
                  <span>Enviar Email</span>
                </a>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '11px 8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-md)',
                    whiteSpace: 'nowrap',
                  }}
                  title="Ver ubicación del concesionario en Google Maps"
                >
                  <MapPin size={15} />
                  <span>Cómo llegar</span>
                </a>

                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="btn btn-outline"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0',
                    width: '46px',
                    height: '100%',
                    minHeight: '42px',
                    borderRadius: 'var(--radius-md)',
                  }}
                  title="Ver código QR para compartir"
                  aria-label="Ver código QR"
                >
                  <QrCode size={18} />
                </button>
              </div>
            </div>

          </div>
        </header>

        {/* Canal Oficial: Instagram */}
        <section
          style={{
            background: '#ffffff',
            border: '1px solid var(--g10)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            boxShadow: 'var(--shadow-card)',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#05141f',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--g60)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
                Instagram
              </div>
              <a
                href="https://www.instagram.com/kiaelmarques/?utm_source=ig_web_button_share_sheet"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '15.5px',
                  fontWeight: 800,
                  color: 'var(--g100)',
                  textDecoration: 'none',
                }}
              >
                @kiaelmarques
              </a>
            </div>
          </div>

          <a
            href="https://www.instagram.com/kiaelmarques/?utm_source=ig_web_button_share_sheet"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{ padding: '9px 18px', fontSize: '13px', fontWeight: 600 }}
          >
            <ExternalLink size={14} />
            <span>Ver perfil</span>
          </a>
        </section>

        {/* 3. Formulario Comercial Directo con el Asesor */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span className="section-tag" style={{ marginBottom: '8px' }}>Atención Personalizada</span>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--g100)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
              Solicita tu Cotización 0 km con {advisor.name}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--g60)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.5 }}>
              Completa el formulario interactivo para que tu asesor especializado te prepare una cotización formal inmediata con entrega y financiamiento en nuestra sede de El Marqués.
            </p>
          </div>

          <VehicleQuiz advisor={{ name: advisor.name, phone: advisor.phone, slug: advisor.slug }} />
        </section>

        {/* 4. Sección: Fichas Técnicas Oficiales */}
        <section
          style={{
            background: '#ffffff',
            border: '1px solid var(--g10)',
            borderRadius: 'var(--radius-lg)',
            padding: 'clamp(24px, 4vw, 36px)',
            boxShadow: 'var(--shadow-card)',
            marginBottom: '40px',
          }}
        >
          <div style={{ marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--g10)' }}>
            <span className="section-tag" style={{ marginBottom: '4px' }}>Documentación Oficial</span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--g100)', letterSpacing: '-0.01em', marginBottom: '4px' }}>
              Fichas Técnicas
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--g60)', margin: 0 }}>
              Descarga o visualiza las especificaciones técnicas completas de cada modelo Kia disponible en Venezuela.
            </p>
          </div>

          <div className="advisor-fichas-grid">
            {OFFICIAL_FICHAS.map((ficha) => (
              <div
                key={ficha.name}
                style={{
                  background: 'var(--g1)',
                  border: '1px solid var(--g10)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                  transition: 'transform 0.15s, border-color 0.15s',
                }}
              >
                <Link
                  href={`/modelos/${ficha.slug}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none', color: 'inherit' }}
                  title={`Ver ficha técnica digital del Kia ${ficha.name}`}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '46px',
                      borderRadius: '8px',
                      background: '#ffffff',
                      border: '1px solid var(--g10)',
                      position: 'relative',
                      overflow: 'hidden',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Image
                      src={ficha.image}
                      alt={ficha.name}
                      width={64}
                      height={40}
                      style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      loading="lazy"
                    />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--g100)', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>{ficha.name}</span>
                      <ChevronRight size={14} style={{ opacity: 0.4 }} />
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--g60)', marginTop: '2px' }}>
                      {ficha.category}
                    </div>
                  </div>
                </Link>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                  <div className="advisor-ficha-btn-pair">
                    <Link
                      href={`/modelos/${ficha.slug}`}
                      className="btn btn-primary"
                      style={{
                        justifyContent: 'center',
                        padding: '10px 12px',
                        minHeight: '40px',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        gap: '5px',
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                      }}
                      title={`Ver ficha técnica digital de ${ficha.name}`}
                    >
                      <span>Ver Ficha</span>
                      <ChevronRight size={13} />
                    </Link>

                    <a
                      href={ficha.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="btn btn-outline"
                      style={{
                        justifyContent: 'center',
                        padding: '10px 12px',
                        minHeight: '40px',
                        fontSize: '12px',
                        fontWeight: 600,
                        gap: '5px',
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                      }}
                      title={`Descargar catálogo PDF de ${ficha.name}`}
                    >
                      <FileDown size={13} />
                      <span>Descargar PDF</span>
                    </a>
                  </div>

                  <a
                    href={`https://wa.me/${cleanPhone || '584228846784'}?text=${encodeURIComponent(`¡Hola ${firstName}! Me interesa el ${ficha.modelName}. ¿Me brindas cotización y disponibilidad?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={trackAdvisorWhatsAppClick}
                    className="btn"
                    style={{
                      backgroundColor: '#25D366',
                      borderColor: '#25D366',
                      color: '#ffffff',
                      padding: '10px 12px',
                      minHeight: '40px',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      borderRadius: 'var(--radius-sm)',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                    }}
                    title={`Cotizar ${ficha.modelName} por WhatsApp con ${firstName}`}
                  >
                    <MessageCircle size={14} />
                    <span>Cotizar con {firstName}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Modal de Código QR Ampliado */}
      {showQrModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 20, 31, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
          onClick={() => setShowQrModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '32px 26px',
              maxWidth: '380px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'var(--g10)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--g60)',
              }}
              aria-label="Cerrar ventana"
            >
              <X size={16} />
            </button>

            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--g100)', marginBottom: '4px', marginTop: '6px' }}>
              {advisor.name}
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--g60)', marginBottom: '20px' }}>
              Escanea para abrir este perfil y guardar la información del asesor
            </p>

            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--g10)',
                borderRadius: '16px',
                padding: '14px',
                display: 'inline-block',
                boxShadow: 'var(--shadow-card)',
                marginBottom: '18px',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrImageUrl}
                alt={`Código QR de ${advisor.name}`}
                style={{ width: '210px', height: '210px', display: 'block' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={handleCopyLink}
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'center', fontSize: '13px' }}
              >
                {copiedLink ? <Check size={14} color="#25D366" /> : <Copy size={14} />}
                <span>{copiedLink ? '¡Enlace copiado al portapapeles!' : 'Copiar enlace directo'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', fontSize: '13px' }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barra de Acciones Flotante / Dock Responsivo (Activa al hacer scroll y se detiene antes del footer) */}
      <div
        className={`advisor-floating-dock ${showDock ? 'visible' : ''}`}
        style={{ bottom: `${bottomOffset}px` }}
      >
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackAdvisorWhatsAppClick}
          className="advisor-dock-btn-wa"
        >
          <MessageCircle size={18} />
          <span>WhatsApp a {firstName}</span>
        </a>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="advisor-dock-btn-map"
          title="Ver ubicación del concesionario en Google Maps"
        >
          <MapPin size={16} />
          <span>Cómo llegar</span>
        </a>
      </div>

    </div>
  );
}
