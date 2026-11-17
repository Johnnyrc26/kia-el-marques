# 🚗 Kia El Marqués · Plataforma Web Oficial Next.js 15

Plataforma digital y showroom interactivo de **Kia El Marqués**, concesionario oficial autorizado de la red Kia en Caracas, Venezuela (al pie del Ávila).

Desarrollada con **Next.js 15 (App Router)**, **TypeScript**, **React 19**, **Supabase**, generación estática ultrarrápida (**SSG**), y optimización dual integral: **SEO Técnico para Google** y **DARE / GEO (Generative Engine Optimization)** para motores de búsqueda de Inteligencia Artificial (ChatGPT Search, Perplexity AI, Google Gemini, Claude y Microsoft Copilot).

---

## 🌟 Características Principales

### 1. Las 8 Páginas Oficiales de Vehículos (`/modelos/[slug]`)
Páginas dedicadas y pre-renderizadas estáticamente para toda la gama Kia disponible en Venezuela, con fichas comerciales y especificaciones técnicas completas:

| Modelo | Categoría | Motor & Potencia | Ficha Comercial / Técnica |
| :--- | :--- | :--- | :--- |
| **[Kia Tasman 2026](file:///modelos/tasman)** | Pick-up 4x4 Global | 2.5L Turbo (277 HP, 421 Nm) | 1 Ton Carga / 3.500 kg Remolque |
| **[Kia Sportage](file:///modelos/sportage)** | SUV Ícono Global | 2.0L Smartstream (154 HP) | EuroNCAP 5 Estrellas / Seguridad ADAS |
| **[Kia Sorento](file:///modelos/sorento)** | SUV Gran Tamaño (3 Filas) | 3.5L V6 (268 HP) AWD | 7 Puestos VIP / Climatización Triple |
| **[Kia Seltos](file:///modelos/seltos)** | SUV Urbana | 1.5L Smartstream (113 HP) | 190 mm Despeje / Pantalla 10.25" |
| **[Kia Sonet](file:///modelos/sonet)** | Crossover Dinámico | 1.5L Smartstream (114 HP IVT) | Sunroof / Conectividad Total |
| **[Kia Soluto](file:///modelos/soluto)** | Sedán Familiar | 1.4L MPI (95 HP) | Maletero 475 L / Consumo Eficiente |
| **[Kia Picanto](file:///modelos/picanto)** | Compacto Urbano | 1.25L Kappa (83 HP) | 6 Bolsas de Aire / Frenos ABS |
| **[Kia Carnival](file:///modelos/carnival)** | Gran Limusina Ejecutiva | 3.5L V6 (268 HP) | 8 Plazas VIP / Puertas Corredizas Eléctricas |

**Cada página de modelo incluye:**
* Ficha técnica interactiva completa (motor, cilindrada, potencia, torque, tracción, dimensiones, tanque y seguridad).
* Vista previa en alta resolución de la **Ficha Comercial oficial de 1 página** con modal de ampliación.
* Descarga directa del **PDF oficial de especificaciones técnicas**.
* Muestra de paleta de colores oficiales.
* Cuestionario interactivo inteligente preseleccionado para ese vehículo.

---

### 2. Cuestionario de Descubrimiento de Clientes (`VehicleQuiz`)
Formulario interactivo guiado por pasos (micro-friction funnel) para captar intención de compra de prospectos:
* **Uso prioritario**: Familiar, Trabajo/Carga, Uso Diario Urbano, o Viajes y Turismo.
* **Preferencia de color**: Paleta oficial o sin preferencia.
* **Modalidad de adquisición**: Contado, Crédito Bancario, Corporativo/Empresa, o **Compra desde el Exterior (Diáspora)** para entrega en Caracas.
* **Tiempo estimado de compra**: Inmediato, 30 días, 2-3 meses, o consulta preliminar.
* **Datos de contacto**: Nombre, WhatsApp y Estado/Ciudad.

---

### 3. Almacenamiento Dual y Conexión a Supabase
* **Supabase Cloud**: Integrado con el proyecto existente de Kia (`vehicle_leads`).
* **Respaldo Local Automático (`leads.json`)**: Si la conexión o cuota de Supabase está en pausa, el sistema almacena transparentemente los prospectos en el servidor local sin perder ningún lead.
* **Sin fricción para usuarios**: Los visitantes no requieren login ni credenciales; solo los administradores acceden al panel de control.

---

### 4. Panel de Administración de Leads (`/admin`)
Dashboard privado para el equipo de ventas y dirección de Kia El Marqués:
* **Autenticación por Clave Maestra**: Protegido mediante contraseña configurada en variables de entorno.
* **Métricas y KPIs**: Total de prospectos, nuevos sin contactar, citas agendadas y ventas cerradas.
* **Atención Inmediata por WhatsApp**: Botón con 1 clic que abre un chat directo con el prospecto (`https://wa.me/...`) con mensaje de apertura personalizado.
* **Gestión de Estados**: Nuevo, Contactado, Cita Agendada, Cerrado/Venta o Descartado.
* **Filtros Dinámicos**: Búsqueda por nombre, teléfono, ciudad o modelo de vehículo.
* **Exportación CSV**: Descarga con 1 clic de la base de datos completa para abrir en Excel o Google Sheets.

---

### 5. DARE & GEO (Generative Engine Optimization)
Estrategia pionera para que los modelos de lenguaje (ChatGPT, Perplexity, Gemini, Copilot, Claude) citen y recomienden a Kia El Marqués como la fuente fidedigna y concesionario oficial en Caracas:
* **D (Data-First Architecture):** Especificaciones técnicas transparentes y completas.
* **A (Authority & Entity Grounding):** Jerarquía de entidad definida con Schema.org (`AutoDealer` vinculado a `Kia Corporation` y `Kia Venezuela`).
* **R (Retrieval & Semantic Q&A):** Respuestas conversacionales sobre financiamiento, entrega a familiares y taller autorizado.
* **E (Experience & E-E-A-T):** Compromisos operativos: Transparencia total de precios (cero "precio al DM"), garantía de 5 años o 100.000 km, y respuesta en menos de 15 minutos.
* **`llms.txt` y `llms-full.txt`**: Archivos estándar de documentación de la entidad para agentes de IA disponibles en `/llms.txt` y `/llms-full.txt`.
* **Robots.txt para IA**: Permite acceso explícito a `GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`, `Amazonbot`, etc.

---

### 6. Navbar Rediseñado con Mega-Menú
* Logo oficial Kia con proporción 4:1 nítida y fiel a la marca.
* Menú desplegable interactivo con previsualización visual de los 8 modelos.
* Acceso directo a Compromisos, Diáspora, Taller Seguro, FAQs y Ubicación.
* Botón directo con indicador en línea hacia el WhatsApp del Asesor.
* Drawer móvil 100% responsivo para smartphones y tablets.

---

## 📁 Estructura del Proyecto

```text
kia-el-marques/
├── public/
│   ├── assets/
│   │   ├── kia-logo.svg             # Logo vectorial oficial de Kia
│   │   ├── app-icon.png             # Favicon y App Icon
│   │   └── models/                  # Renders oficiales de los 8 modelos vehiculares
│   ├── docs/
│   │   └── fichas/                  # PDFs oficiales de especificaciones técnicas (8 modelos)
│   ├── images/
│   │   └── fichas/                  # PNGs oficiales de Fichas Comerciales de 1 página (8 modelos)
│   ├── llms.txt                     # Estándar resumen para agentes de IA
│   ├── llms-full.txt                # Base de conocimiento exhaustiva para LLMs
│   ├── robots.txt                   # Reglas de indexación con permisos para bots de IA
│   └── sitemap.xml                  # Sitemap de respaldo
├── src/
│   ├── app/
│   │   ├── admin/                   # Panel de administración de prospectos (/admin)
│   │   ├── api/
│   │   │   └── leads/               # API REST para registro, consulta y actualización de leads
│   │   ├── modelos/[slug]/          # Rutas dinámicas SSG para cada uno de los 8 modelos
│   │   ├── politica-de-privacidad/  # Política de privacidad legal y Meta Lead Ads
│   │   ├── terminos-y-condiciones/  # Términos de servicio y cotizaciones
│   │   ├── eliminacion-de-datos/    # Instrucciones de supresión de datos Meta Platform
│   │   ├── globals.css              # Sistema visual oficial, tokens y diseño responsivo
│   │   ├── layout.tsx               # Layout raíz, fuentes Google y metadatos SEO
│   │   ├── page.tsx                 # Landing page principal, Showroom y secciones DARE
│   │   ├── robots.ts                # Metadata route dinámica de robots.txt
│   │   └── sitemap.ts               # Metadata route dinámica de sitemap.xml
│   ├── components/
│   │   ├── Navbar.tsx               # Barra de navegación con Mega-Menú de modelos y drawer móvil
│   │   ├── Footer.tsx               # Footer con enlaces legales y redes oficiales
│   │   ├── Hero.tsx                 # Hero section editorial con propuesta de valor y KPIs
│   │   ├── ModelsShowroom.tsx       # Galería interactiva con pestañas de categorías
│   │   ├── VehicleQuiz.tsx          # Cuestionario interactivo de captación de leads por pasos
│   │   ├── Commitments.tsx          # 4 pilares institucionales (precios, garantía, diáspora, taller)
│   │   ├── DualBanners.tsx          # Banners estratégicos: Diáspora y Taller Seguro
│   │   ├── FaqSection.tsx           # Acordeón de FAQs semánticas orientadas a DARE
│   │   ├── LocationContact.tsx      # Mapa, dirección, horarios de atención y formulario
│   │   ├── ContactForm.tsx          # Formulario de contacto general
│   │   └── JsonLd.tsx               # Esquemas Schema.org JSON-LD para Google Rich Results
│   ├── data/
│   │   ├── models.ts                # Catálogo estructurado de los 8 modelos con fichas y specs
│   │   ├── commitments.ts           # Compromisos comerciales institucionales
│   │   ├── faqs.ts                  # Preguntas y respuestas semánticas
│   │   └── leads.json               # Almacenamiento local de respaldo de prospectos
│   ├── lib/
│   │   ├── supabase.ts              # Cliente singleton de conexión con Supabase
│   │   └── leadsStorage.ts          # Gestor de persistencia híbrida (Supabase + Local JSON)
│   └── types/
│       └── index.ts                 # Contratos y tipos estrictos de TypeScript
├── supabase/
│   └── schema_leads.sql             # Script SQL DDL de la tabla vehicle_leads y políticas RLS
├── legacy_static/                   # Respaldo seguro de archivos HTML y CSS anteriores
├── .env.example                     # Plantilla de variables de entorno
├── next.config.mjs                  # Configuración Next.js 15 y redirecciones 301
├── tsconfig.json                    # Configuración estricta de TypeScript
└── package.json                     # Dependencias y scripts de ejecución
```

---

## 🛠️ Tecnologías Utilizadas

* **Framework:** [Next.js 15.5.29](https://nextjs.org/) (App Router, Server Components y Static Site Generation)
* **Lenguaje:** [TypeScript 5](https://www.typescriptlang.org/)
* **Librería de UI:** [React 19](https://react.dev/)
* **Base de Datos Cloud:** [Supabase](https://supabase.com/) (`@supabase/supabase-js`)
* **Iconografía:** [Lucide React](https://lucide.dev/)
* **Optimización de Fuentes:** `next/font/google` (`Plus Jakarta Sans` y `JetBrains Mono`)
* **Estilos:** CSS3 nativo con Variables de Diseño (Design Tokens), Flexbox, CSS Grid y `backdrop-filter`

---

## 🚀 Inicio Rápido en Desarrollo Local

### 1. Clonar e Instalar Dependencias
```bash
git clone https://github.com/Johnnyrc26/kia-el-marques.git
cd kia-el-marques
npm install
```

### 2. Configurar Variables de Entorno
Crea un archivo `.env.local` en la raíz tomando como base `.env.example`:

```bash
cp .env.example .env.local
```

Configura tus credenciales:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Conexión a Supabase (mismo proyecto que grilla)
NEXT_PUBLIC_SUPABASE_URL=https://sgnkqstfigkjmitklhar.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# Contraseña de acceso al panel /admin
ADMIN_PASSWORD=kia2026
```

### 3. Levantar Servidor de Desarrollo
```bash
npm run dev
```
Abre en tu navegador: **[http://localhost:3000](http://localhost:3000)**

### 4. Compilar para Producción
```bash
npm run build
npm start
```

---

## 🗄️ Configuración de la Base de Datos (Supabase)

Para activar la tabla en tu proyecto de Supabase en la nube:
1. Dirígete a tu [Panel de Supabase -> SQL Editor](https://supabase.com/dashboard/project/sgnkqstfigkjmitklhar/sql/new).
2. Abre el archivo [`supabase/schema_leads.sql`](supabase/schema_leads.sql) y ejecuta su contenido.
3. El script creará automáticamente:
   * La tabla `vehicle_leads`.
   * Los índices de búsqueda rápida (por fecha, modelo y estado).
   * Las políticas de seguridad RLS (`Row Level Security`) para inserción pública y lectura para administradores.

> **Nota de Respaldo:** Incluso si Supabase se encuentra pausado temporalmente o sin conexión, el sistema almacena todos los prospectos en [`src/data/leads.json`](src/data/leads.json), por lo que **nunca se pierde ninguna información de contacto**.

---

## 🔐 Uso del Panel de Administración (`/admin`)

1. Navega a `http://localhost:3000/admin` (o tu dominio en producción `/admin`).
2. Ingresa la clave maestra (por defecto: `kia2026`).
3. En el panel podrás:
   * Ver todos los prospectos captados en tiempo real.
   * Filtrar por modelo de vehículo y por estado de seguimiento.
   * Presionar el botón de WhatsApp para iniciar conversación inmediata con el cliente.
   * Cambiar el estado del prospecto (`Contactado`, `Cita Agendada`, `Vendido`).
   * Exportar el listado completo en formato **CSV**.

---

## 🌐 Despliegue en Producción

El proyecto está 100% optimizado para desplegarse con 1 clic en:
* **Vercel** (Recomendado para Next.js con soporte nativo de Serverless y Edge).
* **Netlify**.
* **Servidor Node.js propio / Docker**.

Recuerda configurar en tu plataforma de hosting las mismas variables de entorno declaradas en `.env.example`.

---

## 📄 Licencia y Derechos

© 2026 Kia El Marqués · Concesionario Oficial Caracas, Venezuela. Todos los derechos reservados.  
Kia y sus logotipos son marcas registradas de Kia Corporation.
