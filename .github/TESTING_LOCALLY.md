# 🧪 Testing GitHub Actions Workflows Locally

Guía para verificar y testear los workflows de GitHub Actions en tu máquina local antes de hacer push.

## 🔧 Herramientas Necesarias

### 1. Act - Run GitHub Actions Locally

**Act** permite ejecutar workflows de GitHub Actions en tu máquina local.

#### Instalación

**Windows (Chocolatey)**:
```powershell
choco install act
```

**Windows (Scoop)**:
```powershell
scoop install act
```

**macOS**:
```bash
brew install act
```

**Linux**:
```bash
sudo apt install act  # Debian/Ubuntu
```

**Verificar instalación**:
```bash
act --version
```

---

### 2. Docker (Requerido por Act)

Act necesita Docker para ejecutar los workflows.

**Instalación**:
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (Windows/macOS)
- [Docker Engine](https://docs.docker.com/engine/install/) (Linux)

**Verificar**:
```bash
docker --version
```

---

## 🚀 Ejecutar Workflows Localmente

### Listar workflows disponibles

```bash
act -l
```

**Salida esperada**:
```
ID                  Event    Title
deploy              push     🚀 Deploy Chat Psy
pr-validation       pull_request  🔍 PR Validation
```

---

### Ejecutar el workflow de deploy

```bash
# Ver qué haría sin ejecutar realmente
act push --verbose --dryrun

# Ejecutar simulando push a main
act push -b main --verbose

# Ejecutar solo un job específico
act push -j build --verbose
```

---

### Ejecutar el workflow de PR validation

```bash
# Simular PR validation
act pull_request --verbose --dryrun

# Ejecutar con más detalles
act pull_request --verbose
```

---

## 🔐 Proporcionar Secretos

Act necesita acceso a los secretos para ejecutar los workflows.

### Opción 1: Archivo .env (Más fácil)

Crea un archivo `.actrc` en tu home:

**Windows** (`%USERPROFILE%\.actrc`):
```
-s DATABASE_URL=postgresql://postgres:postgres@db:5432/chat_psy_dev
-s NEXTAUTH_SECRET=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
-s NEXTAUTH_URL=http://localhost:3000
-s ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
-s RENDER_DEPLOY_HOOK=https://api.render.com/deploy/... (opcional)
```

**macOS/Linux** (`~/.actrc`):
```
-s DATABASE_URL=postgresql://postgres:postgres@db:5432/chat_psy_dev
-s NEXTAUTH_SECRET=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
-s NEXTAUTH_URL=http://localhost:3000
-s ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

Luego simplemente ejecuta:
```bash
act push -b main
```

### Opción 2: Archivo `.env.local` (Alternativa)

Crea un archivo `.env.local` en la raíz del proyecto:

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/chat_psy_dev
NEXTAUTH_SECRET=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
NEXTAUTH_URL=http://localhost:3000
ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

Luego ejecuta:
```bash
act push -b main --env-file .env.local
```

### Opción 3: Línea de comando

```bash
act push -b main \
  -s DATABASE_URL="postgresql://postgres:postgres@db:5432/chat_psy_dev" \
  -s NEXTAUTH_SECRET="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef" \
  -s NEXTAUTH_URL="http://localhost:3000" \
  -s ENCRYPTION_KEY="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
```

---

## 📋 Ejemplos de Ejecución

### Ejecutar workflow completo

```bash
# Deploy workflow con todos los jobs
act push -b main --verbose

# Salida esperada:
# [Setup/setup] ✓ Setup complete
# [Lint/lint] ✓ ESLint passed
# [Prisma/prisma-validation] ✓ Schema validated
# [Build/build] ✓ Build successful
# [Test/test] ✓ Tests passed
# [Docker/docker-check] ✓ Docker valid
# [Deploy/deploy] ✓ Webhooks triggered
```

---

### Ejecutar job específico

```bash
# Solo lint
act push -j lint --verbose

# Solo build
act push -j build --verbose

# Solo deploy
act push -j deploy --verbose
```

---

### Ejecutar con debugging

```bash
# Ver logs detallados
act push -b main --verbose --debug

# Ver qué está pasando sin ejecutar
act push -b main --dryrun

# Ver sólo los cambios
act push -b main --graph
```

---

## 🔍 Verificar Configuración

### Validar workflow syntax

```bash
# Validar deploy.yml
act -l --file .github/workflows/deploy.yml

# Validar pr-validation.yml
act -l --file .github/workflows/pr-validation.yml
```

### Listar variables de entorno

```bash
# Ver envvars del workflow
act push -b main --list
```

### Inspeccionar secrets

```bash
# Ver qué secretos se están usando
act push -b main --dryrun | grep -i secret
```

---

## 🐛 Troubleshooting

### Error: "Docker not running"

```bash
# Solución: Inicia Docker
docker info

# Si sigue sin funcionar:
# Windows: Abre Docker Desktop
# macOS: Abre Docker Desktop
# Linux: sudo systemctl start docker
```

---

### Error: "secret not found"

```bash
# Verifica que el secreto esté definido
grep "SECRET_NAME" .actrc

# O usa la opción -s
act push -s SECRET_NAME=valor
```

---

### Error: "Could not find image"

```bash
# Act necesita descargar imágenes, requiere conexión a internet
# Intenta de nuevo

# O usa una imagen local:
act -P ubuntu-latest=ubuntu:latest
```

---

### Job se queda esperando

```bash
# Act puede no detectar cambios automáticamente
# Usa --dryrun primero:
act push -b main --dryrun

# Si algunos steps toman mucho tiempo, usa timeout
act push -b main --timeout 60m
```

---

## 📊 Monitoreo de Ejecución

### Modo interactivo

```bash
# Ejecutar y poder ver logs en tiempo real
act push -b main -v
```

### Guardar logs

```bash
# Guardar salida en archivo
act push -b main > workflow.log 2>&1

# Ver logs después
cat workflow.log
```

### Modo watch

```bash
# Usar watch para monitoreo continuo
watch -n 2 'act push -b main --dryrun'
```

---

## ✅ Checklist Pre-Push

Antes de hacer push a `main`, ejecuta:

```bash
# 1. Simular sin ejecutar
act push -b main --dryrun

# 2. Validar syntax
act -l

# 3. Ejecutar workflow completo
act push -b main --verbose

# 4. Verificar que no hay errores
# (revisar consola)

# 5. Si todo está OK, haz push
git push origin main
```

---

## 🚀 Workflow Recomendado

### 1. Desarrollo Local

```bash
# Trabajo normal
npm run dev
npm run lint
npm run build
```

### 2. Pre-commit Testing

```bash
# Antes de hacer commit
npm run lint
npm run build

# Opcionalmente: Act local testing
act push -b main --dryrun
```

### 3. Pull Request

```bash
# Push a rama de feature
git push origin feature/mi-feature

# GitHub Actions ejecutará PR validation automáticamente
# → Revisa Actions en GitHub
```

### 4. Merge a Main

```bash
# Una vez aprobado el PR
git checkout main
git merge feature/mi-feature
git push origin main

# GitHub Actions ejecutará deploy automático
# → Monitorea Actions en GitHub
```

### 5. Verificar Despliegue

```bash
# Comprueba que tu app está en vivo
curl https://tu-dominio.com

# O ve a GitHub Actions para ver logs
```

---

## 🎯 Casos de Uso

### Escenar 1: Testear cambios en deploy.yml

```bash
# Haz cambios a .github/workflows/deploy.yml
$code .github/workflows/deploy.yml

# Testea localmente
act push -b main --verbose

# Si todo OK, commitea
git add .github/workflows/deploy.yml
git commit -m "Update deploy workflow"
git push origin main
```

---

### Escenar 2: Testear nueva acción

```bash
# Agregas una nueva acción a deploy.yml
# Por ejemplo: un nuevo step de backup

# Testea:
act push -b main -j deploy --verbose

# Verifica los logs
# Si tiene éxito, pushea
```

---

### Escenar 3: Debuggar fallo de deployment

```bash
# El push a main falló
# Queremos ver qué pasó localmente

# Ejecuta con debug:
act push -b main --verbose --debug

# O paso a paso:
act push -j setup --verbose
act push -j lint --verbose
act push -j build --verbose

# Identifica cuál falla y revisa logs
```

---

## 🔗 Quick Reference

```bash
# Comandos más útiles
act -l                          # Listar workflows
act push -b main               # Run deploy workflow
act pull_request               # Run PR validation
act push -j build              # Run específico job
act push -b main --dryrun      # Simular sin ejecutar
act push -b main --verbose     # Con logs detallados
act push -b main --debug       # Con debug info

# Con secretos
act push \
  -s DATABASE_URL="..." \
  -s NEXTAUTH_SECRET="..." \
  -s NEXTAUTH_URL="..."
```

---

## 📚 Recursos

- [Act GitHub Repository](https://github.com/nektos/act)
- [Act Documentation](https://nektosact.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

## ✨ Tips Finales

1. **Siempre testea localmente** con `act` antes de push a `main`
2. **Usa `--dryrun`** para ver qué haría sin ejecutar
3. **Guarda un `.actrc`** con tus secretos locales
4. **Revisa los logs** completos si algo falla
5. **Mantén los secretos seguros** - no los commitees

---

**Status**: ✅ Listo para testing  
**Última actualización**: 2024
