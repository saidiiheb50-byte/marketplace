import express from 'express';
import { db } from '../index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [cartItems] = await db.execute(
      `SELECT 
        c.*,
        p.title,
        p.price,
        p.images,
        p.stock_quantity,
        p.status as product_status,
        u.name as seller_name
      FROM cart c
      JOIN products p ON c.product_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC`,
      [req.user.id]
    );

    // Parse images JSON
    const items = cartItems.map(item => ({
      ...item,
      images: item.images ? JSON.parse(item.images) : []
    }));

    res.json({ cart: items });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add to cart
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID required' });
    }

    // Check if product exists and is available
    const [products] = await db.execute(
      'SELECT id, stock_quantity, status, user_id FROM products WHERE id = ?',
      [product_id]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = products[0];

    if (product.status !== 'active') {
      return res.status(400).json({ error: 'Product is not available' });
    }

    if (product.user_id === req.user.id) {
      return res.status(400).json({ error: 'Cannot add your own product to cart' });
    }

    if (product.stock_quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Check if item already in cart
    const [existing] = await db.execute(
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
      [req.user.id, product_id]
    );

    if (existing.length > 0) {
      const newQuantity = existing[0].quantity + quantity;
      if (newQuantity > product.stock_quantity) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }
      await db.execute(
        'UPDATE cart SET quantity = ?, updated_at = NOW() WHERE id = ?',
        [newQuantity, existing[0].id]
      );
      return res.json({ message: 'Cart updated successfully' });
    }

    // Add new item to cart
    await db.execute(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
      [req.user.id, product_id, quantity]
    );

    res.status(201).json({ message: 'Item added to cart successfully' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update cart item quantity
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartId = req.params.id;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Valid quantity required' });
    }

    // Check ownership and get product stock
    const [cartItems] = await db.execute(
      `SELECT c.*, p.stock_quantity 
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.id = ? AND c.user_id = ?`,
      [cartId, req.user.id]
    );

    if (cartItems.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (quantity > cartItems[0].stock_quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    await db.execute(
      'UPDATE cart SET quantity = ?, updated_at = NOW() WHERE id = ?',
      [quantity, cartId]
    );

    res.json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove from cart
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const cartId = req.params.id;

    const [result] = await db.execute(
      'DELETE FROM cart WHERE id = ? AND user_id = ?',
      [cartId, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Clear cart
router.delete('/', authenticateToken, async (req, res) => {
  try {
    await db.execute('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;



