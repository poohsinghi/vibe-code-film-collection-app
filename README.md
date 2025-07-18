# Film Collection App

A modern mobile application for managing your film collection, built with Expo React Native, Node.js, and PostgreSQL.

## 🎬 Features

- **Film Search** - Search films from IMDB database with manual search button
- **Personal Watchlist** - Add films to your personal collection
- **User Authentication** - Secure login and registration
- **Clean UI** - Beautiful, responsive interface with Tailwind CSS and SafeAreaView
- **Type Safety** - Full TypeScript implementation across frontend and backend

## 🚀 Tech Stack

### Frontend (Mobile App)
- **Expo** - React Native framework with TypeScript
- **React Navigation** - App navigation
- **NativeWind** - Tailwind CSS for React Native
- **SafeAreaView** - Proper safe area handling for all screens
- **Axios** - HTTP client for API communication

### Backend (API)
- **Node.js & Express** - RESTful API server with TypeScript
- **Clean Architecture** - Controllers, Services, and Database layers
- **Drizzle ORM** - Type-safe database operations
- **PostgreSQL** - Relational database
- **JWT Authentication** - Secure user sessions
- **bcryptjs** - Password hashing

### Database
- **PostgreSQL** - Production database
- **Drizzle ORM** - Type-safe SQL queries and migrations
- **Schema Management** - Automated migrations and version control

### External APIs
- **OMDB API** - Film data and metadata

## 📁 Project Structure

```
├── frontend/               # Expo React Native app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── screens/        # App screens with SafeAreaView
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript definitions
│   ├── App.tsx
│   └── package.json
├── backend/                # Express API server
│   ├── src/
│   │   ├── controllers/    # API route handlers
│   │   ├── services/       # Business logic layer
│   │   ├── database/       # Drizzle ORM setup and schema
│   │   ├── middleware/     # Authentication and validation
│   │   └── types/          # TypeScript definitions
│   ├── drizzle/           # Database migrations
│   └── package.json
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript types
│   │   └── index.ts        # Server entry point
│   └── package.json
└── README.md
```

## Getting Started

├── docker/                 # Docker configuration
├── scripts/               # Setup and utility scripts
├── docker-compose.yml     # Production Docker setup
├── docker-compose.dev.yml # Development Docker setup
├── Makefile              # Development commands
└── README.md
```

## 🛠️ Setup & Installation

### Prerequisites
- **Node.js 18+** 
- **Docker & Docker Compose**
- **Expo CLI** - `npm install -g @expo/cli`
- **iOS Simulator** / **Android Emulator**

### 🚀 Quick Start (Recommended)

#### Option 1: Fresh Installation
```bash
# Clone the repository
git clone <your-repo>
cd film-collection-app

# Fresh setup (removes all existing data)
make fresh
```

#### Option 2: Setup with Existing Data
```bash
# Clone the repository
git clone <your-repo>
cd film-collection-app

# Setup with existing database
make setup
```

#### Option 3: Manual Docker Commands
```bash
# Start development environment
make dev

# Or using Docker Compose directly
docker-compose -f docker-compose.dev.yml up --build
```

### 📱 Mobile App Setup

```bash
# Install frontend dependencies
cd frontend
npm install

# Start Expo development server
npx expo start
```

### 🛠️ Development Commands

```bash
# Installation & Setup
make install      # Install all dependencies
make setup        # Setup with existing database
make fresh        # Fresh installation (removes all data)

# Development
make dev          # Start development environment
make logs         # Show all container logs
make down         # Stop all services

# Database Operations
make migrate      # Run database migrations
make db-shell     # Open database shell
make db-backup    # Create database backup

# Production
make build        # Build production containers
make up           # Start production environment
```

### 📊 Database Management

The app uses **Drizzle ORM** for type-safe database operations:

```bash
# Run migrations
cd backend
npm run db:migrate

# Generate new migration
npm run db:generate

# View database schema
npm run db:studio
```

### Manual Setup (Alternative)

#### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up PostgreSQL database:
   ```bash
   createdb film_collection_db
   ```

4. Configure environment variables in `backend/.env`:
   ```
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key
   DATABASE_URL=postgresql://username:password@localhost:5432/film_collection_db
   OMDB_API_KEY=your-omdb-api-key
   TMDB_API_KEY=your-tmdb-api-key
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Mobile App Setup

1. Navigate to mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npx expo start
   ```

4. Run on device/simulator:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on physical device

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Films
- `GET /api/films/search?q=query` - Search films
- `GET /api/films/details/:imdbId` - Get film details
- `GET /api/films/trending` - Get trending films
- `GET /api/films/recommendations` - Get user recommendations

### Watchlist
- `GET /api/watchlist` - Get user's watchlist
- `POST /api/watchlist` - Add film to watchlist
- `PUT /api/watchlist/:id` - Update watchlist entry
- `DELETE /api/watchlist/:id` - Remove from watchlist

### User
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password

## Docker Commands

### Using Make (Recommended)
```bash
make dev          # Start development environment
make logs         # View application logs
make stop         # Stop all containers
make clean        # Stop and clean up everything
make db-shell     # Connect to database
make backend-shell # Connect to backend container
```

### Using Docker Compose Directly
```bash
# Development
docker compose -f docker-compose.dev.yml up -d --build
docker compose -f docker-compose.dev.yml logs -f
docker compose -f docker-compose.dev.yml down

# Production
docker compose up -d --build
```

### Available Services
- **Backend API**: http://localhost:3000
- **Database Admin**: http://localhost:8080 (Adminer)
  - Server: `db`
  - Username: `filmuser`
  - Password: `filmpass123`
  - Database: `film_collection_db`

## Development

### Running Tests
```bash
# Backend tests
cd backend && npm test

# Mobile app tests  
cd mobile && npm test
```

### Building for Production
```bash
# Backend
cd backend && npm run build

# Mobile app
cd mobile && npx expo build
```

## Environment Variables

### Backend (.env)
```
PORT=3000
NODE_ENV=development|production
JWT_SECRET=your-jwt-secret
DATABASE_URL=postgresql://user:pass@host:port/db
OMDB_API_KEY=your-omdb-key
TMDB_API_KEY=your-tmdb-key
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## API Keys Setup

### OMDB API
1. Visit [http://www.omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx)
2. Sign up for a free API key
3. Add to your `.env` file

### TMDB API
1. Visit [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
2. Create an account and request API access
3. Add to your `.env` file
