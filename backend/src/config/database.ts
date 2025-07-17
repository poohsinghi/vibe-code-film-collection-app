import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL database');
    
    // Create tables if they don't exist
    await createTables();
    
    client.release();
  } catch (error) {
    console.error('❌ Database connection error:', error);
    throw error;
  }
};

const createTables = async () => {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      favorite_genres TEXT[],
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createFilmsTable = `
    CREATE TABLE IF NOT EXISTS films (
      id SERIAL PRIMARY KEY,
      imdb_id VARCHAR(20) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      year INTEGER,
      genre VARCHAR(255),
      director VARCHAR(255),
      plot TEXT,
      poster_url TEXT,
      rating DECIMAL(3,1),
      runtime INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createWatchlistTable = `
    CREATE TABLE IF NOT EXISTS watchlist (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      film_id INTEGER REFERENCES films(id) ON DELETE CASCADE,
      status VARCHAR(20) DEFAULT 'want_to_watch', -- 'want_to_watch', 'watched', 'currently_watching'
      rating INTEGER CHECK (rating >= 1 AND rating <= 10),
      review TEXT,
      watched_date DATE,
      added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, film_id)
    );
  `;

  const createCollectionsTable = `
    CREATE TABLE IF NOT EXISTS collections (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      is_public BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createCollectionFilmsTable = `
    CREATE TABLE IF NOT EXISTS collection_films (
      id SERIAL PRIMARY KEY,
      collection_id INTEGER REFERENCES collections(id) ON DELETE CASCADE,
      film_id INTEGER REFERENCES films(id) ON DELETE CASCADE,
      added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(collection_id, film_id)
    );
  `;

  try {
    await pool.query(createUsersTable);
    await pool.query(createFilmsTable);
    await pool.query(createWatchlistTable);
    await pool.query(createCollectionsTable);
    await pool.query(createCollectionFilmsTable);
    console.log('✅ Database tables created/verified');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
};

export { pool };
