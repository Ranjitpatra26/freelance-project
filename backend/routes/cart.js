const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @GET /api/cart — get user cart
router.get('/', protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price thumbnail slug stock');
        res.json(cart || { items: [] });
    } catch (err) {
        console.error("Cart GET Error:", err);
        res.status(500).json({ message: err.message });
    }
});

// @POST /api/cart — add item or update qty
router.post('/', protect, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }
        const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);

        if (product.stock < quantity) return res.status(400).json({ message: 'Insufficient stock' });

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
        } else {
            cart.items.push({ product: productId, name: product.name, image: product.thumbnail, price: product.price, quantity });
        }
        cart.updatedAt = Date.now();
        await cart.save();
        await cart.populate('items.product', 'name price thumbnail slug stock');
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @POST /api/cart/update-options — update options of an item
router.post('/update-options', protect, async (req, res) => {
    try {
        const { productId, weight, packaging, price } = req.body;
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].weight = weight;
            cart.items[itemIndex].packaging = packaging;
            cart.items[itemIndex].price = price;
            cart.updatedAt = Date.now();
            await cart.save();
        }
        await cart.populate('items.product', 'name price thumbnail slug stock');
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @DELETE /api/cart/:productId — remove item
router.delete('/:productId', protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
        await cart.save();
        await cart.populate('items.product', 'name price thumbnail slug stock');
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @DELETE /api/cart — clear entire cart
router.delete('/', protect, async (req, res) => {
    try {
        await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
        res.json({ message: 'Cart cleared' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
