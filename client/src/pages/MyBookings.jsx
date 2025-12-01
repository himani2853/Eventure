import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await api.get('/bookings/my-bookings', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBookings(response.data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user, navigate]);

    if (loading) return <div className="text-center mt-10">Loading bookings...</div>;

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

            {bookings.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-xl shadow">
                    <p className="text-gray-600 text-lg mb-4">You haven't booked any events yet.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Browse Events
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Event</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Location</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Ticket Type</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Count</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Total Price</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {bookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {booking.event ? booking.event.title : 'Unknown Event'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {booking.event ? new Date(booking.event.date).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {booking.event ? booking.event.location : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{booking.ticketType}</td>
                                        <td className="px-6 py-4 text-gray-600">{booking.ticketCount}</td>
                                        <td className="px-6 py-4 font-medium text-blue-600">${booking.totalPrice}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                Confirmed
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
