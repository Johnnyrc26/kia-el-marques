import Image from 'next/image';
import Link from 'next/link';
import { vehicleModels } from '@/data/models';

export default function ModelsShowroom() {
  return (
    <section id="modelos" className="site-section">
      <div className="shell">
        <div className="section-header">
          <span className="section-tag">Flota Oficial Kia&nbsp;Venezuela</span>
          <h2 className="section-title">Modelos 0&nbsp;km disponibles en&nbsp;El&nbsp;Marqués</h2>
          <p className="section-subtitle">
            Ingeniería de vanguardia, seguridad activa y el respaldo de la garantía oficial Kia. Escoge el vehículo adaptado a tu estilo de vida y a la topografía de&nbsp;Caracas.
          </p>
        </div>

        <div className="models-grid">
          {vehicleModels.map((model) => (
            <article key={model.id} className="model-card">
              <Link href={`/modelos/${model.slug}`} className="model-card-media" style={{ textDecoration: 'none' }}>
                <span className="badge badge-blue model-card-badge">
                  {model.category}
                </span>
                <Image
                  src={model.image}
                  alt={model.name}
                  width={400}
                  height={225}
                  loading="lazy"
                />
              </Link>
              <div className="model-card-body">
                <h3 className="model-card-title">
                  <Link href={`/modelos/${model.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {model.name}
                  </Link>
                </h3>
                <p className="model-card-desc">{model.tagline}</p>
                <ul className="model-specs-list">
                  {model.specs.slice(0, 2).map((spec, idx) => (
                    <li key={idx} className="spec-pill">
                      {spec}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/modelos/${model.slug}`}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '12.5px', padding: '9px 12px' }}
                >
                  Ver Ficha Técnica&nbsp;→
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
