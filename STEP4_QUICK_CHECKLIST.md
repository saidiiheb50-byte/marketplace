# Step 4: Environment Variables - Quick Checklist

## ✅ Step-by-Step Checklist

### Part 1: Get MySQL Credentials (2 minutes)

- [ ] Go to Railway dashboard
- [ ] Click on **MySQL service** (database icon)
- [ ] Click **"Variables"** tab
- [ ] Copy these 5 values:
  - [ ] `MYSQLHOST` → Will use for `DB_HOST`
  - [ ] `MYSQLUSER` → Will use for `DB_USER`
  - [ ] `MYSQLPASSWORD` → Will use for `DB_PASSWORD`
  - [ ] `MYSQLDATABASE` → Will use for `DB_NAME`
  - [ ] `MYSQLPORT` → Will use for `DB_PORT`

---

### Part 2: Add Variables to Backend (5 minutes)

- [ ] Go back to Railway dashboard
- [ ] Click on **Backend service** (Node.js icon)
- [ ] Click **"Variables"** tab
- [ ] Click **"+ New Variable"** for each:

#### Database Variables (5 variables)
- [ ] `DB_HOST` = `<paste MYSQLHOST value>`
- [ ] `DB_USER` = `<paste MYSQLUSER value>`
- [ ] `DB_PASSWORD` = `<paste MYSQLPASSWORD value>`
- [ ] `DB_NAME` = `<paste MYSQLDATABASE value>`
- [ ] `DB_PORT` = `3306` (or paste MYSQLPORT)

#### Server Variables (5 variables)
- [ ] `PORT` = `5000`
- [ ] `JWT_SECRET` = `<generate random string - see below>`
- [ ] `JWT_EXPIRES_IN` = `7d`
- [ ] `CLIENT_URL` = `https://marketplace-rosy-phi.vercel.app`
- [ ] `NODE_ENV` = `production`

---

### Part 3: Generate JWT_SECRET

**Option 1: Use this generated one (copy it):**
```
1405a0c8ab3e505948a33e1c20b3e26bb7c21c8344be49ecdc3eb465a4c34ae1
```

**Option 2: Generate your own:**
Run in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

- [ ] JWT_SECRET copied/generated
- [ ] JWT_SECRET added to variables

---

### Part 4: Verify

- [ ] Total of **10 variables** in backend service Variables tab
- [ ] All variables have values (no empty ones)
- [ ] Railway automatically saved and redeployed
- [ ] Check Deployments tab - should show "Active" ✅

---

## 📋 Quick Copy-Paste Reference

When adding variables, use these exact names and values:

| Variable Name | Value Source |
|--------------|--------------|
| `DB_HOST` | From MySQL: `MYSQLHOST` |
| `DB_USER` | From MySQL: `MYSQLUSER` |
| `DB_PASSWORD` | From MySQL: `MYSQLPASSWORD` |
| `DB_NAME` | From MySQL: `MYSQLDATABASE` |
| `DB_PORT` | `3306` or from MySQL: `MYSQLPORT` |
| `PORT` | `5000` |
| `JWT_SECRET` | Generate (see above) |
| `JWT_EXPIRES_IN` | `7d` |
| `CLIENT_URL` | `https://marketplace-rosy-phi.vercel.app` |
| `NODE_ENV` | `production` |

---

## ⚠️ Common Mistakes

- ❌ Adding variables to MySQL service instead of backend service
- ❌ Using `MYSQLHOST` as variable name (should be `DB_HOST`)
- ❌ Forgetting `https://` in `CLIENT_URL`
- ❌ Using a weak `JWT_SECRET` (use the generated one above)
- ❌ Missing a variable (need all 10)

---

## ✅ Success Indicators

When Step 4 is complete:
- ✅ Backend service has 10 environment variables
- ✅ Deployment status shows "Active"
- ✅ No errors in Railway logs
- ✅ Ready for Step 5 (Database Setup)

---

## 🆘 Need Help?

If something's not working:
1. Check Railway logs: Backend Service → Deployments → View Logs
2. Verify all 10 variables are present
3. Make sure values match exactly (case-sensitive)
4. Ensure MySQL service is running

