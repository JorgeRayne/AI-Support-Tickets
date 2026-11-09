import mongoose from "mongoose";
import Tickets from "../models/ticket.model.js";
import Ticket from "../models/ticket.model.js";
import canAccessTicket from "../utils/canAccessTictek.js";
import User from "../models/user.model.js";


async function getTickets(user) {
    let filter = {}

    if(user.role === 'customer') {
        filter.customer = user.sub;
    }

    if(user.role === 'agent'){
        filter.assignedAgent= user.sub
    }

    const tickets = await Ticket.find(filter)
        .populate("customer", "name email")
        .populate("assignedAgent", "name email")
        .sort({ createdAt: -1 });

    if(!tickets) {
        return null;
    }

    return tickets
}

async function createTickets(body, user) {
    const ticket = new Tickets({
        subject: body.subject,
        description: body.description,
        category: body.category,
        customer: user.sub
    });

    return await ticket.save();
}

async function getTicket(user, id) {
    const ticket = await Tickets.findById(id)
        .populate("customer", "name email")
        .populate("assignedAgent", "name email");

    if(!ticket){
        throw new Error('Ticket Missing')
    }

    const currentUser = {
        id: user.sub
    }

    if (!canAccessTicket(ticket, currentUser)) {
        throw new Error("You are not authorized to view this ticket.");
    }

    return ticket;
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

    const currentUser = await User.findById(user.sub);

    if(!canAccessTicket(ticket, currentUser)) {
        throw new Error("You're not authoeize to update this ticket.");
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(id, 
        {
            $set: { status }
        }, {
            returnDocument: 'after',
            runValidators: true,
        }
    )

    return updatedTicket;
}

async function updateTicket(ticket, user) {
    
    const targetTikcet = await Ticket.findById(ticket.id);

    if (!targetTikcet) {
        return null;
    }

    const currentUser = await User.findById(user.sub);

    if(!canAccessTicket(ticket, currentUser)){
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