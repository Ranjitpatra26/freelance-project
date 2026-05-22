const express = require('express');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

const router = express.Router();

// @GET /api/products — public, with filters
router.get('/', async (req, res) => {
    try {
        const { category, search, sort, featured, bestseller } = req.query;
        const filter = {};
        if (category) filter.category = category;
        if (featured === 'true') filter.isFeatured = true;
        if (bestseller === 'true') filter.isBestSeller = true;
        if (search) filter.name = { $regex: search, $options: 'i' };

        let query = Product.find(filter);
        if (sort === 'price_asc') query = query.sort({ price: 1 });
        else if (sort === 'price_desc') query = query.sort({ price: -1 });
        else if (sort === 'rating') query = query.sort({ ratings: -1 });
        else query = query.sort({ createdAt: -1 });

        const products = await query;
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/products/:slug — public
router.get('/:slug', async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @POST /api/products — admin only
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @PUT /api/products/:id — admin only
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @DELETE /api/products/:id — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
