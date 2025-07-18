import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Create the connection
const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create postgres client
export const client = postgres(connectionString, {
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Create drizzle db instance
export const db = drizzle(client, { schema });

// Connection test function
export const connectDB = async () => {
  try {
    await client`SELECT 1`;
    console.log('✅ Connected to PostgreSQL database with Drizzle ORM');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    throw error;
  }
};
