import express from 'express';
import { db } from '../index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user's wishlist
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [items] = await db.execute(
      `SELECT 
        w.*,
        p.title,
        p.price,
        p.images,
        p.location,
        p.status,
        p.stock_quantity,
        c.name as category_name,
        u.name as seller_name
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.user_id = u.id
      WHERE w.user_id = ? AND p.status = 'active'
      ORDER BY w.created_at DESC`,
      [req.user.id]
    );

    const wishlist = items.map(item => ({
      ...item,
      images: item.images ? JSON.parse(item.images) : []
    }));

    res.json({ wishlist });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add to wishlist
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID required' });
    }

    // Check if product exists
    const [products] = await db.execute(
      'SELECT id FROM products WHERE id = ? AND status = "active"',
      [product_id]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if already in wishlist
    const [existing] = await db.execute(
      'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?',
      [req.user.id, product_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Product already in wishlist' });
    }

    await db.execute(
      'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
      [req.user.id, product_id]
    );

    res.status(201).json({ message: 'Added to wishlist successfully' });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove from wishlist
router.delete('/:productId', authenticateToken, async (req, res) => {
  try {
    const [result] = await db.execute(
      'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
      [req.user.id, req.params.productId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found in wishlist' });
    }

    res.json({ message: 'Removed from wishlist successfully' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Check if product is in wishlist
router.get('/check/:productId', authenticateToken, async (req, res) => {
  try {
    const [items] = await db.execute(
      'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?',
      [req.user.id, req.params.productId]
    );

    res.json({ inWishlist: items.length > 0 });
  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;



