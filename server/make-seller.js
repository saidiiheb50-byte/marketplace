import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function makeSeller() {
  let connection;
  
  try {
    console.log('🔌 Connecting to MySQL...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'ihebiheb11',
      database: process.env.DB_NAME || 'beja_marketplace'
    });

    console.log('✅ Connected to MySQL\n');

    // Get user info
    const email = process.argv[2] || 'saidiiheb50@gmail.com';
    
    const [users] = await connection.query(
      'SELECT id, name, email, user_type, seller_payment_status FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      console.log(`❌ No user found with email: ${email}`);
      await connection.end();
      return;
    }

    const user = users[0];
    console.log('👤 Current User Info:');
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   User Type: ${user.user_type || 'buyer'}`);
    console.log(`   Seller Payment: ${user.seller_payment_status || 'pending'}\n`);

    // Update to seller with paid status
    await connection.query(
      `UPDATE users 
       SET user_type = 'seller', 
           seller_payment_status = 'paid',
           account_status = 'active'
       WHERE email = ?`,
      [email]
    );

    console.log(`✅ User "${email}" is now a verified SELLER!`);
    console.log('\n📝 What this means:');
    console.log('   ✓ You can now create product listings');
    console.log('   ✓ Your products will appear in Browse Products');
    console.log('   ✓ You can access the seller dashboard');
    
    // Check products
    const [products] = await connection.query(
      'SELECT id, title, status FROM products WHERE user_id = ?',
      [user.id]
    );

    if (products.length > 0) {
      console.log(`\n📦 Your Products (${products.length}):`);
      products.forEach(p => {
        const status = p.status === 'active' ? '✅' : '⏸️';
        console.log(`   ${status} ${p.title} (ID: ${p.id}, Status: ${p.status})`);
      });
      
      // Activate any inactive products
      const [result] = await connection.query(
        "UPDATE products SET status = 'active' WHERE user_id = ? AND status != 'deleted'",
        [user.id]
      );
      
      if (result.affectedRows > 0) {
        console.log(`\n✅ Activated ${result.affectedRows} product(s)!`);
      }
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connection closed');
    }
  }
}

makeSeller();




