const express = require('express');
const router = express.Router();
const axios = require('axios');
const Destination = require('../models/Destination');
const TripRecommendation = require('../models/TripRecommendation');

// POST /api/recommend - Generate trip recommendation
router.post('/', async (req, res) => {
  try {
    const {
      destination,
      startingDate,
      days,
      budget,
      companion,
      activities,
      foodPreference,
      furtherPreferences
    } = req.body;

    // Find destination details
    const destinationData = await Destination.findOne({ 
      name: { $regex: new RegExp(destination, 'i') } 
    });

    if (!destinationData) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    // Get weather forecast
    let weatherForecast = [];
    try {
      if (process.env.OPENWEATHER_API_KEY && process.env.OPENWEATHER_API_KEY !== 'your_openweather_api_key_here') {
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${destinationData.coordinates.lat}&lon=${destinationData.coordinates.lng}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
        );
        
        // Get next 3 days forecast
        const forecasts = weatherResponse.data.list.slice(0, 8); // 8 forecasts for 3 days (every 3 hours)
        weatherForecast = forecasts.map(forecast => ({
          date: new Date(forecast.dt * 1000),
          temperature: Math.round(forecast.main.temp),
          description: forecast.weather[0].description,
          icon: forecast.weather[0].icon
        }));
      } else {
        // Mock weather data if no API key
        weatherForecast = [
          { date: new Date(), temperature: 22, description: 'Sunny', icon: '01d' },
          { date: new Date(Date.now() + 86400000), temperature: 24, description: 'Partly cloudy', icon: '02d' },
          { date: new Date(Date.now() + 172800000), temperature: 20, description: 'Light rain', icon: '10d' }
        ];
      }
    } catch (weatherError) {
      console.error('Weather API error:', weatherError);
      // Use mock data on weather API failure
      weatherForecast = [
        { date: new Date(), temperature: 22, description: 'Sunny', icon: '01d' },
        { date: new Date(Date.now() + 86400000), temperature: 24, description: 'Partly cloudy', icon: '02d' },
        { date: new Date(Date.now() + 172800000), temperature: 20, description: 'Light rain', icon: '10d' }
      ];
    }

    // Generate itinerary based on preferences
    const generatedItinerary = generateItinerary(destinationData, days, activities, companion);

    // Calculate estimated costs
    const estimatedCost = calculateEstimatedCost(destinationData, days, budget, companion);

    // Create trip recommendation
    const tripRecommendation = new TripRecommendation({
      destination,
      startingDate: new Date(startingDate),
      days,
      budget,
      companion,
      activities,
      foodPreference,
      furtherPreferences,
      generatedItinerary,
      estimatedCost,
      weatherForecast
    });

    await tripRecommendation.save();

    // Return complete recommendation data
    const response = {
      destination: destinationData,
      tripDetails: {
        startingDate: new Date(startingDate),
        endDate: new Date(new Date(startingDate).getTime() + (days - 1) * 24 * 60 * 60 * 1000),
        days,
        budget,
        companion,
        activities,
        foodPreference
      },
      itinerary: generatedItinerary,
      estimatedCost,
      weatherForecast,
      hotels: destinationData.hotels
    };

    res.json(response);
  } catch (error) {
    console.error('Error generating recommendation:', error);
    res.status(500).json({ message: 'Error generating recommendation', error: error.message });
  }
});

// Helper function to generate itinerary
function generateItinerary(destination, days, preferredActivities, companion) {
  const itinerary = [];
  const availableActivities = destination.activities.filter(activity => 
    preferredActivities.includes(activity.type)
  );

  // If no matching activities, use all activities
  const activitiesToUse = availableActivities.length > 0 ? availableActivities : destination.activities;

  for (let day = 1; day <= days; day++) {
    const dayActivities = [];
    const activityCount = companion === 'family' ? 2 : companion === 'couple' ? 3 : 2;
    
    // Select activities for this day
    for (let i = 0; i < activityCount && i < activitiesToUse.length; i++) {
      const activityIndex = (day - 1 + i) % activitiesToUse.length;
      dayActivities.push(activitiesToUse[activityIndex].name);
    }

    let description = '';
    if (day === 1) {
      description = `Start your journey in ${destination.name}. ${dayActivities.join(', ')}. Perfect for getting acquainted with the city.`;
    } else if (day === days) {
      description = `Final day in ${destination.name}. Enjoy ${dayActivities.join(' and ')} before departure.`;
    } else {
      description = `Explore ${dayActivities.join(' and ')}. A great day for ${companion} travelers.`;
    }

    itinerary.push({
      day,
      activities: dayActivities,
      description
    });
  }

  return itinerary;
}

// Helper function to calculate estimated cost
function calculateEstimatedCost(destination, days, budget, companion) {
  const costs = destination.averageCosts;
  const multiplier = companion === 'couple' ? 2 : companion === 'family' ? 4 : companion === 'friends' ? 3 : 1;

  const accommodation = costs.accommodation[budget] * days * (companion === 'solo' ? 1 : 1);
  const food = costs.food[budget] * days * multiplier;
  const transport = costs.transport[budget] * multiplier;

  return {
    accommodation,
    food,
    transport,
    total: accommodation + food + transport
  };
}

module.exports = router;