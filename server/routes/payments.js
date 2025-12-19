import express from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Process seller payment
router.post('/seller',
  authenticateToken,
  [
    body('amount').isFloat({ min: 0 }).withMessage('Valid amount required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { amount, paymentMethod = 'manual', paymentNote } = req.body;

      // Get user to check if they're a seller
      const [users] = await db.execute(
        'SELECT id, user_type FROM users WHERE id = ?',
        [req.user.id]
      );

      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = users[0];

      if (user.user_type !== 'seller') {
        return res.status(400).json({ error: 'Only sellers can make payments' });
      }

      // Create payment record with pending status (manual payment)
      const [paymentResult] = await db.execute(
        `INSERT INTO seller_payments 
        (user_id, amount, payment_method, payment_reference, payment_note, status)
        VALUES (?, ?, ?, ?, ?, 'pending')`,
        [
          req.user.id, 
          amount, 
          paymentMethod,
          `MANUAL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          paymentNote || null
        ]
      );

      // Update user's seller payment status to pending
      await db.execute(
        `UPDATE users 
        SET seller_payment_status = 'pending',
            seller_payment_amount = ?
        WHERE id = ?`,
        [amount, req.user.id]
      );

      res.json({
        message: 'Payment request submitted successfully. Your account will be activated after manual payment verification.',
        payment: {
          id: paymentResult.insertId,
          amount,
          status: 'pending',
          note: paymentNote
        }
      });
    } catch (error) {
      console.error('Payment error:', error);
      res.status(500).json({ error: 'Server error processing payment' });
    }
  }
);

// Check seller payment status
router.get('/seller/status', authenticateToken, async (req, res) => {
  try {
    const [users] = await db.execute(
      'SELECT seller_payment_status, seller_payment_date, seller_payment_amount FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      payment_status: users[0].seller_payment_status || 'pending',
      payment_date: users[0].seller_payment_date,
      payment_amount: users[0].seller_payment_amount || 0
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

