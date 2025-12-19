# Troubleshooting Guide

## Common Issues and Solutions

### 1. Database Connection Error

**Error:** `❌ Database connection error`

**Solutions:**
- Make sure MySQL is running
- Check if database exists:
  ```sql
  CREATE DATABASE IF NOT EXISTS beja_marketplace;
  ```
- Verify credentials in `server/.env` file
- Test connection manually:
  ```bash
  mysql -u root -p
  ```

### 2. Port Already in Use

**Error:** `Port 5000 is already in use` or `Port 5173 is already in use`

**Solutions:**
- Kill the process using the port:
  ```bash
  # Windows PowerShell
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # Or change the port in server/.env
  PORT=5001
  ```

### 3. Module Not Found / Dependencies Error

**Error:** `Cannot find module` or `Module not found`

**Solutions:**
```bash
# Delete node_modules and reinstall
cd server
rm -rf node_modules package-lock.json
npm install

cd ../client
rm -rf node_modules package-lock.json
npm install
```

### 4. Database Tables Missing

**Error:** `Table 'beja_marketplace.cart' doesn't exist`

**Solution:**
Run the updated schema file:
```bash
mysql -u root -p beja_marketplace < server/database/schema.sql
```

Or manually run the SQL in MySQL:
```sql
USE beja_marketplace;
-- Copy and paste all SQL from schema.sql
```

### 5. CORS Errors

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**
- Make sure backend is running on port 5000
- Check `server/index.js` has `app.use(cors());`
- Verify frontend proxy in `client/vite.config.js`

### 6. Server Won't Start

**Check:**
1. Node.js version (should be 16+):
   ```bash
   node --version
   ```
2. All dependencies installed:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
3. Environment file exists:
   ```bash
   # Create server/.env if missing
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=beja_marketplace
   JWT_SECRET=your_secret_key_here
   ```

### 7. Frontend Won't Load

**Check:**
1. Backend is running first
2. Browser console for errors
3. Network tab for failed requests
4. Try clearing browser cache

## Step-by-Step Setup

### 1. Install MySQL
- Download from https://dev.mysql.com/downloads/mysql/
- Or use XAMPP/WAMP

### 2. Create Database
```bash
mysql -u root -p
```
Then run:
```sql
CREATE DATABASE IF NOT EXISTS beja_marketplace;
USE beja_marketplace;
SOURCE server/database/schema.sql;
```

### 3. Create .env File
Create `server/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=beja_marketplace
JWT_SECRET=change_this_to_a_random_secret_key
JWT_EXPIRES_IN=7d
```

### 4. Install Dependencies
```bash
# In server folder
cd server
npm install

# In client folder
cd ../client
npm install
```

### 5. Start Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 6. Access Application
Open browser: http://localhost:5173

## Quick Test

Test if backend is working:
```bash
curl http://localhost:5000/api/health
```

Should return: `{"status":"ok","message":"Béja Marketplace API is running"}`

## Still Not Working?

1. Check error messages in terminal
2. Check browser console (F12)
3. Verify MySQL is running
4. Check firewall isn't blocking ports
5. Try restarting MySQL service




