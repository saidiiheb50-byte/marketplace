-- Update categories with images
-- Run this after the schema.sql to update existing categories

USE beja_marketplace;

-- Add image_url column if it doesn't exist (MySQL 5.7+)
SET @dbname = DATABASE();
SET @tablename = 'categories';
SET @columnname = 'image_url';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD ', @columnname, ' VARCHAR(500) AFTER icon')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- If categories don't exist, insert them
INSERT INTO categories (name, description, icon, image_url) VALUES
('Smartphones', 'Mobile phones, smartphones, and accessories', '📱', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop'),
('Computers & Laptops', 'PCs, laptops, tablets, and computer accessories', '💻', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop'),
('Electronics', 'TVs, cameras, audio equipment, and other electronics', '📺', 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=300&fit=crop'),
('Vehicles', 'Cars, motorcycles, bicycles, and transportation', '🚗', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=300&fit=crop'),
('Home & Furniture', 'Furniture, home decor, and household items', '🏠', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'),
('Clothes & Fashion', 'Clothing, shoes, bags, and fashion accessories', '👕', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop'),
('Sports & Fitness', 'Sports equipment, gym gear, and fitness items', '⚽', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'),
('Books & Education', 'Books, textbooks, and educational materials', '📚', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'),
('Toys & Games', 'Toys, games, and entertainment items', '🎮', 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop'),
('Appliances', 'Home appliances, kitchen equipment, and tools', '🔧', 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop'),
('Beauty & Personal Care', 'Cosmetics, perfumes, and personal care items', '💄', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop'),
('Others', 'Other items that don\'t fit in the above categories', '📦', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop')
ON DUPLICATE KEY UPDATE 
  image_url = VALUES(image_url),
  description = VALUES(description);

