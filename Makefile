# Film Collection App - Development Commands

.PHONY: install build up down logs clean setup fresh migrate help firebase-deploy firebase-serve lint lint-fix

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
	@echo ""
	@echo "🔥 Firebase:"
	@echo "  firebase-init     - Initialize Firebase project"
	@echo "  firebase-serve    - Run Firebase emulators locally"
	@echo "  firebase-deploy   - Deploy to Firebase"
	@echo "  firebase-logs     - View Firebase function logs"
	@echo "  firebase-config   - Set secrets securely (interactive)"
	@echo "  firebase-config-show - View current configuration"
	@echo ""
	@echo "🔍 Code Quality:"
	@echo "  lint             - Run ESLint on backend code"
	@echo "  lint-fix         - Fix ESLint issues automatically"

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

# Firebase deployment commands
firebase-init:
	@echo "🔥 Installing Firebase CLI and initializing project..."
	npm install -g firebase-tools
	firebase login
	firebase init

firebase-serve:
	@echo "🔥 Starting Firebase emulators..."
	cd backend && npm install
	firebase emulators:start

firebase-deploy:
	@echo "🔥 Deploying to Firebase..."
	cd backend && npm run build
	firebase deploy --only functions

firebase-logs:
	@echo "📜 Viewing Firebase function logs..."
	firebase functions:log

firebase-config:
	@echo "� Setting up Firebase environment variables securely..."
	@echo "⚠️  This will prompt you to enter sensitive values securely"
	@echo ""
	@echo "Setting JWT Secret..."
	@read -s -p "Enter JWT Secret (hidden): " jwt_secret && \
	firebase functions:config:set app.jwt_secret="$$jwt_secret"
	@echo ""
	@echo "Setting Database URL..."
	@read -s -p "Enter Database URL (hidden): " db_url && \
	firebase functions:config:set app.database_url="$$db_url"
	@echo ""
	@echo "Setting OMDB API Key (optional)..."
	@read -p "Enter OMDB API Key (or press Enter to skip): " omdb_key && \
	if [ ! -z "$$omdb_key" ]; then firebase functions:config:set app.omdb_api_key="$$omdb_key"; fi
	@echo "Setting TMDB API Key (optional)..."
	@read -p "Enter TMDB API Key (or press Enter to skip): " tmdb_key && \
	if [ ! -z "$$tmdb_key" ]; then firebase functions:config:set app.tmdb_api_key="$$tmdb_key"; fi
	@echo "✅ Configuration set securely!"

firebase-config-show:
	@echo "🔍 Current Firebase configuration:"
	firebase functions:config:get

# Code quality commands
lint:
	@echo "🔍 Running ESLint on backend code..."
	cd backend && npm run lint

lint-fix:
	@echo "🔧 Fixing ESLint issues automatically..."
	cd backend && npm run lint:fix
