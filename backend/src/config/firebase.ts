import { config } from 'firebase-functions';

// Secure configuration helper for Firebase Functions
export const getConfig = () => {
  // Firebase Functions runtime config
  const firebaseConfig = config();
  
  return {
    // Database configuration
    databaseUrl: firebaseConfig.app?.database_url || process.env.DATABASE_URL,
    
    // JWT secret
    jwtSecret: firebaseConfig.app?.jwt_secret || process.env.JWT_SECRET,
    
    // API keys
    omdbApiKey: firebaseConfig.app?.omdb_api_key || process.env.OMDB_API_KEY,
    tmdbApiKey: firebaseConfig.app?.tmdb_api_key || process.env.TMDB_API_KEY,
    
    // Environment
    nodeEnv: process.env.NODE_ENV || 'development'
  };
};

// Helper to check if required config is present
export const validateConfig = () => {
  const cfg = getConfig();
  
  const required = {
    databaseUrl: cfg.databaseUrl,
    jwtSecret: cfg.jwtSecret
  };
  
  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key, _]) => key);
    
  if (missing.length > 0) {
    throw new Error(`Missing required configuration: ${missing.join(', ')}`);
  }
  
  return cfg;
};
