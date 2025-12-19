import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function addAccountStatus() {
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

    // Check if account_status column exists
    const [columns] = await connection.query('SHOW COLUMNS FROM users');
    const columnNames = columns.map(col => col.Field);
    
    if (!columnNames.includes('account_status')) {
      await connection.query(`
        ALTER TABLE users 
        ADD COLUMN account_status ENUM('pending', 'active', 'suspended', 'rejected') DEFAULT 'pending' AFTER seller_payment_amount
      `);
      console.log('✅ Added account_status column');
      
      // Set existing users to active (except sellers with pending payment)
      await connection.query(`
        UPDATE users 
        SET account_status = CASE 
          WHEN user_type = 'seller' AND seller_payment_status = 'pending' THEN 'pending'
          WHEN user_type = 'seller' AND seller_payment_status = 'paid' THEN 'active'
          ELSE 'active'
        END
      `);
      console.log('✅ Updated existing users account status');
    } else {
      console.log('ℹ️  account_status column already exists');
    }

    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connection closed');
    }
  }
}

addAccountStatus();




