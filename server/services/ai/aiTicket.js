import mongoose from "mongoose";
import ticketService from "../ticketService.js";
import AIInteraction from "../../models/aiInteraction.model.js";
import ticketAnalysisService from "./ticketAnalysisService.js";

async function createAnalysisTicket(ticketId, user) {
    if(!mongoose.Types.ObjectId.isValid(ticketId)){
        const error = new Error("Invalid ticket ID.");
        error.statusCode = 0 // 0 for awhile

        throw error
    }

    if(!user || (user.role !== 'agent' && user.role !== 'admin')){
        const error = new Error("You are not authorized to access this ticket.");
        error.statusCode =  403;

        throw error
    }
    console.log('Service is clear');

    const ticket = await ticketService.getTicket(user, ticketId);

    console.log(ticket)

    if(!ticket){
        const error = new Error("Ticket not found.");
        error.statusCode = 404;

        throw error
    }

    const aiResponse = await ticketAnalysisService.analyzeTicket(ticket);

    console.log(aiResponse)

    const response = await AIInteraction.create({
        ticket: ticket._id,
        requestedBy: user.sub,
        provider: 'gemini',
        model: 'gemini-3.5-flash-lite',
        analysis: {
            category: aiResponse.category,
            suggestedPriority: aiResponse.suggestedPriority,
            summary: aiResponse.summary,
            reasoning: aiResponse.reasoning
        },
    });
    console.log(response);


    // return response;

}

export default {
    createAnalysisTicket
};