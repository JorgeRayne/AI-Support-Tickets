import express from 'express';
import databaseConnection from '../config/database.js';

const app = express();


const testServer = async () => {
    try {
        await databaseConnection();
        app.listen(3000, () => {
            'Test server is running, this server is for testing methods and app functionality.'
        })
        
    } catch (error) {
        console.error('Test server Error.');
    }
}

export default testServer;