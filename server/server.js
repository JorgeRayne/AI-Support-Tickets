import express from 'express';
import 'dotenv/config';
import databaseConnection from "./config/database.js";
import ticket from './routes/ticket.js';
import auth from './routes/auth.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use('/api/tickets', ticket);
app.use('/api', auth);

const startServer = async () => {
    const PORT = process.env.PORT

    try {
        await databaseConnection();
        
        app.listen(PORT, () => {
            console.log(`Server start's at PORT ${PORT}`)
        })
    } catch (error) {
        console.error(`Server Faild ${error}`);
    }
}

startServer();
