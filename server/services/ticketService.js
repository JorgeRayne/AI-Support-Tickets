import Tickets from "../models/ticket.model.js";
import Ticket from "../models/ticket.model.js";
import canAccessTicket from "../utils/canAccessTictek.js";

async function getTickets(user) {
    let filter;

    switch (user.role) {
        case 'customer':
            filter = { customer: user.sub };
            break;

        case 'agent':
            filter = { assignedAgent: user.sub };
            break;

        case 'admin':
            filter = {};
            break;

        default: {
            const error = new Error('Invalid user role.');
            error.statusCode = 403;
            throw error;
        }
    }

    const tickets = await Ticket.find(filter)
        .populate("customer", "name email")
        .populate("assignedAgent", "name email")
        .sort({ createdAt: -1 });

    return tickets
}

async function createTickets(body, user) {
    try {
        const ticket = new Ticket({
            subject: body.subject,
            description: body.description,
            category: body.category,
            customer: user.sub
        });

        return await ticket.save();

    } catch (error) {
        if (error.code === 11000) {
            const err = new Error('Ticket already exists.');
            err.statusCode = 409;
            throw err;
        }

        throw error;
    }
}

async function getTicket(user, id) {
    const ticket = await Tickets.findById(id)
        .populate("customer", "name email")
        .populate("assignedAgent", "name email");

    if(!ticket){
        const error = new Error('Ticket doest exist');
        error.statusCode = 404;
        throw error;
    }

    const currentUser = {
        id: user.sub,
        role: user.role
    }

    if (!canAccessTicket(ticket, currentUser)) {
        const error = new Error("You are not authorized to view this ticket.");
        error.statusCode = 401;
        throw error;
    }

    return ticket;
}

async function updateTicketStatus(id, status, user) {

    const ticket = await Ticket.findById(id)

    if(!ticket) {
        const error = new Error('Ticket doest exist');
        error.statusCode = 404;
        throw error;
    }

    const currentUser = {
        _id: user.sub,
        role: user.role
    }

    if(!canAccessTicket(ticket, currentUser)) {
        const error = new Error("You are not authorized to view this ticket.");
        error.statusCode = 401;
        throw error;
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

    if(!targetTikcet) {
        const error = new Error('Ticket doest exist');
        error.statusCode = 404;
        throw error;
    }

    const currentUser = {
        _id: user.sub,
        role: user.role
    }

    if(!canAccessTicket(targetTikcet, currentUser)){
        const error = new Error("You are not authorized to view this ticket.");
        error.statusCode = 401;
        throw error;
    };
    //add validation each field
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
    updateTicketStatus,
    updateTicket
}