const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

const router = express.Router();

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// @GET /api/admin/dashboard — stats
router.get('/dashboard', async (req, res) => {
    try {
        const [totalOrders, totalProducts, totalUsers, orders] = await Promise.all([
            Order.countDocuments(),
            Product.countDocuments(),
            User.countDocuments({ role: 'user' }),
            Order.find({})
        ]);
        const totalRevenue = orders.filter(o => o.isPaid).reduce((sum, o) => sum + o.totalPrice, 0);
        const recentOrders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 }).limit(5);
        res.json({ totalOrders, totalProducts, totalUsers, totalRevenue, recentOrders });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/admin/products — all products for admin
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/admin/orders
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/admin/users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/admin/inventory
router.get('/inventory', async (req, res) => {
    try {
        const products = await Product.find({}).select('name category stock price isFeatured isBestSeller');
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @PATCH /api/admin/inventory/:id — update stock
router.patch('/inventory/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { stock: req.body.stock },
            { new: true }
        );
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @DELETE /api/admin/inventory/:id — delete product
router.delete('/inventory/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted successfully', product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @PUT /api/admin/orders/:id/status — update order status
router.put('/orders/:id/status', async (req, res) => {
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

module.exports = router;
