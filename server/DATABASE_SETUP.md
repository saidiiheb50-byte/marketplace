# Database Setup Guide

## Quick Setup

### Option 1: Using the Setup Script (Recommended)

1. **Make sure MySQL/MariaDB is running:**
   - Windows: Check Services (search "Services" in Start menu, look for MySQL)
   - Or start it manually if you have XAMPP/WAMP/MAMP

2. **Check your `.env` file** in the `server` folder:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=beja_marketplace
   ```

3. **Run the setup script:**
   ```bash
   cd server
   npm run setup-db
   ```

### Option 2: Manual Setup with MySQL Command Line

1. **Open MySQL command line:**
   ```bash
   mysql -u root -p
   ```
   (Enter your MySQL password when prompted)

2. **Run the schema file:**
   ```sql
   source server/database/schema.sql;
   ```
   
   Or copy and paste the entire contents of `server/database/schema.sql` into MySQL.

### Option 3: Using phpMyAdmin (Easiest for beginners)

1. Open phpMyAdmin in your browser (usually `http://localhost/phpmyadmin`)
2. Click on "SQL" tab
3. Copy the entire contents of `server/database/schema.sql`
4. Paste it into the SQL text area
5. Click "Go" to execute

### Option 4: PowerShell Command

If you have MySQL in your PATH:

```powershell
Get-Content server\database\schema.sql | mysql -u root -p
```

## Verify Setup

After running the setup, verify it worked:

1. **Check the server health:**
   - Visit: `http://localhost:5000/api/health`
   - Should show: `"usersTable": "exists"`

2. **Or check in MySQL:**
   ```sql
   USE beja_marketplace;
   SHOW TABLES;
   ```
   You should see: users, categories, products, cart, orders, order_items, reviews, wishlist, messages

## Troubleshooting

### "ECONNREFUSED" Error
- **MySQL is not running:** Start MySQL service
- **Wrong port:** Check if MySQL is on port 3306 (default)
- **Firewall blocking:** Check Windows Firewall settings

### "ER_ACCESS_DENIED_ERROR"
- **Wrong password:** Check your `.env` file
- **User doesn't exist:** Make sure `root` user exists or use a different user

### "ER_BAD_DB_ERROR"
- Database doesn't exist - the script will create it automatically

### Still having issues?
1. Check MySQL is running: `mysql -u root -p` (should connect)
2. Check your `.env` file has correct credentials
3. Try creating database manually:
   ```sql
   CREATE DATABASE beja_marketplace;
   ```
4. Then run the setup script again

## After Setup

Once the database is set up:
1. Restart your server: `npm run dev`
2. Try registering a new user
3. You should see: `✅ Database connected successfully` in the server console



