import express from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user's orders (as buyer)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [orders] = await db.execute(
      `SELECT 
        o.*,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    res.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get seller's sales (orders where their products were bought)
router.get('/sales', authenticateToken, async (req, res) => {
  try {
    const [sales] = await db.execute(
      `SELECT DISTINCT
        o.id as order_id,
        o.user_id as buyer_id,
        u.name as buyer_name,
        u.email as buyer_email,
        u.phone as buyer_phone,
        o.total_amount,
        o.status,
        o.payment_status,
        o.shipping_address,
        o.payment_method,
        o.created_at,
        COUNT(DISTINCT oi.id) as item_count,
        GROUP_CONCAT(DISTINCT p.title SEPARATOR ', ') as products
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      JOIN users u ON o.user_id = u.id
      WHERE p.user_id = ?
      GROUP BY o.id, o.user_id, u.name, u.email, u.phone, o.total_amount, o.status, o.payment_status, o.shipping_address, o.payment_method, o.created_at
      ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    res.json({ sales });
  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get seller's sales with detailed items
router.get('/sales/:orderId', authenticateToken, async (req, res) => {
  try {
    // Get order details
    const [orders] = await db.execute(
      `SELECT 
        o.*,
        u.name as buyer_name,
        u.email as buyer_email,
        u.phone as buyer_phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ?`,
      [req.params.orderId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Get order items for this seller's products
    const [items] = await db.execute(
      `SELECT 
        oi.*,
        p.title,
        p.images,
        p.user_id as seller_id
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ? AND p.user_id = ?`,
      [req.params.orderId, req.user.id]
    );

    const order = {
      ...orders[0],
      items: items.map(item => {
        let images = [];
        if (item.images) {
          try {
            if (typeof item.images === 'string') {
              images = JSON.parse(item.images);
            } else if (Array.isArray(item.images)) {
              images = item.images;
            }
          } catch (e) {
            images = [item.images];
          }
        }
        return {
          ...item,
          images
        };
      })
    };

    res.json({ order });
  } catch (error) {
    console.error('Get sale detail error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single order with items
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [orders] = await db.execute(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const [items] = await db.execute(
      `SELECT 
        oi.*,
        p.title,
        p.images,
        p.user_id as seller_id,
        u.name as seller_name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE oi.order_id = ?`,
      [req.params.id]
    );

    const order = {
      ...orders[0],
      items: items.map(item => {
        let images = [];
        if (item.images) {
          try {
            if (typeof item.images === 'string') {
              images = JSON.parse(item.images);
            } else if (Array.isArray(item.images)) {
              images = item.images;
            }
          } catch (e) {
            images = [item.images];
          }
        }
        return {
          ...item,
          images
        };
      })
    };

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create order from cart
router.post('/',
  authenticateToken,
  [
    body('shipping_address').trim().notEmpty().withMessage('Shipping address required'),
    body('payment_method').trim().notEmpty().withMessage('Payment method required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { shipping_address, payment_method } = req.body;

      // Get cart items
      const [cartItems] = await db.execute(
        `SELECT 
          c.*,
          p.price,
          p.stock_quantity,
          p.title
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ? AND p.status = 'active'`,
        [req.user.id]
      );

      if (cartItems.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
      }

      // Check stock availability
      for (const item of cartItems) {
        if (item.quantity > item.stock_quantity) {
          return res.status(400).json({ 
            error: `Insufficient stock for ${item.title}` 
          });
        }
      }

      // Calculate total
      const totalAmount = cartItems.reduce(
        (sum, item) => sum + (parseFloat(item.price) * item.quantity),
        0
      );

      // Create order
      const [orderResult] = await db.execute(
        `INSERT INTO orders 
        (user_id, total_amount, shipping_address, payment_method, status, payment_status)
        VALUES (?, ?, ?, ?, 'pending', 'pending')`,
        [req.user.id, totalAmount, shipping_address, payment_method]
      );

      const orderId = orderResult.insertId;

      // Create order items and update stock
      for (const item of cartItems) {
        await db.execute(
          `INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES (?, ?, ?, ?)`,
          [orderId, item.product_id, item.quantity, item.price]
        );

        // Update product stock
        await db.execute(
          'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }

      // Clear cart
      await db.execute('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

      const [newOrder] = await db.execute(
        'SELECT * FROM orders WHERE id = ?',
        [orderId]
      );

      res.status(201).json({
        message: 'Order created successfully',
        order: newOrder[0]
      });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Update order status (for sellers and admins)
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Get order to check ownership
    const [orders] = await db.execute(
      `SELECT o.*, oi.product_id, p.user_id as seller_id
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       WHERE o.id = ?
       LIMIT 1`,
      [req.params.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orders[0];

    // Check if user is buyer, seller, or admin
    const isBuyer = order.user_id === req.user.id;
    const isSeller = order.seller_id === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isBuyer && !isSeller && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await db.execute(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, req.params.id]
    );

    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

