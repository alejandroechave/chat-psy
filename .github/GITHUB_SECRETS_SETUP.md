# 🔐 GitHub Actions - Configuración de Secretos

Guía para configurar los secretos necesarios en GitHub para que el flujo de despliegue funcione correctamente.

## 📋 Secretos Requeridos

### Paso 1: Acceder a GitHub Secrets

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú izquierdo, selecciona **Secrets and variables** → **Actions**
4. Click en **New repository secret**

---

## 🔒 Secretos a Configurar

### 1. DATABASE_URL (Requerido)
**Descripción**: URL de conexión a PostgreSQL  
**Valor**: `postgresql://usuario:contraseña@host:puerto/nombre_base_datos`

**Ejemplo**:
```
postgresql://postgres:mi_contraseña@db.render.com:5432/chat_psy_prod
```

**Pasos**:
1. Copia la URL de conexión de tu proveedor (Render, Railway, etc.)
2. Ve a GitHub Secrets
3. Name: `DATABASE_URL`
4. Value: (pega la URL)
5. Click **Add secret**

---

### 2. NEXTAUTH_SECRET (Requerido)
**Descripción**: Clave secreta para firmar JWT de NextAuth  
**Valor**: Una cadena aleatoria de 64 caracteres hexadecimales

**Cómo generar**:
```bash
# Opción 1: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Opción 2: PowerShell (Windows)
$bytes = [byte[]](1..32 | % {Get-Random -Maximum 256}); $bytes | % {'{0:x2}' -f $_} | Join-String

# Opción 3: Usar el script ya existente
.\scripts\generate-docker-secrets.ps1
```

Ejemplo generado:
```
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

**Pasos**:
1. Genera un valor de 64 caracteres hexadecimales
2. Name: `NEXTAUTH_SECRET`
3. Value: (pega el valor generado)
4. Click **Add secret**

---

### 3. NEXTAUTH_URL (Requerido)
**Descripción**: URL de la aplicación para NextAuth  
**Valor**: La URL raíz de tu aplicación desplegada

**Ejemplos**:
```
https://chat-psy.render.com          # Render
https://chat-psy-prod.railway.app    # Railway
https://mi-dominio.com               # Dominio personalizado
```

**Pasos**:
1. Name: `NEXTAUTH_URL`
2. Value: (URL de tu aplicación)
3. Click **Add secret**

---

### 4. ENCRYPTION_KEY (Requerido)
**Descripción**: Clave para encriptación AES-256-CBC de mensajes  
**Valor**: Una cadena aleatoria de 64 caracteres hexadecimales

**Cómo generar**:
```bash
# Mismo proceso que NEXTAUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Pasos**:
1. Genera un valor de 64 caracteres hexadecimales (diferente a NEXTAUTH_SECRET)
2. Name: `ENCRYPTION_KEY`
3. Value: (pega el valor)
4. Click **Add secret**

---

### 5. RENDER_DEPLOY_HOOK (Opcional - para Render)
**Descripción**: Webhook de despliegue de Render  
**Valor**: URL del webhook de Render

