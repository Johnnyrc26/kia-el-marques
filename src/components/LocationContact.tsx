import ContactForm from './ContactForm';
import { MapPin, Navigation, Clock, ShieldCheck, Mail, Phone, ExternalLink } from 'lucide-react';

export default function LocationContact() {
  return (
    <section id="contacto" className="site-section" style={{ background: '#ffffff', borderTop: '1px solid var(--g10)' }}>
      <div className="shell">
        {/* Section Header */}
        <div className="section-header" style={{ marginBottom: '32px' }}>
          <span className="badge badge-blue" style={{ marginBottom: '12px' }}>
            <MapPin size={14} /> Concesionario Oficial&nbsp;Caracas
          </span>
          <h2 className="section-title">
            Visítanos en Kia&nbsp;El&nbsp;Marqués
          </h2>
          <p className="section-subtitle" style={{ maxWidth: '780px' }}>
            Estamos situados en la Av.&nbsp;Rómulo Gallegos, Caracas 1073, Distrito Capital. Showroom de flota 0&nbsp;km, asesoría directa de fábrica y taller de servicio&nbsp;especializado.
          </p>
        </div>

        {/* Official Banner */}
        <div className="official-points-banner" style={{
          background: 'linear-gradient(135deg, #05141f 0%, #0d2232 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 10px 25px -5px rgba(5, 20, 31, 0.2)'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '5px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700, marginBottom: '10px' }}>
              <ShieldCheck size={14} className="text-blue" />
              <span>Concesionario Autorizado Kia&nbsp;Venezuela</span>
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
              Kia El&nbsp;Marqués · Caracas
            </h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.5, maxWidth: '640px' }}>
              Av.&nbsp;Rómulo Gallegos, Caracas 1073, Distrito Capital. Atención personalizada, entrega de vehículos 0&nbsp;km con garantía oficial de 5&nbsp;años o 100.000&nbsp;km y repuestos&nbsp;genuinos.
            </p>
          </div>

          {/* Botón Agendar Visita WhatsApp - Comentado temporalmente */}
          {/*
          <a
            href="https://wa.me/584228846784?text=Hola%20Kia%20El%20Marqu%C3%A9s,%20deseo%20agendar%20una%20visita%20al%20showroom."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ backgroundColor: '#25D366', color: '#fff', padding: '12px 24px', fontSize: '13.5px' }}
          >
            Agendar Visita al&nbsp;Showroom&nbsp;↗
          </a>
          */}
        </div>

        {/* Map & Contact Form Grid */}
        <div className="location-grid-layout">
          {/* Left: Map & Location details */}
          <div className="location-details-col">
            {/* Google Maps Embed */}
            <div className="map-frame-wrapper">
              <iframe
                src="https://maps.google.com/maps?q=10.4950722,-66.8117436&t=&z=17&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="320"
                style={{ border: 0, display: 'block', borderRadius: 'var(--radius-md)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa de ubicación Kia El Marqués Caracas"
              />
              <div className="map-external-cta">
                <a
                  href="https://maps.app.goo.gl/VSse49KmZ6AMWpnZ8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-block"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Navigation size={14} />
                  <span>Abrir cómo llegar en Google Maps ↗</span>
                </a>
              </div>
            </div>

            {/* Practical Info List */}
            <ul className="contact-meta-list" style={{ marginTop: '20px' }}>
              <li>
                <MapPin size={16} className="contact-icon" />
                <div>
                  <strong>Dirección exacta:</strong>
                  <span>Kia El Marqués, Av. Rómulo Gallegos, Caracas 1073, Distrito Capital.</span>
                </div>
              </li>
              <li>
                <Clock size={16} className="contact-icon" />
                <div>
                  <strong>Horario de Atención:</strong>
                  <span>Lunes a Viernes de 8:00 AM a 5:00 PM · Sábados de 9:00 AM a 2:00 PM.</span>
                </div>
              </li>
              <li>
                <Mail size={16} className="contact-icon" />
                <div>
                  <strong>Contacto Oficial:</strong>
                  <a href="mailto:marketing@kiaelmarques.com" style={{ color: 'var(--g100)', fontWeight: 700, marginLeft: '6px' }}>
                    marketing@kiaelmarques.com
                  </a>
                </div>
              </li>
              <li>
                <ExternalLink size={16} className="contact-icon" />
                <div>
                  <strong>Portal Nacional:</strong>
                  <a href="https://kia.com.ve" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--g100)', fontWeight: 700, marginLeft: '6px' }}>
                    kia.com.ve ↗
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Right: Contact Form */}
          <div className="location-form-col">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
