'use client';

import { useState, useRef } from 'react';
import { Check, MessageCircle, AlertCircle } from 'lucide-react';
import { vehicleModels } from '@/data/models';
import { LeadSubmission } from '@/types';

interface VehicleQuizProps {
  initialModel?: string;
  onSuccess?: () => void;
  advisor?: {
    name: string;
    phone: string;
    slug?: string;
  };
}

const modelUseCases: Record<string, Array<{ title: string; desc: string }>> = {
  Tasman: [
    { title: 'Trabajo pesado y Agropecuario', desc: 'Resistencia, platón de 1 tonelada, arrastre de 3.500 kg y viajes al campo' },
    { title: 'Aventura Off-road y Expediciones', desc: 'Tracción 4x4 con reductora, 800 mm de vadeo y terrenos difíciles de Venezuela' },
    { title: 'Uso Mixto / Empresa y Familia', desc: 'Fuerza para la semana laboral y confort espacioso para la familia el fin de semana' },
    { title: 'Presencia Imponente y Estatus', desc: 'Estilo audaz, postura imponente y tecnología de última generación' },
  ],
  Sportage: [
    { title: 'Ejecutivo y Representación', desc: 'Estatus profesional, diseño vanguardista global Opposites United y máximo confort' },
    { title: 'Familia Contemporánea', desc: 'Seguridad 5 estrellas Euro NCAP, 591 L de maletero y tecnología intuitiva' },
    { title: 'Movilidad Urbana y Cota Mil', desc: 'Potencia serena de 154 HP para subir la Cota Mil o El Hatillo con aire a full' },
    { title: 'Tecnología y Confort Superior', desc: 'Pantalla curva panorámica, techo de cristal y acabados premium' },
  ],
  Sorento: [
    { title: 'Familia Numerosa (7 Plazas)', desc: '3 filas de asientos reales, climatizador tri-zona y viajes familiares largos' },
    { title: 'Alta Dirección y Estatus Ejecutivo', desc: 'Motor 3.5L V6 con 268 HP, tracción integral inteligente AWD y lujo silencioso' },
    { title: 'Viajes Familiares por Venezuela', desc: 'Seguridad integral, baúl de hasta 821 L y solidez en carretera' },
    { title: 'Empresarial y Representación', desc: 'Presencia imponente para reuniones de directorio y eventos oficiales' },
  ],
  Carnival: [
    { title: 'Transporte VIP Corporativo / Embajadas', desc: 'Oficina móvil definitiva con butacas de primera clase y puertos de carga' },
    { title: 'Familia Grande sin Restricciones', desc: '8 puestos reales, doble techo solar y el máximo confort familiar de Seúl' },
    { title: 'Turismo Premium y Hotelería', desc: 'Traslados de alto nivel con puertas corredizas eléctricas inteligentes' },
    { title: 'Larga Distancia y Confort Absoluto', desc: 'Motor V6 de 268 HP y máxima insonorización de cabina en carretera' },
  ],
  Picanto: [
    { title: 'Ciudad y Tráfico Caraqueño', desc: 'Estaciona donde otros no caben y maniobra ágil en Chacao y Las Mercedes' },
    { title: 'Joven Profesional / Primer 0 km', desc: 'Conectividad Apple CarPlay / Android Auto y consumo mínimo de gasolina' },
    { title: 'Seguridad y Confort Familiar', desc: '6 airbags de serie, manejo ágil y 5 años de garantía oficial en Caracas' },
    { title: 'Segunda Unidad Familiar Práctica', desc: 'Vehículo liviano para diligencias diarias y bajísimo costo de mantenimiento' },
  ],
  Soluto: [
    { title: 'Familia y Confort Diario', desc: 'Maletero gigante de 475 L, espacio para 5 adultos y aire acondicionado de alto rendimiento' },
    { title: 'Flota Corporativa y Movilidad Laboral', desc: 'El menor costo operativo por kilómetro recorrido en Caracas con motor 1.4L' },
    { title: 'Uso Diario Económico en Ciudad', desc: 'Bajo consumo de gasolina para no vivir haciendo colas en la estación de servicio' },
    { title: 'Primer 0 km / Inversión Inteligente', desc: 'Inversión segura, mantenimiento sumamente accesible y respaldo oficial Kia en Caracas' },
  ],
  Sonet: [
    { title: 'Profesional Joven y Urbano', desc: 'Altura SUV con despeje de 205 mm para sortear baches y desniveles de Caracas' },
    { title: 'Familia Joven / Primer SUV', desc: '6 airbags de serie, salidas traseras de A/C y espacio versátil para los chamos' },
    { title: 'Escapadas de Fin de Semana', desc: 'De la oficina en Las Mercedes directo a la playa o Galipán sin límites' },
    { title: 'Conectividad y Estilo Dinámico', desc: 'Pantalla táctil inalámbrica, barras de techo funcionales y motor 1.5L ágil' },
  ],
  Seltos: [
    { title: 'Familia en Crecimiento', desc: '433 L de baúl, espacio generoso para 5 pasajeros y confort de marcha familiar' },
    { title: 'Diseño y Sofisticación Urbana', desc: 'Parrilla Tiger Nose contemporánea, postura atlética y presencia elegante' },
    { title: 'Polivalencia Caracas y Carretera', desc: 'Despeje elevado, motor 1.5L eficiente y seguridad activa para el día a día' },
    { title: 'Respaldo y Tranquilidad Familiar', desc: '6 airbags de serie, control de estabilidad y garantía oficial de 100.000 km' },
  ],
};

