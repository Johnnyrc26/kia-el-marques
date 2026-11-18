export interface Advisor {
  slug: string;
  name: string;
  email: string;
  phone: string; // e.g. "584225422123"
  phoneFormatted?: string; // e.g. "+58 422 542 2123"
  cedula?: string;
  role: string;
  gender: 'F' | 'M';
  aliases: string[];
}

export const ADVISORS: Advisor[] = [
  {
    slug: 'carla-mendoza',
    name: 'Carla Mendoza',
    email: 'carla.mendoza@kiaelmarques.com',
    phone: '584225422120',
    phoneFormatted: '+58 422 542 2120',
    cedula: '17.974.298',
    role: 'Asesora Comercial Certificada',
    gender: 'F',
    aliases: ['carla', 'carlamendoza', 'carla-mendoza'],
  },
  {
    slug: 'carlos-arias',
    name: 'Carlos Arias',
    email: 'carlos.arias@kiaelmarques.com',
    phone: '584243500312',
    phoneFormatted: '+58 424 350 0312',
    cedula: '28.101.644',
    role: 'Asesor Comercial Certificado',
    gender: 'M',
    aliases: ['carlos', 'carlosarias', 'carlos-arias'],
  },
  {
    slug: 'eduardo-revollo',
    name: 'Eduardo Revollo',
    email: 'eduardo.revollo@kiaelmarques.com',
    phone: '584225422121',
    phoneFormatted: '+58 422 542 2121',
    cedula: '11.311.310',
    role: 'Asesor Comercial Certificado',
    gender: 'M',
    aliases: ['eduardo', 'eduardorevollo', 'eduardo-revollo'],
  },
  {
    slug: 'heber-ibanez',
    name: 'Heber Ibañez',
    email: 'heber.ibanez@kiaelmarques.com',
    phone: '584225422120', // Concesionario fallback
    phoneFormatted: '+58 422 542 2120',
    cedula: '21.121.592',
    role: 'Asesor Comercial Certificado',
    gender: 'M',
    aliases: ['heber', 'heberibanez', 'heber-ibanez', 'heber-ibañez'],
  },
  {
    slug: 'isabella-sosa',
    name: 'Isabella Sosa',
    email: 'isabella.sosa@kiaelmarques.com',
    phone: '584125767404',
    phoneFormatted: '+58 412 576 7404',
    cedula: '26.590.483',
    role: 'Asesora Comercial Certificada',
    gender: 'F',
    aliases: ['isabella', 'isabellasosa', 'isabella-sosa', 'kiaisabellasosa'],
  },
  {
    slug: 'johnny-rojas',
    name: 'Johnny Rojas',
    email: 'johnny.rojas@kiaelmarques.com',
    phone: '584225422120',
    phoneFormatted: '+58 422 542 2120',
    cedula: '',
    role: 'Asesor Comercial Certificado',
    gender: 'M',
    aliases: ['johnny', 'johnnyrojas', 'johnny-rojas'],
  },
  {
    slug: 'jorge-croquer',
    name: 'Jorge Croquer',
    email: 'jorge.croquer@kiaelmarques.com',
    phone: '584225422120',
    phoneFormatted: '+58 422 542 2120',
    cedula: '',
    role: 'Asesor Comercial Certificado',
    gender: 'M',
    aliases: ['jorge', 'jorgecroquer', 'jorge-croquer'],
  },
  {
    slug: 'julio-cardenas',
    name: 'Julio Cardenas',
    email: 'julio.cardenas@kiaelmarques.com',
    phone: '584265573857',
    phoneFormatted: '+58 426 557 3857',
    cedula: '',
    role: 'Asesor Comercial Certificado',
    gender: 'M',
    aliases: ['julio', 'juliocardenas', 'julio-cardenas'],
  },
  {
    slug: 'laura-varela',
    name: 'Laura Varela',
    email: 'laura.varela@kiaelmarques.com',
    phone: '584142596379',
    phoneFormatted: '+58 414 259 6379',
    cedula: '26.590.483',
    role: 'Asesora Comercial Certificada',
    gender: 'F',
    aliases: ['laura', 'lauravarela', 'laura-varela'],
  },
  {
    slug: 'manuel-pimentel',
    name: 'Manuel Pimentel',
    email: 'manuel.pimentel@kiaelmarques.com',
    phone: '584228846784',
    phoneFormatted: '+58 422 884 6784',
    cedula: '24.226.997',
    role: 'Asesor Comercial Certificado',
    gender: 'M',
    aliases: ['manuel', 'manuelpimentel', 'manuel-pimentel'],
  },
  {
    slug: 'maria-sanchez',
    name: 'Maria Sánchez',
    email: 'maria.sanchez@kiaelmarques.com',
    phone: '584225422126',
    phoneFormatted: '+58 422 542 2126',
    cedula: '13.981.385',
    role: 'Asesora Comercial Certificada',
    gender: 'F',
    aliases: ['maria', 'mariasanchez', 'maria-sanchez', 'maria-sánchez'],
  },
  {
    slug: 'natali-perez',
    name: 'Natali Perez',
    email: 'natali.perez@kiaelmarques.com',
    phone: '584228881372',
    phoneFormatted: '+58 422 888 1372',
    cedula: '',
    role: 'Asesora Comercial Certificada',
    gender: 'F',
    aliases: ['natali', 'nataliperez', 'natali-perez'],
  },
  {
    slug: 'ricardo-carrasco',
    name: 'Ricardo Carrasco',
    email: 'ricardo.carrasco@kiaelmarques.com',
    phone: '584222027578',
    phoneFormatted: '+58 422 202 7578',
    cedula: '26.172.228',
    role: 'Asesor Comercial Certificado',
    gender: 'M',
    aliases: ['ricardo', 'ricardocarrasco', 'ricardo-carrasco'],
  },
  {
    slug: 'rosa-gimenez',
    name: 'Rosa Gimenez',
    email: 'rosa.gimenez@kiaelmarques.com',
    phone: '584145021333',
    phoneFormatted: '+58 414 502 1333',
    cedula: '',
    role: 'Asesora Comercial Certificada',
    gender: 'F',
    aliases: ['rosa', 'rosagimenez', 'rosa-gimenez'],
  },
  {
    slug: 'wendy-larrabure',
    name: 'Wendy Larrabure',
    email: 'wendy.larrabure@kiaelmarques.com',
    phone: '584222440335',
    phoneFormatted: '+58 422 244 0335',
    cedula: '14.729.684',
    role: 'Asesora Comercial Certificada',
    gender: 'F',
    aliases: ['wendy', 'wendylarrabure', 'wendy-larrabure'],
  },
  {
    slug: 'gabriel-petit',
    name: 'Gabriel Petit',
    email: 'willfreddy.petit@kiaelmarques.com',
    phone: '584225422125',
    phoneFormatted: '+58 422 542 2125',
    cedula: '27.699.271',
    role: 'Asesor Comercial Certificado',
    gender: 'M',
    aliases: ['gabriel', 'gabrielpetit', 'gabriel-petit', 'willfreddy-petit', 'willfreddy'],
  },
];

// Helper para encontrar un asesor por slug o alias con normalización
export function findAdvisorBySlug(slug: string): Advisor | undefined {
  const clean = slug
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  return ADVISORS.find((a) => {
    if (a.slug === clean) return true;
    if (a.slug.replace(/-/g, '') === clean.replace(/-/g, '')) return true;
    return a.aliases.some((alias) => {
      const cleanAlias = alias
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      return cleanAlias === clean || cleanAlias.replace(/-/g, '') === clean.replace(/-/g, '');
    });
  });
}
