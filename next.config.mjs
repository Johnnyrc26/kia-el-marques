import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  async redirects() {
    return [
      {
        source: '/',
        destination: 'https://kia.com.ve',
        permanent: false,
      },
      {
        source: '/asesores',
        destination: '/asesor',
        permanent: true,
      },
      {
        source: '/asesores/:slug*',
        destination: '/asesor/:slug*',
        permanent: true,
      },
      {
        source: '/asesor/maria-sanchez',
        destination: '/asesor',
        permanent: true,
      },
      {
        source: '/asesor/maria',
        destination: '/asesor',
        permanent: true,
      },
      {
        source: '/politica-de-privacidad.html',
        destination: '/politica-de-privacidad',
        permanent: true,
      },
      {
        source: '/terminos-y-condiciones.html',
        destination: '/terminos-y-condiciones',
        permanent: true,
      },
      {
        source: '/eliminacion-de-datos.html',
        destination: '/eliminacion-de-datos',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
