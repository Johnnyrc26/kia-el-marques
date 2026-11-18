'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, MessageCircle, MapPin, ExternalLink, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { vehicleModels } from '@/data/models';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [modelsDropdownOpen, setModelsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const pathname = usePathname();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setModelsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setModelsDropdownOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const closeAll = () => {
    setIsOpen(false);
    setModelsDropdownOpen(false);
  };

  return (
    <header className="topbar">
      <div className="shell topbar-inner">
        {/* Brand Group */}
        <div className="brand-group">
          <Link href="/elmarques" aria-label="Kia El Marqués Inicio" className="brand-link" onClick={closeAll}>
            <svg 
              className="kia-logo-svg" 
              viewBox="0 9.15 24 5.65" 
              role="img" 
              aria-label="Kia"
              fill="currentColor"
            >
              <path d="M13.923 14.175c0 .046.015.072.041.072a.123.123 0 0 0 .058-.024l7.48-4.854a.72.72 0 0 1 .432-.13h1.644c.252 0 .422.168.422.42v3.139c0 .38-.084.6-.42.801l-1.994 1.2a.137.137 0 0 1-.067.024c-.024 0-.048-.019-.048-.088v-3.663c0-.043-.012-.071-.041-.071a.113.113 0 0 0-.058.024l-5.466 3.551a.733.733 0 0 1-.42.127h-3.624c-.254 0-.422-.168-.422-.422V9.757c0-.033-.015-.064-.044-.064a.118.118 0 0 0-.057.024L7.732 11.88c-.036.024-.046.041-.046.058 0 .014.008.029.032.055l2.577 2.575c.034.034.058.06.058.089 0 .024-.039.043-.084.043H7.94c-.183 0-.324-.026-.423-.125l-1.562-1.56a.067.067 0 0 0-.048-.024.103.103 0 0 0-.048.015l-2.61 1.57a.72.72 0 0 1-.423.122H.425C.168 14.7 0 14.53 0 14.279v-3.08c0-.38.084-.6.422-.8L2.43 9.192a.103.103 0 0 1 .052-.016c.032 0 .048.03.048.1V13.4c0 .043.01.063.041.063a.144.144 0 0 0 .06-.024L9.407 9.36a.733.733 0 0 1 .446-.124h3.648c.252 0 .422.168.422.42l-.002 4.518z"/>
            </svg>
            <div className="brand-divider" aria-hidden="true" />
            <div className="brand-text">
              <span className="brand-title">Kia El Marqués</span>
              <span className="brand-subtitle">Concesionario Oficial · Caracas</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" aria-label="Navegación principal">
          <ul className="nav-links">
            {/* Modelos Mega Dropdown */}
            <li className="nav-item-dropdown" ref={dropdownRef}>
              <button
                type="button"
                className={`nav-link dropdown-toggle ${modelsDropdownOpen ? 'active' : ''}`}
                onClick={() => setModelsDropdownOpen(!modelsDropdownOpen)}
                aria-expanded={modelsDropdownOpen}
                aria-haspopup="true"
              >
                <span>Modelos</span>
                <ChevronDown className={`dropdown-icon ${modelsDropdownOpen ? 'rotate' : ''}`} size={14} />
              </button>

              {modelsDropdownOpen && (
                <div className="models-mega-menu">
                  <div className="mega-menu-header">
                    <div>
                      <span className="mega-menu-title">Gama Oficial Kia Venezuela 2026</span>
                      <p className="mega-menu-desc">Garantía oficial de 5 años o 100.000 km en todos los modelos.</p>
                    </div>
                    <Link href="/elmarques#modelos" className="mega-menu-all-link" onClick={closeAll}>
                      Ver showroom completo <ArrowRight size={14} />
                    </Link>
                  </div>
                  
                  <div className="mega-menu-grid">
                    {vehicleModels.map((m) => (
                      <Link
                        key={m.slug}
                        href={`/modelos/${m.slug}`}
                        className="mega-model-card"
                        onClick={closeAll}
                      >
                        <div className="mega-model-img-wrap">
                          <img src={m.image} alt={m.name} className="mega-model-img" />
                        </div>
                        <div className="mega-model-info">
                          <span className="mega-model-name">{m.name}</span>
                          <span className="mega-model-cat">{m.category}</span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="mega-menu-footer">
                    <div className="mega-footer-item">
                      <ShieldCheck size={16} className="text-blue" />
                      <span>Transparencia total: Precios oficiales con IVA y gastos de ley incluidos.</span>
                    </div>
                  </div>
                </div>
              )}
            </li>

            <li>
              <Link href="/elmarques#faq" className="nav-link" onClick={closeAll}>
                Garantía & FAQs
              </Link>
            </li>
            <li>
              <Link href="/elmarques#contacto" className="nav-link" onClick={closeAll}>
                Ubicación & Mapa
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right CTA Actions */}
        <div className="top-actions">
          <a
            href="https://kia.com.ve"
            className="btn btn-nav-outline"
            target="_blank"
            rel="noopener noreferrer"
            title="Sitio oficial Kia Venezuela"
          >
            <span>kia.com.ve</span>
            <ExternalLink size={12} />
          </a>

          {/* WhatsApp Asesor - Comentado temporalmente */}
          {/*
          <a
            href="https://wa.me/584120000000?text=Hola%20Kia%20El%20Marqu%C3%A9s,%20estoy%20interesado%20en%20conocer%20la%20disponibilidad%20de%20los%20modelos%20Kia."
            className="btn btn-nav-advisor"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="online-indicator" aria-hidden="true" />
            <MessageCircle size={15} />
            <span>Hablar con Asesor</span>
          </a>
          */}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-content shell">
            <div className="mobile-section">
              <span className="mobile-section-title">Modelos Kia (8)</span>
              <div className="mobile-models-grid">
                {vehicleModels.map((m) => (
                  <Link
                    key={m.slug}
                    href={`/modelos/${m.slug}`}
                    className="mobile-model-item"
                    onClick={closeAll}
                  >
                    <img src={m.image} alt={m.name} className="mobile-model-img" />
                    <div>
                      <strong className="mobile-model-name">{m.name}</strong>
                      <span className="mobile-model-cat">{m.category}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mobile-section">
              <span className="mobile-section-title">Explora</span>
              <ul className="mobile-nav-list">
                <li><Link href="/elmarques#modelos" onClick={closeAll}>Modelos Kia 0 km</Link></li>
                <li><Link href="/elmarques#faq" onClick={closeAll}>Garantía Oficial & FAQs</Link></li>
                <li><Link href="/elmarques#contacto" onClick={closeAll}>Ubicación, Mapa y Horarios</Link></li>
              </ul>
            </div>

            <div className="mobile-cta-box">
              {/* WhatsApp Asesor Móvil - Comentado temporalmente */}
              {/*
              <a
                href="https://wa.me/584120000000?text=Hola%20Kia%20El%20Marqu%C3%A9s,%20deseo%20asesor%C3%ADa%20personalizada."
                className="btn btn-primary btn-block"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={16} />
                <span>Escribir por WhatsApp al Asesor</span>
              </a>
              */}
              <a
                href="https://kia.com.ve"
                className="btn btn-outline btn-block"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Visitar kia.com.ve Oficial</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
