import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const testCategories = async () => {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'beja_marketplace'
    });

    console.log('✅ Connected to database\n');

    // Check table structure
    const [columns] = await connection.execute(
      `SELECT COLUMN_NAME, DATA_TYPE 
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'categories'`,
      [process.env.DB_NAME || 'beja_marketplace']
    );

    console.log('📋 Categories table structure:');
    columns.forEach(col => {
      console.log(`   - ${col.COLUMN_NAME} (${col.DATA_TYPE})`);
    });

    // Check categories
    const [categories] = await connection.execute(
      'SELECT id, name, image_url FROM categories LIMIT 5'
    );

    console.log('\n📦 Sample categories:');
    if (categories.length === 0) {
      console.log('   ⚠️  No categories found!');
    } else {
      categories.forEach(cat => {
        console.log(`   - ${cat.name}: ${cat.image_url ? '✅ Has image' : '❌ No image'}`);
      });
    }

    // Count categories
    const [count] = await connection.execute(
      'SELECT COUNT(*) as total FROM categories'
    );
    console.log(`\n📊 Total categories: ${count[0].total}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

testCategories();



