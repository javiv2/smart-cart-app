# Smart Budget Backend API

Backend completo para la aplicación Smart Budget Mobile con autenticación segura, gestión de usuarios y APIs RESTful.

## 🚀 Características

- ✅ Autenticación JWT con refresh tokens
- ✅ Registro y login de usuarios
- ✅ Recuperación de contraseña por email
- ✅ Gestión de perfiles de usuario
- ✅ Rate limiting y seguridad
- ✅ Base de datos PostgreSQL con Supabase
- ✅ Validación de datos con Zod
- ✅ Emails transaccionales
- ✅ CORS configurado
- ✅ TypeScript completo

## 📋 Requisitos

- Node.js 18+
- Cuenta en Supabase (gratuita)
- Cuenta de email para SMTP (Gmail recomendado)

## 🛠️ Instalación

### 1. Clonar y configurar

\`\`\`bash
git clone <tu-repo>
cd smart-budget-backend
npm install
\`\`\`

### 2. Configurar variables de entorno

Copia `.env.example` a `.env` y completa:

\`\`\`bash
cp .env.example .env
\`\`\`

### 3. Configurar Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a Settings > API y copia las credenciales
4. Ve a SQL Editor y ejecuta el contenido de `database/schema.sql`

### 4. Configurar Email (Gmail)

1. Ve a tu cuenta de Google
2. Habilita verificación en 2 pasos
3. Genera una "Contraseña de aplicación"
4. Usa esa contraseña en `SMTP_PASS`

### 5. Desplegar en Vercel

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

## 📚 Endpoints API

### Autenticación

- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `POST /api/auth/forgot-password` - Recuperar contraseña
- `POST /api/auth/reset-password` - Restablecer contraseña
- `POST /api/auth/refresh` - Refrescar token
- `GET /api/auth/me` - Obtener usuario actual
- `PUT /api/auth/profile` - Actualizar perfil
- `DELETE /api/auth/account` - Eliminar cuenta

### Ejemplos de uso

#### Registro
\`\`\`bash
curl -X POST https://tu-api.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "MiPassword123!",
    "firstName": "Juan",
    "lastName": "Pérez",
    "acceptTerms": true
  }'
\`\`\`

#### Login
\`\`\`bash
curl -X POST https://tu-api.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "MiPassword123!"
  }'
\`\`\`

## 🔒 Seguridad

- Passwords hasheados con bcrypt
- JWT tokens con expiración
- Rate limiting por IP
- Validación de datos estricta
- CORS configurado
- Row Level Security en Supabase

## 📊 Base de Datos

El esquema incluye:
- `users` - Información de usuarios
- `password_reset_tokens` - Tokens de recuperación
- `refresh_tokens` - Tokens de refresco
- `user_sessions` - Sesiones de dispositivos

## 🚀 Deployment

### Vercel (Recomendado)
\`\`\`bash
vercel --prod
\`\`\`

### Variables de entorno en Vercel
Agrega todas las variables del `.env` en el dashboard de Vercel.

## 📞 Soporte

Para problemas o preguntas, abre un issue en el repositorio.
