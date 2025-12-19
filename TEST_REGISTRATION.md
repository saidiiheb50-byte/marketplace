# Test Registration & Dashboard Flow

## Quick Test Steps

### 1. Start Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Wait for: `✅ Database connected successfully` and `🚀 Server running on http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Wait for: `Local: http://localhost:3000`

### 2. Test Registration

1. Open browser: **http://localhost:3000**
2. Click **"Sign Up"** button
3. Fill form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm: `password123`
4. Click **"Create account"**
5. ✅ Should redirect to Dashboard
6. ✅ Should see "Welcome back, Test User!"

### 3. Test Posting an Item

1. On Dashboard, click **"List New Item"**
2. Fill form:
   - Title: `Test Product`
   - Description: `This is a test product description`
   - Price: `100`
   - Category: Select any category
   - Condition: `Good`
   - Stock: `1`
3. Click **"Create Listing"**
4. ✅ Should redirect back to Dashboard
5. ✅ Should see "Test Product" in your products list

### 4. Verify Item is Public

1. Click **"Browse"** in navbar
2. ✅ Should see "Test Product" in the products list
3. Click on it
4. ✅ Should see product details page

## Expected Behavior

### Registration
- ✅ Creates user account in database
- ✅ Logs user in automatically
- ✅ Saves token to localStorage
- ✅ Redirects to /dashboard
- ✅ Shows success message

### Dashboard
- ✅ Shows user's name
- ✅ Shows "List New Item" button
- ✅ Shows empty state if no products
- ✅ Shows products grid if products exist
- ✅ Each product shows: image, title, price, status, edit/delete buttons

### Create Product
- ✅ Requires authentication (redirects to login if not logged in)
- ✅ Creates product in database
- ✅ Links product to current user
- ✅ Sets status to "active" by default
- ✅ Redirects to dashboard after creation
- ✅ Product appears in dashboard immediately

### Product Visibility
- ✅ Active products appear in /products page
- ✅ Active products appear in home page "Latest Items"
- ✅ Customers can view, add to cart, message seller

## Common Issues & Fixes

### Issue: "Email already registered"
**Fix**: Use a different email or delete the test user from database

### Issue: Registration succeeds but doesn't redirect
**Fix**: Check browser console for JavaScript errors

### Issue: Can't create product
**Fix**: 
- Verify you're logged in (check navbar for your name)
- Check all required fields are filled
- Check backend console for errors

### Issue: Product created but not visible
**Fix**:
- Check product status is "active"
- Refresh the products page
- Check database directly: `SELECT * FROM products WHERE user_id = YOUR_USER_ID`

## Database Verification

To verify in database:

```sql
-- Check users
SELECT * FROM users;

-- Check products
SELECT * FROM products;

-- Check user's products
SELECT * FROM products WHERE user_id = 1;
```

## Success Indicators

✅ Registration form submits without errors
✅ User redirected to dashboard
✅ Dashboard shows user's name
✅ "List New Item" button works
✅ Product creation form submits
✅ Product appears in dashboard
✅ Product appears in public products list
✅ Product detail page loads correctly



