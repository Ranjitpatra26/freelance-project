# ShuddhEats - Premium Healthy Snacks E-Commerce Platform

ShuddhEats is a premium, modern e-commerce web application designed for selling high-quality, organic, air-popped, and wood-pressed snacks (such as flavored makhanas, air-fried chips, and zero-sugar millet cookies). It features a state-of-the-art UI/UX aesthetic, fully interactive micro-interactions, robust authentication, and seamless order management integrations.

---

## ✨ Features & UX Highlights

*   **Premium Glassmorphic Navigation**: A clean, white, responsive navbar with zero layout shifts on transitions, featuring a custom rotating neon active tab indicator (conic gradient) and custom-processed transparent logo brand assets.
*   **Dynamic Banner Carousels**: Educational components like the Ingredient Education slide-out panel, Fun Facts Slider, and interactive Dual Scroll Banners.
*   **Fully Equipped Cart & Checkout**: Slide-out cart drawer with live state updates, responsive product size options modal, and a clean checkout layout.
*   **Secure Authentication**: Comprehensive user registration, secure login, personal user dashboards, and 2FA settings.
*   **Administrative Dashboard**: Dedicated controls for inventory, orders, settings, and product lists.

---

## 🛠️ Technology Stack

*   **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide React icons.
*   **Backend**: Node.js, Express.js, MongoDB database.
*   **Payment & Shipping Integrations**: Razorpay checkout payments, Shiprocket order shipping APIs.

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your system.

### Prerequisites
*   Node.js (v18 or higher recommended)
*   MongoDB local instance or Atlas URI

---

### 1. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your variables:
   ```bash
   cp .env.example .env
   ```
   *Note: Set your `MONGO_URI`, `JWT_SECRET`, and payment keys.*
4. (Optional) Run the seed script to populate products:
   ```bash
   npm run seed
   ```
5. Start the backend server:
   ```bash
   npm start
   ```
   *(Running by default on `http://localhost:5000`)*

---

### 2. Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.local.example` or create `.env.local` to point to the backend API:
   ```bash
   # Add this line to frontend/.env.local:
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
   *(Running by default on `http://localhost:3000`)*

---

## 📂 Project Structure

```
├── backend/                  # Node.js + Express API Backend
│   ├── models/               # MongoDB Database Models
│   ├── routes/               # Express API Endpoint Routes
│   ├── services/             # Integrations (Shiprocket/Razorpay)
│   └── server.js             # Main server entrypoint
├── frontend/                 # Next.js Frontend
│   ├── app/                  # Next.js App Router Pages
│   ├── components/           # Reusable UI Components (Navbar, CartDrawer, etc.)
│   ├── context/              # Context Providers (Cart, Auth)
│   └── public/               # Static assets & images
```

---

## 📄 License
This project is proprietary and built for freelance client delivery. All rights reserved.
