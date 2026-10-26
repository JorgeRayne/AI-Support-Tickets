import ticketService from '../services/ticketService.js';

async function getTickets(req, res) {
    try {
        const tickets = await ticketService.getTickets();

        return res.status(200).json({
            success: true,
            data: tickets,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch tickets",
        });
    }
}

async function createTicket(req, res) {
    try {
        const ticket = await ticketService.createTickets(req.body);

        return res.status(201).json({
            message: 'New Ticket Added',
            data: ticket,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email already exists",
            });
        }

        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({
                message: error.message,
            });
        }

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

async function getTicket(req, res) {
    const ticket = await ticketService.getTicket(req.params.id)
    console.log(ticket)
    res.status(201).json({
        message: 'success',
        data: ticket
    })
    
}

export default{
    getTickets,
    createTicket,
    getTicket
}