import express from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const [reviews] = await db.execute(
      `SELECT 
        r.*,
        u.name as user_name,
        u.id as user_id
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC`,
      [req.params.productId]
    );

    res.json({ reviews });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get product rating summary
router.get('/product/:productId/summary', async (req, res) => {
  try {
    const [summary] = await db.execute(
      `SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
      FROM reviews
      WHERE product_id = ?`,
      [req.params.productId]
    );

    res.json({ summary: summary[0] || null });
  } catch (error) {
    console.error('Get review summary error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create review
router.post('/',
  authenticateToken,
  [
    body('product_id').isInt().withMessage('Product ID required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { product_id, rating, comment, order_id } = req.body;

      // Check if product exists
      const [products] = await db.execute(
        'SELECT id, user_id FROM products WHERE id = ?',
        [product_id]
      );

      if (products.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Check if user already reviewed this product
      const [existing] = await db.execute(
        'SELECT id FROM reviews WHERE user_id = ? AND product_id = ?',
        [req.user.id, product_id]
      );

      if (existing.length > 0) {
        return res.status(400).json({ error: 'You have already reviewed this product' });
      }

      // Create review
      await db.execute(
        `INSERT INTO reviews (product_id, user_id, order_id, rating, comment)
        VALUES (?, ?, ?, ?, ?)`,
        [product_id, req.user.id, order_id || null, rating, comment || null]
      );

      res.status(201).json({ message: 'Review created successfully' });
    } catch (error) {
      console.error('Create review error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Update review
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Check ownership
    const [reviews] = await db.execute(
      'SELECT * FROM reviews WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (reviews.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const updates = [];
    const params = [];

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }
      updates.push('rating = ?');
      params.push(rating);
    }

    if (comment !== undefined) {
      updates.push('comment = ?');
      params.push(comment);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(req.params.id);

    await db.execute(
      `UPDATE reviews SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`,
      params
    );

    res.json({ message: 'Review updated successfully' });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete review
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await db.execute(
      'DELETE FROM reviews WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;




