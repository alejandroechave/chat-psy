# 🐳 Chat Psy - Docker & Containerization Guide

Complete guide to building, deploying, and running Chat Psy using Docker and Docker Compose.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Configuration](#configuration)
5. [Building & Running](#building--running)
6. [Health Checks](#health-checks)
7. [Logs & Debugging](#logs--debugging)
8. [Production Deployment](#production-deployment)
9. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### 1. Generate Secrets
Generate secure AUTH_SECRET and ENCRYPTION_KEY for your deployment:

**On Windows:**
```powershell
.\scripts\generate-docker-secrets.ps1
```

**On macOS/Linux:**
```bash
bash scripts/generate-docker-secrets.sh
```

This creates/updates `.env.local` with randomly generated 256-bit (64 character) hex strings.

### 2. Build Docker Images
```bash
docker-compose build
```

### 3. Start Services
```bash
docker-compose up -d
```

### 4. Verify Services
```bash
# Check all services running
docker-compose ps

# View logs for all services
docker-compose logs -f

# Check health status
curl http://localhost:3000/api/health
curl http://localhost:4000/health
```

### 5. Stop Services
```bash
docker-compose down
```

---

## 🏗️ Architecture

### Services

#### 1. **PostgreSQL Database** (`db`)
- **Image**: `postgres:15-alpine`
- **Port**: `5432` (internal), not exposed externally
- **Volume**: `postgres_data` (persistent storage)
- **Health Check**: `pg_isready` (10s interval)
- **Purpose**: Primary data store for users, sessions, messages

#### 2. **Next.js Web Application** (`web`)
- **Image**: Custom multi-stage build (see `Dockerfile`)
- **Port**: `3000`
- **Base**: `node:20-alpine`
- **Features**:
  - NextAuth v5 authentication
  - API routes with Prisma ORM
  - Server-side rendering
  - Static site generation
- **Health Check**: `GET /api/health`
- **Depends On**: `db` (waits for db to be healthy)

#### 3. **Socket.IO WebSocket Server** (`socket-server`)
- **Image**: Custom build (see `socket-server/Dockerfile`)
- **Port**: `4000`
- **Base**: `node:20-alpine`
- **Features**:
  - Real-time chat with Socket.IO
  - Express HTTP server
  - CORS enabled for web service
  - Multiple room support (per crisis session)
- **Health Check**: `GET /health`
- **Depends On**: `db`

### Network

All services communicate via `chat_psy_network` (bridge network):
- `web` → `db:5432` (database queries via Prisma)
- `web` → `socket-server:4000` (real-time updates via WebSocket)
- `socket-server` → `db:5432` (message persistence)

### Volumes

**`postgres_data`**
- Type: Local named volume
- Location: `/var/lib/postgresql/data` in `db` container
- Persistence: Survives container restarts
- Use `docker volume inspect postgres_data` to locate on host

### Health Checks

Each service has automated health checks (10-30 second intervals):

```yaml
db:
  test: pg_isready -U $POSTGRES_USER
  interval: 10s
  timeout: 5s
  retries: 5
  start_period: 40s

web:
  test: wget --quiet --tries=1 --spider http://localhost:3000/api/health
  interval: 10s
  timeout: 5s
  retries: 3
  start_period: 40s

socket-server:
  test: wget --quiet --tries=1 --spider http://localhost:4000/health
  interval: 10s
  timeout: 5s
  retries: 3
  start_period: 40s
```

---

## 📋 Prerequisites

### Required
- **Docker** ≥ 20.10
- **Docker Compose** ≥ 2.0
- **Node.js** ≥ 20 (for generating secrets locally if not using Docker)

### Optional
- **Docker Desktop** (includes Docker & Docker Compose for Windows/macOS)
- **WSL 2** (Windows Subsystem for Linux 2, recommended for Windows containers)

### Verification
```bash
docker --version
docker-compose --version
```

---

## ⚙️ Configuration

### Environment Variables

The `.env.docker` file provides a template with all configuration options:

#### Critical (Must Change for Production)
```env
# Generated 256-bit hex string for NextAuth JWT signing
AUTH_SECRET=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef

# Generated 256-bit hex string for AES-256-CBC message encryption
ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef

# Database credentials
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=chat_psy_dev
```

#### Application Settings
```env
# Next.js environment
NODE_ENV=production
NEXTAUTH_URL=http://localhost:3000
WEB_PORT=3000

# Socket server
SOCKET_PORT=4000

# Logging
LOG_LEVEL=info  # error, warn, info, debug, trace

# Features
ENABLE_WEBSOCKET=true
ENABLE_NOTIFICATIONS=true

# Timezone
TZ=America/Buenos_Aires
```

### Loading Configuration

Docker Compose reads configuration in this order (highest priority first):
1. `.env.local` (created by `generate-docker-secrets.ps1` or `.sh`)
2. `.env.docker` (committed template)
3. `docker-compose.yml` defaults

**Best Practice**: Use `.env.local` for secrets (add to `.gitignore`), keep `.env.docker` as a template.

---

## 🔨 Building & Running

### Development Mode
```bash
# Start all services with live logs
docker-compose up

# Clean rebuild (if Dockerfile changed)
docker-compose up --build

# Run background (detached)
docker-compose up -d
```

### Production Mode
```bash
# Build and optimize images
docker-compose -f docker-compose.yml build --no-cache

# Start with resource limits enforced
docker-compose up -d

# Monitor
docker-compose ps
docker-compose logs -f
```

### Individual Commands
```bash
# Build only database image
docker-compose build db

# Build only web service
docker-compose build web

# Build only socket server
docker-compose build socket-server

# View service status
docker-compose ps

# Execute database backup
docker-compose exec db pg_dump -U postgres chat_psy_dev > backup.sql

# Reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d db
docker-compose exec -it web npx prisma migrate deploy
docker-compose exec -it web npm run seed
```

---

## 🏥 Health Checks

### Automated Health Monitoring

Docker Compose automatically monitors service health:

```bash
# View health status
docker-compose ps

# Output example:
# NAME              STATUS              PORTS
# chat_psy-db-1     Up 2m (healthy)     5432/tcp
# chat_psy-web-1    Up 1m (starting)    0.0.0.0:3000->3000/tcp
# chat_psy-socket...Up 1m (healthy)     0.0.0.0:4000->4000/tcp
```

### Manual Health Checks

```bash
# Web service health
curl http://localhost:3000/api/health
# Response: {"status":"healthy","database":"connected",...}

# Socket server health
curl http://localhost:4000/health
# Response: {"status":"healthy","timestamp":"...","uptime":...}

# Socket server metrics
curl http://localhost:4000/metrics
# Response: {"server":{...},"socket":{"connectedClients":0,...}}

# Database health (from inside web container)
docker-compose exec web npx prisma studio  # Opens Prisma GUI

# Direct database check
docker-compose exec db psql -U postgres -d chat_psy_dev -c "SELECT 1;"
```

---

## 📊 Logs & Debugging

### View Logs

```bash
# All services, follow mode
docker-compose logs -f

# Specific service
docker-compose logs -f web
docker-compose logs -f socket-server
docker-compose logs -f db

# Last 100 lines
docker-compose logs --tail=100 web

# Timestamps included
docker-compose logs -f --timestamps web

# Stream logs to file
docker-compose logs > logs-$(date +%Y%m%d-%H%M%S).txt
```

### Debug Mode

```bash
# Connect to running container
docker-compose exec web /bin/sh
docker-compose exec socket-server /bin/sh
docker-compose exec db /bin/bash

# Inside container examples:
node -v
npm list
env | grep AUTH_SECRET
ps aux
```

### Advanced Debugging

```bash
# Inspect container details
docker-compose ps -a
docker inspect chat_psy-web-1

# Network issues?
docker network inspect chat_psy_network

# Volume issues?
docker volume inspect postgres_data

# Resource usage
docker stats

# Build troubleshooting
docker-compose build --no-cache --progress=plain web

# Check Dockerfile layer details
docker history chat_psy-web:latest
```

---

## 🚀 Production Deployment

### Before Going to Production

1. **Generate New Secrets**
   ```bash
   # Generate for production (different from development)
   .\scripts\generate-docker-secrets.ps1
   ```

2. **Update Configuration**
   ```env
   NODE_ENV=production
   NEXTAUTH_URL=https://your-domain.com
   WEB_URL=https://your-domain.com
   POSTGRES_PASSWORD=<generate-random-password>
   ```

3. **Database Backup Strategy**
   ```bash
   # Regular backups
   docker-compose exec db pg_dump -U postgres chat_psy_dev | gzip > backups/chat_psy_$(date +%Y%m%d_%H%M%S).sql.gz

   # Automated backups (add to crontab)
   0 2 * * * docker-compose -f /path/to/docker-compose.yml exec db pg_dump -U postgres chat_psy_dev | gzip > /backups/chat_psy_$(date +\%Y\%m\%d).sql.gz
   ```

4. **Resource Limits**
   Review and adjust in `docker-compose.yml`:
   ```yaml
   services:
     web:
       deploy:
         resources:
           limits:
             cpus: '1'
             memory: 512M
   ```

5. **Logging & Monitoring**
   ```yaml
   # Prevent log bloat
   logging:
     driver: "json-file"
     options:
       max-size: "10m"
       max-file: "3"
   ```

6. **SSL/TLS Setup**
   Use reverse proxy (nginx/traefik) with SSL termination in front of Docker stack.

### Production Checklist

- [ ] Generate new AUTH_SECRET
- [ ] Generate new ENCRYPTION_KEY
- [ ] Set NODE_ENV=production
- [ ] Update NEXTAUTH_URL to production domain
- [ ] Generate strong POSTGRES_PASSWORD
- [ ] Set up automated database backups
- [ ] Implement SSL/TLS
- [ ] Configure logging aggregation
- [ ] Set resource limits
- [ ] Test health checks
- [ ] Plan disaster recovery
- [ ] Configure monitoring/alerting

---

## 🔧 Troubleshooting

### Service Won't Start

**Problem**: `web` service fails with "error connecting to database"

**Solution**:
```bash
# Check db health
docker-compose ps db

# Wait for db to be ready
docker-compose logs db

# Restart services with dependency checks
docker-compose down
docker-compose up -d db
sleep 10
docker-compose up -d web

# Test database connection
docker-compose exec web npx prisma studio
```

### Port Conflicts

**Problem**: `Error: bind: address already in use`

**Solution**:
```bash
# Find process using port 3000
netstat -ano | findstr :3000  # Windows CMD
lsof -i :3000                  # macOS/Linux

# Kill process
taskkill /PID <PID> /F         # Windows
kill -9 <PID>                  # macOS/Linux

# Or use different port
docker-compose -f docker-compose.override.yml up
# Edit docker-compose.override.yml to override ports
```

### Database Connection Issues

**Problem**: Prisma migration fails

**Solution**:
```bash
# Verify database exists
docker-compose exec db psql -U postgres -l

# Check DATABASE_URL format
docker-compose exec web echo $DATABASE_URL

# Manually run migrations
docker-compose exec web npx prisma migrate deploy

# Seed database
docker-compose exec web npm run seed

# Full database reset (⚠️ deletes all data)
docker-compose down -v
docker-compose up -d
```

### Out of Disk Space

**Problem**: Docker image builds fail due to disk space

**Solution**:
```bash
# Check disk usage
docker system df

# Clean up unused images/volumes
docker system prune -a --volumes

# Remove specific volume
docker volume rm postgres_data
```

### Memory Issues

**Problem**: Container keeps crashing

**Solution**:
```bash
# Check current memory limits in docker-compose.yml
cat docker-compose.yml | grep -A5 "resources:"

# Increase limits
# Edit docker-compose.yml and change limits.memory

# Monitor resource usage
docker stats
```

### WebSocket Connection Issues

**Problem**: Real-time chat not working

**Solution**:
```bash
# Check socket-server health
curl http://localhost:4000/health

# View socket-server logs
docker-compose logs -f socket-server

# Verify CORS configuration
# Check WEB_URL in .env.local matches NEXTAUTH_URL

# Test WebSocket connection
# Open browser console: new WebSocket('ws://localhost:4000')
```

### Build Fails

**Problem**: `docker-compose build` fails

**Solution**:
```bash
# Build with detailed output
docker-compose build --progress=plain --no-cache web

# Check Node.js version compatibility
docker run node:20-alpine node --version

# Clear build cache
docker builder prune -a

# Rebuild from scratch
docker-compose down --rmi all
docker-compose build --no-cache
```

### Permission Issues

**Problem**: `permission denied` errors in container

**Solution**:
```bash
# Non-root user is configured (nextjs:1001, node:1001)
# Add files with proper ownership:
docker-compose exec web chown -R nextjs:nextjs /app

# Or temporarily run as root for setup
docker-compose exec -u root web bash
```

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Specification](https://compose-spec.io/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Socket.IO Guide](https://socket.io/docs/v4/)
- [Prisma Deploy](https://www.prisma.io/docs/orm/deployment)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)

---

## 📝 Quick Reference

```bash
# Daily Development
docker-compose up -d              # Start all services
docker-compose logs -f            # Watch logs
docker-compose ps                 # Check status
docker-compose down               # Stop services

# Testing
curl http://localhost:3000        # Web app
curl http://localhost:3000/api/health       # Health check
curl http://localhost:4000/health           # Socket health
curl http://localhost:4000/metrics          # Socket metrics

# Database Management
docker-compose exec web npx prisma studio  # GUI database editor
docker-compose exec web npm run seed       # Populate test data
docker-compose exec db psql -U postgres    # SQL prompt

# Cleanup
docker-compose down -v            # Stop and remove volumes (⚠️ deletes data)
docker system prune -a             # Remove unused images/volumes
docker logs --tail=0 -f <container>  # Stream logs
```

---

**Last Updated**: 2024
**Maintainer**: Chat Psy Development Team
