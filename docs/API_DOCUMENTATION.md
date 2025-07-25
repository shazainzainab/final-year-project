# ViaItalia Travel Recommendation API Documentation

## Overview
ViaItalia is a comprehensive travel recommendation system backend for Italy-based travel planning. This API provides endpoints to generate personalized travel recommendations based on user preferences.

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
Currently, the API doesn't require authentication for basic endpoints. Future versions may include JWT-based authentication.

## Common Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (in development mode)",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Endpoints

### 1. Health Check
Check if the API is running properly.

**GET** `/health`

**Response:**
```json
{
  "success": true,
  "message": "ViaItalia API is running successfully",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### 2. Get Destinations
Retrieve all available destinations.

**GET** `/destinations`

**Response:**
```json
{
  "success": true,
  "message": "Destinations fetched successfully",
  "data": [
    {
      "CityName": "Rome",
      "Description": "The eternal city with rich history..."
    },
    {
      "CityName": "Pisa",
      "Description": "Famous for its leaning tower..."
    }
  ]
}
```

### 3. Generate Travel Recommendation (Main Endpoint)
Generate a complete travel recommendation based on user preferences.

**POST** `/recommend`

**Request Body:**
```json
{
  "destination": "Rome, Italy",
  "startDate": "2024-06-01",
  "days": 5,
  "budget": "medium",
  "companion": "couple",
  "activities": ["Beaches", "City Views", "Food Street"],
  "foodPreference": "vegetarian",
  "additionalPreferences": "Looking for romantic places with historical significance"
}
```

**Request Parameters:**
- `destination` (string, required): Destination city name
- `startDate` (string, required): Start date in ISO format (YYYY-MM-DD)
- `days` (number, required): Number of travel days (1-30)
- `budget` (string, required): Budget level - "low", "medium", or "high"
- `companion` (string, required): Travel companion - "solo", "couple", "family", or "friends"
- `activities` (array, required): Array of desired activities:
  - "Beaches"
  - "City Views"
  - "Outdoor Plan"
  - "Events"
  - "River"
  - "Food Street"
  - "Shopping mall"
  - "Night Life"
- `foodPreference` (string, required): Food preference - "halal", "vegetarian", or "non-vegetarian"
- `additionalPreferences` (string, optional): Additional preferences and requirements

**Response:**
```json
{
  "success": true,
  "message": "Travel recommendation generated successfully",
  "data": {
    "destination": {
      "name": "Rome",
      "description": "The eternal city...",
      "history": "Founded in 753 BC...",
      "backgroundImage": "rome-background.jpg",
      "coordinates": {
        "lat": 41.9028,
        "lng": 12.4964
      }
    },
    "hotels": [
      {
        "HotelName": "Grand Hotel Plaza",
        "Rating": 4.5,
        "PricePerNight": 250,
        "Address": "Via del Corso, 126"
      }
    ],
    "attractions": [
      {
        "PlaceName": "Colosseum",
        "Description": "Ancient amphitheater...",
        "Type": "Attraction"
      }
    ],
    "restaurants": [
      {
        "RestaurantName": "Il Vegetariano",
        "CuisineType": "Vegetarian Italian",
        "Rating": 4.3
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Day 1",
        "activities": [
          {
            "time": "09:00 AM",
            "activity": "Visit Colosseum",
            "description": "Explore the ancient amphitheater",
            "duration": "2-3 hours"
          }
        ],
        "meals": {
          "breakfast": "Hotel breakfast",
          "lunch": "Il Vegetariano",
          "dinner": "Trattoria del Centro"
        },
        "accommodation": "Hotel booking recommended",
        "transport": "Rental car or private taxi for romantic trips"
      }
    ],
    "preferences": {
      "budget": "medium",
      "companion": "couple",
      "activities": ["Beaches", "City Views"],
      "foodPreference": "vegetarian",
      "additionalPreferences": "Looking for romantic places"
    }
  }
}
```

### 4. Get City Details
Get detailed information about a specific city.

**GET** `/cities/:cityName`

**Parameters:**
- `cityName` (string): Name of the city

**Response:**
```json
{
  "success": true,
  "message": "City details fetched successfully",
  "data": {
    "CityID": 1,
    "CityName": "Rome",
    "Description": "The eternal city...",
    "History": "Founded in 753 BC...",
    "Latitude": 41.9028,
    "Longitude": 12.4964,
    "ImageURL": "rome-image.jpg"
  }
}
```

### 5. Get Hotels
Get hotels by city and budget.

**GET** `/hotels?cityName=Rome&budget=medium`

**Query Parameters:**
- `cityName` (string, required): Name of the city
- `budget` (string, optional): Budget level - "low", "medium", or "high"

**Response:**
```json
{
  "success": true,
  "message": "Hotels fetched successfully",
  "data": [
    {
      "HotelID": 1,
      "HotelName": "Grand Hotel Plaza",
      "Rating": 4.5,
      "PricePerNight": 250,
      "Address": "Via del Corso, 126",
      "ImageURL": "hotel-image.jpg"
    }
  ]
}
```

### 6. Get Attractions
Get attractions by city and activities.

**GET** `/attractions/:cityName?activities=Beaches,City Views`

**Parameters:**
- `cityName` (string): Name of the city

**Query Parameters:**
- `activities` (string, optional): Comma-separated list of activities

**Response:**
```json
{
  "success": true,
  "message": "Attractions fetched successfully",
  "data": [
    {
      "PlaceName": "Colosseum",
      "Description": "Ancient amphitheater...",
      "Type": "Attraction",
      "Rating": 4.8
    }
  ]
}
```

### 7. Get Restaurants
Get restaurants by city and food preference.

**GET** `/restaurants/:cityName?foodPreference=vegetarian`

**Parameters:**
- `cityName` (string): Name of the city

**Query Parameters:**
- `foodPreference` (string, optional): Food preference - "halal", "vegetarian", or "non-vegetarian"

**Response:**
```json
{
  "success": true,
  "message": "Restaurants fetched successfully",
  "data": [
    {
      "RestaurantID": 1,
      "RestaurantName": "Il Vegetariano",
      "CuisineType": "Vegetarian Italian",
      "Rating": 4.3,
      "Address": "Via dei Cappuccini, 12"
    }
  ]
}
```

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request (validation error) |
| 404 | Not Found |
| 500 | Internal Server Error |
| 503 | Service Unavailable (database error) |

## Rate Limiting
- 100 requests per 15 minutes per IP address
- Applies to all `/api/` routes

## CORS
- Configured to allow requests from specified origins
- Supports credentials and common HTTP methods

## Example Usage with Frontend

### JavaScript Fetch Example
```javascript
// Generate recommendation
const generateRecommendation = async (preferences) => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Recommendation:', result.data);
      return result.data;
    } else {
      console.error('Error:', result.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

// Usage
const preferences = {
  destination: "Rome, Italy",
  startDate: "2024-06-01",
  days: 5,
  budget: "medium",
  companion: "couple",
  activities: ["City Views", "Food Street"],
  foodPreference: "vegetarian",
  additionalPreferences: "Romantic places preferred"
};

generateRecommendation(preferences);
```

### jQuery Example
```javascript
$.ajax({
  url: 'http://localhost:3000/api/v1/recommend',
  type: 'POST',
  contentType: 'application/json',
  data: JSON.stringify(preferences),
  success: function(result) {
    if (result.success) {
      console.log('Recommendation:', result.data);
    }
  },
  error: function(xhr, status, error) {
    console.error('Error:', error);
  }
});
```

## Database Requirements
- Microsoft SQL Server (MSSQL)
- Tables: Cities, Hotels, Restaurants, Beaches, AttractionPlaces, ShoppingMalls
- Proper foreign key relationships between tables

## Environment Variables
Ensure these environment variables are set in your `.env` file:
- `DB_SERVER`: Database server address
- `DB_DATABASE`: Database name (TravelDB)
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_PORT`: Database port (usually 1433)
- `PORT`: API server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `JWT_SECRET`: Secret key for JWT tokens
- `CORS_ORIGIN`: Allowed origin for CORS