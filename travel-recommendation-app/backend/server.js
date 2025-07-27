const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-recommendation')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import models
const Destination = require('./models/Destination');
const TripRecommendation = require('./models/TripRecommendation');

// Routes
app.get('/api/destinations', async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

app.post('/api/recommend', async (req, res) => {
  try {
    const {
      destination,
      startDate,
      numberOfDays,
      budget,
      companion,
      activities,
      foodPreference,
      furtherPreferences
    } = req.body;

    // Find destination details
    const destinationData = await Destination.findOne({ name: destination });
    if (!destinationData) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    // Get weather data
    const weatherData = await getWeatherData(destinationData.coordinates);

    // Generate itinerary
    const itinerary = generateItinerary(destinationData, numberOfDays, activities);

    // Generate hotel recommendations
    const hotels = generateHotelRecommendations(destinationData, budget, numberOfDays);

    // Calculate estimated costs
    const costSummary = calculateCosts(hotels, numberOfDays, budget, companion);

    const recommendation = new TripRecommendation({
      destination,
      startDate,
      numberOfDays,
      budget,
      companion,
      activities,
      foodPreference,
      furtherPreferences,
      weatherData,
      itinerary,
      hotels,
      costSummary
    });

    await recommendation.save();

    res.json({
      destination: destinationData,
      weatherData,
      itinerary,
      hotels,
      costSummary
    });

  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ error: 'Failed to generate recommendation' });
  }
});

// Helper functions
async function getWeatherData(coordinates) {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lng}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );
    
    // Extract 3-day forecast
    const dailyData = response.data.list.filter((item, index) => index % 8 === 0).slice(0, 3);
    
    return dailyData.map(day => ({
      date: new Date(day.dt * 1000).toLocaleDateString(),
      temp: Math.round(day.main.temp),
      description: day.weather[0].description,
      icon: day.weather[0].icon
    }));
  } catch (error) {
    console.error('Weather API error:', error);
    return [];
  }
}

function generateItinerary(destination, numberOfDays, activities) {
  const itinerary = [];
  const availableActivities = destination.activities || [];
  
  for (let day = 1; day <= numberOfDays; day++) {
    const dayActivities = [];
    
    // Morning activity
    if (availableActivities.length > 0) {
      dayActivities.push({
        time: '09:00 AM',
        activity: availableActivities[Math.floor(Math.random() * availableActivities.length)],
        description: 'Explore the local attractions'
      });
    }
    
    // Afternoon activity
    if (availableActivities.length > 1) {
      dayActivities.push({
        time: '02:00 PM',
        activity: availableActivities[Math.floor(Math.random() * availableActivities.length)],
        description: 'Visit popular landmarks'
      });
    }
    
    // Evening activity
    dayActivities.push({
      time: '07:00 PM',
      activity: 'Dinner at local restaurant',
      description: 'Experience local cuisine'
    });
    
    itinerary.push({
      day: day,
      activities: dayActivities
    });
  }
  
  return itinerary;
}

function generateHotelRecommendations(destination, budget, numberOfDays) {
  const budgetMultiplier = {
    low: 0.7,
    medium: 1.0,
    high: 1.5
  };
  
  const basePrice = 100; // Base price per night
  const price = Math.round(basePrice * budgetMultiplier[budget] * (1 + Math.random() * 0.5));
  
  return [
    {
      name: `${destination.name} Grand Hotel`,
      price: price,
      rating: 4.5,
      link: `https://booking.com/hotel/${destination.name.toLowerCase().replace(' ', '-')}`,
      amenities: ['WiFi', 'Pool', 'Restaurant']
    },
    {
      name: `${destination.name} Comfort Inn`,
      price: Math.round(price * 0.8),
      rating: 4.0,
      link: `https://booking.com/hotel/${destination.name.toLowerCase().replace(' ', '-')}-comfort`,
      amenities: ['WiFi', 'Breakfast']
    },
    {
      name: `${destination.name} Luxury Resort`,
      price: Math.round(price * 1.3),
      rating: 4.8,
      link: `https://booking.com/hotel/${destination.name.toLowerCase().replace(' ', '-')}-luxury`,
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym']
    }
  ];
}

function calculateCosts(hotels, numberOfDays, budget, companion) {
  const accommodationCost = hotels[0].price * numberOfDays;
  
  const foodCostPerDay = {
    low: 30,
    medium: 50,
    high: 80
  }[budget];
  
  const transportCostPerDay = {
    low: 20,
    medium: 35,
    high: 60
  }[budget];
  
  const companionMultiplier = {
    solo: 1,
    couple: 1.8,
    family: 2.5,
    friends: 1.5
  }[companion];
  
  const totalFoodCost = foodCostPerDay * numberOfDays * companionMultiplier;
  const totalTransportCost = transportCostPerDay * numberOfDays * companionMultiplier;
  const totalCost = accommodationCost + totalFoodCost + totalTransportCost;
  
  return {
    accommodation: accommodationCost,
    food: totalFoodCost,
    transport: totalTransportCost,
    total: totalCost
  };
}

// Seed data endpoint
app.post('/api/seed', async (req, res) => {
  try {
    await Destination.deleteMany({});
    
    const destinations = [
      {
        name: 'Rome, Italy',
        country: 'Italy',
        description: 'The Eternal City, home to ancient ruins, art, and culture. Rome offers a perfect blend of history and modern Italian life.',
        coordinates: { lat: 41.9028, lng: 12.4964 },
        imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
        activities: ['Colosseum', 'Vatican Museums', 'Trevi Fountain', 'Roman Forum', 'Pantheon'],
        averageTemperature: 15,
        bestTimeToVisit: 'Spring and Fall'
      },
      {
        name: 'Paris, France',
        country: 'France',
        description: 'The City of Light, famous for its art, fashion, gastronomy and culture. Paris is a dream destination for many travelers.',
        coordinates: { lat: 48.8566, lng: 2.3522 },
        imageUrl: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800',
        activities: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Champs-Élysées', 'Arc de Triomphe'],
        averageTemperature: 12,
        bestTimeToVisit: 'Spring and Fall'
      },
      {
        name: 'Tokyo, Japan',
        country: 'Japan',
        description: 'A fascinating blend of ultramodern and traditional, Tokyo offers everything from neon-lit skyscrapers to historic temples.',
        coordinates: { lat: 35.6762, lng: 139.6503 },
        imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
        activities: ['Shibuya Crossing', 'Tokyo Tower', 'Senso-ji Temple', 'Tsukiji Market', 'Meiji Shrine'],
        averageTemperature: 16,
        bestTimeToVisit: 'Spring and Fall'
      }
    ];
    
    await Destination.insertMany(destinations);
    res.json({ message: 'Database seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to seed database' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});