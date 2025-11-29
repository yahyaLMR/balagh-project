const mongoose = require('mongoose');
const User = require('./models/users');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');

        // Seed initial user if none exists
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            const adminUser = new User({
                full_name: 'Admin',
                email: 'admin@admin.com',
                password: 'admin' // Storing as plain text to match existing auth logic
            });
            await adminUser.save();
            console.log('Default admin user created: admin@admin.com / admin');
        }

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

module.exports = connectDB;