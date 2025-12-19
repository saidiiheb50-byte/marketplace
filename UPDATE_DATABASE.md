# Update Database for New Theme & Category Images

## Step 1: Run the Update Script

The update script will automatically:
- Add the `image_url` column if it doesn't exist
- Insert/update all categories with images

## Step 2: Update or Insert Categories

Run the update script:

```bash
mysql -u root -p beja_marketplace < server/database/update_categories.sql
```

Or manually run the SQL from `server/database/update_categories.sql`

## Step 3: Verify

Check that categories have images:

```sql
SELECT id, name, image_url FROM categories;
```

## New Categories Added

1. **Smartphones** - Mobile phones and accessories
2. **Computers & Laptops** - PCs, laptops, tablets
3. **Electronics** - TVs, cameras, audio
4. **Vehicles** - Cars, motorcycles, bicycles
5. **Home & Furniture** - Furniture and decor
6. **Clothes & Fashion** - Clothing and accessories
7. **Sports & Fitness** - Sports equipment
8. **Books & Education** - Books and educational materials
9. **Toys & Games** - Toys and games
10. **Appliances** - Home appliances
11. **Beauty & Personal Care** - Cosmetics and personal care
12. **Others** - Other items

All categories now have beautiful images from Unsplash!

