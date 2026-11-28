import Link from 'next/link';
import { MapPin, Star, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="editorial-footer">
      <div className="shell">
        <div className="footer-content">
          <div className="footer-brand" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <svg
              className="footer-logo"
              viewBox="0 9.15 24 5.65"
              role="img"
              aria-label="Kia"
              style={{ width: '102px', height: '24px', fill: 'var(--g100)', flexShrink: 0 }}
            >
              <path d="M13.923 14.175c0 .046.015.072.041.072a.123.123 0 0 0 .058-.024l7.48-4.854a.72.72 0 0 1 .432-.13h1.644c.252 0 .422.168.422.42v3.139c0 .38-.084.6-.42.801l-1.994 1.2a.137.137 0 0 1-.067.024c-.024 0-.048-.019-.048-.088v-3.663c0-.043-.012-.071-.041-.071a.113.113 0 0 0-.058.024l-5.466 3.551a.733.733 0 0 1-.42.127h-3.624c-.254 0-.422-.168-.422-.422V9.757c0-.033-.015-.064-.044-.064a.118.118 0 0 0-.057.024L7.732 11.88c-.036.024-.046.041-.046.058 0 .014.008.029.032.055l2.577 2.575c.034.034.058.06.058.089 0 .024-.039.043-.084.043H7.94c-.183 0-.324-.026-.423-.125l-1.562-1.56a.067.067 0 0 0-.048-.024.103.103 0 0 0-.048.015l-2.61 1.57a.72.72 0 0 1-.423.122H.425C.168 14.7 0 14.53 0 14.279v-3.08c0-.38.084-.6.422-.8L2.43 9.192a.103.103 0 0 1 .052-.016c.032 0 .048.03.048.1V13.4c0 .043.01.063.041.063a.144.144 0 0 0 .06-.024L9.407 9.36a.733.733 0 0 1 .446-.124h3.648c.252 0 .422.168.422.42l-.002 4.518z"/>
            </svg>
            <div style={{ width: '1px', height: '20px', background: 'var(--g20)', flexShrink: 0 }} aria-hidden="true" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 700, color: 'var(--g100)', fontSize: '15px', letterSpacing: '-0.01em' }}>Kia El Marqués</span>
              <span style={{ color: 'var(--g40)', fontSize: '14px' }}>· Caracas, Venezuela</span>
            </div>
          </div>

          {/* Enlaces Oficiales de Google (Negocio y Reseñas) */}
          <div className="footer-google-group">
            <a
              href="https://share.google/Vl1ICkXSSjf0ITEP2"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-google-badge"
              title="Ver perfil oficial de Kia El Marqués en Google"
            >
              <MapPin size={13} className="footer-google-pin-icon" aria-hidden="true" />
              <span>Ver en Google</span>
              <ExternalLink size={11} className="footer-external-icon" aria-hidden="true" />
            </a>

            <a
              href="https://g.page/r/CbEgGMt-MUbwECA/review"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-google-badge"
              title="Dejar una reseña sobre Kia El Marqués en Google"
            >
              <span className="footer-google-stars" aria-hidden="true">
                <Star size={11} fill="#f59e0b" stroke="#f59e0b" />
                <Star size={11} fill="#f59e0b" stroke="#f59e0b" />
                <Star size={11} fill="#f59e0b" stroke="#f59e0b" />
                <Star size={11} fill="#f59e0b" stroke="#f59e0b" />
                <Star size={11} fill="#f59e0b" stroke="#f59e0b" />
              </span>
              <span>Opiniones en Google</span>
              <ExternalLink size={11} className="footer-external-icon" aria-hidden="true" />
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px' }}>
            <Link href="/politica-de-privacidad" style={{ color: 'var(--g60)' }}>Privacidad</Link>
            <span style={{ color: 'var(--g30)' }}>·</span>
            <Link href="/terminos-y-condiciones" style={{ color: 'var(--g60)' }}>Términos</Link>
          </div>
        </div>

        <div className="footer-disclaimer-row">
          <span>© {currentYear} Kia El Marqués. Concesionario Oficial Autorizado de la Red Kia en Venezuela. Todos los derechos reservados.</span>
          <span>«Movement that inspires» es una marca registrada de Kia Corporation.</span>
        </div>
      </div>
    </footer>
  );
}
