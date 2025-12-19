# PowerShell Setup Guide for Béja Marketplace

## Database Setup (PowerShell)

Since PowerShell doesn't support the `<` redirection operator like bash, use one of these methods:

### Method 1: Using Get-Content (Recommended)
```powershell
Get-Content server\database\schema.sql | mysql -u root -p
```

### Method 2: Using cmd.exe
```powershell
cmd /c "mysql -u root -p < server\database\schema.sql"
```

### Method 3: Using MySQL Command Line
```powershell
# First, enter MySQL
mysql -u root -p

# Then inside MySQL, run:
source server/database/schema.sql
# Or use the full path:
source C:\Users\IHEB\Desktop\marketing\server\database\schema.sql
```

### Method 4: Using phpMyAdmin (Easiest)
1. Open phpMyAdmin in your browser (usually http://localhost/phpmyadmin)
2. Click on "Import" tab
3. Choose file: `server\database\schema.sql`
4. Click "Go"

### Method 5: Direct MySQL Command
```powershell
mysql -u root -p beja_marketplace -e "source server/database/schema.sql"
```

Or if you want to specify the password directly (less secure):
```powershell
mysql -u root -pYourPassword < server\database\schema.sql
```

## Complete Setup Steps (PowerShell)

### 1. Install Dependencies
```powershell
npm run install-all
```

### 2. Set Up Database
Choose one of the methods above to import the schema.

### 3. Configure Environment
```powershell
cd server
Copy-Item .env.example .env
# Then edit .env with your favorite editor (Notepad, VS Code, etc.)
notepad .env
```

### 4. Run the Application
```powershell
npm run dev
```

## Troubleshooting

**If MySQL command is not found:**
- Add MySQL to your PATH, or
- Use the full path: `C:\xampp\mysql\bin\mysql.exe` (if using XAMPP)
- Or use: `C:\wamp64\bin\mysql\mysql8.0.xx\bin\mysql.exe` (if using WAMP)

**Alternative: Use MySQL Workbench**
1. Open MySQL Workbench
2. Connect to your MySQL server
3. File → Open SQL Script
4. Select `server\database\schema.sql`
5. Click the Execute button (⚡)




