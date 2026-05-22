const express = require('express');
const Review = require('../models/Review');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @POST /api/reviews — add review
router.post('/', protect, async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const existing = await Review.findOne({ user: req.user._id, product: productId });
        if (existing) return res.status(400).json({ message: 'You already reviewed this product' });

        const review = await Review.create({
            user: req.user._id,
            product: productId,
            name: req.user.name,
            rating,
            comment
        });

        // Update product rating
        const reviews = await Review.find({ product: productId });
        const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
        await Product.findByIdAndUpdate(productId, { ratings: avgRating.toFixed(1), numReviews: reviews.length });

        res.status(201).json(review);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/reviews/product/:productId
router.get('/product/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
