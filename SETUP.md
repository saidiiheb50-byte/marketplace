# Setup Guide for Béja Marketplace

## Quick Start

### 1. Install Dependencies

```bash
npm run install-all
```

This will install dependencies for:
- Root project (concurrently for running both servers)
- Backend server (Node.js/Express)
- Frontend client (React/Vite)

### 2. Database Setup

1. **Install MySQL** (if not already installed)
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP/WAMP which includes MySQL

2. **Create Database**
   - Open MySQL command line or phpMyAdmin
   - Run the SQL file: `server/database/schema.sql`
   - Or manually create database and import the schema

3. **Verify Database**
   - Database name: `beja_marketplace`
   - Tables created: `users`, `categories`, `products`

### 3. Configure Environment Variables

1. **Copy the example file:**
   ```bash
   cd server
   copy .env.example .env
   ```
   (On Linux/Mac: `cp .env.example .env`)

2. **Edit `server/.env`** with your database credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=beja_marketplace
   JWT_SECRET=your_super_secret_jwt_key_change_this
   JWT_EXPIRES_IN=7d
   ```

### 4. Run the Application

**Development mode (runs both frontend and backend):**
```bash
npm run dev
```

This will start:
- Backend API: http://localhost:5000
- Frontend: http://localhost:5173

**Or run separately:**
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

### 5. Access the Application

- Open your browser: http://localhost:5173
- Register a new account or use the admin account:
  - Email: `admin@beja-marketplace.com`
  - Password: `admin123`

**⚠️ IMPORTANT:** Change the admin password in production!

## Creating Admin Account

If you need to create a new admin account:

1. **Option 1: Via Registration (then update in database)**
   - Register a new user through the website
   - Update the user's role to 'admin' in the database:
     ```sql
     UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
     ```

2. **Option 2: Direct SQL**
   - Use bcrypt to hash your password
   - Insert directly into database (see schema.sql for example)

## Troubleshooting

### Database Connection Error
- Check MySQL is running
- Verify credentials in `.env` file
- Ensure database `beja_marketplace` exists

### Port Already in Use
- Change `PORT` in `server/.env` (backend)
- Change port in `client/vite.config.js` (frontend)

### Module Not Found Errors
- Run `npm run install-all` again
- Delete `node_modules` folders and reinstall

### CORS Errors
- Ensure backend is running on port 5000
- Check `server/index.js` has CORS enabled

## Production Deployment

1. **Build Frontend:**
   ```bash
   cd client
   npm run build
   ```

2. **Serve Frontend:**
   - Copy `client/dist` to your web server
   - Or serve with Express (add static file serving in `server/index.js`)

3. **Environment:**
   - Use strong `JWT_SECRET` in production
   - Use secure database credentials
   - Enable HTTPS
   - Set up proper error logging

## Features Implemented

✅ User registration and authentication
✅ Product listing (CRUD)
✅ Category system
✅ Search and filtering
✅ User dashboard
✅ Admin panel
✅ Location-based (Béja, Tunisia)
✅ Modern, responsive UI

## Next Steps (Optional Enhancements)

- Image upload (currently uses URLs)
- Email notifications
- Messaging system between buyers/sellers
- Reviews and ratings
- Payment integration
- Mobile app



