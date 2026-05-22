# Shiprocket Integration - Quick API Reference

## 🚀 Quick Setup Checklist

- [ ] Sign up at Shiprocket (https://www.shiprocket.in/)
- [ ] Get your email and password
- [ ] Create pickup location → note Location ID
- [ ] Add environment variables to `.env`
- [ ] Test integration with real order
- [ ] Configure webhook in Shiprocket dashboard
- [ ] Update frontend tracking page

## 📋 Required Environment Variables

```env
SHIPROCKET_ENABLED=true
SHIPROCKET_EMAIL=your_email@example.com
SHIPROCKET_PASSWORD=your_password
SHIPROCKET_PICKUP_LOCATION_ID=1
SHIPROCKET_CHANNEL_ID=0
```

## 🔌 API Endpoints Added

### Production Endpoints (for integration)

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/orders/:id/pay` | PUT | User | Mark order paid + create shipment |
| `/api/orders/:id/shiprocket-tracking` | GET | None | Get real-time tracking details |
| `/api/orders/webhook/shiprocket` | POST | None | Receive Shiprocket updates |
| `/api/orders/:id/request-pickup` | POST | Admin | Manually request pickup |
| `/api/orders/:id/cancel-shipment` | POST | Admin | Cancel shipment on Shiprocket |

### Example API Calls

**1. Create/Update Order Payment (automatic shipment creation)**
```bash
curl -X PUT http://localhost:5000/api/orders/ORDER_ID/pay \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "razorpayPaymentId": "pay_xxx",
    "razorpayOrderId": "order_xxx",
    "razorpaySignature": "sig_xxx"
  }'
```

**2. Get Tracking (public, no auth required)**
```bash
curl http://localhost:5000/api/orders/ORDER_ID/shiprocket-tracking
```

**3. Request Pickup (admin only)**
```bash
curl -X POST http://localhost:5000/api/orders/ORDER_ID/request-pickup \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

**4. Cancel Shipment (admin only)**
```bash
curl -X POST http://localhost:5000/api/orders/ORDER_ID/cancel-shipment \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

## 📦 Order Model - New Shiprocket Fields

```javascript
shiprocket: {
  shipmentId: String,        // Shiprocket's shipment ID
  awb: String,               // Tracking number (Air Waybill)
  status: String,            // Confirmed, Picked, Shipped, Delivered, etc.
  carrier: String,           // Courier name (DTDC, Delhivery, etc.)
  estimatedDeliveryDate: Date,
  lastUpdated: Date,
  pickupStatus: String,      // Requested, Picked, etc.
  isPickedUp: Boolean,
  pickupDate: Date
}
```

## 🔄 Shipment Status Flow

```
Order Placed
    ↓
Payment Confirmation
    ↓
✨ SHIPROCKET SHIPMENT CREATED ✨
    ↓
Order Status: Processing
    ↓
Pickup Requested → Status: Processing
    ↓
Picked by Courier → Status: Shipped
    ↓
In Transit → Status: Shipped
    ↓
Out for Delivery → Status: Out for Delivery
    ↓
Delivered ✅ → Status: Delivered
```

## 🛠️ Service Functions

All in `backend/services/shiprocketService.js`:

```javascript
const shiprocket = require('../services/shiprocketService');

// Create shipment
await shiprocket.createShipment(orderData);

// Get tracking
await shiprocket.getShipmentTracking(shipmentId);

// Request pickup
await shiprocket.requestPickup(shipmentId);

// Cancel shipment
await shiprocket.cancelShipment(shipmentId);

// Generate manifesto (batch)
await shiprocket.generateManifesto([shipmentIds]);

// Map status
const orderStatus = shiprocket.mapShiprocketStatusToOrderStatus('Delivered');
```

## 🔐 Security Notes

- Credentials stored in `.env` (never commit)
- Token auto-refreshes every 20 hours
- Webhook validation (optional secret key)
- Only admins can request pickup/cancel
- Tracking publicly visible (not sensitive data)

## 🧪 Testing Checklist

```javascript
// 1. Test order creation with Shiprocket enabled
POST /api/orders → Order created

// 2. Complete payment
PUT /api/orders/:id/pay → Shipment created

// 3. Check order has Shiprocket data
GET /api/orders/:id → shiprocket: { shipmentId, awb, ... }

// 4. Fetch tracking
GET /api/orders/:id/shiprocket-tracking → Returns tracking details

// 5. Admin request pickup
POST /api/orders/:id/request-pickup → Pickup requested

// 6. Test webhook
POST /api/orders/webhook/shiprocket → Order updated
```

## 📊 Data Flow Diagram

```
Frontend (User)
    ↓
Complete Checkout & Payment
    ↓
PUT /api/orders/:id/pay
    ↓
Backend Order Service
    ├─ Mark order as paid
    ├─ Create Shiprocket shipment
    ├─ Store AWB in order
    └─ Return updated order
    ↓
Frontend receives tracking #
    ↓
User can track order
    ↓
GET /api/orders/:id/shiprocket-tracking
    ↓
Real-time Shiprocket data
```

## ⚠️ Error Handling

Integration has graceful fallback:
- If Shiprocket disabled: Orders created without shipment
- If shipment creation fails: Order still succeeds (manual shipment later)
- If tracking fails: Returns cached last-known status
- All Shiprocket errors logged for debugging

## 🌐 Webhook Configuration (Shiprocket Dashboard)

1. Go to Settings → Webhooks
2. Add New Webhook:
   - **Event Types:** Shipment pickup, Shipment shipped, Shipment out for delivery, Shipment delivered
   - **URL:** `https://yourdomain.com/api/orders/webhook/shiprocket`
   - **Method:** POST
   - **Active:** ✓ Enable

## 📚 File Structure

```
backend/
├── models/
│   └── Order.js (Updated with shiprocket fields)
├── routes/
│   └── orders.js (Updated with Shiprocket endpoints)
├── services/
│   └── shiprocketService.js (NEW - all Shiprocket API calls)
└── .env (Add Shiprocket variables)
```

## 🚨 Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| Auth fails | Check email/password in .env |
| Invalid pickup location | Verify location ID in Shiprocket dashboard |
| No webhook received | Use ngrok for local testing |
| Wrong address | Check 6-digit pincode format |
| Status not updating | Check webhook is configured and endpoint is public |

## 📖 Links

- **Shiprocket API Docs:** https://www.shiprocket.in/api-docs/
- **Full Setup Guide:** See `SHIPROCKET_SETUP_GUIDE.md`
- **Support:** support@shiprocket.in

---

**Version:** 1.0 | **Last Updated:** January 2024
