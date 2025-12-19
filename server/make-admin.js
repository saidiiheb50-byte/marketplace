import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function makeAdmin() {
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

    // Get all users
    const [users] = await connection.query('SELECT id, name, email, role FROM users');
    
    console.log('\n📋 Current users:');
    users.forEach(user => {
      console.log(`  ID: ${user.id} | Name: ${user.name} | Email: ${user.email} | Role: ${user.role}`);
    });

    // Ask which user to make admin
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question('\nEnter the email of the user you want to make admin (or "all" to make all users admin): ', async (email) => {
      try {
        if (email.toLowerCase() === 'all') {
          await connection.query("UPDATE users SET role = 'admin'");
          console.log('✅ All users are now admins');
        } else {
          const [result] = await connection.query(
            "UPDATE users SET role = 'admin' WHERE email = ?",
            [email]
          );
          
          if (result.affectedRows === 0) {
            console.log(`❌ No user found with email: ${email}`);
          } else {
            console.log(`✅ User ${email} is now an admin!`);
          }
        }

        // Show updated users
        const [updatedUsers] = await connection.query('SELECT id, name, email, role FROM users');
        console.log('\n📋 Updated users:');
        updatedUsers.forEach(user => {
          console.log(`  ID: ${user.id} | Name: ${user.name} | Email: ${user.email} | Role: ${user.role}`);
        });
      } catch (error) {
        console.error('❌ Error:', error.message);
      } finally {
        readline.close();
        await connection.end();
        console.log('\n🔌 Connection closed');
        process.exit(0);
      }
    });

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

makeAdmin();



