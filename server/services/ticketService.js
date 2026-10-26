import mongoose from "mongoose";
import Tickets from "../models/ticket.model.js";


async function getTickets() {
    console.log("Database:", mongoose.connection.name);
    // console.log("Collection:", Ticket.collection.name);

    const tickets = await Tickets.find();

    console.log("Found tickets:", tickets.length);
    return tickets
}

async function createTickets(body) {
    const ticket = new Tickets(body);

    ticket.save();
    return ticket;
}

async function getTicket(id) {
    try {
        const ticket = Tickets.findById(id);

        if(!ticket){
            throw new Error('Ticket Missing')
        }

        return ticket;
    } catch (error) {
        console.log(error)
    }
}

export default {
    getTickets,
    createTickets,
    getTicket,
}