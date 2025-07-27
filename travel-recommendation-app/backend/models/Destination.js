const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  country: {
    type: String,
    required: true
  },
  description: {
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
  imageUrl: {
    type: String,
    required: true
  },
  activities: [{
    type: String,
    enum: ['beaches', 'city view', 'outdoor sites', 'events', 'river', 'food street', 'shopping malls', 'night life']
  }],
  averageTemperature: {
    type: Number,
    required: true
  },
  bestTimeToVisit: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Destination', destinationSchema);