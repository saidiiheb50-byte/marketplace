# Vercel Deployment Guide

## Fixed Issues
✅ Added `vercel.json` for proper SPA routing
✅ Updated Vite config for production builds

## ⚠️ Before You Start
**You need a deployed backend API first!** If you haven't deployed your backend yet, see `BACKEND_DEPLOYMENT.md` for instructions.

## Vercel Configuration Steps

### 1. Project Settings in Vercel Dashboard

1. Go to your project settings in Vercel
2. Navigate to **Settings** → **General**
3. Set the following:
   - **Root Directory**: `client` (IMPORTANT!)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 2. Environment Variables (CRITICAL - This fixes the "Network error" message!)

Go to **Settings** → **Environment Variables** and add:

**Name:** `VITE_API_URL`  
**Value:** `https://your-backend-api-url.com/api`

**Important**: 
- Replace `https://your-backend-api-url.com/api` with your actual backend API URL
- **This is REQUIRED** - without it, the app will try to connect to `localhost:5000` which doesn't exist on Vercel
- **If your backend is not deployed yet**, see `BACKEND_DEPLOYMENT.md` for step-by-step instructions
- Make sure your backend CORS settings allow requests from your Vercel domain

**Example values:**
- Railway: `https://your-app.railway.app/api`
- Render: `https://your-app.onrender.com/api`
- Heroku: `https://your-app.herokuapp.com/api`

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

**API Errors / "Network error" message:**
- ✅ **MOST COMMON FIX**: Make sure `VITE_API_URL` environment variable is set in Vercel
- The error "Network error. Please check if the server is running" means the app is trying to connect to `localhost:5000`
- Set `VITE_API_URL` to your deployed backend URL (e.g., `https://your-backend.railway.app/api`)
- Ensure your backend API is accessible from the internet
- Check CORS settings on your backend to allow your Vercel domain
- After adding the environment variable, **redeploy** your Vercel project

**Build Failures:**
- Make sure all dependencies are in `package.json`
- Check that `node_modules` is in `.gitignore` (it should be)

## Quick Checklist

- [ ] Root Directory set to `client` in Vercel
- [ ] `VITE_API_URL` environment variable added
- [ ] Backend API is deployed and accessible
- [ ] CORS is configured on backend to allow your Vercel domain


