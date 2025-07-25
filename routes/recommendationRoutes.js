const express = require('express');
const router = express.Router();
const RecommendationController = require('../controllers/recommendationController');

// Health check route
router.get('/health', RecommendationController.healthCheck);

// Get all destinations
router.get('/destinations', RecommendationController.getDestinations);

// Get city details by name
router.get('/cities/:cityName', RecommendationController.getCityDetails);

// Generate travel recommendation (main endpoint)
router.post('/recommend', RecommendationController.generateRecommendation);

// Get hotels by city and budget
router.get('/hotels', RecommendationController.getHotels);

// Get attractions by city and activities
router.get('/attractions/:cityName', RecommendationController.getAttractions);

// Get restaurants by city and food preference
router.get('/restaurants/:cityName', RecommendationController.getRestaurants);

module.exports = router;