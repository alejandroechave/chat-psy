# 🚀 GitHub Actions - CI/CD Pipeline

Configuración completa de Integración Continua y Despliegue Continuo (CI/CD) para Chat Psy.

## 📁 Estructura

```
.github/
├── workflows/
│   ├── deploy.yml              # 🚀 Pipeline de despliegue automático (push a main)
│   └── pr-validation.yml       # 🔍 Validación en pull requests
├── GITHUB_SECRETS_SETUP.md     # 🔐 Guía de configuración de secretos
└── README.md                   # 📚 Este archivo
```

## 🔄 Flujos de Trabajo (Workflows)

### 1. Deploy Workflow (`deploy.yml`)

**Disparador**: Push a la rama `main`

**Etapas**:

1. **Setup** - Instalación de dependencias
2. **Lint** - Validación de código (ESLint)
3. **Prisma Validation** - Validación del schema
4. **Build** - Compilación de Next.js
5. **Tests** - Ejecución de tests (si existen)
6. **Docker Check** - Verificación del Dockerfile
7. **Deploy** - Despliegue automático vía webhooks
8. **Notifications** - Notificaciones de éxito/fallo

**Tiempo estimado**: 5-10 minutos

**Requisitos**: Todos los secretos configurados en GitHub

---

### 2. PR Validation Workflow (`pr-validation.yml`)

**Disparador**: Pull request abierto/actualizado

**Validaciones**:

1. **Changed Files Analysis** - Analiza archivos modificados
2. **Code Validation** - Linting + TypeScript checks
3. **Security Scan** - Búsqueda de secrets y vulnerabilidades
4. **Bundle Size Check** - Verifica tamaño de build
5. **Docker Validation** - Valida Dockerfile con Hadolint
6. **Summary** - Resumen de resultados

**Tiempo estimado**: 3-7 minutos

**Requisitos**: Solo los secretos opcionales (si aplica)

---

## 🔐 Secretos Requeridos

### Obligatorios para Deploy
- `DATABASE_URL` - Conexión a PostgreSQL
- `NEXTAUTH_SECRET` - 64-char hex para JWT
- `NEXTAUTH_URL` - URL de la aplicación
- `ENCRYPTION_KEY` - 64-char hex para encriptación

### Opcionales para Deploy
- `RENDER_DEPLOY_HOOK` - Para Render.com
- `RAILWAY_DEPLOY_HOOK` - Para Railway.app
- `CUSTOM_DEPLOY_HOOK` - Para servidor personalizado
- `DEPLOY_TOKEN` - Para autenticación personalizada

### Opcionales para Optimización
- `TURBO_TOKEN` - Caché remoto de Turbo
- `TURBO_TEAM` - Team ID de Vercel

**Ver**: [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md) para guía completa

---

## 📊 Vista General del Pipeline

```
PUSH a main
    │
    ├─────────────────────────────────────────┐
    │                                         │
    ▼                                         ▼
[Setup & Dependencies]          [PR Validation]*
  - Install Node.js              (solo en PR)
  - npm ci

    │
    ├─────────────────────────────────────────┐
    │                                         │
    ▼                                         ▼
  [LINT]                    [Code Validation]*
    │                         [Security Scan]*
    │                         [Bundle Check]*
    │
    ▼
[PRISMA VALIDATION]
  - prisma validate
  - prisma generate

    │
    ▼
  [BUILD]
  - npm run build

    │
    ▼
  [TESTS]
  - npm test

    │
    ▼
[DOCKER CHECK]
  - Verificar Dockerfile

    │
    ▼
[DEPLOY]
  - Trigger webhooks
  - Render (opcional)
  - Railway (opcional)
  - Custom (opcional)

    │
    ▼
[NOTIFICATIONS]
  ✅ Success / ❌ Failed
```

---

## ⚡ Características

### ✅ Deploy Workflow
- ✔️ Validación automática de código
- ✔️ Database schema validation
- ✔️ Multi-stage build process
- ✔️ Docker image verification
- ✔️ Webhook-based deployment
- ✔️ Automatic health monitoring
- ✔️ Build artifacts caching
- ✔️ Concurrent job execution
- ✔️ Graceful failure handling
- ✔️ Deployment concurrency control

### ✅ PR Validation Workflow
- ✔️ Changed files analysis
- ✔️ Selective validation (solo cambios relevantes)
- ✔️ Secret detection
- ✔️ Bundle size enforcement
- ✔️ Docker Dockerfile linting
- ✔️ Security vulnerability scanning

### ✅ General
- ✔️ Automatic status checks
- ✔️ Detailed logging
- ✔️ Error notifications
- ✔️ Build caching
- ✔️ Matrix testing (cuando sea necesario)

---

## 🚀 Cómo usar

### 1. Configuración Inicial

