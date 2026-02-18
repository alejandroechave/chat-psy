#!/bin/bash

# Script to generate secure keys for Docker deployment
# Usage: ./scripts/generate-docker-secrets.sh

set -e

echo "🔐 Chat Psy - Generating Docker Secrets"
echo "========================================"
echo ""

# Generate AUTH_SECRET (32 bytes = 64 hex chars)
AUTH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo "✓ AUTH_SECRET generated (64 chars)"

# Generate ENCRYPTION_KEY (32 bytes = 64 hex chars)
ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo "✓ ENCRYPTION_KEY generated (64 chars)"

# Create .env.local or update if exists
ENV_FILE=".env.local"

echo ""
echo "📝 Updating $ENV_FILE with new secrets..."

# Backup existing .env.local if it exists
if [ -f "$ENV_FILE" ]; then
  cp "$ENV_FILE" "$ENV_FILE.backup.$(date +%s)"
  echo "   Backup created: $ENV_FILE.backup.*"
fi

# Update or create .env.local with new secrets
if grep -q "AUTH_SECRET=" "$ENV_FILE" 2>/dev/null; then
  sed -i "s/AUTH_SECRET=.*/AUTH_SECRET=$AUTH_SECRET/" "$ENV_FILE"
else
  echo "AUTH_SECRET=$AUTH_SECRET" >> "$ENV_FILE"
fi

if grep -q "ENCRYPTION_KEY=" "$ENV_FILE" 2>/dev/null; then
  sed -i "s/ENCRYPTION_KEY=.*/ENCRYPTION_KEY=$ENCRYPTION_KEY/" "$ENV_FILE"
else
  echo "ENCRYPTION_KEY=$ENCRYPTION_KEY" >> "$ENV_FILE"
fi

echo "   ✓ .env.local updated"

echo ""
echo "🐳 Docker Secrets Generated Successfully!"
echo ""
echo "📋 Summary:"
echo "   AUTH_SECRET:    $AUTH_SECRET"
echo "   ENCRYPTION_KEY: $ENCRYPTION_KEY"
echo ""
echo "⚠️  IMPORTANT:"
echo "   - Keep these secrets secure!"
echo "   - Never commit .env.local to git"
echo "   - Use different secrets for production/staging/development"
echo "   - Backup $ENV_FILE.backup.* in a secure location"
echo ""
echo "✅ Ready to run: docker-compose up"
echo ""
