# Film Collection App - Docker Management

.PHONY: help dev prod build stop clean logs db-shell backend-shell

# Default target
help:
	@echo "Film Collection App - Docker Commands"
	@echo ""
	@echo "Development:"
	@echo "  dev        - Start development environment"
	@echo "  logs       - View application logs"
	@echo "  stop       - Stop all containers"
	@echo "  clean      - Stop containers and clean up"
	@echo ""
	@echo "Database:"
	@echo "  db-shell   - Connect to PostgreSQL database"
	@echo "  db-reset   - Reset database (WARNING: destroys all data)"
	@echo ""
	@echo "Backend:"
	@echo "  backend-shell - Connect to backend container shell"
	@echo "  backend-logs  - View backend logs only"
	@echo ""
	@echo "Production:"
	@echo "  prod       - Start production environment"
	@echo "  build      - Build production images"

# Development environment
dev:
	@echo "🚀 Starting development environment..."
	@docker-compose -f docker-compose.dev.yml up -d --build
	@echo "✅ Development environment started!"
	@echo "   - Backend API: http://localhost:3000"
	@echo "   - Database Admin: http://localhost:8080"

# Production environment
prod:
	@echo "🚀 Starting production environment..."
	@docker-compose up -d --build

# Build images
build:
	@echo "🔨 Building Docker images..."
	@docker-compose build

# View logs
logs:
	@docker-compose -f docker-compose.dev.yml logs -f

backend-logs:
	@docker-compose -f docker-compose.dev.yml logs -f backend

# Stop containers
stop:
	@echo "🛑 Stopping containers..."
	@docker-compose -f docker-compose.dev.yml down

# Clean up
clean:
	@echo "🧹 Cleaning up containers and volumes..."
	@docker-compose -f docker-compose.dev.yml down -v
	@docker system prune -f

# Database shell
db-shell:
	@echo "📊 Connecting to database..."
	@docker-compose -f docker-compose.dev.yml exec db psql -U filmuser -d film_collection_db

# Reset database
db-reset:
	@echo "⚠️  WARNING: This will destroy all database data!"
	@read -p "Are you sure? [y/N] " -n 1 -r && echo && \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose -f docker-compose.dev.yml down -v && \
		docker-compose -f docker-compose.dev.yml up -d db && \
		echo "✅ Database reset complete!"; \
	fi

# Backend shell
backend-shell:
	@echo "🖥️  Connecting to backend container..."
	@docker-compose -f docker-compose.dev.yml exec backend sh

# Check service status
status:
	@docker-compose -f docker-compose.dev.yml ps
