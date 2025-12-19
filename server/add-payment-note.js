import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function addPaymentNote() {
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

    // Add payment_note column if it doesn't exist
    try {
      await connection.query(`
        ALTER TABLE seller_payments 
        ADD COLUMN payment_note TEXT AFTER payment_reference
      `);
      console.log('✅ Added payment_note column');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  payment_note column already exists');
      } else {
        throw error;
      }
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

addPaymentNote();




