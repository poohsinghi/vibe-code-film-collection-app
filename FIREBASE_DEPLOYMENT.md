# Firebase Deployment Guide

## 🔥 Firebase Deployment Options

Your Film Collection backend can be deployed to Firebase using **Firebase Cloud Functions**. This guide will walk you through the complete setup process.

## 📋 Prerequisites

1. **Firebase Account**: Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. **Firebase CLI**: Install globally with `npm install -g firebase-tools`
3. **Database**: Set up a cloud database (Firebase Firestore, Cloud SQL, or external PostgreSQL)

## 🚀 Quick Setup

### Step 1: Initialize Firebase
```bash
# Initialize Firebase in your project
make firebase-init

# Or manually:
firebase login
firebase init functions
```

### Step 2: Configure Environment Variables
```bash
# Copy the Firebase environment template
cp backend/.env.firebase backend/.env.production

# Edit the environment variables:
# - DATABASE_URL: Your cloud database connection string
# - JWT_SECRET: A secure secret for JWT tokens
# - OMDB_API_KEY: Your OMDB API key
# - TMDB_API_KEY: Your TMDB API key
```

### Step 3: Deploy to Firebase
```bash
# Deploy functions to Firebase
make firebase-deploy

# Or manually:
cd backend && npm run build
firebase deploy --only functions
```

## 🛠️ Detailed Configuration

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing one
3. Enable **Cloud Functions** in the Firebase console
4. Update `.firebaserc` with your project ID:
   ```json
   {
     "projects": {
       "default": "your-firebase-project-id"
     }
   }
   ```

### 2. Database Configuration

#### Option A: Cloud SQL (Recommended for PostgreSQL)
```bash
# Create a Cloud SQL PostgreSQL instance
gcloud sql instances create film-collection-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1

# Create database and user
gcloud sql databases create film_collection_db --instance=film-collection-db
gcloud sql users create filmuser --instance=film-collection-db --password=securepassword

# Connection string format:
# postgresql://filmuser:password@/film_collection_db?host=/cloudsql/PROJECT_ID:REGION:INSTANCE_NAME
```

#### Option B: External PostgreSQL
```bash
# Use any external PostgreSQL service (Heroku, AWS RDS, etc.)
# Update DATABASE_URL in your environment configuration
```

### 3. Environment Variables Setup

#### Method A: Firebase Config (Recommended)
```bash
# Set environment variables in Firebase
firebase functions:config:set \
  app.jwt_secret="your-super-secure-jwt-secret" \
  app.database_url="postgresql://user:pass@host:port/db" \
  app.omdb_api_key="your-omdb-key" \
  app.tmdb_api_key="your-tmdb-key"
```

#### Method B: .env File
Create `backend/.env.production`:
```env
DATABASE_URL=postgresql://user:pass@host:port/database
JWT_SECRET=your-super-secure-jwt-secret-here
OMDB_API_KEY=your-omdb-api-key
TMDB_API_KEY=your-tmdb-api-key
NODE_ENV=production
```

## 🔧 Development Workflow

### Local Testing with Firebase Emulators
```bash
# Start Firebase emulators locally
make firebase-serve

# This will start:
# - Functions emulator on http://localhost:5001
# - Firebase UI on http://localhost:4000
```

### Deploy to Production
```bash
# Build and deploy
make firebase-deploy

# View deployment logs
make firebase-logs
```

## 📊 Firebase Functions Structure

Your deployed function will be available at:
```
https://us-central1-your-project-id.cloudfunctions.net/api
```

API endpoints:
- `GET /api/health` - Health check
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/films/search` - Search films
- `GET /api/watchlist` - Get user watchlist
- `POST /api/watchlist` - Add to watchlist

## 🎯 Production Considerations

### 1. Database Migrations
```typescript
// Migrations should be run manually in production
// Connect to your cloud database and run:
npm run db:migrate
```

### 2. CORS Configuration
The app is configured with CORS for your frontend domain. Update if needed:
```typescript
app.use(cors({
  origin: ['http://localhost:8081', 'https://your-domain.com']
}));
```

### 3. Security
- Use strong JWT secrets
- Enable Firebase security rules
- Use environment variables for all secrets
- Enable HTTPS only

### 4. Monitoring
```bash
# View function logs
firebase functions:log

# Monitor in Firebase Console
# Go to Functions section in Firebase Console
```

## 🚀 Alternative: Cloud Run Deployment

If you prefer Docker-based deployment, you can also deploy to **Google Cloud Run**:

```bash
# Build and deploy to Cloud Run
gcloud run deploy film-collection-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## 📈 Scaling and Performance

- **Cold Starts**: Firebase Functions have cold starts (~1-3 seconds)
- **Concurrent Requests**: Each function instance handles 1000 concurrent requests
- **Memory**: Default 256MB, can increase if needed
- **Timeout**: Default 60 seconds for HTTP functions

## 🛠️ Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify DATABASE_URL format
   - Check Cloud SQL proxy configuration
   - Ensure database exists and user has permissions

2. **Environment Variable Issues**
   - Use `firebase functions:config:get` to verify
   - Check .env files are not committed to git
   - Verify environment variables in Firebase Console

3. **Build Errors**
   - Run `npm run build` locally first
   - Check TypeScript compilation errors
   - Verify all dependencies are in package.json

### Debug Commands
```bash
# View current Firebase config
firebase functions:config:get

# Test functions locally
firebase emulators:start --only functions

# View detailed logs
firebase functions:log --only api

# Check function status
firebase functions:list
```

## ✅ Deployment Checklist

- [ ] Firebase project created and configured
- [ ] Cloud database set up (Cloud SQL or external)
- [ ] Environment variables configured
- [ ] Dependencies installed (`npm install` in backend/)
- [ ] Code builds successfully (`npm run build`)
- [ ] Local emulators tested (`firebase emulators:start`)
- [ ] Functions deployed (`firebase deploy --only functions`)
- [ ] API endpoints tested in production
- [ ] Frontend updated with production API URL

Your Film Collection API is now ready for production on Firebase! 🎉
