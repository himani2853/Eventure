const Booking = require('../models/Booking');
const Event = require('../models/Event');

exports.bookEvent = async (req, res) => {
    try {
        const { eventId, ticketCount, ticketTypeName, paymentMethod, specialRequests } = req.body;
        const userId = req.user.id;

        if (!ticketTypeName) {
            return res.status(400).json({ message: 'Ticket type is required' });
        }
        if (!paymentMethod) {
            return res.status(400).json({ message: 'Payment method is required' });
        }
        if (ticketCount > 10) {
            return res.status(400).json({ message: 'Max 10 tickets per booking' });
        }

        // Atomic check and decrement for specific ticket type
        // Also check if event date is in the future
        const event = await Event.findOneAndUpdate(
            {
                _id: eventId,
                date: { $gte: new Date() }, // Ensure event is in the future
                'ticketTypes.name': ticketTypeName,
                'ticketTypes.availableSeats': { $gte: ticketCount }
            },
            {
                $inc: { 'ticketTypes.$.availableSeats': -ticketCount }
            },
            { new: true }
        );

        if (!event) {
            // Check if it failed due to date or seats
            const eventCheck = await Event.findById(eventId);
            if (eventCheck && new Date(eventCheck.date) < new Date()) {
                return res.status(400).json({ message: 'Cannot book past events' });
            }
            return res.status(400).json({ message: 'Not enough seats available or event not found' });
        }

        // Find the ticket type details to calculate price
        const ticketType = event.ticketTypes.find(t => t.name === ticketTypeName);
        const totalPrice = ticketType.price * ticketCount;

        const booking = new Booking({
            user: userId,
            event: eventId,
            ticketType: ticketTypeName,
            ticketCount,
            totalPrice,
            paymentMethod,
            specialRequests
        });

        await booking.save();

        res.status(201).json({ message: 'Booking successful', booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('event', 'title date location')
            .sort({ bookingDate: -1 });
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'username email')
            .populate('event', 'title date')
            .sort({ bookingDate: -1 });
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

