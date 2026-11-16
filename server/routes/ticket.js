import express from 'express';
import ticketController from '../contorllers/ticketController.js';
import authorize from '../middleware/authorization.middleware.js'
import authToken from '../middleware/authToken.middleware.js';

const ticket = express.Router();

ticket.post('/', authToken, authorize('create:ticket'), ticketController.createTicket);

ticket.get('/', authToken, authorize('view:ticket'), ticketController.getTickets);

ticket.get('/:id' , authToken, authorize('view:ticket'), ticketController.getTicket);

ticket.patch('/:id/status', authToken, authorize('update:ticket'), ticketController.updateStatus)

export default ticket