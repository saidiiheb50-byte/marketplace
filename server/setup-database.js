import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔌 Connecting to MySQL...');
    
    // First connect without database to create it if needed
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    console.log('✅ Connected to MySQL server');

    // Read and execute schema file
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📖 Reading schema file...');
    
    // First, create database if it doesn't exist
    console.log('📊 Creating database if it doesn\'t exist...');
    try {
      await connection.query('CREATE DATABASE IF NOT EXISTS beja_marketplace');
      await connection.query('USE beja_marketplace');
      console.log('✅ Database ready');
    } catch (error) {
      console.warn('⚠️  Database creation warning:', error.message);
    }
    
    // Split by semicolons and execute each statement
    // Filter out comments and empty statements, but keep CREATE DATABASE and USE statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => {
        // Skip empty statements and comments
        if (stmt.length === 0 || stmt.startsWith('--')) return false;
        // Skip CREATE DATABASE and USE since we handle them separately
        const upper = stmt.toUpperCase().trim();
        if (upper.startsWith('CREATE DATABASE') || upper.startsWith('USE ')) return false;
        return true;
      });

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await connection.query(statement);
          console.log(`✅ Executed statement ${i + 1}/${statements.length}`);
        } catch (error) {
          // Ignore errors for IF NOT EXISTS statements
          if (error.code !== 'ER_TABLE_EXISTS_ERROR' && 
              error.code !== 'ER_DB_CREATE_EXISTS' &&
              !error.message.includes('already exists')) {
            console.warn(`⚠️  Statement ${i + 1} warning:`, error.message);
          }
        }
      }
    }

    console.log('\n✅ Database setup completed successfully!');
    console.log('📊 Database: beja_marketplace');
    console.log('📋 Tables created: users, categories, products, cart, orders, order_items, reviews, wishlist, messages');
    console.log('\n🎉 You can now start the server and register users!');

  } catch (error) {
    console.error('\n❌ Error setting up database:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Make sure MySQL/MariaDB is running!');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Check your database credentials in .env file:');
      console.error('   DB_HOST=localhost');
      console.error('   DB_USER=root');
      console.error('   DB_PASSWORD=your_password');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connection closed');
    }
  }
}

setupDatabase();

