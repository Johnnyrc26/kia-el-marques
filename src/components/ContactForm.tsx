'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ADVISORS } from '@/data/advisors';
import { MessageCircle, ShieldCheck, ChevronRight, Phone } from 'lucide-react';

export default function ContactForm() {
  const [selectedSlug, setSelectedSlug] = useState(ADVISORS[0].slug);

  const currentAdvisor = ADVISORS.find((a) => a.slug === selectedSlug) || ADVISORS[0];
  const cleanPhone = currentAdvisor.phone.replace(/[^0-9]/g, '');
  const waText = encodeURIComponent(
    `¡Hola ${currentAdvisor.name}! Te contacto desde la web oficial de Kia El Marqués. Me gustaría recibir asesoría personalizada sobre los modelos 0 km y planes de financiamiento.`
  );
  const waUrl = `https://wa.me/${cleanPhone}?text=${waText}`;

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid var(--g10)',
        borderRadius: 'var(--radius-lg)',
        padding: 'clamp(20px, 3vw, 28px)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--blue-bg)',
          color: 'var(--blue)',
          padding: '4px 10px',
          borderRadius: '999px',
          fontSize: '11.5px',
          fontWeight: 700,
          marginBottom: '10px',
        }}
      >
        <ShieldCheck size={13} />
        <span>Atención Oficial Inmediata</span>
      </div>

      <h4 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--g100)', marginBottom: '6px' }}>
        Selecciona un asesor para hablar
      </h4>
      <p style={{ fontSize: '13px', color: 'var(--g60)', lineHeight: 1.5, marginBottom: '16px' }}>
        Elige a tu asesor de confianza para chatear directamente por WhatsApp, cotizar o agendar tu prueba de manejo en Caracas:
      </p>

      {/* Selector Dropdown for Mobile / Fast Pick */}
      <div style={{ marginBottom: '14px' }}>
        <label
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--g80)',
            display: 'block',
            marginBottom: '6px',
          }}
        >
          Asesor Comercial Certificado:
        </label>
        <select
          value={selectedSlug}
          onChange={(e) => setSelectedSlug(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--g20)',
            fontSize: '13.5px',
            fontFamily: 'var(--sans)',
            fontWeight: 600,
            color: 'var(--g100)',
            backgroundColor: 'var(--g1)',
            cursor: 'pointer',
          }}
        >
          {ADVISORS.map((a) => (
            <option key={a.slug} value={a.slug}>
              {a.name} · {a.role}
            </option>
          ))}
        </select>
      </div>

      {/* Quick Avatars Chips */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          marginBottom: '18px',
        }}
      >
        {ADVISORS.map((a) => {
          const isSelected = a.slug === selectedSlug;
          const initials = a.name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();

          return (
            <button
              key={a.slug}
              type="button"
              onClick={() => setSelectedSlug(a.slug)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                border: isSelected ? '2px solid var(--g100)' : '1px solid var(--g10)',
                background: isSelected ? 'var(--g1)' : '#ffffff',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isSelected ? 'var(--g100)' : 'var(--g20)',
                  color: isSelected ? '#ffffff' : 'var(--g90)',
                  fontSize: '11px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div
                  style={{
                    fontSize: '11.5px',
                    fontWeight: isSelected ? 800 : 600,
                    color: 'var(--g100)',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                >
                  {a.name.split(' ')[0]}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Highlighted Selected Advisor Card */}
      <div
        style={{
          background: 'var(--g1)',
          border: '1px solid var(--g10)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}
        >
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--g100)' }}>
              {currentAdvisor.name}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--g60)', fontWeight: 500 }}>
              {currentAdvisor.role}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              color: 'var(--green)',
              fontWeight: 700,
              background: 'var(--green-bg)',
              padding: '3px 8px',
              borderRadius: '999px',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green)' }} />
            <span>En línea</span>
          </div>
        </div>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{
            width: '100%',
            backgroundColor: '#25D366',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 16px',
            fontSize: '13.5px',
            fontWeight: 800,
            borderRadius: '10px',
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(37, 211, 102, 0.25)',
            marginBottom: '8px',
          }}
        >
          <MessageCircle size={16} />
          <span>Hablar con {currentAdvisor.name.split(' ')[0]} por WhatsApp ↗</span>
        </a>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
          <Link
            href={`/asesor/${currentAdvisor.slug}`}
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--blue)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>Ver perfil y catálogo digital</span>
            <ChevronRight size={13} />
          </Link>
          <span style={{ fontSize: '11.5px', color: 'var(--g60)', fontWeight: 500 }}>
            {currentAdvisor.phoneFormatted}
          </span>
        </div>
      </div>

      {/* Central Line Backup */}
      <div
        style={{
          borderTop: '1px solid var(--g10)',
          paddingTop: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11.5px',
          color: 'var(--g60)',
        }}
      >
        <span>¿Línea directa de recepción?</span>
        <a
          href="https://wa.me/584228846784?text=Hola%20Kia%20El%20Marqu%C3%A9s,%20deseo%20comunicarme%20con%20la%20sala%20de%20ventas."
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontWeight: 700,
            color: 'var(--g100)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Phone size={12} />
          <span>+58 422 884 6784 ↗</span>
        </a>
      </div>
    </div>
  );
}