**Cómo obtenerlo**:
1. Ve a [Render.com](https://render.com)
2. Selecciona tu servicio web
3. Ve a **Settings** (Configuración)
4. Busca **Deploy Hook**
5. Copia la URL

**Ejemplo**:
```
https://api.render.com/deploy/srv-ABC123XYZ?key=XXX...
```

**Pasos**:
1. Name: `RENDER_DEPLOY_HOOK`
2. Value: (pega la URL del webhook)
3. Click **Add secret**

---

### 6. RAILWAY_DEPLOY_HOOK (Opcional - para Railway)
**Descripción**: Webhook de despliegue de Railway  
**Valor**: URL del webhook de Railway

**Cómo obtenerlo**:
1. Ve a [Railway.app](https://railway.app)
2. Selecciona tu proyecto
3. Ve a **Deployments**
4. Configura GitHub Integration o copia el webhook

**Ejemplo**:
```
https://api.railway.app/webhooks/deploy/XXX...
```

**Pasos**:
1. Name: `RAILWAY_DEPLOY_HOOK`
2. Value: (pega la URL del webhook)
3. Click **Add secret**

---

### 7. CUSTOM_DEPLOY_HOOK (Opcional - para servicio personalizado)
**Descripción**: Webhook personalizado para tu propio servidor  
**Valor**: URL del endpoint de despliegue

**Pasos**:
1. Name: `CUSTOM_DEPLOY_HOOK`
2. Value: (URL de tu endpoint)
3. Click **Add secret**

---

### 8. DEPLOY_TOKEN (Opcional - para autenticación en CUSTOM_DEPLOY_HOOK)
**Descripción**: Token de autenticación para el webhook personalizado  
**Valor**: Token de seguridad

**Pasos**:
1. Name: `DEPLOY_TOKEN`
2. Value: (tu token)
3. Click **Add secret**

---

### 9. TURBO_TOKEN (Opcional - para caché de Turbopack)
**Descripción**: Token de autenticación para Vercel Turbo caché remoto  
**Valor**: Tu token de Vercel

**Pasos**:
1. Name: `TURBO_TOKEN`
2. Value: (token de Vercel)
3. Click **Add secret**

---

### 10. TURBO_TEAM (Opcional - para caché de Turbopack)
**Descripción**: Team ID en Vercel para Turbo  
**Valor**: Tu team ID

**Pasos**:
1. Name: `TURBO_TEAM`
2. Value: (team ID)
3. Click **Add secret**

---

## ✅ Lista de Control

Marca los secretos que hayas configurado:

### Requeridos (TODOS necesarios)
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `NEXTAUTH_SECRET` - 64-char hex string (generado)
- [ ] `NEXTAUTH_URL` - URL de aplicación
- [ ] `ENCRYPTION_KEY` - 64-char hex string (generado)

### Opcionales (elige al menos uno para deploy)
- [ ] `RENDER_DEPLOY_HOOK` - Si usas Render
- [ ] `RAILWAY_DEPLOY_HOOK` - Si usas Railway
- [ ] `CUSTOM_DEPLOY_HOOK` - Si tienes servidor personalizado
- [ ] `DEPLOY_TOKEN` - Si usas webhook personalizado

### Opcionales (para optimización)
- [ ] `TURBO_TOKEN` - Si usas caché remoto
- [ ] `TURBO_TEAM` - Si usas caché remoto

---

## 🔄 Flujo de Despliegue Automático

Una vez configurados los secretos, el flujo funcionará así:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Push a rama 'main'                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. GitHub Actions: Setup & Install Dependencies             │
│    - Instala Node.js 20                                     │
│    - Instala dependencias (npm ci)                          │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┬────────────┐
        │            │            │            │
    [Job 3]      [Job 2]      [Job 4]      [Job 5]
        │            │            │            │
        ▼            ▼            ▼            ▼
   ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐
   │ Prisma │  │ Linter │  │ Build  │  │ Tests  │
   │Validate│  │ESLint  │  │Next.js │  │ (jest) │
   └────────┘  └────────┘  └────────┘  └────────┘
        │            │            │            │
        └────────────┼────────────┼────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │ Docker Build Check     │
        └────────────┬───────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Si todo es exitoso: Deploy                               │
│    - Render webhook (si configurado)                        │
│    - Railway webhook (si configurado)                       │
│    - Custom webhook (si configurado)                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Notificaciones & Resumen                                 │
│    ✅ Deployment completado                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧪 Probar el Flujo

### Opción 1: Push en rama main
```bash
git push origin main
```

### Opción 2: Ver acciones desplegadas
1. Ve a tu repositorio en GitHub
2. Click en **Actions**
3. Verás el flujo "Deploy Chat Psy" ejecutándose

### Opción 3: Monitorear logs
1. Click en el flujo en ejecución
2. Selecciona un job (setup, lint, build, etc.)
3. Expande los pasos para ver logs detallados

---

## 🐛 Troubleshooting

### Error: "secret not found"
**Causa**: El secreto no está configurado  
**Solución**: Asegúrate de haber agregado el secreto en GitHub Settings

### Error: "DATABASE_URL invalid"
**Causa**: URL de conexión incorrecta  
**Solución**:
- Verifica la contraseña
- Verifica el nombre de la base de datos
- Verifica el puerto (usualmente 5432)

### Error: "Build failed"
**Causa**: Posibles problemas en el código o dependencias  
**Solución**:
- Revisa los logs de GitHub Actions
- Ejecuta `npm run build` localmente
- Verifica que no haya errores de TypeScript

### Error: "Webhook failed"
**Causa**: Render/Railway webhook no responde  
**Solución**:
- Verifica que la URL del webhook es correcta
- Verifica que el servicio esté activo
- Revisa los logs de tu proveedor de hosting

---

## 📚 Variables de Entorno Disponibles

En el flujo `.github/workflows/deploy.yml` tienes acceso a:

```yaml
# GitHub-provided
github.sha              # Commit SHA
github.ref_name         # Branch name (main)
github.repository       # Owner/repo
github.actor            # Username del author
github.event_name       # Tipo de evento (push)

# Secrets configurados
secrets.DATABASE_URL
secrets.NEXTAUTH_SECRET
secrets.NEXTAUTH_URL
secrets.ENCRYPTION_KEY
secrets.RENDER_DEPLOY_HOOK
secrets.RAILWAY_DEPLOY_HOOK
secrets.CUSTOM_DEPLOY_HOOK
secrets.DEPLOY_TOKEN
```

---

## 🔒 Mejores Prácticas de Seguridad

1. ✅ **Nunca commitees secretos** en git
2. ✅ **Usa GitHub Secrets** para todas las credenciales
3. ✅ **Regenera NEXTAUTH_SECRET** cada 6 meses
4. ✅ **Regenera ENCRYPTION_KEY** cada año
5. ✅ **Usa diferentes secretos** para dev/staging/prod
6. ✅ **Audita acceso** en GitHub Settings → Audit Log
7. ✅ **Rota contraseñas** regularmente

---

## 📝 Checklist de Configuración

Antes de hacer push a main:

- [ ] He generado NEXTAUTH_SECRET (64 caracteres hex)
- [ ] He generado ENCRYPTION_KEY (64 caracteres hex)
- [ ] He configurado DATABASE_URL correctamente
- [ ] He configurado NEXTAUTH_URL con mi dominio
- [ ] He agregado webhook de Render (o alternativa)
- [ ] He probado el despliegue en rama de desarrollo
- [ ] He revisado los logs de GitHub Actions
- [ ] Las notificaciones de fallo están habilitadas

---

## 🚀 ¿Listo para desplegar?

1. Completa todos los secretos requeridos ✅
2. Haz push a la rama main
3. Ve a **Actions** en GitHub
4. Monitorea el flujo
5. Tu aplicación se desplegará automáticamente

---

**Última actualización**: 2024  
**Versión**: 1.0.0  
**Estado**: ✅ Listo para producción
