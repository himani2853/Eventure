const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

const { verifyToken } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);
router.post('/', verifyToken, isAdmin, eventController.createEvent);

module.exports = router;
