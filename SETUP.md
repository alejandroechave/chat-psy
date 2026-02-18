# 🚀 Guía de Configuración - Chat Psy

Instrucciones completas para configurar y ejecutar el proyecto en desarrollo.

## ✅ Checklist de Configuración

- [ ] Instalar Node.js 20+
- [ ] Instalar PostgreSQL
- [ ] Clonar el repositorio
- [ ] Instalar dependencias: `npm install`
- [ ] Configurar `.env.local`
- [ ] Ejecutar migraciones Prisma
- [ ] Ejecutar seed de datos
- [ ] Iniciar servidor: `npm run dev`

## 1️⃣ Instalar Dependencias

```bash
cd c:\Proyectos\Apps\chat-psy
npm install
```

**Espacios clave instalados:**
- ✅ `@auth/core@0.34.3` + `@auth/nextjs` → Autenticación
- ✅ `@prisma/client@7.4.0` → ORM
- ✅ `postgres` → Controlador de BD
- ✅ `crypto` → Cifrado AES-256
- ✅ Tailwind CSS, React Hook Form, Zod, Lucide

## 2️⃣ Configurar Variables de Entorno

### Archivo: `.env.local`

Crear o actualizar con:

```env
# =============================================================================
# PRISMA DATABASE
# =============================================================================
# PostgreSQL connection string
# Default: username=postgres, password=postgres, port=5432
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/chat_psy_dev?schema=public"

# =============================================================================
# MESSAGE ENCRYPTION (AES-256-CBC)
# =============================================================================
# 32-byte key as 64-character hex string
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY="<paste_generated_key_here>"

# =============================================================================
# NEXTAUTH v5 (Authentication)
# =============================================================================
# JWT signing secret
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
AUTH_SECRET="<paste_generated_secret_here>"

# Google OAuth (optional)
GOOGLE_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_SECRET="your-google-client-secret"

# NextAuth URL
NEXTAUTH_URL="http://localhost:3000"
```

### 🔑 Generar Claves Seguras

**Terminal 1: Generar ENCRYPTION_KEY**

```powershell
node -e "console.log('ENCRYPTION_KEY=' + require('crypto').randomBytes(32).toString('hex'))"
```

Copiar el valor y pegarlo en `.env.local`

**Terminal 2: Generar AUTH_SECRET**

```powershell
node -e "console.log('AUTH_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

Copiar el valor y pegarlo en `.env.local`

## 3️⃣ PostgreSQL - Verificar Conexión

### Opción A: PostgreSQL Local

```bash
# Verificar que PostgreSQL esté corriendo
psql -U postgres -c "SELECT version();"

# Si no funciona, iniciar servicio
# Windows: Services > PostgreSQL > Start
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

### Opción B: Contenedor Docker

```bash
docker run --name postgres_chat_psy \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=chat_psy_dev \
  -p 5432:5432 \
  -d postgres:15
```

### Crear Base de Datos (si es necesario)

```sql
psql -U postgres
CREATE DATABASE chat_psy_dev;
\q
```

## 4️⃣ Prisma - Inicializar Esquema

### Opción A: Crear Nueva Migración

```bash
npm run prisma:migrate
# Enter migration name: "init" (o descripción)
```

Esto:
- ✅ Crea estructura de tablas en PostgreSQL
- ✅ Genera Prisma Client
- ✅ Crea archivo de migración en `prisma/migrations/`

### Opción B: Usar Migraciones Existentes (si las hay)

```bash
npx prisma migrate deploy
```

### Verificar Schema

```bash
npm run prisma:studio
```

Se abrirá GUI en http://localhost:5555 para inspeccionar DB

## 5️⃣ Generar Datos de Prueba

```bash
npm run seed
```

**Lo que hace:**
- ✅ Crea 4 usuarios de prueba:
  - Admin: `admin@example.com` / `Admin123!`
  - Volunteer 1: `volunteer@example.com` / `Volunteer123!`
  - Volunteer 2: `volunteer2@example.com` / `Volunteer123!`
  - User: `user@example.com` / `User123!`
- ✅ Crea perfiles de voluntarios
- ✅ Crea sesiones de crisis de ejemplo

## 6️⃣ Construir Proyecto (Verificar)

```bash
npm run build
```

