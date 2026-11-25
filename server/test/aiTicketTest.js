import testServer from "./testServer.js";
import aiTicket from "../services/ai/aiTicket.js";
import User from '../models/user.model.js'
import Ticket from "../models/ticket.model.js";
import aiController from "../contorllers/aiController.js";


async function app() {
    try {
        await testServer();

        const user = {
            sub: '6ae1a0347ad82a7b6c49de2a',
            username: "John Doe",
            email: "johndoe@gmail.com",
            passwordHash: "$2b$10$caKSaT0s.DVUz7z9In08xuYSVfMYt9W7hQhEUFgZfru70o0sNC6re",
            role: "admin",
            createdAt: '2026-10-28T07:11:48.208+00:00',
            updatedAt: '2026-10-28T07:11:48.208+00:00',
        }

        const ticket = await aiTicket.createAnalysisTicket('6aded73682b3866cd46f7653', user);

        console.log(ticket);
    } catch (error) {
        console.error(error);
    }
}

app();