// config/dbConfig.js
const mongoose = require('mongoose');

const dbURI = process.env.MONGODB_URI || 'mongodb://node1.local:27017/Projet_cloud';

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