**Debería ver:**
```
✓ Compiled successfully in Xs
✓ Finished TypeScript in Xs
✓ Collecting page data using X workers
✓ Generating static pages
✓ Finalizing page optimization
```

**Rutas generadas:**
```
Route (app)
├ ○ /                              # Página inicio
├ ○ /login                         # Login page
├ ○ /dashboard                     # Volunteer dashboard
├ ○ /unauthorized                  # 403 error
├ ○ /chat                          # Chat interface
├ ƒ /api/auth/[...nextauth]       # Auth endpoints
├ ƒ /api/messages                  # Messages API
└ ƒ /api/crisis-sessions          # Crisis sessions API
```

## 7️⃣ Iniciar Servidor de Desarrollo

```bash
npm run dev
```

**Esperado:**
```
▲ Next.js 16.1.6 (Turbopack)
- Environments: .env.local, .env
- Local: http://localhost:3000
```

Visita en navegador: **http://localhost:3000**

## 🧪 Probar Flujo de Autenticación

### 1. Acceder a Login
```
http://localhost:3000/login
```

### 2. Intentar acceder a Dashboard sin autenticación
```
http://localhost:3000/dashboard
→ Redirige a /login (middleware)
```

### 3. Intentar con rol inválido
```
Loguear como 'user@example.com'
Ir a /dashboard
→ Redirige a /unauthorized (middleware)
```

### 4. Acceder como Volunteer
```
Email: volunteer@example.com
Password: Volunteer123!
→ Panel de voluntarios cargado ✓
```

## 🛠️ Troubleshooting

### Error: "Can't reach database"

```bash
# Verificar connectionString
echo $env:DATABASE_URL

# Verificar PostgreSQL está corriendo
psql -U postgres -c "SELECT 1;"

# Resetear Prisma
rm -r node_modules/.prisma
npm run prisma:generate
```

### Error: "ENCRYPTION_KEY not set"

- [ ] Verificar `.env.local` tiene `ENCRYPTION_KEY`
- [ ] Debe ser 64 caracteres hexadecimales
- [ ] Reiniciar servidor: `Ctrl+C` y `npm run dev`

### Error: "useSearchParams() should be wrapped in Suspense"

- [ ] Already fixed in `/app/login/page.tsx`
- [ ] Si ves error: actualizar Next.js
  ```bash
  npm install next@latest
  ```

### Puerto 3000 ya está en uso

```bash
# Opción A: Matar proceso
taskkill /F /IM node.exe

# Opción B: Usar puerto diferente
npm run dev -- -p 3001
```

## 📊 Verificación Final

Después de completar setup, deberías poder:

- ✅ Ver página de login en `http://localhost:3000/login`
- ✅ Acceder a `/dashboard` como voluntario
- ✅ Ver `/unauthorized` si intentas sin permiso
- ✅ Encriptar/desencriptar mensajes
- ✅ Ver datos en `npm run prisma:studio`

## 🔄 Flujo de Desarrollo Típico

```bash
# Terminal 1: Servidor de desarrollo
npm run dev

# Terminal 2: Cambios en BD
npm run prisma:migrate
npm run prisma:studio

# Terminal 3: Linting
npm run lint

# Terminal 4: Build (verificar cambios)
npm run build
```

## 📚 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Servidor dev (http://localhost:3000)
npm run build            # Build producción
npm start                # Ejecutar build

# Base de datos
npm run prisma:generate # Regenerar Prisma Client
npm run prisma:migrate  # Crear/ejecutar migraciones
npm run prisma:studio   # GUI para BD (http://localhost:5555)
npm run prisma:reset    # Resetear BD (⚠️ desarrollo solo)
npm run seed            # Generar datos de prueba

# Auth
# NextAuth endpoints auto-creados:
# GET /api/auth/signin
# POST /api/auth/signin
# GET /api/auth/callback/{provider}
# POST /api/auth/signout
# GET /api/auth/session
```

## ❌ Eliminar Todo y Empezar de Nuevo

```bash
# Limpiar base de datos completamente
npm run prisma:reset

# Reinstalar node_modules
rm -r node_modules
npm install

# Regenerar Prisma
npm run prisma:generate

# Empezar de nuevo
npm run seed
npm run dev
```

---

**¿Problemas?** Revisar los logs en terminal para mensajes de error específicos.
