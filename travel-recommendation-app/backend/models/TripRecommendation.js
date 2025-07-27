const mongoose = require('mongoose');

const tripRecommendationSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  numberOfDays: {
    type: Number,
    required: true
  },
  budget: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  companion: {
    type: String,
    enum: ['solo', 'couple', 'family', 'friends'],
    required: true
  },
  activities: [{
    type: String
  }],
  foodPreference: {
    type: String,
    enum: ['halal', 'veg', 'non-veg'],
    required: true
  },
  furtherPreferences: {
    type: String
  },
  weatherData: [{
    date: String,
    temp: Number,
    description: String,
    icon: String
  }],
  itinerary: [{
    day: Number,
    activities: [{
      time: String,
      activity: String,
      description: String
    }]
  }],
  hotels: [{
    name: String,
    price: Number,
    rating: Number,
    link: String,
    amenities: [String]
  }],
  costSummary: {
    accommodation: Number,
    food: Number,
    transport: Number,
    total: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TripRecommendation', tripRecommendationSchema);