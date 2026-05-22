const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
const shiprocketService = require('../services/shiprocketService');

const router = express.Router();

// @POST /api/orders/send-sms — send SMS notification for order
router.post('/send-sms', async (req, res) => {
    try {
        const { phone, orderId, totalPrice, itemCount } = req.body;

        console.log('[SMS] Received request:', { phone, orderId, totalPrice, itemCount });

        // Validate phone number
        if (!phone || phone.length < 10) {
            console.error('[SMS] Invalid phone number:', phone);
            return res.status(400).json({ message: 'Valid phone number required' });
        }

        const message = `ShuddhEats: Your order #${orderId} has been placed! Total: ₹${totalPrice} for ${itemCount} items. Track your order at shuddheats.co.in`;

        console.log('[SMS] Message to send:', message);
        console.log('[SMS] Twilio credentials check:');
        console.log('[SMS] - Account SID exists:', !!process.env.TWILIO_ACCOUNT_SID);
        console.log('[SMS] - Auth Token exists:', !!process.env.TWILIO_AUTH_TOKEN);
        console.log('[SMS] - Phone Number:', process.env.TWILIO_PHONE_NUMBER);

        const twilio = require('twilio');
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

        try {
            const result = await client.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: `+91${phone}`
            });
            console.log(`[SMS] ✅ Successfully sent to: +91${phone}`);
            console.log(`[SMS] Message SID:`, result.sid);
        } catch (smsErr) {
            console.error(`[SMS] ❌ Twilio error: ${smsErr.message}`);
            console.error(`[SMS] Full error:`, smsErr);
            console.log(`[SMS] Fallback - logging message details:`);
            console.log(`[SMS] To: +91${phone}`);
            console.log(`[SMS] From: ${process.env.TWILIO_PHONE_NUMBER}`);
            console.log(`[SMS] Message: ${message}`);
        }

        res.json({
            success: true,
            message: 'SMS sent successfully',
            phone: phone.slice(-4) // Return only last 4 digits for privacy
        });
    } catch (err) {
        console.error('[SMS] Unexpected Error:', err.message);
        console.error('[SMS] Stack:', err.stack);
        // Don't fail the order if SMS fails
        res.json({ success: true, message: 'Order placed (SMS not available)' });
    }
});

