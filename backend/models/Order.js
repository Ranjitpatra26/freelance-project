const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    image: String,
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    weight: Number,
    packaging: { type: String, enum: ['jar', 'pouch'] }
});

const shippingAddressSchema = new mongoose.Schema({
    fullName: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String
});

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, default: 'Razorpay' },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    paymentResult: {
        razorpayOrderId: String,
        razorpayPaymentId: String,
        razorpaySignature: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    trackingId: String,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,
    // Shiprocket Integration Fields
    shiprocket: {
        shipmentId: String,
        awb: String,
        status: String,
        carrier: String,
        estimatedDeliveryDate: Date,
        lastUpdated: Date,
        pickupStatus: String,
        isPickedUp: { type: Boolean, default: false },
        pickupDate: Date
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
