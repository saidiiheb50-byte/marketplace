import express from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get conversations (list of users you've messaged or received messages from)
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const [conversations] = await db.execute(
      `SELECT DISTINCT
        CASE 
          WHEN sender_id = ? THEN receiver_id
          ELSE sender_id
        END as other_user_id,
        u.name as other_user_name,
        u.email as other_user_email,
        m.message as last_message,
        m.created_at as last_message_time,
        m.read_status,
        p.id as product_id,
        p.title as product_title,
        p.images as product_images
      FROM messages m
      JOIN users u ON (
        CASE 
          WHEN m.sender_id = ? THEN m.receiver_id
          ELSE m.sender_id
        END = u.id
      )
      LEFT JOIN products p ON m.product_id = p.id
      WHERE m.sender_id = ? OR m.receiver_id = ?
      ORDER BY m.created_at DESC`,
      [req.user.id, req.user.id, req.user.id, req.user.id]
    );

    // Group by other_user_id and get latest message
    const conversationMap = new Map();
    conversations.forEach(conv => {
      const key = conv.other_user_id;
      if (!conversationMap.has(key) || 
          new Date(conv.last_message_time) > new Date(conversationMap.get(key).last_message_time)) {
        conversationMap.set(key, {
          ...conv,
          product_images: conv.product_images ? JSON.parse(conv.product_images) : []
        });
      }
    });

    res.json({ conversations: Array.from(conversationMap.values()) });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get messages with a specific user
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    // Verify user exists
    const [users] = await db.execute('SELECT id, name FROM users WHERE id = ?', [otherUserId]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get messages
    const [messages] = await db.execute(
      `SELECT 
        m.*,
        p.title as product_title,
        p.images as product_images
      FROM messages m
      LEFT JOIN products p ON m.product_id = p.id
      WHERE (m.sender_id = ? AND m.receiver_id = ?) 
         OR (m.sender_id = ? AND m.receiver_id = ?)
      ORDER BY m.created_at ASC`,
      [req.user.id, otherUserId, otherUserId, req.user.id]
    );

    // Mark messages as read
    await db.execute(
      'UPDATE messages SET read_status = TRUE WHERE sender_id = ? AND receiver_id = ?',
      [otherUserId, req.user.id]
    );

    const formattedMessages = messages.map(msg => ({
      ...msg,
      product_images: msg.product_images ? JSON.parse(msg.product_images) : []
    }));

    res.json({ 
      messages: formattedMessages,
      otherUser: users[0]
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send message
router.post('/',
  authenticateToken,
  [
    body('receiver_id').isInt().withMessage('Receiver ID required'),
    body('message').trim().notEmpty().withMessage('Message cannot be empty'),
    body('product_id').optional().isInt(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { receiver_id, message, product_id } = req.body;

      if (receiver_id === req.user.id) {
        return res.status(400).json({ error: 'Cannot send message to yourself' });
      }

      // Verify receiver exists
      const [users] = await db.execute('SELECT id FROM users WHERE id = ?', [receiver_id]);
      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify product exists if provided
      if (product_id) {
        const [products] = await db.execute('SELECT id FROM products WHERE id = ?', [product_id]);
        if (products.length === 0) {
          return res.status(404).json({ error: 'Product not found' });
        }
      }

      await db.execute(
        `INSERT INTO messages (sender_id, receiver_id, product_id, message)
        VALUES (?, ?, ?, ?)`,
        [req.user.id, receiver_id, product_id || null, message]
      );

      res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Get unread message count
router.get('/unread/count', authenticateToken, async (req, res) => {
  try {
    const [result] = await db.execute(
      'SELECT COUNT(*) as count FROM messages WHERE receiver_id = ? AND read_status = FALSE',
      [req.user.id]
    );

    res.json({ count: result[0].count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;



