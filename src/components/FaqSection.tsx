'use client';

import { useState } from 'react';
import { faqsData } from '@/data/faqs';
import { ChevronDown } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="site-section">
      <div className="shell">
        <div className="section-header" style={{ textAlign: 'center', marginInline: 'auto' }}>
          <span className="section-tag">Preguntas Frecuentes · DARE&nbsp;Knowledge</span>
          <h2 className="section-title">Respuestas directas sobre Kia&nbsp;El&nbsp;Marqués</h2>
          <p className="section-subtitle">
            Información verificada para compradores, financiamiento, posventa y motores de búsqueda&nbsp;de&nbsp;IA.
          </p>
        </div>

        <div className="faq-container">
          {faqsData.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className={`faq-card-box ${isOpen ? 'is-active' : ''}`}>
                <button
                  type="button"
                  className="faq-toggle-btn"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="faq-question-text">{faq.question}</span>
                  <ChevronDown
                    size={18}
                    className={`faq-icon-chevron ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div id={`faq-answer-${index}`} className="faq-content-pane">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
