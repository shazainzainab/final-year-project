# Travel Recommendation Web Application

A full-stack travel recommendation web application that generates personalized trip itineraries based on user preferences. Built with Node.js/Express backend and React frontend.

## 🚀 Features

### Frontend (React)
- **Interactive Form**: Comprehensive trip preference form with all required fields
- **Dynamic Destination Dropdown**: Populated from database
- **Multi-select Activities**: Checkboxes for activity preferences
- **Radio Button Groups**: For budget, companion type, and food preferences
- **Responsive Design**: Mobile-friendly UI with modern styling
- **Result Page**: Detailed trip recommendations with multiple sections

### Backend (Node.js/Express)
- **RESTful API**: Clean API endpoints for destinations and recommendations
- **MongoDB Integration**: Mongoose ODM for database operations
- **Weather Integration**: OpenWeatherMap API for 3-day forecasts
- **CORS Support**: Cross-origin resource sharing enabled
- **Error Handling**: Comprehensive error handling and validation

### Result Page Features
- **Hero Section**: Background image with destination name and trip dates
- **Google Maps**: Embedded map centered on destination
- **Weather Forecast**: 3-day weather forecast with icons
- **City Overview**: Detailed destination description
- **Hotel Recommendations**: List with prices, ratings, and booking links
- **Day-wise Itinerary**: Customized based on preferences and duration
- **Cost Estimation**: Breakdown of accommodation, food, and transport costs

## 📁 Project Structure

```
travel-app/
├── backend/
│   ├── models/
│   │   ├── Destination.js
│   │   └── TripRecommendation.js
│   ├── routes/
│   │   ├── destinations.js
│   │   └── recommendations.js
│   ├── .env
│   ├── server.js
│   ├── seedData.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TripForm.js
│   │   │   ├── TripForm.css
│   │   │   ├── ResultPage.js
│   │   │   └── ResultPage.css
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- OpenWeatherMap API key (optional, mock data used as fallback)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd travel-app
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Environment Variables
Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/travel_app
OPENWEATHER_API_KEY=your_openweather_api_key_here
NODE_ENV=development
```

### 4. Database Setup
Start MongoDB and seed the database:
```bash
# Make sure MongoDB is running
npm run seed
# or
node seedData.js
```

### 5. Frontend Setup
```bash
cd ../frontend
npm install
```

## 🚀 Running the Application

### Start Backend (Terminal 1)
```bash
cd backend
npm start
# Backend runs on http://localhost:5000
```

### Start Frontend (Terminal 2)
```bash
cd frontend
npm start
# Frontend runs on http://localhost:3000
```

### Development Mode
For backend development with auto-reload:
```bash
cd backend
npm run dev  # (requires nodemon: npm install -g nodemon)
```

## 📊 Database Schema

### Destinations Collection
```javascript
{
  name: String,
  country: String,
  coordinates: { lat: Number, lng: Number },
  description: String,
  imageUrl: String,
  averageCosts: {
    accommodation: { low: Number, medium: Number, high: Number },
    food: { low: Number, medium: Number, high: Number },
    transport: { low: Number, medium: Number, high: Number }
  },
  hotels: [{ name: String, price: Number, rating: Number, link: String }],
  activities: [{ name: String, type: String, description: String, estimatedCost: Number }],
  itinerary: [{ day: Number, activities: [String], description: String }]
}
```

### Trip Recommendations Collection
```javascript
{
  destination: String,
  startingDate: Date,
  days: Number,
  budget: String, // 'low', 'medium', 'high'
  companion: String, // 'solo', 'couple', 'family', 'friends'
  activities: [String],
  foodPreference: String, // 'halal', 'veg', 'non-veg'
  furtherPreferences: String,
  generatedItinerary: [Object],
  estimatedCost: Object,
  weatherForecast: [Object]
}
```

## 🌐 API Endpoints

### GET /api/destinations
- Returns all available destinations
- Response: Array of destination objects

### GET /api/destinations/:name
- Returns specific destination details
- Response: Single destination object

### POST /api/recommend
- Generates trip recommendation based on form data
- Request body: Trip preference object
- Response: Complete recommendation with itinerary, costs, weather, hotels

### GET /api/health
- Health check endpoint
- Response: API status and timestamp

## 🎨 Form Fields

1. **Destination**: Dropdown (populated from DB)
2. **Starting Date**: Date picker (min: today)
3. **How Many Days**: Number input (1-30)
4. **Budget**: Radio buttons (low, medium, high)
5. **Trip Companion**: Radio buttons (solo, couple, family, friends)
6. **Activities**: Checkboxes (beaches, city view, outdoor sites, events, river, food street, shopping malls, night life)
7. **Food Preference**: Radio buttons (halal, veg, non-veg)
8. **Further Preferences**: Textarea
9. **Submit Button**: Generates recommendation

## 🌤️ Weather Integration

- Uses OpenWeatherMap API for real-time weather data
- Displays 3-day forecast with temperature and conditions
- Fallback to mock data if API key not provided
- Weather icons from OpenWeatherMap

## 💰 Cost Calculation

- Dynamic pricing based on budget level and companion count
- Separate calculations for accommodation, food, and transport
- Multipliers applied for group sizes
- Total cost summary displayed prominently

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints at 768px and 480px
- Grid layouts that adapt to screen size
- Touch-friendly buttons and forms

## 🔧 Development Scripts

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
node seedData.js   # Seed database with sample data
```

### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

## 🚀 Deployment Notes

### Environment Setup
- Set `NODE_ENV=production` for production
- Use MongoDB Atlas for cloud database
- Obtain OpenWeatherMap API key for weather data
- Configure CORS for production domains

### Build Process
```bash
cd frontend
npm run build
# Serve build folder with express.static or deploy to hosting service
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env file

2. **CORS Errors**
   - Verify backend is running on port 5000
   - Check frontend API calls point to correct backend URL

3. **Weather Data Not Loading**
   - Verify OpenWeatherMap API key
   - Check network connectivity
   - App uses mock data as fallback

4. **Form Submission Errors**
   - Check all required fields are filled
   - Verify backend endpoints are accessible
   - Check browser console for error messages

## 📞 Support

For support and questions, please create an issue in the repository.