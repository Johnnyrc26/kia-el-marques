import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description:
    'Política de Privacidad y Tratamiento de Datos Personales de Kia El Marqués. Información legal, integración con plataformas de Meta y derechos de privacidad.',
  alternates: {
    canonical: 'https://kiaelmarques.com/politica-de-privacidad',
  },
  openGraph: {
    title: 'Política de Privacidad · Kia El Marqués',
    description:
      'Lineamientos de privacidad, tratamiento de datos personales y garantías de seguridad para usuarios de Kia El Marqués.',
    url: 'https://kiaelmarques.com/politica-de-privacidad',
  },
};

export default function PoliticaPrivacidadPage() {
  return (
    <main className="main-content">
      <div className="shell">
        <article className="editorial-card">
          <header className="editorial-header">
            <div className="editorial-breadcrumbs">
              <Link href="/elmarques">Kia El Marqués</Link>
              <span aria-hidden="true">/</span>
              <span>Marco Legal</span>
              <span aria-hidden="true">/</span>
              <span style={{ color: 'var(--g100)', fontWeight: 700 }}>Privacidad</span>
            </div>

            <h1 className="editorial-title">Política de Privacidad</h1>
            <p className="editorial-subtitle">
              Lineamientos de protección, tratamiento de datos personales y garantías de seguridad para clientes y usuarios de Kia El Marqués, incluyendo la interacción mediante plataformas de Meta (Facebook, Instagram y WhatsApp).
            </p>

            <div className="editorial-badges">
              <span className="badge badge-green">
                <span className="badge-dot"></span> Documento Vigente
              </span>
              <span className="badge badge-gray">Noviembre 2026</span>
              <span className="badge badge-blue">Conforme a Políticas de Meta</span>
            </div>
          </header>

          <div className="editorial-body">
            <section>
              <h2>1. Identidad y Domicilio del Responsable</h2>
              <p>
                <strong>Kia El Marqués</strong>, concesionario oficial de la red Kia en Venezuela, con sede de operaciones en la Urbanización El Marqués, Caracas, es la entidad responsable del tratamiento legítimo, confidencial y seguro de los datos personales proporcionados por usuarios, clientes y solicitantes a través de canales físicos y digitales (incluyendo sitios web, formularios publicitarios de Meta Lead Ads y la API de mensajería de WhatsApp Business).
              </p>
            </section>

            <section>
              <h2>2. Datos Personales que Recopilamos</h2>
              <p>
                Recabamos los datos estrictamente necesarios para brindar asesoría automotriz, cotizaciones y atención posventa:
              </p>
              <ul>
                <li><strong>Datos de Identificación y Contacto:</strong> Nombres, apellidos, número de cédula o identificación fiscal, correo electrónico y número telefónico.</li>
                <li><strong>Datos recopilados a través de la Plataforma Meta:</strong> Información proporcionada voluntariamente mediante formularios instantáneos de Facebook/Instagram (Lead Ads), número de teléfono de WhatsApp en chats de atención al cliente y metadatos de interacción mediante las herramientas para desarrolladores de Meta Platforms, Inc.</li>
                <li><strong>Datos de Interés Vehicular:</strong> Modelos Kia de interés, versión, tipo de combustible (gasolina, híbrido o eléctrico) y método de financiamiento solicitado.</li>
                <li><strong>Datos Técnicos Posventa:</strong> Número de Identificación Vehicular (VIN), placa, kilometraje y registro de servicios mecánicos preventivos.</li>
                <li><strong>Datos de Navegación:</strong> Métricas técnicas recopiladas a través de cookies de sesión para garantizar la seguridad y fluidez de la plataforma.</li>
              </ul>
            </section>

            <section>
              <h2>3. Finalidades del Tratamiento</h2>
              <h3>Finalidades Primarias (necesarias para el servicio):</h3>
              <ul>
                <li>Procesar solicitudes de cotización, disponibilidad de inventario y reservas vehiculares.</li>
                <li>Responder mensajes y consultas técnicas a través de la API oficial de WhatsApp Business y Meta Messenger.</li>
                <li>Coordinar citas en taller autorizado para mantenimientos preventivos y correctivos.</li>
                <li>Tramitar la activación y cumplimiento de garantías oficiales de fábrica con Kia Corporation.</li>
                <li>Atender notificaciones preventivas y programas de llamados a revisión técnica (recalls).</li>
              </ul>

              <h3>Finalidades Secundarias:</h3>
              <ul>
                <li>Envío de comunicaciones comerciales sobre aperturas, promociones y lanzamientos exclusivos de la red.</li>
                <li>Encuestas voluntarias de satisfacción y calidad de atención en concesionario.</li>
              </ul>
            </section>

            <section>
              <h2>4. Protección de Datos de la Plataforma Meta (Meta Platform Terms)</h2>
              <p>
                En estricto cumplimiento de los Términos de la Plataforma Meta y las Políticas para Desarrolladores de Meta:
              </p>
              <ul>
                <li><strong>No venta de datos:</strong> Kia El Marqués no comercializa, no vende, no alquila ni transfiere datos de usuarios obtenidos a través de Meta a redes publicitarias, intermediarios de datos (data brokers) o servicios de vigilancia.</li>
                <li><strong>Uso limitado y específico:</strong> Los datos obtenidos mediante la API de WhatsApp o Lead Ads se utilizan únicamente para responder a la solicitud directa formulada por el usuario.</li>
                <li><strong>Retención responsable:</strong> Los datos de leads que no culminen en una relación comercial o contractual son purgados de forma periódica.</li>
              </ul>
            </section>

            <section>
              <h2>5. Medidas de Seguridad y Custodia</h2>
              <p>
                Aplicamos rigurosas salvaguardas tecnológicas y organizativas bajo estándares internacionales de la industria automotriz para prevenir la alteración, pérdida, consulta o acceso no autorizado a su información. El personal con acceso a datos opera bajo estrictos acuerdos de confidencialidad.
              </p>
            </section>

            <section>
              <h2>6. Transferencia de Datos</h2>
              <p>
                Sus datos no serán vendidos, cedidos ni comercializados a terceros. Únicamente se compartirán en los siguientes supuestos operativos indispensables:
              </p>
              <ul>
                <li>Con <strong>Kia Corporation</strong> y distribuidores autorizados para la validación de garantías globales y repuestos originales.</li>
                <li>Con proveedores de infraestructura y servicios en la nube necesarios para la operación de la API de mensajería (como Meta Platforms, Inc. para la entrega de mensajes de WhatsApp).</li>
                <li>Con instituciones financieras y compañías de seguros autorizadas, únicamente bajo instrucción explícita del cliente para trámites de crédito vehicular.</li>
                <li>Con autoridades judiciales o administrativas competentes en cumplimiento de la normativa legal aplicable.</li>
              </ul>
            </section>

            <section id="eliminacion-de-datos">
              <h2>7. Eliminación de Datos de Usuario (User Data Deletion Callback / Request)</h2>
              <p>
                Conforme a los requerimientos técnicos y legales exigidos por <strong>Meta Platforms</strong>, proporcionamos un mecanismo directo y sencillo para que cualquier usuario solicite la eliminación permanente de sus datos:
              </p>
              
              <div className="editorial-box">
                <p><strong>¿Cómo solicitar la eliminación de tus datos?</strong></p>
                <p>Envía un correo electrónico a <code>marketing@kiaelmarques.com</code> con el asunto <strong>&quot;Solicitud de Eliminación de Datos de Usuario&quot;</strong> indicando tu nombre completo y el número telefónico o correo utilizado en la interacción.</p>
                <p>También puedes seguir las instrucciones detalladas paso a paso en nuestra página dedicada: <Link href="/eliminacion-de-datos" style={{ color: 'var(--g100)', fontWeight: 700, textDecoration: 'underline' }}>Instrucciones de Eliminación de Datos de Usuario ↗</Link>.</p>
                <p>Procesaremos la eliminación dentro de un plazo de 48 a 72 horas hábiles y emitiremos la confirmación formal correspondiente.</p>
              </div>
            </section>

            <section>
              <h2>8. Ejercicio de Derechos de Privacidad (ARCO)</h2>
              <p>
                Como titular de sus datos personales, tiene pleno derecho a solicitar en cualquier momento el acceso, rectificación, cancelación u oposición al tratamiento de su información. Para formular cualquier solicitud, diríjase por escrito a <code>marketing@kiaelmarques.com</code> indicando su nombre completo, copia de su documento de identidad y la descripción específica de su solicitud. Responderemos en un plazo máximo de 10 días hábiles.
              </p>
            </section>

            <section>
              <h2>9. Uso de Cookies y Píxeles de Rastreo</h2>
              <p>
                Este portal web utiliza cookies técnicas para garantizar la navegación segura. En caso de utilizar tecnologías de medición publicitaria de terceros (como el píxel de Meta), estas se rigen por las configuraciones de privacidad del usuario en su respectiva cuenta de la plataforma.
              </p>
            </section>

            <section>
              <h2>10. Actualizaciones al Documento</h2>
              <p>
                Kia El Marqués podrá modificar periódicamente esta política para adecuarla a requerimientos técnicos, legislativos o institucionales. La versión vigente y actualizada estará siempre publicada en este portal con indicación de su fecha de emisión.
              </p>
            </section>

            <section>
              <h2>11. Canales de Contacto</h2>
              <p>
                Para dudas o aclaratorias vinculadas a este instrumento legal:
              </p>
              <ul>
                <li><strong>Correo Electrónico:</strong> <a href="mailto:marketing@kiaelmarques.com" style={{ color: 'var(--g100)', textDecoration: 'underline', fontWeight: 700 }}>marketing@kiaelmarques.com</a></li>
                <li><strong>Sede:</strong> Concesionario Kia El Marqués · Caracas, Venezuela</li>
                <li><strong>Portal Oficial de la Marca:</strong> <a href="https://kia.com.ve" target="_blank" rel="noopener" style={{ color: 'var(--g100)', fontWeight: 700, textDecoration: 'underline' }}>kia.com.ve</a></li>
              </ul>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}
