export default function canAccessTicket(ticket, user) {
    if (user.role === 'admin') {
        return true;
    }

    if (user.role === 'customer') {
        return ticket.customer.toSting() === user._id.toSting()
    }

    if (user.role === 'agent') {
        return ticket.assignAgent?.toSting() === user._id.toSting()
    }

    return false
}