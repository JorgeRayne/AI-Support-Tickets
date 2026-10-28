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
        const ticket = await ticketService.getTicket(req.params.id) // catch errors

        if(!ticket){
            throw new Error('Ticket not Found')
        }
        res.status(201).json({
            message: 'success',
            data: ticket
        })
    } catch (error) {
        res.status(201).json({
            message: 'failed',
            data: ticket
        })
    }   
    
}

async function updateAgent(req, res) {
    const id = req.params.id;
    const {assignedAgent} = req.body;

    if(!assignedAgent){
         return res.json({
            message:'failed',
        });
    }

    try {
        const request = await ticketService.updateAgent(id, assignedAgent)

        if(!request){
            return res.status(400).json({
                message: 'Unable to update'
            });
        }
    } catch (error) {
        return res.status(400).json({
            message:error
        })
    }

    


}

export default{
    getTickets,
    createTicket,
    getTicket,
    updateAgent
}