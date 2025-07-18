# Film Collection App - Development Commands

.PHONY: install build up down logs clean setup fresh migrate help

# Default target
help:
	@echo "📚 Film Collection App - Available Commands:"
	@echo ""
	@echo "🚀 Setup & Installation:"
	@echo "  install     - Install dependencies"
	@echo "  setup       - Setup with existing database"
	@echo "  fresh       - Fresh installation (removes all data)"
	@echo ""
	@echo "🔧 Development:"
	@echo "  dev         - Start development environment"
	@echo "  logs        - Show all container logs"
	@echo "  down        - Stop all services"
	@echo "  clean       - Clean up containers and volumes"
	@echo ""
	@echo "📋 Database:"
	@echo "  migrate     - Run database migrations"
	@echo "  db-shell    - Open database shell"
	@echo "  db-backup   - Create database backup"
	@echo ""
	@echo "🏗️ Production:"
	@echo "  build       - Build production containers"
	@echo "  up          - Start production environment"

# Installation and Setup
install:
	@echo "📦 Installing dependencies..."
	cd frontend && npm install
	cd backend && npm install

# Setup with existing database
setup:
	@echo "🚀 Setting up development environment..."
	chmod +x setup-drizzle.sh
	./setup-drizzle.sh

# Fresh installation (removes all data)
fresh:
	@echo "🆕 Fresh installation - removing all data..."
	docker compose down -v
	docker volume rm vibe-code-app_postgres_data 2>/dev/null || true
	docker volume rm vibe-code-app_postgres_data_dev 2>/dev/null || true
	chmod +x setup-drizzle.sh
	./setup-drizzle.sh

# Development
dev:
	@echo "🔧 Starting development environment..."
	docker compose -f docker-compose.dev.yml up --build

# Production
build:
	@echo "🏗️ Building production containers..."
	docker compose build

up:
	@echo "🚀 Starting production environment..."
	docker compose up -d

# Database operations
migrate:
	@echo "📋 Running database migrations..."
	cd backend && npm run db:migrate

migrate-fresh:
	@echo "🔄 Running fresh migrations..."
	cd backend && npm run db:drop && npm run db:migrate

# Monitoring
logs:
	@echo "📜 Showing container logs..."
	docker compose logs -f

logs-backend:
	@echo "📜 Showing backend logs..."
	docker compose logs -f backend

logs-frontend:
	@echo "📜 Showing frontend logs..."
	docker compose logs -f frontend

logs-db:
	@echo "📜 Showing database logs..."
	docker compose logs -f db

# Cleanup
down:
	@echo "⬇️ Stopping all services..."
	docker compose down

clean:
	@echo "🧹 Cleaning up containers and volumes..."
	docker compose down -v
	docker system prune -f

clean-all:
	@echo "🗑️ Removing everything (containers, volumes, images)..."
	docker compose down -v
	docker system prune -af
	docker volume rm vibe-code-app_postgres_data 2>/dev/null || true
	docker volume rm vibe-code-app_postgres_data_dev 2>/dev/null || true

# Database utilities
db-shell:
	@echo "🐘 Opening database shell..."
	docker compose exec db psql -U filmuser -d film_collection_db

db-backup:
	@echo "💾 Creating database backup..."
	docker compose exec db pg_dump -U filmuser film_collection_db > backup_$(shell date +%Y%m%d_%H%M%S).sql

# Utility commands
status:
	@echo "📊 Checking service status..."
	docker compose ps

backend-shell:
	@echo "🖥️ Connecting to backend container..."
	docker compose exec backend sh

db-reset:
	@echo "⚠️ WARNING: This will destroy all database data!"
	@read -p "Are you sure? [y/N] " -n 1 -r && echo && \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker compose down -v && \
		docker compose up -d db && \
		echo "✅ Database reset complete!"; \
	fi
