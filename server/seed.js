const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/Event');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const seedEvents = async () => {
    try {
        await Event.deleteMany();

        const events = [
            {
                title: 'Tech Conference 2025',
                description: 'Join us for the biggest tech conference of the year featuring industry leaders and innovative workshops.',
                date: new Date('2025-06-15'),
                location: 'San Francisco, CA',
                ticketTypes: [
                    { name: 'General Admission', price: 299, description: 'Access to all main stage talks.', totalSeats: 300, availableSeats: 300 },
                    { name: 'VIP', price: 599, description: 'Front row seating, exclusive lounge access, and after-party.', totalSeats: 50, availableSeats: 50 },
                    { name: 'Student', price: 99, description: 'Valid student ID required.', totalSeats: 150, availableSeats: 150 }
                ]
            },
            {
                title: 'Summer Music Festival',
                description: 'A weekend of live music, food, and fun under the sun. Featuring top artists from around the globe.',
                date: new Date('2025-07-20'),
                location: 'Austin, TX',
                ticketTypes: [
                    { name: 'Weekend Pass', price: 150, description: 'Access for the full weekend.', totalSeats: 1500, availableSeats: 1500 },
                    { name: 'Day Pass', price: 80, description: 'Valid for one day only.', totalSeats: 500, availableSeats: 500 },
                    { name: 'Backstage Experience', price: 400, description: 'Meet and greet with artists.', totalSeats: 20, availableSeats: 20 }
                ]
            },
            {
                title: 'React Workshop',
                description: 'Hands-on workshop to master React and build modern web applications.',
                date: new Date('2025-05-10'),
                location: 'New York, NY',
                ticketTypes: [
                    { name: 'Standard', price: 99, description: 'Workshop materials included.', totalSeats: 50, availableSeats: 50 }
                ]
            },
            {
                title: 'Startup Networking Night',
                description: 'Connect with fellow entrepreneurs, investors, and innovators.',
                date: new Date('2025-08-05'),
                location: 'London, UK',
                ticketTypes: [
                    { name: 'Entry', price: 25, description: 'Includes 2 drink tickets.', totalSeats: 100, availableSeats: 100 }
                ]
            },
            {
                title: 'AI & Machine Learning Summit',
                description: 'Explore the future of AI with experts in the field.',
                date: new Date('2025-09-12'),
                location: 'Boston, MA',
                ticketTypes: [
                    { name: 'Regular', price: 350, description: 'Full conference access.', totalSeats: 250, availableSeats: 250 },
                    { name: 'Workshop Add-on', price: 150, description: 'Extra day of hands-on training.', totalSeats: 50, availableSeats: 50 }
                ]
            },
            {
                title: 'Photography Masterclass',
                description: 'Learn the art of photography from award-winning photographers.',
                date: new Date('2025-04-25'),
                location: 'Paris, France',
                ticketTypes: [
                    { name: 'Participant', price: 200, description: 'Bring your own camera.', totalSeats: 30, availableSeats: 30 }
                ]
            }
        ];

        await Event.insertMany(events);
        console.log('Events seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding events:', error);
        process.exit(1);
    }
};

seedEvents();
