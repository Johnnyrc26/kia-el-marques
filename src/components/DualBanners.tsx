import Link from 'next/link';

export default function DualBanners() {
  return (
    <div className="dual-banner-grid">
      <div id="diaspora" className="feature-banner dark-theme">
        <div>
          <span
            className="badge badge-gray"
            style={{
              marginBottom: '14px',
              background: 'rgba(255,255,255,0.12)',
              color: '#fff',
              borderColor: 'rgba(255,255,255,0.2)',
            }}
          >
            Programa Diáspora y Familia
          </span>
          <h3>La distancia no te impide resolver la movilidad de los tuyos.</h3>
          <p>
            Diseñado para venezolanos en el exterior que compran un carro para sus padres o familiares en Caracas. Te asignamos un anfitrión por videollamada, te enviamos fotos reales de la unidad en piso, formalizamos los documentos legales a distancia y registramos la entrega con reporte fotográfico en tiempo real.
          </p>
        </div>
        <Link
          href="#contacto"
          className="btn btn-outline"
          style={{ alignSelf: 'flex-start', background: '#fff', color: 'var(--g100)' }}
        >
          Coordinar Compra a Distancia ↗
        </Link>
      </div>

      <div id="taller" className="feature-banner">
        <div>
          <span className="badge badge-green" style={{ marginBottom: '14px' }}>
            Servicio Posventa Oficial
          </span>
          <h3>Taller Seguro: el presupuesto se cierra antes de tocar el carro.</h3>
          <p>
            Desmitificamos el servicio mecánico. Diagnóstico computarizado original Kia con fotos y videos de evidencia enviados directamente a tu teléfono. Cero cobros sorpresas: ningún trabajo se realiza sin tu aprobación previa por escrito, utilizando repuestos 100% genuinos.
          </p>
        </div>
        <Link href="#contacto" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
          Agendar Cita en Taller Seguro
        </Link>
      </div>
    </div>
  );
}
