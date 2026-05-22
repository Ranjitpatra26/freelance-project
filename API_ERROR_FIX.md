# API Error Fix - 500 /auth/login

## Problem
The backend was returning a 500 error on login because the `JWT_SECRET` environment variable was not set.

## Root Cause
- The backend's `.env` file did not exist
- The `JWT_SECRET` is required to sign and verify JWT tokens
- Without it, all authentication endpoints fail with "secretOrPrivateKey must have a value"

## Solution Applied

### 1. Created Backend `.env` File
Created `/backend/.env` with:
```
PORT=5001
MONGO_URI=mongodb://localhost:27017/shuddheats
JWT_SECRET=shuddheats_super_secret_jwt_key_2024
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
```

### 2. Created Frontend `.env.local` File
Created `/frontend/.env.local` with:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
NEXT_PUBLIC_API_URL=/api
```

### 3. Updated Server Port
- Changed backend from port 5000 → 5001 (to avoid conflicts)
- Frontend now proxies `/api` requests to `http://localhost:5001`

## MongoDB Connection
⚠️ **IMPORTANT**: The backend needs MongoDB to be running.

### Option A: Use Local MongoDB (Recommended for Development)
1. Install MongoDB Community Edition
2. Start MongoDB service:
   - **Windows**: `mongod` from MongoDB installation folder
   - **Mac**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`
3. Default connection: `mongodb://localhost:27017/shuddheats`

### Option B: Use MongoDB Atlas (Your Setup)
If you want to use MongoDB Atlas:
1. Get your connection string from MongoDB Atlas dashboard
2. Update `MONGO_URI` in `/backend/.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/shuddheats?retryWrites=true&w=majority
   ```
3. Make sure your IP is whitelisted in MongoDB Atlas
4. Restart the backend server

## How to Start the Application

### Terminal 1 - Backend
```bash
cd backend
npm start
```
Expected output:
```
✅ MongoDB Connected
🚀 ShuddhEats Server running on:
   - Local: http://localhost:5001
   - Network: http://192.168.0.104:5001
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Expected output:
```
▲ Next.js running on:
- Local: http://localhost:3001
- Network: http://192.168.0.104:3001
```

## Test Login
Visit `http://localhost:3001/auth/login` and try:
- **Email**: `admin@shuddheats.com` or `user@shuddheats.com`
- **Password**: `admin123` or `user1234`

## Multi-Item Add to Cart (New Feature)
✅ Now you can add multiple items before checking out:
1. Click "Add to Cart" on any product
2. Select size, packaging, and quantity
3. Click "Add Item to List"
4. Repeat for more items (optional)
5. Click "Add All to Cart"
6. View cart and click "Proceed to Checkout"
