# Film Collection Backend

A RESTful API built with Express.js, TypeScript, and Drizzle ORM for managing film collections and watchlists.

## Architecture

The backend follows a clean architecture pattern with separation of concerns:

### Directory Structure

```
src/
├── controllers/     # Request handlers and response logic
├── services/        # Business logic and external API calls
├── db/             # Database schema, connection, and migrations
├── routes/         # API route definitions
├── middleware/     # Express middleware
├── types/          # TypeScript type definitions
└── config/         # Configuration files
```

### Key Components

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and data operations
- **Drizzle ORM**: Type-safe database operations with PostgreSQL
- **Middleware**: Authentication, error handling, and request processing

## Database Schema

### Tables

1. **users**: User accounts and profiles
2. **films**: Film metadata from external APIs
3. **watchlist**: User's film watchlist with status tracking

### Migration Commands

```bash
# Generate migrations from schema changes
npm run db:generate

# Run migrations
npm run db:migrate

# Push schema directly to database (development)
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Films
- `GET /api/films/search?q=query` - Search films from external APIs
- `GET /api/films/popular` - Get popular films
- `GET /api/films/:id` - Get film by ID
- `GET /api/films/details/:imdbId` - Get detailed film information
- `GET /api/films/recommendations` - Get film recommendations (protected)

### Watchlist
- `GET /api/watchlist` - Get user's watchlist (protected)
- `POST /api/watchlist` - Add film to watchlist (protected)
- `PUT /api/watchlist/:filmId` - Update watchlist item (protected)
- `DELETE /api/watchlist/:filmId` - Remove from watchlist (protected)
- `GET /api/watchlist/stats` - Get watchlist statistics (protected)
- `GET /api/watchlist/recent` - Get recent watchlist activity (protected)

## Environment Variables

```
DATABASE_URL=postgresql://username:password@localhost:5432/database
JWT_SECRET=your-jwt-secret
OMDB_API_KEY=your-omdb-api-key
NODE_ENV=development
PORT=3000
```

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## External APIs

- **OMDB API**: For film search and detailed information
- **TMDB API**: Alternative film data source (can be added)

## Features

- Type-safe database operations with Drizzle ORM
- JWT-based authentication
- External API integration for film data
- Comprehensive watchlist management
- Error handling and validation
- Database migrations and schema management
