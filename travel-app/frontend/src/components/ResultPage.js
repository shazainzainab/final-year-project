import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResultPage.css';

const ResultPage = () => {
  const navigate = useNavigate();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedData = localStorage.getItem('tripRecommendation');
    if (storedData) {
      setTripData(JSON.parse(storedData));
    } else {
      // If no data found, redirect to form
      navigate('/');
    }
    setLoading(false);
  }, [navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGoogleMapsUrl = (lat, lng, destinationName) => {
    return `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(destinationName)}&center=${lat},${lng}&zoom=12`;
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/w/${iconCode}.png`;
  };

  if (loading) {
    return <div className="loading">Loading your trip recommendation...</div>;
  }

  if (!tripData) {
    return <div className="error">No trip data found. Please go back and submit the form.</div>;
  }

  const { destination, tripDetails, itinerary, estimatedCost, weatherForecast, hotels } = tripData;

  return (
    <div className="result-page">
      {/* Header Section with Background Image */}
      <div 
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${destination.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="hero-content">
          <h1 className="destination-title">{destination.name}, {destination.country}</h1>
          <div className="trip-dates">
            <p>{formatDate(tripDetails.startingDate)} - {formatDate(tripDetails.endDate)}</p>
            <p>{tripDetails.days} {tripDetails.days === 1 ? 'day' : 'days'} • {tripDetails.companion} • {tripDetails.budget} budget</p>
          </div>
        </div>
      </div>

      <div className="result-content">
        {/* Overview Section */}
        <section className="overview-section">
          <h2>Overview</h2>
          <p>{destination.description}</p>
        </section>

        {/* Weather Forecast Section */}
        <section className="weather-section">
          <h2>Weather Forecast</h2>
          <div className="weather-cards">
            {weatherForecast.slice(0, 3).map((weather, index) => (
              <div key={index} className="weather-card">
                <div className="weather-date">{formatDate(weather.date)}</div>
                <div className="weather-info">
                  {weather.icon && (
                    <img 
                      src={getWeatherIcon(weather.icon)} 
                      alt={weather.description}
                      className="weather-icon"
                    />
                  )}
                  <div className="weather-temp">{weather.temperature}°C</div>
                  <div className="weather-desc">{weather.description}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Maps Section */}
        <section className="maps-section">
          <h2>Location</h2>
          <div className="map-container">
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${destination.coordinates.lng}!3d${destination.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2s!4v1000000000000!5m2!1sen!2s`}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map of ${destination.name}`}
            />
          </div>
        </section>

        {/* Hotels Section */}
        <section className="hotels-section">
          <h2>Recommended Hotels</h2>
          <div className="hotels-grid">
            {hotels && hotels.map((hotel, index) => (
              <div key={index} className="hotel-card">
                <h3 className="hotel-name">{hotel.name}</h3>
                <div className="hotel-details">
                  <div className="hotel-price">${hotel.price}/night</div>
                  <div className="hotel-rating">★ {hotel.rating}</div>
                </div>
                <a 
                  href={hotel.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hotel-link"
                >
                  View Details
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Itinerary Section */}
        <section className="itinerary-section">
          <h2>Day-wise Itinerary</h2>
          <div className="itinerary-list">
            {itinerary.map((day, index) => (
              <div key={index} className="itinerary-day">
                <div className="day-number">Day {day.day}</div>
                <div className="day-content">
                  <h3>Activities</h3>
                  <ul className="activities-list">
                    {day.activities.map((activity, actIndex) => (
                      <li key={actIndex}>{activity}</li>
                    ))}
                  </ul>
                  <p className="day-description">{day.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cost Summary Section */}
        <section className="cost-section">
          <h2>Estimated Cost Summary</h2>
          <div className="cost-breakdown">
            <div className="cost-item">
              <span>Accommodation:</span>
              <span>${estimatedCost.accommodation}</span>
            </div>
            <div className="cost-item">
              <span>Food & Dining:</span>
              <span>${estimatedCost.food}</span>
            </div>
            <div className="cost-item">
              <span>Transportation:</span>
              <span>${estimatedCost.transport}</span>
            </div>
            <div className="cost-item total">
              <span>Total Estimated Cost:</span>
              <span>${estimatedCost.total}</span>
            </div>
          </div>
          <p className="cost-note">
            * This is an estimated cost based on your selected budget level and trip companions. 
            Actual costs may vary depending on your specific choices and travel dates.
          </p>
        </section>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className="btn-secondary"
            onClick={() => navigate('/')}
          >
            Plan Another Trip
          </button>
          <button 
            className="btn-primary"
            onClick={() => window.print()}
          >
            Print Itinerary
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;