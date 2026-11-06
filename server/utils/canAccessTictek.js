export default function canAccessTicket(ticket, user) {
    if (user.role === 'admin') {
        return true;
    }

    if (user.role === 'customer') {
        return ticket.customer.toString() === user._id.toString()
    }

    if (user.role === 'agent') {
        return ticket.assignAgent?.toString() === user._id.toString()
    }

    return false
}