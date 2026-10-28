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
    try {
        const ticket = await ticketService.getTicket(req.params.id);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: ticket,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

async function updateAgent(req, res) {
    const { id } = req.params;
    const { assignedAgent } = req.body;

    if (!assignedAgent) {
        return res.status(400).json({
            success: false,
            message: "assignedAgent is required",
        });
    }

    try {
        const ticket = await ticketService.updateAgent(id, assignedAgent);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Agent assigned successfully",
            data: ticket,
        });
    } catch (error) {
        console.error("Error assigning agent:", error);

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

export default{
    getTickets,
    createTicket,
    getTicket,
    updateAgent
}