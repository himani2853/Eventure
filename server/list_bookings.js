const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Booking = require('./models/Booking');
const User = require('./models/User'); // Ensure models are registered
const Event = require('./models/Event');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const listBookings = async () => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'username email')
            .populate('event', 'title date location');

        console.log('\n--- All Bookings ---\n');

        if (bookings.length === 0) {
            console.log('No bookings found.');
        } else {
            bookings.forEach((booking, index) => {
                console.log(`Booking #${index + 1}`);
                console.log(`ID: ${booking._id}`);
                console.log(`User: ${booking.user ? booking.user.username : 'Unknown'} (${booking.user ? booking.user.email : 'N/A'})`);
                console.log(`Event: ${booking.event ? booking.event.title : 'Unknown'}`);
                console.log(`Date: ${booking.event ? new Date(booking.event.date).toLocaleDateString() : 'N/A'}`);
                console.log(`Tickets: ${booking.ticketCount}`);
                console.log(`Total Price: $${booking.totalPrice}`);
                console.log('-------------------------\n');
            });
        }

        process.exit();
    } catch (error) {
        console.error('Error listing bookings:', error);
        process.exit(1);
    }
};

listBookings();
