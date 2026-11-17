'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="contact-prompt-box">
      <h4>¿Buscas un modelo específico?</h4>
      <p>
        Indícanos si te interesa Tasman, Sportage, Seltos, Sorento o Picanto, o si necesitas atención para compra desde el exterior.
      </p>

      {submitted ? (
        <div style={{ background: 'var(--green-bg)', color: 'var(--green)', border: '1px solid rgba(21, 128, 61, 0.2)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: 600 }}>
          ¡Gracias! Hemos registrado el correo <strong>{email}</strong>. Un anfitrión se pondrá en contacto para enviarte la ficha técnica y opciones de financiamiento.
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa tu correo electrónico"
            required
            style={{
              padding: '10px 14px',
              border: '1px solid var(--g20)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontFamily: 'var(--sans)',
            }}
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Solicitar Ficha Comercial
          </button>
        </form>
      )}
    </div>
  );
}
