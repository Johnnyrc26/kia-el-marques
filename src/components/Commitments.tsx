import { operationalCommitments } from '@/data/commitments';

export default function Commitments() {
  return (
    <section id="compromisos" className="site-section" style={{ background: '#ffffff', borderBlock: '1px solid var(--g10)' }}>
      <div className="shell">
        <div className="section-header">
          <span className="section-tag">Estándares Verificables</span>
          <h2 className="section-title">El estándar operativo de Kia El Marqués</h2>
          <p className="section-subtitle">
            En un mercado donde los vehículos son idénticos entre concesionarios, marcamos la diferencia con transparencia radical, rapidez de atención y certidumbre en cada etapa.
          </p>
        </div>

        <div className="pillars-grid">
          {operationalCommitments.map((item, index) => (
            <div key={index} className="pillar-card">
              <span className="pillar-num">{item.number}</span>
              <h3 className="pillar-title">{item.title}</h3>
              <p className="pillar-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
