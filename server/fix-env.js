import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '.env');
const password = 'ihebiheb11';

try {
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file does not exist!');
    process.exit(1);
  }

  // Read current .env file
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Remove all DB_PASSWORD lines
  envContent = envContent.replace(/DB_PASSWORD=.*\n?/g, '');
  
  // Find DB_USER line and add DB_PASSWORD after it
  const lines = envContent.split('\n');
  const dbUserIndex = lines.findIndex(line => line.trim().startsWith('DB_USER='));
  
  if (dbUserIndex !== -1) {
    // Insert DB_PASSWORD after DB_USER
    lines.splice(dbUserIndex + 1, 0, `DB_PASSWORD=${password}`);
    envContent = lines.join('\n');
  } else {
    // If DB_USER not found, just append
    envContent += `\nDB_PASSWORD=${password}\n`;
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Fixed .env file!');
  console.log('📝 Password set correctly to: ihebiheb11');
  
} catch (error) {
  console.error('❌ Error fixing .env:', error.message);
  process.exit(1);
}



