import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  let connection;
  
  try {
    console.log('🔌 Connecting to MySQL...');
    
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'ihebiheb11',
      database: process.env.DB_NAME || 'beja_marketplace'
    };
    
    console.log('Connecting with:', { ...dbConfig, password: '***' });
    
    connection = await mysql.createConnection(dbConfig);

    console.log('✅ Connected to MySQL');

    const migrationPath = path.join(__dirname, 'database', 'migration_add_user_type.sql');
    const migration = fs.readFileSync(migrationPath, 'utf8');

    console.log('📖 Reading migration file...');
    
    const statements = migration
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('USE'));

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await connection.query(statement);
          console.log(`✅ Executed statement ${i + 1}/${statements.length}`);
        } catch (error) {
          // Ignore errors for IF NOT EXISTS and duplicate column errors
          if (error.code !== 'ER_TABLE_EXISTS_ERROR' && 
              error.code !== 'ER_DUP_ENTRY' &&
              error.code !== 'ER_DUP_FIELDNAME' &&
              !error.message.includes('already exists') &&
              !error.message.includes('Duplicate column')) {
            console.warn(`⚠️  Statement ${i + 1} warning:`, error.message);
          } else {
            console.log(`ℹ️  Statement ${i + 1} skipped (already exists)`);
          }
        }
      }
    }

    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('\n❌ Error running migration:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connection closed');
    }
  }
}

runMigration();

