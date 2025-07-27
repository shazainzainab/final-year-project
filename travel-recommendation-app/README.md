# 🌍 Travel Recommendation Web Application

A full-stack travel recommendation web application built with Node.js, Express, MongoDB, and React. This application helps users plan their perfect trip by providing personalized recommendations based on their preferences.

## 🚀 Features

### Frontend Features
- **Interactive Travel Form** with all required fields:
  - Destination dropdown (populated from database)
  - Start date picker
  - Number of days input
  - Budget selection (low, medium, high)
  - Trip companion selection (solo, couple, family, friends)
  - Activities multi-select (beaches, city view, outdoor sites, events, river, food street, shopping malls, night life)
  - Food preference selection (halal, veg, non-veg)
  - Additional preferences text area
- **Beautiful Result Page** with:
  - Hero section with destination background image
  - Google Maps integration
  - 3-day weather forecast
  - City overview and description
  - Hotel recommendations with pricing
  - Day-wise itinerary
  - Cost breakdown and summary

### Backend Features
- **RESTful API** with Express.js
- **MongoDB** database with Mongoose ODM
- **Weather API** integration (OpenWeatherMap)
- **Dynamic itinerary generation**
- **Cost calculation** based on preferences
- **Hotel recommendations** with pricing
- **CORS enabled** for cross-origin requests

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - Object Data Modeling
- **Axios** - HTTP client
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling with modern design

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

### 3. Environment Variables
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

### 5. API Keys Setup

#### OpenWeatherMap API
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Get your API key
4. Add it to the `.env` file

#### Google Maps API (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API
3. Create credentials (API key)
4. Add it to the `.env` file

## 🚀 Running the Application

### 1. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On macOS/Linux
sudo systemctl start mongod

# On Windows
net start MongoDB
```

### 2. Start the Backend Server
```bash
cd backend
npm run dev
```
The backend will start on `http://localhost:5000`

### 3. Seed the Database (Optional)
To populate the database with sample destinations:
```bash
curl -X POST http://localhost:5000/api/seed
```

### 4. Start the Frontend Development Server
```bash
cd frontend
npm start
```
The frontend will start on `http://localhost:3000`

## 📋 API Endpoints

### GET `/api/destinations`
Returns all available destinations.

**Response:**
```json
[
  {
    "_id": "...",
    "name": "Rome, Italy",
    "country": "Italy",
    "description": "The Eternal City...",
    "coordinates": {
      "lat": 41.9028,
      "lng": 12.4964
    },
    "imageUrl": "...",
    "activities": ["Colosseum", "Vatican Museums", ...],
    "averageTemperature": 15,
    "bestTimeToVisit": "Spring and Fall"
  }
]
```

### POST `/api/recommend`
Creates a travel recommendation based on user preferences.

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
  "destination": {...},
  "weatherData": [...],
  "itinerary": [...],
  "hotels": [...],
  "costSummary": {
    "accommodation": 500,
    "food": 250,
    "transport": 175,
    "total": 925
  }
}
```

### POST `/api/seed`
Populates the database with sample destinations.

## 🎨 Features in Detail

### Form Validation
- All required fields are validated
- Date picker ensures future dates
- Number of days limited to 1-30
- Radio buttons ensure single selection
- Checkboxes allow multiple selections

### Dynamic Content
- Destinations loaded from database
- Weather data fetched in real-time
- Itinerary generated based on destination and preferences
- Hotel recommendations with dynamic pricing
- Cost calculations based on budget and companion type

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interface
- Optimized for all screen sizes

### User Experience
- Loading states for better feedback
- Error handling with user-friendly messages
- Smooth transitions and animations
- Intuitive navigation

## 🔧 Customization

### Adding New Destinations
1. Add destination data to the seed endpoint in `server.js`
2. Include coordinates for weather API
3. Add activities and attractions
4. Provide high-quality image URL

### Modifying Cost Calculations
Edit the `calculateCosts` function in `server.js` to adjust:
- Base prices for different budget levels
- Companion multipliers
- Daily food and transport costs

### Styling Customization
- Modify CSS files in the frontend components
- Update color schemes in CSS variables
- Adjust responsive breakpoints

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify database permissions

2. **Weather API Errors**
   - Verify OpenWeatherMap API key
   - Check API quota limits
   - Ensure coordinates are valid

3. **CORS Errors**
   - Backend CORS is configured for development
   - Update CORS settings for production

4. **Port Conflicts**
   - Change ports in `.env` and `package.json`
   - Ensure ports are not in use

## 📱 Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License
This project is licensed under the MIT License.

## 🙏 Acknowledgments
- OpenWeatherMap for weather data
- Google Maps for location services
- Unsplash for destination images
- React and Node.js communities

---

**Happy Traveling! ✈️🌍**