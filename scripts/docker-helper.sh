#!/bin/bash

# Chat Psy Docker Helper Script
# Simplifies common docker-compose operations

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/../"
COMPOSE_FILE="$PROJECT_ROOT/docker-compose.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║   Chat Psy - Docker Helper             ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Commands
cmd_help() {
    print_header
    echo "Usage: ./scripts/docker-helper.sh <command>"
    echo ""
    echo "Available commands:"
    echo ""
    echo "  Development:"
    echo "    start              Start all services (development mode)"
    echo "    stop               Stop all services"
    echo "    restart            Restart all services"
    echo "    logs               View logs from all services (follow)"
    echo "    logs <service>     View logs from specific service"
    echo ""
    echo "  Building:"
    echo "    build              Build all docker images"
    echo "    build <service>    Build specific service (db, web, socket-server)"
    echo "    rebuild            Clean rebuild all images"
    echo ""
    echo "  Database:"
    echo "    seed               Seed database with test data"
    echo "    migrate            Run database migrations"
    echo "    db-shell           Open database shell (psql)"
    echo "    db-backup          Create database backup"
    echo "    db-reset           Reset database (WARNING: deletes all data)"
    echo ""
    echo "  Utilities:"
    echo "    status             Show service status"
    echo "    health             Check health of all services"
    echo "    secrets            Generate new AUTH_SECRET and ENCRYPTION_KEY"
    echo "    clean              Stop services and remove volumes (WARNING: deletes data)"
    echo "    down               Stop and remove containers (keeps volumes)"
    echo ""
    echo "  Advanced:"
    echo "    shell <service>    Open shell in service container"
    echo "    exec <service>     Execute command in service"
    echo "    stats              Show real-time resource usage"
    echo "    inspect <service>  Inspect service details"
    echo ""
    echo "Examples:"
    echo "    ./scripts/docker-helper.sh start"
    echo "    ./scripts/docker-helper.sh logs web"
    echo "    ./scripts/docker-helper.sh shell web"
    echo "    ./scripts/docker-helper.sh seed"
    echo ""
}

cmd_start() {
    print_header
    print_info "Starting all services (development mode)..."
    echo ""
    
    # Check if secrets exist
    if [ ! -f "$PROJECT_ROOT/.env.local" ]; then
        print_warning ".env.local not found"
        print_info "Generating secrets..."
        bash "$SCRIPT_DIR/generate-docker-secrets.sh"
        echo ""
    fi
    
    docker-compose up
}

cmd_stop() {
    print_header
    print_info "Stopping all services..."
    docker-compose down
    print_success "Services stopped"
}

cmd_restart() {
    print_header
    print_info "Restarting all services..."
    docker-compose restart
    print_success "Services restarted"
    
    echo ""
    print_info "Waiting for services to be healthy..."
    sleep 5
    cmd_status
}

cmd_logs() {
    if [ -z "$1" ]; then
        # All services
        print_header
        print_info "Showing logs from all services (Ctrl+C to stop)..."
        echo ""
        docker-compose logs -f
    else
        # Specific service
        print_header
        print_info "Showing logs from '$1' service (Ctrl+C to stop)..."
        echo ""
        docker-compose logs -f "$1"
    fi
}

cmd_build() {
    if [ -z "$1" ]; then
        # All services
        print_header
        print_info "Building all docker images..."
        docker-compose build
        print_success "Build complete"
    else
        # Specific service
        print_header
        print_info "Building '$1' image..."
        docker-compose build "$1"
        print_success "Build complete: $1"
    fi
}

cmd_rebuild() {
    print_header
    print_warning "Performing clean rebuild (removing old images)..."
    echo ""
    docker-compose down --rmi all
    docker-compose build --no-cache
    print_success "Clean rebuild complete"
}

cmd_status() {
    print_header
    print_info "Service Status:"
    echo ""
    docker-compose ps
    echo ""
    print_info "Web Service: http://localhost:3000"
    print_info "Socket Server: http://localhost:4000"
    print_info "Database: localhost:5432"
}

cmd_health() {
    print_header
    print_info "Checking service health..."
    echo ""
    
    echo -n "  Web Service (GET /api/health): "
    if curl -s http://localhost:3000/api/health > /dev/null; then
        print_success "healthy"
    else
        print_error "unhealthy"
    fi
    
    echo -n "  Socket Server (GET /health): "
    if curl -s http://localhost:4000/health > /dev/null; then
        print_success "healthy"
    else
        print_error "unhealthy"
    fi
    
    echo -n "  Database (pg_isready): "
    if docker-compose exec -T db pg_isready -U postgres > /dev/null 2>&1; then
        print_success "healthy"
    else
        print_error "unhealthy"
    fi
    
    echo ""
}

