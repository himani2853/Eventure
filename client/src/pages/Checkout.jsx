import { useEffect, useState, useContext } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const Checkout = () => {
    const { eventId } = useParams();
    const [searchParams] = useSearchParams();
    const ticketTypeName = searchParams.get('ticketType');
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [event, setEvent] = useState(null);
    const [ticketCount, setTicketCount] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('Credit Card');
    const [specialRequests, setSpecialRequests] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchEvent = async () => {
            try {
                const response = await api.get(`/events/${eventId}`);
                setEvent(response.data);
            } catch (error) {
                console.error('Error fetching event:', error);
                setError('Failed to load event details.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [eventId, user, navigate]);

    const handleConfirmBooking = async (e) => {
        e.preventDefault();
        setError('');

        const token = localStorage.getItem('token');

        try {
            await api.post('/bookings',
                {
                    eventId,
                    ticketCount,
                    ticketTypeName,
                    paymentMethod,
                    specialRequests
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Booking Confirmed! Thank you for your purchase.");
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || "Booking failed");
        }
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;
    if (!event) return <div className="text-center mt-10">Event not found</div>;

    const ticketType = event.ticketTypes.find(t => t.name === ticketTypeName);
    if (!ticketType) return <div className="text-center mt-10">Invalid ticket type</div>;

    const totalPrice = ticketType.price * ticketCount;

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <div className="bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

                <div className="mb-6 border-b pb-6">
                    <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                    <p className="text-gray-600">Ticket Type: <span className="font-medium text-gray-800">{ticketTypeName}</span></p>
                    <p className="text-gray-600">Price per ticket: <span className="font-medium text-gray-800">${ticketType.price}</span></p>
                </div>

                <form onSubmit={handleConfirmBooking}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Number of Tickets</label>
                        <input
                            type="number"
                            min="1"
                            max={ticketType.availableSeats}
                            value={ticketCount}
                            onChange={(e) => setTicketCount(parseInt(e.target.value))}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        />
                        <p className="text-sm text-gray-500 mt-1">{ticketType.availableSeats} seats available</p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Payment Method</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="Credit Card">Credit Card</option>
                            <option value="PayPal">PayPal</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">Special Requests (Optional)</label>
                        <textarea
                            value={specialRequests}
                            onChange={(e) => setSpecialRequests(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            rows="3"
                            placeholder="Any dietary restrictions or accessibility needs?"
                        ></textarea>
                    </div>

                    <div className="flex justify-between items-center mb-6 text-xl font-bold">
                        <span>Total Price:</span>
                        <span className="text-blue-600">${totalPrice}</span>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition duration-200"
                    >
                        Confirm Booking
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
