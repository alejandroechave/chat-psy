# Multi-stage Dockerfile for Chat Psy Next.js application
# Stage 1: Dependencies & Prisma generation
# Stage 2: Build application
# Stage 3: Production runtime

# ============================================================================
# STAGE 1: Dependencies & Prisma Client Generation
# ============================================================================
FROM node:20-alpine AS dependencies

# Install build dependencies
RUN apk add --no-cache python3 make g++ openssl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev)
RUN npm ci

# Generate Prisma Client with correct version
RUN npx prisma generate

# ============================================================================
# STAGE 2: Build Application
# ============================================================================
FROM node:20-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++ openssl

WORKDIR /app

# Copy dependencies from stage 1
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/prisma ./prisma

# Copy application source
COPY . .

# Set build environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js application
RUN npm run build

# ============================================================================
# STAGE 3: Production Runtime
# ============================================================================
FROM node:20-alpine AS production

# Install runtime dependencies only
RUN apk add --no-cache openssl

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy only necessary files from builder
# 1. Next.js build output
COPY --from=builder /app/.next ./.next

# 2. Public assets
COPY --from=builder /app/public ./public

# 3. Prisma schema (needed for runtime)
COPY --from=builder /app/prisma ./prisma

# 4. Package files (for scripts and dependencies info)
COPY --from=builder /app/package*.json ./

# Copy production node_modules (exclude devDependencies)
RUN npm ci --only=production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Set ownership
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Expose port
EXPOSE 3000

# Start production server
CMD ["npm", "start"]
