# Guía Rápida de Configuración - Geotube

## 🚀 Para Empezar Rápido

### Opción 1: En tu Máquina Local

#### Paso 1: Descargar el Proyecto
\`\`\`bash
# Clona o descarga el proyecto
git clone tu-repositorio-aqui
cd geotube
\`\`\`

#### Paso 2: Instalar Dependencias
\`\`\`bash
npm install
\`\`\`

#### Paso 3: Configurar Variables de Entorno

**a) Abre el archivo `.env.local`** (ya existe en el proyecto)

**b) Agrega tu YouTube API Key:**
\`\`\`env
GOOGLE_YOUTUBE_API_KEY=tu_clave_aqui
\`\`\`

**c) (Opcional) Agrega Supabase para Analytics:**
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_key_aqui
\`\`\`

#### Paso 4: Ejecutar el Proyecto
\`\`\`bash
npm run dev
\`\`\`

Abre `http://localhost:3000` en tu navegador ✅

---

### Opción 2: Desplegar en Render

#### Paso 1: Subir a GitHub
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tu-usuario/geotube.git
git push -u origin main
\`\`\`

#### Paso 2: En Render.com

1. Ve a https://render.com y crea una cuenta
2. Haz clic en "New +" → "Web Service"
3. Conecta tu repositorio GitHub
4. Configura:
   - **Name**: geotube
   - **Environment**: Node
   - **Region**: Elige tu región
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

#### Paso 3: Agregar Variables de Entorno en Render

Ve a "Environment" en tu servicio y agrega:

\`\`\`
GOOGLE_YOUTUBE_API_KEY = tu_clave_youtube
NEXT_PUBLIC_SUPABASE_URL = tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY = tu_supabase_key
SUPABASE_SERVICE_ROLE_KEY = tu_service_key
\`\`\`

#### Paso 4: Hacer Deploy
Haz clic en "Deploy" y espera 5-10 minutos ✅

---

## 🔑 Cómo Obtener las Claves

### YouTube API Key

1. Ve a https://console.cloud.google.com/
2. Crea un nuevo proyecto
3. Busca "YouTube Data API v3" y habilítala
4. Ve a "Credenciales" → "Crear credencial" → "API Key"
5. Copia tu clave

### Supabase (Opcional - Solo si quieres Analytics)

1. Ve a https://supabase.com/
2. Crea un nuevo proyecto
3. Espera a que se inicialice
4. Ve a "Settings" → "API"
5. Copia:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

6. En tu proyecto, ve a "SQL Editor"
7. Ejecuta el archivo `scripts/001_create_analytics_tables.sql`

---

## 📋 Checklist Rápido

- [ ] Descargaste el proyecto
- [ ] Ejecutaste `npm install`
- [ ] Agregaste `GOOGLE_YOUTUBE_API_KEY` en `.env.local`
- [ ] Ejecutaste `npm run dev` (local) o hiciste deploy en Render
- [ ] Probaste la página principal
- [ ] Hiciste una búsqueda de video
- [ ] Reproduciste un video

## 🆘 Problemas Comunes

**"No aparecen videos"**
- Verifica que `GOOGLE_YOUTUBE_API_KEY` esté correcto
- Asegúrate de que YouTube Data API v3 esté habilitada en Google Cloud

**"Error de Supabase"**
- Si no agregaste Supabase, la app aún funciona sin analytics
- Si sí lo agregaste, verifica que las credenciales sean correctas

**"El puerto 3000 está en uso"**
\`\`\`bash
npm run dev -- -p 3001
\`\`\`

---

## 📚 Estructura Rápida

\`\`\`
geotube/
├── app/               # Páginas y rutas
├── components/        # Componentes React
├── lib/              # Funciones útiles
└── scripts/          # Scripts SQL
\`\`\`

## 🎯 URLs Principales

- **Inicio**: `/`
- **Búsqueda con Mapa**: `/map-search`
- **Búsqueda Personalizada**: `/custom-search`
- **Preferencias**: `/preferences`

---

**¿Necesitas ayuda?** Usa el botón de WhatsApp en la app o revisa `DEPLOYMENT_GUIDE.md` para más detalles.
