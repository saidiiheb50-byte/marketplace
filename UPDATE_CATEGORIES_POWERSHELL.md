# Update Categories in PowerShell

## Method 1: Using Get-Content (Recommended)

```powershell
# Read the SQL file and execute it
$sql = Get-Content -Path "server\database\update_categories.sql" -Raw
mysql -u root -p beja_marketplace -e $sql
```

## Method 2: Direct MySQL Command

```powershell
# Enter MySQL password when prompted
mysql -u root -p beja_marketplace -e "ALTER TABLE categories ADD COLUMN image_url VARCHAR(500) AFTER icon;"
```

## Method 3: Using MySQL Command Line

1. Open MySQL command line:
```powershell
mysql -u root -p
```

2. Then run:
```sql
USE beja_marketplace;

-- Add column if needed
ALTER TABLE categories ADD COLUMN image_url VARCHAR(500) AFTER icon;

-- Update/Insert categories
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
```




