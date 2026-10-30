import mongoose from "mongoose";
import Tickets from "../models/ticket.model.js";


async function getTickets() {
    console.log("Database:", mongoose.connection.name);

    const tickets = await Tickets.find();
    return tickets
}

async function createTickets(body) {
    const ticket = new Tickets(body);

    ticket.save();
    return ticket;
}

async function getTicket(id) {
    try {
        const ticket = Tickets.findById(id);

        if(!ticket){
            throw new Error('Ticket Missing')
        }

        return ticket;
    } catch (error) {
        console.log(error)
    }
}

async function updateAgent(id, assignedAgent) {
    return await Tickets.findByIdAndUpdate(
        id,
        { assignedAgent: assignedAgent },
        { new: true, runValidators: true }
    );
}

export default {
    getTickets,
    createTickets,
    getTicket,
    updateAgent
}