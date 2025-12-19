import express from 'express';
import { db } from '../index.js';
import { isAdmin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require admin role
router.use(isAdmin);

// Get all users
router.get('/users', async (req, res) => {
  try {
    const [users] = await db.execute(
      `SELECT id, name, email, phone, role, user_type, account_status, seller_payment_status, created_at 
       FROM users 
       ORDER BY created_at DESC`
    );
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get pending buyer accounts
router.get('/pending-buyers', async (req, res) => {
  try {
    const [users] = await db.execute(
      `SELECT id, name, email, phone, account_status, created_at 
       FROM users 
       WHERE user_type = 'buyer' AND account_status = 'pending'
       ORDER BY created_at DESC`
    );
    res.json({ users });
  } catch (error) {
    console.error('Get pending buyers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Approve buyer account
router.put('/users/:id/approve', async (req, res) => {
  try {
    await db.execute(
      'UPDATE users SET account_status = "active" WHERE id = ?',
      [req.params.id]
    );
    res.json({ message: 'Account approved successfully' });
  } catch (error) {
    console.error('Approve account error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reject buyer account
router.put('/users/:id/reject', async (req, res) => {
  try {
    await db.execute(
      'UPDATE users SET account_status = "rejected" WHERE id = ?',
      [req.params.id]
    );
    res.json({ message: 'Account rejected' });
  } catch (error) {
    console.error('Reject account error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Suspend account
router.put('/users/:id/suspend', async (req, res) => {
  try {
    await db.execute(
      'UPDATE users SET account_status = "suspended" WHERE id = ?',
      [req.params.id]
    );
    res.json({ message: 'Account suspended' });
  } catch (error) {
    console.error('Suspend account error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all products (including inactive)
router.get('/products', async (req, res) => {
  try {
    const [products] = await db.execute(
      `SELECT 
        p.*,
        c.name as category_name,
        u.name as seller_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC`
    );
    res.json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update product status
router.put('/products/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'inactive', 'deleted'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await db.execute(
      'UPDATE products SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, req.params.id]
    );

    res.json({ message: 'Product status updated' });
  } catch (error) {
    console.error('Update product status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    await db.execute(
      'UPDATE products SET status = "deleted", updated_at = NOW() WHERE id = ?',
      [req.params.id]
    );
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get statistics
router.get('/stats', async (req, res) => {
  try {
    const [userCount] = await db.execute('SELECT COUNT(*) as count FROM users');
    const [productCount] = await db.execute('SELECT COUNT(*) as count FROM products WHERE status = "active"');
    const [categoryCount] = await db.execute('SELECT COUNT(*) as count FROM categories');

    res.json({
      totalUsers: userCount[0].count,
      activeProducts: productCount[0].count,
      totalCategories: categoryCount[0].count
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get pending seller payments
router.get('/seller-payments', async (req, res) => {
  try {
    const [payments] = await db.execute(
      `SELECT 
        sp.*,
        u.id as user_id,
        u.name as user_name,
        u.email as user_email,
        u.phone as user_phone,
        u.created_at as user_created_at
      FROM seller_payments sp
      JOIN users u ON sp.user_id = u.id
      WHERE sp.status = 'pending'
      ORDER BY sp.created_at DESC`
    );

    res.json({ payments });
  } catch (error) {
    console.error('Get seller payments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Activate seller account (approve payment)
router.put('/seller-payments/:id/approve', async (req, res) => {
  try {
    const paymentId = req.params.id;

    // Get payment details
    const [payments] = await db.execute(
      `SELECT sp.*, u.id as user_id 
       FROM seller_payments sp
       JOIN users u ON sp.user_id = u.id
       WHERE sp.id = ? AND sp.status = 'pending'`,
      [paymentId]
    );

    if (payments.length === 0) {
      return res.status(404).json({ error: 'Payment not found or already processed' });
    }

    const payment = payments[0];

    // Update payment status
    await db.execute(
      `UPDATE seller_payments 
       SET status = 'completed', updated_at = NOW()
       WHERE id = ?`,
      [paymentId]
    );

    // Activate seller account
    await db.execute(
      `UPDATE users 
       SET seller_payment_status = 'paid',
           seller_payment_date = NOW(),
           seller_payment_amount = ?
       WHERE id = ?`,
      [payment.amount, payment.user_id]
    );

    res.json({
      message: 'Seller account activated successfully',
      payment: {
        id: paymentId,
        status: 'completed'
      }
    });
  } catch (error) {
    console.error('Approve seller payment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reject seller payment
router.put('/seller-payments/:id/reject', async (req, res) => {
  try {
    const paymentId = req.params.id;
    const { reason } = req.body;

    // Update payment status
    await db.execute(
      `UPDATE seller_payments 
       SET status = 'failed', updated_at = NOW()
       WHERE id = ?`,
      [paymentId]
    );

    res.json({
      message: 'Payment request rejected',
      payment: {
        id: paymentId,
        status: 'failed'
      }
    });
  } catch (error) {
    console.error('Reject seller payment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

