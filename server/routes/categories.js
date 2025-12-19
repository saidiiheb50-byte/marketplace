import express from 'express';
import { db } from '../index.js';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const [categories] = await db.execute(
      'SELECT * FROM categories ORDER BY name ASC'
    );

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get category with product count
router.get('/:id', async (req, res) => {
  try {
    const [categories] = await db.execute(
      'SELECT * FROM categories WHERE id = ?',
      [req.params.id]
    );

    if (categories.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const [count] = await db.execute(
      'SELECT COUNT(*) as count FROM products WHERE category_id = ? AND status = "active"',
      [req.params.id]
    );

    res.json({
      category: categories[0],
      productCount: count[0].count
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;




