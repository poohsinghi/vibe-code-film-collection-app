#!/bin/bash

# Wait for database to be ready
echo "Waiting for database to be ready..."
until nc -z db 5432; do
  sleep 1
done
echo "Database is ready!"

# Try to run migrations, but don't fail if tables already exist
echo "Attempting to run migrations..."
npm run db:migrate || echo "Migration failed or tables already exist, continuing..."

# Start the application
echo "Starting the application..."
npm start
