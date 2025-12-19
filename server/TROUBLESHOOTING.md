# Troubleshooting Registration Errors

## Common Issues and Solutions

### 1. "Server error during registration"

This usually means one of the following:

#### A. Database doesn't exist
**Solution:**
1. Open MySQL/MariaDB command line or phpMyAdmin
2. Run: `CREATE DATABASE IF NOT EXISTS beja_marketplace;`
3. Or run the schema file: `mysql -u root -p < database/schema.sql`

#### B. Users table doesn't exist
**Solution:**
1. Make sure you've run the database schema
2. Check if the table exists: `SHOW TABLES LIKE 'users';`
3. If it doesn't exist, run: `mysql -u root -p beja_marketplace < database/schema.sql`

#### C. Database connection issue
**Solution:**
1. Check your `.env` file in the `server` folder:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password_here
   DB_NAME=beja_marketplace
   ```
2. Make sure MySQL/MariaDB is running
3. Verify credentials are correct

### 2. Check Database Status

Visit: `http://localhost:5000/api/health`

This will show:
- Database connection status
- Whether the users table exists

### 3. Test Database Connection

You can test the connection by checking the server console when you start it. You should see:
```
✅ Database connected successfully
```

If you see:
```
❌ Database connection error: ...
```
Then check your database credentials and make sure MySQL is running.

### 4. Manual Database Setup

If automatic setup doesn't work:

1. **Create database:**
   ```sql
   CREATE DATABASE beja_marketplace;
   USE beja_marketplace;
   ```

2. **Run schema:**
   ```bash
   mysql -u root -p beja_marketplace < server/database/schema.sql
   ```

3. **Or in MySQL:**
   ```sql
   SOURCE server/database/schema.sql;
   ```

### 5. Check Server Logs

When you try to register, check the server console for detailed error messages. The improved error handling will now show:
- Specific database errors
- Table existence issues
- Connection problems

### 6. Verify Table Structure

Run this in MySQL to check if the users table has the correct structure:
```sql
DESCRIBE users;
```

You should see columns: id, name, email, password, phone, role, created_at, updated_at




