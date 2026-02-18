# ⚡ GitHub Actions - Quick Start

Setup rápido en 5 minutos.

## 1️⃣ Configurar Secretos en GitHub (2 min)

### Abre tu repositorio en GitHub
1. Ve a **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**

### Agrega estos 4 secretos requeridos

| Name | Value | Cómo obtener |
|------|-------|---|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` | De tu BD (Render/Railway/etc) |
| `NEXTAUTH_SECRET` | 64-char hex string | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NEXTAUTH_URL` | `https://tu-dominio.com` | Tu dominio de producción |
| `ENCRYPTION_KEY` | 64-char hex string | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

### (Opcional) Agrega tu webhook de deploy

| Name | Value |
|------|-------|
| `RENDER_DEPLOY_HOOK` | URL del webhook (Render) |
| `RAILWAY_DEPLOY_HOOK` | URL del webhook (Railway) |

---

## 2️⃣ Verificar Workflows (1 min)

Los workflows ya están creados. Verifica:

```bash
# Ver archivos creados
ls .github/workflows/
# deploy.yml              ✓
# pr-validation.yml       ✓
```

---

## 3️⃣ (Opcional) Testear Localmente (1 min)

Instala `act` para testear antes de push:

```powershell
# Windows
choco install act

# macOS
brew install act

# Linux
sudo apt install act
```

Testea sin ejecutar:
```bash
act push -b main --dryrun
```

---

## 4️⃣ Hacer Push y Desplegar (Inmediato)

```bash
# Haz push a main (los workflows se ejecutarán automáticamente)
git push origin main

# Ve a Actions en GitHub para monitorear
# https://github.com/tu-usuario/chat-psy/actions
```

---

## ✅ Verificar que todo funciona

1. **Va a GitHub Actions** y ve si el workflow se ejecuta
2. **Espera 5-10 minutos** a que se complete
3. **Comprueba el estado**: ✅ (success) o ❌ (failed)
4. **Si está OK**, tu app se ha desplegado automáticamente

---

## 📚 Documentación Completa

- **[README.md](./)** - Overview de CI/CD
- **[GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md)** - Detalles de secretos
- **[TESTING_LOCALLY.md](./TESTING_LOCALLY.md)** - Testear con Act

---

## 🔗 Recursos Rápidos

```bash
# Ver status de workflows
gh run list --limit 5

# Ver detalles de última ejecución
gh run view --limit 1

# Ver logs de un workflow
gh run view <run-id> --log

# Trigger manualmente (GitHub CLI)
gh workflow run deploy.yml -r main
```

---

**¡Listo!** Tu CI/CD está configurado 🚀

Para más detalles, ver [README.md](./)
