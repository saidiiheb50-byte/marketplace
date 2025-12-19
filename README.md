# Béja Marketplace

A modern local marketplace website for buying and selling used items in Béja, Tunisia.

## Features

- 🔐 User authentication (register, login, JWT)
- 📦 Product listing with categories
- 🔍 Search and filter functionality
- 📱 Modern, responsive UI
- 👤 User dashboard
- 🛡️ Admin panel
- 📍 Location-based (Béja, Tunisia)

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MySQL
- **Authentication**: JWT

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm run install-all
   ```

2. **Set up the database:**
   - Create a MySQL database
   - Import the schema: `server/database/schema.sql`
   - Or run MySQL and execute the SQL file

3. **Configure environment variables:**
   - Copy `server/.env.example` to `server/.env`
   - Update the database credentials and JWT secret:
     ```
     PORT=5000
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=beja_marketplace
     JWT_SECRET=your_super_secret_jwt_key
     JWT_EXPIRES_IN=7d
     ```

4. **Run the application:**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend dev server on `http://localhost:5173`

### Default Admin Account

The schema includes a default admin account:
- Email: `admin@beja-marketplace.com`
- Password: `admin123`

**To create or update an admin account**, use the script:
```bash
cd server
node scripts/create-admin.js [email] [password] [name]
```

Example:
```bash
node scripts/create-admin.js admin@example.com mypassword123 Admin
```

**Important**: Change the default admin credentials in production!

## Project Structure

```
beja-marketplace/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
├── server/          # Node.js backend
│   ├── routes/
│   ├── middleware/
│   ├── database/
│   └── index.js
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)
- `GET /api/products/user/my-products` - Get user's products (protected)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category details

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/products` - Get all products (admin only)
- `PUT /api/admin/products/:id/status` - Update product status (admin only)
- `GET /api/admin/stats` - Get statistics (admin only)

## Development

- Frontend: `npm run client` (runs on port 5173)
- Backend: `npm run server` (runs on port 5000)
- Both: `npm run dev` (runs both concurrently)

## Production

1. Build the frontend:
   ```bash
   cd client && npm run build
   ```

2. Start the backend:
   ```bash
   cd server && npm start
   ```

## License

MIT

