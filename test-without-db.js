/**
 * Test server without database dependency
 * Use this to test if your Node.js setup is working before setting up the database
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test endpoints
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'ViaItalia Backend Test Server',
        status: 'Working without database',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/v1/health', (req, res) => {
    res.json({
        success: true,
        message: 'Test server is running successfully',
        timestamp: new Date().toISOString(),
        version: '1.0.0-test'
    });
});

// Mock destinations endpoint
app.get('/api/v1/destinations', (req, res) => {
    res.json({
        success: true,
        message: 'Mock destinations (replace with real data after DB setup)',
        data: [
            { CityName: 'Rome', Description: 'The eternal city with rich history' },
            { CityName: 'Pisa', Description: 'Famous for its leaning tower' },
            { CityName: 'Lecce', Description: 'Baroque architecture and beautiful beaches' },
            { CityName: 'Como', Description: 'Stunning lake views and mountain scenery' }
        ]
    });
});

// Mock recommendation endpoint
app.post('/api/v1/recommend', (req, res) => {
    const { destination, startDate, days, budget, companion, activities, foodPreference } = req.body;
    
    // Basic validation
    if (!destination || !startDate || !days) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: destination, startDate, days'
        });
    }
    
    // Mock response
    res.json({
        success: true,
        message: 'Mock recommendation generated (replace with real data after DB setup)',
        data: {
            destination: {
                name: destination,
                description: 'Beautiful Italian destination',
                history: 'Rich historical background',
                backgroundImage: 'default-city-image.jpg'
            },
            hotels: [
                {
                    HotelName: 'Mock Hotel Plaza',
                    Rating: 4.5,
                    PricePerNight: budget === 'low' ? 80 : budget === 'high' ? 300 : 150
                }
            ],
            attractions: [
                {
                    PlaceName: 'Mock Historic Site',
                    Description: 'Amazing historical attraction',
                    Type: 'Attraction'
                }
            ],
            restaurants: [
                {
                    RestaurantName: 'Mock Restaurant',
                    CuisineType: foodPreference === 'vegetarian' ? 'Vegetarian Italian' : 'Italian',
                    Rating: 4.3
                }
            ],
            itinerary: Array.from({ length: days }, (_, i) => ({
                day: i + 1,
                title: `Day ${i + 1}`,
                activities: [
                    {
                        time: '09:00 AM',
                        activity: 'Visit Mock Attraction',
                        description: 'Explore amazing location',
                        duration: '2-3 hours'
                    }
                ],
                meals: {
                    breakfast: 'Hotel breakfast',
                    lunch: 'Local restaurant',
                    dinner: 'Traditional cuisine'
                }
            })),
            preferences: {
                budget,
                companion,
                activities,
                foodPreference
            }
        }
    });
});

app.listen(PORT, () => {
    console.log('\n🧪 ViaItalia Test Server (No Database)');
    console.log('=====================================');
    console.log(`📍 Server running on: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('\n📘 Test Endpoints:');
    console.log(`   GET  http://localhost:${PORT}/ - Root endpoint`);
    console.log(`   GET  http://localhost:${PORT}/api/v1/health - Health check`);
    console.log(`   GET  http://localhost:${PORT}/api/v1/destinations - Mock destinations`);
    console.log(`   POST http://localhost:${PORT}/api/v1/recommend - Mock recommendation`);
    console.log('\n✅ Test server ready! Set up your database and run "npm start" for full functionality.');
});

module.exports = app;