#!/bin/bash

echo "🚀 Setting up Film Collection App with Drizzle ORM..."

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to clean up existing containers and volumes
cleanup_existing() {
    echo "🧹 Cleaning up existing containers and volumes..."
    docker compose down -v
    docker volume rm vibe-code-app_postgres_data 2>/dev/null || true
    docker volume rm vibe-code-app_postgres_data_dev 2>/dev/null || true
}

# Function to start fresh database
start_fresh() {
    echo "🗄️ Starting fresh database setup..."
    
    # Start only the database first
    docker compose up -d db
    
    # Wait for database to be ready
    echo "⏳ Waiting for database to be ready..."
    until docker compose exec db pg_isready -U filmuser -d film_collection_db; do
        sleep 2
    done
    
    echo "✅ Database is ready!"
}

# Function to run migrations
run_migrations() {
    echo "📋 Running Drizzle migrations..."
    cd backend
    npm run db:migrate || echo "⚠️ Migrations may have conflicts, continuing..."
    cd ..
}

# Function to start all services
start_services() {
    echo "🚀 Starting all services..."
    docker compose up -d
    
    echo "✅ Setup complete!"
    echo ""
    echo "📱 Frontend: http://localhost:8081"
    echo "🔧 Backend API: http://localhost:3000"
    echo "🗄️ Database Admin: http://localhost:8080"
    echo ""
    echo "To view logs: make logs"
    echo "To stop services: make down"
}

# Main execution
check_docker

# Ask user if they want to start fresh
read -p "Do you want to start with a fresh database? This will remove all existing data. (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cleanup_existing
    start_fresh
    run_migrations
    start_services
else
    echo "🔄 Starting with existing database..."
    docker compose up -d
    echo "✅ Services started!"
fi
