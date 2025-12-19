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

    // Create database and use it
    console.log('📊 Creating database if it doesn\'t exist...');
    await connection.query('CREATE DATABASE IF NOT EXISTS beja_marketplace');
    await connection.query('USE beja_marketplace');
    console.log('✅ Database ready');

    // Read schema file
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📖 Reading schema file...');
    
    // Remove comments and split by semicolons
    const cleanedSchema = schema
      .split('\n')
      .filter(line => !line.trim().startsWith('--') && line.trim().length > 0)
      .join('\n');
    
    // Split by semicolons
    const statements = cleanedSchema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => {
        if (stmt.length === 0) return false;
        const upper = stmt.toUpperCase().trim();
        // Skip CREATE DATABASE and USE since we already handled them
        if (upper.startsWith('CREATE DATABASE') || upper.startsWith('USE ')) return false;
        return true;
      });

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    let successCount = 0;
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await connection.query(statement);
          successCount++;
          // Show progress for every 5th statement
          if ((i + 1) % 5 === 0 || i === statements.length - 1) {
            console.log(`✅ Executed ${i + 1}/${statements.length} statements...`);
          }
        } catch (error) {
          // Ignore errors for IF NOT EXISTS statements
          if (error.code === 'ER_TABLE_EXISTS_ERROR' || 
              error.code === 'ER_DB_CREATE_EXISTS' ||
              error.message.includes('already exists') ||
              error.message.includes('Duplicate')) {
            successCount++;
            // Silently skip
          } else {
            console.warn(`⚠️  Statement ${i + 1} warning:`, error.message.substring(0, 100));
          }
        }
      }
    }

    console.log(`\n✅ Executed ${successCount} statements successfully!`);
    console.log('📊 Database: beja_marketplace');
    console.log('📋 Tables: users, categories, products, cart, orders, order_items, reviews, wishlist, messages');
    console.log('\n🎉 Database setup completed! You can now start the server and register users!');

  } catch (error) {
    console.error('\n❌ Error setting up database:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Make sure MySQL/MariaDB is running!');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Check your database credentials in .env file');
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




