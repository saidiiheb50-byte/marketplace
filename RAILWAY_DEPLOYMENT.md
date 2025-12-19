# Railway Deployment - Step by Step Guide

## Quick Deploy to Railway

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Sign up with **GitHub** (recommended - easiest way)

### Step 2: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Find and select your `marketplace` repository
4. Click **"Deploy Now"**

### Step 3: Configure the Service
Railway will detect it's a Node.js project. You need to configure it:

1. Click on the service that was created
2. Go to **Settings** tab
3. Set **Root Directory** to: `server`
4. The **Start Command** should be: `npm start` (already set)

### Step 4: Add MySQL Database
1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add MySQL"**
3. Railway will create a MySQL database automatically
4. **Important**: Note the database service name (you'll need it)

### Step 5: Get Database Credentials
1. Click on your **MySQL service** in Railway
2. Go to **Variables** tab
3. You'll see these variables:
   - `MYSQLHOST` (this is your DB_HOST)
   - `MYSQLUSER` (this is your DB_USER)
   - `MYSQLPASSWORD` (this is your DB_PASSWORD)
   - `MYSQLDATABASE` (this is your DB_NAME)
   - `MYSQLPORT` (usually 3306)

### Step 6: Set Environment Variables
1. Go back to your **backend service** (not the MySQL service)
2. Click **Variables** tab
3. Click **"+ New Variable"** and add these one by one:

```env
PORT=5000
DB_HOST=<copy from MYSQLHOST>
DB_USER=<copy from MYSQLUSER>
DB_PASSWORD=<copy from MYSQLPASSWORD>
DB_NAME=<copy from MYSQLDATABASE>
DB_PORT=<copy from MYSQLPORT or use 3306>
JWT_SECRET=<generate a random secret key>
JWT_EXPIRES_IN=7d
CLIENT_URL=https://marketplace-rosy-phi.vercel.app
NODE_ENV=production
```

**To generate JWT_SECRET:**
- Use a random string generator
- Or run this in terminal: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Step 7: Deploy
1. Railway will automatically deploy when you push to GitHub
2. Or click **"Deploy"** button in Railway dashboard
3. Wait for deployment to complete (usually 2-3 minutes)

### Step 8: Get Your Backend URL
1. Once deployed, Railway will give you a URL
2. Click on your service → **Settings** → **Generate Domain**
3. You'll get a URL like: `https://your-app-name.up.railway.app`
4. **Your API URL will be**: `https://your-app-name.up.railway.app/api`

### Step 9: Setup Database Tables
After deployment, you need to create the database tables:

**Option A: Using Railway MySQL Console**
1. Click on your MySQL service
2. Go to **Data** tab
3. Click **"Query"** or **"Connect"**
4. Copy the contents of `server/database/schema.sql`
5. Paste and run it in the MySQL console

**Option B: Create a Setup Endpoint (Temporary)**
Add this temporarily to `server/index.js`:

```javascript
// Temporary setup endpoint - REMOVE AFTER SETUP!
app.post('/api/setup-database', async (req, res) => {
  try {
    // Import and run setup-database.js logic
    const { exec } = await import('child_process');
    exec('node setup-database.js', (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json({ message: 'Database setup complete', output: stdout });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

Then call: `POST https://your-backend.railway.app/api/setup-database`

**Option C: Use Railway CLI**
```bash
railway run node setup-database.js
```

### Step 10: Test Your Backend
1. Visit: `https://your-backend.railway.app/api/health`
2. Should return JSON with database connection status
3. Visit: `https://your-backend.railway.app/api/auth`
4. Should show available auth endpoints

### Step 11: Configure Vercel
1. Go to your Vercel project dashboard
2. **Settings** → **Environment Variables**
3. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend.railway.app/api` (use your actual Railway URL)
4. Select all environments (Production, Preview, Development)
5. Click **Save**
6. **Redeploy** your Vercel project

## Troubleshooting

### Database Connection Fails
- Check all environment variables are set correctly
- Make sure MySQL service is running in Railway
- Verify DB_HOST, DB_USER, DB_PASSWORD, DB_NAME match MySQL service variables

### CORS Errors
- Make sure `CLIENT_URL` is set to your Vercel domain
- Check that CORS configuration in `server/index.js` includes your Vercel URL

### Build Fails
- Make sure Root Directory is set to `server`
- Check that `package.json` has a `start` script
- Verify all dependencies are listed in `package.json`

### Database Tables Don't Exist
- Run the schema.sql file in Railway's MySQL console
- Or use the temporary setup endpoint method above

## Quick Checklist

- [ ] Railway account created
- [ ] Project created from GitHub repo
- [ ] Root Directory set to `server`
- [ ] MySQL database added
- [ ] Environment variables set (DB_HOST, DB_USER, etc.)
- [ ] JWT_SECRET generated and set
- [ ] CLIENT_URL set to Vercel domain
- [ ] Backend deployed and accessible
- [ ] Database tables created
- [ ] Health endpoint works (`/api/health`)
- [ ] VITE_API_URL set in Vercel
- [ ] Vercel project redeployed

## Next Steps

Once everything is working:
1. Test login/register from your Vercel frontend
2. Monitor Railway logs for any errors
3. Set up custom domain (optional) in Railway
4. Remove any temporary setup endpoints

## Support

If you get stuck:
- Check Railway logs: Click on service → **Deployments** → Click on latest deployment → **View Logs**
- Check Railway community: [railway.app/community](https://railway.app/community)
- Railway docs: [docs.railway.app](https://docs.railway.app)

