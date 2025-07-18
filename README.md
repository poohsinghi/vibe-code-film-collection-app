# Film Collection App

A modern mobile application for managing your film collection, built with Expo React Native and Node.js.

## Features

- 🎬 Search films from IMDB database
- 📱 Add films to your personal watchlist
- ⭐ Rate and review watched films
- 🎯 Get personalized film recommendations
- 📊 Track your watching statistics
- 🎨 Beautiful, responsive UI with Tailwind CSS

## Tech Stack

### Frontend (Mobile App)
- **Expo** - React Native framework
- **TypeScript** - Type safety
- **React Navigation** - Navigation
- **React Query** - Server state management
- **Zustand** - Local state management
- **NativeWind** - Tailwind CSS for React Native
- **Axios** - HTTP client

### Backend (API)
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### External APIs
- **OMDB API** - Film data
- **TMDB API** - Trending films and additional metadata

## Project Structure

```
├── mobile/                 # Expo React Native app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # React Query hooks
│   │   ├── navigation/     # Navigation configuration
│   │   ├── screens/        # App screens
│   │   ├── services/       # API services
│   │   └── store/          # Zustand stores
│   ├── App.tsx
│   └── package.json
├── backend/                # Express API server
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

### Prerequisites
- Node.js 18+ 
- Docker & Docker Compose
- Expo CLI
- iOS Simulator / Android Emulator

### Quick Start with Docker (Recommended)

1. **Clone and setup**:
   ```bash
   git clone <your-repo>
   cd film-collection-app
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys (see API Keys Setup section)
   ```

3. **Start with Docker**:
   ```bash
   # Using the setup script
   ./scripts/dev-setup.sh
   
   # Or using Make
   make dev
   
   # Or using Docker Compose directly
   docker compose -f docker-compose.dev.yml up -d --build
   ```

4. **Start the mobile app**:
   ```bash
   cd mobile
   npm install
   npx expo start
   ```

### Manual Setup (Without Docker)

#### Backend Setup

1. Navigate to backend directory:
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
