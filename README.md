# Travel Recommendation App

A full-stack travel recommendation web application built with Node.js, MongoDB, and React.

## Prerequisites

* Node.js 18+
* MongoDB running locally on `mongodb://localhost:27017`
* OpenWeatherMap API key (free tier works) for weather data
* (Optional) Google Maps Embed API key for destination map view

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env # then edit .env with your values
npm run seed          # populate sample destination data
npm run dev           # or: npm start
```

The API will run on `http://localhost:5000`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The React app will open at `http://localhost:5173`.

## Usage

1. Open the frontend URL.
2. Select a destination, dates, preferences, and submit the form.
3. View the generated itinerary, weather forecast, hotels, and estimated costs.

---

### Available API Endpoints

* `GET /api/destinations` – list all stored destinations.
* `POST /api/recommend` – generate a recommendation based on user input.

---

Feel free to extend the seed data, styles, and itinerary logic to suit your needs.