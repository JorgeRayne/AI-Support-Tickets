import express from 'express';
import ticketController from '../contorllers/ticketController.js';
import authorize from '../middleware/authorization.middleware.js'

const ticket = express.Router();

ticket.post('/', authorize('create:ticket'), ticketController.createTicket);

ticket.get('/', authorize('view:ticket'), ticketController.getTickets);

ticket.get('/:id' , authorize('view:ticket'), ticketController.getTicket);

ticket.patch('/:id/assign', authorize('update:ticket'), ticketController.updateAgent)

ticket.patch('/:id/status', authorize('update:ticket'), ticketController.updateStatus)

export default ticket