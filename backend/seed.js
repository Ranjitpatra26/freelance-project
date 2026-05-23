const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const speakeasy = require('speakeasy');

dotenv.config();

// Generate backup codes for 2FA
const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 10; i++) {
        codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    return codes;
};

const products = [
    // --- Flavoured Makhanas ---
    {
        name: 'Himalayan Salt Makhana (35g)',
        slug: 'himalayan-salt-makhana-35g',
        description: 'Light, airy fox nuts air-popped and seasoned with pure Himalayan pink salt. High in protein, low in fat, and completely guilt-free. Perfect for evening snacking.',
        shortDescription: 'Air-popped fox nuts with Himalayan pink salt.',
        price: 99,
        originalPrice: 129,
        category: 'Flavoured Makhanas',
        thumbnail: '/images/products/himalayan-salt-makhana.svg',
        images: ['/images/products/himalayan-salt-makhana.svg'],
        stock: 150,
        weight: '35g',
        ingredients: ['Fox Nuts (Makhana)', 'Himalayan Pink Salt', 'Cold Pressed Coconut Oil'],
        nutritionFacts: { calories: 121, protein: 3.4, carbs: 27, fat: 0.035, fiber: 0.175 },
        tags: ['makhana', 'healthy', 'low-fat', 'himalayan-salt', '35g'],
        isFeatured: true,
        isBestSeller: true,
        ratings: 4.8,
        numReviews: 124
    },
    {
        name: 'Himalayan Salt Makhana (75g)',
        slug: 'himalayan-salt-makhana-75g',
        description: 'Light, airy fox nuts air-popped and seasoned with pure Himalayan pink salt. High in protein, low in fat, and completely guilt-free. Perfect for evening snacking.',
        shortDescription: 'Air-popped fox nuts with Himalayan pink salt.',
        price: 199,
        originalPrice: 249,
        category: 'Flavoured Makhanas',
        thumbnail: '/images/products/himalayan-salt-makhana.svg',
        images: ['/images/products/himalayan-salt-makhana.svg'],
        stock: 150,
        weight: '75g',
        ingredients: ['Fox Nuts (Makhana)', 'Himalayan Pink Salt', 'Cold Pressed Coconut Oil'],
        nutritionFacts: { calories: 260, protein: 7.3, carbs: 57.6, fat: 0.075, fiber: 0.375 },
        tags: ['makhana', 'healthy', 'low-fat', 'himalayan-salt', '75g'],
        isFeatured: true,
        isBestSeller: true,
        ratings: 4.8,
        numReviews: 124
    },
    {
        name: 'Himalayan Salt Makhana (100g)',
        slug: 'himalayan-salt-makhana-100g',
        description: 'Light, airy fox nuts air-popped and seasoned with pure Himalayan pink salt. High in protein, low in fat, and completely guilt-free. Perfect for evening snacking.',
        shortDescription: 'Air-popped fox nuts with Himalayan pink salt.',
        price: 249,
        originalPrice: 299,
        category: 'Flavoured Makhanas',
        thumbnail: '/images/products/himalayan-salt-makhana.svg',
        images: ['/images/products/himalayan-salt-makhana.svg'],
        stock: 150,
        weight: '100g',
        ingredients: ['Fox Nuts (Makhana)', 'Himalayan Pink Salt', 'Cold Pressed Coconut Oil'],
        nutritionFacts: { calories: 347, protein: 9.7, carbs: 76.9, fat: 0.1, fiber: 0.5 },
        tags: ['makhana', 'healthy', 'low-fat', 'himalayan-salt', '100g'],
        isFeatured: true,
        isBestSeller: true,
        ratings: 4.8,
        numReviews: 124
    },
    {
        name: 'Peri Peri Makhana (35g)',
        slug: 'peri-peri-makhana-35g',
        description: 'Spicy and tangy peri peri flavoured makhana. Boldly seasoned with African spices for those who love a kick. Air-popped, never fried.',
        shortDescription: 'Spicy peri peri flavoured fox nuts.',
        price: 99,
        originalPrice: 129,
        category: 'Flavoured Makhanas',
        thumbnail: '/images/products/peri-peri-makhana.svg',
        images: ['/images/products/peri-peri-makhana.svg'],
        stock: 120,
        weight: '35g',
        ingredients: ['Fox Nuts (Makhana)', 'Peri Peri Seasoning', 'Sunflower Oil', 'Salt'],
        nutritionFacts: { calories: 124, protein: 3.3, carbs: 26, fat: 0.7, fiber: 0.175 },
        tags: ['makhana', 'spicy', 'peri-peri', '35g'],
        isFeatured: false,
        isBestSeller: false,
        ratings: 4.6,
        numReviews: 89
    },
    {
        name: 'Peri Peri Makhana (75g)',
        slug: 'peri-peri-makhana-75g',
        description: 'Spicy and tangy peri peri flavoured makhana. Boldly seasoned with African spices for those who love a kick. Air-popped, never fried.',
        shortDescription: 'Spicy peri peri flavoured fox nuts.',
        price: 199,
        originalPrice: 249,
        category: 'Flavoured Makhanas',
        thumbnail: '/images/products/peri-peri-makhana.svg',
        images: ['/images/products/peri-peri-makhana.svg'],
        stock: 120,
        weight: '75g',
        ingredients: ['Fox Nuts (Makhana)', 'Peri Peri Seasoning', 'Sunflower Oil', 'Salt'],
        nutritionFacts: { calories: 266, protein: 7.1, carbs: 55.5, fat: 1.6, fiber: 0.375 },
        tags: ['makhana', 'spicy', 'peri-peri', '75g'],
        isFeatured: false,
        isBestSeller: false,
        ratings: 4.6,
        numReviews: 89
    },
    {
        name: 'Peri Peri Makhana (100g)',
        slug: 'peri-peri-makhana-100g',
        description: 'Spicy and tangy peri peri flavoured makhana. Boldly seasoned with African spices for those who love a kick. Air-popped, never fried.',
        shortDescription: 'Spicy peri peri flavoured fox nuts.',
        price: 249,
        originalPrice: 299,
        category: 'Flavoured Makhanas',
        thumbnail: '/images/products/peri-peri-makhana.svg',
        images: ['/images/products/peri-peri-makhana.svg'],
        stock: 120,
        weight: '100g',
        ingredients: ['Fox Nuts (Makhana)', 'Peri Peri Seasoning', 'Sunflower Oil', 'Salt'],
        nutritionFacts: { calories: 355, protein: 9.5, carbs: 74.2, fat: 2.1, fiber: 0.5 },
        tags: ['makhana', 'spicy', 'peri-peri', '100g'],
        isFeatured: false,
        isBestSeller: false,
        ratings: 4.6,
        numReviews: 89
    },
    {
        name: 'Pudina Makhana (35g)',
        slug: 'pudina-makhana-35g',
        description: 'Refreshing mint flavored makhana with aromatic pudina seasoning. Light, cooling, and perfect as an afternoon snack. Air-popped goodness in every bite.',
        shortDescription: 'Refreshing mint flavored fox nuts.',
        price: 99,
        originalPrice: 129,
        category: 'Flavoured Makhanas',
        thumbnail: '/images/products/pudina-makhana.svg',
        images: ['/images/products/pudina-makhana.svg'],
        stock: 100,
        weight: '35g',
        ingredients: ['Fox Nuts (Makhana)', 'Pudina (Mint) Seasoning', 'Salt', 'Cold Pressed Oil'],
        nutritionFacts: { calories: 124, protein: 3.4, carbs: 27, fat: 0.05, fiber: 0.175 },
        tags: ['makhana', 'pudina', 'mint', '35g'],
        isFeatured: false,
        isBestSeller: false,
        ratings: 4.5,
        numReviews: 65
    },
    {
        name: 'Pudina Makhana (75g)',
        slug: 'pudina-makhana-75g',
        description: 'Refreshing mint flavored makhana with aromatic pudina seasoning. Light, cooling, and perfect as an afternoon snack. Air-popped goodness in every bite.',
        shortDescription: 'Refreshing mint flavored fox nuts.',
        price: 199,
        originalPrice: 249,
        category: 'Flavoured Makhanas',
        thumbnail: '/images/products/pudina-makhana.svg',
        images: ['/images/products/pudina-makhana.svg'],
        stock: 100,
        weight: '75g',
        ingredients: ['Fox Nuts (Makhana)', 'Pudina (Mint) Seasoning', 'Salt', 'Cold Pressed Oil'],
        nutritionFacts: { calories: 266, protein: 7.3, carbs: 57.6, fat: 0.1, fiber: 0.375 },
        tags: ['makhana', 'pudina', 'mint', '75g'],
        isFeatured: false,
        isBestSeller: false,
        ratings: 4.5,
        numReviews: 65
    },
    {
        name: 'Pudina Makhana (100g)',
        slug: 'pudina-makhana-100g',
        description: 'Refreshing mint flavored makhana with aromatic pudina seasoning. Light, cooling, and perfect as an afternoon snack. Air-popped goodness in every bite.',
        shortDescription: 'Refreshing mint flavored fox nuts.',
        price: 249,
        originalPrice: 299,
        category: 'Flavoured Makhanas',
        thumbnail: '/images/products/pudina-makhana.svg',
        images: ['/images/products/pudina-makhana.svg'],
        stock: 100,
        weight: '100g',
        ingredients: ['Fox Nuts (Makhana)', 'Pudina (Mint) Seasoning', 'Salt', 'Cold Pressed Oil'],
        nutritionFacts: { calories: 347, protein: 9.7, carbs: 76.9, fat: 0.13, fiber: 0.5 },
        tags: ['makhana', 'pudina', 'mint', '100g'],
        isFeatured: false,
        isBestSeller: false,
        ratings: 4.5,
        numReviews: 65
    },
    {
        name: 'Classic Cheese Makhana (35g)',
        slug: 'classic-cheese-makhana-35g',
        description: 'Cheesy delight with a perfect blend of aged cheese flavoring. Savory and satisfying, this classic cheese makhana is an instant hit. Guilt-free indulgence.',
        shortDescription: 'Creamy cheese flavored fox nuts.',
        price: 99,
        originalPrice: 129,
        category: 'Flavoured Makhanas',
        thumbnail: '/images/products/classic-cheese-makhana.svg',
        images: ['/images/products/classic-cheese-makhana.svg'],
        stock: 110,
        weight: '35g',
        ingredients: ['Fox Nuts (Makhana)', 'Cheese Flavoring', 'Salt', 'Sunflower Oil'],
        nutritionFacts: { calories: 124, protein: 3.5, carbs: 27, fat: 0.1, fiber: 0.175 },
        tags: ['makhana', 'cheese', 'savory', '35g'],
        isFeatured: false,
        isBestSeller: true,
        ratings: 4.7,
        numReviews: 92
    },
    {
        name: 'Classic Cheese Makhana (75g)',
        slug: 'classic-cheese-makhana-75g',
        description: 'Cheesy delight with a perfect blend of aged cheese flavoring. Savory and satisfying, this classic cheese makhana is an instant hit. Guilt-free indulgence.',
        shortDescription: 'Creamy cheese flavored fox nuts.',
        price: 199,
        originalPrice: 249,
        category: 'Flavoured Makhanas',
        thumbnail: '/images/products/classic-cheese-makhana.svg',
        images: ['/images/products/classic-cheese-makhana.svg'],
        stock: 110,
        weight: '75g',
        ingredients: ['Fox Nuts (Makhana)', 'Cheese Flavoring', 'Salt', 'Sunflower Oil'],
        nutritionFacts: { calories: 266, protein: 7.5, carbs: 57.6, fat: 0.21, fiber: 0.375 },
        tags: ['makhana', 'cheese', 'savory', '75g'],
        isFeatured: false,
        isBestSeller: true,
        ratings: 4.7,
        numReviews: 92
    },
    {
        name: 'Classic Cheese Makhana (100g)',
        slug: 'classic-cheese-makhana-100g',
        description: 'Cheesy delight with a perfect blend of aged cheese flavoring. Savory and satisfying, this classic cheese makhana is an instant hit. Guilt-free indulgence.',
        shortDescription: 'Creamy cheese flavored fox nuts.',
        price: 249,
        originalPrice: 299,
        category: 'Flavoured Makhanas',
        thumbnail: '/images/products/classic-cheese-makhana.svg',
        images: ['/images/products/classic-cheese-makhana.svg'],
        stock: 110,
        weight: '100g',
        ingredients: ['Fox Nuts (Makhana)', 'Cheese Flavoring', 'Salt', 'Sunflower Oil'],
        nutritionFacts: { calories: 347, protein: 10, carbs: 76.9, fat: 0.28, fiber: 0.5 },
        tags: ['makhana', 'cheese', 'savory', '100g'],
        isFeatured: false,
        isBestSeller: true,
        ratings: 4.7,
        numReviews: 92
    },
    {
        name: 'Cream and Onion Makhana (35g)',
        slug: 'cream-and-onion-makhana-35g',
        description: 'Decadent cream and onion flavor meets light, crispy makhana. A sophisticated snack for those who prefer refined taste. Air-popped perfection.',
        shortDescription: 'Rich cream and onion flavored fox nuts.',
        price: 99,
        originalPrice: 129,
        category: 'Flavoured Makhanas',
        thumbnail: '/images/products/cream-onion-makhana.svg',
        images: ['/images/products/cream-onion-makhana.svg'],
        stock: 95,
        weight: '35g',
        ingredients: ['Fox Nuts (Makhana)', 'Cream and Onion Flavoring', 'Salt', 'Sunflower Oil'],
        nutritionFacts: { calories: 124, protein: 3.4, carbs: 27, fat: 0.08, fiber: 0.175 },
        tags: ['makhana', 'cream-onion', 'premium', '35g'],
        isFeatured: false,
        isBestSeller: false,
        ratings: 4.6,
        numReviews: 75
    },
    {
        name: 'Cream and Onion Makhana (75g)',
        slug: 'cream-and-onion-makhana-75g',
        description: 'Decadent cream and onion flavor meets light, crispy makhana. A sophisticated snack for those who prefer refined taste. Air-popped perfection.',
        shortDescription: 'Rich cream and onion flavored fox nuts.',
        price: 199,
        originalPrice: 249,
        category: 'Flavoured Makhanas',
        thumbnail: '/images/products/cream-onion-makhana.svg',
        images: ['/images/products/cream-onion-makhana.svg'],
        stock: 95,
        weight: '75g',
        ingredients: ['Fox Nuts (Makhana)', 'Cream and Onion Flavoring', 'Salt', 'Sunflower Oil'],
        nutritionFacts: { calories: 266, protein: 7.3, carbs: 57.6, fat: 0.17, fiber: 0.375 },
        tags: ['makhana', 'cream-onion', 'premium', '75g'],
        isFeatured: false,
        isBestSeller: false,
        ratings: 4.6,
        numReviews: 75
    },
    {
        name: 'Cream and Onion Makhana (100g)',
        slug: 'cream-and-onion-makhana-100g',
        description: 'Decadent cream and onion flavor meets light, crispy makhana. A sophisticated snack for those who prefer refined taste. Air-popped perfection.',
        shortDescription: 'Rich cream and onion flavored fox nuts.',
        price: 249,
        originalPrice: 299,
        category: 'Flavoured Makhanas',
        thumbnail: '/images/products/cream-onion-makhana.svg',
        images: ['/images/products/cream-onion-makhana.svg'],
        stock: 95,
        weight: '100g',
        ingredients: ['Fox Nuts (Makhana)', 'Cream and Onion Flavoring', 'Salt', 'Sunflower Oil'],
        nutritionFacts: { calories: 347, protein: 9.7, carbs: 76.9, fat: 0.23, fiber: 0.5 },
        tags: ['makhana', 'cream-onion', 'premium', '100g'],
        isFeatured: false,
        isBestSeller: false,
        ratings: 4.6,
        numReviews: 75
    },

    // --- Air Fried Chips ---
    {
        name: 'Vegetable Chips (100g)',
        slug: 'vegetable-chips-100g',
        description: 'Colorful mixed vegetable chips made from real vegetables. Air-fried to crispy perfection with 70% less oil. Packed with natural flavors and nutrients.',
        shortDescription: 'Air-fried vegetable chips with 70% less oil.',
        price: 119,
        originalPrice: 159,
        category: 'Air Fried Chips',
        thumbnail: '/images/products/vegetable-chips.svg',
        images: ['/images/products/vegetable-chips.svg'],
        stock: 150,
        weight: '100g',
        ingredients: ['Mixed Vegetables', 'Sea Salt', 'Minimal Sunflower Oil', 'Spice Blend'],
        nutritionFacts: { calories: 385, protein: 5.2, carbs: 68.5, fat: 6.4, fiber: 5.2 },
        tags: ['chips', 'vegetable', 'air-fried', 'healthy'],
        isFeatured: true,
        isBestSeller: true,
        ratings: 4.7,
        numReviews: 145
    },
    {
        name: 'Sweet Potato Chips (100g)',
        slug: 'sweet-potato-chips-100g',
        description: 'Naturally sweet and nutritious sweet potato chips. Air-fried until golden and crispy. A healthier twist on the classic potato chip. Rich in beta-carotene.',
        shortDescription: 'Sweet and nutritious air-fried sweet potato chips.',
        price: 119,
        originalPrice: 159,
        category: 'Air Fried Chips',
        thumbnail: '/images/products/sweet-potato-chips.svg',
        images: ['/images/products/sweet-potato-chips.svg'],
        stock: 140,
        weight: '100g',
        ingredients: ['Sweet Potato', 'Sea Salt', 'Minimal Sunflower Oil'],
        nutritionFacts: { calories: 345, protein: 4.1, carbs: 76.8, fat: 0.9, fiber: 6.3 },
        tags: ['chips', 'sweet-potato', 'air-fried', 'nutritious'],
        isFeatured: true,
        isBestSeller: true,
        ratings: 4.8,
        numReviews: 167
    },
    {
        name: 'Beetroot Chips (100g)',
        slug: 'beetroot-chips-100g',
        description: 'Vibrant beetroot chips packed with antioxidants and minerals. Air-fried to perfection with 70% less oil. A colorful and healthy snack choice.',
        shortDescription: 'Antioxidant-rich air-fried beetroot chips.',
        price: 119,
        originalPrice: 159,
        category: 'Air Fried Chips',
        thumbnail: '/images/products/beetroot-chips.svg',
        images: ['/images/products/beetroot-chips.svg'],
        stock: 130,
        weight: '100g',
        ingredients: ['Beetroot', 'Sea Salt', 'Minimal Olive Oil'],
        nutritionFacts: { calories: 320, protein: 3.5, carbs: 71.5, fat: 1.2, fiber: 5.8 },
        tags: ['chips', 'beetroot', 'air-fried', 'antioxidant'],
        isFeatured: false,
        isBestSeller: false,
        ratings: 4.6,
        numReviews: 98
    },

    // --- No Sugar No Palm Oil Millet Cookies ---
    {
        name: 'No Sugar No Palm Oil Millet Cookies (100g)',
        slug: 'millet-cookies-100g',
        description: 'Delicious and nutritious millet cookies with absolutely no added sugar or palm oil. Made with wholesome millet grains and natural sweeteners. Perfect for health-conscious snackers.',
        shortDescription: 'Nutritious millet cookies, zero sugar, no palm oil.',
        price: 149,
        originalPrice: 199,
        category: 'No Sugar No Palm Oil Millet Cookies',
        thumbnail: '/images/products/millet-cookies.svg',
        images: ['/images/products/millet-cookies.svg'],
        stock: 120,
        weight: '100g',
        ingredients: ['Millet Flour', 'Natural Sweetener (Stevia)', 'Coconut Oil', 'Sea Salt', 'Baking Powder'],
        nutritionFacts: { calories: 410, protein: 8.2, carbs: 62.3, fat: 14.5, fiber: 3.1 },
        tags: ['cookies', 'millet', 'no-sugar', 'no-palm-oil', 'healthy'],
        isFeatured: true,
        isBestSeller: true,
        ratings: 4.9,
        numReviews: 134
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shuddheats');
        console.log('✅ MongoDB Connected');

        // Only clear products, keep existing users
        await Product.deleteMany({});

        // Create admin user only if none exists
        const adminExists = await User.findOne({ email: 'admin@shuddheats.com' });
        if (!adminExists) {
            // Generate 2FA secret for admin
            const secret = speakeasy.generateSecret({
                name: 'SuddhEats Admin',
                issuer: 'SuddhEats',
                length: 32
            });
            const backupCodes = generateBackupCodes();

            await User.create({
                name: 'ShuddhEats Admin',
                email: 'admin@shuddheats.com',
                password: 'admin123',
                role: 'admin',
                phone: '9876543210',
                twoFactorEnabled: true,
                twoFactorSecret: secret.base32,
                backupCodes: backupCodes
            });
            console.log('✅ Admin created with 2FA enabled: admin@shuddheats.com / admin123');
            console.log('📱 2FA Secret (Base32):', secret.base32);
            console.log('🔐 Authenticator App: Use QR code or enter secret manually in your authenticator app');
            console.log('⚠️  Backup Codes:', backupCodes.join(', '));
        } else {
            console.log('✅ Admin already exists');
        }

        // Create test user only if none exists
        const userExists = await User.findOne({ email: 'user@shuddheats.com' });
        if (!userExists) {
            await User.create({
                name: 'Test User',
                email: 'user@shuddheats.com',
                password: 'user1234',
                role: 'user',
                phone: '9123456789'
            });
            console.log('✅ Test user created: user@shuddheats.com / user1234');
        } else {
            console.log('✅ Test user already exists');
        }

        // Insert products
        await Product.insertMany(products);
        console.log(`✅ ${products.length} products seeded`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('Your existing users are preserved ✨');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

seed();
