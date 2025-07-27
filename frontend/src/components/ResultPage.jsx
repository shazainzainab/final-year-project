import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import WeatherSection from './WeatherSection.jsx';

const ResultPage = () => {
  const { state } = useLocation();
  if (!state) return (<div>No data. <Link to="/">Go back</Link></div>);

  const { destination, startDate, endDate, weather, itinerary, cost } = state;

  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_EMBED_KEY&q=${encodeURIComponent(destination.name)}`;

  return (
    <div>
      <header style={{
        backgroundImage: `url(${destination.image})`,
        backgroundSize: 'cover',
        padding: '100px',
        color: 'white',
        textShadow: '0 0 10px rgba(0,0,0,0.7)'
      }}>
        <h1>{destination.name}</h1>
        <p>{new Date(startDate).toLocaleDateString()} – {new Date(endDate).toLocaleDateString()}</p>
      </header>

      <section>
        <iframe
          title="map"
          width="100%"
          height="300"
          frameBorder="0"
          referrerPolicy="no-referrer-when-downgrade"
          src={mapSrc}
          allowFullScreen>
        </iframe>
      </section>

      {weather && <WeatherSection weather={weather} />}

      <section>
        <h2>Overview</h2>
        <p>{destination.description}</p>
      </section>

      <section>
        <h2>Hotels</h2>
        <ul>
          {destination.hotels.map(h => (
            <li key={h.name}><a href={h.link} target="_blank" rel="noreferrer">{h.name}</a> – ${h.price} per night</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Itinerary</h2>
        {itinerary.map(day => (
          <div key={day.day}>
            <h3>Day {day.day}</h3>
            <ul>
              {day.activities.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>
        ))}
      </section>

      <section>
        <h2>Estimated Cost</h2>
        <p>Accommodation: ${cost.accommodation.toFixed(2)}</p>
        <p>Food: ${cost.food.toFixed(2)}</p>
        <p>Transport: ${cost.transport.toFixed(2)}</p>
        <h3>Total: ${cost.total.toFixed(2)}</h3>
      </section>

      <Link to="/">Plan another trip</Link>
    </div>
  );
};

export default ResultPage;