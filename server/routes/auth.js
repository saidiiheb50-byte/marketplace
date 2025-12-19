import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { db } from '../index.js';
import { authenticateToken } from '../middleware/auth.js';
import { checkUsersTable } from '../utils/dbCheck.js';

const router = express.Router();

// Register
router.post('/register',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional().trim(),
  ],
  async (req, res) => {
    try {
      console.log('Registration attempt:', { email: req.body.email, name: req.body.name });
      
      // Check if users table exists
      const tableCheck = await checkUsersTable();
      if (!tableCheck.exists) {
        console.error('Users table check failed:', tableCheck);
        return res.status(500).json({ 
          error: tableCheck.message || 'Database table issue',
          details: 'Please ensure the database schema has been run'
        });
      }
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, phone, user_type = 'buyer' } = req.body;

      // Check if user exists
      const [existingUsers] = await db.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user with user_type and account_status
      // Buyers start as pending, sellers start as pending (until payment)
      const accountStatus = user_type === 'buyer' ? 'pending' : 'pending';
      
      const [result] = await db.execute(
        'INSERT INTO users (name, email, password, phone, role, user_type, account_status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, email, hashedPassword, phone || null, 'user', user_type, accountStatus]
      );

      const token = jwt.sign(
        { id: result.insertId, email, role: 'user' },
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.status(201).json({
        message: user_type === 'buyer' 
          ? 'Account created successfully! Your account is pending admin approval.'
          : 'User registered successfully',
        token,
        user: {
          id: result.insertId,
          name,
          email,
          phone,
          role: 'user',
          user_type: user_type,
          account_status: accountStatus
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        sqlState: error.sqlState,
        sqlMessage: error.sqlMessage
      });
      
      // Provide more specific error messages
      let errorMessage = 'Server error during registration';
      
      if (error.code === 'ER_NO_SUCH_TABLE') {
        errorMessage = 'Database table does not exist. Please run the database schema.';
      } else if (error.code === 'ER_DUP_ENTRY') {
        errorMessage = 'Email already registered';
      } else if (error.code === 'ER_BAD_DB_ERROR') {
        errorMessage = 'Database does not exist. Please create the database first.';
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        errorMessage = 'Cannot connect to database. Please check your database connection.';
      } else if (error.sqlMessage) {
        errorMessage = `Database error: ${error.sqlMessage}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      res.status(500).json({ 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// Login
router.post('/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  async (req, res) => {
    try {
      console.log('Login attempt:', { email: req.body.email });
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      const [users] = await db.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = users[0];

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      // Check account status
      if (user.account_status === 'pending') {
        return res.status(403).json({ 
          error: 'Your account is pending admin approval. Please wait for activation.' 
        });
      }
      
      if (user.account_status === 'suspended' || user.account_status === 'rejected') {
        return res.status(403).json({ 
          error: 'Your account has been suspended or rejected. Please contact support.' 
        });
      }

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          user_type: user.user_type || 'buyer',
          seller_payment_status: user.seller_payment_status || 'pending',
          account_status: user.account_status || 'active'
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Server error during login' });
    }
  }
);

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await db.execute(
      'SELECT id, name, email, phone, role, user_type, seller_payment_status, account_status, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

