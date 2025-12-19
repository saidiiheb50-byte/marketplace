import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function checkProducts() {
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

    // Get all products with their status
    const [products] = await connection.query(`
      SELECT 
        p.id,
        p.title,
        p.price,
        p.status,
        p.created_at,
        u.name as seller_name,
        u.email as seller_email
      FROM products p
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);
    
    console.log('📦 All Products:');
    console.log('─'.repeat(80));
    
    if (products.length === 0) {
      console.log('  No products found in database');
    } else {
      products.forEach((product, index) => {
        const statusBadge = product.status === 'active' ? '✅ ACTIVE' : 
                           product.status === 'inactive' ? '⏸️  INACTIVE' : 
                           product.status === 'pending' ? '⏳ PENDING' : 
                           '❌ ' + product.status.toUpperCase();
        
        console.log(`\n${index + 1}. ${statusBadge}`);
        console.log(`   ID: ${product.id}`);
        console.log(`   Title: ${product.title}`);
        console.log(`   Price: ${product.price} TND`);
        console.log(`   Seller: ${product.seller_name} (${product.seller_email})`);
        console.log(`   Created: ${new Date(product.created_at).toLocaleString()}`);
      });
    }

    // Count by status
    const [statusCount] = await connection.query(`
      SELECT status, COUNT(*) as count 
      FROM products 
      GROUP BY status
    `);
    
    console.log('\n\n📊 Product Status Summary:');
    console.log('─'.repeat(80));
    statusCount.forEach(stat => {
      console.log(`  ${stat.status}: ${stat.count} product(s)`);
    });

    // Show which products are visible in Browse
    const [activeProducts] = await connection.query(`
      SELECT COUNT(*) as count 
      FROM products 
      WHERE status = 'active'
    `);
    
    console.log(`\n\n👁️  Products visible in "Browse Products": ${activeProducts[0].count}`);
    
    if (activeProducts[0].count === 0 && products.length > 0) {
      console.log('\n⚠️  WARNING: You have products but none are active!');
      console.log('   Products need status = "active" to appear in Browse Products.');
    }

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

checkProducts();



