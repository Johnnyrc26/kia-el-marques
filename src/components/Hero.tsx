import Link from 'next/link';
import HeroCarousel from './HeroCarousel';

export default function Hero() {
  return (
    <header className="hero-section">
      <div className="shell hero-shell">
        <div className="hero-content">
          <div>
            <span className="badge badge-gray">
              <span className="badge-dot" style={{ backgroundColor: 'var(--green)' }}></span>
              Concesionario Oficial Kia · Caracas, Venezuela
            </span>
          </div>

          <h1 className="hero-title">
            Estrena tu Kia en&nbsp;Caracas con garantía y&nbsp;total&nbsp;transparencia.
          </h1>

          <p className="hero-lead">
            Ubicados en El&nbsp;Marqués, al pie del Ávila. Vehículos Kia 0&nbsp;km con garantía oficial de fábrica, precios transparentes con impuestos incluidos, financiamiento a medida y&nbsp;entrega&nbsp;inmediata.
          </p>

          <div className="hero-cta-group">
            <Link href="#modelos" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '13.5px' }}>
              Explorar Modelos 0&nbsp;km&nbsp;↓
            </Link>
            {/* Botón Cotización Inmediata - Comentado temporalmente */}
            {/*
            <Link href="#contacto" className="btn btn-outline" style={{ padding: '12px 24px', fontSize: '13.5px' }}>
              Solicitar Cotización Inmediata&nbsp;→
            </Link>
            */}
          </div>

          <div className="hero-stats-row">
            <div className="stat-item">
              <span className="stat-num">8</span>
              <span className="stat-label">Modelos 0 km</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">0 km</span>
              <span className="stat-label">Entrega Inmediata</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">100%</span>
              <span className="stat-label">Garantía de Fábrica</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">5&nbsp;Años</span>
              <span className="stat-label">o 100.000&nbsp;km</span>
            </div>
          </div>
        </div>

        <div className="hero-visual-wrap">
          <HeroCarousel />
        </div>
      </div>
    </header>
  );
}
