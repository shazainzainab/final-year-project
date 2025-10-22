const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import configurations and routes
const { connectDB, closeDB } = require('./config/db');
const recommendationRoutes = require('./routes/recommendationRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:5500'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
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
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Static files
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

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Global server reference for shutdown
let server;

// Graceful shutdown
const gracefulShutdown = async (signal) => {
    console.log(`\n🔄 Received ${signal}. Starting graceful shutdown...`);

    if (server) {
        server.close(async () => {
            console.log('📴 HTTP server closed');

            // Close database connection
            await closeDB();

            console.log('✅ Graceful shutdown completed');
            process.exit(0);
        });

        // Force exit after 30s
        setTimeout(() => {
            console.error('⚠️ Forcefully shutting down...');
            process.exit(1);
        }, 30000);
    }
};

// Start server
const startServer = async () => {
    try {
        await connectDB();
        server = app.listen(PORT, () => {
            console.log('🚀 ViaItalia Backend Server Started Successfully!');
            console.log(`📍 Server running on: http://localhost:${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`📊 API Base URL: http://localhost:${PORT}/api/v1`);
            console.log('📘 API Endpoints:');
            console.log('   GET  /api/v1/health');
            console.log('   GET  /api/v1/destinations');
            console.log('   POST /api/v1/recommend');
            console.log('   GET  /api/v1/cities/:cityName');
            console.log('   GET  /api/v1/hotels');
            console.log('   GET  /api/v1/attractions/:cityName');
            console.log('   GET  /api/v1/restaurants/:cityName');
            console.log('✨ Ready to serve travel recommendations!');
        });

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();

module.exports = app;
