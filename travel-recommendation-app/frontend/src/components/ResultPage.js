import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResultPage.css';

const ResultPage = () => {
  const navigate = useNavigate();
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    const storedRecommendation = localStorage.getItem('tripRecommendation');
    if (storedRecommendation) {
      setRecommendation(JSON.parse(storedRecommendation));
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!recommendation) {
    return <div className="loading">Loading...</div>;
  }

  const { destination, weatherData, itinerary, hotels, costSummary } = recommendation;

  const calculateEndDate = (startDate, numberOfDays) => {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + numberOfDays - 1);
    return endDate.toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="result-page">
      {/* Hero Section with Background Image */}
      <div 
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${destination.imageUrl})`
        }}
      >
        <div className="hero-content">
          <h1>{destination.name}</h1>
          <p className="trip-dates">
            {new Date(recommendation.startDate).toLocaleDateString()} - {calculateEndDate(recommendation.startDate, recommendation.numberOfDays)}
          </p>
          <button onClick={() => navigate('/')} className="back-btn">
            ← Plan Another Trip
          </button>
        </div>
      </div>

      <div className="content-container">
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
              src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${destination.coordinates.lat},${destination.coordinates.lng}`}
              allowFullScreen
            />
          </div>
        </section>

        {/* Weather Forecast Section */}
        <section className="weather-section">
          <h2>🌤️ 3-Day Weather Forecast</h2>
          <div className="weather-grid">
            {weatherData.map((day, index) => (
              <div key={index} className="weather-card">
                <h3>{day.date}</h3>
                <div className="weather-icon">
                  <img 
                    src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`} 
                    alt={day.description}
                  />
                </div>
                <p className="temperature">{day.temp}°C</p>
                <p className="description">{day.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* City Overview Section */}
        <section className="overview-section">
          <h2>🏛️ About {destination.name}</h2>
          <div className="overview-content">
            <p>{destination.description}</p>
            <div className="destination-details">
              <div className="detail-item">
                <span className="label">Country:</span>
                <span className="value">{destination.country}</span>
              </div>
              <div className="detail-item">
                <span className="label">Average Temperature:</span>
                <span className="value">{destination.averageTemperature}°C</span>
              </div>
              <div className="detail-item">
                <span className="label">Best Time to Visit:</span>
                <span className="value">{destination.bestTimeToVisit}</span>
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
                <div className="hotel-price">
                  <span className="price">{formatCurrency(hotel.price)}</span>
                  <span className="per-night">per night</span>
                </div>
                <div className="hotel-amenities">
                  {hotel.amenities.map((amenity, idx) => (
                    <span key={idx} className="amenity">{amenity}</span>
                  ))}
                </div>
                <a 
                  href={hotel.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="book-btn"
                >
                  Book Now
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Itinerary Section */}
        <section className="itinerary-section">
          <h2>📅 Your {recommendation.numberOfDays}-Day Itinerary</h2>
          <div className="itinerary-container">
            {itinerary.map((day) => (
              <div key={day.day} className="day-card">
                <h3>Day {day.day}</h3>
                <div className="activities">
                  {day.activities.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-time">{activity.time}</div>
                      <div className="activity-content">
                        <h4>{activity.activity}</h4>
                        <p>{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cost Summary Section */}
        <section className="cost-section">
          <h2>💰 Estimated Cost Summary</h2>
          <div className="cost-breakdown">
            <div className="cost-item">
              <span className="cost-label">Accommodation ({recommendation.numberOfDays} nights):</span>
              <span className="cost-amount">{formatCurrency(costSummary.accommodation)}</span>
            </div>
            <div className="cost-item">
              <span className="cost-label">Food & Dining:</span>
              <span className="cost-amount">{formatCurrency(costSummary.food)}</span>
            </div>
            <div className="cost-item">
              <span className="cost-label">Transportation:</span>
              <span className="cost-amount">{formatCurrency(costSummary.transport)}</span>
            </div>
            <div className="cost-total">
              <span className="total-label">Total Estimated Cost:</span>
              <span className="total-amount">{formatCurrency(costSummary.total)}</span>
            </div>
          </div>
          <p className="cost-note">
            * Costs are estimates based on your budget preference ({recommendation.budget}) and travel style ({recommendation.companion}).
          </p>
        </section>
      </div>
    </div>
  );
};

export default ResultPage;