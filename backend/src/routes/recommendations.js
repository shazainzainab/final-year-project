const express = require('express');
const router = express.Router();

const recommendationController = require('../controllers/recommendationController');

// POST /api/recommendations - Get full travel plan based on form input
router.post('/recommendations', recommendationController.getRecommendations);

// GET /api/destinations - List of all available destinations
router.get('/destinations', recommendationController.getDestinations);

// GET /api/destinations/:id/hotels - Hotels for a particular destination
router.get('/destinations/:id/hotels', recommendationController.getHotelsByDestination);

module.exports = router;