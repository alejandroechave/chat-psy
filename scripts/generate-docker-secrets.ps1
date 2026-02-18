# Script to generate secure keys for Docker deployment
# Usage: .\scripts\generate-docker-secrets.ps1

Write-Host "🔐 Chat Psy - Generating Docker Secrets" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Generate AUTH_SECRET (32 bytes = 64 hex chars)
$AUTH_SECRET = (([byte[]] (1..32) | ForEach-Object { [byte](Get-Random -Maximum 256) }) | ForEach-Object { "{0:x2}" -f $_ }) -join ""
Write-Host "✓ AUTH_SECRET generated (64 chars)" -ForegroundColor Green

# Generate ENCRYPTION_KEY (32 bytes = 64 hex chars)
$ENCRYPTION_KEY = (([byte[]] (1..32) | ForEach-Object { [byte](Get-Random -Maximum 256) }) | ForEach-Object { "{0:x2}" -f $_ }) -join ""
Write-Host "✓ ENCRYPTION_KEY generated (64 chars)" -ForegroundColor Green

$ENV_FILE = ".env.local"

Write-Host ""
Write-Host "📝 Updating $ENV_FILE with new secrets..." -ForegroundColor Cyan

# Backup existing .env.local if it exists
if (Test-Path $ENV_FILE) {
    $timestamp = Get-Date -Format "yyyyMMddHHmmss"
    Copy-Item $ENV_FILE "$ENV_FILE.backup.$timestamp"
    Write-Host "   Backup created: $ENV_FILE.backup.$timestamp" -ForegroundColor Yellow
}

# Read existing content or create new
$envContent = if (Test-Path $ENV_FILE) {
    Get-Content $ENV_FILE -Raw
} else {
    ""
}

# Update AUTH_SECRET
if ($envContent -like "*AUTH_SECRET=*") {
    $envContent = $envContent -replace "AUTH_SECRET=.*", "AUTH_SECRET=$AUTH_SECRET"
} else {
    $envContent += "AUTH_SECRET=$AUTH_SECRET`r`n"
}

# Update ENCRYPTION_KEY
if ($envContent -like "*ENCRYPTION_KEY=*") {
    $envContent = $envContent -replace "ENCRYPTION_KEY=.*", "ENCRYPTION_KEY=$ENCRYPTION_KEY"
} else {
    $envContent += "ENCRYPTION_KEY=$ENCRYPTION_KEY`r`n"
}

# Write to file
Set-Content $ENV_FILE $envContent -NoNewline
Write-Host "   ✓ .env.local updated" -ForegroundColor Green

Write-Host ""
Write-Host "🐳 Docker Secrets Generated Successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "   AUTH_SECRET:    $AUTH_SECRET"
Write-Host "   ENCRYPTION_KEY: $ENCRYPTION_KEY"
Write-Host ""
Write-Host "⚠️  IMPORTANT:" -ForegroundColor Yellow
Write-Host "   - Keep these secrets secure!"
Write-Host "   - Never commit .env.local to git"
Write-Host "   - Use different secrets for production/staging/development"
Write-Host "   - Backup $ENV_FILE.backup.* in a secure location"
Write-Host ""
Write-Host "✅ Ready to run: docker-compose up" -ForegroundColor Green
Write-Host ""
