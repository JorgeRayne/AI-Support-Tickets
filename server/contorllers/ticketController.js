import ticketService from '../services/ticketService.js';

async function getTickets(req, res, next) {
    try {
        const user = req.user;

        const tickets = await ticketService.getTickets(user);

        return res.status(200).json({
            success: true,
            data: tickets,
        });
    } catch (error) {
        next(error)
    }
}

async function createTicket(req, res, next) {
    try {
        const ticket = await ticketService.createTickets(req.body, req.user);

        return res.status(201).json({
            message: 'Ticket created successfully.',
            data: ticket,
        });
    } catch (error) {
        next(error)
    }
}

async function getTicket(req, res, next) {
    try {
        const ticket = await ticketService.getTicket(req.user, req.params.id);

        return res.status(200).json({
            success: true,
            data: ticket,
        });
    } catch (error) {
        next(error);
    }
}


async function updateStatus(req, res, next){
    try {
        const { id } = req.params;
        const { status } = req.body;
        const user = req.user;

        if(!status){
            const error = new Error("Status is required");
            error.statusCode = 400;
            throw error;
        }

        const ticket = await ticketService.updateTicketStatus(id, status, user);

        return res.status(200).json({
            success: true,
            message: "Ticket status updated successfully.",
            data: ticket,
        });
    } catch (error) {
        next(error);
    }
}

async function updateTicket(req, res, next) {
    try {
        const {subject, description, category, } = req.body;
        const id = req.params.id
        const user = req.user;

        const ticketBody = {
            id: id,
            subject, 
            description,
            category,
        }

        const updateTicket = await ticketService.updateTicket(ticketBody, user);
        return res.status(200).json({
            success: true,
            message: "Ticket update successfully.",
            data: updateTicket,
        });
        
    } catch (error) {
        next(error);
    }
}

export default{
    getTickets,
    createTicket,
    getTicket,
    //updateAgent,
    updateStatus,
    updateTicket
}