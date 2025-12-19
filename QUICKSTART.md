# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm run install-all
```

### Step 2: Set Up Database
1. Make sure MySQL is running
2. Import the database schema:
   ```bash
   mysql -u root -p < server/database/schema.sql
   ```
   Or use phpMyAdmin to import `server/database/schema.sql`

### Step 3: Configure Environment
```bash
cd server
copy .env.example .env
```
Then edit `server/.env` with your MySQL password.

### Step 4: Run the App
```bash
npm run dev
```

### Step 5: Open Browser
Go to: **http://localhost:5173**

### Default Admin Login
- Email: `admin@beja-marketplace.com`
- Password: `admin123`

---

## 📱 What You Can Do

### As a User:
1. **Register** - Create your account
2. **Browse** - View all products
3. **Search** - Find items by keyword, category, or price
4. **Sell** - List your items with photos
5. **Dashboard** - Manage your listings

### As an Admin:
1. **Admin Panel** - View statistics
2. **Manage Users** - See all registered users
3. **Manage Products** - Approve/remove listings
4. **Monitor** - Track marketplace activity

---

## 🎨 Features

- ✅ Modern, responsive design
- ✅ User authentication
- ✅ Product listings with images
- ✅ Category filtering
- ✅ Search functionality
- ✅ Price filtering
- ✅ User dashboard
- ✅ Admin panel
- ✅ Location-based (Béja, Tunisia)

---

## 🛠️ Troubleshooting

**Database connection error?**
- Check MySQL is running
- Verify `.env` file has correct credentials

**Port already in use?**
- Change port in `server/.env` (backend)
- Change port in `client/vite.config.js` (frontend)

**Module not found?**
- Run `npm run install-all` again
- Delete `node_modules` and reinstall

---

## 📚 Next Steps

See `SETUP.md` for detailed setup instructions.
See `README.md` for full documentation.



