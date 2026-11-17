import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Instrucciones de Eliminación de Datos',
  description:
    'Instrucciones para la Solicitud de Eliminación de Datos de Usuario de las aplicaciones e integraciones de Meta (Facebook, Instagram, WhatsApp) para Kia El Marqués.',
  alternates: {
    canonical: 'https://kiaelmarques.com/eliminacion-de-datos',
  },
  openGraph: {
    title: 'Instrucciones de Eliminación de Datos · Kia El Marqués',
    description:
      'Procedimiento oficial conforme a las políticas de desarrolladores de Meta para solicitar la supresión total de datos en Kia El Marqués.',
    url: 'https://kiaelmarques.com/eliminacion-de-datos',
  },
};

export default function EliminacionDatosPage() {
  return (
    <main className="main-content">
      <div className="shell">
        <article className="editorial-card">
          <header className="editorial-header">
            <div className="editorial-breadcrumbs">
              <Link href="/">Kia El Marqués</Link>
              <span aria-hidden="true">/</span>
              <Link href="/politica-de-privacidad">Marco Legal</Link>
              <span aria-hidden="true">/</span>
              <span style={{ color: 'var(--g100)', fontWeight: 700 }}>Eliminación de Datos Meta</span>
            </div>

            <h1 className="editorial-title">Instrucciones de Eliminación de Datos de Usuario (Meta Platforms)</h1>
            <p className="editorial-subtitle">
              Procedimiento oficial conforme a las políticas de desarrolladores de Meta (Facebook, Instagram y WhatsApp) para solicitar la supresión total de sus datos personales.
            </p>

            <div className="editorial-badges">
              <span className="badge badge-green">
                <span className="badge-dot"></span> Requisito Oficial Meta
              </span>
              <span className="badge badge-gray">Noviembre 2026</span>
              <span className="badge badge-blue">WhatsApp & Facebook API</span>
            </div>
          </header>

          <div className="editorial-body">
            <section>
              <h2>1. Compromiso con el Control de tus Datos</h2>
              <p>
                En <strong>Kia El Marqués</strong> respetamos profundamente tu privacidad y tu derecho al control de tus datos personales. Conforme a las Políticas de la Plataforma de Meta (Meta Platform Terms & Developer Policies), proporcionamos un mecanismo transparente y expedito para que cualquier usuario que haya interactuado con nuestras aplicaciones, formularios de clientes potenciales (Lead Ads), integraciones de WhatsApp Business Cloud API o páginas de Facebook/Instagram asociadas a Kia El Marqués pueda solicitar la eliminación inmediata de sus datos.
              </p>
            </section>

            <section>
              <h2>2. ¿Cómo solicitar la eliminación de tus datos?</h2>
              <p>
                Puedes ejercer la eliminación de tus datos a través de cualquiera de los siguientes dos métodos:
              </p>

              <h3>Opción A: Solicitud directa vía correo electrónico (Recomendado)</h3>
              <p>
                Envía un correo electrónico a nuestro buzón de atención de datos:
              </p>
              <div className="editorial-box">
                <p><strong>Buzón de Solicitudes:</strong> <code>marketing@kiaelmarques.com</code></p>
                <p><strong>Asunto del mensaje:</strong> <code>Solicitud de Eliminación de Datos Meta - [Tu Nombre]</code></p>
                <p><strong>Información a incluir:</strong></p>
                <ul style={{ marginTop: '8px', marginBottom: '8px' }}>
                  <li>Nombre y apellido del titular.</li>
                  <li>Número de teléfono registrado o utilizado en WhatsApp (con código de país).</li>
                  <li>Correo electrónico vinculado a la consulta o formulario de Facebook/Instagram.</li>
                  <li>ID de usuario de Facebook (si aplica).</li>
                </ul>
                <p>Procesaremos la eliminación dentro de un plazo máximo de <strong>48 a 72 horas hábiles</strong> y te enviaremos una notificación de confirmación con el código de confirmación de eliminación.</p>
              </div>

              <h3>Opción B: Eliminación de la aplicación desde tu cuenta de Facebook</h3>
              <p>
                Si te registraste o diste autorización mediante Facebook Login o las herramientas de usuario de Meta:
              </p>
              <ol>
                <li>Inicia sesión en tu cuenta de Facebook y dirígete a <strong>Configuración y Privacidad &gt; Configuración</strong>.</li>
                <li>En el menú lateral, selecciona <strong>Apps y sitios web</strong>.</li>
                <li>Busca y localiza la aplicación vinculada a <strong>Kia El Marqués</strong>.</li>
                <li>Haz clic en el botón <strong>Eliminar</strong> junto al nombre de la aplicación.</li>
                <li>Para solicitar la eliminación de los datos que la aplicación ya recopiló, haz clic en <strong>Ver eliminadas</strong> y selecciona <strong>Enviar solicitud de eliminación de datos</strong>.</li>
              </ol>
            </section>

            <section>
              <h2>3. ¿Qué datos se eliminan?</h2>
              <p>
                Una vez recibida y validada la solicitud, eliminaremos de forma definitiva de nuestros servidores y bases de datos:
              </p>
              <ul>
                <li>Registros de contacto (nombre, correo electrónico, teléfono de WhatsApp).</li>
                <li>Historial de mensajes o conversaciones automatizadas sostenidas a través de la API de WhatsApp o Meta Messenger.</li>
                <li>Respuestas a cuestionarios de clientes potenciales (Lead Ads) o cotizaciones no formalizadas.</li>
                <li>Identificadores de usuario de la plataforma de Meta (PSID o WABA User IDs).</li>
              </ul>
            </section>

            <section>
              <h2>4. Excepciones Legales</h2>
              <p>
                Únicamente se conservará aquella información indispensable que deba mantenerse por imperativo de la legislación mercantil, contable o tributaria aplicable en caso de que el usuario haya formalizado una transacción de compraventa vehicular o reparación mecánica ya facturada.
              </p>
            </section>

            <section>
              <h2>5. Contacto</h2>
              <p>
                Si tienes preguntas sobre este procedimiento o el estado de tu solicitud de eliminación:
              </p>
              <ul>
                <li><strong>Correo Electrónico:</strong> <a href="mailto:marketing@kiaelmarques.com" style={{ color: 'var(--g100)', textDecoration: 'underline', fontWeight: 700 }}>marketing@kiaelmarques.com</a></li>
                <li><strong>Concesionario:</strong> Kia El Marqués · Caracas, Venezuela</li>
                <li><strong>Portal Oficial de la Red:</strong> <a href="https://kia.com.ve" target="_blank" rel="noopener" style={{ color: 'var(--g100)', textDecoration: 'underline' }}>kia.com.ve</a></li>
              </ul>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}
