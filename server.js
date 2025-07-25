const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import configurations and routes
const { connectDB, closeDB } = require('./config/database');
const recommendationRoutes = require('./routes/recommendationRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
    }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Static files (if you want to serve frontend from same server)
app.use(express.static('public'));

// API Routes
app.use('/api/v1', recommendationRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to ViaItalia Travel Recommendation API',
        version: '1.0.0',
        endpoints: {
            health: '/api/v1/health',
            destinations: '/api/v1/destinations',
            recommend: '/api/v1/recommend (POST)',
            cities: '/api/v1/cities/:cityName',
            hotels: '/api/v1/hotels',
            attractions: '/api/v1/attractions/:cityName',
            restaurants: '/api/v1/restaurants/:cityName'
        },
        documentation: 'See README.md for detailed API documentation'
    });
});

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = async (signal) => {
    console.log(`\n🔄 Received ${signal}. Starting graceful shutdown...`);
    
    server.close(async () => {
        console.log('📴 HTTP server closed');
        
        // Close database connection
        await closeDB();
        
        console.log('✅ Graceful shutdown completed');
        process.exit(0);
    });
    
    // Force close after 30 seconds
    setTimeout(() => {
        console.error('⚠️ Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 30000);
};

// Start server
const startServer = async () => {
    try {
        // Connect to database
        await connectDB();
        
        // Start HTTP server
        const server = app.listen(PORT, () => {
            console.log('🚀 ViaItalia Backend Server Started Successfully!');
            console.log(`📍 Server running on: http://localhost:${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`📊 API Base URL: http://localhost:${PORT}/api/v1`);
            console.log('📘 API Endpoints:');
            console.log('   GET  /api/v1/health - Health check');
            console.log('   GET  /api/v1/destinations - Get all destinations');
            console.log('   POST /api/v1/recommend - Generate travel recommendation');
            console.log('   GET  /api/v1/cities/:cityName - Get city details');
            console.log('   GET  /api/v1/hotels - Get hotels by city and budget');
            console.log('   GET  /api/v1/attractions/:cityName - Get attractions');
            console.log('   GET  /api/v1/restaurants/:cityName - Get restaurants');
            console.log('✨ Ready to serve travel recommendations!');
        });

        // Handle graceful shutdown
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        
        return server;
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

// Start the server
startServer();

module.exports = app;