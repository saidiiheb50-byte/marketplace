# 🚀 START HERE - Complete Setup Guide

## Step 1: Create Environment File

Create a file named `.env` in the `server` folder with this content:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=beja_marketplace
JWT_SECRET=my_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
```

**Important:** Replace `DB_PASSWORD=` with your MySQL password if you have one.

## Step 2: Setup Database

### Option A: Using MySQL Command Line
```bash
mysql -u root -p
```

Then run:
```sql
CREATE DATABASE IF NOT EXISTS beja_marketplace;
USE beja_marketplace;
SOURCE server/database/schema.sql;
```

### Option B: Using phpMyAdmin
1. Open phpMyAdmin
2. Create database: `beja_marketplace`
3. Import file: `server/database/schema.sql`

## Step 3: Install Dependencies

Open terminal in the project root and run:

```bash
npm run install-all
```

This installs dependencies for:
- Root project
- Server (backend)
- Client (frontend)

## Step 4: Start the Application

### Option A: Start Both Servers Together (Recommended)
```bash
npm run dev
```

### Option B: Start Separately (Two Terminals)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Wait for: `✅ Database connected successfully` and `🚀 Server running on http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Wait for: `Local: http://localhost:3000`

## Step 5: Open in Browser

Go to: **http://localhost:3000**

## Troubleshooting

### If you see "Database connection error":
1. Make sure MySQL is running
2. Check your `.env` file has correct password
3. Verify database `beja_marketplace` exists

### If port 3000 is already in use:
Change port in `client/vite.config.js`:
```js
port: 3001,  // or any other available port
```

### If port 5000 is already in use:
Change PORT in `server/.env`:
```
PORT=5001
```
And update `client/vite.config.js` proxy:
```js
target: 'http://localhost:5001',
```

### If you see "Module not found":
```bash
# Delete and reinstall
cd server
rm -rf node_modules
npm install

cd ../client
rm -rf node_modules
npm install
```

## Test if Backend is Working

Open: http://localhost:5000/api/health

Should see: `{"status":"ok","message":"Béja Marketplace API is running"}`

## Default Admin Account

- Email: `admin@beja-marketplace.com`
- Password: `admin123`

**⚠️ Change this password in production!**




