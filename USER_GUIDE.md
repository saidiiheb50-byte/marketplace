# User Guide - Registration & Posting Items

## ✅ Complete User Flow

### 1. Register a New Account

1. Go to **http://localhost:3000**
2. Click **"Sign Up"** in the navbar
3. Fill in the registration form:
   - **Full Name**: Your name
   - **Email**: Your email address
   - **Phone Number** (Optional): Your phone number
   - **Password**: At least 6 characters
   - **Confirm Password**: Must match password
4. Click **"Create account"**
5. You will be automatically logged in and redirected to your **Dashboard**

### 2. Post Your First Item

After registration, you'll be on your Dashboard:

1. Click **"List New Item"** button (top right)
2. Fill in the product form:
   - **Title**: Name of your item (e.g., "iPhone 12 Pro Max")
   - **Description**: Detailed description
   - **Price (TND)**: Price in Tunisian Dinar
   - **Category**: Select a category
   - **Condition**: New, Like New, Good, Fair, or Poor
   - **Stock Quantity**: How many items you have
   - **Images**: Add image URLs (one at a time)
3. Click **"Create Listing"**
4. Your item will be created and you'll return to Dashboard
5. Your item will now appear in:
   - Your Dashboard (under "My Products")
   - The Products page (visible to all customers)
   - Home page (in "Latest Items")

### 3. Manage Your Items

From your Dashboard:
- **View**: Click on any product card to see details
- **Edit**: Click the edit icon (pencil) to modify
- **Delete**: Click the delete icon (trash) to remove
- **Status**: See if your item is "active" (visible to customers)

### 4. View Your Items as Customers See Them

1. Go to **"Browse"** in the navbar
2. Your items will appear in the product list
3. Customers can:
   - View your items
   - Add them to cart
   - Message you
   - Add to wishlist

## 🔧 Troubleshooting

### Registration Issues

**"Email already registered"**
- This email is already in use
- Try logging in instead, or use a different email

**"Password must be at least 6 characters"**
- Make sure your password is 6+ characters

**Registration fails silently**
- Check browser console (F12) for errors
- Make sure backend server is running on port 5000
- Check database connection

### Posting Items Issues

**"Error creating product"**
- Make sure all required fields are filled
- Check that price is a valid number
- Verify category is selected
- Ensure you're logged in

**Product doesn't appear**
- Check Dashboard to see if it was created
- Verify product status is "active"
- Refresh the Products page

### Dashboard Issues

**"No products" message**
- This is normal if you haven't posted anything yet
- Click "Create Your First Listing" to get started

**Can't see my products**
- Make sure you're logged in
- Check that products have "active" status
- Refresh the page

## 📋 Quick Checklist

Before posting items, make sure:
- ✅ You're registered and logged in
- ✅ Backend server is running (port 5000)
- ✅ Database is connected
- ✅ You have image URLs ready (or use placeholder images)

## 🎯 Example Product Posting

**Title**: iPhone 12 Pro Max 256GB
**Description**: Excellent condition iPhone 12 Pro Max, 256GB storage. Used for 1 year, no scratches, all accessories included.
**Price**: 2500 TND
**Category**: Electronics
**Condition**: Like New
**Stock**: 1
**Images**: 
- https://example.com/iphone1.jpg
- https://example.com/iphone2.jpg

## 💡 Tips

1. **Good Images**: Use clear, high-quality images
2. **Detailed Descriptions**: More details = more interest
3. **Fair Pricing**: Research similar items
4. **Quick Response**: Respond to customer messages quickly
5. **Update Stock**: Keep stock quantity accurate

## 🔐 Security Notes

- Your password is encrypted (never stored in plain text)
- Only you can edit/delete your own products
- Your email is required but won't be shown publicly
- Phone number is optional but helps customers contact you