cmd_seed() {
    print_header
    print_info "Seeding database with test data..."
    echo ""
    docker-compose exec web npm run seed
    print_success "Database seeded"
}

cmd_migrate() {
    print_header
    print_info "Running database migrations..."
    echo ""
    docker-compose exec web npx prisma migrate deploy
    print_success "Migrations complete"
}

cmd_db_shell() {
    print_header
    print_info "Opening database shell (psql)..."
    echo "  Type: \\l (list databases), \\dt (list tables), \\q (quit)"
    echo ""
    docker-compose exec db psql -U postgres
}

cmd_db_backup() {
    print_header
    timestamp=$(date +%Y%m%d_%H%M%S)
    backup_file="chat_psy_backup_$timestamp.sql"
    
    print_info "Creating database backup: $backup_file"
    docker-compose exec -T db pg_dump -U postgres chat_psy_dev > "$backup_file"
    print_success "Backup created: $backup_file"
    
    # Also gzip it
    gzip "$backup_file"
    print_success "Compressed: ${backup_file}.gz"
}

cmd_db_reset() {
    print_header
    print_warning "⚠ WARNING: This will DELETE ALL DATA!"
    read -p "Type 'yes' to confirm: " confirm
    
    if [ "$confirm" != "yes" ]; then
        print_info "Reset cancelled"
        return
    fi
    
    print_info "Resetting database..."
    docker-compose down -v
    docker-compose up -d db
    sleep 5
    docker-compose up -d web socket-server
    docker-compose exec web npx prisma migrate deploy
    docker-compose exec web npm run seed
    print_success "Database reset and seeded"
}

cmd_secrets() {
    print_header
    print_info "Generating new secrets..."
    bash "$SCRIPT_DIR/generate-docker-secrets.sh"
}

cmd_clean() {
    print_header
    print_warning "⚠ WARNING: This will DELETE all containers, images, and volumes!"
    read -p "Type 'yes' to confirm: " confirm
    
    if [ "$confirm" != "yes" ]; then
        print_info "Clean cancelled"
        return
    fi
    
    print_info "Cleaning up..."
    docker-compose down -v --rmi all
    print_success "Cleanup complete"
}

cmd_down() {
    print_header
    print_info "Stopping and removing containers (keeping volumes)..."
    docker-compose down
    print_success "Done"
}

cmd_shell() {
    if [ -z "$1" ]; then
        print_error "Service name required: ./scripts/docker-helper.sh shell <service>"
        echo "Available services: db, web, socket-server"
        return 1
    fi
    
    print_header
    print_info "Opening shell in '$1' service..."
    echo ""
    docker-compose exec "$1" /bin/sh
}

cmd_stats() {
    print_header
    print_info "Real-time resource usage (Ctrl+C to stop)..."
    echo ""
    docker stats --no-stream=false
}

cmd_inspect() {
    if [ -z "$1" ]; then
        print_error "Service name required: ./scripts/docker-helper.sh inspect <service>"
        return 1
    fi
    
    print_header
    print_info "Inspecting '$1' service..."
    echo ""
    docker-compose ps "$1"
    echo ""
    docker inspect "chat_psy-$1-1"
}

# Main
if [ -z "$1" ]; then
    cmd_help
else
    case "$1" in
        help)
            cmd_help
            ;;
        start)
            cmd_start
            ;;
        stop)
            cmd_stop
            ;;
        restart)
            cmd_restart
            ;;
        logs)
            cmd_logs "$2"
            ;;
        build)
            cmd_build "$2"
            ;;
        rebuild)
            cmd_rebuild
            ;;
        status)
            cmd_status
            ;;
        health)
            cmd_health
            ;;
        seed)
            cmd_seed
            ;;
        migrate)
            cmd_migrate
            ;;
        db-shell)
            cmd_db_shell
            ;;
        db-backup)
            cmd_db_backup
            ;;
        db-reset)
            cmd_db_reset
            ;;
        secrets)
            cmd_secrets
            ;;
        clean)
            cmd_clean
            ;;
        down)
            cmd_down
            ;;
        shell)
            cmd_shell "$2"
            ;;
        stats)
            cmd_stats
            ;;
        inspect)
            cmd_inspect "$2"
            ;;
        *)
            print_error "Unknown command: $1"
            echo ""
            cmd_help
            exit 1
            ;;
    esac
fi
