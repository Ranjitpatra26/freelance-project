const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

const router = express.Router();

const getRazorpay = () => new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @POST /api/payments/create-order — create Razorpay order
router.post('/create-order', protect, async (req, res) => {
    try {
        const { orderId, amount } = req.body;
        const razorpay = getRazorpay();
        const options = {
            amount: Math.round(amount * 100), // in paise
            currency: 'INR',
            receipt: `receipt_${orderId}`
        };
        const razorpayOrder = await razorpay.orders.create(options);

        // Save payment record
        await Payment.create({
            order: orderId,
            user: req.user._id,
            razorpayOrderId: razorpayOrder.id,
            amount: amount,
            status: 'created'
        });

        res.json({
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @POST /api/payments/verify — verify Razorpay signature
router.post('/verify', protect, async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;
        const body = razorpayOrderId + '|' + razorpayPaymentId;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpaySignature) {
            return res.status(400).json({ message: 'Payment verification failed' });
        }

        // Update payment record
        await Payment.findOneAndUpdate(
            { razorpayOrderId },
            { razorpayPaymentId, razorpaySignature, status: 'paid' }
        );

        // Update order as paid
        const order = await Order.findById(orderId);
        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.status = 'Processing';
            order.paymentResult = { razorpayOrderId, razorpayPaymentId, razorpaySignature };
            await order.save();
        }

        res.json({ success: true, message: 'Payment verified successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
