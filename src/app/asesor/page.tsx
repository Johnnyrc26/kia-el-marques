import type { Metadata } from 'next';
import Link from 'next/link';
import { ADVISORS } from '@/data/advisors';
import { MessageCircle, ShieldCheck, ChevronRight, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Equipo de Asesores Comerciales Certificados · Kia El Marqués',
  description:
    'Conoce a nuestros asesores comerciales oficiales en Kia El Marqués, Caracas. Accede a sus tarjetas digitales oficiales de contacto directo.',
};

export default function AsesoresIndexPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--g1)', padding: '60px 16px', fontFamily: 'var(--sans)' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--blue-bg)', color: 'var(--blue)', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, marginBottom: '12px' }}>
            <ShieldCheck size={14} />
            <span>Red Oficial de Asesores · Caracas</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--g100)', letterSpacing: '-0.02em', marginBottom: '10px' }}>
            Nuestros Asesores Comerciales
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--g60)', maxWidth: '520px', margin: '0 auto' }}>
            Atención personalizada, asesoría en financiamiento y entregas de vehículos 0 km en Caracas.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
          {ADVISORS.map((advisor) => {
            const initials = advisor.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase();

            const cleanPhone = advisor.phone.replace(/[^0-9]/g, '');

            return (
              <div
                key={advisor.slug}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--g10)',
                  borderRadius: '16px',
                  padding: '18px',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: 'var(--g100)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '15px',
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {initials}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--g100)', margin: 0 }}>
                      {advisor.name}
                    </h2>
                    <p style={{ fontSize: '11.5px', color: 'var(--blue)', fontWeight: 600, margin: '2px 0 0' }}>
                      {advisor.role}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link
                    href={`/asesor/${advisor.slug}`}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      background: 'var(--g100)',
                      color: '#ffffff',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    <span>Ver Tarjeta</span>
                    <ChevronRight size={13} />
                  </Link>

                  {cleanPhone && (
                    <a
                      href={`https://wa.me/${cleanPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        background: '#25D366',
                        color: '#ffffff',
                        textDecoration: 'none',
                      }}
                      title="Escribir por WhatsApp"
                    >
                      <MessageCircle size={17} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link href="/" className="btn btn-outline" style={{ fontSize: '13px' }}>
            ← Volver al Portal de Kia El Marqués
          </Link>
        </div>

      </div>
    </main>
  );
}
