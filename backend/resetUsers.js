const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

async function resetUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shuddheats');
        console.log('✅ MongoDB Connected');

        // Only delete/recreate admin and test accounts — NEVER delete customer registrations
        await User.deleteOne({ email: 'admin@shuddheats.com' });
        await User.deleteOne({ email: 'user@shuddheats.com' });
        console.log('🗑️  Admin and test accounts reset');

        // Create Admin
        await User.create({
            name: 'ShuddhEats Admin',
            email: 'admin@shuddheats.com',
            password: 'Admin@123',
            role: 'admin',
            phone: '9876543210'
        });
        console.log('✅ Admin created: admin@shuddheats.com / Admin@123');

        // Create Test User
        await User.create({
            name: 'Test User',
            email: 'user@shuddheats.com',
            password: 'User@1234',
            role: 'user',
            phone: '9123456789'
        });
        console.log('✅ User created: user@shuddheats.com / User@1234');

        const total = await User.countDocuments();
        console.log(`\n🎉 Done! Total users in DB: ${total}`);
        console.log('✨ Customer accounts preserved.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

resetUsers();
