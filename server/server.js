import express from 'express'
import databaseConnection from "./config/database.js";

const app = express();

const startServer = async () => {
    try {
        await databaseConnection();
        
        app.listen(8000, () => {
            console.log("Server start's at PORT 8000")
        })
    } catch (error) {
        console.error(`Server Faild ${error}`);
    }
}

startServer();
