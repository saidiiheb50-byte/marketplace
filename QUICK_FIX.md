# Quick Fix Guide

## If Nothing Works - Start Fresh

### Step 1: Check Database
```bash
# Open MySQL
mysql -u root -p

# Run these commands:
CREATE DATABASE IF NOT EXISTS beja_marketplace;
USE beja_marketplace;
```

### Step 2: Run Complete Schema
Copy the entire content of `server/database/schema.sql` and run it in MySQL.

### Step 3: Create .env File
Create `server/.env` with:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=beja_marketplace
JWT_SECRET=my_super_secret_jwt_key_12345
```

### Step 4: Install Everything
```bash
# Root folder
npm install

# Server
cd server
npm install

# Client
cd ../client
npm install
```

### Step 5: Start Backend First
```bash
cd server
npm run dev
```
Wait for: `✅ Database connected successfully` and `🚀 Server running on http://localhost:5000`

### Step 6: Start Frontend (New Terminal)
```bash
cd client
npm run dev
```

### Step 7: Open Browser
Go to: **http://localhost:5173**

## Common Error Messages

**"Cannot connect to database"**
→ Check MySQL is running and .env has correct password

**"Port 5000 already in use"**
→ Change PORT in server/.env to 5001, then update client/vite.config.js proxy to 5001

**"Table doesn't exist"**
→ Run schema.sql again in MySQL

**"Module not found"**
→ Delete node_modules and run npm install again



