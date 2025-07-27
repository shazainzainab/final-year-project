const mongoose = require('mongoose');

const tripRecommendationSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: true
  },
  startingDate: {
    type: Date,
    required: true
  },
  days: {
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
    type: String,
    enum: ['beaches', 'city view', 'outdoor sites', 'events', 'river', 'food street', 'shopping malls', 'night life']
  }],
  foodPreference: {
    type: String,
    enum: ['halal', 'veg', 'non-veg'],
    required: true
  },
  furtherPreferences: {
    type: String
  },
  generatedItinerary: [{
    day: Number,
    activities: [String],
    description: String
  }],
  estimatedCost: {
    accommodation: Number,
    food: Number,
    transport: Number,
    total: Number
  },
  weatherForecast: [{
    date: Date,
    temperature: Number,
    description: String,
    icon: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('TripRecommendation', tripRecommendationSchema);