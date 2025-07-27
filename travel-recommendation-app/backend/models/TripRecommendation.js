const mongoose = require('mongoose');

const tripRecommendationSchema = new mongoose.Schema({
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
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
  weather: [{
    date: String,
    temp: Number,
    description: String,
    icon: String
  }],
  itinerary: [{
    day: Number,
    activities: [String]
  }],
  hotels: [{
    name: String,
    price: Number,
    rating: Number,
    link: String,
    amenities: [String]
  }],
  costs: {
    accommodation: Number,
    food: Number,
    transport: Number,
    total: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TripRecommendation', tripRecommendationSchema);