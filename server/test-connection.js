import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  console.log('🔍 Testing database connection...\n');
  
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306,
  };
  
  console.log('Configuration:');
  console.log(`  Host: ${config.host}`);
  console.log(`  Port: ${config.port}`);
  console.log(`  User: ${config.user}`);
  console.log(`  Password: ${config.password ? '***' : '(empty)'}\n`);
  
  try {
    // Test connection without database
    console.log('1️⃣ Testing MySQL server connection...');
    const connection = await mysql.createConnection(config);
    console.log('✅ Successfully connected to MySQL server!\n');
    
    // Check if database exists
    console.log('2️⃣ Checking if database exists...');
    const [databases] = await connection.query(
      `SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = ?`,
      ['beja_marketplace']
    );
    
    if (databases.length === 0) {
      console.log('❌ Database "beja_marketplace" does not exist');
      console.log('💡 Run: npm run setup-db to create it\n');
    } else {
      console.log('✅ Database "beja_marketplace" exists\n');
      
      // Try to use the database
      await connection.query('USE beja_marketplace');
      console.log('3️⃣ Checking tables...');
      
      const [tables] = await connection.query('SHOW TABLES');
      console.log(`✅ Found ${tables.length} tables:`);
      tables.forEach(table => {
        console.log(`   - ${Object.values(table)[0]}`);
      });
      
      // Check specifically for users table
      const [usersTable] = await connection.query(
        `SELECT COUNT(*) as count FROM information_schema.tables 
         WHERE table_schema = 'beja_marketplace' AND table_name = 'users'`
      );
      
      if (usersTable[0].count > 0) {
        console.log('\n✅ Users table exists!');
      } else {
        console.log('\n❌ Users table does not exist');
        console.log('💡 Run: npm run setup-db to create all tables');
      }
    }
    
    await connection.end();
    console.log('\n✅ Connection test completed!');
    
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error(`Error code: ${error.code}`);
    console.error(`Error message: ${error.message}\n`);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Solutions:');
      console.log('   1. Make sure MySQL/MariaDB is running');
      console.log('   2. Check if MySQL is on port 3306');
      console.log('   3. If using XAMPP/WAMP, start MySQL service');
      console.log('   4. Check Windows Services for MySQL');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Solutions:');
      console.log('   1. Check your password in .env file');
      console.log('   2. Verify the username is correct');
      console.log('   3. Try: mysql -u root -p (to test credentials)');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 Solutions:');
      console.log('   1. Database does not exist');
      console.log('   2. Run: npm run setup-db');
    } else {
      console.log('💡 Check your .env file configuration');
    }
    
    process.exit(1);
  }
}

testConnection();



