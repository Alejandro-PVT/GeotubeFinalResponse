# YouTube Location Viewer

Aplicación para ver videos de YouTube basados en tu ubicación geográfica con un mapa interactivo.

## Configuración

### 1. Obtener API Key de YouTube

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita **YouTube Data API v3**
4. Ve a "Credenciales" y crea una **API Key**
5. Copia tu API key

### 2. Configurar la API Key

#### Opción A: Para desarrollo local

1. Copia el archivo `.env.example` a `.env.local`:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

2. Abre `.env.local` y agrega tu API key:
   \`\`\`env
   GOOGLE_YOUTUBE_API_KEY=tu_api_key_real_aqui
   \`\`\`

   **Nota:** La API key NO tiene el prefijo `NEXT_PUBLIC_` para mantenerla segura en el servidor.

#### Opción B: Para producción (Vercel)

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega:
   - **Name:** `GOOGLE_YOUTUBE_API_KEY`
   - **Value:** Tu API key de YouTube

#### Opción C: En v0

1. En el sidebar izquierdo, haz clic en **"Vars"**
2. Agrega una nueva variable:
   - **Name:** `GOOGLE_YOUTUBE_API_KEY`
   - **Value:** Tu API key de YouTube

### 3. Instalar dependencias

\`\`\`bash
npm install
# o
yarn install
# o
pnpm install
\`\`\`

### 4. Ejecutar el proyecto

\`\`\`bash
npm run dev
# o
yarn dev
# o
pnpm dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Características

- 🗺️ Mapa interactivo con Leaflet
- 📍 Geolocalización automática
- 🔍 Búsqueda por palabra clave y radio
- 🎥 Visualización de videos con coordenadas
- 📌 Marcadores en el mapa
- 🔒 API key segura en el servidor (no expuesta al cliente)

## Tecnologías

- Next.js 16
- React 19
- TypeScript
- Leaflet (mapas)
- YouTube Data API v3
- Tailwind CSS
- Server Actions (seguridad)

## Seguridad

La API key de YouTube se mantiene segura en el servidor usando Server Actions de Next.js. Nunca se expone al cliente, protegiendo tu cuota de API.
