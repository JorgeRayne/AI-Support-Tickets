import express from 'express'
import databaseConnection from "./config/database.js";
import ticket from './routes/ticket.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use('/api/tickets', ticket);

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
