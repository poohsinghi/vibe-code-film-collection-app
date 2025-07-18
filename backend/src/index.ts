import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './db';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import filmRoutes from './routes/films';
import userRoutes from './routes/users';
import watchlistRoutes from './routes/watchlist';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/films', filmRoutes);
app.use('/api/users', userRoutes);
app.use('/api/watchlist', watchlistRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Film Collection API is running' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    
    // Run migrations in development (with error handling)
    if (process.env.NODE_ENV !== 'production') {
      try {
        const { runMigrations } = await import('./db/migrate');
        await runMigrations();
      } catch (migrationError) {
        console.warn('⚠️ Migration warning:', migrationError);
        console.log('📋 Continuing with existing database schema...');
      }
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
