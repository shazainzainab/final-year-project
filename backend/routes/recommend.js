import express from 'express';
import axios from 'axios';
import Destination from '../models/Destination.js';

const router = express.Router();

// POST /api/recommend
router.post('/', async (req, res) => {
  try {
    const {
      destinationId,
      startDate,
      days,
      budget,
      companion,
      activities,
      foodPreference,
      furtherPreferences
    } = req.body;

    const destination = await Destination.findById(destinationId);
    if (!destination) return res.status(404).json({ error: 'Destination not found' });

    // Fetch 3-day weather forecast
    let weather = null;
    if (process.env.OW_API_KEY) {
      const { lat, lon } = destination.coords;
      const weatherRes = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
        params: {
          lat,
          lon,
          cnt: 24, // 3 days (8 intervals per day)
          units: 'metric',
          appid: process.env.OW_API_KEY
        }
      });
      weather = weatherRes.data;
    }

    // Simple itinerary generation
    const itinerary = Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      activities: [
        `Explore ${destination.name} – suggested activity for day ${i + 1}`
      ]
    }));

    // Cost estimation
    const costMultiplier = { low: 0.8, medium: 1, high: 1.3 }[budget] || 1;
    const baseAccommodation = 100 * days;
    const baseFood = 40 * days;
    const baseTransport = 30 * days;

    const cost = {
      accommodation: baseAccommodation * costMultiplier,
      food: baseFood * costMultiplier,
      transport: baseTransport * costMultiplier
    };
    cost.total = cost.accommodation + cost.food + cost.transport;

    res.json({
      destination,
      startDate,
      endDate: new Date(new Date(startDate).getTime() + (days - 1) * 86400000),
      weather,
      itinerary,
      cost
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;