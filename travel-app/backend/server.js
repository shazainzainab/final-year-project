require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const destinationsRouter = require('./routes/destinations');
const recommendationsRouter = require('./routes/recommendations');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/destinations', destinationsRouter);
app.use('/api/recommend', recommendationsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Travel Recommendation API is running!', 
    timestamp: new Date().toISOString(),
    status: 'healthy'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('Connected to MongoDB');
  // Start server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);
});