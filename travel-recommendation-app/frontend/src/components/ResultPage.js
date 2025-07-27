import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResultPage.css';

const ResultPage = () => {
  const navigate = useNavigate();
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    const savedRecommendation = localStorage.getItem('tripRecommendation');
    if (savedRecommendation) {
      setRecommendation(JSON.parse(savedRecommendation));
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!recommendation) {
    return <div className="loading">Loading...</div>;
  }

  const { destination, startDate, endDate, numberOfDays, weather, itinerary, hotels, costs } = recommendation;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGoogleMapsUrl = () => {
    const { lat, lng } = destination.coordinates;
    return `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${lat},${lng}&zoom=12`;
  };

  return (
    <div className="result-page">
      {/* Hero Section with Background Image */}
      <div 
        className="hero-section"
        style={{ backgroundImage: `url(${destination.imageUrl})` }}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>{destination.name}</h1>
            <p className="trip-dates">
              {formatDate(startDate)} - {formatDate(endDate)}
            </p>
            <p className="trip-duration">{numberOfDays} Days</p>
          </div>
        </div>
      </div>

      <div className="result-content">
        {/* Google Maps Section */}
        <section className="map-section">
          <h2>📍 Location</h2>
          <div className="map-container">
            <iframe
              title="Destination Map"
              width="100%"
              height="400"
              frameBorder="0"
              style={{ border: 0 }}
              src={getGoogleMapsUrl()}
              allowFullScreen
            />
          </div>
        </section>

        {/* Weather Forecast Section */}
        <section className="weather-section">
          <h2>🌤️ Weather Forecast</h2>
          <div className="weather-grid">
            {weather.map((day, index) => (
              <div key={index} className="weather-card">
                <div className="weather-date">{day.date}</div>
                <div className="weather-icon">
                  <img 
                    src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`} 
                    alt={day.description}
                  />
                </div>
                <div className="weather-temp">{day.temp}°C</div>
                <div className="weather-desc">{day.description}</div>
              </div>
            ))}
          </div>
        </section>

        {/* City Overview Section */}
        <section className="overview-section">
          <h2>🏛️ About {destination.name}</h2>
          <div className="overview-content">
            <p>{destination.description}</p>
            <div className="overview-details">
              <div className="detail-item">
                <span className="detail-label">Country:</span>
                <span className="detail-value">{destination.country}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Average Temperature:</span>
                <span className="detail-value">{destination.averageTemperature}°C</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Best Time to Visit:</span>
                <span className="detail-value">{destination.bestTimeToVisit}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Hotel Recommendations Section */}
        <section className="hotels-section">
          <h2>🏨 Hotel Recommendations</h2>
          <div className="hotels-grid">
            {hotels.map((hotel, index) => (
              <div key={index} className="hotel-card">
                <div className="hotel-header">
                  <h3>{hotel.name}</h3>
                  <div className="hotel-rating">
                    <span className="stars">{'★'.repeat(Math.floor(hotel.rating))}</span>
                    <span className="rating-text">{hotel.rating}/5</span>
                  </div>
                </div>
                <div className="hotel-price">${hotel.price}/night</div>
                <div className="hotel-amenities">
                  {hotel.amenities.map((amenity, idx) => (
                    <span key={idx} className="amenity-tag">{amenity}</span>
                  ))}
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
          <h2>📅 Day-by-Day Itinerary</h2>
          <div className="itinerary-timeline">
            {itinerary.map((day, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker">
                  <span className="day-number">{day.day}</span>
                </div>
                <div className="timeline-content">
                  <h3>Day {day.day}</h3>
                  <ul className="activities-list">
                    {day.activities.map((activity, idx) => (
                      <li key={idx}>{activity}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cost Summary Section */}
        <section className="costs-section">
          <h2>💰 Estimated Cost Summary</h2>
          <div className="costs-grid">
            <div className="cost-item">
              <span className="cost-label">Accommodation</span>
              <span className="cost-value">${costs.accommodation}</span>
            </div>
            <div className="cost-item">
              <span className="cost-label">Food</span>
              <span className="cost-value">${costs.food}</span>
            </div>
            <div className="cost-item">
              <span className="cost-label">Transport</span>
              <span className="cost-value">${costs.transport}</span>
            </div>
            <div className="cost-item total">
              <span className="cost-label">Total Estimated Cost</span>
              <span className="cost-value">${costs.total}</span>
            </div>
          </div>
        </section>

        {/* Back to Form Button */}
        <div className="back-button-container">
          <button 
            onClick={() => navigate('/')}
            className="back-btn"
          >
            ← Plan Another Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;