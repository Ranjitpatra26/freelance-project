# Logout Redirect & SMS Notifications Setup

## ✨ New Features Implemented

### 1. **Auto-Redirect to Home on Logout**

**What it does:**
- When user clicks logout, they're redirected to home page (`/`)
- Works on both desktop and mobile navigation
- Clears authentication tokens before redirecting

**Implementation:**
```tsx
// frontend/components/Navbar.tsx
const handleLogout = () => {
    logout();  // Clears tokens from localStorage
    router.push('/');  // Redirects to home
};
```

**Files Modified:**
- `frontend/components/Navbar.tsx` - Updated logout handlers

---

### 2. **SMS Notifications for Order Placement**

**What it does:**
1. User places order at checkout
2. Order is created in database with order ID
3. SMS notification is automatically sent to user's phone number
4. Message contains:
   - Order ID (for tracking)
   - Total amount (₹)
   - Number of items ordered
   - Track order URL

**Example SMS Message:**
```
ShuddhEats: Your order #657a8f3c2a1b9e has been placed!
Total: ₹549 for 2 items.
Track your order at shuddheats.co.in
```

**Files Modified:**
- `frontend/app/checkout/page.tsx` - Added SMS API call after order creation
- `backend/routes/orders.js` - Added SMS notification endpoint

---

## SMS Setup Guide

### Current Status
SMS endpoint is fully implemented and ready for integration. Currently:
- ✅ Endpoint created at `POST /api/orders/send-sms`
- ✅ Logs SMS to backend console
- ⏳ Ready for real provider (Twilio, AWS SNS, etc.)

### How to Enable Real SMS (Twilio)

#### Step 1: Create Twilio Account
1. Go to https://www.twilio.com/
2. Sign up for free account
3. Get your `ACCOUNT_SID` and `AUTH_TOKEN` from dashboard
4. Get a Twilio phone number (for sending SMS)

#### Step 2: Install Twilio
```bash
cd backend
npm install twilio
```

#### Step 3: Add to Backend `.env`
```
TWILIO_ACCOUNT_SID=ACyour_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+15551234567
```

#### Step 4: Enable in Backend
Edit `backend/routes/orders.js` and uncomment the Twilio code:

```javascript
// @POST /api/orders/send-sms
router.post('/send-sms', async (req, res) => {
    try {
        const { phone, orderId, totalPrice, itemCount } = req.body;

        if (!phone || phone.length < 10) {
            return res.status(400).json({ message: 'Valid phone number required' });
        }

        const message = `ShuddhEats: Your order #${orderId} has been placed! Total: ₹${totalPrice} for ${itemCount} items. Track your order at shuddheats.co.in`;

        // UNCOMMENT THIS SECTION TO ENABLE TWILIO:
        const twilio = require('twilio');
        const client = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );

        await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `+91${phone}`  // Adds India country code
        });

        res.json({
            success: true,
            message: 'SMS sent successfully',
            phone: phone.slice(-4)  // Return only last 4 digits
        });
    } catch (err) {
        console.error('SMS Error:', err.message);
        // Don't fail the order if SMS fails
        res.json({ success: true, message: 'Order placed (SMS service unavailable)' });
    }
});
```

#### Step 5: Test It
1. Place an order at checkout
2. Enter your actual phone number
3. You should receive SMS within seconds
4. Check both system logs and your phone

---

## API Endpoints

### SMS Notification Endpoint
```
POST /api/orders/send-sms
```

**Request:**
```json
{
  "phone": "9876543210",
  "orderId": "657a8f3c2a1b9e",
  "totalPrice": 549,
  "itemCount": 2
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "SMS notification queued",
  "phone": "3210"
}
```

**Response (No SMS Provider):**
```json
{
  "success": true,
  "message": "Order placed (SMS integration pending)"
}
```

---

## Testing Both Features

### Test Logout Redirect
```
1. Log in to app at /auth/login
2. Click the logout button in navbar
3. Should redirect to home page (/)
4. Check that you're logged out (Login button appears)
```

### Test SMS (Without Twilio - Console Mode)
```
1. Start backend server: npm start
2. Place order at /checkout
3. Check backend console logs
4. Look for: [SMS] To: <phone>, Message: <message>
```

### Test SMS (With Twilio)
```
1. Set up Twilio (see Setup Guide above)
2. Add credentials to .env
3. Uncomment Twilio code in orders.js
4. Restart backend
5. Place test order with your real phone number
6. Check SMS on your phone
```

---

## Order Placement Flow

```
User clicks "Place Order"
    ↓
validate form (name, phone, address, pincode)
    ↓
create order in database
    ↓
call SMS notification endpoint
    ↓
[PARALLEL]
    ├─ SMS sent to user's phone
    └─ Order confirmation shown on screen
    ↓
clear cart
    ↓
show order success page with order ID
    ↓
user can track order or continue shopping
```

---

## Files Modified

**Frontend:**
- `frontend/components/Navbar.tsx`
  - Added `useRouter` import
  - Added `handleLogout()` function
  - Updated both desktop and mobile logout buttons

- `frontend/app/checkout/page.tsx`
  - Added SMS API call in `handlePaymentComplete()`
  - Sends phone, orderId, totalPrice, itemCount

**Backend:**
- `backend/routes/orders.js`
  - Added `POST /api/orders/send-sms` endpoint
  - Implements SMS message formatting
  - Includes Twilio integration (commented out, ready to uncomment)

---

## Success Indicators

### Logout Works When:
- ✅ Page redirects to home (/)
- ✅ Login button appears in navbar
- ✅ Auth state is cleared
- ✅ User can place orders as guest or log back in

### SMS Works When:
- ✅ Backend logs SMS message to console
- ✅ Frontend doesn't show errors
- ✅ Order is created successfully
- ✅ User receives actual SMS (if Twilio enabled)

---

## Troubleshooting

### Logout Doesn't Redirect
- Clear browser cache
- Check browser console for errors
- Verify Navbar.tsx has `useRouter` import
- Restart dev server

### SMS Endpoint Returns Error
- Check phone number is 10 digits
- Verify order was created successfully
- Check backend console for error logs
- Ensure NEXT_PUBLIC_API_URL is correct

### SMS Not Received (Twilio)
- Verify `TWILIO_ACCOUNT_SID` is correct
- Verify `TWILIO_AUTH_TOKEN` is correct
- Verify `TWILIO_PHONE_NUMBER` is in correct format
- Check Twilio account has credits/active
- Verify phone number includes country code (+91 for India)

---

## Next Steps

1. **Quick Test:** Place an order and check backend logs for SMS message
2. **Full Integration:** Set up Twilio account and enable SMS
3. **Monitor:** Check SMS delivery status in Twilio dashboard
4. **Customize:** Modify SMS message text in `backend/routes/orders.js`

---

## Summary

✅ **Logout Feature:** Users redirected home after logout
✅ **SMS Endpoint:** Created and ready for real SMS provider
✅ **Frontend Integration:** Checkout page sends SMS on order
✅ **Error Handling:** SMS failures don't block orders
✅ **Testing Ready:** Console mode for development, Twilio for production
