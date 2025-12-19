# Step 4: Set Environment Variables - Detailed Guide

## Overview
You need to configure environment variables so your backend can connect to the MySQL database and run properly.

---

## Part A: Get MySQL Credentials from Railway

### Step 4.1: Access MySQL Service Variables
1. In your Railway project dashboard, you should see **2 services**:
   - Your backend service (Node.js)
   - MySQL service (database icon)

2. **Click on the MySQL service** (the one with the database icon)

3. Click on the **"Variables"** tab at the top

4. You'll see these variables (Railway creates them automatically):
   - `MYSQLHOST` - This is your database host
   - `MYSQLPORT` - Usually `3306`
   - `MYSQLUSER` - Database username (usually `root`)
   - `MYSQLPASSWORD` - Database password (long random string)
   - `MYSQLDATABASE` - Database name

5. **Copy each value** - You'll need them in Part B

---

## Part B: Set Environment Variables in Backend Service

### Step 4.2: Go to Backend Service
1. Go back to your Railway project dashboard
2. **Click on your backend service** (not MySQL)
3. Click on the **"Variables"** tab

### Step 4.3: Add Environment Variables
Click **"+ New Variable"** for each variable below:

#### 1. Database Configuration Variables

**Variable Name:** `DB_HOST`  
**Value:** Copy from `MYSQLHOST` (from MySQL service)  
**Example:** `containers-us-west-xxx.railway.app`

---

**Variable Name:** `DB_USER`  
**Value:** Copy from `MYSQLUSER` (from MySQL service)  
**Example:** `root`

---

**Variable Name:** `DB_PASSWORD`  
**Value:** Copy from `MYSQLPASSWORD` (from MySQL service)  
**Example:** `aBc123XyZ789...` (long random string)

---

**Variable Name:** `DB_NAME`  
**Value:** Copy from `MYSQLDATABASE` (from MySQL service)  
**Example:** `railway`

---

**Variable Name:** `DB_PORT`  
**Value:** Copy from `MYSQLPORT` or use `3306`  
**Example:** `3306`

---

#### 2. Server Configuration

**Variable Name:** `PORT`  
**Value:** `5000`  
**Note:** Railway will override this, but set it anyway

---

#### 3. JWT Secret (Generate a Random String)

**Variable Name:** `JWT_SECRET`  
**Value:** Generate a random secret key

**How to generate JWT_SECRET:**

**Option A: Using Node.js (Recommended)**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output (64 character hex string)

**Option B: Using Online Generator**
- Go to: https://randomkeygen.com/
- Copy a "CodeIgniter Encryption Keys" (64 characters)

**Option C: Use This (Less Secure - Change Later)**
```
your-super-secret-jwt-key-change-this-in-production-12345
```

**Example JWT_SECRET:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

---

#### 4. JWT Expiration

**Variable Name:** `JWT_EXPIRES_IN`  
**Value:** `7d`  
**Note:** This means tokens expire in 7 days

---

#### 5. Client URL (Your Vercel Domain)

**Variable Name:** `CLIENT_URL`  
**Value:** `https://marketplace-rosy-phi.vercel.app`  
**Note:** This is your Vercel frontend URL (for CORS)

---

#### 6. Node Environment

**Variable Name:** `NODE_ENV`  
**Value:** `production`  
**Note:** Tells Node.js this is a production environment

---

## Complete List of Variables

Here's the complete list to add (copy-paste friendly):

```
DB_HOST=<from MYSQLHOST>
DB_USER=<from MYSQLUSER>
DB_PASSWORD=<from MYSQLPASSWORD>
DB_NAME=<from MYSQLDATABASE>
DB_PORT=3306
PORT=5000
JWT_SECRET=<generate random 64-char string>
JWT_EXPIRES_IN=7d
CLIENT_URL=https://marketplace-rosy-phi.vercel.app
NODE_ENV=production
```

---

## Step 4.4: Verify All Variables Are Set

After adding all variables, your Variables tab should show:

✅ `DB_HOST`  
✅ `DB_USER`  
✅ `DB_PASSWORD`  
✅ `DB_NAME`  
✅ `DB_PORT`  
✅ `PORT`  
✅ `JWT_SECRET`  
✅ `JWT_EXPIRES_IN`  
✅ `CLIENT_URL`  
✅ `NODE_ENV`  

**Total: 10 variables**

---

## Step 4.5: Save and Deploy

1. Railway will **automatically save** variables as you add them
2. Railway will **automatically redeploy** your backend when variables change
3. Wait for deployment to complete (check Deployments tab)
4. Status should show **"Active"** ✅

---

## Visual Guide: Where to Find Things

```
Railway Dashboard
├── Your Project
    ├── Backend Service (Node.js)
    │   └── Variables Tab ← Add variables HERE
    │
    └── MySQL Service (Database)
        └── Variables Tab ← Copy credentials FROM HERE
```

---

## Quick Reference: Copy These Values

From **MySQL Service → Variables:**
- `MYSQLHOST` → Use for `DB_HOST`
- `MYSQLUSER` → Use for `DB_USER`
- `MYSQLPASSWORD` → Use for `DB_PASSWORD`
- `MYSQLDATABASE` → Use for `DB_NAME`
- `MYSQLPORT` → Use for `DB_PORT`

---

## Common Mistakes to Avoid

❌ **Don't** add `MYSQLHOST` directly - use it as the value for `DB_HOST`  
❌ **Don't** forget to generate a secure `JWT_SECRET`  
❌ **Don't** use `localhost` for `CLIENT_URL` - use your Vercel URL  
❌ **Don't** forget the `https://` in `CLIENT_URL`  
✅ **Do** copy values exactly as they appear (they're case-sensitive)  
✅ **Do** wait for deployment to finish before testing  

---

## Troubleshooting

### "Variable not found" error
- Make sure you added the variable to the **backend service**, not MySQL service
- Check spelling (case-sensitive)

### "Database connection failed"
- Double-check `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` match MySQL service variables
- Make sure MySQL service is running

### "CORS error"
- Verify `CLIENT_URL` is set to your Vercel domain
- Make sure it starts with `https://`

### Deployment keeps failing
- Check Railway logs: Backend Service → Deployments → View Logs
- Look for error messages about missing variables

---

## Next Steps

After Step 4 is complete:
1. ✅ All 10 environment variables are set
2. ✅ Backend service is deployed
3. ✅ Move to **Step 5: Setup Database** (create tables)

---

## Need Help?

If you're stuck:
1. Check Railway logs for error messages
2. Verify all 10 variables are present
3. Make sure values are copied correctly (no extra spaces)
4. Ensure MySQL service is running

