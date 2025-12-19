# Railway Database Setup - Detailed Guide

## Step 5: Setup Database Tables

After your MySQL database is created in Railway, you need to create all the tables. Here are **3 methods** (choose the easiest for you):

---

## Method 1: Using Railway MySQL Console (Easiest - Recommended)

### Step 5.1: Access MySQL Console
1. In your Railway project dashboard, click on your **MySQL service** (not the backend service)
2. Click on the **"Data"** tab at the top
3. You'll see a MySQL console/query interface

### Step 5.2: Run the Schema
1. Open the file `server/database/schema-railway.sql` from your project
2. **Copy the ENTIRE contents** of that file (Ctrl+A, Ctrl+C)
3. **Paste it** into the Railway MySQL console
4. Click **"Run"** or press Enter

### Step 5.3: Verify Tables Created
Run this query to check if tables were created:
```sql
SHOW TABLES;
```

You should see:
- users
- categories
- products
- cart
- orders
- order_items
- reviews
- wishlist
- messages
- seller_payments

### Step 5.4: Verify Categories Were Inserted
```sql
SELECT * FROM categories;
```

You should see 12 categories (Smartphones, Computers, etc.)

---

## Method 2: Using Railway CLI (If you have it installed)

### Step 5.1: Install Railway CLI (if not installed)
```bash
npm install -g @railway/cli
```

### Step 5.2: Login to Railway
```bash
railway login
```

### Step 5.3: Link to Your Project
```bash
railway link
```
Select your project when prompted.

### Step 5.4: Run Schema
```bash
cd server
railway run mysql < database/schema-railway.sql
```

Or if that doesn't work:
```bash
railway run bash
# Then inside the bash session:
mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE < database/schema-railway.sql
```

---

## Method 3: Using External MySQL Client (Advanced)

### Step 5.1: Get Connection Details
1. Click on MySQL service → **Variables** tab
2. Note these values:
   - `MYSQLHOST` (e.g., `containers-us-west-xxx.railway.app`)
   - `MYSQLPORT` (usually `3306`)
   - `MYSQLUSER` (usually `root`)
   - `MYSQLPASSWORD` (the password)
   - `MYSQLDATABASE` (the database name)

### Step 5.2: Connect with MySQL Client
If you have MySQL Workbench, DBeaver, or command-line MySQL:

**Command Line:**
```bash
mysql -h <MYSQLHOST> -P <MYSQLPORT> -u <MYSQLUSER> -p<MYSQLPASSWORD> <MYSQLDATABASE>
```

**MySQL Workbench:**
- Host: `<MYSQLHOST>`
- Port: `<MYSQLPORT>`
- Username: `<MYSQLUSER>`
- Password: `<MYSQLPASSWORD>`
- Default Schema: `<MYSQLDATABASE>`

### Step 5.3: Run Schema
Once connected, run:
```sql
SOURCE /path/to/schema-railway.sql;
```

Or copy-paste the entire schema file content.

---

## Step 6: Get Your Backend URL

### Step 6.1: Check if Backend is Deployed
1. Go back to your Railway project dashboard
2. Click on your **backend service** (not MySQL)
3. Go to **"Deployments"** tab
4. Make sure the latest deployment shows **"Active"** or **"Success"**

### Step 6.2: Generate Domain
1. Still in your backend service, go to **"Settings"** tab
2. Scroll down to **"Networking"** section
3. Click **"Generate Domain"** button
4. Railway will create a URL like: `your-app-name.up.railway.app`

### Step 6.3: Copy Your Backend URL
Your backend URL will be something like:
```
https://marketplace-backend-production.up.railway.app
```

**Your API base URL will be:**
```
https://marketplace-backend-production.up.railway.app/api
```

### Step 6.4: Test Your Backend
Open these URLs in your browser to test:

1. **Health Check:**
   ```
   https://your-backend-url.up.railway.app/api/health
   ```
   Should return JSON with database connection status.

2. **Auth Endpoints:**
   ```
   https://your-backend-url.up.railway.app/api/auth
   ```
   Should show available auth endpoints.

3. **Root:**
   ```
   https://your-backend-url.up.railway.app/
   ```
   Should show API information.

### Step 6.5: Update Vercel Environment Variable
1. Go to your Vercel project dashboard
2. **Settings** → **Environment Variables**
3. Find or add: `VITE_API_URL`
4. Set value to: `https://your-backend-url.up.railway.app/api`
   (Replace with your actual Railway URL)
5. Make sure it's enabled for **Production**, **Preview**, and **Development**
6. Click **Save**
7. Go to **Deployments** → Click **"Redeploy"** on the latest deployment

---

## Troubleshooting

### Database Setup Issues

**Problem: "Table already exists"**
- This is OK! It means tables are already created.
- You can skip the schema setup.

**Problem: "Access denied"**
- Check that you're using the correct MySQL credentials from Railway Variables
- Make sure you're connected to the right database

**Problem: "Connection refused"**
- Make sure MySQL service is running in Railway
- Check that MYSQLHOST includes the port if needed

### Backend URL Issues

**Problem: "Cannot GET /"**
- This is normal! The root endpoint should work.
- Try `/api/health` instead.

**Problem: "502 Bad Gateway"**
- Backend might still be deploying
- Check Railway logs: Service → Deployments → View Logs

**Problem: "Database connection error" in health check**
- Make sure all environment variables are set correctly
- Verify MySQL service is running
- Check that database tables exist (run `SHOW TABLES;`)

---

## Quick Verification Checklist

After completing Steps 5 and 6:

- [ ] Database tables created (run `SHOW TABLES;` - should see 10 tables)
- [ ] Categories inserted (run `SELECT * FROM categories;` - should see 12 rows)
- [ ] Backend URL generated in Railway
- [ ] Health endpoint works: `https://your-backend-url/api/health`
- [ ] Auth endpoint works: `https://your-backend-url/api/auth`
- [ ] `VITE_API_URL` set in Vercel to your Railway backend URL
- [ ] Vercel project redeployed

---

## Next Steps

Once Steps 5 and 6 are complete:
1. Test registration/login from your Vercel frontend
2. Monitor Railway logs for any errors
3. Create your first admin user (if needed)

