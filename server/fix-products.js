import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function fixProducts() {
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

    // Get all products
    const [products] = await connection.query(`
      SELECT 
        p.id,
        p.title,
        p.status,
        p.created_at,
        u.name as seller_name,
        u.email as seller_email,
        u.user_type,
        u.seller_payment_status
      FROM products p
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);
    
    console.log('📦 Current Products:');
    console.log('─'.repeat(80));
    
    products.forEach((product, index) => {
      const statusBadge = product.status === 'active' ? '✅ ACTIVE' : 
                         product.status === 'inactive' ? '⏸️  INACTIVE' : 
                         product.status === 'pending' ? '⏳ PENDING' : 
                         '❌ ' + product.status.toUpperCase();
      
      console.log(`\n${index + 1}. ${statusBadge}`);
      console.log(`   ID: ${product.id} | Title: ${product.title}`);
      console.log(`   Seller: ${product.seller_name} (${product.seller_email})`);
      console.log(`   Seller Type: ${product.user_type || 'N/A'} | Payment: ${product.seller_payment_status || 'N/A'}`);
    });

    // Activate all non-deleted products
    const [result] = await connection.query(`
      UPDATE products 
      SET status = 'active' 
      WHERE status != 'deleted' AND status != 'active'
    `);
    
    if (result.affectedRows > 0) {
      console.log(`\n✅ Activated ${result.affectedRows} product(s)!`);
    }

    // Also activate any products that are 'deleted' but shouldn't be (optional)
    // Uncomment if you want to restore deleted products
    // await connection.query(`UPDATE products SET status = 'active' WHERE status = 'deleted'`);

    // Show final status
    const [finalProducts] = await connection.query(`
      SELECT status, COUNT(*) as count 
      FROM products 
      GROUP BY status
    `);
    
    console.log('\n📊 Final Product Status:');
    console.log('─'.repeat(80));
    finalProducts.forEach(stat => {
      console.log(`  ${stat.status}: ${stat.count} product(s)`);
    });

    const [activeCount] = await connection.query(`
      SELECT COUNT(*) as count 
      FROM products 
      WHERE status = 'active'
    `);
    
    console.log(`\n👁️  Products now visible in "Browse Products": ${activeCount[0].count}`);

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

fixProducts();




