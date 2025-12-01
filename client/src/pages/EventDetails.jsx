import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    const fetchEvent = async () => {
        try {
            const response = await api.get(`/events/${id}`);
            setEvent(response.data);
        } catch (error) {
            console.error('Error fetching event:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const handleBook = (ticketTypeName) => {
        if (!user) {
            navigate('/login');
            return;
        }
        navigate(`/checkout/${id}?ticketType=${encodeURIComponent(ticketTypeName)}`);
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (!event) return <div className="text-center mt-10">Event not found</div>;

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
                    <div className="flex items-center text-gray-600 mb-6">
                        <span className="mr-4">📅 {new Date(event.date).toLocaleDateString()}</span>
                        <span>📍 {event.location}</span>
                    </div>
                    <p className="text-gray-700 text-lg mb-8">{event.description}</p>

                    <h2 className="text-2xl font-bold mb-4">Ticket Options</h2>
                    <div className="space-y-4">
                        {event.ticketTypes.map((ticket) => (
                            <div key={ticket._id} className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition">
                                <div>
                                    <h3 className="text-xl font-semibold">{ticket.name}</h3>
                                    <p className="text-gray-600">{ticket.description}</p>
                                    <p className="text-sm mt-1">
                                        <span className={`${ticket.availableSeats > 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                                            {ticket.availableSeats} seats left
                                        </span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-blue-600 mb-2">${ticket.price}</div>
                                    <button
                                        onClick={() => handleBook(ticket.name)}
                                        disabled={ticket.availableSeats === 0}
                                        className={`px-6 py-2 rounded-lg text-white font-medium transition ${ticket.availableSeats > 0
                                            ? 'bg-blue-600 hover:bg-blue-700'
                                            : 'bg-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        {ticket.availableSeats > 0 ? 'Book Now' : 'Sold Out'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
