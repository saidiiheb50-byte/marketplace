import express from 'express';
import { body, validationResult, query } from 'express-validator';
import { db } from '../index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all products with filters
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort = 'newest', limit = 50, offset = 0 } = req.query;
    
    let sql = `
      SELECT 
        p.*,
        c.name as category_name,
        u.name as seller_name,
        u.phone as seller_phone
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.status = 'active'
    `;
    const params = [];

    if (category) {
      sql += ' AND p.category_id = ?';
      params.push(category);
    }

    if (search) {
      sql += ' AND (p.title LIKE ? OR p.description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (minPrice) {
      sql += ' AND p.price >= ?';
      params.push(minPrice);
    }

    if (maxPrice) {
      sql += ' AND p.price <= ?';
      params.push(maxPrice);
    }

    // Add sorting
    let orderBy = 'p.created_at DESC';
    switch (sort) {
      case 'oldest':
        orderBy = 'p.created_at ASC';
        break;
      case 'price_low':
        orderBy = 'p.price ASC';
        break;
      case 'price_high':
        orderBy = 'p.price DESC';
        break;
      default:
        orderBy = 'p.created_at DESC';
    }

    sql += ` ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const [products] = await db.execute(sql, params);

    res.json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const [products] = await db.execute(
      `SELECT 
        p.*,
        c.name as category_name,
        u.name as seller_name,
        u.email as seller_email,
        u.phone as seller_phone
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = ? AND p.status = 'active'`,
      [req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product: products[0] });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create product
router.post('/',
  authenticateToken,
  [
    body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
    body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price required'),
    body('category_id').isInt().withMessage('Category required'),
    body('condition').optional().isIn(['new', 'like_new', 'good', 'fair', 'poor']),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if user is a seller with paid status
      const [users] = await db.execute(
        'SELECT user_type, seller_payment_status FROM users WHERE id = ?',
        [req.user.id]
      );

      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = users[0];
      if (user.user_type !== 'seller' || user.seller_payment_status !== 'paid') {
        return res.status(403).json({ 
          error: 'Only verified sellers can create listings. Please complete your seller payment.' 
        });
      }

      const { title, description, price, category_id, condition = 'good', images, stock_quantity = 1 } = req.body;

      const [result] = await db.execute(
        `INSERT INTO products 
        (user_id, title, description, price, category_id, \`condition\`, images, location, status, stock_quantity, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, NOW())`,
        [
          req.user.id,
          title,
          description,
          price,
          category_id,
          condition,
          JSON.stringify(images || []),
          'Béja, Tunisia',
          stock_quantity || 1
        ]
      );

      const [products] = await db.execute(
        'SELECT * FROM products WHERE id = ?',
        [result.insertId]
      );

      res.status(201).json({
        message: 'Product created successfully',
        product: products[0]
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Update product
router.put('/:id',
  authenticateToken,
  [
    body('title').optional().trim().isLength({ min: 3 }),
    body('description').optional().trim().isLength({ min: 10 }),
    body('price').optional().isFloat({ min: 0 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check ownership
      const [products] = await db.execute(
        'SELECT user_id FROM products WHERE id = ?',
        [req.params.id]
      );

      if (products.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      if (products[0].user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to update this product' });
      }

      const updates = [];
      const params = [];

      if (req.body.title) {
        updates.push('title = ?');
        params.push(req.body.title);
      }
      if (req.body.description) {
        updates.push('description = ?');
        params.push(req.body.description);
      }
      if (req.body.price !== undefined) {
        updates.push('price = ?');
        params.push(req.body.price);
      }
      if (req.body.category_id) {
        updates.push('category_id = ?');
        params.push(req.body.category_id);
      }
      if (req.body.condition) {
        updates.push('`condition` = ?');
        params.push(req.body.condition);
      }
      if (req.body.images) {
        updates.push('images = ?');
        params.push(JSON.stringify(req.body.images));
      }
      if (req.body.stock_quantity !== undefined) {
        updates.push('stock_quantity = ?');
        params.push(req.body.stock_quantity);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      params.push(req.params.id);

      await db.execute(
        `UPDATE products SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`,
        params
      );

      const [updatedProducts] = await db.execute(
        'SELECT * FROM products WHERE id = ?',
        [req.params.id]
      );

      res.json({
        message: 'Product updated successfully',
        product: updatedProducts[0]
      });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Delete product
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Check ownership
    const [products] = await db.execute(
      'SELECT user_id FROM products WHERE id = ?',
      [req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (products[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this product' });
    }

    await db.execute(
      'UPDATE products SET status = ? WHERE id = ?',
      ['deleted', req.params.id]
    );

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's products
router.get('/user/my-products', authenticateToken, async (req, res) => {
  try {
    const [products] = await db.execute(
      `SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.user_id = ? AND p.status != 'deleted'
      ORDER BY p.created_at DESC`,
      [req.user.id]
    );

    res.json({ products });
  } catch (error) {
    console.error('Get user products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

