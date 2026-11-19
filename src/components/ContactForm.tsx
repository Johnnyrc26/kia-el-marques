'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: 'Solicitud Ficha Comercial',
          phone: phone.trim() || 'No indicado (Solo email)',
          email: email.trim(),
          model_interest: 'General / Ficha Técnica',
          primary_use: 'Interés general catálogo',
          buyer_type: 'Particular',
          favorite_color: 'Por definir',
          financing_interest: 'Por consultar',
          timeline: 'Inmediato',
          notes: 'Registrado desde formulario rápido de pie de página',
        }),
      });
    } catch (err) {
      console.error('Error guardando lead de ficha comercial:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="contact-prompt-box">
      <h4>¿Buscas un modelo específico?</h4>
      <p>
        Indícanos qué modelo Kia es de tu interés y qué plan de financiamiento o entrega deseas consultar en Caracas.
      </p>

      {submitted ? (
        <div style={{ background: 'var(--green-bg)', color: 'var(--green)', border: '1px solid rgba(21, 128, 61, 0.2)', padding: '14px 16px', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            ¡Gracias! Hemos registrado tus datos con éxito. Un asesor comercial de Kia El Marqués te contactará en breve.
          </div>
          <a
            href={`https://wa.me/584228846784?text=${encodeURIComponent(`¡Hola Kia El Marqués! Acabo de solicitar la ficha comercial para mi correo ${email}. ¿Podrían brindarme información directa?`)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#25D366',
              color: '#ffffff',
              padding: '8px 12px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '12px',
              marginTop: '4px',
            }}
          >
            Chatear por WhatsApp ahora ↗
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa tu correo electrónico *"
            required
            style={{
              padding: '10px 14px',
              border: '1px solid var(--g20)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontFamily: 'var(--sans)',
            }}
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="WhatsApp / Teléfono (opcional)"
            style={{
              padding: '10px 14px',
              border: '1px solid var(--g20)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontFamily: 'var(--sans)',
            }}
          />
          <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            {isSubmitting ? 'Enviando...' : 'Solicitar Ficha Comercial'}
          </button>
        </form>
      )}
    </div>
  );
}
