import mongoose from "mongoose";
import Tickets from "../models/ticket.model.js";
import Ticket from "../models/ticket.model.js";


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

async function updateTicketStatus(id, status, user) {

    const ticket = await Ticket.findById(id)

    if(!ticket) {
        throw new Error('Ticket not found');
    }

    if (user.role === 'customer') {
        if(ticket.customer.toString() !== user._id.toString()) {
            throw new Error('You cannot update this ticket.');
        }
    } else if (user.role === 'agent') {
        if (ticket.assignedAgent.toString() !== user._id.toString()) {
            throw new Error('You cannot update this ticket.');    
        }
    } else if (user.role !== 'admin') {
        throw new Error('You cannot update this ticket.');
    }

    return await ticket.findByIdAndUpdate(id, status, {
        returnDocument: 'after',
        runValidators
    })
}

export default {
    getTickets,
    createTickets,
    getTicket,
    updateAgent,
    updateTicketStatus
}