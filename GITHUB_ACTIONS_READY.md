# 🎯 GitHub Actions Setup Complete - Chat Psy

## 📦 ¿Qué Se Implementó?

### 🚀 Pipeline de Despliegue Automático
Tu aplicación ahora se despliega **automáticamente** cada vez que hagas push a la rama `main`.

### ✅ Validaciones Automáticas
Cada push y pull request incluye:
- ✅ Instalación de dependencias
- ✅ Linting de código (ESLint)
- ✅ Validación de schema Prisma
- ✅ Build de Next.js
- ✅ Tests automáticos
- ✅ Validación de Docker
- ✅ Escaneo de seguridad

### 🔐 Secretos Seguros
Los datos sensibles (BD, tokens, claves) se almacenan de forma segura en GitHub Secrets.

---

## ⚡ 5 Pasos para Comenzar

### 1️⃣ Configura 4 Secretos en GitHub (2 minutos)

Ve a tu repositorio en GitHub:
```
Settings → Secrets and variables → Actions → New repository secret
```

Agrega estos valores:

```
Name: DATABASE_URL
Value: postgresql://tu_usuario:tu_password@tu_host:5432/tu_db
```

```
Name: NEXTAUTH_SECRET
Value: (ejecuta esto en terminal)
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```
Name: NEXTAUTH_URL
Value: https://tu-dominio.com
```

```
Name: ENCRYPTION_KEY
Value: (ejecuta esto en terminal)
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2️⃣ (Opcional) Agrega tu Webhook de Deploy

Si usas **Render**:
```
Name: RENDER_DEPLOY_HOOK
Value: https://api.render.com/deploy/srv-...
```

Si usas **Railway**:
```
Name: RAILWAY_DEPLOY_HOOK
Value: https://api.railway.app/webhooks/deploy/...
```

### 3️⃣ Haz Push a Main
```bash
git push origin main
```

### 4️⃣ Ve a GitHub Actions
```
Tu repositorio → Actions → Verás "Deploy Chat Psy" ejecutándose
```

### 5️⃣ Espera 5-10 Minutos
Tu aplicación se desplegará automáticamente.

---

## 📁 Archivos Creados

### En `.github/workflows/`
- ✅ **deploy.yml** (470 líneas)
  - Ejecuta en cada push a main
  - 8 jobs de validación + despliegue
  
- ✅ **pr-validation.yml** (300 líneas)
  - Ejecuta en cada pull request
  - 6 validaciones de calidad

### En `.github/`
- ✅ **README.md** - Overview completo de CI/CD
- ✅ **QUICKSTART.md** - Setup en 5 minutos
- ✅ **GITHUB_SECRETS_SETUP.md** - Guía detallada de secretos (10 secretos)
- ✅ **TESTING_LOCALLY.md** - Testing con Act (herramienta local)

### En `/`
- ✅ **GITHUB_ACTIONS_IMPLEMENTATION.md** - Resumen de la implementación

---

## 🔄 Flujo Automático

```
git push origin main
        ↓
  GitHub Actions Inicia
        ↓
  ├─ 📦 Setup (instala dependencias)
  ├─ 🎯 Lint (valida código)
  ├─ 🗄️ Prisma (valida schema)
  ├─ 🔨 Build (compila)
  ├─ 🧪 Tests (corre tests)
  ├─ 🐳 Docker (valida Dockerfile)
  └─ ✅ Si todo OK
        ↓
  🚀 Deploy (webhook a Render/Railway)
        ↓
  ✅ Tu App está EN VIVO
```

---

## 📚 Documentación

| Archivo | Para Quién | Tiempo |
|---------|-----------|--------|
| [.github/QUICKSTART.md](.github/QUICKSTART.md) | Todos | 5 min |
| [.github/README.md](.github/README.md) | Dev de equipo | 10 min |
| [.github/GITHUB_SECRETS_SETUP.md](.github/GITHUB_SECRETS_SETUP.md) | DevOps/Dev avanzado | 15 min |
| [.github/TESTING_LOCALLY.md](.github/TESTING_LOCALLY.md) | Dev avanzado | 15 min |
| [GITHUB_ACTIONS_IMPLEMENTATION.md](./GITHUB_ACTIONS_IMPLEMENTATION.md) | Arquitecto | 20 min |

