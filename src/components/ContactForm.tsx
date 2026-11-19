'use client';

import { useState } from 'react';
import { ADVISORS } from '@/data/advisors';
import { MessageCircle, ShieldCheck, ChevronDown } from 'lucide-react';

export default function ContactForm() {
  const [selectedSlug, setSelectedSlug] = useState('');

  const currentAdvisor = ADVISORS.find((a) => a.slug === selectedSlug);
  const cleanPhone = currentAdvisor ? currentAdvisor.phone.replace(/[^0-9]/g, '') : '584228846784';
  const waText = encodeURIComponent(
    currentAdvisor
      ? `¡Hola ${currentAdvisor.name}! Te contacto desde la web oficial de Kia El Marqués. Me gustaría recibir asesoría personalizada sobre los modelos 0 km y planes de financiamiento.`
      : `¡Hola Kia El Marqués! Te contacto desde la web oficial. Me gustaría recibir asesoría sobre disponibilidad de vehículos 0 km y cotización formal.`
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
        <span>Atención Oficial</span>
      </div>

      <h4 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--g100)', marginBottom: '6px' }}>
        Selecciona un asesor para hablar
      </h4>
      <p style={{ fontSize: '13px', color: 'var(--g60)', lineHeight: 1.5, marginBottom: '18px' }}>
        Elige con quién deseas comunicarte para recibir cotización formal o agendar tu prueba de manejo en Caracas:
      </p>

      {/* Selector Dropdown */}
      <div style={{ marginBottom: '16px' }}>
        <label
          style={{
            fontSize: '12.5px',
            fontWeight: 700,
            color: 'var(--g90)',
            display: 'block',
            marginBottom: '6px',
          }}
        >
          Elige a tu asesor comercial:
        </label>
        <div style={{ position: 'relative', width: '100%' }}>
          <select
            value={selectedSlug}
            onChange={(e) => setSelectedSlug(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 42px 12px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--g20)',
              fontSize: '14px',
              fontFamily: 'var(--sans)',
              fontWeight: 600,
              color: selectedSlug ? 'var(--g100)' : 'var(--g60)',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              outline: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              lineHeight: 1.5,
              boxShadow: 'var(--shadow-subtle)',
            }}
          >
            <option value="" disabled selected>
              -- Elige a tu asesor comercial --
            </option>
            {ADVISORS.map((a) => (
              <option key={a.slug} value={a.slug} style={{ color: 'var(--g100)' }}>
                {a.name} · {a.role}
              </option>
            ))}
          </select>
          <div
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--g60)',
            }}
          >
            <ChevronDown size={18} strokeWidth={2.2} />
          </div>
        </div>
      </div>

      {/* Single Main Action Button */}
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
          padding: '14px 20px',
          fontSize: '14.5px',
          fontWeight: 800,
          borderRadius: '10px',
          textDecoration: 'none',
          boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)',
          marginBottom: '14px',
          transition: 'all 0.15s ease',
        }}
      >
        <MessageCircle size={18} />
        <span>
          {currentAdvisor
            ? `Hablar con ${currentAdvisor.name} por WhatsApp ↗`
            : 'Hablar con un Asesor por WhatsApp ↗'}
        </span>
      </a>

      {/* Discreet Central Line */}
      <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--g60)' }}>
        O comunícate a la recepción:{' '}
        <a
          href="https://wa.me/584228846784?text=Hola%20Kia%20El%20Marqu%C3%A9s,%20deseo%20comunicarme%20con%20la%20sala%20de%20ventas."
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--g100)', fontWeight: 700, textDecoration: 'none' }}
        >
          +58 422 884 6784 ↗
        </a>
      </div>
    </div>
  );
}
