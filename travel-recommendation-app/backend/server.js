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
    res.status(500).json({ message: 'Error fetching destinations', error: error.message });
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
      return res.status(404).json({ message: 'Destination not found' });
    }

    // Get weather data
    const weatherData = await getWeatherData(destinationData.coordinates);

    // Generate itinerary
    const itinerary = generateItinerary(destinationData, numberOfDays, activities);

    // Generate hotel recommendations
    const hotels = generateHotelRecommendations(destinationData, budget, numberOfDays);

    // Calculate estimated costs
    const costs = calculateCosts(budget, numberOfDays, companion, hotels);

    // Create recommendation object
    const recommendation = {
      destination: destinationData,
      startDate,
      endDate: new Date(new Date(startDate).getTime() + (numberOfDays - 1) * 24 * 60 * 60 * 1000),
      numberOfDays,
      budget,
      companion,
      activities,
      foodPreference,
      furtherPreferences,
      weather: weatherData,
      itinerary,
      hotels,
      costs
    };

    // Save to database
    const tripRecommendation = new TripRecommendation(recommendation);
    await tripRecommendation.save();

    res.json(recommendation);
  } catch (error) {
    res.status(500).json({ message: 'Error generating recommendation', error: error.message });
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
    const dayPlan = {
      day: day,
      activities: []
    };

    // Distribute activities across days
    if (day === 1) {
      dayPlan.activities.push('Arrival and check-in');
      dayPlan.activities.push('Explore city center');
    } else if (day === numberOfDays) {
      dayPlan.activities.push('Final day exploration');
      dayPlan.activities.push('Departure');
    } else {
      // Add activities based on user preferences
      const dayActivities = activities.slice((day - 2) * 2, (day - 1) * 2);
      dayPlan.activities.push(...dayActivities);
      
      if (dayPlan.activities.length === 0) {
        dayPlan.activities.push('Free day for exploration');
      }
    }

    itinerary.push(dayPlan);
  }

  return itinerary;
}

function generateHotelRecommendations(destination, budget, numberOfDays) {
  const budgetMultipliers = {
    low: 0.7,
    medium: 1.0,
    high: 1.5
  };

  const basePrice = 80; // Base price per night
  const pricePerNight = basePrice * budgetMultipliers[budget];

  return [
    {
      name: `${destination.name} Central Hotel`,
      price: Math.round(pricePerNight),
      rating: 4.2,
      link: `https://booking.com/hotel/${destination.name.toLowerCase().replace(' ', '-')}-central`,
      amenities: ['WiFi', 'Breakfast', 'Air Conditioning']
    },
    {
      name: `${destination.name} Luxury Resort`,
      price: Math.round(pricePerNight * 1.8),
      rating: 4.6,
      link: `https://booking.com/resort/${destination.name.toLowerCase().replace(' ', '-')}-luxury`,
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant']
    },
    {
      name: `${destination.name} Budget Inn`,
      price: Math.round(pricePerNight * 0.6),
      rating: 3.8,
      link: `https://booking.com/inn/${destination.name.toLowerCase().replace(' ', '-')}-budget`,
      amenities: ['WiFi', 'Basic Amenities']
    }
  ];
}

function calculateCosts(budget, numberOfDays, companion, hotels) {
  const budgetMultipliers = {
    low: 0.7,
    medium: 1.0,
    high: 1.5
  };

  const companionMultipliers = {
    solo: 1.0,
    couple: 1.8,
    family: 2.5,
    friends: 2.2
  };

  const baseAccommodation = hotels[1].price * numberOfDays; // Use medium hotel as base
  const baseFood = 50 * numberOfDays; // $50 per day for food
  const baseTransport = 30 * numberOfDays; // $30 per day for transport

  const multiplier = budgetMultipliers[budget] * companionMultipliers[companion];

  return {
    accommodation: Math.round(baseAccommodation * multiplier),
    food: Math.round(baseFood * multiplier),
    transport: Math.round(baseTransport * multiplier),
    total: Math.round((baseAccommodation + baseFood + baseTransport) * multiplier)
  };
}

// Seed data endpoint
app.post('/api/seed', async (req, res) => {
  try {
    // Clear existing data
    await Destination.deleteMany({});

    // Seed destinations
    const destinations = [
      {
        name: 'Rome, Italy',
        country: 'Italy',
        description: 'The Eternal City, home to ancient ruins, Renaissance art, and delicious Italian cuisine.',
        coordinates: { lat: 41.9028, lng: 12.4964 },
        imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
        activities: ['beaches', 'city view', 'outdoor sites', 'events', 'food street', 'shopping malls', 'night life'],
        averageTemperature: 15,
        bestTimeToVisit: 'April to June, September to October'
      },
      {
        name: 'Paris, France',
        country: 'France',
        description: 'The City of Light, famous for its art, fashion, gastronomy and culture.',
        coordinates: { lat: 48.8566, lng: 2.3522 },
        imageUrl: 'https://images.unsplash.com/photo-1502602898535-0b7b0c8b0b0b?w=800',
        activities: ['city view', 'outdoor sites', 'events', 'food street', 'shopping malls', 'night life'],
        averageTemperature: 12,
        bestTimeToVisit: 'April to June, September to October'
      },
      {
        name: 'Tokyo, Japan',
        country: 'Japan',
        description: 'A fascinating blend of ultramodern and traditional, offering endless discoveries.',
        coordinates: { lat: 35.6762, lng: 139.6503 },
        imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
        activities: ['city view', 'outdoor sites', 'events', 'river', 'food street', 'shopping malls', 'night life'],
        averageTemperature: 15,
        bestTimeToVisit: 'March to May, September to November'
      },
      {
        name: 'New York, USA',
        country: 'United States',
        description: 'The Big Apple, a global center of culture, commerce, and entertainment.',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
        activities: ['city view', 'outdoor sites', 'events', 'river', 'food street', 'shopping malls', 'night life'],
        averageTemperature: 13,
        bestTimeToVisit: 'April to June, September to November'
      },
      {
        name: 'Bali, Indonesia',
        country: 'Indonesia',
        description: 'A paradise island known for its beautiful beaches, temples, and spiritual culture.',
        coordinates: { lat: -8.3405, lng: 115.0920 },
        imageUrl: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800',
        activities: ['beaches', 'outdoor sites', 'events', 'river', 'food street', 'shopping malls', 'night life'],
        averageTemperature: 27,
        bestTimeToVisit: 'April to October'
      }
    ];

    await Destination.insertMany(destinations);
    res.json({ message: 'Database seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error seeding database', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});