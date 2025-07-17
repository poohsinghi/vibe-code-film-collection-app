# Film Collection App - Development Guide

## 🚀 Quick Start

### 1. Setup Environment
```bash
# Clone the repository
git clone <your-repo-url>
cd film-collection-app

# Copy environment template
cp .env.example .env

# Get your API keys and update .env:
# - OMDB_API_KEY from http://www.omdbapi.com/apikey.aspx
# - TMDB_API_KEY from https://www.themoviedb.org/settings/api
```

### 2. Start with Docker (Recommended)
```bash
# Start everything with one command
make dev

# Or use the setup script
./scripts/dev-setup.sh

# View logs
make logs
```

### 3. Start Mobile App
```bash
cd mobile
npm install
npx expo start
```

## 🐳 Docker Commands

| Command | Description |
|---------|-------------|
| `make dev` | Start development environment |
| `make logs` | View all logs |
| `make backend-logs` | View backend logs only |
| `make stop` | Stop all containers |
| `make clean` | Stop and clean up everything |
| `make db-shell` | Connect to PostgreSQL |
| `make backend-shell` | SSH into backend container |
| `make status` | Check service status |

## 📊 Database Access

### Via Adminer (Web Interface)
- URL: http://localhost:8080
- Server: `db`
- Username: `filmuser`
- Password: `filmpass123`
- Database: `film_collection_db`

### Via Command Line
```bash
# Connect to database
make db-shell

# Reset database (WARNING: destroys data)
make db-reset
```

## 🔧 Development Workflow

### Backend Development
```bash
# View backend logs
make backend-logs

# Access backend container
make backend-shell

# Inside container, you can run:
npm run build
npm test
```

### Mobile Development
```bash
cd mobile

# Start Expo dev server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android

# Clear cache
npx expo start --clear
```

## 🌐 API Testing

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 📱 Mobile App Testing

### Testing on Physical Device

1. **Get your computer's IP address**:
   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Windows
   ipconfig
   ```

2. **Update API URL** in `mobile/src/services/api.ts`:
   ```typescript
   // Replace localhost with your IP
   return 'http://192.168.1.100:3000/api';
   ```

3. **Start Expo and scan QR code** with Expo Go app

### Common Issues

1. **Cannot connect to API from mobile**:
   - Ensure backend is running: `make status`
   - Check your computer's IP address
   - Update API URL in mobile app
   - Make sure devices are on same network

2. **Database connection issues**:
   - Check if PostgreSQL container is healthy: `make status`
   - Reset database: `make db-reset`
   - Check logs: `make logs`

3. **Port conflicts**:
   - Stop any services running on ports 3000, 5432, 8080
   - Or change ports in docker-compose.dev.yml

## 🧪 Testing

### Backend Tests
```bash
# Run from backend directory
cd backend
npm test

# Or from Docker
make backend-shell
npm test
```

### Mobile Tests
```bash
cd mobile
npm test
```

## 🚢 Production Deployment

### Build Production Images
```bash
make build
```

### Start Production Environment
```bash
make prod
```

### Environment Variables for Production
Update `.env` with production values:
- Strong JWT_SECRET
- Production database URL
- Production API keys

## 📁 Project Structure

```
├── backend/                 # Express API server
│   ├── src/
│   │   ├── config/         # Database & app config
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   └── types/          # TypeScript types
│   ├── database/
│   │   └── init.sql        # Database schema
│   ├── Dockerfile          # Production image
│   └── Dockerfile.dev      # Development image
├── mobile/                 # Expo React Native app
│   └── src/
│       ├── components/     # Reusable components
│       ├── hooks/          # React Query hooks
│       ├── navigation/     # Navigation setup
│       ├── screens/        # App screens
│       ├── services/       # API services
│       └── store/          # Zustand stores
├── scripts/                # Helper scripts
├── docker-compose.yml      # Production compose
├── docker-compose.dev.yml  # Development compose
└── Makefile               # Development commands
```

## 🔄 State Management

### Zustand Stores
- **Auth Store**: User authentication & profile
- **Film Store**: Local film state & UI

### React Query
- **API calls**: All server interactions
- **Caching**: Automatic request caching
- **Background updates**: Fresh data sync

## 📦 Key Dependencies

### Backend
- Express.js + TypeScript
- PostgreSQL + pg driver
- JWT authentication
- bcryptjs password hashing
- Axios for external APIs

### Mobile
- Expo + React Native
- React Navigation
- React Query (TanStack)
- Zustand state management
- NativeWind (Tailwind CSS)

## 🐛 Troubleshooting

### Backend Issues
```bash
# Check backend logs
make backend-logs

# Restart backend only
docker-compose -f docker-compose.dev.yml restart backend

# Check database connection
make db-shell
\dt  # List tables
```

### Mobile Issues
```bash
# Clear Expo cache
npx expo start --clear

# Reset Metro bundler
npx expo start --reset-cache

# Check network connectivity
curl http://localhost:3000/api/health
```

### Docker Issues
```bash
# Clean everything and restart
make clean
make dev

# Check Docker system
docker system df
docker system prune -f
```
