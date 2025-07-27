# 🚀 Quick Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Quick Start

### Option 1: Using the startup script (Recommended)
```bash
# Make the script executable (if not already)
chmod +x start.sh

# Run the application
./start.sh
```

### Option 2: Manual setup

#### 1. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

#### 2. Configure Environment
Create `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/travel-recommendation
OPENWEATHER_API_KEY=your_openweather_api_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

#### 3. Start MongoDB
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (update MONGODB_URI in .env)
```

#### 4. Start the Application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

## Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## API Endpoints
- `GET /api/destinations` - Get all destinations
- `POST /api/recommend` - Generate travel recommendation
- `POST /api/seed` - Seed database with sample data

## Features Implemented ✅

### Frontend
- ✅ Beautiful, responsive form with all required fields
- ✅ Destination dropdown (populated from DB)
- ✅ Date picker with validation
- ✅ Number input for trip duration
- ✅ Radio buttons for budget and companion
- ✅ Checkbox group for activities (multi-select)
- ✅ Radio buttons for food preference
- ✅ Text area for additional preferences
- ✅ Submit button with loading state
- ✅ Modern UI with gradients and animations
- ✅ Mobile-responsive design

### Backend
- ✅ Express server with CORS enabled
- ✅ MongoDB integration with Mongoose
- ✅ RESTful API endpoints
- ✅ Weather data integration (OpenWeatherMap API)
- ✅ Smart itinerary generation
- ✅ Hotel recommendations
- ✅ Cost calculations
- ✅ Database seeding with sample destinations

### Result Page
- ✅ Hero section with destination background image
- ✅ Google Maps integration
- ✅ 3-day weather forecast
- ✅ City overview and description
- ✅ Hotel recommendations with ratings
- ✅ Day-by-day itinerary timeline
- ✅ Cost breakdown summary
- ✅ Navigation back to form

## Sample Destinations Included
- Rome, Italy
- Paris, France
- Tokyo, Japan
- New York, USA
- Bali, Indonesia

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- For MongoDB Atlas, use the connection string format: `mongodb+srv://username:password@cluster.mongodb.net/travel-recommendation`

### API Key Issues
- Get OpenWeatherMap API key: https://openweathermap.org/api
- Get Google Maps API key: https://developers.google.com/maps/documentation/javascript/get-api-key

### Port Issues
- Backend runs on port 5000
- Frontend runs on port 3000
- Update ports in `.env` if needed

## Project Structure
```
travel-recommendation-app/
├── backend/
│   ├── models/
│   │   ├── Destination.js
│   │   └── TripRecommendation.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TravelForm.js
│   │   │   ├── TravelForm.css
│   │   │   ├── ResultPage.js
│   │   │   └── ResultPage.css
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
├── README.md
├── SETUP.md
└── start.sh
```

## Next Steps
1. Add your API keys to the `.env` file
2. Start MongoDB
3. Run the application
4. Fill out the form and get your travel recommendation!

Enjoy your travel planning! 🌍✈️