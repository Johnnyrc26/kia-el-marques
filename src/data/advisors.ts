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
  photo?: string;
}

export const ADVISORS: Advisor[] = [
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
    photo: '/assets/advisors/carlos-arias.jpg',
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
    photo: '/assets/advisors/eduardo-revollo.jpg',
  },
  {
    slug: 'heber-ibanez',
    name: 'Heber Ibañez',
    email: 'heber.ibanez@kiaelmarques.com',
    phone: '584225422130',
    phoneFormatted: '+58 422 542 2130',
    cedula: '21.121.592',
    role: 'Asesor Comercial Certificado',
    gender: 'M',
    aliases: ['heber', 'heberibanez', 'heber-ibanez', 'heber-ibañez'],
    photo: '/assets/advisors/heber-ibanez.jpg',
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
    photo: '/assets/advisors/maria-sanchez.jpg',
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
    photo: '/assets/advisors/ricardo-carrasco.jpg',
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
    photo: '/assets/advisors/gabriel-petit.jpg',
  },
  {
    slug: 'homar-bonilla',
    name: 'Homar Bonilla',
    email: 'homar.bonilla@kiaelmarques.com',
    phone: '584225422127',
    phoneFormatted: '+58 422 542 2127',
    role: 'Asesor Comercial Certificado',
    gender: 'M',
    aliases: ['homar', 'homarbonilla', 'homar-bonilla'],
    photo: '/assets/advisors/homar-bonilla.jpg',
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
