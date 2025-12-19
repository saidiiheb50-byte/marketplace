# Update MySQL Password in .env File

## The Issue
MySQL is asking for a password, but your `.env` file has an empty password.

## Solution

### Step 1: Open the `.env` file
Location: `server/.env`

### Step 2: Add your MySQL password

If you set a password during MySQL installation, update this line:
```
DB_PASSWORD=your_actual_password_here
```

If you didn't set a password, you have two options:

**Option A: Set a password for MySQL root user**
1. Open MySQL command line or phpMyAdmin
2. Run: `ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_new_password';`
3. Then update `.env`: `DB_PASSWORD=your_new_password`

**Option B: Reset root to no password (less secure)**
1. Stop MySQL service
2. Start MySQL in safe mode with skip-grant-tables
3. Run: `UPDATE mysql.user SET authentication_string='' WHERE User='root';`
4. Restart MySQL normally
5. Keep `.env` as: `DB_PASSWORD=`

## Quick Fix

1. **Remember your MySQL password?**
   - Edit `server/.env`
   - Change: `DB_PASSWORD=` to `DB_PASSWORD=your_password`

2. **Don't remember or didn't set one?**
   - You'll need to reset it (see Option A above)
   - Or use phpMyAdmin to change it

3. **After updating .env:**
   ```bash
   cd server
   npm run test-db
   ```

## Using XAMPP?
XAMPP MySQL usually has NO password by default. If you're getting this error with XAMPP:
- Make sure MySQL is running in XAMPP Control Panel
- Try setting a password in phpMyAdmin, then update .env



