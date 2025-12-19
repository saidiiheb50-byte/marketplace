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
    const [users] = await connection.query('SELECT id, name, email, role FROM users ORDER BY id');
    
    console.log('\n📋 Current users:');
    users.forEach(user => {
      const roleBadge = user.role === 'admin' ? '👑 ADMIN' : '👤 USER';
      console.log(`  ${roleBadge} | ID: ${user.id} | ${user.name} (${user.email})`);
    });

    // Make the first user admin (or you can specify an email)
    const targetEmail = process.argv[2] || users[0]?.email;
    
    if (!targetEmail) {
      console.log('\n❌ No users found in database');
      await connection.end();
      return;
    }

    const [result] = await connection.query(
      "UPDATE users SET role = 'admin' WHERE email = ?",
      [targetEmail]
    );
    
    if (result.affectedRows === 0) {
      console.log(`\n❌ No user found with email: ${targetEmail}`);
      console.log('\n💡 Usage: node server/make-admin-simple.js <email>');
      console.log('   Example: node server/make-admin-simple.js user@example.com');
    } else {
      console.log(`\n✅ SUCCESS! User "${targetEmail}" is now an ADMIN!`);
      console.log('\n📝 Next steps:');
      console.log('   1. Log out from your current session');
      console.log('   2. Log back in');
      console.log('   3. You should now see the "Admin" link in the navbar');
    }

    // Show updated users
    const [updatedUsers] = await connection.query('SELECT id, name, email, role FROM users ORDER BY id');
    console.log('\n📋 All users:');
    updatedUsers.forEach(user => {
      const roleBadge = user.role === 'admin' ? '👑 ADMIN' : '👤 USER';
      console.log(`  ${roleBadge} | ID: ${user.id} | ${user.name} (${user.email})`);
    });

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connection closed');
    }
  }
}

makeAdmin();



