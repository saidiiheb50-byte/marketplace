import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '.env');
const envContent = `# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=beja_marketplace
DB_PORT=3306

# Server Configuration
PORT=5000

# JWT Secret (Change this in production!)
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
`;

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists!');
  console.log('📝 Current .env file location:', envPath);
  console.log('\n💡 If you need to update it, edit it manually or delete it first.');
} else {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file successfully!');
  console.log('📝 Location:', envPath);
  console.log('\n⚠️  IMPORTANT:');
  console.log('   - If your MySQL root has a password, edit .env and add it to DB_PASSWORD=');
  console.log('   - If no password, leave DB_PASSWORD= empty (current setting)');
  console.log('\n📋 Next steps:');
  console.log('   1. Edit .env if you set a MySQL password');
  console.log('   2. Run: npm run test-db');
  console.log('   3. Run: npm run setup-db');
}




