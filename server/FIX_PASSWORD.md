# Fix MySQL Password - Quick Guide

## Current Issue
MySQL is rejecting the connection because it needs a password.

## Quick Fix Steps

### Step 1: Find Your MySQL Password

**If you installed MySQL Standalone:**
- You set a password during installation
- Remember that password? Use it!

**If you installed XAMPP:**
- Default is usually NO password (empty)
- But MySQL might have been configured with a password

### Step 2: Test Your Password

Open a new PowerShell/Command Prompt and try:

```bash
mysql -u root -p
```

- If it asks for a password → Enter the password you set
- If it connects without password → Your password is empty

### Step 3: Update .env File

1. **Open the file:** `server\.env`

2. **Find this line:**
   ```
   DB_PASSWORD=
   ```

3. **Update it:**
   - **If you have a password:** `DB_PASSWORD=your_password_here`
   - **If NO password:** Keep it as `DB_PASSWORD=` (empty)

4. **Save the file**

### Step 4: Test Again

Run this command:
```powershell
node test-connection.js
```

You should see: ✅ Successfully connected to MySQL server!

### Step 5: Setup Database

Once connection works:
```powershell
node setup-database.js
```

---

## Still Not Working?

### Option A: Reset MySQL Root Password

1. Stop MySQL service
2. Start MySQL in safe mode (skip authentication)
3. Connect and reset password
4. Restart MySQL normally

### Option B: Create New MySQL User

1. Connect to MySQL as root
2. Create new user:
   ```sql
   CREATE USER 'marketplace'@'localhost' IDENTIFIED BY 'simplepassword123';
   GRANT ALL PRIVILEGES ON *.* TO 'marketplace'@'localhost';
   FLUSH PRIVILEGES;
   ```
3. Update `.env`:
   ```
   DB_USER=marketplace
   DB_PASSWORD=simplepassword123
   ```

### Option C: Use phpMyAdmin (if using XAMPP)

1. Open: http://localhost/phpmyadmin
2. Click "User accounts" → "root" → "Edit privileges"
3. Click "Change password"
4. Set a new password
5. Update `.env` with that password

---

## Need Help?

Share:
1. Which MySQL did you install? (XAMPP or Standalone)
2. Did you set a password during installation?
3. Can you connect with: `mysql -u root -p`?



