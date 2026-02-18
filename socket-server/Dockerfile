# Dockerfile for WebSocket/Real-time Chat Server
# Simple single-stage build for Node.js socket server

FROM node:20-alpine

# Install runtime dependencies
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application source
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S node -u 1001
RUN chown -R node:nodejs /app

USER node

# Expose port
EXPOSE 4000

# Start server
CMD ["node", "index.js"]
