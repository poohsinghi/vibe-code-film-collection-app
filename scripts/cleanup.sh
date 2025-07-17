#!/bin/bash

# Stop and clean up Docker containers

echo "🛑 Stopping Film Collection App containers..."

docker-compose -f docker-compose.dev.yml down

echo "🧹 Cleaning up unused containers and volumes..."
docker system prune -f

echo "✅ Cleanup complete!"
