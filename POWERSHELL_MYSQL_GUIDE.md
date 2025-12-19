# PowerShell - Update Categories with Images

## Option 1: Using phpMyAdmin (Easiest)

1. Open phpMyAdmin in your browser
2. Select database: `beja_marketplace`
3. Go to SQL tab
4. Copy and paste the content from `server/database/update_categories.sql`
5. Click "Go"

## Option 2: MySQL Command Line (if MySQL is installed)

### Find MySQL Path
```powershell
# Check if MySQL is installed
Get-Command mysql -ErrorAction SilentlyContinue
```

### If MySQL is in Program Files:
```powershell
# Use full path
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p beja_marketplace -e "ALTER TABLE categories ADD COLUMN image_url VARCHAR(500) AFTER icon;"
```

### Or add MySQL to PATH temporarily:
```powershell
$env:Path += ";C:\Program Files\MySQL\MySQL Server 8.0\bin"
Get-Content server\database\update_categories.sql | mysql -u root -p beja_marketplace
```

## Option 3: Direct SQL Commands

Open MySQL command line or phpMyAdmin and run:

```sql
USE beja_marketplace;

-- Add column
ALTER TABLE categories ADD COLUMN image_url VARCHAR(500) AFTER icon;

-- Insert/Update categories with images
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

## Quick Check

After running, verify it worked:

```sql
SELECT id, name, image_url FROM categories LIMIT 5;
```

You should see the image URLs in the results!



