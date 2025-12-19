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
    console.log('Run: npm run create-env first');
    process.exit(1);
  }

  // Read current .env file
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Update DB_PASSWORD line - handle cases where it might be duplicated
  if (envContent.includes('DB_PASSWORD=')) {
    // Remove any duplicate DB_PASSWORD lines and fix the format
    envContent = envContent.replace(/DB_PASSWORD=.*/g, '');
    // Add the correct line
    const lines = envContent.split('\n');
    const dbHostIndex = lines.findIndex(line => line.startsWith('DB_HOST='));
    if (dbHostIndex !== -1) {
      // Insert after DB_USER line
      const dbUserIndex = lines.findIndex(line => line.startsWith('DB_USER='));
      if (dbUserIndex !== -1) {
        lines.splice(dbUserIndex + 1, 0, `DB_PASSWORD=${password}`);
        envContent = lines.join('\n');
      } else {
        envContent += `\nDB_PASSWORD=${password}`;
      }
    } else {
      envContent += `\nDB_PASSWORD=${password}`;
    }
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated .env file with MySQL password!');
    console.log('📝 Password set to: ihebiheb11');
    console.log('\n🔍 Testing connection...\n');
  } else {
    console.log('❌ DB_PASSWORD line not found in .env');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error updating .env:', error.message);
  process.exit(1);
}

