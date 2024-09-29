// config/dbConfig.js
const mongoose = require('mongoose');

const dbURI = process.env.MONGODB_URI ;

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, {
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
