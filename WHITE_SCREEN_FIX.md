# Fix White Screen Issue

## Quick Fixes

### 1. Check Browser Console
Press **F12** in your browser and check the **Console** tab for errors. Share the error message.

### 2. Clear Browser Cache
- Press **Ctrl + Shift + Delete**
- Clear cache and cookies
- Reload the page

### 3. Restart Dev Server
```bash
# Stop the server (Ctrl+C)
# Then restart:
cd client
npm run dev
```

### 4. Check Terminal for Errors
Look at the terminal where `npm run dev` is running. Are there any error messages?

### 5. Verify Dependencies
Make sure all packages are installed:
```bash
cd client
npm install
```

## Common Causes

### Missing Dependencies
If you see import errors, install missing packages:
```bash
cd client
npm install i18next react-i18next i18next-browser-languagedetector
```

### JSON Import Issues
Vite should handle JSON imports automatically. If not, check `vite.config.js`.

### Component Errors
The ErrorBoundary I added will show error details if a component crashes.

## Debug Steps

1. **Open Browser Console (F12)**
2. **Check for red error messages**
3. **Look for:**
   - "Failed to resolve import"
   - "Cannot read property"
   - "is not defined"
   - Any other error messages

4. **Share the error message** and I can help fix it

## Test if Basic React Works

Try accessing: http://localhost:5173

If you see the ErrorBoundary error page, it means React is working but there's a component error. The error details will be shown on that page.

## Still White Screen?

1. Check if backend is running (port 5000)
2. Check browser console for errors
3. Check terminal for build errors
4. Try a hard refresh: **Ctrl + F5**




