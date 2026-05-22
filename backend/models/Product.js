const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number },
    category: {
        type: String,
        required: true,
        enum: ['Flavoured Makhanas', 'Air Fried Chips', 'No Sugar No Palm Oil Millet Cookies']
    },
    images: [{ type: String }],
    thumbnail: { type: String },
    stock: { type: Number, required: true, default: 0, min: 0 },
    weight: { type: String },
    ingredients: [{ type: String }],
    nutritionFacts: {
        calories: Number,
        protein: Number,
        carbs: Number,
        fat: Number,
        fiber: Number
    },
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
