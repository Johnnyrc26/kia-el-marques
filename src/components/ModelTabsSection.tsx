'use client';

import { useState } from 'react';
import Link from 'next/link';
import { VehicleModel } from '@/types';
import { ADVISORS } from '@/data/advisors';
import {
  Wrench,
  Briefcase,
  ShieldCheck,
  Layers,
  CheckCircle2,
  FileDown,
  Palette,
  Sparkles,
  Car,
  PhoneCall,
  MessageCircle,
  UserCheck,
  Users,
  X,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface ModelTabsSectionProps {
  model: VehicleModel;
}

export default function ModelTabsSection({ model }: ModelTabsSectionProps) {
  const [activeTab, setActiveTab] = useState<'tecnica' | 'comercial'>('comercial');
  const [showAdvisorModal, setShowAdvisorModal] = useState(false);

  return (
    <section className="editorial-card model-tabs-section" id="especificaciones">
      {/* Tabs Switcher Header */}
      <div className="model-tabs-nav" role="tablist" aria-label="Información del vehículo">
        <button
          type="button"
          role="tab"
          id="tab-tecnica"
          aria-selected={activeTab === 'tecnica'}
          aria-controls="panel-tecnica"
          onClick={() => setActiveTab('tecnica')}
          className={`model-tab-btn ${activeTab === 'tecnica' ? 'is-active' : ''}`}
        >
          <Wrench size={16} aria-hidden="true" />
          <span className="model-tab-title">Ficha Técnica</span>
        </button>

        <button
          type="button"
          role="tab"
          id="tab-comercial"
          aria-selected={activeTab === 'comercial'}
          aria-controls="panel-comercial"
          onClick={() => setActiveTab('comercial')}
          className={`model-tab-btn ${activeTab === 'comercial' ? 'is-active' : ''}`}
        >
          <Briefcase size={16} aria-hidden="true" />
          <span className="model-tab-title">Ficha Comercial</span>
        </button>
      </div>

      {/* Tab Panel 1: Ficha Técnica (Especificaciones de Fábrica) */}
      {activeTab === 'tecnica' && (
        <div
          id="panel-tecnica"
          role="tabpanel"
          aria-labelledby="tab-tecnica"
          className="model-tab-panel animate-fade-in"
        >
          <div className="tab-panel-header">
            <div className="tab-panel-title-group">
              <div className="tab-panel-badge-row">
                <span className="badge badge-blue">
                  <Wrench size={13} aria-hidden="true" />
                  <span>Especificaciones de Fábrica</span>
                </span>
                <span className="badge badge-gray">
                  <span>Datos Oficiales Homologados</span>
                </span>
              </div>
              <h2 className="tab-panel-title">
                Ficha Técnica Completa · {model.name}
              </h2>
              <p className="tab-panel-desc">
                Cifras oficiales de ingeniería, tren motriz, dimensiones y equipamiento de seguridad homologado para&nbsp;Venezuela.
              </p>
            </div>

            {/* Botón Descargar PDF Técnico */}
            {model.sheetPdf && (
              <a
                href={model.sheetPdf}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline tab-download-btn"
                title={`Descargar Ficha Técnica en PDF de ${model.name}`}
              >
                <FileDown size={15} />
                <span>Descargar PDF Técnico ↓</span>
              </a>
            )}
          </div>

          {/* Grid 4 Cajas Principales */}
          <div className="model-tech-boxes-grid">
            <div className="tech-spec-box">
              <span className="tech-spec-label">Motorización</span>
              <strong className="tech-spec-val">{model.technicalSpecs.engine}</strong>
              <span className="tech-spec-sub">Cilindraje: {model.technicalSpecs.displacement}</span>
            </div>

            <div className="tech-spec-box">
              <span className="tech-spec-label">Potencia & Torque</span>
              <strong className="tech-spec-val">{model.technicalSpecs.power}</strong>
              <span className="tech-spec-sub">Torque: {model.technicalSpecs.torque}</span>
            </div>

            <div className="tech-spec-box">
              <span className="tech-spec-label">Transmisión & Tracción</span>
              <strong className="tech-spec-val">{model.technicalSpecs.transmission}</strong>
              <span className="tech-spec-sub">{model.technicalSpecs.traction}</span>
            </div>

            <div className="tech-spec-box">
              <span className="tech-spec-label">Capacidades & Medidas</span>
              <strong className="tech-spec-val">{model.technicalSpecs.trunkCapacity}</strong>
              <span className="tech-spec-sub">Tanque: {model.technicalSpecs.fuelTank} · {model.technicalSpecs.dimensions}</span>
            </div>
          </div>

          {/* Seguridad y Confort en 2 Columnas Móviles */}
          <div className="model-specs-two-col">
            <div className="spec-subgroup">
              <h3 className="spec-subgroup-title">
                <ShieldCheck size={18} className="text-blue" />
                <span>Seguridad Estructural y Asistencias</span>
              </h3>
              <ul className="spec-features-list">
                {model.technicalSpecs.security.map((sec, idx) => (
                  <li key={idx}>{sec}</li>
                ))}
              </ul>
            </div>

            <div className="spec-subgroup">
              <h3 className="spec-subgroup-title">
                <Layers size={18} className="text-blue" />
                <span>Confort, Interior y Conectividad</span>
              </h3>
              <ul className="spec-features-list">
                {model.technicalSpecs.comfortAndTech.map((comf, idx) => (
                  <li key={idx}>{comf}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab Panel 2: Ficha Comercial (Resumen Ejecutivo Homologado) */}
      {activeTab === 'comercial' && (
        <div
          id="panel-comercial"
          role="tabpanel"
          aria-labelledby="tab-comercial"
          className="model-tab-panel animate-fade-in"
        >
          <div className="tab-panel-header">
            <div className="tab-panel-title-group">
              <div className="tab-panel-badge-row">
                <span className="badge badge-green">
                  <Sparkles size={13} aria-hidden="true" />
                  <span>Resumen Ejecutivo Homologado</span>
                </span>
              </div>
              <h2 className="tab-panel-title">
                Propuesta Comercial y Garantía Oficial · {model.name}
              </h2>
              <p className="tab-panel-desc">
                Transparencia total en cada cotización, garantía oficial Kia y asignación directa de unidades para entrega en nuestro concesionario de El&nbsp;Marqués.
              </p>
            </div>

            {/* CTA para invitar a llenar el formulario */}
            <a
              href="#cotizar"
              className="btn btn-primary tab-download-btn"
              title="Solicitar cotización oficial y disponibilidad de inventario"
            >
              <Car size={15} />
              <span>Consultar Disponibilidad ↓</span>
            </a>
          </div>

          <div className="commercial-tab-content-grid">
            {/* Lista de Argumentos Comerciales */}
            <div className="commercial-highlights-block">
              <h3 className="commercial-block-title">
                <ShieldCheck size={17} className="text-blue" />
                <span>Ventajas y Respaldo de Concesionario</span>
              </h3>
              <div className="commercial-highlights-grid">
                {model.commercialHighlights.map((highlight, index) => {
                  const colonIdx = highlight.indexOf(':');
                  const prefix = colonIdx > 0 ? highlight.slice(0, colonIdx).trim() : '';
                  const rest = colonIdx > 0 ? highlight.slice(colonIdx + 1).trim() : highlight;
                  return (
                    <div key={index} className="commercial-highlight-card">
                      <div className="highlight-icon-circle">
                        <CheckCircle2 size={15} className="highlight-check-icon" />
                      </div>
                      <div className="highlight-content">
                        {prefix && <span className="highlight-lead">{prefix}</span>}
                        <span className="highlight-body">{rest}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Colores Oficiales Disponibles */}
            <div className="commercial-colors-block">
              <h3 className="commercial-block-title">
                <Palette size={17} className="text-blue" />
                <span>Colores Oficiales Disponibles</span>
              </h3>
              <p className="commercial-colors-desc">
                Pinturas originales Kia con protección UV para el clima de&nbsp;Caracas:
              </p>

              <div className="commercial-colors-grid">
                {model.availableColors.map((color, idx) => (
                  <div
                    key={idx}
                    className="commercial-color-chip"
                  >
                    <span
                      className="commercial-color-swatch"
                      style={{ backgroundColor: color.hex || '#cbd5e1' }}
                      aria-hidden="true"
                    />
                    <span className="commercial-color-text">{color.name}</span>
                  </div>
                ))}
              </div>

              {/* Tarjeta Destacada de Cotización Integrada */}
              <div className="commercial-cta-card">
                <div className="commercial-cta-body">
                  <div className="commercial-cta-icon-pill">
                    <Car size={14} />
                    <span>Asignación Oficial</span>
                  </div>
                  <h4 className="commercial-cta-title">
                    ¿Deseas consultar unidades disponibles en inventario?
                  </h4>
                  <p className="commercial-cta-desc">
                    Verifica con un asesor comercial la disponibilidad por versión y color, y recibe tu propuesta oficial con desglose de IVA sin compromiso.
                  </p>
                </div>
                <div className="commercial-cta-actions">
                  <button
                    type="button"
                    onClick={() => setShowAdvisorModal(true)}
                    className="btn commercial-cta-btn-advisor"
                  >
                    <MessageCircle size={18} />
                    <span>Consulta Disponibilidad</span>
                  </button>

                  <a
                    href="#cotizar"
                    className="btn commercial-cta-btn-form"
                  >
                    <PhoneCall size={16} />
                    <span>Nosotros te llamamos ↓</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal / Selector de Asesor Oficial */}
      {showAdvisorModal && (
        <div
          className="advisor-modal-overlay"
          onClick={() => setShowAdvisorModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Seleccionar asesor comercial"
        >
          <div
            className="advisor-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="advisor-modal-header">
              <div>
                <span className="badge badge-blue">Equipo Comercial Oficial</span>
                <h3 className="advisor-modal-title">Consulta Disponibilidad</h3>
                <p className="advisor-modal-desc">
                  Atención directa para tu {model.name}. Selecciona a un asesor oficial para consultar disponibilidad por WhatsApp o ver su tarjeta digital:
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAdvisorModal(false)}
                className="advisor-modal-close"
                aria-label="Cerrar ventana"
              >
                <X size={18} />
              </button>
            </div>

            <div className="advisor-modal-list">
              {ADVISORS.map((adv) => {
                const initials = adv.name
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .slice(0, 2);
                const cleanPhone = adv.phone.replace(/[^0-9]/g, '');
                const firstName = adv.name.split(' ')[0] || adv.name;
                const greeting = encodeURIComponent(
                  `¡Hola ${firstName}! Te contacto desde la web oficial de Kia El Marqués para consultar disponibilidad y cotización del Kia ${model.name}.`
                );
                const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${greeting}` : 'https://wa.me/584228846784';

                return (
                  <div key={adv.slug} className="advisor-modal-item">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="advisor-modal-card"
                      onClick={() => setShowAdvisorModal(false)}
                      title={`Chatear con ${adv.name} por WhatsApp`}
                    >
                      <div className="advisor-modal-avatar" style={{ overflow: 'hidden', padding: 0 }}>
                        {adv.photo ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={adv.photo}
                            alt={adv.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: 'center 15%',
                            }}
                          />
                        ) : (
                          initials
                        )}
                      </div>
                      <div className="advisor-modal-info">
                        <strong className="advisor-modal-name">{adv.name}</strong>
                        <span className="advisor-modal-role">{adv.role}</span>
                        <span className="advisor-modal-wa-badge">
                          <MessageCircle size={13} />
                          <span>Chatear por WhatsApp</span>
                        </span>
                      </div>
                      <ChevronRight size={18} className="advisor-modal-arrow" />
                    </a>
                    <Link
                      href={`/asesor/${adv.slug}`}
                      className="advisor-modal-profile-link"
                      onClick={() => setShowAdvisorModal(false)}
                    >
                      <span>Ver perfil oficial</span>
                      <ExternalLink size={12} />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
