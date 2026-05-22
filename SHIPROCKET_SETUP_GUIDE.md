# Shiprocket Integration Setup Guide

## Overview
This guide explains how to set up and integrate Shiprocket for automated order fulfillment and delivery tracking in the SudhaEats platform.

## Prerequisites
- **Shiprocket Account** — Sign up at https://www.shiprocket.in/
- **Shiprocket API Credentials** — Email and password for your Shiprocket account
- **Pickup Location ID** — Created in your Shiprocket dashboard
- **Channel ID** — Your sales channel ID (usually 0 for direct orders)

## Step 1: Get Shiprocket Credentials

1. **Sign up for Shiprocket** at https://www.shiprocket.in/
2. **Complete your profile** with business details
3. **Create a Pickup Location:**
   - Go to Settings → Pickup Locations
   - Add your restaurant/warehouse address
   - Copy the **Location ID** (you'll need this)
4. **Create a Sales Channel:**
   - Go to Integrations → Add New Integration
   - Select "Custom Integration" or "API"
   - Note the **Channel ID** (usually 0)
5. **Note your credentials:**
   - Email used for Shiprocket account
   - Password for the account

## Step 2: Configure Environment Variables

Add the following variables to your `.env` file in the backend directory:

```env
# Shiprocket Configuration
SHIPROCKET_ENABLED=true
SHIPROCKET_EMAIL=your_shiprocket_email@example.com
SHIPROCKET_PASSWORD=your_shiprocket_password
SHIPROCKET_API_BASE=https://apiv2.shiprocket.in/v1/external/
SHIPROCKET_PICKUP_LOCATION_ID=1  # Replace with your actual location ID
SHIPROCKET_CHANNEL_ID=0  # Usually 0 for direct sales

# Webhook Configuration (optional)
SHIPROCKET_WEBHOOK_URL=https://yourdomain.com/api/orders/webhook/shiprocket
SHIPROCKET_WEBHOOK_SECRET=your_webhook_secret
```

### Environment Variables Explanation:

| Variable | Description | Example |
|----------|-------------|---------|
| `SHIPROCKET_ENABLED` | Enable/disable Shiprocket integration | `true` or `false` |
| `SHIPROCKET_EMAIL` | Your Shiprocket account email | `business@example.com` |
| `SHIPROCKET_PASSWORD` | Your Shiprocket account password | (keep secret) |
| `SHIPROCKET_API_BASE` | Shiprocket API endpoint | https://apiv2.shiprocket.in/v1/external/ |
| `SHIPROCKET_PICKUP_LOCATION_ID` | Your warehouse/restaurant location ID | `1` (from Shiprocket) |
| `SHIPROCKET_CHANNEL_ID` | Sales channel ID | `0` (direct sales) |
| `SHIPROCKET_WEBHOOK_URL` | URL where Shiprocket sends updates | https://yourdomain.com/api/orders/webhook/shiprocket |
| `SHIPROCKET_WEBHOOK_SECRET` | Secret for webhook validation | `random_secret_key` |

## Step 3: Verify Npm Dependencies

The backend should have `axios` installed for API calls. Verify in `backend/package.json`:

```json
{
  "dependencies": {
    "axios": "^1.13.6"
  }
}
```

If not present, install it:
```bash
cd backend
npm install axios
```

## Step 4: Configure Shiprocket Webhook (Optional but Recommended)

To receive real-time shipment updates:

1. **Log in to Shiprocket Dashboard**
2. Go to **Settings → Webhooks**
3. **Add New Webhook:**
   - **Event:** Select all shipment events (Pickup, Picked, Shipped, Out for Delivery, Delivered, etc.)
   - **Webhook URL:** `https://yourdomain.com/api/orders/webhook/shiprocket`
   - **Method:** POST
   - **Active:** Enable it

The webhook endpoint in your backend is already configured at:
```
POST /api/orders/webhook/shiprocket
```

## How the Integration Works

### 1. **Order Creation → Shipment Creation**

```
User Checkout → Payment Verification → Create Shiprocket Shipment → 
Get Tracking Number (AWB) → Store in Order → Return to User
```

When a user completes payment:
- Order marked as "Processing"
- Shiprocket shipment automatically created
- AWB (tracking number) stored in order
- User receives tracking number

### 2. **Order Status Mapping**

Shiprocket status → SudhaEats order status mapping:
- **Confirmed** → Processing
- **Processed** → Processing
- **Picked** → Shipped
- **Shipped** → Shipped
- **Out for Delivery** → Out for Delivery
- **Delivered** → Delivered
- **Cancelled/RTO/Lost** → Cancelled

### 3. **Real-time Tracking Updates**

```
Shiprocket Webhook → Update Order Status → Email/SMS Notification
```

When customer tracking is requested:
- System fetches latest tracking from Shiprocket API
- Updates order status if changed
- Returns current location, EDD, and tracking events

## API Endpoints Reference

### 1. **Create Order with Shiprocket Shipment**
```
PUT /api/orders/:id/pay
```
Called after payment verification. Automatically creates Shiprocket shipment.

**Request Body:**
```json
{
  "razorpayPaymentId": "pay_xxx",
  "razorpayOrderId": "order_xxx",
  "razorpaySignature": "sig_xxx"
}
```

**Response includes:**
```json
{
  "_id": "order_id",
  "shiprocket": {
    "shipmentId": "12345",
    "awb": "SHIP123456789",
    "carrier": "Courier Name",
    "status": "Confirmed",
    "lastUpdated": "2024-01-01T00:00:00Z"
  },
  "trackingId": "SHIP123456789",
  "status": "Processing"
}
```

### 2. **Get Shiprocket Tracking Details**
```
GET /api/orders/:id/shiprocket-tracking
```
Fetch real-time tracking information from Shiprocket.

**Response:**
```json
{
  "success": true,
  "tracking": {
    "awb": "SHIP123456789",
    "carrier": "Courier Name",
    "status": "In Transit",
    "estimatedDelivery": "2024-01-05",
    "currentLocation": "Mumbai Distribution Center",
    "isDelivered": false,
    "trackingEvents": [
      {
        "date": "2024-01-01T10:00:00Z",
        "status": "Picked",
        "location": "Warehouse"
      },
      {
        "date": "2024-01-02T15:30:00Z",
        "status": "In Transit",
        "location": "Mumbai Hub"
      }
    ]
  }
}
```

### 3. **Webhook Handler** (Shiprocket → Your Backend)
```
POST /api/orders/webhook/shiprocket
```
Automatically receives shipment updates from Shiprocket.

**Shiprocket sends:**
```json
{
  "shipment_id": 12345,
  "status": "In Transit",
  "awb": "SHIP123456789",
  "carrier_name": "Courier",
  "edd": "2024-01-05",
  "current_location": "Mumbai"
}
```

### 4. **Request Pickup** (Admin)
```
POST /api/orders/:id/request-pickup
```
Manually request pickup from Shiprocket for an order.

**Requires:** Admin authentication

**Response:**
```json
{
  "success": true,
  "message": "Pickup requested from Shiprocket",
  "data": { "pickup_request_id": 123 }
}
```

### 5. **Cancel Shipment** (Admin)
```
POST /api/orders/:id/cancel-shipment
```
Cancel a shipment on Shiprocket and update order status to Cancelled.

**Requires:** Admin authentication

## Development Workflow

### Testing Shiprocket Integration (Without Real Charges)

1. **Enable Shiprocket** in `.env`:
   ```env
   SHIPROCKET_ENABLED=true
   ```

2. **Use Shiprocket Sandbox** (if available):
   - Shiprocket provides a sandbox environment
   - Credentials: Usually different test credentials

3. **Test Order Flow:**
   ```bash
   # Create order → Verify payment → Shiprocket shipment created
   # Check order to see shipment details
   curl http://localhost:5000/api/orders/:id
   
   # Get tracking
   curl http://localhost:5000/api/orders/:id/shiprocket-tracking
   ```

### Debugging

**Check Shiprocket logs in backend:**
```
✅ Shiprocket auth token generated successfully
✅ Shipment created successfully for order {orderId}
⚠️ Failed to create Shiprocket shipment: {error message}
```

**If shipment creation fails:**
- Verify `SHIPROCKET_EMAIL` and `SHIPROCKET_PASSWORD` are correct
- Check `SHIPROCKET_PICKUP_LOCATION_ID` exists
- Ensure all shipping address fields are present
- Check Shiprocket account has active credits

## Shiprocket Service Functions

The `backend/services/shiprocketService.js` provides:

```javascript
// Create a shipment
await shiprocketService.createShipment(orderData);

// Get tracking details
await shiprocketService.getShipmentTracking(shipmentId);

// Request pickup
await shiprocketService.requestPickup(shipmentId);

// Cancel shipment
await shiprocketService.cancelShipment(shipmentId);

// Generate manifesto (batch pickup) 
await shiprocketService.generateManifesto([shipmentIds]);

// Map Shiprocket status to order status
const orderStatus = shiprocketService.mapShiprocketStatusToOrderStatus(shiprocketStatus);
```

## Frontend Integration

### Tracking Page Display

Update the frontend tracking page to show Shiprocket tracking details:

```typescript
// Fetch tracking from backend
const response = await axios.get(`/api/orders/${orderId}/shiprocket-tracking`);
const { tracking } = response.data;

// Display:
// - AWB/Tracking Number: {tracking.awb}
// - Carrier: {tracking.carrier}
// - Current Status: {tracking.status}
// - Current Location: {tracking.currentLocation}
// - Estimated Delivery: {tracking.estimatedDelivery}
// - Tracking Events Timeline: {tracking.trackingEvents}
```

### Manual Tracking Refresh

Add a "Refresh Tracking" button to manually fetch latest updates:

```typescript
const refreshTracking = async () => {
  const response = await axios.get(`/api/orders/${orderId}/shiprocket-tracking`);
  // Update UI with latest tracking
};
```

## Production Deployment

### Before Going Live:

1. ✅ Test complete order flow with real Shiprocket account
2. ✅ Verify all environment variables are set correctly
3. ✅ Set up Shiprocket webhook for real-time updates
4. ✅ Configure pickup location and verify address format
5. ✅ Test with multiple courier options
6. ✅ Ensure proper error handling if Shiprocket API is down
7. ✅ Monitor webhook delivery success rate
8. ✅ Add SMS/Email notifications with tracking numbers

### Security Considerations:

- **Never commit** `.env` file with Shiprocket credentials
- **Use environment variables** in production
- **Validate webhook requests** with secret key
- **Log sensitive operations** (but not passwords)
- **Rate limit/throttle** webhook endpoints
- **Encrypt** stored tracking data if needed

## Troubleshooting

### Common Issues

**1. "Failed to authenticate with Shiprocket"**
- ❌ Wrong email/password in `.env`
- ✅ Verify Shiprocket login works manually
- ✅ Check credentials are exact match

**2. "Invalid pickup location"**
- ❌ `SHIPROCKET_PICKUP_LOCATION_ID` doesn't exist
- ✅ Get correct ID from Shiprocket dashboard Settings → Pickup Locations

**3. "Webhook not being received"**
- ❌ Webhook URL not publicly accessible
- ✅ Use ngrok for local testing: `ngrok http 5000`
- ✅ Update webhook URL in Shiprocket with ngrok URL

**4. "Shipment shows wrong address"**
- ❌ Missing address fields
- ✅ Ensure `pincode` is exactly 6 digits
- ✅ State should be valid Indian state code

**5. "Token expired error"**
- Service automatically refreshes token every 20 hours
- If issue persists, restart backend

## Support Resources

- **Shiprocket Documentation:** https://www.shiprocket.in/api-docs/
- **Shiprocket Support:** support@shiprocket.in
- **Your Backend Logs:** Check console for error messages

## Next Steps

1. ✅ Set up Shiprocket account with credentials
2. ✅ Configure `.env` file with variables
3. ✅ Test order → shipment → tracking flow
4. ✅ Deploy webhook handler
5. ✅ Update frontend tracking page
6. ✅ Go live with real shipments

---

**Last Updated:** January 2024
**Shiprocket API Version:** v2
