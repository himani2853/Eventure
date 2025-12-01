import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('/events');
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600 font-semibold">Loading events...</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-10 px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Upcoming Events</h1>
                <input
                    type="text"
                    placeholder="Search events or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            {filteredEvents.length === 0 ? (
                <div className="text-center text-gray-500 text-lg mt-10">No events found matching your search.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEvents.map(event => (
                        <div key={event._id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 duration-300 flex flex-col">
                            <div className="p-6 flex-grow">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h2>
                                <div className="text-gray-600 mb-4">
                                    <p className="flex items-center mb-1">
                                        <span className="mr-2">📅</span>
                                        {new Date(event.date).toLocaleDateString()}
                                    </p>
                                    <p className="flex items-center">
                                        <span className="mr-2">📍</span>
                                        {event.location}
                                    </p>
                                </div>
                                <p className="text-gray-700 mb-4 line-clamp-3 text-sm">{event.description}</p>

                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="text-sm text-gray-500 mb-2">Starting from</div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-blue-600 text-lg font-bold">
                                            ${Math.min(...event.ticketTypes.map(t => t.price))}
                                        </span>
                                        <Link
                                            to={`/events/${event._id}`}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
