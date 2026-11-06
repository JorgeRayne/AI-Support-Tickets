import mongoose from "mongoose";
import Tickets from "../models/ticket.model.js";
import Ticket from "../models/ticket.model.js";
import canAccessTicket from "../utils/canAccessTictek.js";


async function getTickets() {
    console.log("Database:", mongoose.connection.name);

    const tickets = await Tickets.find();
    return tickets
}

async function createTickets(body) {
    const ticket = new Tickets({
        subject: body.subject,
        description: body.description,
        category: body.category,
        customer: user._id
    });

    return await ticket.save();
}

async function getTicket(user, id) {
    try {
        const ticket = Tickets.findById(id);

        if(!ticket){
            throw new Error('Ticket Missing')
        }

        if (!canAccessTicket(ticket, user)) {
            throw new Error("You are not authorized to view this ticket.");
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

    if(!canAccessTicket(ticket, user)) {
        throw new Error("You're not authoeize to update this ticket.");
    }

    return await ticket.findByIdAndUpdate(id, 
        {
            $set: { status }
        }, {
            returnDocument: 'after',
            runValidators: true,
        }
    )
}

async function updateTicket(ticket, user) {
    
    const ticket = await Ticket.findById(ticket.id);

    if (!ticket) {
        return null;
    }

    if(!canAccessTicket(ticket, user)){
        throw new Error("You're not authoeize to update this ticket.")
    };

    return await Ticket.findByIdAndUpdate(ticket._id, 
        {
            subject: ticket.subject,
            description: ticket.description,
            category: ticket.category
        },
        {
            returnDocument: 'after',
            runValidators: true
        }
    );
}

export default {
    getTickets,
    createTickets,
    getTicket,
    updateAgent,
    updateTicketStatus,
    updateTicket
}