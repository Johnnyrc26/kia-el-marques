import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description:
    'Términos y Condiciones de Uso del portal y servicios de Kia El Marqués. Información legal, uso de canales de mensajería Meta y garantías.',
  alternates: {
    canonical: 'https://kiaelmarques.com/terminos-y-condiciones',
  },
  openGraph: {
    title: 'Términos y Condiciones · Kia El Marqués',
    description:
      'Bases regulatorias, condiciones de cotización y disposiciones de propiedad intelectual de Kia El Marqués.',
    url: 'https://kiaelmarques.com/terminos-y-condiciones',
  },
};

export default function TerminosCondicionesPage() {
  return (
    <main className="main-content">
      <div className="shell">
        <article className="editorial-card">
          <header className="editorial-header">
            <div className="editorial-breadcrumbs">
              <Link href="/">Kia El Marqués</Link>
              <span aria-hidden="true">/</span>
              <span>Marco Legal</span>
              <span aria-hidden="true">/</span>
              <span style={{ color: 'var(--g100)', fontWeight: 700 }}>Términos</span>
            </div>

            <h1 className="editorial-title">Términos y Condiciones de Uso</h1>
            <p className="editorial-subtitle">
              Bases regulatorias, condiciones de cotización y disposiciones de propiedad intelectual aplicables al portal y servicios de Kia El Marqués, incluyendo la interacción en plataformas de Meta.
            </p>

            <div className="editorial-badges">
              <span className="badge badge-green">
                <span className="badge-dot"></span> Documento Vigente
              </span>
              <span className="badge badge-gray">Noviembre 2026</span>
              <span className="badge badge-blue">Red Oficial Kia Venezuela</span>
            </div>
          </header>

          <div className="editorial-body">
            <section>
              <h2>1. Objeto y Alcance General</h2>
              <p>
                Los presentes Términos y Condiciones regulan el acceso, navegación y utilización de los canales informativos de <strong>Kia El Marqués</strong>, concesionario autorizado de la red oficial Kia en la República Bolivariana de Venezuela. El acceso a cualquiera de nuestras páginas, formularios o servicios de mensajería automatizada implica el conocimiento y la conformidad integral con estas estipulaciones.
              </p>
              <p>
                El dominio principal <code>kiaelmarques.com</code> funciona como showroom digital y enlace de acceso directo hacia la plataforma central nacional:{' '}
                <a href="https://kia.com.ve" target="_blank" rel="noopener" style={{ color: 'var(--g100)', fontWeight: 700, textDecoration: 'underline' }}>
                  kia.com.ve
                </a>.
              </p>
            </section>

            <section>
              <h2>2. Propiedad Intelectual e Industrial</h2>
              <p>
                Todos los signos distintivos, el logotipo corporativo de <strong>Kia</strong>, los eslóganes comerciales como <em>&quot;Movement that inspires&quot;</em>, así como las imágenes, tipografías, renders y especificaciones vehiculares, son marcas y creaciones protegidas pertenecientes a <strong>Kia Corporation</strong> o licenciadas a sus distribuidores autorizados.
              </p>
              <p>
                Se prohíbe expresamente cualquier reproducción, alteración o explotación comercial no autorizada de estos materiales sin la debida autorización por escrito.
              </p>
            </section>

            <section>
              <h2>3. Canales Digitales y Plataformas de Mensajería de Meta (WhatsApp, Facebook e Instagram)</h2>
              <p>
                Al comunicarse con Kia El Marqués a través de canales automatizados o asistidos (incluyendo WhatsApp Business Cloud API, formularios de Facebook Lead Ads o mensajería de Instagram):
              </p>
              <ul>
                <li>El usuario acepta interactuar para recibir información sobre cotizaciones, citas de servicio técnico y novedades comerciales.</li>
                <li>El usuario se compromete a no enviar contenido ilícito, ofensivo o spam a través de estos canales de mensajería.</li>
                <li>El usuario reconoce que el uso de estas plataformas también está sujeto a los Términos del Servicio de WhatsApp y a las Condiciones de la Plataforma Meta.</li>
                <li>
                  Cualquier usuario puede revocar su consentimiento para recibir mensajes o solicitar la eliminación total de sus datos siguiendo nuestras{' '}
                  <Link href="/eliminacion-de-datos" style={{ color: 'var(--g100)', fontWeight: 700, textDecoration: 'underline' }}>
                    Instrucciones de Eliminación de Datos de Usuario ↗
                  </Link>.
                </li>
              </ul>
            </section>

            <section>
              <h2>4. Carácter Referencial de Cotizaciones y Precios</h2>
              <p>
                Los datos técnicos, configuraciones, fichas de producto y precios mostrados en comunicaciones y cotizaciones digitales tienen un carácter exclusivamente informativo y referencial:
              </p>
              <ul>
                <li><strong>Precios de Lista:</strong> Los valores indicados pueden ser modificados sin previo aviso en función de variaciones arancelarias, costos de importación y tasas oficiales aplicables.</li>
                <li><strong>Disponibilidad de Unidades:</strong> La asignación de vehículos, colores y versiones está sujeta a los tiempos de despacho y existencias físicas en el concesionario.</li>
                <li><strong>Perfeccionamiento de la Compra:</strong> Ninguna solicitud o simulación web constituye una venta firme hasta la suscripción formal del contrato de compraventa y cumplimiento de los requisitos de pago.</li>
              </ul>
            </section>

            <section>
              <h2>5. Citas de Taller, Mantenimiento y Repuestos Originales</h2>
              <p>
                Los servicios de diagnóstico mecánico, mantenimiento preventivo y provisión de repuestos en el taller de Kia El Marqués se ejecutan bajo los protocolos técnicos certificados y las garantías oficiales fijadas por Kia Corporation para el mercado venezolano.
              </p>
            </section>

            <section>
              <h2>6. Uso Responsable del Sitio</h2>
              <p>El usuario se compromete a:</p>
              <ul>
                <li>Suministrar datos fidedignos y verificables en cualquier solicitud de cotización o contacto.</li>
                <li>No realizar acciones orientadas a vulnerar la seguridad, estabilidad o funcionamiento de los sistemas informáticos del concesionario.</li>
                <li>Utilizar los contenidos exclusivamente para fines personales y de consulta comercial lícita.</li>
              </ul>
            </section>

            <section>
              <h2>7. Exclusión de Garantías Técnicas</h2>
              <p>
                Kia El Marqués realiza sus mejores esfuerzos para garantizar la estabilidad y veracidad de sus plataformas digitales; no obstante, no asume responsabilidad por interrupciones ajenas a su control, caídas en las APIs de terceros (incluyendo servicios de Meta Platforms) o fallas de conectividad en redes de telecomunicaciones.
              </p>
            </section>

            <section>
              <h2>8. Enlaces a Sitios y Plataformas Externas</h2>
              <p>
                El sitio incluye enlaces al portal nacional{' '}
                <a href="https://kia.com.ve" target="_blank" rel="noopener" style={{ color: 'var(--g100)', fontWeight: 700, textDecoration: 'underline' }}>
                  kia.com.ve
                </a>{' '}
                y puede enlazar a aliados financieros o aseguradoras. Kia El Marqués no se hace responsable por las prácticas de privacidad o términos vigentes en sitios de terceros ajenos a su administración directa.
              </p>
            </section>

            <section>
              <h2>9. Modificaciones a los Términos</h2>
              <p>
                El concesionario se reserva la potestad de modificar los presentes Términos en cualquier momento. Las modificaciones entrarán en vigor a partir de su publicación en esta página web con indicación expresa de su fecha de emisión.
              </p>
            </section>

            <section>
              <h2>10. Legislación y Jurisdicción Aplicable</h2>
              <p>
                Estos Términos y Condiciones se rigen e interpretan bajo la legislación vigente de la República Bolivariana de Venezuela. Cualquier controversia será dirimida ante los tribunales competentes de la jurisdicción del concesionario en la ciudad de Caracas.
              </p>
              
              <div className="editorial-box">
                <p><strong>Departamento de Contacto y Atención:</strong></p>
                <p>Para consultas o notificaciones, comuníquese a: <code>marketing@kiaelmarques.com</code>.</p>
              </div>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}
