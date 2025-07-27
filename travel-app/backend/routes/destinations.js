const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');

// GET /api/destinations - Fetch all destinations
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find({}, 'name country coordinates imageUrl');
    res.json(destinations);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ message: 'Error fetching destinations', error: error.message });
  }
});

// GET /api/destinations/:name - Fetch specific destination details
router.get('/:name', async (req, res) => {
  try {
    const destination = await Destination.findOne({ 
      name: { $regex: new RegExp(req.params.name, 'i') } 
    });
    
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    res.json(destination);
  } catch (error) {
    console.error('Error fetching destination:', error);
    res.status(500).json({ message: 'Error fetching destination', error: error.message });
  }
});

module.exports = router;