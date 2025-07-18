import * as functions from 'firebase-functions';

// Secure configuration for Firebase Functions
export const getSecureConfig = () => {
  // Get Firebase Functions runtime configuration
  const firebaseConfig = functions.config();
  
  return {
    // Database configuration
    databaseUrl: firebaseConfig.app?.database_url || process.env.DATABASE_URL,
    
    // JWT secret
    jwtSecret: firebaseConfig.app?.jwt_secret || process.env.JWT_SECRET,
    
    // API keys - retrieved from Firebase config, not environment files
    omdbApiKey: firebaseConfig.app?.omdb_api_key || process.env.OMDB_API_KEY,
    tmdbApiKey: firebaseConfig.app?.tmdb_api_key || process.env.TMDB_API_KEY,
    
    // Environment
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // Firebase project info
    projectId: process.env.GOOGLE_CLOUD_PROJECT || firebaseConfig.app?.project_id
  };
};

// Validate that required secrets are available
export const validateSecrets = () => {
  const config = getSecureConfig();
  
  const required = {
    databaseUrl: config.databaseUrl,
    jwtSecret: config.jwtSecret
  };
  
  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key, _]) => key);
    
  if (missing.length > 0) {
    console.error('❌ Missing required configuration:', missing.join(', '));
    console.log('💡 Set configuration with:');
    missing.forEach(key => {
      const firebaseKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      console.log(`   firebase functions:config:set app.${firebaseKey}="your-value"`);
    });
    throw new Error(`Missing required configuration: ${missing.join(', ')}`);
  }
  
  // Warn about missing optional keys
  const optional = {
    omdbApiKey: config.omdbApiKey,
    tmdbApiKey: config.tmdbApiKey
  };
  
  const missingOptional = Object.entries(optional)
    .filter(([_, value]) => !value)
    .map(([key, _]) => key);
    
  if (missingOptional.length > 0) {
    console.warn('⚠️ Missing optional configuration:', missingOptional.join(', '));
    console.log('💡 Some features may not work without these API keys');
  }
  
  return config;
};

// Helper to check if we're running in Firebase Functions
export const isFirebaseEnvironment = (): boolean => {
  return !!process.env.FUNCTION_NAME || !!process.env.GOOGLE_CLOUD_PROJECT;
};
