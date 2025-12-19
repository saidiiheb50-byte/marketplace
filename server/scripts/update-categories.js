import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const updateCategories = async () => {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'beja_marketplace',
      multipleStatements: true
    });

    console.log('✅ Connected to database');

    // Check if image_url column exists
    const [columns] = await connection.execute(
      `SELECT COLUMN_NAME 
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = ? 
       AND TABLE_NAME = 'categories' 
       AND COLUMN_NAME = 'image_url'`,
      [process.env.DB_NAME || 'beja_marketplace']
    );

    if (columns.length === 0) {
      console.log('📝 Adding image_url column...');
      await connection.execute(
        'ALTER TABLE categories ADD COLUMN image_url VARCHAR(500) AFTER icon'
      );
      console.log('✅ Column added');
    } else {
      console.log('✅ image_url column already exists');
    }

    // Insert/Update categories
    console.log('📝 Updating categories with images...');
    
    const categories = [
      ['Smartphones', 'Mobile phones, smartphones, and accessories', '📱', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop'],
      ['Computers & Laptops', 'PCs, laptops, tablets, and computer accessories', '💻', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop'],
      ['Electronics', 'TVs, cameras, audio equipment, and other electronics', '📺', 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=300&fit=crop'],
      ['Vehicles', 'Cars, motorcycles, bicycles, and transportation', '🚗', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=300&fit=crop'],
      ['Home & Furniture', 'Furniture, home decor, and household items', '🏠', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'],
      ['Clothes & Fashion', 'Clothing, shoes, bags, and fashion accessories', '👕', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop'],
      ['Sports & Fitness', 'Sports equipment, gym gear, and fitness items', '⚽', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'],
      ['Books & Education', 'Books, textbooks, and educational materials', '📚', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'],
      ['Toys & Games', 'Toys, games, and entertainment items', '🎮', 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop'],
      ['Appliances', 'Home appliances, kitchen equipment, and tools', '🔧', 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop'],
      ['Beauty & Personal Care', 'Cosmetics, perfumes, and personal care items', '💄', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop'],
      ['Others', 'Other items that don\'t fit in the above categories', '📦', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop']
    ];

    for (const [name, description, icon, image_url] of categories) {
      await connection.execute(
        `INSERT INTO categories (name, description, icon, image_url) 
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
           image_url = VALUES(image_url),
           description = VALUES(description),
           icon = VALUES(icon)`,
        [name, description, icon, image_url]
      );
      console.log(`✅ Updated category: ${name}`);
    }

    console.log('\n🎉 All categories updated successfully!');
    console.log('🔄 Refresh your browser to see the changes.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Tip: Check your .env file in the server folder');
      console.error('   Make sure DB_PASSWORD is correct');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

updateCategories();

