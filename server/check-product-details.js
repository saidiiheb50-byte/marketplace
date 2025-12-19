import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function checkProductDetails() {
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

    // Get active product with all details
    const [products] = await connection.query(`
      SELECT 
        p.*,
        c.name as category_name,
        c.id as category_id_check,
        u.name as seller_name,
        u.email as seller_email,
        u.user_type,
        u.seller_payment_status,
        u.account_status
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.status = 'active'
      ORDER BY p.created_at DESC
    `);
    
    console.log('📦 Active Products Details:');
    console.log('═'.repeat(80));
    
    if (products.length === 0) {
      console.log('❌ No active products found!');
    } else {
      products.forEach((product, index) => {
        console.log(`\n${index + 1}. Product ID: ${product.id}`);
        console.log(`   Title: ${product.title}`);
        console.log(`   Price: ${product.price} TND`);
        console.log(`   Status: ${product.status}`);
        console.log(`   Category ID: ${product.category_id || 'NULL ⚠️'}`);
        console.log(`   Category Name: ${product.category_name || 'NULL ⚠️'}`);
        console.log(`   Condition: ${product.condition || 'N/A'}`);
        console.log(`   Stock: ${product.stock_quantity || 0}`);
        console.log(`   Location: ${product.location || 'N/A'}`);
        console.log(`   Images: ${product.images ? 'Yes' : 'No'}`);
        console.log(`   Created: ${new Date(product.created_at).toLocaleString()}`);
        console.log(`\n   Seller Info:`);
        console.log(`   - Name: ${product.seller_name}`);
        console.log(`   - Email: ${product.seller_email}`);
        console.log(`   - Type: ${product.user_type}`);
        console.log(`   - Payment Status: ${product.seller_payment_status}`);
        console.log(`   - Account Status: ${product.account_status}`);
        
        // Check for issues
        const issues = [];
        if (!product.category_id) issues.push('Missing category_id');
        if (!product.category_name) issues.push('Category not found');
        if (product.user_type !== 'seller') issues.push('User is not a seller');
        if (product.seller_payment_status !== 'paid') issues.push('Seller payment not paid');
        if (product.account_status !== 'active') issues.push('Account not active');
        
        if (issues.length > 0) {
          console.log(`\n   ⚠️  ISSUES FOUND:`);
          issues.forEach(issue => console.log(`      - ${issue}`));
        } else {
          console.log(`\n   ✅ All checks passed!`);
        }
      });
    }

    // Test the exact SQL query used by the API
    console.log('\n\n🔍 Testing API Query:');
    console.log('═'.repeat(80));
    
    const [apiTest] = await connection.query(`
      SELECT 
        p.*,
        c.name as category_name,
        u.name as seller_name,
        u.phone as seller_phone
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.status = 'active'
      ORDER BY p.created_at DESC
      LIMIT 50 OFFSET 0
    `);
    
    console.log(`✅ Query returned ${apiTest.length} product(s)`);
    if (apiTest.length > 0) {
      console.log(`   First product: ${apiTest[0].title} (ID: ${apiTest[0].id})`);
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

checkProductDetails();