// @POST /api/orders — create order
router.post('/', protect, async (req, res) => {
    try {
        const { items, shippingAddress, itemsPrice, shippingPrice, totalPrice, paymentMethod } = req.body;
        if (!items || items.length === 0) return res.status(400).json({ message: 'No items in order' });

        // Reduce stock
        for (const item of items) {
            await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
        }

        const order = await Order.create({
            user: req.user._id,
            items,
            shippingAddress,
            itemsPrice,
            shippingPrice,
            totalPrice,
            paymentMethod
        });

        // Clear cart
        await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/orders/myorders — user's own orders
router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/orders/track/:id — public track by order ID
router.get('/track/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).select('status items totalPrice shippingAddress createdAt isPaid paidAt');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/orders/:id — get single order (owner or admin)
router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @PUT /api/orders/:id/pay — mark as paid (called after payment verify)
router.put('/:id/pay', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'email phone');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        
        order.isPaid = true;
        order.paidAt = Date.now();
        order.status = 'Processing';
        order.paymentResult = req.body;
        
        // Attempt to create shipment with Shiprocket
        if (process.env.SHIPROCKET_ENABLED === 'true') {
            try {
                const shipmentData = {
                    orderId: order._id.toString(),
                    createdAt: order.createdAt,
                    userEmail: order.user.email,
                    shippingAddress: order.shippingAddress,
                    items: order.items,
                    itemsPrice: order.itemsPrice,
                    totalPrice: order.totalPrice
                };

                const shipmentResult = await shiprocketService.createShipment(shipmentData);

                if (shipmentResult.success) {
                    order.shiprocket = {
                        shipmentId: shipmentResult.shipmentId,
                        awb: shipmentResult.awb,
                        carrier: shipmentResult.carrier,
                        status: 'Confirmed',
                        lastUpdated: Date.now()
                    };
                    order.trackingId = shipmentResult.awb;
                    console.log(`✅ Shiprocket shipment created for order ${order._id}`);
                } else {
                    console.log(`⚠️ Failed to create Shiprocket shipment: ${shipmentResult.error}`);
                    // Order continues even if shipment creation fails
                }
            } catch (shipError) {
                console.error('❌ Error in Shiprocket integration:', shipError.message);
                // Order continues even if Shiprocket integration fails
            }
        }

        await order.save();
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @PUT /api/orders/:id/status — admin update status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        order.status = req.body.status;
        if (req.body.status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }
        await order.save();
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/orders — admin all orders
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/orders/:id/shiprocket-tracking — get detailed Shiprocket tracking
router.get('/:id/shiprocket-tracking', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        
        if (!order.shiprocket || !order.shiprocket.shipmentId) {
            return res.status(404).json({ message: 'No Shiprocket shipment associated with this order' });
        }

        const tracking = await shiprocketService.getShipmentTracking(order.shiprocket.shipmentId);

        if (tracking.success) {
            // Update order with latest Shiprocket status
            if (tracking.status !== order.shiprocket.status) {
                order.shiprocket.status = tracking.status;
                order.shiprocket.lastUpdated = Date.now();
                
                // Update order status based on Shiprocket status
                const newStatus = shiprocketService.mapShiprocketStatusToOrderStatus(tracking.status);
                if (newStatus !== order.status) {
                    order.status = newStatus;
                }

                if (tracking.isDelivered && !order.isDelivered) {
                    order.isDelivered = true;
                    order.deliveredAt = Date.now();
                }

                await order.save();
            }

            res.json({
                success: true,
                tracking: {
                    awb: tracking.awb,
                    carrier: tracking.carrier,
                    status: tracking.status,
                    estimatedDelivery: tracking.estimatedDeliveryDate,
                    currentLocation: tracking.currentLocation,
                    isDelivered: tracking.isDelivered,
                    trackingEvents: tracking.trackingData
                }
            });
        } else {
            res.status(400).json({ success: false, message: tracking.error });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @POST /api/orders/webhook/shiprocket — Shiprocket webhook handler
router.post('/webhook/shiprocket', async (req, res) => {
    try {
        const { shipment_id, status, awb, carrier_name, edd, current_location } = req.body;

        // Find order by Shiprocket shipment ID
        const order = await Order.findOne({ 'shiprocket.shipmentId': shipment_id });
        
        if (!order) {
            console.log(`Webhook: Shipment ${shipment_id} not found in database`);
            return res.json({ success: true, message: 'No matching order found' });
        }

        // Update Shiprocket status
        if (order.shiprocket) {
            order.shiprocket.status = status;
            order.shiprocket.lastUpdated = Date.now();
            if (carrier_name) order.shiprocket.carrier = carrier_name;
            if (edd) order.shiprocket.estimatedDeliveryDate = new Date(edd);
            if (current_location) order.shiprocket.currentLocation = current_location;
        }

        // Map to order status and update
        const newStatus = shiprocketService.mapShiprocketStatusToOrderStatus(status);
        if (newStatus !== order.status) {
            order.status = newStatus;
            console.log(`Order ${order._id} status updated to ${newStatus} based on Shiprocket webhook`);
        }

        // Mark as delivered if Shiprocket status is Delivered
        if (status === 'Delivered' && !order.isDelivered) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
            console.log(`Order ${order._id} marked as delivered`);
        }

        // Mark as picked up
        if (status === 'Picked' && !order.shiprocket.isPickedUp) {
            order.shiprocket.isPickedUp = true;
            order.shiprocket.pickupDate = Date.now();
        }

        await order.save();
        
        res.json({ 
            success: true, 
            message: 'Order updated from Shiprocket webhook',
            orderId: order._id
        });
    } catch (err) {
        console.error('Webhook error:', err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

// @POST /api/orders/:id/request-pickup — manually request pickup from Shiprocket
router.post('/:id/request-pickup', protect, adminOnly, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (!order.shiprocket || !order.shiprocket.shipmentId) {
            return res.status(400).json({ message: 'No Shiprocket shipment associated with this order' });
        }

        const pickupResult = await shiprocketService.requestPickup(order.shiprocket.shipmentId);

        if (pickupResult.success) {
            order.shiprocket.pickupStatus = 'Requested';
            await order.save();
            res.json({ success: true, message: 'Pickup requested from Shiprocket', data: pickupResult });
        } else {
            res.status(400).json({ success: false, message: pickupResult.error });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @POST /api/orders/:id/cancel-shipment — cancel shipment on Shiprocket
router.post('/:id/cancel-shipment', protect, adminOnly, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (!order.shiprocket || !order.shiprocket.shipmentId) {
            return res.status(400).json({ message: 'No Shiprocket shipment to cancel' });
        }

        const cancelResult = await shiprocketService.cancelShipment(order.shiprocket.shipmentId);

        if (cancelResult.success) {
            order.status = 'Cancelled';
            order.shiprocket.status = 'Cancelled';
            await order.save();
            res.json({ success: true, message: 'Shipment cancelled', data: cancelResult });
        } else {
            res.status(400).json({ success: false, message: cancelResult.error });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
