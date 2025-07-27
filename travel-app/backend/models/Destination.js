const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: String,
  type: String,
  description: String,
  estimatedCost: Number
});

const hotelSchema = new mongoose.Schema({
  name: String,
  price: Number,
  rating: Number,
  link: String
});

const itinerarySchema = new mongoose.Schema({
  day: Number,
  activities: [String],
  description: String
});

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  coordinates: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  averageCosts: {
    accommodation: {
      low: Number,
      medium: Number,
      high: Number
    },
    food: {
      low: Number,
      medium: Number,
      high: Number
    },
    transport: {
      low: Number,
      medium: Number,
      high: Number
    }
  },
  hotels: [hotelSchema],
  activities: [activitySchema],
  itinerary: [itinerarySchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Destination', destinationSchema);