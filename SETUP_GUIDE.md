# ShuddhEats Setup & Troubleshooting Guide

## Issues Fixed ✅

### 1. **404 Error - Inventory Page Missing**
   - **Issue:** Admin page linked to `/admin/inventory` but page didn't exist
   - **Solution:** Created `frontend/app/admin/inventory/page.tsx`
   - **Features:** View/edit product stock levels, low stock alerts, inventory statistics

### 2. **401 Error - API Authentication**
   - **Issue:** "401 Unauthorized" errors when calling backend APIs
   - **Cause:** Missing valid JWT token or backend not running
   - **How Frontend Handles It:**
     - Removes invalid tokens from localStorage
     - Falls back to mock data automatically
     - Redirects to login for protected pages
   - **Solution:** Run backend and authenticate properly (see below)

### 3. **Missing Backend Endpoints**
   - **Added:** DELETE endpoint for inventory products
   - **Added:** GET endpoint for admin products list
   - **Fixed:** PATCH vs PUT inconsistency for inventory updates

---

## How to Run the Application

### 1. **Start Backend Server**
```bash
cd backend
npm install          # Install dependencies if not done
npm start           # Starts server on http://localhost:5000
```

Make sure MongoDB is running locally or configured in `.env`:
```
MONGO_URI=mongodb://localhost:27017/shuddheats
PORT=5000
JWT_SECRET=your_secret_key
```

### 2. **Start Frontend**
```bash
cd frontend
npm install          # Install dependencies if not done
npm run dev         # Starts dev server on http://localhost:3000
```

### 3. **API Health Check**
Visit: `http://localhost:5000/api/health`

Expected response:
```json
{
  "status": "OK",
  "message": "ShuddhEats API is running"
}
```

---

## Why You See 401 Errors

The 401 (Unauthorized) error is **normal** and happens when:
- API is called without valid JWT token
- User hasn't logged in yet
- Token has expired
- Backend isn't running

**The frontend handles this gracefully:**
- Uses mock data as fallback
- Protected routes redirect to login
- Invalid tokens are automatically removed

---

## Admin Authentication Flow

1. **Login First**
   - Go to `/auth/login`
   - Use admin credentials (or create admin user)
   - JWT token saved to localStorage as `shuddheats_token`

2. **Access Admin Pages**
   - `/admin` - Dashboard
   - `/admin/products` - Manage products
   - `/admin/orders` - Manage orders
   - `/admin/inventory` - Manage stock

3. **Auto Protection**
   - All admin endpoints check `Authorization: Bearer <token>` header
   - Invalid tokens trigger 401 error (expected)
   - Invalid tokens are automatically removed and user is logged out

---

## Inventory Page Features

**Location:** `/admin/inventory`

**Features:**
- View all products with current stock levels
- Edit stock quantities inline
- Low stock alerts (shows items below min level)
- Summary statistics:
  - Total products
  - Total stock count
  - Low stock items count
  - Average stock level
- Responsive design with animations

**API Endpoints Used:**
- `GET /api/admin/inventory` - Fetch all products
- `PATCH /api/admin/inventory/:id` - Update stock
- `DELETE /api/admin/inventory/:id` - Delete product

---

## Troubleshooting

### Backend Not Running
```
Error: connect ECONNREFUSED 127.0.0.1:5000
```
**Fix:** Start backend server with `npm start` in the backend directory

### MongoDB Connection Error
```
Error: MongoDB connection error: connect ECONNREFUSED
```
**Fix:**
- Install MongoDB locally, OR
- Update `MONGO_URI` in backend `.env` to point to MongoDB Atlas

### 401 Errors Keep Appearing
```
Error: status 401 (Unauthorized)
```
**This is normal!** The frontend automatically handles it:
- Mock data is shown instead
- You can still see the app
- Log in to admin to use real API

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Fix:** Kill process on port 5000:
```bash
# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux
lsof -i :5000
kill -9 <PID>
```

---

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/shuddheats
PORT=5000
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Testing the Inventory Page

1. Start both servers (backend + frontend)
2. Go to "http://localhost:3000/admin/inventory"
3. Should redirect to login if not authenticated
4. After login, should show mock inventory data

---

## Recent Improvements

✅ Added founder info (Rohini Pillai, Joshua Mathew)
✅ Added contact details across pages
✅ Added smooth animations throughout
✅ Created inventory management page
✅ Added product image directory structure
✅ Fixed all API endpoint inconsistencies
✅ Improved error handling for authentication
