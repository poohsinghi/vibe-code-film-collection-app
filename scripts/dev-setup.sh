#!/bin/bash

# Film Collection App - Development Setup Script

set -e

echo "🚀 Setting up Film Collection App for development..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your API keys before continuing"
    echo "   - Get OMDB API key from: http://www.omdbapi.com/apikey.aspx"
    echo "   - Get TMDB API key from: https://www.themoviedb.org/settings/api"
    echo ""
    read -p "Press Enter after updating .env file..."
fi

# Build and start services
echo "🐳 Building and starting Docker containers..."
docker compose -f docker-compose.dev.yml up --build -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Check if services are healthy
echo "🔍 Checking service health..."
docker compose -f docker-compose.dev.yml ps

echo ""
echo "✅ Development environment is ready!"
echo ""
echo "📱 Services available at:"
echo "   - Backend API: http://localhost:3000"
echo "   - API Health: http://localhost:3000/api/health"
echo "   - Database Admin: http://localhost:8080"
echo "     (Server: db, Username: filmuser, Password: filmpass123)"
echo ""
echo "🛠️  To view logs: docker compose -f docker-compose.dev.yml logs -f"
echo "🛑 To stop: docker compose -f docker-compose.dev.yml down"
echo ""
echo "🔧 Now start your mobile app:"
echo "   cd mobile && npx expo start"
