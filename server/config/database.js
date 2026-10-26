import mongoose from 'mongoose';

export default async function databaseConnection() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/ai_support_ticket');

        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
}