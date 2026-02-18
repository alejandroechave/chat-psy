# Prisma ORM Setup Guide

## Overview
Prisma ORM ha sido configurado para el proyecto Chat Psy con PostgreSQL. El schema define modelos para usuarios, sesiones de crisis, mensajes cifrados y perfiles de voluntarios.

## Instalación y Configuración

### 1. Dependencias Instaladas
```bash
npm install @prisma/client prisma
```

### 2. Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto:

```env
# .env.local
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/chat_psy_dev?schema=public"
```

**Alternativas de base de datos:**
- **PostgreSQL Local**: `postgresql://user:password@localhost:5432/dbname`
- **Prisma Postgres Beta**: Usa `npx create-db` para crear una instancia en la nube
- **Railway/Render**: Obtén la URL de conexión desde tu proveedor de hosting

### 3. Modelos de Base de Datos

El schema incluye los siguientes modelos con relaciones bidireccionales:

#### **User** (Usuarios)
- `id`: identificador único (CUID)
- `email`: correo electrónico (único, sensible)
- `name`: nombre del usuario
- `role`: ENUM (USER, VOLUNTEER, ADMIN)
- **Relaciones**: 
  - `crisisSessions`: sesiones creadas como usuario
  - `volunteerSessions`: sesiones asignadas como voluntario
  - `messages`: mensajes enviados
  - `volunteerProfile`: perfil de voluntario (opcional)

#### **CrisisSession** (Sesiones de Crisis)
- `id`: identificador único (CUID)
- `startTime`: fecha/hora inicio (default: ahora)
- `endTime`: fecha/hora cierre (nullable)
- `status`: ENUM (OPEN, CLOSED)
- `userId`: referencia al usuario que inicia sesión
- `volunteerId`: referencia al voluntario asignado (nullable)
- **Relaciones**:
  - `user`: relación Many-to-One con User
  - `volunteer`: relación Many-to-One con User (voluntario)
  - `messages`: relación One-to-Many con Message (cascade delete)

#### **Message** (Mensajes)
- `id`: identificador único (CUID)
- `content`: cuerpo del mensaje (TEXT, **encriptado**)
- `createdAt`: timestamp de creación
- `sessionId`: referencia a CrisisSession
- `senderId`: referencia a usuario que envía
- **Relaciones**:
  - `session`: relación Many-to-One con CrisisSession
  - `sender`: relación Many-to-One con User
- **⚠️ CRÍTICO**: El contenido DEBE estar encriptado antes de almacenar

#### **VolunteerProfile** (Perfiles de Voluntarios)
- `id`: identificador único (CUID)
- `userId`: referencia única a User
- `specialization`: especialización del voluntario (sensible)
- `isAvailable`: disponibilidad actual (boolean)
- **Relaciones**:
  - `user`: relación One-to-One con User (cascade delete)

## Instrucciones de Uso

### Crear la Base de Datos (Primera Vez)

```bash
# Crear migration inicial y aplicar al DB
npx prisma migrate dev --name init

# O si prefieres usar Prisma Dev (Local Postgres):
npx prisma dev
```

### Generar/Regenerar Prisma Client

```bash
npx prisma generate
```

### Ver/Editar Datos en UI

```bash
npx prisma studio
```

Abre http://localhost:5555 para ver y editar datos en tiempo real.

### Crear Nueva Migration

Después de cambiar `schema.prisma`:

```bash
npx prisma migrate dev --name nombre_descriptivo
```

### Reset de Base de Datos (DESARROLLO SOLO)

```bash
# Elimina todo y repizza schema
npx prisma migrate reset
```

### Verificar Estado de Migrations

```bash
npx prisma migrate status
```

## Integración con Next.js

### 1. Instancia Global de PrismaClient

Crea `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### 2. En Route Handlers / API Routes

```typescript
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const users = await prisma.user.findMany();
  return Response.json(users);
}
```

### 3. En Server Components

```typescript
import { prisma } from '@/lib/prisma';

export default async function Dashboard() {
  const sessions = await prisma.crisisSession.findMany({
    where: { status: 'OPEN' },
    include: { user: true, messages: true },
  });

  return <div>{/* render sessions */}</div>;
}
```

## Consideraciones de Seguridad

### ⚠️ Campos Sensibles (comentados en schema)

1. **User.email**: PII sensible
   - Nunca expongas en cliente
   - Usa VPN/canales seguros para desarrollo
   - Implementa validación de acceso

2. **Message.content**: Encriptado obligatoriamente
   - Implementa capa de cifrado (AES-256-GCM recomendado)
   - Descifra SOLO cuando sea necesario
   - Audita todo acceso a mensajes

3. **VolunteerProfile.specialization**: Información confidencial
   - Restringe acceso a admins/voluntarios
   - No visible en perfiles públicos

### Mejores Prácticas

```typescript
// ✅ Cifrador de mensajes (ejemplo)
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32);

export function encryptMessage(plaintext: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
}

export function decryptMessage(encrypted: string): string {
  const [ivHex, encHex, authTagHex] = encrypted.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// En API
const { encryptMessage } = require('@/lib/crypto');

export async function POST(req: Request) {
  const { sessionId, content, senderId } = await req.json();
  
  const encryptedContent = encryptMessage(content);
  
  const message = await prisma.message.create({
    data: {
      sessionId,
      senderId,
      content: encryptedContent,
    },
  });

  return Response.json(message);
}
```

## Troubleshooting

### Error: "Can't reach database server"
- Verifica que PostgreSQL está ejecutándose: `psql --version`
- Revisa DATABASE_URL en `.env.local`
- Para Prisma Postgres Cloud: `npx create-db`

### Error: "Schema validation failed"
- Ejecuta: `npx prisma format` (auto-fix)
- Revisa que todas las relaciones tengan campos inversos

### Client Generator
- Si `src/generated/prisma` no existe: `npx prisma generate`
- En Next.js, usa `src/lib/prisma.ts` en lugar de importar directo

## Archivos Generados

```
chat-psy/
├── .env.local                     # Variables de entorno
├── prisma/
│   ├── schema.prisma              # Definición de modelo
│   └── migrations/                # Historial de cambios
├── prisma.config.ts               # Configuración Prisma
├── src/
│   ├── generated/
│   │   └── prisma/                # Client generado (auto)
│   └── lib/
│       └── prisma.ts              # Instancia global (crear)
```

## Referencias

- [Prisma Docs](https://www.prisma.io/docs/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Next.js + Prisma](https://www.prisma.io/docs/guides/frameworks/next-js)
