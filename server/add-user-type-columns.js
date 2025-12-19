import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function addUserTypeColumns() {
  let connection;
  
  try {
    console.log('🔌 Connecting to MySQL...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'ihebiheb11',
      database: process.env.DB_NAME || 'beja_marketplace'
    });

    console.log('✅ Connected to MySQL');

    // Check if columns exist
    const [columns] = await connection.query('SHOW COLUMNS FROM users');
    const columnNames = columns.map(col => col.Field);
    
    console.log('📋 Current columns:', columnNames.join(', '));

    // Add user_type column
    if (!columnNames.includes('user_type')) {
      await connection.query(`
        ALTER TABLE users 
        ADD COLUMN user_type ENUM('buyer', 'seller') DEFAULT 'buyer' AFTER role
      `);
      console.log('✅ Added user_type column');
    } else {
      console.log('ℹ️  user_type column already exists');
    }

    // Add seller_payment_status column
    if (!columnNames.includes('seller_payment_status')) {
      await connection.query(`
        ALTER TABLE users 
        ADD COLUMN seller_payment_status ENUM('pending', 'paid', 'expired') DEFAULT 'pending' AFTER user_type
      `);
      console.log('✅ Added seller_payment_status column');
    } else {
      console.log('ℹ️  seller_payment_status column already exists');
    }

    // Add seller_payment_date column
    if (!columnNames.includes('seller_payment_date')) {
      await connection.query(`
        ALTER TABLE users 
        ADD COLUMN seller_payment_date DATETIME NULL AFTER seller_payment_status
      `);
      console.log('✅ Added seller_payment_date column');
    } else {
      console.log('ℹ️  seller_payment_date column already exists');
    }

    // Add seller_payment_amount column
    if (!columnNames.includes('seller_payment_amount')) {
      await connection.query(`
        ALTER TABLE users 
        ADD COLUMN seller_payment_amount DECIMAL(10, 2) DEFAULT 0.00 AFTER seller_payment_date
      `);
      console.log('✅ Added seller_payment_amount column');
    } else {
      console.log('ℹ️  seller_payment_amount column already exists');
    }

    console.log('\n✅ All columns added successfully!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connection closed');
    }
  }
}

addUserTypeColumns();