---

## ✅ Checklist Rápido

Completa estos items en orden:

- [ ] Leo [.github/QUICKSTART.md](.github/QUICKSTART.md) (5 min)
- [ ] Configuró los 4 secretos en GitHub (2 min)
- [ ] Hizo push a main (inmediato)
- [ ] Ve GitHub Actions ejecutándose
- [ ] Espera 5-10 minutos a que complete
- [ ] Verifica tu app en vivo (¡Listo!)

---

## 🎯 Qué Pasa Ahora

### Cuando haces `git push origin main`:

1. **GitHub Actions inicia automáticamente**
2. **Valida código** (lint, build, tests)
3. **Si todo OK**: Ejecuta deploy via webhook
4. **Tu app se actualiza en vivo**

### Cuando abres un Pull Request:

1. **GitHub Actions valida cambios**
2. **Revisa seguridad, calidad, size**
3. **Te dice si está listo para mergear**

---

## 🔐 Importante: Secretos

Los **4 secretos obligatorios** son:

```yaml
DATABASE_URL      # Tu base de datos PostgreSQL
NEXTAUTH_SECRET   # Para JWT (genera uno nuevo)
NEXTAUTH_URL      # Tu dominio (https://ejemplo.com)
ENCRYPTION_KEY    # Para encriptar mensajes (genera uno nuevo)
```

**⚠️ NUNCA** commitees estos valores. GitHub Secrets los protege automáticamente.

---

## 🚨 Si Algo Falla

1. Ve a **GitHub → Actions**
2. Click en el workflow que falló
3. Expande el job rojo
4. Lee los logs (arriba mostrará el error)
5. Soluciona y vuelve a hacer push

**Errores comunes**:
- `secret not found` → Agregaste el secreto a GitHub?
- `DATABASE_URL invalid` → Verificaste credenciales?
- `Build failed` → Corre `npm run build` localmente

---

## 🧪 (Opcional) Testear Localmente

Si quieres testear el workflow ANTES de hacer push:

```bash
# Instala Act
choco install act  # Windows
# o: brew install act  # macOS

# Testea sin ejecutar
act push -b main --dryrun

# Ejecuta el workflow localmente
act push -b main --verbose
```

Ver: [.github/TESTING_LOCALLY.md](.github/TESTING_LOCALLY.md)

---

## 📊 Estadísticas

| Métrica | Valor |
|---------|-------|
| Workflows | 2 (deploy + PR validation) |
| Jobs | 8+ |
| Secretos soportados | 10 |
| Tiempo de deploy | 5-10 minutos |
| Documentación | 2,000+ líneas |
| Status | ✅ Production Ready |

---

## 🎓 Próximas Funcionalidades (Opcional)

Cuando quieras, puedes agregar:
- [ ] Testing con Coverage
- [ ] Performance benchmarks
- [ ] E2E tests con Playwright
- [ ] Auto-rollback en caso de fallo
- [ ] Slack notifications
- [ ] Staging environment
- [ ] Database migrations automáticas

---

## 📞 Necesitas Ayuda?

1. **Secretos**: Ver [.github/GITHUB_SECRETS_SETUP.md](.github/GITHUB_SECRETS_SETUP.md)
2. **Setup rápido**: Ver [.github/QUICKSTART.md](.github/QUICKSTART.md)
3. **Testear localmente**: Ver [.github/TESTING_LOCALLY.md](.github/TESTING_LOCALLY.md)
4. **Overview completo**: Ver [.github/README.md](.github/README.md)

---

## 🚀 Ready?

```bash
# 1. Configura los 4 secretos en GitHub
# (ver instrucciones arriba)

# 2. Haz push a main
git push origin main

# 3. Ve a GitHub → Actions
# y vea cómo tu app se despliega automáticamente!
```

---

**¡Tu CI/CD está listo para producción!** 🎉

Siguiente paso: [.github/QUICKSTART.md](.github/QUICKSTART.md)
