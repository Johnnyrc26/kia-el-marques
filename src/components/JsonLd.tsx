export default function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AutoDealer',
        '@id': 'https://kiaelmarques.com/#dealer',
        name: 'Kia El Marqués',
        alternateName: 'Concesionario Kia El Marqués Caracas',
        legalName: 'Kia El Marqués Concesionario Oficial',
        url: 'https://kiaelmarques.com/elmarques',
        logo: 'https://kiaelmarques.com/assets/kia-logo.svg',
        image: 'https://kiaelmarques.com/assets/models/tasman-2026.webp',
        description:
          'Concesionario oficial autorizado de la red Kia en Caracas, Venezuela. Especialistas en venta de vehículos 0 km con garantía oficial, financiamiento bancario y directo, atención a la diáspora venezolana para compra familiar remota, y taller mecánico con repuestos originales.',
        email: 'marketing@kiaelmarques.com',
        priceRange: '$$$$',
        currenciesAccepted: 'USD, VED',
        paymentAccepted: 'Transferencia Bancaria, Crédito Bancario, Financiamiento Directo',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Av. Rómulo Gallegos, El Marqués',
          postalCode: '1073',
          addressLocality: 'Caracas',
          addressRegion: 'Distrito Capital',
          addressCountry: 'VE',
        },
        hasMap: 'https://maps.app.goo.gl/F2atjrsEg4N3kUBp8',
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 10.4950722,
          longitude: -66.8117436,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '08:00',
            closes: '17:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Saturday'],
            opens: '09:00',
            closes: '14:00',
          },
        ],
        parentOrganization: {
          '@type': 'AutomotiveBusiness',
          name: 'Kia Venezuela',
          url: 'https://kia.com.ve',
        },
        brand: {
          '@type': 'Brand',
          name: 'Kia',
          url: 'https://kia.com',
        },
        areaServed: [
          {
            '@type': 'City',
            name: 'Caracas',
          },
          {
            '@type': 'AdministrativeArea',
            name: 'Miranda',
          },
          {
            '@type': 'Country',
            name: 'Venezuela',
          },
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Flota Oficial Kia Venezuela 0 km',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Car',
                name: 'Tasman',
                description:
                  'Pick-up todoterreno mediana cabina doble 4x4, capacidad de carga superior a 1 tonelada y remolque de 3.500 kg.',
                brand: 'Kia',
                vehicleConfiguration: 'Pick-up 4x4 Doble Cabina',
                vehicleModelDate: '2026',
                image: 'https://kiaelmarques.com/assets/models/tasman-2026.webp',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Car',
                name: 'Sportage',
                description:
                  'SUV compacta familiar de diseño audaz, doble pantalla panorámica integrada y asistencias avanzadas de seguridad.',
                brand: 'Kia',
                vehicleConfiguration: 'SUV Familiar',
                image: 'https://kiaelmarques.com/assets/models/sportage.png',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Car',
                name: 'Seltos',
                description:
                  'SUV urbana con altura y despeje óptimo del suelo para Caracas, amplio habitáculo y motor de alta eficiencia.',
                brand: 'Kia',
                vehicleConfiguration: 'SUV Urbana',
                image: 'https://kiaelmarques.com/assets/models/seltos.avif',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Car',
                name: 'Sorento PHEV / HEV',
                description:
                  'SUV premium de 3 filas de asientos (7 pasajeros) con tecnología híbrida y suite de seguridad Kia DriveWise.',
                brand: 'Kia',
                vehicleConfiguration: 'SUV Híbrida 7 Pasajeros',
                image: 'https://kiaelmarques.com/assets/models/sorento-phev.png',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Car',
                name: 'Picanto Automático',
                description:
                  'Hatchback subcompacto ágil, con transmisión automática, consumo ultrabajo y fácil estacionamiento en la ciudad.',
                brand: 'Kia',
                vehicleConfiguration: 'Hatchback Subcompacto',
                image: 'https://kiaelmarques.com/assets/models/picanto.webp',
              },
            },
          ],
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://kiaelmarques.com/#website',
        url: 'https://kiaelmarques.com/elmarques',
        name: 'Kia El Marqués',
        description: 'Portal oficial del concesionario Kia El Marqués en Caracas, Venezuela.',
        publisher: {
          '@id': 'https://kiaelmarques.com/#dealer',
        },
        inLanguage: 'es-VE',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://kiaelmarques.com/#breadcrumbs',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Kia Venezuela',
            item: 'https://kia.com.ve',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Kia El Marqués (Caracas)',
            item: 'https://kiaelmarques.com',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://kiaelmarques.com/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: '¿Dónde está ubicado el concesionario Kia El Marqués en Caracas?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Kia El Marqués está ubicado en la zona de El Marqués, al pie del cerro El Ávila (Municipio Sucre, Caracas, Estado Miranda, Venezuela). Forma parte de la red de concesionarios oficiales de Kia Venezuela.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Cuáles modelos Kia 0 km están disponibles en Venezuela?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'En Kia El Marqués disponemos del portafolio oficial de Kia para Venezuela: la pick-up 4x4 Tasman, la SUV ejecutiva Sorento (HEV / PHEV), la SUV familiar Sportage, la SUV urbana Seltos, el ágil hatchback Picanto Automático y el monovolumen de lujo Carnival.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Cómo funciona el financiamiento para comprar un Kia en Venezuela?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Kia El Marqués ofrece un modelo de financiamiento mixto: tramitamos el crédito con la banca nacional autorizada y, en caso de quedar una brecha no cubierta por el banco, el concesionario puede financiar directamente el monto restante con acuerdo de fiador y plan de cuotas claro.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Cómo puede un venezolano en el exterior comprar un carro para su familia en Caracas?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: "A través de nuestro programa 'Diáspora y Familia', gestionamos la compra 100% a distancia: enviamos videos y fotografías reales de la unidad en piso, presupuesto cerrado en divisas con impuestos incluidos, coordinación legal de traspaso y entrega fotografiada y grabada directamente a tus familiares en Caracas.",
            },
          },
          {
            '@type': 'Question',
            name: '¿Los vehículos tienen garantía oficial y servicio técnico autorizado?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sí. Todos los vehículos son 0 km oficiales con garantía de fábrica respaldada por Kia Corporation y Kia Venezuela. Además, contamos con Taller Seguro en Caracas, con diagnóstico computarizado original, presupuesto cerrado antes de intervenir el vehículo y repuestos genuinos certificados.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Cuál es la política de precios de Kia El Marqués?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: "Nuestra política se basa en la simetría y transparencia: no manejamos 'precio al DM'. Cada cotización formal incluye el costo del vehículo, IVA, gastos de gestión administrativa y placas, para que conozcas la cifra definitiva sin sorpresas.",
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
