import axios from 'axios';

async function testAPI() {
  try {
    console.log('🧪 Testing Products API...\n');
    
    const response = await axios.get('http://localhost:5000/api/products');
    
    console.log('✅ API Response Status:', response.status);
    console.log('📦 Response Data:', JSON.stringify(response.data, null, 2));
    console.log('\n📊 Products Count:', response.data.products?.length || 0);
    
    if (response.data.products && response.data.products.length > 0) {
      console.log('\n📋 Products:');
      response.data.products.forEach((p, i) => {
        console.log(`\n${i + 1}. ${p.title}`);
        console.log(`   ID: ${p.id}`);
        console.log(`   Price: ${p.price} TND`);
        console.log(`   Status: ${p.status}`);
        console.log(`   Seller: ${p.seller_name || 'N/A'}`);
      });
    } else {
      console.log('\n⚠️  No products returned!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
  }
}

testAPI();




