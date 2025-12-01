const mongoose = require('mongoose');

const TicketTypeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    totalSeats: { type: Number, required: true },
    availableSeats: { type: Number, required: true }
});

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    // Keeping base price/seats for backward compatibility or general info if needed, 
    // but logic should primarily use ticketTypes now.
    price: { type: Number },
    totalSeats: { type: Number },
    availableSeats: { type: Number },
    ticketTypes: [TicketTypeSchema]
});

module.exports = mongoose.model('Event', EventSchema);
