import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="bg-blue-600 text-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold tracking-wide hover:text-gray-100 transition duration-200">
                    Eventure
                </Link>
                <div>
                    {user ? (
                        <div className="flex items-center space-x-6">
                            {user.role === 'admin' && (
                                <Link to="/admin" className="text-blue-100 hover:text-white font-medium transition">
                                    Admin Dashboard
                                </Link>
                            )}
                            <Link to="/my-bookings" className="text-blue-100 hover:text-white font-medium transition">
                                My Bookings
                            </Link>
                            <span className="font-medium text-blue-100">Welcome, {user.username || 'User'}</span>
                            <button
                                onClick={logout}
                                className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition duration-200 font-semibold shadow-sm"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="hover:text-blue-200 font-medium transition duration-200">
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 font-medium transition duration-200 shadow-sm"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
