'use client';

import { useState } from 'react';
import { VehicleModel } from '@/types';
import {
  Wrench,
  Briefcase,
  ShieldCheck,
  Layers,
  CheckCircle2,
  FileDown,
  Palette,
  Sparkles,
} from 'lucide-react';

interface ModelTabsSectionProps {
  model: VehicleModel;
}

export default function ModelTabsSection({ model }: ModelTabsSectionProps) {
  const [activeTab, setActiveTab] = useState<'tecnica' | 'comercial'>('comercial');

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

            {/* Botón Descargar PDF Técnico - Comentado temporalmente */}
            {/*
            <a
              href={model.sheetPdf}
              download
              className="btn btn-outline tab-download-btn"
              title="Descargar Ficha Técnica en PDF"
            >
              <FileDown size={15} />
              <span>Descargar PDF Técnico ↓</span>
            </a>
            */}
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
                <span className="badge badge-gray">
                  <span>Entrega Inmediata</span>
                </span>
              </div>
              <h2 className="tab-panel-title">
                Propuesta Comercial y Garantía Oficial · {model.name}
              </h2>
              <p className="tab-panel-desc">
                Condiciones de compra transparente, estándar operativo de Kia El&nbsp;Marqués y opciones de personalización para entrega en&nbsp;Caracas.
              </p>
            </div>

            {/* Botón Descargar Ficha Oficial - Comentado temporalmente */}
            {/*
            <a
              href={model.sheetPdf}
              download
              className="btn btn-primary tab-download-btn"
              title="Descargar Ficha Comercial Oficial"
            >
              <FileDown size={15} />
              <span>Descargar Ficha Oficial PDF ↓</span>
            </a>
            */}
          </div>

          <div className="commercial-tab-content-grid">
            {/* Lista de Argumentos Comerciales */}
            <div className="commercial-highlights-block">
              <h3 className="commercial-block-title">
                <ShieldCheck size={17} className="text-blue" />
                <span>Ventajas y Respaldo de Concesionario</span>
              </h3>
              <ul className="model-highlights-list">
                {model.commercialHighlights.map((highlight, index) => {
                  const colonIdx = highlight.indexOf(':');
                  if (colonIdx > 0) {
                    const prefix = highlight.slice(0, colonIdx);
                    const rest = highlight.slice(colonIdx + 1);
                    return (
                      <li key={index} className="model-highlight-item">
                        <CheckCircle2 size={18} className="highlight-check" />
                        <span>
                          <strong style={{ color: 'var(--g100)', fontWeight: 700 }}>{prefix}:</strong>
                          {rest}
                        </span>
                      </li>
                    );
                  }
                  return (
                    <li key={index} className="model-highlight-item">
                      <CheckCircle2 size={18} className="highlight-check" />
                      <span>{highlight}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Colores Oficiales Disponibles */}
            <div className="commercial-colors-block">
              <h3 className="commercial-block-title">
                <Palette size={17} className="text-blue" />
                <span>Colores Oficiales Disponibles</span>
              </h3>
              <p className="commercial-colors-desc">
                Pinturas multicapa originales Kia con protección UV para el clima de&nbsp;Caracas:
              </p>

              <div className="model-colors-grid">
                {model.availableColors.map((color, idx) => (
                  <div key={idx} className="model-color-chip">
                    <span
                      className="model-color-dot"
                      style={{ backgroundColor: color.hex || '#cbd5e1' }}
                      aria-hidden="true"
                    />
                    <span className="model-color-label">{color.name}</span>
                  </div>
                ))}
              </div>

              {/* Banner Rápido de Cotización - Comentado temporalmente */}
              {/*
              <div className="commercial-cta-callout">
                <div>
                  <strong>¿Deseas cotizar este modelo con tu color preferido?</strong>
                  <p>Te enviamos la proforma con IVA y desglose exacto sin&nbsp;compromiso.</p>
                </div>
                <a
                  href={`https://wa.me/584120000000?text=${encodeURIComponent(`Hola Kia El Marqués, deseo cotizar el ${model.name} con ficha comercial oficial.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Cotizar por WhatsApp ↗
                </a>
              </div>
              */}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