export default function VehicleQuiz({ initialModel, advisor }: VehicleQuizProps) {
  const chosenModel = initialModel || 'Tasman';
  const initialUse = modelUseCases[chosenModel]?.[0]?.title || 'Familia / Paseo';
  const initialColor = vehicleModels.find((m) => m.name === chosenModel)?.availableColors[0]?.name || 'Blanco Perlado (Clear White)';

  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState<LeadSubmission>({
    model_interest: chosenModel,
    primary_use: initialUse,
    buyer_type: 'Cliente Particular',
    favorite_color: initialColor,
    financing_interest: 'Crédito bancario nacional',
    timeline: 'Inmediato (este mes)',
    full_name: '',
    phone: '',
    email: '',
    notes: '',
    advisor_name: advisor?.name,
    advisor_slug: advisor?.slug,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ full_name?: string; phone?: string }>({});

  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (field: keyof LeadSubmission, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field as 'full_name' | 'phone']) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { full_name?: string; phone?: string } = {};
    if (!formData.full_name.trim()) {
      errors.full_name = 'Por favor ingresa tu nombre y apellido.';
    }
    const cleanPhoneDigits = formData.phone.replace(/[^0-9]/g, '');
    if (!formData.phone.trim()) {
      errors.phone = 'Por favor ingresa tu número de WhatsApp.';
    } else if (cleanPhoneDigits.length < 7) {
      errors.phone = 'Ingresa un número de WhatsApp válido (mínimo 7 dígitos).';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMsg('Por favor completa los campos requeridos para continuar.');
      if (errors.full_name) {
        nameInputRef.current?.focus();
      } else if (errors.phone) {
        phoneInputRef.current?.focus();
      }
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setFieldErrors({});

    const targetPhone = advisor?.phone ? advisor.phone.replace(/[^0-9]/g, '') : '584228846784';
    const cleanName = formData.full_name.trim();

    // Redacción limpia y profesional de WhatsApp con formato nativo en negrita (*texto*)
    const messageLines = [
      advisor
        ? `¡Hola ${advisor.name}! Mi nombre es ${cleanName}. Acabo de completar tu cuestionario digital en Kia El Marqués para el ${formData.model_interest}.`
        : `¡Hola Kia El Marqués! Mi nombre es ${cleanName}. Acabo de completar el cuestionario digital para el ${formData.model_interest}.`,
      '',
      '*Mis preferencias:*',
      `• Modelo: ${formData.model_interest} (${formData.favorite_color || 'Color a coordinar'})`,
      `• Uso principal: ${formData.primary_use}`,
      `• Segmento: ${formData.buyer_type}`,
      `• Financiamiento: ${formData.financing_interest}`,
      `• Plazo de compra: ${formData.timeline}`,
      `• Teléfono: ${formData.phone.trim()}`,
    ];

    if (formData.email?.trim()) {
      messageLines.push(`• Email: ${formData.email.trim()}`);
    }

    messageLines.push('');
    messageLines.push('¿Podrías brindarme tu asesoría personalizada y cotización formal?');

    const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(messageLines.join('\n'))}`;

    const leadPayload: LeadSubmission = {
      ...formData,
      advisor_name: advisor?.name || undefined,
      advisor_slug: advisor?.slug || undefined,
      notes: advisor
        ? `${formData.notes ? `${formData.notes} | ` : ''}Solicitud recibida desde tarjeta del asesor: ${advisor.name} (/asesor/${advisor.slug})`
        : formData.notes,
    };

    // 1. Respaldo local de seguridad en el navegador del cliente
    try {
      localStorage.setItem('kia_backup_lead', JSON.stringify({ ...leadPayload, sent_at: new Date().toISOString() }));
    } catch {
      // ignorar fallo de almacenamiento local
    }

    // 2. Envío garantizado al servidor con keepalive
    try {
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload),
        keepalive: true,
      }).catch((err) => console.error('Background leads save:', err));
    } catch (err) {
      console.error('Error enviando al admin:', err);
    }

    // 3. Abrir WhatsApp de inmediato
    try {
      if (typeof window !== 'undefined') {
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isMobile) {
          window.location.href = waUrl;
        } else {
          window.open(waUrl, '_blank');
        }
      }
    } catch {
      // Si el navegador bloquea la apertura emergente, el botón visible estará listo
    }

    setSubmitted(true);
    setIsSubmitting(false);
  };

  if (submitted) {
    const targetPhone = advisor?.phone ? advisor.phone.replace(/[^0-9]/g, '') : '584228846784';
    const cleanName = formData.full_name.trim();

    const messageLines = [
      advisor
        ? `¡Hola ${advisor.name}! Mi nombre es ${cleanName}. Acabo de completar tu cuestionario digital en Kia El Marqués para el ${formData.model_interest}.`
        : `¡Hola Kia El Marqués! Mi nombre es ${cleanName}. Acabo de completar el cuestionario digital para el ${formData.model_interest}.`,
      '',
      '*Mis preferencias:*',
      `• Modelo: ${formData.model_interest} (${formData.favorite_color || 'Color a coordinar'})`,
      `• Uso principal: ${formData.primary_use}`,
      `• Segmento: ${formData.buyer_type}`,
      `• Financiamiento: ${formData.financing_interest}`,
      `• Plazo de compra: ${formData.timeline}`,
      `• Teléfono: ${formData.phone.trim()}`,
    ];

    if (formData.email?.trim()) {
      messageLines.push(`• Email: ${formData.email.trim()}`);
    }

    messageLines.push('');
    messageLines.push('¿Podrías brindarme tu asesoría personalizada y cotización formal?');

    const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(messageLines.join('\n'))}`;

    return (
      <div className="editorial-box" style={{ textAlign: 'center', padding: '40px 24px', background: 'var(--g1)', borderRadius: 'var(--radius-lg)' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            boxShadow: '0 0 0 8px rgba(16, 185, 129, 0.15), 0 10px 25px -5px rgba(16, 185, 129, 0.3)',
            color: '#ffffff',
            marginBottom: '20px',
          }}
        >
          <Check size={32} strokeWidth={3} />
        </div>
        <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--g100)', marginBottom: '8px' }}>
          {advisor
            ? `¡Excelente, ${cleanName}! Tu solicitud fue registrada con ${advisor.name}.`
            : `¡Excelente, ${cleanName}! Hemos recibido tus preferencias.`}
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--g60)', maxWidth: '520px', margin: '0 auto 24px', lineHeight: 1.6 }}>
          {advisor
            ? `Tus datos ya están guardados en el sistema del concesionario. Si WhatsApp no se abrió automáticamente en tu dispositivo, pulsa el botón verde para iniciar el chat directo con ${advisor.name}:`
            : `Tus preferencias para el ${formData.model_interest} fueron registradas en el sistema. Pulsa abajo para continuar la conversación directa por WhatsApp:`}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', maxWidth: '380px', margin: '0 auto' }}>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{
              padding: '14px 28px',
              fontSize: '15px',
              fontWeight: 800,
              backgroundColor: '#25D366',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              borderRadius: '10px',
              width: '100%',
              boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
              textDecoration: 'none',
              color: '#ffffff',
            }}
          >
            <span>{advisor ? `Abrir WhatsApp con ${advisor.name} ↗` : 'Abrir WhatsApp Oficial ↗'}</span>
          </a>
          <span style={{ fontSize: '12px', color: 'var(--g60)' }}>
            ✓ Conexión encriptada directa con el concesionario oficial
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-box" style={{ background: '#ffffff', border: '1px solid var(--g10)', borderRadius: 'var(--radius-lg)', padding: 'clamp(20px, 4vw, 36px)', boxShadow: 'var(--shadow-card)' }}>
      {/* Quiz Progress */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--g10)' }}>
        <div>
          <span className="badge badge-blue">{advisor ? `Asesoría Directa · ${advisor.name}` : 'Asesoría Inteligente Kia'}</span>
          <span style={{ fontSize: '12px', color: 'var(--g60)', marginLeft: '10px' }}>
            Paso {step} de {totalSteps}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              style={{
                width: '18px',
                height: '4px',
                borderRadius: '2px',
                backgroundColor: i + 1 <= step ? 'var(--g100)' : 'var(--g10)',
                transition: 'background-color 0.2s',
              }}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Modelo de Interés */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: 'var(--g100)', marginBottom: '8px' }}>
              ¿Qué modelo Kia te apasiona o deseas cotizar?
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--g60)', marginBottom: '18px' }}>
              Selecciona el vehículo que mejor se ajusta a lo que tienes en mente:
            </p>
            <div className="quiz-models-grid">
              {vehicleModels.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => {
                    const modelCases = modelUseCases[m.name] || modelUseCases['Tasman'];
                    setFormData((prev) => ({
                      ...prev,
                      model_interest: m.name,
                      primary_use: modelCases[0]?.title || prev.primary_use,
                      favorite_color: m.availableColors[0]?.name || prev.favorite_color,
                    }));
                    setStep(2);
                  }}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: formData.model_interest === m.name ? '2px solid var(--g100)' : '1px solid var(--g10)',
                    background: formData.model_interest === m.name ? 'var(--g1)' : '#ffffff',
                    fontWeight: 700,
                    fontSize: '14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: 'var(--g100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: '15px', fontWeight: 800, fontFamily: 'var(--font-kia)' }}>{m.name}</span>
                  <span style={{ fontSize: '11.5px', color: 'var(--blue)', fontWeight: 600 }}>Elegir&nbsp;→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Propósito de uso consecuente con el vehículo seleccionado */}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-blue">{formData.model_interest}</span>
              <span style={{ fontSize: '12px', color: 'var(--g60)' }}>Configuración personalizada</span>
            </div>
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: 'var(--g100)', marginBottom: '8px' }}>
              ¿Cuál será el uso principal de tu {formData.model_interest}?
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--g60)', marginBottom: '18px' }}>
              Nos ayuda a recomendarte la versión con la mejor motorización y equipamiento para tu día a día:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              {(modelUseCases[formData.model_interest] || modelUseCases['Tasman']).map((opt) => (
                <button
                  type="button"
                  key={opt.title}
                  onClick={() => handleSelect('primary_use', opt.title)}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: formData.primary_use === opt.title ? '2px solid var(--g100)' : '1px solid var(--g10)',
                    background: formData.primary_use === opt.title ? 'var(--g1)' : '#ffffff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: 'var(--g100)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '14px', marginBottom: '4px' }}>{opt.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--g60)', lineHeight: 1.4 }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Color Favorito Consecuente con el Modelo */}
        {step === 3 && (() => {
          const currentModelData = vehicleModels.find(
            (m) => m.name.toLowerCase() === formData.model_interest.toLowerCase()
          ) || vehicleModels[0];
          const availableColorsList = [
            ...currentModelData.availableColors,
            { name: 'Cualquiera disponible primero en piso', hex: '#64748b' },
          ];

          return (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-blue">{formData.model_interest}</span>
                <span style={{ fontSize: '12px', color: 'var(--g60)' }}>Pinturas Oficiales Homologadas</span>
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: 800, color: 'var(--g100)', marginBottom: '8px' }}>
                ¿Cuál es tu color preferido para el {formData.model_interest}?
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--g60)', marginBottom: '18px' }}>
                Pinturas multicapa originales Kia con protección UV para el clima de Caracas:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                {availableColorsList.map((c) => (
                  <button
                    type="button"
                    key={c.name}
                    onClick={() => handleSelect('favorite_color', c.name)}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: formData.favorite_color === c.name ? '2px solid var(--g100)' : '1px solid var(--g10)',
                      background: formData.favorite_color === c.name ? 'var(--g1)' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: c.hex,
                        border: '1px solid rgba(0,0,0,0.15)',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--g100)' }}>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Step 4: Financiamiento y Tiempos */}
        {step === 4 && (
          <div>
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: 'var(--g100)', marginBottom: '8px' }}>
              Modalidad de pago y tiempo de compra
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--g60)', marginBottom: '18px' }}>
              Te orientamos con la opción más favorable para tu presupuesto:
            </p>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--g90)', display: 'block', marginBottom: '8px' }}>
                Forma de pago de tu interés:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                {[
                  'Crédito bancario nacional',
                  'Financiamiento directo con concesionario (con fiador)',
                  'Pago de contado / Transferencia directa',
                  'Deseo conocer ambas opciones de crédito',
                ].map((fin) => (
                  <button
                    type="button"
                    key={fin}
                    onClick={() => handleSelect('financing_interest', fin)}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      border: formData.financing_interest === fin ? '2px solid var(--g100)' : '1px solid var(--g10)',
                      background: formData.financing_interest === fin ? 'var(--g1)' : '#ffffff',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: 'var(--g100)',
                    }}
                  >
                    {fin}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--g90)', display: 'block', marginBottom: '8px' }}>
                ¿Para cuándo estimas concretar?
              </label>
              <div className="quiz-timeline-grid">
                {[
                  { value: 'Inmediato (este mes)', title: 'Inmediato', desc: 'Menos de 30 días' },
                  { value: 'En 1 a 3 meses', title: '1 a 3 meses', desc: 'Próxima compra' },
                  { value: 'Explorando opciones', title: 'Explorando', desc: 'Planificando a futuro' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.value}
                    onClick={() => handleSelect('timeline', item.value)}
                    className={`quiz-timeline-btn ${formData.timeline === item.value ? 'active' : ''}`}
                  >
                    <span className="quiz-timeline-title">{item.title}</span>
                    <span className="quiz-timeline-desc">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Datos de Contacto */}
        {step === 5 && (
          <div>
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: 'var(--g100)', marginBottom: '8px' }}>
              ¿A dónde te enviamos la ficha técnica y cotización formal?
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--g60)', marginBottom: '18px' }}>
              Un anfitrión oficial de Kia El Marqués te contactará en menos de 15 minutos sin llamadas insistentes ni spam:
            </p>

            <div className="quiz-name-phone-row">
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--g90)', display: 'block', marginBottom: '6px' }}>
                  Nombre y Apellido *
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  placeholder="Ej. Carlos Mendoza"
                  value={formData.full_name}
                  onChange={(e) => handleSelect('full_name', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: fieldErrors.full_name ? '2px solid var(--kia-red)' : '1px solid var(--g20)',
                    backgroundColor: fieldErrors.full_name ? '#fff1f2' : '#ffffff',
                    fontSize: '13px',
                    fontFamily: 'var(--sans)',
                    outline: 'none',
                    transition: 'border-color 0.15s ease',
                  }}
                />
                {fieldErrors.full_name && (
                  <div style={{ color: 'var(--kia-red)', fontSize: '11.5px', marginTop: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={13} />
                    <span>{fieldErrors.full_name}</span>
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--g90)', display: 'block', marginBottom: '6px' }}>
                  Número de WhatsApp *
                </label>
                <input
                  ref={phoneInputRef}
                  type="tel"
                  placeholder="Ej. 0412 1234567 o internacional"
                  value={formData.phone}
                  onChange={(e) => handleSelect('phone', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: fieldErrors.phone ? '2px solid var(--kia-red)' : '1px solid var(--g20)',
                    backgroundColor: fieldErrors.phone ? '#fff1f2' : '#ffffff',
                    fontSize: '13px',
                    fontFamily: 'var(--sans)',
                    outline: 'none',
                    transition: 'border-color 0.15s ease',
                  }}
                />
                {fieldErrors.phone && (
                  <div style={{ color: 'var(--kia-red)', fontSize: '11.5px', marginTop: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={13} />
                    <span>{fieldErrors.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--g90)', display: 'block', marginBottom: '6px' }}>
                Correo Electrónico (opcional)
              </label>
              <input
                type="email"
                placeholder="tu@correo.com"
                value={formData.email}
                onChange={(e) => handleSelect('email', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--g20)',
                  fontSize: '13px',
                  fontFamily: 'var(--sans)',
                }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--g90)', display: 'block', marginBottom: '6px' }}>
                ¿Alguna duda o requerimiento especial? (opcional)
              </label>
              <textarea
                rows={2}
                placeholder="Ej. Deseo saber si tienen entrega inmediata del color arena, o cómo es el trámite con poder notariado."
                value={formData.notes}
                onChange={(e) => handleSelect('notes', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--g20)',
                  fontSize: '13px',
                  fontFamily: 'var(--sans)',
                  resize: 'none',
                }}
              />
            </div>

            {errorMsg && (
              <div
                style={{
                  color: 'var(--kia-red)',
                  backgroundColor: '#fff1f2',
                  border: '1px solid #fecdd3',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12.5px',
                  marginBottom: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <AlertCircle size={15} />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--g10)' }}>
          {step > 1 ? (
            <button type="button" onClick={prevStep} className="btn btn-outline">
              ← Anterior
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button type="button" onClick={nextStep} className="btn btn-primary">
              Siguiente →
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{
                padding: '12px 24px',
                backgroundColor: '#25D366',
                border: 'none',
                boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 800,
                fontSize: '14px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              <MessageCircle size={18} />
              <span>
                {isSubmitting
                  ? 'Conectando con WhatsApp...'
                  : advisor
                  ? `Solicitar Cotización a ${advisor.name.split(' ')[0]} ↗`
                  : 'Solicitar Cotización por WhatsApp ↗'}
              </span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