```bash
# 1. Clona el repositorio
git clone <tu-repo>
cd chat-psy

# 2. Crea rama de desarrollo
git checkout -b develop

# 3. Haz cambios y pushea
git push origin develop

# 4. Abre Pull Request a main
# → GitHub Actions ejecutará validaciones automáticamente

# 5. Una vez aprobado, mergea a main
# → Deploy automático se inicia
```

### 2. Monitorear Workflows

**En GitHub**:
1. Ve a tu repositorio
2. Click en **Actions**
3. Verás los workflows ejecutándose
4. Click en uno para ver detalles

**Verifica estado**:
```bash
# Ver últimas acciones
gh run list --limit 10

# Ver detalles de ejecución
gh run view <run-id>

# Ver logs
gh run view <run-id> --log
```

### 3. Troubleshooting

**Si el workflow falla**:

1. Ve a GitHub Actions
2. Click en el workflow fallido
3. Expande el job que falló
4. Lee los logs detallados
5. Busca la línea con el error

**Errores comunes**:

| Error | Causa | Solución |
|-------|-------|----------|
| `secrets not found` | Secreto no configurado | Ver GITHUB_SECRETS_SETUP.md |
| `DATABASE_URL invalid` | Credenciales incorrectas | Verifica URL en secretos |
| `Build failed` | Código con errores | Corre `npm run build` localmente |
| `Webhook failed` | Endpoint no disponible | Verifica URL de webhook |

---

## 📝 Variables de Entorno

Disponibles en todos los workflows:

```yaml
# Información del repositorio
github.repository          # owner/repo
github.ref_name            # nombre de rama (main, develop, etc.)
github.sha                 # commit SHA
github.actor               # usuario que hace push
github.event_name          # tipo de evento (push, pull_request)

# URLs
github.server_url          # https://github.com
github.api_url             # https://api.github.com
github.graphql_url         # https://api.github.com/graphql

# Estados
job.status                 # success, failure, cancelled
steps.<id>.outcome         # outcome de un step
needs.<job-id>.result      # resultado de un job

# Secretos
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

## 🛠️ Personalización

### Cambiar disparador del deploy

**En `deploy.yml`**, modifica:

```yaml
on:
  push:
    branches: [main, staging]  # Agregar más ramas
    paths:
      - 'src/**'               # Solo si hay cambios en src/
      - 'package.json'
```

### Agregar más validaciones

**En `pr-validation.yml`**, agrega nuevos jobs:

```yaml
test-coverage:
  name: 📊 Test Coverage
  runs-on: ubuntu-latest
  
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
    - run: npm ci
    - run: npm run test:coverage
```

### Usar matrix para múltiples versiones

```yaml
build:
  runs-on: ubuntu-latest
  strategy:
    matrix:
      node-version: [18, 20, 22]
      os: [ubuntu-latest, macos-latest]
  
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
```

---

## 📈 Performance Tips

### 1. Caché de dependencias

Ya configurado con `cache: 'npm'`, pero puedes optimizar:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: 'npm'
    cache-dependency-path: '**/package-lock.json'
```

### 2. Usar artifacts

```yaml
# Upload
- uses: actions/upload-artifact@v3
  with:
    name: build
    path: .next/

# Download
- uses: actions/download-artifact@v3
  with:
    name: build
    path: .next/
```

### 3. Parallelizar jobs

Los workflows ya ejecutan jobs en paralelo cuando es posible.

---

## 🔒 Seguridad

### ✅ Buenas prácticas implementadas

- Secretos protegidos en GitHub
- No se commitean credenciales
- Validación de código (linting)
- Detección de secrets (Trufflehog)
- Análisis de dependencias
- Branch protection rules recomendadas

### 🔧 Configuración recomendada en GitHub

1. Ve a **Settings** → **Branches**
2. Click en **Add rule**
3. Rama: `main`
4. Habilita:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Require conversation resolution

---

## 📚 Recursos Útiles

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Using secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
- [Marketplace Actions](https://github.com/marketplace?type=actions)

---

## ✅ Checklist de Setup

Antes de hacer push a main:

- [ ] Todos los secretos requeridos configurados
- [ ] Deploy webhook URL verificada
- [ ] Branch protection rules habilitadas
- [ ] Prueba manual del workflow en develop
- [ ] Logs revisados sin errores
- [ ] Notificaciones de fallo habilitadas

---

## 🎯 Próximos pasos

1. **Configura secretos**: Ver [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md)
2. **Prueba en develop**: Haz push y revisa Actions
3. **Abre un PR**: Verifica validaciones en PR
4. **Mergea a main**: Desplegará automáticamente
5. **Verifica despliegue**: Revisa tu aplicación en vivo

---

## 📞 Soporte

Si tienes preguntas o problemas:

1. Revisa los logs en GitHub Actions
2. Consulta [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md)
3. Abre un issue en el repositorio
4. Contacta con el equipo de desarrollo

---

**Última actualización**: 2024  
**Estado**: ✅ Listo para producción  
**Versión**: 1.0.0
