import aiTicket from "../services/ai/aiTicket.js";

async function createAiInteraction(req, res, next) {
    try {
        const user = req.user;
        const ticketId = req.params.id;

        console.log(user)

        if(!user) {
            const error = new Error('Please Login.');
            error.statusCode = 401;

            throw error;
        };

        console.log('Controller are clear');

        const newAiTicket = await aiTicket.createAnalysisTicket(ticketId, user);

        return newAiTicket;
    } catch (error) {
        next(error);
    }
}


export default {
    createAiInteraction
}