# Guía Completa de Despliegue - Geotube en Render

## Resumen del Proyecto

Geotube es una aplicación de Next.js que te permite buscar y ver videos de YouTube basados en tu ubicación geográfica. Incluye:

- 📍 **Búsqueda por ubicación**: Usa geolocalización para encontrar videos cerca de ti
- 🗺️ **Mapa interactivo**: Visualiza videos en un mapa con Leaflet
- 🌍 **7 idiomas**: Español, Inglés, Francés, Alemán, Italiano, Portugués, Japonés
- 📊 **Analytics**: Rastrea tiempo de visualización, carga de videos y problemas de conexión
- 💬 **WhatsApp integrado**: Botón para enviar sugerencias

## Pasos para Desplegar en Render

### 1. Preparar Variables de Entorno

Antes de desplegar, necesitas tener estas variables de entorno configuradas:

\`\`\`env
# YouTube API
GOOGLE_YOUTUBE_API_KEY=tu_clave_aqui

# Supabase (Analytics)
NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_key_aqui
\`\`\`

### 2. Crear Cuenta en Render

1. Ve a [render.com](https://render.com)
2. Regístrate o inicia sesión
3. Ve al dashboard

### 3. Conectar tu Repositorio GitHub

1. En Render, haz clic en "New +" → "Web Service"
2. Conecta tu repositorio GitHub donde subiste el proyecto
3. Selecciona tu repositorio
4. Configura lo siguiente:

**Configuración Básica:**
- **Name**: geotube
- **Environment**: Node
- **Region**: Selecciona la más cercana a ti
- **Branch**: main

**Build Command:**
\`\`\`bash
npm install && npm run build
\`\`\`

**Start Command:**
\`\`\`bash
npm start
\`\`\`

### 4. Agregar Variables de Entorno en Render

1. En la página del Web Service, ve a "Environment"
2. Haz clic en "Add Environment Variable"
3. Agrega cada variable:

\`\`\`
GOOGLE_YOUTUBE_API_KEY = tu_clave_youtube
NEXT_PUBLIC_SUPABASE_URL = tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY = tu_supabase_key
SUPABASE_SERVICE_ROLE_KEY = tu_service_role_key
\`\`\`

### 5. Crear Base de Datos en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a SQL Editor
4. Copia y ejecuta el contenido de `scripts/001_create_analytics_tables.sql`
5. Copia las credenciales:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY

### 6. Obtener Clave de YouTube API

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto
3. Habilita YouTube Data API v3
4. Crea una credencial (API Key)
5. Copia la clave

### 7. Desplegar

1. Haz clic en "Deploy" en Render
2. Espera a que se complete (toma unos 5-10 minutos)
3. ¡Listo! Tu aplicación estará en vivo

## Estructura de Carpetas

\`\`\`
geotube/
├── app/
│   ├── page.tsx                 # Página principal con búsqueda
│   ├── layout.tsx               # Layout principal
│   ├── globals.css              # Estilos globales
│   ├── map-search/              # Búsqueda con mapa
│   ├── custom-search/           # Búsqueda personalizada con coordenadas
│   ├── preferences/             # Página de preferencias
│   ├── actions/
│   │   └── youtube-actions.ts   # Server Actions para YouTube API
├── components/
│   ├── video-card.tsx           # Tarjeta de video
│   ├── video-player.tsx         # Reproductor de video modal
│   ├── location-map.tsx         # Mapa interactivo
│   ├── navigation.tsx           # Barra de navegación
│   ├── whatsapp-button.tsx      # Botón de WhatsApp
│   └── ui/                      # Componentes shadcn
├── lib/
│   ├── locale-context.tsx       # Sistema de idiomas
│   ├── translations.ts          # Traducciones
│   ├── youtube-api.ts           # Utilidades de YouTube API
│   ├── analytics.ts             # Funciones de analytics
│   ├── supabase/
│   │   ├── client.ts            # Cliente Supabase (navegador)
│   │   └── server.ts            # Cliente Supabase (servidor)
├── types/
│   └── youtube.ts               # Tipos TypeScript
├── scripts/
│   └── 001_create_analytics_tables.sql  # Script para crear tablas
└── .env.local                   # Variables locales

\`\`\`

## Funcionalidades Principales

### Página Principal (`/`)
- Búsqueda de videos por palabra clave
- Videos trending por defecto
- Tarjetas interactivas con reproductor modal

### Búsqueda con Mapa (`/map-search`)
- Geolocalización automática
- Mapa interactivo con marcadores
- Radio de búsqueda ajustable (0.1-50 km)
- Integración con Leaflet

### Búsqueda Personalizada (`/custom-search`)
- Ingresa coordenadas manualmente
- Radio de búsqueda 100m-10km
- Videos con ubicación exacta

### Preferencias (`/preferences`)
- Cambiar idioma (7 idiomas disponibles)
- Guardado automático en localStorage

## Sistema de Analytics

La aplicación rastrea automáticamente:

- **Usuarios**: ID único del dispositivo y ubicación
- **Sesiones de video**: Tiempo total viendo cada video
- **Métricas de carga**: Tiempo que tarda en cargar cada video
- **Problemas de conexión**: Registra errores de red

Datos disponibles en la tabla `analytics_video_sessions` en Supabase.

## Solución de Problemas

### "YouTube API Key no configurada"
- Asegúrate de agregar `GOOGLE_YOUTUBE_API_KEY` en las variables de entorno de Render
- Reinicia el servicio después de agregar la variable

### No se muestran videos
1. Verifica que la YouTube API esté habilitada en Google Cloud Console
2. Comprueba que la clave está correcta
3. Revisa el navegador (F12 → Console) para errores

### El mapa no aparece
- Verifica que Leaflet se cargue correctamente
- En algunos navegadores puede tardar unos segundos

### Error de Supabase
- Verifica que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` sean correctas
- Ejecuta el script SQL en Supabase para crear las tablas

## Soporte

Para reportar problemas o sugerencias, usa el botón de WhatsApp en la aplicación.

---

**Última actualización**: Noviembre 2025
**Versión**: 1.0
