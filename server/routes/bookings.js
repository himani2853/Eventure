const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { verifyToken } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

router.post('/', verifyToken, bookingController.bookEvent);
router.get('/my-bookings', verifyToken, bookingController.getUserBookings);
router.get('/all', verifyToken, isAdmin, bookingController.getAllBookings);

module.exports = router;
