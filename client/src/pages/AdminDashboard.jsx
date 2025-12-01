import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Event Form State
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        price: '',
        totalSeats: ''
    });

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }

        const fetchAllBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await api.get('/bookings/all', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBookings(response.data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllBookings();
    }, [user, navigate]);

    const handleInputChange = (e) => {
        setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            // Basic ticket type creation for simplicity based on price/seats
            const eventData = {
                ...newEvent,
                ticketTypes: [
                    {
                        name: 'Standard',
                        price: Number(newEvent.price),
                        description: 'General Admission',
                        totalSeats: Number(newEvent.totalSeats),
                        availableSeats: Number(newEvent.totalSeats)
                    }
                ]
            };

            await api.post('/events', eventData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Event Created Successfully!');
            setNewEvent({ title: '', description: '', date: '', location: '', price: '', totalSeats: '' });
        } catch (error) {
            console.error('Error creating event:', error);
            alert('Failed to create event');
        }
    };

    if (loading) return <div className="text-center mt-10">Loading Admin Dashboard...</div>;

    return (
        <div className="max-w-7xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Create Event Section */}
                <div className="bg-white rounded-xl shadow-lg p-8 h-fit">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Event</h2>
                    <form onSubmit={handleCreateEvent} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Title</label>
                            <input type="text" name="title" value={newEvent.title} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Description</label>
                            <textarea name="description" value={newEvent.description} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" rows="3"></textarea>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Date</label>
                                <input type="date" name="date" value={newEvent.date} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Location</label>
                                <input type="text" name="location" value={newEvent.location} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Price ($)</label>
                                <input type="number" name="price" value={newEvent.price} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Total Seats</label>
                                <input type="number" name="totalSeats" value={newEvent.totalSeats} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">Create Event</button>
                    </form>
                </div>

                {/* All Bookings Section */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">All Bookings</h2>
                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-gray-700">User</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Event</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Date</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Tix</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {bookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm">
                                            <div className="font-medium text-gray-900">{booking.user ? booking.user.username : 'Unknown'}</div>
                                            <div className="text-gray-500 text-xs">{booking.user ? booking.user.email : 'N/A'}</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{booking.event ? booking.event.title : 'Unknown'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{booking.event ? new Date(booking.event.date).toLocaleDateString() : 'N/A'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{booking.ticketCount}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-blue-600">${booking.totalPrice}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
