const RecommendationModel = require('../models/recommendationModel');
const Joi = require('joi');

// Validation schema for recommendation request
const recommendationSchema = Joi.object({
    destination: Joi.string().required().min(2).max(100),
    startDate: Joi.date().iso().required(),
    days: Joi.number().integer().min(1).max(30).required(),
    budget: Joi.string().valid('low', 'medium', 'high').required(),
    companion: Joi.string().valid('solo', 'couple', 'family', 'friends').required(),
    activities: Joi.array().items(
        Joi.string().valid(
            'Beaches', 'City Views', 'Outdoor Plan', 'Events', 
            'River', 'Food Street', 'Shopping mall', 'Night Life'
        )
    ).min(1).required(),
    foodPreference: Joi.string().valid('halal', 'vegetarian', 'non-vegetarian').required(),
    additionalPreferences: Joi.string().allow('').max(500)
});

class RecommendationController {
    // Get all available destinations
    static async getDestinations(req, res) {
        try {
            const destinations = await RecommendationModel.getDestinations();
            
            res.status(200).json({
                success: true,
                message: 'Destinations fetched successfully',
                data: destinations
            });
        } catch (error) {
            console.error('Error in getDestinations:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch destinations',
                error: error.message
            });
        }
    }

    // Get city details
    static async getCityDetails(req, res) {
        try {
            const { cityName } = req.params;
            
            if (!cityName) {
                return res.status(400).json({
                    success: false,
                    message: 'City name is required'
                });
            }

            const cityDetails = await RecommendationModel.getCityDetails(cityName);
            
            if (!cityDetails) {
                return res.status(404).json({
                    success: false,
                    message: 'City not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'City details fetched successfully',
                data: cityDetails
            });
        } catch (error) {
            console.error('Error in getCityDetails:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch city details',
                error: error.message
            });
        }
    }

    // Generate travel recommendation
    static async generateRecommendation(req, res) {
        try {
            // Validate request body
            const { error, value } = recommendationSchema.validate(req.body);
            
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    error: error.details[0].message
                });
            }

            const preferences = value;
            
            // Generate recommendation
            const recommendation = await RecommendationModel.generateRecommendation(preferences);
            
            res.status(200).json({
                success: true,
                message: 'Travel recommendation generated successfully',
                data: recommendation
            });
        } catch (error) {
            console.error('Error in generateRecommendation:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to generate recommendation',
                error: error.message
            });
        }
    }

    // Get hotels by city and budget
    static async getHotels(req, res) {
        try {
            const { cityName, budget } = req.query;
            
            if (!cityName) {
                return res.status(400).json({
                    success: false,
                    message: 'City name is required'
                });
            }

            const hotels = await RecommendationModel.getHotelsByCity(cityName, budget || 'medium');
            
            res.status(200).json({
                success: true,
                message: 'Hotels fetched successfully',
                data: hotels
            });
        } catch (error) {
            console.error('Error in getHotels:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch hotels',
                error: error.message
            });
        }
    }

    // Get attractions by city and activities
    static async getAttractions(req, res) {
        try {
            const { cityName } = req.params;
            const { activities } = req.query;
            
            if (!cityName) {
                return res.status(400).json({
                    success: false,
                    message: 'City name is required'
                });
            }

            // Parse activities if it's a string
            let activitiesArray = activities || [];
            if (typeof activities === 'string') {
                activitiesArray = activities.split(',');
            }

            const attractions = await RecommendationModel.getAttractionsByActivities(cityName, activitiesArray);
            
            res.status(200).json({
                success: true,
                message: 'Attractions fetched successfully',
                data: attractions
            });
        } catch (error) {
            console.error('Error in getAttractions:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch attractions',
                error: error.message
            });
        }
    }

    // Get restaurants by city and food preference
    static async getRestaurants(req, res) {
        try {
            const { cityName } = req.params;
            const { foodPreference } = req.query;
            
            if (!cityName) {
                return res.status(400).json({
                    success: false,
                    message: 'City name is required'
                });
            }

            const restaurants = await RecommendationModel.getRestaurantsByFood(cityName, foodPreference || 'non-vegetarian');
            
            res.status(200).json({
                success: true,
                message: 'Restaurants fetched successfully',
                data: restaurants
            });
        } catch (error) {
            console.error('Error in getRestaurants:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch restaurants',
                error: error.message
            });
        }
    }

    // Health check endpoint
    static async healthCheck(req, res) {
        res.status(200).json({
            success: true,
            message: 'ViaItalia API is running successfully',
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        });
    }
}

module.exports = RecommendationController;