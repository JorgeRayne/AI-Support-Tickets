import express from 'express';
import ticketController from '../contorllers/ticketController.js';

const ticket = express.Router();

ticket.post('/', ticketController.createTicket);

ticket.get('/', ticketController.getTickets);

ticket.get('/:id' , ticketController.getTicket);

ticket.patch('/:id/assign', ticketController.updateAgent)

ticket.patch('/:id/status', (req, res) => {

})

export default ticket