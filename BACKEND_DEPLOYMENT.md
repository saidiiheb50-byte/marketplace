# Backend Deployment Guide

## Overview
Your frontend on Vercel needs to connect to a deployed backend API. This guide will help you deploy your backend server.

## Quick Steps

1. **Deploy Backend** (choose one platform below)
2. **Get Backend URL** (e.g., `https://your-app.railway.app`)
3. **Set VITE_API_URL in Vercel** to `https://your-app.railway.app/api`

---

## Option 1: Deploy to Railway (Recommended - Easiest)

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"

### Step 2: Add MySQL Database
1. Click "+ New"
2. Select "Database" → "MySQL"
3. Railway will create a MySQL database automatically
4. Copy the connection details (you'll need them)

### Step 3: Deploy Backend
1. Click "+ New" → "GitHub Repo"
2. Select your `marketplace` repository
3. Railway will detect it's a Node.js project
4. **Important Settings:**
   - **Root Directory**: Set to `server`
   - **Build Command**: Leave default (or `npm install`)
   - **Start Command**: `npm start`

### Step 4: Set Environment Variables
In Railway project settings, add these environment variables:

```env
PORT=5000
DB_HOST=<from Railway MySQL service>
DB_USER=<from Railway MySQL service>
DB_PASSWORD=<from Railway MySQL service>
DB_NAME=<from Railway MySQL service>
DB_PORT=3306
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-vercel-app.vercel.app
```

**To get MySQL credentials:**
- Click on your MySQL service in Railway
- Go to "Variables" tab
- Copy `MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`

### Step 5: Setup Database
1. Once deployed, Railway will give you a URL like `https://your-app.railway.app`
2. You need to run the database setup. You can:
   - **Option A**: SSH into Railway and run `npm run setup-db`
   - **Option B**: Use Railway's MySQL service to run the SQL schema manually
   - **Option C**: Create a one-time setup endpoint (see below)

### Step 6: Get Your Backend URL
- Railway will give you a URL like: `https://your-app.railway.app`
- Your API base URL will be: `https://your-app.railway.app/api`

---

## Option 2: Deploy to Render

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Create MySQL Database
1. Click "New +" → "PostgreSQL" (or MySQL if available)
2. Note: Render uses PostgreSQL by default, you may need to adjust your code
3. Or use an external MySQL service like [PlanetScale](https://planetscale.com)

### Step 3: Deploy Backend
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. **Settings:**
   - **Name**: marketplace-backend
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

### Step 4: Set Environment Variables
Add all the same variables as Railway (see above)

### Step 5: Get Your Backend URL
- Render will give you: `https://your-app.onrender.com`
- Your API base URL: `https://your-app.onrender.com/api`

---

## Option 3: Deploy to Heroku

### Step 1: Install Heroku CLI
Download from [heroku.com](https://devcenter.heroku.com/articles/heroku-cli)

### Step 2: Login and Create App
```bash
heroku login
heroku create your-app-name
```

### Step 3: Add MySQL Database
```bash
heroku addons:create cleardb:ignite
```

### Step 4: Set Environment Variables
```bash
heroku config:set JWT_SECRET=your-secret-key
heroku config:set CLIENT_URL=https://your-vercel-app.vercel.app
```

### Step 5: Deploy
```bash
cd server
git subtree push --prefix server heroku main
```

---

## After Backend is Deployed

### Step 1: Setup Database
You need to create the database tables. Options:

**Option A: Use Railway/Render Console**
- Most platforms have a web console where you can run SQL
- Copy contents of `server/database/schema.sql`
- Run it in the console

**Option B: Create Setup Endpoint (Temporary)**
Add this to `server/index.js` temporarily:

```javascript
app.get('/api/setup-db', async (req, res) => {
  // Run setup-database.js logic here
  // Remove this endpoint after setup!
});
```

**Option C: Use MySQL Client**
- Connect to your remote MySQL database
- Run the schema.sql file

### Step 2: Configure Vercel Environment Variable

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Click **Add New**
4. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.railway.app/api` (use your actual backend URL)
5. Make sure to select **Production**, **Preview**, and **Development**
6. Click **Save**

### Step 3: Redeploy Vercel
- Vercel will auto-redeploy, or
- Go to **Deployments** → Click **Redeploy**

---

## Quick Checklist

- [ ] Backend deployed and accessible (test: `https://your-backend.com/api/health`)
- [ ] Database tables created
- [ ] CORS configured to allow your Vercel domain
- [ ] `VITE_API_URL` set in Vercel environment variables
- [ ] Vercel project redeployed

---

## Testing Your Setup

1. **Test Backend:**
   - Visit: `https://your-backend-url.com/api/health`
   - Should return JSON with database connection status

2. **Test Frontend:**
   - Visit your Vercel URL
   - Check browser console (F12) - should see: `API URL: https://your-backend-url.com/api`
   - Try logging in or registering

---

## Common Issues

### "Cannot connect to API"
- ✅ Make sure `VITE_API_URL` is set in Vercel
- ✅ Make sure backend URL is correct (ends with `/api`)
- ✅ Make sure backend is actually running

### CORS Errors
- Update `CLIENT_URL` in backend environment variables
- Set it to your Vercel domain: `https://your-app.vercel.app`

### Database Connection Errors
- Check database credentials in backend environment variables
- Make sure database is accessible from the internet (not localhost)

---

## Need Help?

If you're stuck, the easiest option is **Railway** - it's the most straightforward for Node.js + MySQL deployments.

