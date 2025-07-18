import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { client, db } from './index';

export const runMigrations = async () => {
  try {
    console.log('Running migrations...');
    
    // Check if tables already exist
    const tablesExist = await checkTablesExist();
    
    if (tablesExist) {
      console.log('✅ Tables already exist, skipping migrations');
      return;
    }
    
    await migrate(db, { migrationsFolder: './src/db/migrations' });
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    
    // If error is about tables already existing, that's ok
    if (error instanceof Error && error.message.includes('already exists')) {
      console.log('✅ Tables already exist, continuing...');
      return;
    }
    
    throw error;
  }
};

const checkTablesExist = async (): Promise<boolean> => {
  try {
    const result = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'films'
      );
    `;
    return result[0]?.exists || false;
  } catch (error) {
    console.log('Could not check if tables exist:', error);
    return false;
  }
};

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('All migrations completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}
