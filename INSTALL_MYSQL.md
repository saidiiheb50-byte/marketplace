# Installing MySQL for Béja Marketplace

## Option 1: XAMPP (Easiest - Recommended for Beginners)

XAMPP includes MySQL, Apache, and phpMyAdmin in one package.

### Steps:

1. **Download XAMPP:**
   - Go to: https://www.apachefriends.org/download.html
   - Download the Windows version (PHP 8.x)
   - File size: ~150MB

2. **Install XAMPP:**
   - Run the installer
   - Install to default location: `C:\xampp`
   - Select: Apache, MySQL, phpMyAdmin (default selections)
   - Click "Next" through the installation

3. **Start MySQL:**
   - Open XAMPP Control Panel
   - Click "Start" next to MySQL
   - Wait until it shows "Running" in green

4. **Set MySQL Password (Optional but Recommended):**
   - Open phpMyAdmin: http://localhost/phpmyadmin
   - Click "User accounts" tab
   - Click "Edit privileges" for root user
   - Click "Change password"
   - Set a password (remember it!)
   - Or leave it empty if you prefer

5. **Update your `.env` file:**
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password_here (or leave empty)
   DB_NAME=beja_marketplace
   ```

6. **Test connection:**
   ```bash
   cd server
   npm run test-db
   ```

7. **Setup database:**
   ```bash
   cd server
   npm run setup-db
   ```

---

## Option 2: MySQL Standalone Installation

### Steps:

1. **Download MySQL:**
   - Go to: https://dev.mysql.com/downloads/installer/
   - Download "MySQL Installer for Windows"
   - Choose the "Full" or "Developer Default" setup type

2. **Install MySQL:**
   - Run the installer
   - Choose "Developer Default" or "Server only"
   - Follow the installation wizard
   - **Important:** During setup, you'll be asked to set a root password
   - **Remember this password!** You'll need it for the `.env` file

3. **Start MySQL Service:**
   - Open Windows Services (Win + R, type `services.msc`)
   - Find "MySQL80" or "MySQL"
   - Right-click → Start
   - Or set it to "Automatic" so it starts on boot

4. **Verify Installation:**
   - Open Command Prompt
   - Type: `mysql -u root -p`
   - Enter your password
   - If you see `mysql>`, it's working!

5. **Update your `.env` file:**
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=the_password_you_set_during_installation
   DB_NAME=beja_marketplace
   ```

6. **Test connection:**
   ```bash
   cd server
   npm run test-db
   ```

7. **Setup database:**
   ```bash
   cd server
   npm run setup-db
   ```

---

## Option 3: WAMP (Windows Alternative)

Similar to XAMPP but Windows-specific.

1. **Download WAMP:**
   - Go to: https://www.wampserver.com/en/
   - Download WAMP Server
   - Install it

2. **Start MySQL:**
   - Open WAMP Control Panel
   - Click "Start All Services"
   - MySQL should start automatically

3. **Follow steps 4-7 from XAMPP above**

---

## After Installation

Once MySQL is installed and running:

1. **Create `.env` file** in `server` folder:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password (or empty if no password)
   DB_NAME=beja_marketplace
   PORT=5000
   JWT_SECRET=your-secret-key-change-in-production
   CLIENT_URL=http://localhost:5173
   ```

2. **Test the connection:**
   ```bash
   cd server
   npm run test-db
   ```

3. **Setup the database:**
   ```bash
   cd server
   npm run setup-db
   ```

4. **Start your server:**
   ```bash
   cd server
   npm run dev
   ```

5. **Verify everything works:**
   - Visit: http://localhost:5000/api/health
   - Should show: `"connected": true` and `"usersTable": "exists"`

---

## Quick Recommendation

**For beginners:** Use **XAMPP** - it's the easiest and includes everything you need.

**For developers:** Use **MySQL Standalone** - more control and better for production.

---

## Troubleshooting

### "MySQL won't start"
- Check if port 3306 is already in use
- Make sure no other MySQL instance is running
- Check Windows Services for MySQL

### "Can't connect to MySQL"
- Make sure MySQL service is running
- Check your password in `.env` file
- Try: `mysql -u root -p` in command line

### "Port 3306 already in use"
- Another MySQL instance might be running
- Stop all MySQL services and start only one

---

## Need Help?

After installing, run:
```bash
cd server
npm run test-db
```

This will show you exactly what's working and what's not!



