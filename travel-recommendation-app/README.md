# 🌍 Travel Recommendation Web Application

A full-stack travel recommendation web application built with React, Node.js, Express, and MongoDB. This application helps users plan their perfect trip by providing personalized recommendations based on their preferences.

## 🚀 Features

### Frontend Features
- **Interactive Form**: Beautiful, responsive form with all required fields
- **Real-time Validation**: Form validation and user feedback
- **Modern UI/UX**: Clean, modern design with smooth animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

### Backend Features
- **RESTful API**: Clean API endpoints for destinations and recommendations
- **Weather Integration**: Real-time weather data using OpenWeatherMap API
- **Smart Recommendations**: AI-powered itinerary and cost calculations
- **Database Integration**: MongoDB with Mongoose for data persistence

### Key Functionality
- ✅ Destination selection from database
- ✅ Date and duration planning
- ✅ Budget and companion preferences
- ✅ Activity selection (multi-select)
- ✅ Food preference options
- ✅ Weather forecast (3-day)
- ✅ Google Maps integration
- ✅ Hotel recommendations
- ✅ Day-by-day itinerary
- ✅ Cost estimation
- ✅ Beautiful result page

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Modern styling with gradients and animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **Axios** - HTTP client for external APIs

### External APIs
- **OpenWeatherMap API** - Weather data
- **Google Maps API** - Location and mapping

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd travel-recommendation-app
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Environment Configuration
Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/travel-recommendation
OPENWEATHER_API_KEY=your_openweather_api_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install
```

### 5. Database Setup
Start MongoDB service and seed the database:
```bash
# Start MongoDB (if running locally)
mongod

# In another terminal, start the backend
cd backend
npm run dev

# Seed the database (optional - data will be seeded automatically)
curl -X POST http://localhost:5000/api/seed
```

### 6. Start the Application

#### Development Mode
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

#### Production Mode
```bash
# Build frontend
cd frontend
npm run build

# Start backend
cd ../backend
npm start
```

## 🌐 API Endpoints

### GET `/api/destinations`
Fetches all available destinations from the database.

**Response:**
```json
[
  {
    "_id": "...",
    "name": "Rome, Italy",
    "country": "Italy",
    "description": "The Eternal City...",
    "coordinates": { "lat": 41.9028, "lng": 12.4964 },
    "imageUrl": "...",
    "activities": ["beaches", "city view", ...],
    "averageTemperature": 15,
    "bestTimeToVisit": "April to June, September to October"
  }
]
```

### POST `/api/recommend`
Generates a personalized travel recommendation.

**Request Body:**
```json
{
  "destination": "Rome, Italy",
  "startDate": "2024-06-15",
  "numberOfDays": 5,
  "budget": "medium",
  "companion": "couple",
  "activities": ["beaches", "city view"],
  "foodPreference": "non-veg",
  "furtherPreferences": "Interested in historical sites"
}
```

**Response:**
```json
{
  "destination": { ... },
  "startDate": "2024-06-15",
  "endDate": "2024-06-19",
  "numberOfDays": 5,
  "weather": [...],
  "itinerary": [...],
  "hotels": [...],
  "costs": {
    "accommodation": 400,
    "food": 250,
    "transport": 150,
    "total": 800
  }
}
```

### POST `/api/seed`
Seeds the database with sample destinations.

## 🗄️ Database Schema

### Destination Schema
```javascript
{
  name: String (required, unique),
  country: String (required),
  description: String (required),
  coordinates: {
    lat: Number (required),
    lng: Number (required)
  },
  imageUrl: String (required),
  activities: [String],
  averageTemperature: Number (required),
  bestTimeToVisit: String (required)
}
```

### TripRecommendation Schema
```javascript
{
  destination: ObjectId (ref: 'Destination'),
  startDate: Date (required),
  endDate: Date (required),
  numberOfDays: Number (required),
  budget: String (enum: ['low', 'medium', 'high']),
  companion: String (enum: ['solo', 'couple', 'family', 'friends']),
  activities: [String],
  foodPreference: String (enum: ['halal', 'veg', 'non-veg']),
  furtherPreferences: String,
  weather: [Object],
  itinerary: [Object],
  hotels: [Object],
  costs: Object
}
```

## 🎨 UI Components

### TravelForm Component
- Destination dropdown (populated from DB)
- Date picker with validation
- Number input for trip duration
- Radio buttons for budget and companion
- Checkbox group for activities
- Radio buttons for food preference
- Text area for additional preferences
- Submit button with loading state

### ResultPage Component
- Hero section with destination image
- Google Maps integration
- Weather forecast cards
- City overview with details
- Hotel recommendations with ratings
- Day-by-day itinerary timeline
- Cost breakdown summary
- Navigation back to form

## 🔧 Configuration

### Environment Variables
- `PORT`: Backend server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `OPENWEATHER_API_KEY`: OpenWeatherMap API key
- `GOOGLE_MAPS_API_KEY`: Google Maps API key

### API Keys Setup
1. **OpenWeatherMap API**: Sign up at [openweathermap.org](https://openweathermap.org/api)
2. **Google Maps API**: Enable Maps JavaScript API in Google Cloud Console

## 🚀 Deployment

### Backend Deployment (Heroku)
```bash
cd backend
heroku create your-app-name
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set OPENWEATHER_API_KEY=your_api_key
git push heroku main
```

### Frontend Deployment (Netlify/Vercel)
```bash
cd frontend
npm run build
# Deploy the build folder to your preferred platform
```

## 📱 Screenshots

### Form Page
- Beautiful gradient background
- Clean form layout with proper spacing
- Interactive form elements with hover effects
- Responsive design for all devices

### Result Page
- Hero section with destination image overlay
- Weather forecast cards with icons
- Hotel recommendations with ratings
- Timeline-based itinerary display
- Cost breakdown with visual hierarchy

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **API Key Errors**
   - Verify API keys are correctly set in `.env`
   - Check API key permissions and quotas
   - Ensure keys are valid and active

3. **CORS Issues**
   - Backend CORS is configured for development
   - Update CORS settings for production deployment

4. **Port Conflicts**
   - Change PORT in `.env` if 5000 is occupied
   - Update frontend API calls accordingly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with ❤️ for travel enthusiasts

---

**Note**: This application is for educational purposes. For production use, consider implementing proper security measures, error handling, and data validation.