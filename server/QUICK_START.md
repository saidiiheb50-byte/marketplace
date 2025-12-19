# Quick Start Guide - Fix Database Connection

## ⚠️ Don't have MySQL installed?
**See `../INSTALL_MYSQL.md` for installation instructions!**

## The Problem
Your database connection is failing. This usually means:
1. MySQL is not installed or not running
2. Wrong credentials in `.env` file
3. Database doesn't exist yet

## Step-by-Step Fix

### Step 1: Start MySQL

**Option A: If you have MySQL installed separately**
1. Open Windows Services (Press `Win + R`, type `services.msc`)
2. Find "MySQL" or "MySQL80" or "MariaDB"
3. Right-click → Start
4. Make sure it's "Running"

**Option B: If using XAMPP**
1. Open XAMPP Control Panel
2. Click "Start" next to MySQL
3. Wait until it shows "Running" in green

**Option C: If using WAMP**
1. Open WAMP Control Panel
2. Click "Start All Services"
3. MySQL should start automatically

**Option D: If using MAMP**
1. Open MAMP
2. Click "Start Servers"
3. MySQL should start

### Step 2: Create/Check `.env` File

Create a file named `.env` in the `server` folder with:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=beja_marketplace
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
```

**Important:** 
- If your MySQL root has a password, put it in `DB_PASSWORD=`
- If no password, leave it empty: `DB_PASSWORD=`

### Step 3: Test Connection

Run this command to test if MySQL is accessible:

```bash
cd server
npm run test-db
```

This will tell you:
- ✅ If MySQL is running
- ✅ If credentials are correct
- ✅ If database exists
- ✅ If tables exist

### Step 4: Setup Database

Once connection works, run:

```bash
cd server
npm run setup-db
```

This will:
- Create the `beja_marketplace` database
- Create all tables (users, products, categories, etc.)
- Insert default categories

### Step 5: Verify

1. Check health endpoint: `http://localhost:5000/api/health`
   - Should show: `"connected": true` and `"usersTable": "exists"`

2. Try registering a user - it should work now!

## Common Issues

### "ECONNREFUSED"
- **Solution:** MySQL is not running. Start it using Step 1 above.

### "ER_ACCESS_DENIED_ERROR"
- **Solution:** Wrong password. Check your `.env` file.

### "ER_BAD_DB_ERROR"
- **Solution:** Database doesn't exist. Run `npm run setup-db`.

### Still having issues?

1. Test MySQL directly:
   ```bash
   mysql -u root -p
   ```
   If this works, MySQL is running. If not, MySQL is not installed or not in PATH.

2. Check if MySQL is on a different port:
   - Default is 3306
   - If different, add to `.env`: `DB_PORT=3307` (or your port)

3. Check Windows Firewall:
   - Might be blocking MySQL connections

## Need Help?

Run the test command and share the output:
```bash
cd server
npm run test-db
```

This will show exactly what's wrong!

