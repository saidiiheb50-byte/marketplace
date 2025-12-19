# Vercel Deployment Guide

## Fixed Issues
✅ Added `vercel.json` for proper SPA routing
✅ Updated Vite config for production builds

## Vercel Configuration Steps

### 1. Project Settings in Vercel Dashboard

1. Go to your project settings in Vercel
2. Navigate to **Settings** → **General**
3. Set the following:
   - **Root Directory**: `client` (IMPORTANT!)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 2. Environment Variables

Go to **Settings** → **Environment Variables** and add:

```
VITE_API_URL=https://your-backend-api-url.com/api
```

**Important**: Replace `https://your-backend-api-url.com/api` with your actual backend API URL. If your backend is also deployed, use that URL. If not, you'll need to deploy your backend server separately (e.g., on Railway, Render, or another hosting service).

### 3. Build Settings

The `vercel.json` file has been configured to:
- Handle SPA routing (all routes serve `index.html`)
- Set proper cache headers for static assets
- Configure the build process

### 4. Common Issues

**White Screen:**
- ✅ Fixed with `vercel.json` routing configuration
- Make sure Root Directory is set to `client`
- Check browser console for errors

**API Errors:**
- Make sure `VITE_API_URL` environment variable is set in Vercel
- Ensure your backend API is accessible from the internet
- Check CORS settings on your backend

**Build Failures:**
- Make sure all dependencies are in `package.json`
- Check that `node_modules` is in `.gitignore` (it should be)

## Quick Checklist

- [ ] Root Directory set to `client` in Vercel
- [ ] `VITE_API_URL` environment variable added
- [ ] Backend API is deployed and accessible
- [ ] CORS is configured on backend to allow your Vercel domain

