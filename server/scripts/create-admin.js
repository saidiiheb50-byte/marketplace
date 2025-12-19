// Script to create an admin user
// Run with: node scripts/create-admin.js

import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  const email = process.argv[2] || 'admin@beja-marketplace.com';
  const password = process.argv[3] || 'admin123';
  const name = process.argv[4] || 'Admin';

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'beja_marketplace'
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if admin exists
    const [existing] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      // Update existing user
      await connection.execute(
        'UPDATE users SET password = ?, role = ?, name = ? WHERE email = ?',
        [hashedPassword, 'admin', name, email]
      );
      console.log(`✅ Admin user updated: ${email}`);
    } else {
      // Create new admin
      await connection.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, 'admin']
      );
      console.log(`✅ Admin user created: ${email}`);
    }

    await connection.end();
    console.log(`Password: ${password}`);
    console.log('⚠️  Remember to change the password in production!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();




